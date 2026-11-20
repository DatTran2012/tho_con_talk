"use strict";

/* -----------------------------------------------------------------------
   SECTION 7: NIGHT & BEAT NARRATIVE ENGINE (SOLO, DUO & CHAPTER 2)
------------------------------------------------------------------------ */
function startNight(nightIdx) {
  if (!runState) return;
  cancelActiveBrewAnimation();

  if (nightIdx >= 28) {
    showEpilogueModal(true);
    return;
  }
  if (nightIdx > 0 && nightIdx % 7 === 0 && runState.weekResults.length >= 7) {
    showEpilogueModal(false);
    return;
  }

  runState.nightIndex = nightIdx;
  runState.awaitingNightStart = false;
  runState.encounterReplyText = "";
  runState.dialogueLog = [];
  runState.beatIndex = 0;
  runState.subBeat = 0;
  runState.nightStances = [];
  runState.duoSecondGuestPresent = false;
  runState.beat2CutscenePlayed = false;
  runState.lastChoiceReplyText = "";
  runState.lastDrinkName = "";
  runState.lastBrewQuality = "";
  runState.lastDrinkReflectionText = "";
  runState.drawnCardData = null;

  applyNightAmbience(nightIdx);

  if (runState.shiftMode === "midnight_mysteries") {
    const unused = MIDNIGHT_ENCOUNTERS.filter((e) => !runState.usedEncounterIds.includes(e.id));
    const pool = unused.length > 0 ? unused : MIDNIGHT_ENCOUNTERS;
    const picked = pool[Math.floor(Math.random() * pool.length)];
    runState.activeEncounter = picked;
    if (!runState.usedEncounterIds.includes(picked.id)) {
      runState.usedEncounterIds.push(picked.id);
    }
  } else {
    runState.activeEncounter = null;
  }

  saveRunState();
  syncGameHUD();

  const nightInWeek = (nightIdx % 7) + 1;
  const weekNum = Math.min(4, Math.floor(nightIdx / 7) + 1);
  const slot = getCurrentNightSlot();
  const guests = getCurrentNightGuests();
  const activeSeason = stageRenderer.getActiveSeason();
  const nightBannerMeta = {
    mainTitle: `TUẦN ${weekNum} • ĐÊM ${nightInWeek}`,
    subTitle: `${slot.type === "duo" ? "👥 Đêm Song Khách Giao Thoa" : "👤 Đêm Đơn Khách"} • ${activeSeason.shortLabel}`
  };

  const launchNightCutscenes = () => {
    playCutscene(
      `night_intro_${nightInWeek}`,
      () => {
        const firstGuest = guests[0];
        const firstCutscene = persistentArchive.unlockedKeepsakes[firstGuest.id]
          ? `return_${firstGuest.id}`
          : `ambient_${firstGuest.id}`;
        playCutscene(firstCutscene, () => renderCurrentBeat());
      },
      nightBannerMeta
    );
  };

  if (nightIdx === 0) {
    playOriginSequence(launchNightCutscenes);
  } else {
    launchNightCutscenes();
  }
}

