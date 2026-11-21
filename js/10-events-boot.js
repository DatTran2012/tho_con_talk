"use strict";

/* -----------------------------------------------------------------------
   SECTION 10: SECRET NIGHT 8, ACHIEVEMENTS, GALLERIES & EVENT WIRING
------------------------------------------------------------------------ */
function isNight8Unlocked() {
  return (
    Object.keys(persistentArchive.unlockedKeepsakes).length >= 3 ||
    countUnlockedEndings() >= 5
  );
}

function startSecretNight8Reunion() {
  if (!isNight8Unlocked()) {
    showToast("🔒 Cánh cửa này vẫn chưa mở… hãy cứ trò chuyện cùng khách thêm nữa.");
    return;
  }
  cancelActiveBrewAnimation();
  closeModal("mobile-drawer");
  switchScreen("screen-game");
  playCutscene("sunrise_rooftop", () => {
    setDialogue(
      "7 Vị Khách & Thỏ Con",
      "Đêm Hội Ngộ Bình Minh",
      "🌅",
      "04:55 sáng. Cơn mưa suốt tháng vừa tạnh hẳn. Vy, Minh, chị Linh, anh Tuấn, anh Khang, cô Hoa và bác An cùng hội ngộ tại tiệm nước nhỏ cuối hẻm — mỗi người mang theo một câu chuyện mới ấm áp và lòng biết ơn dành cho người chủ quán đã lắng nghe họ suốt những đêm mưa.",
      false
    );
    const actionArea = document.getElementById("dialogue-action-area");
    actionArea.innerHTML = "";
    const btn = document.createElement("button");
    btn.type = "button";
    btn.id = "btn-reunion-done";
    btn.className = "w-full min-h-[46px] py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-stone-950 font-bold text-xs sm:text-sm cursor-pointer";
    btn.textContent = "🐰 Tiếp Tục Ca Trực Hiện Tại ▸";
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      if (!persistentArchive.unlockedAchievements.ach_night_8) {
        persistentArchive.unlockedAchievements.ach_night_8 = true;
        saveArchive();
        updateAllProgressBadges();
        showToast("🏆 Mở khóa danh hiệu: Trái Tim Tiệm Nước!");
        checkAndUnlockAchievements();
      }
      if (!runState) {
        switchScreen("screen-welcome");
        return;
      }
      resumeRun();
    });
    actionArea.appendChild(btn);
  });
}

/* ---- CÁNH CỬA THỨ HAI: TWIST & KẾT CỤC BÍ MẬT ---- */
function isTwistUnlocked() {
  const a = persistentArchive;
  return (
    SHIFT_MODES.every((m) => a.completedModes[m.id]) &&
    SECRET_VAULT.every((s) => a.unlockedSecrets && a.unlockedSecrets[s.id]) &&
    countUnlockedEndings(a) >= TOTAL_ENDINGS
  );
}

function playCutsceneChain(ids, done) {
  if (!ids.length) {
    if (done) done();
    return;
  }
  playCutscene(ids[0], () => playCutsceneChain(ids.slice(1), done));
}

const TWIST_BEATS = [
  { speaker: "Bình Minh Hẻm Nhỏ", role: "05:05 • Cánh Cửa Thứ Hai", avatar: "🌅", text: "Không ai rời quán. Vy, Minh, chị Linh, anh Tuấn, anh Khang, cô Hoa và bác An kéo ghế ngồi quanh quầy gỗ. Tối nay không ai gọi nước. Tối nay, họ đến để nghe." },
  { speaker: "Vy (22 tuổi)", role: "Phóng Viên Trẻ", avatar: "🎓", text: "Em tắt máy ghi âm rồi. Bao nhiêu đêm Thỏ Con nghe em kể, giờ đến lượt em ngồi nghe. Thỏ Con muốn bắt đầu từ đâu cũng được ạ." },
  { speaker: "Thỏ Con", role: "Người Gác Đèn", avatar: "🐰", text: "Tờ giấy trên quầy là thật. Bạn sẽ mở lời thế nào?", options: [
    { label: "❤️ \"Thỏ Con đã sợ lắm. Có đêm, Thỏ Con đã nghĩ biến mất đi thì mọi người sẽ nhẹ nhõm hơn.\"",
      replies: [{ speaker: "Cô Hoa (44 tuổi)", role: "Người Mẹ", avatar: "🧶", text: "Cảm ơn cháu đã dám nói ra. Nỗi sợ đó không làm cháu yếu đuối, và cháu chưa bao giờ là gánh nặng của ai." }] },
    { label: "✨ \"Thỏ Con muốn kể từ đầu: từ cuộc gọi chẩn đoán, đến những buổi sáng ở bệnh viện.\"",
      replies: [{ speaker: "Bác An (68 tuổi)", role: "Cựu Giáo Viên", avatar: "👓", text: "Bác nghe từng chữ. Gọi tên được nỗi đau là một nửa của việc đi qua nó đấy cháu." }] },
    { label: "🤫 Lặng lẽ đặt tờ giấy hẹn khám lên quầy, chưa nói được lời nào.",
      replies: [{ speaker: "Anh Khang (38 tuổi)", role: "Nghệ Nhân Đồ Da", avatar: "🧵", text: "Không cần nói gì cả. Anh ngồi đây được rồi." }] }
  ] },
  { speaker: "Minh (27 tuổi)", role: "Kỹ Sư AI", avatar: "💻", text: "Tôi chỉ biết debug code, nhưng có một điều tôi học được: khi hệ thống quá tải, việc đầu tiên là báo cho người khác biết, đừng im lặng chịu đựng một mình." },
  { speaker: "Chị Linh (31 tuổi)", role: "Biên Tập Viên", avatar: "🖋️", text: "Chị vừa viết thêm một chương vào cuốn sổ bìa đỏ. Nhân vật chính của chương đó ở lại." },
  { speaker: "Anh Tuấn (35 tuổi)", role: "Tài Xế & Thợ Cơ Khí", avatar: "🚚", text: "Xe hỏng thì mình sửa, người mệt thì mình chở nhau. Sáng mai anh chở em tới viện, đừng đi một mình nữa nhé." },
  { speaker: "Anh Khang (38 tuổi)", role: "Nghệ Nhân Đồ Da", avatar: "🧵", text: "Thẻ da anh khâu cho em dùng để đánh dấu trang đang đọc dở. Em chưa đọc xong đâu. Còn nhiều trang phía trước." },
  { speaker: "Cô Hoa (44 tuổi)", role: "Người Mẹ", avatar: "🧶", text: "Cô đan thêm cho cháu một chiếc mũ len. Những buổi sáng ở viện sẽ lạnh, nhưng cháu không đi một mình." },
  { speaker: "Bác An (68 tuổi)", role: "Cựu Giáo Viên", avatar: "👓", text: "Bác chấm bài cả đời. Bài của cháu hôm nay bác cho mười điểm, vì cháu dám nói ra." },
  { speaker: "Thỏ Con", role: "Lá Bài Thứ 17", avatar: "🃏", text: "Vy lật lá bài trắng cuối hộp DRINK: \"Điều bạn cần nghe nhất lúc này là gì?\"", options: [
    { label: "❤️ \"Rằng Thỏ Con không phải một mình.\"",
      replies: [{ speaker: "Bảy Vị Khách", role: "Cùng Nhau", avatar: "🤝", text: "Không một mình. Không bao giờ nữa." }] },
    { label: "✨ \"Rằng ở lại điều trị là một lựa chọn xứng đáng, và Thỏ Con xứng đáng được chăm sóc.\"",
      replies: [{ speaker: "Bảy Vị Khách", role: "Cùng Nhau", avatar: "🤝", text: "Xứng đáng. Và bọn mình sẽ cùng đi với bạn." }] },
    { label: "🤫 \"Chỉ cần ai đó nắm tay Thỏ Con một lúc thôi.\"",
      replies: [{ speaker: "Bảy Vị Khách", role: "Cùng Nhau", avatar: "🤝", text: "Bảy bàn tay đặt lên bàn tay Thỏ Con. Và họ ở lại đó đến khi trời sáng hẳn." }] }
  ] }
];

function runTwistScene(onDone) {
  twistStageMode = "all";
  const queue = [...TWIST_BEATS];
  let idx = 0;
  const area = document.getElementById("dialogue-action-area");
  const makeBtn = (label, cls, onClick) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = cls;
    btn.textContent = label;
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      onClick();
    });
    area.appendChild(btn);
  };
  const step = () => {
    area.innerHTML = "";
    if (idx >= queue.length) {
      onDone();
      return;
    }
    const b = queue[idx];
    setDialogue(b.speaker, b.role, b.avatar, b.text, false);
    document.getElementById("stage-guest-label").textContent = "🐰 Thỏ Con & 7 vị khách";
    if (b.options) {
      b.options.forEach((o) =>
        makeBtn(
          o.label,
          "w-full text-left p-3 rounded-2xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-400/35 text-xs sm:text-sm text-stone-100 transition-all cursor-pointer",
          () => {
            queue.splice(idx + 1, 0, ...o.replies);
            idx++;
            step();
          }
        )
      );
    } else {
      makeBtn(
        "Tiếp ▸",
        "w-full min-h-[44px] py-2.5 rounded-2xl bg-stone-900/95 hover:bg-amber-500/15 border border-stone-700 text-xs sm:text-sm text-amber-200 cursor-pointer",
        () => {
          idx++;
          step();
        }
      );
    }
  };
  step();
}

function showThanksPage() {
  const a = persistentArchive;
  const stats = [
    ["🎭 Kết cục", `${countUnlockedEndings(a)}/${TOTAL_ENDINGS}`],
    ["🗝️ Bí mật", `${Object.keys(a.unlockedSecrets || {}).length}/${SECRET_VAULT.length}`],
    ["🍹 Ly nước đã pha", `${a.totalDrinksServed || 0}`],
    ["🌟 Ly hoàn hảo", `${a.perfectBrewsCount || 0}`],
    ["🎴 Lá bài DRINK", `${Object.keys(a.unlockedDrinkCards).length}/${DRINK_CARDS.length}`],
    ["🏅 Thành tựu", `${Object.keys(a.unlockedAchievements).length}`]
  ];
  document.getElementById("thanks-stats").innerHTML = stats
    .map(([k, v]) => `<div class="p-2 rounded-xl bg-stone-950/80 border border-stone-800"><div class="text-[11px] text-stone-400">${k}</div><div class="font-mono-code text-amber-300 text-sm">${v}</div></div>`)
    .join("");
  a.thanksSeen = true;
  saveArchive();
  openModal("modal-thanks");
  audioEngine.playChime(523, 0.5, 0.05);
}

