/* Liệt kê các câu thoại ngoài kịch bản đêm: lá bài DRINK (mọi tổ hợp đêm × lá bài × kiểu trả lời) và cắt cảnh.
   Chạy game trong jsdom, bắt mọi lần gọi CafeVoice. Cần: NODE_PATH trỏ tới thư mục có jsdom.
   Dùng: node tools/voice_lines_runtime.js out.json */
const { JSDOM, VirtualConsole } = require('jsdom'); const fs = require('fs'), path = require('path');
const root = path.join(__dirname, '..');
let html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
html = html.replace(/<script[^>]*src="([^"]+)"[^>]*><\/script>/g, (m, s) => (/^(js\/|assets\/voice\/)/.test(s) ? '<script>' + fs.readFileSync(path.join(root, s), 'utf8').replace(/<\/script>/g, '<\\/script>') + '</script>' : ''));
const vc = new VirtualConsole(); const errs = []; vc.on('jsdomError', (e) => errs.push(e.message.slice(0, 120)));
const dom = new JSDOM(html, { runScripts: 'dangerously', url: 'http://localhost/', pretendToBeVisual: true, virtualConsole: vc, beforeParse(w) {
  w.HTMLCanvasElement.prototype.getContext = () => new Proxy({}, { get: (t, k) => (k === 'measureText' ? () => ({ width: 10 }) : k === 'createLinearGradient' || k === 'createRadialGradient' ? () => ({ addColorStop() {} }) : () => {}), set: () => true });
  w.AudioContext = function () { return new Proxy({}, { get: (t, k) => (k === 'destination' ? {} : () => new Proxy(function () {}, { get: () => () => {}, set: () => true, apply: () => ({}) })), set: () => true }); };
  w.Audio = function () { this.play = () => Promise.resolve(); this.pause = () => {}; this.addEventListener = () => {}; };
} });
const w = dom.window; const found = new Map(); let CV;
setTimeout(() => {
  CV = w.eval('CafeVoice');
  w.eval(`window.__cap=[];(()=>{const o1=CafeVoice.speakMany,o2=CafeVoice.speak;CafeVoice.speakMany=(i,...r)=>{(i||[]).forEach(x=>window.__cap.push(x));return o1(i,...r)};CafeVoice.speak=(t,s,...r)=>{window.__cap.push({text:t,speaker:s});return o2(t,s,...r)};})()`);
  const flush = () => w.eval('window.__cap.splice(0)').forEach((i) => {
    const c = CV.cleanText(i.text); if (!c) return;
    const pid = CV.profileFor(i.speaker).id; const key = CV.voiceKey(pid, c);
    if (!found.has(key)) found.set(key, { voice: pid, text: c, raw: String(i.text), key });
  });
  w.eval('persistentArchive.voiceEnabled=true; runState=createNewRunState();');
  // 1) lá bài DRINK
  const nights = w.eval('STORY_NIGHTS.length'); const cards = w.eval('DRINK_CARDS.filter(c=>!c.hidden).map(c=>c.id)');
  for (let n = 0; n < nights; n++) for (const cid of cards) for (const mode of ['host_answers', 'guest_answers']) {
    try {
      w.eval(`runState.nightIndex=${n}; runState.drawnCardData={cardId:${JSON.stringify(cid)},mode:${JSON.stringify(mode)},resolved:false,outcomeText:""}; renderDrinkCardBeat(getCurrentNightGuests());`); flush();
      w.eval(`(()=>{const gs=getCurrentNightGuests();const names=gs.map(g=>g.name.split(" (")[0]).join(" & ");runState.drawnCardData.resolved=true;runState.drawnCardData.outcomeText=${JSON.stringify(mode)}==="host_answers"?(GUEST_DRINK_CARD_REACTIONS[gs[0].id]||"Vị khách mỉm cười đầy trân trọng trước sự chân thành của Thỏ Con."):names+" khẽ mỉm cười gật đầu — sợi dây thấu hiểu bên quầy gỗ càng thêm sâu sắc.";renderDrinkCardBeat(gs);})()`); flush();
    } catch (e) { errs.push('card ' + e.message.slice(0, 80)); }
  }
  // 2) cắt cảnh
  w.eval('CUTSCENE_CATALOG').forEach(() => {});
  const cs = JSON.parse(w.eval('JSON.stringify(CUTSCENE_CATALOG.map(c=>({pages:(c.pages||[]).map(p=>p.text),caption:c.caption||""})))'));
  cs.forEach((c) => { (c.pages.length ? c.pages : [c.caption]).forEach((t) => w.eval(`CafeVoice.speak(${JSON.stringify(t)},"")`)); }); flush();
  const arr = [...found.values()]; fs.writeFileSync(process.argv[2] || 'voice_lines_runtime.json', JSON.stringify(arr));
  const by = {}; arr.forEach((a) => { by[a.voice] = (by[a.voice] || 0) + 1; });
  console.log(arr.length, 'dòng', arr.reduce((s, a) => s + a.text.length, 0), 'ký tự', by, 'lỗi:', errs.slice(0, 3)); process.exit(0);
}, 800);
