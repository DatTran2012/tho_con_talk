"use strict";

/* -----------------------------------------------------------------------
   SECTION 6: SCREEN NAVIGATION, TYPEWRITER, HUD & CUTSCENE PLAYER
------------------------------------------------------------------------ */
function switchScreen(screenId) {
  cancelActiveBrewAnimation();
  ["screen-loading", "screen-welcome", "screen-rules", "screen-game"].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.classList.toggle("hidden", id !== screenId);
  });
  if (screenId === "screen-welcome") {
    const btnContinue = document.getElementById("btn-welcome-continue");
    if (btnContinue) {
      btnContinue.classList.toggle("hidden", !(runState && runState.nightIndex < 28));
    }
    const btnRestart = document.getElementById("btn-welcome-restart");
    if (btnRestart) btnRestart.classList.toggle("hidden", !(runState && runState.nightIndex < 28));
  }
  if (screenId === "screen-rules") {
    renderRulesScreenControls();
  }
  if (screenId === "screen-game") {
    stageRenderer.resize();
    requestAnimationFrame(() => stageRenderer.resize());
  }
}

function openModal(modalId) {
  const el = document.getElementById(modalId);
  if (el) el.classList.remove("hidden");
}

function closeModal(modalId) {
  // Đóng hộp thoại kể chuyện thì dừng giọng đọc của nó
  if (modalId === "modal-epilogue" || modalId === "modal-cutscene-player") CafeVoice.stop();
  const el = document.getElementById(modalId);
  if (el) el.classList.add("hidden");
}

let activeTypewriterTimer = null;
let currentFullDialogueText = "";
let isTypingDialogue = false;

function finishTypewriterImmediately() {
  if (activeTypewriterTimer) {
    clearInterval(activeTypewriterTimer);
    activeTypewriterTimer = null;
  }
  isTypingDialogue = false;
  const textEl = document.getElementById("dialogue-text");
  if (textEl && currentFullDialogueText) {
    textEl.textContent = currentFullDialogueText;
  }
}

/* ---- Tự động chuyển thoại: sau khi đọc xong (hoặc đủ thời gian đọc nếu tắt giọng) ---- */
let dialogueToken = 0;
let autoAdvanceTimer = null;
let currentVoiceItems = [];

function clearAutoAdvance() {
  if (autoAdvanceTimer) {
    clearTimeout(autoAdvanceTimer);
    autoAdvanceTimer = null;
  }
}

function estimateReadMs(text) {
  return 1400 + String(text || "").length * 55;
}

function isAnyModalOpen() {
  return Array.from(document.querySelectorAll(".fixed.inset-0")).some((m) => !m.classList.contains("hidden"));
}

/* onReady(fire): gọi fire() khi tới lúc chuyển. Có đồng hồ dự phòng phòng khi trình duyệt không báo "đọc xong". */
function scheduleAutoAdvance(token, text, spoke, action) {
  clearAutoAdvance();
  if (!persistentArchive.autoAdvance) return;
  const fire = () => {
    clearAutoAdvance();
    if (token !== dialogueToken || !persistentArchive.autoAdvance) return;
    action();
  };
  const readMs = estimateReadMs(text);
  if (spoke) {
    // chờ giọng đọc xong rồi nghỉ một nhịp; đồng hồ dự phòng nếu không có sự kiện kết thúc
    autoAdvanceTimer = setTimeout(fire, readMs * 2.5 + 4000);
    return (done) => done && setTimeout(fire, 900);
  }
  autoAdvanceTimer = setTimeout(fire, readMs + 600);
  return null;
}

function tryAutoAdvanceDialogue() {
  if (!runState || isAnyModalOpen()) return;
  const screen = document.getElementById("screen-game");
  if (!screen || screen.classList.contains("hidden")) return;
  if (isTypingDialogue) {
    finishTypewriterImmediately();
  }
  advanceDialogueStep(); // tự bỏ qua nếu đang có lựa chọn/nút bấm
}

