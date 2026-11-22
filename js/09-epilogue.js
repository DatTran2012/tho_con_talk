"use strict";

/* -----------------------------------------------------------------------
   SECTION 9: DRINK CARD DECK & WEEKLY / MONTHLY EPILOGUES
------------------------------------------------------------------------ */
function renderDrinkCardBeat(guests) {
  const actionArea = document.getElementById("dialogue-action-area");
  actionArea.innerHTML = "";

  if (!runState.drawnCardData) {
    const drawable = DRINK_CARDS.filter((c) => !c.hidden);
    const uncollected = drawable.filter((c) => !persistentArchive.unlockedDrinkCards[c.id]);
    const pool = uncollected.length > 0 ? uncollected : drawable;
    const card = pool[Math.floor(Math.random() * pool.length)];
    const canAskHost = runState.lastDrinkCardMode !== "host_answers";
    const mode = canAskHost && Math.random() < 0.22 ? "host_answers" : "guest_answers";
    runState.lastDrinkCardMode = mode;
    runState.drawnCardData = {
      cardId: card.id,
      mode,
      resolved: false,
      outcomeText: ""
    };
    persistentArchive.unlockedDrinkCards[card.id] = true;
    saveArchive();
    saveRunState();
    checkAndUnlockAchievements();
  }

  const card = DRINK_CARDS.find((c) => c.id === runState.drawnCardData.cardId) || DRINK_CARDS[0];
  const isDuo = guests.length > 1;
  const guestNames = guests.map((g) => g.name.split(" (")[0]).join(" & ");

  if (runState.drawnCardData.resolved) {
    setDialogue(
      isDuo ? guestNames : guests[0].name,
      "Lá Bài DRINK Tâm Giao",
      "🃏",
      runState.drawnCardData.outcomeText,
      true
    );
    return;
  }

  if (runState.drawnCardData.mode === "host_answers") {
    setDialogue(
      isDuo ? guestNames : guests[0].name,
      `Rút Lá Bài DRINK • ${card.suit}`,
      "🃏",
      `${guestNames} khẽ rút một lá bài trên mặt quầy gỗ và mỉm cười nhìn Thỏ Con:\n\n"${card.question}"\n\n— Đêm nay đến lượt chủ quán trả lời trước nhé!`,
      false
    );

    card.hostAnswers.forEach((ans) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "w-full text-left p-3 rounded-2xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-400/40 text-xs sm:text-sm text-amber-100 transition-all cursor-pointer";
      btn.textContent = ans.label;
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        runState.trust += ans.deltaTrust;
        runState.clarity += ans.deltaClarity;
        if (ans.deltaTrust > 0) recordStance("heart");
        else recordStance("mind");
        const reaction = GUEST_DRINK_CARD_REACTIONS[guests[0].id] || "Vị khách mỉm cười đầy trân trọng trước sự chân thành của Thỏ Con.";
        runState.drawnCardData.resolved = true;
        runState.drawnCardData.outcomeText = reaction;
        saveRunState();
        syncGameHUD();
        renderCurrentBeat();
      });
      actionArea.appendChild(btn);
    });
  } else {
    const g1 = guests[0];
    const slot = getCurrentNightSlot();
    const specificStory =
      (GUEST_CARD_STORIES[g1.id] && GUEST_CARD_STORIES[g1.id][card.id]) ||
      GUEST_DRINK_CARD_REACTIONS[g1.id];
    const duoFollowup =
      isDuo && slot.duoId && DUO_CARD_STORIES[slot.duoId]
        ? `\n\n${DUO_CARD_STORIES[slot.duoId]}`
        : "";

    setDialogue(
      isDuo ? guestNames : g1.name,
      `Trả Lời Bài DRINK • ${card.suit}`,
      "🃏",
      `Bạn rút lá bài trên quầy: "${card.question}"\n\n${specificStory}${duoFollowup}`,
      false
    );

    const listenButtons = [
      {
        label: "❤️ 'Cảm ơn vì đã tin tưởng mở lòng chia sẻ câu chuyện chân thật này với quán.'",
        dTrust: 1,
        dClarity: 0,
        stance: "heart"
      },
      {
        label: "✨ 'Khi gọi tên được điều sâu kín nhất trong lòng, hướng đi phía trước cũng trở nên sáng rõ hơn.'",
        dTrust: 0,
        dClarity: 1,
        stance: "mind"
      },
      {
        label: "🤫 Khẽ mỉm cười gật đầu, giữ khoảng lặng ấm áp để khách tự chiêm nghiệm.",
        dTrust: 0,
        dClarity: 0,
        stance: "silent"
      }
    ];

    listenButtons.forEach((lb) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "w-full text-left p-3 rounded-2xl bg-stone-900/95 hover:bg-amber-500/15 border border-stone-700 hover:border-amber-400/45 text-xs sm:text-sm text-stone-100 transition-all cursor-pointer";
      btn.textContent = lb.label;
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        runState.trust += lb.dTrust;
        runState.clarity += lb.dClarity;
        recordStance(lb.stance);
        runState.drawnCardData.resolved = true;
        runState.drawnCardData.outcomeText = `${guestNames} khẽ mỉm cười gật đầu — sợi dây thấu hiểu bên quầy gỗ càng thêm sâu sắc.`;
        saveRunState();
        syncGameHUD();
        renderCurrentBeat();
      });
      actionArea.appendChild(btn);
    });
  }
}

