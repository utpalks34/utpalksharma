# Utpal Kant Sharma — Portfolio

Personal portfolio for Utpal Kant Sharma, an AI & backend engineer in Guwahati, Assam, building agentic systems (LangGraph pipelines, RAG assistants) and Django/FastAPI services.

A static site: plain HTML, CSS and one small vanilla JS file. No framework, no build step, no dependencies.

## Sections

- **Home** — intro, CV download button and an animated SVG portrait
- **About** — who I am and what I do
- **Skills** — animated skill bars plus a list of other tools
- **Experience** — internship, education and certification timeline
- **Projects** — SEVA, B2B Sales Intelligence, Multi-Agent Research Assistant
- **Contact** — validated contact form, social links, and Terms / Privacy pop-ups

## Features

- Light and dark theme: follows the system setting, can be toggled, and is remembered in `localStorage` (set before first paint, so there is no flash)
- Responsive layout with a CSS-only hamburger menu below 1024 px and safe-area insets on mobile
- Scroll reveals via a single `IntersectionObserver`, and a scroll progress bar in the header
- Mouse-only effects (skipped on touch devices): cursor aurora, magnetic buttons, card spotlight, and portrait tilt with glare
- `prefers-reduced-motion` disables movement
- Accessibility: skip link, ARIA labels, focus-trapped mobile menu with Escape to close, and live-region form errors and status
- Contact form with inline validation, a character counter and an auto-growing textarea

## Project structure

| Path | Purpose |
|---|---|
| `index.html` | Page markup |
| `styles.css` | All styles and design tokens |
| `script.js` | Theme toggle, mobile menu, scroll reveal, pointer effects, contact form |
| `fonts/` | Self-hosted latin subsets of Manrope and DM Mono (~55 KB total) |
| `index.pre-motion.html` | Earlier version, before the motion layer was added |
| `backup/` | Older single-file bundles, kept for reference |

## Run locally

Open `index.html` in a browser, or serve the folder:

```bash
python -m http.server 8000
# then visit http://localhost:8000
```

## Deploy

Upload the folder as-is to any static host (GitHub Pages, Vercel, Netlify, etc.).

## Before going live

- **Contact form** — currently a demo. Validation works, but on submit it only simulates sending; no message is delivered. Wire it to a backend or form service (Formspree, Web3Forms, etc.) in the submit handler in `script.js`.
- **CV button** — the "Download my CV" link in `index.html` has `href="#"`. Point it at your PDF.
- **Project links and images** — the project "View on GitHub" links point to the GitHub profile, not the individual repos, and the project images are placeholders.
- **Favicon** — `index.html` uses an empty `data:,` icon.

## License

See [LICENSE](LICENSE).
