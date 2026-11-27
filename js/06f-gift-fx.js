"use strict";
/* Cắt cảnh cuối đêm: (1) khách đưa tặng kỷ vật cho Thỏ Con -> bay lên tủ kỷ vật; (2) khách viết lời nhắn lên mảnh giấy rồi ghim lên bảng.
   Chạm để bỏ qua. Hết cảnh mới sang bước kế tiếp của game. Lỗi/không vẽ được thì bỏ qua êm. */
const GiftFX = (function () {
  const W = 640, H = 400, SEG = 2.7, EMOJI = '"Segoe UI Emoji","Apple Color Emoji","Noto Color Emoji",sans-serif';
  let overlay = null, canvas = null, ctx = null, raf = 0, st = null, guard = 0;
  const reduce = typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;
  const clamp = (x) => Math.min(1, Math.max(0, x));
  const ease = (x) => 1 - Math.pow(1 - clamp(x), 3);
  const seg = (t, a, b) => clamp((t - a) / (b - a));
  const rnd = (i) => { const x = Math.sin(i * 91.7 + 13.3) * 43758.5453; return x - Math.floor(x); };

  function build() {
    overlay = document.createElement("div");
    overlay.id = "gift-fx-overlay";
    overlay.style.cssText = "position:fixed;inset:0;z-index:70;display:none;align-items:center;justify-content:center;background:radial-gradient(circle at 50% 45%,rgba(60,32,14,.94),rgba(8,4,2,.97));transition:opacity .45s;cursor:pointer";
    canvas = document.createElement("canvas");
    canvas.style.cssText = "width:min(100%,760px);aspect-ratio:640/400;border-radius:20px";
    overlay.appendChild(canvas);
    const hint = document.createElement("div");
    hint.textContent = "Chạm để bỏ qua";
    hint.style.cssText = "position:absolute;bottom:18px;left:0;right:0;text-align:center;font:11px 'JetBrains Mono',monospace;color:rgba(253,230,138,.6)";
    overlay.appendChild(hint);
    overlay.addEventListener("click", close);
    document.body.appendChild(overlay);
    try { ctx = canvas.getContext("2d"); } catch (e) { ctx = null; }
  }
  function backdrop(T) {
    const bg = ctx.createLinearGradient(0, 0, 0, H); bg.addColorStop(0, "#3a2214"); bg.addColorStop(0.7, "#5a3419"); bg.addColorStop(1, "#2a160c");
    ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
    const gl = ctx.createRadialGradient(W / 2, 40, 10, W / 2, 40, 330); gl.addColorStop(0, "rgba(255,200,120,.35)"); gl.addColorStop(1, "rgba(255,200,120,0)");
    ctx.fillStyle = gl; ctx.fillRect(0, 0, W, H);
  }
  function counter(cy) {
    const wg = ctx.createLinearGradient(0, cy, 0, H); wg.addColorStop(0, "#9a5a2a"); wg.addColorStop(1, "#2a160c");
    ctx.fillStyle = wg; ctx.fillRect(0, cy, W, H - cy); ctx.fillStyle = "rgba(255,235,200,.28)"; ctx.fillRect(0, cy, W, 2);
  }
  function title(a, b, al) {
    ctx.textAlign = "center"; ctx.globalAlpha = al;
    ctx.fillStyle = "#fde68a"; ctx.font = "bold 18px 'Lora',Georgia,serif"; ctx.fillText(a, W / 2, 34);
    ctx.globalAlpha = al * 0.8; ctx.fillStyle = "rgba(253,230,200,.9)"; ctx.font = "12px 'Inter',sans-serif"; ctx.fillText(b, W / 2, 54);
    ctx.textAlign = "start"; ctx.globalAlpha = 1;
  }
  function emoji(ch, x, y, size, a) { ctx.globalAlpha = a; ctx.font = `${size}px ${EMOJI}`; ctx.textAlign = "center"; ctx.fillStyle = "#000"; ctx.fillText(ch, x, y); ctx.textAlign = "start"; ctx.globalAlpha = 1; }
  function wrap(text, maxW, font) {
    ctx.font = font; const words = String(text).split(/\s+/), lines = []; let cur = "";
    words.forEach((w) => { const t = cur ? cur + " " + w : w; if (ctx.measureText(t).width > maxW && cur) { lines.push(cur); cur = w; } else cur = t; });
    if (cur) lines.push(cur); return lines;
  }

  /* ---- Phần 1: đưa kỷ vật ---- */
  function drawGift(T, s) {
    const g = s.guest, cy = H * 0.74, sc = 2.5;
    const give = seg(T, 0.3, 1.25), hold = T > 1.25 && T < 1.95, fly = ease(seg(T, 1.95, 2.6));
    backdrop(T);
    // tủ kỷ vật nhỏ ở góc trên bên phải: đích đến
    const kx = W * 0.9, ky = 92;
    ctx.fillStyle = "rgba(60,30,12,.9)"; ctx.strokeStyle = "#c08a4e"; ctx.lineWidth = 2;
    ctx.fillRect(kx - 30, ky - 34, 60, 70); ctx.strokeRect(kx - 30, ky - 34, 60, 70);
    ctx.fillStyle = "rgba(253,230,138,.12)"; ctx.fillRect(kx - 26, ky - 30, 52, 62);
    ctx.fillStyle = "#c08a4e"; ctx.fillRect(kx - 30, ky - 2, 60, 2);
    ctx.font = "bold 9px 'Inter',sans-serif"; ctx.fillStyle = "rgba(253,230,200,.8)"; ctx.textAlign = "center"; ctx.fillText("Tủ Kỷ Vật", kx, ky + 50); ctx.textAlign = "start";
    try {
      stageRenderer.drawBunnyBarista(ctx, W * 0.24, cy + 4, sc, false, false, T, T > 1.9 ? "happy" : T > 1.0 ? "surprised" : "neutral", false);
      stageRenderer.drawPersonPortrait(ctx, W * 0.74, cy + 4, sc, { hairColor: g.hairColor, outfitColor: g.outfitColor, accessory: g.accessory, isTalking: false, listening: false, emotion: T > 1.4 ? "happy" : "shy", timeSec: T, seed: 1.5 });
    } catch (e) { /* vẽ nhân vật lỗi thì vẫn chạy phần còn lại */ }
    counter(cy);
    // món quà: bay vòng cung từ tay khách đến giữa quầy, treo lơ lửng, rồi bay lên tủ
    const gx0 = W * 0.64, gy0 = cy - 40, gx1 = W * 0.44, gy1 = cy - 70;
    let x, y, sz = 54, glow = 0;
    if (T < 1.95) { const p = ease(give); x = gx0 + (gx1 - gx0) * p; y = gy0 + (gy1 - gy0) * p - Math.sin(p * Math.PI) * 40 + (hold ? Math.sin((T - 1.25) * 5) * 3 : 0); glow = clamp((T - 1.0) * 1.2); }
    else { x = gx1 + (kx - gx1) * fly; y = gy1 + (ky - gy1) * fly - Math.sin(fly * Math.PI) * 50; sz = 54 - 28 * fly; glow = 1 - fly; }
    if (T > 0.25) {
      if (glow > 0) { ctx.save(); ctx.globalCompositeOperation = "lighter"; const rg = ctx.createRadialGradient(x, y - 18, 4, x, y - 18, 20 + 70 * glow); rg.addColorStop(0, `rgba(255,225,140,${0.5 * glow})`); rg.addColorStop(1, "rgba(255,225,140,0)"); ctx.fillStyle = rg; ctx.fillRect(0, 0, W, H); ctx.restore(); }
      emoji(s.icon, x, y, sz, 1);
      if (T < 1.95 && T > 1.2) { ctx.strokeStyle = "#f87171"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x - 24, y - 30); ctx.lineTo(x + 24, y - 30); ctx.stroke(); }  // dải ruy băng
    }
    if (hold) for (let i = 0; i < 8; i++) { const p = ((T - 1.25) * 0.9 + rnd(i)) % 1; emoji("✨", x + (rnd(i + 3) - 0.5) * 120, y - 20 - p * 60, 12 + rnd(i + 7) * 8, Math.sin(p * Math.PI) * 0.9); }
    if (fly > 0.92) { const p = seg(T, 2.5, 2.7); for (let i = 0; i < 6; i++) emoji("✨", kx + (rnd(i) - 0.5) * 60, ky + (rnd(i + 9) - 0.5) * 60 - p * 12, 12, 1 - p); }
    title("🏺 Kỷ vật mới", `${s.name} đưa tặng Thỏ Con`, ease(seg(T, 0.1, 0.7)));
    const t2 = ease(seg(T, 1.3, 1.9)) * (1 - ease(seg(T, 2.3, 2.7)));
    ctx.textAlign = "center"; ctx.globalAlpha = t2; ctx.fillStyle = "#fde68a"; ctx.font = "bold 15px 'Inter',sans-serif"; ctx.fillText(s.item, W / 2, H - 24); ctx.textAlign = "start"; ctx.globalAlpha = 1;
  }

  /* ---- Phần 2: viết lời nhắn lên giấy note rồi ghim lên bảng ---- */
  function drawNote(T, s) {
    backdrop(T);
    // bảng ghim
    ctx.fillStyle = "#8b5a2b"; ctx.fillRect(60, 70, W - 120, 250);
    ctx.fillStyle = "#c58f55"; ctx.fillRect(70, 80, W - 140, 230);
    for (let i = 0; i < 90; i++) { ctx.fillStyle = `rgba(90,52,20,${0.12 + rnd(i) * 0.12})`; ctx.fillRect(70 + rnd(i + 1) * (W - 145), 80 + rnd(i + 2) * 225, 2, 2); }
    // vài tờ note cũ mờ
    const old = [["#fef3a7", 100, 105, -0.1], ["#fbcfe8", 440, 118, 0.08], ["#bbf7d0", 120, 215, 0.07], ["#bae6fd", 455, 220, -0.06]];
    old.forEach(([c, x, y, r]) => { ctx.save(); ctx.translate(x + 40, y + 35); ctx.rotate(r); ctx.fillStyle = c; ctx.globalAlpha = 0.45; ctx.fillRect(-40, -35, 80, 70); ctx.restore(); });
    ctx.globalAlpha = 1;
    // tờ note mới trượt vào, hơi nghiêng, rồi ghim lại
    const slide = ease(seg(T, 0.2, 0.8)), pin = ease(seg(T, 2.0, 2.3));
    const nx = W / 2, ny = 195 + (1 - slide) * 140, rot = -0.05 + (1 - slide) * 0.18 + pin * 0.0;
    ctx.save(); ctx.translate(nx, ny); ctx.rotate(rot); ctx.scale(1 + 0.05 * (1 - pin) * 0, 1);
    ctx.shadowColor = "rgba(0,0,0,.4)"; ctx.shadowBlur = 14; ctx.shadowOffsetY = 6;
    ctx.fillStyle = "#fde68a"; ctx.fillRect(-120, -78, 240, 156); ctx.shadowColor = "transparent";
    ctx.fillStyle = "rgba(180,120,30,.18)"; ctx.fillRect(-120, -78, 240, 20);
    ctx.fillStyle = "#7c4a12"; ctx.font = "bold 12px 'Inter',sans-serif"; ctx.fillText(`${s.nightLabel} • ${s.guestName}`, -106, -62);
    // chữ hiện dần như đang viết tay
    const font = "17px 'Caveat','Segoe Script','Bradley Hand',cursive";
    const lines = wrap(s.text, 212, font), total = lines.join("").length, shown = Math.floor(total * seg(T, 0.9, 2.2));
    let used = 0, last = null; ctx.font = font; ctx.fillStyle = "#3b2208";
    lines.forEach((ln, i) => { const n = Math.max(0, Math.min(ln.length, shown - used)); used += ln.length; const part = ln.slice(0, n); ctx.fillText(part, -106, -34 + i * 22); if (n > 0 && n < ln.length || (n === ln.length && shown <= used && shown > used - ln.length)) last = [-106 + ctx.measureText(part).width, -34 + i * 22]; });
    ctx.restore();
    // cây bút di chuyển theo nét chữ
    if (T > 0.9 && T < 2.3 && last) { const c = Math.cos(rot), sn = Math.sin(rot); const px = nx + last[0] * c - last[1] * sn, py = ny + last[0] * sn + last[1] * c; emoji("🖊️", px + 10, py - 4, 24, 1); }
    // ghim
    if (T > 2.0) { const dy = (1 - pin) * -30; emoji("📌", nx, ny - 82 + dy, 26, pin); }
    title("📝 Lời nhắn để lại", `${s.guestName} viết vài dòng lên bảng ghi chú`, ease(seg(T, 0.1, 0.7)));
  }

  function frame(now) {
    if (!st || !ctx) return;
    const T = (now - st.t0) / 1000, i = Math.min(st.segs.length - 1, Math.floor(T / SEG)), lt = T - i * SEG, s = st.segs[i];
    ctx.clearRect(0, 0, W, H);
    try { s.kind === "gift" ? drawGift(lt, s) : drawNote(lt, s); } catch (e) { /* một khung lỗi thì bỏ qua */ }
    // chuyển cảnh: mờ vào đầu mỗi đoạn
    const fi = 1 - seg(lt, 0, 0.35); if (fi > 0) { ctx.fillStyle = `rgba(4,2,8,${fi})`; ctx.fillRect(0, 0, W, H); }
    if (T > st.segs.length * SEG) { close(); return; }
    raf = requestAnimationFrame(frame);
  }
  let vid = 0;
  function close() {
    if (!overlay || !st) return;
    cancelAnimationFrame(raf); clearTimeout(guard);
    const cb = st.onDone, myVid = vid; st = null;
    overlay.style.opacity = "0";
    if (cb) { try { cb(); } catch (e) { /* bỏ qua */ } }
    try { CafeVoice.release("gift", myVid); } catch (e) { /* bỏ qua */ }
    setTimeout(() => { if (overlay && !st) overlay.style.display = "none"; }, 480);
  }
  function arm() {
    clearTimeout(guard);
    guard = setTimeout(() => {
      if (!st) return;
      const left = st.segs.length * SEG * 1000 - (performance.now() - st.t0);
      if (left > 600) arm(); else close();
    }, Math.min(6000, st.segs.length * SEG * 1000 + 1500));
  }
  /* info: {guests:[...], gifts:[{guest, icon, name}], note:{nightLabel, guestName, text}} */
  function play(info, onDone) {
    try {
      if (reduce || !info || !info.note) return false;
      if (!overlay) build();
      if (!ctx || typeof stageRenderer === "undefined") return false;
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = W * dpr; canvas.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cancelAnimationFrame(raf);
      const segs = (info.gifts || []).slice(0, 2).map((g) => ({ kind: "gift", guest: g.guest, icon: g.icon, item: g.name, name: String(g.guest.name || "khách").split(" (")[0] }))
        .concat([{ kind: "note", ...info.note }]);
      const rs0 = typeof runState !== "undefined" ? runState : null;
      st = { segs, t0: performance.now(), onDone: onDone ? () => { if (typeof runState === "undefined" || runState === rs0) onDone(); } : null };
      arm();
      overlay.style.display = "flex"; overlay.style.opacity = "1"; try { vid = CafeVoice.hold("gift"); } catch (e) { /* bỏ qua */ }
      try { segs.forEach((s, i) => setTimeout(() => audioEngine.playChime(s.kind === "gift" ? 659 : 392, 0.3, 0.035), i * SEG * 1000 + 700)); } catch (e) { /* không có âm thanh */ }
      raf = requestAnimationFrame(frame);
      return true;
    } catch (e) { return false; }
  }
  return { play, close };
})();
