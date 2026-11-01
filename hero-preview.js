(() => {
  'use strict';
  const root=document.querySelector('.hero-visual');
  const frame=root.querySelector('.world-frame'),picture=frame.querySelector('.hero-world');
  const curtain=frame.querySelector('.preview-curtain'),counter=root.querySelector('.preview-position');
  const pause=root.querySelector('[data-preview-pause]');
  const motion=matchMedia('(prefers-reduced-motion: reduce)');
  const data=window.portfolioData;
  const slides=(data.heroImages||data.projects.find(project=>project.id==='build')?.images||[]).map(src=>({src,title:{id:'Cuplikan map karya Bachtiar',en:'A map by Bachtiar'}}));
  if(!slides.length)return;
  let index=0,timer=0,busy=false,visible=false,hovered=false,focused=false,paused=motion.matches;
  const language=()=>document.documentElement.lang==='en'?'en':'id';
  const allowed=()=>visible&&!document.hidden&&!hovered&&!focused&&!paused&&!busy;
  function schedule() {
    clearTimeout(timer);
    if(allowed())timer=setTimeout(()=>change(1),6000);
  }
  function labels() {
    const en=language()==='en';
    root.querySelector('[data-preview-step="-1"]').setAttribute('aria-label',en?'Previous preview':'Cuplikan sebelumnya');
    root.querySelector('[data-preview-step="1"]').setAttribute('aria-label',en?'Next preview':'Cuplikan berikutnya');
    pause.setAttribute('aria-label',paused?(en?'Play previews':'Putar cuplikan'):(en?'Pause previews':'Jeda cuplikan'));
    pause.setAttribute('aria-pressed',String(paused));
    pause.textContent=paused?'▶':'Ⅱ';
    counter.textContent=`${String(index+1).padStart(2,'0')} / ${String(slides.length).padStart(2,'0')}`;
    picture.alt=slides[index].title[language()];
  }
  async function change(direction) {
    if(busy)return;
    clearTimeout(timer);busy=true;
    const next=(index+direction+slides.length)%slides.length,slide=slides[next];
    try {
      const preload=new Image();preload.src=slide.src;await preload.decode();
      if(!motion.matches)await curtain.animate([{transform:'translateY(105%)'},{transform:'translateY(0)'}],{duration:230,easing:'cubic-bezier(.65,0,.35,1)',fill:'forwards'}).finished;
      picture.src=slide.src;index=next;labels();
      if(!motion.matches) {
        picture.animate([{transform:'scale(1.08)'},{transform:'scale(1)'}],{duration:950,easing:'cubic-bezier(.16,1,.3,1)'});
        await curtain.animate([{transform:'translateY(0)'},{transform:'translateY(-105%)'}],{duration:390,delay:50,easing:'cubic-bezier(.65,0,.35,1)',fill:'forwards'}).finished;
      }
    } catch {
      // Keep the current image if an asset cannot be loaded.
    } finally {
      curtain.getAnimations().forEach(animation=>animation.cancel());
      busy=false;schedule();
    }
  }
  root.querySelectorAll('[data-preview-step]').forEach(button=>button.addEventListener('click',()=>change(Number(button.dataset.previewStep))));
  pause.addEventListener('click',()=>{paused=!paused;labels();schedule();});
  root.addEventListener('pointerenter',event=>{if(event.pointerType!=='touch'){hovered=true;schedule();}});
  root.addEventListener('pointerleave',()=>{hovered=false;schedule();});
  root.addEventListener('focusin',()=>{focused=true;schedule();});
  root.addEventListener('focusout',event=>{focused=root.contains(event.relatedTarget);schedule();});
  document.addEventListener('visibilitychange',schedule);
  document.addEventListener('portfolio:languagechange',labels);
  motion.addEventListener('change',()=>{if(motion.matches)paused=true;labels();schedule();});
  new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;schedule();},{threshold:.3}).observe(frame);
  labels();
})();
