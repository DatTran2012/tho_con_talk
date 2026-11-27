"use strict";
/* Hiệu ứng rút lá bài DRINK: chồng bài trên mặt quầy -> lá trên cùng bay lên -> lật mặt -> bùng sáng + tên lá bài.
   Chạm để bỏ qua; tự đóng sau ~4 giây. Chỉ là lớp phủ đẹp mắt, không chặn logic game bên dưới. */
const CardDrawFX = (function () {
  const W = 640, H = 400, DUR = 4.0;
  let overlay = null, canvas = null, ctx = null, raf = 0, st = null, guard = 0;
  const reduce = typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;
  const ease = (x) => 1 - Math.pow(1 - Math.min(1, Math.max(0, x)), 3);
  const seg = (t, a, b) => Math.min(1, Math.max(0, (t - a) / (b - a)));
  const rnd = (i) => { const x = Math.sin(i * 91.7 + 13.3) * 43758.5453; return x - Math.floor(x); };

  function build() {
    overlay = document.createElement("div");
    overlay.id = "card-draw-overlay";
    overlay.style.cssText = "position:fixed;inset:0;z-index:70;display:none;align-items:center;justify-content:center;background:radial-gradient(circle at 50% 40%,rgba(40,22,60,.92),rgba(6,3,12,.97));transition:opacity .5s;cursor:pointer;padding:12px";
    canvas = document.createElement("canvas");
    canvas.style.cssText = "width:min(100%,720px);aspect-ratio:640/400;border-radius:20px";
    overlay.appendChild(canvas);
    const hint = document.createElement("div");
    hint.textContent = "Chạm để bỏ qua";
    hint.style.cssText = "position:absolute;bottom:18px;left:0;right:0;text-align:center;font:11px 'JetBrains Mono',monospace;color:rgba(253,230,138,.6)";
    overlay.appendChild(hint);
    overlay.addEventListener("click", close);
    document.body.appendChild(overlay);
    try { ctx = canvas.getContext("2d"); } catch (e) { ctx = null; }
  }
  function back(c, w, h) {
    const g = c.createLinearGradient(0, 0, w, h); g.addColorStop(0, "#4b2a6e"); g.addColorStop(1, "#1d1030");
    c.fillStyle = g; c.beginPath(); c.roundRect(-w / 2, -h / 2, w, h, 12); c.fill();
    c.strokeStyle = "#f5c46b"; c.lineWidth = 3; c.stroke();
    c.strokeStyle = "rgba(245,196,107,.45)"; c.lineWidth = 1; c.beginPath(); c.roundRect(-w / 2 + 9, -h / 2 + 9, w - 18, h - 18, 8); c.stroke();
    c.fillStyle = "rgba(245,196,107,.18)";
    for (let i = 0; i < 18; i++) { c.beginPath(); c.arc(-w / 2 + 20 + (i % 3) * (w - 40) / 2, -h / 2 + 24 + Math.floor(i / 3) * (h - 48) / 5, 2.2, 0, 7); c.fill(); }
    c.fillStyle = "#f59e0b"; c.beginPath(); c.roundRect(-14, -26, 28, 40, 9); c.fill();     // đèn lồng
    c.fillStyle = "#7c2d12"; c.fillRect(-10, -30, 20, 4); c.fillRect(-10, 14, 20, 4);
    c.fillStyle = "rgba(255,255,255,.35)"; c.fillRect(-9, -20, 4, 26);
    c.strokeStyle = "#f5c46b"; c.lineWidth = 1.4; c.beginPath(); c.moveTo(0, -30); c.lineTo(0, -44); c.stroke();
    c.fillStyle = "#fde68a"; c.font = "bold 11px 'JetBrains Mono',monospace"; c.textAlign = "center"; c.fillText("DRINK", 0, h / 2 - 16); c.textAlign = "start";
  }
  function front(c, w, h, card) {
    const g = c.createLinearGradient(0, -h / 2, 0, h / 2); g.addColorStop(0, "#fff7e0"); g.addColorStop(1, "#f6dfae");
    c.fillStyle = g; c.beginPath(); c.roundRect(-w / 2, -h / 2, w, h, 12); c.fill();
    c.strokeStyle = "#c58a2b"; c.lineWidth = 3; c.stroke();
    c.strokeStyle = "rgba(197,138,43,.5)"; c.lineWidth = 1; c.beginPath(); c.roundRect(-w / 2 + 9, -h / 2 + 9, w - 18, h - 18, 8); c.stroke();
    const parts = String(card.suit || "🃏").split(" "), icon = parts[0], name = parts.slice(1).join(" ");
    c.textAlign = "center"; c.textBaseline = "middle";
    c.font = `${Math.round(w * 0.42)}px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif`; c.fillStyle = "#000"; c.fillText(icon, 0, -h * 0.06);
    c.font = "bold 15px 'Lora',Georgia,serif"; c.fillStyle = "#6b3a12"; c.fillText(name.toUpperCase(), 0, h * 0.3);
    c.font = "bold 10px 'JetBrains Mono',monospace"; c.fillStyle = "rgba(107,58,18,.7)"; c.fillText("BÀI DRINK", 0, -h / 2 + 22);
    c.font = "16px sans-serif"; c.fillText(icon, -w / 2 + 20, -h / 2 + 24); c.fillText(icon, w / 2 - 20, h / 2 - 24);
    c.textAlign = "start"; c.textBaseline = "alphabetic";
  }
  function frame(now) {
    if (!st || !ctx) return;
    const T = (now - st.t0) / 1000;
    ctx.clearRect(0, 0, W, H);
    // ánh đèn trần chiếu xuống quầy
    const cone = ctx.createLinearGradient(0, 0, 0, H); cone.addColorStop(0, "rgba(255,214,140,.22)"); cone.addColorStop(1, "rgba(255,214,140,0)");
    ctx.fillStyle = cone; ctx.beginPath(); ctx.moveTo(W / 2 - 40, 0); ctx.lineTo(W / 2 + 40, 0); ctx.lineTo(W * 0.85, H); ctx.lineTo(W * 0.15, H); ctx.closePath(); ctx.fill();
    // mặt quầy gỗ
    const wg = ctx.createLinearGradient(0, H * 0.72, 0, H); wg.addColorStop(0, "#8a4d24"); wg.addColorStop(1, "#2a160c");
    ctx.fillStyle = wg; ctx.fillRect(0, H * 0.72, W, H * 0.28); ctx.fillStyle = "rgba(255,235,200,.25)"; ctx.fillRect(0, H * 0.72, W, 2);
    const cw = 120, ch = 176;
    // chồng bài còn lại (xếp lệch nhẹ, rung khi xáo)
    const shuffle = Math.sin(seg(T, 0, 0.7) * Math.PI * 4) * (1 - seg(T, 0.5, 0.8)) * 5;
    for (let i = 0; i < 4; i++) {
      ctx.save(); ctx.translate(W / 2 + (i - 1.5) * 1.6 + shuffle * (i % 2 ? 1 : -1), H * 0.7 - i * 2.4); ctx.rotate((i - 1.5) * 0.015);
      ctx.fillStyle = "rgba(0,0,0,.3)"; ctx.beginPath(); ctx.ellipse(0, ch / 2 - 6, cw / 2, 8, 0, 0, 7); if (i === 0) ctx.fill();
      ctx.scale(0.62, 0.62); back(ctx, cw, ch); ctx.restore();
    }
    // lá được rút: bay lên -> vào giữa -> lật -> phóng to
    const tUp = ease(seg(T, 0.7, 1.5)), tMid = ease(seg(T, 1.4, 2.1)), flip = seg(T, 1.7, 2.3), tBig = ease(seg(T, 2.3, 2.9));
    if (T > 0.7) {
      const x = W / 2, y = H * 0.7 - 10 - (H * 0.7 - 10 - H * 0.44) * tMid - 40 * tUp * (1 - tMid);
      const sc = 0.62 + (1.15 - 0.62) * tMid + 0.12 * tBig;
      const sx = Math.abs(Math.cos(flip * Math.PI)), showFront = flip > 0.5;
      ctx.save(); ctx.translate(x, y + Math.sin(T * 1.8) * 2 * tBig); ctx.rotate((1 - tMid) * -0.2 + Math.sin(T * 0.8) * 0.012);
      ctx.scale(sc * Math.max(0.02, sx), sc);
      ctx.shadowColor = showFront ? "rgba(253,224,71,.9)" : "rgba(0,0,0,.6)"; ctx.shadowBlur = showFront ? 30 + 20 * tBig : 14;
      if (showFront) front(ctx, cw, ch, st.card); else back(ctx, cw, ch);
      ctx.restore();
      // bùng sáng khi lật xong
      const burst = seg(T, 2.2, 3.2);
      if (burst > 0 && burst < 1) {
        ctx.save(); ctx.globalCompositeOperation = "lighter";
        const rg = ctx.createRadialGradient(x, H * 0.44, 4, x, H * 0.44, 40 + 220 * burst); rg.addColorStop(0, `rgba(255,232,160,${0.55 * (1 - burst)})`); rg.addColorStop(1, "rgba(255,232,160,0)");
        ctx.fillStyle = rg; ctx.fillRect(0, 0, W, H);
        for (let i = 0; i < 14; i++) { const a = rnd(i) * 6.28 + T * 0.4, r = 60 + burst * (90 + rnd(i + 9) * 150); ctx.fillStyle = `rgba(255,236,170,${1 - burst})`; ctx.beginPath(); ctx.arc(x + Math.cos(a) * r, H * 0.44 + Math.sin(a) * r * 0.7, 1.5 + rnd(i + 4) * 2.6, 0, 7); ctx.fill(); }
        ctx.restore();
      }
      if (T > 2.4) { // tia sáng xoay quanh lá bài đã lật
        ctx.save(); ctx.globalCompositeOperation = "lighter"; ctx.translate(x, H * 0.44); ctx.rotate(T * 0.25);
        for (let i = 0; i < 12; i++) { ctx.rotate(Math.PI / 6); const g = ctx.createLinearGradient(0, 0, 0, -190); g.addColorStop(0, `rgba(255,224,150,${0.16 * ease(seg(T, 2.4, 3))})`); g.addColorStop(1, "rgba(255,224,150,0)"); ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(-5, 0); ctx.lineTo(5, 0); ctx.lineTo(0, -190); ctx.fill(); }
        ctx.restore();
      }
    }
    // chữ tiêu đề
    const tx = ease(seg(T, 2.6, 3.2));
    if (tx > 0) {
      ctx.globalAlpha = tx; ctx.textAlign = "center"; ctx.fillStyle = "#fde68a"; ctx.font = "bold 20px 'Lora',Georgia,serif";
      ctx.fillText(`Bạn rút được lá ${st.card.suit}`, W / 2, H * 0.9 - 6 + (1 - tx) * 8);
      ctx.font = "12px 'Inter',sans-serif"; ctx.fillStyle = "rgba(253,230,200,.8)";
      ctx.fillText(st.mode === "host_answers" ? "Đêm nay khách hỏi — đến lượt Thỏ Con trả lời" : "Đêm nay Thỏ Con hỏi — khách sẽ mở lòng", W / 2, H * 0.9 + 14 + (1 - tx) * 8);
      ctx.textAlign = "start"; ctx.globalAlpha = 1;
    }
    // bụi sáng
    ctx.fillStyle = "rgba(255,236,190,.5)"; for (let i = 0; i < 24; i++) { ctx.globalAlpha = 0.2 + 0.5 * Math.abs(Math.sin(T * 1.5 + i)); ctx.beginPath(); ctx.arc((rnd(i) * W + Math.sin(T * 0.6 + i) * 12 + W) % W, (rnd(i + 3) * H * 0.9 - T * 8 * rnd(i + 8) + H) % H, 1.3, 0, 7); ctx.fill(); }
    ctx.globalAlpha = 1;
    const fi = 1 - seg(T, 0, 0.45); if (fi > 0) { ctx.fillStyle = `rgba(4,2,8,${fi})`; ctx.fillRect(0, 0, W, H); }
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
    try { CafeVoice.release("card", myVid); } catch (e) { /* bỏ qua */ }
    setTimeout(() => { if (overlay && !st) overlay.style.display = "none"; }, 480);
  }
  function play(card, mode, onDone) {
    try {
      if (reduce || !card) return false;
      if (!overlay) build();
      if (!ctx) return false;                             // môi trường không có canvas: bỏ qua
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = W * dpr; canvas.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cancelAnimationFrame(raf);
      st = { card, mode, t0: performance.now(), onDone };
      clearTimeout(guard); guard = setTimeout(close, (DUR + 1.5) * 1000);   // chốt an toàn nếu tab bị ẩn khiến khung hình không chạy
      overlay.style.display = "flex"; overlay.style.opacity = "1"; try { vid = CafeVoice.hold("card"); } catch (e) { /* bỏ qua */ }
      try { audioEngine.playChime(392, 0.25, 0.03); setTimeout(() => audioEngine.playChime(587, 0.3, 0.03), 1700); setTimeout(() => audioEngine.playChime(784, 0.5, 0.04), 2300); } catch (e) { /* không sao */ }
      raf = requestAnimationFrame(frame);
      return true;
    } catch (e) { return false; /* hiệu ứng lỗi thì bỏ qua, game vẫn chạy */ }
  }
  return { play, close };
})();