function recordStance(stance) {
  if (!runState) return;
  runState.nightStances.push(stance);
  if (stance === "heart") {
    runState.trust += 1;
    runState.weeklyStanceCounts.heart++;
    runState.monthlyStanceCounts.heart++;
  } else if (stance === "mind") {
    runState.clarity += 1;
    runState.weeklyStanceCounts.mind++;
    runState.monthlyStanceCounts.mind++;
  } else if (stance === "silent") {
    runState.weeklyStanceCounts.silent++;
    runState.monthlyStanceCounts.silent++;
  } else if (stance === "duo_heart") {
    runState.trust += 1;
    runState.weeklyStanceCounts.duo++;
    runState.monthlyStanceCounts.duo++;
    runState.weeklyStanceCounts.duo_heart = (runState.weeklyStanceCounts.duo_heart || 0) + 1;
    runState.monthlyStanceCounts.duo_heart = (runState.monthlyStanceCounts.duo_heart || 0) + 1;
  } else if (stance === "duo_mind") {
    runState.clarity += 1;
    runState.weeklyStanceCounts.duo++;
    runState.monthlyStanceCounts.duo++;
    runState.weeklyStanceCounts.duo_mind = (runState.weeklyStanceCounts.duo_mind || 0) + 1;
    runState.monthlyStanceCounts.duo_mind = (runState.monthlyStanceCounts.duo_mind || 0) + 1;
  }
}

function advanceDialogueStep() {
  if (!runState) return;
  if (isTypingDialogue) {
    finishTypewriterImmediately();
    return;
  }
  const actionArea = document.getElementById("dialogue-action-area");
  if (actionArea && actionArea.children.length > 0) return;

  const story = getStoryNight();
  const step = story.steps[runState.beatIndex];
  if (step) {
    if (step[0] === "?") {
      if (!runState.pendingReply) return;
      runState.pendingReply = null;
    } else if (step[0] === "brew") {
      if (runState.brewDoneAt !== runState.beatIndex) return;
    }
  }
  runState.subBeat = 0;
  runState.beatIndex += 1;
  saveRunState();
  renderCurrentBeat();
}

