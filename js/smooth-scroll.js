// Smooth Scroll with Lenis + GSAP ScrollTrigger
// Maintains all existing features including parallax backgrounds and particles

let lenis = null;

function initSmoothScroll() {
  // Initialize Lenis smooth scroll
  lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 1,
    smoothTouch: false, // Disable on touch devices to maintain native feel
    touchMultiplier: 2,
    infinite: false,
  });
  
  // Export lenis globally
  updateLenisExport();

  // Register GSAP ScrollTrigger with Lenis
  lenis.on('scroll', ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });

  gsap.ticker.lagSmoothing(0);

  // Initialize ScrollTrigger
  ScrollTrigger.refresh();

  // Handle smooth scroll for anchor links (compatible with existing scrolly)
  document.querySelectorAll('a.scrolly, a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          lenis.scrollTo(target, {
            offset: 0,
            duration: 1.5,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          });
        }
      }
    });
  });
}

// Parallax background effect for sections with fixed backgrounds
// This replaces background-attachment: fixed which doesn't work well with smooth scroll
function initParallaxBackgrounds() {
  // Check if we're on mobile (disable parallax on mobile)
  const isMobile = window.innerWidth <= 900;
  
  if (isMobile) {
    // On mobile, use regular scroll (no parallax)
    return;
  }

  // Add class to body to indicate smooth scroll is active
  document.body.classList.add('smooth-scroll-active');

  // Get all sections with parallax backgrounds
  const parallaxSections = [
    { selector: '#intro', speed: 0.3 },
    { selector: '#three', speed: 0.3 }, // Get in touch section
  ];

  parallaxSections.forEach(({ selector, speed }) => {
    const section = document.querySelector(selector);
    if (!section) return;

    // Create a background wrapper element for better parallax control
    const bgWrapper = document.createElement('div');
    bgWrapper.className = 'parallax-bg-wrapper';
    bgWrapper.style.cssText = `
      position: absolute;
      top: -210px;
      left: 0;
      width: 100%;
      height: 120%;
      background-image: ${window.getComputedStyle(section).backgroundImage};
      background-repeat: no-repeat;
      background-position: top center;
      background-size: cover;
      z-index: 0;
      pointer-events: none;
    `;
    
    // Store original background
    const originalBg = window.getComputedStyle(section).backgroundImage;
    
    // Clear background from section and add wrapper
    section.style.backgroundImage = 'none';
    section.style.position = 'relative';
    
    // Ensure inner content stays above parallax background
    const inner = section.querySelector('.inner');
    if (inner) {
      inner.style.position = 'relative';
      inner.style.zIndex = '2';
    }
    
    section.insertBefore(bgWrapper, section.firstChild);

    // Create parallax effect using GSAP
    gsap.to(bgWrapper, {
      y: `${100 * speed}%`,
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    });
  });
}

// Fade-in animations for sections on scroll
function initScrollAnimations() {
  // Animate sections on scroll
  gsap.utils.toArray('section, .wrapper').forEach((section) => {
    // Skip if already has fade-up class (handled by existing scrollex)
    if (section.classList.contains('fade-up')) {
      gsap.fromTo(
        section,
        {
          opacity: 0,
          y: 50,
        },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            end: 'top 50%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }
  });
}

// Initialize everything after DOM and content are loaded
function initSmoothScrollSystem() {
  // Wait for all content to load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      // Wait a bit more for dynamic content
      setTimeout(() => {
        initSmoothScroll();
        initParallaxBackgrounds();
        initScrollAnimations();
      }, 500);
    });
  } else {
    setTimeout(() => {
      initSmoothScroll();
      initParallaxBackgrounds();
      initScrollAnimations();
    }, 500);
  }
}

// Handle window resize (disable smooth scroll on mobile)
let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    const isMobile = window.innerWidth <= 900;
    if (isMobile && lenis) {
      // On mobile, disable smooth scroll
      lenis.destroy();
      lenis = null;
      ScrollTrigger.refresh();
    } else if (!isMobile && !lenis) {
      // Re-enable on desktop
      initSmoothScrollSystem();
    } else if (lenis) {
      ScrollTrigger.refresh();
    }
  }, 250);
});

// Initialize on load
window.addEventListener('load', () => {
  // Only enable smooth scroll on desktop
  if (window.innerWidth > 900) {
    initSmoothScrollSystem();
  }
});

// Export lenis for use in other scripts if needed (update on init)
function updateLenisExport() {
  window.lenis = lenis;
}

