/* ============================================
   EYEKONIKA — CONTACT JOURNEY JS v2
   Horizontal cinematic opening + vertical form
   ============================================ */

(function () {
  'use strict';

  // ---- State ----
  const state = {
    currentScene: 0,
    totalHScenes: 5,
    name: '', email: '', occasion: '', space: '', timeline: ''
  };

  // ---- Elements ----
  const track = document.getElementById('h-track');
  const progressDots = document.querySelectorAll('.progress-dot');
  const sceneNum = document.getElementById('scene-num');

  // ---- Cursor glow ----
  const glow = document.getElementById('cursor-glow');
  let glowX = 0, glowY = 0, mouseX = 0, mouseY = 0;
  document.addEventListener('mousemove', e => { mouseX = e.clientX; mouseY = e.clientY; });
  function animateGlow() {
    glowX += (mouseX - glowX) * 0.08;
    glowY += (mouseY - glowY) * 0.08;
    if (glow) { glow.style.left = glowX + 'px'; glow.style.top = glowY + 'px'; }
    requestAnimationFrame(animateGlow);
  }
  animateGlow();

  // ---- Word reveal utility ----
  function revealWords(container, baseDelay = 0) {
    if (!container) return;
    const words = container.querySelectorAll('.word-reveal');
    words.forEach((w, i) => {
      setTimeout(() => w.classList.add('revealed'), baseDelay + i * 100);
    });
  }

  function revealEl(el, delay = 0) {
    if (!el) return;
    setTimeout(() => el.classList.add('revealed'), delay);
  }

  function revealGeos(container, baseDelay = 0) {
    if (!container) return;
    const geos = container.querySelectorAll(
      '.geo-shard, .geo-rect, .geo-orb, .geo-line-h, .geo-dots, .geo-cross, .geo-bracket'
    );
    geos.forEach((g, i) => {
      setTimeout(() => g.classList.add('revealed'), baseDelay + i * 120);
    });
  }

  // ---- Horizontal scroll navigation ----
  function goToScene(index) {
    if (index < 0 || index >= state.totalHScenes) return;
    state.currentScene = index;
    if (track) track.style.transform = `translateX(-${index * 100}vw)`;

    // Update progress dots
    progressDots.forEach((d, i) => d.classList.toggle('active', i === index));

    // Update counter
    if (sceneNum) sceneNum.textContent = String(index + 1).padStart(2, '0');

    // Trigger scene animations
    triggerHScene(index);
  }

  function triggerHScene(index) {
    const sceneId = 'scene-' + (index + 1);
    const scene = document.getElementById(sceneId);
    if (!scene) return;

    // Reveal geos first, then words
    revealGeos(scene, 200);

    switch (index) {
      case 0:
        revealWords(scene, 400);
        setTimeout(() => {
          const hint = document.getElementById('scroll-hint-h');
          if (hint) hint.classList.add('revealed');
        }, 2000);
        break;

      case 1:
        revealEl(scene.querySelector('.scene-eyebrow'), 300);
        revealWords(scene, 500);
        break;

      case 2:
        revealEl(scene.querySelector('.scene-eyebrow'), 200);
        revealWords(scene, 400);
        setTimeout(() => {
          revealEl(scene.querySelector('.scene-divider-inner'), 0);
          revealEl(scene.querySelector('.scene-subtext'), 200);
        }, 900);
        break;

      case 3:
        revealEl(scene.querySelector('.scene-eyebrow'), 300);
        revealWords(scene, 500);
        break;

      case 4:
        revealWords(scene.querySelector('.kinetic-line:first-of-type'), 200);
        setTimeout(() => {
          revealEl(scene.querySelector('.scene-divider-inner'), 0);
        }, 700);
        setTimeout(() => {
          revealWords(scene.querySelector('.question-line'), 0);
        }, 1000);
        setTimeout(() => {
          const hint = document.getElementById('scroll-hint-v');
          if (hint) hint.classList.add('visible');
        }, 2000);
        break;
    }
  }

  // ---- Scroll / keyboard / swipe to advance horizontal ----
  let scrollLocked = false;
  let touchStartX = 0;
  let isHorizontalPhase = true;

  function lockThenUnlock(duration = 1200) {
    scrollLocked = true;
    setTimeout(() => { scrollLocked = false; }, duration);
  }

  // Wheel
  window.addEventListener('wheel', (e) => {
    if (!isHorizontalPhase) return;
    if (scrollLocked) return;

    if (e.deltaY > 30 || e.deltaX > 30) {
      if (state.currentScene < state.totalHScenes - 1) {
        lockThenUnlock();
        goToScene(state.currentScene + 1);
      } else {
        // Last h-scene — transition to vertical
        transitionToVertical();
      }
    } else if (e.deltaY < -30 || e.deltaX < -30) {
      if (state.currentScene > 0) {
        lockThenUnlock();
        goToScene(state.currentScene - 1);
      }
    }
    e.preventDefault();
  }, { passive: false });

  // Touch
  window.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });

  window.addEventListener('touchend', (e) => {
    if (!isHorizontalPhase || scrollLocked) return;
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        if (state.currentScene < state.totalHScenes - 1) {
          lockThenUnlock(); goToScene(state.currentScene + 1);
        } else { transitionToVertical(); }
      } else {
        if (state.currentScene > 0) { lockThenUnlock(); goToScene(state.currentScene - 1); }
      }
    }
  }, { passive: true });

  // Keyboard
  window.addEventListener('keydown', (e) => {
    if (!isHorizontalPhase || scrollLocked) return;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      if (state.currentScene < state.totalHScenes - 1) {
        lockThenUnlock(); goToScene(state.currentScene + 1);
      } else { transitionToVertical(); }
    }
    if ((e.key === 'ArrowLeft' || e.key === 'ArrowUp') && state.currentScene > 0) {
      e.preventDefault();
      lockThenUnlock(); goToScene(state.currentScene - 1);
    }
  });

  // Progress dot clicks
  progressDots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      if (!isHorizontalPhase) return;
      lockThenUnlock(); goToScene(i);
    });
  });

  // ---- Transition: horizontal → vertical ----
  function transitionToVertical() {
    if (!isHorizontalPhase) return;
    isHorizontalPhase = false;
    lockThenUnlock(1500);

    const hSection = document.getElementById('journey-horizontal');
    const vSection = document.getElementById('journey-vertical');
    if (!hSection || !vSection) return;

    // Hide progress/counter
    const progress = document.querySelector('.journey-progress');
    const counter = document.querySelector('.scene-counter');
    if (progress) { progress.style.transition = 'opacity 0.8s ease'; progress.style.opacity = '0'; }
    if (counter) { counter.style.transition = 'opacity 0.8s ease'; counter.style.opacity = '0'; }

    // Scroll to vertical section
    setTimeout(() => {
      vSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      triggerVScene('v-bridge');
      setTimeout(() => triggerVScene('v-scene-6'), 600);
    }, 400);
  }

  // ---- Vertical scene triggers ----
  function triggerVScene(id) {
    const scene = document.getElementById(id);
    if (!scene) return;

    // Make visible if hidden
    if (scene.style.display === 'none') {
      scene.style.display = 'flex';
      scene.style.opacity = '0';
      requestAnimationFrame(() => {
        requestAnimationFrame(() => { scene.style.transition = 'opacity 0s'; scene.style.opacity = '1'; });
      });
    }

    revealGeos(scene, 300);

    switch (id) {
      case 'v-bridge':
        setTimeout(() => revealEl(document.getElementById('bridge-eyebrow'), 0), 500);
        break;

      case 'v-scene-6':
        setTimeout(() => {
          const fields = document.getElementById('fields-6');
          if (fields) fields.classList.add('revealed');
          const btn = document.getElementById('continue-1');
          if (btn) btn.classList.add('revealed');
        }, 600);
        break;

      case 'v-scene-7':
        setTimeout(() => {
          revealWords(scene, 0);
          const choices = scene.querySelectorAll('.journey-choice');
          choices.forEach((c, i) => {
            setTimeout(() => c.classList.add('revealed'), 400 + i * 120);
          });
        }, 300);
        break;

      case 'v-scene-8':
        setTimeout(() => {
          revealEl(scene.querySelector('.scene-eyebrow'), 0);
          revealWords(scene, 300);
          setTimeout(() => {
            revealEl(scene.querySelector('.scene-subtext'), 0);
            const fields = document.getElementById('fields-8');
            if (fields) fields.classList.add('revealed');
            const btn = document.getElementById('continue-2');
            if (btn) btn.classList.add('revealed');
          }, 800);
        }, 300);
        break;

      case 'v-scene-9':
        setTimeout(() => {
          revealWords(scene.querySelector('.kinetic-line'), 0);
          setTimeout(() => {
            revealEl(scene.querySelector('.scene-eyebrow'), 0);
            const choices = scene.querySelectorAll('.journey-choice');
            choices.forEach((c, i) => {
              setTimeout(() => c.classList.add('revealed'), 200 + i * 120);
            });
          }, 600);
        }, 300);
        break;

      case 'v-scene-10':
        setTimeout(() => {
          const card = document.getElementById('final-card');
          if (card) card.classList.add('revealed');
          initMagnetic();
        }, 500);
        break;

      case 'v-scene-11':
        setTimeout(() => {
          revealEl(document.getElementById('confirm-main'), 0);
          revealEl(document.getElementById('confirm-sub'), 0);
          revealEl(document.getElementById('confirm-rule'), 0);
        }, 400);
        break;
    }
  }

  // ---- Reveal next scene and scroll to it ----
  function showNextScene(id, delay = 400) {
    setTimeout(() => {
      const scene = document.getElementById(id);
      if (!scene) return;
      scene.style.display = 'flex';
      scene.style.opacity = '0';
      scene.style.transform = 'translateY(40px)';
      scene.style.transition = 'opacity 1.2s ease, transform 1.2s cubic-bezier(0.16,1,0.3,1)';
      requestAnimationFrame(() => requestAnimationFrame(() => {
        scene.style.opacity = '1';
        scene.style.transform = 'translateY(0)';
        setTimeout(() => {
          scene.scrollIntoView({ behavior: 'smooth', block: 'center' });
          triggerVScene(id);
        }, 200);
      }));
    }, delay);
  }

  // ---- Shake utility ----
  function shake(el) {
    if (!el) return;
    el.style.transition = 'transform 0.08s ease';
    const seq = [-6, 6, -4, 4, -2, 2, 0];
    seq.forEach((x, i) => {
      setTimeout(() => { el.style.transform = `translateX(${x}px)`; }, i * 80);
    });
  }

  // ---- Continue 1: name + email → scene 7 ----
  document.addEventListener('click', (e) => {
    if (e.target.closest('#continue-1')) {
      const name = document.getElementById('j-name')?.value?.trim();
      const email = document.getElementById('j-email')?.value?.trim();
      if (!name || !email) {
        shake(document.getElementById('fields-6'));
        return;
      }
      state.name = name; state.email = email;
      showNextScene('v-scene-7');
    }
  });

  // ---- Occasion choices → scene 8 ----
  document.addEventListener('click', (e) => {
    const choice = e.target.closest('#occasion-choices .journey-choice');
    if (!choice) return;
    document.querySelectorAll('#occasion-choices .journey-choice').forEach(c => c.classList.remove('selected'));
    choice.classList.add('selected');
    state.occasion = choice.dataset.value;

    const eyebrowMap = {
      memorial: "Tell us about who you're remembering.",
      institutional: 'Help us understand the space.',
      gift: 'Help us see the occasion.',
      other: 'Help us see your vision.'
    };
    const eyebrow = document.getElementById('scene-8-eyebrow');
    if (eyebrow) eyebrow.textContent = eyebrowMap[state.occasion] || 'Help us see it.';

    showNextScene('v-scene-8', 350);
  });

  // ---- Continue 2: space → scene 9 ----
  document.addEventListener('click', (e) => {
    if (e.target.closest('#continue-2')) {
      const space = document.getElementById('j-space')?.value?.trim();
      if (!space) { shake(document.getElementById('fields-8')); return; }
      state.space = space;
      showNextScene('v-scene-9');
    }
  });

  // ---- Timeline choices → scene 10 ----
  document.addEventListener('click', (e) => {
    const choice = e.target.closest('#timeline-choices .journey-choice');
    if (!choice) return;
    document.querySelectorAll('#timeline-choices .journey-choice').forEach(c => c.classList.remove('selected'));
    choice.classList.add('selected');
    state.timeline = choice.dataset.value;
    showNextScene('v-scene-10', 350);
  });

  // ---- Form submit ----
  document.addEventListener('submit', (e) => {
    if (e.target.id !== 'journeyForm') return;
    e.preventDefault();

    // Populate hidden fields
    document.getElementById('j-hidden-name').value = state.name;
    document.getElementById('j-hidden-email').value = state.email;
    document.getElementById('j-hidden-occasion').value = state.occasion;
    document.getElementById('j-hidden-space').value = state.space;
    document.getElementById('j-hidden-timeline').value = state.timeline;

    const form = e.target;
    fetch(form.action, {
      method: 'POST',
      body: new FormData(form),
      headers: { 'Accept': 'application/json' }
    }).then(res => {
      if (res.ok) afterSubmit();
      else afterSubmit(); // show confirmation regardless
    }).catch(() => afterSubmit());
  });

  function afterSubmit() {
    const s10 = document.getElementById('v-scene-10');
    if (s10) {
      s10.style.transition = 'opacity 1s ease';
      s10.style.opacity = '0';
      setTimeout(() => { s10.style.display = 'none'; }, 1000);
    }
    showNextScene('v-scene-11', 800);
  }

  // ---- Magnetic button ----
  function initMagnetic() {
    const wrap = document.querySelector('.submit-magnetic');
    if (!wrap) return;
    wrap.addEventListener('mousemove', (e) => {
      const rect = wrap.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) * 0.2;
      const y = (e.clientY - rect.top - rect.height / 2) * 0.2;
      wrap.style.transform = `translate(${x}px, ${y}px)`;
    });
    wrap.addEventListener('mouseleave', () => {
      wrap.style.transition = 'transform 0.7s cubic-bezier(0.76,0,0.24,1)';
      wrap.style.transform = 'translate(0,0)';
    });
  }

  // ---- Lenis smooth scroll (vertical section only) ----
  let lenis;
  function initLenis() {
    if (typeof Lenis === 'undefined') return;
    lenis = new Lenis({
      wrapper: document.getElementById('journey-vertical'),
      lerp: 0.08,
      smoothWheel: true
    });
    function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
  }

  // ---- Init ----
  function init() {
    // Trigger first scene
    goToScene(0);

    // Init lenis for vertical section
    initLenis();

    // Observe vertical scenes with IntersectionObserver for auto-reveal
    const vScenes = document.querySelectorAll('.v-scene');
    const vObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        revealGeos(entry.target, 200);
        // Eyebrow and subtext
        const eyebrow = entry.target.querySelector('.scene-eyebrow:not(#scene-8-eyebrow)');
        const subtext = entry.target.querySelector('.scene-subtext');
        if (eyebrow) setTimeout(() => eyebrow.classList.add('revealed'), 400);
        if (subtext) setTimeout(() => subtext.classList.add('revealed'), 600);
        vObserver.unobserve(entry.target);
      });
    }, { threshold: 0.2 });
    vScenes.forEach(s => vObserver.observe(s));
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
