(() => {
  'use strict';
  const layer=document.createElement('div');layer.className='floating-pixels';layer.setAttribute('role','group');
  document.body.append(layer);
  const positions=[[9,24,126],[90,49,116],[23,82,130],[77,84,122],[52,19,108],[43,54,112]];
  const mobilePositions=[[13,23],[86,42],[16,76],[80,85]];
  const random=(min,max)=>min+Math.random()*(max-min);
  let currentPage='',pointerFrame=0;
  function sync() {
    const page=document.body.dataset.page||'home',en=document.documentElement.lang==='en';
    layer.setAttribute('aria-label',en?'Playful background pixels':'Ikon piksel di latar belakang');
    layer.classList.toggle('is-suspended',document.hidden||document.documentElement.dataset.welcome==='pending');
    if(page!==currentPage) {
      currentPage=page;
      const type={projects:'hammer',career:'journey','hall-of-fame':'heart'}[page];
      const orientation=random(0,360),reverseFirst=Math.random()<.5;
      const slots=[...positions.keys()];
      for(let i=slots.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[slots[i],slots[j]]=[slots[j],slots[i]];}
      layer.innerHTML=positions.map(([x,y,size],index)=>{
        const shape=type||['hammer','heart','journey','heart','hammer','journey'][index];
        const direction=(index%2===0)!==reverseFirst?1:-1,duration=random(58,115),phase=Math.random();
        // Keep initial angles apart even with independent negative animation phases.
        const angle=orientation+slots[index]*60+random(-12,12)-direction*phase*360;
        const [mx,my]=mobilePositions[index]||[x,y];
        const vars={
          '--float-x':`${x+random(-3,3)}%`,'--float-y':`${y+random(-3,3)}%`,
          '--float-mobile-x':`${mx+random(-2,2)}%`,'--float-mobile-y':`${my+random(-2,2)}%`,
          '--float-size':`${size+random(-7,7)}px`,'--float-angle':`${angle}deg`,
          '--float-duration':`${duration}s`,'--float-delay':`${-phase*duration}s`,'--float-turn':`${direction*360}deg`,
          '--drift-x1':`${random(-40,40)}px`,'--drift-y1':`${random(12,34)}px`,
          '--drift-x2':`${random(14,40)}px`,'--drift-y2':`${random(-34,-12)}px`,
          '--drift-x3':`${random(-36,-12)}px`,'--drift-y3':`${random(-35,30)}px`
        };
        const style=Object.entries(vars).map(([key,value])=>`${key}:${value}`).join(';');
        return `<div class="floating-pixel" data-pixel-art="${shape}" data-pixel-background data-pixel-page="${page}" data-float-index="${index}" style="${style}"><div class="floating-drift"><button class="pixel-heart-play" type="button"><span class="pixel-heart-grid" aria-hidden="true"></span></button></div></div>`;
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
