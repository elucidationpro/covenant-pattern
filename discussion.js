/* Data-only slides. Lesson content is plain text, never executable markup. */
window.cpRenderDiscussion = function (host, slide) {
  host.replaceChildren();
  host.removeAttribute('style');
  host.className = 'discussion-slide ' + (slide.kind || '');
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
    add('h1', LESSON.title);
    add('p', LESSON.subtitle, 'subtitle');
  } else if (slide.kind === 'question') {
    add('h1', slide.text);
  } else if (slide.kind === 'passage') {
    host.style.setProperty('--passage-accent', `rgb(${LESSON.colors[0].rgb})`);
    add('h1', slide.ref);
    const reading = add('div', '', 'passage-text');
    const verses = LESSON.passages[slide.passage].verses.filter(([n]) => n >= slide.from && n <= slide.to);
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
      let offset = 0;
      for (const [start, end] of merged) {
        verse.append(document.createTextNode(text.slice(offset, start)));
        const emphasis = document.createElement('strong');
        emphasis.textContent = text.slice(start, end);
        verse.appendChild(emphasis);
        offset = end;
      }
      verse.append(document.createTextNode(text.slice(offset)));
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
