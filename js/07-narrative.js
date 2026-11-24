"use strict";

/* -----------------------------------------------------------------------
   SECTION 7: ĐỘNG CƠ KỊCH BẢN 4 CHƯƠNG (28 đêm, mỗi đêm một kịch bản riêng)
   Mỗi đêm trong STORY_NIGHTS có danh sách "bước" (steps):
     ["@", "23:40"]            đặt giờ (đồng hồ quán chạy theo)
     ["+", "vy"] / ["-", "vy"] khách bước vào / rời quầy
     ["vy"|"host"|"sys", text] một câu thoại (text có thể là {heart,mind,silent,d} theo lựa chọn ở lần gặp trước)
     ["?", prompt, H, M, S]    lựa chọn (mỗi phương án: [nhãn, người đáp, lời đáp])
     ["brew", gid, lời gọi món, cảm nhận]  pha một ly riêng cho khách
     ["card"]                  rút lá bài DRINK
------------------------------------------------------------------------ */
const STORY_STEP_CONTROL = new Set(["@", "+", "-"]);

function getStoryNight(idx = runState ? runState.nightIndex : 0) {
  return STORY_NIGHTS[Math.max(0, Math.min(27, idx))];
}

function storyCutsceneId(story) {
  return `story_${story.ch}_${story.n}`;
}

function startNight(nightIdx) {
  if (!runState) return;
  cancelActiveBrewAnimation();

  if (!runState.singleRetry && nightIdx > 0 && nightIdx % 7 === 0 && !weekRecipeGoalMet(nightIdx / 7 - 1)) {
    showWeekRecipeFailed(Math.min(4, nightIdx / 7));
    return;
  }
  if (nightIdx >= 28) {
    showEpilogueModal(true);
    return;
  }
  if (!runState.singleRetry && nightIdx > 0 && nightIdx % 7 === 0 && runState.weekResults.length >= 7) {
    showEpilogueModal(false);
    return;
  }

  const story = getStoryNight(nightIdx);
  runState.nightIndex = nightIdx;
  runState.awaitingNightStart = false;
  runState.dialogueLog = [];
  runState.nightLines = [];
  runState.beatIndex = 0;
  runState.subBeat = 0;
  runState.nightStances = [];
  runState.presentGuests = [];
  runState.pendingReply = null;
  runState.brewDoneAt = -1;
  runState.nightDrinks = [];
  runState.currentBrewReflection = "";
  runState.lastDrinkName = "";
  runState.lastBrewQuality = "";
  runState.lastDrinkReflectionText = "";
  runState.drawnCardData = null;
  runState.clock = story.t0;
  if (nightIdx % 7 === 0 && !runState.singleRetry) runState.weekSigs = [];
  if (story.n === 1) {
    setTimeout(() => showToast(`🍹 Mục tiêu Chương ${story.ch}: trong tuần này hãy pha thành công ${weekGoalFor(story.ch - 1)} công thức độc quyền khác nhau`), 1800);
  }

  if ((persistentArchive.maxChapter || 1) < story.ch) {
    persistentArchive.maxChapter = story.ch;
    saveArchive();
  }
  applyNightAmbience(nightIdx);
  saveRunState();
  syncGameHUD();
  setStoryClock(story.t0);

  const activeSeason = stageRenderer.getActiveSeason();
  const nightBannerMeta = {
    mainTitle: `CHƯƠNG ${story.ch} • ĐÊM ${story.n}`,
    subTitle: `${story.title} • ${activeSeason.shortLabel}`
  };
  const launch = () => playCutscene(storyCutsceneId(story), () => renderCurrentBeat(), nightBannerMeta);
  if (nightIdx === 0) playOriginSequence(launch);
  else launch();
}

/* Mỗi đêm tự đổi mùa và không gian quán (đèn, quầy, góc trang trí) nếu người chơi để chế độ tự động. */
function applyNightAmbience(nightIdx) {
  let changed = false;
  // Mỗi tuần một mùa: Tuần 1 Xuân → Tuần 2 Hạ → Tuần 3 Thu → Tuần 4 Đông
  if (persistentArchive.autoCycleSeasons) {
    const nextSeason = SEASON_THEMES[Math.min(3, Math.floor(nightIdx / 7)) % SEASON_THEMES.length];
    if (persistentArchive.selectedSeasonTheme !== nextSeason.id && nightIdx % 7 === 0 && nightIdx > 0) {
      setTimeout(() => showToast(`${nextSeason.icon} Sang mùa mới: ${nextSeason.name.replace(/^\S+\s/, "")}`), 1500);
    }
    persistentArchive.selectedSeasonTheme = nextSeason.id;
    persistentArchive.visitedSeasons[nextSeason.id] = true;
    changed = true;
  }
  if (persistentArchive.autoCycleCafe && nightIdx > 0) {
    if (!persistentArchive.cafeCustom) persistentArchive.cafeCustom = {};
    Object.entries(CAFE_CUSTOM_OPTIONS).forEach(([slot, group], slotIdx) => {
      const available = group.choices.filter((c) => !c.requires || isSecretUnlocked(c.requires));
      persistentArchive.cafeCustom[slot] = available[(nightIdx + slotIdx) % available.length].id;
    });
    changed = true;
  }
  if (!changed) return;
  saveArchive();
  audioEngine.applySeasonSoundscape();
  checkAndUnlockAchievements();
}

function resumeRun() {
  if (!runState) {
    switchScreen("screen-rules");
    return;
  }
  switchScreen("screen-game");
  if (runState.awaitingNightStart || runState.nightIndex >= 28) {
    startNight(runState.nightIndex);
  } else {
    renderCurrentBeat();
  }
}

