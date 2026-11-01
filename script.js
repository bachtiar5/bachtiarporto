/* Data stays separate so every original collection can grow without layout changes. */
(() => {
  'use strict';
  const $ = selector => document.querySelector(selector);
  const $$ = selector => [...document.querySelectorAll(selector)];
  const store = {
    get(key) { try { return localStorage.getItem(key); } catch { return null; } },
    set(key, value) { try { localStorage.setItem(key, value); } catch {} }
  };
  const english = {
    skip:'Skip to content',home:'Home',work:'Work',about:'About',contact:'Contact',letsTalk:'Let’s talk',
    heroLine1:'Small worlds.',heroLine2:'Big ideas.',heroIntro:'Hello, I’m Bachtiar Aditya.',
    heroDesc:'Also known as Adit or Tahu Bulat. I build maps, shape experiences, and bring ideas to life in Roblox.',
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
    founder:'FOUNDER OF',visits:'Total game visits',projectsCount:'Projects worked on',sold:'Projects sold',started:'First discovered Roblox Studio',
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

  function renderCollections() {
    $('#project-grid').innerHTML = data.projects.map((project,index) => `<article class="project-card" data-category="${project.category}">
      <button type="button" class="project-open" data-gallery="${project.id}" aria-label="${language==='id'?'Buka galeri':'Open gallery'}: ${escape(localText(project.title))}">
        <div class="project-image-wrap"><img class="project-image" src="${escape(project.images[0])}" alt="${escape(localText(project.title))}" loading="lazy" decoding="async"><span class="image-count">${photoLabel(project.images.length)}</span><span class="card-open-icon" aria-hidden="true">↗</span></div>
        <div class="card-meta"><span>${categories[project.category]}</span><span>0${index+1}</span></div><h3>${escape(localText(project.title))}</h3>
      </button><p class="project-description">${escape(localText(project.description))}</p></article>`).join('');
    $('#moments-grid').innerHTML = data.moments.map(moment => `<button type="button" class="moment-button" data-gallery="${moment.id}" aria-label="${language==='id'?'Lihat momen':'View moment'}: ${escape(localText(moment.title))}"><div class="moment-image-wrap"><img src="${escape(moment.images[0])}" alt="${escape(localText(moment.title))} — Roblox" loading="lazy" decoding="async"></div><span class="moment-caption"><span>${escape(localText(moment.title))}</span><span aria-hidden="true">↗</span></span></button>`).join('');
    applyFilter();
  }
  function applyFilter() {
    let visible = 0;
    $$('.project-card').forEach(card => {
      card.hidden = filter !== 'all' && card.dataset.category !== filter;
      if (!card.hidden) visible++;
    });
    $('#project-total').textContent = `${String(visible).padStart(2,'0')} ${language === 'id' ? 'KOLEKSI' : 'COLLECTIONS'}`;
    $$('[data-filter]').forEach(button => {
      const selected = button.dataset.filter === filter;
      button.classList.toggle('is-active', selected);
      button.setAttribute('aria-pressed', String(selected));
    });
  }
  $$('[data-filter]').forEach(button => button.addEventListener('click', () => {filter = button.dataset.filter; applyFilter();}));

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
    updateMenuLabel();
    renderCollections();
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
  matchMedia('(min-width:641px)').addEventListener('change',closeMenu);

  const dialog = $('#gallery-dialog');
  const image = $('#gallery-image');
  let active = null;
  let imageIndex = 0;
  let returnFocus = null;
  function renderImage() {
    if(!active) return;
    $('#image-error').hidden = true;
    image.style.opacity = '0';
    image.alt = `${localText(active.title)} — ${imageIndex+1} / ${active.images.length}`;
    image.src = active.images[imageIndex];
    $('#gallery-title').textContent = localText(active.title);
    $('#gallery-description').textContent = localText(active.description);
    $('#gallery-counter').textContent = `${String(imageIndex+1).padStart(2,'0')} / ${String(active.images.length).padStart(2,'0')}`;
    $('#gallery-prev').disabled = active.images.length === 1;
    $('#gallery-next').disabled = active.images.length === 1;
    $('#gallery-kicker').textContent = active.id.startsWith('moment') ? 'HALL OF FAME' : (language==='id'?'ARSIP KARYA':'PROJECT ARCHIVE');
    if(active.images.length>1) {const nextImage = new Image();nextImage.src=active.images[(imageIndex+1)%active.images.length];}
  }
  image.addEventListener('error',() => {$('#image-error').hidden = false;});
  image.addEventListener('load',() => {image.style.opacity='1';$('#image-error').hidden = true;});
  document.addEventListener('click',event => {
    const button = event.target.closest('[data-gallery]');
    if(!button) return;
    active = collections.find(collection=>collection.id === button.dataset.gallery);
    if(!active) return;
    returnFocus = button;imageIndex=0;renderImage();dialog.showModal();document.body.classList.add('modal-open');$('#gallery-close').focus();
  });
  function stepImage(direction) {if(!active) return;imageIndex=(imageIndex+direction+active.images.length)%active.images.length;renderImage();}
  $('#gallery-next').addEventListener('click',()=>stepImage(1));
  $('#gallery-prev').addEventListener('click',()=>stepImage(-1));
  $('#gallery-close').addEventListener('click',()=>dialog.close());
  dialog.addEventListener('click',event => {if(event.target !== dialog) return;const rect=dialog.getBoundingClientRect();if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom) dialog.close();});
  dialog.addEventListener('close',()=>{document.body.classList.remove('modal-open');active=null;returnFocus?.focus({preventScroll:true});});
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
  setLanguage(language);

  // Keep the single navigation in sync without a continuous animation loop.
  let scrollFrame = 0;
  const sectionIds = ['home','projects','about','uplink'];
  function syncNavigation() {
    let current = 'home';
    sectionIds.forEach(id=>{if(document.getElementById(id).getBoundingClientRect().top<=160)current=id;});
    $$('.nav-link').forEach(link=>{
      const selected=link.getAttribute('href')==='#'+current;
      link.classList.toggle('is-active',selected);
      if(selected)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current');
    });
    scrollFrame=0;
  }
  addEventListener('scroll',()=>{if(!scrollFrame)scrollFrame=requestAnimationFrame(syncNavigation);},{passive:true});
  syncNavigation();
})();