/* Mỗi đêm tự đổi mùa và không gian quán (đèn, quầy, góc trang trí) nếu người chơi để chế độ tự động. */
function applyNightAmbience(nightIdx) {
  if (nightIdx <= 0) return;
  let changed = false;
  if (persistentArchive.autoCycleSeasons) {
    const nextSeason = SEASON_THEMES[nightIdx % SEASON_THEMES.length];
    persistentArchive.selectedSeasonTheme = nextSeason.id;
    persistentArchive.visitedSeasons[nextSeason.id] = true;
    changed = true;
  }
  if (persistentArchive.autoCycleCafe) {
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

function renderCurrentBeat() {
  if (!runState) return;
  cancelActiveBrewAnimation();

  if (runState.nightIndex >= 28) {
    showEpilogueModal(true);
    return;
  }

  syncGameHUD();
  const slot = getCurrentNightSlot();
  const guests = getCurrentNightGuests();
  const beat = runState.beatIndex;

  if (slot.type === "duo") {
    renderDuoNightBeat(slot, guests, beat);
  } else {
    renderSoloNightBeat(guests[0], beat);
  }
}

function renderSoloNightBeat(guest, beat) {
  const script = SOLO_NIGHT_SCRIPTS[guest.id];
  const extra = EXTRA_DIALOGUE_BANK.soloExtra[guest.id];
  const isChapter2 = Boolean(persistentArchive.unlockedKeepsakes[guest.id]);
  const ch2 = CHAPTER2_RETURN_SCRIPTS[guest.id];
  const ch2Full = EXTRA_DIALOGUE_BANK.chapter2Full[guest.id];
  const actionArea = document.getElementById("dialogue-action-area");
  actionArea.innerHTML = "";
  const sub = runState.subBeat || 0;

  if (beat === 0) {
    if (sub === 0) {
      setDialogue(
        guest.name,
        isChapter2 ? `${guest.role} • Gặp Lại` : guest.role,
        guest.avatar,
        isChapter2 ? ch2.greeting : `${script.entranceNarration}\n\n"${script.greeting}"`,
        true
      );
    } else {
      setDialogue("Thỏ Con", "Chủ Quán Nửa Đêm", "🐰", extra.hostWelcome, true);
    }
  } else if (beat === 1) {
    if (sub === 0) {
      setDialogue(
        guest.name,
        guest.role,
        guest.avatar,
        isChapter2 ? ch2.update : `${script.economicLine}\n\n${script.aiLine}`,
        true
      );
    } else if (sub === 1) {
      const banter = extra.guestBanterPool[(runState.nightIndex + sub) % extra.guestBanterPool.length];
      setDialogue(guest.name, guest.role, guest.avatar, banter, true);
    } else {
      setDialogue("Thỏ Con", "Chủ Quán Nửa Đêm", "🐰", extra.hostEmpathy, true);
    }
  } else if (beat === 2) {
    if (runState.encounterReplyText) {
      setDialogue("Sự Kiện Nửa Đêm", "Dư Âm Đêm Khuya", "🕯️", runState.encounterReplyText, true);
      return;
    }
    if (runState.activeEncounter) {
      const enc = runState.activeEncounter;
      setDialogue("Sự Kiện Nửa Đêm", enc.title, "🕯️", enc.prompt, false);
      enc.choices.forEach((c) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "w-full text-left p-3 rounded-2xl bg-purple-500/15 hover:bg-purple-500/25 border border-purple-400/35 text-xs sm:text-sm text-purple-100 transition-all cursor-pointer";
        btn.textContent = c.label;
        btn.addEventListener("click", (e) => {
          e.stopPropagation();
          runState.trust += c.deltaTrust;
          runState.clarity += c.deltaClarity;
          runState.encounterReplyText = c.reply;
          runState.activeEncounter = null;
          saveRunState();
          syncGameHUD();
          renderCurrentBeat();
        });
        actionArea.appendChild(btn);
      });
      return;
    }

    if (runState.lastChoiceReplyText) {
      setDialogue(guest.name, guest.role, guest.avatar, runState.lastChoiceReplyText, true);
      return;
    }

    const qHeartText = isChapter2 ? ch2Full.qHeart : script.qHeart;
    const rHeartText = isChapter2 ? ch2Full.rHeart : script.rHeart;
    const qMindText = isChapter2 ? ch2Full.qMind : script.qMind;
    const rMindText = isChapter2 ? ch2Full.rMind : script.rMind;

    setDialogue("Thỏ Con", "Chủ Quán Nửa Đêm", "🐰", "Bạn lặng lẽ lắng nghe và chọn cách mở lời với vị khách...", false);
    const choices = [
      { label: `❤️ "${qHeartText}"`, stance: "heart", reply: rHeartText },
      { label: `✨ "${qMindText}"`, stance: "mind", reply: rMindText },
      { label: "🤫 Lặng lẽ rót một chén nước ấm đặt trước mặt khách, giữ không gian tĩnh lặng để khách tự trải lòng.", stance: "silent", reply: `${guest.name.split(" (")[0]} khẽ thở phào trong khoảng lặng bình yên ấy, đôi vai căng cứng dần thả lỏng.` }
    ];
    choices.forEach((ch) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "w-full text-left p-3 rounded-2xl bg-stone-900/95 hover:bg-amber-500/15 border border-stone-700 hover:border-amber-400/45 text-xs sm:text-sm text-stone-100 transition-all cursor-pointer";
      btn.textContent = ch.label;
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        recordStance(ch.stance);
        runState.lastChoiceReplyText = ch.reply;
        saveRunState();
        syncGameHUD();
        renderCurrentBeat();
      });
      actionArea.appendChild(btn);
    });
  } else if (beat === 3) {
    if (!runState.lastDrinkName) {
      setDialogue(guest.name, guest.role, guest.avatar, `"${script.clue}"`, false);
      renderThreeStepBrewingStation([guest]);
    } else if (sub === 0) {
      setDialogue(
        guest.name,
        guest.role,
        guest.avatar,
        `[${runState.lastDrinkName} — ${runState.lastBrewQuality}]\n\n${runState.lastDrinkReflectionText}`,
        true
      );
    } else {
      setDialogue(guest.name, guest.role, guest.avatar, extra.drinkMemory, true);
    }
  } else if (beat === 4) {
    if (!persistentArchive.discoveredEasterEggs.egg_deep_night) {
      persistentArchive.discoveredEasterEggs.egg_deep_night = true;
      saveArchive();
      checkAndUnlockAchievements();
    }
    renderDrinkCardBeat([guest]);
  } else if (beat === 5) {
    if (runState.lastChoiceReplyText) {
      if (sub === 0) {
        setDialogue(guest.name, guest.role, guest.avatar, runState.lastChoiceReplyText, true);
      } else if (sub === 1) {
        setDialogue("Thỏ Con", "Chủ Quán Nửa Đêm", "🐰", extra.preDawnHost, true);
      } else {
        setDialogue(guest.name, guest.role, guest.avatar, extra.preDawnGuest, true);
      }
      return;
    }

    const advHeartText = isChapter2 ? ch2Full.advHeart : script.advHeart;
    const rAdvHeartText = isChapter2 ? ch2Full.rAdvHeart : script.rAdvHeart;
    const advMindText = isChapter2 ? ch2Full.advMind : script.advMind;
    const rAdvMindText = isChapter2 ? ch2Full.rAdvMind : script.rAdvMind;

    setDialogue("Thỏ Con", "Chủ Quán Nửa Đêm", "🐰", "Đồng hồ đã điểm gần 04:45 sáng. Trước khi vị khách rời quán, bạn muốn gửi gắm điều gì?", false);
    const finalChoices = [
      { label: `❤️ "${advHeartText}"`, stance: "heart", reply: rAdvHeartText },
      { label: `✨ "${advMindText}"`, stance: "mind", reply: rAdvMindText },
      { label: "🤫 Mỉm cười tiễn khách bằng ánh mắt ấm áp và một cái gật đầu tin tưởng.", stance: "silent", reply: `${guest.name.split(" (")[0]} khẽ cúi đầu cảm ơn trong sự thấu hiểu không cần lời.` }
    ];
    finalChoices.forEach((fc) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "w-full text-left p-3 rounded-2xl bg-stone-900/95 hover:bg-amber-500/15 border border-stone-700 hover:border-amber-400/45 text-xs sm:text-sm text-stone-100 transition-all cursor-pointer";
      btn.textContent = fc.label;
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        recordStance(fc.stance);
        runState.lastChoiceReplyText = fc.reply;
        runState.subBeat = 0;
        saveRunState();
        syncGameHUD();
        renderCurrentBeat();
      });
      actionArea.appendChild(btn);
    });
  } else if (beat === 6) {
    if (sub === 0) {
      const partingText = isChapter2 ? ch2Full.parting : script.partingLine;
      setDialogue(
        guest.name,
        guest.role,
        guest.avatar,
        `05:00 sáng. Ánh bình minh đầu tiên hắt qua khung cửa kính.\n\n"${partingText}"`,
        true
      );
    } else {
      setDialogue("Thỏ Con", "Chủ Quán Nửa Đêm", "🐰", extra.hostFarewell, true);
    }
  }
}