function storySpeaker(who) {
  if (who === "host") return { name: "Thỏ Con", role: "Chủ Quán Nửa Đêm", avatar: "🐰" };
  if (who === "sys") return { name: "Hẻm Nhỏ Về Đêm", role: "Khung Cảnh", avatar: "🌙", sys: true };
  const g = CHARACTERS[who] || CHARACTERS.vy;
  return { name: g.name, role: g.role, avatar: g.avatar };
}

/* Lời thoại có thể khác nhau tùy cách bạn đã đối xử với vị khách đó ở lần gặp trước. */
function resolveStoryText(text, who) {
  if (typeof text === "string") return text;
  if (!text) return "";
  const prev = runState && runState.guestPath ? runState.guestPath[who] : "";
  const key = { heart: "h", mind: "m", silent: "s" }[prev] || "d";
  return text[key] || text.d || text.h || text.m || text.s || "";
}

function applyStoryControl(step) {
  const [k, v] = step;
  if (k === "@") {
    runState.clock = v;
    setStoryClock(v);
  } else if (k === "+") {
    if (!runState.presentGuests.includes(v)) runState.presentGuests.push(v);
    unlockShelfBook(v);
    audioEngine.playChime(520 + runState.presentGuests.length * 40, 0.25, 0.03);
  } else if (k === "-") {
    runState.presentGuests = runState.presentGuests.filter((id) => id !== v);
  }
}

function renderCurrentBeat() {
  if (!runState) return;
  cancelActiveBrewAnimation();

  if (runState.nightIndex >= 28) {
    showEpilogueModal(true);
    return;
  }
  const story = getStoryNight();
  const steps = story.steps;
  while (runState.beatIndex < steps.length && STORY_STEP_CONTROL.has(steps[runState.beatIndex][0])) {
    applyStoryControl(steps[runState.beatIndex]);
    runState.beatIndex += 1;
  }
  setStoryClock(runState.clock || story.t0);
  syncGameHUD();
  if (runState.beatIndex >= steps.length) {
    completeCurrentNight();
    return;
  }
  saveRunState();
  renderStoryStep(steps[runState.beatIndex], story);
}

function storyTimeOpts(extra = {}) {
  return { plain: true, time: runState.clock, ...extra };
}

function renderStoryStep(step, story) {
  const actionArea = document.getElementById("dialogue-action-area");
  actionArea.innerHTML = "";
  const kind = step[0];
  const guests = getCurrentNightGuests();

  if (kind === "card") {
    if (!persistentArchive.discoveredEasterEggs.egg_deep_night) {
      persistentArchive.discoveredEasterEggs.egg_deep_night = true;
      saveArchive();
      checkAndUnlockAchievements();
    }
    renderDrinkCardBeat(guests);
    return;
  }

  if (kind === "?") {
    if (runState.pendingReply) {
      const r = storySpeaker(runState.pendingReply.who);
      setDialogue(r.name, r.role, r.avatar, resolveStoryText(runState.pendingReply.text, runState.pendingReply.who), true, storyTimeOpts());
      return;
    }
    setDialogue("Thỏ Con", "Chủ Quán Nửa Đêm", "🐰", step[1], false, storyTimeOpts({ narr: true }));
    [
      { stance: "heart", icon: "❤️", data: step[2], quote: true },
      { stance: "mind", icon: "✨", data: step[3], quote: true },
      { stance: "silent", icon: "🤫", data: step[4], quote: false }
    ].forEach((opt) => {
      const [label, who, reply] = opt.data;
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "w-full text-left p-3 rounded-2xl bg-stone-900/95 hover:bg-amber-500/15 border border-stone-700 hover:border-amber-400/45 text-xs sm:text-sm text-stone-100 transition-all cursor-pointer";
      btn.textContent = opt.quote ? `${opt.icon} “${label}”` : `${opt.icon} ${label}`;
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        recordStance(opt.stance);
        runState.pendingReply = { who, text: reply };
        saveRunState();
        syncGameHUD();
        renderCurrentBeat();
      });
      actionArea.appendChild(btn);
    });
    return;
  }

  if (kind === "brew") {
    const gid = step[1];
    const guest = CHARACTERS[gid] || guests[0];
    if (!runState.presentGuests.includes(gid)) runState.presentGuests.push(gid);
    if (runState.brewDoneAt === runState.beatIndex) {
      setDialogue(guest.name, guest.role, guest.avatar, `[${runState.lastDrinkName} — ${runState.lastBrewQuality}]\n\n${runState.lastDrinkReflectionText}`, true, storyTimeOpts({ narr: true }));
      return;
    }
    runState.currentBrewReflection = resolveStoryText(step[3], gid);
    setDialogue(guest.name, guest.role, guest.avatar, resolveStoryText(step[2], gid), false, storyTimeOpts());
    const short = guest.name.split(" (")[0];
    renderThreeStepBrewingStation([guest], guests.length > 1 ? `Ly riêng dành cho ${short}` : "");
    return;
  }

  // câu thoại thường (guest | host | sys)
  const sp = storySpeaker(kind);
  if (CHARACTERS[kind] && !runState.presentGuests.includes(kind)) {
    runState.presentGuests.push(kind);
    syncGameHUD();
  }
  setDialogue(sp.name, sp.role, sp.avatar, resolveStoryText(step[1], kind), true, storyTimeOpts({ sys: sp.sys, dir: step[2] || "" }));
}
