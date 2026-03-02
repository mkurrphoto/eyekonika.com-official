const parts = [
  { id:"sidebar-selector", file: "components/sidebar-component/sidebar.html" },
  {
    id: "introduction",
    file: "components/introduction-component/introduction.html",
  },
  { id: "proceses", file: "components/proceses-component/proceses.html" },
  { id: "gallery", file: "components/gallery-component/gallery.html" },
  { id: "what-we-do", file: "components/what-we-do-component/what-we-do.html" },
  {
    id: "get-in-touch",
    file: "components/get-in-touch-component/get-in-touch.html",
  },
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
    loadScriptsSequentially([
      "js/vendor/main.js",
    ]);
  })
  .then(() => {
    setTimeout(() => {
      window.scrollBy(0, 1);
    }, 300);
    // Initialize page swipe after components are loaded
    setTimeout(() => {
      if (window.initPageSwipe) {
        window.initPageSwipe();
      }
    }, 400);
  });

function loadScriptsSequentially(scripts) {
  if (scripts.length === 0) return;

  const script = document.createElement("script");
  script.src = scripts[0];
  script.defer = true;
  script.onload = () => {
    loadScriptsSequentially(scripts.slice(1));
  };
  script.onerror = () => {
    loadScriptsSequentially(scripts.slice(1));
  };
  document.body.appendChild(script);
}
