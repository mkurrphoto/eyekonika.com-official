window.addEventListener("load", () => {
  setTimeout(() => {
    initTimelineReveal();
    initSidebarScrollLock();
    initIntroObserver();
  }, 300);
});

function initTimelineReveal() {
  const items = document.querySelectorAll(".timeline-item");

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.25 }
  );

  items.forEach((item) => observer.observe(item));
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

  window.addEventListener("scroll", () => {
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
  });
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
