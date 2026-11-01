(() => {
  'use strict';
  const $=selector=>document.querySelector(selector);
  const $$=selector=>[...document.querySelectorAll(selector)];
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const esc=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const words={
    id:{backHome:'Balik ke beranda',projectsKicker:'Proyek yang sudah rilis',projectsTitle:'Game yang pernah<br>kugarap.',projectsIntro:'Ada proyek pribadi, proyek klien, dan karya studio. Beberapa juga sudah terjual. Ini game-game yang bisa kamu lihat langsung di Roblox.',filterAll:'Semua',sold:'Terjual',personal:'Pribadi',client:'Klien',studio:'Studio',browseArchive:'Lihat juga galeri prosesnya',browseCareer:'Lihat perjalananku',backAbout:'Balik ke tentang aku',careerKicker:'Dari tahun ke tahun',careerTitle:'Perjalananku<br>sejauh ini.',careerIntro:'Dari kenal Roblox Studio, belajar sendiri, dan membangun komunitas, sampai kembali berkarya dan berkolaborasi dalam studio. Pilih tahunnya buat ikuti ceritaku.',previousChapter:'Tahun sebelumnya',nextChapter:'Tahun berikutnya',nextStory:'Ceritanya masih lanjut. Sekarang, lihat apa yang sudah kubikin.',seeProjects:'Lihat proyekku',likes:'Like',active:'Pemain aktif',favorites:'Favorit',visits:'Kunjungan',created:'Dibuat',updated:'Update terakhir',openGame:'Lihat di Roblox',games:'game',snapshot:'Data Roblox diambil',snapshotNote:'Pemain aktif mengikuti waktu pengambilan data. Peak CCU adalah rekor pemain bersamaan, berdasarkan catatan Bachtiar.',home:'Beranda',projects:'Proyek',career:'Karier',yearLabel:'Pilih tahun perjalanan',filterLabel:'Filter status proyek',soldNote:'Proyek ini sudah terjual.',chapter:'Bagian',year:'Tahun',years:'Tahun pengalaman',published:'Proyek rilis',clients:'Klien pernah dibantu'},
    en:{backHome:'Back to home',projectsKicker:'Published projects',projectsTitle:'Games I’ve<br>worked on.',projectsIntro:'Personal games, client projects, and studio work. Some have been sold. Explore these games directly on Roblox.',filterAll:'All',sold:'Sold',personal:'Personal',client:'Client',studio:'Studio',browseArchive:'Explore the process gallery',browseCareer:'Follow my journey',backAbout:'Back to about me',careerKicker:'Year by year',careerTitle:'My journey<br>so far.',careerIntro:'From discovering Roblox Studio, learning independently, and building a community to returning to development and collaborating in a studio. Choose a year to follow my story.',previousChapter:'Previous chapter',nextChapter:'Next chapter',nextStory:'The story is still going. Take a look at what I’ve made so far.',seeProjects:'Explore my projects',likes:'Likes',active:'Active players',favorites:'Favorites',visits:'Visits',created:'Created',updated:'Last updated',openGame:'View on Roblox',games:'games',snapshot:'Roblox data captured',snapshotNote:'Active players reflects the capture time. Peak CCU is the highest concurrent player count, provided by Bachtiar.',home:'Home',projects:'Projects',career:'Career',yearLabel:'Choose a year',filterLabel:'Filter project status',soldNote:'This project has been sold.',chapter:'Chapter',year:'Year',years:'Years of experience',published:'Projects published',clients:'Clients served'}
  };
  const chapters=[
  {
    "year": "2021",
    "icon": "image/icons/robloxstudio.svg",
    "id": {
      "title": "Pertama kenal Roblox Studio",
      "intro": "Mulainya dari rasa penasaran.",
      "body": "Pada 2021, aku pertama kali mengenal Roblox Studio dan mencoba beberapa fitur dasarnya. Waktu itu belum ada rencana serius menjadi game developer; aku hanya penasaran bagaimana game dibuat. Eksplorasinya singkat, lalu aku berhenti menggunakannya.",
      "note": "Ini tahun pertama mengenal Roblox Studio, bukan awal karier profesionalku."
    },
    "en": {
      "title": "Discovering Roblox Studio",
      "intro": "It started with curiosity.",
      "body": "In 2021, I discovered Roblox Studio and tried some of its basic features. I had no serious plans to become a game developer yet; I was simply curious about how games were made. This brief exploration ended when I stopped using it.",
      "note": "This was my first introduction to Roblox Studio, not the start of a professional career."
    }
  },
  {
    "year": "2022",
    "icon": "image/icons/earth.svg",
    "id": {
      "title": "Menjelajahi game sebagai pemain",
      "intro": "Masih menikmati game dari sisi pemain.",
      "body": "Sepanjang 2022, aku lebih banyak bermain dan menjelajahi game di Roblox maupun platform lain. Aku belum aktif mengembangkan game saat itu. Masa ini menjadi bagian dari eksplorasiku sebagai pemain, sebelum kembali tertarik membuat game sendiri.",
      "note": "Mengenal berbagai pengalaman bermain sebelum mulai belajar membuatnya."
    },
    "en": {
      "title": "Exploring games as a player",
      "intro": "Experiencing games from the player’s side.",
      "body": "Throughout 2022, I spent more time playing and exploring games on Roblox and other platforms. I was not actively developing games during this period. This was a time of exploration as a player, before I became interested in making games of my own again.",
      "note": "Exploring different player experiences before learning to create them."
    }
  },
  {
    "year": "2023",
    "icon": "image/aihstudio.png",
    "studio": true,
    "id": {
      "title": "Belajar mandiri & AIH Studio",
      "intro": "Dari mencoba bikin game, sampai membangun komunitas.",
      "body": "Aku mulai belajar Roblox Studio secara mandiri lewat tutorial YouTube. Aku mencoba obby, Backrooms, horror sederhana, serta game perang dan pertempuran; sebagian besar belum selesai atau dirilis, dan belum menghasilkan pendapatan. Pada tahun yang sama, aku mendirikan komunitas Roblox AIH Studio, langkah penting yang memperluas kegiatanku dari belajar sendiri menjadi membangun komunitas.",
      "note": "Setelah beberapa percobaan, aku vakum dari pengembangan game dan tidak aktif mengerjakan proyek hingga menjelang akhir 2024."
    },
    "en": {
      "title": "Self-taught learning & AIH Studio",
      "intro": "From experimenting with games to building a community.",
      "body": "I started teaching myself Roblox Studio through YouTube tutorials. I experimented with obbies, Backrooms, simple horror, and war and combat games; most remained unfinished or unpublished, and none generated income. That same year, I founded the Roblox community AIH Studio, an important step from learning on my own to building a community.",
      "note": "After these experiments, I took a break from game development and remained inactive until late 2024."
    }
  },
  {
    "year": "2024",
    "icon": "image/icons/robloxstudio.svg",
    "projectIds": [
      "134149093878551"
    ],
    "id": {
      "title": "Kembali lewat Gunung Butak",
      "intro": "Pengalaman mendaki jadi ide untuk kembali berkarya.",
      "body": "Menjelang akhir 2024, aku kembali menggunakan Roblox Studio dan mulai mengembangkan Gunung Butak. Idenya terinspirasi dari pengalamanku sendiri saat mendaki Gunung Butak. Ini proyek serius pertama setelah masa vakum, berbeda dari eksperimen belajar pada 2023, dan menjadi pijakan untuk mengerjakan proyek berikutnya.",
      "note": "Pengembangan dimulai menjelang akhir 2024; data proyek Roblox mencatat tanggal pembuatan pada 2025."
    },
    "en": {
      "title": "Returning with Gunung Butak",
      "intro": "A personal hiking experience inspired my return.",
      "body": "In late 2024, I returned to Roblox Studio and began developing Gunung Butak. It was inspired by my own experience hiking the mountain. This was my first serious project after the break, distinct from my learning experiments in 2023, and it became a foundation for the projects that followed.",
      "note": "Development began in late 2024; the Roblox project record lists its creation date in 2025."
    }
  },
  {
    "year": "2025",
    "icon": "image/icons/luau.svg",
    "projectIds": [
      "105524083023030",
      "116205005363789",
      "110354587993091"
    ],
    "id": {
      "title": "Proyek lanjutan & freelance",
      "intro": "Makin banyak pengalaman, mulai menemukan arah.",
      "body": "Setelah Gunung Butak, aku mengembangkan Gunung Kawi dan Gunung Deti untuk memperluas pengalaman membuat game. Unsur horror di Gunung Kawi memunculkan ketertarikanku untuk mendalami genre itu. Aku juga mulai menerima pekerjaan freelance dan mengerjakan kebutuhan klien, sehingga pengalamanku berkembang dari proyek sendiri ke proyek untuk orang lain.",
      "note": "Pada akhir 2025, aku mulai mengembangkan Mie Ayam Sidoarjo, game horror pertamaku yang benar-benar berfokus pada genre tersebut."
    },
    "en": {
      "title": "More projects & freelance work",
      "intro": "Broadening my experience and finding a direction.",
      "body": "After Gunung Butak, I developed Gunung Kawi and Gunung Deti to broaden my experience making games. The horror elements in Gunung Kawi sparked my interest in exploring the genre further. I also began taking freelance work and building projects for clients, expanding beyond my own projects to meet other people’s needs.",
      "note": "In late 2025, I began developing Mie Ayam Sidoarjo, my first game with a full focus on horror."
    }
  },
  {
    "year": "2026",
    "icon": "image/brand-mark.svg",
    "projectIds": [
      "110354587993091",
      "70575351571626"
    ],
    "projects": true,
    "id": {
      "title": "Mie Ayam, kolaborasi & LOSI",
      "intro": "Mie Ayam Sidoarjo membuka banyak kesempatan baru.",
      "body": "Memasuki 2026, Mie Ayam Sidoarjo mendapat perhatian besar dari komunitas Roblox dan menjadi salah satu titik terobosan karierku. Dukungan YouTuber, kreator konten, dan developer—termasuk IFQIYEH yang membantu mempromosikannya—membawa game ini ke lebih banyak pemain. Perkembangannya membuka kesempatan kolaborasi dengan The Morgue Shift, Bakso Malang Anomalies, dan Shopee.",
      "note": "The Morgue Shift dan Bakso Malang Anomalies merupakan pengalaman kolaborasi, bukan game yang kubuat sendiri.",
      "highlight": "Bergabung dengan LOSI Studio",
      "highlightBody": "Sepanjang 2026, aku terus mengembangkan game, mengerjakan freelance, dan menghasilkan beberapa proyek yang terjual. Aku juga bergabung dengan LOSI Studio dan terlibat dalam pengembangan Hotel Anomali bersama developer lainnya. Menurut informasi yang kumiliki, LOSI Studio dimiliki oleh Bang Windah dan Andi Lukito; pengalaman ini menjadi langkah penting menuju kerja sama profesional dalam studio."
    },
    "en": {
      "title": "Mie Ayam, collaborations & LOSI",
      "intro": "Mie Ayam Sidoarjo opened new opportunities.",
      "body": "In 2026, Mie Ayam Sidoarjo gained significant attention from the Roblox community and became a breakthrough in my career. Support from YouTubers, content creators, and developers—including IFQIYEH, who helped promote it—brought the game to more players. Its growth opened opportunities to collaborate with The Morgue Shift, Bakso Malang Anomalies, and Shopee.",
      "note": "The Morgue Shift and Bakso Malang Anomalies were collaborations, not games I created on my own.",
      "highlight": "Joining LOSI Studio",
      "highlightBody": "Throughout 2026, I continued developing games, taking freelance work, and completing projects that were sold. I also joined LOSI Studio and contributed to Hotel Anomali alongside other developers. According to the information I have, LOSI Studio is owned by Bang Windah and Andi Lukito; this experience was an important step toward professional studio collaboration."
    }
  }
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
    const related=(item.projectIds||[]).map(id=>window.publishedProjects.projects.find(game=>game.placeId===id)).filter(Boolean);
    const locale=language==='id'?'id-ID':'en-US';
    const studioNote=item.studio? 'AIH Studio: '+new Intl.NumberFormat(locale).format(window.studioProfile.memberCount)+(language==='id'?' anggota · Data Roblox ':' members · Roblox data ')+date(window.studioProfile.capturedAt):'';
    const breakthrough=item.year==='2026'?related.find(game=>game.placeId==='110354587993091'):null;
    const visitNote=breakthrough?'Mie Ayam Sidoarjo: '+new Intl.NumberFormat(locale).format(breakthrough.visits)+(language==='id'?' kunjungan · Data Roblox ':' visits · Roblox data ')+date(window.publishedProjects.capturedAt):'';
    const projectLinks=related.map(game=>`<a class="text-link" href="${esc(game.url)}" target="_blank" rel="noopener noreferrer"><span>${esc(game.name)}</span><span aria-hidden="true">↗</span></a>`).join('');
    detail.setAttribute('aria-labelledby',`journey-tab-${chapter}`);
    detail.innerHTML=`<div class="journey-year-art${related.length?' has-projects':''}"><span>${item.year}</span>${related.length?`<div class="journey-project-art">${related.map(game=>`<a href="${esc(game.url)}" target="_blank" rel="noopener noreferrer" aria-label="${esc(t.openGame+': '+game.name)}"><img src="${esc(game.thumbnail)}" width="140" height="79" alt="${esc(game.name)}"></a>`).join('')}</div>`:`<img src="${esc(item.icon)}" width="90" height="90" alt="">`}</div><div class="journey-story"><p class="eyebrow">${esc(t.chapter)} ${String(chapter+1).padStart(2,'0')} / ${String(chapters.length).padStart(2,'0')}</p><h2>${esc(copy.intro)}</h2><p>${esc(copy.body)}</p>${visitNote?`<p class="journey-note">${esc(visitNote)}</p>`:''}<p class="journey-note">${esc(copy.note)}</p>${copy.highlight?`<p><strong>${esc(copy.highlight)}</strong><br>${esc(copy.highlightBody)}</p>`:''}${studioNote?`<p class="journey-note">${esc(studioNote)}</p>`:''}${projectLinks}${item.studio?`<a class="text-link" href="https://www.roblox.com/share/g/35569543" target="_blank" rel="noopener noreferrer"><span>AIH Studio</span><span aria-hidden="true">↗</span></a>`:''}${item.projects?`<a class="text-link" href="#/projects"><span>${esc(t.seeProjects)}</span><span aria-hidden="true">↗</span></a>`:''}</div>`;
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
