const parts = [
  { id:"sidebar-selector", file: "components/sidebar-component/sidebar.html" },
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

function loadParticles(containerId) {
  particlesJS(containerId, {
    particles: {
      number: { value: 60 },
      color: { value: "#ffffff" },
      shape: { type: "circle" },
      opacity: { value: 0.6, random: true },
      size: { value: 3, random: true },
      line_linked: { enable: false },
      move: { speed: 1.2 },
    },
    interactivity: {
      detect_on: "canvas",
      events: {
        onhover: { enable: false },
        onclick: { enable: false },
      },
    },
    retina_detect: true,
  });
}
