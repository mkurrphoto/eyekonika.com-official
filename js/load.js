const parts = [
  // { id: "header", file: "components/header-component/header.html" },
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
        document.getElementById(part.id).innerHTML = html;
      })
  )
)
  .then(() => {
    console.log("✅ All partials loaded!");
    // Now load scripts
    loadScriptsSequentially([
      "js/particles.js",
      "js/vendor/jquery.min.js",
      "js/vendor/jquery.scrollex.min.js",
      "js/vendor/jquery.scrolly.min.js",
      "js/vendor/browser.min.js",
      "js/vendor/breakpoints.min.js",
      "js/vendor/main.js",
      "js/vendor/util.js",
      "js/app.js",
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
    console.log(`Loaded: ${scripts[0]}`);
    loadScriptsSequentially(scripts.slice(1));
  };
  script.onerror = () => {
    console.error(`Failed to load: ${scripts[0]}`);
    loadScriptsSequentially(scripts.slice(1));
  };
  document.body.appendChild(script);
}
