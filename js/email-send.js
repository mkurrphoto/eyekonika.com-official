window.addEventListener("pageshow", () => {
  const form = document.getElementById("contactForm");
  const email = document.getElementById("email");

  if (form && email) form.reset();
  // reset fields on back/refresh
});
