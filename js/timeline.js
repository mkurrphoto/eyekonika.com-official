window.addEventListener("load", () => {
  setTimeout(() => {
    initTimelineIcons();
    initTimelineReveal();
    initSidebarScrollLock();
    initIntroObserver();
    initTimelineCardHover();
    initFeaturedImageParallax();
    initWireframeHover();
  }, 300);
});

function initTimelineIcons() {
  // Hide dots when icon containers are present
  const items = document.querySelectorAll(".timeline-item");
  items.forEach((item) => {
    const iconContainer = item.querySelector(".timeline-icon-container");
    if (iconContainer) {
      const dot = item.querySelector(".timeline-dot");
      if (dot) {
        dot.style.display = "none";
      }
    }
  });
}

function initTimelineReveal() {
  const items = document.querySelectorAll(".timeline-item");
  let animationTimeouts = []; // Track all animation timeouts
  let isLooping = false;

  // Mark all items as visible (no scroll dependency)
  items.forEach((item) => {
    item.classList.add("visible");
  });

  // Function to reset an item's animation
  function resetItemAnimation(item) {
    item.classList.remove("complete");
    const progressLine = item.querySelector(".timeline-progress-line");
    if (progressLine) {
      progressLine.style.transition = "height 0s linear";
      progressLine.style.height = "0px";
    }
  }

  // Function to animate a single item forward
  function animateItem(item) {
    item.classList.add("complete");
    
    const progressLine = item.querySelector(".timeline-progress-line");
    if (progressLine) {
      // Reset height to 0 first
      progressLine.style.transition = "height 0s linear";
      progressLine.style.height = "0px";
      
      // Force reflow
      void progressLine.offsetHeight;
      
      // Animate to full height
      requestAnimationFrame(() => {
        progressLine.style.transition = "height 2.5s linear";
        progressLine.style.height = "calc(100% - 1.25rem + 1.5rem)";
      });
    }
  }

  // Function to reverse animate a single item (quickly reset)
  function reverseAnimateItem(item) {
    item.classList.remove("complete");
    
    const progressLine = item.querySelector(".timeline-progress-line");
    if (progressLine) {
      // Quickly animate back to 0 (fast reverse)
      progressLine.style.transition = "height 0.3s linear";
      progressLine.style.height = "0px";
    }
  }

  // Function to clear all animation timeouts
  function clearAllTimeouts() {
    animationTimeouts.forEach(timeout => clearTimeout(timeout));
    animationTimeouts = [];
  }

  // Function to start the animation loop
  function startAnimationLoop() {
    if (isLooping) return;
    isLooping = true;

    function runLoop() {
      // Get all items in order by data-index (excluding last item if it has no progress line)
      const sortedItems = Array.from(items).filter(item => {
        // Only include items that have progress line containers
        return item.querySelector(".timeline-progress-line-container") !== null;
      }).sort((a, b) => {
        const indexA = parseInt(a.getAttribute("data-index") || "999");
        const indexB = parseInt(b.getAttribute("data-index") || "999");
        return indexA - indexB;
      });

      if (sortedItems.length === 0) {
        isLooping = false;
        return;
      }

      // Reset all items first
      sortedItems.forEach(item => resetItemAnimation(item));
      
      // Force reflow after reset
      void document.body.offsetHeight;

      // Animate items sequentially forward - each starts after the previous one completes
      let currentIndex = 0;
      
      function animateNext() {
        // Check if loop was stopped
        if (!isLooping) return;

        if (currentIndex >= sortedItems.length) {
          // All items have been animated forward, wait 2.5s then reverse quickly
          const timeout = setTimeout(() => {
            // Check if loop is still active
            if (isLooping) {
              reverseAnimation(); // Run reverse animation before restarting
            } else {
              isLooping = false;
            }
          }, 2500); // Wait 2.5s after last animation completes
          animationTimeouts.push(timeout);
          return;
        }

        const item = sortedItems[currentIndex];
        animateItem(item);
        currentIndex++;

        // Wait for this animation to complete (2.5s) before starting next
        const timeout = setTimeout(() => {
          animateNext();
        }, 2500);
        animationTimeouts.push(timeout);
      }

      // Function to reverse animate all items quickly (from last to first)
      function reverseAnimation() {
        if (!isLooping) return;

        // Create reversed array (last to first)
        const reversedItems = [...sortedItems].reverse();
        let reverseIndex = 0;

        function reverseNext() {
          // Check if loop was stopped
          if (!isLooping) return;

          if (reverseIndex >= reversedItems.length) {
            // All items have been reversed, restart the forward loop
            const timeout = setTimeout(() => {
              if (isLooping) {
                runLoop(); // Restart the forward animation loop
              } else {
                isLooping = false;
              }
            }, 100); // Small delay before restarting
            animationTimeouts.push(timeout);
            return;
          }

          const item = reversedItems[reverseIndex];
          reverseAnimateItem(item);
          reverseIndex++;

          // Wait a short time before reversing next item (fast reverse)
          const timeout = setTimeout(() => {
            reverseNext();
          }, 100); // Fast reverse - 100ms between each item
          animationTimeouts.push(timeout);
        }

        // Start reverse animation
        reverseNext();
      }

      // Start the forward sequence
      animateNext();
    }

    runLoop();
  }

  // Start the animation loop automatically (no scroll dependency)
  startAnimationLoop();
}

