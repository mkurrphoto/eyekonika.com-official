// bfcache restore: strip any exit-animation classes that were frozen onto the body
// before the page became visible again. Must run synchronously in pageshow to
// avoid a single painted frame of the off-screen/black state.
window.addEventListener('pageshow', function (event) {
  if (event.persisted) {
    // Suppress all transitions/animations for two frames so the snap-back is instant
    document.body.classList.add('is-restoring');
    document.body.classList.remove(
      'swipe-page-left', 'swipe-page-right',
      'slide-up-exit', 'slide-down-exit'
    );
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        document.body.classList.remove('is-restoring');
      });
    });
  }
});

window.addEventListener("load", function () {
  const loader = document.getElementById("preloader");
  if (!loader) return;

  const navType = performance.getEntriesByType('navigation')[0]?.type;
  const isReturn = navType === 'back_forward' || !!sessionStorage.getItem('returnSection');

  if (isReturn) {
    // Instant dismiss — no artificial wait on return navigation
    loader.classList.add("hide");
    setTimeout(() => loader.remove(), 700);
  } else {
    setTimeout(() => {
      loader.classList.add("hide");
      setTimeout(() => loader.remove(), 700);
    }, 1300);
  }
});
