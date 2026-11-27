"use strict";

/* -----------------------------------------------------------------------
   SECTION 5: 2D INTERACTIVE CANVAS CAFE STAGE
------------------------------------------------------------------------ */
class CafeStageRenderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.drops = Array.from({ length: 48 }, () => ({
      x: Math.random(),
      y: Math.random(),
      len: 0.03 + Math.random() * 0.04,
      speed: 0.008 + Math.random() * 0.01,
      phase: Math.random() * Math.PI * 2
    }));
    this.dustMotes = Array.from({ length: 18 }, () => ({
      x: 0.25 + Math.random() * 0.5,
      y: 0.12 + Math.random() * 0.55,
      r: 0.8 + Math.random() * 1.4,
      phase: Math.random() * Math.PI * 2
    }));
    this.catPurrTimer = 0;
    this.plantTimer = 0;
    this.cupTimer = 0;
    this.fishFeedTimer = 0;
    this.stoveTimer = 0;
    this.bunnyWaveTimer = 0;
    this.radioPulseTimer = 0;
    this.talkAnimTimer = 0;
    this.speakerId = null;
    this.emotion = "neutral";
    this.hitboxes = [];
  }

  resize() {
    const rect = this.canvas.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.canvas.width = Math.max(320, Math.floor(rect.width * dpr));
    this.canvas.height = Math.max(180, Math.floor(rect.height * dpr));
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  getActiveSeason() {
    return (
      SEASON_THEMES.find((s) => s.id === persistentArchive.selectedSeasonTheme) ||
      SEASON_THEMES[2]
    );
  }

  /* Chân dung kiểu hoạt hình: đầu to, viền đậm, mắt to có tròng + điểm sáng, lông mày biểu cảm, má hồng, tóc riêng từng người */
  drawPersonPortrait(ctx, x, y, scale, opts) {
    const {
      hairColor = "#292524",
      outfitColor = "#d97706",
      skinColor = "#fcd9b0",
      accessory = "none",
      isTalking = false,
      emotion = "neutral",
      listening = false,
      timeSec = 0,
      seed = 0
    } = opts;
    const OL = "#2b1b14";                       // màu viền
    const breathY = Math.sin(timeSec * 2.1 + seed) * 1.4 * scale;
    const isBlinking = Math.sin(timeSec * 1.7 + seed * 2.3) > 0.965;
    const look = Math.sin(timeSec * 0.5 + seed) * 1.1;   // mắt liếc nhẹ
    const bob = isTalking ? Math.sin(timeSec * 9) * 0.6 : 0;
    const shade = (c, a) => { ctx.fillStyle = c; ctx.globalAlpha = a; };
    const fillStroke = (lw = 1.6) => { ctx.fill(); ctx.lineWidth = lw; ctx.strokeStyle = OL; ctx.lineJoin = "round"; ctx.stroke(); };
    const longHair = accessory === "headphones" || accessory === "scarf";

    const EMO = isTalking || listening || emotion !== "neutral" ? emotion : "neutral";
    const hop = isTalking && (EMO === "happy" || EMO === "surprised") ? Math.abs(Math.sin(timeSec * 6 + seed)) * 2.2 : 0;
    const lean = isTalking ? Math.sin(timeSec * 3.1 + seed) * 0.03 : listening ? Math.sin(timeSec * 1.2 + seed) * 0.012 : 0;
    const nodY = listening ? Math.max(0, Math.sin(timeSec * 1.7 + seed)) * 1.4 : 0;
    const slump = EMO === "sad" ? 2.2 : 0;
    const tilt = (EMO === "curious" ? 0.09 : EMO === "thinking" ? -0.08 : EMO === "sad" ? 0.05 : EMO === "shy" ? -0.05 : 0) + (listening ? Math.sin(timeSec * 1.3 + seed) * 0.02 : 0);

    ctx.save();
    ctx.translate(x, y + breathY - hop);
    ctx.rotate(lean);
    ctx.scale(scale, scale);

    ctx.fillStyle = "rgba(0,0,0,0.35)";
    ctx.beginPath(); ctx.ellipse(0, 4 + hop, 29, 10, 0, 0, Math.PI * 2); ctx.fill();

    // --- tóc phía sau ---
    ctx.fillStyle = hairColor;
    if (longHair) {                        // tóc dài chấm vai, đuôi tóc cong
      ctx.beginPath(); ctx.moveTo(-21, -52); ctx.quadraticCurveTo(-27, -24, -19, -14); ctx.quadraticCurveTo(-9, -12, -8, -24);
      ctx.lineTo(8, -24); ctx.quadraticCurveTo(9, -12, 19, -14); ctx.quadraticCurveTo(27, -24, 21, -52); ctx.closePath(); fillStroke();
    } else if (accessory === "shawl") {    // búi tóc phía sau đỉnh đầu
      ctx.beginPath(); ctx.arc(0, -71, 8.5, 0, Math.PI * 2); fillStroke();
      ctx.strokeStyle = "rgba(255,255,255,0.25)"; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(0, -71, 5, 0.2, 2.6); ctx.stroke();
    }

    // --- thân + vai ---
    ctx.fillStyle = outfitColor;
    ctx.beginPath(); ctx.moveTo(-28, 4); ctx.quadraticCurveTo(-30, -22, -14, -27); ctx.lineTo(14, -27); ctx.quadraticCurveTo(30, -22, 28, 4); ctx.closePath(); fillStroke();
    shade("#000", 0.16); ctx.beginPath(); ctx.moveTo(10, -26); ctx.quadraticCurveTo(26, -22, 27, 3); ctx.lineTo(14, 3); ctx.closePath(); ctx.fill(); ctx.globalAlpha = 1;  // đổ bóng bên phải
    shade("#fff", 0.14); ctx.beginPath(); ctx.moveTo(-22, -12); ctx.quadraticCurveTo(-24, -20, -14, -24); ctx.lineTo(-12, -20); ctx.quadraticCurveTo(-18, -17, -17, -8); ctx.closePath(); ctx.fill(); ctx.globalAlpha = 1;
    // cổ áo chữ V
    ctx.fillStyle = "rgba(255,255,255,0.28)"; ctx.beginPath(); ctx.moveTo(-9, -27); ctx.lineTo(0, -13); ctx.lineTo(9, -27); ctx.closePath(); ctx.fill();

    // --- phụ kiện trên áo ---
    if (accessory === "apron") {
      ctx.fillStyle = "#5b2a0c"; ctx.beginPath(); ctx.roundRect(-16, -24, 32, 28, 5); fillStroke(1.3);
      ctx.fillStyle = "#d97706"; ctx.beginPath(); ctx.roundRect(-8, -12, 16, 9, 2); ctx.fill();         // túi tạp dề
      ctx.strokeStyle = "#d97706"; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(-12, -26); ctx.lineTo(-8, -33); ctx.moveTo(12, -26); ctx.lineTo(8, -33); ctx.stroke();
    } else if (accessory === "scarf") {
      ctx.fillStyle = "#be123c"; ctx.beginPath(); ctx.roundRect(-17, -30, 34, 10, 5); fillStroke(1.3);
      ctx.beginPath(); ctx.roundRect(4, -23, 9, 22, 3); fillStroke(1.3);
      ctx.strokeStyle = "rgba(255,255,255,0.35)"; ctx.lineWidth = 1; for (let k = 0; k < 3; k++) { ctx.beginPath(); ctx.moveTo(5, -18 + k * 6); ctx.lineTo(12, -18 + k * 6); ctx.stroke(); }
    } else if (accessory === "shawl") {
      ctx.fillStyle = "#e9d5ff"; ctx.beginPath(); ctx.moveTo(-27, 3); ctx.quadraticCurveTo(-29, -22, -14, -28); ctx.lineTo(-6, -27); ctx.lineTo(0, -8); ctx.lineTo(6, -27); ctx.lineTo(14, -28); ctx.quadraticCurveTo(29, -22, 27, 3); ctx.lineTo(18, 3); ctx.quadraticCurveTo(19, -16, 8, -21); ctx.lineTo(0, -4); ctx.lineTo(-8, -21); ctx.quadraticCurveTo(-19, -16, -18, 3); ctx.closePath(); fillStroke(1.2);
    } else if (accessory === "headphones") {
      // dây tai nghe vắt cổ
      ctx.strokeStyle = "#1c1917"; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(-17, -26); ctx.quadraticCurveTo(0, -8, 17, -26); ctx.stroke();
    }

    // --- cổ ---
    ctx.fillStyle = skinColor; ctx.beginPath(); ctx.roundRect(-5.5, -35, 11, 11, 3); fillStroke(1.3);
    shade("#7c2d12", 0.18); ctx.fillRect(-4.5, -33, 9, 4); ctx.globalAlpha = 1;

    ctx.save(); ctx.translate(0, bob + nodY + slump); ctx.translate(0, -30); ctx.rotate(tilt); ctx.translate(0, 30);
    // --- tai ---
    ctx.fillStyle = skinColor;
    [-1, 1].forEach((sd) => { ctx.beginPath(); ctx.ellipse(sd * 19, -44, 3.6, 4.6, 0, 0, Math.PI * 2); fillStroke(1.3); ctx.fillStyle = "rgba(244,114,142,0.3)"; ctx.beginPath(); ctx.ellipse(sd * 19, -44, 1.6, 2.4, 0, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = skinColor; });
    // --- đầu to (chibi) ---
    ctx.fillStyle = skinColor;
    ctx.beginPath(); ctx.moveTo(-19, -48); ctx.bezierCurveTo(-19, -66, 19, -66, 19, -48); ctx.bezierCurveTo(19, -32, 9, -26, 0, -26); ctx.bezierCurveTo(-9, -26, -19, -32, -19, -48); ctx.closePath(); fillStroke(1.8);
    shade("#c2410c", 0.1); ctx.beginPath(); ctx.ellipse(10, -36, 9, 8, 0.4, 0, Math.PI * 2); ctx.fill(); ctx.globalAlpha = 1;   // bóng má

    // --- tóc phía trước (kiểu theo từng người) ---
    ctx.fillStyle = hairColor;
    ctx.beginPath();
    if (accessory === "headphones") {        // Vy: mái ngôi giữa, tóc dài
      ctx.moveTo(-20, -44); ctx.bezierCurveTo(-24, -70, 24, -70, 20, -44); ctx.quadraticCurveTo(16, -52, 6, -57); ctx.quadraticCurveTo(0, -50, -4, -57); ctx.quadraticCurveTo(-14, -52, -20, -44);
    } else if (accessory === "glasses") {    // Minh: tóc ngắn bồng, vài lọn vểnh
      ctx.moveTo(-20, -44); ctx.bezierCurveTo(-24, -72, 24, -72, 20, -44); ctx.lineTo(16, -52); ctx.lineTo(11, -49); ctx.lineTo(6, -56); ctx.lineTo(0, -50); ctx.lineTo(-6, -57); ctx.lineTo(-12, -50); ctx.lineTo(-17, -53);
    } else if (accessory === "scarf") {      // Linh: tóc mái bằng
      ctx.moveTo(-20, -42); ctx.bezierCurveTo(-24, -72, 24, -72, 20, -42); ctx.lineTo(18, -52); ctx.quadraticCurveTo(0, -48, -18, -52);
    } else if (accessory === "cap") {        // Tuấn: tóc ngắn lòi dưới mũ
      ctx.moveTo(-19, -46); ctx.quadraticCurveTo(-20, -52, -14, -54); ctx.lineTo(14, -54); ctx.quadraticCurveTo(20, -52, 19, -46); ctx.lineTo(16, -50); ctx.lineTo(-16, -50);
    } else if (accessory === "apron") {      // Khang: rẽ ngôi lệch
      ctx.moveTo(-20, -44); ctx.bezierCurveTo(-24, -72, 24, -72, 20, -44); ctx.quadraticCurveTo(14, -54, 2, -56); ctx.quadraticCurveTo(-6, -48, -20, -44);
    } else if (accessory === "shawl") {      // Hoa: tóc chải ngược gọn vào búi
      ctx.moveTo(-20, -44); ctx.bezierCurveTo(-23, -70, 23, -70, 20, -44); ctx.quadraticCurveTo(12, -56, 0, -57); ctx.quadraticCurveTo(-12, -56, -20, -44);
    } else {                                 // An: tóc bạc thưa, trán cao
      ctx.moveTo(-20, -46); ctx.bezierCurveTo(-22, -62, -12, -68, -4, -62); ctx.quadraticCurveTo(0, -60, 4, -62); ctx.bezierCurveTo(12, -68, 22, -62, 20, -46); ctx.quadraticCurveTo(16, -56, 8, -58); ctx.quadraticCurveTo(0, -54, -8, -58); ctx.quadraticCurveTo(-16, -56, -20, -46);
    }
    ctx.closePath(); fillStroke(1.6);
    shade("#fff", 0.18); ctx.beginPath(); ctx.ellipse(-6, -60, 7, 2.2, -0.3, 0, Math.PI * 2); ctx.fill(); ctx.globalAlpha = 1;   // ánh tóc
    if (accessory === "cap") {
      ctx.fillStyle = "#166534"; ctx.beginPath(); ctx.moveTo(-20, -52); ctx.bezierCurveTo(-22, -72, 22, -72, 20, -52); ctx.closePath(); fillStroke(1.6);
      ctx.fillStyle = "#14532d"; ctx.beginPath(); ctx.ellipse(8, -52, 17, 3.6, 0.05, 0, Math.PI * 2); fillStroke(1.4);
      ctx.fillStyle = "#fde68a"; ctx.beginPath(); ctx.arc(0, -62, 2.4, 0, Math.PI * 2); ctx.fill();
    }
    if (accessory === "headphones") {        // vòng tai nghe + 2 đệm tai
      ctx.strokeStyle = "#1c1917"; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(0, -50, 21, Math.PI * 1.02, Math.PI * 1.98); ctx.stroke();
      ctx.fillStyle = "#1c1917"; [-1, 1].forEach((sd) => { ctx.beginPath(); ctx.roundRect(sd * 21 - 4, -52, 8, 13, 3.5); fillStroke(1.1); ctx.fillStyle = "#f59e0b"; ctx.beginPath(); ctx.roundRect(sd * 21 - 2, -49, 4, 7, 2); ctx.fill(); ctx.fillStyle = "#1c1917"; });
    }

    // --- lông mày + mắt theo cảm xúc ---
    const browCol = hairColor === "#d4d4d8" ? "#9ca3af" : hairColor;
    ctx.strokeStyle = browCol; ctx.lineWidth = 1.9; ctx.lineCap = "round";
    const talkLift = isTalking ? -1.2 - Math.abs(Math.sin(timeSec * 3)) * 0.8 : 0;
    // (nội, ngoại, nâng) cho mỗi bên: lông mày nghiêng theo cảm xúc
    const BR = { neutral: [0, 0, 0], happy: [0, -1, -1.5], sad: [-2.6, 1.2, -0.5], worried: [-2.6, 1.2, -1], surprised: [-1, -1, -4.5], angry: [1.8, -1.6, 1], curious: [0, 0, -1], thinking: [0, 0, 0], shy: [-1, 0.6, 0] }[EMO] || [0, 0, 0];
    [-1, 1].forEach((sd, si) => {
      let lift = BR[2] + talkLift; if (EMO === "thinking" && sd > 0) lift -= 2.8; if (EMO === "curious" && sd > 0) lift -= 1.8;
      ctx.beginPath(); ctx.moveTo(sd * 3.5, -52 + lift + BR[0] + 0.8); ctx.quadraticCurveTo(sd * 8, -55.2 + lift + (BR[0] + BR[1]) / 2, sd * 12.5, -52 + lift + BR[1] + 0.6); ctx.stroke();
    });
    const ex = 7.6, ey = -44;
    const blinkNow = isBlinking && EMO !== "happy";
    const happyEyes = EMO === "happy" && (!isTalking || Math.sin(timeSec * 1.6 + seed) > -0.3);   // mắt cười ^ ^
    const big = EMO === "surprised" ? 1.15 : 1;
    const lx = EMO === "thinking" ? 2.2 : EMO === "shy" ? -2.2 : look * 0.7, ly = EMO === "thinking" ? -2 : EMO === "shy" ? 1.5 : 0.6;
    if (blinkNow) {
      ctx.strokeStyle = OL; ctx.lineWidth = 2;
      [-1, 1].forEach((sd) => { ctx.beginPath(); ctx.arc(sd * ex, ey - 1, 4, 0.15 * Math.PI, 0.85 * Math.PI); ctx.stroke(); });
    } else if (happyEyes) {
      ctx.strokeStyle = OL; ctx.lineWidth = 2.1;
      [-1, 1].forEach((sd) => { ctx.beginPath(); ctx.arc(sd * ex, ey + 1.5, 4.2, 1.12 * Math.PI, 1.88 * Math.PI); ctx.stroke(); });
    } else {
      [-1, 1].forEach((sd) => {
        ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.ellipse(sd * ex, ey, 4.7 * big, 5.5 * big, 0, 0, Math.PI * 2); ctx.fill();
        ctx.lineWidth = 1.2; ctx.strokeStyle = OL; ctx.stroke();
        const px = sd * ex + lx, py = ey + ly;
        const pr = EMO === "surprised" ? 0.75 : 1;
        ctx.fillStyle = hairColor === "#d4d4d8" ? "#6b7280" : "#3b2416"; ctx.beginPath(); ctx.ellipse(px, py, 3.4 * pr, 4.2 * pr, 0, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = "#0c0a09"; ctx.beginPath(); ctx.ellipse(px, py + 0.2, 1.9 * pr, 2.6 * pr, 0, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(px - 1.2, py - 2.2, 1.3, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(px + 1.2, py + 1.4, 0.7, 0, Math.PI * 2); ctx.fill();
        if (EMO === "sad" || EMO === "worried") { ctx.fillStyle = skinColor; ctx.beginPath(); ctx.ellipse(sd * ex, ey - 4.4, 5.2, 2.6, 0, 0, Math.PI * 2); ctx.fill(); }   // mí rũ
        if (EMO === "angry") { ctx.fillStyle = skinColor; ctx.beginPath(); ctx.moveTo(sd * ex - 5.5, ey - 6); ctx.lineTo(sd * ex + 5.5, ey - 6); ctx.lineTo(sd * ex - sd * 5.5, ey - 1.5); ctx.closePath(); ctx.fill(); }
        ctx.strokeStyle = OL; ctx.lineWidth = 1.8; ctx.beginPath(); ctx.arc(sd * ex, ey - 0.3, 5 * big, 1.12 * Math.PI, 1.9 * Math.PI); ctx.stroke();
      });
    }

    // --- kính ---
    if (accessory === "glasses") {
      ctx.strokeStyle = "#1e293b"; ctx.lineWidth = 1.5; ctx.fillStyle = "rgba(186,230,253,0.18)";
      [-1, 1].forEach((sd) => { ctx.beginPath(); ctx.roundRect(sd * ex - 6.5, ey - 6.5, 13, 12.5, 4); ctx.fill(); ctx.stroke(); });
      ctx.beginPath(); ctx.moveTo(-1, ey - 1); ctx.lineTo(1, ey - 1); ctx.stroke();
      ctx.strokeStyle = "rgba(255,255,255,0.5)"; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(-12, ey - 4); ctx.lineTo(-9.5, ey - 6); ctx.stroke();
    } else if (accessory === "round_glasses") {
      ctx.strokeStyle = "#b45309"; ctx.lineWidth = 1.5; ctx.fillStyle = "rgba(254,243,199,0.15)";
      [-1, 1].forEach((sd) => { ctx.beginPath(); ctx.arc(sd * ex, ey, 6.6, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); });
      ctx.beginPath(); ctx.moveTo(-1, ey - 1); ctx.quadraticCurveTo(0, ey - 3, 1, ey - 1); ctx.stroke();
    }

    // --- má hồng, mũi, miệng, hiệu ứng cảm xúc ---
    const shy = EMO === "shy" || EMO === "happy" ? 0.85 : 0.55;
    const bl = ctx.createRadialGradient(0, 0, 0.5, 0, 0, 5.5);
    bl.addColorStop(0, `rgba(251,113,133,${shy})`); bl.addColorStop(1, "rgba(251,113,133,0)");
    [-1, 1].forEach((sd) => { ctx.save(); ctx.translate(sd * 12, -36.5); ctx.fillStyle = bl; ctx.beginPath(); ctx.ellipse(0, 0, 5.5, 3.6, 0, 0, Math.PI * 2); ctx.fill(); ctx.restore(); });
    ctx.strokeStyle = "rgba(124,45,18,0.65)"; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.arc(0.6, -37.6, 1.6, 0.9 * Math.PI, 0.25 * Math.PI, true); ctx.stroke();
    const flap = Math.abs(Math.sin(timeSec * 12));
    if (isTalking) {
      let mw = 3.6, mh = 1.8 + flap * 2.8;
      if (EMO === "surprised") { mw = 2.8; mh = 3 + flap * 1.5; } else if (EMO === "happy") { mw = 4.6; mh = 2 + flap * 2.4; } else if (EMO === "sad") { mw = 2.8; mh = 1.3 + flap * 1.6; }
      ctx.fillStyle = "#7f1d1d"; ctx.beginPath(); ctx.ellipse(0, -32.2, mw, mh, 0, 0, Math.PI * 2); fillStroke(1.1);
      ctx.fillStyle = "#fb7185"; ctx.beginPath(); ctx.ellipse(0, -32.2 + mh * 0.5, mw * 0.6, mh * 0.45, 0, 0, Math.PI * 2); ctx.fill();
      if (EMO !== "sad") { ctx.fillStyle = "#fff"; ctx.fillRect(-mw * 0.7, -33.6 - mh * 0.2, mw * 1.4, 1.3); }
    } else {
      ctx.strokeStyle = "#7c2d12"; ctx.lineWidth = 1.6; ctx.beginPath();
      if (EMO === "happy" || listening) { ctx.arc(0, -35.7, 4.8, 0.12 * Math.PI, 0.88 * Math.PI); }
      else if (EMO === "sad") { ctx.arc(0, -29.5, 3.6, 1.18 * Math.PI, 1.82 * Math.PI); }
      else if (EMO === "worried") { ctx.moveTo(-3.5, -31.5); ctx.quadraticCurveTo(-1.7, -33.2, 0, -31.5); ctx.quadraticCurveTo(1.7, -29.8, 3.5, -31.5); }
      else if (EMO === "surprised") { ctx.ellipse(0, -31.5, 2, 2.8, 0, 0, Math.PI * 2); }
      else if (EMO === "angry") { ctx.moveTo(-3.5, -30.5); ctx.lineTo(3.5, -31.5); }
      else if (EMO === "thinking") { ctx.moveTo(-2.5, -31.8); ctx.lineTo(3.2, -32.8); }
      else { ctx.arc(0, -35.2, 4.4, 0.16 * Math.PI, 0.84 * Math.PI); }
      ctx.stroke();
    }
    // hiệu ứng cảm xúc: mồ hôi (lo/ngại), giọt lệ (buồn), lấp lánh (vui), dấu hỏi (băn khoăn), gân (giận)
    if (EMO === "worried" || EMO === "shy") { ctx.fillStyle = "rgba(147,197,253,0.9)"; ctx.beginPath(); ctx.moveTo(16, -55 + Math.sin(timeSec * 2) * 0.8); ctx.quadraticCurveTo(20, -48, 16, -46); ctx.quadraticCurveTo(12, -48, 16, -55 + Math.sin(timeSec * 2) * 0.8); ctx.fill(); }
    if (EMO === "sad" && isTalking) { const p = (timeSec * 0.7) % 1; ctx.fillStyle = `rgba(147,197,253,${0.9 - p * 0.7})`; ctx.beginPath(); ctx.ellipse(ex + 2, ey + 6 + p * 8, 1.3, 2, 0, 0, Math.PI * 2); ctx.fill(); }
    if (EMO === "happy" && isTalking) { ctx.fillStyle = "#fde047"; [[-23, -62], [24, -58]].forEach(([sx, sy], i) => { const sc = 0.6 + 0.4 * Math.sin(timeSec * 5 + i * 2); ctx.save(); ctx.translate(sx, sy); ctx.scale(sc, sc); ctx.beginPath(); ctx.moveTo(0, -4); ctx.lineTo(1.2, -1.2); ctx.lineTo(4, 0); ctx.lineTo(1.2, 1.2); ctx.lineTo(0, 4); ctx.lineTo(-1.2, 1.2); ctx.lineTo(-4, 0); ctx.lineTo(-1.2, -1.2); ctx.closePath(); ctx.fill(); ctx.restore(); }); }
    if ((EMO === "curious" || EMO === "thinking") && (isTalking || EMO === "thinking")) { ctx.fillStyle = "#fde68a"; ctx.font = "bold 11px Inter"; ctx.textAlign = "center"; ctx.fillText(EMO === "curious" ? "?" : "…", 21, -62 - Math.abs(Math.sin(timeSec * 2.5)) * 2); ctx.textAlign = "start"; }
    if (EMO === "angry") { ctx.strokeStyle = "#ef4444"; ctx.lineWidth = 1.3; ctx.beginPath(); ctx.moveTo(14, -60); ctx.lineTo(17, -57); ctx.lineTo(14, -57); ctx.lineTo(17, -54); ctx.stroke(); }
    ctx.restore();   // bob
    // bàn tay minh họa khi đang nói (giơ lên theo nhịp câu)
    if (isTalking && ["happy", "surprised", "curious", "worried", "angry", "neutral"].includes(EMO)) {
      const lift = (Math.sin(timeSec * 3.6 + seed) + 1) * 4.5;
      ctx.fillStyle = skinColor;
      ctx.beginPath(); ctx.arc(26, -12 - lift, 4.4, 0, Math.PI * 2); fillStroke(1.3);
      ctx.strokeStyle = outfitColor; ctx.lineWidth = 5; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(24, -4); ctx.lineTo(26, -12 - lift + 3); ctx.stroke();
    }
    ctx.restore();
  }

  drawBunnyBarista(ctx, x, y, scale, waveActive, isTalking, timeSec, emotion = "neutral", listening = false) {
    const breathY = Math.sin(timeSec * 2.4) * 1.4 * scale;
    const hopB = isTalking && (emotion === "happy" || emotion === "surprised") ? Math.abs(Math.sin(timeSec * 6)) * 2.2 * scale : 0;
    const sadB = emotion === "sad" || emotion === "worried";
    ctx.save();
    ctx.translate(x, y + breathY - hopB);
    ctx.rotate(isTalking ? Math.sin(timeSec * 3.1) * 0.03 : listening ? Math.sin(timeSec * 1.2) * 0.012 : 0);
    ctx.scale(scale, scale);

    // Drop shadow
    ctx.fillStyle = "rgba(0,0,0,0.35)";
    ctx.beginPath();
    ctx.ellipse(0, 4, 28, 9, 0, 0, Math.PI * 2);
    ctx.fill();

    // Crisp white shirt & warm amber apron
    ctx.fillStyle = "#f5f5f4";
    ctx.beginPath();
    ctx.moveTo(-26, 4);
    ctx.quadraticCurveTo(-26, -21, -12, -25);
    ctx.lineTo(12, -25);
    ctx.quadraticCurveTo(26, -21, 26, 4);
    ctx.closePath();
    ctx.fill(); ctx.lineWidth = 1.6; ctx.strokeStyle = "#3a2a2a"; ctx.lineJoin = "round"; ctx.stroke();

    ctx.fillStyle = "#b45309";
    ctx.beginPath();
    ctx.roundRect(-15, -22, 30, 26, 4);
    ctx.fill();

    // Brass buttons & bow-tie
    ctx.fillStyle = "#fde68a";
    ctx.beginPath();
    ctx.arc(0, -14, 1.8, 0, Math.PI * 2);
    ctx.arc(0, -6, 1.8, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#9f1239";
    ctx.beginPath();
    ctx.moveTo(0, -24);
    ctx.lineTo(-6, -27);
    ctx.lineTo(-6, -21);
    ctx.closePath();
    ctx.moveTo(0, -24);
    ctx.lineTo(6, -27);
    ctx.lineTo(6, -21);
    ctx.closePath();
    ctx.fill();

    // Bunny ears
    const earTilt = waveActive ? Math.sin(timeSec * 14) * 0.28 : Math.sin(timeSec * 1.6) * 0.04 + (isTalking ? Math.sin(timeSec * 5) * 0.05 : 0);
    const earDroop = sadB ? 0.35 : emotion === "happy" || emotion === "surprised" ? -0.1 : 0;
    [
      { dx: -8, rot: -0.12 + earTilt - earDroop },
      { dx: 8, rot: 0.12 - earTilt + earDroop }
    ].forEach((ear) => {
      ctx.save();
      ctx.translate(ear.dx, -56);
      ctx.rotate(ear.rot);
      ctx.fillStyle = "#fafaf9";
      ctx.beginPath();
      ctx.ellipse(0, -16, 5.8, 19, 0, 0, Math.PI * 2);
      ctx.fill(); ctx.lineWidth = 1.6; ctx.strokeStyle = "#3a2a2a"; ctx.lineJoin = "round"; ctx.stroke();
      ctx.fillStyle = "#fda4af";
      ctx.beginPath();
      ctx.ellipse(0, -16, 2.7, 13, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    // Bunny head & rosy cheeks
    ctx.fillStyle = "#fafaf9";
    ctx.beginPath();
    ctx.ellipse(0, -43, 19.5, 17, 0, 0, Math.PI * 2);
    ctx.fill(); ctx.lineWidth = 1.6; ctx.strokeStyle = "#3a2a2a"; ctx.lineJoin = "round"; ctx.stroke();
    ctx.fillStyle = "rgba(120,113,108,0.12)"; ctx.beginPath(); ctx.ellipse(9, -38, 9, 9, 0.4, 0, Math.PI * 2); ctx.fill();

    ctx.fillStyle = "rgba(251, 113, 133, 0.35)";
    ctx.beginPath();
    ctx.ellipse(-10, -39, 3.8, 2.3, 0, 0, Math.PI * 2);
    ctx.ellipse(10, -39, 3.8, 2.3, 0, 0, Math.PI * 2);
    ctx.fill();

    // Eyes, nose & mouth
    const blink = Math.sin(timeSec * 1.5 + 0.7) > 0.965;
    [-1, 1].forEach((sd) => {
      if (blink) { ctx.strokeStyle = "#292524"; ctx.lineWidth = 1.8; ctx.beginPath(); ctx.arc(sd * 7.2, -44, 3.6, 0.15 * Math.PI, 0.85 * Math.PI); ctx.stroke(); return; }
      ctx.fillStyle = "#1c1917"; ctx.beginPath(); ctx.ellipse(sd * 7.2, -43, 3.6, 4.6, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#7f1d1d"; ctx.beginPath(); ctx.ellipse(sd * 7.2, -41.6, 2.6, 2.4, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(sd * 7.2 - 1.1, -44.6, 1.3, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(sd * 7.2 + 1.2, -41.4, 0.7, 0, Math.PI * 2); ctx.fill();
    });

    ctx.fillStyle = "#fb7185";
    ctx.beginPath();
    ctx.arc(0, -39, 2, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = "#57534e";
    ctx.lineWidth = 1.4;
    if (isTalking) {
      const o = emotion === "surprised" ? 2.2 : 1.8;
      ctx.fillStyle = "#fb7185";
      ctx.beginPath();
      ctx.ellipse(0, -35.5, emotion === "surprised" ? 2.2 : 2.8, o + Math.abs(Math.sin(timeSec * 12)) * 2, 0, 0, Math.PI * 2);
      ctx.fill();
    } else if (sadB) {
      ctx.beginPath(); ctx.arc(-2.5, -33.4, 2.5, 1.15 * Math.PI, 1.85 * Math.PI); ctx.stroke(); ctx.beginPath(); ctx.arc(2.5, -33.4, 2.5, 1.15 * Math.PI, 1.85 * Math.PI); ctx.stroke();
    } else {
      const w2 = emotion === "happy" || listening ? 3 : 2.5;
      ctx.beginPath();
      ctx.arc(-2.5, -37, w2, 0.1 * Math.PI, 0.85 * Math.PI);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(2.5, -37, w2, 0.15 * Math.PI, 0.9 * Math.PI);
      ctx.stroke();
    }
    if (emotion === "happy" && isTalking) { ctx.fillStyle = "#fde047"; [[-24, -66], [25, -62]].forEach(([sx, sy], i) => { const sc = 0.6 + 0.4 * Math.sin(timeSec * 5 + i * 2); ctx.save(); ctx.translate(sx, sy); ctx.scale(sc, sc); ctx.beginPath(); ctx.moveTo(0, -4); ctx.lineTo(1.2, -1.2); ctx.lineTo(4, 0); ctx.lineTo(1.2, 1.2); ctx.lineTo(0, 4); ctx.lineTo(-1.2, 1.2); ctx.lineTo(-4, 0); ctx.lineTo(-1.2, -1.2); ctx.closePath(); ctx.fill(); ctx.restore(); }); }
    if (sadB && isTalking) { ctx.fillStyle = "rgba(147,197,253,0.9)"; ctx.beginPath(); ctx.moveTo(17, -52); ctx.quadraticCurveTo(21, -45, 17, -43); ctx.quadraticCurveTo(13, -45, 17, -52); ctx.fill(); }
    if (emotion === "curious" && isTalking) { ctx.fillStyle = "#fde68a"; ctx.font = "bold 11px Inter"; ctx.textAlign = "center"; ctx.fillText("?", 25, -50); ctx.textAlign = "start"; }

    ctx.restore();
  }

  draw(now) {
    const w = this.canvas.getBoundingClientRect().width;
    const h = this.canvas.getBoundingClientRect().height;
    if (w <= 0 || h <= 0) return;

    const timeSec = now * 0.001;
    const ctx = this.ctx;
    this.hitboxes = [];

    const season = this.getActiveSeason();
    const rawCustom = persistentArchive.cafeCustom || {};
    const pickCustom = (slot, def) => {
      const v = rawCustom[slot] || def;
      const opt = CAFE_CUSTOM_OPTIONS[slot].choices.find((c) => c.id === v);
      return opt && (!opt.requires || isSecretUnlocked(opt.requires)) ? v : def;
    };
    const custom = {
      lantern: pickCustom("lantern", "lantern_classic"),
      counter: pickCustom("counter", "wood_oak"),
      decor: pickCustom("decor", "decor_seasonal")
    };

    // 1. Cozy Wooden Wall Background
    const bgGrad = ctx.createLinearGradient(0, 0, 0, h);
    bgGrad.addColorStop(0, season.bgTop);
    bgGrad.addColorStop(1, season.bgBottom);
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, w, h);

    // tường kiểu anime: giấy dán tường sọc mảnh, hoa văn chấm, ốp gỗ chân tường, đèn dây
    const panelStep = Math.max(28, w * 0.055);
    for (let px = 0, k = 0; px < w; px += panelStep, k++) {
      ctx.fillStyle = k % 2 ? "rgba(255,255,255,0.028)" : "rgba(0,0,0,0.10)";
      ctx.fillRect(px, 0, panelStep, h * 0.72);
    }
    ctx.fillStyle = "rgba(255,220,170,0.05)";
    for (let py = h * 0.04; py < h * 0.6; py += 17) for (let px = (Math.floor(py / 17) % 2) * 14 + 6; px < w; px += 28) { ctx.beginPath(); ctx.arc(px, py, 1.3, 0, Math.PI * 2); ctx.fill(); }
    const wy = h * 0.58;
    const wg = ctx.createLinearGradient(0, wy, 0, h * 0.72);
    wg.addColorStop(0, "rgba(40,20,12,0.55)"); wg.addColorStop(1, "rgba(20,10,8,0.75)");
    ctx.fillStyle = wg; ctx.fillRect(0, wy, w, h * 0.72 - wy);
    ctx.fillStyle = "rgba(255,200,140,0.35)"; ctx.fillRect(0, wy, w, 1.6);
    ctx.fillStyle = "rgba(0,0,0,0.35)"; ctx.fillRect(0, wy + 1.6, w, 2);
    ctx.strokeStyle = "rgba(255,200,140,0.12)"; ctx.lineWidth = 1;
    for (let px = w * 0.02; px < w; px += w * 0.1) ctx.strokeRect(px, wy + 7, w * 0.08, h * 0.72 - wy - 11);
    // đèn dây nhấp nháy dọc trần
    {
      const n = 11;
      ctx.strokeStyle = "rgba(90,60,40,0.8)"; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(0, h * 0.015);
      for (let i = 1; i <= 60; i++) { const t = i / 60; ctx.lineTo(w * t, h * 0.015 + Math.sin(t * Math.PI * 6) * h * 0.012 + h * 0.018 * Math.abs(Math.sin(t * Math.PI * n / 2))); }
      ctx.stroke();
      const cols = ["#fde68a", "#fda4af", "#a5f3fc", "#fcd34d", "#f9a8d4"];
      for (let i = 0; i < n; i++) {
        const t = (i + 0.5) / n, bx = w * t, by = h * 0.015 + Math.sin(t * Math.PI * 6) * h * 0.012 + h * 0.018 * Math.abs(Math.sin(t * Math.PI * n / 2)) + 3;
        const tw = 0.65 + 0.35 * Math.sin(now * 0.003 + i * 1.7);
        const gl = ctx.createRadialGradient(bx, by, 0, bx, by, 13);
        gl.addColorStop(0, "rgba(255,240,200," + 0.55 * tw + ")"); gl.addColorStop(1, "rgba(255,200,120,0)");
        ctx.fillStyle = gl; ctx.fillRect(bx - 14, by - 14, 28, 28);
        ctx.fillStyle = cols[i % cols.length]; ctx.globalAlpha = 0.6 + 0.4 * tw; ctx.beginPath(); ctx.arc(bx, by, 2.4, 0, Math.PI * 2); ctx.fill(); ctx.globalAlpha = 1;
      }
    }

    // 2. Back-Bar Wooden Shelf, Bottles & Wall Clock
    const shelfX = w * 0.05;
    const shelfW = w * 0.24;
    const shelf1Y = h * 0.25;
    const shelf2Y = h * 0.43;
    ctx.fillStyle = "#291d16";
    ctx.fillRect(shelfX, shelf1Y, shelfW, 5);
    ctx.fillRect(shelfX, shelf2Y, shelfW, 5);

    // 5 chai siro/nguyên liệu: mỗi chai một hình nhãn để nhận ra (mật ong gừng, hoa hồng, matcha, việt quất, caramel)
    const bottleColors = ["#d97706", "#be123c", "#15803d", "#0369a1", "#92400e"];
    bottleColors.forEach((col, idx) => {
      const bx = shelfX + 8 + idx * (shelfW * 0.18);
      const bw = 14, bh = 26 + (idx % 2) * 3, top = shelf1Y - bh;
      const cxb = bx + bw / 2;
      // thân chai có vai + cổ
      ctx.fillStyle = col;
      ctx.beginPath();
      ctx.moveTo(bx, shelf1Y);
      ctx.lineTo(bx, top + 10);
      ctx.quadraticCurveTo(bx, top + 6, cxb - 3, top + 5);
      ctx.lineTo(cxb - 3, top + 1);
      ctx.lineTo(cxb + 3, top + 1);
      ctx.lineTo(cxb + 3, top + 5);
      ctx.quadraticCurveTo(bx + bw, top + 6, bx + bw, top + 10);
      ctx.lineTo(bx + bw, shelf1Y);
      ctx.closePath();
      ctx.fill();
      // ánh kính
      ctx.fillStyle = "rgba(255,255,255,0.22)";
      ctx.fillRect(bx + 2, top + 9, 2, bh - 12);
      // nắp / nút chai
      ctx.fillStyle = idx === 0 ? "#fbbf24" : idx === 4 ? "#78350f" : "#e7e5e4";
      ctx.fillRect(cxb - 3.5, top - 2, 7, 3.5);
      // nhãn kem
      const ly = top + 13;
      ctx.fillStyle = "#fef3c7";
      ctx.beginPath(); ctx.roundRect(bx + 1.5, ly, bw - 3, 10, 1.5); ctx.fill();
      // biểu tượng trên nhãn
      const ix = cxb, iy = ly + 5;
      if (idx === 0) { // mật ong: giọt vàng
        ctx.fillStyle = "#d97706"; ctx.beginPath(); ctx.moveTo(ix, iy - 3.5); ctx.quadraticCurveTo(ix + 3.5, iy + 1, ix, iy + 3.2); ctx.quadraticCurveTo(ix - 3.5, iy + 1, ix, iy - 3.5); ctx.fill();
      } else if (idx === 1) { // hoa hồng: 5 cánh
        ctx.fillStyle = "#be123c"; for (let k = 0; k < 5; k++) { const an = k * 1.2566; ctx.beginPath(); ctx.arc(ix + Math.cos(an) * 1.9, iy + Math.sin(an) * 1.9, 1.5, 0, 7); ctx.fill(); }
        ctx.fillStyle = "#fde047"; ctx.beginPath(); ctx.arc(ix, iy, 1, 0, 7); ctx.fill();
      } else if (idx === 2) { // matcha: lá trà
        ctx.fillStyle = "#15803d"; ctx.beginPath(); ctx.ellipse(ix, iy, 3.6, 1.9, -0.6, 0, 7); ctx.fill();
        ctx.strokeStyle = "#fef3c7"; ctx.lineWidth = 0.6; ctx.beginPath(); ctx.moveTo(ix - 2.6, iy + 1.6); ctx.lineTo(ix + 2.6, iy - 1.6); ctx.stroke();
      } else if (idx === 3) { // việt quất: ba quả
        ctx.fillStyle = "#1e3a8a"; [[-2, 1], [2, 1], [0, -1.5]].forEach(([dx, dy]) => { ctx.beginPath(); ctx.arc(ix + dx, iy + dy, 1.7, 0, 7); ctx.fill(); });
      } else { // caramel: ba giọt/khối nâu
        ctx.fillStyle = "#92400e"; ctx.fillRect(ix - 3, iy - 2.5, 6, 5); ctx.fillStyle = "#fbbf24"; ctx.fillRect(ix - 3, iy - 2.5, 6, 1.6);
      }
      this.hitboxes.push({ id: "bottle", idx, x: bx - 3, y: top - 4, w: bw + 6, h: bh + 6 });
    });

    // ấm trà đồng: thân tròn, nắp có núm, vòi, quai, hơi nước
    {
      const kx = shelfX + shelfW * 0.2, ky = shelf2Y;
      ctx.fillStyle = "#b45309";
      ctx.beginPath(); ctx.ellipse(kx, ky - 9, 11, 9, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "rgba(255,255,255,0.2)"; ctx.beginPath(); ctx.ellipse(kx - 4, ky - 12, 3, 4, -0.5, 0, 7); ctx.fill();
      ctx.fillStyle = "#92400e"; ctx.fillRect(kx - 8, ky - 1.5, 16, 2.5);          // đế
      ctx.fillStyle = "#d97706"; ctx.beginPath(); ctx.ellipse(kx, ky - 17.5, 6.5, 2.6, 0, 0, 7); ctx.fill(); // nắp
      ctx.beginPath(); ctx.arc(kx, ky - 21, 2, 0, 7); ctx.fill();                  // núm
      ctx.strokeStyle = "#b45309"; ctx.lineWidth = 3; ctx.lineCap = "round";
      ctx.beginPath(); ctx.moveTo(kx + 9, ky - 8); ctx.quadraticCurveTo(kx + 17, ky - 10, kx + 15, ky - 19); ctx.stroke(); // vòi
      ctx.strokeStyle = "#78350f"; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(kx - 9, ky - 14); ctx.bezierCurveTo(kx - 20, ky - 16, kx - 20, ky - 3, kx - 9, ky - 5); ctx.stroke(); // quai
      ctx.strokeStyle = "rgba(254,243,199," + (0.25 + 0.2 * Math.sin(timeSec * 1.8)) + ")"; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(kx + 15, ky - 22); ctx.quadraticCurveTo(kx + 12, ky - 27, kx + 16, ky - 31); ctx.stroke(); // hơi
    }

    // Kệ sách: 7 gáy sách, mỗi khách một cuốn (chỗ trống nếu chưa gặp)
    {
      const slotW = (shelfW * 0.56) / 7;
      const bkX = shelfX + shelfW * 0.42;
      let allBooks = true;
      STANDARD_GUEST_ORDER.forEach((gid, i) => {
        const got = Boolean(persistentArchive.shelfBooks && persistentArchive.shelfBooks[gid]);
        if (!got) allBooks = false;
        const bx = bkX + i * slotW;
        const bh = 20 + ((i * 5) % 4) * 3;
        if (got) {
          ctx.fillStyle = CHARACTERS[gid].outfitColor;
          ctx.fillRect(bx, shelf2Y - bh, slotW * 0.78, bh);
          ctx.fillStyle = "rgba(255,255,255,0.35)";
          ctx.fillRect(bx + 1, shelf2Y - bh + 4, slotW * 0.78 - 2, 2);
        } else {
          ctx.strokeStyle = "rgba(180,140,90,0.35)";
          ctx.lineWidth = 1;
          ctx.strokeRect(bx, shelf2Y - 18, slotW * 0.78, 18);
        }
      });
      if (allBooks) {
        ctx.fillStyle = `rgba(253, 224, 71, ${0.1 + 0.08 * Math.sin(timeSec * 2)})`;
        ctx.fillRect(bkX - 3, shelf2Y - 30, slotW * 7 + 3, 32);
      }
      this.hitboxes.push({ id: "shelf", x: bkX - 4, y: shelf2Y - 34, w: slotW * 7 + 8, h: 40 });
    }

    const clockX = shelfX + shelfW * 0.5;
    const clockY = h * 0.11;
    const clockSecret = isSecretUnlocked("secret_clock");
    ctx.fillStyle = "#1c1917";
    ctx.beginPath();
    ctx.arc(clockX, clockY, 13, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = clockSecret ? "#fde047" : "#f59e0b";
    ctx.lineWidth = clockSecret ? 2.6 : 1.6;
    ctx.stroke();
    ctx.strokeStyle = "#fef3c7";
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    if (this.storyTime || clockSecret) {
      const st = this.storyTime || { h: new Date().getHours(), m: new Date().getMinutes() };
      const minA = (st.m / 60) * Math.PI * 2 - Math.PI / 2;
      const hourA = ((st.h % 12) / 12 + st.m / 720) * Math.PI * 2 - Math.PI / 2;
      ctx.moveTo(clockX, clockY);
      ctx.lineTo(clockX + Math.cos(minA) * 9, clockY + Math.sin(minA) * 9);
      ctx.moveTo(clockX, clockY);
      ctx.lineTo(clockX + Math.cos(hourA) * 6, clockY + Math.sin(hourA) * 6);
    } else {
      ctx.moveTo(clockX, clockY);
      ctx.lineTo(clockX, clockY - 7);
      ctx.moveTo(clockX, clockY);
      ctx.lineTo(clockX + 4, clockY - 3);
    }
    ctx.stroke();
    this.hitboxes.push({ id: "clock", x: clockX - 15, y: clockY - 15, w: 30, h: 30 });

    // 3. Multi-Pane Night Window
    const winX = w * 0.68;
    const winY = h * 0.11;
    const winW = w * 0.27;
    const winH = h * 0.44;
    ctx.fillStyle = season.id === "winter_chill" ? "#0b1528" : "#070a12";
    ctx.beginPath();
    ctx.roundRect(winX, winY, winW, winH, 8);
    ctx.fill();

    ctx.fillStyle = "rgba(251, 191, 36, 0.25)";
    ctx.beginPath();
    ctx.arc(winX + winW * 0.22, winY + winH * 0.72, 3, 0, Math.PI * 2);
    ctx.arc(winX + winW * 0.65, winY + winH * 0.65, 2.5, 0, Math.PI * 2);
    ctx.arc(winX + winW * 0.82, winY + winH * 0.78, 3.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.save();
    ctx.beginPath();
    ctx.roundRect(winX, winY, winW, winH, 8);
    ctx.clip();
    // bầu trời đêm kiểu anime: chuyển màu xanh thẫm -> tím -> ánh hồng ở chân trời, trăng lớn, sao, mây, đường chân trời thành phố
    {
      const sg = ctx.createLinearGradient(0, winY, 0, winY + winH);
      sg.addColorStop(0, "#0a0e2e"); sg.addColorStop(0.5, "#2a2766"); sg.addColorStop(0.82, "#7a4a8a"); sg.addColorStop(1, "#e0905a");
      ctx.fillStyle = sg; ctx.fillRect(winX, winY, winW, winH);
      for (let i = 0; i < 26; i++) {
        const sx = winX + ((i * 73) % 100) / 100 * winW, sy = winY + ((i * 41) % 60) / 100 * winH, tw = 0.4 + 0.6 * Math.abs(Math.sin(now * 0.0015 + i));
        ctx.fillStyle = `rgba(255,255,255,${0.7 * tw})`; ctx.fillRect(sx, sy, i % 5 === 0 ? 2 : 1.2, i % 5 === 0 ? 2 : 1.2);
      }
      const mx = winX + winW * 0.76, my = winY + winH * 0.24, mr = Math.min(winW, winH) * 0.12;
      const mg = ctx.createRadialGradient(mx, my, mr * 0.6, mx, my, mr * 3.2);
      mg.addColorStop(0, "rgba(255,244,200,0.5)"); mg.addColorStop(1, "rgba(255,244,200,0)");
      ctx.fillStyle = mg; ctx.fillRect(winX, winY, winW, winH);
      ctx.fillStyle = "#fff6d6"; ctx.beginPath(); ctx.arc(mx, my, mr, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "rgba(220,200,150,0.5)"; [[-0.3, -0.2, 0.22], [0.25, 0.15, 0.17], [-0.1, 0.35, 0.12]].forEach(([dx, dy, rr]) => { ctx.beginPath(); ctx.arc(mx + dx * mr, my + dy * mr, rr * mr, 0, Math.PI * 2); ctx.fill(); });
      ctx.fillStyle = "rgba(180,170,230,0.28)";
      for (let i = 0; i < 3; i++) { const cx = winX + ((now * 0.004 * (1 + i * 0.4) + i * 90) % (winW + 80)) - 40, cy = winY + winH * (0.3 + i * 0.12); ctx.beginPath(); ctx.ellipse(cx, cy, 26, 6, 0, 0, Math.PI * 2); ctx.ellipse(cx + 14, cy - 3, 16, 5, 0, 0, Math.PI * 2); ctx.fill(); }
      // thành phố xa: tòa nhà bóng đen có ô cửa sổ sáng đèn
      const gy = winY + winH;
      [[0.0, 0.2, 0.30], [0.16, 0.16, 0.22], [0.3, 0.2, 0.36], [0.5, 0.14, 0.26], [0.64, 0.2, 0.32], [0.82, 0.18, 0.24]].forEach(([bxr, bwr, bhr], bi) => {
        const bx = winX + bxr * winW, bw = bwr * winW, bh = bhr * winH;
        ctx.fillStyle = bi % 2 ? "#1a1535" : "#120f2a"; ctx.fillRect(bx, gy - bh, bw, bh);
        for (let wy2 = gy - bh + 5; wy2 < gy - 4; wy2 += 8) for (let wx2 = bx + 3; wx2 < bx + bw - 3; wx2 += 6) {
          const on = ((Math.floor(wx2) * 7 + Math.floor(wy2) * 13 + bi) % 5) < 2;
          if (on) { ctx.fillStyle = (Math.floor(wx2) + Math.floor(wy2)) % 3 ? "rgba(253,224,71,0.85)" : "rgba(253,186,116,0.85)"; ctx.fillRect(wx2, wy2, 2.6, 3.2); }
        }
      });
    }

    this.drops.forEach((d) => {
      if (season.weatherType === "petals") {
        d.y += d.speed * 0.42;
        d.x += Math.sin(now * 0.002 + d.phase) * 0.002;
        if (d.y > 1) { d.y = 0; d.x = Math.random(); }
        ctx.fillStyle = "rgba(244, 114, 182, 0.78)";
        ctx.beginPath();
        ctx.ellipse(winX + d.x * winW, winY + d.y * winH, 3.2, 1.8, d.phase, 0, Math.PI * 2);
        ctx.fill();
      } else if (season.weatherType === "fireflies") {
        d.y -= d.speed * 0.22;
        d.x += Math.cos(now * 0.0018 + d.phase) * 0.0022;
        if (d.y < 0) { d.y = 1; d.x = Math.random(); }
        const glowAlpha = 0.35 + 0.55 * Math.sin(now * 0.005 + d.phase);
        ctx.fillStyle = `rgba(167, 243, 208, ${Math.max(0.15, glowAlpha)})`;
        ctx.beginPath();
        ctx.arc(winX + d.x * winW, winY + d.y * winH, 2.4, 0, Math.PI * 2);
        ctx.fill();
      } else if (season.weatherType === "snow") {
        d.y += d.speed * 0.38;
        d.x += Math.sin(now * 0.0015 + d.phase) * 0.0015;
        if (d.y > 1) { d.y = 0; d.x = Math.random(); }
        ctx.fillStyle = "rgba(224, 242, 254, 0.85)";
        ctx.beginPath();
        ctx.arc(winX + d.x * winW, winY + d.y * winH, 2.2, 0, Math.PI * 2);
        ctx.fill();
      } else {
        d.y += d.speed;
        if (d.y > 1) { d.y = 0; d.x = Math.random(); }
        ctx.strokeStyle = "rgba(186, 230, 253, 0.38)";
        ctx.lineWidth = 1.1;
        ctx.beginPath();
        const rx = winX + d.x * winW;
        const ry = winY + d.y * winH;
        ctx.moveTo(rx, ry);
        ctx.lineTo(rx - 3, ry + d.len * winH);
        ctx.stroke();
      }
    });
    ctx.restore();

    ctx.strokeStyle = "#451a03";
    ctx.lineWidth = 3;
    ctx.strokeRect(winX, winY, winW, winH);
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(winX + winW * 0.5, winY);
    ctx.lineTo(winX + winW * 0.5, winY + winH);
    ctx.moveTo(winX, winY + winH * 0.55);
    ctx.lineTo(winX + winW, winY + winH * 0.55);
    ctx.stroke();
    ctx.fillStyle = "#5c2d16";
    ctx.fillRect(winX - 4, winY + winH, winW + 8, 5);
    ctx.fillStyle = "rgba(255,220,170,0.25)"; ctx.fillRect(winX - 4, winY + winH, winW + 8, 1.2);
    // rèm cửa kéo hai bên + thanh treo
    ctx.fillStyle = "#6b3a1f"; ctx.fillRect(winX - 10, winY - 7, winW + 20, 3); ctx.beginPath(); ctx.arc(winX - 10, winY - 5.5, 3, 0, 7); ctx.arc(winX + winW + 10, winY - 5.5, 3, 0, 7); ctx.fill();
    [[winX - 6, 1], [winX + winW + 6, -1]].forEach(([ex2, sd]) => {
      const cw = winW * 0.17, sway = Math.sin(now * 0.0012 + sd) * 1.2;
      const cg = ctx.createLinearGradient(ex2, 0, ex2 + sd * cw, 0);
      cg.addColorStop(0, "#9f1f45"); cg.addColorStop(1, "#5e1230");
      ctx.fillStyle = cg; ctx.beginPath(); ctx.moveTo(ex2, winY - 4);
      ctx.lineTo(ex2 + sd * cw, winY - 4); ctx.quadraticCurveTo(ex2 + sd * cw * 0.55 + sway, winY + winH * 0.6, ex2 + sd * cw * 0.9, winY + winH + 3);
      ctx.lineTo(ex2, winY + winH + 3); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = "rgba(0,0,0,0.25)"; ctx.lineWidth = 1;
      for (let f = 1; f < 4; f++) { ctx.beginPath(); ctx.moveTo(ex2 + sd * cw * f / 4, winY - 4); ctx.quadraticCurveTo(ex2 + sd * cw * (f / 4) + sway * 0.5, winY + winH * 0.6, ex2 + sd * cw * (f / 4) * 0.95, winY + winH + 3); ctx.stroke(); }
      ctx.fillStyle = "rgba(255,255,255,0.12)"; ctx.fillRect(ex2 + (sd > 0 ? 3 : -5), winY, 2, winH);
    });

    if (isSecretUnlocked("secret_seasons")) {
      ctx.save();
      ctx.beginPath();
      ctx.roundRect(winX, winY, winW, winH, 8);
      ctx.clip();
      const dawnGrad = ctx.createLinearGradient(0, winY + winH * 0.5, 0, winY + winH);
      dawnGrad.addColorStop(0, "rgba(251, 191, 36, 0)");
      dawnGrad.addColorStop(1, "rgba(251, 191, 36, 0.4)");
      ctx.fillStyle = dawnGrad;
      ctx.fillRect(winX, winY, winW, winH);
      ctx.restore();
    }

    this.hitboxes.push({ id: "window", x: winX, y: winY, w: winW, h: winH });
    this.hitboxes.push({ id: "lantern", x: w * 0.48 - 26, y: h * 0.14 - 26, w: 52, h: 52 });

    // 3b. Hồ cá treo tường (dưới đèn lồng): nước, cát, rong, bong bóng và 4 chú cá bơi; chạm để cho cá ăn
    {
      const tx = w * 0.37, ty = h * 0.25, tw = w * 0.22, th = h * 0.2;
      const T = timeSec;
      ctx.strokeStyle = "rgba(120,90,60,0.8)"; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(tx + 6, ty); ctx.lineTo(tx + 6, 0); ctx.moveTo(tx + tw - 6, ty); ctx.lineTo(tx + tw - 6, 0); ctx.stroke();
      ctx.fillStyle = "#3b2a1c"; ctx.fillRect(tx - 3, ty - 4, tw + 6, 5);                 // nắp gỗ
      ctx.fillStyle = "rgba(253,224,71,0.85)"; ctx.fillRect(tx + tw * 0.3, ty - 1, tw * 0.4, 1.6); // đèn hồ
      const wg = ctx.createLinearGradient(0, ty, 0, ty + th);
      wg.addColorStop(0, "rgba(94,200,220,0.55)"); wg.addColorStop(1, "rgba(14,70,110,0.75)");
      ctx.fillStyle = wg; ctx.fillRect(tx, ty, tw, th);
      // tia sáng
      ctx.fillStyle = "rgba(255,255,255,0.07)";
      for (let k = 0; k < 3; k++) { const lx = tx + tw * (0.2 + k * 0.28) + Math.sin(T * 0.8 + k) * 3; ctx.beginPath(); ctx.moveTo(lx, ty); ctx.lineTo(lx + 8, ty); ctx.lineTo(lx + 2, ty + th); ctx.lineTo(lx - 8, ty + th); ctx.fill(); }
      // cát + sỏi + đá
      ctx.fillStyle = "#d6b98c"; ctx.fillRect(tx, ty + th - 5, tw, 5);
      ctx.fillStyle = "#8d7b68"; ctx.beginPath(); ctx.ellipse(tx + tw * 0.78, ty + th - 5, 7, 4.5, 0, Math.PI, 0); ctx.fill();
      ctx.fillStyle = "#a8957f"; ctx.beginPath(); ctx.ellipse(tx + tw * 0.3, ty + th - 5, 5, 3, 0, Math.PI, 0); ctx.fill();
      // rong
      ctx.lineWidth = 2; ctx.lineCap = "round";
      [[0.12, "#2f9e5a", 22], [0.16, "#3fb56b", 16], [0.62, "#2f9e5a", 19], [0.9, "#3fb56b", 24]].forEach(([fx, col, hh], i) => {
        ctx.strokeStyle = col; ctx.beginPath(); const bx = tx + tw * fx, by = ty + th - 4;
        ctx.moveTo(bx, by); ctx.bezierCurveTo(bx + Math.sin(T * 1.3 + i) * 4, by - hh * 0.4, bx - Math.sin(T * 1.1 + i * 2) * 4, by - hh * 0.7, bx + Math.sin(T * 1.2 + i) * 3, by - hh); ctx.stroke();
      });
      // cá
      const fed = this.fishFeedTimer > 0; if (fed) this.fishFeedTimer -= 16;
      const FISH = [["#fb923c", 0.9, 0.00, 0.32, 1.0], ["#38bdf8", 0.7, 1.7, 0.55, 0.8], ["#fde047", 0.6, 3.1, 0.22, 1.3], ["#f43f5e", 0.8, 4.4, 0.7, 0.9]];
      FISH.forEach(([col, sz, ph, yy, sp]) => {
        const u = Math.sin(T * 0.35 * sp + ph);                       // -1..1
        let fx = tx + tw * (0.5 + 0.38 * u);
        let fy = ty + th * (yy + 0.06 * Math.sin(T * 0.9 * sp + ph * 2));
        const dir = Math.cos(T * 0.35 * sp + ph) >= 0 ? 1 : -1;
        if (fed) { fx = tx + tw * (0.5 + 0.25 * Math.sin(ph)) ; fy = ty + th * (0.18 + 0.05 * Math.sin(T * 6 + ph)); }
        const L = 8 * sz, wag = Math.sin(T * 7 * sp + ph) * 2 * sz;
        ctx.save(); ctx.translate(fx, fy); ctx.scale(fed ? (Math.sin(ph) > 0 ? -1 : 1) : dir, 1);
        ctx.fillStyle = col;
        ctx.beginPath(); ctx.ellipse(0, 0, L, L * 0.5, 0, 0, 7); ctx.fill();
        ctx.beginPath(); ctx.moveTo(-L * 0.8, 0); ctx.lineTo(-L * 1.6, -L * 0.6 + wag); ctx.lineTo(-L * 1.6, L * 0.6 + wag); ctx.closePath(); ctx.fill();
        ctx.fillStyle = "rgba(255,255,255,0.35)"; ctx.beginPath(); ctx.ellipse(L * 0.1, -L * 0.2, L * 0.5, L * 0.14, 0, 0, 7); ctx.fill();
        ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(L * 0.55, -L * 0.1, 1.5 * sz + 0.3, 0, 7); ctx.fill();
        ctx.fillStyle = "#111"; ctx.beginPath(); ctx.arc(L * 0.6, -L * 0.1, 0.8 * sz + 0.2, 0, 7); ctx.fill();
        ctx.restore();
      });
      if (fed) { ctx.fillStyle = "#fcd34d"; for (let k = 0; k < 7; k++) ctx.fillRect(tx + tw * (0.3 + 0.07 * k) + Math.sin(T * 3 + k) * 2, ty + 4 + ((T * 14 + k * 9) % (th * 0.6)), 1.4, 1.4); }
      // bong bóng
      ctx.strokeStyle = "rgba(255,255,255,0.55)"; ctx.lineWidth = 0.8;
      for (let k = 0; k < 5; k++) { const p = ((T * 0.45 + k * 0.21) % 1); ctx.beginPath(); ctx.arc(tx + tw * 0.62 + Math.sin(T * 2 + k) * 2 + k, ty + th - 6 - p * (th - 8), 1 + (k % 3) * 0.5, 0, 7); ctx.stroke(); }
      // kính + phản chiếu + viền
      ctx.fillStyle = "rgba(255,255,255,0.12)"; ctx.fillRect(tx + 3, ty + 3, 3, th - 8);
      ctx.strokeStyle = "rgba(200,230,240,0.7)"; ctx.lineWidth = 1.4; ctx.strokeRect(tx, ty, tw, th);
      ctx.fillStyle = "#3b2a1c"; ctx.fillRect(tx - 3, ty + th - 1, tw + 6, 4);
      this.hitboxes.push({ id: "fishtank", x: tx, y: ty - 4, w: tw, h: th + 6 });
    }

    // 4. Custom Lantern Lighting & Volumetric Warm Cone
    const lanternX = w * 0.48;
    const lanternY = h * 0.14;
    const glowRadius = Math.max(120, w * 0.32);

    const coneGrad = ctx.createRadialGradient(lanternX, lanternY, 8, lanternX, lanternY + h * 0.25, glowRadius);
    coneGrad.addColorStop(0, "rgba(253, 224, 71, 0.28)");
    coneGrad.addColorStop(0.55, "rgba(245, 158, 11, 0.11)");
    coneGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = coneGrad;
    ctx.fillRect(0, 0, w, h);

    this.dustMotes.forEach((m) => {
      const mx = m.x * w + Math.sin(timeSec * 0.8 + m.phase) * 8;
      const my = m.y * h + Math.cos(timeSec * 0.6 + m.phase) * 5;
      const alpha = 0.2 + 0.25 * Math.sin(timeSec * 2 + m.phase);
      ctx.fillStyle = `rgba(253, 230, 138, ${Math.max(0.05, alpha)})`;
      ctx.beginPath();
      ctx.arc(mx, my, m.r, 0, Math.PI * 2);
      ctx.fill();
    });

    if (custom.lantern === "lantern_star") {
      ctx.strokeStyle = "rgba(253, 224, 71, 0.5)";
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(w * 0.3, h * 0.04);
      ctx.quadraticCurveTo(w * 0.48, h * 0.13, w * 0.65, h * 0.04);
      ctx.stroke();
      [0.34, 0.41, 0.48, 0.55, 0.62].forEach((sx, idx) => {
        const sy = h * (0.065 + (idx === 2 ? 0.03 : idx === 1 || idx === 3 ? 0.018 : 0));
        ctx.fillStyle = idx % 2 === 0 ? "#fde047" : season.lantern;
        ctx.beginPath();
        ctx.arc(w * sx, sy, 3.6, 0, Math.PI * 2);
        ctx.fill();
      });
    } else if (custom.lantern === "lantern_moon") {
      ctx.strokeStyle = "#a8a29e";
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(lanternX, 0);
      ctx.lineTo(lanternX, lanternY - 14);
      ctx.stroke();
      ctx.save();
      ctx.shadowColor = "rgba(253, 230, 138, 0.9)";
      ctx.shadowBlur = 16;
      ctx.fillStyle = "#fde68a";
      ctx.beginPath();
      ctx.arc(lanternX, lanternY, 13, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      ctx.fillStyle = season.bgTop;
      ctx.beginPath();
      ctx.arc(lanternX + 7, lanternY - 3, 11, 0, Math.PI * 2);
      ctx.fill();
    } else if (custom.lantern === "lantern_vintage") {
      ctx.strokeStyle = "#b45309";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(lanternX, 0);
      ctx.lineTo(lanternX, lanternY - 12);
      ctx.stroke();
      ctx.fillStyle = "#78350f";
      ctx.beginPath();
      ctx.moveTo(lanternX - 18, lanternY - 6);
      ctx.lineTo(lanternX + 18, lanternY - 6);
      ctx.lineTo(lanternX + 9, lanternY - 15);
      ctx.lineTo(lanternX - 9, lanternY - 15);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = "#fef08a";
      ctx.beginPath();
      ctx.arc(lanternX, lanternY - 3, 6.5, 0, Math.PI);
      ctx.fill();
    } else {
      ctx.strokeStyle = "#78350f";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(lanternX, 0);
      ctx.lineTo(lanternX, lanternY - 14);
      ctx.stroke();
      ctx.fillStyle = season.lantern;
      ctx.beginPath();
      ctx.roundRect(lanternX - 12, lanternY - 14, 24, 28, 8);
      ctx.fill();
      ctx.fillStyle = "#451a03";
      ctx.fillRect(lanternX - 9, lanternY - 16, 18, 3);
      ctx.fillRect(lanternX - 9, lanternY + 13, 18, 3);
    }

    // 5. Characters Behind/At the Counter
    const counterY = h * 0.72;
    const portraitScale = Math.max(0.88, Math.min(1.22, h / 175));
    const isTalkingNow = this.talkAnimTimer > 0;
    if (this.talkAnimTimer > 0) this.talkAnimTimer -= 16;

    const bunnyX = w * 0.34;
    const waveActive = this.bunnyWaveTimer > 0;
    if (this.bunnyWaveTimer > 0) this.bunnyWaveTimer -= 16;
    this.drawBunnyBarista(ctx, bunnyX, counterY + 2, portraitScale, waveActive, isTalkingNow && (this.speakerId === "host" || !this.speakerId), timeSec, this.speakerId === "host" ? this.emotion : "neutral", Boolean(this.speakerId) && this.speakerId !== "host");
    if (isSecretUnlocked("secret_master")) {
      ctx.save();
      ctx.fillStyle = "#fde047";
      ctx.shadowColor = "rgba(253, 224, 71, 0.95)";
      ctx.shadowBlur = 10;
      ctx.font = `${Math.round(16 * portraitScale)}px Inter`;
      ctx.textAlign = "center";
      ctx.fillText("★", bunnyX, counterY - 104 * portraitScale + Math.sin(timeSec * 2.5) * 2);
      ctx.restore();
    }
    this.hitboxes.push({
      id: "bunny",
      x: bunnyX - 32 * portraitScale,
      y: counterY - 82 * portraitScale,
      w: 64 * portraitScale,
      h: 84 * portraitScale
    });

    const visibleGuests = getStageVisibleGuests();
    const crowd = visibleGuests.length > 2;
    const guestScale = crowd ? portraitScale * 0.72 : portraitScale;
    visibleGuests.forEach((guest, idx) => {
      const gx = crowd
        ? w * (0.45 + idx * 0.075)
        : visibleGuests.length === 1
        ? w * 0.57
        : w * (0.52 + idx * 0.14);
      this.drawPersonPortrait(ctx, gx, counterY + 2, guestScale, {
        hairColor: guest.hairColor,
        outfitColor: guest.outfitColor,
        accessory: guest.accessory,
        isTalking: isTalkingNow && this.speakerId === guest.id,
        listening: Boolean(this.speakerId) && this.speakerId !== guest.id,
        emotion: this.speakerId === guest.id ? this.emotion : "neutral",
        timeSec,
        seed: idx + 1.5
      });
      this.hitboxes.push({
        id: "guest",
        guest,
        x: gx - 30 * guestScale,
        y: counterY - 72 * guestScale,
        w: 60 * guestScale,
        h: 74 * guestScale
      });
    });

    // 6. Custom Wooden Bar Counter
    const woodPalette =
      custom.counter === "wood_gold"
        ? { top: "#92400e", body: "#2a1a0e", trim: "#fbbf24" }
        : custom.counter === "wood_walnut"
        ? { top: "#44281d", body: "#24140e", trim: "#78350f" }
        : custom.counter === "wood_linen"
        ? { top: "#7c2d12", body: "#3b1d14", trim: "#f59e0b" }
        : { top: "#78350f", body: "#3f2212", trim: "#b45309" };

    ctx.fillStyle = woodPalette.body;
    ctx.fillRect(0, counterY, w, h - counterY);
    ctx.fillStyle = woodPalette.top;
    ctx.fillRect(0, counterY, w, 10);
    ctx.fillStyle = "rgba(255,235,200,0.22)"; ctx.fillRect(0, counterY, w, 1.6);               // ánh bóng mép gỗ
    { const rg = ctx.createRadialGradient(w * 0.48, counterY + 4, 2, w * 0.48, counterY + 4, w * 0.3); rg.addColorStop(0, "rgba(253,224,71,0.35)"); rg.addColorStop(1, "rgba(253,224,71,0)"); ctx.save(); ctx.translate(0, counterY + 4); ctx.scale(1, 0.12); ctx.translate(0, -(counterY + 4)); ctx.fillStyle = rg; ctx.fillRect(0, counterY - 60, w, 140); ctx.restore(); }  // phản chiếu đèn trên mặt quầy
    ctx.fillStyle = woodPalette.trim;
    ctx.fillRect(0, counterY + 10, w, 2);

    ctx.strokeStyle = "rgba(0,0,0,0.3)";
    ctx.lineWidth = 1.2;
    for (let cx = w * 0.1; cx < w; cx += w * 0.2) {
      ctx.strokeRect(cx, counterY + 16, w * 0.16, h - counterY - 22);
    }

    if (custom.counter === "wood_linen") {
      ctx.fillStyle = "#b91c1c";
      ctx.fillRect(w * 0.44, counterY, w * 0.24, h - counterY);
      ctx.strokeStyle = "#fbbf24";
      ctx.lineWidth = 1.4;
      ctx.strokeRect(w * 0.44 + 3, counterY + 2, w * 0.24 - 6, h - counterY - 4);
    }

    if (runState && runState.lastDrinkName && runState.beatIndex >= 3) {
      const cupX = w * 0.46;
      const cupY = counterY - 2;
      ctx.fillStyle = "#fef3c7";
      ctx.beginPath();
      ctx.roundRect(cupX - 7, cupY - 12, 14, 12, 2);
      ctx.fill();
      ctx.fillStyle = "#d97706";
      ctx.fillRect(cupX - 6, cupY - 10, 12, 4);
      if (isSecretUnlocked("secret_perfect")) {
        ctx.strokeStyle = "#fbbf24";
        ctx.lineWidth = 1.6;
        ctx.strokeRect(cupX - 7, cupY - 12, 14, 12);
      }
      ctx.strokeStyle = "rgba(255,255,255,0.45)";
      ctx.lineWidth = 1.2;
      const steamShift = Math.sin(timeSec * 3) * 2;
      const puff = this.cupTimer > 0 ? 1 + (this.cupTimer -= 16) / 500 : 1;
      for (let k = 0; k < (this.cupTimer > 0 ? 3 : 1); k++) {
        ctx.beginPath();
        ctx.moveTo(cupX - 2 + k * 3, cupY - 15);
        ctx.quadraticCurveTo(cupX - 5 + k * 3 + steamShift, cupY - 22 * puff, cupX - 1 + k * 3, cupY - 28 * puff);
        ctx.stroke();
      }
      this.hitboxes.push({ id: "cup", x: cupX - 12, y: cupY - 32, w: 24, h: 36 });
    }

    // 7. Custom Countertop Decor
    const decorX = w * 0.87;
    const decorY = counterY;
    const activeDecor = custom.decor || "decor_seasonal";
    if (activeDecor === "decor_deck") {
      ctx.save();
      ctx.shadowColor = "rgba(253, 224, 71, 0.9)";
      ctx.shadowBlur = 12;
      [[-0.3, "#fef3c7"], [0, "#fde68a"], [0.28, "#fbbf24"]].forEach(([rot, col], i) => {
        ctx.save();
        ctx.translate(decorX - 2 + i * 4, decorY - 4);
        ctx.rotate(rot);
        ctx.fillStyle = col;
        ctx.fillRect(-7, -20, 14, 20);
        ctx.strokeStyle = "#92400e";
        ctx.lineWidth = 1;
        ctx.strokeRect(-7, -20, 14, 20);
        ctx.restore();
      });
      ctx.restore();
    } else if (activeDecor === "decor_keepsakes") {
      ctx.fillStyle = "#451a03";
      ctx.fillRect(decorX - 26, decorY - 6, 52, 6);
      let gotAll = true;
      STANDARD_GUEST_ORDER.forEach((gid, i) => {
        const got = Boolean(persistentArchive.unlockedKeepsakes[gid]);
        if (!got) gotAll = false;
        ctx.globalAlpha = got ? 1 : 0.3;
        ctx.fillStyle = CHARACTERS[gid].outfitColor;
        ctx.beginPath();
        ctx.arc(decorX - 22 + i * 7.4, decorY - 11, 3.2, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1;
      if (gotAll) {
        ctx.fillStyle = `rgba(253, 224, 71, ${0.12 + 0.1 * Math.sin(timeSec * 2)})`;
        ctx.beginPath();
        ctx.ellipse(decorX, decorY - 10, 30, 12, 0, 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (activeDecor === "decor_books") {
      ctx.fillStyle = "#991b1b";
      ctx.fillRect(decorX - 16, decorY - 8, 28, 7);
      ctx.fillStyle = "#1e3a8a";
      ctx.fillRect(decorX - 14, decorY - 15, 24, 7);
      ctx.fillStyle = "#fef3c7";
      ctx.fillRect(decorX - 4, decorY - 25, 6, 10);
      ctx.fillStyle = "#fbbf24";
      ctx.beginPath();
      ctx.arc(decorX - 1, decorY - 28, 2.6, 0, Math.PI * 2);
      ctx.fill();
    } else if (activeDecor === "decor_gramophone") {
      ctx.fillStyle = "#451a03";
      ctx.fillRect(decorX - 16, decorY - 10, 26, 10);
      ctx.fillStyle = "#f59e0b";
      ctx.beginPath();
      ctx.moveTo(decorX - 2, decorY - 10);
      ctx.lineTo(decorX + 12, decorY - 25);
      ctx.lineTo(decorX + 12, decorY - 12);
      ctx.closePath();
      ctx.fill();
    } else {
      // chậu hoa theo mùa: tưới nước để cây lớn dần (mỗi 3 lần tưới lên một bậc, 15 lần là nở rộ)
      const water = persistentArchive.plantWater || 0, stg = Math.min(5, Math.floor(water / 3));
      const sway = Math.sin(timeSec * 1.4) * (1 + stg * 0.3), hgt = 4 + stg * 5.5;
      const px = decorX - 2, py = decorY - 11;
      ctx.fillStyle = "#b45309";                                   // chậu đất nung
      ctx.beginPath(); ctx.moveTo(px - 10, py); ctx.lineTo(px + 10, py); ctx.lineTo(px + 7.5, py + 11); ctx.lineTo(px - 7.5, py + 11); ctx.closePath(); ctx.fill();
      ctx.fillStyle = "#92400e"; ctx.fillRect(px - 11, py - 2, 22, 3.4);
      ctx.fillStyle = "rgba(255,255,255,0.16)"; ctx.fillRect(px - 8, py + 2, 2, 8);
      ctx.fillStyle = "#3b2414"; ctx.fillRect(px - 9, py - 3, 18, 2);   // đất
      ctx.strokeStyle = "#3f9d5a"; ctx.lineWidth = 2; ctx.lineCap = "round";
      ctx.beginPath(); ctx.moveTo(px, py - 3); ctx.quadraticCurveTo(px + sway * 0.4, py - hgt * 0.5, px + sway, py - 3 - hgt); ctx.stroke();
      ctx.fillStyle = "#4ade80";
      const leaves = Math.min(6, 1 + stg + (water > 0 ? 1 : 0));
      for (let k = 0; k < leaves; k++) { const ly = py - 5 - (hgt * (k + 0.5)) / (leaves + 0.5), sd = k % 2 ? 1 : -1; ctx.beginPath(); ctx.ellipse(px + sd * 4.5 + sway * 0.5, ly, 4.2, 1.9, sd * -0.5, 0, Math.PI * 2); ctx.fill(); }
      if (stg >= 2) {                                                 // hoa nở dần từ bậc 2
        const nb = stg - 1;
        for (let k = 0; k < nb; k++) {
          const bx = px + sway + (k - (nb - 1) / 2) * 6.5, by = py - 5 - hgt - (k % 2) * 4 + Math.sin(timeSec * 2 + k) * 0.6;
          ctx.fillStyle = season.lantern;
          for (let q = 0; q < 5; q++) { const an = q * 1.2566 + timeSec * 0.2; ctx.beginPath(); ctx.arc(bx + Math.cos(an) * 3, by + Math.sin(an) * 3, 2.5, 0, Math.PI * 2); ctx.fill(); }
          ctx.fillStyle = "#fde047"; ctx.beginPath(); ctx.arc(bx, by, 1.8, 0, Math.PI * 2); ctx.fill();
        }
      } else if (water === 0) { ctx.fillStyle = "rgba(253,230,138,0.8)"; ctx.font = "bold 8px Inter"; ctx.fillText("💧", px - 5, py - 16 - Math.abs(Math.sin(timeSec * 2)) * 2); }
      if (stg >= 5) { ctx.fillStyle = "rgba(253,246,200,0.9)"; for (let k = 0; k < 4; k++) { const p = (timeSec * 0.4 + k * 0.25) % 1; ctx.globalAlpha = 1 - p; ctx.beginPath(); ctx.arc(px - 12 + k * 8 + Math.sin(timeSec * 2 + k) * 3, py - 14 - hgt * 0.4 + p * 26, 1.3, 0, Math.PI * 2); ctx.fill(); } ctx.globalAlpha = 1; }
      if (this.plantTimer > 0) {                                      // bình tưới nghiêng + giọt nước
        this.plantTimer -= 16; const u = 1 - this.plantTimer / 1400;
        ctx.save(); ctx.translate(px - 18, py - 24); ctx.rotate(-0.5 - 0.3 * Math.sin(u * 8));
        ctx.fillStyle = "#94a3b8"; ctx.fillRect(-7, -4, 14, 8); ctx.fillRect(5, -2, 9, 2); ctx.restore();
        ctx.fillStyle = "rgba(147,197,253,0.9)";
        for (let k = 0; k < 5; k++) { const p = (u * 3 + k * 0.2) % 1; ctx.beginPath(); ctx.arc(px - 4 + k * 1.6, py - 22 + p * 18, 1.2, 0, Math.PI * 2); ctx.fill(); }
      }
      this.hitboxes.push({ id: "plant", x: decorX - 18, y: decorY - 52, w: 36, h: 54 });
    }

    // 7a. Tủ kính kỷ vật: 7 ngăn nhỏ, kỷ vật nào đã nhận thì hiện biểu tượng; chạm để mở bộ sưu tập
    {
      const cx0 = w * 0.775 - 15, cw = 30, ch = 40, cy0 = counterY - ch;
      const got = STANDARD_GUEST_ORDER.map((g) => Boolean(persistentArchive.unlockedKeepsakes && persistentArchive.unlockedKeepsakes[g]));
      const all = got.every(Boolean), n = got.filter(Boolean).length;
      if (all) { const g2 = ctx.createRadialGradient(cx0 + cw / 2, cy0 + ch / 2, 4, cx0 + cw / 2, cy0 + ch / 2, 34); g2.addColorStop(0, `rgba(253,224,71,${0.25 + 0.1 * Math.sin(timeSec * 2)})`); g2.addColorStop(1, "rgba(253,224,71,0)"); ctx.fillStyle = g2; ctx.fillRect(cx0 - 20, cy0 - 14, cw + 40, ch + 28); }
      ctx.fillStyle = "#4a2c17"; ctx.fillRect(cx0, cy0, cw, ch);                       // khung gỗ
      ctx.fillStyle = "#1c130d"; ctx.fillRect(cx0 + 2, cy0 + 4, cw - 4, ch - 6);        // lòng tủ
      ctx.fillStyle = "#5c3a20"; ctx.beginPath(); ctx.moveTo(cx0 - 2, cy0 + 4); ctx.lineTo(cx0 + cw / 2, cy0 - 3); ctx.lineTo(cx0 + cw + 2, cy0 + 4); ctx.fill(); // mái
      ctx.fillStyle = all ? "rgba(253,224,71,0.18)" : "rgba(253,224,71,0.06)"; ctx.fillRect(cx0 + 2, cy0 + 4, cw - 4, ch - 6);
      ctx.fillStyle = "#4a2c17"; ctx.fillRect(cx0 + 2, cy0 + 4 + (ch - 6) / 3, cw - 4, 1.5); ctx.fillRect(cx0 + 2, cy0 + 4 + 2 * (ch - 6) / 3, cw - 4, 1.5); // ngăn
      ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.font = "7px sans-serif";
      STANDARD_GUEST_ORDER.forEach((gid, i) => {
        const row = i < 3 ? 0 : i < 5 ? 1 : 2, col = i < 3 ? i : i < 5 ? i - 3 : i - 5;
        const ix = cx0 + 2 + (cw - 4) * (col + 0.5) / (row === 0 ? 3 : 2.0 + (row === 2 ? 0 : 0)), iy = cy0 + 4 + (ch - 6) * (row + 0.5) / 3 - 1;
        if (got[i]) { ctx.globalAlpha = 1; ctx.fillText(CHARACTERS[gid].keepsake.icon, ix, iy); }
        else { ctx.globalAlpha = 0.35; ctx.fillStyle = "#a8a29e"; ctx.beginPath(); ctx.arc(ix, iy, 2, 0, 7); ctx.fill(); }
      });
      ctx.globalAlpha = 1; ctx.textAlign = "start"; ctx.textBaseline = "alphabetic";
      ctx.fillStyle = "rgba(255,255,255,0.12)"; ctx.fillRect(cx0 + 4, cy0 + 5, 3, ch - 9);   // phản chiếu kính
      ctx.strokeStyle = "#7c4a24"; ctx.lineWidth = 1; ctx.strokeRect(cx0 + 2, cy0 + 4, cw - 4, ch - 6);
      ctx.fillStyle = "#fde68a"; ctx.font = "bold 6px Inter"; ctx.textAlign = "center"; ctx.fillText(`${n}/7`, cx0 + cw / 2, cy0 - 5); ctx.textAlign = "start";
      this.hitboxes.push({ id: "keepsakes", x: cx0 - 2, y: cy0 - 12, w: cw + 4, h: ch + 12 });
    }

    // 7b. Bếp than hồng đặt ở chỗ ngồi (trên quầy, bên phải khách): lò đất nung, than cháy lập lòe, ấm nước bốc hơi
    {
      const sx = w * 0.7, sy = counterY;
      const T = timeSec, fl = 0.5 + 0.5 * Math.sin(T * 7) * Math.sin(T * 3.1 + 1);
      const glow = ctx.createRadialGradient(sx, sy - 12, 2, sx, sy - 12, 44);
      glow.addColorStop(0, `rgba(251,146,60,${0.30 + 0.12 * fl})`); glow.addColorStop(1, "rgba(251,146,60,0)");
      ctx.fillStyle = glow; ctx.fillRect(sx - 46, sy - 58, 92, 70);
      // thân lò đất nung
      ctx.fillStyle = "#9a3412";
      ctx.beginPath(); ctx.moveTo(sx - 14, sy - 17); ctx.lineTo(sx + 14, sy - 17); ctx.lineTo(sx + 10, sy); ctx.lineTo(sx - 10, sy); ctx.closePath(); ctx.fill();
      ctx.fillStyle = "#7c2d12"; ctx.fillRect(sx - 15, sy - 19, 30, 3.5);                  // miệng lò
      ctx.fillStyle = "#1c1917"; ctx.beginPath(); ctx.ellipse(sx, sy - 8, 5, 3.5, 0, 0, 7); ctx.fill(); // cửa gió
      ctx.fillStyle = "#e7e5e4"; ctx.fillRect(sx - 12, sy - 14.5, 3, 1.2);                 // vạch trang trí
      // than hồng
      for (let k = 0; k < 5; k++) { ctx.fillStyle = (k + Math.floor(T * 3)) % 3 ? "#ea580c" : "#fbbf24"; ctx.beginPath(); ctx.arc(sx - 9 + k * 4.5, sy - 20.5 + (k % 2), 2.1, 0, 7); ctx.fill(); }
      ctx.fillStyle = `rgba(254,215,170,${0.35 + 0.3 * fl})`; ctx.beginPath(); ctx.arc(sx, sy - 21, 1.4, 0, 7); ctx.fill();
      // ấm nước trên bếp
      ctx.fillStyle = "#57534e"; ctx.beginPath(); ctx.ellipse(sx, sy - 27, 9, 7, 0, 0, 7); ctx.fill();
      ctx.fillStyle = "#44403c"; ctx.fillRect(sx - 3, sy - 35, 6, 3);
      ctx.strokeStyle = "#57534e"; ctx.lineWidth = 2.2; ctx.lineCap = "round";
      ctx.beginPath(); ctx.moveTo(sx + 7, sy - 28); ctx.quadraticCurveTo(sx + 15, sy - 30, sx + 13, sy - 37); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(sx - 8, sy - 32); ctx.quadraticCurveTo(sx, sy - 41, sx + 8, sy - 32); ctx.stroke();
      // hơi nước
      ctx.strokeStyle = "rgba(254,243,199,0.35)"; ctx.lineWidth = 1;
      for (let k = 0; k < 2; k++) { const p = (T * 0.5 + k * 0.5) % 1; ctx.globalAlpha = 1 - p; ctx.beginPath(); ctx.moveTo(sx + 13 + k * 2, sy - 38 - p * 14); ctx.quadraticCurveTo(sx + 10 + Math.sin(T * 2 + k) * 3, sy - 44 - p * 14, sx + 14, sy - 49 - p * 14); ctx.stroke(); }
      ctx.globalAlpha = 1;
      // tàn lửa bay
      ctx.fillStyle = "#fdba74";
      for (let k = 0; k < 3; k++) { const p = (T * 0.4 + k * 0.33) % 1; ctx.globalAlpha = 1 - p; ctx.fillRect(sx - 5 + k * 5 + Math.sin(T * 3 + k) * 3, sy - 24 - p * 22, 1.2, 1.2); }
      ctx.globalAlpha = 1;
      this.hitboxes.push({ id: "stove", x: sx - 16, y: sy - 42, w: 34, h: 44 });
    }

    // 8. Radio cổ trên quầy: ăng-ten, loa lưới, mặt đài có vạch kênh + kim, núm xoay
    const radioX = w * 0.1;
    const radioY = counterY - 24;
    ctx.strokeStyle = "#d6d3d1"; ctx.lineWidth = 1.2; ctx.lineCap = "round";
    ctx.beginPath(); ctx.moveTo(radioX + 31, radioY); ctx.lineTo(radioX + 40, radioY - 12); ctx.stroke();
    ctx.fillStyle = "#d6d3d1"; ctx.beginPath(); ctx.arc(radioX + 40, radioY - 12, 1.3, 0, 7); ctx.fill();
    ctx.fillStyle = "#92400e";
    ctx.beginPath(); ctx.roundRect(radioX, radioY, 38, 24, 5); ctx.fill();
    ctx.fillStyle = "#78350f"; ctx.fillRect(radioX + 3, radioY + 22, 6, 2); ctx.fillRect(radioX + 29, radioY + 22, 6, 2);
    // loa lưới
    ctx.fillStyle = "#451a03"; ctx.beginPath(); ctx.roundRect(radioX + 3, radioY + 3, 15, 18, 2); ctx.fill();
    ctx.strokeStyle = "#a16207"; ctx.lineWidth = 0.8;
    for (let k = 0; k < 5; k++) { ctx.beginPath(); ctx.moveTo(radioX + 5, radioY + 6 + k * 3); ctx.lineTo(radioX + 16, radioY + 6 + k * 3); ctx.stroke(); }
    // mặt đài + kim
    ctx.fillStyle = this.radioPulseTimer > 0 ? "#fef08a" : "#fde68a";
    ctx.beginPath(); ctx.roundRect(radioX + 20, radioY + 3, 15, 8, 1.5); ctx.fill();
    ctx.strokeStyle = "#78350f"; ctx.lineWidth = 0.6;
    for (let k = 0; k < 6; k++) { ctx.beginPath(); ctx.moveTo(radioX + 22 + k * 2.4, radioY + 8); ctx.lineTo(radioX + 22 + k * 2.4, radioY + 10); ctx.stroke(); }
    ctx.strokeStyle = "#dc2626"; ctx.lineWidth = 0.9;
    const nx = radioX + 24 + (this.radioPulseTimer > 0 ? 6 + Math.sin(timeSec * 20) : 3);
    ctx.beginPath(); ctx.moveTo(nx, radioY + 4); ctx.lineTo(nx, radioY + 10); ctx.stroke();
    // núm xoay
    ctx.fillStyle = "#fbbf24";
    ctx.beginPath(); ctx.arc(radioX + 24.5, radioY + 17, 3.2, 0, 7); ctx.arc(radioX + 31.5, radioY + 17, 3.2, 0, 7); ctx.fill();
    ctx.strokeStyle = "#78350f"; ctx.lineWidth = 0.8;
    ctx.beginPath(); ctx.moveTo(radioX + 24.5, radioY + 17); ctx.lineTo(radioX + 24.5, radioY + 14.6); ctx.moveTo(radioX + 31.5, radioY + 17); ctx.lineTo(radioX + 33, radioY + 15.5); ctx.stroke();
    if (this.radioPulseTimer > 0) this.radioPulseTimer -= 16;
    this.hitboxes.push({ id: "radio", x: radioX, y: radioY - 12, w: 42, h: 36 });

    // 9. Calico (mèo tam thể) ngủ cuộn tròn trên nệm nhung
    const catX = w * 0.21;
    const catY = counterY - 14;
    {
      const cx = catX + 18;
      const base = counterY - 4;
      const tS = performance.now() / 1000;
      const br = Math.sin(tS * 2.0) * 0.7;
      const circle = (x, y, r) => { ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); };
      // nệm
      ctx.fillStyle = "#7f1d33";
      ctx.beginPath(); ctx.ellipse(cx, base + 2, 25, 6, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#9f2544";
      ctx.beginPath(); ctx.ellipse(cx, base, 24, 4.5, 0, 0, Math.PI * 2); ctx.fill();
      // đuôi quấn phía trước (vằn cam-đen, chóp trắng)
      ctx.lineCap = "round";
      ctx.strokeStyle = "#e8891c"; ctx.lineWidth = 5;
      ctx.beginPath(); ctx.moveTo(cx + 17, base - 7); ctx.quadraticCurveTo(cx + 22, base + 1, cx + 6, base + 1); ctx.stroke();
      ctx.strokeStyle = "#1f1a17"; ctx.lineWidth = 5;
      ctx.beginPath(); ctx.moveTo(cx + 6, base + 1); ctx.quadraticCurveTo(cx - 3, base + 2, cx - 9, base); ctx.stroke();
      // thân (có clip để vẽ mảng màu)
      ctx.save();
      ctx.beginPath(); ctx.ellipse(cx + 3, base - 8 - br * 0.5, 18, 9.5 + br * 0.6, 0, 0, Math.PI * 2); ctx.clip();
      ctx.fillStyle = "#fbf7f0"; ctx.fillRect(cx - 20, base - 24, 44, 30);
      ctx.fillStyle = "#e8891c"; circle(cx + 6, base - 13, 7.5); ctx.fill(); circle(cx - 2, base - 6, 4.5); ctx.fill();
      ctx.fillStyle = "#1f1a17"; circle(cx + 17, base - 9, 7); ctx.fill(); circle(cx + 10, base - 3, 3.5); ctx.fill();
      ctx.restore();
      // chân trước thu gọn
      ctx.fillStyle = "#fbf7f0";
      ctx.beginPath(); ctx.ellipse(cx - 8, base - 1, 6, 3.2, 0, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = "rgba(60,40,30,.35)"; ctx.lineWidth = 0.8;
      ctx.beginPath(); ctx.moveTo(cx - 8, base - 3.5); ctx.lineTo(cx - 8, base + 1); ctx.stroke();
      // đầu gối lên chân
      const hx = cx - 13, hy = base - 10;
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
      if (isSecretUnlocked("secret_cat")) {
        ctx.strokeStyle = "#dc2626"; ctx.lineWidth = 1.8;
        ctx.beginPath(); ctx.arc(hx, hy + 5, 7, 0.15 * Math.PI, 0.85 * Math.PI); ctx.stroke();
        ctx.fillStyle = "#fbbf24"; circle(hx, hy + 12, 2.2); ctx.fill();
      }
      // "z z" bay lên
      ctx.fillStyle = "rgba(253,230,138," + (0.5 + 0.4 * Math.sin(tS * 1.5)) + ")";
      ctx.font = "bold 9px Inter";
      ctx.fillText("z", hx + 12, hy - 14 - ((tS * 4) % 6));
    }

    if (this.catPurrTimer > 0) {
      this.catPurrTimer -= 16;
      ctx.fillStyle = "#fda4af";
      ctx.font = "12px Inter";
      ctx.fillText("♥ Purr~", catX - 2, catY - 18);
    }
    this.hitboxes.push({ id: "cat", x: catX - 4, y: catY - 16, w: 40, h: 30 });

    // ===== hậu kỳ kiểu anime: chùm sáng, bokeh, bloom, sắc độ phim, tối góc =====
    {
      const lxx = w * 0.48, lyy = h * 0.14;
      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      // chùm sáng chéo từ đèn lồng
      const sh = 0.05 + 0.015 * Math.sin(timeSec * 0.9);
      const shg = ctx.createLinearGradient(lxx, lyy, lxx, counterY);
      shg.addColorStop(0, `rgba(255,214,140,${sh * 2.4})`); shg.addColorStop(1, "rgba(255,214,140,0)");
      ctx.fillStyle = shg; ctx.beginPath(); ctx.moveTo(lxx - 8, lyy + 8); ctx.lineTo(lxx + 8, lyy + 8); ctx.lineTo(lxx + w * 0.16, counterY); ctx.lineTo(lxx - w * 0.16, counterY); ctx.closePath(); ctx.fill();
      // quầng sáng (bloom) quanh đèn
      const bg = ctx.createRadialGradient(lxx, lyy, 2, lxx, lyy, w * 0.2);
      bg.addColorStop(0, "rgba(255,200,110,0.30)"); bg.addColorStop(1, "rgba(255,200,110,0)");
      ctx.fillStyle = bg; ctx.fillRect(0, 0, w, h * 0.7);
      // bokeh lơ lửng
      for (let i = 0; i < 9; i++) {
        const bx = ((i * 0.117 + 0.05 + Math.sin(timeSec * 0.07 + i) * 0.02) % 1) * w, by = (0.12 + ((i * 0.37) % 0.5)) * h + Math.sin(timeSec * 0.3 + i * 2) * 6, br = 10 + (i % 4) * 7;
        const gg = ctx.createRadialGradient(bx, by, 0, bx, by, br);
        const cc = ["255,200,120", "255,170,190", "170,220,255"][i % 3];
        gg.addColorStop(0, `rgba(${cc},${0.10 + 0.05 * Math.sin(timeSec + i)})`); gg.addColorStop(0.75, `rgba(${cc},0.05)`); gg.addColorStop(1, `rgba(${cc},0)`);
        ctx.fillStyle = gg; ctx.beginPath(); ctx.arc(bx, by, br, 0, Math.PI * 2); ctx.fill();
      }
      ctx.restore();
      // sắc độ phim: tím lạnh phía trên, cam ấm phía dưới
      const cg = ctx.createLinearGradient(0, 0, 0, h);
      cg.addColorStop(0, "rgba(70,50,140,0.14)"); cg.addColorStop(0.6, "rgba(0,0,0,0)"); cg.addColorStop(1, "rgba(255,140,60,0.09)");
      ctx.fillStyle = cg; ctx.fillRect(0, 0, w, h);
      // lấp lánh anime nhỏ
      ctx.fillStyle = "rgba(255,248,210,0.9)";
      for (let i = 0; i < 5; i++) {
        const ph = (timeSec * 0.5 + i * 0.37) % 2; if (ph > 0.8) continue;
        const a = Math.sin(ph / 0.8 * Math.PI), sx = w * (0.28 + i * 0.13), sy = h * (0.1 + ((i * 53) % 30) / 100), r = 4 * a;
        ctx.globalAlpha = a; ctx.beginPath(); ctx.moveTo(sx, sy - r); ctx.lineTo(sx + r * 0.25, sy - r * 0.25); ctx.lineTo(sx + r, sy); ctx.lineTo(sx + r * 0.25, sy + r * 0.25); ctx.lineTo(sx, sy + r); ctx.lineTo(sx - r * 0.25, sy + r * 0.25); ctx.lineTo(sx - r, sy); ctx.lineTo(sx - r * 0.25, sy - r * 0.25); ctx.closePath(); ctx.fill();
      }
      ctx.globalAlpha = 1;
      // tối góc
      const vg = ctx.createRadialGradient(w / 2, h * 0.5, Math.min(w, h) * 0.45, w / 2, h * 0.5, Math.max(w, h) * 0.75);
      vg.addColorStop(0, "rgba(8,4,16,0)"); vg.addColorStop(1, "rgba(8,4,16,0.5)");
      ctx.fillStyle = vg; ctx.fillRect(0, 0, w, h);
    }
  }

  handleTap(clientX, clientY) {
    const rect = this.canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    for (let i = this.hitboxes.length - 1; i >= 0; i--) {
      const box = this.hitboxes[i];
      if (x >= box.x && x <= box.x + box.w && y >= box.y && y <= box.y + box.h) {
        // cận cảnh đồ vật (lần đầu + mỗi 10 lần): chiếu xong mới chạy hành động mặc định bên dưới
        if (!this._fxBypass && typeof SceneFX !== "undefined" && SceneFX.touch(box, () => {
          this._fxBypass = true;
          try { this.handleTap(clientX, clientY); } finally { this._fxBypass = false; }
        })) return;
        if (box.id === "lantern") {
          if (typeof devLanternTap === "function") devLanternTap();
          return;
        }
        if (box.id === "shelf") {
          audioEngine.playChime(494, 0.2, 0.035);
          openBookshelf();
          return;
        }
        if (box.id === "plant") {
          const before = persistentArchive.plantWater || 0, now2 = before + 1;
          persistentArchive.plantWater = now2; this.plantTimer = 1400;
          saveArchive(); audioEngine.playChime(660 + Math.min(now2, 15) * 12, 0.15, 0.03);
          const stg = Math.min(5, Math.floor(now2 / 3));
          const L = ["💧 Hạt mầm uống nước, khẽ động đậy.", "🌱 Chiếc lá mới vừa hé ra.", "🌿 Cây vươn lên một chút, như đang nghe quán kể chuyện.", "🌼 Nụ hoa đầu tiên chúm chím.", "🌸 Hoa bung thêm vài cánh nữa.", "✨ Chậu hoa nở rộ — cả quán thơm lên!"];
          const W2 = ["💧 Nước thấm vào đất, tí tách.", "💧 Tưới thêm một chút nữa nhé."];
          const msg = now2 === 15 ? "🌸 Chậu hoa nở rộ rồi! Thỏ Con nói đây là chậu hoa đẹp nhất tiệm." : now2 > 15 ? "🌸 Hoa đã nở rộ, được tưới nên thơm hơn nữa." : now2 % 3 === 0 ? L[stg] : W2[now2 % 2];
          if (now2 === 15) { persistentArchive.plantBloomed = true; saveArchive(); if (typeof SceneFX !== "undefined") setTimeout(() => SceneFX.play("bloom", {}, null), 900); }
          showToast(`${msg} (${Math.min(now2, 15)}/15)`);
          return;
        }
        if (box.id === "cup") {
          this.cupTimer = 900; audioEngine.playChime(494, 0.2, 0.03);
          const nm = runState && runState.lastDrinkName ? runState.lastDrinkName : "ly nước";
          const ql = runState && runState.lastBrewQuality ? ` (${runState.lastBrewQuality})` : "";
          const SL = [`☕ ${nm}${ql} còn ấm — hơi nước vẫn bay lên.`, "🫗 Thỏ Con khẽ đẩy ly lại gần hơn: «Uống đi, kẻo nguội.»", "🥄 Vị ngọt dịu lan ra, đủ để người ta nói thêm một câu."];
          showToast(SL[Math.floor(Math.random() * SL.length)]);
          return;
        }
        if (box.id === "keepsakes") {
          audioEngine.playChime(587, 0.2, 0.03);
          if (typeof openKeepsakesModal === "function") openKeepsakesModal();
          return;
        }
        if (box.id === "fishtank") {
          this.fishFeedTimer = 2500;
          persistentArchive.fishFeedCount = (persistentArchive.fishFeedCount || 0) + 1;
          saveArchive();
          audioEngine.playChime(784, 0.15, 0.03);
          const FL = ["🐠 Bầy cá xúm lại đớp từng hạt thức ăn nhỏ xíu.", "🐟 Chú cá cam đớp trước, chú cá xanh phụng phịu bơi vòng lại.", "🫧 Cá nổi bong bóng — chắc là đang cảm ơn bạn đó."];
          showToast(FL[persistentArchive.fishFeedCount % FL.length] + ` (Đã cho ăn ${persistentArchive.fishFeedCount} lần)`);
          return;
        }
        if (box.id === "stove") {
          audioEngine.playChime(330, 0.2, 0.03);
          persistentArchive.stoveTaps = (persistentArchive.stoveTaps || 0) + 1;
          saveArchive();
          const SL = ["🔥 Bếp than tí tách. Ấm nước sắp sôi rồi.", "♨️ Than hồng vẫn đượm — chỗ ngồi này luôn ấm.", "🧣 Thỏ Con hay hâm nóng khăn len của khách cạnh bếp than."];
          showToast(SL[persistentArchive.stoveTaps % SL.length]);
          return;
        }
        if (box.id === "bottle") {
          const SYR = [
            ["🍯 Chai mật ong gừng", "ấm cổ họng — hợp những đêm trời trở lạnh."],
            ["🌹 Chai siro hoa hồng", "thơm nhẹ, dành cho người cần được dỗ dành."],
            ["🍵 Chai trà matcha", "đắng dịu, giúp đầu óc tỉnh mà không căng."],
            ["🫐 Chai siro việt quất", "chua ngọt vừa phải, vị của những ngày mới bắt đầu."],
            ["☕ Chai caramel cháy", "ngọt hơi đắng — như chuyện cũ kể lại lần nữa."],
          ];
          const it = SYR[box.idx % SYR.length];
          audioEngine.playChime(520 + box.idx * 60, 0.18, 0.03);
          persistentArchive.bottleTaps = (persistentArchive.bottleTaps || 0) + 1;
          saveArchive();
          showToast(`${it[0]}: ${it[1]}`);
          return;
        }
        if (box.id === "clock") {
          persistentArchive.clockTapCount = (persistentArchive.clockTapCount || 0) + 1;
          saveArchive();
          audioEngine.playChime(392 + (persistentArchive.clockTapCount % 7) * 40, 0.2, 0.035);
          if (isSecretUnlocked("secret_clock")) {
            const d = new Date();
            const hh = String(d.getHours()).padStart(2, "0");
            const mm = String(d.getMinutes()).padStart(2, "0");
            showToast(`🕰️ Bây giờ là ${hh}:${mm} — giờ thứ hai mươi lăm vẫn luôn chờ bạn.`);
          } else {
            showToast("🕰️ Tích tắc... kim đồng hồ khẽ rung lên một nhịp.");
          }
          checkAndUnlockAchievements();
          return;
        }
        if (box.id === "cat") {
          this.catPurrTimer = 1500;
          persistentArchive.petCatCount = (persistentArchive.petCatCount || 0) + 1;
          persistentArchive.discoveredEasterEggs.egg_cat = true;
          saveArchive();
          checkAndUnlockAchievements();
          audioEngine.playChime(659.25, 0.25, 0.04);
          if (persistentArchive.petCatCount === 5 && typeof SceneFX !== "undefined") setTimeout(() => SceneFX.play("cat", {}, null), 900);
          showToast(`🐾 Mèo tam thể khẽ kêu 'Purr~' đầy thích thú! (Đã vuốt ${persistentArchive.petCatCount} lần)`);
          return;
        }
        if (box.id === "radio") {
          this.radioPulseTimer = 1500;
          persistentArchive.discoveredEasterEggs.egg_radio = true;
          saveArchive();
          checkAndUnlockAchievements();
          audioEngine.playChime(440, 0.3, 0.04);
          const news =
            (runState && runState.previousNightRadioNews) ||
            "Đài FM Nửa Đêm: 'Thành phố đang mưa nhẹ, chúc những người thức khuya tìm thấy một góc bình yên.'";
          showToast(`📻 ${news}`);
          return;
        }
        if (box.id === "window") {
          persistentArchive.discoveredEasterEggs.egg_window = true;
          saveArchive();
          checkAndUnlockAchievements();
          audioEngine.playChime(587.33, 0.25, 0.04);
          const curSeason = this.getActiveSeason();
          showToast(`${curSeason.icon} ${curSeason.name}: ${curSeason.desc}`);
          return;
        }
        if (box.id === "bunny") {
          this.bunnyWaveTimer = 1200;
          persistentArchive.discoveredEasterEggs.egg_bunny = true;
          saveArchive();
          checkAndUnlockAchievements();
          audioEngine.playChime(783.99, 0.2, 0.04);
          showToast("🐰 Thỏ Con vẫy đôi tai dài: 'Chào bạn! Quầy nước luôn sẵn sàng sưởi ấm những tâm hồn đêm mưa.'");
          return;
        }
        if (box.id === "guest" && box.guest) {
          const extraGuest = EXTRA_DIALOGUE_BANK.soloExtra[box.guest.id];
          const lines = (extraGuest && extraGuest.stageTapLines) || [
            "💬 Vị khách khẽ mỉm cười thưởng thức không gian yên bình của quán."
          ];
          const line = lines[Math.floor(Math.random() * lines.length)];
          audioEngine.playChime(523.25, 0.22, 0.04);
          showToast(line);
          return;
        }
      }
    }
  }
}

const cafeCanvas = document.getElementById("cafe-canvas");
const stageRenderer = new CafeStageRenderer(cafeCanvas);

function animateStageLoop(now) {
  stageRenderer.draw(now);
  requestAnimationFrame(animateStageLoop);
}
