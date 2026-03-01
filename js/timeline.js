window.addEventListener("load", () => {
  setTimeout(() => {
    initTimelineIcons();
    initSectionHeadingReveal();
    initTimelineScrollDriven();
    initImageCardParallax();
    initSidebarScrollLock();
    initIntroObserver();
    initClimaxParallax();
    initClimaxHover();
  }, 300);
});

/* =============================================
   ICON — hide dot when icon container is present
   ============================================= */

function initTimelineIcons() {
  document.querySelectorAll(".timeline-item").forEach((item) => {
    if (item.querySelector(".timeline-icon-container")) {
      const dot = item.querySelector(".timeline-dot");
      if (dot) dot.style.display = "none";
    }
  });
}

/* =============================================
   SECTION HEADING — fade + slide up on scroll
   ============================================= */

function initSectionHeadingReveal() {
  const heading = document.querySelector(".timeline-heading");
  if (!heading) return;

  if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
    gsap.fromTo(
      heading,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: {
          trigger: heading,
          start: "top 85%",
          once: true,
        },
      }
    );
  } else {
    // Fallback: IntersectionObserver
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            heading.style.opacity = "1";
            heading.style.transform = "none";
            observer.unobserve(heading);
          }
        });
      },
      { threshold: 0.3 }
    );
    heading.style.opacity = "0";
    heading.style.transition = "opacity 0.8s ease, transform 0.8s ease";
    heading.style.transform = "translateY(30px)";
    observer.observe(heading);
  }
}

/* =============================================
   SCROLL-DRIVEN CARD REVEALS
   Each step slides in from its side as user scrolls
   Progress lines fill via .complete CSS class
   ============================================= */

function initTimelineScrollDriven() {
  const items = document.querySelectorAll(".timeline-item:not(.climax)");
  if (!items.length) return;

  const isMobile = window.innerWidth <= 768;

  if (isMobile) {
    // Mobile: IntersectionObserver stagger reveal
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible", "complete");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    items.forEach((item) => observer.observe(item));
    return;
  }

  // Desktop: GSAP ScrollTrigger reveal
  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
    // Fallback: show all immediately
    items.forEach((item) => item.classList.add("visible", "complete"));
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  items.forEach((item) => {
    const isLeft = item.classList.contains("left");
    const card = item.querySelector(".timeline-card");
    const iconContainer = item.querySelector(".timeline-icon-container");

    // Set initial hidden state via GSAP (no flash since this runs sync on load)
    gsap.set(card, { opacity: 0, x: isLeft ? -60 : 60 });
    if (iconContainer) gsap.set(iconContainer, { opacity: 0, scale: 0.5 });

    // Animate in on scroll
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: item,
        start: "top 78%",
        once: true,
        onEnter: () => item.classList.add("visible"),
      },
    });

    // Icon pops in first
    if (iconContainer) {
      tl.to(iconContainer, {
        opacity: 1,
        scale: 1,
        duration: 0.45,
        ease: "back.out(2.5)",
      }, 0);
    }

    // Card slides in with a spring
    tl.to(
      card,
      {
        opacity: 1,
        x: 0,
        duration: 0.75,
        ease: "power3.out",
      },
      iconContainer ? 0.1 : 0
    );

    // Progress line fills after card lands
    tl.call(
      () => item.classList.add("complete"),
      [],
      0.5
    );
  });
}

/* =============================================
   IMAGE CARD — mouse-tracking parallax
   Shifts the image inside each hovered card
   ============================================= */

function initImageCardParallax() {
  const section = document.querySelector(".timeline-section");
  if (!section) return;

  // Track which item is currently hovered
  let activeItem = null;

  section.addEventListener("mouseover", (e) => {
    const item = e.target.closest(".timeline-item:not(.climax)");
    activeItem = item || null;
  });

  section.addEventListener("mousemove", (e) => {
    if (!activeItem) return;

    const imageCard = activeItem.querySelector(".timeline-image-card");
    if (!imageCard) return;

    const rect = imageCard.getBoundingClientRect();
    if (rect.width === 0) return; // card not visible yet

    const dx = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
    const dy = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);

    const img = imageCard.querySelector(".timeline-image-card-img");
    if (img) {
      img.style.transform = `translate(${dx * 6}px, ${dy * 5}px) scale(1.06)`;
    }
  });

  section.addEventListener("mouseleave", () => {
    activeItem = null;
    section.querySelectorAll(".timeline-image-card-img").forEach((img) => {
      img.style.transform = "scale(1.04)";
    });
  });

  // Reset when leaving an item
  section.addEventListener("mouseout", (e) => {
    const item = e.target.closest(".timeline-item:not(.climax)");
    if (item && !item.contains(e.relatedTarget)) {
      const img = item.querySelector(".timeline-image-card-img");
      if (img) img.style.transform = "scale(1.04)";
    }
  });
}

/* =============================================
   SIDEBAR SCROLL LOCK
   Hides sidebar + expands wrapper while timeline is in view
   ============================================= */

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

/* =============================================
   INTRO OBSERVER
   Re-shows sidebar when intro section is visible
   ============================================= */

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

/* =============================================
   CLIMAX PARALLAX
   Subtle vertical parallax on the climax featured image
   ============================================= */

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

/* =============================================
   CLIMAX HOVER — fallback for browsers without :has()
   ============================================= */

function initClimaxHover() {
  if (CSS.supports('selector(:has(*))')) return;

  const panel = document.querySelector(".climax-panel");
  if (!panel) return;

  panel.addEventListener("mouseenter", () => panel.classList.add("hovered"));
  panel.addEventListener("mouseleave", () => panel.classList.remove("hovered"));
}
