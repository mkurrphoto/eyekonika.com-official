/* ============================================
   EYEKONIKA — Journey Gateway
   Two ways to enter the journey:
     1. Click the #journey-gate-btn (static section below all content)
     2. Scroll to the absolute page bottom (auto-fire fallback)
   Visual invitation lives in #journey-gate in the DOM.
   The fixed #journey-gateway div is kept for markup compatibility only.
   ============================================ */

(function () {
  'use strict';

  var fired = false;

  function fireTransition() {
    if (fired) return;
    fired = true;
    if (window.destroyLenis) window.destroyLenis();
    document.body.classList.add('slide-up-exit');
    setTimeout(function () {
      window.location.href = 'journey.html';
    }, 750);
  }

  // Auto-fire when user scrolls to the absolute page bottom
  function scrollBottom() {
    return (
      document.documentElement.scrollHeight
      - window.innerHeight
      - (window.scrollY || window.pageYOffset)
    );
  }

  function onScroll() {
    if (fired) return;
    if (scrollBottom() <= 2) fireTransition();
  }

  window.addEventListener('scroll', onScroll, { passive: true });

  // Wire up the static gateway button
  window.addEventListener('load', function () {
    var btn = document.getElementById('journey-gate-btn');
    if (btn) btn.addEventListener('click', fireTransition);

    // One-time check in case page loaded already at bottom
    setTimeout(onScroll, 300);
  });
})();