function setDialogue(speakerName, speakerRole, avatar, text, canAdvance = true, opts = {}) {
  if (activeTypewriterTimer) {
    clearInterval(activeTypewriterTimer);
    activeTypewriterTimer = null;
  }
  const token = ++dialogueToken;
  // Tách lời nhân vật (đọc thành tiếng) khỏi phần dẫn chuyện ngôi thứ ba (chỉ hiện chữ nghiêng)
  let view;
  if (opts.plain) {
    // Phần trong ngoặc đơn (hành động, chú thích) tách riêng: chữ nhạt, không đọc thành tiếng
    const raw = String(text);
    const notes = [];
    const spoken = raw.replace(/\(([^)]*)\)/g, (m, inner) => { notes.push(inner.trim()); return " "; }).replace(/\s{2,}/g, " ").trim();
    const dir = [opts.dir || "", ...notes].filter(Boolean).join(" • ");
    if (opts.sys || opts.narr || !spoken) {
      view = { directions: opts.sys || opts.narr ? "" : dir, speech: [], mainText: opts.sys || opts.narr ? raw : dir, narrationOnly: true };
    } else {
      view = { directions: dir, speech: [{ speaker: speakerName, text: spoken }], mainText: spoken, firstSpeaker: null };
    }
  } else {
    view = parseDialogue(text, speakerName);
  }
  const shownText = view.mainText;
  currentFullDialogueText = shownText;
  stageRenderer.talkAnimTimer = 900;

  let nameShown = speakerName;
  let avatarShown = avatar;
  let roleShown = speakerRole;
  if (view.firstSpeaker && view.firstSpeaker !== speakerName) {
    const ch = Object.values(CHARACTERS).find((c) => c.name === view.firstSpeaker);
    nameShown = view.firstSpeaker;
    if (ch) {
      avatarShown = ch.avatar;
      roleShown = ch.role;
    } else if (view.firstSpeaker === "Thỏ Con") {
      avatarShown = "🐰";
      roleShown = "Chủ Quán Nửa Đêm";
    }
  }
  document.getElementById("speaker-name").textContent = nameShown;
  document.getElementById("speaker-role").textContent = opts.time ? `${roleShown} • 🕐 ${opts.time}` : roleShown;
  document.getElementById("speaker-avatar").textContent = avatarShown;

  const moodEl = document.getElementById("speaker-mood");
  if (moodEl) {
    const mood = detectMood(`${view.directions || ""} ${shownText}`);
    moodEl.textContent = mood;
    moodEl.classList.toggle("hidden", !mood);
    moodEl.classList.remove("mood-pop");
    void moodEl.offsetWidth;
    moodEl.classList.add("mood-pop");
  }
  const dirEl = document.getElementById("dialogue-direction");
  if (dirEl) {
    dirEl.textContent = view.directions || "";
    dirEl.classList.toggle("hidden", !view.directions);
  }
  const textEl = document.getElementById("dialogue-text");
  textEl.classList.toggle("italic", Boolean(view.narrationOnly));
  textEl.classList.toggle("text-stone-400", Boolean(view.narrationOnly));
  textEl.classList.toggle("text-stone-100", !view.narrationOnly);
  const hintEl = document.getElementById("advance-hint");
  if (hintEl) {
    hintEl.classList.toggle("hidden", !canAdvance);
    hintEl.textContent = persistentArchive.autoAdvance ? "Tự động ▸" : "Chạm để tiếp ▸";
  }

  // Giọng đọc: chỉ đọc lời thoại của nhân vật, mỗi người một giọng
  currentVoiceItems = view.speech.map((s) => ({ text: s.text, speaker: s.speaker }));
  const spokenText = view.speech.map((s) => s.text).join(" ");
  let onVoiceDone = null;
  const spoke = currentVoiceItems.length > 0 && CafeVoice.isOn();
  if (canAdvance) {
    const hook = scheduleAutoAdvance(token, shownText, spoke, tryAutoAdvanceDialogue);
    onVoiceDone = hook ? () => hook(true) : null;
  } else {
    clearAutoAdvance();
  }
  if (currentVoiceItems.length) CafeVoice.speakMany(currentVoiceItems, false, onVoiceDone);
  else CafeVoice.stop();

  const text_ = shownText;
  if (!text_ || text_.length <= 12) {
    textEl.textContent = text_;
    isTypingDialogue = false;
  } else {
    isTypingDialogue = true;
    textEl.textContent = "";
    let idx = 0;
    const stepSize = text_.length > 180 ? 3 : 2;
    activeTypewriterTimer = setInterval(() => {
      idx += stepSize;
      if (idx >= text_.length) {
        textEl.textContent = text_;
        clearInterval(activeTypewriterTimer);
        activeTypewriterTimer = null;
        isTypingDialogue = false;
      } else {
        textEl.textContent = text_.slice(0, idx);
      }
    }, 16);
  }

  recordNightLine({ type: "say", speaker: nameShown, avatar: avatarShown, text: `${view.directions ? `(${view.directions}) ` : ""}${shownText}` });
  if (runState) {
    const lastEntry = runState.dialogueLog[runState.dialogueLog.length - 1];
    if (!lastEntry || lastEntry.text !== text) {
      runState.dialogueLog.push({ speaker: speakerName, avatar, text });
      if (runState.dialogueLog.length > 90) runState.dialogueLog.shift();
    }
  }
}

