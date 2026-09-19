# Portfolio — structure & performance notes

## Files

| File | Purpose |
|---|---|
| `index.html` | Page markup (static, no runtime) |
| `styles.css` | All styles — same tokens, colours and layout as the original design |
| `script.js` | Theme toggle, mobile menu, scroll reveal, active-nav, contact form |
| `fonts/` | Self-hosted latin subsets: Manrope (variable), DM Mono 400/500 (~55 KB total) |
| `backup/` | `index.motion-bundle.html` (previous version) and `index.original-bundle.html` |

Deploy = upload the folder as-is (no build step).

## Why it was slow (and what changed)

| Cause in the old bundle | Fix |
|---|---|
| Single-file bundle: unpack ~10 gzipped assets, make blob URLs, boot React + `dc-runtime`, swap the whole `<html>` before anything rendered | Plain HTML + CSS + one small deferred script; content is in the first response |
| Motion layer hid `<main>` (`opacity:0`) until boot, polled every 40 ms and waited on fonts | No veil. Text renders immediately (`font-display: swap`); hero has a short CSS entrance |
| Scroll handler read `getBoundingClientRect()` for every section + parallax images each frame, moving 5 full-width gradient layers | Scroll handler only toggles one attribute (rAF-throttled); no layout reads, no parallax |
| Per-frame loop for cursor aurora, tilt, magnetic buttons, letter-wave (rects for every hero letter) | Removed |
| Infinite `background-position` animation on placeholders (repaints every frame, even off-screen) | Kept visually, but paused unless on screen |
| `backdrop-filter` on nav, hero card and menu | Kept on nav + mobile menu only (blur 20px) |
| Circular View-Transition on theme switch (snapshots whole page) | Instant switch |

Reveals use one `IntersectionObserver` and only animate `opacity` + `translate`/`scale`.
`prefers-reduced-motion` disables all movement.

## Responsive fixes

- Nav: hamburger below 1024 px is now pure CSS (no JS state, no flash on load).
- Experience cards: were `auto-fit` + `grid-column: span 2`, which created a phantom column at tablet widths → now 1 column < 720 px, 1fr / 3fr above.
- Contact form rows: same phantom-column issue → stacked < 560 px, label column 96 px above.
- Skill list: removed the inner scroll box; labels wrap under the bar on ≤ 480 px.
- Legal pop-ups open upward so they are never cut off at the bottom of the page.
- Safe-area insets fixed (left/right were swapped), `100dvh` with `100vh` fallback.