function completeCurrentNight() {
  const story = getStoryNight();
  const guests = getCurrentNightGuests();
  const heartVotes = runState.nightStances.filter((s) => s === "heart" || s === "duo_heart").length;
  const mindVotes = runState.nightStances.filter((s) => s === "mind" || s === "duo_mind").length;
  const silentVotes = runState.nightStances.filter((s) => s === "silent").length;

  let endingId = "";
  let endingTitle = "";
  let endingSummary = "";
  let radioNews = "";
  let pathTag = "";
  let branchUsed = "heart";

  // Ba nhánh: tim / trí / lặng — dựa trên các lựa chọn trong đêm
  let soloBranch = "heart";
  if (silentVotes >= 2 && silentVotes >= heartVotes && silentVotes >= mindVotes) soloBranch = "silent";
  else if (silentVotes >= 1 && heartVotes === 0 && mindVotes === 0) soloBranch = "silent";
  else if (mindVotes > heartVotes) soloBranch = "mind";

  const endSpec = story.end || "";
  if (endSpec.startsWith("duo:")) {
    const duo = DUO_PAIRINGS[endSpec.slice(4)];
    const branch = mindVotes > heartVotes ? "mind" : "heart";
    branchUsed = branch;
    endingId = `duo_${duo.id}_${branch}`;
    endingTitle = duo.endings[branch].title;
    endingSummary = duo.endings[branch].summary;
    radioNews = duo.endings[branch].radioNews;
    pathTag = branch === "mind"
      ? `${ENDING_PATH_LABELS.duo_mind.icon} ${ENDING_PATH_LABELS.duo_mind.name}`
      : `${ENDING_PATH_LABELS.duo.icon} ${ENDING_PATH_LABELS.duo.name}`;
  } else if (endSpec.startsWith("solo:")) {
    const g = CHARACTERS[endSpec.slice(5)];
    branchUsed = soloBranch;
    endingId = `${g.id}_${soloBranch}`;
    const ed = SOLO_ENDINGS_DATA[g.id][soloBranch];
    endingTitle = ed.title;
    endingSummary = ed.summary;
    radioNews = ed.radioNews;
    pathTag = `${ENDING_PATH_LABELS[soloBranch].icon} ${ENDING_PATH_LABELS[soloBranch].name}`;
  } else {
    endingTitle = story.title;
    endingSummary = story.close || "Một đêm nữa khép lại bằng tiếng mưa và ánh đèn vàng.";
    radioNews = "Đài FM Nửa Đêm: những người lạ trong con hẻm nhỏ vừa trở thành người thân của nhau.";
    pathTag = "🌙 Đêm Đoàn Tụ";
    branchUsed = soloBranch;
  }
  // Ghi nhớ cách bạn đã đối xử với từng vị khách để các chương sau nhắc lại
  if (!runState.guestPath) runState.guestPath = {};
  guests.forEach((g) => {
    runState.guestPath[g.id] = branchUsed;
  });
  const endingWasNew = endingId ? !persistentArchive.unlockedEndings[endingId] : false;

  if (endingId) persistentArchive.unlockedEndings[endingId] = true;
  runState.previousNightRadioNews = radioNews;

  const earnedKeepsake =
    runState.lastBrewQuality !== "☕ Mộc Mạc" ||
    heartVotes + mindVotes >= 1 ||
    guests.length > 1;

  if (earnedKeepsake) {
    guests.forEach((g) => {
      if (!persistentArchive.unlockedKeepsakes[g.id]) {
        persistentArchive.unlockedKeepsakes[g.id] = true;
        showToast(`🏺 Nhận kỷ vật mới: ${g.keepsake.icon} ${g.keepsake.name}`);
      }
      persistentArchive.postcards[g.id] = true;
      persistentArchive.unlockedCatDiary[g.id] = true;
      persistentArchive.unlockedCassettes[g.cassette.id] = true;
    });
  }

  const nightInWeek = (runState.nightIndex % 7) + 1;
  const weekNum = Math.min(4, Math.floor(runState.nightIndex / 7) + 1);
  const guestNamesLabel = guests.map((g) => g.name.split(" (")[0]).join(" & ");
  const nightDrinkNames = (runState.nightDrinks || []).map((d) => d.name).join(" + ") || runState.lastDrinkName;

  persistentArchive.stickyNotes.unshift({
    nightLabel: `T${weekNum}-Đ${nightInWeek}`,
    guestName: guestNamesLabel,
    text: `Cảm ơn Thỏ Con vì ly ${nightDrinkNames || "nước ấm"} và cuộc trò chuyện đêm nay!`
  });
  if (persistentArchive.stickyNotes.length > 35) persistentArchive.stickyNotes.pop();

  const nightResultObj = {
    weekNum,
    nightInWeek,
    guestNames: guestNamesLabel,
    drinkName: nightDrinkNames,
    endingTitle,
    pathTag,
    summary: endingSummary
  };
  commitNightHistory({ nightNum: runState.nightIndex + 1, weekNum, nightInWeek, guests: guestNamesLabel, endingTitle, pathTag });
  runState.weekResults.push(nightResultObj);
  runState.allMonthResults.push(nightResultObj);

  runState.nightIndex += 1;
  runState.awaitingNightStart = true;
  runState.beatIndex = 0;
  runState.subBeat = 0;
  saveArchive();
  saveRunState();
  checkAndUnlockAchievements();
  updateAllProgressBadges();

  const goNext = () => {
    const doneWeek = runState.nightIndex / 7;
    if (runState.nightIndex % 7 === 0 && !weekRecipeGoalMet(doneWeek - 1)) {
      showWeekRecipeFailed(doneWeek);
    } else if (runState.nightIndex >= 28) {
      showEpilogueModal(true);
    } else if (runState.nightIndex % 7 === 0) {
      showEpilogueModal(false);
    } else {
      startNight(runState.nightIndex);
    }
  };
  // Cảnh kết cục dài chỉ chiếu ở lần mở khóa đầu tiên; các đêm sau chỉ hiện dòng kết đêm (xem lại trong Thư viện)
  if (endingId && endingWasNew) {
    playCutscene(endingId, goNext);
  } else {
    showToast(`🌙 Kết đêm: ${endingTitle}`);
    goNext();
  }
}

