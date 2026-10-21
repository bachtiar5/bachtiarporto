/* ==========================================================================
   BACHTIAR ADITYA — SCRIPTING & INTERACTIONS
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Auto-update Current Year
  const yearEl = document.getElementById('current-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // 2. Toast Notification Function
  const toast = document.getElementById('toast-notice');
  let toastTimer = null;

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 2400);
  }

  // 3. Centralized Discord Copy Handler
  const DISCORD_TAG = 'tahubulat';

  function copyDiscord(triggerButton) {
    navigator.clipboard.writeText(DISCORD_TAG).then(() => {
      showToast(`Discord tag "${DISCORD_TAG}" berhasil disalin`);
      if (triggerButton) {
        const originalText = triggerButton.getAttribute('data-original-text') || triggerButton.textContent;
        if (!triggerButton.getAttribute('data-original-text')) {
          triggerButton.setAttribute('data-original-text', originalText);
        }
        triggerButton.textContent = 'Tersalin ✓';
        triggerButton.classList.add('copied');

        setTimeout(() => {
          triggerButton.textContent = triggerButton.getAttribute('data-original-text');
          triggerButton.classList.remove('copied');
        }, 2200);
      }
    }).catch(() => {
      showToast(`Salin manual: ${DISCORD_TAG}`);
    });
  }

  document.querySelectorAll('[data-copy-discord]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      copyDiscord(btn);
    });
  });

  // 4. Archive Gallery Dataset (Real Screenshots)
  const projectGalleries = {
    'level-design': {
      title: 'Map Architecture & Environment',
      caption: 'Desain atmosfer lingkungan, pencahayaan sinematik, dan optimasi part Roblox Studio.',
      images: [
        'image/Archives/MyWork/Screenshot 2026-03-30 155149.png',
        'image/Archives/MyWork/Screenshot 2026-03-30 155213.png',
        'image/Archives/MyWork/Screenshot 2026-03-30 155229.png',
        'image/Archives/MyWork/Screenshot 2026-03-30 155257.png',
        'image/Archives/MyWork/Screenshot 2026-03-30 155356.png',
        'image/Archives/MyWork/Screenshot 2026-06-13 000942.png'
      ]
    },
    'first-collab': {
      title: 'First Collab Design',
      caption: 'Proyek kolaboratif berstandar studio, dirancang untuk alur navigasi pemain yang lancar.',
      images: [
        'image/Archives/FristCollab/Screenshot 2026-02-16 063438.png',
        'image/Archives/FristCollab/Screenshot 2026-03-20 122642.png',
        'image/Archives/FristCollab/Screenshot 2026-03-20 124802.png',
        'image/Archives/FristCollab/Screenshot 2026-03-24 192447.png',
        'image/Archives/FristCollab/Screenshot 2026-03-25 135121.png',
        'image/Archives/FristCollab/Screenshot 2026-03-25 181701.png'
      ]
    },
    'builds': {
      title: 'Custom Props & Scene Builds',
      caption: 'Koleksi set piece, model bangunan kustom, dan penataan prop bertema.',
      images: [
        'image/Archives/Build/Screenshot 2025-12-18 211443.png',
        'image/Archives/Build/Screenshot 2025-12-18 211541.png',
        'image/Archives/Build/Screenshot 2025-12-18 211550.png',
        'image/Archives/Build/Screenshot 2026-02-13 180945.png',
        'image/Archives/Build/Screenshot 2026-02-14 115720.png',
        'image/Archives/Build/Screenshot 2026-03-30 151036.png',
        'image/Archives/Build/Screenshot 2026-05-19 223439.png'
      ]
    },
    'uiux': {
      title: 'Roblox UI/UX Interface',
      caption: 'Desain user interface terukur (Scale/Layout) yang adaptif untuk mobile dan PC.',
      images: [
        'image/Archives/UiUx/Screenshot 2026-03-30 151603.png',
        'image/Archives/UiUx/Screenshot 2026-03-30 151850.png',
        'image/Archives/UiUx/Screenshot 2026-03-30 151923.png',
        'image/Archives/UiUx/Screenshot 2026-06-13 000835.png',
        'image/Archives/UiUx/Screenshot 2026-06-13 000859.png'
      ]
    },
    'luau-code': {
      title: 'NPC Manager & Scripting Systems',
      caption: 'Sistem skrip modular dengan logging print-tracking dan penanganan error terpusat.',
      images: [
        'image/Archives/LuaUCode/Screenshot 2026-06-13 001441.png',
        'image/Archives/LuaUCode/Screenshot 2026-06-13 001454.png',
        'image/Archives/LuaUCode/Screenshot 2026-06-13 001607.png',
        'image/Archives/LuaUCode/Screenshot 2026-06-13 001644.png',
        'image/Archives/LuaUCode/Screenshot 2026-06-13 001747.png'
      ]
    },
    'gallery': {
      title: 'Visual Archives',
      caption: 'Dokumentasi acak proses kreatif dan eksperimen visual selama pengembangan.',
      images: [
        'image/Archives/Gallery/Cuplikan layar 2025-08-30 115417.png',
        'image/Archives/Gallery/Cuplikan layar 2025-09-20 130632.png',
        'image/Archives/Gallery/Cuplikan layar 2025-09-25 220621.png',
        'image/Archives/Gallery/Screenshot 2025-11-18 191212.png',
        'image/Archives/Gallery/Screenshot 2026-01-30 175806.png'
      ]
    }
  };

  // 5. Modal Gallery Controls
  const modal = document.getElementById('gallery-modal');
  const modalTitle = document.getElementById('modal-title');
  const modalImg = document.getElementById('modal-img');
  const modalCaption = document.getElementById('modal-caption');
  const modalCounter = document.getElementById('modal-counter');
  const modalClose = document.getElementById('modal-close');
  const btnPrev = document.getElementById('modal-prev');
  const btnNext = document.getElementById('modal-next');

  let activeGallery = null;
  let activeIndex = 0;

  function renderModalImage() {
    if (!activeGallery) return;
    const list = activeGallery.images;
    modalImg.src = list[activeIndex];
    modalImg.alt = `${activeGallery.title} - screenshot ${activeIndex + 1}`;
    modalCounter.textContent = `${activeIndex + 1} / ${list.length}`;
  }

  function openModal(key) {
    const data = projectGalleries[key];
    if (!data) return;
    activeGallery = data;
    activeIndex = 0;

    modalTitle.textContent = data.title;
    modalCaption.textContent = data.caption;
    renderModalImage();

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.remove('active');
    document.body.style.overflow = '';
    activeGallery = null;
  }

  function nextImage() {
    if (!activeGallery) return;
    activeIndex = (activeIndex + 1) % activeGallery.images.length;
    renderModalImage();
  }

  function prevImage() {
    if (!activeGallery) return;
    activeIndex = (activeIndex - 1 + activeGallery.images.length) % activeGallery.images.length;
    renderModalImage();
  }

  document.querySelectorAll('[data-gallery-key]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      const key = el.getAttribute('data-gallery-key');
      openModal(key);
    });
  });

  if (modalClose) modalClose.addEventListener('click', closeModal);
  if (btnNext) btnNext.addEventListener('click', nextImage);
  if (btnPrev) btnPrev.addEventListener('click', prevImage);

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (!modal || !modal.classList.contains('active')) return;
    if (e.key === 'Escape') closeModal();
    if (e.key === 'ArrowRight') nextImage();
    if (e.key === 'ArrowLeft') prevImage();
  });

  // 6. Category Filtering
  const filterBtns = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.showcase-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      cards.forEach(card => {
        if (filter === 'all' || card.getAttribute('data-category') === filter) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
});
