(() => {
  const cube          = document.getElementById('cube');
  const progFill      = document.getElementById('prog_fill');
  const hudPct        = document.getElementById('hud_pct');
  const sceneLabel    = document.getElementById('scene_name');
  const sceneDots     = document.querySelectorAll('.scene-dot');
  const captionNum    = document.getElementById('face_caption_num');
  const captionName   = document.getElementById('face_caption_name');
  const themeToggle   = document.getElementById('theme_toggle');
  const sections      = document.querySelectorAll('#scroll_container section');

  // Labels for each section (s0–s5)
  const scenes = [
    { name: 'OVERVIEW',    num: '00' },
    { name: 'JORDANVILLE', num: '01' },
    { name: 'SACRED',      num: '02' },
    { name: 'WAYMART',     num: '03' },
    { name: 'THE CRAFT',   num: '04' },
    { name: 'BEGIN',       num: '05' },
  ];

  // [rotateX, rotateY] to face each side of the cube
  const rotations = [
    [ 90,    0],   // top
    [  0,    0],   // front
    [  0,  -90],   // right
    [  0, -180],   // back
    [  0, -270],   // left
    [-90, -270],   // bottom
  ];

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  // ── Cube + HUD update on scroll ───────────────────
  function update() {
    const scrollY  = window.scrollY;
    const n        = sections.length;

    // Find which section we're in and how far through it
    let sectionIdx      = n - 1;
    let sectionProgress = 1;

    for (let i = 0; i < n; i++) {
      const top    = sections[i].offsetTop;
      const bottom = top + sections[i].offsetHeight;
      if (scrollY < bottom) {
        sectionIdx      = i;
        sectionProgress = Math.max(0, Math.min(1, (scrollY - top) / sections[i].offsetHeight));
        break;
      }
    }

    // Smooth rotation between keyframes
    const globalT  = sectionIdx + sectionProgress;
    const fromIdx  = Math.min(Math.floor(globalT), n - 2);
    const t        = globalT - fromIdx;
    const rx       = lerp(rotations[fromIdx][0], rotations[fromIdx + 1][0], t);
    const ry       = lerp(rotations[fromIdx][1], rotations[fromIdx + 1][1], t);
    cube.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`;

    // Progress bar
    const docH = document.documentElement.scrollHeight - window.innerHeight;
    const pct  = docH > 0 ? Math.round(Math.max(0, Math.min(100, scrollY / docH * 100))) : 0;
    progFill.style.width   = pct + '%';
    hudPct.textContent     = String(pct).padStart(3, '0') + '%';

    // Active scene (snap to nearest)
    const activeIdx = Math.max(0, Math.min(n - 1, Math.round(globalT)));
    sceneDots.forEach((dot, i) => dot.classList.toggle('active', i === activeIdx));
    sceneLabel.textContent  = scenes[activeIdx].name;
    captionNum.textContent  = scenes[activeIdx].num;
    captionName.textContent = scenes[activeIdx].name;
  }

  // ── Reveal animations via IntersectionObserver ────
  const revealTargets = document.querySelectorAll(
    '.tag, h1, h2, .body-text, .stat-row, .cta, .cta-back, .h-line'
  );

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      entry.target.classList.toggle('visible', entry.isIntersecting);
    });
  }, { threshold: 0.12 });

  revealTargets.forEach(el => revealObserver.observe(el));

  // ── Theme toggle ──────────────────────────────────
  let isDark = true;
  themeToggle.addEventListener('click', () => {
    isDark = !isDark;
    if (isDark) {
      document.documentElement.removeAttribute('data-theme');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
    }
  });

  // ── Smooth scroll for anchor links ───────────────
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // ── Init ─────────────────────────────────────────
  window.addEventListener('scroll', update, { passive: true });
  update();
})();