function showEpilogueModal(isMonthComplete = false) {
  if (!runState) return;
  const completedWeeks = Math.min(4, Math.ceil(runState.nightIndex / 7));

  if (isMonthComplete) {
    if (!runState.monthCounted) {
      runState.monthCounted = true;
      persistentArchive.playthroughCount = (persistentArchive.playthroughCount || 0) + 1;
      persistentArchive.completedModes[runState.shiftMode] = true;
      const nextMode = SHIFT_MODES.find((m) => !persistentArchive.completedModes[m.id] && isShiftModeUnlocked(m.id));
      if (nextMode) persistentArchive.selectedShiftMode = nextMode.id;
      saveArchive();
      saveRunState();
    }
    checkAndUnlockAchievements();
    updateAllProgressBadges();

    document.getElementById("epilogue-kicker").textContent = "🏆 TỔNG KẾT HÀNH TRÌNH 1 THÁNG (28 ĐÊM)";
    document.getElementById("epilogue-heading").textContent = "Một Tháng Giữ Lửa Tiệm Nước Nửa Đêm";

    const ms = runState.monthlyStanceCounts;
    document.getElementById("epilogue-stance-summary").innerHTML = `
      <div><strong>Nhịp Điệu Tháng:</strong> ${SHIFT_MODES.find((m) => m.id === runState.shiftMode)?.name || "Tháng Mưa Bốn Chương"}</div>
      <div class="mt-1"><strong>Dấu Ấn 28 Đêm:</strong> ❤️ ${ms.heart} Trái Tim • ✨ ${ms.mind} Lý Trí • 🤫 ${ms.silent} Khoảng Lặng • 🤝 ${ms.duo} Kết Nối Song Khách</div>
    `;

    const list = document.getElementById("epilogue-results-list");
    list.innerHTML = "";
    runState.allMonthResults.forEach((r) => {
      const card = document.createElement("div");
      card.className = "p-3 rounded-2xl bg-stone-900/90 border border-stone-800 space-y-1";
      card.innerHTML = `
        <div class="flex flex-wrap items-center justify-between gap-1">
          <span class="font-bold text-amber-200">Tuần ${r.weekNum} • Đêm ${r.nightInWeek}: ${r.guestNames}</span>
          <span class="text-[11px] font-mono-code text-emerald-300">${r.pathTag}</span>
        </div>
        <div class="text-stone-100 font-semibold">${r.endingTitle}</div>
        <p class="text-stone-400 text-[11px]">${r.summary}</p>
      `;
      list.appendChild(card);
    });

    document.getElementById("btn-epilogue-next-week").classList.add("hidden");
    document.getElementById("btn-epilogue-new-week").classList.remove("hidden");
  } else {
    document.getElementById("epilogue-kicker").textContent = `🌅 TỔNG KẾT TUẦN ${completedWeeks}/4 • BÌNH MINH HẺM NHỎ`;
    document.getElementById("epilogue-heading").textContent = `Khép Lại Tuần Trực Thứ ${completedWeeks}`;

    const ws = runState.weeklyStanceCounts;
    document.getElementById("epilogue-stance-summary").innerHTML = `
      <div><strong>Dấu Ấn Tuần ${completedWeeks}:</strong> ❤️ ${ws.heart} Trái Tim • ✨ ${ws.mind} Lý Trí • 🤫 ${ws.silent} Khoảng Lặng • 🤝 ${ws.duo} Giao Thoa</div>
      <div class="mt-1 text-amber-200/90">☀️ Đầu Tuần ${completedWeeks + 1}, Thỏ Con sẽ hồi tưởng và nhắc lại câu chuyện của những vị khách tuần này.</div>
    `;

    const list = document.getElementById("epilogue-results-list");
    list.innerHTML = "";
    runState.weekResults.forEach((r) => {
      const card = document.createElement("div");
      card.className = "p-3 rounded-2xl bg-stone-900/90 border border-stone-800 space-y-1";
      card.innerHTML = `
        <div class="flex flex-wrap items-center justify-between gap-1">
          <span class="font-bold text-amber-200">Đêm ${r.nightInWeek}: ${r.guestNames}</span>
          <span class="text-[11px] font-mono-code text-emerald-300">${r.pathTag}</span>
        </div>
        <div class="text-stone-100 font-semibold">${r.endingTitle}</div>
        <p class="text-stone-400 text-[11px]">${r.summary}</p>
      `;
      list.appendChild(card);
    });

    document.getElementById("btn-epilogue-next-week").classList.remove("hidden");
    document.getElementById("btn-epilogue-next-week").textContent = `🌅 Sang Tuần ${completedWeeks + 1}/4 ▸`;
    document.getElementById("btn-epilogue-new-week").classList.add("hidden");
  }

  openModal("modal-epilogue");
  CafeVoice.speak(
    ["epilogue-heading", "epilogue-stance-summary", "epilogue-results-list"]
      .map((id) => (document.getElementById(id) || {}).textContent || "")
      .join(". "),
    ""
  );
}

