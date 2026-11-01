/* Data stays separate so every original collection can grow without layout changes. */
(() => {
  'use strict';
  const $ = selector => document.querySelector(selector);
  const $$ = selector => [...document.querySelectorAll(selector)];
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
  const animate = (element, frames, options) => reducedMotion.matches ? {finished:Promise.resolve()} : element.animate(frames,options);
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {if(entry.isIntersecting){entry.target.classList.add('is-visible');revealObserver.unobserve(entry.target);}});
  },{threshold:.08,rootMargin:'0px 0px -28px 0px'});
  function watchReveals() {
    $$('.section-heading>div,.section-description,.project-card,.identity-stack-wrap,.about-copy,.stats-row,.skills-heading,.skills-grid article,.moment-button,.contact-topline,.contact-main,.contact-socials').forEach(element => {
      if(element.classList.contains('reveal')) return;
      element.classList.add('reveal');
      if(element.matches('.project-card,.moment-button,.skills-grid article')) {
        const index=[...element.parentElement.children].indexOf(element);
        element.style.setProperty('--reveal-delay',`${(index%3)*65}ms`);
      }
      if(reducedMotion.matches)element.classList.add('is-visible');else revealObserver.observe(element);
    });
  }
  const store = {
    get(key) { try { return localStorage.getItem(key); } catch { return null; } },
    set(key, value) { try { localStorage.setItem(key, value); } catch {} }
  };
  const english = {
    skip:'Skip to content',home:'Home',work:'Work',about:'About',contact:'Contact',letsTalk:'Let’s talk',
    navProjects:'Projects',navCareer:'Career',careerPreviewLabel:'A little of my journey',careerPreviewDesc:'From discovering Roblox Studio to building a studio and returning to collaborate on projects.',careerPreviewLink:'Follow my journey',now:'Now',allReleasedGames:'See the published games',
    heroLine1:'Hi, I’m',heroLine2:'Bachtiar.',heroIntro:'Roblox developer. World builder.',
    heroDesc:'I’m Bachtiar Aditya, also known as Adit or Tahu Bulat. Over 2 years bringing ideas to life through maps, environments, and player experiences in Roblox Studio.',
    heroYears:'Years of experience',heroPublished:'Projects published',heroClients:'Clients served',clientsCount:'Clients served',experienceCount:'Years in Roblox Studio',
    worldCaption:'Maps I’ve<br><em>worked on.</em>',
    selectedWorld:'A glimpse of my work',
    profileFriends:'Friends',profileFollowers:'Followers',profileFollowing:'Following',openRoblox:'Open Roblox profile',mascotTab:'Mascot',robloxTab:'Roblox profile',deckHint:'Two sides of the same creator. Click to switch.',
    exploreWork:'Explore my work',robloxProfile:'Roblox profile',heroNote:'From a visual reference,<br>to a place worth exploring.',
    worldLabel:'ONE WORLD, MANY STORIES',heroBottom:'BUILT WITH CURIOSITY.',scroll:'SCROLL TO EXPLORE',
    workIndex:'01 / SELECTED WORK',workHeading:'Ideas you can<br>step into.',
    workDesc:'From environments to the systems behind them. Choose a collection to explore the process and the details.',all:'All',
    workNote:'Every project is part of the learning process. There is always room to grow.',
    aboutIndex:'02 / BEHIND THE WORLDS',aboutHeading:'From playing<br>to creating.',
    aboutTeaser:'Curiosity about how games are made led me to Roblox Studio. The rest is a process of trying, learning, and making again.',
    aboutLead:'I want to create places that are more than something to look at. Places you can feel.',
    aboutP1:'Since the age of 13, I’ve been curious about how video games are designed. I discovered Roblox Studio in 2021 and returned actively in late 2024, focusing on maps and environments.',
    aboutP2:'I work from visual references, paying attention to atmosphere, detail, and the player experience. I’m continuing to learn scripting, optimization, UI/UX, and collaborative game development.',
    founder:'FOUNDER OF',visits:'Total game visits',projectsCount:'Projects published',sold:'Projects sold',started:'First discovered Roblox Studio',
    skillsHeading:'What I work on.',skillWorld:'Maps, terrain, and environments with a focus on atmosphere and the player experience.',
    skillCode:'Developing game mechanics, modular systems, and debugging while continuing to learn Lua / Luau.',
    skillUI:'Learning to design clear interfaces that feel at home in a Roblox game.',
    momentsIndex:'03 / HALL OF FAME',momentsHeading:'They stopped by<br>my worlds.',
    momentsDesc:'Moments when creators played my maps. Thank you for being part of the story.',
    contactIndex:'04 / START A CONVERSATION',contactHeading:'Have an idea?<br>Let’s <span>build it.</span>',
    contactDesc:'For collaborations, a chat about Roblox, or just to say hello. Find me on Discord.',
    copyDiscord:'COPY DISCORD USERNAME',clickCopy:'Click to copy',elsewhere:'FIND ME ELSEWHERE',backTop:'Back to top',
    imageError:'This image could not be loaded. Try the next image.'
  };
  const indonesian = Object.fromEntries($$('[data-i18n]').map(el => [el.dataset.i18n, el.innerHTML]));
  const dictionary = {id:indonesian,en:english};
  const urlLang = new URLSearchParams(location.search).get('lang');
  let language = [urlLang, store.get('preferred-language')].find(value => ['id','en'].includes(value)) || 'id';
  let filter = 'all';
  const data = window.portfolioData;
  const collections = [...data.projects, ...data.moments];
  const escape = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const localText = values => values[language] || values.id;
  const photoLabel = count => `${count} ${language === 'id' ? 'FOTO' : 'PHOTOS'}`;
  const categories = {environment:'ENVIRONMENT & WORLD BUILDING',interface:'GAME INTERFACE / UI UX',scripting:'LUAU / GAME SYSTEMS'};
  let filterVersion = 0;

  function renderCollections() {
    $$('.project-card,.moment-button').forEach(element=>revealObserver.unobserve(element));
    $('#project-grid').innerHTML = data.projects.map((project,index) => `<article class="project-card" data-category="${project.category}">
      <button type="button" class="project-open" data-gallery="${project.id}" aria-label="${language==='id'?'Buka galeri':'Open gallery'}: ${escape(localText(project.title))}">
        <div class="project-image-wrap"><img class="project-image" src="${escape(project.images[0])}" alt="${escape(localText(project.title))}" loading="lazy" decoding="async"><span class="image-count">${photoLabel(project.images.length)}</span><span class="card-open-icon" aria-hidden="true">↗</span></div>
        <div class="card-meta"><span>${categories[project.category]}</span><span>0${index+1}</span></div><h3>${escape(localText(project.title))}</h3>
      </button><p class="project-description">${escape(localText(project.description))}</p></article>`).join('');
    $('#moments-grid').innerHTML = data.moments.map(moment => `<button type="button" class="moment-button" data-gallery="${moment.id}" aria-label="${language==='id'?'Lihat momen':'View moment'}: ${escape(localText(moment.title))}"><div class="moment-image-wrap"><img src="${escape(moment.images[0])}" alt="${escape(localText(moment.title))} — Roblox" loading="lazy" decoding="async"></div><span class="moment-caption"><span>${escape(localText(moment.title))}</span><span aria-hidden="true">↗</span></span></button>`).join('');
    applyFilter();
    watchReveals();
    enhanceControls();
  }
  async function applyFilter(withMotion = false) {
    const version = ++filterVersion;
    const grid = $('#project-grid');
    const cards = $$('.project-card');
    const previousHeight = grid.getBoundingClientRect().height;
    const oldPositions = new Map(cards.filter(card=>!card.hidden).map(card=>[card,card.getBoundingClientRect()]));
    grid.getAnimations().forEach(animation=>animation.cancel());
    cards.forEach(card=>card.getAnimations().forEach(animation=>animation.cancel()));
    $$('[data-filter]').forEach(button=>{const selected=button.dataset.filter===filter;button.classList.toggle('is-active',selected);button.setAttribute('aria-pressed',String(selected));});
    if(withMotion && !reducedMotion.matches) {
      const exiting=cards.filter(card=>!card.hidden && filter!=='all' && card.dataset.category!==filter);
      await Promise.allSettled(exiting.map(card=>animate(card,[{opacity:1,scale:1},{opacity:0,scale:.97}],{duration:140,easing:'ease-in'}).finished));
      if(version!==filterVersion) return;
    }
    let visible = 0;
    cards.forEach(card => {
      card.hidden = filter !== 'all' && card.dataset.category !== filter;
      if (!card.hidden) visible++;
    });
    if(withMotion && !reducedMotion.matches) {
      const finalHeight=grid.getBoundingClientRect().height;
      animate(grid,[{height:previousHeight+'px'},{height:finalHeight+'px'}],{duration:380,easing:'cubic-bezier(.16,1,.3,1)'});
      cards.filter(card=>!card.hidden).forEach((card,index)=>{
        card.classList.add('is-visible');revealObserver.unobserve(card);
        const before=oldPositions.get(card),after=card.getBoundingClientRect();
        animate(card,[{opacity:before?1:0,transform:`translate(${before?before.left-after.left:0}px,${before?before.top-after.top:18}px)`},{opacity:1,transform:'translate(0,0)'}],{duration:420,delay:index*35,easing:'cubic-bezier(.16,1,.3,1)'});
      });
    }
    $('#project-total').textContent = `${String(visible).padStart(2,'0')} ${language === 'id' ? 'KOLEKSI' : 'COLLECTIONS'}`;
    $$('[data-filter]').forEach(button => {
      const selected = button.dataset.filter === filter;
      button.classList.toggle('is-active', selected);
      button.setAttribute('aria-pressed', String(selected));
    });
  }
  $$('[data-filter]').forEach(button => button.addEventListener('click', () => {if(filter===button.dataset.filter)return;filter = button.dataset.filter; applyFilter(true);}));

  function updateThemeLabel() {
    const light = document.documentElement.dataset.theme === 'light';
    $('.theme-toggle').setAttribute('aria-pressed', String(light));
    $('.theme-toggle').setAttribute('aria-label', language === 'id' ? `Ganti ke tema ${light?'gelap':'terang'}` : `Switch to ${light?'dark':'light'} theme`);
    $('meta[name="theme-color"]').content = light ? '#f7f8f2' : '#101110';
  }
  $('.theme-toggle').addEventListener('click', () => {
    const theme = document.documentElement.dataset.theme === 'light' ? 'dark' : 'light';
    document.documentElement.dataset.theme = theme;
    store.set('bachtiar-theme',theme);
    updateThemeLabel();
  });
  function setLanguage(value) {
    language = value;
    document.documentElement.lang = language;
    $$('[data-i18n]').forEach(el => {el.innerHTML = dictionary[language][el.dataset.i18n] || indonesian[el.dataset.i18n];});
    $$('[data-lang]').forEach(button => button.setAttribute('aria-pressed',String(button.dataset.lang===language)));
    $('#gallery-close').setAttribute('aria-label',language==='id'?'Tutup galeri':'Close gallery');
    $('#gallery-prev').setAttribute('aria-label',language==='id'?'Gambar sebelumnya':'Previous image');
    $('#gallery-next').setAttribute('aria-label',language==='id'?'Gambar berikutnya':'Next image');
    $('.main-nav').setAttribute('aria-label',language==='id'?'Navigasi utama':'Main navigation');
    $('.filters').setAttribute('aria-label',language==='id'?'Filter karya':'Filter work');
    $('.world-frame').setAttribute('aria-label',language==='id'?'Jelajahi proyek map dan environment':'Explore maps and environments');
    $('.skip-link').textContent = dictionary[language].skip;
    $('.wordmark').setAttribute('aria-label',language==='id'?'Bachtiar, beranda':'Bachtiar, home');
    store.set('preferred-language',language);
    const url = new URL(location.href);
    url.searchParams.set('lang',language);
    if (location.protocol === 'https:' || location.protocol === 'http:') history.replaceState(null,'',url);
    $('#copy-status').textContent = '';
    updateThemeLabel();
    updateMarqueeLabel();
    updateMenuLabel();
    renderRobloxProfile();
    $('.identity-switcher').setAttribute('aria-label',language==='id'?'Pilih kartu identitas':'Choose an identity card');
    $('.deck-next').setAttribute('aria-label',language==='id'?'Ganti kartu identitas':'Switch identity card');
    renderCollections();
    document.dispatchEvent(new CustomEvent('portfolio:languagechange',{detail:{language}}));
  }
  $$('[data-lang]').forEach(button => button.addEventListener('click',() => setLanguage(button.dataset.lang)));

  const menu = $('.main-nav');
  const menuButton = $('.menu-toggle');
  function updateMenuLabel() {
    const open = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-label',language==='id' ? `${open?'Tutup':'Buka'} menu` : `${open?'Close':'Open'} menu`);
  }
  function closeMenu() {menu.classList.remove('is-open');menuButton.setAttribute('aria-expanded','false');updateMenuLabel();}
  menuButton.addEventListener('click',() => {
    const open = menuButton.getAttribute('aria-expanded') !== 'true';
    menu.classList.toggle('is-open',open);menuButton.setAttribute('aria-expanded',String(open));updateMenuLabel();
  });
  $$('.nav-link').forEach(link => link.addEventListener('click',closeMenu));
  document.addEventListener('click',event => {if (!event.target.closest('.site-header')) closeMenu();});
  document.addEventListener('keydown',event => {if(event.key==='Escape' && menu.classList.contains('is-open')) {closeMenu();menuButton.focus();}});
  matchMedia('(min-width:861px)').addEventListener('change',closeMenu);

  const dialog = $('#gallery-dialog');
  const image = $('#gallery-image');
  let active = null;
  let imageIndex = 0;
  let returnFocus = null;
  let imageVersion = 0;
  let closingGallery = false;
  const stage = $('.gallery-stage');
  function renderImage() {
    if(!active) return;
    const version=++imageVersion;
    $('#image-error').hidden = true;
    stage.classList.add('is-loading');stage.setAttribute('aria-busy','true');
    const source=active.images[imageIndex];
    const alt=`${localText(active.title)} — ${imageIndex+1} / ${active.images.length}`;
    const loader=new Image();
    loader.onload=()=>{
      if(version!==imageVersion||!active)return;
      image.getAnimations().forEach(animation=>animation.cancel());
      image.alt=alt;image.src=source;image.style.opacity='1';
      stage.classList.remove('is-loading');stage.setAttribute('aria-busy','false');
      animate(image,[{opacity:0,transform:'translateX(10px) scale(.99)'},{opacity:1,transform:'translateX(0) scale(1)'}],{duration:300,easing:'cubic-bezier(.16,1,.3,1)'});
    };
    loader.onerror=()=>{if(version!==imageVersion||!active)return;image.style.opacity='0';stage.classList.remove('is-loading');stage.setAttribute('aria-busy','false');$('#image-error').hidden=false;};
    loader.src=source;
    $('#gallery-title').textContent = localText(active.title);
    $('#gallery-description').textContent = localText(active.description);
    $('#gallery-counter').textContent = `${String(imageIndex+1).padStart(2,'0')} / ${String(active.images.length).padStart(2,'0')}`;
    $('#gallery-prev').disabled = active.images.length === 1;
    $('#gallery-next').disabled = active.images.length === 1;
    $('#gallery-kicker').textContent = active.id.startsWith('moment') ? 'HALL OF FAME' : (language==='id'?'ARSIP KARYA':'PROJECT ARCHIVE');
    if(active.images.length>1) {const nextImage = new Image();nextImage.src=active.images[(imageIndex+1)%active.images.length];}
  }
  document.addEventListener('click',event => {
    const button = event.target.closest('[data-gallery]');
    if(!button) return;
    active = collections.find(collection=>collection.id === button.dataset.gallery);
    if(!active) return;
    returnFocus = button;imageIndex=0;closingGallery=false;image.removeAttribute('src');image.alt='';image.style.opacity='0';renderImage();dialog.showModal();document.body.classList.add('modal-open');$('#gallery-close').focus();
    animate(dialog,[{opacity:0,transform:'translateY(18px) scale(.97)'},{opacity:1,transform:'translateY(0) scale(1)'}],{duration:320,easing:'cubic-bezier(.16,1,.3,1)'});
  });
  function stepImage(direction) {if(!active) return;imageIndex=(imageIndex+direction+active.images.length)%active.images.length;renderImage();}
  $('#gallery-next').addEventListener('click',()=>stepImage(1));
  $('#gallery-prev').addEventListener('click',()=>stepImage(-1));
  async function closeGallery() {
    if(closingGallery||!dialog.open)return;
    closingGallery=true;
    dialog.getAnimations().forEach(animation=>animation.cancel());
    await animate(dialog,[{opacity:1,transform:'scale(1)'},{opacity:0,transform:'translateY(10px) scale(.98)'}],{duration:160,easing:'ease-in'}).finished.catch(()=>{});
    dialog.close();closingGallery=false;
  }
  $('#gallery-close').addEventListener('click',closeGallery);
  dialog.addEventListener('cancel',event=>{event.preventDefault();closeGallery();});
  dialog.addEventListener('click',event => {if(event.target !== dialog) return;const rect=dialog.getBoundingClientRect();if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom) closeGallery();});
  dialog.addEventListener('close',()=>{imageVersion++;document.body.classList.remove('modal-open');active=null;stage.classList.remove('is-loading');stage.setAttribute('aria-busy','false');returnFocus?.focus({preventScroll:true});});
  dialog.addEventListener('keydown',event=>{if(event.key==='ArrowRight'){event.preventDefault();stepImage(1);}if(event.key==='ArrowLeft'){event.preventDefault();stepImage(-1);}});
  let touchStart = null;
  $('.gallery-stage').addEventListener('touchstart',event=>{touchStart=event.touches.length===1?{x:event.touches[0].clientX,y:event.touches[0].clientY}:null;},{passive:true});
  $('.gallery-stage').addEventListener('touchend',event=>{if(!touchStart)return;const dx=event.changedTouches[0].clientX-touchStart.x,dy=event.changedTouches[0].clientY-touchStart.y;if(Math.abs(dx)>55&&Math.abs(dx)>Math.abs(dy)*1.5)stepImage(dx<0?1:-1);touchStart=null;},{passive:true});

  let copyTimer;
  $('#discord-button').addEventListener('click',async()=>{
    clearTimeout(copyTimer);
    try {await navigator.clipboard.writeText('bachadit');$('#copy-status').textContent=language==='id'?'Username tersalin. Sampai jumpa di Discord!':'Username copied. See you on Discord!';}
    catch {$('#copy-status').textContent=language==='id'?'Salin manual username: bachadit':'Copy this username: bachadit';}
    copyTimer=setTimeout(()=>{$('#copy-status').textContent='';},6000);
  });
  $$('[data-year]').forEach(el => el.textContent = new Date().getFullYear());

  // Two identical groups travel one full group to the right, with no loop jump.
  const strip=$('.discipline-strip'),track=$('.marquee-track');
  const logoClone=$('.marquee-group').cloneNode(true);
  logoClone.setAttribute('aria-hidden','true');track.appendChild(logoClone);
  function updateMarqueeLabel() {
    const paused=$('.marquee-pause').getAttribute('aria-pressed')==='true';
    $('.marquee-pause').setAttribute('aria-label',language==='id'?`${paused?'Lanjutkan':'Jeda'} animasi logo`:`${paused?'Play':'Pause'} logo animation`);
  }
  $('.marquee-pause').addEventListener('click',()=>{
    const paused=strip.classList.toggle('is-paused');
    $('.marquee-pause').setAttribute('aria-pressed',String(paused));updateMarqueeLabel();
  });
  const ambientObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{
    entry.target.classList.toggle(entry.target===strip?'stream-offscreen':'mascot-offscreen',!entry.isIntersecting);
  }));
  ambientObserver.observe(strip);ambientObserver.observe($('.hero-mascot'));
  document.addEventListener('visibilitychange',()=>document.documentElement.classList.toggle('page-hidden',document.hidden));

  const counting=new Map();
  const countedInView=new WeakSet();
  function countFromZero(element) {
    if(counting.has(element))return;
    const target=Number(element.dataset.count);
    const formatter=element.dataset.countLocale?new Intl.NumberFormat(element.dataset.countLocale):null;
    const format=value=>formatter?formatter.format(value):String(value);
    if(reducedMotion.matches){element.textContent=format(target);return;}
    element.textContent=format(0);
    const start=performance.now();
    function tick(now) {
      const t=Math.min(1,(now-start)/1100);
      element.textContent=format(t===1?target:Math.floor(target*t));
      if(t<1)counting.set(element,requestAnimationFrame(tick));else counting.delete(element);
    }
    counting.set(element,requestAnimationFrame(tick));
  }
  const countObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{
    if(!entry.isIntersecting||entry.intersectionRatio<.6){countedInView.delete(entry.target);return;}
    if(entry.target.closest('[inert]')||countedInView.has(entry.target))return;
    countedInView.add(entry.target);countFromZero(entry.target);
  }),{threshold:.6});
  $$('[data-count]').forEach(element=>countObserver.observe(element));
  document.addEventListener('pointerover',event=>{
    if(event.pointerType==='touch')return;
    const group=event.target.closest('.hero-stats>div,.stats-row>div,.profile-counts>div,.game-metrics>div');
    if(!group||group.contains(event.relatedTarget))return;
    group.querySelectorAll('[data-count]').forEach(countFromZero);
  });

  // A single frame per pointer update; no idle render loop or touch tilt.
  let tiltFrame=0,tiltTarget=null,tiltEvent=null;
  document.addEventListener('pointermove',event=>{
    if(reducedMotion.matches||!finePointer.matches||event.pointerType==='touch')return;
    const card=event.target.closest('.project-image-wrap');
    if(!card)return;
    tiltTarget=card;tiltEvent={x:event.clientX,y:event.clientY};
    if(tiltFrame)return;
    tiltFrame=requestAnimationFrame(()=>{
      tiltFrame=0;if(!tiltTarget||!tiltTarget.isConnected)return;
      const rect=tiltTarget.getBoundingClientRect(),x=(tiltEvent.x-rect.left)/rect.width,y=(tiltEvent.y-rect.top)/rect.height;
      tiltTarget.style.setProperty('--tilt-x',`${(y-.5)*-4}deg`);tiltTarget.style.setProperty('--tilt-y',`${(x-.5)*4}deg`);
      tiltTarget.style.setProperty('--pointer-x',`${x*100}%`);tiltTarget.style.setProperty('--pointer-y',`${y*100}%`);
    });
  },{passive:true});
  document.addEventListener('pointerout',event=>{
    const card=event.target.closest('.project-image-wrap');
    if(card&&!card.contains(event.relatedTarget)){card.style.removeProperty('--tilt-x');card.style.removeProperty('--tilt-y');if(tiltTarget===card){cancelAnimationFrame(tiltFrame);tiltFrame=0;tiltTarget=null;}}
  });
  reducedMotion.addEventListener('change',()=>{
    if(!reducedMotion.matches)return;
    document.getAnimations().forEach(animation=>{if(animation.effect?.getTiming().iterations!==Infinity)animation.finish();});
    $$('.reveal').forEach(el=>el.classList.add('is-visible'));
    counting.forEach((frame,el)=>{cancelAnimationFrame(frame);el.textContent=el.dataset.countLocale?new Intl.NumberFormat(el.dataset.countLocale).format(Number(el.dataset.count)):el.dataset.count;});counting.clear();
    $$('.project-image-wrap').forEach(el=>{el.style.removeProperty('--tilt-x');el.style.removeProperty('--tilt-y');});
  });
  // Roblox blocks cross-origin browser reads. Use the verified official API snapshot,
  // local avatar, and an honest capture date rather than a third-party proxy.
  function renderRobloxProfile() {
    const profile=window.robloxProfile;
    if(!profile)return;
    $('#profile-display-name').textContent=profile.displayName;
    $('#profile-handle').textContent='@'+profile.name;
    $('#profile-bio').textContent=profile.description;
    $('#profile-verified').hidden=!profile.hasVerifiedBadge;
    $('#profile-verified').setAttribute('aria-label',language==='id'?'Profil terverifikasi':'Verified profile');
    const formatter=new Intl.NumberFormat(language==='id'?'id-ID':'en-US');
    ['friends','followers','following'].forEach(key=>{const number=$('#profile-'+key);if(counting.has(number)){cancelAnimationFrame(counting.get(number));counting.delete(number);}number.textContent=formatter.format(profile[key]);number.dataset.count=String(profile[key]);number.dataset.countLocale=language==='id'?'id-ID':'en-US';countObserver.observe(number);});
    const captured=new Intl.DateTimeFormat(language==='id'?'id-ID':'en-US',{day:'numeric',month:'short',year:'numeric',timeZone:'Asia/Bangkok'}).format(new Date(profile.capturedAt));
    $('#profile-data-date').textContent=(language==='id'?'Data resmi Roblox · ':'Official Roblox data · ')+captured;
  }
  let identity='mascot';
  function switchIdentity(value) {
    if(value===identity)return;
    const stack=$('.identity-stack');
    const previous=$('#identity-'+identity),next=$('#identity-'+value);
    identity=value;stack.dataset.active=value;
    previous.setAttribute('aria-hidden','true');previous.inert=true;
    next.setAttribute('aria-hidden','false');next.inert=false;
    next.querySelectorAll('[data-count]').forEach(countFromZero);
    $$('[data-identity]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.identity===value)));
    [previous,next].forEach(card=>card.getAnimations().forEach(animation=>animation.cancel()));
    const rear=matchMedia('(max-width:640px)').matches?'translate(8px,-7px) rotate(1deg) scale(.98)':'translate(12px,-9px) rotate(1.5deg) scale(.97)';
    animate(previous,[{transform:'translate(0,0)'},{transform:'translate(-6px,4px) rotate(-1deg)',offset:.45},{transform:rear}],{duration:500,easing:'cubic-bezier(.16,1,.3,1)'});
    animate(next,[{transform:rear},{transform:'translate(12px,-6px) rotate(2deg)',offset:.4},{transform:'translate(0,0)'}],{duration:500,easing:'cubic-bezier(.16,1,.3,1)'});
  }
  $$('[data-identity]').forEach(button=>{
    button.addEventListener('click',()=>switchIdentity(button.dataset.identity));
    button.addEventListener('keydown',event=>{if(['ArrowLeft','ArrowRight','Home','End'].includes(event.key)){event.preventDefault();const value=event.key==='Home'?'mascot':event.key==='End'?'roblox':identity==='mascot'?'roblox':'mascot';switchIdentity(value);$(`[data-identity="${value}"]`).focus();}});
  });
  $('.deck-next').addEventListener('click',()=>switchIdentity(identity==='mascot'?'roblox':'mascot'));
  let deckTouch=null;
  $('.identity-stack').addEventListener('touchstart',event=>{deckTouch=event.touches.length===1?{x:event.touches[0].clientX,y:event.touches[0].clientY}:null;},{passive:true});
  $('.identity-stack').addEventListener('touchend',event=>{if(!deckTouch)return;const dx=event.changedTouches[0].clientX-deckTouch.x,dy=event.changedTouches[0].clientY-deckTouch.y;if(Math.abs(dx)>55&&Math.abs(dx)>Math.abs(dy)*1.5)switchIdentity(identity==='mascot'?'roblox':'mascot');deckTouch=null;},{passive:true});

  function enhanceControls() {
    $$('.button,.nav-cta,.text-link,.icon-button,.filter-button,.discord-button,.studio-identity,.deck-tab,.profile-link,.back-top,.language-switch button').forEach(control=>control.classList.add('interactive-control'));
  }
  let controlFrame=0,controlTarget=null,controlPointer=null;
  document.addEventListener('pointermove',event=>{
    if(reducedMotion.matches||!finePointer.matches||event.pointerType==='touch')return;
    const control=event.target.closest('.interactive-control');if(!control)return;
    controlTarget=control;controlPointer={x:event.clientX,y:event.clientY};
    if(controlFrame)return;
    controlFrame=requestAnimationFrame(()=>{
      controlFrame=0;if(!controlTarget?.isConnected)return;
      const rect=controlTarget.getBoundingClientRect(),x=controlPointer.x-rect.left,y=controlPointer.y-rect.top;
      controlTarget.style.setProperty('--mag-x',`${(x/rect.width-.5)*5}px`);
      controlTarget.style.setProperty('--mag-y',`${(y/rect.height-.5)*5}px`);
      controlTarget.style.setProperty('--control-x',`${x}px`);controlTarget.style.setProperty('--control-y',`${y}px`);
    });
  },{passive:true});
  document.addEventListener('pointerout',event=>{
    const control=event.target.closest('.interactive-control');if(!control||control.contains(event.relatedTarget))return;
    control.style.removeProperty('--mag-x');control.style.removeProperty('--mag-y');
    if(control===controlTarget){cancelAnimationFrame(controlFrame);controlFrame=0;controlTarget=null;}
  });
  setLanguage(language);
  document.addEventListener('portfolio:content',()=>{watchReveals();enhanceControls();$$('[data-count]').forEach(number=>countObserver.observe(number));});
  document.addEventListener('portfolio:beforecontent',event=>{
    const root=event.detail?.root;if(!(root instanceof Element))return;
    root.querySelectorAll('[data-count]').forEach(number=>{countObserver.unobserve(number);if(counting.has(number)){cancelAnimationFrame(counting.get(number));counting.delete(number);}});
    root.querySelectorAll('.reveal').forEach(element=>revealObserver.unobserve(element));
  });
  watchReveals();
  document.documentElement.classList.add('motion-ready');

  // Keep the single navigation in sync without a continuous animation loop.
  let scrollFrame = 0;
  const sectionIds = ['home','about','uplink'];
  function syncNavigation() {
    if(document.body.dataset.page && document.body.dataset.page!=='home'){scrollFrame=0;return;}
    let current = 'home';
    sectionIds.forEach(id=>{if(document.getElementById(id).getBoundingClientRect().top<=160)current=id;});
    $$('.nav-link').forEach(link=>{
      const selected=link.getAttribute('href')==='#'+current;
      link.classList.toggle('is-active',selected);
      if(selected)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current');
    });
    const range=document.documentElement.scrollHeight-innerHeight;
    $('.reading-progress').style.transform=`scaleX(${range>0?Math.min(1,Math.max(0,scrollY/range)):0})`;
    scrollFrame=0;
  }
  addEventListener('scroll',()=>{if(!scrollFrame)scrollFrame=requestAnimationFrame(syncNavigation);},{passive:true});
  syncNavigation();
})();
