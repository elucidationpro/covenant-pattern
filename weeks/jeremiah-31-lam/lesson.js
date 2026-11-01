// Lyrics are loaded from Supabase at runtime. Never paste them in this file.
window.LESSON = {
  slug: 'jeremiah-31-lam',
  type: 'discussion',
  // Title art: Gabriel Heaton, Peace Be Still (ldsart.com). Licensed; published like last week's art so the hosted presenter works.
  titleImage: 'img/heaton-peace-be-still.jpg',
  titleLayout: 'split',
  titleTheme: 'dark-text',
  fontSet: 'modern',
  fontsHref: 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&family=Raleway:wght@400;500;600&display=swap',
  // Palette pulled from Peace Be Still: warm dusk browns, cream, peach light.
  theme: {
    '--ink': '#241a17', '--panel': '#33251f', '--line': '#4b3830',
    '--text': '#fbecda', '--muted': '#c8b49d', '--on-hi': '#241a17',
    '--title-ground': 'linear-gradient(180deg,#f8dcbc 0%,#efd3b4 40%,#c9b39d 72%,#8a7868 100%)',
    '--title-text': '#382525', '--title-muted': '#6f5950',
    '--serif': "Raleway, Figtree, sans-serif", '--ui': "Montserrat, Figtree, system-ui, sans-serif",
  },
  title: 'I Will Turn Their Mourning into Joy',
  subtitle: 'Jeremiah 31–33; 36–38; Lamentations 1, 3',
  passages: {
    song: { title: 'Thief in the Night', source: { table: 'lesson_content', key: 'song' } },
  },
  colors: [{ key: 'mark', rgb: '240, 185, 138', label: 'Stands out to me' }],
  items: [
    { kind: 'title' },
    { kind: 'scripture', id: 'jer-31-12-13', title: 'Jeremiah 31:12–13', emphasis: ['for I will turn their mourning into joy'], verses: [
      [12, 'Therefore they shall come and sing in the height of Zion, and shall flow together to the goodness of the LORD, for wheat, and for wine, and for oil, and for the young of the flock and of the herd: and their soul shall be as a watered garden; and they shall not sorrow any more at all.'],
      [13, 'Then shall the virgin rejoice in the dance, both young men and old together: for I will turn their mourning into joy, and will comfort them, and make them rejoice from their sorrow.'],
    ] },
    { kind: 'scripture', id: 'jer-31-15-17', title: 'Jeremiah 31:15–17', verses: [
      [15, 'Thus saith the LORD; A voice was heard in Ramah, lamentation, and bitter weeping; Rahel weeping for her children refused to be comforted for her children, because they were not.'],
      [16, 'Thus saith the LORD; Refrain thy voice from weeping, and thine eyes from tears: for thy work shall be rewarded, saith the LORD; and they shall come again from the land of the enemy.'],
      [17, 'And there is hope in thine end, saith the LORD, that thy children shall come again to their own border.'],
    ] },
    { kind: 'question', id: 'mourning-joy', text: 'How has God turned your mourning into joy, or your weeping into comfort, or your work into a reward?' },
    // Transition. Image TBD (Jeremy picking one): add image + imageSide when ready.
    { kind: 'question', id: 'transition', text: 'God takes our pains and changes what they mean.', bullets: [
      'He doesn\'t just erase our sorrows, disappointments, and pains like they never happened.',
      'Not "He fixes all my problems for me."',
      'He takes them without erasing them, and changes what they mean.',
    ] },
    { kind: 'scripture', id: 'dc-106-4-5', title: 'Doctrine and Covenants 106:4–5', verses: [
      [4, 'For behold, the coming of the Lord draweth nigh, and it overtaketh the world as a thief in the night—'],
      [5, 'Therefore, gird up your loins, that you may be the children of light, and that day shall not overtake you as a thief.'],
    ] },
    { kind: 'instructions', id: 'song-instructions', heading: 'Highlight what stands out to you', body: 'Follow along while the song plays.', qr: true },
    // Song plays from Jeremy's phone + speaker. Re-add to play on the TV instead:
    // { kind: 'video', id: 'song-audio', title: 'Thief in the Night', youtubeId: 'Bxq3ucw9oNs', start: 0 },
    { kind: 'board', id: 'board', label: 'Live highlights' },
    // I Will Surely Deliver Thee (Jeremiah 39:18), churchofjesuschrist.org media.
    { kind: 'question', id: 'felt', image: 'img/i-will-surely-deliver-thee.jpg', imageSide: 'right', text: 'What stood out to you? What did you feel?' },
    { kind: 'scripture', id: 'thess-5-2', title: '1 Thessalonians 5:2', body: 'For yourselves know perfectly that the day of the Lord so cometh as a thief in the night.', bullets: [
      'Song story: walk, pondering the lesson, music.',
      'Music used intentionally amplifies what we feel. This song nailed it.',
      'We wish He\'d just fix problems, undo mistakes.',
      'Thief in the night: takes what we expected, gives purpose.',
      'Sometimes we never understand why. Not always our fault.',
      'Hindsight sometimes (the job I didn\'t get). Sometimes not.',
      '→ How do you move forward without an answer?',
    ] },
    { kind: 'question', id: 'no-answer', text: 'How do you move forward when you don\'t get an answer?' },
    { kind: 'scripture', id: 'lam-3', title: 'Lamentations 3:20–21', verses: [
      [20, 'My soul hath them still in remembrance, and is humbled in me.'],
      [21, 'This I recall to my mind, therefore have I hope.'],
    ], bullets: [
      'Jer 31 promise came first, during the siege (~587 BC, see ch. 32).',
      'Lamentations: Jeremiah\'s songs of grief, written after Jerusalem fell.',
      'Joy promised, then it all fell apart anyway.',
      'They\'d have preferred Jerusalem and the temple not be destroyed.',
    ] },
    // Optional, if time.
    { kind: 'question', id: 'invite-lam-3', image: 'img/heaton-peace-be-still.jpg', imageSide: 'right', text: 'Read Lamentations 3, especially verses 20–33.' },
  ],
};