function initSidebarScrollLock() {
  if (window.innerWidth <= 1280) {
    console.log("Fullscreen sidebar logic disabled on mobile/tablet.");
    return;
  }
  const sidebar = document.getElementById("sidebar");
  const wrapper = document.getElementById("wrapper");
  const timeline = document.getElementById("timeline");
  if (!sidebar || !wrapper || !timeline) return;

  let state = "normal";

  // Use Lenis scroll event if available, otherwise fallback to window scroll
  const scrollHandler = () => {
    const rect = timeline.getBoundingClientRect();
    const vh = window.innerHeight;

    // FASTER & SMOOTHER THRESHOLDS
    const ENTER_TOP = vh * 0.8; // earlier
    const ENTER_BOTTOM = vh * 0.5; // earlier

    const EXIT_TOP = vh * 0.98; // exits earlier
    const EXIT_BOTTOM = vh * 0.2;

    const insideEnter = rect.top < ENTER_TOP && rect.bottom > ENTER_BOTTOM;

    const outsideExit = rect.bottom < EXIT_BOTTOM || rect.top > EXIT_TOP;

    // ENTER
    if (state === "normal" && insideEnter) {
      state = "fullscreen";
      sidebar.classList.add("hide-sidebar");
      wrapper.classList.add("expand-wrapper");
      return;
    }

    // EXIT
    if (state === "fullscreen" && outsideExit) {
      state = "normal";
      sidebar.classList.remove("hide-sidebar");
      wrapper.classList.remove("expand-wrapper");
      return;
    }
  };

  // Check if Lenis is available and use it, otherwise use window scroll
  // Also check periodically in case lenis loads after this script
  const setupScrollListener = () => {
    if (window.lenis) {
      window.lenis.on('scroll', scrollHandler);
    } else {
      window.addEventListener("scroll", scrollHandler);
      // Try to switch to lenis if it becomes available later
      const checkLenis = setInterval(() => {
        if (window.lenis) {
          window.removeEventListener("scroll", scrollHandler);
          window.lenis.on('scroll', scrollHandler);
          clearInterval(checkLenis);
        }
      }, 100);
      // Stop checking after 5 seconds
      setTimeout(() => clearInterval(checkLenis), 5000);
    }
  };

  setupScrollListener();
}

function initIntroObserver() {
  const intro = document.getElementById("intro");
  const sidebar = document.getElementById("sidebar");
  const wrapper = document.getElementById("wrapper");

  if (!intro || !sidebar || !wrapper) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          sidebar.classList.remove("hide-sidebar");
          wrapper.classList.remove("expand-wrapper");
        }
      });
    },
    { threshold: 0.4 }
  );

  observer.observe(intro);
}

