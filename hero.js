document.addEventListener("DOMContentLoaded", () => {
  const slides = Array.from(document.querySelectorAll(".hero-slides .slide"));
  if (!slides.length) return;

  let idx = 0;
  const hold = 6500; // ms

  // Ensure first slide is active
  slides.forEach((s, i) => {
    s.classList.remove("active", "zoom-in", "zoom-out");
    if (i === 0) {
      const effect = s.dataset.effect === "out" ? "zoom-out" : "zoom-in";
      s.classList.add("active", effect);
    }
  });

  setInterval(() => {
    slides[idx].classList.remove("active");
    idx = (idx + 1) % slides.length;
    const effect =
      slides[idx].dataset.effect === "out" ? "zoom-out" : "zoom-in";
    slides[idx].classList.add("active", effect);
  }, hold);
});
