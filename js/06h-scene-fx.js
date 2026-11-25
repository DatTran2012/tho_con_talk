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
    month: { dur: (d) => 3.0 + (d.guests ? d.guests.length : 7) * 0.7, draw(T, d) {
      const gs = d.guests || [], n = gs.length || 1; warmBg();
      drift(T, "spark", 18);
      const gx = (i) => W / 2 + (i - (n - 1) / 2) * Math.min(86, 560 / n);
      gs.forEach((g, i) => { const a = ease(seg(T, 0.6 + i * 0.7, 1.2 + i * 0.7)); if (a <= 0) return; ctx.save(); ctx.globalAlpha = a; person(gx(i), 262 + (1 - a) * 30, 0.95, g, "happy", T); ctx.restore(); text(String(g.name).split(" (")[0].split(" ").slice(-1)[0], gx(i), 288, 11, "#fde68a", a); });
      const t1 = 0.6 + n * 0.7 + 0.3;
      serif("28 đêm — một tháng ở Tiệm Nước Nửa Đêm", W / 2, 44, 18, "#fde68a", ease(seg(T, 0.2, 0.7)));
      text(`${d.drinks || 0} ly nước đã rót • ${d.endings || 0} kết cục đã gặp`, W / 2, 68, 12, "rgba(253,230,200,.9)", ease(seg(T, 0.4, 0.9)), "normal");
      serif("Cảm ơn vì đã ở lại, Thỏ Con.", W / 2, H - 50, 20, "#fff3d6", ease(seg(T, t1, t1 + 0.8)));
    } }
  };
  function counterLine(y) { ctx.fillStyle = "rgba(255,235,200,.25)"; ctx.fillRect(W / 2 - 280, y, 560, 2); }

  /* ---------- vòng chạy ---------- */
  function frame(now) {
    if (!cur || !ctx) return;
    const T = (now - cur.t0) / 1000;
    ctx.clearRect(0, 0, W, H); ctx.textAlign = "start";
    try { SCENES[cur.kind].draw(T, cur.data); } catch (e) { /* một khung lỗi thì bỏ qua */ }
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
  return { play, banner, scenes: Object.keys(SCENES) };
})();
