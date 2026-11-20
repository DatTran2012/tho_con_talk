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

    const bottleColors = ["#d97706", "#be123c", "#15803d", "#0369a1", "#92400e"];
    bottleColors.forEach((col, idx) => {
      const bx = shelfX + 10 + idx * (shelfW * 0.18);
      const bh = 22 + (idx % 2) * 5;
      ctx.fillStyle = col;
      ctx.beginPath();
      ctx.roundRect(bx, shelf1Y - bh, 11, bh, 3);
      ctx.fill();
      ctx.fillStyle = "#fef3c7";
      ctx.fillRect(bx + 2, shelf1Y - bh + 7, 7, 6);
      ctx.fillStyle = "#1c1917";
      ctx.fillRect(bx + 3, shelf1Y - bh - 4, 5, 4);
    });

    ctx.fillStyle = "#b45309";
    ctx.beginPath();
    ctx.arc(shelfX + shelfW * 0.25, shelf2Y - 10, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#d97706";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(shelfX + shelfW * 0.25 + 8, shelf2Y - 8);
    ctx.quadraticCurveTo(shelfX + shelfW * 0.25 + 17, shelf2Y - 14, shelfX + shelfW * 0.25 + 15, shelf2Y - 20);
    ctx.stroke();

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
    if (clockSecret) {
      const nowDate = new Date();
      const minA = (nowDate.getMinutes() / 60) * Math.PI * 2 - Math.PI / 2;
      const hourA = ((nowDate.getHours() % 12) / 12 + nowDate.getMinutes() / 720) * Math.PI * 2 - Math.PI / 2;
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

    // 8. Vintage Radio on Counter
    const radioX = w * 0.1;
    const radioY = counterY - 24;
    ctx.fillStyle = "#92400e";
    ctx.beginPath();
    ctx.roundRect(radioX, radioY, 38, 24, 5);
    ctx.fill();
    ctx.strokeStyle = "#f59e0b";
    ctx.lineWidth = 1.2;
    ctx.strokeRect(radioX + 4, radioY + 4, 18, 15);
    ctx.fillStyle = this.radioPulseTimer > 0 ? "#fde047" : "#fbbf24";
    ctx.beginPath();
    ctx.arc(radioX + 30, radioY + 8, 3.2, 0, Math.PI * 2);
    ctx.arc(radioX + 30, radioY + 16, 3.2, 0, Math.PI * 2);
    ctx.fill();
    if (this.radioPulseTimer > 0) this.radioPulseTimer -= 16;
    this.hitboxes.push({ id: "radio", x: radioX, y: radioY, w: 38, h: 24 });

    // 9. Calico Cat Sleeping on Velvet Cushion
    const catX = w * 0.21;
    const catY = counterY - 14;
    ctx.fillStyle = "#881337";
    ctx.beginPath();
    ctx.ellipse(catX + 16, counterY - 2, 20, 5, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#fafaf9";
    ctx.beginPath();
    ctx.ellipse(catX + 16, catY + 4, 15, 10, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#d97706";
    ctx.beginPath();
    ctx.arc(catX + 12, catY + 2, 5.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#1c1917";
    ctx.beginPath();
    ctx.arc(catX + 22, catY + 4, 4.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#fafaf9";
    ctx.beginPath();
    ctx.arc(catX + 6, catY - 2, 7.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(catX + 1, catY - 7);
    ctx.lineTo(catX + 3, catY - 14);
    ctx.lineTo(catX + 6, catY - 8);
    ctx.moveTo(catX + 7, catY - 8);
    ctx.lineTo(catX + 10, catY - 14);
    ctx.lineTo(catX + 12, catY - 7);
    ctx.fill();

    if (isSecretUnlocked("secret_cat")) {
      ctx.fillStyle = "#fbbf24";
      ctx.beginPath();
      ctx.arc(catX + 9, catY + 4, 2.6, 0, Math.PI * 2);
      ctx.fill();
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
