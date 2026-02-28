/* ============================================
   EYEKONIKA — TIMELINE JS v2
   Scroll-driven reveals, card expand/collapse,
   progress line animation, sidebar logic
   ============================================ */

(function () {
  'use strict';

  window.addEventListener('load', function () {
    setTimeout(function () {
      initBackground();
      initHeaderReveal();
      initScrollReveal();
      initProgressLine();
      initCardInteraction();
      initSidebarScrollLock();
      initIntroObserver();
    }, 300);
  });

  // ============================================
  // Background — scroll-linked orb drift
  // Uses a single CSS custom property update
  // so the browser compositor handles rendering
  // ============================================
  function initBackground() {
    var section = document.querySelector('.timeline-section');
    if (!section) return;

    var ticking = false;
    var lastY = 0;

    function onScroll() {
      lastY = window.scrollY;
      if (!ticking) {
        requestAnimationFrame(function () {
          var rect = section.getBoundingClientRect();
          var progress = Math.max(0, Math.min(1,
            -rect.top / (rect.height - window.innerHeight)
          ));
          section.style.setProperty('--tl-scroll', progress.toFixed(3));
          ticking = false;
        });
        ticking = true;
      }
    }

    var scrollSrc = window.lenis || window;
    var evtName = window.lenis ? 'scroll' : 'scroll';
    scrollSrc.addEventListener(evtName, onScroll, { passive: true });
    onScroll();
  }

  // ============================================
  // Header reveal on first intersection
  // ============================================
  function initHeaderReveal() {
    var eyebrow = document.querySelector('.timeline-eyebrow');
    var title   = document.querySelector('.timeline-title');
    var rule    = document.querySelector('.timeline-header-rule');

    var targets = [eyebrow, title, rule].filter(Boolean);
    if (!targets.length) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('tl-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    targets.forEach(function (el) { observer.observe(el); });
  }

  // ============================================
  // Scroll-driven card reveals
  // Each item fades/slides in when it enters
  // the viewport — no JS timeout loops
  // ============================================
  function initScrollReveal() {
    var items = document.querySelectorAll('.timeline-item');
    if (!items.length) return;

    // Step 5 uses a lower threshold for cinematic effect
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // Once visible, mark as complete for progress line
          setTimeout(function () {
            entry.target.classList.add('complete');
          }, 600);
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -60px 0px'
    });

    items.forEach(function (item) {
      observer.observe(item);
    });
  }

  // ============================================
  // Progress line — fills as you scroll
  // through each item, tied to scroll position
  // ============================================
  function initProgressLine() {
    var lineFill = document.querySelector('.timeline-line-fill');
    var section  = document.querySelector('.timeline-section');
    if (!lineFill || !section) return;

    var ticking = false;

    function updateLine() {
      if (ticking) return;
      requestAnimationFrame(function () {
        var rect   = section.getBoundingClientRect();
        var total  = section.offsetHeight - window.innerHeight;
        var scrolled = Math.max(0, -rect.top);
        var pct   = total > 0 ? Math.min(100, (scrolled / total) * 100) : 0;
        lineFill.style.height = pct.toFixed(1) + '%';
        ticking = false;
      });
      ticking = true;
    }

    var scrollSrc = window.lenis || window;
    scrollSrc.addEventListener('scroll', updateLine, { passive: true });
    updateLine();
  }

  // ============================================
  // Card interactions
  // Desktop: hover expands (CSS handles it)
  // Mobile: tap to expand/collapse
  // ============================================
  function initCardInteraction() {
    var cards = document.querySelectorAll('.timeline-card');
    if (!cards.length) return;

    // Detect touch device
    var isTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

    cards.forEach(function (card) {
      if (isTouch) {
        // Tap toggles expanded state
        card.addEventListener('click', function (e) {
          // Don't interfere with the actual link clicks
          if (e.target.closest('.card-link')) return;

          var wasExpanded = card.classList.contains('expanded');

          // Collapse all other cards
          cards.forEach(function (c) {
            if (c !== card) c.classList.remove('expanded');
          });

          // Toggle this card
          card.classList.toggle('expanded', !wasExpanded);
        });
      } else {
        // Desktop: focus tracking for keyboard users
        card.setAttribute('tabindex', '0');

        card.addEventListener('keydown', function (e) {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            card.classList.toggle('expanded');
          }
        });
      }
    });
  }

  // ============================================
  // Sidebar scroll lock
  // Preserved from original — hides sidebar
  // when timeline is in view on large screens
  // ============================================
  function initSidebarScrollLock() {
    if (window.innerWidth <= 1280) return;

    var sidebar  = document.getElementById('sidebar');
    var wrapper  = document.getElementById('wrapper');
    var timeline = document.getElementById('timeline');
    if (!sidebar || !wrapper || !timeline) return;

    var state = 'normal';

    function scrollHandler() {
      var rect = timeline.getBoundingClientRect();
      var vh   = window.innerHeight;

      var insideEnter = rect.top < vh * 0.8 && rect.bottom > vh * 0.5;
      var outsideExit = rect.bottom < vh * 0.2 || rect.top > vh * 0.98;

      if (state === 'normal' && insideEnter) {
        state = 'fullscreen';
        sidebar.classList.add('hide-sidebar');
        wrapper.classList.add('expand-wrapper');
      } else if (state === 'fullscreen' && outsideExit) {
        state = 'normal';
        sidebar.classList.remove('hide-sidebar');
        wrapper.classList.remove('expand-wrapper');
      }
    }

    function setupListener() {
      if (window.lenis) {
        window.lenis.on('scroll', scrollHandler);
      } else {
        window.addEventListener('scroll', scrollHandler, { passive: true });
        var check = setInterval(function () {
          if (window.lenis) {
            window.removeEventListener('scroll', scrollHandler);
            window.lenis.on('scroll', scrollHandler);
            clearInterval(check);
          }
        }, 100);
        setTimeout(function () { clearInterval(check); }, 5000);
      }
    }

    setupListener();
  }

  // ============================================
  // Intro observer
  // Restores sidebar when intro is back in view
  // ============================================
  function initIntroObserver() {
    var intro   = document.getElementById('intro');
    var sidebar = document.getElementById('sidebar');
    var wrapper = document.getElementById('wrapper');
    if (!intro || !sidebar || !wrapper) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          sidebar.classList.remove('hide-sidebar');
          wrapper.classList.remove('expand-wrapper');
        }
      });
    }, { threshold: 0.4 });

    observer.observe(intro);
  }

})();
