/**
 * Float-In Animation for Sidebar Tabs
 * Creates a smooth, creative floating animation when tabs appear
 */

(function() {
  'use strict';

  // Wait for DOM and sidebar to be ready
  function initTabsFloatAnimation() {
    const sidebar = document.querySelector('#sidebar');
    if (!sidebar) {
      // Retry after a short delay if sidebar isn't loaded yet
      setTimeout(initTabsFloatAnimation, 100);
      return;
    }

    const tabItems = sidebar.querySelectorAll('nav > ul > li');
    if (tabItems.length === 0) {
      // Retry if tabs aren't loaded yet (waiting for load.js to inject HTML)
      setTimeout(initTabsFloatAnimation, 100);
      return;
    }

    // Check if animation has already been initialized
    if (tabItems[0].hasAttribute('data-animated')) {
      return;
    }

    // Mark as animated to prevent re-initialization
    tabItems.forEach(item => item.setAttribute('data-animated', 'true'));

    // Check if GSAP is available
    if (typeof gsap === 'undefined') {
      console.warn('GSAP is not loaded. Falling back to CSS animations.');
      return;
    }

    // Disable CSS transitions temporarily to avoid conflicts
    const originalTransition = window.getComputedStyle(tabItems[0]).transition;
    tabItems.forEach(item => {
      item.style.transition = 'none';
    });

    // Set initial state for all tabs
    gsap.set(tabItems, {
      opacity: 0,
      y: 1000,
      x: -300,
      scale: 0.85,
      rotation: -3
    });

    // Create the float-in animation timeline
    const tl = gsap.timeline({
      delay: 0.5, // Small delay after preload is removed
      defaults: {
        ease: 'power3.out'
      },
      onComplete: function() {
        // Re-enable CSS transitions after animation
        tabItems.forEach(item => {
          item.style.transition = originalTransition;
        });
      }
    });

    // Animate each tab with staggered timing for smooth cascade effect
    tabItems.forEach((item, index) => {
      tl.to(item, {
        opacity: 1,
        y: 0,
        x: 0,
        scale: 1,
        rotation: 0,
        duration: 1,
        ease: 'back.out(1.4)' // Slight bounce for creative feel
      }, index * 0.12); // Stagger by 0.12s between each tab
    });

    // Add a subtle continuous floating effect after the initial animation
    tabItems.forEach((item, index) => {
      gsap.to(item, {
        y: -4,
        duration: 2.5 + (index * 0.15),
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
        delay: 2 + (index * 0.08)
      });
    });
  }

  // Initialize when page is loaded and preload class is removed
  function checkAndInit() {
    // Wait for body to not have is-preload class
    if (!document.body.classList.contains('is-preload')) {
      // Small delay to ensure sidebar HTML is injected
      setTimeout(initTabsFloatAnimation, 200);
    } else {
      // Check again after a short delay
      setTimeout(checkAndInit, 100);
    }
  }

  // Start checking after DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', checkAndInit);
  } else {
    checkAndInit();
  }

  // Also listen for when is-preload is removed
  const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
        if (!document.body.classList.contains('is-preload')) {
          setTimeout(initTabsFloatAnimation, 200);
          observer.disconnect();
        }
      }
    });
  });

  // Start observing body class changes
  if (document.body) {
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['class']
    });
  }

})();

