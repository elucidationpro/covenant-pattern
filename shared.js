/* Shared passages, verse rendering, and pagination for both pages. */
window.PASSAGES = {
  isa51: { title: 'Isaiah 51', verses: [
    [1, 'Hearken to me, ye that follow after righteousness, ye that seek the LORD: look unto the rock whence ye are hewn, and to the hole of the pit whence ye are digged.'],
    [2, 'Look unto Abraham your father, and unto Sarah that bare you: for I called him alone, and blessed him, and increased him.'],
    [3, 'For the LORD shall comfort Zion: he will comfort all her waste places; and he will make her wilderness like Eden, and her desert like the garden of the LORD; joy and gladness shall be found therein, thanksgiving, and the voice of melody.'],
    [4, 'Hearken unto me, my people; and give ear unto me, O my nation: for a law shall proceed from me, and I will make my judgment to rest for a light of the people.'],
    [5, 'My righteousness is near; my salvation is gone forth, and mine arms shall judge the people; the isles shall wait upon me, and on mine arm shall they trust.'],
    [6, 'Lift up your eyes to the heavens, and look upon the earth beneath: for the heavens shall vanish away like smoke, and the earth shall wax old like a garment, and they that dwell therein shall die in like manner: but my salvation shall be for ever, and my righteousness shall not be abolished.'],
    [7, 'Hearken unto me, ye that know righteousness, the people in whose heart is my law; fear ye not the reproach of men, neither be ye afraid of their revilings.'],
    [8, 'For the moth shall eat them up like a garment, and the worm shall eat them like wool: but my righteousness shall be for ever, and my salvation from generation to generation.'],
    [9, 'Awake, awake, put on strength, O arm of the LORD; awake, as in the ancient days, in the generations of old. Art thou not it that hath cut Rahab, and wounded the dragon?'],
    [10, 'Art thou not it which hath dried the sea, the waters of the great deep; that hath made the depths of the sea a way for the ransomed to pass over?'],
    [11, 'Therefore the redeemed of the LORD shall return, and come with singing unto Zion; and everlasting joy shall be upon their head: they shall obtain gladness and joy; and sorrow and mourning shall flee away.'],
    [12, 'I, even I, am he that comforteth you: who art thou, that thou shouldest be afraid of a man that shall die, and of the son of man which shall be made as grass;'],
    [13, 'And forgettest the LORD thy maker, that hath stretched forth the heavens, and laid the foundations of the earth; and hast feared continually every day because of the fury of the oppressor, as if he were ready to destroy? and where is the fury of the oppressor?'],
    [14, 'The captive exile hasteneth that he may be loosed, and that he should not die in the pit, nor that his bread should fail.'],
    [15, 'But I am the LORD thy God, that divided the sea, whose waves roared: The LORD of hosts is his name.'],
    [16, 'And I have put my words in thy mouth, and I have covered thee in the shadow of mine hand, that I may plant the heavens, and lay the foundations of the earth, and say unto Zion, Thou art my people.'],
    [17, 'Awake, awake, stand up, O Jerusalem, which hast drunk at the hand of the LORD the cup of his fury; thou hast drunken the dregs of the cup of trembling, and wrung them out.'],
    [18, 'There is none to guide her among all the sons whom she hath brought forth; neither is there any that taketh her by the hand of all the sons that she hath brought up.'],
    [19, 'These two things are come unto thee; who shall be sorry for thee? desolation, and destruction, and the famine, and the sword: by whom shall I comfort thee?'],
    [20, 'Thy sons have fainted, they lie at the head of all the streets, as a wild bull in a net: they are full of the fury of the LORD, the rebuke of thy God.'],
    [21, 'Therefore hear now this, thou afflicted, and drunken, but not with wine:'],
    [22, 'Thus saith thy Lord the LORD, and thy God that pleadeth the cause of his people, Behold, I have taken out of thine hand the cup of trembling, even the dregs of the cup of my fury; thou shalt no more drink it again:'],
    [23, 'But I will put it into the hand of them that afflict thee; which have said to thy soul, Bow down, that we may go over: and thou hast laid thy body as the ground, and as the street, to them that went over.'],
  ] },
  isa50: { title: 'Isaiah 50', verses: [
    [10, 'Who is among you that feareth the LORD, that obeyeth the voice of his servant, that walketh in darkness, and hath no light? let him trust in the name of the LORD, and stay upon his God.'],
    [11, 'Behold, all ye that kindle a fire, that compass yourselves about with sparks: walk in the light of your fire, and in the sparks that ye have kindled. This shall ye have of mine hand; ye shall lie down in sorrow.'],
  ] },
  isa54: { title: 'Isaiah 54', verses: [
    [7, 'For a small moment have I forsaken thee; but with great mercies will I gather thee.'],
    [8, 'In a little wrath I hid my face from thee for a moment; but with everlasting kindness will I have mercy on thee, saith the LORD thy Redeemer.'],
    [9, 'For this is as the waters of Noah unto me: for as I have sworn that the waters of Noah should no more go over the earth; so have I sworn that I would not be wroth with thee, nor rebuke thee.'],
    [10, 'For the mountains shall depart, and the hills be removed; but my kindness shall not depart from thee, neither shall the covenant of my peace be removed, saith the LORD that hath mercy on thee.'],
    [11, 'O thou afflicted, tossed with tempest, and not comforted, behold, I will lay thy stones with fair colours, and lay thy foundations with sapphires.'],
    [12, 'And I will make thy windows of agates, and thy gates of carbuncles, and all thy borders of pleasant stones.'],
    [13, 'And all thy children shall be taught of the LORD; and great shall be the peace of thy children.'],
    [14, 'In righteousness shalt thou be established: thou shalt be far from oppression; for thou shalt not fear: and from terror; for it shall not come near thee.'],
  ] },
};

// Highlight colors (RGB) so the main page can fade them by vote count.
window.CP_COLORS = {
  action:  { rgb: '94, 199, 110', label: 'What we do' },        // green
  promise: { rgb: '120, 194, 240', label: 'What He promises' }, // blue
};

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

/* Fit as many whole verses as the box holds. Returns array of pages (arrays of verses). */
window.paginate = function (passageKey, box, meas, decorate) {
  const P = window.PASSAGES[passageKey];
  meas.style.width = box.clientWidth + 'px';
  const avail = box.clientHeight;
  const gap = parseFloat(getComputedStyle(box).rowGap) || 0;
  const pages = []; let cur = [], h = 0;
  meas.innerHTML = '';
  P.verses.forEach(v => {
    meas.innerHTML = window.verseHTML(passageKey, v, decorate);
    const vh = meas.firstChild.getBoundingClientRect().height;
    const add = cur.length ? vh + gap : vh;
    if (cur.length && h + add > avail) { pages.push(cur); cur = [v]; h = vh; }
    else { cur.push(v); h += add; }
  });
  if (cur.length) pages.push(cur);
  meas.innerHTML = '';
  return pages;
};

window.refLabel = function (passageKey, pg) {
  const P = window.PASSAGES[passageKey];
  const a = pg[0]?.[0], b = pg[pg.length - 1]?.[0];
  return `${P.title}${a ? ':' + a + (b !== a ? '–' + b : '') : ''}`;
};

/* Supabase client (loaded from CDN on each page). */
window.cpClient = function () {
  const c = window.CP_CONFIG;
  return window.supabase.createClient(c.supabaseUrl, c.supabaseKey);
};
