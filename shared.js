/* Shared lesson loading, verse rendering, pagination, and realtime helpers. */
/* Build one verse. `decorate(id)` returns {cls, style} for each word. */
window.verseHTML = function (p, [n, text], decorate) {
  const words = text.split(' ');
  return `<p class="verse"><span class="vn">${n}</span>` + words.map((w, i) => {
    const id = `${p}:${n}:${i}`;
    const d = decorate ? decorate(id) : { cls: '', style: '' };
    const sp = i < words.length - 1 ? ' ' : '';
    return `<span class="w ${d.cls || ''}" data-id="${id}"${d.style ? ` style="${d.style}"` : ''}>${w}${sp}</span>`;
  }).join('') + '</p>';
};

/* Two columns on wide screens (TV / laptop), one on phones. */
window.colsFor = function (box) {
  return box.clientWidth > 1000 && box.clientWidth / Math.max(1, box.clientHeight) > 1.4 ? 2 : 1;
};

/* Fit as many whole verses as the box holds. Returns pages; each page is an array of columns, each column an array of verses. */
window.paginate = function (passageKey, box, meas, decorate, cols) {
  cols = cols || 1;
  const P = window.PASSAGES[passageKey];
  const cs = getComputedStyle(box);
  const gap = parseFloat(cs.getPropertyValue('--vgap')) || parseFloat(cs.rowGap) || 0;
  const colGap = cols > 1 ? (parseFloat(cs.columnGap) || 0) : 0;
  const colW = (box.clientWidth - colGap * (cols - 1)) / cols;
  meas.style.width = colW + 'px';
  meas.style.fontSize = cs.fontSize;
  const avail = box.clientHeight;
  const pages = []; let page = [], cur = [], h = 0;
  const closeCol = () => { if (cur.length) page.push(cur); cur = []; h = 0; if (page.length >= cols) { pages.push(page); page = []; } };
  meas.innerHTML = '';
  P.verses.forEach(v => {
    meas.innerHTML = window.verseHTML(passageKey, v, decorate);
    const vh = meas.firstChild.getBoundingClientRect().height;
    const add = cur.length ? vh + gap : vh;
    if (cur.length && h + add > avail) closeCol();
    cur.push(v); h += (cur.length > 1 ? vh + gap : vh);
  });
  if (cur.length) page.push(cur);
  if (page.length) pages.push(page);
  meas.innerHTML = '';
  return pages;
};

window.pageHTML = function (passageKey, page, decorate) {
  const col = vs => vs.map(v => window.verseHTML(passageKey, v, decorate)).join('');
  if (page.length <= 1) return col(page[0] || []);
  return page.map(vs => `<div class="col">${col(vs)}</div>`).join('');
};

window.refLabel = function (passageKey, page) {
  const P = window.PASSAGES[passageKey];
  const vs = [].concat(...page);
  const a = vs[0]?.[0], b = vs[vs.length - 1]?.[0];
  return `${P.title}${a ? ':' + a + (b !== a ? '–' + b : '') : ''}`;
};

/* Supabase client (loaded from CDN on each page). */
window.cpClient = function () {
  const c = window.CP_CONFIG;
  return window.supabase.createClient(c.supabaseUrl, c.supabaseKey);
};

