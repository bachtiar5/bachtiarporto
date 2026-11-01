(() => {
  const plate=document.querySelector('.studio-baseplate');
  if(!plate)return;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const pointer=matchMedia('(hover: hover) and (pointer: fine)');
  let frame=0,latest=null;
  function reset() {
    cancelAnimationFrame(frame);frame=0;latest=null;
    plate.classList.remove('is-pointer-active');
    plate.style.setProperty('--grid-x','0px');plate.style.setProperty('--grid-y','0px');
  }
  document.addEventListener('pointermove',event=>{
    if(reduced.matches||!pointer.matches||document.hidden||event.pointerType==='touch')return;
    latest={x:event.clientX,y:event.clientY};
    if(frame)return;
    frame=requestAnimationFrame(()=>{
      frame=0;if(!latest)return;
      plate.classList.add('is-pointer-active');
      plate.style.setProperty('--grid-x',`${(latest.x/innerWidth-.5)*12}px`);
      plate.style.setProperty('--grid-y',`${(latest.y/innerHeight-.5)*12}px`);
      plate.style.setProperty('--spot-x',`${latest.x}px`);plate.style.setProperty('--spot-y',`${latest.y}px`);
    });
  },{passive:true});
  document.documentElement.addEventListener('pointerleave',reset);
  document.addEventListener('visibilitychange',()=>{if(document.hidden)reset();});
  reduced.addEventListener('change',reset);pointer.addEventListener('change',reset);
})();
