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