/* Keep all page/iframe links on the selected week, including mode and other params. */
window.cpURL = function (path) {
  const url = new URL(path, location.href);
  url.search = location.search;
  url.searchParams.set('lesson', LESSON.slug);
  return url.href;
};
window.cpJoinURL = function () {
  const base = (window.CP_CONFIG && CP_CONFIG.publicUrl) || location.href;
  const url = new URL('highlight.html', base);
  url.searchParams.set('lesson', LESSON.slug);
  return url.href;
};
window.cpQRCodeURL = function (href, size = 240) {
  return 'https://api.qrserver.com/v1/create-qr-code/?size=' + size + 'x' + size + '&margin=4&data=' + encodeURIComponent(href);
};
window.cpShowError = function (error) {
  const message = document.createElement('p');
  message.textContent = 'Could not load lesson: ' + error.message;
  message.style.cssText = 'padding:24px;font:18px system-ui;color:#ECE7DC;background:#121820';
  document.body.replaceChildren(message);
};
window.cpReady = new Promise((resolve, reject) => {
  const slug = new URLSearchParams(location.search).get('lesson') || CP_CONFIG.defaultLesson;
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug || '')) {
    reject(new Error('Invalid lesson slug.')); return;
  }
  const script = document.createElement('script');
  script.src = `weeks/${slug}/lesson.js`;
  script.onerror = () => reject(new Error(`Week “${slug}” was not found.`));
  script.onload = async () => {
    try {
      const l = window.LESSON;
      if (!l || l.slug !== slug || !l.passages || !Object.keys(l.passages).length ||
          !Array.isArray(l.colors) || ![1, 2].includes(l.colors.length) ||
          new Set(l.colors.map(c => c.key)).size !== l.colors.length ||
          l.colors.some(c => !/^[a-z][a-z0-9-]*$/.test(c.key) || !/^\d{1,3},\s*\d{1,3},\s*\d{1,3}$/.test(c.rgb))) {
        throw new Error('Invalid lesson definition.');
      }
      window.PASSAGES = l.passages;
      window.CP_COLORS = Object.fromEntries(l.colors.map(c => [c.key, c]));
      window.CP_MODES = l.colors.map(c => c.key);
      window.CP_INTRO = l.notes?.intro || [];
      window.CP_VIDEO = l.video;
      let slides;
      if (l.type === 'discussion') {
        if (!Array.isArray(l.items)) throw new Error('Discussion lessons need items.');
        const ids = new Set(), positions = new Set();
        const kinds = ['title', 'question', 'passage', 'instructions', 'board', 'text', 'quote', 'scripture', 'video', 'image'];
        slides = l.items.map(item => {
          if (!kinds.includes(item.kind)) throw new Error('Unknown discussion item kind.');
          if (Object.hasOwn(item, 'resources')) throw new Error('Discussion items must be flat slides; resources are not supported.');
          const id = item.id || (['title', 'board'].includes(item.kind) ? item.kind : '');
          if (!/^[a-z0-9-]+$/.test(id) || ids.has(id)) throw new Error('Use unique lowercase slide IDs.');
          ids.add(id);
          // Retain historical positions so saved navigation and hiding survive flattening.
          const pos = item.kind === 'title' ? '1' : item.kind === 'board' ? 'board'
            : item.kind === 'question' ? 'q-' + id
            : ['passage', 'instructions'].includes(item.kind) ? item.kind + '-' + id : 'r-' + id;
          if (positions.has(pos)) throw new Error('Use only one title and one board item.');
          positions.add(pos);
          if (item.kind === 'passage') {
            const { passage, from, to } = item;
            if (!l.passages[passage] || !Number.isInteger(from) || !Number.isInteger(to) || from > to ||
                !l.passages[passage].verses.some(v => v[0] === from) || !l.passages[passage].verses.some(v => v[0] === to)) {
              throw new Error('Passage items must name an existing passage and verse range.');
            }
          }
          const label = item.kind === 'title' ? l.title : item.kind === 'board' ? (item.label || 'Live highlights')
            : item.text || item.ref || item.heading || item.title || item.cite || item.kind;
          return { ...item, pos, label };
        });
        if (!slides.length) throw new Error('Discussion items cannot be empty.');
      } else {
      slides = (l.notes?.slides || []).filter(s => s.pos !== 'board').map(s => ({ ...s, pos: String(s.pos) }));
      const boardIndex = slides.findIndex(s => s.pos === String(l.boardAfterSlide));
      if (boardIndex < 0) throw new Error('boardAfterSlide must name a slide in notes.slides.');
      slides.splice(boardIndex + 1, 0, l.notes.slides.find(s => s.pos === 'board') || {
        pos: 'board', label: 'Live highlight board', bullets: [],
      });
      }
      window.CP_VIDEOS = l.type === 'discussion'
        ? slides.filter(s => s.kind === 'video').map(s => ({ pos: s.pos, id: s.youtubeId, start: s.start || 0, end: s.end }))
        : (l.video ? [l.video] : []);
      window.cpVideoFor = pos => CP_VIDEOS.find(v => v.pos === pos);
      window.CP_SEQUENCE = slides;
      const style = document.createElement('style');
      style.textContent = l.colors.map(c => `
        .w.${c.key}{background:rgb(${c.rgb});color:var(--on-hi)}
        .mode[data-mode="${c.key}"]{--mode-color:rgb(${c.rgb})}
      `).join('');
      document.head.appendChild(style);
      const select = document.getElementById('passage');
      if (select) Object.entries(PASSAGES).forEach(([key, p]) => select.add(new Option(p.label || p.title, key)));
      const legend = document.querySelector('.legend');
      const modes = document.querySelector('.modes');
      if (modes && l.colors.length === 1) modes.style.display = 'none';
      l.colors.forEach(c => {
        if (legend) {
          const item = document.createElement('span'), swatch = document.createElement('i');
          swatch.className = 'sw'; swatch.style.background = `rgb(${c.rgb})`;
          item.append(swatch, document.createTextNode(c.label)); legend.appendChild(item);
        }
        if (modes) {
          const button = document.createElement('button'), dot = document.createElement('span');
          button.className = 'mode'; button.id = 'm-' + c.key; button.dataset.mode = c.key;
          button.setAttribute('aria-pressed', 'false'); dot.className = 'dot';
          button.append(dot, document.createTextNode(c.label)); modes.appendChild(button);
        }
      });
      // Stable UUIDs also work when device_id is a UUID column. Separate fields
      // prevent simultaneous screen claims and remote navigation overwriting each other.
      window.CP_CONTROL_IDS = {};
      for (const field of ['position', 'hidden', 'video', 'screen', 'board']) {
        const bytes = new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode('cp-control:' + slug + ':' + field)));
        bytes[6] = (bytes[6] & 15) | 80; bytes[8] = (bytes[8] & 63) | 128;
        const hex = Array.from(bytes.slice(0, 16), b => b.toString(16).padStart(2, '0')).join('');
        CP_CONTROL_IDS[field] = `${hex.slice(0,8)}-${hex.slice(8,12)}-${hex.slice(12,16)}-${hex.slice(16,20)}-${hex.slice(20)}`;
      }
      resolve(l);
    } catch (error) { reject(error); }
  };
  document.head.appendChild(script);
});


