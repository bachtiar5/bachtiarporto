/* Visual design credit: Bachtiar Aditya. Rights and exclusions: COPYRIGHT.md.
   Design origin: design-origin-bachtiar-aditya-bachtiarporto-2026 */
(() => {
  'use strict';
  const intro=document.querySelector('.welcome-intro');
  if(document.documentElement.dataset.welcome!=='pending'){intro.remove();return;}
  clearTimeout(window.portfolioWelcomeTimeout);
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const en=document.documentElement.lang==='en';
  const skip=intro.querySelector('button');
  intro.setAttribute('aria-label',en?'Welcome to Bachtiar’s portfolio':'Selamat datang di portofolio Bachtiar');
  skip.textContent=en?'Skip intro':'Lewati intro';
  const name=intro.querySelector('.welcome-name');
  name.setAttribute('aria-label','bachtiar.');
  name.replaceChildren(...[...'bachtiar.'].map(letter=>{const span=document.createElement('span');span.className='welcome-glyph';span.textContent=letter;span.setAttribute('aria-hidden','true');return span;}));
  const subtitle=document.createElement('p');subtitle.className='welcome-subtitle';subtitle.textContent='IMAGINE. BUILD. PLAY.';
  intro.querySelector('.welcome-rule').before(subtitle);
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
    document.dispatchEvent(new CustomEvent('portfolio:welcomecomplete'));
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
      const mascot=intro.querySelector('.welcome-mascot');
      mascot.animate([{opacity:0,transform:'translateY(22px) scale(.88) rotate(-7deg)'},{opacity:1,transform:'translateY(-4px) scale(1.02) rotate(1deg)',offset:.78},{opacity:1,transform:'translateY(0) scale(1) rotate(0)'}],{duration:620,delay:70,easing:'cubic-bezier(.16,1,.3,1)',fill:'both'});
      name.querySelectorAll('.welcome-glyph').forEach((glyph,index)=>glyph.animate([{transform:'translateY(110%)',opacity:0},{transform:'translateY(0)',opacity:1}],{duration:470,delay:150+index*36,easing:'cubic-bezier(.16,1,.3,1)',fill:'both'}));
      subtitle.animate([{opacity:0,transform:'translateY(8px)'},{opacity:.7,transform:'translateY(0)'}],{duration:360,delay:450,fill:'both'});
      await window.portfolioTransition(parts,'intro');
      if(finished)return;
      await new Promise(resolve=>setTimeout(resolve,650));
      if(finished)return;
      await window.portfolioTransition(parts,'reveal');
    } finally {finish();}
  })().catch(finish);
})();
