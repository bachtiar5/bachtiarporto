(() => {
  'use strict';
  const shape=[
    '001110000011100','011111000111110','111111101111111',
    '111111111111111','111111111111111','011111111111110',
    '001111111111100','000111111111000','000011111110000',
    '000001111100000','000000111000000','000000010000000'
  ];
  const motion=matchMedia('(prefers-reduced-motion: reduce)');
  let state=null;
  function cancel() {
    if(!state)return;
    cancelAnimationFrame(state.frame);state.frame=0;
    state.animations.forEach(animation=>animation.cancel());state.animations=[];
    state.generation++;
    state.busy=false;
  }
  function assemble(scatter=false) {
    if(!state||state.busy)return;
    const current=state;
    cancel();
    const generation=current.generation;
    current.stage.classList.remove('heart-thanked');
    if(motion.matches) {current.stage.classList.add('heart-thanked');return;}
    current.busy=true;
    current.pixels.forEach(({element,x,y},index)=>{
      element.style.removeProperty('transform');
      const angle=Math.random()*Math.PI*2,distance=100+Math.random()*180;
      const offset=`translate(${Math.cos(angle)*distance}px,${Math.sin(angle)*distance}px) rotate(${Math.random()*180-90}deg) scale(.2)`;
      const frames=scatter?[
        {transform:'translate(0,0) scale(1)',opacity:1,offset:0},
        {transform:offset,opacity:.35,offset:.32},
        {transform:'translate(0,0) scale(1)',opacity:1,offset:1}
      ]:[{transform:offset,opacity:0},{transform:'translate(0,0) rotate(0) scale(1)',opacity:1}];
      const animation=element.animate(frames,{
        duration:scatter?1350:850,delay:scatter?Math.random()*90:(x+y)*26+Math.random()*110,
        easing:'cubic-bezier(.16,1,.3,1)',fill:'backwards'
      });
      current.animations.push(animation);
    });
    Promise.allSettled(current.animations.map(animation=>animation.finished)).then(()=>{
      if(state!==current||current.generation!==generation)return;
      current.busy=false;current.animations=[];
    });
  }
  function mount() {
    const stage=document.querySelector('[data-pixel-heart]');
    if(!stage)return;
    if(state?.stage!==stage) {
      cancel();
      state={stage,pixels:[],animations:[],frame:0,busy:false,active:false,generation:0};
      const grid=stage.querySelector('.pixel-heart-grid');
      shape.forEach((row,y)=>[...row].forEach((cell,x)=>{
        if(cell!=='1')return;
        const element=document.createElement('span');element.className='heart-pixel';
        element.style.setProperty('--px',x);element.style.setProperty('--py',y);
        element.style.setProperty('--shade',String((x+y)%4));
        if(x<6&&y<4)element.classList.add('heart-pixel-highlight');
        grid.append(element);state.pixels.push({element,x,y});
      }));
      stage.querySelector('.pixel-heart-play').addEventListener('click',()=>assemble(true));
      stage.querySelector('[data-heart-replay]').addEventListener('click',()=>assemble());
      stage.querySelector('.pixel-heart-play').addEventListener('pointermove',event=>{
        if(!state||state.stage!==stage||state.busy||motion.matches||event.pointerType==='touch')return;
        const current=state;cancelAnimationFrame(current.frame);
        current.frame=requestAnimationFrame(()=>{
          current.frame=0;if(state!==current||current.busy)return;
          const rect=grid.getBoundingClientRect(),unit=rect.width/15;
          const mx=event.clientX-rect.left,my=event.clientY-rect.top;
          current.pixels.forEach(({element,x,y})=>{
            const dx=(x+.5)*unit-mx,dy=(y+.5)*unit-my,d=Math.hypot(dx,dy);
            const force=Math.max(0,1-d/(unit*3))*12;
            element.style.transform=`translate(${dx/(d||1)*force}px,${dy/(d||1)*force}px)`;
          });
        });
      });
      stage.querySelector('.pixel-heart-play').addEventListener('pointerleave',()=>{
        if(state?.stage!==stage)return;
        cancelAnimationFrame(state.frame);state.frame=0;
        state.pixels.forEach(({element})=>element.style.removeProperty('transform'));
      });
    }
    const active=document.body.dataset.page==='hall-of-fame'&&!document.hidden&&document.documentElement.dataset.welcome!=='pending';
    if(active&&!state.active)assemble();
    if(!active)cancel();
    state.active=active;
  }
  document.addEventListener('portfolio:beforecontent',event=>{
    if(state&&event.detail?.root?.contains(state.stage)){cancel();state=null;}
  });
  document.addEventListener('portfolio:content',mount);
  document.addEventListener('portfolio:welcomecomplete',mount);
  document.addEventListener('visibilitychange',mount);
  motion.addEventListener('change',()=>{cancel();mount();});
  mount();
})();
