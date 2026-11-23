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
    this.fishFeedTimer = 0;
    this.stoveTimer = 0;
    this.bunnyWaveTimer = 0;
    this.radioPulseTimer = 0;
    this.talkAnimTimer = 0;
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

  drawPersonPortrait(ctx, x, y, scale, opts) {
    const {
      hairColor = "#292524",
      outfitColor = "#d97706",
      skinColor = "#fde68a",
      accessory = "none",
      isTalking = false,
      timeSec = 0,
      seed = 0
    } = opts;

    const breathY = Math.sin(timeSec * 2.1 + seed) * 1.4 * scale;
    const isBlinking = Math.sin(timeSec * 1.7 + seed * 2.3) > 0.965;

    ctx.save();
    ctx.translate(x, y + breathY);
    ctx.scale(scale, scale);

    // Soft shadow behind figure
    ctx.fillStyle = "rgba(0,0,0,0.35)";
    ctx.beginPath();
    ctx.ellipse(0, 4, 29, 10, 0, 0, Math.PI * 2);
    ctx.fill();

    // Back hair for long-haired characters
    if (accessory === "headphones" || accessory === "scarf" || accessory === "shawl") {
      ctx.fillStyle = hairColor;
      ctx.beginPath();
      ctx.roundRect(-21, -56, 42, 46, 16);
      ctx.fill();
    }

    // Torso & Shoulders
    ctx.fillStyle = outfitColor;
    ctx.beginPath();
    ctx.moveTo(-27, 4);
    ctx.quadraticCurveTo(-28, -22, -13, -26);
    ctx.lineTo(13, -26);
    ctx.quadraticCurveTo(28, -22, 27, 4);
    ctx.closePath();
    ctx.fill();

    // Collar V-neck
    ctx.fillStyle = "rgba(255,255,255,0.2)";
    ctx.beginPath();
    ctx.moveTo(-8, -26);
    ctx.lineTo(0, -13);
    ctx.lineTo(8, -26);
    ctx.closePath();
    ctx.fill();

    // Outfit accessories
    if (accessory === "apron") {
      ctx.fillStyle = "#451a03";
      ctx.beginPath();
      ctx.roundRect(-16, -24, 32, 28, 4);
      ctx.fill();
      ctx.strokeStyle = "#d97706";
      ctx.lineWidth = 1.4;
      ctx.strokeRect(-14, -22, 28, 25);
    } else if (accessory === "scarf") {
      ctx.fillStyle = "#9f1239";
      ctx.beginPath();
      ctx.roundRect(-16, -28, 32, 9, 4);
      ctx.fill();
      ctx.fillRect(4, -22, 8, 22);
    } else if (accessory === "shawl") {
      ctx.strokeStyle = "#f3e8ff";
      ctx.lineWidth = 2;
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.arc(0, -24, 18, 0.15 * Math.PI, 0.85 * Math.PI);
      ctx.stroke();
      ctx.setLineDash([]);
    } else if (accessory === "headphones") {
      ctx.fillStyle = "#1c1917";
      ctx.beginPath();
      ctx.roundRect(-17, -27, 7, 10, 3);
      ctx.roundRect(10, -27, 7, 10, 3);
      ctx.fill();
    }

    // Neck & Head
    ctx.fillStyle = skinColor;
    ctx.fillRect(-5, -33, 10, 9);
    ctx.beginPath();
    ctx.ellipse(0, -45, 16, 18, 0, 0, Math.PI * 2);
    ctx.fill();

    // Subtle warm blush
    ctx.fillStyle = "rgba(244, 63, 94, 0.18)";
    ctx.beginPath();
    ctx.ellipse(-9, -41, 3.5, 2, 0, 0, Math.PI * 2);
    ctx.ellipse(9, -41, 3.5, 2, 0, 0, Math.PI * 2);
    ctx.fill();

    // Hair front & bangs
    ctx.fillStyle = hairColor;
    ctx.beginPath();
    ctx.arc(0, -48, 17, Math.PI, Math.PI * 2);
    ctx.lineTo(17, -43);
    ctx.quadraticCurveTo(8, -51, 0, -47);
    ctx.quadraticCurveTo(-8, -51, -17, -43);
    ctx.closePath();
    ctx.fill();

    // Cap
    if (accessory === "cap") {
      ctx.fillStyle = "#14532d";
      ctx.beginPath();
      ctx.arc(0, -51, 17, Math.PI, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#052e16";
      ctx.beginPath();
      ctx.ellipse(3, -51, 20, 4, 0.06, 0, Math.PI * 2);
      ctx.fill();
    }

    // Eyes
    if (isBlinking) {
      ctx.strokeStyle = "#292524";
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(-8, -44);
      ctx.lineTo(-4, -44);
      ctx.moveTo(4, -44);
      ctx.lineTo(8, -44);
      ctx.stroke();
    } else {
      ctx.fillStyle = "#1c1917";
      ctx.beginPath();
      ctx.arc(-6, -44, 2.1, 0, Math.PI * 2);
      ctx.arc(6, -44, 2.1, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(-5.3, -44.7, 0.8, 0, Math.PI * 2);
      ctx.arc(6.7, -44.7, 0.8, 0, Math.PI * 2);
      ctx.fill();
    }

    // Glasses
    if (accessory === "glasses") {
      ctx.strokeStyle = "#e2e8f0";
      ctx.lineWidth = 1.3;
      ctx.strokeRect(-11, -48, 9, 7);
      ctx.strokeRect(2, -48, 9, 7);
      ctx.beginPath();
      ctx.moveTo(-2, -44.5);
      ctx.lineTo(2, -44.5);
      ctx.stroke();
    } else if (accessory === "round_glasses") {
      ctx.strokeStyle = "#fbbf24";
      ctx.lineWidth = 1.3;
      ctx.beginPath();
      ctx.arc(-6, -44, 4.5, 0, Math.PI * 2);
      ctx.moveTo(10.5, -44);
      ctx.arc(6, -44, 4.5, 0, Math.PI * 2);
      ctx.moveTo(-1.5, -44);
      ctx.lineTo(1.5, -44);
      ctx.stroke();
    }

    // Mouth
    ctx.strokeStyle = "#78350f";
    ctx.lineWidth = 1.5;
    if (isTalking) {
      const openH = 1.8 + Math.abs(Math.sin(timeSec * 12)) * 2.4;
      ctx.fillStyle = "#9f1239";
      ctx.beginPath();
      ctx.ellipse(0, -36.5, 3, openH, 0, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.beginPath();
      ctx.arc(0, -38.5, 3.8, 0.18 * Math.PI, 0.82 * Math.PI);
      ctx.stroke();
    }

    ctx.restore();
  }

  drawBunnyBarista(ctx, x, y, scale, waveActive, isTalking, timeSec) {
    const breathY = Math.sin(timeSec * 2.4) * 1.4 * scale;
    ctx.save();
    ctx.translate(x, y + breathY);
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
    ctx.fill();

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
    const earTilt = waveActive ? Math.sin(timeSec * 14) * 0.28 : Math.sin(timeSec * 1.6) * 0.04;
    [
      { dx: -8, rot: -0.12 + earTilt },
      { dx: 8, rot: 0.12 - earTilt }
    ].forEach((ear) => {
      ctx.save();
      ctx.translate(ear.dx, -56);
      ctx.rotate(ear.rot);
      ctx.fillStyle = "#fafaf9";
      ctx.beginPath();
      ctx.ellipse(0, -16, 5.5, 19, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#fda4af";
      ctx.beginPath();
      ctx.ellipse(0, -16, 2.7, 13, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    // Bunny head & rosy cheeks
    ctx.fillStyle = "#fafaf9";
    ctx.beginPath();
    ctx.ellipse(0, -43, 18, 16, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "rgba(251, 113, 133, 0.35)";
    ctx.beginPath();
    ctx.ellipse(-10, -39, 3.8, 2.3, 0, 0, Math.PI * 2);
    ctx.ellipse(10, -39, 3.8, 2.3, 0, 0, Math.PI * 2);
    ctx.fill();

    // Eyes, nose & mouth
    ctx.fillStyle = "#1c1917";
    ctx.beginPath();
    ctx.arc(-6.5, -43, 2.3, 0, Math.PI * 2);
    ctx.arc(6.5, -43, 2.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(-5.7, -43.8, 0.9, 0, Math.PI * 2);
    ctx.arc(7.3, -43.8, 0.9, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#fb7185";
    ctx.beginPath();
    ctx.arc(0, -39, 2, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = "#57534e";
    ctx.lineWidth = 1.4;
    if (isTalking) {
      ctx.fillStyle = "#fb7185";
      ctx.beginPath();
      ctx.ellipse(0, -35.5, 2.8, 1.8 + Math.abs(Math.sin(timeSec * 12)) * 2, 0, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.beginPath();
      ctx.arc(-2.5, -37, 2.5, 0.1 * Math.PI, 0.85 * Math.PI);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(2.5, -37, 2.5, 0.15 * Math.PI, 0.9 * Math.PI);
      ctx.stroke();
    }

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

    ctx.strokeStyle = "rgba(0,0,0,0.22)";
    ctx.lineWidth = 1;
    const panelStep = Math.max(28, w * 0.055);
    for (let px = 0; px < w; px += panelStep) {
      ctx.beginPath();
      ctx.moveTo(px, 0);
      ctx.lineTo(px, h * 0.72);
      ctx.stroke();
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
    this.drawBunnyBarista(ctx, bunnyX, counterY + 2, portraitScale, waveActive, isTalkingNow, timeSec);
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
        isTalking: isTalkingNow,
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
      ctx.beginPath();
      ctx.moveTo(cupX - 2, cupY - 15);
      ctx.quadraticCurveTo(cupX - 5 + steamShift, cupY - 22, cupX - 1, cupY - 28);
      ctx.stroke();
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
      ctx.fillStyle = "#92400e";
      ctx.beginPath();
      ctx.roundRect(decorX - 12, decorY - 12, 20, 12, 3);
      ctx.fill();
      ctx.fillStyle = season.lantern;
      ctx.beginPath();
      ctx.arc(decorX - 2, decorY - 18, 6, 0, Math.PI * 2);
      ctx.arc(decorX - 7, decorY - 15, 4.5, 0, Math.PI * 2);
      ctx.arc(decorX + 4, decorY - 15, 4.5, 0, Math.PI * 2);
      ctx.fill();
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
  }

  handleTap(clientX, clientY) {
    const rect = this.canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    for (let i = this.hitboxes.length - 1; i >= 0; i--) {
      const box = this.hitboxes[i];
      if (x >= box.x && x <= box.x + box.w && y >= box.y && y <= box.y + box.h) {
        if (box.id === "lantern") {
          if (typeof devLanternTap === "function") devLanternTap();
          return;
        }
        if (box.id === "shelf") {
          audioEngine.playChime(494, 0.2, 0.035);
          openBookshelf();
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
