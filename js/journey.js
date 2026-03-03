/* ============================================
   EYEKONIKA — CONTACT JOURNEY JS v4
   Simplified: clean 3-field post-scroll form
   Embedded support via IntersectionObserver
   ============================================ */

(function () {
  'use strict';

  // Bail if no journey track on this page
  var track = document.getElementById('h-track');
  if (!track) return;

  // ---- Mode detection ----
  // begin.html has class="is-journey" on body; index.html does not
  var isStandalone = document.body.classList.contains('is-journey');
  var journeyVisible = isStandalone; // embedded starts invisible

  // ---- State ----
  var state = {
    currentScene: 0,
    totalHScenes: 5,
    inHorizontal: true,
    transitioning: false,
    journeyStarted: false
  };

  // ---- Elements ----
  var progressDots = document.querySelectorAll('.progress-dot');
  var sceneNum = document.getElementById('scene-num');

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

  function shake(el) {
    if (!el) return;
    var seq = [-6, 6, -4, 4, -2, 2, 0];
    seq.forEach(function(x, i) {
      setTimeout(function() {
        el.style.transition = 'transform 0.08s ease';
        el.style.transform = 'translateX(' + x + 'px)';
      }, i * 80);
    });
  }

  // ============================================
  // HORIZONTAL NAVIGATION
  // ============================================

  function goToScene(index) {
    if (index < 0 || index >= state.totalHScenes) return;
    if (state.transitioning) return;

    state.transitioning = true;
    state.currentScene = index;

    if (track) track.style.transform = 'translateX(-' + (index * 100) + 'vw)';

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
  // SCROLL / SWIPE / KEYBOARD INPUT
  // Only active when journeyVisible && inHorizontal
  // ============================================

  var wheelAccum = 0;
  var wheelTimer = null;

  window.addEventListener('wheel', function(e) {
    if (!state.inHorizontal || !journeyVisible) return;
    e.preventDefault();

    wheelAccum += e.deltaY + e.deltaX;

    clearTimeout(wheelTimer);
    wheelTimer = setTimeout(function() {
      if (Math.abs(wheelAccum) < 20) { wheelAccum = 0; return; }

      if (wheelAccum > 0) {
        if (state.currentScene < state.totalHScenes - 1) {
          goToScene(state.currentScene + 1);
        } else {
          transitionToVertical();
        }
      } else {
        if (state.currentScene > 0) {
          goToScene(state.currentScene - 1);
        }
      }
      wheelAccum = 0;
    }, 50);
  }, { passive: false });

  // Touch swipe
  var touchStartX = 0;
  var touchStartY = 0;
  var touchMoved = false;

  window.addEventListener('touchstart', function(e) {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
    touchMoved = false;
  }, { passive: true });

  window.addEventListener('touchmove', function(e) {
    touchMoved = true;
    if (state.inHorizontal && journeyVisible) e.preventDefault();
  }, { passive: false });

  window.addEventListener('touchend', function(e) {
    if (!state.inHorizontal || !journeyVisible || !touchMoved) return;
    var dx = touchStartX - e.changedTouches[0].clientX;
    var dy = touchStartY - e.changedTouches[0].clientY;
    var absDx = Math.abs(dx);
    var absDy = Math.abs(dy);

    if (absDx < 30 && absDy < 30) return;

    var goForward = absDx >= absDy ? dx > 0 : dy > 0;

    if (goForward) {
      if (state.currentScene < state.totalHScenes - 1) {
        goToScene(state.currentScene + 1);
      } else {
        transitionToVertical();
      }
    } else {
      if (state.currentScene > 0) {
        goToScene(state.currentScene - 1);
      }
    }
  }, { passive: true });

  // Keyboard
  window.addEventListener('keydown', function(e) {
    if (!state.inHorizontal || !journeyVisible || state.transitioning) return;
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
  });

  // Progress dot clicks
  progressDots.forEach(function(dot, i) {
    dot.addEventListener('click', function() {
      if (!state.inHorizontal) return;
      goToScene(i);
    });
  });

  // ============================================
  // TRANSITION: HORIZONTAL → VERTICAL
  // ============================================

  function transitionToVertical() {
    if (!state.inHorizontal || state.transitioning) return;
    state.transitioning = true;
    state.inHorizontal = false;

    // Resume Lenis smooth scroll
    if (window.lenis) window.lenis.start();

    // Fade out chrome
    var progress = document.querySelector('.journey-progress');
    var counter = document.querySelector('.scene-counter');
    if (progress) { progress.style.transition = 'opacity 0.8s ease'; progress.style.opacity = '0'; }
    if (counter) { counter.style.transition = 'opacity 0.8s ease'; counter.style.opacity = '0'; }

    var vSection = document.getElementById('journey-vertical');
    setTimeout(function() {
      if (vSection) vSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      triggerVScene('v-bridge');
      setTimeout(function() {
        triggerVScene('v-scene-6');
        state.transitioning = false;
      }, 800);
    }, 500);
  }

  // ============================================
  // VERTICAL SCENES
  // ============================================

  function showVScene(id, delay) {
    delay = delay || 300;
    setTimeout(function() {
      var scene = document.getElementById(id);
      if (!scene) return;

      scene.style.display = 'flex';
      scene.style.opacity = '0';
      scene.style.transform = 'translateY(30px)';
      scene.style.transition = 'none';

      requestAnimationFrame(function() {
        requestAnimationFrame(function() {
          scene.style.transition = 'opacity 1.2s ease, transform 1.2s cubic-bezier(0.16,1,0.3,1)';
          scene.style.opacity = '1';
          scene.style.transform = 'translateY(0)';
          setTimeout(function() {
            scene.scrollIntoView({ behavior: 'smooth', block: 'center' });
            triggerVScene(id);
          }, 150);
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
          var trustStrip = document.getElementById('trust-strip');
          var heading = scene.querySelector('.form-section-heading');
          var formDivider = document.getElementById('form-divider');
          var fields = document.getElementById('fields-6');
          var actions = scene.querySelector('.form-actions');
          var testimonial = scene.querySelector('.trust-testimonial');

          if (trustStrip) trustStrip.classList.add('revealed');
          if (formDivider) formDivider.classList.add('revealed');
          if (heading) setTimeout(function() { heading.classList.add('revealed'); }, 300);
          if (fields)  setTimeout(function() { fields.classList.add('revealed'); }, 600);
          if (actions) setTimeout(function() { actions.classList.add('revealed'); }, 1000);
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

    var btn = e.target.querySelector('.landing-submit');
    if (btn) {
      btn.disabled = true;
      var span = btn.querySelector('span');
      if (span) span.textContent = 'Sending\u2026';
    }

    fetch(e.target.action, {
      method: 'POST',
      body: new FormData(e.target),
      headers: { 'Accept': 'application/json' }
    }).then(function() {
      afterLandingSubmit();
    }).catch(function() {
      afterLandingSubmit();
    });
  });

  function afterLandingSubmit() {
    var s6 = document.getElementById('v-scene-6');
    if (s6) {
      s6.style.transition = 'opacity 1s ease';
      s6.style.opacity = '0';
      setTimeout(function() { s6.style.display = 'none'; }, 1000);
    }
    showVScene('v-scene-confirm', 800);
  }

  // ============================================
  // INIT
  // ============================================

  function startJourney() {
    if (state.journeyStarted) return;
    state.journeyStarted = true;

    document.body.classList.add('journey-active');

    var hSection = document.getElementById('journey-horizontal');
    if (hSection) {
      hSection.style.overflow = 'hidden';
      hSection.style.touchAction = window.innerWidth <= 768 ? 'none' : 'pan-y';
    }

    goToScene(0);
  }

  function init() {
    if (isStandalone) {
      // begin.html — start immediately, journey-active added in startJourney()
      startJourney();
    } else {
      // Embedded in index.html — observe viewport
      var hSection = document.getElementById('journey-horizontal');
      var embedRoot = document.querySelector('.journey-embed-root') || hSection;
      if (!hSection) return;

      // Start animations when horizontal section is 50% visible
      var startObs = new IntersectionObserver(function(entries) {
        if (entries[0].intersectionRatio >= 0.5) {
          startJourney();
          startObs.disconnect();
        }
      }, { threshold: 0.5 });
      startObs.observe(hSection);

      // journey-active: show float-footer + hide sidebar whenever any part of journey is in view
      var activeObs = new IntersectionObserver(function(entries) {
        if (entries[0].isIntersecting) {
          document.body.classList.add('journey-active');
        } else {
          document.body.classList.remove('journey-active');
        }
      }, { threshold: 0 });
      activeObs.observe(embedRoot);

      // Manage Lenis pause/resume for horizontal scroll lock
      var scrollObs = new IntersectionObserver(function(entries) {
        var ratio = entries[0].intersectionRatio;
        var wasVisible = journeyVisible;
        journeyVisible = ratio >= 0.9;

        if (journeyVisible && state.inHorizontal) {
          if (window.lenis) window.lenis.stop();
        } else if (wasVisible && !journeyVisible) {
          if (window.lenis) window.lenis.start();
        }
      }, { threshold: [0, 0.5, 0.9, 1.0] });
      scrollObs.observe(hSection);
    }

    // Float-footer mobile tap toggle
    var floatFooter = document.getElementById('float-footer');
    var ffLogo = document.getElementById('ff-logo');
    if (floatFooter && ffLogo) {
      ffLogo.addEventListener('click', function(e) {
        if (window.innerWidth <= 768) {
          e.stopPropagation();
          floatFooter.classList.toggle('open');
        }
      });
      document.addEventListener('click', function(e) {
        if (window.innerWidth <= 768 && floatFooter.classList.contains('open')) {
          if (!floatFooter.contains(e.target)) {
            floatFooter.classList.remove('open');
          }
        }
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
