const { test } = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
const { webcrypto } = require('node:crypto');
async function load(result, filename = 'weeks/jeremiah-31-lam/lesson.js') {
  let script;
  const queries = [];
  const context = vm.createContext({ console, URLSearchParams, TextEncoder, Uint8Array,
    crypto: webcrypto, location: { search: '?lesson=' + filename.split('/')[1] },
    CP_CONFIG: {}, Option: function () {},
    document: { createElement: () => ({}), head: { appendChild: el => { if (el.src) script = el; } },
      getElementById: () => null, querySelector: () => null },
  });
  context.window = context;
  vm.runInContext(fs.readFileSync('shared.js', 'utf8'), context);
  context.cpClient = () => ({ from(table) {
    queries.push(['table', table]);
    return { select() { return this; }, eq(k, v) { queries.push([k,v]); return this; },
      async maybeSingle() { if (result instanceof Error) throw result; return result; } };
  } });
  vm.runInContext(fs.readFileSync(filename, 'utf8'), context);
  await script.onload(); await context.cpReady;
  return { c: context, queries };
}
test('runtime lines preserve breaks, labels, escaping and repeat IDs', async () => {
  const { c, queries } = await load({data:{title:'Test',body:'[Verse]\r\nExample line\r\n\r\nRepeat\r\nRepeat\r\n<img> & text'}});
  assert.deepEqual(queries, [['table','lesson_content'],['lesson','jeremiah-31-lam'],['key','song']]);
  const verses = c.PASSAGES.song.verses;
  const html = verses.map(v=>c.verseHTML('song',v,()=>({cls:'mark'}))).join('');
  assert.equal((html.match(/data-id=/g)||[]).length,7); // word-level highlighting
  assert.match(html,/song:4:0/); assert.match(html,/song:5:0/);
  assert.match(html,/lyric-break/); assert.match(html,/lyric-label/);
  assert.match(html,/&lt;img&gt;/); assert.match(html,/&amp;/); assert.doesNotMatch(html,/<img>/);
  assert.equal(c.refLabel('song',[verses]),'Test');
});
test('missing and cleared content use a non-highlightable placeholder', async () => {
  for (const data of [null,{body:''},{body:' \n '}]) {
    const {c}=await load({data});
    const html=c.verseHTML('song',c.PASSAGES.song.verses[0]);
    assert.match(html,/Lyrics not loaded yet/); assert.doesNotMatch(html,/data-id/);
  }
});
test('fetch failure leaves the lesson usable and gives a retry message', async () => {
  const {c}=await load(new Error('offline'));
  assert.match(c.verseHTML('song',c.PASSAGES.song.verses[0]),/Refresh to try again/);
  assert.ok(c.CP_SEQUENCE.some(s => s.kind === 'board'));
});
test('inline scripture stays word-highlightable without a content request', async () => {
  const {c,queries}=await load({},'weeks/jeremiah-1-20/lesson.js');
  assert.equal(queries.length,0);
  const html=c.verseHTML('jer1',c.PASSAGES.jer1.verses[0]);
  assert.match(html,/class="vn">1/); assert.match(html,/jer1:1:1/);
});

test('song plays from Jeremy\'s phone, so no TV video slide', async () => {
  const {c}=await load({data:null});
  assert.equal(c.cpVideoFor('r-song-audio'), undefined);
});
