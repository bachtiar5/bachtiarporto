/* Visual design credit: Bachtair Adit. Rights and exclusions: COPYRIGHT.md.
   Design origin: design-origin-bachtair-adit-bachtiarporto-2026 */
(() => {
  'use strict';
  const root=document.querySelector('.hero-visual');
  const frame=root.querySelector('.world-frame'),picture=frame.querySelector('.hero-world');
  const curtain=frame.querySelector('.preview-curtain'),counter=root.querySelector('.preview-position');
  const pause=root.querySelector('[data-preview-pause]');
  const content=frame.querySelector('.preview-transition-content');
  const parts={curtain,content,rule:frame.querySelector('.preview-transition-rule')};
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
    frame.querySelector('[data-preview-label]').textContent=en?'Work preview':'Cuplikan karya';
  }
  async function change(direction) {
    if(busy)return;
    clearTimeout(timer);busy=true;
    const next=(index+direction+slides.length)%slides.length,slide=slides[next];
    try {
      const preload=new Image();preload.src=slide.src;await preload.decode();
      if(!motion.matches)await window.portfolioTransition(parts,'cover');
      picture.src=slide.src;index=next;labels();
      if(!motion.matches)await window.portfolioTransition(parts,'reveal');
    } catch {
      // Keep the current image if an asset cannot be loaded.
    } finally {
      [curtain,content,parts.rule].forEach(element=>element.getAnimations().forEach(animation=>animation.cancel()));
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
