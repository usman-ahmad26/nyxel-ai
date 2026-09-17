// Contact form — placeholder submit handler.
// Swap for a real endpoint (Formspree, Netlify Forms, your own API) before going live.
document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("#contact-form");
  if (!form) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const btn = form.querySelector(".submit-btn");
    btn.textContent = "Sent — we'll reply within 48h";
    btn.disabled = true;
  });
});
