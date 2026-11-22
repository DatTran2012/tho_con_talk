"use strict";

/* -----------------------------------------------------------------------
   SECTION 8: 3-STEP BREWING STATION & MINI-GAMES
------------------------------------------------------------------------ */
/* Thông số độ khó của minigame pha chế: chỉnh tại đây. Vị trí tính theo % thanh. */
const BREW_TUNING = {
  shaker: { taps: 6, minGapMs: 120, breakGapMs: 900, steadyMinMs: 180, steadyMaxMs: 550 },
  drip: { speed: 125, perfect: [43, 57], ok: [30, 70] },
  ember: { rate: 70, start: 12, minHold: 25, perfect: [60, 85], okLow: 45, okHigh: 95 },
  memory: { length: 5, flashMs: 650, gapMs: 250, maxMistakes: 2 },
  triple: { speed: 120, speedStep: 22, widths: [15, 11, 8] },
  hintCost: 1,
  clashPenalty: 2,
  quality: { perfectAffinity: 4, goodAffinity: 2.5, lenientAffinity: 1.5, carryAffinity: 5 }
};
const inRange = (v, [lo, hi]) => v >= lo && v <= hi;

/* Luật thử thách: hỏng ly thì buộc pha lại (tối đa maxAttempts lần). Pha lại chỉ đạt tối đa Chuẩn Vị. */
const BREW_RULES = { maxAttempts: 3 };

/* Độ khó tăng dần theo tuần: kim nhanh hơn, vùng vàng hẹp hơn, nhịp lắc chặt hơn. */
function getScaledBrewTuning() {
  const week = runState ? Math.max(0, Math.min(3, Math.floor(runState.nightIndex / 7))) : 0;
  const base = BREW_TUNING;
  return {
    week,
    shaker: { ...base.shaker, steadyMinMs: base.shaker.steadyMinMs + 10 * week, steadyMaxMs: base.shaker.steadyMaxMs - 30 * week },
    drip: {
      ...base.drip,
      speed: Math.round(base.drip.speed * (1 + 0.1 * week)),
      perfect: [base.drip.perfect[0] + week, base.drip.perfect[1] - week]
    },
    ember: {
      ...base.ember,
      rate: Math.round(base.ember.rate * (1 + 0.08 * week)),
      perfect: [base.ember.perfect[0] + week * 2, base.ember.perfect[1] - week * 2]
    },
    memory: { ...base.memory, length: base.memory.length + (week >= 2 ? 1 : 0) },
    triple: { ...base.triple, speed: Math.round(base.triple.speed * (1 + 0.08 * week)), widths: base.triple.widths.map((w) => Math.max(5, w - week)) },
    quality: base.quality
  };
}

/* Trạng thái minigame mới (để bot kiểm thử đọc được mà không lộ ra giao diện) */
let currentMemorySeq = [];
let currentTripleState = null;

function getClashes(accentIds) {
  return CLASH_PAIRS.filter(([a, b]) => accentIds.includes(a) && accentIds.includes(b));
}

function pickRiddle(guest) {
  const list = ORDER_RIDDLES[guest.needEmotion] || [];
  if (!list.length) return "";
  const n = (runState ? runState.nightIndex : 0) + guest.id.length;
  return list[n % list.length];
}

function lockChallengeButton(btn) {
  btn.disabled = true;
  btn.classList.add("opacity-70", "cursor-default");
}

