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
    const wk = Math.min(4, nightIdx / 7);
    const shown = typeof SceneFX !== "undefined" && SceneFX.play("week", { ok: false, have: weekRecipeCount(), need: weekGoalFor(wk - 1), week: wk }, () => showWeekRecipeFailed(wk));
    if (!shown) showWeekRecipeFailed(wk);
    return;
  }
  if (nightIdx >= 28) {
    showEpilogueModal(true);
    return;
  }
  if (!runState.singleRetry && nightIdx > 0 && nightIdx % 7 === 0 && runState.weekResults.length >= 7) {
    const wk2 = Math.min(4, nightIdx / 7);
    const shown2 = typeof SceneFX !== "undefined" && SceneFX.play("week", { ok: true, have: weekRecipeCount(), need: weekGoalFor(wk2 - 1), week: wk2 }, () => showEpilogueModal(false));
    if (!shown2) showEpilogueModal(false);
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
  const launchStory = () => playCutscene(storyCutsceneId(story), () => renderCurrentBeat(), nightBannerMeta);
  // mở quán (bản đầy đủ lần đầu, các đêm sau bản ngắn); đầu mỗi chương có thêm màn tiêu đề chương
  const launchOpen = () => {
    if (typeof SceneFX === "undefined") return launchStory();
    const full = !persistentArchive.fxOpenSeen;
    persistentArchive.fxOpenSeen = true; saveArchive();
    const ok = SceneFX.play("open", { night: story.n, title: story.title, short: !full, guest: CHARACTERS[story.guests[0]] }, launchStory);
    if (!ok) launchStory();
  };
  const launch = () => {
    const chap = STORY_CHAPTERS[story.ch - 1];
    if (typeof SceneFX !== "undefined" && story.n === 1 && nightIdx > 0 && chap && !runState.singleRetry) {
      const ok = SceneFX.play("chapter", { no: chap.no, icon: chap.icon, name: chap.name, line: chap.desc }, launchOpen);
      if (ok) return;
    }
    launchOpen();
  };
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
/* Lời cảm nhận cho ly Mộc Mạc: dịu, thật lòng, không khen quá lời (thay cho câu khen cố định của từng đêm) */
const PLAIN_REFLECTIONS = {
  vy: ["Em nhấp thử một ngụm: “Ừm… uống được, cũng dễ chịu. Chắc em cần thêm chút thời gian mới thấy hợp vị.”", "Vy cười gượng: “Hơi nhạt so với em tưởng, nhưng ấm tay là được rồi Thỏ Con.”"],
  minh: ["Minh nhấp một ngụm rồi gật nhẹ: “Cũng ổn. Chưa đúng thứ tôi hình dung, nhưng tôi không chê.”", "Minh xoay xoay ly: “Vị bình thường thôi. Nhưng ít ra nó khiến tôi ngồi yên được một lúc.”"],
  linh: ["Chị Linh khẽ nhấp một ngụm: “Dịu đấy em. Chưa thật trọn vị, nhưng chị thấy ấm là đủ.”", "Chị Linh mỉm cười: “Ly này giản dị quá. Cũng hay, đỡ phải nghĩ nhiều.”"],
  tuan: ["Anh Tuấn uống một ngụm, gật gù: “Ừ, cũng được. Chưa đã lắm nhưng sưởi tay thế này là ổn rồi.”", "Anh Tuấn cười xòa: “Vị nhạt hơn anh nghĩ, mà thôi, ngồi đây đã quý rồi.”"],
  khang: ["Anh Khang nhấp một ngụm, im lặng một lúc: “Mộc mạc. Chưa phải ly anh nhớ, nhưng không tệ.”", "Anh Khang gõ nhẹ ngón tay lên ly: “Thật thà, không màu mè. Tạm hợp lúc này.”"],
  hoa: ["Cô Hoa nhấp một ngụm nhỏ: “Cũng dịu em ạ. Chưa thấm lắm, nhưng cô vẫn thấy ấm.”", "Cô Hoa gật đầu hiền: “Vị này hơi lạ miệng. Để cô uống chậm thêm xem sao.”"],
  an: ["Bác An nhấp một ngụm, khẽ gật: “Tạm được. Chưa thật vừa miệng, nhưng bác thấy ấm lòng.”", "Bác An cười nhẹ: “Giản dị cũng có cái hay của nó. Bác ngồi đây thêm chút nhé.”"]
};
function plainReflection(gid) {
  const pool = PLAIN_REFLECTIONS[gid] || ["Khách nhấp một ngụm, gật nhẹ: “Cũng ổn, cảm ơn em.”"];
  return pool[((runState && runState.nightIndex) || 0) % pool.length];
}

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
      // lời dẫn khớp với cảnh mời nước vừa chiếu: phản ứng của khách theo chất lượng đúng ly này
      const lastD = (runState.nightDrinks || [])[runState.nightDrinks.length - 1] || {};
      const qk = /Hoàn Hảo/.test(lastD.quality || "") ? "perfect" : /Chuẩn/.test(lastD.quality || "") ? "good" : "plain";
      const sn = guest.name.split(" (")[0];
      const LEAD = {
        perfect: [`${sn} khựng lại một nhịp, mắt sáng lên — đúng thứ mình đang cần.`, "happy"],
        good: [`${sn} gật đầu, nét mặt dịu hẳn xuống.`, "happy"],
        plain: [`${sn} nhấm nháp chậm rãi, nghĩ ngợi một lúc rồi mới gật nhẹ — chưa thật trọn vị, nhưng vẫn đủ ấm để mở lòng.`, "thinking"]
      }[qk];
      // ly hoàn hảo mở thêm "lời thật" của khách (mỗi chương một lời, nghe một lần)
      let truthLine = "";
      if (qk === "perfect" || runState.quietBrewAt === runState.beatIndex) {
        const chIdx = Math.min(3, Math.floor(runState.nightIndex / 7));
        const key = `${guest.id}_${chIdx + 1}`;
        const t = GUEST_TRUTHS[guest.id] && GUEST_TRUTHS[guest.id][chIdx];
        if (t && !(persistentArchive.truthsHeard || {})[key]) {
          persistentArchive.truthsHeard = { ...(persistentArchive.truthsHeard || {}), [key]: true };
          saveArchive();
          truthLine = `\n\n💬 “${t}”`;
          const tn = Object.keys(persistentArchive.truthsHeard).length;
          const goal = persistentArchive.quietEndingSeen && typeof TWIST_TRUTHS_NEEDED !== "undefined" ? ` • mở cửa: ${Math.min(tn, TWIST_TRUTHS_NEEDED)}/${TWIST_TRUTHS_NEEDED}` : "";
          showToast(`💬 ${sn} nói thêm một lời thật (${tn}/28${goal})`);
        }
      }
      setDialogue(guest.name, guest.role, guest.avatar, `[${runState.lastDrinkName} — ${lastD.quality || runState.lastBrewQuality}]\n\n${LEAD[0]}\n\n${qk === "plain" ? plainReflection(guest.id) : runState.lastDrinkReflectionText}${truthLine}`, true, storyTimeOpts({ narr: true }));
      // giữ biểu cảm của khách đúng như trong cảnh vừa rồi (không mấp máy miệng vì đây là phần dẫn)
      stageRenderer.speakerId = guest.id; stageRenderer.emotion = LEAD[1]; stageRenderer.talkAnimTimer = 0;
      return;
    }
    runState.currentBrewReflection = resolveStoryText(step[3], gid);
    setDialogue(guest.name, guest.role, guest.avatar, resolveStoryText(step[2], gid), false, storyTimeOpts());
    const short = guest.name.split(" (")[0];
    if (step[4] && step[4].quiet) {
      // ĐÊM LẮNG NGHE: không minigame, không chấm điểm. Chỉ rót một tách thật chậm; đổi lại khách nói thêm lời thật.
      actionArea.innerHTML = "";
      const qb = document.createElement("button");
      qb.type = "button";
      qb.id = "btn-quiet-brew";
      qb.className = "w-full min-h-[48px] px-4 py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/50 text-amber-100 font-semibold text-sm cursor-pointer transition-all";
      qb.textContent = "🫖 Rót một tách thật chậm — đêm nay chỉ lắng nghe";
      qb.addEventListener("click", (e) => {
        e.stopPropagation();
        qb.disabled = true;
        const base = DRINK_BASES.find((b) => guest.preferredBases.includes(b.id)) || DRINK_BASES[0];
        const acc = (guest.preferredAccents || []).slice(0, 1);
        runState.quietBrewAt = runState.beatIndex;
        finalizeDrinkService([guest], base, acc, 1, "Đêm lắng nghe: không thử thách, chỉ một tách nước rót thật chậm.");
      });
      actionArea.appendChild(qb);
      return;
    }
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
