/* ============================================
   EYEKONIKA — CONTACT JOURNEY JS v5
   Bidirectional navigation; Lenis frozen throughout.
   Escape button + replay on re-entry.
   ============================================ */

(function () {
  'use strict';

  var track = document.getElementById('h-track');
  if (!track) return;

  var isStandalone = document.body.classList.contains('is-journey');

  // ---- State ----
  var state = {
    currentScene  : 0,
    totalHScenes  : 5,
    inHorizontal  : true,
    inJourney     : false,   // true while anywhere inside the journey
    transitioning : false,
    journeyStarted: false
  };

  // ---- Elements ----
  var progressDots = document.querySelectorAll('.progress-dot');
  var sceneNum     = document.getElementById('scene-num');

  // snap-entry timer
  var snapTimer = null;

  // ---- Cursor glow ----
  var glowEl = document.getElementById('cursor-glow');
  var glowX = 0, glowY = 0, mouseX = 0, mouseY = 0;
  document.addEventListener('mousemove', function(e) { mouseX = e.clientX; mouseY = e.clientY; });
  (function animateGlow() {
    glowX += (mouseX - glowX) * 0.08;
    glowY += (mouseY - glowY) * 0.08;
    if (glowEl) { glowEl.style.left = glowX + 'px'; glowEl.style.top = glowY + 'px'; }
    requestAnimationFrame(animateGlow);
  })();

  // ============================================
  // ANIMATION UTILITIES
  // ============================================

  function revealWords(container, baseDelay) {
    baseDelay = baseDelay || 0;
    if (!container) return;
    container.querySelectorAll('.word-reveal').forEach(function(w, i) {
      setTimeout(function() { w.classList.add('revealed'); }, baseDelay + i * 100);
    });
  }

  function revealEl(el, delay) {
    delay = delay || 0;
    if (!el) return;
    setTimeout(function() { el.classList.add('revealed'); }, delay);
  }

  function revealGeos(container, baseDelay) {
    baseDelay = baseDelay || 0;
    if (!container) return;
    container.querySelectorAll(
      '.geo-shard, .geo-rect, .geo-orb, .geo-line-h, .geo-dots, .geo-cross, .geo-bracket'
    ).forEach(function(g, i) {
      setTimeout(function() { g.classList.add('revealed'); }, baseDelay + i * 100);
    });
  }

  // ============================================
  // HORIZONTAL NAVIGATION
  // ============================================

  function goToScene(index) {
    if (index < 0 || index >= state.totalHScenes) return;
    if (state.transitioning) return;

    state.transitioning = true;
    state.currentScene  = index;

    track.style.transform = 'translateX(-' + (index * 100) + 'vw)';

    progressDots.forEach(function(d, i) {
      d.classList.toggle('active', i === index);
    });
    if (sceneNum) sceneNum.textContent = String(index + 1).padStart(2, '0');

    triggerHScene(index);

    setTimeout(function() { state.transitioning = false; }, 1200);
  }

  function triggerHScene(index) {
    var scene = document.getElementById('scene-' + (index + 1));
    if (!scene) return;

    revealGeos(scene, 200);

    switch (index) {
      case 0:
        revealWords(scene, 400);
        setTimeout(function() {
          var hint = document.getElementById('scroll-hint-h');
          if (hint) hint.classList.add('revealed');
        }, 2200);
        break;
      case 1:
        revealEl(scene.querySelector('.scene-eyebrow'), 300);
        revealWords(scene, 500);
        break;
      case 2:
        revealEl(scene.querySelector('.scene-eyebrow'), 200);
        revealWords(scene, 400);
        setTimeout(function() {
          revealEl(scene.querySelector('.scene-divider-inner'), 0);
          revealEl(scene.querySelector('.scene-subtext'), 200);
        }, 900);
        break;
      case 3:
        revealEl(scene.querySelector('.scene-eyebrow'), 300);
        revealWords(scene, 500);
        break;
      case 4:
        revealWords(scene.querySelector('.kinetic-line'), 200);
        setTimeout(function() {
          revealEl(scene.querySelector('.scene-divider-inner'), 0);
        }, 700);
        setTimeout(function() {
          revealWords(scene.querySelector('.question-line'), 0);
        }, 1100);
        setTimeout(function() {
          var hint = document.getElementById('scroll-hint-v');
          if (hint) hint.classList.add('visible');
        }, 2200);
        break;
    }
  }

  // ============================================
  // INPUT HANDLERS
  // Single guard: state.inJourney
  // Sub-routing on state.inHorizontal
  // ============================================

  var wheelAccum = 0;
  var wheelTimer = null;

  window.addEventListener('wheel', function(e) {
    if (!state.inJourney) return;
    e.preventDefault();

    wheelAccum += e.deltaY + e.deltaX;
    clearTimeout(wheelTimer);
    wheelTimer = setTimeout(function() {
      if (Math.abs(wheelAccum) < 20) { wheelAccum = 0; return; }

      if (state.inHorizontal) {
        if (wheelAccum > 0) {
          if (state.currentScene < state.totalHScenes - 1) {
            goToScene(state.currentScene + 1);
          } else {
            transitionToVertical();
          }
        } else {
          if (state.currentScene > 0) goToScene(state.currentScene - 1);
          // scene 0: nowhere to go — escape button is the only exit
        }
      } else {
        // Vertical section: only backward navigation
        if (wheelAccum < 0) transitionToHorizontal();
      }
      wheelAccum = 0;
    }, 50);
  }, { passive: false });

  // Touch swipe
  var touchStartX = 0;
  var touchStartY = 0;
  var touchMoved  = false;
  var touchOnForm = false;

  window.addEventListener('touchstart', function(e) {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
    touchMoved  = false;
    // Don't intercept touches that start inside the form (mobile scrolling)
    touchOnForm = !!e.target.closest('#landingForm');
  }, { passive: true });

  window.addEventListener('touchmove', function(e) {
    touchMoved = true;
    if (state.inJourney && !touchOnForm) e.preventDefault();
  }, { passive: false });

  window.addEventListener('touchend', function(e) {
    if (!state.inJourney || !touchMoved || touchOnForm) return;
    var dx    = touchStartX - e.changedTouches[0].clientX;
    var dy    = touchStartY - e.changedTouches[0].clientY;
    var absDx = Math.abs(dx);
    var absDy = Math.abs(dy);
    if (absDx < 30 && absDy < 30) return;

    var goForward = absDx >= absDy ? dx > 0 : dy > 0;

    if (state.inHorizontal) {
      if (goForward) {
        if (state.currentScene < state.totalHScenes - 1) {
          goToScene(state.currentScene + 1);
        } else {
          transitionToVertical();
        }
      } else {
        if (state.currentScene > 0) goToScene(state.currentScene - 1);
        // scene 0: nowhere to go — escape button is the only exit
      }
    } else {
      // Vertical: backward swipe returns to horizontal
      if (!goForward) transitionToHorizontal();
    }
  }, { passive: true });

  // Keyboard
  window.addEventListener('keydown', function(e) {
    if (!state.inJourney || state.transitioning) return;

    if (state.inHorizontal) {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        if (state.currentScene < state.totalHScenes - 1) {
          goToScene(state.currentScene + 1);
        } else {
          transitionToVertical();
        }
      }
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        if (state.currentScene > 0) goToScene(state.currentScene - 1);
        // scene 0: nowhere to go — escape button is the only exit
      }
    } else {
      // Vertical: ArrowUp returns to horizontal
      if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        e.preventDefault();
        transitionToHorizontal();
      }
    }
  });

  // Progress dot clicks
  progressDots.forEach(function(dot, i) {
    dot.addEventListener('click', function() {
      if (!state.inHorizontal) return;
      goToScene(i);
    });
  });

  // Escape button
  var escapeBtn = document.getElementById('journey-escape-btn');
  if (escapeBtn) escapeBtn.addEventListener('click', escapeJourney);

  // ============================================
  // TRANSITIONS: HORIZONTAL ↔ VERTICAL
  // ============================================

  function transitionToVertical() {
    if (!state.inHorizontal || state.transitioning) return;
    state.transitioning = true;
    state.inHorizontal  = false;

    // Lenis stays stopped — do NOT resume here

    // Fade out chrome
    var progress = document.querySelector('.journey-progress');
    var counter  = document.querySelector('.scene-counter');
    if (progress) { progress.style.transition = 'opacity 0.8s ease'; progress.style.opacity = '0'; }
    if (counter)  { counter.style.transition  = 'opacity 0.8s ease'; counter.style.opacity  = '0'; }

    // Slide the vertical panel up via CSS transform — no page scroll at all
    var vSection = document.getElementById('journey-vertical');
    if (vSection) vSection.classList.add('v-active');

    setTimeout(function() {
      triggerVScene('v-bridge');
      showVScene('v-scene-6', 800);
      setTimeout(function() { state.transitioning = false; }, 900);
    }, 300);
  }

  function transitionToHorizontal() {
    if (state.inHorizontal || state.transitioning) return;
    state.transitioning = true;
    state.inHorizontal  = true;

    // Restore chrome (clear inline overrides; CSS body.journey-active rule takes over)
    var progress = document.querySelector('.journey-progress');
    var counter  = document.querySelector('.scene-counter');
    if (progress) { progress.style.transition = 'opacity 0.8s ease'; progress.style.opacity = ''; }
    if (counter)  { counter.style.transition  = 'opacity 0.8s ease'; counter.style.opacity  = ''; }

    // Slide vertical panel back down — no page scroll
    var vSection = document.getElementById('journey-vertical');
    if (vSection) vSection.classList.remove('v-active');

    setTimeout(function() { state.transitioning = false; }, 1200);
  }

  // ============================================
  // VERTICAL SCENES
  // ============================================

  function showVScene(id, delay) {
    delay = delay || 300;
    setTimeout(function() {
      var scene = document.getElementById(id);
      if (!scene) return;
      // Already fully visible — don't re-animate (user navigated back then forward)
      if (scene.style.display === 'flex' && parseFloat(scene.style.opacity || '0') >= 1) {
        triggerVScene(id);
        return;
      }

      scene.style.display    = 'flex';
      scene.style.opacity    = '0';
      scene.style.transform  = 'translateY(30px)';
      scene.style.transition = 'none';

      requestAnimationFrame(function() {
        requestAnimationFrame(function() {
          scene.style.transition = 'opacity 1.2s ease, transform 1.2s cubic-bezier(0.16,1,0.3,1)';
          scene.style.opacity    = '1';
          scene.style.transform  = 'translateY(0)';
          // No scrollIntoView — scene is inside the fixed overlay, already in view
          setTimeout(function() { triggerVScene(id); }, 150);
        });
      });
    }, delay);
  }

  function triggerVScene(id) {
    var scene = document.getElementById(id);
    if (!scene) return;

    revealGeos(scene, 250);

    switch (id) {
      case 'v-bridge':
        setTimeout(function() {
          revealEl(document.getElementById('bridge-eyebrow'), 0);
        }, 500);
        break;

      case 'v-scene-6':
        setTimeout(function() {
          var trustStrip  = document.getElementById('trust-strip');
          var heading     = scene.querySelector('.form-section-heading');
          var formDivider = document.getElementById('form-divider');
          var fields      = document.getElementById('fields-6');
          var actions     = scene.querySelector('.form-actions');
          var testimonial = scene.querySelector('.trust-testimonial');

          if (trustStrip)  trustStrip.classList.add('revealed');
          if (formDivider) formDivider.classList.add('revealed');
          if (heading)    setTimeout(function() { heading.classList.add('revealed');    }, 300);
          if (fields)     setTimeout(function() { fields.classList.add('revealed');     }, 600);
          if (actions)    setTimeout(function() { actions.classList.add('revealed');    }, 1000);
          if (testimonial) setTimeout(function() { testimonial.classList.add('revealed'); }, 1600);
        }, 300);
        break;

      case 'v-scene-confirm':
        setTimeout(function() {
          revealEl(document.getElementById('confirm-main'), 0);
          revealEl(document.getElementById('confirm-sub'), 400);
          revealEl(document.getElementById('confirm-rule'), 800);
        }, 400);
        break;
    }
  }

  // ============================================
  // FORM SUBMISSION
  // ============================================

  document.addEventListener('submit', function(e) {
    if (e.target.id !== 'landingForm') return;
    e.preventDefault();

    var btn  = e.target.querySelector('.landing-submit');
    var span = btn && btn.querySelector('span');
    if (btn)  btn.disabled = true;
    if (span) span.textContent = 'Sending\u2026';

    fetch(e.target.action, {
      method: 'POST',
      body: new FormData(e.target),
      headers: { 'Accept': 'application/json' }
    }).then(afterLandingSubmit).catch(afterLandingSubmit);
  });

  function afterLandingSubmit() {
    var s6 = document.getElementById('v-scene-6');
    if (s6) {
      s6.style.transition = 'opacity 1s ease';
      s6.style.opacity    = '0';
      setTimeout(function() { s6.style.display = 'none'; }, 1000);
    }
    showVScene('v-scene-confirm', 800);
    // Escape button remains visible for the user to exit when ready
  }

  // ============================================
  // SIDEBAR HELPER
  // ============================================

  function setSidebarHidden(hidden) {
    var sidebar = document.getElementById('sidebar');
    if (!sidebar) return;
    if (hidden) {
      sidebar.classList.add('hide-sidebar');
    } else {
      sidebar.classList.remove('hide-sidebar');
    }
  }

  // ============================================
  // JOURNEY CONTROL
  // ============================================

  function startJourney() {
    if (state.journeyStarted) return;
    state.journeyStarted = true;
    state.inJourney      = true;
    state.inHorizontal   = true;

    document.body.classList.add('journey-active');
    setSidebarHidden(true);
    if (!isStandalone && window.lenis) window.lenis.stop();

    var hSection = document.getElementById('journey-horizontal');
    if (hSection) {
      hSection.style.overflow    = 'hidden';
      hSection.style.touchAction = 'none';
    }

    goToScene(0);
  }

  function escapeJourney() {
    if (!state.inJourney && !state.journeyStarted) return; // nothing to escape from

    state.inJourney = false;
    document.body.classList.remove('journey-active');
    setSidebarHidden(false);
    if (!isStandalone && window.lenis) window.lenis.start();

    var hSection = document.getElementById('journey-horizontal');
    if (hSection) hSection.style.touchAction = '';

    // Scroll to gallery (or timeline as fallback), then reset for replay
    var dest = document.getElementById('gallery') || document.getElementById('timeline');
    if (dest && window.lenis) {
      window.lenis.scrollTo(dest, {
        duration: 1.2,
        onComplete: function() { resetJourney(); }
      });
    } else if (dest) {
      dest.scrollIntoView({ behavior: 'smooth' });
      setTimeout(resetJourney, 1500);
    } else {
      resetJourney();
    }
  }

  function resetJourney() {
    // Reset sub-state (journeyStarted last so guard holds during scroll-to-dest)
    state.currentScene  = 0;
    state.inHorizontal  = true;
    state.transitioning = false;
    // state.inJourney already false from escapeJourney

    // Reset track position
    track.style.transform = 'translateX(0)';

    // Reset progress dots and counter
    progressDots.forEach(function(d, i) { d.classList.toggle('active', i === 0); });
    if (sceneNum) sceneNum.textContent = '01';

    // Clear inline opacity overrides left by transitionToVertical
    var progress = document.querySelector('.journey-progress');
    var counter  = document.querySelector('.scene-counter');
    if (progress) { progress.style.opacity = ''; progress.style.transition = ''; }
    if (counter)  { counter.style.opacity  = ''; counter.style.transition  = ''; }

    // Reset vertical section
    var vSection      = document.getElementById('journey-vertical');
    var vScene6       = document.getElementById('v-scene-6');
    var vSceneConfirm = document.getElementById('v-scene-confirm');
    if (vSection) vSection.classList.remove('v-active');
    [vScene6, vSceneConfirm].forEach(function(el) {
      if (!el) return;
      el.style.display    = 'none';
      el.style.opacity    = '';
      el.style.transform  = '';
      el.style.transition = '';
    });

    // Strip all reveal classes from the entire journey embed
    var embedRoot = document.querySelector('.journey-embed-root');
    if (embedRoot) {
      embedRoot.querySelectorAll('.revealed').forEach(function(el) {
        el.classList.remove('revealed');
      });
      // scroll-hint-v uses .visible
      var hintV = document.getElementById('scroll-hint-v');
      if (hintV) hintV.classList.remove('visible');
    }

    // Reset form
    var form = document.getElementById('landingForm');
    if (form) {
      form.reset();
      var btn  = form.querySelector('.landing-submit');
      var span = btn && btn.querySelector('span');
      if (btn)  btn.disabled = false;
      if (span) span.textContent = 'Tell Us About Your Project';
    }

    // Allow re-entry: must be last
    state.journeyStarted = false;
    snapTimer = null;
  }

  // ============================================
  // INIT
  // ============================================

  function init() {
    if (isStandalone) {
      startJourney();
      return;
    }

    var hSection = document.getElementById('journey-horizontal');
    if (!hSection) return;

    // Observe the horizontal section.
    // When >25 % in view, wait 1 s then:
    //   — hide the sidebar immediately (so it's gone before the snap completes)
    //   — use Lenis to snap viewer to the section, then start journey.
    // Cancels if the section drops below 25 % before the timer fires.
    // Journey is the last section, so no "scrolled past" case to guard.
    var startObs = new IntersectionObserver(function(entries) {
      var ratio = entries[0].intersectionRatio;

      if (ratio >= 0.25 && !state.journeyStarted && !snapTimer) {
        snapTimer = setTimeout(function() {
          snapTimer = null;
          if (state.journeyStarted) return;
          // Hide sidebar as the journey overlay appears
          setSidebarHidden(true);
          // Start immediately — fixed overlay covers the full screen, no page scroll needed
          startJourney();
        }, 1000);
      } else if (ratio < 0.25 && snapTimer) {
        clearTimeout(snapTimer);
        snapTimer = null;
        // Restore sidebar if user scrolled back before snap fired
        if (!state.journeyStarted) setSidebarHidden(false);
      }
    }, { threshold: [0, 0.1, 0.25, 0.5] });

    startObs.observe(hSection);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
