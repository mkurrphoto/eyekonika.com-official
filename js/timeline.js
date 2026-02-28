window.addEventListener("load", () => {
  setTimeout(() => {
    initTimelineIcons();
    initTimelineReveal();
    initSidebarScrollLock();
    initIntroObserver();
    initClimaxParallax();
    initClimaxHover();
  }, 300);
});

function initTimelineIcons() {
  // Hide dots when icon containers are present
  const items = document.querySelectorAll(".timeline-item");
  items.forEach((item) => {
    const iconContainer = item.querySelector(".timeline-icon-container");
    if (iconContainer) {
      const dot = item.querySelector(".timeline-dot");
      if (dot) dot.style.display = "none";
    }
  });
}

function initTimelineReveal() {
  const items = document.querySelectorAll(".timeline-item");
  let animationTimeouts = [];
  let isLooping = false;

  // Mark all items visible immediately
  items.forEach((item) => item.classList.add("visible"));

  function resetItemAnimation(item) {
    item.classList.remove("complete");
    const progressLine = item.querySelector(".timeline-progress-line");
    if (progressLine) {
      progressLine.style.transition = "height 0s linear";
      progressLine.style.height = "0px";
    }
  }

  function animateItem(item) {
    item.classList.add("complete");
    const progressLine = item.querySelector(".timeline-progress-line");
    if (progressLine) {
      progressLine.style.transition = "height 0s linear";
      progressLine.style.height = "0px";
      void progressLine.offsetHeight;
      requestAnimationFrame(() => {
        progressLine.style.transition = "height 2.5s linear";
        progressLine.style.height = "calc(100% - 1.25rem + 1.5rem)";
      });
    }
  }

  function reverseAnimateItem(item) {
    item.classList.remove("complete");
    const progressLine = item.querySelector(".timeline-progress-line");
    if (progressLine) {
      progressLine.style.transition = "height 0.3s linear";
      progressLine.style.height = "0px";
    }
  }

  function clearAllTimeouts() {
    animationTimeouts.forEach((t) => clearTimeout(t));
    animationTimeouts = [];
  }

  function startAnimationLoop() {
    if (isLooping) return;
    isLooping = true;

    function runLoop() {
      const sortedItems = Array.from(items)
        .filter((item) => item.querySelector(".timeline-progress-line-container") !== null)
        .sort((a, b) => {
          return (
            parseInt(a.getAttribute("data-index") || "999") -
            parseInt(b.getAttribute("data-index") || "999")
          );
        });

      if (sortedItems.length === 0) {
        isLooping = false;
        return;
      }

      sortedItems.forEach((item) => resetItemAnimation(item));
      void document.body.offsetHeight;

      let currentIndex = 0;

      function animateNext() {
        if (!isLooping) return;
        if (currentIndex >= sortedItems.length) {
          const timeout = setTimeout(() => {
            if (isLooping) reverseAnimation();
            else isLooping = false;
          }, 2500);
          animationTimeouts.push(timeout);
          return;
        }
        animateItem(sortedItems[currentIndex]);
        currentIndex++;
        const timeout = setTimeout(animateNext, 2500);
        animationTimeouts.push(timeout);
      }

      function reverseAnimation() {
        if (!isLooping) return;
        const reversedItems = [...sortedItems].reverse();
        let reverseIndex = 0;

        function reverseNext() {
          if (!isLooping) return;
          if (reverseIndex >= reversedItems.length) {
            const timeout = setTimeout(() => {
              if (isLooping) runLoop();
              else isLooping = false;
            }, 100);
            animationTimeouts.push(timeout);
            return;
          }
          reverseAnimateItem(reversedItems[reverseIndex]);
          reverseIndex++;
          const timeout = setTimeout(reverseNext, 100);
          animationTimeouts.push(timeout);
        }

        reverseNext();
      }

      animateNext();
    }

    runLoop();
  }

  startAnimationLoop();
}

function initSidebarScrollLock() {
  if (window.innerWidth <= 1280) return;

  const sidebar = document.getElementById("sidebar");
  const wrapper = document.getElementById("wrapper");
  const timeline = document.getElementById("timeline");
  if (!sidebar || !wrapper || !timeline) return;

  let state = "normal";

  const scrollHandler = () => {
    const rect = timeline.getBoundingClientRect();
    const vh = window.innerHeight;

    const ENTER_TOP = vh * 0.8;
    const ENTER_BOTTOM = vh * 0.5;
    const EXIT_TOP = vh * 0.98;
    const EXIT_BOTTOM = vh * 0.2;

    const insideEnter = rect.top < ENTER_TOP && rect.bottom > ENTER_BOTTOM;
    const outsideExit = rect.bottom < EXIT_BOTTOM || rect.top > EXIT_TOP;

    if (state === "normal" && insideEnter) {
      state = "fullscreen";
      sidebar.classList.add("hide-sidebar");
      wrapper.classList.add("expand-wrapper");
      return;
    }

    if (state === "fullscreen" && outsideExit) {
      state = "normal";
      sidebar.classList.remove("hide-sidebar");
      wrapper.classList.remove("expand-wrapper");
    }
  };

  const setupScrollListener = () => {
    if (window.lenis) {
      window.lenis.on("scroll", scrollHandler);
    } else {
      window.addEventListener("scroll", scrollHandler);
      const checkLenis = setInterval(() => {
        if (window.lenis) {
          window.removeEventListener("scroll", scrollHandler);
          window.lenis.on("scroll", scrollHandler);
          clearInterval(checkLenis);
        }
      }, 100);
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

function initClimaxParallax() {
  const featuredImage = document.querySelector(".climax-featured-image");
  const climaxPanel = document.querySelector(".climax-panel");
  if (!featuredImage || !climaxPanel) return;

  let ticking = false;

  function updateParallax() {
    if (ticking) return;
    requestAnimationFrame(() => {
      const rect = climaxPanel.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      if (rect.top < windowHeight && rect.bottom > 0) {
        const elementMiddle = rect.top + rect.height / 2;
        const distanceFromCenter = windowHeight / 2 - elementMiddle;
        const offset = distanceFromCenter * 0.08;
        featuredImage.style.transform = `translateY(${offset}px) scale(1.04)`;
      }
      ticking = false;
    });
    ticking = true;
  }

  if (window.lenis) {
    window.lenis.on("scroll", updateParallax);
  } else {
    window.addEventListener("scroll", updateParallax, { passive: true });
    const checkLenis = setInterval(() => {
      if (window.lenis) {
        window.removeEventListener("scroll", updateParallax);
        window.lenis.on("scroll", updateParallax);
        clearInterval(checkLenis);
      }
    }, 100);
    setTimeout(() => clearInterval(checkLenis), 5000);
  }

  updateParallax();
}

function initClimaxHover() {
  // Fallback for browsers without :has() selector support
  if (CSS.supports('selector(:has(*))')) return;

  const panel = document.querySelector(".climax-panel");
  if (!panel) return;

  panel.addEventListener("mouseenter", () => panel.classList.add("hovered"));
  panel.addEventListener("mouseleave", () => panel.classList.remove("hovered"));
}
