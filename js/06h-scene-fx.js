"use strict";
/* SceneFX: bộ cắt cảnh ngắn dùng chung (canvas): mở quán, đóng quán, chuyển chương, cánh cửa bí mật, kết quả tuần,
   nhận băng cassette, chậu cây nở hoa, mèo làm quen, tổng kết 28 đêm + biểu ngữ thành tựu (DOM).
   Cảnh xếp hàng đợi nếu đang chiếu cảnh khác. Chạm để bỏ qua. Lỗi/giảm chuyển động thì bỏ qua êm (play trả false). */
const SceneFX = (function () {
  const W = 640, H = 400, EMOJI = '"Segoe UI Emoji","Apple Color Emoji","Noto Color Emoji",sans-serif';
  let overlay = null, canvas = null, ctx = null, raf = 0, cur = null, guard = 0;
  const queue = [];
  const reduce = typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;
  const clamp = (x) => Math.min(1, Math.max(0, x));
  const ease = (x) => 1 - Math.pow(1 - clamp(x), 3);
  const seg = (t, a, b) => clamp((t - a) / (b - a));
  const rnd = (i) => { const x = Math.sin(i * 91.7 + 13.3) * 43758.5453; return x - Math.floor(x); };

  function build() {
    overlay = document.createElement("div");
    overlay.id = "scene-fx-overlay";
    overlay.style.cssText = "position:fixed;inset:0;z-index:71;display:none;align-items:center;justify-content:center;background:radial-gradient(circle at 50% 45%,rgba(40,22,10,.96),rgba(6,3,2,.98));transition:opacity .45s;cursor:pointer";
    canvas = document.createElement("canvas");
    canvas.style.cssText = "width:min(100%,760px);aspect-ratio:640/400;border-radius:20px";
    overlay.appendChild(canvas);
    const hint = document.createElement("div");
    hint.textContent = "Chạm để bỏ qua";
    hint.style.cssText = "position:absolute;bottom:18px;left:0;right:0;text-align:center;font:11px 'JetBrains Mono',monospace;color:rgba(253,230,138,.6)";
    overlay.appendChild(hint);
    overlay.addEventListener("click", finish);
    document.body.appendChild(overlay);
    try { ctx = canvas.getContext("2d"); } catch (e) { ctx = null; }
  }
  /* ---------- tiện ích vẽ ---------- */
  function emoji(ch, x, y, size, a) { ctx.globalAlpha = a == null ? 1 : a; ctx.font = `${size}px ${EMOJI}`; ctx.textAlign = "center"; ctx.fillStyle = "#000"; ctx.fillText(ch, x, y); ctx.globalAlpha = 1; }
  function text(s, x, y, size, color, a, weight, family) { ctx.globalAlpha = a == null ? 1 : a; ctx.textAlign = "center"; ctx.fillStyle = color; ctx.font = `${weight || "bold"} ${size}px ${family || "'Inter',sans-serif"}`; ctx.fillText(s, x, y); ctx.globalAlpha = 1; }
  function serif(s, x, y, size, color, a) { text(s, x, y, size, color, a, "bold", "'Lora',Georgia,serif"); }
  function wrap(txt, maxW, font) {
    ctx.font = font; const words = String(txt).split(/\s+/), lines = []; let cur2 = "";
    words.forEach((w) => { const t = cur2 ? cur2 + " " + w : w; if (ctx.measureText(t).width > maxW && cur2) { lines.push(cur2); cur2 = w; } else cur2 = t; });
    if (cur2) lines.push(cur2); return lines;
  }
  function warmBg() {
    const bg = ctx.createLinearGradient(0, 0, 0, H); bg.addColorStop(0, "#3a2214"); bg.addColorStop(0.7, "#5a3419"); bg.addColorStop(1, "#2a160c");
    ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
    const gl = ctx.createRadialGradient(W / 2, 40, 10, W / 2, 40, 330); gl.addColorStop(0, "rgba(255,200,120,.3)"); gl.addColorStop(1, "rgba(255,200,120,0)"); ctx.fillStyle = gl; ctx.fillRect(0, 0, W, H);
  }
  function counter(cy) {
    const wg = ctx.createLinearGradient(0, cy, 0, H); wg.addColorStop(0, "#9a5a2a"); wg.addColorStop(1, "#2a160c");
    ctx.fillStyle = wg; ctx.fillRect(0, cy, W, H - cy); ctx.fillStyle = "rgba(255,235,200,.28)"; ctx.fillRect(0, cy, W, 2);
  }
  function stars(T, n, dim) { for (let i = 0; i < n; i++) { const tw = 0.4 + 0.6 * Math.abs(Math.sin(T * 1.5 + i)); ctx.fillStyle = `rgba(255,250,225,${tw * dim})`; ctx.fillRect(rnd(i) * W, rnd(i + 5) * H * 0.55, 1.6, 1.6); } }
  function lantern(x, y, glow, T) {
    ctx.strokeStyle = "#7a4a22"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x, y - 40); ctx.lineTo(x, y - 18); ctx.stroke();
    if (glow > 0) { const g = ctx.createRadialGradient(x, y, 4, x, y, 90 * glow); g.addColorStop(0, `rgba(255,190,90,${0.55 * glow})`); g.addColorStop(1, "rgba(255,190,90,0)"); ctx.fillStyle = g; ctx.fillRect(x - 100, y - 100, 200, 200); }
    ctx.fillStyle = glow > 0.1 ? `rgb(${200 + 40 * glow},${90 + 80 * glow},40)` : "#5a2c1a"; ctx.beginPath(); ctx.ellipse(x, y, 16, 20, 0, 0, 7); ctx.fill();
    ctx.fillStyle = "#3a1c0e"; ctx.fillRect(x - 8, y - 22, 16, 5); ctx.fillRect(x - 8, y + 17, 16, 5);
  }
  function shopFront(T, o) { // cửa quán nhìn từ ngoài; o.flip: 0 = CLOSED, 1 = OPEN
    // vòm trời
    const sky = ctx.createLinearGradient(0, 0, 0, H * 0.72); sky.addColorStop(0, o.skyTop); sky.addColorStop(1, o.skyBot); ctx.fillStyle = sky; ctx.fillRect(0, 0, W, H);
    stars(T, 50, o.stars);
    if (o.moon) { ctx.fillStyle = "#fdf3c8"; ctx.beginPath(); ctx.arc(W * 0.82, 70, 22, 0, 7); ctx.fill(); ctx.fillStyle = o.skyTop; ctx.beginPath(); ctx.arc(W * 0.82 + 9, 66, 20, 0, 7); ctx.fill(); }
    // đường phố
    ctx.fillStyle = "#1d130c"; ctx.fillRect(0, H * 0.78, W, H * 0.22); ctx.fillStyle = "rgba(255,200,120,.08)"; ctx.fillRect(0, H * 0.78, W, 2);
    // thân quán
    const bx = W * 0.2, bw = W * 0.6, by = 110, bh = H * 0.78 - 110;
    ctx.fillStyle = "#5a3520"; ctx.fillRect(bx, by, bw, bh);
    ctx.fillStyle = "#3a1f12"; ctx.beginPath(); ctx.moveTo(bx - 14, by + 6); ctx.lineTo(bx + bw / 2, by - 44); ctx.lineTo(bx + bw + 14, by + 6); ctx.closePath(); ctx.fill();
    // cửa sổ sáng + cửa chính
    const lit = o.lit;
    [[bx + 28, by + 40], [bx + bw - 28 - 70, by + 40]].forEach(([wx, wy]) => { ctx.fillStyle = `rgb(${60 + 190 * lit},${40 + 150 * lit},${25 + 70 * lit})`; ctx.fillRect(wx, wy, 70, 56); ctx.strokeStyle = "#2a160c"; ctx.lineWidth = 3; ctx.strokeRect(wx, wy, 70, 56); ctx.beginPath(); ctx.moveTo(wx + 35, wy); ctx.lineTo(wx + 35, wy + 56); ctx.moveTo(wx, wy + 28); ctx.lineTo(wx + 70, wy + 28); ctx.stroke(); });
    const dx = bx + bw / 2 - 34, dy = by + 62, dw = 68, dh = bh - 62;
    ctx.fillStyle = `rgb(${50 + 150 * lit},${28 + 90 * lit},${16 + 40 * lit})`; ctx.fillRect(dx, dy, dw, dh); ctx.strokeStyle = "#2a160c"; ctx.lineWidth = 3; ctx.strokeRect(dx, dy, dw, dh);
    ctx.fillStyle = "#e8c070"; ctx.beginPath(); ctx.arc(dx + dw - 10, dy + dh / 2, 3, 0, 7); ctx.fill();
    if (lit > 0) { ctx.save(); ctx.globalCompositeOperation = "lighter"; const g = ctx.createRadialGradient(W / 2, H * 0.78, 10, W / 2, H * 0.78, 220); g.addColorStop(0, `rgba(255,190,100,${0.28 * lit})`); g.addColorStop(1, "rgba(255,190,100,0)"); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); ctx.restore(); }
    lantern(bx + 40, by + 4, o.lantern, T); lantern(bx + bw - 40, by + 4, o.lantern, T);
    // biển OPEN/CLOSED lật
    const sx = W / 2, sy = by + 36, f = o.flip, sc = Math.cos(f * Math.PI);
    ctx.save(); ctx.translate(sx, sy); ctx.scale(Math.max(0.05, Math.abs(sc)), 1);
    const open = f > 0.5;
    ctx.fillStyle = open ? "#f3e2c0" : "#c7b08a"; ctx.fillRect(-34, -13, 68, 26); ctx.strokeStyle = "#6b4413"; ctx.lineWidth = 2; ctx.strokeRect(-34, -13, 68, 26);
    ctx.fillStyle = open ? "#b45309" : "#6b7280"; ctx.font = "bold 10px 'Inter',sans-serif"; ctx.textAlign = "center"; ctx.fillText(open ? "MỞ CỬA" : "ĐÓNG CỬA", 0, 5);
    ctx.restore();
  }
  function drift(T, kind, n) { // hạt rơi theo mùa
    const C = { petal: ["🌸", 0], leaf: ["🍂", 0], snow: ["❄️", 0], spark: ["✨", 0], rain: ["💧", 0] }[kind] || ["✨", 0];
    for (let i = 0; i < n; i++) { const p = (T * (0.12 + rnd(i) * 0.1) + rnd(i + 2)) % 1; const x = (rnd(i + 4) * W + Math.sin(T + i) * 20 + p * 30) % W; emoji(C[0], x, -10 + p * (H + 20), 10 + rnd(i + 8) * 12, 0.55); }
  }
  function person(x, y, sc, g, emo, T) { try { stageRenderer.drawPersonPortrait(ctx, x, y, sc, { hairColor: g.hairColor, outfitColor: g.outfitColor, accessory: g.accessory, isTalking: false, listening: false, emotion: emo, timeSec: T, seed: 1.5 }); } catch (e) { /* bỏ qua */ } }
  function bunny(x, y, sc, emo, T) { try { stageRenderer.drawBunnyBarista(ctx, x, y, sc, false, false, T, emo, false); } catch (e) { /* bỏ qua */ } }
  function cupIcon(x, y, s, col, a) { ctx.save(); ctx.globalAlpha = a; ctx.translate(x, y); ctx.scale(s, s); ctx.fillStyle = "rgba(255,255,255,.16)"; ctx.strokeStyle = col === "#555" ? "#777" : "#f3e2c4"; ctx.lineWidth = 2.2; ctx.beginPath(); ctx.moveTo(-14, -34); ctx.lineTo(-11, 0); ctx.lineTo(11, 0); ctx.lineTo(14, -34); ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(-13, -26); ctx.lineTo(13, -26); ctx.lineTo(10.5, -2); ctx.lineTo(-10.5, -2); ctx.closePath(); ctx.fill(); ctx.restore(); }

  /* ---------- các cảnh ---------- */
  const SCENES = {
    open: { dur: (d) => (d.short ? 1.8 : 3.4), draw(T, d) {
      const D = d.short ? 1.8 : 3.4, k = T / D, dusk = ease(seg(k, 0, 0.5));
      shopFront(T, { skyTop: "#0d1230", skyBot: `rgb(${60 + 40 * dusk},${40 + 20 * dusk},${70 - 10 * dusk})`, stars: 0.9, moon: true, lit: ease(seg(k, 0.3, 0.7)), lantern: ease(seg(k, 0.2, 0.6)), flip: ease(seg(k, 0.45, 0.75)) });
      // khách đi tới cửa + chuông
      const g = d.guest, wx = W * 0.14 + (W * 0.38) * ease(seg(k, 0.55, 1.0));
      if (g && k > 0.5) { ctx.save(); ctx.globalAlpha = 0.95; person(wx, H * 0.86, 0.9, g, "neutral", T); ctx.restore(); }
      if (k > 0.82) { const p = seg(k, 0.82, 1); emoji("🔔", W / 2 + 40, 150 + Math.sin(T * 14) * 3, 22, Math.sin(p * Math.PI)); }
      text(`Đêm ${d.night} • ${d.title || ""}`, W / 2, 34, 17, "#fde68a", ease(seg(k, 0.05, 0.3)), "bold", "'Lora',Georgia,serif");
      text(d.clock ? `${d.clock} — Tiệm Nước Nửa Đêm mở cửa` : "Tiệm Nước Nửa Đêm mở cửa", W / 2, 56, 12, "rgba(253,230,200,.85)", ease(seg(k, 0.15, 0.4)), "normal");
    } },
    close: { dur: () => 3.2, draw(T, d) {
      const k = T / 3.2, dawn = ease(seg(k, 0.35, 1));
      shopFront(T, { skyTop: `rgb(${13 + 110 * dawn},${18 + 70 * dawn},${48 + 60 * dawn})`, skyBot: `rgb(${70 + 170 * dawn},${50 + 90 * dawn},${80 + 20 * dawn})`, stars: 0.9 * (1 - dawn), moon: dawn < 0.6, lit: 1 - ease(seg(k, 0.3, 0.8)), lantern: 1 - ease(seg(k, 0.25, 0.7)), flip: 1 - ease(seg(k, 0.15, 0.5)) });
      emoji("🌙", W * 0.18, 70 + dawn * 60, 22, 1 - dawn);
      text(d.line || "Quán đóng cửa", W / 2, 34, 17, "#fde68a", ease(seg(k, 0.1, 0.35)), "bold", "'Lora',Georgia,serif");
      text("Chúc Thỏ Con ngủ ngon…", W / 2, 56, 12, "rgba(253,230,200,.85)", ease(seg(k, 0.35, 0.65)), "normal");
    } },
    chapter: { dur: () => 4.6, draw(T, d) {
      const k = T / 4.6, c = d.no;
      const pal = { 1: ["#3a1e2c", "#7a3a52", "petal"], 2: ["#2f2a10", "#8a6a1c", "spark"], 3: ["#3a1c0e", "#8a4a16", "leaf"], 4: ["#0f1c33", "#37507a", "snow"] }[c] || ["#2a160c", "#6b4413", "spark"];
      const bg = ctx.createLinearGradient(0, 0, 0, H); bg.addColorStop(0, pal[0]); bg.addColorStop(1, pal[1]); ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
      drift(T, pal[2], 26);
      const a = ease(seg(k, 0.1, 0.35));
      ctx.fillStyle = `rgba(253,230,138,${0.5 * a})`; ctx.fillRect(W / 2 - 90 * a, 150, 180 * a, 1.5); ctx.fillRect(W / 2 - 90 * a, 262, 180 * a, 1.5);
      text(`C H Ư Ơ N G   ${["", "I", "II", "III", "IV"][c] || c}`, W / 2, 140, 14, "#fde68a", a, "bold");
      emoji(d.icon || "🌙", W / 2, 218, 54 * (0.8 + 0.2 * ease(seg(k, 0.2, 0.5))), ease(seg(k, 0.2, 0.5)));
      serif(d.name || "", W / 2, 292, 26, "#fff3d6", ease(seg(k, 0.4, 0.7)));
      text(d.line || "", W / 2, 330, 13, "rgba(253,230,200,.85)", ease(seg(k, 0.6, 0.85)), "normal", "'Lora',Georgia,serif");
      const fo = seg(k, 0.9, 1); if (fo > 0) { ctx.fillStyle = `rgba(4,2,8,${fo})`; ctx.fillRect(0, 0, W, H); }
    } },
    secret: { dur: () => 5.6, draw(T, d) {
      const k = T / 5.6; ctx.fillStyle = "#0a0710"; ctx.fillRect(0, 0, W, H);
      const crack = ease(seg(k, 0.2, 0.75)), cx = W / 2, cy = 225, dw = 120, dh = 210;
      // hành lang
      ctx.fillStyle = "#15101c"; ctx.beginPath(); ctx.moveTo(0, H); ctx.lineTo(cx - dw, cy + dh / 2); ctx.lineTo(cx - dw, cy - dh / 2); ctx.lineTo(0, 0); ctx.fill(); ctx.beginPath(); ctx.moveTo(W, H); ctx.lineTo(cx + dw, cy + dh / 2); ctx.lineTo(cx + dw, cy - dh / 2); ctx.lineTo(W, 0); ctx.fill();
      // cánh cửa
      ctx.fillStyle = "#3b2514"; ctx.fillRect(cx - 62, cy - 105, 124, 210); ctx.strokeStyle = "#1c110a"; ctx.lineWidth = 4; ctx.strokeRect(cx - 62, cy - 105, 124, 210);
      // ánh sáng hé ra
      const gw = 4 + 90 * crack; ctx.save(); ctx.globalCompositeOperation = "lighter";
      const gl = ctx.createLinearGradient(0, cy, W, cy); ctx.fillStyle = `rgba(255,225,150,${0.9 * crack})`; ctx.fillRect(cx - gw / 2, cy - 100, gw, 200);
      const rg = ctx.createRadialGradient(cx, cy, 5, cx, cy, 80 + 260 * crack); rg.addColorStop(0, `rgba(255,215,130,${0.55 * crack})`); rg.addColorStop(1, "rgba(255,215,130,0)"); ctx.fillStyle = rg; ctx.fillRect(0, 0, W, H); ctx.restore();
      // bóng người giữ đèn
      if (k > 0.55) { const s = ease(seg(k, 0.55, 0.8)); ctx.fillStyle = `rgba(10,6,14,${s})`; ctx.beginPath(); ctx.ellipse(cx, cy - 36, 15, 17, 0, 0, 7); ctx.fill(); ctx.beginPath(); ctx.moveTo(cx - 28, cy + 100); ctx.quadraticCurveTo(cx - 24, cy - 16, cx, cy - 16); ctx.quadraticCurveTo(cx + 24, cy - 16, cx + 28, cy + 100); ctx.fill(); emoji("🏮", cx + 40, cy + 20, 26, s); }
      for (let i = 0; i < 14; i++) { const p = (T * 0.2 + rnd(i)) % 1; emoji("✨", cx + (rnd(i + 3) - 0.5) * 240, cy + 80 - p * 220, 10 + rnd(i + 7) * 8, crack * Math.sin(p * Math.PI) * 0.8); }
      text(d.line1 || "Một cánh cửa mới vừa hiện ra…", W / 2, 50, 17, "#fde68a", ease(seg(k, 0.1, 0.3)), "bold", "'Lora',Georgia,serif");
      text(d.line2 || "Ai đó đang đợi ở phía sau.", W / 2, H - 36, 13, "rgba(253,230,200,.9)", ease(seg(k, 0.7, 0.9)), "normal", "'Lora',Georgia,serif");
    } },
    week: { dur: () => 4.0, draw(T, d) {
      const k = T / 4.0, ok = d.ok; warmBg();
      const n = Math.max(1, d.need), x0 = W / 2 - (n - 1) * 36;
      for (let i = 0; i < n; i++) { const a = ease(seg(T, 0.4 + i * 0.3, 0.9 + i * 0.3)), got = i < d.have; cupIcon(x0 + i * 72, 210 + (1 - a) * 30, 1.6, got ? ["#c27a24", "#c0485f", "#f2a65a", "#5a3317"][i % 4] : "#555", a * (got ? 1 : 0.55)); if (got && a > 0.9) emoji("✨", x0 + i * 72, 130, 14, 0.8); }
      counterLine(250);
      if (ok) { for (let i = 0; i < 28; i++) { const p = (T * 0.35 + rnd(i)) % 1; ctx.fillStyle = ["#fde68a", "#f9a8d4", "#a7f3d0", "#bae6fd"][i % 4]; ctx.fillRect(rnd(i + 2) * W, p * H, 5, 8); } }
      else { ctx.fillStyle = `rgba(6,3,2,${0.35 * ease(seg(k, 0.4, 1))})`; ctx.fillRect(0, 0, W, H); }
      serif(ok ? "Tuần này, quán đủ vị!" : "Quán còn thiếu một ly…", W / 2, 54, 20, ok ? "#fde68a" : "#e7d3b0", ease(seg(k, 0.05, 0.3)));
      text(`Công thức độc quyền: ${d.have}/${d.need}`, W / 2, 78, 13, "rgba(253,230,200,.9)", ease(seg(k, 0.15, 0.4)), "normal");
      text(ok ? "Thỏ Con mỉm cười — tuần mới sắp bắt đầu" : "Mở Album Ly xem gợi ý, rồi thử lại nhé", W / 2, H - 30, 13, "#fde68a", ease(seg(k, 0.7, 0.95)));
    } },
    cassette: { dur: () => 3.6, draw(T, d) {
      const k = T / 3.6; warmBg(); const cy = 292; counter(cy);
      // radio
      ctx.fillStyle = "#6b4a2a"; ctx.fillRect(W / 2 - 110, cy - 130, 220, 130); ctx.strokeStyle = "#2a160c"; ctx.lineWidth = 3; ctx.strokeRect(W / 2 - 110, cy - 130, 220, 130);
      ctx.fillStyle = "#1c110a"; ctx.fillRect(W / 2 - 80, cy - 112, 160, 54);
      ctx.fillStyle = "#c79a55"; ctx.beginPath(); ctx.arc(W / 2 - 78, cy - 28, 11, 0, 7); ctx.arc(W / 2 + 78, cy - 28, 11, 0, 7); ctx.fill();
      // băng trượt vào khe
      const slide = ease(seg(T, 0.5, 1.7)), bx = W / 2, by = 140 + (cy - 85 - 140) * slide;
      ctx.save(); ctx.translate(bx, by); ctx.fillStyle = "#e8d9b8"; ctx.fillRect(-52, -32, 104, 64); ctx.strokeStyle = "#3a2410"; ctx.lineWidth = 2; ctx.strokeRect(-52, -32, 104, 64);
      ctx.fillStyle = "#3a2410"; ctx.fillRect(-40, -26, 80, 22); ctx.font = "bold 9px 'Inter',sans-serif"; ctx.textAlign = "center"; ctx.fillStyle = "#f3e2c0"; ctx.fillText(String(d.name || "Băng cassette").slice(0, 22), 0, -11);
      const spin = T * 5; [-22, 22].forEach((ox) => { ctx.fillStyle = "#1c110a"; ctx.beginPath(); ctx.arc(ox, 10, 11, 0, 7); ctx.fill(); ctx.strokeStyle = "#e8d9b8"; ctx.lineWidth = 2; for (let i = 0; i < 3; i++) { const a = spin + i * 2.09; ctx.beginPath(); ctx.moveTo(ox, 10); ctx.lineTo(ox + Math.cos(a) * 9, 10 + Math.sin(a) * 9); ctx.stroke(); } });
      ctx.restore();
      // bắt đầu phát: nốt nhạc
      if (T > 1.8) for (let i = 0; i < 8; i++) { const p = ((T - 1.8) * 0.5 + rnd(i)) % 1; emoji(i % 2 ? "♪" : "♫", W / 2 - 100 + rnd(i + 2) * 200, cy - 140 - p * 90, 16 + rnd(i + 6) * 10, Math.sin(p * Math.PI) * 0.9); }
      serif("🎞️ Băng cassette mới", W / 2, 38, 18, "#fde68a", ease(seg(k, 0.05, 0.25)));
      text(`${d.guestName || "Khách"} tặng một cuộn băng cho quán`, W / 2, 60, 12, "rgba(253,230,200,.9)", ease(seg(k, 0.12, 0.3)), "normal");
      text("Thỏ Con đặt vào radio… và bài hát cất lên", W / 2, H - 22, 13, "#fde68a", ease(seg(k, 0.55, 0.8)));
    } },
    bloom: { dur: () => 3.4, draw(T, d) {
      const k = T / 3.4; warmBg(); const cy = 290; counter(cy);
      const g = ease(seg(T, 0.3, 2.0)), cx = W / 2;
      ctx.fillStyle = "#a0522d"; ctx.beginPath(); ctx.moveTo(cx - 40, cy - 60); ctx.lineTo(cx + 40, cy - 60); ctx.lineTo(cx + 30, cy); ctx.lineTo(cx - 30, cy); ctx.closePath(); ctx.fill(); ctx.fillStyle = "#c4693d"; ctx.fillRect(cx - 44, cy - 66, 88, 12);
      ctx.strokeStyle = "#3f8f3a"; ctx.lineWidth = 6; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(cx, cy - 64); ctx.quadraticCurveTo(cx + 8, cy - 64 - 70 * g, cx, cy - 64 - 130 * g); ctx.stroke();
      [[-1, 0.35], [1, 0.55], [-1, 0.75]].forEach(([s, h], i) => { const a = ease(seg(g, h - 0.2, h)); ctx.fillStyle = "#4caf50"; ctx.beginPath(); ctx.ellipse(cx + s * 22 * a, cy - 64 - 130 * g * h, 22 * a, 9 * a, s * -0.5, 0, 7); ctx.fill(); });
      const f = ease(seg(T, 1.9, 2.8)), fx = cx, fy = cy - 64 - 130 * g;
      if (f > 0) { for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4 + T * 0.2; ctx.fillStyle = i % 2 ? "#f9a8d4" : "#fbcfe8"; ctx.beginPath(); ctx.ellipse(fx + Math.cos(a) * 20 * f, fy + Math.sin(a) * 20 * f, 14 * f, 8 * f, a, 0, 7); ctx.fill(); } ctx.fillStyle = "#fde047"; ctx.beginPath(); ctx.arc(fx, fy, 9 * f, 0, 7); ctx.fill(); }
      if (T > 2.2) for (let i = 0; i < 12; i++) { const p = ((T - 2.2) * 0.5 + rnd(i)) % 1; emoji(i % 3 ? "✨" : "🌸", fx + (rnd(i + 3) - 0.5) * 200, fy + 40 - p * 120, 12 + rnd(i + 7) * 8, Math.sin(p * Math.PI) * 0.9); }
      serif("🪴 Chậu cây đã nở hoa!", W / 2, 38, 18, "#fde68a", ease(seg(k, 0.05, 0.25)));
      text("Nhờ những lần tưới nước đều đặn của Thỏ Con", W / 2, 60, 12, "rgba(253,230,200,.9)", ease(seg(k, 0.12, 0.3)), "normal");
    } },
    cat: { dur: () => 3.6, draw(T, d) {
      const k = T / 3.6; warmBg(); const cy = 300; counter(cy);
      const br = Math.sin(T * 2.0) * 0.7, tS = T;
      const circle = (x, y, r) => { ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.closePath(); };
      ctx.save(); ctx.translate(W / 2 + 10, cy + 8); ctx.scale(5.2, 5.2); ctx.textAlign = "start";
      const hx = -13, hy = -10;
      // nệm
      ctx.fillStyle = "#7f1d33";
      ctx.beginPath(); ctx.ellipse(0, 0 + 2, 25, 6, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#9f2544";
      ctx.beginPath(); ctx.ellipse(0, 0, 24, 4.5, 0, 0, Math.PI * 2); ctx.fill();
      // đuôi quấn phía trước (vằn cam-đen, chóp trắng)
      ctx.lineCap = "round";
      ctx.strokeStyle = "#e8891c"; ctx.lineWidth = 5;
      ctx.beginPath(); ctx.moveTo(0 + 17, 0 - 7); ctx.quadraticCurveTo(0 + 22, 0 + 1, 0 + 6, 0 + 1); ctx.stroke();
      ctx.strokeStyle = "#1f1a17"; ctx.lineWidth = 5;
      ctx.beginPath(); ctx.moveTo(0 + 6, 0 + 1); ctx.quadraticCurveTo(0 - 3, 0 + 2, 0 - 9, 0); ctx.stroke();
      // thân (có clip để vẽ mảng màu)
      ctx.save();
      ctx.beginPath(); ctx.ellipse(0 + 3, 0 - 8 - br * 0.5, 18, 9.5 + br * 0.6, 0, 0, Math.PI * 2); ctx.clip();
      ctx.fillStyle = "#fbf7f0"; ctx.fillRect(0 - 20, 0 - 24, 44, 30);
      ctx.fillStyle = "#e8891c"; circle(0 + 6, 0 - 13, 7.5); ctx.fill(); circle(0 - 2, 0 - 6, 4.5); ctx.fill();
      ctx.fillStyle = "#1f1a17"; circle(0 + 17, 0 - 9, 7); ctx.fill(); circle(0 + 10, 0 - 3, 3.5); ctx.fill();
      ctx.restore();
      // chân trước thu gọn
      ctx.fillStyle = "#fbf7f0";
      ctx.beginPath(); ctx.ellipse(0 - 8, 0 - 1, 6, 3.2, 0, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = "rgba(60,40,30,.35)"; ctx.lineWidth = 0.8;
      ctx.beginPath(); ctx.moveTo(0 - 8, 0 - 3.5); ctx.lineTo(0 - 8, 0 + 1); ctx.stroke();
      // đầu gối lên chân
      ctx.fillStyle = "#fbf7f0";
      ctx.beginPath();
      ctx.moveTo(hx - 8, hy - 3); ctx.lineTo(hx - 7, hy - 13); ctx.lineTo(hx - 1, hy - 8);
      ctx.moveTo(hx + 2, hy - 8); ctx.lineTo(hx + 8, hy - 13); ctx.lineTo(hx + 8, hy - 3); ctx.fill();
      ctx.fillStyle = "#e8891c";
      ctx.beginPath(); ctx.moveTo(hx - 8, hy - 3); ctx.lineTo(hx - 7, hy - 13); ctx.lineTo(hx - 1, hy - 8); ctx.fill();
      ctx.fillStyle = "#1f1a17";
      ctx.beginPath(); ctx.moveTo(hx + 2, hy - 8); ctx.lineTo(hx + 8, hy - 13); ctx.lineTo(hx + 8, hy - 3); ctx.fill();
      ctx.fillStyle = "#f6a6b0";
      ctx.beginPath(); ctx.moveTo(hx - 6, hy - 5); ctx.lineTo(hx - 6, hy - 10); ctx.lineTo(hx - 3, hy - 7); ctx.fill();
      ctx.beginPath(); ctx.moveTo(hx + 4, hy - 7); ctx.lineTo(hx + 7, hy - 10); ctx.lineTo(hx + 7, hy - 5); ctx.fill();
      ctx.save();
      ctx.beginPath(); ctx.ellipse(hx, hy, 9.5, 8, 0, 0, Math.PI * 2); ctx.clip();
      ctx.fillStyle = "#fbf7f0"; ctx.fillRect(hx - 12, hy - 10, 24, 20);
      ctx.fillStyle = "#e8891c"; circle(hx - 6, hy - 6, 6); ctx.fill();
      ctx.fillStyle = "#1f1a17"; circle(hx + 8, hy - 5, 5.5); ctx.fill();
      ctx.restore();
      // mặt: mắt nhắm, mũi, râu, má hồng
      ctx.strokeStyle = "#3a2a22"; ctx.lineWidth = 1.2;
      ctx.beginPath(); ctx.arc(hx - 3.2, hy - 0.5, 2, 0.15 * Math.PI, 0.85 * Math.PI); ctx.stroke();
      ctx.beginPath(); ctx.arc(hx + 3.2, hy - 0.5, 2, 0.15 * Math.PI, 0.85 * Math.PI); ctx.stroke();
      ctx.fillStyle = "#f08a9a"; ctx.beginPath(); ctx.moveTo(hx - 1.3, hy + 2); ctx.lineTo(hx + 1.3, hy + 2); ctx.lineTo(hx, hy + 3.4); ctx.fill();
      ctx.strokeStyle = "rgba(60,40,30,.5)"; ctx.lineWidth = 0.7;
      ctx.beginPath(); ctx.arc(hx, hy + 4.2, 1.3, 0.1 * Math.PI, 0.9 * Math.PI); ctx.stroke();
      ctx.strokeStyle = "rgba(255,255,255,.7)";
      ctx.beginPath(); ctx.moveTo(hx - 5, hy + 3); ctx.lineTo(hx - 12, hy + 2); ctx.moveTo(hx - 5, hy + 4.5); ctx.lineTo(hx - 11, hy + 6);
      ctx.moveTo(hx + 5, hy + 3); ctx.lineTo(hx + 12, hy + 2); ctx.moveTo(hx + 5, hy + 4.5); ctx.lineTo(hx + 11, hy + 6); ctx.stroke();
      ctx.fillStyle = "rgba(244,114,142,.35)";
      circle(hx - 6, hy + 3, 2); ctx.fill(); circle(hx + 6, hy + 3, 2); ctx.fill();

      ctx.restore();
      // bàn tay vuốt qua đầu mèo
      const sw = Math.sin(T * 2.6), hxx = W / 2 + 10 - 13 * 5.2 + sw * 34, hyy = cy + 8 - 10 * 5.2 - 62 + Math.abs(sw) * 8;
      ctx.strokeStyle = "#b86a2e"; ctx.lineWidth = 34; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(hxx + 70, -20); ctx.lineTo(hxx + 6, hyy - 14); ctx.stroke();
      ctx.fillStyle = "#f5eadf"; ctx.strokeStyle = "#2b1b14"; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.ellipse(hxx, hyy, 22, 16, 0, 0, 7); ctx.fill(); ctx.stroke();
      for (let i = 0; i < 7; i++) { const p = (T * 0.4 + rnd(i)) % 1; emoji(i % 2 ? "💗" : "🐾", W / 2 - 70 + rnd(i + 3) * 160, cy - 150 - p * 70, 14 + rnd(i + 5) * 8, Math.sin(p * Math.PI) * 0.9); }
      if (T > 1.2) text("♪ purr… purr…", W / 2 - 90, cy - 190 + Math.sin(T * 3) * 4, 15, "#fde68a", ease(seg(T, 1.2, 1.8)), "normal", "'Lora',Georgia,serif");
      serif("🐾 Mèo tam thể đã quen hơi Thỏ Con", W / 2, 38, 18, "#fde68a", ease(seg(k, 0.05, 0.25)));
      text("Nó cuộn tròn bên quầy, lim dim ngủ trong tay Thỏ Con", W / 2, 60, 12, "rgba(253,230,200,.9)", ease(seg(k, 0.12, 0.3)), "normal");
    } },
    /* ===== Cận cảnh đồ vật (chạm lần đầu và mỗi 10 lần) ===== */
    obj_bottle: { dur: () => 3.2, draw(T, d) {
      const k = T / 3.2; warmBg(); const cy = 300; counter(cy);
      const COL = ["#d99a2b", "#e07a9a", "#7aa04a", "#4a5fa8", "#8a4a1c"], n = 5, sel = (d.idx || 0) % n;
      for (let i = 0; i < n; i++) { const x = W / 2 + (i - 2) * 92, lift = i === sel ? ease(seg(T, 0.3, 1.0)) * 40 : 0, tilt = i === sel ? -0.9 * ease(seg(T, 1.0, 1.6)) : 0;
        ctx.save(); ctx.translate(x + (i === sel ? 30 * ease(seg(T, 1.0, 1.6)) : 0), cy - 4 - lift); ctx.rotate(tilt);
        ctx.fillStyle = COL[i]; ctx.strokeStyle = "rgba(255,255,255,.5)"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(-22, 0); ctx.lineTo(-22, -70); ctx.quadraticCurveTo(-22, -92, -8, -96); ctx.lineTo(-8, -118); ctx.lineTo(8, -118); ctx.lineTo(8, -96); ctx.quadraticCurveTo(22, -92, 22, -70); ctx.lineTo(22, 0); ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.fillStyle = "#f3e2c0"; ctx.fillRect(-22, -62, 44, 28); ctx.fillStyle = "#6b4413"; ctx.fillRect(-9, -128, 18, 12); ctx.restore(); }
      if (T > 1.5 && T < 2.9) { const sx = W / 2 + (sel - 2) * 92 + 58, p = seg(T, 1.5, 2.9); ctx.strokeStyle = COL[sel]; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(sx, cy - 120); ctx.lineTo(sx + 8, cy - 40); ctx.stroke(); cupIcon(sx + 8, cy - 4, 1.1, COL[sel], 1); }
      serif(d.title || "Chai siro", W / 2, 38, 18, "#fde68a", ease(seg(k, 0.05, 0.25)));
      text(d.sub || "", W / 2, 60, 12, "rgba(253,230,200,.9)", ease(seg(k, 0.12, 0.3)), "normal");
    } },
    obj_fish: { dur: () => 3.4, draw(T, d) {
      const k = T / 3.4; warmBg(); const x0 = 90, y0 = 90, w = W - 180, h = 230;
      const g = ctx.createLinearGradient(0, y0, 0, y0 + h); g.addColorStop(0, "#5ec3d8"); g.addColorStop(1, "#1d5a78"); ctx.fillStyle = g; ctx.fillRect(x0, y0, w, h);
      ctx.fillStyle = "#e8d29a"; ctx.fillRect(x0, y0 + h - 22, w, 22); ["#ff7a8a", "#7ad37a"].forEach((c, i) => { ctx.strokeStyle = c; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(x0 + 40 + i * 300, y0 + h - 20); ctx.quadraticCurveTo(x0 + 30 + i * 300 + Math.sin(T * 2 + i) * 8, y0 + h - 70, x0 + 44 + i * 300, y0 + h - 110); ctx.stroke(); });
      const fx = x0 + w / 2 + 40, food = T > 0.5 ? seg(T, 0.5, 1.6) : 0;
      for (let i = 0; i < 10 && food > 0; i++) { const p = clamp(food * 1.2 - rnd(i) * 0.3); ctx.fillStyle = "#f5d36a"; ctx.fillRect(fx + (rnd(i + 2) - 0.5) * 120, y0 + 10 + p * (h - 80), 3, 3); }
      const COL = ["#ff9a3c", "#4a7cff", "#ffd23c", "#ff5a7a", "#7be0a0"];
      for (let i = 0; i < 5; i++) { const rush = ease(seg(T, 1.0, 1.9)), bx = (x0 + 60 + ((T * 40 * (0.6 + rnd(i)) + rnd(i + 4) * w) % (w - 120))) * (1 - rush) + (fx + (rnd(i + 9) - 0.5) * 90) * rush, by = (y0 + 50 + rnd(i + 1) * 120) * (1 - rush) + (y0 + 120 + rnd(i + 6) * 30) * rush + Math.sin(T * 3 + i) * 6, dir = 1;
        ctx.save(); ctx.translate(bx, by); ctx.fillStyle = COL[i]; ctx.beginPath(); ctx.ellipse(0, 0, 20, 11, 0, 0, 7); ctx.fill(); ctx.beginPath(); ctx.moveTo(-18, 0); ctx.lineTo(-32, -9 + Math.sin(T * 12 + i) * 3); ctx.lineTo(-32, 9 + Math.sin(T * 12 + i) * 3); ctx.fill(); ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(10, -3, 3, 0, 7); ctx.fill(); ctx.fillStyle = "#222"; ctx.beginPath(); ctx.arc(11, -3, 1.5, 0, 7); ctx.fill(); ctx.restore(); }
      for (let i = 0; i < 9; i++) { const p = (T * 0.3 + rnd(i)) % 1; ctx.strokeStyle = "rgba(255,255,255,.6)"; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(x0 + 30 + rnd(i + 3) * (w - 60), y0 + h - 30 - p * (h - 40), 3 + rnd(i + 7) * 4, 0, 7); ctx.stroke(); }
      ctx.strokeStyle = "#8b5a2b"; ctx.lineWidth = 8; ctx.strokeRect(x0, y0, w, h);
      serif("🐠 Hồ cá nhỏ của quán", W / 2, 38, 18, "#fde68a", ease(seg(k, 0.05, 0.25)));
      text(`Thỏ Con rắc thức ăn — đã cho ăn ${d.n || 1} lần`, W / 2, 60, 12, "rgba(253,230,200,.9)", ease(seg(k, 0.12, 0.3)), "normal");
    } },
    obj_stove: { dur: () => 3.2, draw(T, d) {
      const k = T / 3.2; warmBg(); const cy = 300, cx = W / 2; counter(cy);
      const fl = 0.7 + 0.3 * Math.sin(T * 9);
      ctx.save(); ctx.globalCompositeOperation = "lighter"; const gl = ctx.createRadialGradient(cx, cy - 60, 10, cx, cy - 60, 230 * fl); gl.addColorStop(0, "rgba(255,140,50,.5)"); gl.addColorStop(1, "rgba(255,140,50,0)"); ctx.fillStyle = gl; ctx.fillRect(0, 0, W, H); ctx.restore();
      ctx.fillStyle = "#2a2623"; ctx.beginPath(); ctx.moveTo(cx - 90, cy); ctx.lineTo(cx - 70, cy - 90); ctx.lineTo(cx + 70, cy - 90); ctx.lineTo(cx + 90, cy); ctx.closePath(); ctx.fill(); ctx.strokeStyle = "#4a433e"; ctx.lineWidth = 3; ctx.stroke();
      for (let i = 0; i < 16; i++) { const a = 0.5 + 0.5 * Math.sin(T * 6 + i * 2); ctx.fillStyle = `rgba(255,${90 + 100 * a},30,${0.7 + 0.3 * a})`; ctx.beginPath(); ctx.arc(cx - 50 + (i % 8) * 14 + (i > 7 ? 7 : 0), cy - 78 + Math.floor(i / 8) * 10, 5, 0, 7); ctx.fill(); }
      // ấm nước
      ctx.fillStyle = "#8a8f98"; ctx.beginPath(); ctx.ellipse(cx, cy - 122, 42, 30, 0, 0, 7); ctx.fill(); ctx.fillStyle = "#6b7078"; ctx.fillRect(cx + 34, cy - 130, 28, 7); ctx.beginPath(); ctx.arc(cx, cy - 150, 16, Math.PI, 0); ctx.fill(); ctx.fillStyle = "#4a4e55"; ctx.fillRect(cx - 5, cy - 160, 10, 6);
      for (let i = 0; i < 6; i++) { const p = (T * 0.5 + i / 6) % 1; ctx.fillStyle = `rgba(255,255,255,${0.35 * (1 - p)})`; ctx.beginPath(); ctx.arc(cx + 58 + Math.sin(T * 2 + i) * 6, cy - 136 - p * 80, 5 + p * 9, 0, 7); ctx.fill(); }
      for (let i = 0; i < 10; i++) { const p = (T * 0.7 + rnd(i)) % 1; emoji("✨", cx - 70 + rnd(i + 3) * 140, cy - 80 - p * 140, 9 + rnd(i + 5) * 6, Math.sin(p * Math.PI) * 0.8); }
      serif("🔥 Bếp than tí tách", W / 2, 38, 18, "#fde68a", ease(seg(k, 0.05, 0.25)));
      text("Than hồng vẫn đượm — chỗ ngồi này luôn ấm", W / 2, 60, 12, "rgba(253,230,200,.9)", ease(seg(k, 0.12, 0.3)), "normal");
    } },
    obj_keep: { dur: (d) => 3.4, draw(T, d) {
      const k = T / 3.4; warmBg(); const items = d.items || [], x0 = 120, y0 = 84, w = W - 240, h = 250;
      ctx.fillStyle = "#4a2a14"; ctx.fillRect(x0, y0, w, h); ctx.fillStyle = "rgba(253,230,138,.08)"; ctx.fillRect(x0 + 8, y0 + 8, w - 16, h - 16);
      ctx.strokeStyle = "#c08a4e"; ctx.lineWidth = 4; ctx.strokeRect(x0, y0, w, h); for (let r = 1; r < 3; r++) { ctx.fillStyle = "#c08a4e"; ctx.fillRect(x0, y0 + r * h / 3 - 2, w, 4); }
      items.slice(0, 8).forEach((it, i) => { const col = i % 4, row = Math.floor(i / 4), a = ease(seg(T, 0.4 + i * 0.22, 0.8 + i * 0.22)), x = x0 + w / 8 + col * w / 4, y = y0 + 58 + row * h / 3;
        if (a <= 0) return; if (it.got) { ctx.save(); ctx.globalCompositeOperation = "lighter"; const g = ctx.createRadialGradient(x, y - 14, 3, x, y - 14, 36); g.addColorStop(0, `rgba(255,225,140,${0.35 * a})`); g.addColorStop(1, "rgba(255,225,140,0)"); ctx.fillStyle = g; ctx.fillRect(x - 40, y - 54, 80, 80); ctx.restore(); emoji(it.icon, x, y, 34, a); } else emoji("❔", x, y, 30, 0.35 * a); });
      serif("🏺 Tủ Kỷ Vật", W / 2, 38, 18, "#fde68a", ease(seg(k, 0.05, 0.25)));
      text(`${d.got || 0}/${d.total || 7} kỷ vật khách đã để lại`, W / 2, 60, 12, "rgba(253,230,200,.9)", ease(seg(k, 0.12, 0.3)), "normal");
    } },
    obj_plant: { dur: () => 3.2, draw(T, d) {
      const k = T / 3.2; warmBg(); const cy = 300, cx = W / 2; counter(cy); const stg = Math.min(5, d.stage || 0), g = ease(seg(T, 0.4, 1.6)), hgt = (20 + stg * 28) * g;
      ctx.fillStyle = "#a0522d"; ctx.beginPath(); ctx.moveTo(cx - 40, cy - 60); ctx.lineTo(cx + 40, cy - 60); ctx.lineTo(cx + 30, cy); ctx.lineTo(cx - 30, cy); ctx.closePath(); ctx.fill(); ctx.fillStyle = "#c4693d"; ctx.fillRect(cx - 44, cy - 66, 88, 12);
      ctx.strokeStyle = "#3f8f3a"; ctx.lineWidth = 6; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(cx, cy - 64); ctx.quadraticCurveTo(cx + 6, cy - 64 - hgt / 2, cx, cy - 64 - hgt); ctx.stroke();
      for (let i = 0; i < stg; i++) { const s = i % 2 ? 1 : -1; ctx.fillStyle = "#4caf50"; ctx.beginPath(); ctx.ellipse(cx + s * 20, cy - 64 - hgt * (0.3 + i * 0.14), 20, 8, s * -0.5, 0, 7); ctx.fill(); }
      if (stg >= 5) { for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4; ctx.fillStyle = i % 2 ? "#f9a8d4" : "#fbcfe8"; ctx.beginPath(); ctx.ellipse(cx + Math.cos(a) * 18, cy - 64 - hgt + Math.sin(a) * 18, 13, 7, a, 0, 7); ctx.fill(); } ctx.fillStyle = "#fde047"; ctx.beginPath(); ctx.arc(cx, cy - 64 - hgt, 8, 0, 7); ctx.fill(); }
      else if (stg === 0) { ctx.fillStyle = "#4caf50"; ctx.beginPath(); ctx.ellipse(cx, cy - 66, 5 * g, 8 * g, 0, 0, 7); ctx.fill(); }
      // bình tưới
      const pour = ease(seg(T, 0.2, 0.8)), px = cx + 90 - 40 * pour, py = cy - 190; ctx.save(); ctx.translate(px, py); ctx.rotate(-0.5 * pour); ctx.fillStyle = "#5b8fb9"; ctx.fillRect(-26, -20, 52, 40); ctx.fillRect(-34, -34, 8, 22); ctx.fillStyle = "#4a7aa3"; ctx.fillRect(-52, -4, 30, 8); ctx.restore();
      for (let i = 0; i < 14; i++) { const p = (T * 1.2 + rnd(i)) % 1; if (T < 0.7) continue; ctx.fillStyle = "rgba(120,190,255,.85)"; ctx.beginPath(); ctx.arc(cx - 6 + (rnd(i + 3) - 0.5) * 30, py + 10 + p * (cy - py - 70), 2.4, 0, 7); ctx.fill(); }
      serif("🪴 Chậu cây nhỏ", W / 2, 38, 18, "#fde68a", ease(seg(k, 0.05, 0.25)));
      text(`Đã tưới ${d.water || 0}/15 lần${stg >= 5 ? " — hoa đã nở rộ" : ""}`, W / 2, 60, 12, "rgba(253,230,200,.9)", ease(seg(k, 0.12, 0.3)), "normal");
    } },
    obj_cup: { dur: () => 3.2, draw(T, d) {
      const k = T / 3.2; warmBg(); const cy = 300; counter(cy);
      ctx.save(); ctx.translate(W / 2, cy - 4); ctx.scale(3.4, 3.4); ctx.fillStyle = "rgba(255,255,255,.18)"; ctx.strokeStyle = "#f3e2c4"; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(-17, -40); ctx.lineTo(-13, 0); ctx.lineTo(13, 0); ctx.lineTo(17, -40); ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.fillStyle = d.col || "#c27a24"; ctx.beginPath(); ctx.moveTo(-16, -32); ctx.lineTo(16, -32); ctx.lineTo(13, -2); ctx.lineTo(-13, -2); ctx.closePath(); ctx.fill(); ctx.strokeStyle = "#f3e2c4"; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(20, -22, 7, -1.2, 1.2); ctx.stroke(); ctx.restore();
      ctx.strokeStyle = "#d9d9d9"; ctx.lineWidth = 6; ctx.lineCap = "round"; const a = T * 5; ctx.beginPath(); ctx.moveTo(W / 2 + Math.cos(a) * 14, cy - 190); ctx.lineTo(W / 2 + Math.cos(a) * 14 + 8, cy - 80); ctx.stroke();
      ctx.lineWidth = 6; for (let i = 0; i < 4; i++) { const p = (T * 0.4 + i / 4) % 1; ctx.strokeStyle = `rgba(255,255,255,${0.4 * (1 - p)})`; ctx.beginPath(); ctx.moveTo(W / 2 - 30 + i * 20, cy - 150); ctx.bezierCurveTo(W / 2 - 40 + i * 20 + Math.sin(T * 2 + i) * 10, cy - 180 - p * 30, W / 2 - 20 + i * 20, cy - 200 - p * 40, W / 2 - 30 + i * 20 + Math.sin(T * 2 + i) * 14, cy - 230 - p * 50); ctx.stroke(); }
      serif(d.name || "Ly nước", W / 2, 38, 18, "#fde68a", ease(seg(k, 0.05, 0.25)));
      text(d.quality || "", W / 2, 60, 13, "rgba(253,230,200,.95)", ease(seg(k, 0.12, 0.3)), "normal");
      text(d.line || "Thỏ Con khẽ đẩy ly lại gần: «Uống đi, kẻo nguội.»", W / 2, H - 26, 13, "#fde68a", ease(seg(k, 0.5, 0.8)));
    } },
    obj_clock: { dur: () => 3.4, draw(T, d) {
      const k = T / 3.4; warmBg(); const cx = W / 2, cy = 215, R = 116, tm = d.time || "03:20", hh = (parseInt(tm.slice(0, 2), 10) % 12) || 12, mm = parseInt(tm.slice(3, 5), 10) || 0;
      ctx.fillStyle = "#3a2210"; ctx.beginPath(); ctx.arc(cx, cy, R + 10, 0, 7); ctx.fill(); ctx.fillStyle = "#f3e2c0"; ctx.beginPath(); ctx.arc(cx, cy, R, 0, 7); ctx.fill();
      for (let i = 0; i < 12; i++) { const a = i * Math.PI / 6; ctx.strokeStyle = "#6b4413"; ctx.lineWidth = i % 3 ? 2 : 4; ctx.beginPath(); ctx.moveTo(cx + Math.sin(a) * (R - 10), cy - Math.cos(a) * (R - 10)); ctx.lineTo(cx + Math.sin(a) * (R - 22), cy - Math.cos(a) * (R - 22)); ctx.stroke(); }
      const sett = ease(seg(T, 0.3, 1.8)), mA = ((mm / 60) + (1 - sett) * 3) * Math.PI * 2, hA = (((hh + mm / 60) / 12) + (1 - sett) * 0.5) * Math.PI * 2;
      ctx.lineCap = "round"; ctx.strokeStyle = "#3a2210"; ctx.lineWidth = 7; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.sin(hA) * 58, cy - Math.cos(hA) * 58); ctx.stroke(); ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.sin(mA) * 86, cy - Math.cos(mA) * 86); ctx.stroke();
      ctx.fillStyle = "#b45309"; ctx.beginPath(); ctx.arc(cx, cy, 6, 0, 7); ctx.fill();
      ctx.strokeStyle = "#c08a4e"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(cx - 50, cy + R + 10); ctx.lineTo(cx - 50, cy + R + 60 + Math.sin(T * 3) * 4); ctx.stroke(); ctx.fillStyle = "#c08a4e"; ctx.beginPath(); ctx.arc(cx - 50, cy + R + 66 + Math.sin(T * 3) * 4, 9, 0, 7); ctx.fill();
      serif("🕰️ Đồng hồ treo tường", W / 2, 38, 18, "#fde68a", ease(seg(k, 0.05, 0.25)));
      text(`${tm} — đêm đã khuya, mưa vẫn rơi`, W / 2, 60, 12, "rgba(253,230,200,.9)", ease(seg(k, 0.12, 0.3)), "normal");
    } },
    obj_radio: { dur: () => 3.6, draw(T, d) {
      const k = T / 3.6; warmBg(); const cy = 300, cx = W / 2; counter(cy);
      ctx.fillStyle = "#6b4a2a"; ctx.fillRect(cx - 130, cy - 150, 260, 150); ctx.strokeStyle = "#2a160c"; ctx.lineWidth = 3; ctx.strokeRect(cx - 130, cy - 150, 260, 150);
      ctx.fillStyle = "#1c110a"; ctx.fillRect(cx - 100, cy - 132, 140, 64); ctx.fillStyle = "#e8c070"; const nd = cx - 90 + ((Math.sin(T * 1.5) + 1) / 2) * 120; ctx.fillRect(nd, cy - 126, 3, 52);
      ctx.fillStyle = "#c79a55"; ctx.beginPath(); ctx.arc(cx + 80, cy - 100, 22, 0, 7); ctx.fill(); ctx.strokeStyle = "#2a160c"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(cx + 80, cy - 100); ctx.lineTo(cx + 80 + Math.cos(T * 2) * 18, cy - 100 + Math.sin(T * 2) * 18); ctx.stroke();
      ctx.strokeStyle = "#888"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(cx + 100, cy - 150); ctx.lineTo(cx + 150, cy - 220); ctx.stroke();
      for (let i = 0; i < 3; i++) { const p = (T * 0.8 + i / 3) % 1; ctx.strokeStyle = `rgba(253,230,138,${0.6 * (1 - p)})`; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(cx + 150, cy - 220, 10 + p * 50, -0.9, 0.2); ctx.stroke(); }
      if (T > 0.8) for (let i = 0; i < 7; i++) { const p = ((T - 0.8) * 0.45 + rnd(i)) % 1; emoji(i % 2 ? "♪" : "♫", cx - 120 + rnd(i + 2) * 240, cy - 160 - p * 90, 16 + rnd(i + 6) * 10, Math.sin(p * Math.PI) * 0.9); }
      serif("📻 Đài FM Nửa Đêm", W / 2, 38, 18, "#fde68a", ease(seg(k, 0.05, 0.25)));
      const nw = String(d.news || "Thành phố đang mưa nhẹ, chúc những người thức khuya tìm thấy một góc bình yên."), L = wrap(nw, 460, "13px 'Lora',Georgia,serif");
      L.slice(0, 3).forEach((ln, i) => text(ln, W / 2, 62 + i * 18, 13, "rgba(253,230,200,.95)", ease(seg(k, 0.3 + i * 0.08, 0.5 + i * 0.08)), "normal", "'Lora',Georgia,serif"));
    } },
    obj_shelf: { dur: () => 3.4, draw(T, d) {
      const k = T / 3.4; warmBg(); const x0 = 110, y0 = 90, w = W - 220, h = 230;
      ctx.fillStyle = "#4a2a14"; ctx.fillRect(x0, y0, w, h); ctx.fillStyle = "#c08a4e"; for (let r = 1; r < 3; r++) ctx.fillRect(x0, y0 + r * h / 3 - 3, w, 6);
      const C = ["#b91c1c", "#1d4ed8", "#15803d", "#a16207", "#7e22ce", "#0f766e", "#c2410c"];
      for (let r = 0; r < 3; r++) for (let i = 0; i < 9; i++) { const bw = 18 + rnd(r * 9 + i) * 10, bh = 40 + rnd(r * 9 + i + 3) * 22, bx = x0 + 14 + i * 36, pick = r === 1 && i === 4, out = pick ? ease(seg(T, 0.5, 1.2)) * 36 : 0; ctx.fillStyle = C[(r * 3 + i) % C.length]; ctx.fillRect(bx, y0 + (r + 1) * h / 3 - 3 - bh - out, bw, bh); ctx.fillStyle = "rgba(255,255,255,.35)"; ctx.fillRect(bx + 3, y0 + (r + 1) * h / 3 - 3 - bh + 6 - out, bw - 6, 3); }
      if (T > 1.2) { const o = ease(seg(T, 1.2, 1.9)); emoji("📖", W / 2, y0 + h + 46, 44 * o, o); for (let i = 0; i < 6; i++) { const p = ((T - 1.2) * 0.4 + rnd(i)) % 1; emoji("✨", W / 2 - 80 + rnd(i + 3) * 160, y0 + h + 30 - p * 60, 11, Math.sin(p * Math.PI) * 0.8); } }
      serif("📚 Giá sách của quán", W / 2, 38, 18, "#fde68a", ease(seg(k, 0.05, 0.25)));
      text("Mỗi vị khách để lại một cuốn sách…", W / 2, 60, 12, "rgba(253,230,200,.9)", ease(seg(k, 0.12, 0.3)), "normal");
    } },
    obj_window: { dur: () => 3.6, draw(T, d) {
      const k = T / 3.6; const x0 = 140, y0 = 80, w = W - 280, h = 240;
      ctx.fillStyle = "#1a1008"; ctx.fillRect(0, 0, W, H); const sky = ctx.createLinearGradient(0, y0, 0, y0 + h); sky.addColorStop(0, "#10173a"); sky.addColorStop(1, "#3a3260"); ctx.fillStyle = sky; ctx.fillRect(x0, y0, w, h);
      for (let i = 0; i < 28; i++) { const bx = x0 + (i % 14) * (w / 14), bh = 30 + rnd(i) * 70; ctx.fillStyle = "#0b0d1f"; ctx.fillRect(bx, y0 + h - bh, w / 14 - 2, bh); for (let j = 0; j < 3; j++) if (rnd(i * 3 + j) > 0.5) { ctx.fillStyle = "rgba(255,215,120,.85)"; ctx.fillRect(bx + 4 + j * 6, y0 + h - bh + 8 + j * 14, 3, 4); } }
      ctx.fillStyle = "#fdf3c8"; ctx.beginPath(); ctx.arc(x0 + w * 0.8, y0 + 40, 14, 0, 7); ctx.fill();
      ctx.save(); ctx.beginPath(); ctx.rect(x0, y0, w, h); ctx.clip(); const kind = d.kind || "rain";
      for (let i = 0; i < 46; i++) { const p = (T * (0.5 + rnd(i) * 0.4) + rnd(i + 3)) % 1, x = x0 + rnd(i + 5) * w; if (kind === "rain") { ctx.strokeStyle = "rgba(190,215,255,.6)"; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(x, y0 + p * h); ctx.lineTo(x - 5, y0 + p * h + 14); ctx.stroke(); } else emoji(d.icon || "🌸", x + Math.sin(T + i) * 14, y0 + p * h, 12, 0.8); }
      ctx.restore(); ctx.strokeStyle = "#8b5a2b"; ctx.lineWidth = 10; ctx.strokeRect(x0, y0, w, h); ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(x0 + w / 2, y0); ctx.lineTo(x0 + w / 2, y0 + h); ctx.moveTo(x0, y0 + h / 2); ctx.lineTo(x0 + w, y0 + h / 2); ctx.stroke();
      ctx.fillStyle = "#7a2a3a"; ctx.fillRect(x0 - 24, y0 - 8, 30, h + 16); ctx.fillRect(x0 + w - 6, y0 - 8, 30, h + 16);
      serif(`${d.icon || "🌧️"} ${d.name || "Ngoài cửa sổ"}`, W / 2, 38, 18, "#fde68a", ease(seg(k, 0.05, 0.25)));
      text(d.desc || "Mưa rơi lên phố, ánh đèn nhòe trên kính", W / 2, 60, 12, "rgba(253,230,200,.9)", ease(seg(k, 0.12, 0.3)), "normal");
    } },
    obj_bunny: { dur: () => 3.2, draw(T, d) {
      const k = T / 3.2; warmBg(); const cy = 330; counter(cy); bunny(W / 2, cy + 6, 3.5, T > 0.6 ? "happy" : "neutral", T);
      const a = ease(seg(T, 0.7, 1.2)); ctx.globalAlpha = a; ctx.fillStyle = "#fff8e8"; ctx.strokeStyle = "#8a5a1e"; ctx.lineWidth = 2; ctx.beginPath(); ctx.roundRect ? ctx.roundRect(W / 2 + 70, 90, 220, 70, 14) : ctx.rect(W / 2 + 70, 90, 220, 70); ctx.fill(); ctx.stroke(); ctx.globalAlpha = 1;
      wrap(d.line || "Chào bạn! Quầy nước luôn sẵn sàng sưởi ấm những tâm hồn đêm mưa.", 196, "12px 'Lora',Georgia,serif").slice(0, 3).forEach((ln, i) => text(ln, W / 2 + 180, 112 + i * 17, 12, "#5a3a10", a, "normal", "'Lora',Georgia,serif"));
      serif("🐰 Thỏ Con", W / 2, 24, 18, "#fde68a", ease(seg(k, 0.05, 0.25)));
      text("Chủ quán nhỏ nhắn của Tiệm Nước Nửa Đêm", W / 2, 60, 12, "rgba(253,230,200,.9)", ease(seg(k, 0.12, 0.3)), "normal");
    } },
    obj_guest: { dur: () => 3.2, draw(T, d) {
      const k = T / 3.2; warmBg(); const cy = 340; counter(cy); const g = d.guest; if (g) person(W / 2 - 60, cy, 4.2, g, T > 0.6 ? "happy" : "neutral", T);
      const a = ease(seg(T, 0.7, 1.2)); ctx.globalAlpha = a; ctx.fillStyle = "#fff8e8"; ctx.strokeStyle = "#8a5a1e"; ctx.lineWidth = 2; ctx.beginPath(); ctx.roundRect ? ctx.roundRect(W / 2 + 40, 90, 240, 86, 14) : ctx.rect(W / 2 + 40, 90, 240, 86); ctx.fill(); ctx.stroke(); ctx.globalAlpha = 1;
      wrap(String(d.line || "").replace(/^[^:"“‘']{1,24}:\s*/, ""), 216, "12px 'Lora',Georgia,serif").slice(0, 4).forEach((ln, i) => text(ln, W / 2 + 160, 112 + i * 17, 12, "#5a3a10", a, "normal", "'Lora',Georgia,serif"));
      serif(g ? String(g.name).split(" (")[0] : "Khách quen", W / 2, 38, 18, "#fde68a", ease(seg(k, 0.05, 0.25)));
      text(g && g.role ? g.role : "Vị khách của quán đêm nay", W / 2, 60, 12, "rgba(253,230,200,.9)", ease(seg(k, 0.12, 0.3)), "normal");
    } },
    obj_lantern: { dur: () => 3.4, draw(T, d) {
      const k = T / 3.4; ctx.fillStyle = "#120a06"; ctx.fillRect(0, 0, W, H); const sw = Math.sin(T * 1.6) * 0.12, cx = W / 2, top = 40;
      ctx.save(); ctx.translate(cx, top); ctx.rotate(sw); ctx.strokeStyle = "#7a4a22"; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, 70); ctx.stroke();
      ctx.save(); ctx.globalCompositeOperation = "lighter"; const gl = ctx.createRadialGradient(0, 170, 10, 0, 170, 260); gl.addColorStop(0, "rgba(255,180,80,.7)"); gl.addColorStop(1, "rgba(255,180,80,0)"); ctx.fillStyle = gl; ctx.fillRect(-300, -40, 600, 520); ctx.restore();
      ctx.fillStyle = "#c2410c"; ctx.beginPath(); ctx.ellipse(0, 170, 62, 80, 0, 0, 7); ctx.fill(); ctx.fillStyle = "#ef7b2c"; ctx.beginPath(); ctx.ellipse(0, 170, 46, 70, 0, 0, 7); ctx.fill(); ctx.fillStyle = "#fde68a"; ctx.beginPath(); ctx.ellipse(0, 172, 24, 44 + Math.sin(T * 9) * 3, 0, 0, 7); ctx.fill();
      ctx.fillStyle = "#3a1c0e"; ctx.fillRect(-30, 88, 60, 12); ctx.fillRect(-30, 244, 60, 12); ctx.strokeStyle = "#e8c070"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(0, 256); ctx.lineTo(0, 300); ctx.stroke(); ctx.restore();
      for (let i = 0; i < 6; i++) { const a = T * (0.8 + rnd(i)) + i * 2; emoji("🦋", cx + Math.cos(a) * (90 + i * 14), top + 170 + Math.sin(a * 1.3) * (60 + i * 8), 14, 0.7); }
      serif("🏮 Đèn lồng giữ quán", W / 2, H - 44, 18, "#fde68a", ease(seg(k, 0.1, 0.3)));
      text("Chỉ cần còn đèn sáng, luôn có người ghé lại", W / 2, H - 22, 12, "rgba(253,230,200,.9)", ease(seg(k, 0.2, 0.4)), "normal");
    } },
    month: { dur: (d) => 3.0 + (d.guests ? d.guests.length : 7) * 0.7, draw(T, d) {
      const gs = d.guests || [], n = gs.length || 1; warmBg();
      drift(T, "spark", 18);
      const gx = (i) => W / 2 + (i - (n - 1) / 2) * Math.min(86, 560 / n);
      gs.forEach((g, i) => { const a = ease(seg(T, 0.6 + i * 0.7, 1.2 + i * 0.7)); if (a <= 0) return; ctx.save(); ctx.globalAlpha = a; person(gx(i), 262 + (1 - a) * 30, 0.95, g, "happy", T); ctx.restore(); text(String(g.name).split(" (")[0].split(" ").slice(-1)[0], gx(i), 288, 11, "#fde68a", a); });
      const t1 = 0.6 + n * 0.7 + 0.3;
      serif("28 đêm — một tháng ở Tiệm Nước Nửa Đêm", W / 2, 44, 18, "#fde68a", ease(seg(T, 0.2, 0.7)));
      text(`${d.drinks || 0} ly nước đã rót • ${d.endings || 0} kết cục đã gặp`, W / 2, 68, 12, "rgba(253,230,200,.9)", ease(seg(T, 0.4, 0.9)), "normal");
      serif("Cảm ơn vì đã ở lại, Thỏ Con.", W / 2, H - 50, 20, "#fff3d6", ease(seg(T, t1, t1 + 0.8)));
    } },
    /* ===== Cánh Cửa Thứ Hai ===== */
    tw_book: { dur: () => 5.8, draw(T, d) {
      const k = T / 5.8; warmBg(); const cy = 330; counter(cy);
      const rise = ease(seg(T, 0.2, 1.3)), open = ease(seg(T, 1.3, 2.1)), cx = W / 2, by = 215 + (1 - rise) * 190, pw = 150, ph = 190;
      // bìa sổ
      ctx.save(); ctx.translate(cx, by); ctx.fillStyle = "#6b2e22"; ctx.fillRect(-pw - 8, -ph / 2 - 8, pw * 2 + 16, ph + 16); ctx.strokeStyle = "#2a100a"; ctx.lineWidth = 3; ctx.strokeRect(-pw - 8, -ph / 2 - 8, pw * 2 + 16, ph + 16);
      // trang trái
      ctx.fillStyle = "#f6ecd2"; ctx.fillRect(-pw, -ph / 2, pw, ph);
      // trang phải (lật mở theo scaleX)
      ctx.save(); ctx.translate(0, 0); ctx.scale(Math.max(0.02, open), 1); ctx.fillStyle = "#f9f1da"; ctx.fillRect(0, -ph / 2, pw, ph); ctx.restore();
      if (open < 0.95) { ctx.fillStyle = "#6b2e22"; ctx.fillRect(-pw, -ph / 2, pw * 2 * (1 - open), ph); }
      ctx.strokeStyle = "rgba(120,80,40,.35)"; ctx.lineWidth = 1; for (let i = 0; i < 9; i++) { const y = -ph / 2 + 26 + i * 19; ctx.beginPath(); ctx.moveTo(-pw + 14, y); ctx.lineTo(-14, y); ctx.moveTo(14, y); ctx.lineTo(pw - 14, y); ctx.stroke(); }
      if (open > 0.9) {
        text("Sổ sức khỏe", -pw / 2, -ph / 2 + 16, 11, "#6b2e22", 1, "bold", "'Lora',Georgia,serif");
        const L = ["Hẹn khám 07:00", "Uống thuốc đúng giờ", "Ngủ đủ giấc", "Một bữa ăn thật ấm", "Nhắn người thân"];
        L.forEach((s, i) => { const a = ease(seg(T, 2.2 + i * 0.35, 2.6 + i * 0.35)); if (a <= 0) return; const y = -ph / 2 + 45 + i * 19; ctx.textAlign = "left"; ctx.fillStyle = "#4a2e1a"; ctx.globalAlpha = a; ctx.font = "11px 'Lora',Georgia,serif"; ctx.fillText(s, -pw + 30, y); ctx.globalAlpha = 1; const ck = ease(seg(T, 2.5 + i * 0.35, 2.9 + i * 0.35)); if (ck > 0) { ctx.strokeStyle = "#2f8f4a"; ctx.lineWidth = 3; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(-pw + 12, y - 5); ctx.lineTo(-pw + 12 + 5 * ck, y - 5 + 6 * ck); if (ck > 0.5) ctx.lineTo(-pw + 17 + 11 * (ck - 0.5) * 2, y + 1 - 13 * (ck - 0.5) * 2); ctx.stroke(); } });
        // bảy mảnh giấy ghi chú từ bảy người khách
        const av = (d.avatars && d.avatars.length ? d.avatars : ["🎓", "💻", "🖋️", "🚚", "🧵", "🧶", "👓"]), cols = ["#fde68a", "#fbcfe8", "#bae6fd", "#bbf7d0", "#fed7aa", "#ddd6fe", "#fecaca"];
        av.slice(0, 7).forEach((e, i) => { const a = ease(seg(T, 3.6 + i * 0.2, 4.0 + i * 0.2)); if (a <= 0) return; const nx = 12 + (i % 3) * 38, ny = -ph / 2 + 30 + Math.floor(i / 3) * 52 + (i === 6 ? 6 : 0), rot = (rnd(i + 3) - 0.5) * 0.35; ctx.save(); ctx.translate(nx + 18, ny + 18 - (1 - a) * 40); ctx.rotate(rot); ctx.globalAlpha = a; ctx.fillStyle = cols[i % 7]; ctx.fillRect(-18, -18, 36, 36); ctx.fillStyle = "rgba(0,0,0,.08)"; ctx.fillRect(-18, 12, 36, 6); ctx.restore(); emoji(e, nx + 18, ny + 26 - (1 - a) * 40, 20, a); });
      }
      // thẻ da đánh dấu trang của anh Khang
      if (open > 0.9) { ctx.fillStyle = "#a0602a"; ctx.fillRect(pw - 22, -ph / 2 - 6, 14, 54); ctx.beginPath(); ctx.moveTo(pw - 22, -ph / 2 + 48); ctx.lineTo(pw - 15, -ph / 2 + 40); ctx.lineTo(pw - 8, -ph / 2 + 48); ctx.fillStyle = "#a0602a"; ctx.fill(); }
      ctx.restore();
      for (let i = 0; i < 10; i++) { const p = (T * 0.25 + rnd(i)) % 1; emoji("✨", cx + (rnd(i + 3) - 0.5) * 300, by + 90 - p * 240, 10 + rnd(i + 7) * 6, Math.sin(p * Math.PI) * 0.7 * open); }
      serif("📓 Cuốn sổ sức khỏe", W / 2, 38, 18, "#fde68a", ease(seg(k, 0.05, 0.25)));
      text("Thỏ Con rút ra khỏi túi tạp dề, lần đầu mở cho mọi người cùng xem", W / 2, 60, 12, "rgba(253,230,200,.9)", ease(seg(k, 0.12, 0.3)), "normal");
      text("Trang nào cũng có chỗ cho một người ở lại bên cạnh", W / 2, H - 22, 13, "#fde68a", ease(seg(k, 0.78, 0.92)));
    } },
    tw_card: { dur: () => 5.6, draw(T, d) {
      const k = T / 5.6; warmBg(); const cy = 340; counter(cy); const cx = W / 2;
      // hộp DRINK
      ctx.fillStyle = "#5a3318"; ctx.fillRect(cx - 80, cy - 70, 160, 70); ctx.fillStyle = "#7a4a22"; ctx.fillRect(cx - 86, cy - 80, 172, 16); ctx.strokeStyle = "#2a160c"; ctx.lineWidth = 3; ctx.strokeRect(cx - 80, cy - 70, 160, 70);
      text("D R I N K", cx, cy - 28, 14, "#fde68a", 0.9, "bold", "'Lora',Georgia,serif");
      const rise = ease(seg(T, 0.4, 1.5)), fly = ease(seg(T, 1.5, 2.5)), flip = ease(seg(T, 2.5, 3.3));
      const y = (cy - 80 - 40 * rise) * (1 - fly) + 190 * fly, sc = 0.55 + 0.75 * fly, cw = 130 * sc, ch = 190 * sc;
      if (T > 0.4) {
        if (fly > 0) { ctx.save(); ctx.globalCompositeOperation = "lighter"; const g = ctx.createRadialGradient(cx, y, 20, cx, y, 220 * fly); g.addColorStop(0, `rgba(255,225,150,${0.5 * fly})`); g.addColorStop(1, "rgba(255,225,150,0)"); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); ctx.restore(); }
        ctx.save(); ctx.translate(cx, y); const sx = Math.max(0.03, Math.abs(Math.cos(flip * Math.PI))); ctx.scale(sx, 1);
        const front = flip > 0.5;
        ctx.fillStyle = "#fffaf0"; ctx.fillRect(-cw / 2, -ch / 2, cw, ch); ctx.strokeStyle = front ? "#d9a441" : "#8a6a3a"; ctx.lineWidth = 4; ctx.strokeRect(-cw / 2, -ch / 2, cw, ch);
        if (!front) { // mặt sau: cánh cửa hé mở
          const fw = cw * 0.5, fh = ch * 0.6; ctx.fillStyle = "#ffe3a0"; ctx.fillRect(-fw / 2, -fh / 2 - 8, fw, fh); ctx.fillStyle = "#4a2c16"; ctx.beginPath(); ctx.moveTo(-fw / 2, -fh / 2 - 8); ctx.lineTo(-fw / 2 + fw * 0.34, -fh / 2 + 2); ctx.lineTo(-fw / 2 + fw * 0.34, fh / 2 - 14); ctx.lineTo(-fw / 2, fh / 2 - 8); ctx.closePath(); ctx.fill(); ctx.strokeStyle = "#2a160c"; ctx.lineWidth = 3; ctx.strokeRect(-fw / 2, -fh / 2 - 8, fw, fh); ctx.fillStyle = "#e8c070"; ctx.beginPath(); ctx.arc(-fw / 2 + fw * 0.27, 2, 2.5, 0, 7); ctx.fill();
        } else { // mặt trước: chữ vàng
          const lines = wrap("Điều bạn cần nghe nhất lúc này là gì?", cw - 26, "bold 15px 'Lora',Georgia,serif"); ctx.fillStyle = "#8a5a10"; ctx.font = "bold 15px 'Lora',Georgia,serif"; ctx.textAlign = "center";
          lines.forEach((s, i) => ctx.fillText(s, 0, -lines.length * 10 + i * 22 + 8)); ctx.font = "26px " + EMOJI; ctx.fillStyle = "#000"; ctx.fillText("🚪", 0, ch / 2 - 18);
        }
        ctx.restore();
      }
      if (flip > 0.5) for (let i = 0; i < 14; i++) { const p = ((T - 2.9) * 0.5 + rnd(i)) % 1; emoji("✨", cx + (rnd(i + 3) - 0.5) * 300, 190 + 60 - p * 200, 10 + rnd(i + 7) * 8, Math.sin(p * Math.PI) * 0.85); }
      serif("🃏 Lá bài thứ mười bảy", W / 2, 38, 18, "#fde68a", ease(seg(k, 0.05, 0.25)));
      text("Vy lật lá bài trắng cuối hộp DRINK", W / 2, 60, 12, "rgba(253,230,200,.9)", ease(seg(k, 0.12, 0.3)), "normal");
      text("Câu hỏi này, hôm nay là dành cho Thỏ Con", W / 2, H - 22, 13, "#fde68a", ease(seg(k, 0.75, 0.92)));
    } },
    tw_drink: { dur: () => 6.0, draw(T, d) {
      const k = T / 6.0; warmBg(); const cy = 330; counter(cy); const cx = W / 2, cupY = cy - 6;
      const av = (d.avatars && d.avatars.length ? d.avatars : ["🎓", "💻", "🖋️", "🚚", "🧵", "🧶", "👓"]).slice(0, 7), ING = ["🌼", "🍯", "🥄", "🍋", "🌿", "🧡", "🤍"];
      // bảy người đứng sau quầy, lần lượt thả nguyên liệu
      const level = (() => { let n = 0; av.forEach((e, i) => { n += ease(seg(T, 0.8 + i * 0.5, 1.5 + i * 0.5)); }); return n / 7; })();
      av.forEach((e, i) => { const x = 70 + i * ((W - 140) / 6), a = ease(seg(T, 0.2 + i * 0.1, 0.7 + i * 0.1)), t0 = 0.8 + i * 0.5, pr = seg(T, t0, t0 + 0.7), bob = Math.sin(T * 2 + i) * 2;
        emoji(e, x, 118 + bob, 34, a);
        if (pr > 0 && pr < 1) { const px = x + (cx - x) * ease(pr), py = 140 + (cupY - 130 - 140) * pr * pr - Math.sin(pr * Math.PI) * 50; emoji(ING[i], px, py, 20, 1); }
        if (pr >= 1) { const r = seg(T, t0 + 0.7, t0 + 1.2); ctx.strokeStyle = `rgba(255,220,150,${0.7 * (1 - r)})`; ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(cx, cupY - 130 + 6, 18 + r * 30, 5 + r * 8, 0, 0, 7); ctx.stroke(); } });
      const glow = ease(seg(T, 4.2, 5.0));
      const mix = (a, b, t) => Math.round(a + (b - a) * t), col = `rgb(${mix(200, 232, glow)},${mix(150, 170, glow)},${mix(60, 90, glow)})`;
      ctx.save(); ctx.translate(cx, cupY); ctx.scale(3.2, 3.2); ctx.fillStyle = "rgba(255,255,255,.18)"; ctx.strokeStyle = "#f3e2c4"; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(-17, -40); ctx.lineTo(-13, 0); ctx.lineTo(13, 0); ctx.lineTo(17, -40); ctx.closePath(); ctx.fill(); ctx.stroke();
      const lv = 30 * level; ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(-13.2 + 0.1 * lv * 0.12, -2 - lv); ctx.lineTo(13.2 - 0.1 * lv * 0.12, -2 - lv); ctx.lineTo(13, -2); ctx.lineTo(-13, -2); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = "#f3e2c4"; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(20, -22, 7, -1.2, 1.2); ctx.stroke(); ctx.restore();
      if (level > 0.8) for (let i = 0; i < 4; i++) { const p = (T * 0.4 + i / 4) % 1; ctx.strokeStyle = `rgba(255,255,255,${0.4 * (1 - p)})`; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(cx - 24 + i * 16, cupY - 130); ctx.bezierCurveTo(cx - 34 + i * 16 + Math.sin(T * 2 + i) * 8, cupY - 160 - p * 30, cx - 14 + i * 16, cupY - 180 - p * 40, cx - 24 + i * 16 + Math.sin(T * 2 + i) * 12, cupY - 205 - p * 50); ctx.stroke(); }
      if (glow > 0) { ctx.save(); ctx.globalCompositeOperation = "lighter"; const g = ctx.createRadialGradient(cx, cupY - 70, 10, cx, cupY - 70, 200 * glow); g.addColorStop(0, `rgba(255,215,130,${0.26 * glow})`); g.addColorStop(1, "rgba(255,215,130,0)"); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); ctx.restore(); for (let i = 0; i < 12; i++) { const p = (T * 0.4 + rnd(i)) % 1; emoji(i % 3 ? "✨" : "💛", cx + (rnd(i + 3) - 0.5) * 220, cupY - 60 - p * 170, 11 + rnd(i + 7) * 8, Math.sin(p * Math.PI) * 0.85 * glow); } }
      serif("🍵 Ly thứ bảy mang tên Thỏ Con", W / 2, 38, 18, "#fde68a", ease(seg(k, 0.05, 0.22)));
      text("Bảy người khách cùng đứng sau quầy gỗ, lần này họ pha nước cho Thỏ Con", W / 2, 60, 12, "rgba(253,230,200,.9)", ease(seg(k, 0.1, 0.28)), "normal");
      text("Một chén trà hoa cúc mật ong, một lát gừng mỏng, một lần lắng nghe thật lòng", W / 2, H - 22, 12, "#fde68a", ease(seg(k, 0.74, 0.92)));
    } },
    tw_birds: { dur: () => 6.0, draw(T, d) {
      const k = T / 6.0, dawn = ease(seg(k, 0.1, 0.9));
      const sky = ctx.createLinearGradient(0, 0, 0, H); sky.addColorStop(0, `rgb(${16 + 70 * dawn},${22 + 40 * dawn},${52 + 30 * dawn})`); sky.addColorStop(0.6, `rgb(${60 + 170 * dawn},${50 + 80 * dawn},${90 + 10 * dawn})`); sky.addColorStop(1, `rgb(${40 + 200 * dawn},${28 + 110 * dawn},${50})`); ctx.fillStyle = sky; ctx.fillRect(0, 0, W, H);
      stars(T, 40, 0.9 * (1 - dawn));
      // mặt trời mọc phía chân trời
      const sy = H * 0.78 - 60 * dawn; ctx.save(); ctx.globalCompositeOperation = "lighter"; const sg = ctx.createRadialGradient(W / 2, sy, 6, W / 2, sy, 180 + 80 * dawn); sg.addColorStop(0, `rgba(255,220,140,${0.85 * dawn})`); sg.addColorStop(1, "rgba(255,200,120,0)"); ctx.fillStyle = sg; ctx.fillRect(0, 0, W, H); ctx.restore();
      ctx.fillStyle = `rgba(255,235,170,${dawn})`; ctx.beginPath(); ctx.arc(W / 2, sy, 26, 0, 7); ctx.fill();
      ctx.fillStyle = "#1a1022"; ctx.beginPath(); ctx.moveTo(0, H); ctx.lineTo(0, H * 0.84); for (let x = 0; x <= W; x += 40) ctx.lineTo(x, H * 0.84 - 10 - 14 * Math.abs(Math.sin(x * 0.04))); ctx.lineTo(W, H); ctx.fill();
      // đèn lồng bay lên
      for (let i = 0; i < 14; i++) { const p = (T * 0.07 + rnd(i)) % 1, x = 40 + rnd(i + 3) * (W - 80) + Math.sin(T * 0.8 + i) * 12; emoji("🏮", x, H * 0.82 - p * (H * 0.9), 14 + rnd(i + 5) * 10, Math.sin(Math.min(1, p) * Math.PI) * 0.85); }
      // đàn chim bay về phía mặt trời
      const N = 26; for (let i = 0; i < N; i++) { const row = i % 7, p = clamp((T - 0.5 - rnd(i) * 0.9) / 4.6), x0 = 40 + rnd(i + 11) * (W - 80), sx = W / 2 + (rnd(i + 5) - 0.5) * 140, y0 = H * 0.8 - row * 6, ex = sx, ey = sy - 80 - rnd(i + 8) * 90;
        if (p <= 0) continue; const e = ease(p), x = x0 + (ex - x0) * e + Math.sin(T * 2 + i) * 8, y = y0 + (ey - y0) * e + Math.sin(T * 3 + i * 1.7) * 4, s = (1 - 0.55 * e) * (0.9 + rnd(i + 2) * 0.5), fl = Math.sin(T * 9 + i * 1.3);
        ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.strokeStyle = `rgba(30,18,40,${0.9 - 0.4 * e})`; ctx.lineWidth = 2.6; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(-14, -6 * fl); ctx.quadraticCurveTo(-6, -10 - 6 * fl, 0, 0); ctx.quadraticCurveTo(6, -10 - 6 * fl, 14, -6 * fl); ctx.stroke(); ctx.restore(); }
      // dải ruy băng tri ân
      const ra = ease(seg(T, 2.0, 3.2)), rx = W / 2, ry = 170; if (ra > 0) { ctx.save(); ctx.globalAlpha = ra; ctx.translate(rx, ry); ctx.scale(0.8 + 0.2 * ra, 0.8 + 0.2 * ra); ctx.strokeStyle = "#f4c25a"; ctx.lineWidth = 12; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(0, 6); ctx.bezierCurveTo(-46, -34, -22, -62, 0, -34); ctx.bezierCurveTo(22, -62, 46, -34, 0, 6); ctx.stroke(); ctx.lineWidth = 11; ctx.beginPath(); ctx.moveTo(0, 6); ctx.lineTo(-24, 56); ctx.moveTo(0, 6); ctx.lineTo(24, 56); ctx.stroke(); ctx.restore(); }
      serif("🕊️ Lời tri ân", W / 2, 38, 18, "#fff3d6", ease(seg(k, 0.05, 0.25)));
      text("Gửi những người đã và đang chiến đấu với ung thư", W / 2, 60, 12, "rgba(255,240,220,.92)", ease(seg(k, 0.12, 0.3)), "normal");
      text("Bạn không có lỗi khi kiệt sức. Bạn không phải một mình.", W / 2, H - 44, 13, "#fff3d6", ease(seg(k, 0.55, 0.72)), "bold", "'Lora',Georgia,serif");
      text("Ngọn đèn này cũng được thắp lên vì những người đã không thể ở lại.", W / 2, H - 22, 12, "rgba(255,240,220,.9)", ease(seg(k, 0.72, 0.9)), "normal", "'Lora',Georgia,serif");
    } }
  };
  function counterLine(y) { ctx.fillStyle = "rgba(255,235,200,.25)"; ctx.fillRect(W / 2 - 280, y, 560, 2); }

  /* ---------- vòng chạy ---------- */
  function frame(now) {
    if (!cur || !ctx) return;
    const T = (now - cur.t0) / 1000;
    ctx.clearRect(0, 0, W, H); ctx.textAlign = "start";
    try { SCENES[cur.kind].draw(T, cur.data); } catch (e) { if (typeof console !== "undefined") console.warn("SceneFX:", cur.kind, e && e.message); }
    const fi = 1 - seg(T, 0, 0.35); if (fi > 0) { ctx.fillStyle = `rgba(4,2,8,${fi})`; ctx.fillRect(0, 0, W, H); }
    if (T > cur.dur) { finish(); return; }
    raf = requestAnimationFrame(frame);
  }
  function arm() {
    clearTimeout(guard);
    guard = setTimeout(() => {
      if (!cur) return;
      const left = cur.dur * 1000 - (performance.now() - cur.t0);
      if (left > 600) arm(); else finish();
    }, Math.min(6000, cur.dur * 1000 + 1500));
  }
  function finish() {
    if (!cur) return;
    cancelAnimationFrame(raf); clearTimeout(guard);
    const cb = cur.onDone; cur = null;
    if (queue.length) { const nx = queue.shift(); startScene(nx); }
    else { overlay.style.opacity = "0"; setTimeout(() => { if (overlay && !cur) overlay.style.display = "none"; }, 480); }
    if (cb) { try { cb(); } catch (e) { /* bỏ qua */ } }
  }
  function startScene(s) {
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    canvas.width = W * dpr; canvas.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const dur = SCENES[s.kind].dur(s.data || {});
    cur = { kind: s.kind, data: s.data || {}, dur, t0: performance.now(), onDone: s.onDone };
    arm(); overlay.style.display = "flex"; overlay.style.opacity = "1";
    try { audioEngine.playChime(s.kind === "close" ? 330 : 523, 0.3, 0.03); if (s.kind === "week" || s.kind === "bloom" || s.kind === "month" || s.kind === "secret") setTimeout(() => audioEngine.playChime(784, 0.5, 0.04), 1800); } catch (e) { /* không có âm thanh */ }
    raf = requestAnimationFrame(frame);
  }
  /* kind: open|close|chapter|secret|week|cassette|bloom|cat|month. Trả true nếu đã nhận cảnh (chiếu hoặc xếp hàng). */
  function play(kind, data, onDone) {
    try {
      if (reduce || !SCENES[kind]) return false;
      if (!overlay) build();
      if (!ctx || typeof stageRenderer === "undefined") return false;
      const rs = typeof runState !== "undefined" ? runState : null;   // bỏ lời gọi cũ nếu ván đã bị đặt lại trong lúc chiếu
      const s = { kind, data, onDone: onDone ? () => { if (typeof runState === "undefined" || runState === rs) onDone(); } : null };
      if (cur) queue.push(s); else startScene(s);
      return true;
    } catch (e) { return false; }
  }

  /* ---------- biểu ngữ thành tựu (DOM) ---------- */
  let bannerBusy = false; const bq = [];
  function banner(icon, title, sub) {
    try {
      if (reduce || typeof document === "undefined") return false;
      bq.push([icon, title, sub]); if (!bannerBusy) nextBanner(); return true;
    } catch (e) { return false; }
  }
  function nextBanner() {
    const it = bq.shift(); if (!it) { bannerBusy = false; return; }
    bannerBusy = true;
    const el = document.createElement("div");
    el.style.cssText = "position:fixed;left:50%;top:14px;transform:translate(-50%,-140%);z-index:80;min-width:240px;max-width:92vw;padding:10px 16px;border-radius:18px;background:linear-gradient(135deg,#7a4a1e,#3a2210);border:2px solid #f5c76a;color:#fff3d6;box-shadow:0 8px 28px rgba(0,0,0,.5),0 0 24px rgba(245,199,106,.45);display:flex;gap:12px;align-items:center;transition:transform .5s cubic-bezier(.2,1.3,.4,1),opacity .4s;pointer-events:none;font-family:'Inter',sans-serif";
    el.innerHTML = `<div style="font-size:30px;filter:drop-shadow(0 0 8px #f5c76a)">${it[0]}</div><div><div style="font-size:10px;letter-spacing:.14em;color:#f5c76a">THÀNH TỰU MỚI</div><div style="font-weight:700;font-size:14px">${it[1]}</div>${it[2] ? `<div style="font-size:11px;opacity:.8">${it[2]}</div>` : ""}</div>`;
    document.body.appendChild(el);
    requestAnimationFrame(() => { el.style.transform = "translate(-50%,0)"; });
    setTimeout(() => { el.style.opacity = "0"; el.style.transform = "translate(-50%,-140%)"; }, 2800);
    setTimeout(() => { el.remove(); nextBanner(); }, 3400);
  }

  /* ---------- chạm đồ vật trên sân khấu: lần đầu và mỗi 10 lần chiếu cận cảnh; xong mới chạy hành động mặc định ---------- */
  const SYR = [["🍯 Chai mật ong gừng", "ấm cổ họng — hợp những đêm trời trở lạnh."], ["🌹 Chai siro hoa hồng", "thơm nhẹ, dành cho người cần được dỗ dành."], ["🍵 Chai trà matcha", "đắng dịu, giúp đầu óc tỉnh mà không căng."], ["🫐 Chai siro việt quất", "chua ngọt vừa phải, vị của những ngày mới bắt đầu."], ["☕ Chai caramel cháy", "ngọt hơi đắng — như chuyện cũ kể lại lần nữa."]];
  const LIQCOL = { phin: "#5a3317", coldbrew: "#3b2314", malt: "#c27a24", plum: "#c0485f", peach_tea: "#f2a65a", yuzu: "#e8c547", lotus_milk: "#efe3c8" };
  const OBJ = {
    bottle: (b) => { const it = SYR[(b.idx || 0) % SYR.length]; return { kind: "obj_bottle", idx: b.idx || 0, title: it[0], sub: it[1] }; },
    fishtank: () => ({ kind: "obj_fish", n: (persistentArchive.fishFeedCount || 0) + 1 }),
    stove: () => ({ kind: "obj_stove" }),
    keepsakes: () => { const ids = typeof STANDARD_GUEST_ORDER !== "undefined" ? STANDARD_GUEST_ORDER : []; const items = ids.map((id) => ({ icon: CHARACTERS[id].keepsake ? CHARACTERS[id].keepsake.icon : "🎁", got: !!persistentArchive.unlockedKeepsakes[id] })); return { kind: "obj_keep", items, got: items.filter((x) => x.got).length, total: items.length }; },
    plant: () => { const w = persistentArchive.plantWater || 0; return { kind: "obj_plant", water: w + 1, stage: Math.min(5, Math.floor((w + 1) / 3)) }; },
    cup: () => ({ kind: "obj_cup", name: (runState && runState.lastDrinkName) || "Ly nước của quán", quality: (runState && runState.lastBrewQuality) || "", col: "#c27a24" }),
    cat: () => ({ kind: "cat" }),
    clock: () => ({ kind: "obj_clock", time: (runState && typeof runState.clock === "string" && /^\d\d:\d\d$/.test(runState.clock)) ? runState.clock : "03:20" }),
    radio: () => ({ kind: "obj_radio", news: (runState && runState.previousNightRadioNews) || "" }),
    shelf: () => ({ kind: "obj_shelf" }),
    window: () => { const s = stageRenderer.getActiveSeason(); return { kind: "obj_window", icon: s.icon, name: String(s.name).replace(/^\S+\s/, ""), desc: s.desc, kind2: "rain" }; },
    bunny: () => ({ kind: "obj_bunny" }),
    guest: (b) => { const ex = typeof EXTRA_DIALOGUE_BANK !== "undefined" && b.guest && EXTRA_DIALOGUE_BANK.soloExtra[b.guest.id]; const lines = (ex && ex.stageTapLines) || []; return { kind: "obj_guest", guest: b.guest, line: lines.length ? lines[Math.floor(Math.random() * lines.length)] : "Vị khách khẽ mỉm cười thưởng thức không gian yên bình của quán." }; }
  };
  /* Trả true nếu đã chiếu cận cảnh (hành động mặc định sẽ chạy sau khi cảnh xong) */
  function touch(box, cont) {
    try {
      if (!box || !OBJ[box.id] || typeof persistentArchive === "undefined") return false;
      const a = persistentArchive; a.objTaps = a.objTaps || {};
      const n = (a.objTaps[box.id] = (a.objTaps[box.id] || 0) + 1);
      if (!(n === 1 || n % 10 === 0)) return false;
      const d = OBJ[box.id](box);
      if (d.kind === "obj_window") d.kind = "obj_window";
      const kind = d.kind; if (kind === "obj_window") d.kind = "rain";
      if (typeof saveArchive === "function" && n === 1) saveArchive();
      return play(kind, d, cont);
    } catch (e) { return false; }
  }
  return { play, banner, touch, scenes: Object.keys(SCENES) };
})();
