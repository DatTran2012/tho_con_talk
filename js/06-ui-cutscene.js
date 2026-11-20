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

function setDialogue(speakerName, speakerRole, avatar, text, canAdvance = true) {
  if (activeTypewriterTimer) {
    clearInterval(activeTypewriterTimer);
    activeTypewriterTimer = null;
  }
  currentFullDialogueText = text;
  stageRenderer.talkAnimTimer = 900;

  document.getElementById("speaker-name").textContent = speakerName;
  document.getElementById("speaker-role").textContent = speakerRole;
  document.getElementById("speaker-avatar").textContent = avatar;

  const textEl = document.getElementById("dialogue-text");
  const hintEl = document.getElementById("advance-hint");
  if (hintEl) hintEl.classList.toggle("hidden", !canAdvance);

  if (!text || text.length <= 12) {
    textEl.textContent = text;
    isTypingDialogue = false;
  } else {
    isTypingDialogue = true;
    textEl.textContent = "";
    let idx = 0;
    const stepSize = text.length > 180 ? 3 : 2;
    activeTypewriterTimer = setInterval(() => {
      idx += stepSize;
      if (idx >= text.length) {
        textEl.textContent = text;
        clearInterval(activeTypewriterTimer);
        activeTypewriterTimer = null;
        isTypingDialogue = false;
      } else {
        textEl.textContent = text.slice(0, idx);
      }
    }, 16);
  }

  if (runState) {
    const lastEntry = runState.dialogueLog[runState.dialogueLog.length - 1];
    if (!lastEntry || lastEntry.text !== text) {
      runState.dialogueLog.push({ speaker: speakerName, avatar, text });
      if (runState.dialogueLog.length > 90) runState.dialogueLog.shift();
    }
  }
}

function syncGameHUD() {
  if (!runState) return;
  const weekNum = Math.min(4, Math.floor(runState.nightIndex / 7) + 1);
  const nightInWeek = (runState.nightIndex % 7) + 1;
  document.getElementById("hud-week-badge").textContent = `Tuần ${weekNum}/4`;
  document.getElementById("hud-night-badge").textContent = `Đêm ${nightInWeek}/7`;

  const slot = getCurrentNightSlot();
  const guests = getCurrentNightGuests();
  const modeBadge = document.getElementById("hud-mode-badge");
  if (slot.type === "duo") {
    modeBadge.textContent = "👥 Song Khách Giao Thoa";
    modeBadge.className = "px-2.5 py-1 rounded-xl bg-amber-500/20 border border-amber-400/40 text-amber-200 font-semibold text-xs";
    const visibleGuests = getStageVisibleGuests();
    if (visibleGuests.length === 1) {
      document.getElementById("stage-guest-label").textContent = `${guests[0].avatar} ${guests[0].name} (Đang chờ...)`;
    } else {
      document.getElementById("stage-guest-label").textContent = `${guests[0].avatar} ${guests[0].name.split(" (")[0]} & ${guests[1].avatar} ${guests[1].name.split(" (")[0]}`;
    }
  } else {
    const isCh2 = Boolean(persistentArchive.unlockedKeepsakes[guests[0].id]);
    modeBadge.textContent = isCh2 ? "📖 Chương 2: Quay Lại" : "👤 Đơn Khách";
    modeBadge.className = "px-2.5 py-1 rounded-xl bg-stone-900 border border-stone-700 text-stone-200 text-xs";
    document.getElementById("stage-guest-label").textContent = `${guests[0].avatar} ${guests[0].name}`;
  }

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
