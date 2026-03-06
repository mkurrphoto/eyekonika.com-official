/* ============================================
   INTRO — Panel reveal via IntersectionObserver
   Waits for load.js to inject the component HTML,
   then watches intro-panel-content entering viewport.
   ============================================ */
(function () {
  'use strict';

  function setup() {
    var content = document.getElementById('intro-panel-content');
    if (!content) {
      // Component not yet injected; retry shortly
      setTimeout(setup, 80);
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    );

    observer.observe(content);
  }

  // Start after DOM is parsed (load.js runs at DOMContentLoaded too)
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setup);
  } else {
    setup();
  }
})();
