(() => {
  'use strict';
  const layer=document.createElement('div');layer.className='floating-pixels';layer.setAttribute('role','group');
  document.body.append(layer);
  const positions=[[5,22,62,-14],[95,36,54,18],[14,78,65,8],[86,81,58,-22],[45,12,46,26],[64,65,50,-8]];
  let currentPage='',pointerFrame=0;
  function sync() {
    const page=document.body.dataset.page||'home',en=document.documentElement.lang==='en';
    layer.setAttribute('aria-label',en?'Playful background pixels':'Ikon piksel di latar belakang');
    layer.classList.toggle('is-suspended',document.hidden||document.documentElement.dataset.welcome==='pending');
    if(page!==currentPage) {
      currentPage=page;
      const type={projects:'hammer',career:'journey','hall-of-fame':'heart'}[page];
      layer.innerHTML=positions.map(([x,y,size,angle],index)=>{
        const shape=type||['hammer','heart','journey','heart','hammer','journey'][index];
        return `<div class="floating-pixel" data-pixel-art="${shape}" data-pixel-background data-pixel-page="${page}" data-float-index="${index}" style="--float-x:${x}%;--float-y:${y}%;--float-size:${size}px;--float-angle:${angle}deg;--float-duration:${64+index*9}s;--float-delay:${-index*11}s"><div class="floating-drift"><button class="pixel-heart-play" type="button"><span class="pixel-heart-grid" aria-hidden="true"></span></button></div></div>`;
      }).join('');
    }
    window.portfolioPixelArt.refresh();
  }
  // Background art stays underneath the page. Only empty-space clicks reach it,
  // so it never captures a link, selection, or text that is in front of it.
  function emptySpace(target) {
    return target instanceof Element&&!target.closest('a,button,input,select,textarea,summary,label,dialog,[role="dialog"],[role="tab"],[contenteditable],.site-header,.page-transition,p,h1,h2,h3,h4,li,dt,dd,[data-i18n]')&&document.getSelection()?.isCollapsed!==false;
  }
  function hit(x,y) {
    return [...layer.querySelectorAll('.floating-pixel')].find(stage=>{
      if(innerWidth<=640&&Number(stage.dataset.floatIndex)>=4)return false;
      const rect=stage.querySelector('button').getBoundingClientRect();
      return x>=rect.left&&x<=rect.right&&y>=rect.top&&y<=rect.bottom;
    });
  }
  document.addEventListener('click',event=>{
    if(event.defaultPrevented||event.button!==0||!emptySpace(event.target))return;
    const stage=hit(event.clientX,event.clientY);
    if(stage)window.portfolioPixelArt.play(stage);
  });
  document.addEventListener('pointermove',event=>{
    if(event.pointerType==='touch')return;
    cancelAnimationFrame(pointerFrame);
    pointerFrame=requestAnimationFrame(()=>{
      pointerFrame=0;
      const stage=emptySpace(event.target)?hit(event.clientX,event.clientY):null;
      layer.querySelectorAll('.floating-pixel').forEach(item=>item.classList.toggle('is-near',item===stage));
    });
  },{passive:true});
  document.documentElement.addEventListener('pointerleave',()=>{
    cancelAnimationFrame(pointerFrame);pointerFrame=0;
    layer.querySelectorAll('.floating-pixel').forEach(item=>item.classList.remove('is-near'));
  });
  document.addEventListener('portfolio:content',sync);
  document.addEventListener('portfolio:languagechange',sync);
  document.addEventListener('portfolio:welcomecomplete',sync);
  document.addEventListener('visibilitychange',()=>{
    cancelAnimationFrame(pointerFrame);pointerFrame=0;sync();
  });
  addEventListener('resize',sync);
  sync();
})();
