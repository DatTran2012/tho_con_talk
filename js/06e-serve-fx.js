"use strict";
/* Cắt cảnh "mời nước": Thỏ Con đẩy ly trượt qua mặt quầy -> khách nhìn ly -> nhấp một ngụm -> biểu cảm theo chất lượng ly.
   Chạm để bỏ qua. Chỉ là lớp phủ; hết cảnh mới hiện lời cảm nhận của khách. Lỗi/không có canvas thì bỏ qua êm. */
const ServeFX = (function () {
  const W = 640, H = 400, DUR = 5.2;
  let overlay = null, canvas = null, ctx = null, raf = 0, st = null, guard = 0;
  const reduce = typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;
  const clamp = (x) => Math.min(1, Math.max(0, x));
  const ease = (x) => 1 - Math.pow(1 - clamp(x), 3);
  const seg = (t, a, b) => clamp((t - a) / (b - a));
  const rnd = (i) => { const x = Math.sin(i * 91.7 + 13.3) * 43758.5453; return x - Math.floor(x); };
  const LIQ = { phin: "#5a3317", coldbrew: "#3b2314", malt: "#c27a24", plum: "#c0485f", peach_tea: "#f2a65a" };
  const MOOD = {
    perfect: { emo: "happy", cap: "Hoàn Hảo — mắt khách sáng lên!", verb: "mắt sáng lên, bật cười thật tươi" },
    good: { emo: "happy", cap: "Chuẩn Vị — khách mỉm cười dịu dàng", verb: "mỉm cười, vai thả lỏng hẳn" },
    plain: { emo: "thinking", cap: "Mộc Mạc — khách ngẫm nghĩ, gật gù", verb: "ngẫm nghĩ một lúc rồi gật nhẹ" }
  };

  function build() {
    overlay = document.createElement("div");
    overlay.id = "serve-fx-overlay";
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
  function cup(c, x, y, s, liquid, fill, steam, T) {
    c.save(); c.translate(x, y); c.scale(s, s);
    c.fillStyle = "rgba(0,0,0,.28)"; c.beginPath(); c.ellipse(0, 2, 24, 5, 0, 0, 7); c.fill();
    c.fillStyle = "rgba(255,255,255,.2)"; c.strokeStyle = "#f3e2c4"; c.lineWidth = 2.2;
    c.beginPath(); c.moveTo(-17, -40); c.lineTo(-13, 0); c.lineTo(13, 0); c.lineTo(17, -40); c.closePath(); c.fill(); c.stroke();
    c.fillStyle = liquid; const top = -40 + 40 * (1 - fill);
    c.beginPath(); c.moveTo(-17 + 4 * (top + 40) / 40 * 0.1 - 0, top); c.lineTo(17, top); c.lineTo(13.5, -2); c.lineTo(-13.5, -2); c.closePath(); c.fill();
    c.fillStyle = "rgba(255,255,255,.35)"; c.fillRect(-12, -36, 3, 28);
    c.strokeStyle = "#f3e2c4"; c.lineWidth = 3; c.beginPath(); c.arc(21, -22, 7, -1.2, 1.2); c.stroke();
    if (steam) { c.strokeStyle = "rgba(255,255,255,.4)"; c.lineWidth = 2; c.lineCap = "round";
      for (let i = 0; i < 3; i++) { const p = ((T * 0.5 + i / 3) % 1); c.globalAlpha = 0.5 * (1 - p); c.beginPath(); c.moveTo(-8 + i * 8, -44); c.bezierCurveTo(-12 + i * 8 + Math.sin(T * 2 + i) * 4, -52 - p * 20, -4 + i * 8, -60 - p * 22, -8 + i * 8 + Math.sin(T * 2 + i) * 5, -70 - p * 26); c.stroke(); }
      c.globalAlpha = 1; }
    c.restore();
  }
  function frame(now) {
    if (!st || !ctx) return;
    const T = (now - st.t0) / 1000, g = st.guest, M = MOOD[st.q];
    ctx.clearRect(0, 0, W, H);
    // nền quán ấm
    const bg = ctx.createLinearGradient(0, 0, 0, H); bg.addColorStop(0, "#3a2214"); bg.addColorStop(0.7, "#5a3419"); bg.addColorStop(1, "#2a160c");
    ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
    const gl = ctx.createRadialGradient(W / 2, 40, 10, W / 2, 40, 330); gl.addColorStop(0, "rgba(255,200,120,.35)"); gl.addColorStop(1, "rgba(255,200,120,0)");
    ctx.fillStyle = gl; ctx.fillRect(0, 0, W, H);
    // nhân vật (đứng sau quầy)
    const cy = H * 0.74, sc = 2.5;
    const looking = T > 1.5, sip = seg(T, 2.5, 3.5), react = T > 3.4;
    const gEmo = react ? M.emo : looking ? "curious" : "neutral";
    try {
      stageRenderer.drawBunnyBarista(ctx, W * 0.24, cy + 4, sc, false, false, T, T > 3.4 ? "happy" : "neutral", false);
      stageRenderer.drawPersonPortrait(ctx, W * 0.74, cy + 4, sc, {
        hairColor: g.hairColor, outfitColor: g.outfitColor, accessory: g.accessory,
        isTalking: false, listening: !react && !looking, emotion: gEmo, timeSec: T, seed: 1.5
      });
    } catch (e) { /* vẽ nhân vật lỗi thì vẫn chạy phần còn lại */ }
    // mặt quầy
    const wg = ctx.createLinearGradient(0, cy, 0, H); wg.addColorStop(0, "#9a5a2a"); wg.addColorStop(1, "#2a160c");
    ctx.fillStyle = wg; ctx.fillRect(0, cy, W, H - cy); ctx.fillStyle = "rgba(255,235,200,.28)"; ctx.fillRect(0, cy, W, 2);
    // ly: Thỏ Con đẩy trượt sang khách, rồi khách nhấc lên nhấp
    const slide = ease(seg(T, 0.7, 1.9));
    const x0 = W * 0.34, x1 = W * 0.6;
    let cx = x0 + (x1 - x0) * slide, cyc = cy + 18 + (1 - Math.abs(slide - 0.5) * 2) * 0;
    let lift = 0, tilt = 0;
    if (sip > 0) { const up = Math.sin(sip * Math.PI); lift = up * 36; tilt = -0.35 * up; cx += up * 14; }
    const fill = 0.9 - 0.16 * Math.sin(sip * Math.PI * 0.5) * (sip > 0.5 ? 1 : 0.4);
    ctx.save(); ctx.translate(cx, cyc - lift); ctx.rotate(tilt); ctx.translate(-cx, -(cyc - lift));
    cup(ctx, cx, cyc - lift, 1.15, LIQ[st.baseId] || "#b4672a", fill, T > 1.9 && sip < 0.15 || T > 3.7, T); ctx.restore();
    // bàn tay đẩy ly
    if (T > 0.5 && T < 2.0) {
      ctx.fillStyle = "#f5eadf"; ctx.strokeStyle = "#2b1b14"; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.ellipse(cx - 34, cyc - 8, 12, 9, 0, 0, 7); ctx.fill(); ctx.stroke();
    }
    // phản ứng: tim / lấp lánh / dấu "..." theo chất lượng
    if (react) {
      const r = seg(T, 3.4, 4.4);
      if (st.q === "perfect") {
        ctx.save(); ctx.globalCompositeOperation = "lighter";
        const rg = ctx.createRadialGradient(W * 0.74, cy - 90, 5, W * 0.74, cy - 90, 40 + 150 * r); rg.addColorStop(0, `rgba(255,230,150,${0.4 * (1 - r * 0.5)})`); rg.addColorStop(1, "rgba(255,230,150,0)");
        ctx.fillStyle = rg; ctx.fillRect(0, 0, W, H); ctx.restore();
        for (let i = 0; i < 9; i++) {
          const p = ((T - 3.4) * 0.45 + rnd(i)) % 1, hx = W * 0.74 + (rnd(i + 3) - 0.5) * 150, hy = cy - 70 - p * 110;
          ctx.globalAlpha = Math.sin(p * Math.PI); ctx.font = `${14 + rnd(i + 7) * 10}px "Segoe UI Emoji","Apple Color Emoji","Noto Color Emoji",sans-serif`; ctx.textAlign = "center"; ctx.fillStyle = "#000";
          ctx.fillText(i % 3 ? "✨" : "💛", hx, hy);
        }
        ctx.globalAlpha = 1; ctx.textAlign = "start";
      } else if (st.q === "good") {
        ctx.globalAlpha = Math.sin(clamp((T - 3.4) / 1.6) * Math.PI); ctx.font = "22px \"Segoe UI Emoji\",\"Apple Color Emoji\",\"Noto Color Emoji\",sans-serif"; ctx.fillStyle = "#000"; ctx.fillText("♪", W * 0.74 + 40, cy - 130 - r * 14); ctx.globalAlpha = 1;
      } else {
        ctx.globalAlpha = Math.sin(clamp((T - 3.4) / 1.6) * Math.PI); ctx.fillStyle = "#fde68a"; ctx.font = "bold 22px sans-serif"; ctx.fillText("…", W * 0.74 + 36, cy - 128); ctx.globalAlpha = 1;
      }
    }
    // chữ
    const tx = ease(seg(T, 0.2, 0.9));
    ctx.textAlign = "center"; ctx.globalAlpha = tx; ctx.fillStyle = "#fde68a"; ctx.font = "bold 18px 'Lora',Georgia,serif";
    ctx.fillText(st.drink, W / 2, 34);
    ctx.globalAlpha = tx * 0.8; ctx.font = "12px 'Inter',sans-serif"; ctx.fillStyle = "rgba(253,230,200,.9)";
    ctx.fillText(`Thỏ Con đẩy ly sang cho ${st.name}`, W / 2, 54);
    const t2 = ease(seg(T, 3.5, 4.1)); ctx.globalAlpha = t2; ctx.fillStyle = "#fde68a"; ctx.font = "bold 15px 'Inter',sans-serif";
    ctx.fillText(M.cap, W / 2, H - 22 + (1 - t2) * 6);
    ctx.textAlign = "start"; ctx.globalAlpha = 1;
    const fi = 1 - seg(T, 0, 0.4); if (fi > 0) { ctx.fillStyle = `rgba(4,2,8,${fi})`; ctx.fillRect(0, 0, W, H); }
    if (T > DUR) { close(); return; }
    raf = requestAnimationFrame(frame);
  }
  let vid = 0;
  function close() {
    if (!overlay || !st) return;
    cancelAnimationFrame(raf); clearTimeout(guard);
    const cb = st.onDone, myVid = vid; st = null;
    overlay.style.opacity = "0";
    if (cb) { try { cb(); } catch (e) { /* bỏ qua */ } }
    try { CafeVoice.release("serve", myVid); } catch (e) { /* bỏ qua */ }
    setTimeout(() => { if (overlay && !st) overlay.style.display = "none"; }, 480);
  }
  /* info: {guest, baseId, quality ("perfect"|"good"|"plain"), drink} */
  function play(info, onDone) {
    try {
      if (reduce || !info || !info.guest) return false;
      if (!overlay) build();
      if (!ctx || typeof stageRenderer === "undefined") return false;
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = W * dpr; canvas.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cancelAnimationFrame(raf);
      st = { guest: info.guest, baseId: info.baseId, q: MOOD[info.quality] ? info.quality : "good", drink: info.drink || "", name: String(info.guest.name || "khách").split(" (")[0], t0: performance.now(), onDone };
      clearTimeout(guard); guard = setTimeout(close, Math.min(6000, (DUR + 1.5) * 1000));
      overlay.style.display = "flex"; overlay.style.opacity = "1"; try { vid = CafeVoice.hold("serve"); } catch (e) { /* bỏ qua */ }
      try { audioEngine.playChime(330, 0.2, 0.03); setTimeout(() => audioEngine.playChime(494, 0.25, 0.03), 1900); if (st.q !== "plain") setTimeout(() => audioEngine.playChime(784, 0.5, 0.04), 3500); } catch (e) { /* không có âm thanh */ }
      raf = requestAnimationFrame(frame);
      return true;
    } catch (e) { return false; }
  }
  return { play, close };
})();
