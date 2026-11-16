/* Pause the CSS atmosphere outside the hero; no continuous JavaScript rendering. */
(() => {
  const hero=document.querySelector('.hero');
  if(!hero||!('IntersectionObserver' in window))return;
  const observer=new IntersectionObserver(([entry])=>hero.classList.toggle('is-atmosphere-paused',!entry.isIntersecting),{threshold:0});
  observer.observe(hero);
})();