/* Presenter state shares the submissions schema, in reserved per-lesson rows.
   Only rows matching this week's deterministic IDs are treated as controls. */
window.cpControl = function (sb) {
  return {
    async load() {
      const { data, error } = await sb.from(CP_CONFIG.table).select('device_id,marks')
        .eq('lesson', LESSON.slug).in('device_id', Object.values(CP_CONTROL_IDS));
      if (error) return { data: null, error };
      const state = { position: CP_SEQUENCE[0].pos, hidden: [], video: null, screen: null };
      for (const row of data || []) {
        const field = Object.keys(CP_CONTROL_IDS).find(k => CP_CONTROL_IDS[k] === row.device_id);
        if (field && row.marks && Object.hasOwn(row.marks, 'value')) state[field] = row.marks.value;
      }
      return { data: state, error: null };
    },
    async update(patch) {
      const rows = Object.entries(patch).filter(([key]) => CP_CONTROL_IDS[key]).map(([key, value]) => ({
        device_id: CP_CONTROL_IDS[key], lesson: LESSON.slug,
        marks: { value }, updated_at: new Date().toISOString(),
      }));
      if (!rows.length) return { error: new Error('No supported control fields. Refresh this page.') };
      return sb.from(CP_CONFIG.table).upsert(rows, { onConflict: 'device_id,lesson' });
    },
    subscribe(name, reload) {
      return sb.channel(name + '-' + LESSON.slug)
        .on('postgres_changes', { event: '*', schema: 'public', table: CP_CONFIG.table, filter: 'lesson=eq.' + LESSON.slug }, payload => {
          if (Object.values(CP_CONTROL_IDS).includes(payload.new?.device_id)) reload();
        }).subscribe();
    },
  };
};
