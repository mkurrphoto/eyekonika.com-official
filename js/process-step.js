(function () {
  const page = document.body.dataset.step;

  function setActiveBadges(container, outputId) {
    const output = document.getElementById(outputId);
    if (!container || !output) return;
    container.addEventListener('click', (e) => {
      const badge = e.target.closest('.badge');
      if (!badge) return;
      container.querySelectorAll('.badge').forEach((b) => b.classList.remove('active'));
      badge.classList.add('active');
      output.textContent = badge.dataset.value || badge.textContent.trim();
    });
  }

  if (page === 'vision') {
    setActiveBadges(document.getElementById('visionUseCases'), 'visionUseCase');

    const tone = document.getElementById('toneSlider');
    const toneValue = document.getElementById('toneValue');
    const summary = document.getElementById('visionSummary');
    const nameInput = document.getElementById('projectName');
    const audience = document.getElementById('audience');

    function renderVisionSummary() {
      const intensity = Number(tone.value);
      let mood = 'Balanced';
      if (intensity < 35) mood = 'Subtle';
      else if (intensity > 65) mood = 'Bold';
      toneValue.textContent = mood;

      summary.textContent = `${nameInput.value || 'Untitled concept'} for ${audience.value || 'your audience'} with a ${mood.toLowerCase()} aesthetic, optimized for ${document.getElementById('visionUseCase').textContent.toLowerCase()}.`;
    }

    [tone, nameInput, audience].forEach((el) => el.addEventListener('input', renderVisionSummary));
    renderVisionSummary();
  }

  if (page === 'discovery') {
    const checks = [...document.querySelectorAll('.scope-check')];
    const meter = document.getElementById('scopeMeter');
    const meterLabel = document.getElementById('scopeLabel');
    const qty = document.getElementById('qty');
    const complexity = document.getElementById('complexity');
    const finish = document.getElementById('finish');
    const tier = document.getElementById('tier');

    function renderDiscovery() {
      const done = checks.filter((c) => c.checked).length;
      const pct = Math.round((done / checks.length) * 100);
      meter.style.width = `${pct}%`;
      meterLabel.textContent = `${pct}% ready for quote`;

      const score = Number(qty.value) + Number(complexity.value) + Number(finish.value);
      tier.textContent = score < 6 ? 'Signature Tier' : score < 9 ? 'Prestige Tier' : 'Collector Tier';
    }

    [...checks, qty, complexity, finish].forEach((el) => el.addEventListener('input', renderDiscovery));
    renderDiscovery();
  }

  if (page === 'prototype') {
    const rotate = document.getElementById('rotate');
    const card = document.getElementById('rotator');
    const compare = document.getElementById('compareAfter');
    const compareRange = document.getElementById('compareRange');

    if (rotate && card) {
      rotate.addEventListener('input', () => {
        const deg = Number(rotate.value);
        card.style.transform = `rotateY(${deg}deg)`;
      });
    }

    if (compare && compareRange) {
      compareRange.addEventListener('input', () => {
        const val = Number(compareRange.value);
        compare.style.clipPath = `inset(0 ${100 - val}% 0 0)`;
      });
    }
  }

  if (page === 'production') {
    const stageButtons = [...document.querySelectorAll('.stage-btn')];
    const title = document.getElementById('stageTitle');
    const desc = document.getElementById('stageDesc');
    const stageData = {
      prep: ['Material Prep', 'K9 optical glass is selected, cleaned, and measured for optical clarity.'],
      calib: ['Calibration', 'Laser parameters are dialed in to match engraving density and depth behavior.'],
      engrave: ['Engraving Passes', 'Subsurface laser paths are executed in controlled passes to preserve crystal integrity.'],
      inspect: ['Inspection', 'Technicians validate edge clarity, depth fidelity, and visual consistency.'],
      finish: ['Finishing', 'Final polishing, protection, and packaging happen before dispatch.']
    };

    stageButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        stageButtons.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        const [t, d] = stageData[btn.dataset.stage];
        title.textContent = t;
        desc.textContent = d;
      });
    });
  }
})();
