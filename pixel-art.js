/* Visual design credit: Bachtair Adit. Rights and exclusions: COPYRIGHT.md.
   Design origin: design-origin-bachtair-adit-bachtiarporto-2026 */
(() => {
  'use strict';
  const shapes={
    heart:['001110000011100','011111000111110','111111101111111','111111111111111','111111111111111','011111111111110','001111111111100','000111111111000','000011111110000','000001111100000','000000111000000','000000010000000'],
    hammer:['001111111111000','011111111111100','011111111111110','001111111111110','000000111001110','000000111000110','000000111000000','000000111000000','000000111000000','000000111000000','000000111000000','000000111000000','000001111100000','000001111100000'],
    journey:['000000000001000','000000000001111','000000000001111','000000000001000','000000000001000','000000000111110','000000000111110','000000111111110','000000111111110','000111111111110','000111111111110','111111111111110','111111111111110','111111111111110']
  };
  const words={
    id:{heart:['MADE OF LITTLE THINGS','Banyak hal kecil, satu rasa terima kasih.','Klik atau sentuh hatinya','Mainkan hati piksel'],hammer:['ONE PIXEL AT A TIME','Dari ide kecil, jadi sesuatu yang bisa dimainkan.','Klik atau sentuh palunya','Mainkan palu piksel'],journey:['ONE STEP AT A TIME','Sedikit demi sedikit, terus melangkah.','Klik atau sentuh tangganya','Mainkan tangga perjalanan piksel'],replay:'Susun lagi',hint:'Pikselnya akan menyebar lalu tersusun kembali satu per satu.'},
    en:{heart:['MADE OF LITTLE THINGS','Little things, one big thank you.','Click or tap the heart','Play with the pixel heart'],hammer:['ONE PIXEL AT A TIME','Small ideas become something you can play.','Click or tap the hammer','Play with the pixel hammer'],journey:['ONE STEP AT A TIME','A little at a time, keep moving forward.','Click or tap the steps','Play with the pixel journey steps'],replay:'Build again',hint:'The pixels scatter and come back one by one.'}
  };
  const motion=matchMedia('(prefers-reduced-motion: reduce)'),states=new Map();
  function cancel(s) {
    cancelAnimationFrame(s.frame);s.frame=0;s.generation++;
    s.animations.forEach(animation=>animation.cancel());s.animations=[];s.busy=false;
    s.stage.classList.remove('is-breaking');
    s.play.removeAttribute('aria-busy');
    s.pixels.forEach(({element})=>element.style.removeProperty('transform'));
  }
  function assemble(s,scatter=false,point=null) {
    if(s.busy)return;
    cancel(s);const generation=s.generation;
    s.stage.classList.remove('heart-thanked');
    if(motion.matches){s.stage.classList.add('heart-thanked');return;}
    if(s.background)s.stage.classList.add('is-breaking');
    s.busy=true;s.play.setAttribute('aria-busy','true');
    const rect=s.grid.getBoundingClientRect(),width=rect.width||280,unit=width/s.cols;
    const clamp=value=>Math.max(-width*.28,Math.min(width*.28,value));
    const originX=clamp(point&&rect.width?point.clientX-rect.left-width/2:0)+(Math.random()-.5)*width*.1;
    const originY=clamp(point&&rect.width?point.clientY-rect.top-unit*s.rows/2:0)+(Math.random()-.5)*width*.1;
    const swirl=(Math.random()-.5)*.3,sweep=Math.random()*Math.PI*2;
    const sweepX=Math.cos(sweep),sweepY=Math.sin(sweep),power=.9+Math.random()*.3;
    const ordered=[...s.pixels].sort(scatter?(a,b)=>(a.x-b.x)*sweepX+(a.y-b.y)*sweepY:(a,b)=>b.y-a.y||a.x-b.x);
    ordered.forEach(({element,x,y},index)=>{
      const homeX=(x+.5-s.cols/2)*unit,homeY=(y+.5-s.rows/2)*unit;
      const angle=scatter?Math.atan2(homeY-originY,homeX-originX)+swirl+(Math.random()-.5)*.5:Math.random()*Math.PI*2;
      const radius=width*(scatter?(.32+Math.random()*.45)*power:.22+Math.random()*.34);
      // Add an outward displacement to each pixel's own position rather than
      // pulling it toward a shared ring inside the artwork.
      const dx=Math.cos(angle)*radius-(scatter?0:homeX);
      const dy=Math.sin(angle)*radius-(scatter?0:homeY);
      const loose=`translate(${dx}px,${dy}px) rotate(${Math.random()*280-140}deg) scale(.86)`;
      const rank=index/Math.max(1,ordered.length-1);
      let frames,options;
      if(scatter) {
        // Separate the break, pause, and staggered return so each landing is readable.
        const scatterEnd=500+Math.random()*160,returnStart=1050+rank*2100,total=returnStart+720;
        frames=[
          {transform:'translate(0,0) rotate(0) scale(1)',opacity:1,offset:0,easing:'cubic-bezier(.16,1,.3,1)'},
          {transform:loose,opacity:.6,offset:scatterEnd/total,easing:'linear'},
          {transform:loose,opacity:.6,offset:returnStart/total,easing:'cubic-bezier(.2,.8,.2,1)'},
          {transform:'translate(0,0) rotate(0) scale(1.06)',opacity:1,offset:(total-110)/total,easing:'ease-out'},
          {transform:'translate(0,0) rotate(0) scale(1)',opacity:1,offset:1}
        ];
        options={duration:total,easing:'linear',fill:'backwards'};
      } else {
        frames=[{transform:loose,opacity:0},{transform:'translate(0,0) rotate(0) scale(1)',opacity:1}];
        options={duration:800,delay:rank*1700,easing:'cubic-bezier(.16,1,.3,1)',fill:'backwards'};
      }
      s.animations.push(element.animate(frames,options));
    });
    Promise.allSettled(s.animations.map(animation=>animation.finished)).then(()=>{
      if(states.get(s.stage)!==s||s.generation!==generation)return;
      s.busy=false;s.animations=[];s.play.removeAttribute('aria-busy');s.stage.classList.remove('is-breaking');
    });
  }
  function createSlots() {
    document.querySelectorAll('[data-pixel-slot]').forEach(slot=>{
      if(slot.firstElementChild)return;
      slot.innerHTML=`<aside class="pixel-heart" data-pixel-art="${slot.dataset.pixelSlot}"><div class="heart-stage-label"><span aria-hidden="true">✦</span><span></span><span aria-hidden="true">✦</span></div><button class="pixel-heart-play" type="button"><span class="heart-orbit" aria-hidden="true"></span><span class="pixel-heart-grid" aria-hidden="true"></span><span class="heart-spark heart-spark-one" aria-hidden="true">✦</span><span class="heart-spark heart-spark-two" aria-hidden="true">+</span><span class="heart-spark heart-spark-three" aria-hidden="true">+</span></button><p class="heart-caption"></p><div class="heart-tools"><span></span><button type="button" data-heart-replay></button></div></aside>`;
    });
  }
  function setup(stage) {
    const type=stage.dataset.pixelArt||'heart',shape=shapes[type];
    const s={stage,type,background:stage.hasAttribute('data-pixel-background'),play:stage.querySelector('.pixel-heart-play'),grid:stage.querySelector('.pixel-heart-grid'),pixels:[],animations:[],frame:0,generation:0,busy:false,active:false,cols:shape[0].length,rows:shape.length};
    states.set(stage,s);s.grid.style.setProperty('--pixel-cols',s.cols);s.grid.style.setProperty('--pixel-rows',s.rows);
    shape.forEach((row,y)=>[...row].forEach((cell,x)=>{
      if(cell!=='1')return;
      const element=document.createElement('span');element.className='heart-pixel';
      element.style.setProperty('--px',x);element.style.setProperty('--py',y);element.style.setProperty('--shade',(x+y)%4);
      if(x<6&&y<4)element.classList.add('heart-pixel-highlight');
      s.grid.append(element);s.pixels.push({element,x,y});
    }));
    s.play.addEventListener('click',event=>assemble(s,true,event.detail>0?event:null));
    stage.querySelector('[data-heart-replay]')?.addEventListener('click',()=>{cancel(s);assemble(s);});
    s.play.addEventListener('pointermove',event=>{
      if(s.background||s.busy||motion.matches||event.pointerType==='touch')return;
      cancelAnimationFrame(s.frame);
      s.frame=requestAnimationFrame(()=>{
        s.frame=0;if(s.busy||!s.active)return;
        const rect=s.grid.getBoundingClientRect(),unit=rect.width/s.cols;
        s.pixels.forEach(({element,x,y})=>{
          const dx=(x+.5)*unit-(event.clientX-rect.left),dy=(y+.5)*unit-(event.clientY-rect.top),d=Math.hypot(dx,dy);
          const force=Math.max(0,1-d/(unit*3||1))*12;
          element.style.transform=`translate(${dx/(d||1)*force}px,${dy/(d||1)*force}px)`;
        });
      });
    });
    s.play.addEventListener('pointerleave',()=>{
      cancelAnimationFrame(s.frame);s.frame=0;
      s.pixels.forEach(({element})=>element.style.removeProperty('transform'));
    });
    return s;
  }
  function mount() {
    createSlots();
    for(const [stage,s] of states)if(!stage.isConnected){cancel(s);states.delete(stage);}
    const en=document.documentElement.lang==='en',t=words[en?'en':'id'];
    document.querySelectorAll('[data-pixel-heart],[data-pixel-art]').forEach(stage=>{
      const s=states.get(stage)||setup(stage),copy=t[s.type];
      if(!s.background) {
        stage.querySelector('.heart-stage-label>span:nth-child(2)').textContent=copy[0];
        stage.querySelector('.heart-caption').textContent=copy[1];
        stage.querySelector('.heart-tools>span').textContent=copy[2];
        stage.querySelector('[data-heart-replay]').innerHTML=`${t.replay} <span aria-hidden="true">↻</span>`;
      }
      s.play.setAttribute('aria-label',copy[3]+(s.background?(en?' in the background':' di latar belakang'):'')+'. '+t.hint);
      const page=stage.closest('.site-page');
      const shown=s.background?stage.dataset.pixelPage===document.body.dataset.page&&!(innerWidth<=640&&Number(stage.dataset.floatIndex)>=4):page&&!page.hidden;
      const active=shown&&!document.hidden&&document.documentElement.dataset.welcome!=='pending';
      if(active&&!s.active&&!s.background)assemble(s);
      if(!active)cancel(s);
      s.active=Boolean(active);
    });
  }
  document.addEventListener('portfolio:beforecontent',event=>{
    for(const [stage,s] of states)if(event.detail?.root?.contains(stage)){cancel(s);states.delete(stage);}
  });
  document.addEventListener('portfolio:content',mount);
  document.addEventListener('portfolio:languagechange',mount);
  document.addEventListener('portfolio:welcomecomplete',mount);
  document.addEventListener('visibilitychange',mount);
  motion.addEventListener('change',()=>{states.forEach(s=>{cancel(s);s.active=false;});mount();});
  window.portfolioPixelArt={refresh:mount,play:(stage,point=null)=>{const s=states.get(stage);if(s?.active)assemble(s,true,point);}};
  mount();
})();