/* Chương 1–4 = tuần 1–4 (Gặp Gỡ → Trở Lại → Hiện Tại → Tương Lai). Hiện trên HUD và trong Menu. */
function renderChapterInfo() {
  const chapterBadge = document.getElementById("hud-chapter-badge");
  const drawerInfo = document.getElementById("drawer-chapter-info");
  if (!runState) {
    if (drawerInfo) drawerInfo.classList.add("hidden");
    return;
  }
  const story = getStoryNight();
  const chap = STORY_CHAPTERS[story.ch - 1];
  const night = Math.min(28, runState.nightIndex + 1);
  if (chapterBadge) {
    chapterBadge.textContent = `${chap.icon} Chương ${story.ch}: ${chap.name}`;
    chapterBadge.title = chap.desc;
  }
  if (drawerInfo) {
    drawerInfo.textContent = `${chap.icon} Chương ${story.ch}/4 • ${chap.name} • Đêm ${night}/28 • 🍹 Ly tuần này ${Math.min(weekRecipeCount(), currentWeekGoal())}/${currentWeekGoal()}`;
    drawerInfo.classList.remove("hidden");
  }
}

/* Đồng hồ quán chạy theo giờ của từng cảnh thoại ("HH:MM") */
function setStoryClock(timeStr) {
  const m = /^(\d{1,2}):(\d{2})$/.exec(String(timeStr || ""));
  if (!m) return;
  stageRenderer.storyTime = { h: Number(m[1]) % 24, m: Number(m[2]) };
  const badge = document.getElementById("hud-week-badge");
  if (badge) badge.textContent = `🕐 ${String(m[1]).padStart(2, "0")}:${m[2]}`;
}

function syncGameHUD() {
  if (!runState) return;
  renderChapterInfo();
  const nightInWeek = (runState.nightIndex % 7) + 1;
  setStoryClock(runState.clock || (getStoryNight() || {}).t0);
  document.getElementById("hud-night-badge").textContent = `Đêm ${nightInWeek}/7`;

  const guests = getCurrentNightGuests();
  const modeBadge = document.getElementById("hud-mode-badge");
  modeBadge.textContent = guests.length > 1 ? `👥 ${guests.length} Vị Khách` : "👤 Đơn Khách";
  modeBadge.className = "hidden sm:inline-block px-2.5 py-1 rounded-xl bg-stone-900 border border-stone-700 text-stone-200 text-xs";
  const present = getStageVisibleGuests();
  document.getElementById("stage-guest-label").textContent = present.length
    ? present.map((g) => `${g.avatar} ${g.name.split(" (")[0]}`).join(" & ")
    : "🌙 Quầy vắng khách...";

  const activeSeason = stageRenderer.getActiveSeason();
  const weatherEl = document.getElementById("hud-weather-badge");
  if (weatherEl) {
    weatherEl.textContent = activeSeason.shortLabel;
  }

  document.getElementById("hud-trust-val").textContent = runState.trust;
  document.getElementById("hud-clarity-val").textContent = runState.clarity;
  document.getElementById("hud-bond-val").textContent = runState.bond;
}