function renderDuoNightBeat(slot, guests, beat) {
  const duo = DUO_PAIRINGS[slot.duoId];
  const sc = duo.script;
  const dExtra = EXTRA_DIALOGUE_BANK.duoExtra[slot.duoId];
  const g1 = guests[0];
  const g2 = guests[1];
  const actionArea = document.getElementById("dialogue-action-area");
  actionArea.innerHTML = "";
  const sub = runState.subBeat || 0;

  if (beat === 0) {
    if (sub === 0) {
      setDialogue(g1.name, `${g1.role} • Khách Đầu Tiên`, g1.avatar, `${sc.intro}\n\n"${sc.g1Line}"`, true);
    } else if (sub === 1) {
      setDialogue("Thỏ Con", "Chủ Quán Nửa Đêm", "🐰", dExtra.hostToG1, true);
    } else {
      setDialogue(g1.name, `${g1.role} • Khách Đầu Tiên`, g1.avatar, dExtra.g1More, true);
    }
  } else if (beat === 1) {
    if (sub === 0) {
      setDialogue(g2.name, `${g2.role} • Khách Thứ Hai`, g2.avatar, sc.g2React, true);
    } else if (sub === 1) {
      setDialogue(g1.name, g1.role, g1.avatar, dExtra.g1ToG2, true);
    } else {
      setDialogue(g2.name, g2.role, g2.avatar, dExtra.g2ToG1, true);
    }
  } else if (beat === 2) {
    if (runState.encounterReplyText) {
      setDialogue("Sự Kiện Nửa Đêm", "Dư Âm Đêm Khuya", "🕯️", runState.encounterReplyText, true);
      return;
    }
    if (runState.activeEncounter) {
      const enc = runState.activeEncounter;
      setDialogue("Sự Kiện Nửa Đêm", enc.title, "🕯️", enc.prompt, false);
      enc.choices.forEach((c) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "w-full text-left p-3 rounded-2xl bg-purple-500/15 hover:bg-purple-500/25 border border-purple-400/35 text-xs sm:text-sm text-purple-100 transition-all cursor-pointer";
        btn.textContent = c.label;
        btn.addEventListener("click", (e) => {
          e.stopPropagation();
          runState.trust += c.deltaTrust;
          runState.clarity += c.deltaClarity;
          runState.encounterReplyText = c.reply;
          runState.activeEncounter = null;
          saveRunState();
          syncGameHUD();
          renderCurrentBeat();
        });
        actionArea.appendChild(btn);
      });
      return;
    }

    if (runState.lastChoiceReplyText) {
      setDialogue(`${g1.name.split(" (")[0]} & ${g2.name.split(" (")[0]}`, "Giao Thoa Hai Thế Hệ", "🤝", runState.lastChoiceReplyText, true);
      return;
    }
    setDialogue("Thỏ Con", "Cầu Nối Quầy Gỗ", "🐰", sc.bridgePrompt, false);
    sc.choices.forEach((ch) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "w-full text-left p-3 rounded-2xl bg-stone-900/95 hover:bg-amber-500/15 border border-stone-700 hover:border-amber-400/45 text-xs sm:text-sm text-stone-100 transition-all cursor-pointer";
      btn.textContent = ch.label;
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        recordStance(ch.stance);
        runState.bond += 1;
        runState.lastChoiceReplyText = ch.reply;
        saveRunState();
        syncGameHUD();
        renderCurrentBeat();
      });
      actionArea.appendChild(btn);
    });
  } else if (beat === 3) {
    if (!runState.lastDrinkName) {
      setDialogue(`${g1.name.split(" (")[0]} & ${g2.name.split(" (")[0]}`, "Gợi Ý Hương Vị Chung", "🍹", sc.clue, false);
      renderThreeStepBrewingStation(guests);
    } else if (sub === 0) {
      setDialogue(
        `${g1.name.split(" (")[0]} & ${g2.name.split(" (")[0]}`,
        "Thưởng Thức Cùng Nhau",
        "🥂",
        `[${runState.lastDrinkName} — ${runState.lastBrewQuality}]\n\n${sc.synergyReflection}`,
        true
      );
    } else {
      setDialogue("Thỏ Con", "Chủ Quán Nửa Đêm", "🐰", dExtra.duoDrinkBanter, true);
    }
  } else if (beat === 4) {
    if (!persistentArchive.discoveredEasterEggs.egg_deep_night) {
      persistentArchive.discoveredEasterEggs.egg_deep_night = true;
      saveArchive();
      checkAndUnlockAchievements();
    }
    renderDrinkCardBeat(guests);
  } else if (beat === 5) {
    if (runState.lastChoiceReplyText) {
      if (sub === 0) {
        setDialogue(`${g1.name.split(" (")[0]} & ${g2.name.split(" (")[0]}`, "Lời Hẹn Trước Bình Minh", "🌅", runState.lastChoiceReplyText, true);
      } else if (sub === 1) {
        setDialogue("Thỏ Con", "Chủ Quán Nửa Đêm", "🐰", dExtra.duoPreDawnHost, true);
      } else {
        setDialogue(`${g1.name.split(" (")[0]} & ${g2.name.split(" (")[0]}`, "Đồng Điệu Tâm Hồn", "🤝", dExtra.duoPreDawnGuests, true);
      }
      return;
    }
    setDialogue("Thỏ Con", "Chủ Quán Nửa Đêm", "🐰", sc.finalPrompt, false);
    sc.finalChoices.forEach((fc) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "w-full text-left p-3 rounded-2xl bg-stone-900/95 hover:bg-amber-500/15 border border-stone-700 hover:border-amber-400/45 text-xs sm:text-sm text-stone-100 transition-all cursor-pointer";
      btn.textContent = fc.label;
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        recordStance(fc.stance);
        runState.bond += 1;
        runState.lastChoiceReplyText = fc.reply;
        runState.subBeat = 0;
        saveRunState();
        syncGameHUD();
        renderCurrentBeat();
      });
      actionArea.appendChild(btn);
    });
  } else if (beat === 6) {
    if (sub === 0) {
      setDialogue(
        "Bình Minh Hẻm Nhỏ",
        "05:00 • Kết Thúc Ca Đêm",
        "🌅",
        `Cơn mưa đêm vừa tạnh hẳn. ${g1.name.split(" (")[0]} và ${g2.name.split(" (")[0]} cùng bước ra đầu hẻm dưới tia nắng sớm đầu tiên — một sợi dây kết nối mới vừa được dệt nên từ tiệm nước của Thỏ Con.`,
        true
      );
    } else {
      setDialogue("Thỏ Con", "Chủ Quán Nửa Đêm", "🐰", dExtra.duoFarewellHost, true);
    }
  }
}
