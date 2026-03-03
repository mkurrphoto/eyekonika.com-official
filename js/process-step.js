(function () {
  /* ── Scroll-reveal via IntersectionObserver ── */
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('in-view');
          observer.unobserve(e.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));

  /* ── Back-to-index links: save scroll target before navigating ── */
  document.querySelectorAll('a[href*="index.html"]').forEach((link) => {
    link.addEventListener('click', () => {
      sessionStorage.setItem('returnSection', 'timeline');
    });
  });

  /* ── Production stage tabs ── */
  if (document.body.dataset.step === 'production') {
    const stageData = {
      prep: {
        icon: '🔷',
        title: 'Material Prep',
        desc: 'K9 optical glass blanks are selected and inspected for internal clarity. Each piece is cleaned and measured to specification before a single laser path is configured.',
      },
      calib: {
        icon: '⚡',
        title: 'Calibration',
        desc: 'Laser parameters — power, frequency, focus depth — are dialled in to match the approved proof. Every engraving run begins from a verified, documented baseline.',
      },
      engrave: {
        icon: '✦',
        title: 'Engraving',
        desc: 'Subsurface laser paths are executed in controlled passes. The result is a three-dimensional image suspended within optical glass, precise to the approved depth map.',
      },
      inspect: {
        icon: '◎',
        title: 'Inspection',
        desc: 'Technicians validate edge clarity, depth fidelity, and visual consistency against the signed-off proof. No piece advances until it meets full specification.',
      },
      finish: {
        icon: '◈',
        title: 'Finishing',
        desc: 'Final polishing, protective packaging, and presentation assembly are completed. Your piece leaves as delivered — not as manufactured.',
      },
    };

    const btns = [...document.querySelectorAll('.stage-btn')];
    const titleEl = document.getElementById('stageTitle');
    const descEl = document.getElementById('stageDesc');

    btns.forEach((btn) => {
      btn.addEventListener('click', () => {
        btns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        const d = stageData[btn.dataset.stage];
        if (d && titleEl && descEl) {
          titleEl.textContent = d.title;
          descEl.textContent = d.desc;
        }
      });
    });
  }
})();
