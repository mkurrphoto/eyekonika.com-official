const parts = [
  { id: "sidebar", file: "components/sidebar-component/sidebar.html" },
  {
    id: "introduction",
    file: "components/introduction-component/introduction.html",
  },
  { id: "proceses", file: "components/proceses-component/proceses.html" },
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
        const el = document.getElementById(part.id)
        if (el) el.innerHTML = html
        
      })
  )
)
  .then(() => {
    console.log("✅ All partials loaded!");
    // Now load scripts
    loadScriptsSequentially([
      
      "js/vendor/jquery.min.js",
      "js/vendor/jquery.scrollex.min.js",
      "js/vendor/jquery.scrolly.min.js",
      "js/vendor/browser.min.js",
      "js/vendor/breakpoints.min.js",
      "js/vendor/main.js",
      "js/vendor/util.js",
      "js/app.js",
      "js/email-send.js",
    ]);
  })
  .then(() => {
    setTimeout(() => {
      window.scrollBy(0, 1);
    }, 200);
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
