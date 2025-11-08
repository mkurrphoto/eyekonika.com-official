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
  //   { id: 'footer', file: 'partials/footer.html' }
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
      "assets/js/jquery.min.js",
      "assets/js/jquery.scrollex.min.js",
      "assets/js/jquery.scrolly.min.js",
      "assets/js/browser.min.js",
      "assets/js/breakpoints.min.js",
      "assets/js/util.js",
      "assets/js/main.js",
      "js/particles.js",
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
