// Each discussion item is one slide, in presentation order.
window.LESSON = {
  slug: 'jeremiah-1-20',
  type: 'discussion',
  titleImagePosition: 'center 8%',
  titleTheme: 'dark-text',
  titleImage: 'img/jeremiah-vernet.jpg',
  title: 'Before I Formed Thee in the Belly I Knew Thee',
  subtitle: 'Jeremiah 1:1–10',
  includeBoard: true,
  passages: {
    jer1: { title: 'Jeremiah 1', label: 'Jeremiah 1:1–10', verses: [
      [1, 'The words of Jeremiah the son of Hilkiah, of the priests that were in Anathoth in the land of Benjamin:'],
      [2, 'To whom the word of the LORD came in the days of Josiah the son of Amon king of Judah, in the thirteenth year of his reign.'],
      [3, 'It came also in the days of Jehoiakim the son of Josiah king of Judah, unto the end of the eleventh year of Zedekiah the son of Josiah king of Judah, unto the carrying away of Jerusalem captive in the fifth month.'],
      [4, 'Then the word of the LORD came unto me, saying,'],
      [5, 'Before I formed thee in the belly I knew thee; and before thou camest forth out of the womb I sanctified thee, and I ordained thee a prophet unto the nations.'],
      [6, 'Then said I, Ah, Lord GOD! behold, I cannot speak: for I am a child.'],
      [7, 'But the LORD said unto me, Say not, I am a child: for thou shalt go to all that I shall send thee, and whatsoever I command thee thou shalt speak.'],
      [8, 'Be not afraid of their faces: for I am with thee to deliver thee, saith the LORD.'],
      [9, 'Then the LORD put forth his hand, and touched my mouth. And the LORD said unto me, Behold, I have put my words in thy mouth.'],
      [10, 'See, I have this day set thee over the nations and over the kingdoms, to root out, and to pull down, and to destroy, and to throw down, to build, and to plant.'],
    ] },
  },
  colors: [
    { key: 'mark', rgb: '242, 196, 92', label: 'Stands out to me' },
  ],
  items: [
    { kind: 'title' },
    {
      kind: 'question', id: 'reflect', image: 'img/local/carden.jpg', imageSide: 'right',
      text: 'How have you seen the hand of the Lord in your life this week as you studied Come, Follow Me?',
    },
    { kind: 'text', id: 'name', image: 'img/local/wilson.jpg', imageSide: 'right', imagePosition: 'center 25%', title: 'The name Jeremiah', body: 'In Hebrew, Yirmeyahu. It means “the Lord exalts” or “the Lord lifts up.”\n\nExalt: to raise someone up, to lift them to a higher place.' },
    { kind: 'text', id: 'setting', title: 'His setting', body: 'A priest’s son from Anathoth (1:1). Called in the 13th year of King Josiah and prophesied until Jerusalem was carried captive (1:2–3), about 627–586 BC.' },
    {
      kind: 'instructions', id: 'read-instructions', eyebrow: 'Highlighting activity', heading: 'Jeremiah 1:1–10', body: 'Highlight the words and phrases that stand out to you.', qr: true,
    },
    { kind: 'board', id: 'board', label: 'Live highlights' },
    { kind: 'passage', id: 'p-known', ref: 'Jeremiah 1:4–5', passage: 'jer1', from: 4, to: 5, emphasis: ['Before I formed thee in the belly I knew thee'] },
    {
      kind: 'question', id: 'known', image: 'img/local/heaton.jpg', imageSide: 'right', text: 'How have you seen this truth impact the life of someone?',
    },
    { kind: 'passage', id: 'p-fears', ref: 'Jeremiah 1:6–8', passage: 'jer1', from: 6, to: 8, emphasis: [] },
    {
      kind: 'question', id: 'fears', image: 'img/local/payne.jpg', imageSide: 'left', text: 'When God has asked difficult things of you, what has helped you set aside your fears?',
    },
    { kind: 'passage', id: 'p-mission', ref: 'Jeremiah 1:9–10', passage: 'jer1', from: 9, to: 10, emphasis: [] },
    {
      kind: 'question', id: 'mission', image: 'img/local/carlton.jpg', imageSide: 'right', text: 'What is your mission in life? How have you followed it?',
    },
  ],
};