function finishTwistEnding() {
  twistStageMode = null;
  persistentArchive.twistEndingSeen = true;
  if (!persistentArchive.unlockedAchievements.ach_twist) {
    persistentArchive.unlockedAchievements.ach_twist = true;
    showToast("🏆 Mở khóa danh hiệu: Chiến Binh Ánh Đèn!");
  }
  saveArchive();
  updateAllProgressBadges();
  document.getElementById("dialogue-action-area").innerHTML = "";
  switchScreen("screen-welcome");
  if ((computeGameProgress().percent >= 100 && !persistentArchive.thanksSeen) || (typeof isDevMode === "function" && isDevMode())) setTimeout(showThanksPage, 600);
}

function startTwistEnding() {
  if (!isTwistUnlocked()) {
    showToast("🔒 Cánh cửa này vẫn chưa mở…");
    return;
  }
  cancelActiveBrewAnimation();
  closeModal("mobile-drawer");
  switchScreen("screen-game");
  twistStageMode = "alone";
  document.getElementById("dialogue-action-area").innerHTML = "";
  setDialogue("Thỏ Con", "Chủ Quán Nửa Đêm", "🐰", "Quầy gỗ vắng lặng. Ngọn đèn vàng vẫn sáng, như mọi đêm.", false);
  playCutsceneChain(["twist_01", "twist_02", "twist_03", "twist_04"], () =>
    runTwistScene(() => playCutsceneChain(["twist_05", "twist_06", "twist_07"], finishTwistEnding))
  );
}

function isSecretUnlocked(id) {
  return Boolean(persistentArchive.unlockedSecrets && persistentArchive.unlockedSecrets[id]);
}

function getSecretProgress(id) {
  const a = persistentArchive;
  switch (id) {
    case "secret_message":
      return [getDiscoveredEggs(a).length, EASTER_EGGS.length];
    case "secret_card_17":
      return [DRINK_CARDS.filter((c) => a.unlockedDrinkCards[c.id]).length, DRINK_CARDS.length];
    case "secret_signature":
      return [SIGNATURE_RECIPES.filter((s) => a.unlockedSignatures[s.id]).length, SIGNATURE_RECIPES.length];
    case "secret_keepsakes":
      return [STANDARD_GUEST_ORDER.filter((g) => a.unlockedKeepsakes[g]).length, STANDARD_GUEST_ORDER.length];
    case "secret_endings":
      return [Math.min(TOTAL_ENDINGS, countUnlockedEndings(a)), TOTAL_ENDINGS];
    case "secret_cat":
      return [Math.min(20, a.petCatCount || 0), 20];
    case "secret_clock":
      return [Math.min(7, a.clockTapCount || 0), 7];
    case "secret_seasons":
      return [SEASON_THEMES.filter((s) => a.visitedSeasons[s.id]).length, SEASON_THEMES.length];
    case "secret_perfect":
      return [Math.min(8, a.perfectBrewsCount || 0), 8];
    case "secret_master": {
      const others = SECRET_VAULT.filter((s) => s.id !== "secret_master" && a.unlockedSecrets[s.id]).length;
      return [others + (a.unlockedAchievements.ach_night_8 ? 1 : 0), SECRET_VAULT.length];
    }
    default:
      return [0, 1];
  }
}

function checkSecrets() {
  const a = persistentArchive;
  if (!a.unlockedSecrets) a.unlockedSecrets = {};
  let changed = false;
  SECRET_VAULT.forEach((s) => {
    if (a.unlockedSecrets[s.id]) return;
    const [cur, max] = getSecretProgress(s.id);
    if (cur >= max) {
      a.unlockedSecrets[s.id] = true;
      a.unlockedCutscenes[s.id] = true;
      changed = true;
      showToast(`🗝️ Bí mật mới: ${s.title}! Mở Kho Bí Mật trong Menu để xem.`);
      audioEngine.playChime(783.99, 0.5, 0.05);
    }
  });
  if (changed) {
    saveArchive();
    updateAllProgressBadges();
  }
  return changed;
}

function checkAndUnlockAchievements() {
  checkSecrets();
  if (isTwistUnlocked() && !persistentArchive.twistAnnounced) {
    persistentArchive.twistAnnounced = true;
    saveArchive();
    showToast("🕊️ Một cánh cửa mới vừa hiện ra trong Menu…");
  }
  const a = persistentArchive;
  const secretsCount = Object.keys(a.unlockedSecrets).length;
  const endingsCount = countUnlockedEndings(a);
  const keepsakesCount = Object.keys(a.unlockedKeepsakes).length;
  const cardsCount = Object.keys(a.unlockedDrinkCards).length;
  const sigCount = Object.keys(a.unlockedSignatures).length;
  const eggsCount = Object.keys(a.discoveredEasterEggs).length;
  const uniqueDuoPairsUnlocked = ALL_DUO_KEYS.filter(
    (dk) => a.unlockedEndings[`duo_${dk}_heart`] || a.unlockedEndings[`duo_${dk}_mind`]
  ).length;

  const conditions = {
    ach_first_drink: a.totalDrinksServed >= 1,
    ach_duo_first: uniqueDuoPairsUnlocked >= 1,
    ach_duo_all: uniqueDuoPairsUnlocked >= ALL_DUO_KEYS.length,
    ach_signature_1: sigCount >= 1,
    ach_signature_all: sigCount >= 6,
    ach_keepsake_1: keepsakesCount >= 1,
    ach_keepsake_all: keepsakesCount >= 7,
    ach_endings_7: endingsCount >= 7,
    ach_endings_18: endingsCount >= 18,
    ach_endings_27: endingsCount >= TOTAL_ENDINGS,
    ach_cards_8: cardsCount >= 8,
    ach_cards_16: cardsCount >= 16,
    ach_pet_cat: a.petCatCount >= 5,
    ach_peace_all: eggsCount >= 5,
    ach_perfect_brew: a.perfectBrewsCount >= 3,
    ach_secret_5: secretsCount >= 5,
    ach_secret_all: secretsCount >= SECRET_VAULT.length
  };

  let newlyUnlocked = false;
  Object.entries(conditions).forEach(([achId, passed]) => {
    if (passed && !a.unlockedAchievements[achId]) {
      a.unlockedAchievements[achId] = true;
      newlyUnlocked = true;
      const meta = ACHIEVEMENTS.find((x) => x.id === achId);
      if (meta) showToast(`🏆 Mở khóa thành tựu: ${meta.title}!`);
    }
  });

  if (newlyUnlocked) {
    saveArchive();
    updateAllProgressBadges();
  }
}

function getActiveHostTitle() {
  const unlockedList = ACHIEVEMENTS.filter((a) => persistentArchive.unlockedAchievements[a.id]);
  if (persistentArchive.selectedTitleId !== "auto") {
    const chosen = unlockedList.find((a) => a.id === persistentArchive.selectedTitleId);
    if (chosen) return `🏅 ${chosen.titleReward}`;
  }
  if (unlockedList.length > 0) {
    return `🏅 ${unlockedList[unlockedList.length - 1].titleReward}`;
  }
  return "🐰 Chủ Quán Tập Sự";
}

