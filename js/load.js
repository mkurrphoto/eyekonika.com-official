const parts = [
  { id:"sidebar-selector", file: "components/sidebar-component/sidebar.html" },
  {
    id: "introduction",
    file: "components/introduction-component/introduction.html",
  },
  { id: "proceses", file: "components/proceses-component/proceses.html" },
  { id: "gallery", file: "components/gallery-component/gallery.html" },
  { id: "what-we-do", file: "components/what-we-do-component/what-we-do.html" },
  { id: "get-in-touch", file: "components/get-in-touch-component/get-in-touch.html" },
  { id: "footer", file: "components/footer-component/footer.html" },
];
Promise.all(
  parts.map((part) =>
    fetch(part.file)
      .then((res) => res.text())
      .then((html) => {
        const el = document.getElementById(part.id);
        if (el) {
          el.innerHTML = html;
        }
      })
  )
)
  .then(() => {
    console.log("✅ All partials loaded!");
    loadScriptsSequentially(["js/vendor/main.js"], () => {
      // Trigger scroll *after* vendor/main.js has loaded and scrollex has
      // had a chance to initialize — ensures #intro.inactive is removed
      // for sections already in the viewport on page load.
      window.scrollBy(0, 1);

      setTimeout(() => {
        if (window.initPageSwipe) {
          window.initPageSwipe();
        }

        // Restore scroll position for return navigation (from step pages or pictures.html).
        // sessionStorage key takes priority; location.hash is the fallback.
        const scrollTarget = sessionStorage.getItem('returnSection') || location.hash.replace('#', '');
        if (scrollTarget) {
          sessionStorage.removeItem('returnSection');
          const el = document.getElementById(scrollTarget);
          if (el) el.scrollIntoView({ behavior: 'instant' });
        }
      }, 100);
    });
  });

function loadScriptsSequentially(scripts, onComplete) {
  if (scripts.length === 0) {
    if (onComplete) onComplete();
    return;
  }

  const script = document.createElement("script");
  script.src = scripts[0];
  script.defer = true;
  script.onload = () => {
    loadScriptsSequentially(scripts.slice(1), onComplete);
  };
  script.onerror = () => {
    loadScriptsSequentially(scripts.slice(1), onComplete);
  };
  document.body.appendChild(script);
}
