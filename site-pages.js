(() => {
  'use strict';
  const $=selector=>document.querySelector(selector);
  const $$=selector=>[...document.querySelectorAll(selector)];
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const esc=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const words={
    id:{backHome:'Balik ke beranda',projectsKicker:'Proyek yang sudah rilis',projectsTitle:'Game yang pernah<br>kugarap.',projectsIntro:'Ada proyek pribadi, proyek klien, dan karya studio. Beberapa juga sudah terjual. Ini game-game yang bisa kamu lihat langsung di Roblox.',filterAll:'Semua',sold:'Terjual',personal:'Pribadi',client:'Klien',studio:'Studio',browseArchive:'Lihat juga galeri prosesnya',browseCareer:'Lihat perjalananku',backAbout:'Balik ke tentang aku',careerKicker:'Dari tahun ke tahun',careerTitle:'Perjalananku<br>sejauh ini.',careerIntro:'Mulainya dari penasaran gimana game dibuat. Belajar pelan-pelan, sempat berhenti, lalu mulai lagi. Klik tahunnya buat ikuti ceritanya.',previousChapter:'Tahun sebelumnya',nextChapter:'Tahun berikutnya',nextStory:'Ceritanya masih lanjut. Sekarang, lihat apa yang sudah kubikin.',seeProjects:'Lihat proyekku',likes:'Like',active:'Pemain aktif',favorites:'Favorit',visits:'Kunjungan',created:'Dibuat',updated:'Update terakhir',openGame:'Lihat di Roblox',games:'game',snapshot:'Data Roblox diambil',snapshotNote:'Pemain aktif mengikuti waktu pengambilan data. Peak CCU adalah rekor pemain bersamaan, berdasarkan catatan Bachtiar.',home:'Beranda',projects:'Proyek',career:'Karier',yearLabel:'Pilih tahun perjalanan',filterLabel:'Filter status proyek',soldNote:'Proyek ini sudah terjual.',chapter:'Bagian',year:'Tahun',years:'Tahun pengalaman',published:'Proyek rilis',clients:'Klien pernah dibantu'},
    en:{backHome:'Back to home',projectsKicker:'Published projects',projectsTitle:'Games I’ve<br>worked on.',projectsIntro:'Personal games, client projects, and studio work. Some have been sold. Explore these games directly on Roblox.',filterAll:'All',sold:'Sold',personal:'Personal',client:'Client',studio:'Studio',browseArchive:'Explore the process gallery',browseCareer:'Follow my journey',backAbout:'Back to about me',careerKicker:'Year by year',careerTitle:'My journey<br>so far.',careerIntro:'It started with wondering how games are made. Learning, taking a break, and starting again. Pick a year to follow the story.',previousChapter:'Previous chapter',nextChapter:'Next chapter',nextStory:'The story is still going. Take a look at what I’ve made so far.',seeProjects:'Explore my projects',likes:'Likes',active:'Active players',favorites:'Favorites',visits:'Visits',created:'Created',updated:'Last updated',openGame:'View on Roblox',games:'games',snapshot:'Roblox data captured',snapshotNote:'Active players reflects the capture time. Peak CCU is the highest concurrent player count, provided by Bachtiar.',home:'Home',projects:'Projects',career:'Career',yearLabel:'Choose a year',filterLabel:'Filter project status',soldNote:'This project has been sold.',chapter:'Chapter',year:'Year',years:'Years of experience',published:'Projects published',clients:'Clients served'}
  };
  const chapters=[
    {year:'2021',icon:'image/icons/robloxstudio.svg',id:{title:'Kenalan sama Roblox Studio',intro:'Dari suka main, jadi penasaran cara bikinnya.',body:'Aku mulai kenal Roblox Studio pada 2021. Dari sini aku mulai coba-coba bikin tempat sendiri dan belajar cara sebuah game dirancang.',note:'Titik awal belajar Roblox Studio.'},en:{title:'Discovering Roblox Studio',intro:'Playing games turned into curiosity about making them.',body:'I discovered Roblox Studio in 2021. I started experimenting with building places and learning how a game is put together.',note:'The beginning of learning Roblox Studio.'}},
    {year:'2023',icon:'image/aihstudio.png',id:{title:'Mulai AIH Studio',intro:'Punya tempat buat ngembangin ide sendiri.',body:'AIH Studio berdiri pada 2023. Studio ini jadi bagian dari perjalananku bikin karya di Roblox dan tempat untuk membawa ide-ide berikutnya.',note:'AIH Studio · Est. 2023'},en:{title:'Starting AIH Studio',intro:'A place to develop my own ideas.',body:'AIH Studio was established in 2023. The studio became part of my Roblox journey and a place to develop new ideas.',note:'AIH Studio · Est. 2023'},url:'https://www.roblox.com/share/g/35569543'},
    {year:'2024',icon:'image/icons/luau.svg',id:{title:'Balik aktif lagi',intro:'Sempat berhenti, lalu mulai lagi di akhir tahun.',body:'Aku kembali aktif di akhir 2024. Fokusku makin ke map dan environment, sambil terus ngulik scripting, lighting, optimasi, dan UI/UX.',note:'Belajar lagi, coba lagi, bikin lagi.'},en:{title:'Returning to building',intro:'After a break, I returned in late 2024.',body:'I became active again in late 2024, focusing more on maps and environments while continuing to learn scripting, lighting, optimization, and UI/UX.',note:'Learning, experimenting, and building again.'}},
    {year:'2026',icon:'image/brand-mark.svg?v=20261102-pages',id:{title:'Masih terus ngulik',intro:'Proyek sendiri, proyek klien, dan karya studio.',body:'Sekarang aku terus bikin map dan sistem di Roblox, ngerjain proyek sendiri, dan kerja bareng orang lain. Sudah 2+ tahun pengalaman, 7 proyek rilis, dan 60+ klien yang pernah kubantu.',note:'Perjalanannya masih lanjut.'},en:{title:'Still learning and building',intro:'Personal work, client projects, and studio games.',body:'I’m continuing to build maps and systems, work on my own projects, and collaborate with others. Over 2 years of experience, 7 published projects, and more than 60 clients served.',note:'The journey is still going.'},projects:true}
  ];
  let language=document.documentElement.lang==='en'?'en':'id';
  let filter='all',chapter=0,page='home',navigationVersion=0;
  const texts=()=>words[language];
  const emitContent=()=>document.dispatchEvent(new CustomEvent('portfolio:content'));
  const cleanup=root=>document.dispatchEvent(new CustomEvent('portfolio:beforecontent',{detail:{root}}));
  const motion=(element,frames,options)=>reduced.matches?{finished:Promise.resolve()}:element.animate(frames,options);
  const date=value=>new Intl.DateTimeFormat(language==='id'?'id-ID':'en-US',{day:'numeric',month:'short',year:'numeric',timeZone:'Asia/Bangkok'}).format(new Date(value));

  function renderGames() {
    const root=$('#released-grid');cleanup(root);
    const t=texts(),snapshot=window.publishedProjects;
    root.innerHTML=snapshot.projects.map(game=>{
      const status=t[game.status];
      const peak=new Intl.NumberFormat(language==='id'?'id-ID':'en-US',{maximumFractionDigits:1}).format(game.peakCcu>=1000?game.peakCcu/1000:game.peakCcu)+(game.peakCcu>=1000?'k':'')+(game.peakCcuLowerBound?'+':'');
      const metrics=[['likes',game.likes],['active',game.active],['favorites',game.favorites],['visits',game.visits]];
      return `<article class="released-card" data-game-status="${game.status}"><a class="released-image" href="${esc(game.url)}" target="_blank" rel="noopener noreferrer" aria-label="${esc(t.openGame+': '+game.name)}"><img src="${esc(game.thumbnail)}" width="768" height="432" loading="lazy" alt="${esc(game.name)}"><span aria-hidden="true">↗</span></a><div class="released-card-heading"><span class="ownership ownership-${game.status}"><i aria-hidden="true"></i>${esc(status)}</span><h2><a href="${esc(game.url)}" target="_blank" rel="noopener noreferrer">${esc(game.name)}</a></h2></div><div class="game-peak"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="M3 17 9 11l4 3 8-10M15 4h6v6"/></svg><span>Peak CCU</span><strong>${esc(peak)}</strong></div><dl class="game-metrics">${metrics.map(([key,value])=>`<div><dt>${esc(t[key])}</dt><dd><span data-count="${value}" data-count-locale="${language==='id'?'id-ID':'en-US'}">${new Intl.NumberFormat(language==='id'?'id-ID':'en-US').format(value)}</span></dd></div>`).join('')}</dl><dl class="game-dates"><div><dt>${esc(t.created)}</dt><dd><time datetime="${esc(game.created)}">${esc(date(game.created))}</time></dd></div><div><dt>${esc(t.updated)}</dt><dd><time datetime="${esc(game.updated)}">${esc(date(game.updated))}</time></dd></div></dl><a class="text-link released-link" href="${esc(game.url)}" target="_blank" rel="noopener noreferrer"><span>${esc(t.openGame)}</span><span aria-hidden="true">↗</span></a></article>`;
    }).join('');
    const stamp=new Intl.DateTimeFormat(language==='id'?'id-ID':'en-US',{day:'numeric',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit',timeZone:'Asia/Bangkok'}).format(new Date(snapshot.capturedAt));
    $('#games-data-time').textContent=`${t.snapshot} ${stamp} (UTC+7). ${t.snapshotNote}`;
    applyGameFilter(false);emitContent();
  }
  function applyGameFilter(withMotion=true) {
    let count=0;
    $$('.released-card').forEach(card=>{
      card.getAnimations().forEach(animation=>animation.cancel());
      card.hidden=filter!=='all'&&card.dataset.gameStatus!==filter;
      if(!card.hidden){if(withMotion)motion(card,[{opacity:0,transform:'translateY(12px)'},{opacity:1,transform:'translateY(0)'}],{duration:350,delay:count*45,easing:'cubic-bezier(.16,1,.3,1)'});count++;}
    });
    $$('[data-release-filter]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.releaseFilter===filter)));
    $('#released-count').textContent=`${count} ${language==='en'&&count===1?'game':texts().games}`;
  }
  $$('[data-release-filter]').forEach(button=>button.addEventListener('click',()=>{filter=button.dataset.releaseFilter;applyGameFilter();}));

  function renderJourney(withMotion=false) {
    const t=texts();
    $('#journey-flow').style.setProperty('--journey-step',String(chapter/(chapters.length-1)));
    $('#journey-flow').innerHTML=chapters.map((item,index)=>`<button type="button" class="journey-node${index===chapter?' is-current':''}" id="journey-tab-${index}" role="tab" aria-selected="${index===chapter}" aria-controls="journey-detail" tabindex="${index===chapter?0:-1}" data-chapter="${index}"><span class="journey-marker" aria-hidden="true">${String(index+1).padStart(2,'0')}</span><span class="journey-node-copy"><span class="journey-year">${item.year}</span><span class="journey-node-title">${esc(item[language].title)}</span></span></button>`).join('');
    const item=chapters[chapter],copy=item[language],detail=$('#journey-detail');cleanup(detail);
    detail.setAttribute('aria-labelledby',`journey-tab-${chapter}`);
    detail.innerHTML=`<div class="journey-year-art"><span>${item.year}</span><img src="${esc(item.icon)}" width="90" height="90" alt=""></div><div class="journey-story"><p class="eyebrow">${esc(t.chapter)} ${String(chapter+1).padStart(2,'0')} / 04</p><h2>${esc(copy.intro)}</h2><p>${esc(copy.body)}</p><p class="journey-note">${esc(copy.note)}</p>${item.url?`<a class="text-link" href="${item.url}" target="_blank" rel="noopener noreferrer"><span>AIH Studio</span><span aria-hidden="true">↗</span></a>`:''}${item.projects?`<a class="text-link" href="#/projects"><span>${esc(t.seeProjects)}</span><span aria-hidden="true">↗</span></a>`:''}</div>`;
    $('#journey-prev').disabled=chapter===0;$('#journey-next').disabled=chapter===chapters.length-1;
    $('#journey-position').textContent=`${chapter+1} / ${chapters.length}`;
    if(withMotion)motion(detail,[{opacity:0,transform:'translateY(12px)'},{opacity:1,transform:'translateY(0)'}],{duration:400,easing:'cubic-bezier(.16,1,.3,1)'});
    emitContent();
  }
  function selectChapter(index,focus=false,showStory=false) {
    const revealStory=()=>{if(showStory&&matchMedia('(max-width:640px)').matches)$('#journey-detail').scrollIntoView({block:'start',behavior:reduced.matches?'instant':'smooth'});};
    const next=Math.max(0,Math.min(chapters.length-1,index));if(chapter===next){revealStory();return;}
    chapter=next;renderJourney(true);if(focus)$(`#journey-tab-${chapter}`).focus({preventScroll:true});
    revealStory();
  }
  $('#journey-flow').addEventListener('click',event=>{const button=event.target.closest('[data-chapter]');if(button)selectChapter(Number(button.dataset.chapter),true,true);});
  $('#journey-flow').addEventListener('keydown',event=>{
    if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home','End'].includes(event.key))return;
    event.preventDefault();const next=event.key==='Home'?0:event.key==='End'?chapters.length-1:chapter+(['ArrowRight','ArrowDown'].includes(event.key)?1:-1);selectChapter(next,true);
  });
  $('#journey-prev').addEventListener('click',()=>selectChapter(chapter-1));
  $('#journey-next').addEventListener('click',()=>selectChapter(chapter+1));

  function translate() {
    language=document.documentElement.lang==='en'?'en':'id';
    $$('[data-page-text]').forEach(element=>{element.innerHTML=texts()[element.dataset.pageText];});
    $('.release-filters').setAttribute('aria-label',texts().filterLabel);
    $('#journey-flow').setAttribute('aria-label',texts().yearLabel);
    renderGames();renderJourney();
    if(page!=='home')document.title=`${texts()[page]} — Bachtiar Aditya`;
  }
  const pageForHash=hash=>hash==='#/projects'?'projects':hash==='#/career'?'career':'home';
  function paintPage(hash,focus=true) {
    $('dialog[open]')?.close();
    page=pageForHash(hash);document.body.dataset.page=page;
    document.documentElement.dataset.pagesReady='true';
    ['home','projects','career'].forEach(name=>{$('#'+name+'-page').hidden=name!==page;});
    document.title=page==='home'?'Bachtiar Aditya — Roblox Developer':`${texts()[page]} — Bachtiar Aditya`;
    $$('.nav-link').forEach(link=>{
      const active=page==='home'?link.getAttribute('href')==='#home':link.getAttribute('href')===`#/${page}`;
      link.classList.toggle('is-active',active);if(active)link.setAttribute('aria-current','page');else link.removeAttribute('aria-current');
    });
    const target=page==='home'?document.getElementById(hash.slice(1))||$('#home'):$('#'+page+'-page');
    if(page==='home') {
      const header=$('.site-header').getBoundingClientRect().height;
      scrollTo({top:Math.max(0,scrollY+target.getBoundingClientRect().top-header-16),behavior:'instant'});
      dispatchEvent(new Event('scroll'));
    } else scrollTo({top:0,behavior:'instant'});
    if(focus) {
      const heading=page==='home'?target.querySelector('h1,h2'):target.querySelector('h1');
      if(heading){heading.setAttribute('tabindex','-1');heading.focus({preventScroll:true});}
    }
    $('#page-announcer').textContent=texts()[page];emitContent();
  }
  async function navigate(hash,push=true) {
    const next=pageForHash(hash);if(next===page){if(push){history.pushState(null,'',hash);paintPage(hash,false);}return;}
    const version=++navigationVersion,overlay=$('#page-transition'),curtain=$('.transition-curtain'),content=$('.transition-content');
    [curtain,content,...content.children].forEach(element=>element.getAnimations().forEach(animation=>animation.cancel()));
    $('#transition-label').textContent=texts()[next];
    if(reduced.matches) {if(push)history.pushState(null,'',hash);paintPage(hash);overlay.classList.remove('is-active');return;}
    overlay.classList.add('is-active');
    await Promise.allSettled([
      motion(curtain,[{transform:'translateY(100%)'},{transform:'translateY(0)'}],{duration:280,easing:'cubic-bezier(.65,0,.35,1)',fill:'forwards'}).finished,
      motion(content,[{opacity:0,transform:'translateY(14px)'},{opacity:1,transform:'translateY(0)'}],{duration:300,delay:70,easing:'cubic-bezier(.16,1,.3,1)',fill:'forwards'}).finished,
      motion($('.transition-rule'),[{transform:'scaleX(0)'},{transform:'scaleX(1)'}],{duration:330,delay:50,easing:'ease-out',fill:'forwards'}).finished
    ]);
    if(version!==navigationVersion)return;
    if(push)history.pushState(null,'',hash);paintPage(hash);
    await Promise.allSettled([
      motion(content,[{opacity:1,transform:'translateY(0)'},{opacity:0,transform:'translateY(-12px)'}],{duration:150,easing:'ease-in',fill:'forwards'}).finished,
      motion(curtain,[{transform:'translateY(0)'},{transform:'translateY(-100%)'}],{duration:340,delay:50,easing:'cubic-bezier(.65,0,.35,1)',fill:'forwards'}).finished
    ]);
    if(version===navigationVersion)overlay.classList.remove('is-active');
  }
  document.addEventListener('click',event=>{
    const anchor=event.target.closest('a[href^="#"]');
    if(!anchor||event.defaultPrevented||event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
    const hash=anchor.getAttribute('href');if(hash.length<2)return;
    if(pageForHash(hash)!==page){event.preventDefault();navigate(hash);}
  });
  addEventListener('hashchange',()=>{if(pageForHash(location.hash)!==page)navigate(location.hash,false);});
  document.addEventListener('portfolio:languagechange',translate);
  translate();paintPage(location.hash||'#home',false);
})();