function initTimelineCardHover() {
  const timelineCards = document.querySelectorAll(".timeline-card");
  
  timelineCards.forEach((card) => {
    const img = card.querySelector(".img-date img");
    if (img && img.src) {
      // Set CSS custom property for the hover image
      card.style.setProperty("--hover-image", `url(${img.src})`);
      
      // Preload the image for smoother animation
      const preloadImg = new Image();
      preloadImg.src = img.src;
    }
  });
}

function initFeaturedImageParallax() {
  const featuredImage = document.querySelector(".timeline-featured-image");
  const featuredContainer = document.querySelector(".timeline-featured-image-container");
  const backgroundItem = document.querySelector(".timeline-item.background.visible");
  const backgroundLayers = document.querySelector(".background-animation-layers");
  
  if (!featuredImage || !featuredContainer) return;
  
  let ticking = false;
  
  function updateParallax() {
    if (ticking) return;
    
    requestAnimationFrame(() => {
      const rect = featuredContainer.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const elementTop = rect.top;
      const elementHeight = rect.height;
      
      // Calculate if element is in viewport
      const viewportMiddle = windowHeight / 2;
      const elementMiddle = elementTop + elementHeight / 2;
      const distanceFromCenter = viewportMiddle - elementMiddle;
      
      // Parallax effect - move image slightly based on scroll position
      const parallaxOffset = distanceFromCenter * 0.1; // Adjust multiplier for intensity
      
      // Only apply parallax when element is visible
      if (rect.top < windowHeight && rect.bottom > 0) {
        featuredImage.style.transform = `translateY(${parallaxOffset}px) scale(1)`;
        
        // Background parallax effect
        if (backgroundItem && backgroundLayers) {
          const bgParallaxOffset = distanceFromCenter * 0.05; // Slower parallax for background
          backgroundLayers.style.transform = `translateY(${bgParallaxOffset}px)`;
          
          // Animate background gradient position
          const gradientOverlay = backgroundLayers.querySelector(".bg-gradient-overlay");
          if (gradientOverlay) {
            const gradientOffset = (distanceFromCenter / windowHeight) * 20;
            gradientOverlay.style.backgroundPosition = `${50 + gradientOffset}% 50%`;
          }
        }
      }
      
      ticking = false;
    });
    
    ticking = true;
  }
  
  // Use Lenis scroll if available, otherwise use window scroll
  const setupParallaxListener = () => {
    if (window.lenis) {
      window.lenis.on('scroll', updateParallax);
    } else {
      window.addEventListener("scroll", updateParallax, { passive: true });
      // Try to switch to lenis if it becomes available later
      const checkLenis = setInterval(() => {
        if (window.lenis) {
          window.removeEventListener("scroll", updateParallax);
          window.lenis.on('scroll', updateParallax);
          clearInterval(checkLenis);
        }
      }, 100);
      setTimeout(() => clearInterval(checkLenis), 5000);
    }
  };
  
  setupParallaxListener();
  
  // Initial call
  updateParallax();
}

function initWireframeHover() {
  // Fallback for browsers without :has() selector support
  const imageWrapper = document.querySelector(".main-content-image-wrapper");
  const textBlock = document.querySelector(".wireframe-text-block");
  const logoPlaceholder = document.querySelector(".wireframe-logo-placeholder");
  const layout = document.querySelector(".wireframe-layout");
  const body = document.body;
  
  if (!imageWrapper || !textBlock || !logoPlaceholder) return;
  
  // Check if browser supports :has() selector
  if (!CSS.supports('selector(:has(*))')) {
    // Add hover event listeners as fallback
    imageWrapper.addEventListener('mouseenter', () => {
      if (layout) layout.classList.add('image-hovered');
      body.classList.add('image-hovered');
    });
    
    imageWrapper.addEventListener('mouseleave', () => {
      if (layout) layout.classList.remove('image-hovered');
      body.classList.remove('image-hovered');
    });
  }
}
