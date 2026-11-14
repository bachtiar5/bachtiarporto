import {readdir,readFile,writeFile,mkdir,stat} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import vm from 'node:vm';
import {createHash} from 'node:crypto';
import sharp from 'sharp';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const context={window:{}};
vm.runInNewContext(await readFile(path.join(root,'portfolio-content.js'),'utf8'),context);
const data=context.window.portfolioData;
const folders={'first-collab':['FristCollab'],build:['Build','Gallery'],'ui-ux':['UiUx'],'npc-manager':['LuaUCode']};
vm.runInNewContext(await readFile(path.join(root,'ongoing-projects.js'),'utf8'),context);
const photo=/\.(?:png|jpe?g|webp|avif|gif)$/i;
async function photos(directory) {
  const absolute=path.join(root,directory);
  let entries;
  try {entries=await readdir(absolute,{withFileTypes:true});}
  catch(error){if(error.code==='ENOENT')return [];throw error;}
  const found=[];
  for(const entry of entries) {
    const relative=`${directory}/${entry.name}`;
    if(entry.name.startsWith('.'))continue;
    if(entry.isDirectory())found.push(...await photos(relative));
    else if(entry.isFile()&&photo.test(entry.name))found.push(relative);
  }
  return found.sort((a,b)=>a.localeCompare(b,'en',{numeric:true}));
}
const buildFolder='image/Archives/Build/';
const originalBuild=data.projects.find(project=>project.id==='build').images.filter(file=>file.startsWith(buildFolder));
for(const project of data.projects) {
  const files=(await Promise.all(folders[project.id].map(folder=>photos(`image/Archives/${folder}`)))).flat();
  const available=new Set(files);
  const existing=project.images.filter(file=>available.has(file));
  project.images=[...new Set([...existing,...files])];
}
data.projects=data.projects.filter(project=>project.images.length);
const originals=new Set(data.moments.flatMap(moment=>moment.images));
const momentFiles=await photos('image/youtuber');
data.moments=data.moments.filter(moment=>moment.images.every(file=>momentFiles.includes(file)));
for(const file of momentFiles.filter(file=>!originals.has(file))) {
  const title=path.basename(file,path.extname(file)).replace(/[_-]+/g,' ');
  data.moments.push({id:`moment-auto-${Buffer.from(file).toString('hex')}`,title:{id:title,en:title},description:{id:'Momen bermain di map buatanku.',en:'A moment playing one of my maps.'},images:[file]});
}
const build=data.projects.find(project=>project.id==='build');
const curated=[0,11,15,6,4].map(index=>originalBuild[index]);
const custom=await photos('image/Showcase');
const liveBuild=new Set(build?.images||[]);
data.heroImages=custom.length?custom:[...new Set([...curated.filter(file=>liveBuild.has(file)),...(build?.images||[]).filter(file=>file.startsWith(buildFolder)&&!originalBuild.includes(file))])];
if(!data.heroImages.length)data.heroImages=data.projects.flatMap(project=>project.images).slice(0,5);
if(!data.projects.length||!data.heroImages.length)throw new Error('No gallery photos available. Keep at least one photo in an archive folder.');
const assetUrl=file=>file.split('/').map(encodeURIComponent).join('/');
const originalsOnly=process.argv.includes('--originals');
const progressSources=(context.window.ongoingProjects||[]).flatMap(project=>project.images||[]);
const files=new Set([
  ...data.projects.flatMap(project=>project.images),
  ...data.moments.flatMap(moment=>moment.images),
  ...data.heroImages,
  ...progressSources.map(url=>decodeURIComponent(url)),
]);
const optimized=new Map();
let originalBytes=0, servedBytes=0;
if(!originalsOnly) {
  await mkdir(path.join(root,'image/optimized'),{recursive:true});
  for(const file of files) {
    const input=await readFile(path.join(root,file));
    if(/\.gif$/i.test(file))continue;
    let output;
    try {
      const photo=sharp(input);
      const {pages}=await photo.metadata();
      if(pages>1)continue;
      output=await photo.rotate().resize({width:1600,height:1200,fit:'inside',withoutEnlargement:true}).webp({quality:84}).toBuffer();
    } catch(error) {
      console.warn('Keeping original photo '+file+': '+error.message);
      continue;
    }
    if(output.length>=input.length)continue;
    const fingerprint=createHash('sha256').update(output).digest('hex').slice(0,24);
    const url='image/optimized/'+fingerprint+'.webp';
    await writeFile(path.join(root,url),output);
    optimized.set(file,url);
    originalBytes+=input.length;
    servedBytes+=output.length;
  }
}
const serveImage=file=>optimized.get(file)||assetUrl(file);
for(const collection of [...data.projects,...data.moments])collection.images=collection.images.map(serveImage);
data.heroImages=data.heroImages.map(serveImage);
data.progressImages=Object.fromEntries(progressSources.map(url=>[url,serveImage(decodeURIComponent(url))]));
const hash=createHash('sha256').update(JSON.stringify(data));
for(const file of files) {
  const metadata=await stat(path.join(root,file));
  hash.update(file+':'+metadata.size);
}
const version=hash.digest('hex').slice(0,16);
console.log('Optimized '+optimized.size+' photos: '+originalBytes+' original bytes, '+servedBytes+' served bytes.');
await writeFile(path.join(root,'portfolio-data.js'),`// Generated by scripts/sync-gallery.mjs. Edit portfolio-content.js for labels.\nwindow.portfolioData = ${JSON.stringify(data,null,2)};\n`);
const indexPath=path.join(root,'index.html');
const attribute=value=>value.replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const html=(await readFile(indexPath,'utf8'))
  .replace(/portfolio-data\.js\?v=[^"\s]+/,`portfolio-data.js?v=gallery-${version}`)
  .replace(/(<img class="hero-world" src=")[^"]+/,`$1${attribute(data.heroImages[0])}`)
  .replace(/(<span class="preview-position">)[^<]+/,`$101 / ${String(data.heroImages.length).padStart(2,'0')}`);
await writeFile(indexPath,html);
console.log(`Gallery ready: ${data.projects.length} collections, ${data.projects.reduce((sum,project)=>sum+project.images.length,0)} photos, ${data.moments.length} creator moments, ${data.heroImages.length} hero previews.`);