/* Tuần chưa đạt mục tiêu công thức nước: phải chơi lại tuần đó trước khi mở chương tiếp theo */
function showWeekRecipeFailed(week) {
  const need = weekGoalFor(week - 1);
  const have = weekRecipeCount();
  const chap = STORY_CHAPTERS[week - 1];
  runState.retryWeek = week;
  saveRunState();
  document.getElementById("epilogue-kicker").textContent = `🍹 CHƯƠNG ${week} • CHƯA ĐẠT MỤC TIÊU`;
  document.getElementById("epilogue-heading").textContent = "Quán Còn Thiếu Một Ly Nước Đặc Biệt";
  document.getElementById("epilogue-stance-summary").innerHTML = `
    <div><strong>Mục tiêu:</strong> pha thành công ít nhất <span class="text-amber-200">${need}</span> công thức độc quyền khác nhau trong tuần (tuần này mới được <span class="text-amber-200">${have}</span>).</div>
    <div class="mt-1 text-amber-200/90">Mở "Album Ly" trong Menu để xem gợi ý cho các công thức chưa lộ diện, rồi chơi lại Chương ${week} (${chap.name}) và thử pha lại. Cả công thức đã biết cũng được tính nếu bạn pha lại trong tuần.</div>`;
  const list = document.getElementById("epilogue-results-list");
  list.innerHTML = "";
  regularRecipes().filter((s) => !(runState.weekSigs || []).includes(s.id))
    .slice(0, 3)
    .forEach((sig) => {
      const base = DRINK_BASES.find((b) => b.id === sig.base);
      const card = document.createElement("div");
      card.className = "p-3 rounded-2xl bg-stone-900/90 border border-stone-800 text-[11px] text-stone-300";
      card.innerHTML = `🔒 Công thức chưa lộ diện • nền gợi ý: ${base ? `${base.icon} ${base.name}` : "?"}`;
      list.appendChild(card);
    });
  const nextBtn = document.getElementById("btn-epilogue-next-week");
  nextBtn.classList.remove("hidden");
  nextBtn.textContent = `🔁 Chơi Lại Chương ${week} ▸`;
  document.getElementById("btn-epilogue-new-week").classList.add("hidden");
  openModal("modal-epilogue");
}

