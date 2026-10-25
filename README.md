# Covenant Pattern Highlighter

A reusable, no-build Sunday School activity. Everyone highlights scripture on their phone, and the live board shows where the group agrees. More votes make a word's color stronger.

Run locally: `python3 -m http.server 8080`, then open `http://localhost:8080/present.html`.

- `index.html` — live board, lesson-specific join link/QR, passage picker, and Reset (confirms before deleting only this week's highlights).
- `highlight.html` — phone highlighter. Tap or drag words; marks and removals save automatically after about 400ms. Each save replaces that device's highlights for that week, including clearing all marks. A small Saved indicator confirms sync. Drafts and device IDs are stored separately per lesson. The sticky Highlight / Group view toggle opens the same read-only live board preview as the remote. Switching views preserves edits, and the selected view is remembered per lesson for the browser session.
- `present.html` — deck lessons or data-driven discussion slides. Deck lessons insert the live board after `boardAfterSlide`. Arrows/clicks step through the lesson; `b` jumps to the board. On the board, arrows page verses, Enter advances to the next slide, and Backspace returns to the preceding slide.
- `notes.html` — phone presenter remote with notes, Next/Prev, slide hiding, and optional video controls. Keep its URL private; it is not authenticated.
- `shared.js` — lesson loader, rendering, pagination, and realtime helpers. `styles.css` contains the shared palette and Spectral/Figtree theme. `config.js` contains the public Supabase credentials and `defaultLesson`.
- `weeks/<slug>/lesson.js` — all lesson content; deck lessons also have `deck.html` and optional `presenter-notes.md` alongside it. `discussion.js` and `discussion.css` render and style discussion lessons.

All four pages accept `?lesson=<slug>`. Without it, they use `CP_CONFIG.defaultLesson`, currently `isaiah-50-54`. Other query parameters are preserved in join links and embedded pages. Mode names are the keys in the selected lesson's colors:

- `highlight.html?mode=promise` still selects Isaiah's blue; `?mode=action` selects green.
- `present.html?lesson=jeremiah-1-20` opens the discussion lesson.
- `highlight.html?lesson=jeremiah-1-20` uses a single gold highlight with no color picker.

Isaiah retains its original deck, passages, green/blue colors, notes, and the board between slides 8 and 9. Slide 6 overlays the original Elder Holland clip (4:05–5:17). Jeremiah is an ordered discussion of Jeremiah 1:1–10, with questions, passages, text slides, and a live highlight board.

## Add a week

1. For a deck lesson, copy `weeks/isaiah-50-54/` to `weeks/<new-slug>/` (lowercase letters/numbers separated by hyphens).
2. Edit `lesson.js`: set `slug`, `title`, `passages`, one or two `colors` (`key`, RGB string, `label`), `boardAfterSlide`, `video`, `notes`, and `deck`. Passage verses are `[verseNumber, 'text']` pairs. Use unique, stable passage keys; changing text after submissions changes word IDs. An optional passage `label` overrides its dropdown label.
3. Edit the deck and presenter notes. Decks must be same-origin HTML that shows slide N for hash `#N`. Match those slide numbers with `notes.slides[].pos` (strings). `notes` has `intro` (strings) and `slides` (`pos`, `label`, optional `time`, `bullets`). An optional `pos: 'board'` entry provides board notes; the loader places it after `boardAfterSlide` regardless of its array position. Set `video: null` or `{ pos: '6', id: 'YouTubeID', start: 245, end: 317 }`. `deck` is a filename relative to the week folder.
4. Preview all four pages with `?lesson=<new-slug>`. Once ready, change only `defaultLesson` in `config.js`. Leave credentials unchanged. Old lesson URLs keep working.

## Author a discussion lesson

Use `weeks/jeremiah-1-20/lesson.js` as a starting point. Keep `slug`, `passages`, and one or two `colors` for the participant flow. Set `type: 'discussion'`, a `title`, optional `subtitle` and `titleImage`, and an ordered `items` array. Every item is exactly one slide. No nested `resources` or legacy `questions` array is supported. No deck or top-level video is needed.

```js
type: 'discussion',
title: 'Lesson title',
subtitle: 'Scripture readings',
items: [
  { kind: 'title' },
  { kind: 'question', id: 'opening', text: 'What do you notice?' },
  { kind: 'text', id: 'context', title: 'Context', body: 'Supporting text' },
  { kind: 'instructions', id: 'read', heading: 'Highlight what stands out to you', qr: true },
  { kind: 'board', id: 'board', label: 'Live highlights' },
  { kind: 'passage', id: 'reading', ref: 'Jeremiah 1:4–5', passage: 'jer1', from: 4, to: 5, emphasis: ['I knew thee'] },
  { kind: 'quote', id: 'quotation', body: 'Quote text', cite: 'Speaker, source' },
  { kind: 'scripture', id: 'verse', title: 'Jeremiah 1:5', body: 'Verse text' },
  { kind: 'video', id: 'clip', title: 'Video clip', youtubeId: 'YouTubeID', start: 30, end: 90 },
  { kind: 'image', id: 'picture', title: 'Image title', src: 'image.jpg', body: 'Image description', cite: 'Image credit' },
],
```

Allowed kinds are `title`, `question`, `passage`, `instructions`, `board`, `text`, `quote`, `scripture`, `video`, and `image`. Questions may have `image` and `imageCaption`. Passage slides read the inclusive `from`/`to` range from `passages`; literal `emphasis` phrases use the first lesson color. Instructions show only the heading, a large QR code when `qr: true`, and its join URL. They do not render body text.

Use unique, stable lowercase letters/numbers/hyphens for item IDs. Title and board IDs may be omitted; use at most one of each. Position keys retain the existing prefixes (`q-` for questions, `r-` for text/quote/scripture/video/image, `passage-` and `instructions-`); title stays `1` and board stays `board`. Keep IDs and kinds when reordering so saved hide state stays attached to the same slide.

Text fields are plain text; use newlines in `body` for paragraphs or verses. Scripture bodies longer than 600 characters use two columns on laptop screens. Image `src` paths are relative to the week folder (absolute URLs also work). Video start/end values are seconds; start defaults to zero and end is optional.

The `items` array is the complete order, including title and board. `includeBoard` does not insert slides. Without a board item, the live board remains available through `index.html?lesson=<slug>` and participant Group view.

Discussion remotes show a flat list numbered 1–N with short content labels. Tap a slide to present it. Prev/Next skips hidden slides; Show hidden slides reveals Unhide controls. Video controls appear on the active video slide. Click the laptop screen once to arm video audio. Discussion lessons have no timer or question/resource breadcrumbs.

Remotes with a board item include a **Board** button for a private, read-only live heatmap. **Show on screen** presents the ordered board slide; opening or closing the preview never navigates the presenter.

## Data and one-time migration

The existing public Supabase `submissions` table needs a nullable text column named `lesson`. Backfill existing rows with `isaiah-50-54` before using this version. No SQL or database changes are performed by this repository. Keep the existing unique/primary key on `device_id`; each phone generates an independent UUID per week, so no composite unique constraint is required. Existing Isaiah phone drafts/device IDs migrate from the old local storage key.

Every written row includes `lesson`; reads, realtime subscriptions, and resets are filtered to it. Realtime still requires the table's existing publication setup. Polling remains a fallback, including for deletes.

Presenter state uses four reserved UUID rows per lesson in `submissions`, storing position, hidden slides, video command, and active screen in `marks.value`. Separate rows keep concurrent updates to different fields from overwriting each other. These rows are excluded from board counts and Reset. This avoids another schema migration: the old single-row `control` table is no longer used or modified. Its current position/hidden settings are not migrated; each lesson starts at slide 1 with no hidden slides. The most recently opened presenter screen takes control only for its own lesson.

Serve over HTTPS (or localhost) for browser crypto support. This remains a public classroom activity, not a secure host/admin system.
