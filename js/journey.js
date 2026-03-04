/* ============================================
   EYEKONIKA — CONTACT JOURNEY JS v6
   Fixed fullscreen overlay.
   All scroll prevention via inline styles.
   All transitions via inline style (no CSS class dependency).
   ============================================ */

(function () {
  'use strict';

  var track = document.getElementById('h-track');
  if (!track) return;

  var isStandalone = document.body.classList.contains('is-journey');

  // ---- State ----
  var state = {
    currentScene   : 0,
    totalHScenes   : 5,
    inHorizontal   : true,
    inJourney      : false,
    transitioning  : false,
    journeyStarted : false,
    journeyComplete: false   // true after form submit — locks all navigation
  };

  // ---- Cached elements (queried once at load; components are already in DOM) ----
  var progressDots = document.querySelectorAll('.progress-dot');
  var sceneNum     = document.getElementById('scene-num');

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
        setTimeout(function() { revealEl(scene.querySelector('.scene-divider-inner'), 0); }, 700);
        setTimeout(function() { revealWords(scene.querySelector('.question-line'), 0); }, 1100);
        setTimeout(function() {
          var hint = document.getElementById('scroll-hint-v');
          if (hint) hint.classList.add('visible');
        }, 2200);
        break;
    }
  }

  // ============================================
  // INPUT HANDLERS — guard: state.inJourney
  // ============================================

  var wheelAccum = 0;
  var wheelTimer = null;

  window.addEventListener('wheel', function(e) {
    if (!state.inJourney) return;
    e.preventDefault();
    if (state.journeyComplete) return; // locked at confirmation screen

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
          // scene 0, backward: escape button is the only exit
        }
      } else {
        // Vertical: backward only
        if (wheelAccum < 0) transitionToHorizontal();
      }
      wheelAccum = 0;
    }, 50);
  }, { passive: false });

  // Touch
  var touchStartX = 0, touchStartY = 0;
  var touchMoved  = false;

  window.addEventListener('touchstart', function(e) {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
    touchMoved  = false;
  }, { passive: true });

  window.addEventListener('touchmove', function(e) {
    touchMoved = true;
    // Only hard-prevent in horizontal — vertical needs native scroll for form content
    if (state.inJourney && state.inHorizontal) e.preventDefault();
  }, { passive: false });

  window.addEventListener('touchend', function(e) {
    if (!state.inJourney || !touchMoved || state.journeyComplete) return;
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
      }
    } else {
      // In vertical: upward swipe (goForward === false on vertical axis) returns to horizontal
      if (!goForward && absDy > absDx) transitionToHorizontal();
    }
  }, { passive: true });

  // Keyboard
  window.addEventListener('keydown', function(e) {
    if (!state.inJourney) return;

    // Let all keys pass through normally when a form field has focus
    var tag = document.activeElement && document.activeElement.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
    if (state.journeyComplete) { e.preventDefault(); return; }

    // Block all native page-scroll keys
    var scrollKeys = [' ', 'PageDown', 'PageUp', 'Home', 'End'];
    if (scrollKeys.indexOf(e.key) !== -1) {
      e.preventDefault();
      // Space acts as forward navigation
      if (e.key === ' ' && !state.transitioning && state.inHorizontal) {
        if (state.currentScene < state.totalHScenes - 1) {
          goToScene(state.currentScene + 1);
        } else {
          transitionToVertical();
        }
      }
      return;
    }

    if (state.transitioning) return;

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
      }
    } else {
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

  // Confirm-screen nav buttons — tear down the journey then scroll to target section
  function navigateFromConfirm(destId) {
    state.inJourney = false;
    document.body.classList.remove('journey-active');
    unlockScroll();
    clearOverlay();
    clearVerticalPanel();
    setSidebarHidden(false);
    var hSection = document.getElementById('journey-horizontal');
    if (hSection) hSection.style.touchAction = '';
    if (!isStandalone && window.reinitLenis) window.reinitLenis();
    resetJourney();
    var dest = document.getElementById(destId);
    if (dest) {
      setTimeout(function() {
        if (window.lenis) window.lenis.scrollTo(dest, { duration: 1.0 });
        else dest.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }

  document.addEventListener('click', function(e) {
    var btn = e.target.closest('.confirm-nav-btn');
    if (btn) { navigateFromConfirm(btn.getAttribute('data-target')); return; }
  });
  document.addEventListener('touchend', function(e) {
    var btn = e.target.closest('.confirm-nav-btn');
    if (btn) { e.preventDefault(); navigateFromConfirm(btn.getAttribute('data-target')); return; }
  }, { passive: false });

  // Escape button — event delegation on both click (desktop) and touchend (mobile).
  // touchmove e.preventDefault() can suppress click on mobile, so touchend is the
  // reliable path for touch devices.
  document.addEventListener('click', function(e) {
    if (e.target.closest('#journey-escape-btn')) escapeJourney();
  });
  document.addEventListener('touchend', function(e) {
    if (e.target.closest('#journey-escape-btn')) {
      e.preventDefault(); // prevent ghost click
      escapeJourney();
    }
  }, { passive: false });

  // ============================================
  // TRANSITIONS: HORIZONTAL ↔ VERTICAL
  // All via inline style — no CSS class dependency
  // ============================================

  function transitionToVertical() {
    if (!state.inHorizontal || state.transitioning) return;
    state.transitioning = true;
    state.inHorizontal  = false;

    // Fade out chrome
    var progress = document.querySelector('.journey-progress');
    var counter  = document.querySelector('.scene-counter');
    if (progress) { progress.style.transition = 'opacity 0.8s ease'; progress.style.opacity = '0'; }
    if (counter)  { counter.style.transition  = 'opacity 0.8s ease'; counter.style.opacity  = '0'; }

    // Slide vertical panel up — driven by inline style (CSS inline beats any class rule)
    var vSection = document.getElementById('journey-vertical');
    if (vSection) vSection.style.transform = 'translateY(0)';

    setTimeout(function() {
      triggerVScene('v-scene-6');
      setTimeout(function() { state.transitioning = false; }, 900);
    }, 300);
  }

  function transitionToHorizontal() {
    if (state.inHorizontal || state.transitioning) return;
    state.transitioning = true;
    state.inHorizontal  = true;

    // Restore chrome
    var progress = document.querySelector('.journey-progress');
    var counter  = document.querySelector('.scene-counter');
    if (progress) { progress.style.transition = 'opacity 0.8s ease'; progress.style.opacity = ''; }
    if (counter)  { counter.style.transition  = 'opacity 0.8s ease'; counter.style.opacity  = ''; }

    // Slide vertical panel back down
    var vSection = document.getElementById('journey-vertical');
    if (vSection) vSection.style.transform = 'translateY(100%)';

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
      // Already visible — skip re-animation (back→forward navigation)
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
          if (heading)    setTimeout(function() { heading.classList.add('revealed');     }, 300);
          if (fields)     setTimeout(function() { fields.classList.add('revealed');      }, 600);
          if (actions)    setTimeout(function() { actions.classList.add('revealed');     }, 1000);
          if (testimonial) setTimeout(function() { testimonial.classList.add('revealed'); }, 1600);
        }, 300);
        break;

      case 'v-scene-confirm':
        setTimeout(function() {
          revealEl(document.getElementById('confirm-main'), 0);
          revealEl(document.getElementById('confirm-sub'), 400);
          revealEl(document.getElementById('confirm-rule'), 800);
          revealEl(document.getElementById('confirm-nav'), 1800);
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
    state.journeyComplete = true; // lock all journey navigation

    // Fade out the form, then show the confirm scene on top (absolute overlay)
    var s6 = document.getElementById('v-scene-6');
    if (s6) {
      s6.style.transition = 'opacity 0.8s ease';
      s6.style.opacity    = '0';
    }
    var confirm = document.getElementById('v-scene-confirm');
    if (confirm) {
      confirm.style.display    = 'flex';
      confirm.style.opacity    = '0';
      confirm.style.transition = 'none';
      setTimeout(function() {
        confirm.style.transition = 'opacity 1.2s ease';
        confirm.style.opacity    = '1';
        triggerVScene('v-scene-confirm');
      }, 700);
    }
  }

  // ============================================
  // SIDEBAR HELPER
  // ============================================

  function setSidebarHidden(hidden) {
    var sidebar = document.getElementById('sidebar');
    if (!sidebar) return;
    if (hidden) { sidebar.classList.add('hide-sidebar'); }
    else        { sidebar.classList.remove('hide-sidebar'); }
  }

  // ============================================
  // SCROLL LOCK / UNLOCK
  // Applied to both html AND body via inline style.
  // Inline style beats any CSS rule, and locking both
  // covers all browsers (scroll root differs by browser).
  // ============================================

  function lockScroll() {
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow            = 'hidden';
  }

  function unlockScroll() {
    document.documentElement.style.overflow = '';
    document.body.style.overflow            = '';
  }

  // ============================================
  // OVERLAY HELPERS
  // The embed-root becomes a fixed fullscreen layer.
  // Set / clear via inline style — no CSS class dependency.
  // ============================================

  function applyOverlay() {
    var el = document.querySelector('.journey-embed-root');
    if (!el) return;
    el.style.position = 'fixed';
    el.style.top      = '0';
    el.style.left     = '0';
    el.style.right    = '0';
    el.style.bottom   = '0';
    // Must be above sidebar (z-index: 10000). No overflow:hidden here —
    // fixed inset:0 can't overflow, and overflow:hidden on a stacking context
    // clips position:fixed descendants in Chrome/Safari (browser bug).
    el.style.zIndex   = '10001';
    el.style.overflow = '';
  }

  function clearOverlay() {
    var el = document.querySelector('.journey-embed-root');
    if (!el) return;
    el.style.position = '';
    el.style.top      = '';
    el.style.left     = '';
    el.style.right    = '';
    el.style.bottom   = '';
    el.style.zIndex   = '';
    el.style.overflow = '';
  }

  // Set up journey-vertical as an absolute panel inside the overlay.
  // Driven by inline style so CSS class rules can't interfere.
  function applyVerticalPanel() {
    var el = document.getElementById('journey-vertical');
    if (!el) return;
    el.style.position   = 'absolute';
    el.style.top        = '0';
    el.style.left       = '0';
    el.style.right      = '0';
    el.style.bottom     = '0';
    el.style.transform  = 'translateY(100%)';           // starts off-screen below
    el.style.transition = 'transform 1.1s cubic-bezier(0.76, 0, 0.24, 1)';
    el.style.overflow   = 'hidden';
    el.style.willChange = 'transform';
  }

  function clearVerticalPanel() {
    var el = document.getElementById('journey-vertical');
    if (!el) return;
    el.style.position   = '';
    el.style.top        = '';
    el.style.left       = '';
    el.style.right      = '';
    el.style.bottom     = '';
    el.style.transform  = '';
    el.style.transition = '';
    el.style.overflow   = '';
    el.style.willChange = '';
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

    // Lock scroll on BOTH html and body (covers all browsers)
    lockScroll();

    // Apply fixed fullscreen overlay via inline style (immune to CSS specificity)
    applyOverlay();

    // Prepare vertical panel (starts below viewport)
    applyVerticalPanel();

    // Destroy Lenis entirely — lenis.stop() still processes wheel events
    // and can fire one more scrollTo() before the stopped flag takes effect.
    // destroyLenis() removes all listeners; reinitLenis() restores on exit.
    if (!isStandalone && window.destroyLenis) window.destroyLenis();

    var hSection = document.getElementById('journey-horizontal');
    if (hSection) {
      hSection.style.overflow    = 'hidden';
      hSection.style.touchAction = 'none';
    }

    goToScene(0);
  }

  function escapeJourney() {
    if (!state.inJourney && !state.journeyStarted) return;

    state.inJourney = false;
    document.body.classList.remove('journey-active');

    // Restore scroll, overlay, vertical panel
    unlockScroll();
    clearOverlay();
    clearVerticalPanel();

    setSidebarHidden(false);

    var hSection = document.getElementById('journey-horizontal');
    if (hSection) hSection.style.touchAction = '';

    // Reinstate Lenis smooth scroll
    if (!isStandalone && window.reinitLenis) window.reinitLenis();

    // Reset state for replay (1 s snap-entry delay prevents instant re-trigger)
    resetJourney();

    // Scroll up to gallery — reinitLenis is async (ticker delay), so use
    // a small wait before calling lenis.scrollTo; fall back to native.
    var dest = document.getElementById('gallery') || document.getElementById('timeline');
    if (dest) {
      setTimeout(function() {
        if (window.lenis) window.lenis.scrollTo(dest, { duration: 1.0 });
        else dest.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }

  function resetJourney() {
    state.currentScene    = 0;
    state.inHorizontal    = true;
    state.transitioning   = false;
    state.journeyComplete = false;

    // Reset h-track and chrome
    track.style.transform = 'translateX(0)';
    progressDots.forEach(function(d, i) { d.classList.toggle('active', i === 0); });
    if (sceneNum) sceneNum.textContent = '01';

    var progress = document.querySelector('.journey-progress');
    var counter  = document.querySelector('.scene-counter');
    if (progress) { progress.style.opacity = ''; progress.style.transition = ''; }
    if (counter)  { counter.style.opacity  = ''; counter.style.transition  = ''; }

    // Reset v-scenes
    // v-scene-6 is always present (no display:none); confirm overlay is hidden
    var vScene6       = document.getElementById('v-scene-6');
    var vSceneConfirm = document.getElementById('v-scene-confirm');
    if (vScene6) {
      vScene6.style.opacity    = '';
      vScene6.style.transform  = '';
      vScene6.style.transition = '';
    }
    if (vSceneConfirm) {
      vSceneConfirm.style.display    = 'none';
      vSceneConfirm.style.opacity    = '';
      vSceneConfirm.style.transition = '';
      var nav = document.getElementById('confirm-nav');
      if (nav) nav.classList.remove('revealed');
    }

    // Strip all reveal classes
    var embedRoot = document.querySelector('.journey-embed-root');
    if (embedRoot) {
      embedRoot.querySelectorAll('.revealed').forEach(function(el) {
        el.classList.remove('revealed');
      });
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

    // Allow re-entry — must be last
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

    // When journey section is 25%+ in view, wait 1 s then activate the overlay.
    // Timer cancels if section drops below 25% before firing (user scrolled away).
    var startObs = new IntersectionObserver(function(entries) {
      var ratio = entries[0].intersectionRatio;

      if (ratio >= 0.25 && !state.journeyStarted && !snapTimer) {
        snapTimer = setTimeout(function() {
          snapTimer = null;
          if (state.journeyStarted) return;
          setSidebarHidden(true);
          startJourney();
        }, 1000);
      } else if (ratio < 0.25 && snapTimer) {
        clearTimeout(snapTimer);
        snapTimer = null;
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
