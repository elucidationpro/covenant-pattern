# AGENTS.md: start here

Single source of truth for any agent (Claude chat, Claude Code, Codex, Cursor) working on this repo.
Read this, then README.md (technical reference), then the newest `weeks/<slug>/lesson.js`.

## What this is
Jeremy's weekly Sunday School (Come, Follow Me) lessons. One static, no-build site with three surfaces:
- **Presenter** `present.html`: laptop on a 50" 16:9 TV. Discussion slides render on a fixed 1920x1080 stage scaled to fit.
- **Controller** `notes.html`: Jeremy's phone. Flat numbered slide list, tap to jump, Prev/Next, Hide, Board panel, board paging.
- **Participant** `highlight.html`: class phones via QR. Tap/drag to highlight, autosaves (no Submit), "Switch to live view".
Live board `index.html` is embedded in the presenter as the `board` item. Passage slides also paint the live group highlights for their verses.

Production: https://elucidationpro.github.io/covenant-pattern/ (GitHub Pages from `main`, repo `elucidationpro/covenant-pattern`). Push to `main` = deploy (~1 min).

## How Jeremy works (follow this)
- **He sets structure and content.** Do not propose lesson flow, questions, or which scriptures to use. When he loosely references a scripture, quote, talk, or image, find it for him.
- **Class is 25 min total** including prayers and late start. Format is discussion-heavy: few slides, strong questions, his personal notes stay off the slides.
- **Slides carry minimal text.** No labels like "Question 2" or "Resource". Scripture slide comes before its question slide. Question slides: painting on one half, soft fade into ink, question on the other half, sides alternate. No artist credit lines on slides.
- **TV-first:** px sizes on the 1920x1080 stage, no vw/clamp inside slides. Keep text big.
- **Reuse the theme:** ink `#121820`, text `#ECE7DC`, gold `242,196,92`; Cormorant Garamond headings, Spectral body, Figtree UI.
- He's not a coder. Be concise, no em dashes, don't over-explain. Act, verify, then report briefly.
- Don't revisit decisions he's closed.

## Starting a new week (checklist)
1. Get the Come, Follow Me reading for the week (churchofjesuschrist.org manual "come-follow-me-for-home-and-church-old-testament-2026"). Wait for Jeremy's structure.
2. `cp -r weeks/jeremiah-1-20 weeks/<new-slug>`; edit `lesson.js` (`slug`, title, subtitle, `passages` in KJV, `items`). Jeremiah's file is the reference discussion lesson.
3. Images go in `weeks/<slug>/img/`. Public-domain art can be committed. Licensed art: Jeremy has chosen to publish it so the hosted presenter works; credit the artist in `lesson.js` comments.
4. Preview locally (below). Test on a throwaway copy so you don't take over his live presenter (see Gotchas).
5. When he's happy: set `defaultLesson` in `config.js` to the new slug, commit, push `main`.
6. Before class: confirm Supabase is active (see Gotchas) and the board is empty for that lesson.
7. Add a line to the Lesson log below.

## Item kinds (discussion lessons)
`title`, `question` (text, image, imageSide left|right, imagePosition), `passage` (ref, passage, from, to, emphasis[]), `instructions` (eyebrow, heading, body, qr), `board`, `text` (title, body, optional image/imageSide/imagePosition), `quote`, `scripture`, `video` (youtubeId, start, end), `image`.
Lesson-level: `titleImage`, `titleImagePosition`, `titleTheme: 'dark-text'`, `colors` (one color = no picker).
Keep item `id`s stable when reordering; hide state is keyed on them.

## Local dev
```
cd ~/covenant-pattern
python3 tools/serve.py     # no-cache server on :8080
```
`tools/serve.py` serves the repo with caching off on 0.0.0.0:8080 (plain `python3 -m http.server` can serve stale JS).
Open `http://localhost:8080/present.html` and `notes.html`. Phone on same Wi-Fi: `http://<mac-ip>:8080/notes.html`.
Join QR always points to `CP_CONFIG.publicUrl` (production), even on localhost.

## Data (Supabase)
Project `covenant-pattern`, id `bvkmcqvwhcudxnpqdenl`. Table `public.submissions`: `device_id`, `lesson`, `marks` (jsonb, word id `passage:verse:wordIndex` -> color key), `updated_at`. Unique `(device_id, lesson)`, replica identity full. Presenter/remote sync uses five reserved control UUID rows per lesson in the same table (excluded from counts). Legacy `control` table is unused.

## Gotchas
- **Free tier pauses after ~7 days idle.** Restore it (Supabase dashboard or MCP `restore_project`) before testing or class.
- **Single active presenter:** opening `present.html` for a lesson makes it the active screen and others go to standby. To test without hijacking Jeremy's screen, copy the week to `weeks/zz-preview` (change `slug`), test with `?lesson=zz-preview`, then delete the folder and its rows: `delete from submissions where lesson='zz-preview';`.
- Changing passage text after class has highlighted changes word ids; old marks won't line up.
- Agent tooling on Jeremy's Mac: `codex exec -s workspace-write -C ~/covenant-pattern -` works headless. `cursor-agent -p` needs `agent login` in Terminal (or `CURSOR_API_KEY`) before it works headless.

## Lesson log
- 2026-10 Isaiah 50–54 (`isaiah-50-54`): deck lesson, two-color covenant highlighter (what we do / what He promises). Class loved the highlighting.
- 2026-10-25 Jeremiah 1:1–10 (`jeremiah-1-20`): discussion lesson. Theme: God knew us before we were born. Flow: reflection, name of Jeremiah, QR + live highlight board, then 4–5 / 6–8 / 9–10 each followed by a question (impact of this truth, setting aside fears, your mission).
- 2026-11-01 Jeremiah 31; Lamentations (`jeremiah-31-lam`): discussion lesson, theme mourning into joy / God takes what we expected and changes what it means. Song highlight activity: lyrics load from Supabase `lesson_content` (never in repo), word-level, scrollable participant view; song plays from Jeremy's phone. Per-lesson `theme`, `fontSet: 'modern'` (Montserrat/Raleway), `titleLayout: 'split'`.