let activeCutsceneCallback = null;
let activeCutscenePages = null; // { pages, idx, location }

function playCutscene(cutsceneId, onDone = null, nightMeta = null) {
  const cs = CUTSCENE_CATALOG.find((c) => c.id === cutsceneId);
  if (!cs) {
    if (onDone) onDone();
    return;
  }
  persistentArchive.unlockedCutscenes[cs.id] = true;
  saveArchive();
  updateAllProgressBadges();

  document.getElementById("cs-player-location").textContent = cs.location;
  const nightBannerEl = document.getElementById("cs-player-night-banner");
  if (nightBannerEl) {
    if (nightMeta && nightMeta.mainTitle) {
      nightBannerEl.classList.remove("hidden");
      document.getElementById("cs-player-night-main").textContent = nightMeta.mainTitle;
      document.getElementById("cs-player-night-sub").textContent = nightMeta.subTitle || "";
    } else {
      nightBannerEl.classList.add("hidden");
    }
  }
  document.getElementById("cs-player-title").textContent = cs.title;
  if (Array.isArray(cs.pages) && cs.pages.length > 0) {
    activeCutscenePages = { pages: cs.pages, idx: 0, location: cs.location };
    renderCutscenePage();
  } else {
    activeCutscenePages = null;
    document.getElementById("cs-player-icon").textContent = cs.icon;
    document.getElementById("cs-player-caption").textContent = cs.caption;
    CafeVoice.speak(cs.caption, "");
    document.getElementById("btn-cs-player-continue").textContent = "Tiếp Tục ▸";
  }
  activeCutsceneCallback = onDone;
  audioEngine.playChime(440, 0.4, 0.04);
  openModal("modal-cutscene-player");
}

function renderCutscenePage() {
  const st = activeCutscenePages;
  if (!st) return;
  const page = st.pages[st.idx];
  const isLast = st.idx >= st.pages.length - 1;
  document.getElementById("cs-player-location").textContent = `${st.location} • ${st.idx + 1}/${st.pages.length}`;
  document.getElementById("cs-player-icon").textContent = page.icon;
  document.getElementById("cs-player-caption").textContent = page.text;
  const csToken = ++dialogueToken;
  const csFire = () => {
    clearAutoAdvance();
    if (csToken !== dialogueToken || !persistentArchive.autoAdvance || !activeCutscenePages) return;
    const m = document.getElementById("modal-cutscene-player");
    if (m && !m.classList.contains("hidden")) document.getElementById("btn-cs-player-continue").click();
  };
  clearAutoAdvance();
  const csSpoke = CafeVoice.isOn();
  if (persistentArchive.autoAdvance) autoAdvanceTimer = setTimeout(csFire, estimateReadMs(page.text) * (csSpoke ? 2.5 : 1) + 2500);
  CafeVoice.speak(page.text, "", false, csSpoke && persistentArchive.autoAdvance ? () => setTimeout(csFire, 1200) : null);
  document.getElementById("btn-cs-player-continue").textContent = isLast ? "Tiếp Tục ▸" : "Tiếp ▸";
}

function playOriginSequence(onComplete) {
  playCutscene("origin_thocon_1", () => {
    playCutscene("origin_thocon_2", () => {
      playCutscene("origin_thocon_3", () => {
        if (onComplete) onComplete();
      });
    });
  });
}
