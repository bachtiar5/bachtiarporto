/* Visual design credit: Bachtiar Aditya. Rights and exclusions: COPYRIGHT.md.
   Design origin: design-origin-bachtiar-aditya-bachtiarporto-2026 */
(() => {
  'use strict';
  const esc=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  function render() {
    const en=document.documentElement.lang==='en',lang=en?'en':'id';
    const t=en?{status:'In progress',live:'Published · Ongoing',home:'What I’m building now',page:'Projects I’m working on',view:'See the progress',photos:'View progress photos',note:'Not published yet. Roblox statistics will be available after release.',likes:'Likes',active:'Active players',favorites:'Favorites',visits:'Visits',released:'Published games',unavailable:'Not available before release',role:'My role',open:'View on Roblox',photoCount:'photos',captured:'Roblox data captured'}:{status:'Sedang digarap',live:'Sudah rilis · Masih dikembangkan',home:'Yang lagi kukerjakan',page:'Proyek yang sedang kukerjakan',view:'Lihat progresnya',photos:'Lihat foto progres',note:'Belum dipublikasikan. Statistik Roblox tersedia setelah rilis.',likes:'Like',active:'Pemain aktif',favorites:'Favorit',visits:'Kunjungan',released:'Game yang sudah rilis',unavailable:'Belum tersedia sebelum rilis',role:'Peranku',open:'Lihat di Roblox',photoCount:'foto',captured:'Data Roblox diambil'};
    const local=value=>value?.[lang]||value?.id||'';
    const snapshot=window.publishedProjects;
    const projects=(window.ongoingProjects||[]).map(item=>{
      const published=item.publishedPlaceId?snapshot.projects.find(game=>game.placeId===item.publishedPlaceId):null;
      if(item.publishedPlaceId&&!published)return null;
      return published?{...item,published,title:{id:published.name,en:published.name},role:published.role,description:published.contribution,images:[published.thumbnail]}:item;
    }).filter(Boolean);
    const home=document.querySelector('[data-ongoing-home]'),page=document.querySelector('[data-ongoing-projects]');
    [home,page].forEach(root=>document.dispatchEvent(new CustomEvent('portfolio:beforecontent',{detail:{root}})));
    home.hidden=page.hidden=projects.length===0;
    const badge=project=>`<span class="ongoing-badge${project.published?' ongoing-badge-live':''}"><i aria-hidden="true"></i>${project.published?t.live:t.status}</span>`;
    const image=(project,homeCard=false)=>{
      const photo=`<img src="${esc(project.images[0])}" width="768" height="480" loading="lazy" decoding="async" alt="${esc(local(project.title))}">`;
      const overlay=`<span class="ongoing-photo-label">${project.published?t.open:project.images.length+' '+t.photoCount}<span aria-hidden="true">↗</span></span>`;
      const className=homeCard?'ongoing-home-image':'ongoing-cover';
      return project.published?`<a class="${className}" href="${esc(project.published.url)}" target="_blank" rel="noopener noreferrer">${photo}${overlay}</a>`:`<button class="${className}" type="button" data-gallery="${esc(project.id)}" aria-label="${esc(t.photos+' '+local(project.title))}">${photo}${overlay}</button>`;
    };
    const role=project=>`<p class="ongoing-role"><span>${t.role}</span><strong>${esc(local(project.role))}</strong></p>`;
    home.innerHTML=projects.length?`<div class="ongoing-home-heading"><p class="eyebrow">${t.status}</p><h2 id="ongoing-home-title">${t.home}</h2></div><div class="ongoing-home-grid">`+projects.map(project=>`<article class="ongoing-home-card">${image(project,true)}<div class="ongoing-home-copy">${badge(project)}<h3>${esc(local(project.title))}</h3>${role(project)}<a class="text-link" href="#/projects">${t.view}<span aria-hidden="true">↗</span></a></div></article>`).join('')+'</div>':'';
    const fmt=new Intl.NumberFormat(en?'en-US':'id-ID');
    const metric=(project,key)=>project.published?fmt.format(project.published[key]):'?';
    const peak=project=>{
      if(!project.published)return '?';
      const game=project.published;
      return new Intl.NumberFormat(en?'en-US':'id-ID',{maximumFractionDigits:1}).format(game.peakCcu>=1000?game.peakCcu/1000:game.peakCcu)+(game.peakCcu>=1000?'k':'')+(game.peakCcuLowerBound?'+':'');
    };
    const stamp=new Intl.DateTimeFormat(en?'en-US':'id-ID',{day:'numeric',month:'short',year:'numeric',timeZone:'Asia/Bangkok'}).format(new Date(snapshot.capturedAt));
    page.innerHTML=projects.length?`<header class="ongoing-section-heading"><h2 id="ongoing-projects-title">${t.page}</h2><span>${projects.length} ${en?'projects':'proyek'}</span></header><div class="ongoing-grid">`+projects.map(project=>`<article class="ongoing-card" data-current-project="${esc(project.id)}" data-current-published="${Boolean(project.published)}"><div class="ongoing-media">${image(project)}</div><div class="ongoing-details">${badge(project)}<h3>${esc(local(project.title))}</h3>${role(project)}<p class="ongoing-description">${esc(local(project.description))}</p><div class="game-peak"><span>Peak CCU</span><strong${project.published?'':` aria-label="${t.unavailable}"`}>${peak(project)}</strong></div><dl class="game-metrics">${['likes','active','favorites','visits'].map(key=>`<div><dt>${t[key]}</dt><dd${project.published?'':` aria-label="${t.unavailable}"`}>${metric(project,key)}</dd></div>`).join('')}</dl><p class="ongoing-stats-note">${project.published?t.captured+' '+stamp:t.note}</p></div></article>`).join('')+'</div>':'';
    document.querySelector('[data-published-heading]').textContent=t.released;
    document.dispatchEvent(new CustomEvent('portfolio:content'));
  }
  document.addEventListener('portfolio:languagechange',render);
  render();
})();
