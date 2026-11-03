/* Visual design credit: Bachtiar Aditya. Rights and exclusions: COPYRIGHT.md.
   Design origin: design-origin-bachtiar-aditya-bachtiarporto-2026 */
(() => {
  'use strict';
  const easing='cubic-bezier(.65,0,.35,1)';
  window.portfolioTransition=async ({curtain,content,rule},phase)=>{
    const intro=phase==='intro',cover=phase==='cover'||intro;
    const animations=[curtain.animate(
      [{transform:cover&&!intro?'translateY(100%)':'translateY(0)'},{transform:cover?'translateY(0)':'translateY(-100%)'}],
      {duration:cover?280:340,delay:cover?0:50,easing,fill:'forwards'})];
    if(content)animations.push(content.animate(
      cover?[{opacity:0,transform:'translateY(14px)'},{opacity:1,transform:'translateY(0)'}]:[{opacity:1,transform:'translateY(0)'},{opacity:0,transform:'translateY(-12px)'}],
      {duration:cover?300:150,delay:cover?70:0,easing:cover?'cubic-bezier(.16,1,.3,1)':'ease-in',fill:'forwards'}));
    if(rule&&cover)animations.push(rule.animate([{transform:'scaleX(0)'},{transform:'scaleX(1)'}],{duration:330,delay:50,easing:'ease-out',fill:'forwards'}));
    await Promise.allSettled(animations.map(animation=>animation.finished));
  };
})();
