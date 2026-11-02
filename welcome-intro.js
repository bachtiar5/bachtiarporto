(() => {
  'use strict';
  const intro=document.querySelector('.welcome-intro');
  if(document.documentElement.dataset.welcome!=='pending'){intro.remove();return;}
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const en=document.documentElement.lang==='en';
  const skip=intro.querySelector('button');
  intro.setAttribute('aria-label',en?'Welcome to Bachtiar’s portfolio':'Selamat datang di portofolio Bachtiar');
  skip.textContent=en?'Skip intro':'Lewati intro';
  const previousFocus=document.activeElement;
  const background=[...document.body.children].filter(element=>element!==intro&&element.tagName!=='SCRIPT').map(element=>({element,inert:element.inert}));
  const previousOverflow=document.body.style.overflow;
  let finished=false,timer=0,keyboardUsed=false;
  const parts={curtain:intro.querySelector('.welcome-curtain'),content:intro.querySelector('.welcome-content'),rule:intro.querySelector('.welcome-rule')};
  function finish() {
    if(finished)return;
    finished=true;clearTimeout(timer);
    const focusWasInside=intro.contains(document.activeElement);
    intro.getAnimations({subtree:true}).forEach(animation=>animation.cancel());
    background.forEach(({element,inert})=>{element.inert=inert;});
    document.body.style.overflow=previousOverflow;
    delete document.documentElement.dataset.welcome;
    intro.remove();
    document.removeEventListener('keydown',escape);
    if(focusWasInside&&keyboardUsed) {
      const destination=previousFocus!==document.body&&previousFocus.matches('a,button,input,select,textarea')?previousFocus:document.querySelector('.skip-link');
      destination?.focus({preventScroll:true});
    }
  }
  const escape=event=>{if(event.key==='Tab')keyboardUsed=true;if(event.key==='Escape'){keyboardUsed=true;event.preventDefault();finish();}};
  skip.addEventListener('click',event=>{if(event.detail===0)keyboardUsed=true;finish();});
  document.addEventListener('keydown',escape);
  reduced.addEventListener('change',()=>{if(reduced.matches)finish();},{once:true});
  try {
    sessionStorage.setItem('bachtiar-welcome-seen','1');
  } catch {}
  if(reduced.matches){finish();return;}
  background.forEach(({element})=>{element.inert=true;});
  document.body.style.overflow='hidden';
  skip.focus({preventScroll:true});
  timer=setTimeout(finish,2600);
  (async()=>{
    try {
      await window.portfolioTransition(parts,'cover');
      if(finished)return;
      await new Promise(resolve=>setTimeout(resolve,450));
      if(finished)return;
      await window.portfolioTransition(parts,'reveal');
    } finally {finish();}
  })().catch(finish);
})();
