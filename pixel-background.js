/* Visual design credit: Bachtiar Aditya. Rights and exclusions: COPYRIGHT.md.
   Design origin: design-origin-bachtiar-aditya-bachtiarporto-2026 */
(() => {
  'use strict';
  const layer=document.createElement('div');layer.className='floating-pixels';layer.setAttribute('role','group');
  document.body.append(layer);
  const positions=[[3,27,92],[97,70,88],[4,88,86],[96,18,90]];
  const mobilePositions=[[3,28],[97,80]];
  const random=(min,max)=>min+Math.random()*(max-min);
  let currentPage='',pointerFrame=0,protectionFrame=0;
  function protectContent() {
    cancelAnimationFrame(protectionFrame);
    protectionFrame=requestAnimationFrame(()=>{
      protectionFrame=0;
      const boxes=[...document.querySelectorAll('main h1,main h2,main h3,main h4,main p,main .section-description,main .ongoing-card,main .ongoing-home-card,main .thanks-card,main .developer-roblox-card,main .project-card,main .hero-world,main .mascot-float')]
        .map(element=>element.getBoundingClientRect()).filter(rect=>rect.width&&rect.height&&rect.bottom>0&&rect.top<innerHeight);
      layer.querySelectorAll('.floating-pixel').forEach(stage=>{
        const rect=stage.querySelector('button').getBoundingClientRect();
        stage.classList.toggle('is-obscured',boxes.some(box=>rect.right+16>box.left&&rect.left-16<box.right&&rect.bottom+16>box.top&&rect.top-16<box.bottom));
      });
    });
  }
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
        const direction=(index%2===0)!==reverseFirst?1:-1,duration=random(28,52),phase=Math.random();
        // Keep initial angles apart even with independent negative animation phases.
        const angle=orientation+slots[index]*60+random(-12,12)-direction*phase*360;
        const [mx,my]=mobilePositions[index]||[x,y];
        const vars={
          '--float-x':`${x}%`,'--float-y':`${y}%`,
          '--float-mobile-x':`${mx}%`,'--float-mobile-y':`${my}%`,
          '--float-size':`${size+random(-7,7)}px`,'--float-angle':`${angle}deg`,
          '--float-duration':`${duration}s`,'--float-delay':`${-phase*duration}s`,'--float-turn':`${direction*360}deg`,
          '--drift-x1':`${random(-10,10)}px`,'--drift-y1':`${random(4,12)}px`,
          '--drift-x2':`${random(4,12)}px`,'--drift-y2':`${random(-12,-4)}px`,
          '--drift-x3':`${random(-12,-4)}px`,'--drift-y3':`${random(-10,10)}px`
        };
        const style=Object.entries(vars).map(([key,value])=>`${key}:${value}`).join(';');
        return `<div class="floating-pixel" data-pixel-art="${shape}" data-pixel-background data-pixel-page="${page}" data-float-index="${index}" style="${style}"><div class="floating-drift"><button class="pixel-heart-play" type="button"><span class="pixel-heart-grid" aria-hidden="true"></span></button></div></div>`;
      }).join('');
    }
    window.portfolioPixelArt.refresh();
    protectContent();
  }
  // Background art stays underneath the page. Only empty-space clicks reach it,
  // so it never captures a link, selection, or text that is in front of it.
  function emptySpace(target) {
    return target instanceof Element&&!target.closest('a,button,input,select,textarea,summary,label,dialog,[role="dialog"],[role="tab"],[contenteditable],.site-header,.page-transition,p,h1,h2,h3,h4,li,dt,dd,[data-i18n]')&&document.getSelection()?.isCollapsed!==false;
  }
  function hit(x,y) {
    return [...layer.querySelectorAll('.floating-pixel')].find(stage=>{
      if(stage.classList.contains('is-obscured')||(innerWidth<=640&&Number(stage.dataset.floatIndex)>=2))return false;
      const rect=stage.querySelector('button').getBoundingClientRect();
      return x>=rect.left&&x<=rect.right&&y>=rect.top&&y<=rect.bottom;
    });
  }
  document.addEventListener('click',event=>{
    if(event.defaultPrevented||event.button!==0||!emptySpace(event.target))return;
    const stage=hit(event.clientX,event.clientY);
    if(stage)window.portfolioPixelArt.play(stage,event);
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
  addEventListener('scroll',protectContent,{passive:true});
  sync();
})();
