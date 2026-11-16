(() => {
  'use strict';
  const videos = [...document.querySelectorAll('[data-video-src]')];
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const player = document.querySelector('.work-video-dialog');
  const fullVideo = player.querySelector('video');
  const closeButton = player.querySelector('.work-video-close');
  let opener;
  const visible = new Set();
  const autoResume = new Set(videos);
  const canPlay = () => !document.hidden
    && !document.querySelector('dialog[open]')
    && document.body.dataset.page === 'home'
    && document.documentElement.dataset.welcome !== 'pending';

  function updatePlayback() {
    for (const video of videos) {
      const fullscreen = document.fullscreenElement;
      const onScreen = fullscreen ? fullscreen === video : visible.has(video);
      if (!canPlay() || !onScreen) {
        if (!video.paused) autoResume.add(video);
        video.pause();
        continue;
      }
      // Assign the source near the viewport so the rest of the page loads first.
      if (!video.hasAttribute('src')) video.src = video.dataset.videoSrc;
      if (!reducedMotion.matches && !video.error && video.paused && autoResume.has(video)) {
        video.play().catch(() => {});
      }
    }
  }

  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (entry.intersectionRatio >= 0.55) visible.add(entry.target);
      else visible.delete(entry.target);
    }
    updatePlayback();
  }, {threshold: 0.55});

  for (const video of videos) {
    const card = video.closest('.work-video');
    video.setAttribute('aria-label', card.querySelector('h4').textContent);
    video.addEventListener('playing', () => autoResume.delete(video));
    video.addEventListener('volumechange', () => {
      if (video.muted || video.volume === 0) return;
      for (const other of videos) {
        if (other !== video) other.muted = true;
      }
    });
    video.addEventListener('error', () => {
      card.querySelector('.work-video-error').hidden = false;
    });
    observer.observe(video);
  }

  for (const link of document.querySelectorAll('.work-video-full')) {
    link.addEventListener('click', event => {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      opener = link;
      player.querySelector('h2').textContent = link.closest('article').querySelector('h4').textContent;
      closeButton.setAttribute('aria-label', document.documentElement.lang === 'id' ? 'Tutup video' : 'Close video');
      player.showModal();
      updatePlayback();
      fullVideo.src = link.href;
      fullVideo.play().catch(() => {});
    });
  }
  closeButton.addEventListener('click', () => player.close());
  player.addEventListener('close', () => {
    fullVideo.pause();
    fullVideo.removeAttribute('src');
    fullVideo.load();
    opener?.focus({preventScroll:true});
    updatePlayback();
  });

  document.addEventListener('portfolio:languagechange', () => {
    for (const video of videos) {
      video.setAttribute('aria-label', video.closest('.work-video').querySelector('h4').textContent);
    }
  });
  document.addEventListener('portfolio:content', updatePlayback);
  document.addEventListener('portfolio:welcomecomplete', updatePlayback);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) fullVideo.pause();
    updatePlayback();
  });
  document.addEventListener('fullscreenchange', updatePlayback);
  const gallery = document.querySelector('#gallery-dialog');
  new MutationObserver(updatePlayback).observe(gallery, {attributes:true, attributeFilter:['open']});
})();
