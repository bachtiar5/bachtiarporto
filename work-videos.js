(() => {
  'use strict';
  const players = document.querySelectorAll('.work-video details');
  function updateTitle(details, frame) {
    frame.title = details.closest('article').querySelector('h4').textContent;
  }

  for (const details of players) {
    const slot = details.querySelector('.work-video-player');
    details.addEventListener('toggle', () => {
      if (!details.open) {
        slot.replaceChildren();
        return;
      }
      if (slot.firstElementChild) return;
      const frame = document.createElement('iframe');
      frame.src = `https://www.instagram.com/reel/${details.dataset.reel}/embed/`;
      frame.allow = 'autoplay; fullscreen';
      frame.allowFullscreen = true;
      updateTitle(details, frame);
      slot.append(frame);
    });
  }

  document.addEventListener('portfolio:languagechange', () => {
    for (const details of players) {
      const frame = details.querySelector('iframe');
      if (frame) updateTitle(details, frame);
    }
  });
  document.addEventListener('portfolio:content', () => {
    if (document.body.dataset.page === 'home') return;
    for (const details of players) details.open = false;
  });
})();
