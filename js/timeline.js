window.addEventListener("load", () => {
  setTimeout(() => {
    const items = document.querySelectorAll(".timeline-item");

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            obs.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.25,
        rootMargin: "0px 0px -20% 0px"
      }
    );

    items.forEach(item => observer.observe(item));

  }, 200); // ← DELAY FIXES LAYOUT SHIFT PROBLEMS
});
