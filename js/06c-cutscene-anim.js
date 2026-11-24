"use strict";
/* Cutscene hoạt hình: thay biểu tượng emoji tĩnh bằng một cảnh canvas chuyển động.
   Mỗi trang tự dựng cảnh từ nội dung: bầu trời (đêm/mưa/bình minh/ban ngày/tuyết), thành phố cuộn khi "đi/xe buýt",
   nhân vật được nhắc tên bước vào cảnh với nét mặt theo cảm xúc câu chữ, đạo cụ (emoji của trang) bồng bềnh,
   máy quay trôi chậm, thanh viền phim, mờ dần vào cảnh, bokeh + lấp lánh. */
const CutsceneAnim = (function () {
  const W = 640, H = 300;
  let canvas = null, ctx = null, raf = 0, scene = null, t0 = 0;
  const reduce = typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;

  const NAME_RX = [
    ["vy", /\bVy\b/], ["minh", /\bMinh\b/], ["linh", /\bLinh\b/], ["tuan", /\bTuấn\b/],
    ["khang", /\bKhang\b/], ["hoa", /\bHoa\b/], ["an", /\bbác An\b|\bBác An\b|\bAn\b/], ["host", /Thỏ Con/]
  ];
  const TRAVEL_RX = /xe buýt|xe điện|đi bộ|bước ra phố|ra phố|dọc con hẻm|bến xe|đường về|ra đường|chạy nốt|chuyến cuối|chuyến xe|đạp xe|chạy xe|đi chậm|bước chân/i;
  const emojiList = (s) => {
    const seg = typeof Intl !== "undefined" && Intl.Segmenter ? [...new Intl.Segmenter("en", { granularity: "grapheme" }).segment(s || "")].map((x) => x.segment) : Array.from(s || "");
    return seg.filter((g) => /\p{Extended_Pictographic}/u.test(g));
  };
  function analyse(page) {
    const txt = `${page.location || ""} ${page.title || ""} ${page.text || ""}`;
    const icons = emojiList(page.icon);
    const low = txt.toLowerCase();
    let sky = "night";
    if (/🌅|🌄/.test(page.icon) || /bình minh|rạng sáng|sáng hôm sau|sáng sớm|05:00|đầu ngày|trời sáng/.test(low)) sky = "dawn";
    else if (/🌤|☀|🌞/.test(page.icon) || /buổi trưa|buổi chiều|hôm nay|ban ngày/.test(low) && !/đêm/.test(low)) sky = "day";
    if (/❄|⛄|tuyết/.test(page.icon + low)) sky = "snow";
    const rain = /🌧|☔|⛈/.test(page.icon) || /mưa/.test(low);
    const travel = /🚌|🚋|🚶|🚲|🚚|🛵|🚗/.test(page.icon) || TRAVEL_RX.test(low);
    const actors = [];
    NAME_RX.forEach(([id, rx]) => { const m = rx.exec(page.text || ""); if (m) actors.push({ id, at: m.index }); });
    actors.sort((a, b) => a.at - b.at);
    if (/\bchú mèo|mèo tam thể|🐱|🐈/.test((page.text || "") + page.icon)) icons.push("🐈");
    const ids = actors.slice(0, 2).map((a) => a.id);
    const emotion = typeof detectEmotion === "function" ? detectEmotion(page.text || "") : "neutral";
    const props = icons.filter((e, i) => icons.indexOf(e) === i && !(travel && /🚶/.test(e))).slice(0, 3);
    return { sky, rain, travel, actors: ids, emotion, props, vehicle: icons.find((e) => /🚌|🚋|🚚|🛵|🚲|🚗/.test(e)) || (/xe buýt/.test(low) ? "🚌" : /xe điện/.test(low) ? "🚋" : "") };
  }
  const rnd = (i) => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };

  function drawSky(c, s, T) {
    const g = c.createLinearGradient(0, 0, 0, H * 0.75);
    const P = { night: ["#080b27", "#1f2560", "#6b4a8a"], dawn: ["#2b2a6b", "#c26a8a", "#ffb877"], day: ["#4f9bd9", "#9ad0f0", "#fde9c4"], snow: ["#1b2748", "#4a5e8c", "#a9b9d8"] }[s.sky];
    g.addColorStop(0, P[0]); g.addColorStop(0.55, P[1]); g.addColorStop(1, P[2]);
    c.fillStyle = g; c.fillRect(0, 0, W, H);
    if (s.sky === "night" || s.sky === "snow" || s.sky === "dawn") {
      for (let i = 0; i < 46; i++) { const a = (s.sky === "dawn" ? 0.35 : 0.8) * (0.4 + 0.6 * Math.abs(Math.sin(T * 1.2 + i))); c.fillStyle = `rgba(255,255,255,${a})`; c.fillRect(rnd(i) * W, rnd(i + 90) * H * 0.5, i % 6 ? 1.2 : 2.2, i % 6 ? 1.2 : 2.2); }
    }
    if (s.sky === "night" || s.sky === "snow") {
      const mx = W * 0.8, my = H * 0.2, mg = c.createRadialGradient(mx, my, 6, mx, my, 70); mg.addColorStop(0, "rgba(255,244,200,.55)"); mg.addColorStop(1, "rgba(255,244,200,0)");
      c.fillStyle = mg; c.fillRect(mx - 80, my - 80, 160, 160); c.fillStyle = "#fff6d6"; c.beginPath(); c.arc(mx, my, 17, 0, 7); c.fill();
    } else if (s.sky === "dawn") {
      const rise = Math.min(1, T / 6), sx = W * 0.6, sy = H * (0.68 - 0.22 * rise), sg = c.createRadialGradient(sx, sy, 8, sx, sy, 150);
      sg.addColorStop(0, "rgba(255,230,160,.75)"); sg.addColorStop(1, "rgba(255,170,110,0)"); c.fillStyle = sg; c.fillRect(0, 0, W, H);
      c.fillStyle = "#fff0b8"; c.beginPath(); c.arc(sx, sy, 24, 0, 7); c.fill();
    } else {
      c.fillStyle = "rgba(255,255,255,.75)"; for (let i = 0; i < 4; i++) { const cx = ((T * 8 * (1 + i * 0.3) + i * 190) % (W + 160)) - 80, cy = 40 + i * 26; c.beginPath(); c.ellipse(cx, cy, 46, 11, 0, 0, 7); c.ellipse(cx + 24, cy - 7, 28, 9, 0, 0, 7); c.fill(); }
    }
  }
  function drawCity(c, s, T) {
    const day = s.sky === "day" || s.sky === "dawn";
    const spd = s.travel ? 38 : 3;
    [[0.5, day ? "#6f6a9a" : "#171233", 150, 62], [1, day ? "#4b4577" : "#0f0b24", 120, 78]].forEach(([k, col, hh, bw], li) => {
      const off = (T * spd * k) % (bw * 6);
      for (let i = -1; i < 12; i++) {
        const bx = i * bw - off, bh = 50 + rnd(i + li * 31 + Math.floor((T * spd * k) / (bw * 6)) * 0) * (hh - 50);
        const idx = ((i + Math.floor((T * spd * k) / (bw * 6)) * 6) % 6 + 6) % 6;
        const h2 = 50 + rnd(idx + li * 31) * (hh - 50);
        c.fillStyle = col; c.fillRect(bx, H * 0.78 - h2, bw - 3, h2);
        if (!day) for (let wy = H * 0.78 - h2 + 7; wy < H * 0.78 - 6; wy += 11) for (let wx = bx + 5; wx < bx + bw - 9; wx += 9) if (rnd(Math.floor(wx - bx) + wy + idx + li) > 0.62) { c.fillStyle = rnd(wx + wy) > 0.5 ? "rgba(253,224,71,.8)" : "rgba(253,186,116,.8)"; c.fillRect(wx, wy, 3.4, 4.4); }
      }
    });
  }
  function drawWeather(c, s, T) {
    if (s.rain) { c.strokeStyle = "rgba(190,225,255,.45)"; c.lineWidth = 1.1; for (let i = 0; i < 70; i++) { const x = (rnd(i) * W + T * 40) % W, y = ((rnd(i + 7) * H + T * 380 * (0.7 + rnd(i + 3) * 0.6)) % H); c.beginPath(); c.moveTo(x, y); c.lineTo(x - 4, y + 13); c.stroke(); } }
    if (s.sky === "snow") { c.fillStyle = "rgba(240,248,255,.9)"; for (let i = 0; i < 60; i++) { const x = (rnd(i) * W + Math.sin(T + i) * 14) % W, y = (rnd(i + 5) * H + T * (22 + rnd(i) * 26)) % H; c.beginPath(); c.arc(x, y, 1.4 + rnd(i + 2) * 1.6, 0, 7); c.fill(); } }
    if (!s.rain && s.sky !== "snow" && s.sky !== "day") { c.fillStyle = "rgba(255,230,150,.55)"; for (let i = 0; i < 16; i++) { const x = (rnd(i) * W + Math.sin(T * 0.7 + i) * 18 + W) % W, y = H * 0.35 + ((rnd(i + 4) * H * 0.5 - T * 9 * (0.4 + rnd(i)) + H) % (H * 0.5)); c.globalAlpha = 0.3 + 0.5 * Math.abs(Math.sin(T * 2 + i)); c.beginPath(); c.arc(x, y, 1.6, 0, 7); c.fill(); } c.globalAlpha = 1; }
  }
  function drawLedge(c, s, T) {
    const y = H * 0.8;
    if (s.travel) {   // lan can đường phố trượt qua
      const g = c.createLinearGradient(0, y, 0, H); g.addColorStop(0, "#2b2438"); g.addColorStop(1, "#14101c"); c.fillStyle = g; c.fillRect(0, y, W, H - y);
      c.fillStyle = "#4a3f5e"; c.fillRect(0, y, W, 4);
      const off = (T * 90) % 70; c.fillStyle = "#3a3150"; for (let x = -off; x < W; x += 70) c.fillRect(x, y + 4, 6, H - y);
      c.fillStyle = "rgba(255,214,140,.55)"; for (let x = -((T * 90) % 210); x < W; x += 210) { c.fillRect(x, y - 78, 3, 78); c.beginPath(); c.arc(x + 1.5, y - 80, 6, 0, 7); c.fill(); const gl = c.createRadialGradient(x + 1.5, y - 80, 0, x + 1.5, y - 80, 40); gl.addColorStop(0, "rgba(255,214,140,.35)"); gl.addColorStop(1, "rgba(255,214,140,0)"); c.fillStyle = gl; c.fillRect(x - 40, y - 120, 82, 82); c.fillStyle = "rgba(255,214,140,.55)"; }
    } else {          // mặt quầy gỗ ấm
      const g = c.createLinearGradient(0, y, 0, H); g.addColorStop(0, "#9a5a2c"); g.addColorStop(0.1, "#6d3b1d"); g.addColorStop(1, "#2a160c"); c.fillStyle = g; c.fillRect(0, y, W, H - y);
      c.fillStyle = "rgba(255,235,200,.28)"; c.fillRect(0, y, W, 2);
      const rg = c.createRadialGradient(W / 2, y + 3, 4, W / 2, y + 3, W * 0.38); rg.addColorStop(0, "rgba(253,224,71,.32)"); rg.addColorStop(1, "rgba(253,224,71,0)"); c.save(); c.translate(0, y + 3); c.scale(1, 0.13); c.translate(0, -(y + 3)); c.fillStyle = rg; c.fillRect(0, y - 60, W, 130); c.restore();
    }
  }
  function drawActor(c, s, id, slot, n, T, tt) {
    const baseX = n === 1 ? W * 0.5 : slot === 0 ? W * 0.32 : W * 0.68;
    const enter = Math.min(1, Math.max(0, (tt - 0.15 - slot * 0.35) / 0.8)), e = 1 - Math.pow(1 - enter, 3);
    const x = baseX + (slot === 0 ? -1 : 1) * 70 * (1 - e) * (n === 1 ? 0 : 1), by = H * 0.82 + (n === 1 ? 0 : 0) + (1 - e) * (n === 1 ? 24 : 0);
    const walk = s.travel ? Math.abs(Math.sin(T * 6 + slot)) * 3.5 : 0;
    c.globalAlpha = e;
    const talking = slot === 0 && tt < 6.5 && tt > 0.7;
    if (id === "host") stageRenderer.drawBunnyBarista(c, x, by - walk, 2.35, false, talking, T, s.emotion, slot !== 0);
    else { const g = CHARACTERS[id]; stageRenderer.drawPersonPortrait(c, x, by - walk, 2.35, { hairColor: g.hairColor, outfitColor: g.outfitColor, accessory: g.accessory, isTalking: talking, emotion: slot === 0 ? s.emotion : "neutral", listening: slot !== 0, timeSec: T, seed: slot + 1.5 }); }
    c.globalAlpha = 1;
  }
  function drawProps(c, s, T, tt) {
    const n = s.props.length; if (!n) return;
    c.textAlign = "center"; c.textBaseline = "middle";
    s.props.forEach((em, i) => {
      const x = n === 1 ? (s.actors.length ? W * 0.5 : W * 0.5) : W * (0.5 + (i - (n - 1) / 2) * 0.2);
      const y = (s.actors.length ? H * 0.2 : H * 0.42) + Math.sin(T * 1.6 + i * 1.7) * 7;
      const pop = Math.min(1, Math.max(0, (tt - 0.5 - i * 0.18) / 0.5)), sc = 0.4 + 0.6 * (1 - Math.pow(1 - pop, 3));
      const size = (s.actors.length ? 42 : 76) * sc;
      const gl = c.createRadialGradient(x, y, 4, x, y, size * 1.1); gl.addColorStop(0, "rgba(255,230,160,.35)"); gl.addColorStop(1, "rgba(255,230,160,0)");
      c.globalAlpha = pop; c.fillStyle = gl; c.fillRect(x - size * 1.2, y - size * 1.2, size * 2.4, size * 2.4);
      c.font = `${size}px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif`; c.fillStyle = "#fff"; c.fillText(em, x, y); c.globalAlpha = 1;
    });
    c.textAlign = "start"; c.textBaseline = "alphabetic";
  }
  function drawVehicle(c, s, T) {
    if (!s.vehicle || !s.travel) return;
    const x = ((T * 55) % (W + 260)) - 130, y = H * 0.66;
    c.font = "64px \"Apple Color Emoji\",\"Segoe UI Emoji\",\"Noto Color Emoji\",sans-serif"; c.textAlign = "center"; c.fillText(s.vehicle, x, y + Math.sin(T * 14) * 1.2); c.textAlign = "start";
  }
  function frame(now) {
    if (!ctx || !scene) return;
    const T = (now - t0) / 1000, tt = T - scene.start;
    ctx.save(); ctx.clearRect(0, 0, W, H);
    // máy quay trôi chậm (zoom + lia nhẹ)
    const z = 1.02 + 0.035 * Math.min(1, tt / 9);
    ctx.translate(W / 2, H / 2); ctx.scale(z, z); ctx.translate(-W / 2 + Math.sin(tt * 0.25) * 6, -H / 2);
    drawSky(ctx, scene.s, tt); drawCity(ctx, scene.s, tt); drawWeather(ctx, scene.s, tt);
    drawVehicle(ctx, scene.s, tt);
    scene.s.actors.forEach((id, i) => drawActor(ctx, scene.s, id, i, scene.s.actors.length, T, tt));
    drawLedge(ctx, scene.s, tt);
    drawProps(ctx, scene.s, T, tt);
    ctx.restore();
    // bokeh + bloom + tối góc + thanh viền phim + mờ dần vào cảnh
    ctx.save(); ctx.globalCompositeOperation = "lighter";
    for (let i = 0; i < 7; i++) { const bx = ((i * 0.15 + 0.06 + Math.sin(T * 0.1 + i) * 0.02) % 1) * W, by = H * (0.15 + ((i * 0.31) % 0.5)) + Math.sin(T * 0.4 + i) * 5, br = 12 + (i % 3) * 9; const g = ctx.createRadialGradient(bx, by, 0, bx, by, br); const cc = ["255,200,120", "255,170,190", "170,220,255"][i % 3]; g.addColorStop(0, `rgba(${cc},.12)`); g.addColorStop(1, `rgba(${cc},0)`); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(bx, by, br, 0, 7); ctx.fill(); }
    ctx.restore();
    const vg = ctx.createRadialGradient(W / 2, H / 2, H * 0.4, W / 2, H / 2, W * 0.7); vg.addColorStop(0, "rgba(6,3,12,0)"); vg.addColorStop(1, "rgba(6,3,12,.55)"); ctx.fillStyle = vg; ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = "#050308"; ctx.fillRect(0, 0, W, 16); ctx.fillRect(0, H - 16, W, 16);
    const fade = 1 - Math.min(1, tt / 0.7); if (fade > 0) { ctx.fillStyle = `rgba(5,3,8,${fade})`; ctx.fillRect(0, 0, W, H); }
    if (!reduce) raf = requestAnimationFrame(frame);
  }
  function setupCanvas() {
    canvas = document.getElementById("cs-canvas"); if (!canvas || !canvas.getContext) return false;
    try { ctx = canvas.getContext("2d"); } catch (e) { ctx = null; }
    if (!ctx) return false;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    canvas.width = W * dpr; canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return true;
  }
  function show(page) {
    try {
      if (!canvas || !ctx) if (!setupCanvas()) return;
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = W * dpr; canvas.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cancelAnimationFrame(raf);
      t0 = performance.now() - (scene ? (performance.now() - t0) : 0);
      const now = performance.now();
      scene = { s: analyse(page), start: (now - t0) / 1000 };
      canvas.classList.remove("hidden");
      const ic = document.getElementById("cs-player-icon"); if (ic) ic.classList.add("hidden");
      if (reduce) { frame(now + 3000); } else raf = requestAnimationFrame(frame);
    } catch (e) { /* hoạt cảnh lỗi thì thôi, vẫn còn chữ */ }
  }
  function stop() { cancelAnimationFrame(raf); raf = 0; scene = null; }
  /* chữ hiện dần từng từ cho có nhịp kể */
  function revealText(el, text) {
    const parts = String(text).split(/(\s+)/); let wi = 0; const per = Math.min(0.09, 4.2 / Math.max(1, parts.length / 2));
    el.textContent = "";
    parts.forEach((p) => {
      if (/^\s+$/.test(p) || !p) { el.appendChild(document.createTextNode(p)); return; }
      const sp = document.createElement("span"); sp.className = "cs-w"; sp.style.animationDelay = `${(0.5 + wi * per).toFixed(2)}s`; sp.textContent = p; el.appendChild(sp); wi++;
    });
  }
  return { show, stop, revealText, analyse };
})();