function renderThreeStepBrewingStation(guests, stationLabel = "") {
  let askedHint = false;
  const actionArea = document.getElementById("dialogue-action-area");
  actionArea.innerHTML = "";

  let step = 1;
  let selectedBase = DRINK_BASES[0];
  let selectedAccents = [];
  let challengeBonus = 0;
  let challengeResultText = "";

  const renderWizard = () => {
    cancelActiveBrewAnimation();
    actionArea.innerHTML = "";
    const wrap = document.createElement("div");
    wrap.className = "p-3.5 rounded-2xl bg-stone-900/95 border border-amber-400/35 space-y-3";

    const header = document.createElement("div");
    header.className = "flex flex-wrap items-center justify-between gap-2 text-xs border-b border-stone-800 pb-2";
    const needsLabel = [...new Set(guests.map((g) => g.needEmotion))]
      .map((k) => `${EMOTION_TAGS[k].icon} ${EMOTION_TAGS[k].label}`)
      .join(" • ");
    const riddle = guests.map((g) => pickRiddle(g)).filter(Boolean).join(" ");
    header.innerHTML = `
      <span class="font-bold text-amber-200">🍹 Quầy Pha Chế 3 Công Đoạn — Bước ${step}/3</span>
      ${stationLabel ? `<span class="w-full text-[11px] font-semibold text-purple-300">🥤 ${stationLabel}</span>` : ""}
      <span class="text-[11px] font-mono-code text-stone-400">
        ${step === 1 ? "Chọn Cốt Nước" : step === 2 ? "Phối 1–2 Thảo Mộc" : "Thao Tác Pha Chế"}
      </span>
      <span class="w-full text-[11px] text-amber-300/90">${
        askedHint
          ? `💡 Khách thú nhận đang cần: ${needsLabel} (ly này tối đa Chuẩn Vị)`
          : `💬 Khách bóng gió: <em class="text-stone-200">“${riddle}”</em> — tự đoán sắc thái cảm xúc họ cần.`
      }</span>
    `;
    if (!askedHint) {
      const askBtn = document.createElement("button");
      askBtn.type = "button";
      askBtn.id = "btn-ask-hint";
      askBtn.className = "w-full min-h-[34px] mt-1 rounded-lg bg-stone-950/80 hover:bg-stone-800 border border-stone-700 text-[11px] text-stone-300 cursor-pointer";
      askBtn.textContent = `🔎 Hỏi thẳng khách (mất ${BREW_TUNING.hintCost} Tin Cậy, ly tối đa Chuẩn Vị)`;
      askBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        askedHint = true;
        runState.trust = Math.max(0, runState.trust - BREW_TUNING.hintCost);
        saveRunState();
        syncGameHUD();
        renderWizard();
      });
      header.appendChild(askBtn);
    }
    wrap.appendChild(header);

    if (step === 1) {
      const grid = document.createElement("div");
      grid.className = "grid grid-cols-1 sm:grid-cols-2 gap-2";
      DRINK_BASES.forEach((b) => {
        const isSel = selectedBase.id === b.id;
        const em = EMOTION_TAGS[b.emotion];
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = `p-2.5 rounded-xl text-left border transition-all cursor-pointer ${
          isSel
            ? "bg-amber-500/20 border-amber-400 text-amber-100"
            : "bg-stone-950/90 border-stone-800 text-stone-300 hover:border-stone-600"
        }`;
        btn.innerHTML = `
          <div class="flex items-center justify-between font-semibold text-xs">
            <span>${b.icon} ${b.name}</span>
            <span class="text-[10px] px-1.5 py-0.5 rounded bg-stone-900 border border-stone-700">${em.icon} ${em.label}</span>
          </div>
          <div class="text-[11px] text-stone-400 mt-1">${b.desc}</div>
        `;
        btn.addEventListener("click", (e) => {
          e.stopPropagation();
          selectedBase = b;
          audioEngine.playChime(392, 0.15, 0.03);
          renderWizard();
        });
        grid.appendChild(btn);
      });
      wrap.appendChild(grid);

      const nextBtn = document.createElement("button");
      nextBtn.type = "button";
      nextBtn.className = "w-full min-h-[44px] py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs sm:text-sm cursor-pointer";
      nextBtn.textContent = `Tiếp Theo: Chọn Thảo Mộc Cho ${selectedBase.name} ▸`;
      nextBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        step = 2;
        renderWizard();
      });
      wrap.appendChild(nextBtn);
    } else if (step === 2) {
      const info = document.createElement("div");
      info.className = "text-[11px] text-stone-300";
      info.innerHTML = `Cốt đã chọn: <strong class="text-amber-200">${selectedBase.icon} ${selectedBase.name}</strong> • Hãy chọn <strong class="text-amber-200">1 đến 2 hương vị</strong> (${selectedAccents.length}/2):`;
      wrap.appendChild(info);

      const grid = document.createElement("div");
      grid.className = "grid grid-cols-2 sm:grid-cols-4 gap-2";
      DRINK_ACCENTS.forEach((acc) => {
        const isSel = selectedAccents.includes(acc.id);
        const em = EMOTION_TAGS[acc.emotion];
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = `p-2.5 rounded-xl text-left border transition-all cursor-pointer ${
          isSel
            ? "bg-teal-500/20 border-teal-400 text-teal-100"
            : "bg-stone-950/90 border-stone-800 text-stone-300 hover:border-stone-600"
        }`;
        btn.innerHTML = `
          <div class="font-semibold text-xs">${acc.icon} ${acc.name}</div>
          <div class="text-[10px] text-stone-400 mt-0.5">${em.icon} ${em.label}</div>
        `;
        btn.addEventListener("click", (e) => {
          e.stopPropagation();
          if (isSel) {
            selectedAccents = selectedAccents.filter((id) => id !== acc.id);
          } else if (selectedAccents.length < 2) {
            selectedAccents.push(acc.id);
          } else {
            selectedAccents.shift();
            selectedAccents.push(acc.id);
          }
          audioEngine.playChime(493.88, 0.15, 0.03);
          renderWizard();
        });
        grid.appendChild(btn);
      });
      wrap.appendChild(grid);

      const clashes = getClashes(selectedAccents);
      if (clashes.length) {
        const warn = document.createElement("div");
        warn.id = "clash-warning";
        warn.className = "text-[11px] text-rose-300 p-2 rounded-xl bg-rose-500/10 border border-rose-400/30";
        warn.textContent = `⚡ ${clashes
          .map(([a, b]) => `${DRINK_ACCENTS.find((x) => x.id === a).name} × ${DRINK_ACCENTS.find((x) => x.id === b).name}`)
          .join(", ")} — hai vị này chọi nhau, ly sẽ bị trừ điểm hợp vị!`;
        wrap.appendChild(warn);
      }

      const navRow = document.createElement("div");
      navRow.className = "flex gap-2";
      const backBtn = document.createElement("button");
      backBtn.type = "button";
      backBtn.className = "px-4 min-h-[44px] rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs cursor-pointer";
      backBtn.textContent = "← Đổi Cốt";
      backBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        step = 1;
        renderWizard();
      });

      const hasEnoughAccents = selectedAccents.length >= 1;
      const nextBtn = document.createElement("button");
      nextBtn.type = "button";
      nextBtn.className = hasEnoughAccents
        ? "flex-1 min-h-[44px] py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs sm:text-sm cursor-pointer transition-all"
        : "flex-1 min-h-[44px] py-2.5 rounded-xl bg-stone-800 border border-stone-700 text-stone-400 font-semibold text-xs sm:text-sm cursor-not-allowed transition-all";
      nextBtn.textContent = hasEnoughAccents
        ? "Tiếp Theo: Thao Tác Pha Chế ▸"
        : "🔒 Chọn ít nhất 1 hương vị thảo mộc";
      nextBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        if (selectedAccents.length < 1) {
          audioEngine.playChime(240, 0.18, 0.03);
          showToast("⚠️ Bạn cần chọn ít nhất 1 hương vị thảo mộc trước khi sang bước pha chế!");
          return;
        }
        step = 3;
        renderStep3Challenge();
      });

      navRow.appendChild(backBtn);
      navRow.appendChild(nextBtn);
      wrap.appendChild(navRow);
    }

    actionArea.appendChild(wrap);
  };

  let brewAttempt = 1; // số lần thử còn nhớ khi quay lại bước 2 (tránh lách luật pha lại)
  const renderStep3Challenge = (attempt = brewAttempt) => {
    cancelActiveBrewAnimation();
    const T = getScaledBrewTuning();
    actionArea.innerHTML = "";
    const wrap = document.createElement("div");
    wrap.className = "p-3.5 rounded-2xl bg-stone-900/95 border border-amber-400/35 space-y-3";

    const challengeType = selectedBase.challengeType;
    let challengeFinished = false;

    wrap.innerHTML = `
      <div class="flex items-center justify-between text-xs border-b border-stone-800 pb-2">
        <span class="font-bold text-amber-200">🍸 Bước 3/3: Hoàn Thiện Ly Nước</span>
        <span id="challenge-status-pill" class="text-[11px] font-mono-code text-amber-300">⏳ Chưa hoàn thành thao tác • Lần ${attempt}/${BREW_RULES.maxAttempts}</span>
      </div>
      <div id="challenge-body" class="space-y-2.5 p-2.5 rounded-xl bg-stone-950/60 border border-stone-800 transition-all"></div>
      <div class="flex gap-2 pt-1">
        <button type="button" id="btn-step3-back" class="px-3.5 min-h-[44px] rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs cursor-pointer">← Quay Lại</button>
        <button type="button" id="btn-serve-final" aria-disabled="true" class="flex-1 min-h-[44px] py-2.5 rounded-xl bg-stone-800 border border-stone-700 text-stone-400 font-semibold text-xs sm:text-sm cursor-not-allowed transition-all">
          🔒 Hoàn Thành Thao Tác Để Phục Vụ
        </button>
      </div>
    `;
    actionArea.appendChild(wrap);

    const body = document.getElementById("challenge-body");
    const statusPill = document.getElementById("challenge-status-pill");
    const btnServeFinal = document.getElementById("btn-serve-final");

    const unlockServeButton = () => {
      btnServeFinal.removeAttribute("aria-disabled");
      btnServeFinal.className =
        "flex-1 min-h-[44px] py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-stone-950 font-bold text-xs sm:text-sm cursor-pointer shadow-lg shadow-amber-500/20 transition-all";
      btnServeFinal.innerHTML = "🥂 Hoàn Thành &amp; Mời Khách Thưởng Thức";
    };

    const markChallengeResult = (rawBonus, labelText) => {
      challengeFinished = true;
      cancelActiveBrewAnimation();
      // Hỏng ly: buộc pha lại, trừ khi đã hết lượt (khi đó ly chỉ đạt mức Mộc Mạc để không kẹt game)
      if (rawBonus === 0 && attempt < BREW_RULES.maxAttempts) {
        statusPill.textContent = `💥 Hỏng ly! Phải pha lại (lần ${attempt}/${BREW_RULES.maxAttempts})`;
        statusPill.className = "text-[11px] font-mono-code text-rose-300 font-bold";
        body.className = "space-y-2.5 p-2.5 rounded-xl bg-rose-500/10 border border-rose-400/40 transition-all";
        body.innerHTML = `
          <p class="text-xs text-rose-200">${labelText}</p>
          <p class="text-[11px] text-stone-400">Ly này không thể mời khách. Làm lại thao tác nhé (pha lại chỉ đạt tối đa Chuẩn Vị). Còn ${BREW_RULES.maxAttempts - attempt} lần thử.</p>
          <button type="button" id="btn-brew-retry" class="min-h-[44px] px-4 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-400/50 text-rose-100 font-bold text-xs cursor-pointer">🔁 Pha Lại Ly Này</button>
        `;
        document.getElementById("btn-brew-retry").addEventListener("click", (e) => {
          e.stopPropagation();
          brewAttempt = attempt + 1;
          renderStep3Challenge(brewAttempt);
        });
        audioEngine.playChime(220, 0.35, 0.05);
        return;
      }
      let bonus = rawBonus;
      let text = labelText;
      if (attempt > 1 && bonus === 2) {
        bonus = 1;
        text = `${labelText} (pha lại nên chỉ đạt Chuẩn Vị)`;
      }
      if (rawBonus === 0) text = `${labelText} Hết lượt thử, ly chỉ đạt mức Mộc Mạc.`;
      challengeBonus = bonus;
      challengeResultText = text;
      const tone = bonus === 2 ? "emerald" : bonus === 1 ? "amber" : "rose";
      statusPill.textContent = text;
      statusPill.className = `text-[11px] font-mono-code text-${tone}-300 font-bold`;
      body.className = `space-y-2.5 p-2.5 rounded-xl bg-${tone}-500/10 border border-${tone}-400/40 transition-all`;
      unlockServeButton();
      audioEngine.playChime(bonus === 2 ? 659.25 : bonus === 1 ? 523.25 : 261.6, 0.3, 0.05);
    };

    if (challengeType === "shaker") {
      let shakes = 0;
      let lastTap = 0;
      const gaps = [];
      body.innerHTML = `
        <p class="text-xs text-stone-300">Chạm <strong>6 nhịp đều tay</strong> vào bình lắc Boston, mỗi nhịp cách nhau khoảng nửa giây (không quá nhanh, không quá chậm). Dừng quá lâu thì phải lắc lại từ đầu!</p>
        <div class="flex items-center gap-3">
          <button type="button" id="btn-challenge-shake" class="no-touch-select min-h-[52px] px-5 py-3 rounded-2xl bg-sky-500/20 hover:bg-sky-500/30 border border-sky-400/50 text-sky-100 font-bold text-sm cursor-pointer">
            🍸 Lắc Bình (<span id="shake-count">0</span>/6)
          </button>
          <div class="flex-1 h-3 rounded-full bg-stone-950 border border-stone-800 overflow-hidden">
            <div id="shake-bar" class="h-full bg-sky-400 transition-all" style="width: 0%"></div>
          </div>
        </div>
        <div id="shake-feedback" class="text-[11px] text-sky-200 min-h-[16px]"></div>
      `;
      const btnShake = document.getElementById("btn-challenge-shake");
      btnShake.addEventListener("click", (e) => {
        e.stopPropagation();
        if (challengeFinished) return;
        const now = performance.now();
        const fb = document.getElementById("shake-feedback");
        if (shakes > 0) {
          const gap = now - lastTap;
          if (gap < T.shaker.minGapMs) return; // chống bấm dồn
          if (gap > T.shaker.breakGapMs) {
            shakes = 0;
            gaps.length = 0;
            fb.textContent = "⏱️ Nhịp bị đứt, lắc lại từ đầu nhé!";
          } else {
            gaps.push(gap);
            fb.textContent = gap < T.shaker.steadyMinMs ? "⚡ Hơi gấp!" : gap > T.shaker.steadyMaxMs ? "🐢 Hơi chậm!" : "👌 Đều tay!";
          }
        }
        lastTap = now;
        shakes++;
        btnShake.classList.remove("brew-shake-anim");
        void btnShake.offsetWidth;
        btnShake.classList.add("brew-shake-anim");
        audioEngine.playChime(350 + shakes * 50, 0.12, 0.04);
        document.getElementById("shake-count").textContent = Math.min(6, shakes);
        document.getElementById("shake-bar").style.width = `${Math.min(100, (shakes / 6) * 100)}%`;
        if (shakes >= T.shaker.taps) {
          lockChallengeButton(btnShake);
          const sloppy = gaps.filter((g) => !inRange(g, [T.shaker.steadyMinMs, T.shaker.steadyMaxMs])).length;
          if (sloppy === 0) markChallengeResult(2, "🌟 Lắc đều nhịp, bọt mịn Hoàn Hảo!");
          else if (sloppy <= 2) markChallengeResult(1, "✨ Đã lắc xong, nhưng nhịp chưa thật đều nên bọt hơi thô.");
          else markChallengeResult(0, "🫧 Nhịp lắc quá loạn, bọt vỡ hết rồi.");
        }
      });
    } else if (challengeType === "drip") {
      let pos = 10;
      let dir = 1;
      let lastTime = performance.now();
      body.innerHTML = `
        <p class="text-xs text-stone-300">Canh kim rơi đúng <strong>vùng vàng đậm ở chính giữa</strong> rồi bấm <em>Chốt Giọt Tinh Túy</em>. Vùng nhạt bên ngoài chỉ đạt Chuẩn Vị, trượt ra ngoài là hỏng vị!</p>
        <div class="relative h-6 rounded-full bg-stone-950 border border-stone-700 overflow-hidden">
          <div class="absolute inset-y-0 left-[30%] right-[30%] bg-amber-500/15"></div><div class="absolute inset-y-0 bg-amber-500/45 border-x border-amber-400" style="left:${T.drip.perfect[0]}%;right:${100 - T.drip.perfect[1]}%"></div>
          <div id="drip-needle" class="absolute top-0 bottom-0 w-2 bg-amber-300 rounded-full shadow" style="left: 10%"></div>
        </div>
        <button type="button" id="btn-challenge-drip" class="min-h-[44px] px-4 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/50 text-amber-200 font-semibold text-xs cursor-pointer">
          💧 Chốt Giọt Tinh Túy
        </button>
      `;
      const stepNeedle = (now) => {
        if (challengeFinished) return;
        const needle = document.getElementById("drip-needle");
        if (!needle) {
          cancelActiveBrewAnimation();
          return;
        }
        const dt = Math.min(0.05, (now - lastTime) / 1000);
        lastTime = now;
        pos += dir * T.drip.speed * dt;
        if (pos >= 92) {
          pos = 92;
          dir = -1;
        } else if (pos <= 8) {
          pos = 8;
          dir = 1;
        }
        needle.style.left = `${pos}%`;
        activeBrewAnimId = requestAnimationFrame(stepNeedle);
      };
      activeBrewAnimId = requestAnimationFrame(stepNeedle);
      const btnDrip = document.getElementById("btn-challenge-drip");
      btnDrip.addEventListener("click", (e) => {
        e.stopPropagation();
        if (challengeFinished) return;
        lockChallengeButton(btnDrip);
        if (inRange(pos, T.drip.perfect)) {
          markChallengeResult(2, "🌟 Tuyệt vời! Giọt chiết xuất đạt độ cân bằng Hoàn Hảo!");
        } else if (inRange(pos, T.drip.ok)) {
          markChallengeResult(1, "✨ Đã chiết xuất xong, hương vị khá ổn nhưng chưa cân bằng hẳn.");
        } else {
          markChallengeResult(0, "💧 Giọt rơi lệch nhịp, vị cà phê hơi gắt.");
        }
      });
    } else if (challengeType === "ember") {
      let heat = T.ember.start;
      let holding = false;
      let lastTime = performance.now();
      body.innerHTML = `
        <p class="text-xs text-stone-300">Nhấn giữ nút <strong>Ủ Ấm Trên Bếp Than</strong> đến đúng vùng cam ấm (${T.ember.perfect[0]}%–${T.ember.perfect[1]}%) rồi thả tay. Thả sớm thì nhạt, giữ quá tay thì cháy khét!</p>
        <div class="relative h-6 rounded-full bg-stone-950 border border-stone-700 overflow-hidden">
          <div class="absolute inset-y-0 bg-orange-500/35 border-x border-orange-400" style="left:${T.ember.perfect[0]}%;right:${100 - T.ember.perfect[1]}%"></div>
          <div id="ember-fill" class="h-full bg-gradient-to-r from-amber-500 to-orange-500" style="width: 12%"></div>
        </div>
        <button type="button" id="btn-challenge-ember" class="no-touch-select min-h-[48px] px-5 py-2.5 rounded-xl bg-orange-500/20 hover:bg-orange-500/30 border border-orange-400/50 text-orange-200 font-bold text-xs cursor-pointer">
          🔥 Nhấn Giữ Để Ủ Ấm
        </button>
      `;
      const btnEmber = document.getElementById("btn-challenge-ember");
      const stepHeat = (now) => {
        if (challengeFinished) return;
        const fill = document.getElementById("ember-fill");
        if (!fill) {
          cancelActiveBrewAnimation();
          return;
        }
        const dt = Math.min(0.05, (now - lastTime) / 1000);
        lastTime = now;
        if (holding) {
          heat = Math.min(100, heat + T.ember.rate * dt);
          fill.style.width = `${heat}%`;
          if (heat >= 100) {
            holding = false;
            lockChallengeButton(btnEmber);
            markChallengeResult(0, "🔥 Than quá nóng, ly nước bị khét mất rồi!");
            return;
          }
        }
        activeBrewAnimId = requestAnimationFrame(stepHeat);
      };
      activeBrewAnimId = requestAnimationFrame(stepHeat);

      const startHold = (e) => {
        e.stopPropagation();
        if (!challengeFinished) holding = true;
      };
      const endHold = (e) => {
        e.stopPropagation();
        if (!holding || challengeFinished) return;
        holding = false;
        if (heat < T.ember.minHold) {
          heat = T.ember.start;
          const fill = document.getElementById("ember-fill");
          if (fill) fill.style.width = "12%";
          audioEngine.playChime(240, 0.16, 0.03);
          showToast("⚠️ Bạn giữ chưa đủ lâu để làm ấm ly nước, hãy nhấn giữ thêm nhé!");
          return;
        }
        lockChallengeButton(btnEmber);
        if (inRange(heat, T.ember.perfect)) {
          markChallengeResult(2, "🌟 Nhiệt độ than hồng đạt mức Hoàn Hảo!");
        } else if (heat >= T.ember.okLow && heat < T.ember.perfect[0]) {
          markChallengeResult(1, "✨ Ly nước ấm vừa, hơi thiếu độ nồng.");
        } else if (heat > T.ember.perfect[1] && heat < T.ember.okHigh) {
          markChallengeResult(1, "✨ Hơi nóng tay một chút nhưng vẫn giữ được hương.");
        } else {
          markChallengeResult(0, heat < T.ember.okLow ? "🧊 Ly nước còn nhạt, chưa kịp ấm." : "🔥 Than quá nóng, ly nước hơi khét.");
        }
      };

      btnEmber.addEventListener("mousedown", startHold);
      btnEmber.addEventListener("touchstart", startHold, { passive: true });
      btnEmber.addEventListener("mouseup", endHold);
      btnEmber.addEventListener("mouseleave", endHold);
      btnEmber.addEventListener("touchend", endHold);
      btnEmber.addEventListener("touchcancel", endHold);
    } else if (challengeType === "memory") {
      const M = T.memory;
      const jars = [
        { icon: "🍯", name: "Mật" },
        { icon: "🌿", name: "Thảo mộc" },
        { icon: "🍋", name: "Chanh" },
        { icon: "🧂", name: "Muối" }
      ];
      currentMemorySeq = Array.from({ length: M.length }, () => Math.floor(Math.random() * jars.length));
      let inputPos = 0;
      let mistakes = 0;
      let accepting = false;
      body.innerHTML = `
        <p class="text-xs text-stone-300">Công thức này dài! <strong>Nhìn thứ tự các lọ sáng lên</strong>, rồi bấm lại <strong>đúng thứ tự đó</strong>. Sai ${M.maxMistakes} lần là hỏng ly.</p>
        <div id="memory-status" class="text-[11px] text-sky-200 min-h-[16px]">👀 Ghi nhớ thứ tự…</div>
        <div id="memory-jars" class="grid grid-cols-4 gap-2"></div>
      `;
      const jarBox = document.getElementById("memory-jars");
      const status = document.getElementById("memory-status");
      const jarBtns = jars.map((j, i) => {
        const b = document.createElement("button");
        b.type = "button";
        b.dataset.jar = String(i);
        b.className = "min-h-[56px] rounded-xl bg-stone-900 border border-stone-700 text-2xl transition-all cursor-pointer";
        b.textContent = j.icon;
        b.disabled = true;
        jarBox.appendChild(b);
        return b;
      });
      const flash = (i, on) => {
        jarBtns[i].classList.toggle("bg-amber-400/40", on);
        jarBtns[i].classList.toggle("border-amber-300", on);
        jarBtns[i].classList.toggle("scale-110", on);
      };
      const later = (fn, ms) => {
        const id = setTimeout(fn, ms);
        activeBrewTimeouts.push(id);
      };
      let delay = 500;
      currentMemorySeq.forEach((i) => {
        later(() => { flash(i, true); audioEngine.playChime(330 + i * 90, 0.18, 0.04); }, delay);
        later(() => flash(i, false), delay + M.flashMs);
        delay += M.flashMs + M.gapMs;
      });
      later(() => {
        accepting = true;
        jarBtns.forEach((b) => (b.disabled = false));
        status.textContent = `🫳 Đến lượt bạn: 0/${M.length}`;
      }, delay);
      jarBtns.forEach((b, i) => {
        b.addEventListener("click", (e) => {
          e.stopPropagation();
          if (!accepting || challengeFinished) return;
          if (i === currentMemorySeq[inputPos]) {
            inputPos++;
            audioEngine.playChime(330 + i * 90, 0.12, 0.04);
            status.textContent = `🫳 Đúng rồi: ${inputPos}/${M.length}${mistakes ? ` • sai ${mistakes}/${M.maxMistakes}` : ""}`;
            if (inputPos >= M.length) {
              accepting = false;
              jarBtns.forEach((x) => (x.disabled = true));
              if (mistakes === 0) markChallengeResult(2, "🌟 Nhớ trọn công thức, từng bước không sai!");
              else markChallengeResult(1, "✨ Có lúc nhầm lọ, nhưng vẫn kịp sửa.");
            }
          } else {
            mistakes++;
            audioEngine.playChime(200, 0.2, 0.05);
            status.textContent = `❌ Nhầm lọ rồi! sai ${mistakes}/${M.maxMistakes}`;
            if (mistakes >= M.maxMistakes) {
              accepting = false;
              jarBtns.forEach((x) => (x.disabled = true));
              markChallengeResult(0, "🫙 Quên mất công thức, ly bị pha sai hết.");
            }
          }
        });
      });
    } else if (challengeType === "triple") {
      const TR = T.triple;
      const st = { round: 0, hits: 0, pos: 8, dir: 1, zone: [0, 0] };
      currentTripleState = st;
      const newZone = () => {
        const w = TR.widths[st.round];
        const lo = 22 + Math.random() * (78 - 22 - w);
        st.zone = [lo, lo + w];
        const z = document.getElementById("triple-zone");
        if (z) {
          z.style.left = `${st.zone[0]}%`;
          z.style.right = `${100 - st.zone[1]}%`;
        }
      };
      body.innerHTML = `
        <p class="text-xs text-stone-300">Rót <strong>ba lượt liên tiếp</strong>. Mỗi lượt vùng vàng nằm một chỗ khác, hẹp dần, kim chạy nhanh dần. Trúng 3/3 mới Hoàn Hảo, trúng dưới 2 là hỏng.</p>
        <div id="triple-status" class="text-[11px] text-amber-200">Lượt 1/3 • trúng 0</div>
        <div class="relative h-6 rounded-full bg-stone-950 border border-stone-700 overflow-hidden">
          <div id="triple-zone" class="absolute inset-y-0 bg-amber-500/45 border-x border-amber-400"></div>
          <div id="triple-needle" class="absolute top-0 bottom-0 w-2 bg-amber-300 rounded-full shadow" style="left: 8%"></div>
        </div>
        <button type="button" id="btn-challenge-triple" class="min-h-[44px] px-4 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/50 text-amber-200 font-semibold text-xs cursor-pointer">🫗 Rót!</button>
      `;
      newZone();
      let lastTime = performance.now();
      const stepNeedle = (now) => {
        if (challengeFinished) return;
        const needle = document.getElementById("triple-needle");
        if (!needle) {
          cancelActiveBrewAnimation();
          return;
        }
        const dt = Math.min(0.05, (now - lastTime) / 1000);
        lastTime = now;
        st.pos += st.dir * (TR.speed + st.round * TR.speedStep) * dt;
        if (st.pos >= 92) { st.pos = 92; st.dir = -1; }
        else if (st.pos <= 8) { st.pos = 8; st.dir = 1; }
        needle.style.left = `${st.pos}%`;
        activeBrewAnimId = requestAnimationFrame(stepNeedle);
      };
      activeBrewAnimId = requestAnimationFrame(stepNeedle);
      const btnPour = document.getElementById("btn-challenge-triple");
      btnPour.addEventListener("click", (e) => {
        e.stopPropagation();
        if (challengeFinished) return;
        const hit = inRange(st.pos, st.zone);
        if (hit) st.hits++;
        audioEngine.playChime(hit ? 600 : 220, 0.15, 0.04);
        st.round++;
        const sEl = document.getElementById("triple-status");
        if (st.round >= 3) {
          lockChallengeButton(btnPour);
          if (st.hits === 3) markChallengeResult(2, "🌟 Ba lượt rót đều trúng, ly đầy đặn Hoàn Hảo!");
          else if (st.hits === 2) markChallengeResult(1, "✨ Rót trúng hai lượt, ly tạm ổn.");
          else markChallengeResult(0, "🫗 Rót lệch quá nhiều, ly bị tràn và nhạt vị.");
          return;
        }
        if (sEl) sEl.textContent = `Lượt ${st.round + 1}/3 • trúng ${st.hits}${hit ? " ✅" : " ❌"}`;
        newZone();
      });
    } else {
      const pickedAccs = selectedAccents.map((id) => DRINK_ACCENTS.find((a) => a.id === id)).filter(Boolean);
      const decoys = DRINK_ACCENTS.filter((a) => !selectedAccents.includes(a.id));
      const decoy = decoys[Math.floor(Math.random() * decoys.length)];
      const garnishChoices = [...pickedAccs, ...(decoy ? [decoy] : [])].sort(() => Math.random() - 0.5);
      const fitScore = (acc) =>
        guests.reduce(
          (s, g) => s + (g.preferredAccents.includes(acc.id) ? 1 : 0) + (acc.emotion === g.needEmotion ? 1 : 0),
          0
        );
      const bestFit = Math.max(...garnishChoices.map(fitScore));
      body.innerHTML = `
        <p class="text-xs text-stone-300">Chọn <strong>một</strong> điểm nhấn trang trí hợp nhất với khách (nhìn lại gợi ý cảm xúc ở trên). Chọn lệch thì ly nước mất đi nét tinh tế:</p>
        <div id="garnish-btns" class="flex flex-wrap gap-2"></div>
      `;
      const gBox = document.getElementById("garnish-btns");
      garnishChoices.forEach((g) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "min-h-[44px] px-4 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/50 text-emerald-200 font-semibold text-xs cursor-pointer transition-all";
        btn.textContent = `${g.icon} Điểm Nhấn ${g.name}`;
        btn.addEventListener("click", (e) => {
          e.stopPropagation();
          if (challengeFinished) return;
          gBox.querySelectorAll("button").forEach((b) => {
            b.disabled = true;
            if (b !== btn) b.classList.add("opacity-45", "cursor-default");
          });
          btn.className = "min-h-[44px] px-4 py-2 rounded-xl bg-emerald-500/35 border-2 border-emerald-300 text-emerald-100 font-bold text-xs cursor-default";
          const fit = fitScore(g);
          if (fit >= bestFit && fit > 0) markChallengeResult(2, `🌟 Điểm ${g.name} đúng ý khách, Hoàn Hảo!`);
          else if (fit > 0) markChallengeResult(1, `✨ Điểm ${g.name} cũng ổn, nhưng còn lựa chọn hợp hơn.`);
          else markChallengeResult(0, `🌿 ${g.name} chưa hợp tâm trạng khách đêm nay.`);
        });
        gBox.appendChild(btn);
      });
    }

    document.getElementById("btn-step3-back").addEventListener("click", (e) => {
      e.stopPropagation();
      cancelActiveBrewAnimation();
      step = 2;
      renderWizard();
    });

    btnServeFinal.addEventListener("click", (e) => {
      e.stopPropagation();
      if (!challengeFinished) {
        body.classList.add("border-amber-400", "ring-2", "ring-amber-400/40");
        setTimeout(() => {
          if (!challengeFinished) body.classList.remove("border-amber-400", "ring-2", "ring-amber-400/40");
        }, 600);
        audioEngine.playChime(240, 0.2, 0.04);
        showToast("⚠️ Bạn cần hoàn thành thao tác pha chế ở trên trước khi mời khách!");
        return;
      }
      cancelActiveBrewAnimation();
      finalizeDrinkService(guests, selectedBase, selectedAccents, challengeBonus, challengeResultText, askedHint);
    });
  };

  renderWizard();
}

