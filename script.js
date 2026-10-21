/* ==========================================================================
   PORTFOLIO SCRIPTS - INTERACTIONS & GALLERY VIEWER
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Auto-update Current Year
  const yearEl = document.getElementById('current-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // 2. Interactive Mascot
  const mascotBtn = document.getElementById('mascot-btn');
  const mascotCaption = document.getElementById('mascot-caption');
  const phrases = [
    'Tahu bulat digoreng dadakan! 🟡',
    'Bikin map Roblox seru & hidup! 🎮',
    'AIH Studio 400.000+ members kuat! 🚀',
    'Dimainin Windah & MiawAug! 🔥',
    'LuaU scripting & clean code! 💻',
    'Dari referensi jadi ide gila! ✨'
  ];

  let phraseIndex = 0;
  if (mascotBtn && mascotCaption) {
    mascotBtn.addEventListener('click', () => {
      mascotBtn.classList.add('squished');
      phraseIndex = (phraseIndex + 1) % phrases.length;
      mascotCaption.textContent = phrases[phraseIndex];

      setTimeout(() => {
        mascotBtn.classList.remove('squished');
      }, 250);
    });
  }

  // 3. Project Gallery Data & Modal
  const galleryData = {
    'first-collab': {
      title: 'First Collab Project',
      description: 'Desain kolaborasi map pertama yang dibuat dan langsung disetujui untuk produksi.',
      images: [
        'image/Archives/FristCollab/Screenshot 2026-02-16 063438.png',
        'image/Archives/FristCollab/Screenshot 2026-03-20 122642.png',
        'image/Archives/FristCollab/Screenshot 2026-03-20 124802.png',
        'image/Archives/FristCollab/Screenshot 2026-03-24 192447.png',
        'image/Archives/FristCollab/Screenshot 2026-03-25 135121.png',
        'image/Archives/FristCollab/Screenshot 2026-03-25 181701.png'
      ]
    },
    'level-design': {
      title: 'Map Architecture & Environment',
      description: 'Eksplorasi map & environment Roblox dari 2021-2026 yang menekankan detail atmosfer dan player engagement.',
      images: [
        'image/Archives/MyWork/Screenshot 2026-03-30 155149.png',
        'image/Archives/MyWork/Screenshot 2026-03-30 155213.png',
        'image/Archives/MyWork/Screenshot 2026-03-30 155229.png',
        'image/Archives/MyWork/Screenshot 2026-03-30 155257.png',
        'image/Archives/MyWork/Screenshot 2026-03-30 155356.png',
        'image/Archives/MyWork/Screenshot 2026-06-13 000942.png'
      ]
    },
    'builds': {
      title: 'Custom Props & Scene Builds',
      description: 'Kumpulan prop, set piece, dan pembangunan struktur unik untuk berbagai konsep gameplay.',
      images: [
        'image/Archives/Build/Screenshot 2025-12-18 211443.png',
        'image/Archives/Build/Screenshot 2025-12-18 211541.png',
        'image/Archives/Build/Screenshot 2026-02-13 180945.png',
        'image/Archives/Build/Screenshot 2026-02-14 115720.png',
        'image/Archives/Build/Screenshot 2026-03-30 151036.png',
        'image/Archives/Build/Screenshot 2026-05-19 223439.png'
      ]
    },
    'uiux': {
      title: 'Roblox UI/UX & Game Interface',
      description: 'Desain antarmuka game intuitif dengan struktur responsive layout dan palette terstandarisasi.',
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
      description: 'Arsitektur sistem LuaU berorientasi debugging dengan print-tracking menyeluruh dan modular event handling.',
      images: [
        'image/Archives/LuaUCode/Screenshot 2026-06-13 001441.png',
        'image/Archives/LuaUCode/Screenshot 2026-06-13 001454.png',
        'image/Archives/LuaUCode/Screenshot 2026-06-13 001607.png',
        'image/Archives/LuaUCode/Screenshot 2026-06-13 001644.png',
        'image/Archives/LuaUCode/Screenshot 2026-06-13 001747.png'
      ]
    },
    'gallery': {
      title: 'Visual Archives & Random Works',
      description: 'Eksplorasi visual dan cuplikan proses kreatif selama bertahun-tahun di studio game.',
      images: [
        'image/Archives/Gallery/Cuplikan layar 2025-08-30 115417.png',
        'image/Archives/Gallery/Cuplikan layar 2025-09-20 130632.png',
        'image/Archives/Gallery/Cuplikan layar 2025-09-25 220621.png',
        'image/Archives/Gallery/Screenshot 2025-11-18 191212.png',
        'image/Archives/Gallery/Screenshot 2026-01-30 175806.png'
      ]
    }
  };

  const modal = document.getElementById('gallery-modal');
  const modalTitle = document.getElementById('modal-title');
  const modalImg = document.getElementById('modal-img');
  const modalCaption = document.getElementById('modal-caption');
  const modalCounter = document.getElementById('modal-counter');
  const modalClose = document.getElementById('modal-close');
  const prevBtn = document.getElementById('modal-prev');
  const nextBtn = document.getElementById('modal-next');

  let currentGallery = null;
  let currentImageIdx = 0;

  function updateModalView() {
    if (!currentGallery) return;
    const images = currentGallery.images;
    modalImg.src = images[currentImageIdx];
    modalImg.alt = `${currentGallery.title} - ${currentImageIdx + 1}`;
    modalCounter.textContent = `${currentImageIdx + 1} / ${images.length}`;
  }

  function openGallery(key) {
    const data = galleryData[key];
    if (!data) return;
    currentGallery = data;
    currentImageIdx = 0;

    modalTitle.textContent = data.title;
    modalCaption.textContent = data.description;
    updateModalView();

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
    currentGallery = null;
  }

  function showNextImage() {
    if (!currentGallery) return;
    currentImageIdx = (currentImageIdx + 1) % currentGallery.images.length;
    updateModalView();
  }

  function showPrevImage() {
    if (!currentGallery) return;
    currentImageIdx = (currentImageIdx - 1 + currentGallery.images.length) % currentGallery.images.length;
    updateModalView();
  }

  document.querySelectorAll('[data-gallery]').forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const key = trigger.getAttribute('data-gallery');
      openGallery(key);
    });
  });

  if (modalClose) modalClose.addEventListener('click', closeModal);
  if (nextBtn) nextBtn.addEventListener('click', showNextImage);
  if (prevBtn) prevBtn.addEventListener('click', showPrevImage);

  // Close modal when clicking backdrop
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal();
      }
    });
  }

  // Keyboard navigation for modal
  document.addEventListener('keydown', (e) => {
    if (!modal || !modal.classList.contains('active')) return;
    if (e.key === 'Escape') closeModal();
    if (e.key === 'ArrowRight') showNextImage();
    if (e.key === 'ArrowLeft') showPrevImage();
  });

  // 4. Toast Notification & Copy Utilities
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toast-msg');

  function showToast(message) {
    if (!toast || !toastMsg) return;
    toastMsg.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 2800);
  }

  const copyDiscordBtn = document.getElementById('copy-discord');
  if (copyDiscordBtn) {
    copyDiscordBtn.addEventListener('click', () => {
      const username = copyDiscordBtn.getAttribute('data-discord') || 'tahubulat';
      navigator.clipboard.writeText(username).then(() => {
        showToast(`Discord tag "${username}" berhasil disalin!`);
      }).catch(() => {
        showToast(`Salin manual: ${username}`);
      });
    });
  }

  const copyEmailBtn = document.getElementById('copy-email');
  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', () => {
      const email = copyEmailBtn.getAttribute('data-email') || 'bachtiaradit01@gmail.com';
      navigator.clipboard.writeText(email).then(() => {
        showToast('Email berhasil disalin ke clipboard!');
      }).catch(() => {
        showToast(`Salin manual: ${email}`);
      });
    });
  }
});
