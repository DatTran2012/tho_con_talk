/* Liệt kê MỌI câu thoại được đọc thành tiếng trong 28 đêm (mọi nhánh) → voice_lines.json */
const fs = require('fs'), vm = require('vm'), path = require('path');
const root = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const order = [...html.matchAll(/src="js\/data\/([^"/]+\.js)"/g)].map((m) => m[1]);
const src = order.map((f) => fs.readFileSync(path.join(root, 'js/data', f), 'utf8').replace(/^\s*"use strict";?/m, '')).join('\n;\n') + ';this.__o={STORY_NIGHTS,CHARACTERS};';
const ctx = {}; vm.createContext(ctx); vm.runInContext(src, ctx);
const { STORY_NIGHTS, CHARACTERS } = ctx.__o;
const profileOf = (id) => (id === 'host' ? 'thocon' : id);
const variants = (t) => (typeof t === 'string' ? [t] : Object.values(t || {}).filter(Boolean));
const out = new Map();
const add = (voice, text) => {
  const spoken = String(text).replace(/\(([^)]*)\)/g, ' ').replace(/\s{2,}/g, ' ').trim();
  if (!spoken) return;
  out.set(voice + '|' + spoken, { voice, text: spoken });
};
STORY_NIGHTS.forEach((n) => n.steps.forEach((s) => {
  const k = s[0];
  if (k === '@' || k === '+' || k === '-' || k === 'card' || k === 'sys') return;
  if (k === '?') { [s[2], s[3], s[4]].forEach((o) => variants(o[2]).forEach((t) => add(profileOf(o[1]), t))); return; }
  if (k === 'brew') { variants(s[2]).forEach((t) => add(profileOf(s[1]), t)); return; }
  variants(s[1]).forEach((t) => add(profileOf(k), t));
}));
const cyrb53 = (str, seed = 0) => { let h1 = 0xdeadbeef ^ seed, h2 = 0x41c6ce57 ^ seed; for (let i = 0, ch; i < str.length; i++) { ch = str.charCodeAt(i); h1 = Math.imul(h1 ^ ch, 2654435761); h2 = Math.imul(h2 ^ ch, 1597334677); } h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507); h1 ^= Math.imul(h2 ^ (h2 >>> 13), 3266489909); h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507); h2 ^= Math.imul(h1 ^ (h1 >>> 13), 3266489909); return (h2 >>> 0).toString(16).padStart(8, '0') + (h1 >>> 0).toString(16).padStart(8, '0'); };
// PHẢI giống hệt CafeVoice.cleanText trong js/04b-voice.js
const cleanText = (text) => String(text || '').replace(/<[^>]*>/g, ' ').replace(/[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}\u{FE0F}\u{200D}]/gu, '').replace(/[“”"«»]/g, '').replace(/\s*[—–]\s*/g, ', ').replace(/\.{2,}|…/g, '. ').replace(/\s+/g, ' ').trim();
const arr = [...out.values()].map((a) => { const clean = cleanText(a.text); return { voice: a.voice, text: clean, raw: a.text, key: cyrb53(a.voice + '|' + clean) }; }).filter((a) => a.text);
const seen = new Set(); const uniq = arr.filter((a) => (seen.has(a.key) ? false : seen.add(a.key)));
arr.length = 0; arr.push(...uniq);
fs.writeFileSync(process.argv[2] || 'voice_lines.json', JSON.stringify(arr, null, 0));
const by = {}; arr.forEach((a) => { by[a.voice] = (by[a.voice] || 0) + 1; });
console.log(arr.length, 'dòng,', arr.reduce((s, a) => s + a.text.length, 0), 'ký tự', by);