function finalizeDrinkService(guests, base, accentIds, challengeBonus, challengeResultText, hintUsed = false) {
  let matchScore = challengeBonus;
  const clashCount = getClashes(accentIds).length;
  guests.forEach((g) => {
    if (g.preferredBases.includes(base.id)) matchScore += 2;
    if (base.emotion === g.needEmotion) matchScore += 1;
    accentIds.forEach((aid) => {
      if (g.preferredAccents.includes(aid)) matchScore += 1;
      const accObj = DRINK_ACCENTS.find((a) => a.id === aid);
      if (accObj && accObj.emotion === g.needEmotion) matchScore += 1;
    });
  });

  const matchedSignature = SIGNATURE_RECIPES.find(
    (sig) =>
      !sig.hidden &&
      sig.base === base.id &&
      sig.accents.length === accentIds.length &&
      sig.accents.every((a) => accentIds.includes(a))
  );

  let drinkName = "";
  if (matchedSignature) {
    drinkName = `✨ ${matchedSignature.name}`;
    const isNewSig = !persistentArchive.unlockedSignatures[matchedSignature.id];
    persistentArchive.unlockedSignatures[matchedSignature.id] = true;
    if (!Array.isArray(runState.weekSigs)) runState.weekSigs = [];
    const countedBefore = runState.weekSigs.includes(matchedSignature.id);
    if (!countedBefore) runState.weekSigs.push(matchedSignature.id);
    showToast(
      `${isNewSig ? "🍹 Mở khóa công thức độc quyền" : "🍹 Pha lại công thức độc quyền"}: ${matchedSignature.name}! (tuần này ${Math.min(runState.weekSigs.length, currentWeekGoal())}/${currentWeekGoal()})`
    );
  } else {
    const accNames = accentIds
      .map((id) => DRINK_ACCENTS.find((a) => a.id === id))
      .filter(Boolean)
      .map((a) => a.name);
    drinkName = accNames.length > 0 ? `${base.name} (${accNames.join(" & ")})` : base.name;
  }

  const affinityAvg = (matchScore - challengeBonus - clashCount * BREW_TUNING.clashPenalty) / guests.length;
  let quality = "☕ Mộc Mạc";
  const Q = BREW_TUNING.quality;
  if (challengeBonus === 2 && affinityAvg >= Q.perfectAffinity) {
    quality = "🌟 Hoàn Hảo";
    runState.trust += 1;
    runState.clarity += 1;
    persistentArchive.perfectBrewsCount = (persistentArchive.perfectBrewsCount || 0) + 1;
  } else if ((affinityAvg >= Q.goodAffinity && challengeBonus >= 1) || (affinityAvg >= Q.lenientAffinity && challengeBonus === 2) || affinityAvg >= Q.carryAffinity) {
    quality = "✨ Chuẩn Vị";
    runState.trust += 1;
  }

  if (hintUsed && quality === "🌟 Hoàn Hảo") {
    // Hỏi thẳng khách là đi đường tắt: không thể đạt Hoàn Hảo
    quality = "✨ Chuẩn Vị";
    runState.clarity = Math.max(0, runState.clarity - 1);
    persistentArchive.perfectBrewsCount = Math.max(0, (persistentArchive.perfectBrewsCount || 1) - 1);
  }
  const guest = guests[0];
  const baseReflection = runState.currentBrewReflection || "";
  const clashNote = clashCount ? " Hai hương vị chọi nhau làm ly bị lệch vị." : "";
  const bonusNote = challengeResultText ? ` (${challengeResultText}${clashNote})` : clashNote;

  const reflectionText = `${baseReflection}${bonusNote}`;
  if (!Array.isArray(runState.nightDrinks)) runState.nightDrinks = [];
  runState.nightDrinks.push({ name: drinkName, quality, guestId: guest.id });
  const rank = ["☕ Mộc Mạc", "✨ Chuẩn Vị", "🌟 Hoàn Hảo"];
  runState.lastDrinkName = drinkName;
  runState.lastBrewQuality = runState.nightDrinks.reduce((best, d) => (rank.indexOf(d.quality) > rank.indexOf(best) ? d.quality : best), rank[0]);
  runState.lastDrinkReflectionText = reflectionText;
  runState.brewDoneAt = runState.beatIndex;
  runState.subBeat = 0;

  recordNightLine({ type: "drink", text: `🍹 Ly cho ${guests.map((g) => g.name.split(" (")[0]).join(" & ")}: ${drinkName} — ${quality}` });
  persistentArchive.totalDrinksServed = (persistentArchive.totalDrinksServed || 0) + 1;
  persistentArchive.drinkAlbum.unshift({
    name: drinkName,
    quality,
    guestName: guests.map((g) => g.name.split(" (")[0]).join(" & "),
    signature: Boolean(matchedSignature)
  });
  if (persistentArchive.drinkAlbum.length > 40) persistentArchive.drinkAlbum.pop();

  saveArchive();
  saveRunState();
  checkAndUnlockAchievements();
  syncGameHUD();
  renderCurrentBeat();
}
