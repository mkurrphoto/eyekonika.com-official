/* ============================================
   EYEKONIKA — CONTACT JOURNEY JS v3
   Fixed: scroll debounce, back nav, mobile form
   ============================================ */

(function () {
  'use strict';

  // ---- State ----
  const state = {
    currentScene: 0,
    totalHScenes: 5,
    inHorizontal: true,
    transitioning: false,
    name: '', email: '', occasion: '', space: '', timeline: ''
  };

  // ---- Elements ----
  const track = document.getElementById('h-track');
  const progressDots = document.querySelectorAll('.progress-dot');
  const sceneNum = document.getElementById('scene-num');

  // ---- Cursor glow ----
  const glowEl = document.getElementById('cursor-glow');
  let glowX = 0, glowY = 0, mouseX = 0, mouseY = 0;
  document.addEventListener('mousemove', e => { mouseX = e.clientX; mouseY = e.clientY; });
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

    // Unlock after transition completes
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
  // Debounced: one action per gesture
  // ============================================

  // Wheel — accumulate delta, fire once per gesture
  var wheelAccum = 0;
  var wheelTimer = null;

  window.addEventListener('wheel', function(e) {
    if (!state.inHorizontal) return;
    e.preventDefault();

    wheelAccum += e.deltaY + e.deltaX;

    clearTimeout(wheelTimer);
    wheelTimer = setTimeout(function() {
      if (Math.abs(wheelAccum) < 20) { wheelAccum = 0; return; }

      if (wheelAccum > 0) {
        // Forward
        if (state.currentScene < state.totalHScenes - 1) {
          goToScene(state.currentScene + 1);
        } else {
          transitionToVertical();
        }
      } else {
        // Back
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
  }, { passive: true });

  window.addEventListener('touchend', function(e) {
    if (!state.inHorizontal || !touchMoved) return;
    var dx = touchStartX - e.changedTouches[0].clientX;
    var dy = touchStartY - e.changedTouches[0].clientY;

    // Only act on horizontal swipes
    if (Math.abs(dx) < Math.abs(dy)) return;
    if (Math.abs(dx) < 40) return;

    if (dx > 0) {
      // Swipe left = forward
      if (state.currentScene < state.totalHScenes - 1) {
        goToScene(state.currentScene + 1);
      } else {
        transitionToVertical();
      }
    } else {
      // Swipe right = back
      if (state.currentScene > 0) {
        goToScene(state.currentScene - 1);
      }
    }
  }, { passive: true });

  // Keyboard
  window.addEventListener('keydown', function(e) {
    if (!state.inHorizontal || state.transitioning) return;
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

    // Fade out chrome
    var progress = document.querySelector('.journey-progress');
    var counter = document.querySelector('.scene-counter');
    if (progress) { progress.style.transition = 'opacity 0.8s ease'; progress.style.opacity = '0'; }
    if (counter) { counter.style.transition = 'opacity 0.8s ease'; counter.style.opacity = '0'; }

    // Scroll to vertical
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
          var fields = document.getElementById('fields-6');
          var btn = document.getElementById('continue-1');
          if (fields) fields.classList.add('revealed');
          if (btn) btn.classList.add('revealed');
        }, 600);
        break;

      case 'v-scene-7':
        setTimeout(function() {
          revealWords(scene, 0);
          scene.querySelectorAll('.journey-choice').forEach(function(c, i) {
            setTimeout(function() { c.classList.add('revealed'); }, 400 + i * 120);
          });
        }, 300);
        break;

      case 'v-scene-8':
        setTimeout(function() {
          revealEl(scene.querySelector('.scene-eyebrow'), 0);
          revealWords(scene, 300);
          setTimeout(function() {
            revealEl(scene.querySelector('.scene-subtext'), 0);
            var fields = document.getElementById('fields-8');
            var btn = document.getElementById('continue-2');
            if (fields) fields.classList.add('revealed');
            if (btn) btn.classList.add('revealed');
          }, 800);
        }, 300);
        break;

      case 'v-scene-9':
        setTimeout(function() {
          revealWords(scene.querySelector('.kinetic-line'), 0);
          setTimeout(function() {
            revealEl(scene.querySelector('.scene-eyebrow'), 0);
            scene.querySelectorAll('.journey-choice').forEach(function(c, i) {
              setTimeout(function() { c.classList.add('revealed'); }, 200 + i * 120);
            });
          }, 600);
        }, 300);
        break;

      case 'v-scene-10':
        setTimeout(function() {
          var card = document.getElementById('final-card');
          if (card) card.classList.add('revealed');
          initMagnetic();
        }, 500);
        break;

      case 'v-scene-11':
        setTimeout(function() {
          revealEl(document.getElementById('confirm-main'), 0);
          revealEl(document.getElementById('confirm-sub'), 0);
          revealEl(document.getElementById('confirm-rule'), 0);
        }, 400);
        break;
    }
  }

  // ============================================
  // FORM INTERACTIONS
  // ============================================

  // Continue 1
  document.addEventListener('click', function(e) {
    if (!e.target.closest('#continue-1')) return;
    var name = document.getElementById('j-name');
    var email = document.getElementById('j-email');
    var nVal = name ? name.value.trim() : '';
    var eVal = email ? email.value.trim() : '';

    if (!nVal || !eVal) {
      shake(document.getElementById('fields-6'));
      return;
    }
    state.name = nVal;
    state.email = eVal;
    showVScene('v-scene-7');
  });

  // Occasion choices
  document.addEventListener('click', function(e) {
    var choice = e.target.closest('#occasion-choices .journey-choice');
    if (!choice) return;
    document.querySelectorAll('#occasion-choices .journey-choice').forEach(function(c) {
      c.classList.remove('selected');
    });
    choice.classList.add('selected');
    state.occasion = choice.dataset.value;

    var eyebrowMap = {
      memorial: "Tell us about who you're remembering.",
      institutional: 'Help us understand the space.',
      gift: 'Help us see the occasion.',
      other: 'Help us see your vision.'
    };
    var eyebrow = document.getElementById('scene-8-eyebrow');
    if (eyebrow) eyebrow.textContent = eyebrowMap[state.occasion] || 'Help us see it.';

    showVScene('v-scene-8', 350);
  });

  // Continue 2
  document.addEventListener('click', function(e) {
    if (!e.target.closest('#continue-2')) return;
    var space = document.getElementById('j-space');
    var sVal = space ? space.value.trim() : '';
    if (!sVal) { shake(document.getElementById('fields-8')); return; }
    state.space = sVal;
    showVScene('v-scene-9');
  });

  // Timeline choices
  document.addEventListener('click', function(e) {
    var choice = e.target.closest('#timeline-choices .journey-choice');
    if (!choice) return;
    document.querySelectorAll('#timeline-choices .journey-choice').forEach(function(c) {
      c.classList.remove('selected');
    });
    choice.classList.add('selected');
    state.timeline = choice.dataset.value;
    showVScene('v-scene-10', 350);
  });

  // Form submit
  document.addEventListener('submit', function(e) {
    if (e.target.id !== 'journeyForm') return;
    e.preventDefault();

    document.getElementById('j-hidden-name').value = state.name;
    document.getElementById('j-hidden-email').value = state.email;
    document.getElementById('j-hidden-occasion').value = state.occasion;
    document.getElementById('j-hidden-space').value = state.space;
    document.getElementById('j-hidden-timeline').value = state.timeline;

    fetch(e.target.action, {
      method: 'POST',
      body: new FormData(e.target),
      headers: { 'Accept': 'application/json' }
    }).then(function(res) {
      afterSubmit();
    }).catch(function() {
      afterSubmit();
    });
  });

  function afterSubmit() {
    var s10 = document.getElementById('v-scene-10');
    if (s10) {
      s10.style.transition = 'opacity 1s ease';
      s10.style.opacity = '0';
      setTimeout(function() { s10.style.display = 'none'; }, 1000);
    }
    showVScene('v-scene-11', 800);
  }

  // Magnetic submit button
  function initMagnetic() {
    var wrap = document.querySelector('.submit-magnetic');
    if (!wrap) return;
    wrap.addEventListener('mousemove', function(e) {
      var rect = wrap.getBoundingClientRect();
      var x = (e.clientX - rect.left - rect.width / 2) * 0.2;
      var y = (e.clientY - rect.top - rect.height / 2) * 0.2;
      wrap.style.transform = 'translate(' + x + 'px,' + y + 'px)';
    });
    wrap.addEventListener('mouseleave', function() {
      wrap.style.transition = 'transform 0.7s cubic-bezier(0.76,0,0.24,1)';
      wrap.style.transform = 'translate(0,0)';
    });
  }

  // ============================================
  // INIT
  // ============================================

  function init() {
    // Prevent native scroll on horizontal section
    var hSection = document.getElementById('journey-horizontal');
    if (hSection) {
      hSection.style.overflow = 'hidden';
      hSection.style.touchAction = 'pan-y'; // allow vertical touch to pass through if needed
    }

    // Kick off scene 1
    goToScene(0);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
