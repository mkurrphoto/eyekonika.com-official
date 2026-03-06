/* ============================================
   INTRO — Background unblur + content reveal
   Waits for load.js to inject the component HTML,
   then drives two IntersectionObservers:
     1. Watches #intro-reveal → unblurs background + fades content in
     2. Reverses when #intro-reveal leaves viewport (scroll back up)
   ============================================ */
(function () {
  'use strict';

  function setup() {
    var bg      = document.getElementById('intro-bg');
    var reveal  = document.getElementById('intro-reveal');
    var content = document.getElementById('intro-reveal-content');

    if (!bg || !reveal || !content) {
      // Components not yet injected by load.js — retry
      setTimeout(setup, 80);
      return;
    }

    var revealed = false;

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting && !revealed) {
            // Reveal: unblur background, fade content in
            revealed = true;
            bg.classList.add('is-revealed');
            // Small stagger so content appears just after blur starts lifting
            setTimeout(function () {
              content.classList.remove('is-hiding');
              content.classList.add('is-visible');
            }, 280);

          } else if (!entry.isIntersecting && revealed) {
            // Reverse: re-blur background, hide content (scroll back up)
            revealed = false;
            bg.classList.remove('is-revealed');
            content.classList.remove('is-visible');
            content.classList.add('is-hiding');
          }
        });
      },
      {
        threshold: 0.08,
        rootMargin: '0px 0px -5% 0px'
      }
    );

    observer.observe(reveal);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setup);
  } else {
    setup();
  }
})();
