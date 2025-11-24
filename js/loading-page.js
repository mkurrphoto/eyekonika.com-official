window.addEventListener("load", function () {
  setTimeout(() => {
    const loader = document.getElementById("preloader");
    loader.classList.add("hide");
    setTimeout(() => loader.remove(), 700);
  }, 1300);
});