function proceedToNextWeekWithRecap() {
  if (!runState) return;
  closeModal("modal-epilogue");

  if (runState.retryWeek) {
    const wk = runState.retryWeek;
    runState.retryWeek = 0;
    runState.nightIndex = (wk - 1) * 7;
    runState.weekResults = [];
    runState.allMonthResults = runState.allMonthResults.filter((r) => r.weekNum < wk);
    runState.weeklyStanceCounts = { heart: 0, mind: 0, silent: 0, duo: 0, duo_heart: 0, duo_mind: 0 };
    runState.awaitingNightStart = true;
    runState.beatIndex = 0;
    runState.subBeat = 0;
    saveRunState();
    startNight(runState.nightIndex);
    return;
  }

  const nextWeekNum = Math.min(4, Math.floor(runState.nightIndex / 7) + 1);
  const prevResults = [...runState.weekResults];
  runState.weekResults = [];
  runState.weeklyStanceCounts = { heart: 0, mind: 0, silent: 0, duo: 0, duo_heart: 0, duo_mind: 0 };
  saveRunState();

  const highlightLines = prevResults
    .map((r) => `• ${r.guestNames} (${r.endingTitle})`)
    .join("\n");

  const recapCaption = `Mở đầu Tuần ${nextWeekNum}/4. Thỏ Con lau sạch mặt quầy gỗ thông, hồi tưởng lại những vị khách tuần trước:\n${highlightLines}\n\nNgọn đèn vàng tiếp tục sáng lên đón tuần trực mới.`;

  document.getElementById("cs-player-location").textContent = `🌅 HỒI TƯỞNG ĐẦU TUẦN ${nextWeekNum}/4`;
  const nightBannerEl = document.getElementById("cs-player-night-banner");
  if (nightBannerEl) nightBannerEl.classList.add("hidden");
  document.getElementById("cs-player-icon").textContent = "🐰📖☕";
  document.getElementById("cs-player-title").textContent = `Ghi Chép Đầu Tuần ${nextWeekNum}`;
  document.getElementById("cs-player-caption").textContent = recapCaption;
  CafeVoice.speak(recapCaption, "");
  activeCutscenePages = null;
  document.getElementById("btn-cs-player-continue").textContent = "Tiếp Tục ▸";

  activeCutsceneCallback = () => {
    startNight(runState.nightIndex);
  };
  openModal("modal-cutscene-player");
}
