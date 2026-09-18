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

  // ---------- FAQ chat widget ----------
  const widget = document.querySelector("#faq-widget");
  const toggle = document.querySelector("#faq-toggle");
  const iconOpen = document.querySelector("#faq-icon-open");
  const iconClose = document.querySelector("#faq-icon-close");
  const messages = document.querySelector("#faq-messages");
  const chipsWrap = document.querySelector("#faq-chips");
  const faqForm = document.querySelector("#faq-form");
  const faqInput = document.querySelector("#faq-input");

  if (widget && toggle && faqForm) {
    const FAQ = [
      {
        keywords: ["price", "pricing", "cost", "rate", "rates", "how much", "budget", "quote", "fee", "fees"],
        answer:
          'Pricing depends on scope, so there\'s no fixed rate card. Discovery (step 1 of our <a href="process.html">process</a>) is where we define exactly what you need, then you get a fixed quote before any build starts. Fastest way to get a number: <a href="contact.html">tell us what you want built</a>.',
      },
      {
        keywords: ["automation", "automate", "workflow", "n8n", "agent", "pipeline"],
        answer:
          'AI automation delivery connects your existing tools and removes manual, repetitive steps, built on n8n, LangGraph, or direct model/API integrations. More detail on the <a href="services.html#automation">Services page</a>.',
      },
      {
        keywords: ["rag", "retrieval", "knowledge base", "chatbot", "documents", "hallucinat"],
        answer:
          'Full-scale RAG applications ground answers in your own documents and data, with citations back to the source, so you\'re not relying on the model\'s memory alone. Details on the <a href="services.html#rag">Services page</a>.',
      },
      {
        keywords: ["service", "services", "what do you do", "what do you offer", "offer"],
        answer:
          'Two disciplines: AI automation delivery and full-scale RAG applications, plus ongoing AI ops after launch. Full breakdown on the <a href="services.html">Services page</a>.',
      },
      {
        keywords: ["process", "how does it work", "how do you work", "steps", "timeline", "how long"],
        answer:
          'A fixed four-step cycle: Discovery, Build, Deploy, Support. Typical scoping turnaround is under 72 hours; total project timeline depends on scope. See the <a href="process.html">Process page</a> for what you get at each step.',
      },
      {
        keywords: ["start", "get started", "begin", "hire", "work with you", "book", "call"],
        answer:
          'Easiest way in is the <a href="contact.html">contact form</a>: tell us what\'s manual, slow, or missing an AI layer right now, and you\'ll get a scope and timeline back.',
      },
      {
        keywords: ["support", "after launch", "maintenance", "ongoing", "retainer"],
        answer:
          'After launch we offer a defined support window plus an optional monthly retainer for continued monitoring and iteration. Covered under Ongoing AI Ops on the <a href="services.html">Services page</a>.',
      },
      {
        keywords: ["where", "location", "based", "lahore", "pakistan"],
        answer: "Based in Lahore, Pakistan, working with clients wherever they are.",
      },
      {
        keywords: ["stack", "technology", "tech", "tools", "built with", "openai", "claude", "groq"],
        answer:
          'n8n, LangChain/LangGraph, OpenAI, Anthropic Claude, Groq, FastAPI, React, vector databases, and PostgreSQL, chosen per project rather than a fixed default. See the <a href="index.html">Home</a> and <a href="services.html">Services</a> pages.',
      },
      {
        keywords: ["work", "portfolio", "case stud", "example", "built before", "clients"],
        answer: 'A few recent builds are on the <a href="work.html">Work page</a>, with real client case studies being added as they land.',
      },
    ];

    const FALLBACK =
      'Not sure about that one from here. Best bet is to ask directly on the <a href="contact.html">contact page</a> and you\'ll get a personal reply.';

    const QUICK_CHIPS = ["Pricing?", "What's RAG?", "How does the process work?", "How do I start?"];

    function escapeHtml(str) {
      const div = document.createElement("div");
      div.textContent = str;
      return div.innerHTML;
    }

    function addMessage(text, sender, allowHtml) {
      const bubble = document.createElement("div");
      bubble.className = `faq-msg ${sender}`;
      bubble.innerHTML = allowHtml ? text : escapeHtml(text);
      messages.appendChild(bubble);
      messages.scrollTop = messages.scrollHeight;
    }

    function findAnswer(input) {
      const q = input.toLowerCase();
      for (const entry of FAQ) {
        if (entry.keywords.some((k) => q.includes(k))) return entry.answer;
      }
      return FALLBACK;
    }

    function handleQuestion(text) {
      if (!text.trim()) return;
      addMessage(text, "user", false);
      faqInput.value = "";
      setTimeout(() => addMessage(findAnswer(text), "bot", true), 250);
    }

    QUICK_CHIPS.forEach((label) => {
      const chip = document.createElement("button");
      chip.type = "button";
      chip.className = "faq-chip";
      chip.textContent = label;
      chip.addEventListener("click", () => handleQuestion(label));
      chipsWrap.appendChild(chip);
    });

    addMessage(
      "Hi, I can answer quick questions about rates, automation, RAG, and how Nyxel works. Ask away, or use a suggestion below.",
      "bot",
      false
    );

    toggle.addEventListener("click", () => {
      const isOpen = widget.classList.toggle("open");
      toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
      iconOpen.style.display = isOpen ? "none" : "block";
      iconClose.style.display = isOpen ? "block" : "none";
      if (isOpen) faqInput.focus();
    });

    faqForm.addEventListener("submit", (event) => {
      event.preventDefault();
      handleQuestion(faqInput.value);
    });
  }
});