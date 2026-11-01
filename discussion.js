/* Data-only slides. Lesson content is plain text, never executable markup. */
window.cpRenderDiscussion = function (host, slide) {
  host.replaceChildren();
  host.removeAttribute('style');
  host.className = 'discussion-slide ' + (slide.kind || '');
  Object.entries(LESSON.theme || {}).forEach(([k, v]) => host.style.setProperty(k, v));
  if (LESSON.fontSet) host.classList.add('font-' + LESSON.fontSet);
  const add = (tag, text, cls) => {
    const el = document.createElement(tag);
    el.textContent = text || '';
    if (cls) el.className = cls;
    host.appendChild(el);
    return el;
  };
  if (slide.kind === 'title') {
    if (LESSON.titleImage) {
      host.classList.add('has-bg');
      host.style.setProperty('--title-bg', `url("weeks/${LESSON.slug}/${LESSON.titleImage}")`);
    }
    host.style.setProperty('--title-position', LESSON.titleImagePosition || 'center top');
    host.classList.toggle('dark-text', LESSON.titleTheme === 'dark-text');
    host.classList.toggle('split', LESSON.titleLayout === 'split');
    add('h1', LESSON.title);
    add('p', LESSON.subtitle, 'subtitle');
  } else if (slide.kind === 'question') {
    add('h1', slide.text);
  } else if (slide.kind === 'scripture' && Array.isArray(slide.verses)) {
    // Static scripture with verse numbers; emphasis phrases match case-insensitively.
    host.style.setProperty('--passage-accent', `rgb(${LESSON.colors[0].rgb})`);
    add('h1', slide.title);
    const reading = add('div', '', 'passage-text');
    if (slide.verses.reduce((t, v) => t + v[1].length, 0) > 380) reading.classList.add('compact');
    for (const [n, text] of slide.verses) {
      const verse = document.createElement('p');
      const number = document.createElement('span');
      number.className = 'verse-number';
      number.textContent = n + ' ';
      verse.appendChild(number);
      let rest = text;
      const phrases = (slide.emphasis || []).map(e => e.toLowerCase());
      while (rest.length) {
        let best = -1, len = 0;
        for (const ph of phrases) { const i = rest.toLowerCase().indexOf(ph); if (i !== -1 && (best === -1 || i < best)) { best = i; len = ph.length; } }
        if (best === -1) { verse.appendChild(document.createTextNode(rest)); break; }
        if (best) verse.appendChild(document.createTextNode(rest.slice(0, best)));
        const strong = document.createElement('strong'); strong.textContent = rest.slice(best, best + len); verse.appendChild(strong);
        rest = rest.slice(best + len);
      }
      reading.appendChild(verse);
    }
  } else if (slide.kind === 'passage') {
    host.style.setProperty('--passage-accent', `rgb(${LESSON.colors[0].rgb})`);
    add('h1', slide.ref);
    const reading = add('div', '', 'passage-text');
    const verses = LESSON.passages[slide.passage].verses.filter(([n]) => n >= slide.from && n <= slide.to);
    if (LESSON.passages[slide.passage].source) {
      reading.innerHTML = LESSON.passages[slide.passage].verses
        .filter(([n, , kind]) => kind === 'message' || (n >= (slide.from ?? 0) && n <= (slide.to ?? Infinity)))
        .map(v => verseHTML(slide.passage, v, window.cpHeat?.decorate)).join('');
      return;
    }
    for (const [n, text] of verses) {
      const verse = document.createElement('p');
      const number = document.createElement('span');
      number.className = 'verse-number';
      number.textContent = n + ' ';
      verse.appendChild(number);
      // Literal phrase ranges preserve punctuation and safely merge overlapping emphasis.
      const ranges = [];
      for (const phrase of (slide.emphasis || []).filter(p => typeof p === 'string' && p.length)) {
        let at = text.indexOf(phrase);
        while (at !== -1) {
          ranges.push([at, at + phrase.length]);
          at = text.indexOf(phrase, at + phrase.length);
        }
      }
      const merged = [];
      ranges.sort((a, b) => a[0] - b[0]).forEach(range => {
        const last = merged[merged.length - 1];
        if (last && range[0] <= last[1]) last[1] = Math.max(last[1], range[1]);
        else merged.push(range);
      });
      // Word spans share the highlighter's ids (passage:verse:wordIndex) so live group highlights can be painted here.
      const heat = window.cpHeat;
      const words = text.split(' ');
      let at = 0;
      words.forEach((word, i) => {
        const span = document.createElement(merged.some(([s, e]) => at < e && at + word.length > s) ? 'strong' : 'span');
        span.className = 'w';
        span.textContent = word + (i < words.length - 1 ? ' ' : '');
        const d = heat && heat.decorate(`${slide.passage}:${n}:${i}`);
        if (d && d.style) { span.setAttribute('style', d.style); if (d.cls) span.classList.add(d.cls); }
        verse.appendChild(span);
        at += word.length + 1;
      });
      reading.appendChild(verse);
    }
  } else if (slide.kind === 'instructions') {
    if (slide.eyebrow) add('div', slide.eyebrow, 'eyebrow');
    add('h1', slide.heading);
    if (slide.body) add('p', slide.body, 'instructions-body');
    if (slide.qr) {
      const href = cpJoinURL();
      const qr = add('img', '', 'instructions-qr');
      qr.alt = 'QR code to the highlight page';
      qr.src = cpQRCodeURL(href, 600);
    }
  } else if (slide.kind === 'quote') {
    add('blockquote', slide.body);
    add('p', slide.cite, 'citation');
  } else if (slide.kind === 'image') {
    if (slide.title) add('h2', slide.title);
    const img = add('img', '');
    img.alt = slide.body || slide.title || '';
    if (slide.src) img.src = new URL(slide.src, new URL('weeks/' + LESSON.slug + '/', location.href)).href;
  } else {
    add('h2', slide.title || slide.cite);
    const body = add('div', slide.kind === 'text' ? '' : slide.body, 'resource-body' + (slide.kind === 'scripture' && (slide.body || '').length > 600 ? ' columns' : ''));
    if (slide.kind === 'text') (slide.body || '').split(/\r?\n+/).forEach(text => {
      const paragraph = document.createElement('p');
      paragraph.textContent = text;
      body.appendChild(paragraph);
    });
    if (slide.cite && slide.cite !== slide.title) add('p', slide.cite, 'citation');
  }
  if (['question', 'text'].includes(slide.kind) && slide.image) {
    host.classList.add('has-image', 'image-' + (slide.imageSide === 'left' ? 'left' : 'right'));
    const content = document.createElement('div');
    content.className = 'slide-copy';
    content.append(...host.childNodes);
    const img = document.createElement('img');
    img.className = 'slide-image';
    img.src = 'weeks/' + LESSON.slug + '/' + slide.image;
    img.alt = '';
    img.style.objectPosition = slide.imagePosition || 'center 30%';
    host.append(img, content);
  }
};
