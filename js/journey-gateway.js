/* ============================================
   EYEKONIKA — Journey Gateway
   Shows pulsing "scroll to begin" arrows near the
   absolute bottom of index.html. Fires a slide-up
   page transition to journey.html when the user
   reaches the scroll bottom.
   ============================================ */

(function () {
  'use strict';

  var inner = document.getElementById('gateway-inner');
  var fired = false;

  function scrollBottom() {
    return (
      document.documentElement.scrollHeight
      - window.innerHeight
      - (window.scrollY || window.pageYOffset)
    );
  }

  function onScroll() {
    if (fired) return;
    var dist = scrollBottom();

    // Show gateway when within ~400px of absolute bottom
    if (inner) {
      inner.classList.toggle('visible', dist <= 400);
    }

    // Fire transition at absolute bottom (≤2px tolerance for float rounding)
    if (dist <= 2) {
      fired = true;
      // Halt Lenis before animating to prevent scroll-fighting during exit
      if (window.destroyLenis) window.destroyLenis();
      document.body.classList.add('slide-up-exit');
      setTimeout(function () {
        window.location.href = 'journey.html';
      }, 750);
    }
  }

  // Use native scroll event — Lenis updates window.scrollY on every tick
  window.addEventListener('scroll', onScroll, { passive: true });

  // Also check once the page is fully laid out (smooth-scroll may shift heights)
  window.addEventListener('load', function () {
    setTimeout(onScroll, 300);
  });
})();
