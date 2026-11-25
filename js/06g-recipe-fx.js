"use strict";
/* Cắt cảnh mở khóa CÔNG THỨC ĐỘC QUYỀN: tấm giấy da mở ra -> nguyên liệu bay vào -> ly nước hiện lên -> đóng dấu tên công thức.
   Chỉ chiếu lần đầu mở khóa từng công thức. Chạm để bỏ qua. Lỗi/không vẽ được thì bỏ qua êm. */
const RecipeFX = (function () {
  const W = 640, H = 400, DUR = 5.4, EMOJI = '"Segoe UI Emoji","Apple Color Emoji","Noto Color Emoji",sans-serif';
  let overlay = null, canvas = null, ctx = null, raf = 0, st = null, guard = 0;
  const reduce = typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;
  const clamp = (x) => Math.min(1, Math.max(0, x));
  const ease = (x) => 1 - Math.pow(1 - clamp(x), 3);
  const back = (x) => { x = clamp(x); const c = 1.7; return 1 + (c + 1) * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2); };
  const seg = (t, a, b) => clamp((t - a) / (b - a));
  const rnd = (i) => { const x = Math.sin(i * 91.7 + 13.3) * 43758.5453; return x - Math.floor(x); };
  const LIQ = { phin: "#5a3317", coldbrew: "#3b2314", malt: "#c27a24", plum: "#c0485f", peach_tea: "#f2a65a", yuzu: "#e8c547", lotus_milk: "#efe3c8" };

  function build() {
    overlay = document.createElement("div");
    overlay.id = "recipe-fx-overlay";
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
  function emoji(ch, x, y, size, a) { ctx.globalAlpha = a; ctx.font = `${size}px ${EMOJI}`; ctx.textAlign = "center"; ctx.fillStyle = "#000"; ctx.fillText(ch, x, y); ctx.textAlign = "center"; ctx.globalAlpha = 1; }
  function cup(x, y, s, liquid, fill, T) {
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    ctx.fillStyle = "rgba(0,0,0,.25)"; ctx.beginPath(); ctx.ellipse(0, 2, 24, 5, 0, 0, 7); ctx.fill();
    ctx.fillStyle = "rgba(255,255,255,.16)"; ctx.strokeStyle = "#f3e2c4"; ctx.lineWidth = 2.2;
    ctx.beginPath(); ctx.moveTo(-17, -40); ctx.lineTo(-13, 0); ctx.lineTo(13, 0); ctx.lineTo(17, -40); ctx.closePath(); ctx.fill(); ctx.stroke();
    const top = -40 + 38 * (1 - fill);
    ctx.fillStyle = liquid; ctx.beginPath(); ctx.moveTo(-17 + (top + 40) * 0.1, top); ctx.lineTo(17 - (top + 40) * 0.1, top); ctx.lineTo(13.5, -2); ctx.lineTo(-13.5, -2); ctx.closePath(); ctx.fill();
    ctx.fillStyle = "rgba(255,255,255,.35)"; ctx.fillRect(-12, -36, 3, 28);
    ctx.strokeStyle = "#f3e2c4"; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(21, -22, 7, -1.2, 1.2); ctx.stroke();
    if (fill > 0.9) { ctx.strokeStyle = "rgba(255,255,255,.4)"; ctx.lineWidth = 2; ctx.lineCap = "round";
      for (let i = 0; i < 3; i++) { const p = ((T * 0.5 + i / 3) % 1); ctx.globalAlpha = 0.5 * (1 - p); ctx.beginPath(); ctx.moveTo(-8 + i * 8, -44); ctx.bezierCurveTo(-12 + i * 8 + Math.sin(T * 2 + i) * 4, -52 - p * 20, -4 + i * 8, -60 - p * 22, -8 + i * 8 + Math.sin(T * 2 + i) * 5, -70 - p * 26); ctx.stroke(); }
      ctx.globalAlpha = 1; }
    ctx.restore();
  }
  function frame(now) {
    if (!st || !ctx) return;
    const T = (now - st.t0) / 1000, r = st.r;
    ctx.clearRect(0, 0, W, H);
    const bg = ctx.createLinearGradient(0, 0, 0, H); bg.addColorStop(0, "#2d1a10"); bg.addColorStop(1, "#1a0e08");
    ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
    const gl = ctx.createRadialGradient(W / 2, 200, 10, W / 2, 200, 330); gl.addColorStop(0, `rgba(255,190,100,${0.18 + 0.25 * seg(T, 2.2, 3.0)})`); gl.addColorStop(1, "rgba(255,190,100,0)");
    ctx.fillStyle = gl; ctx.fillRect(0, 0, W, H);
    // tấm giấy da mở ra
    const open = ease(seg(T, 0.3, 1.2)), px = W / 2, py = 205, pw = 330, ph = 270 * open;
    if (open > 0.02) {
      ctx.save(); ctx.shadowColor = "rgba(0,0,0,.5)"; ctx.shadowBlur = 18; ctx.shadowOffsetY = 8;
      ctx.fillStyle = "#f3e2c0"; ctx.fillRect(px - pw / 2, py - ph / 2, pw, ph); ctx.restore();
      ctx.strokeStyle = "#b9863f"; ctx.lineWidth = 3; ctx.strokeRect(px - pw / 2 + 8, py - ph / 2 + 8, pw - 16, ph - 16);
      ctx.fillStyle = "#c79a55"; ctx.fillRect(px - pw / 2 - 8, py - ph / 2 - 6, pw + 16, 10); ctx.fillRect(px - pw / 2 - 8, py + ph / 2 - 4, pw + 16, 10);
    }
    // tiêu đề
    const t1 = ease(seg(T, 0.8, 1.4));
    ctx.textAlign = "center"; ctx.globalAlpha = t1; ctx.fillStyle = "#8a5a1e"; ctx.font = "bold 12px 'Inter',sans-serif"; ctx.fillText("✦  CÔNG THỨC ĐỘC QUYỀN MỚI  ✦", px, py - 100); ctx.globalAlpha = 1;
    // nguyên liệu bay vào hàng ngang
    const ing = [r.base].concat(r.accents), n = ing.length, gap = 104, x0 = px - (n - 1) * gap / 2;
    ing.forEach((it, i) => {
      const a = seg(T, 1.3 + i * 0.35, 1.9 + i * 0.35), tx = x0 + i * gap, ty = py - 52;
      const fromX = i % 2 ? W + 30 : -30, x = fromX + (tx - fromX) * ease(a), y = ty - Math.sin(a * Math.PI) * 40;
      if (a > 0) {
        ctx.globalAlpha = a; ctx.fillStyle = "rgba(180,120,40,.2)"; ctx.beginPath(); ctx.arc(x, y - 10, 25 * back(a), 0, 7); ctx.fill(); ctx.globalAlpha = 1;
        emoji(it.icon, x, y, 34 * Math.min(1, back(a)), 1);
        if (a > 0.95) { ctx.fillStyle = "#6b4413"; ctx.font = "10px 'Inter',sans-serif"; ctx.globalAlpha = ease(seg(T, 1.9 + i * 0.35, 2.3 + i * 0.35)); ctx.fillText(it.name, x, y + 24); ctx.globalAlpha = 1; }
        if (i < n - 1 && a > 0.9) { ctx.fillStyle = "#8a5a1e"; ctx.font = "bold 20px sans-serif"; ctx.fillText("+", x + gap / 2, y - 4); }
      }
    });
    // ly nước hiện lên, đầy dần
    const cu = ease(seg(T, 2.5, 3.1)), fill = ease(seg(T, 2.7, 3.5));
    if (cu > 0) { ctx.globalAlpha = cu; cup(px, py + 38 + (1 - cu) * 20, 1.35, LIQ[r.baseId] || "#b4672a", fill, T); ctx.globalAlpha = 1; }
    // bùng sáng lúc đầy ly
    const burst = seg(T, 3.4, 4.2);
    if (burst > 0 && burst < 1) { ctx.save(); ctx.globalCompositeOperation = "lighter"; const rg = ctx.createRadialGradient(px, py + 10, 5, px, py + 10, 40 + 220 * burst); rg.addColorStop(0, `rgba(255,225,150,${0.45 * (1 - burst)})`); rg.addColorStop(1, "rgba(255,225,150,0)"); ctx.fillStyle = rg; ctx.fillRect(0, 0, W, H); ctx.restore(); }
    if (T > 3.4) for (let i = 0; i < 12; i++) { const p = ((T - 3.4) * 0.5 + rnd(i)) % 1; emoji(i % 3 ? "✨" : "⭐", px + (rnd(i + 3) - 0.5) * 300, py + 60 - p * 200, 12 + rnd(i + 7) * 10, Math.sin(p * Math.PI) * 0.9); }
    // tên công thức hiện từng chữ + con dấu
    const nm = r.name, shown = Math.floor(nm.length * seg(T, 3.5, 4.3));
    ctx.fillStyle = "#6b3f0f"; ctx.font = "bold 20px 'Lora',Georgia,serif"; ctx.fillText(nm.slice(0, shown), px, py + 105);
    const stamp = seg(T, 4.2, 4.6);
    if (stamp > 0) { ctx.save(); ctx.translate(px + pw / 2 - 46, py + ph / 2 - 40); ctx.rotate(-0.25); const sc = 1.6 - 0.6 * ease(stamp); ctx.scale(sc, sc); ctx.globalAlpha = ease(stamp); ctx.strokeStyle = "#b91c1c"; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(0, 0, 25, 0, 7); ctx.stroke(); ctx.fillStyle = "#b91c1c"; ctx.font = "bold 11px 'Inter',sans-serif"; ctx.fillText("ĐÃ", 0, -2); ctx.fillText("GHI", 0, 11); ctx.restore(); ctx.globalAlpha = 1; }
    // chú thích dưới giấy
    const t3 = ease(seg(T, 4.2, 4.8)); ctx.globalAlpha = t3; ctx.fillStyle = "#fde68a"; ctx.font = "bold 14px 'Inter',sans-serif"; ctx.fillText(`Đã ghi vào Sổ Tay • Công thức ${r.count}/${r.total}`, W / 2, H - 22 + (1 - t3) * 6); ctx.globalAlpha = 1;
    ctx.textAlign = "start";
    const fi = 1 - seg(T, 0, 0.4); if (fi > 0) { ctx.fillStyle = `rgba(4,2,8,${fi})`; ctx.fillRect(0, 0, W, H); }
    if (T > DUR) { close(); return; }
    raf = requestAnimationFrame(frame);
  }
  function close() {
    if (!overlay || !st) return;
    cancelAnimationFrame(raf); clearTimeout(guard);
    const cb = st.onDone; st = null;
    overlay.style.opacity = "0";
    if (cb) { try { cb(); } catch (e) { /* bỏ qua */ } }
    setTimeout(() => { if (overlay && !st) overlay.style.display = "none"; }, 480);
  }
  /* sig: một phần tử SIGNATURE_RECIPES; count/total: số công thức thường đã có / tổng */
  function play(sig, count, total, onDone) {
    try {
      if (reduce || !sig) return false;
      if (!overlay) build();
      if (!ctx || typeof stageRenderer === "undefined") return false;
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = W * dpr; canvas.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cancelAnimationFrame(raf);
      const base = DRINK_BASES.find((b) => b.id === sig.base) || { icon: "🥤", name: "Nền" };
      const acc = (sig.accents || []).map((id) => DRINK_ACCENTS.find((a) => a.id === id)).filter(Boolean);
      st = { r: { name: sig.name, baseId: sig.base, base: { icon: base.icon, name: base.name }, accents: acc.map((a) => ({ icon: a.icon, name: a.name })), count: count || 1, total: total || 7 }, t0: performance.now(), onDone: onDone ? (() => { const rs0 = typeof runState !== "undefined" ? runState : null; return () => { if (typeof runState === "undefined" || runState === rs0) onDone(); }; })() : null };
      clearTimeout(guard); guard = setTimeout(close, Math.min(6000, (DUR + 1.5) * 1000));
      overlay.style.display = "flex"; overlay.style.opacity = "1";
      try { audioEngine.playChime(392, 0.25, 0.03); setTimeout(() => audioEngine.playChime(523, 0.3, 0.03), 1500); setTimeout(() => audioEngine.playChime(784, 0.6, 0.04), 3400); } catch (e) { /* không có âm thanh */ }
      raf = requestAnimationFrame(frame);
      return true;
    } catch (e) { return false; }
  }
  return { play, close };
})();
