const particlesConfig = {
  particles: {
    number: { value: 70 },
    color: { value: "#ffffff" },
    size: { value: 3, random: true },
    opacity: { value: 0.6, random: true },
    line_linked: { enable: false },
    move: { speed: 1.2 }
  },
  interactivity: {
    events: {
      onhover: { enable: false },
      onclick: { enable: false }
    }
  },
  retina_detect: true
};

function initParticles(id) {
  particlesJS(id, particlesConfig);
}
