# Nyxel — Website

Multi-page static site (HTML/CSS/JS, no build step, no framework, no dependencies).

## File structure
```
nyxel-site/
├── index.html      # Home
├── services.html   # Automation, RAG, Ops — detailed
├── process.html    # The 4-step delivery cycle
├── work.html       # Case studies
├── about.html      # Founder / working-style page
├── contact.html    # Contact form
├── css/style.css   # All styling, shared across pages
├── js/script.js    # Contact form handler
└── README.md
```

Every page is a real, separate HTML file with its own URL — the nav links between them with normal `<a href="services.html">` links, not anchor-scrolling within one page.

## Run it locally

**Easiest — VS Code Live Server:**
1. Open this folder in VS Code.
2. Install the **Live Server** extension if you don't have it.
3. Right-click `index.html` → **Open with Live Server**.
4. Click through the nav — each click loads a real separate page.

**No extension:**
```bash
python3 -m http.server 8000
```
Then open `http://localhost:8000`.

## Going live (free hosting)
Push this folder to a GitHub repo and enable **GitHub Pages**, or drag it into **Cloudflare Pages** — both free, both handle a multi-page static site with no extra config.

## Still placeholder / to wire up before it's fully live
- The contact form shows "Sent" but doesn't send anywhere yet — connect it to **Formspree** or **Netlify Forms** (both free).
- `hello@nyxel.dev` on the Contact page is a placeholder — swap in a real inbox once you have one.
- Case studies on the Work page are your own projects reframed as case studies — swap in real client work as you land it.
