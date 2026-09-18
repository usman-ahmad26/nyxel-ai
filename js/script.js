// Contact form: placeholder submit handler.
// Swap for a real endpoint (Formspree, Netlify Forms, your own API) before going live.
document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("#contact-form");
  if (form) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const btn = form.querySelector(".submit-btn");
      const originalText = btn.textContent;
      btn.textContent = "Sending...";
      btn.disabled = true;

      fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" },
      })
        .then((response) => {
          if (response.ok) {
            btn.textContent = "Sent, we'll reply within 48h";
            form.reset();
          } else {
            btn.textContent = "Something went wrong, try again";
            btn.disabled = false;
          }
        })
        .catch(() => {
          btn.textContent = "Something went wrong, try again";
          btn.disabled = false;
        });
    });
  }

  // Scroll-reveal: fade/rise elements into view as the user scrolls to them.
  const revealTargets = document.querySelectorAll(
    ".feature-grid, .process-row, .case-grid, .preview-row, .about-grid"
  );
  revealTargets.forEach((el) => el.classList.add("reveal"));

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
  );
  revealTargets.forEach((el) => revealObserver.observe(el));

  // Draw-in animation for the connecting lines/paths inside the service diagrams,
  // and mark the diagram itself as in-view so the dot-pulse CSS animation can start.
  const diagrams = document.querySelectorAll(".feature-art");
  const diagramObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const svg = entry.target.querySelector("svg");
        if (svg) {
          const lines = svg.querySelectorAll("path, polyline, line");
          lines.forEach((line, i) => {
            const length = line.getTotalLength ? line.getTotalLength() : 200;
            line.style.strokeDasharray = length;
            line.style.strokeDashoffset = length;
            line.style.transition = `stroke-dashoffset .9s ease ${i * 0.12}s`;
            requestAnimationFrame(() => {
              line.style.strokeDashoffset = 0;
            });
          });
        }
        entry.target.classList.add("in-view");
        diagramObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.3 }
  );
  diagrams.forEach((el) => diagramObserver.observe(el));
});
