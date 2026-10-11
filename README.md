# Covenant Pattern Highlighter

Group scripture highlighting for a class. Everyone highlights on their own phone, and the main screen shows where the group agrees: one person's highlight is light, and it gets more vibrant as more people mark the same words.

- `index.html` — main screen (put this on the TV). Live-updates as people submit. Shows a QR code to the highlight page.
- `highlight.html` — personal page. Pick a color, tap or drag across words, and press **Submit highlights**. Re-submitting replaces your earlier submission (each device gets one row).
  - `highlight.html?mode=promise` opens with blue (What He promises) preselected; `?mode=action` preselects green (What we do).
- `present.html` — the lesson screen. Shows the slide deck (`deck.html`) and swaps in the live board between slides 8 and 9. Arrow keys / clicks on this screen follow the same order. Keyboard: `b` jumps to the board; while on the board, Enter goes to slide 9 and Backspace back to slide 8.
- `notes.html` — presenter remote with notes for each slide. Tap a slide (or Next/Prev) and the lesson screen follows. Per-slide **Hide** removes a slide from Next/Prev on both screens; the "Show hidden slides" toggle at the bottom lists them again so you can unhide. Slide 6 has Play / Pause / Restart for the video clip. Not linked anywhere; keep the URL private.
- `notes-data.js` — slide labels, timing, and bullets (generated from `presenter-notes.md`), plus the video clip config (`CP_VIDEO`: YouTube id, start/end seconds).
- Slide 6 video: the exported deck only has a still image, so `present.html` overlays a YouTube player (official Church recording of Elder Holland, "Lord, I Believe", 4:05–5:17) and plays it on command from the phone.
- Board and highlight page use two columns when the screen is wide (landscape, >1000px).
- Colors: green = what we do, blue = what He promises.
- **Reset** button on the main screen deletes all submissions (asks for confirmation).

Data is stored in a free Supabase project (`config.js`). The table is intentionally public for a one-time activity.

Run locally: `python3 -m http.server 8080` then open `http://localhost:8080/`.
