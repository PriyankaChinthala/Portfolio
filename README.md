# Priyanka Chinthala — Data Engineering Portfolio

A creative, GitHub Pages–ready portfolio built around a data-pipeline theme.
Pure static HTML/CSS/JS — **no build step, no dependencies**.

Live projects are fetched **automatically** from
[github.com/PriyankaChinthala](https://github.com/PriyankaChinthala) at page load,
so the Projects page always reflects your latest public work.

---

## 🎨 Design

- **Palette:** `#2C3E50` / `#34495E` accented with softer complementary tones
  — teal (`#1ABC9C`) and amber (`#F39C12`).
- **Theme:** animated data-pipeline (DAG) backdrop with streaming "data packets".
- Light/dark toggle, fully responsive, and respects `prefers-reduced-motion`.

## 📄 Pages

| File | Purpose |
|------|---------|
| `index.html` | Home — hero, headline stats, career timeline, skills |
| `projects.html` | Live projects auto-fetched from GitHub |
| `resources.html` | Curated data-engineering resources for visitors |
| `about.html` | Personal page — your story, values, community, certs, education |

---

## 🚀 Deploy to GitHub Pages (project site)

This is configured as a **project site**, served at
`https://priyankachinthala.github.io/Portfolio/`.

1. Push this branch and open a PR into `main` (or merge it).
2. In the repo, go to **Settings → Pages**.
3. Under **Build and deployment**, choose either:
   - **Deploy from a branch** → select `main` / root `/`, **or**
   - **GitHub Actions** (a workflow is included at `.github/workflows/pages.yml`).
4. Wait ~1 minute — your site goes live at the URL above.

All internal links are **relative**, so the site works both at the project
sub-path and at a root/custom domain without changes.

---

## ✅ Before you go live — quick checklist

Search the project for `TODO` and `data-placeholder` to find every spot to update:

- [ ] **LinkedIn** — replace `href="#"` on links marked `data-placeholder="linkedin"`
      (in `index.html`, `about.html`, and each footer) with your real LinkedIn URL.
- [ ] **Photo** — drop a headshot at `assets/img/priyanka.jpg` and swap the
      placeholder block in `about.html` (instructions are in a comment there).
- [ ] **About page** — two `✏️` notes mark the paragraphs to personalize
      (your story + your life outside work). Tell me and I'll rewrite them in your voice.
- [ ] **Email** — currently `priyankachinthala.pc@gmail.com`; change if needed.
- [ ] *(Optional)* **Custom domain** — add a `CNAME` file with your domain and
      point your DNS at GitHub Pages.

## 🔧 Local preview

No tooling required — just open `index.html` in a browser, or run:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

---

*Built with data in mind.* 🛰️
