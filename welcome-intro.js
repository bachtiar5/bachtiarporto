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
  let finished=false,timer=0;
  const animations=[];
  function finish() {
    if(finished)return;
    finished=true;clearTimeout(timer);
    const focusWasInside=intro.contains(document.activeElement);
    animations.forEach(animation=>animation.cancel());
    background.forEach(({element,inert})=>{element.inert=inert;});
    document.body.style.overflow=previousOverflow;
    delete document.documentElement.dataset.welcome;
    intro.remove();
    document.removeEventListener('keydown',escape);
    if(focusWasInside) {
      const destination=previousFocus!==document.body?previousFocus:document.querySelector(`#${document.body.dataset.page||'home'}-page h1`);
      if(destination){destination.setAttribute('tabindex','-1');destination.focus({preventScroll:true});}
    }
  }
  const escape=event=>{if(event.key==='Escape'){event.preventDefault();finish();}};
  skip.addEventListener('click',finish);
  document.addEventListener('keydown',escape);
  reduced.addEventListener('change',()=>{if(reduced.matches)finish();},{once:true});
  try {
    sessionStorage.setItem('bachtiar-welcome-seen','1');
  } catch {}
  if(reduced.matches){finish();return;}
  background.forEach(({element})=>{element.inert=true;});
  document.body.style.overflow='hidden';
  skip.focus({preventScroll:true});
  try {
    const play=(element,frames,options)=>{const animation=element.animate(frames,{fill:'both',...options});animations.push(animation);return animation;};
    play(intro.querySelector('.welcome-mascot'),[{opacity:0,transform:'translateY(22px) scale(.86) rotate(-6deg)'},{opacity:1,transform:'translateY(0) scale(1) rotate(0)'}],{duration:450,easing:'cubic-bezier(.16,1,.3,1)'});
    play(intro.querySelector('.welcome-name'),[{opacity:0,transform:'translateY(16px)'},{opacity:1,transform:'translateY(0)'}],{duration:380,delay:170,easing:'cubic-bezier(.16,1,.3,1)'});
    play(intro.querySelector('.welcome-rule'),[{transform:'scaleX(0)'},{transform:'scaleX(1)'}],{duration:500,delay:180,easing:'ease-out'});
    play(intro.querySelector('.welcome-content'),[{opacity:1},{opacity:0,transform:'translateY(-12px)'}],{duration:180,delay:870,easing:'ease-in'});
    play(intro,[{transform:'translateY(0)'},{transform:'translateY(-100%)'}],{duration:470,delay:980,easing:'cubic-bezier(.65,0,.35,1)'}).finished.then(finish,finish);
    timer=setTimeout(finish,1800);
  } catch {finish();}
})();
