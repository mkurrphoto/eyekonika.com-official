const btn = document.getElementById("menuToggle");
const box = document.getElementById("nav");

btn.addEventListener("click", () => {
  if (box.style.display === "block") {
    box.style.display = "none";
  } else {
    box.style.display = "block";
  }
});
