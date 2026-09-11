# personal-portfolio

Ediyono's CV, as a static site with an EN / 中文 toggle.

- `index.html` / `style.css` / `app.js` — renders `assets/resume.en.json` or `assets/resume.zh.json` client-side.
- Language: `?lang=zh` query param, or the toggle in the top-right (remembered via `localStorage`).
- Source of truth for content lives in the private assistant workspace (`work/resume.json`, `work/resume.zh.json`); `assets/` here is a copy kept in sync when the CV changes.
- Deployed via GitHub Pages from `main`.