/* Lưu thủ công (game vẫn tự lưu sau mỗi bước). Bấm nút 💾 trên thanh trên cùng. */
function manualSave() {
  saveArchive();
  if (runState) saveRunState();
  const d = new Date();
  const hhmm = `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
  const where = runState ? `Đêm ${Math.min(28, runState.nightIndex + 1)}/28` : "sổ lưu trữ";
  showToast(`💾 Đã lưu (${where}) lúc ${hhmm}. Lần sau bấm «Tiếp Tục» để chơi tiếp.`);
  const btn = document.getElementById("btn-quick-save");
  if (btn) {
    btn.innerHTML = '✅<span class="hidden sm:inline"> Đã lưu</span>';
    setTimeout(() => (btn.innerHTML = '💾<span class="hidden sm:inline"> Lưu</span>'), 1500);
  }
}

/* Bỏ ca đang lưu và mở ca mới từ Đêm 1 (sổ lưu trữ vẫn giữ). */
const RESTART_CONFIRM_TEXT =
  "Bắt đầu lại từ Ca 1 như một game mới?\n\nToàn bộ kết cục, bí mật, thành tựu, cutscene, công thức và tiến độ sẽ bị XÓA. (Chỉ giữ cài đặt âm thanh & giọng đọc.) Không thể hoàn tác.";

/* Xóa sạch tiến trình như game mới, chỉ giữ cài đặt người dùng (âm thanh, giọng đọc, tự đổi mùa) */
function wipeProgressKeepSettings() {
  cancelActiveBrewAnimation();
  const old = persistentArchive;
  const fresh = createDefaultArchive();
  ["voiceEnabled", "voiceV2", "autoAdvance", "voiceRate", "voiceFemale", "voiceMale", "rainVolume", "selectedLofiChannel", "autoCycleSeasons", "autoCycleCafe", "autoCycleV2"].forEach((k) => {
    if (old[k] !== undefined) fresh[k] = old[k];
  });
  persistentArchive = fresh;
  clearNightHistory();
  safeRemoveItem(STORAGE_KEY_RUN);
  runState = null;
  saveArchive();
  try { audioEngine.applySeasonSoundscape(); } catch (err) { /* bỏ qua */ }
  updateAllProgressBadges();
}

function restartRunFromSave() {
  if (!window.confirm(RESTART_CONFIRM_TEXT)) return;
  closeModal("mobile-drawer");
  wipeProgressKeepSettings();
  switchScreen("screen-rules");
  renderRulesScreenControls();
  showToast("🌙 Đã bắt đầu lại từ Ca 1 như game mới.");
}

function hasSavedRun() {
  return Boolean(runState && runState.nightIndex < 28);
}

function renderSaveControls() {
  const btnContinue = document.getElementById("btn-rules-continue");
  const btnStart = document.getElementById("btn-start-shuffle-week");
  if (!btnContinue || !btnStart) return;
  const saved = hasSavedRun();
  btnContinue.classList.toggle("hidden", !saved);
  if (saved) {
    const mode = SHIFT_MODES.find((m) => m.id === runState.shiftMode);
    btnContinue.textContent = `▶ Tiếp Tục Save Cũ — Đêm ${runState.nightIndex + 1}/28${mode ? ` • ${mode.name}` : ""}`;
  }
  btnStart.textContent = saved ? "🔄 Bắt Đầu Lại Ca Trực Mới ▸" : "🌙 Mở Cửa Quán — Bắt Đầu Tuần 1 ▸";
}

function resetAllProgress() {
  if (!window.confirm("Xóa TOÀN BỘ dữ liệu (kết cục, bí mật, thành tựu, cutscene đã mở và ca trực đang chơi)?")) return;
  if (!window.confirm("Hành động này không thể hoàn tác. Bạn chắc chắn muốn bắt đầu lại từ đầu chứ?")) return;
  cancelActiveBrewAnimation();
  safeRemoveItem(STORAGE_KEY_RUN);
  safeRemoveItem(STORAGE_KEY_ARCHIVE);
  clearNightHistory();
  runState = null;
  persistentArchive = createDefaultArchive();
  saveArchive();
  audioEngine.applySeasonSoundscape();
  updateAllProgressBadges();
  renderRulesScreenControls();
  showToast("🧹 Đã xóa dữ liệu. Quán trở lại như ngày đầu mở cửa.");
}

function renderRulesScreenControls() {
  renderSaveControls();
  document.getElementById("active-title-badge").textContent = getActiveHostTitle();
  document.getElementById("rules-endings-stat").textContent = `${countUnlockedEndings()}/${TOTAL_ENDINGS}`;
  document.getElementById("rules-keepsakes-stat").textContent = `${Object.keys(persistentArchive.unlockedKeepsakes).length}/7`;
  document.getElementById("rules-cards-stat").textContent = `${Object.keys(persistentArchive.unlockedDrinkCards).length}/16`;
  document.getElementById("rules-sig-stat").textContent = `${Object.keys(persistentArchive.unlockedSignatures).length}/${SIGNATURE_RECIPES.length}`;

  const sel = document.getElementById("title-selector");
  sel.innerHTML = `<option value="auto">Tự động chọn danh hiệu cao nhất</option>`;
  ACHIEVEMENTS.forEach((a) => {
    if (persistentArchive.unlockedAchievements[a.id]) {
      const opt = document.createElement("option");
      opt.value = a.id;
      opt.textContent = `🏅 ${a.titleReward} (${a.title})`;
      if (persistentArchive.selectedTitleId === a.id) opt.selected = true;
      sel.appendChild(opt);
    }
  });

  const modeBox = document.getElementById("shift-mode-selector");
  modeBox.innerHTML = "";
  const reached = persistentArchive.completedModes && persistentArchive.completedModes.standard ? 4 : Math.max(1, Number(persistentArchive.maxChapter) || 1);
  STORY_CHAPTERS.forEach((c) => {
    const unlocked = c.no <= reached;
    const card = document.createElement("div");
    card.className = `p-3 rounded-2xl text-left border ${unlocked ? "bg-amber-500/10 border-amber-400/50 text-amber-100" : "bg-stone-950/60 border-stone-800/80 text-stone-500 opacity-80"}`;
    const nights = STORY_NIGHTS.filter((n) => n.ch === c.no);
    const detail = unlocked
      ? `<p class="text-[11px] text-stone-300 mt-1 leading-relaxed">${escapeHtml(c.desc)}</p>
         <ul class="mt-1.5 space-y-0.5 text-[10.5px] text-stone-400">${nights
           .map((n) => `<li>${n.n}. ${escapeHtml(n.title)} <span class="text-stone-500">• ${n.guests.length > 3 ? "cả quán" : n.guests.map((g) => CHARACTERS[g].name.split(" (")[0]).join(" & ")}</span></li>`)
           .join("")}</ul>`
      : `<p class="text-[11px] text-stone-500 mt-1 leading-relaxed">Hoàn thành Chương ${c.no - 1} để mở khóa.</p>`;
    card.innerHTML = `
      <div class="flex items-center justify-between font-bold text-xs">
        <span>${c.icon} Chương ${c.no}: ${unlocked ? escapeHtml(c.name) : "???"}</span>
        <span class="text-[10px] font-mono-code ${unlocked ? "text-emerald-300" : "text-stone-500"}">${unlocked ? (c.no === reached && !persistentArchive.completedModes.standard ? "Đang chơi" : "Đã mở") : "🔒 Khóa"}</span>
      </div>${detail}`;
    modeBox.appendChild(card);
  });
}

/* ---- Tiến độ hoàn thành game (0–100%) ---- */
const PROGRESS_WEIGHTS = [
  { id: "endings", label: "🎭 Kết cục", weight: 30 },
  { id: "chapters", label: "🌙 Tháng Mưa hoàn thành", weight: 15 },
  { id: "secrets", label: "🗝️ Kho bí mật", weight: 15 },
  { id: "cards", label: "🎴 Lá bài DRINK", weight: 8 },
  { id: "keepsakes", label: "🏺 Kỷ vật", weight: 8 },
  { id: "achievements", label: "🏅 Thành tựu", weight: 8 },
  { id: "signatures", label: "🍹 Công thức độc quyền", weight: 6 },
  { id: "eggs", label: "🥚 Bí mật quán", weight: 6 },
  { id: "twist", label: "🕊️ Cánh Cửa Thứ Hai", weight: 4 }
];

function computeGameProgress(a = persistentArchive) {
  const counts = {
    endings: [Math.min(TOTAL_ENDINGS, countUnlockedEndings(a)), TOTAL_ENDINGS],
    chapters: [SHIFT_MODES.filter((m) => a.completedModes[m.id]).length, SHIFT_MODES.length],
    secrets: [SECRET_VAULT.filter((s) => isSecretUnlocked(s.id)).length, SECRET_VAULT.length],
    cards: [Object.keys(a.unlockedDrinkCards).length, DRINK_CARDS.length],
    keepsakes: [STANDARD_GUEST_ORDER.filter((g) => a.unlockedKeepsakes[g]).length, STANDARD_GUEST_ORDER.length],
    achievements: [
      ACHIEVEMENTS.filter((x) => x.id !== "ach_twist" && a.unlockedAchievements[x.id]).length,
      ACHIEVEMENTS.filter((x) => x.id !== "ach_twist").length
    ],
    signatures: [Object.keys(a.unlockedSignatures).length, SIGNATURE_RECIPES.length],
    eggs: [getDiscoveredEggs(a).length, EASTER_EGGS.length],
    twist: [a.twistEndingSeen ? 1 : 0, 1]
  };
  let total = 0;
  const rows = PROGRESS_WEIGHTS.map((w) => {
    const [cur, max] = counts[w.id];
    const ratio = max > 0 ? Math.min(1, cur / max) : 0;
    total += w.weight * ratio;
    return { ...w, cur: Math.min(cur, max), max, ratio };
  });
  return { percent: Math.min(100, Math.floor(total + 1e-9)), rows };
}

function renderGameProgress() {
  const { percent, rows } = computeGameProgress();
  document.querySelectorAll("[data-progress-percent]").forEach((el) => (el.textContent = `${percent}%`));
  document.querySelectorAll("[data-progress-bar]").forEach((el) => (el.style.width = `${percent}%`));
  const menuBtn = document.getElementById("btn-open-drawer");
  if (menuBtn) menuBtn.innerHTML = `☰<span class="hidden sm:inline"> Menu •</span> ${percent}%`;
  const list = document.getElementById("progress-breakdown");
  if (list) {
    list.innerHTML = rows
      .map(
        (r) => `
        <div class="space-y-0.5">
          <div class="flex justify-between text-[11px]"><span class="text-stone-300">${r.label}</span><span class="font-mono-code ${r.ratio >= 1 ? "text-emerald-300" : "text-amber-300"}">${r.cur}/${r.max}${r.ratio >= 1 ? " ✓" : ""}</span></div>
          <div class="h-1.5 rounded-full bg-stone-950 overflow-hidden"><div class="h-full ${r.ratio >= 1 ? "bg-emerald-400" : "bg-amber-400"}" style="width:${Math.round(r.ratio * 100)}%"></div></div>
        </div>`
      )
      .join("");
  }
  const thanksBtn = document.getElementById("btn-open-thanks");
  if (thanksBtn) thanksBtn.classList.toggle("hidden", percent < 100);
  const note = document.getElementById("progress-note");
  if (note) {
    note.textContent =
      percent >= 100 ? "🌟 Bạn đã hoàn thành trọn vẹn Tiệm Nước Nửa Đêm!" : "Hoàn thành mọi mục để đạt 100% và mở cánh cửa cuối cùng.";
  }
}

/* ---- Giọng đọc: giao diện trong Menu ---- */
function renderAutoControls() {
  const auto = Boolean(persistentArchive.autoAdvance);
  const q = document.getElementById("btn-quick-auto");
  if (q) {
    q.innerHTML = auto ? '⏩<span class="hidden sm:inline"> Tự động</span>' : "⏩";
    q.className = auto
      ? "min-h-[34px] min-w-[34px] px-2 sm:px-2.5 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/50 text-xs text-emerald-200 cursor-pointer"
      : "min-h-[34px] min-w-[34px] px-2 sm:px-2.5 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-700 text-xs text-stone-300 cursor-pointer";
  }
  const m = document.getElementById("btn-toggle-auto");
  if (m) {
    m.textContent = auto ? "Bật" : "Tắt";
    m.className = auto
      ? "px-2.5 py-1 rounded-xl bg-emerald-500/20 border border-emerald-400/50 text-[11px] text-emerald-200 cursor-pointer"
      : "px-2.5 py-1 rounded-xl bg-stone-950 border border-stone-700 text-[11px] text-stone-300 cursor-pointer";
  }
  const hint = document.getElementById("advance-hint");
  if (hint) hint.textContent = auto ? "Tự động ▸" : "Chạm để tiếp ▸";
}

function toggleAutoAdvance() {
  persistentArchive.autoAdvance = !persistentArchive.autoAdvance;
  saveArchive();
  if (!persistentArchive.autoAdvance) clearAutoAdvance();
  renderAutoControls();
  showToast(persistentArchive.autoAdvance ? "⏩ Tự động chuyển thoại: BẬT" : "⏸️ Tự động chuyển thoại: TẮT");
}

function renderVoiceControls() {
  renderAutoControls();
  const btn = document.getElementById("btn-toggle-voice");
  if (!btn) return;
  const on = Boolean(persistentArchive.voiceEnabled) && CafeVoice.supported;
  const replay = document.getElementById("btn-voice-replay");
  if (replay) replay.classList.toggle("hidden", !on);
  const quick = document.getElementById("btn-quick-voice");
  if (quick) {
    quick.innerHTML = on ? '🗣️<span class="hidden sm:inline"> Bật</span>' : "🗣️";
    quick.className = on
      ? "min-h-[34px] min-w-[34px] px-2 sm:px-2.5 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/50 text-xs text-emerald-200 cursor-pointer"
      : "min-h-[34px] min-w-[34px] px-2 sm:px-2.5 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-700 text-xs text-stone-300 cursor-pointer";
  }
  btn.textContent = on ? "Bật" : "Tắt";
  btn.className = on
    ? "px-2.5 py-1 rounded-xl bg-emerald-500/20 border border-emerald-400/50 text-[11px] text-emerald-200 cursor-pointer"
    : "px-2.5 py-1 rounded-xl bg-stone-950 border border-stone-700 text-[11px] text-stone-300 cursor-pointer";
  const rate = Number(persistentArchive.voiceRate) || 0.95;
  document.getElementById("voice-rate-slider").value = Math.round(rate * 100);
  document.getElementById("voice-rate-label").textContent = `${rate.toFixed(2)}x`;
  document.getElementById("voice-controls").classList.toggle("opacity-50", !CafeVoice.supported);
  const viVoices = CafeVoice.supported ? CafeVoice.vietnameseVoices() : [];
  const row = document.getElementById("voice-select-row");
  row.classList.toggle("hidden", viVoices.length < 2);
  [["voice-select-female", "f", persistentArchive.voiceFemale], ["voice-select-male", "m", persistentArchive.voiceMale]].forEach(([id, gender, chosen]) => {
    const current = (viVoices.find((v) => v.name === chosen) || CafeVoice.pickVoice(gender) || {}).name;
    document.getElementById(id).innerHTML = viVoices
      .map((v) => `<option value="${v.name}" ${v.name === current ? "selected" : ""}>${v.name}</option>`)
      .join("");
  });
  const note = document.getElementById("voice-note");
  if (!CafeVoice.supported) note.textContent = "Trình duyệt này chưa hỗ trợ giọng đọc.";
  else if (!viVoices.length) note.textContent = "Chưa tìm thấy giọng tiếng Việt trên thiết bị; sẽ dùng giọng mặc định.";
  else if (on) note.textContent = "Đang BẬT: đọc toàn bộ lời thoại, cutscene, hồi tưởng và tổng kết. Mỗi nhân vật có cao độ giọng riêng.";
  else note.textContent = "Đang TẮT: game hoàn toàn im lặng, không đọc bất kỳ nội dung nào.";
}

function bindVoiceControls() {
  const toggleVoice = () => {
    if (!CafeVoice.supported) {
      showToast("🗣️ Trình duyệt này chưa hỗ trợ giọng đọc.");
      return;
    }
    persistentArchive.voiceEnabled = !persistentArchive.voiceEnabled;
    saveArchive();
    if (persistentArchive.voiceEnabled) {
      CafeVoice.speak("Giọng đọc đã được bật.", "Thỏ Con", true);
    } else {
      CafeVoice.stop();
    }
    renderVoiceControls();
    showToast(persistentArchive.voiceEnabled ? "🗣️ Đã bật giọng đọc" : "🔇 Đã tắt giọng đọc");
  };
  document.getElementById("btn-toggle-voice").addEventListener("click", toggleVoice);
  document.getElementById("btn-quick-voice").addEventListener("click", toggleVoice);
  document.getElementById("btn-quick-auto").addEventListener("click", toggleAutoAdvance);
  document.getElementById("btn-toggle-auto").addEventListener("click", toggleAutoAdvance);
  document.getElementById("voice-rate-slider").addEventListener("input", (e) => {
    persistentArchive.voiceRate = Number(e.target.value) / 100;
    document.getElementById("voice-rate-label").textContent = `${persistentArchive.voiceRate.toFixed(2)}x`;
  });
  document.getElementById("voice-rate-slider").addEventListener("change", saveArchive);
  const voiceDemo = [
    { speaker: "Vy", text: "Chào chị, em là Vy, sinh viên báo chí mới ra trường." },
    { speaker: "Anh Tuấn", text: "Cho anh ly nước nóng nhé, đêm nay đường mưa lắm." },
    { speaker: "Cô Hoa", text: "Cô đan xong chiếc khăn này rồi, tặng con đây." },
    { speaker: "Bác An", text: "Ngày xưa bác dạy văn, giờ bác chỉ thích ngồi nghe mưa rơi." },
    { speaker: "Thỏ Con", text: "Mời bạn một ly nước nóng, rồi kể mình nghe chuyện đêm nay nhé." }
  ];
  [["voice-select-female", "voiceFemale", "f"], ["voice-select-male", "voiceMale", "m"]].forEach(([id, key, gender]) => {
    document.getElementById(id).addEventListener("change", (e) => {
      persistentArchive[key] = e.target.value;
      saveArchive();
      CafeVoice.speak(gender === "m" ? "Xin chào, tôi là giọng nam. Mời bạn một ly nước." : "Xin chào, mình là giọng nữ. Mời bạn một ly nước.", gender === "m" ? "Anh Tuấn" : "Vy", true);
    });
  });
  document.getElementById("btn-voice-test").addEventListener("click", () => CafeVoice.speakMany(voiceDemo, true));
}

function updateAllProgressBadges() {
  renderGameProgress();
  renderVoiceControls();
  const hb = document.getElementById("mobile-history-badge");
  if (hb) hb.textContent = String(nightHistory.length);
  renderChapterInfo();
  const a = persistentArchive;
  document.getElementById("mobile-cutscene-badge").textContent = `${Object.keys(a.unlockedCutscenes).length}/${CUTSCENE_CATALOG.length}`;
  document.getElementById("mobile-album-badge").textContent = `${Object.keys(a.unlockedSignatures).length}/${SIGNATURE_RECIPES.length}`;
  document.getElementById("mobile-drink-deck-badge").textContent = `${Object.keys(a.unlockedDrinkCards).length}/16`;
  document.getElementById("mobile-keepsakes-badge").textContent = `${Object.keys(a.unlockedKeepsakes).length}/7`;
  document.getElementById("mobile-endings-badge").textContent = `${countUnlockedEndings(a)}/${TOTAL_ENDINGS}`;

  let unlockedLoreTiers = 0;
  CHARACTER_DOSSIERS.forEach((d) => {
    if (d.id === "thocon") {
      unlockedLoreTiers += 1;
      if (countUnlockedEndings(a) >= 5) unlockedLoreTiers += 1;
      if (countUnlockedEndings(a) >= 15) unlockedLoreTiers += 1;
    } else {
      const hasEnd = ["heart", "mind", "silent"].some((b) => a.unlockedEndings[`${d.id}_${b}`]);
      if (hasEnd) unlockedLoreTiers += 1;
      if (a.unlockedKeepsakes[d.id]) unlockedLoreTiers += 1;
      if (a.postcards[d.id]) unlockedLoreTiers += 1;
    }
  });
  document.getElementById("mobile-dossiers-badge").textContent = `${unlockedLoreTiers}/24`;
  document.getElementById("mobile-notes-badge").textContent = `${a.stickyNotes.length}`;
  document.getElementById("mobile-cat-diary-badge").textContent = `${Object.keys(a.unlockedCatDiary).length}/7`;
  document.getElementById("mobile-cassette-badge").textContent = `${Object.keys(a.unlockedCassettes).length}/7`;
  document.getElementById("mobile-postcard-badge").textContent = `${Object.keys(a.postcards).length}/7`;
  document.getElementById("mobile-ach-badge").textContent = `${Object.keys(a.unlockedAchievements).length}/${ACHIEVEMENTS.length}`;
  {
    const eggFound = getDiscoveredEggs(a).length;
    document.getElementById("mobile-easter-badge").textContent = eggFound > 0 ? `${eggFound}` : "?";
  }
  document.getElementById("mobile-night8-badge").textContent = isNight8Unlocked() ? "✨ Mở" : "🔒";
  const secretsBadge = document.getElementById("mobile-secrets-badge");
  const secretsFound = Object.keys(a.unlockedSecrets || {}).length;
  if (secretsBadge) secretsBadge.textContent = `${secretsFound}`;
  const secretsBtn = document.getElementById("btn-drawer-secrets");
  if (secretsBtn) secretsBtn.classList.toggle("hidden", secretsFound === 0);
  const twistBtn = document.getElementById("btn-twist-ending");
  if (twistBtn) twistBtn.classList.toggle("hidden", !isTwistUnlocked());
}

function openCutsceneGallery() {
  const grid = document.getElementById("cutscene-gallery-grid");
  grid.innerHTML = "";
  CUTSCENE_CATALOG.forEach((cs) => {
    const unlocked = Boolean(persistentArchive.unlockedCutscenes[cs.id]);
    const card = document.createElement("div");
    card.className = `p-3 rounded-2xl border ${
      unlocked
        ? "bg-stone-900/90 border-amber-400/35 hover:border-amber-400 cursor-pointer"
        : "bg-stone-950/80 border-stone-800 opacity-60"
    }`;
    card.innerHTML = `
      <div class="flex items-center justify-between text-xs font-bold ${unlocked ? "text-amber-200" : "text-stone-500"}">
        <span>${unlocked ? cs.icon : "🔒"} ${unlocked ? cs.title : "Cảnh Chưa Mở Khóa"}</span>
        <span class="text-[10px] font-mono-code">${unlocked ? "▶ Xem" : "Khóa"}</span>
      </div>
      <div class="text-[10px] font-mono-code text-stone-400 mt-1">${cs.location}</div>
    `;
    if (unlocked) {
      card.addEventListener("click", () => {
        closeModal("modal-cutscenes");
        playCutscene(cs.id);
      });
    }
    grid.appendChild(card);
  });
  openModal("modal-cutscenes");
}

function openDrinkAlbumModal() {
  document.getElementById("signature-menu-count").textContent = `${Object.keys(persistentArchive.unlockedSignatures).length}`;
  const sigGrid = document.getElementById("signature-recipes-grid");
  sigGrid.innerHTML = "";
  const foundSigs = SIGNATURE_RECIPES.filter((sig) => persistentArchive.unlockedSignatures[sig.id]);
  foundSigs.forEach((sig) => {
    const card = document.createElement("div");
    card.className = "p-3 rounded-2xl border bg-amber-500/15 border-amber-400/40";
    card.innerHTML = `
      <div class="font-bold text-xs text-amber-200">✨ ${sig.name}</div>
      <div class="text-[11px] text-amber-300/80 mt-1">Công thức: ${sig.hint}</div>
      <div class="text-[11px] text-stone-400 mt-1">${sig.desc}</div>
    `;
    sigGrid.appendChild(card);
  });
  SIGNATURE_RECIPES.filter((sig) => !persistentArchive.unlockedSignatures[sig.id]).forEach((sig) => {
    const base = DRINK_BASES.find((b) => b.id === sig.base);
    const first = DRINK_ACCENTS.find((a) => a.id === sig.accents[0]);
    const second = DRINK_ACCENTS.find((a) => a.id === sig.accents[1]);
    const em = EMOTION_TAGS[second.emotion];
    const card = document.createElement("div");
    card.className = "p-3 rounded-2xl border bg-stone-950/80 border-stone-800";
    card.innerHTML = `
      <div class="font-bold text-xs text-stone-400">🔒 Công thức chưa lộ diện</div>
      <div class="text-[11px] text-stone-300 mt-1">💡 Gợi ý: ${base.icon} ${base.name} + ${first.icon} ${first.name} + một hương vị mang sắc thái ${em.icon} ${em.label}. Chọn đúng 2 hương vị ở bước 2.</div>
    `;
    sigGrid.appendChild(card);
  });

  const albumGrid = document.getElementById("drink-album-grid");
  albumGrid.innerHTML = "";
  if (persistentArchive.drinkAlbum.length === 0) {
    albumGrid.innerHTML = `<div class="text-xs text-stone-400">Chưa có ly nước nào được phục vụ trong sổ lưu trữ.</div>`;
  } else {
    persistentArchive.drinkAlbum.forEach((item) => {
      const el = document.createElement("div");
      el.className = "p-2.5 rounded-xl bg-stone-900/90 border border-stone-800 text-xs flex items-center justify-between gap-2";
      el.innerHTML = `
        <div>
          <div class="font-semibold text-stone-100">${escapeHtml(item.name)}</div>
          <div class="text-[10px] text-stone-400">Phục vụ: ${escapeHtml(item.guestName)}</div>
        </div>
        <span class="text-[11px] font-mono-code text-amber-300 shrink-0">${item.quality}</span>
      `;
      albumGrid.appendChild(el);
    });
  }
  openModal("modal-album");
}

function openDrinkDeckModal() {
  const grid = document.getElementById("drink-deck-grid");
  grid.innerHTML = "";
  DRINK_CARDS.forEach((c) => {
    const unlocked = Boolean(persistentArchive.unlockedDrinkCards[c.id]);
    const el = document.createElement("div");
    el.className = `p-3 rounded-2xl border text-xs ${
      unlocked ? "bg-stone-900/90 border-amber-400/35 text-stone-100" : "bg-stone-950/80 border-stone-800 text-stone-500"
    }`;
    el.innerHTML = `
      <div class="font-mono-code text-[10px] text-amber-300">${c.suit}</div>
      <p class="mt-1 leading-relaxed">${unlocked ? `"${c.question}"` : "🔒 Lá bài chưa được rút trong các đêm trực."}</p>
    `;
    grid.appendChild(el);
  });
  openModal("modal-drink-deck");
}

function openKeepsakesModal() {
  const grid = document.getElementById("keepsakes-grid");
  grid.innerHTML = "";
  STANDARD_GUEST_ORDER.forEach((gid) => {
    const g = CHARACTERS[gid];
    const unlocked = Boolean(persistentArchive.unlockedKeepsakes[gid]);
    const el = document.createElement("div");
    el.className = `p-3.5 rounded-2xl border flex items-start gap-3 ${
      unlocked ? "bg-teal-500/10 border-teal-400/35" : "bg-stone-950/85 border-stone-800 opacity-65"
    }`;
    el.innerHTML = `
      <div class="text-2xl">${unlocked ? g.keepsake.icon : "🔒"}</div>
      <div class="space-y-1 text-xs">
        <div class="font-bold ${unlocked ? "text-teal-200" : "text-stone-400"}">${unlocked ? g.keepsake.name : `Kỷ vật từ ${g.name.split(" (")[0]}`}</div>
        <p class="text-stone-300">${unlocked ? g.keepsake.desc : "???"}</p>
      </div>
    `;
    grid.appendChild(el);
  });
  openModal("modal-keepsakes");
}

function makeEndingReplayBtn(eid) {
  const b = document.createElement("button");
  b.type = "button";
  b.className = "mt-1.5 px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/40 text-amber-200 text-[11px] font-semibold cursor-pointer";
  b.textContent = "▶ Xem cutscene kết cục";
  b.addEventListener("click", () => {
    closeModal("modal-endings-gallery");
    playCutscene(eid, () => openEndingsGalleryModal());
  });
  return b;
}

function openEndingsGalleryModal() {
  const grid = document.getElementById("endings-gallery-grid");
  grid.innerHTML = "";

  const duoHeader = document.createElement("div");
  duoHeader.className = "font-bold text-xs text-amber-300";
  duoHeader.textContent = "👥 12 Kết Cục Giao Thoa Song Khách (6 Cặp × 2 Ngã Rẽ)";
  grid.appendChild(duoHeader);

  Object.values(DUO_PAIRINGS).forEach((duo) => {
    const g1 = CHARACTERS[duo.guests[0]].name.split(" (")[0];
    const g2 = CHARACTERS[duo.guests[1]].name.split(" (")[0];
    const box = document.createElement("div");
    box.className = "p-3 rounded-2xl bg-stone-900/90 border border-stone-800 space-y-2 text-xs";
    box.innerHTML = `<div class="font-bold text-amber-200">${g1} &amp; ${g2}</div>`;

    ["heart", "mind"].forEach((branch) => {
      const eid = `duo_${duo.id}_${branch}`;
      const unlocked = Boolean(persistentArchive.unlockedEndings[eid]);
      const ed = duo.endings[branch];
      const row = document.createElement("div");
      row.className = `p-2 rounded-xl border ${unlocked ? "bg-emerald-500/10 border-emerald-400/35" : "bg-stone-950 border-stone-800 text-stone-500"}`;
      row.innerHTML = `
        <div class="font-semibold ${unlocked ? "text-emerald-200" : ""}">
          ${branch === "heart" ? "🤝 Giao Thoa Trái Tim:" : "🚀 Liên Minh Sáng Tạo:"} ${unlocked ? ed.title : "🔒 Chưa mở khóa"}
        </div>
        ${unlocked ? `<p class="text-[11px] text-stone-300 mt-1">${ed.summary}</p>` : ""}
      `;
      if (unlocked) row.appendChild(makeEndingReplayBtn(eid));
      box.appendChild(row);
    });
    grid.appendChild(box);
  });

  const soloHeader = document.createElement("div");
  soloHeader.className = "font-bold text-xs text-emerald-300 pt-2";
  soloHeader.textContent = "👤 21 Kết Cục Cá Nhân (7 Vị Khách × 3 Nhánh Đối Thoại)";
  grid.appendChild(soloHeader);

  STANDARD_GUEST_ORDER.forEach((gid) => {
    const g = CHARACTERS[gid];
    const box = document.createElement("div");
    box.className = "p-3 rounded-2xl bg-stone-900/90 border border-stone-800 space-y-2 text-xs";
    box.innerHTML = `<div class="font-bold text-stone-100">${g.avatar} ${g.name}</div>`;

    ["heart", "mind", "silent"].forEach((branch) => {
      const eid = `${gid}_${branch}`;
      const unlocked = Boolean(persistentArchive.unlockedEndings[eid]);
      const ed = SOLO_ENDINGS_DATA[gid][branch];
      const lbl = ENDING_PATH_LABELS[branch];
      const row = document.createElement("div");
      row.className = `p-2 rounded-xl border ${unlocked ? "bg-stone-950 border-amber-400/30" : "bg-stone-950/60 border-stone-800 text-stone-500"}`;
      row.innerHTML = `
        <div class="font-semibold ${unlocked ? "text-amber-200" : ""}">${lbl.icon} ${lbl.name}: ${unlocked ? ed.title : "🔒 Chưa mở khóa"}</div>
        ${unlocked ? `<p class="text-[11px] text-stone-300 mt-1">${ed.summary}</p>` : ""}
      `;
      if (unlocked) row.appendChild(makeEndingReplayBtn(eid));
      box.appendChild(row);
    });
    grid.appendChild(box);
  });

  openModal("modal-endings-gallery");
}

function openDossiersModal() {
  const grid = document.getElementById("dossiers-grid");
  grid.innerHTML = "";
  CHARACTER_DOSSIERS.forEach((d) => {
    let t1 = false;
    let t2 = false;
    let t3 = false;
    if (d.id === "thocon") {
      t1 = true;
      t2 = countUnlockedEndings() >= 5;
      t3 = countUnlockedEndings() >= 15;
    } else {
      t1 = ["heart", "mind", "silent"].some((b) => persistentArchive.unlockedEndings[`${d.id}_${b}`]);
      t2 = Boolean(persistentArchive.unlockedKeepsakes[d.id]);
      t3 = Boolean(persistentArchive.postcards[d.id]);
    }

    const card = document.createElement("div");
    card.className = "p-3.5 rounded-2xl bg-stone-900/90 border border-purple-500/25 space-y-2 text-xs";
    card.innerHTML = `
      <div class="font-bold text-sm text-purple-200">${d.avatar} ${d.name}</div>
      <div class="p-2 rounded-xl bg-stone-950 border border-stone-800">
        <span class="text-amber-300 font-semibold">Tầng 1 (Tiểu Sử):</span>
        <span class="text-stone-300">${t1 ? d.tier1 : "🔒 ???"}</span>
      </div>
      <div class="p-2 rounded-xl bg-stone-950 border border-stone-800">
        <span class="text-teal-300 font-semibold">Tầng 2 (Góc Khuất):</span>
        <span class="text-stone-300">${t2 ? d.tier2 : "🔒 ???"}</span>
      </div>
      <div class="p-2 rounded-xl bg-stone-950 border border-stone-800">
        <span class="text-emerald-300 font-semibold">Tầng 3 (Hậu Truyện 6 Tháng):</span>
        <span class="text-stone-300">${t3 ? d.tier3 : "🔒 ???"}</span>
      </div>
      ${d.id === "thocon" && persistentArchive.twistEndingSeen ? `<div class="p-2 rounded-xl bg-rose-500/10 border border-rose-400/35"><span class="text-rose-300 font-semibold">Tầng 4 (Điều Chưa Kể):</span> <span class="text-stone-200">${d.tier4}</span></div>` : ""}
    `;
    grid.appendChild(card);
  });
  openModal("modal-dossiers");
}

function openFlowchartModal() {
  const grid = document.getElementById("flowchart-grid");
  grid.innerHTML = "";
  STANDARD_GUEST_ORDER.forEach((gid) => {
    const g = CHARACTERS[gid];
    const hDone = Boolean(persistentArchive.unlockedEndings[`${gid}_heart`]);
    const mDone = Boolean(persistentArchive.unlockedEndings[`${gid}_mind`]);
    const sDone = Boolean(persistentArchive.unlockedEndings[`${gid}_silent`]);
    const kDone = Boolean(persistentArchive.unlockedKeepsakes[gid]);

    const card = document.createElement("div");
    card.className = "p-3 rounded-2xl bg-stone-900/90 border border-stone-800 space-y-2 text-xs";
    card.innerHTML = `
      <div class="flex items-center justify-between">
        <span class="font-bold text-stone-100">${g.avatar} ${g.name}</span>
        <span class="text-[11px] font-mono-code ${kDone ? "text-teal-300" : "text-stone-500"}">${kDone ? "🏺 Đã mở Chương 2" : "Chưa mở Chương 2"}</span>
      </div>
      <div class="grid grid-cols-3 gap-1.5 text-[11px]">
        <div class="p-2 rounded-xl border ${hDone ? "bg-rose-500/15 border-rose-400/40 text-rose-200" : "bg-stone-950 border-stone-800 text-stone-500"}">❤️ Trái Tim: ${hDone ? "Đã mở" : "Khóa"}</div>
        <div class="p-2 rounded-xl border ${mDone ? "bg-sky-500/15 border-sky-400/40 text-sky-200" : "bg-stone-950 border-stone-800 text-stone-500"}">✨ Lý Trí: ${mDone ? "Đã mở" : "Khóa"}</div>
        <div class="p-2 rounded-xl border ${sDone ? "bg-amber-500/15 border-amber-400/40 text-amber-200" : "bg-stone-950 border-stone-800 text-stone-500"}">🤫 Tĩnh Lặng: ${sDone ? "Đã mở" : "Khóa"}</div>
      </div>
    `;
    grid.appendChild(card);
  });
  openModal("modal-flowchart");
}

function openNotesModal() {
  const grid = document.getElementById("notes-wall-grid");
  grid.innerHTML = "";
  if (persistentArchive.stickyNotes.length === 0) {
    grid.innerHTML = `<div class="text-xs text-stone-400">Tường giấy note vẫn đang chờ những lời nhắn đầu tiên từ khách...</div>`;
  } else {
    persistentArchive.stickyNotes.forEach((n) => {
      const el = document.createElement("div");
      el.className = "p-3 rounded-2xl bg-amber-200/10 border border-amber-300/30 text-xs space-y-1";
      el.innerHTML = `
        <div class="flex justify-between font-mono-code text-[10px] text-amber-300">
          <span>${escapeHtml(n.guestName)}</span>
          <span>${escapeHtml(n.nightLabel)}</span>
        </div>
        <p class="font-serif-story italic text-stone-200">"${escapeHtml(n.text)}"</p>
      `;
      grid.appendChild(el);
    });
  }
  openModal("modal-notes");
}

function openCatDiaryModal() {
  const grid = document.getElementById("cat-diary-grid");
  grid.innerHTML = "";
  STANDARD_GUEST_ORDER.forEach((gid) => {
    const g = CHARACTERS[gid];
    const unlocked = Boolean(persistentArchive.unlockedCatDiary[gid]);
    const el = document.createElement("div");
    el.className = `p-3 rounded-2xl border text-xs ${
      unlocked ? "bg-stone-900/90 border-amber-400/30" : "bg-stone-950/80 border-stone-800 opacity-60"
    }`;
    el.innerHTML = `
      <div class="font-bold text-amber-200">🐾 Ghi chép về ${g.name.split(" (")[0]}</div>
      <p class="font-serif-story italic text-stone-300 mt-1">${unlocked ? `"${g.catDiary}"` : "🔒 Mèo tam thể chưa gặp vị khách này."}</p>
    `;
    grid.appendChild(el);
  });
  openModal("modal-cat-diary");
}

function openPostcardsModal() {
  const grid = document.getElementById("postcards-grid");
  grid.innerHTML = "";
  STANDARD_GUEST_ORDER.forEach((gid) => {
    const g = CHARACTERS[gid];
    const unlocked = Boolean(persistentArchive.postcards[gid]);
    const el = document.createElement("div");
    el.className = `p-3.5 rounded-2xl border text-xs ${
      unlocked ? "bg-amber-500/10 border-amber-400/35" : "bg-stone-950/80 border-stone-800 opacity-60"
    }`;
    el.innerHTML = `
      <div class="font-bold text-amber-200">📮 ${unlocked ? g.postcard.title : `Bưu thiếp từ ${g.name.split(" (")[0]}`}</div>
      <p class="font-serif-story italic text-stone-200 mt-1">${unlocked ? `"${g.postcard.text}"` : "🔒 Chưa nhận được bưu thiếp bình minh."}</p>
    `;
    grid.appendChild(el);
  });
  openModal("modal-postcards");
}

function openAchievementsModal() {
  const grid = document.getElementById("achievements-grid");
  grid.innerHTML = "";
  ACHIEVEMENTS.forEach((ach) => {
    const unlocked = Boolean(persistentArchive.unlockedAchievements[ach.id]);
    const el = document.createElement("div");
    el.className = `p-3 rounded-2xl border text-xs flex items-center justify-between gap-2 ${
      unlocked ? "bg-amber-500/15 border-amber-400/40" : "bg-stone-950/80 border-stone-800 opacity-65"
    }`;
    el.innerHTML = `
      <div>
        <div class="font-bold ${unlocked ? "text-amber-200" : "text-stone-400"}">${unlocked ? "🏆" : "🔒"} ${unlocked ? ach.title : "Thành Tựu Ẩn"}</div>
        <div class="text-stone-300 mt-0.5">${unlocked ? ach.desc : "Cứ thong thả pha nước và trò chuyện — điều bất ngờ sẽ tự tìm đến."}</div>
      </div>
      <span class="px-2.5 py-1 rounded-xl bg-stone-900 border border-stone-700 font-mono-code text-[10px] text-amber-300 shrink-0">
        ${unlocked ? ach.titleReward : "???"}
      </span>
    `;
    grid.appendChild(el);
  });
  openModal("modal-achievements");
}

function openSecretsModal() {
  const grid = document.getElementById("secrets-grid");
  grid.innerHTML = "";
  const unlockedCount = Object.keys(persistentArchive.unlockedSecrets || {}).length;
  document.getElementById("secrets-count").textContent = `${unlockedCount}`;

  SECRET_VAULT.forEach((s) => {
    if (!isSecretUnlocked(s.id)) {
      const [cur, max] = getSecretProgress(s.id);
      const lockedCard = document.createElement("div");
      lockedCard.className = "p-3.5 rounded-2xl border text-xs space-y-1 bg-stone-950/80 border-stone-800";
      lockedCard.innerHTML = `
        <div class="font-bold text-sm text-stone-400">🔒 Bí mật chưa mở</div>
        <p class="text-stone-300">💡 ${s.hint}</p>
        ${s.hiddenProgress ? "" : `<div class="text-[11px] font-mono-code text-amber-300">Tiến độ: ${cur}/${max}</div>`}
      `;
      grid.appendChild(lockedCard);
      return;
    }
    const card = document.createElement("div");
    card.className = "p-3.5 rounded-2xl border text-xs space-y-2 bg-fuchsia-500/10 border-fuchsia-400/40";
    card.innerHTML = `
      <div class="font-bold text-sm text-fuchsia-200">${s.icon} ${s.title}</div>
      <p class="font-serif-story italic text-stone-200 leading-relaxed">${s.story}</p>
      <div class="text-[11px] text-emerald-300">🎁 ${s.reward}</div>
    `;
    const playBtn = document.createElement("button");
    playBtn.type = "button";
    playBtn.className = "px-3 py-1.5 rounded-xl bg-fuchsia-500/20 hover:bg-fuchsia-500/30 border border-fuchsia-400/45 text-fuchsia-100 text-[11px] font-semibold cursor-pointer";
    playBtn.textContent = "▶ Xem Lại Cảnh Bí Mật";
    playBtn.addEventListener("click", () => {
      closeModal("modal-secrets");
      playCutscene(s.id, () => openSecretsModal());
    });
    card.appendChild(playBtn);
    grid.appendChild(card);
  });
  const doneModes = SHIFT_MODES.filter((m) => persistentArchive.completedModes[m.id]).length;
  const door = document.createElement("div");
  door.className = "p-3.5 rounded-2xl border text-xs space-y-1 bg-rose-500/10 border-rose-400/35";
  door.innerHTML = isTwistUnlocked()
    ? `<div class="font-bold text-rose-200">🕊️ Cánh cửa cuối cùng đã mở</div><p class="text-stone-300">Hãy mở Menu và chọn «🕊️ Cánh Cửa Thứ Hai».</p>`
    : `<div class="font-bold text-rose-200">🕊️ Còn một cánh cửa cuối cùng…</div>
       <p class="text-stone-300">Nó chỉ mở khi bạn đã đi trọn bốn chương của Tháng Mưa (Gặp Gỡ → Trở Lại → Hiện Tại → Tương Lai), mở đủ 33 kết cục và mở hết mọi bí mật ở trên.</p>
       <div class="text-[11px] font-mono-code text-amber-300">Tháng Mưa đã hoàn thành: ${doneModes}/1 • Kết cục: ${Math.min(TOTAL_ENDINGS, countUnlockedEndings())}/${TOTAL_ENDINGS} • Bí mật: ${unlockedCount}/${SECRET_VAULT.length}</div>`;
  grid.appendChild(door);
  openModal("modal-secrets");
}

function openEasterEggsModal() {
  const msgBox = document.getElementById("egg-message-box");
  if (msgBox) {
    const foundCount = getDiscoveredEggs().length;
    const parts = getDiscoveredEggs().map((e) => EGG_FRAGMENTS[e.id]);
    if (foundCount < EASTER_EGGS.length) parts.push("…");
    const done = foundCount >= EASTER_EGGS.length;
    msgBox.classList.toggle("hidden", foundCount === 0);
    msgBox.innerHTML = `
      <div class="text-[11px] font-mono-code text-amber-300 mb-1">💌 MỘT THÔNG ĐIỆP ĐANG DẦN HIỆN RA…</div>
      <p class="font-serif-story italic ${done ? "text-amber-100 text-sm" : "text-stone-400"}">“${parts.join(" ")}”</p>
    `;
  }
  const grid = document.getElementById("easter-eggs-grid");
  grid.innerHTML = "";
  // Bí mật chưa tìm thấy được giữ kín: không lộ tên, gợi ý hay cách mở khóa.
  EASTER_EGGS.forEach((egg) => {
    const unlocked = Boolean(persistentArchive.discoveredEasterEggs[egg.id]);
    const el = document.createElement("div");
    el.className = unlocked
      ? "p-3 rounded-2xl border text-xs bg-emerald-500/15 border-emerald-400/40"
      : "p-3 rounded-2xl border text-xs bg-stone-950/80 border-stone-800";
    el.innerHTML = unlocked
      ? `<div class="font-bold text-emerald-200">${egg.icon} ${egg.name}</div>
         <div class="text-stone-400 mt-1">✅ Đã khám phá! Mảnh ghép: “${EGG_FRAGMENTS[egg.id]}”</div>`
      : `<div class="font-bold text-stone-500">❓ ???</div>
         <div class="text-stone-600 mt-1">Một bí mật vẫn đang ngủ yên trong quán…</div>`;
    grid.appendChild(el);
  });
  const hiddenLeft = EASTER_EGGS.length - getDiscoveredEggs().length;
  if (hiddenLeft > 0) {
    const nudge = document.createElement("p");
    nudge.className = "text-[11px] text-stone-500 italic sm:col-span-2";
    nudge.textContent = `Còn ${hiddenLeft} bí mật chưa lộ diện. Hãy tự khám phá quán nhỏ này…`;
    grid.appendChild(nudge);
  }
  openModal("modal-easter-eggs");
}

function openAmbienceModal() {
  syncSoundStatusUI();
  document.getElementById("rain-volume-slider").value = Math.round((persistentArchive.rainVolume || 0.45) * 100);

  const chBox = document.getElementById("lofi-channels-list");
  chBox.innerHTML = "";
  LOFI_CHANNELS.forEach((ch) => {
    if (ch.requires && !isSecretUnlocked(ch.requires)) return;
    const chLocked = Boolean(ch.requires) && !isSecretUnlocked(ch.requires);
    const isSel = persistentArchive.selectedLofiChannel === ch.id && !chLocked;
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = `p-2.5 rounded-xl border text-left cursor-pointer ${
      isSel ? "bg-amber-500/20 border-amber-400 text-amber-100" : "bg-stone-950 border-stone-800 text-stone-300"
    } ${chLocked ? "opacity-50" : ""}`;
    btn.textContent = chLocked ? "🔒 Kênh Nhạc Bí Mật" : ch.name;
    btn.addEventListener("click", () => {
      if (chLocked) {
        showToast("🔒 Kênh nhạc bí mật — mở khóa trong Kho Bí Mật để nghe!");
        return;
      }
      persistentArchive.selectedLofiChannel = ch.id;
      saveArchive();
      audioEngine.startLofiLoop();
      openAmbienceModal();
    });
    chBox.appendChild(btn);
  });

  const visitedCount = Object.keys(persistentArchive.visitedSeasons || {}).length;
  const visitedBadge = document.getElementById("seasons-visited-badge");
  if (visitedBadge) visitedBadge.textContent = `${Math.min(4, visitedCount)}/4`;

  const autoBtn = document.getElementById("btn-toggle-auto-season");
  if (autoBtn) {
    autoBtn.textContent = persistentArchive.autoCycleSeasons
      ? "🔄 Tự Đổi Mùa Mỗi Đêm: Bật"
      : "🔄 Tự Đổi Mùa Mỗi Đêm: Tắt";
    autoBtn.className = persistentArchive.autoCycleSeasons
      ? "px-2.5 py-1 rounded-xl bg-emerald-500/20 border border-emerald-400/50 text-[11px] text-emerald-200 cursor-pointer"
      : "px-2.5 py-1 rounded-xl bg-stone-950 border border-stone-700 text-[11px] text-stone-300 cursor-pointer";
  }

  const cafeBtn = document.getElementById("btn-toggle-auto-cafe");
  if (cafeBtn) {
    cafeBtn.textContent = persistentArchive.autoCycleCafe
      ? "🪑 Tự Đổi Không Gian Quán Mỗi Đêm: Bật"
      : "🪑 Tự Đổi Không Gian Quán Mỗi Đêm: Tắt";
    cafeBtn.className = persistentArchive.autoCycleCafe
      ? "px-2.5 py-1 rounded-xl bg-emerald-500/20 border border-emerald-400/50 text-[11px] text-emerald-200 cursor-pointer"
      : "px-2.5 py-1 rounded-xl bg-stone-950 border border-stone-700 text-[11px] text-stone-300 cursor-pointer";
  }

  const seasonBox = document.getElementById("seasons-list");
  if (seasonBox) {
    seasonBox.innerHTML = "";
    SEASON_THEMES.forEach((s) => {
      const isSel = persistentArchive.selectedSeasonTheme === s.id;
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = `p-3 rounded-xl border text-left transition-all cursor-pointer ${
        isSel
          ? "bg-emerald-500/20 border-emerald-400 text-emerald-100"
          : "bg-stone-950 border-stone-800 text-stone-300 hover:border-stone-600"
      }`;
      btn.innerHTML = `
        <div class="flex items-center justify-between font-bold text-xs">
          <span>${s.name}</span>
          <span class="text-[10px] font-mono-code ${isSel ? "text-emerald-300" : "text-stone-400"}">${isSel ? "Đang áp dụng" : "Chọn mùa"}</span>
        </div>
        <div class="text-[10px] text-amber-300/85 mt-1">🔊 ${s.ambienceLabel}</div>
        <div class="text-[10px] text-stone-400 mt-0.5">${s.desc}</div>
      `;
      btn.addEventListener("click", () => {
        persistentArchive.selectedSeasonTheme = s.id;
        persistentArchive.visitedSeasons[s.id] = true;
        saveArchive();
        audioEngine.applySeasonSoundscape();
        checkAndUnlockAchievements();
        if (persistentArchive.selectedLofiChannel === "seasonal_auto") {
          audioEngine.startLofiLoop();
        }
        syncGameHUD();
        showToast(`${s.icon} Đã chuyển sang không gian ${s.name}`);
        openAmbienceModal();
      });
      seasonBox.appendChild(btn);
    });
  }

  const customBox = document.getElementById("cafe-customizer-section");
  if (customBox) {
    customBox.innerHTML = "";
    Object.entries(CAFE_CUSTOM_OPTIONS).forEach(([slotKey, group]) => {
      const row = document.createElement("div");
      row.className = "space-y-1.5";
      row.innerHTML = `<div class="text-[11px] font-semibold text-stone-300">${group.label}</div>`;
      const btnsWrap = document.createElement("div");
      btnsWrap.className = "grid grid-cols-2 sm:grid-cols-3 gap-1.5";
      group.choices.forEach((choice) => {
        if (choice.requires && !isSecretUnlocked(choice.requires)) return;
        const activeVal = (persistentArchive.cafeCustom && persistentArchive.cafeCustom[slotKey]) || group.choices[0].id;
        const isSel = activeVal === choice.id;
        const cBtn = document.createElement("button");
        cBtn.type = "button";
        cBtn.className = `px-2.5 py-2 rounded-xl border text-[11px] text-center transition-all cursor-pointer ${
          isSel
            ? "bg-amber-500/20 border-amber-400 text-amber-100 font-semibold"
            : "bg-stone-950 border-stone-800 text-stone-300 hover:border-stone-600"
        }`;
        const cLocked = Boolean(choice.requires) && !isSecretUnlocked(choice.requires);
        cBtn.textContent = cLocked ? "🔒 Phần Thưởng Bí Mật" : choice.name;
        if (cLocked) cBtn.classList.add("opacity-50");
        cBtn.addEventListener("click", () => {
          if (cLocked) {
            showToast("🔒 Phần thưởng bí mật — hãy mở khóa bí mật tương ứng trong Kho Bí Mật!");
            return;
          }
          if (!persistentArchive.cafeCustom) persistentArchive.cafeCustom = {};
          persistentArchive.cafeCustom[slotKey] = choice.id;
          saveArchive();
          audioEngine.playChime(523.25, 0.16, 0.03);
          openAmbienceModal();
        });
        btnsWrap.appendChild(cBtn);
      });
      row.appendChild(btnsWrap);
      customBox.appendChild(row);
    });
  }

  const casBox = document.getElementById("cassettes-list");
  casBox.innerHTML = "";
  STANDARD_GUEST_ORDER.forEach((gid) => {
    const g = CHARACTERS[gid];
    const unlocked = Boolean(persistentArchive.unlockedCassettes[g.cassette.id]);
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = `p-2.5 rounded-xl border text-left ${
      unlocked ? "bg-sky-500/15 border-sky-400/40 text-sky-100 cursor-pointer" : "bg-stone-950 border-stone-800 text-stone-500"
    }`;
    btn.textContent = unlocked ? `📼 ${g.cassette.title}` : `🔒 Băng của ${g.name.split(" (")[0]}`;
    if (unlocked) {
      btn.addEventListener("click", () => {
        audioEngine.start();
        audioEngine.playNote(g.cassette.freq, 1.8, 0.06);
        showToast(`📼 Đang phát giai điệu: ${g.cassette.title}`);
      });
    }
    casBox.appendChild(btn);
  });

  openModal("modal-ambience");
}

function openLogModal() {
  const list = document.getElementById("dialogue-log-list");
  list.innerHTML = "";
  if (!runState || runState.dialogueLog.length === 0) {
    list.innerHTML = `<div class="text-stone-400">Chưa có dòng thoại nào được ghi lại trong ca trực này.</div>`;
  } else {
    runState.dialogueLog.forEach((entry) => {
      const item = document.createElement("div");
      item.className = "p-2.5 rounded-xl bg-stone-900/90 border border-stone-800 space-y-1";
      item.innerHTML = `
        <div class="font-bold text-amber-200">${escapeHtml(entry.avatar)} ${escapeHtml(entry.speaker)}</div>
        <p class="text-stone-300 whitespace-pre-line">${escapeHtml(entry.text)}</p>
      `;
      list.appendChild(item);
    });
  }
  openModal("modal-log");
}

/* -----------------------------------------------------------------------
   EVENT BINDING & STARTUP BOOTSTRAP
------------------------------------------------------------------------ */
function bindAllUIEvents() {
  const unlockAudioOnFirstGesture = (e) => {
    if (e && e.target && e.target.closest("#btn-welcome-sound-pill, #btn-toggle-sound")) return;
    audioEngine.ensureAutoStarted();
    ["pointerdown", "keydown", "touchstart"].forEach((ev) => {
      window.removeEventListener(ev, unlockAudioOnFirstGesture);
    });
  };

  ["pointerdown", "keydown", "touchstart"].forEach((evt) => {
    window.addEventListener(evt, unlockAudioOnFirstGesture, { passive: true });
  });

  // Unified modal close buttons
  document.querySelectorAll("[data-close-modal]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const targetId = btn.getAttribute("data-close-modal");
      if (targetId) closeModal(targetId);
    });
  });

  // Backdrop click to close overlay modals
  document.querySelectorAll('[data-modal-overlay="true"]').forEach((overlay) => {
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) {
        overlay.classList.add("hidden");
      }
    });
  });

  // Keyboard accessibility: Escape closes open overlay modals, Space/Enter advances dialogue
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      document.querySelectorAll('[data-modal-overlay="true"]:not(.hidden)').forEach((m) => {
        m.classList.add("hidden");
      });
      return;
    }
    if ((e.key === " " || e.key === "Enter") && !e.target.closest("button, input, select, textarea")) {
      const anyModalOpen = Array.from(document.querySelectorAll(".fixed.inset-0")).some(
        (m) => !m.classList.contains("hidden")
      );
      const gameVisible = !document.getElementById("screen-game").classList.contains("hidden");
      if (gameVisible && !anyModalOpen) {
        e.preventDefault();
        advanceDialogueStep();
      }
    }
  });

  // Sound toggle on welcome screen
  document.getElementById("btn-welcome-sound-pill").addEventListener("click", (e) => {
    e.stopPropagation();
    const isOn = audioEngine.toggle();
    showToast(isOn ? "🔊 Đã bật âm thanh quán" : "🔇 Đã tắt âm thanh quán");
  });

  // Welcome Screen Buttons
  document.getElementById("btn-welcome-start").addEventListener("click", () => {
    audioEngine.ensureAutoStarted();
    switchScreen("screen-rules");
  });

  document.getElementById("btn-welcome-continue").addEventListener("click", () => {
    audioEngine.ensureAutoStarted();
    resumeRun();
  });

  document.getElementById("btn-welcome-menu").addEventListener("click", () => {
    audioEngine.ensureAutoStarted();
    updateAllProgressBadges();
    openModal("mobile-drawer");
  });

  // Rules Screen Buttons
  document.getElementById("btn-rules-back").addEventListener("click", () => switchScreen("screen-welcome"));

  document.getElementById("title-selector").addEventListener("change", (e) => {
    persistentArchive.selectedTitleId = e.target.value;
    saveArchive();
    document.getElementById("active-title-badge").textContent = getActiveHostTitle();
  });

  document.getElementById("btn-rules-open-archive").addEventListener("click", () => {
    updateAllProgressBadges();
    openModal("mobile-drawer");
  });

  document.getElementById("btn-quick-save").addEventListener("click", manualSave);
  bindVoiceControls();
  bindNightHistoryEvents();
  const replayBtn = document.getElementById("btn-voice-replay");
  if (replayBtn && CafeVoice.supported) {
    replayBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      if (currentVoiceItems.length) CafeVoice.speakMany(currentVoiceItems, true);
    });
  }
  // Tự lưu khi đóng tab / chuyển app (quan trọng trên điện thoại)
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") {
      saveArchive();
      if (runState) saveRunState();
    }
  });
  window.addEventListener("pagehide", () => {
    saveArchive();
    if (runState) saveRunState();
  });

  document.getElementById("btn-rules-continue").addEventListener("click", () => {
    audioEngine.ensureAutoStarted();
    resumeRun();
  });

  document.getElementById("btn-reset-all").addEventListener("click", resetAllProgress);
  document.getElementById("btn-open-thanks").addEventListener("click", () => {
    closeModal("mobile-drawer");
    showThanksPage();
  });

  document.getElementById("btn-start-shuffle-week").addEventListener("click", () => {
    if (hasSavedRun()) {
      if (!window.confirm(RESTART_CONFIRM_TEXT)) return;
      wipeProgressKeepSettings();
    }
    audioEngine.ensureAutoStarted();
    runState = createNewRunState();
    saveRunState();
    switchScreen("screen-game");
    startNight(0);
  });

  // Gameplay HUD & Stage
  document.getElementById("hud-weather-badge").addEventListener("click", openAmbienceModal);
  document.getElementById("btn-quick-ambience").addEventListener("click", openAmbienceModal);
  document.getElementById("btn-quick-log").addEventListener("click", openLogModal);
  document.getElementById("btn-open-drawer").addEventListener("click", () => {
    updateAllProgressBadges();
    openModal("mobile-drawer");
  });

  cafeCanvas.addEventListener("click", (e) => {
    stageRenderer.handleTap(e.clientX, e.clientY);
  });

  document.getElementById("dialogue-card").addEventListener("click", (e) => {
    if (e.target.closest("button, input, select")) return;
    advanceDialogueStep();
  });

  // Drawer Actions
  const drawerHandlers = {
    cutscenes: openCutsceneGallery,
    album: openDrinkAlbumModal,
    "drink-deck": openDrinkDeckModal,
    keepsakes: openKeepsakesModal,
    endings: openEndingsGalleryModal,
    dossiers: openDossiersModal,
    flowchart: openFlowchartModal,
    notes: openNotesModal,
    "cat-diary": openCatDiaryModal,
    ambience: openAmbienceModal,
    postcards: openPostcardsModal,
    achievements: openAchievementsModal,
    "easter-eggs": openEasterEggsModal,
    secrets: openSecretsModal
  };

  document.querySelectorAll("[data-drawer-action]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const act = btn.getAttribute("data-drawer-action");
      closeModal("mobile-drawer");
      if (drawerHandlers[act]) drawerHandlers[act]();
    });
  });

  const goHome = () => {
    closeModal("mobile-drawer");
    document.querySelectorAll("[data-modal-overlay]").forEach((m) => { if (m.id !== "mobile-drawer") closeModal(m.id); });
    try { CafeVoice.stop(); clearAutoAdvance(); } catch (err) { /* bỏ qua */ }
    saveRunState();
    switchScreen("screen-welcome");
  };
  ["btn-drawer-home", "btn-hud-home"].forEach((id) => {
    const b = document.getElementById(id);
    if (b) b.addEventListener("click", goHome);
  });

  document.getElementById("btn-night8-secret").addEventListener("click", startSecretNight8Reunion);
  document.getElementById("btn-twist-ending").addEventListener("click", startTwistEnding);
  document.getElementById("btn-restart-run").addEventListener("click", restartRunFromSave);
  document.getElementById("btn-welcome-restart").addEventListener("click", restartRunFromSave);

  // Ambience & Cutscene Player Controls
  document.getElementById("btn-toggle-sound").addEventListener("click", () => {
    const isOn = audioEngine.toggle();
    showToast(isOn ? "🔊 Đã bật âm thanh quán" : "🔇 Đã tắt âm thanh quán");
  });

  document.getElementById("btn-toggle-auto-season").addEventListener("click", () => {
    persistentArchive.autoCycleSeasons = !persistentArchive.autoCycleSeasons;
    saveArchive();
    openAmbienceModal();
    showToast(
      persistentArchive.autoCycleSeasons
        ? "🔄 Đã bật tự động đổi mùa sau mỗi đêm trực"
        : "🔄 Đã tắt tự động đổi mùa"
    );
  });

  document.getElementById("btn-toggle-auto-cafe").addEventListener("click", () => {
    persistentArchive.autoCycleCafe = !persistentArchive.autoCycleCafe;
    saveArchive();
    openAmbienceModal();
    showToast(
      persistentArchive.autoCycleCafe
        ? "🪑 Đã bật tự động đổi không gian quán sau mỗi đêm"
        : "🪑 Đã tắt tự động đổi không gian quán (giữ nguyên lựa chọn của bạn)"
    );
  });

  document.getElementById("rain-volume-slider").addEventListener("input", (e) => {
    audioEngine.updateRainVolume(Number(e.target.value) / 100);
  });

  document.getElementById("btn-cs-player-continue").addEventListener("click", () => {
    if (activeCutscenePages && activeCutscenePages.idx < activeCutscenePages.pages.length - 1) {
      activeCutscenePages.idx++;
      renderCutscenePage();
      audioEngine.playChime(494, 0.25, 0.03);
      return;
    }
    activeCutscenePages = null;
    CafeVoice.stop();
    closeModal("modal-cutscene-player");
    const cb = activeCutsceneCallback;
    activeCutsceneCallback = null;
    if (cb) cb();
  });

  // Epilogue Next Week & New Month Buttons
  document.getElementById("btn-epilogue-next-week").addEventListener("click", proceedToNextWeekWithRecap);

  document.getElementById("btn-epilogue-new-week").addEventListener("click", () => {
    closeModal("modal-epilogue");
    safeRemoveItem(STORAGE_KEY_RUN);
    runState = null;
    switchScreen("screen-rules");
  });

  // Responsive canvas observer & resize listener
  const canvasWrapper = document.getElementById("cafe-canvas-wrapper");
  if (window.ResizeObserver && canvasWrapper) {
    const ro = new ResizeObserver(() => stageRenderer.resize());
    ro.observe(canvasWrapper);
  }
  window.addEventListener("resize", () => stageRenderer.resize());
}

function runInitialLoadingScreen() {
  const loadingScreen = document.getElementById("screen-loading");
  const barFill = document.getElementById("loading-bar-fill");
  const pctText = document.getElementById("loading-pct-text");
  const statusText = document.getElementById("loading-status-text");

  if (!loadingScreen || !barFill || !pctText || !statusText) {
    switchScreen("screen-welcome");
    return;
  }

  const steps = [
    { at: 0, msg: "🔥 Đang nhóm bếp than hồng & hâm nóng ấm nước..." },
    { at: 32, msg: "🌧️ Đang mở khung cửa sổ đón làn mưa đêm..." },
    { at: 65, msg: "🐾 Mèo tam thể đang cuộn tròn trên quầy gỗ thông..." },
    { at: 90, msg: "🏮 Thắp sáng ngọn đèn vàng — Chào mừng tới quán!" }
  ];

  let completed = false;
  const finishLoading = () => {
    if (completed) return;
    completed = true;
    barFill.style.width = "100%";
    pctText.textContent = "100%";
    statusText.textContent = "🏮 Thắp sáng ngọn đèn vàng — Chào mừng tới quán!";
    loadingScreen.style.opacity = "0";
    setTimeout(() => {
      switchScreen("screen-welcome");
      loadingScreen.style.opacity = "1";
    }, 280);
  };

  const durationMs = 1500;
  const startTime = performance.now();

  function tickLoading(now) {
    if (completed) return;
    const elapsed = now - startTime;
    const progress = Math.min(100, Math.floor((elapsed / durationMs) * 100));

    barFill.style.width = `${progress}%`;
    pctText.textContent = `${progress}%`;

    for (let i = steps.length - 1; i >= 0; i--) {
      if (progress >= steps[i].at) {
        statusText.textContent = steps[i].msg;
        break;
      }
    }

    if (progress < 100) {
      requestAnimationFrame(tickLoading);
    } else {
      setTimeout(finishLoading, 200);
    }
  }

  requestAnimationFrame(tickLoading);
  setTimeout(finishLoading, 2100);
}

let isAppBooted = false;
function bootCafeApp() {
  if (isAppBooted) return;
  isAppBooted = true;
  try {
    bindAllUIEvents();
    updateAllProgressBadges();
    checkAndUnlockAchievements();
    audioEngine.ensureAutoStarted();
    stageRenderer.resize();
    requestAnimationFrame(animateStageLoop);
    runInitialLoadingScreen();
  } catch (err) {
    console.error("Lỗi khởi động quán:", err);
    switchScreen("screen-welcome");
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", bootCafeApp);
} else {
  bootCafeApp();
}
window.addEventListener("load", () => stageRenderer.resize());
