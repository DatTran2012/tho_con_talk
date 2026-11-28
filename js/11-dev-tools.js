"use strict";

/* -----------------------------------------------------------------------
   SECTION 11: CÔNG CỤ DEV (chỉ dùng nội bộ để test)
   Người chơi bình thường KHÔNG thấy gì cả. Cách bật:
     • Mở game với đuôi  ?dev=1   (ví dụ index.html?dev=1)   → hiện nút 🛠️ DEV góc trái dưới
     • Hoặc nhấn Ctrl+Shift+D để bật/tắt nhanh
   Tắt:  ?dev=0  hoặc nút "Tắt chế độ dev" trong bảng DEV.
   Khi bấm "Mở khóa tất cả", save thật được sao lưu trước; "Khôi phục save thật" sẽ trả lại.
------------------------------------------------------------------------ */
const DEV_FLAG_KEY = "tho_con_dev_mode";
const DEV_BACKUP_KEY = "tho_con_dev_backup_archive";

function isDevMode() {
  return safeGetItem(DEV_FLAG_KEY) === "1";
}

function devUnlockEverything() {
  if (!safeGetItem(DEV_BACKUP_KEY)) safeSetItem(DEV_BACKUP_KEY, JSON.stringify(persistentArchive));
  const a = persistentArchive;
  const all = (list, map, f = (x) => x.id) => list.forEach((x) => (map[f(x)] = true));

  Object.keys(SOLO_ENDINGS_DATA).forEach((g) => Object.keys(SOLO_ENDINGS_DATA[g]).forEach((p) => (a.unlockedEndings[`${g}_${p}`] = true)));
  all(CUTSCENE_CATALOG, a.unlockedCutscenes);
  all(DRINK_CARDS, a.unlockedDrinkCards);
  all(SIGNATURE_RECIPES, a.unlockedSignatures);
  all(EASTER_EGGS, a.discoveredEasterEggs);
  Object.keys(SHELF_BOOKS).forEach((g) => (a.shelfBooks[g] = true));
  all(SEASON_THEMES, a.visitedSeasons);
  all(SECRET_VAULT, a.unlockedSecrets);
  // Thành tựu: mở hết, trừ "twist" để vẫn test được cảnh bí mật cuối game
  ACHIEVEMENTS.filter((x) => x.id !== "ach_twist").forEach((x) => (a.unlockedAchievements[x.id] = true));
  all(SHIFT_MODES, a.completedModes);
  a.maxChapter = 4;
  STANDARD_GUEST_ORDER.forEach((g) => {
    a.unlockedKeepsakes[g] = true;
    a.postcards[g] = true;
    a.unlockedCatDiary[g] = true;
    const ch = CHARACTERS[g];
    if (ch && ch.cassette) a.unlockedCassettes[ch.cassette.id] = true;
  });
  a.quietEndingSeen = true;
  a.playthroughCount = Math.max(a.playthroughCount || 0, 3);
  a.totalDrinksServed = Math.max(a.totalDrinksServed || 0, 100);
  a.perfectBrewsCount = Math.max(a.perfectBrewsCount || 0, 50);
  a.truthsHeard = {};
  STANDARD_GUEST_ORDER.forEach((g) => [1, 2, 3, 4].forEach((c) => (a.truthsHeard[`${g}_${c}`] = true)));
  a.petCatCount = Math.max(a.petCatCount || 0, 20);
  a.clockTapCount = Math.max(a.clockTapCount || 0, 20);
  a.plantWater = Math.max(a.plantWater || 0, 15);      // chậu cây nở rộ
  a.plantBloomed = true;
  a.fishFeedCount = Math.max(a.fishFeedCount || 0, 20);
  a.bottleTaps = Math.max(a.bottleTaps || 0, 20);
  a.stoveTaps = Math.max(a.stoveTaps || 0, 20);
  saveArchive();
  updateAllProgressBadges();
  showToast("🛠️ DEV: đã mở khóa toàn bộ nội dung (save thật được sao lưu)");
}

function devRestoreBackup() {
  const raw = safeGetItem(DEV_BACKUP_KEY);
  if (!raw) {
    showToast("🛠️ DEV: chưa có bản sao lưu để khôi phục");
    return false;
  }
  try {
    persistentArchive = sanitizeArchive(JSON.parse(raw));
  } catch (err) {
    return false;
  }
  saveArchive();
  try { window.localStorage.removeItem(DEV_BACKUP_KEY); } catch (err) { /* bỏ qua */ }
  updateAllProgressBadges();
  showToast("🛠️ DEV: đã khôi phục save thật");
  return true;
}

function devSetMode(on) {
  safeSetItem(DEV_FLAG_KEY, on ? "1" : "0");
  if (!on) { try { CafeVoice.stop(); } catch (e) { /* bỏ qua */ } }
  try { renderVoiceControls(); } catch (e) { /* bỏ qua */ }
  renderDevTools();
}

function renderDevTools() {
  let fab = document.getElementById("dev-fab");
  let panel = document.getElementById("dev-panel");
  if (!isDevMode()) {
    if (fab) fab.remove();
    if (panel) panel.remove();
    return;
  }
  if (fab) return;
  fab = document.createElement("button");
  fab.id = "dev-fab";
  fab.type = "button";
  fab.textContent = "🛠️ DEV";
  fab.style.cssText = "position:fixed;left:8px;bottom:8px;z-index:99999;padding:6px 10px;border-radius:12px;background:#7c3aed;color:#fff;font:700 11px monospace;border:1px solid #c4b5fd;cursor:pointer;opacity:.85";
  panel = document.createElement("div");
  panel.id = "dev-panel";
  panel.style.cssText = "max-height:72vh;overflow-y:auto;position:fixed;left:8px;bottom:46px;z-index:99999;width:min(260px,86vw);padding:10px;border-radius:14px;background:#1c1917;color:#e7e5e4;border:1px solid #7c3aed;font:12px sans-serif;display:none";
  const btn = (id, label) => `<button type="button" data-dev="${id}" style="display:block;width:100%;margin-top:6px;padding:8px;border-radius:10px;background:#292524;border:1px solid #57534e;color:#e7e5e4;font-size:12px;cursor:pointer;text-align:left">${label}</button>`;
  panel.innerHTML = `<div style="font-weight:700;color:#c4b5fd">🛠️ Chế độ DEV (nội bộ)</div>` +
    btn("unlock", "🔓 Mở khóa TẤT CẢ (21 kết, bí mật, cutscene…)") +
    btn("restore", "♻️ Khôi phục save thật") +
    btn("secret", "🌟 Đặt sẵn điều kiện cho kết bí mật (giữ twist chưa xem)") +
    btn("story", "📖 Đọc toàn bộ hội thoại 28 đêm") +
    btn("lint", "🔎 Tự kiểm tra độ chặt chẽ của toàn bộ thoại (28 đêm)") +
    btn("jump", "⏭️ Chơi thử từ một đêm bất kỳ…") +
    btn("recipes", "🍹 Đặt số ly độc quyền đã pha trong tuần (0–7)…") +
    btn("weekend", "📅 Kết thúc ngay tuần n (kiểm tra cổng công thức)…") +
    btn("finale", "🏁 Xem trang cảm ơn hết 28 đêm (xem trước)") +
    btn("simlow", "🧪 Mô phỏng chơi HẾT 28 đêm nhưng THIẾU tiến trình (kiểm tra trang cảm ơn)") +
    btn("simmid", "🧪 Mô phỏng hết 28 đêm, thiếu ĐÚNG 1 mục (kiểm tra cửa chưa mở)") +
    btn("simfull", "🧪 Mô phỏng hết 28 đêm, ĐỦ tiến trình (kiểm tra cánh cửa thứ hai xuất hiện)") +
    btn("simfresh", "🧹 Đặt save về như người chơi mới (giữ bản sao lưu)") +
    btn("picker", "🔁 Mở bảng chọn đêm chơi lại") +
    btn("lockch", "🔒 Khóa lại chương (chỉ còn Chương 1) + bỏ lá bài ẩn") +
    btn("hidden17", "🎴 Mở/khóa lá bài 17 + 2 ly bí mật") +
    btn("thanks", "🎖️ Xem trang chúc mừng (xem trước)") +
    btn("voices", "🗣️ Nghe thử 8 giọng mp3 (mỗi người một câu)") +
    btn("music", "🎵 Nghe thử các bản nhạc nền (bấm để đổi bản kế tiếp)") +
    btn("fxcard", "🃏 Xem thử cutscene RÚT BÀI (bấm lần nữa: đổi kiểu hỏi/đáp)") +
    btn("fxserve", "🥂 Xem thử cutscene MỜI NƯỚC (xoay: Hoàn Hảo → Chuẩn Vị → Mộc Mạc)") +
    btn("fxgift", "🏺 Xem thử cutscene ĐƯA KỶ VẬT + GHI NOTE (đổi khách mỗi lần)") +
    btn("fxrecipe", "🍹 Xem thử cutscene MỞ KHÓA CÔNG THỨC (đổi công thức mỗi lần)") +
    btn("fxscenes", "🎬 Xem thử cutscene MỚI (mở/đóng quán, chương, cửa bí mật, tuần, cassette, cây, mèo, tổng kết, thành tựu) — bấm để đổi cảnh") +
    btn("fxobj", "🧸 Xem thử cận cảnh ĐỒ VẬT (chai, hồ cá, bếp, tủ, cây, ly, đồng hồ, radio, sách, cửa sổ, Thỏ Con, khách, đèn lồng) — bấm để đổi") +
    btn("twdrink", "🍵 Xem thử LY CUỐI Cánh Cửa Thứ Hai (xoay: mật ong → chanh → hoa cúc)") +
    btn("twplay", "🚪 Chơi THẲNG Cánh Cửa Thứ Hai từ đầu (bỏ qua điều kiện mở khóa; thử chọn nguyên liệu + 3 kết)") +
    btn("truths", "💬 Đặt số LỜI THẬT đã nghe (0–28) để thử ngưỡng mở cửa") +
    btn("quiet", "🪧 Xem thử KẾT THỨ NHẤT (quán tạm nghỉ, không ai biết)") +
    btn("finales", "🎬 Xem thử 3 KẾT MỚI (Người Nghe Cuối Cùng → Bảy Chiếc Chìa Khóa → Ngày Thỏ Con Khỏe Lại; bấm để đổi)") +
    btn("simlast", "🎯 Tái hiện luồng thật: «Người Nghe Cuối Cùng» (sau tổng kết 28 đêm)") +
    btn("simhands", "🎯 Tái hiện luồng thật: «Bảy Chiếc Chìa Khóa» (sau tổng kết 28 đêm)") +
    btn("simheal", "🎯 Tái hiện luồng thật: «Ngày Thỏ Con Khỏe Lại» (chơi Cánh Cửa, chọn 🤫)") +
    btn("enddrink", "🍹 Xem thử trang LY NƯỚC trong cảnh kết (xoay khách × Hoàn Hảo/Chuẩn Vị/Mộc Mạc)") +
    btn("voicehold", "🔇 Thử giữ giọng: đọc một câu thoại NGAY LÚC đang chiếu cảnh (phải đọc sau khi cảnh xong)") +
    btn("clips", "📼 Thống kê file thoại mp3 / nhạc đã có") +
    btn("off", "⛔ Tắt chế độ dev");
  document.body.appendChild(fab);
  document.body.appendChild(panel);
  fab.addEventListener("click", () => {
    panel.style.display = panel.style.display === "none" ? "block" : "none";
  });
  panel.addEventListener("click", (e) => {
    const t = e.target.closest("[data-dev]");
    if (!t) return;
    const k = t.dataset.dev;
    if (k === "unlock" || k === "secret") {
      devUnlockEverything();
      persistentArchive.twistEndingSeen = false;
      persistentArchive.twistAnnounced = false;
      delete persistentArchive.unlockedAchievements.ach_twist;
      saveArchive();
      updateAllProgressBadges();
    } else if (k === "thanks") showThanksPage();
    else if (k === "story") devOpenStoryViewer();
    else if (k === "lint") devLintStory();
    else if (k === "jump") devJumpToNight();
    else if (k === "recipes") devSetRecipeCount();
    else if (k === "weekend") devForceWeekEnd();
    else if (k === "hidden17") {
      const on = !persistentArchive.unlockedDrinkCards.dc_17;
      if (on) { persistentArchive.unlockedDrinkCards.dc_17 = true; secretRecipes().forEach((s) => (persistentArchive.unlockedSignatures[s.id] = true)); persistentArchive.unlockedSecrets.secret_card_17 = true; persistentArchive.unlockedSecrets.secret_signature = true; }
      else { delete persistentArchive.unlockedDrinkCards.dc_17; secretRecipes().forEach((s) => delete persistentArchive.unlockedSignatures[s.id]); delete persistentArchive.unlockedSecrets.secret_card_17; delete persistentArchive.unlockedSecrets.secret_signature; }
      saveArchive();
      updateAllProgressBadges();
      showToast(on ? "🛠️ DEV: đã mở lá bài 17 + 2 ly bí mật" : "🛠️ DEV: đã khóa lại lá bài 17 + ly ẩn");
    }
    else if (k === "finale") showFinalePage();
    else if (k === "voices") devVoiceDemo();
    else if (k === "music") devMusicNext();
    else if (k === "clips") devClipStats();
    else if (k === "fxcard") devPreviewCardFX();
    else if (k === "fxgift") devPreviewGiftFX();
    else if (k === "fxobj") devPreviewObjects();
    else if (k === "fxscenes") devPreviewScenes();
    else if (k === "fxrecipe") devPreviewRecipeFX();
    else if (k === "fxserve") devPreviewServeFX();
    else if (k === "twdrink") devPreviewTwistDrink();
    else if (k === "twplay") devPlayTwist();
    else if (k === "truths") {
      const cur = Object.keys(persistentArchive.truthsHeard || {}).length;
      const v = window.prompt(`Số lời thật hiện có: ${cur}/28. Mốc mở Cánh Cửa: ${TWIST_TRUTHS_NEEDED}. Đặt thành bao nhiêu (0–28)?`, String(cur));
      if (v !== null && v !== "" && !Number.isNaN(Number(v))) {
        const n = Math.max(0, Math.min(28, Math.floor(Number(v)))), keys = [];
        STANDARD_GUEST_ORDER.forEach((g) => [1, 2, 3, 4].forEach((c) => keys.push(`${g}_${c}`)));
        persistentArchive.truthsHeard = {};
        keys.slice(0, n).forEach((key) => (persistentArchive.truthsHeard[key] = true));
        saveArchive();
        updateAllProgressBadges();
        showToast(`🛠️ DEV: đã đặt ${n}/28 lời thật • cửa ${isTwistUnlocked() ? "ĐÃ mở" : "chưa mở"}`);
      }
    }
    else if (k === "quiet") { panel.style.display = "none"; switchScreen("screen-game"); startQuietEnding(() => switchScreen("screen-welcome")); }
    else if (k === "finales") { panel.style.display = "none"; window.__devFin = ((window.__devFin || 0) % FINALE_ENDINGS.length); const d = FINALE_ENDINGS[window.__devFin++]; switchScreen("screen-game"); playEndingSequence(d.ids, d.fx, () => { switchScreen("screen-welcome"); showToast("🛠️ DEV: xong " + d.title); }); }
    else if (k === "simlast") devSimFinale("last");
    else if (k === "simhands") devSimFinale("hands");
    else if (k === "simheal") devSimFinale("recovery");
    else if (k === "enddrink") devPreviewEndingDrink();
    else if (k === "voicehold") devTestVoiceHold();
    else if (k === "simlow" || k === "simmid" || k === "simfull") devSimulateMonthEnd(k);
    else if (k === "simfresh") {
      if (!safeGetItem(DEV_BACKUP_KEY)) safeSetItem(DEV_BACKUP_KEY, JSON.stringify(persistentArchive));
      persistentArchive = sanitizeArchive(createDefaultArchive());
      saveArchive();
      safeRemoveItem(STORAGE_KEY_RUN);
      runState = null;
      updateAllProgressBadges();
      showToast("🛠️ DEV: đã đặt save như người chơi mới (bấm 'Khôi phục save thật' để trả lại)");
    }
    else if (k === "picker") openReplayPicker();
    else if (k === "lockch") {
      persistentArchive.maxChapter = 1;
      persistentArchive.completedModes = {};
      delete persistentArchive.unlockedDrinkCards.dc_17;
      secretRecipes().forEach((s) => delete persistentArchive.unlockedSignatures[s.id]);
      saveArchive();
      updateAllProgressBadges();
      showToast("🛠️ DEV: đã khóa lại Chương 2–4 và lá bài ẩn");
    }
    else if (k === "restore") devRestoreBackup();
    else if (k === "off") {
      if (safeGetItem(DEV_BACKUP_KEY)) devRestoreBackup();
      devSetMode(false);
    }
  });
}

/* ---- Thử giọng đọc mp3 và nhạc nền ---- */
function devVoiceDemo() {
  const who = [["Thỏ Con", "Chào bạn, mình là Thỏ Con, chủ quán nửa đêm."]]
    .concat(STANDARD_GUEST_ORDER.map((id) => [CHARACTERS[id].name, `Mình là ${CHARACTERS[id].name.split(" (")[0]}, đêm nay mưa to quá nhỉ.`]));
  CafeVoice.speakMany(who.map(([speaker, text]) => ({ speaker, text })), true);
  showToast("🛠️ DEV: đọc thử 8 giọng. Câu nào chưa có mp3 sẽ dùng giọng trình duyệt.");
}
const DEV_MUSIC_IDS = ["spring", "summer", "autumn", "winter", "piano", "dawn", "keeper"];
let devMusicIdx = -1;
function devMusicNext() {
  devMusicIdx = (devMusicIdx + 1) % DEV_MUSIC_IDS.length;
  const id = DEV_MUSIC_IDS[devMusicIdx];
  audioEngine.enabled = true;
  audioEngine.userMuted = false;
  audioEngine.music.play(id);
  showToast(`🛠️ DEV: đang phát bản "${id}" (${devMusicIdx + 1}/${DEV_MUSIC_IDS.length}). Bấm lần nữa để đổi bản.`);
}
function devClipStats() {
  const n = typeof VOICE_CLIPS !== "undefined" ? VOICE_CLIPS.size : 0;
  showToast(`🛠️ DEV: ${n} file thoại mp3, ${DEV_MUSIC_IDS.length} bản nhạc. Câu chưa có file sẽ dùng giọng trình duyệt.`);
}

/* ---- Xem trước hai cutscene mới ---- */
let devFxCardIdx = 0, devFxServeIdx = 0;
function devPreviewCardFX() {
  const cards = DRINK_CARDS.filter((c) => !c.hidden);
  const mode = devFxCardIdx % 2 ? "host_answers" : "guest_answers";
  const card = cards[devFxCardIdx % cards.length];
  devFxCardIdx++;
  if (typeof CardDrawFX === "undefined" || !CardDrawFX.play(card, mode, () => {})) showToast("🛠️ DEV: không chạy được hiệu ứng (có thể đang bật giảm chuyển động)");
}
function devPreviewServeFX() {
  const qs = ["perfect", "good", "plain"], q = qs[devFxServeIdx % 3];
  const g = CHARACTERS[STANDARD_GUEST_ORDER[devFxServeIdx % STANDARD_GUEST_ORDER.length]];
  const base = DRINK_BASES[devFxServeIdx % DRINK_BASES.length];
  devFxServeIdx++;
  if (typeof ServeFX === "undefined" || !ServeFX.play({ guest: g, baseId: base.id, drink: base.name, quality: q }, () => {})) showToast("🛠️ DEV: không chạy được hiệu ứng (có thể đang bật giảm chuyển động)");
}

let devTwDrinkIdx = 0;
function devPreviewTwistDrink() {
  const opts = [["heart", "🍯"], ["mind", "🍋"], ["silent", "🌼"]], [variant, ing] = opts[devTwDrinkIdx++ % 3];
  showToast("🛠️ DEV: ly cuối — " + ing + " (" + variant + ")");
  twistFx2("tw_drink", { ing, variant }, () => showToast("🛠️ DEV: hết cảnh ly cuối"));
}
function devPlayTwist() {
  window.__devForceTwist = true;
  const pn = document.getElementById("dev-panel"); if (pn) pn.style.display = "none";
  startTwistEnding();
  setTimeout(() => { window.__devForceTwist = false; }, 500);
}
/* Tái hiện đúng luồng thật của 3 kết lớn bổ sung (đặt sẵn điều kiện rồi chạy tổng kết 28 đêm / Cánh Cửa) */
function devSimFinale(kind) {
  if (kind === "recovery") {
    if (!safeGetItem(DEV_BACKUP_KEY)) safeSetItem(DEV_BACKUP_KEY, JSON.stringify(persistentArchive));
    persistentArchive.twistEndings = { heart: true, mind: true };
    persistentArchive.finalesSeen = {};
    saveArchive();
    showToast("🛠️ DEV: đã xem sẵn 2/3 biến thể. Ở cảnh bảy người hãy chọn 🤫 (lặng) để ra biến thể thứ 3 → kết «Ngày Thỏ Con Khỏe Lại»");
    devPlayTwist();
    return;
  }
  devSimulateMonthEnd("full");
  const a = persistentArchive;
  a.quietEndingSeen = true;
  a.finalesSeen = {};
  a.twistEndings = {};
  a.twistAsked = true;
  a.truthsHeard = {};
  if (kind === "last") {
    for (let i = 1; i <= 7; i++) a.truthsHeard["dev_" + i] = true;
    Object.keys(a.unlockedEndings).forEach((k) => delete a.unlockedEndings[k]);
    runState.monthlyStanceCounts = { ...runState.monthlyStanceCounts, heart: 3, mind: 2, silent: 9 };
  } else {
    for (let i = 1; i <= 5; i++) a.truthsHeard["dev_" + i] = true;
    STANDARD_GUEST_ORDER.forEach((g) => (a.unlockedEndings[g + "_heart"] = true));
  }
  saveArchive();
  saveRunState();
  showToast(kind === "last" ? "🛠️ DEV: đã đặt 🤫 nhiều nhất + 7 lời thật. Bấm nút cuối bảng tổng kết để xem «Người Nghe Cuối Cùng»" : "🛠️ DEV: đã có kết tim của cả 7 khách. Bấm nút cuối bảng tổng kết để xem «Bảy Chiếc Chìa Khóa»");
}
let devEndDrinkIdx = 0;
function devPreviewEndingDrink() {
  const gids = STANDARD_GUEST_ORDER, quals = ["🌟 Hoàn Hảo", "✨ Chuẩn Vị", "☕ Mộc Mạc"];
  const i = devEndDrinkIdx++, gid = gids[i % gids.length], q = quals[Math.floor(i / gids.length) % 3];
  const id = gid + "_heart", who = CHARACTERS[gid].name.split(" (")[0];
  persistentArchive.endingDrinks = { ...(persistentArchive.endingDrinks || {}), [id]: { name: "Trà Gừng Mật Ong", quality: q, who } };
  showToast("🛠️ DEV: kết " + id + " — " + q + " (bấm Tiếp để sang trang 2 = trang ly nước)");
  playCutscene(id, null);
  delete persistentArchive.endingDrinks[id];
}
function devTestVoiceHold() {
  if (!persistentArchive.voiceEnabled) { showToast("🛠️ DEV: hãy bật giọng đọc trước khi thử"); return; }
  const ok = SceneFX.play("chapter", { no: 1, icon: "🌙", name: "Thử giữ giọng", line: "Câu thoại sẽ chỉ được đọc SAU khi cảnh này kết thúc" }, null);
  CafeVoice.speak("Đây là câu thoại được gọi lúc cảnh đang chiếu. Nếu nghe câu này sau khi cảnh đã tắt thì giữ giọng hoạt động đúng.", "Thỏ Con");
  showToast(ok ? "🛠️ DEV: đã gọi giọng đọc trong lúc chiếu cảnh" : "🛠️ DEV: không chiếu được cảnh");
}
let devSceneIdx = 0;
function devPreviewScenes() {
  const list = ["open", "close", "chapter", "secret", "week_ok", "week_fail", "cassette", "bloom", "cat", "month", "tw_book", "tw_card", "tw_drink", "tw_birds", "tw_final_heart", "tw_final_mind", "tw_final_silent", "banner"], k = list[devSceneIdx++ % list.length];
  const g = CHARACTERS[STANDARD_GUEST_ORDER[devSceneIdx % STANDARD_GUEST_ORDER.length]];
  const ch = STORY_CHAPTERS[devSceneIdx % 4];
  const D = { open: { night: 3, title: "Đêm thử", guest: g, short: false }, close: { line: "Quán đóng cửa" }, chapter: { no: ch.no, icon: ch.icon, name: ch.name, line: ch.desc }, secret: {}, week_ok: { ok: true, have: 3, need: 3 }, week_fail: { ok: false, have: 1, need: 3 }, cassette: { guestName: g.name.split(" (")[0], name: g.cassette && (g.cassette.name || g.cassette.title) }, bloom: {}, cat: {}, month: { guests: STANDARD_GUEST_ORDER.map((id) => CHARACTERS[id]), drinks: 88, endings: 33 }, tw_book: {}, tw_card: {}, tw_drink: {}, tw_birds: {} };
  D.tw_final_heart = { variant: "heart" }; D.tw_final_mind = { variant: "mind" }; D.tw_final_silent = { variant: "silent" };
  showToast("🛠️ DEV: cảnh " + k);
  if (k === "banner") { if (!SceneFX.banner("🏆", "Thành tựu thử nghiệm", "Danh hiệu: Chủ Quán Thử")) showToast("🛠️ DEV: không chạy được"); return; }
  const kind = k.startsWith("week") ? "week" : k.startsWith("tw_final") ? "tw_final" : k;
  if (!SceneFX.play(kind, D[k], null)) showToast("🛠️ DEV: không chạy được hiệu ứng (có thể đang bật giảm chuyển động)");
}
let devObjIdx = 0;
function devPreviewObjects() {
  const ids = ["bottle", "fishtank", "stove", "keepsakes", "plant", "cup", "cat", "clock", "radio", "shelf", "window", "bunny", "guest", "lantern"], id = ids[devObjIdx++ % ids.length];
  const box = { id, idx: devObjIdx % 5, guest: CHARACTERS[STANDARD_GUEST_ORDER[devObjIdx % STANDARD_GUEST_ORDER.length]] };
  showToast("🛠️ DEV: cận cảnh " + id);
  if (id === "lantern") { if (!SceneFX.play("obj_lantern", {}, null)) showToast("🛠️ DEV: không chạy được"); return; }
  const a = persistentArchive.objTaps || {}, keep = a[id]; persistentArchive.objTaps = a; a[id] = 0;   // ép chiếu như lần đầu
  const ok = SceneFX.touch(box, null);
  if (keep !== undefined) a[id] = keep; else delete a[id];
  if (!ok) showToast("🛠️ DEV: không chạy được hiệu ứng (có thể đang bật giảm chuyển động)");
}
let devFxRecipeIdx = 0;
function devPreviewRecipeFX() {
  const list = regularRecipes(), sig = list[devFxRecipeIdx % list.length];
  devFxRecipeIdx++;
  if (typeof RecipeFX === "undefined" || !RecipeFX.play(sig, (devFxRecipeIdx % list.length) || list.length, list.length, () => {})) showToast("🛠️ DEV: không chạy được hiệu ứng (có thể đang bật giảm chuyển động)");
}
let devFxGiftIdx = 0;
function devPreviewGiftFX() {
  const g = CHARACTERS[STANDARD_GUEST_ORDER[devFxGiftIdx % STANDARD_GUEST_ORDER.length]];
  devFxGiftIdx++;
  const info = { gifts: [{ guest: g, icon: g.keepsake.icon, name: g.keepsake.name }], note: { nightLabel: "T1-Đ" + (1 + (devFxGiftIdx % 7)), guestName: g.name.split(" (")[0], text: "Cảm ơn Thỏ Con vì ly nước ấm và cuộc trò chuyện đêm nay!" } };
  if (typeof GiftFX === "undefined" || !GiftFX.play(info, () => {})) showToast("🛠️ DEV: không chạy được hiệu ứng (có thể đang bật giảm chuyển động)");
}

/* ---- Mở chế độ dev trên điện thoại: chạm đèn lồng 10 lần rồi nhập mật khẩu ---- */
const DEV_PASSWORD = "201220";
let devLanternTaps = 0;
let devLanternLast = 0;
function devLanternTap() {
  const now = Date.now();
  devLanternTaps = now - devLanternLast > 2500 ? 1 : devLanternTaps + 1;
  devLanternLast = now;
  if (devLanternTaps < 10) return;
  devLanternTaps = 0;
  if (isDevMode()) {
    showToast("🛠️ Chế độ DEV đang bật");
    return;
  }
  const pw = window.prompt("Mật khẩu:");
  if (pw === DEV_PASSWORD) {
    devSetMode(true);
    devUnlockEverything();
    persistentArchive.twistEndingSeen = false;
    persistentArchive.twistAnnounced = false;
    delete persistentArchive.unlockedAchievements.ach_twist;
    saveArchive();
    updateAllProgressBadges();
  } else if (pw !== null) {
    showToast("Sai mật khẩu");
  }
}

/* ---- Đọc toàn bộ hội thoại 28 đêm (kể cả mọi nhánh lựa chọn và biến thể lời thoại) ---- */
function devStoryText(t) {
  if (typeof t === "string") return escapeHtml(t);
  return ["h", "m", "s", "d"].filter((k) => t[k]).map((k) => `<div class="pl-2 border-l border-stone-700"><span class="text-[10px] text-sky-300">[${{ h: "đã đối xử bằng ❤️", m: "đã đối xử bằng ✨", s: "đã đối xử bằng 🤫", d: "mặc định" }[k]}]</span> ${escapeHtml(t[k])}</div>`).join("");
}

function devStoryNightHtml(n) {
  const name = (id) => (id === "host" ? "🐰 Thỏ Con" : id === "sys" ? "🌙 Cảnh" : CHARACTERS[id] ? `${CHARACTERS[id].avatar} ${CHARACTERS[id].name}` : id);
  return n.steps
    .map((st) => {
      const k = st[0];
      if (k === "@") return `<div class="text-[11px] font-mono-code text-amber-300 pt-1">🕐 ${st[1]}</div>`;
      if (k === "+") return `<div class="text-[11px] text-emerald-300">➕ ${name(st[1])} bước vào</div>`;
      if (k === "-") return `<div class="text-[11px] text-stone-400">➖ ${name(st[1])} rời quầy</div>`;
      if (k === "card") return `<div class="text-[11px] text-teal-300">🃏 Rút lá bài DRINK</div>`;
      if (k === "?") {
        const opts = [["❤️", st[2]], ["✨", st[3]], ["🤫", st[4]]]
          .map(([ic, o]) => `<div class="mt-1 p-2 rounded-lg bg-amber-500/10 border border-amber-400/30"><div class="text-amber-100">${ic} ${escapeHtml(o[0])}</div><div class="text-stone-300 mt-0.5">↳ ${name(o[1])}: ${devStoryText(o[2])}</div></div>`)
          .join("");
        return `<div class="p-2 rounded-xl bg-stone-900 border border-stone-700"><div class="italic text-stone-400">${escapeHtml(st[1])}</div>${opts}</div>`;
      }
      if (k === "brew")
        return `<div class="p-2 rounded-xl bg-teal-500/10 border border-teal-400/30"><div class="font-bold text-teal-200">☕ Pha cho ${name(st[1])}</div><div class="text-stone-200">${devStoryText(st[2])}</div><div class="italic text-stone-400 mt-1">${devStoryText(st[3])}</div></div>`;
      const cls = k === "sys" ? "italic text-stone-400" : "text-stone-200";
      return `<div class="${cls}"><span class="font-bold text-amber-200">${name(k)}:</span> ${devStoryText(st[1])}</div>`;
    })
    .join("");
}

function devOpenStoryViewer() {
  const box = document.getElementById("history-body");
  const title = document.getElementById("history-title");
  if (!box || !title) return;
  title.textContent = "📖 DEV • Toàn bộ 28 đêm";
  box.innerHTML = "";
  STORY_NIGHTS.forEach((n, i) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "w-full text-left p-3 rounded-2xl bg-stone-900/90 hover:bg-stone-800 border border-stone-700 cursor-pointer";
    const gl = n.guests.map((g) => CHARACTERS[g].name.split(" (")[0]).join(" & ");
    b.innerHTML = `<div class="text-xs font-semibold text-amber-200">Chương ${n.ch} • Đêm ${i + 1} • ${escapeHtml(n.title)}</div><div class="text-[11px] text-stone-400">${escapeHtml(gl)} • ${n.steps.length} bước • bắt đầu ${n.t0}</div>`;
    b.addEventListener("click", () => {
      title.textContent = `Đêm ${i + 1} • ${n.title}`;
      box.innerHTML = "";
      const back = document.createElement("button");
      back.type = "button";
      back.className = "min-h-[36px] px-3 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-700 text-xs text-stone-200 cursor-pointer";
      back.textContent = "← Danh sách 28 đêm";
      back.addEventListener("click", devOpenStoryViewer);
      box.appendChild(back);
      const body = document.createElement("div");
      body.className = "space-y-1.5 text-xs";
      body.innerHTML = `<div class="italic text-stone-400 whitespace-pre-line">${escapeHtml(n.intro.join("\n\n"))}</div>` + devStoryNightHtml(n);
      box.appendChild(body);
    });
    box.appendChild(b);
  });
  openModal("modal-history");
}

/* ---- Nhảy thẳng tới một đêm để chơi thử ---- */
function devJumpToNight() {
  const v = window.prompt("Chơi thử từ đêm số mấy? (1–28)", "1");
  const n = Math.floor(Number(v));
  if (!n || n < 1 || n > 28) return;
  closeModal("modal-history");
  runState = createNewRunState();
  runState.nightIndex = n - 1;
  runState.awaitingNightStart = true;
  saveRunState();
  switchScreen("screen-game");
  startNight(n - 1);
}

/* ---- Công cụ test: công thức nước, kết thúc tuần, cổng chương ---- */
function devSetRecipeCount() {
  const reg = regularRecipes();
  const v = window.prompt(`Số công thức độc quyền đã pha TRONG TUẦN HIỆN TẠI (0–${reg.length}).\nTuần này cần ${currentWeekGoal()} món khác nhau mới qua chương.`, "0");
  if (v === null) return;
  const n = Math.max(0, Math.min(reg.length, Math.floor(Number(v)) || 0));
  if (!runState) runState = createNewRunState();
  runState.weekSigs = reg.slice(0, n).map((s) => s.id);
  reg.forEach((sig, i) => { if (i < n) persistentArchive.unlockedSignatures[sig.id] = true; });
  saveRunState();
  saveArchive();
  updateAllProgressBadges();
  showToast(`🛠️ DEV: tuần này đã pha ${n} công thức độc quyền (cần ${currentWeekGoal()})`);
}

/* Mô phỏng hết 28 đêm ở 3 mức tiến trình, đi qua đúng luồng thật: tổng kết tháng → trang cảm ơn / cửa bí mật.
   low  = chỉ có vài kết cục, vài công thức  → phải ra trang cảm ơn, KHÔNG nhắc bí mật, có nút chọn đêm chơi lại
   mid  = mở khóa hết trừ đúng 1 kết cục      → cửa bí mật vẫn đóng
   full = mở khóa hết (trừ cảnh twist chưa xem) → cửa bí mật hiện ra */
function devSimulateMonthEnd(mode) {
  if (!safeGetItem(DEV_BACKUP_KEY)) safeSetItem(DEV_BACKUP_KEY, JSON.stringify(persistentArchive));
  ["modal-history", "modal-epilogue", "modal-finale", "modal-thanks", "mobile-drawer"].forEach(closeModal);
  if (mode === "low") {
    persistentArchive = sanitizeArchive(createDefaultArchive());
    const reg = regularRecipes();
    reg.slice(0, 3).forEach((sg) => (persistentArchive.unlockedSignatures[sg.id] = true));
    Object.keys(SOLO_ENDINGS_DATA).slice(0, 2).forEach((g) => Object.keys(SOLO_ENDINGS_DATA[g]).slice(0, 1).forEach((p) => (persistentArchive.unlockedEndings[`${g}_${p}`] = true)));
    persistentArchive.totalDrinksServed = 12;
  } else {
    devUnlockEverything();
    if (mode === "mid") {
      const first = Object.keys(persistentArchive.unlockedEndings)[0];
      if (first) delete persistentArchive.unlockedEndings[first];
    }
  }
  persistentArchive.twistEndingSeen = false;
  persistentArchive.twistAnnounced = false;
  persistentArchive.twistAsked = false;
  persistentArchive.twistEndings = {};
  persistentArchive.quietEndingSeen = false;
  persistentArchive.finalesSeen = {};
  persistentArchive.thanksSeen = false;
  persistentArchive.completedModes = {};
  persistentArchive.maxChapter = 4;
  delete persistentArchive.unlockedAchievements.ach_twist;
  delete persistentArchive.unlockedDrinkCards.dc_17;
  secretRecipes().forEach((sg) => delete persistentArchive.unlockedSignatures[sg.id]);
  POST_TWIST_SECRETS.forEach((id) => delete persistentArchive.unlockedSecrets[id]);
  saveArchive();
  updateAllProgressBadges();

  runState = createNewRunState();
  const fake = (wk, n) => ({ weekNum: wk, nightInWeek: n, guestNames: "Khách thử nghiệm", drinkName: "—", endingTitle: "Kết đêm (dev)", pathTag: "🛠️ DEV", summary: "Đêm giả lập để thử màn tổng kết." });
  runState.nightIndex = 28;
  runState.awaitingNightStart = true;
  runState.weekResults = Array.from({ length: 7 }, (_, i) => fake(4, i + 1));
  runState.allMonthResults = Array.from({ length: 28 }, (_, i) => fake(Math.floor(i / 7) + 1, (i % 7) + 1));
  runState.weekSigs = regularRecipes().slice(0, WEEK_RECIPE_GOALS[3]).map((sg) => sg.id);
  runState.monthCounted = false;
  saveRunState();
  switchScreen("screen-game");
  showEpilogueModal(true);
  showToast(`🛠️ DEV: mô phỏng hết 28 đêm (${mode}). Bấm nút cuối trong bảng tổng kết để xem tiếp.`);
}

/* Tự kiểm tra kịch bản: người nói có đang ở trong quán không, ai vào/ra trùng lặp, ly riêng cho từng khách,
   lựa chọn đủ 3 phương án, biến thể thoại có bản dự phòng, đồng hồ không lùi (trừ khi qua nửa đêm), mỗi đêm đúng 1 lá bài,
   không lặp nguyên văn một câu dài giữa hai đêm, và không lộ chuyện bệnh tật / cánh cửa thứ hai trong truyện chính. */
function devLintStory() {
  const issues = [];
  const seen = new Map();
  const toMin = (t) => { const [h, m] = String(t).split(":").map(Number); return h * 60 + m; };
  const flat = (x) => (typeof x === "string" ? x : Object.values(x || {}).join(" | "));
  STORY_NIGHTS.forEach((n, i) => {
    const tag = `Đêm ${i + 1} (${n.title})`;
    const add = (m) => issues.push(`${tag}: ${m}`);
    const present = new Set();
    const brewed = new Set();
    const spoke = new Set();
    let last = toMin(n.t0);
    let cards = 0;
    const scan = (t, si) => {
      if (t && typeof t === "object" && !("d" in t) && !("h" in t)) add(`biến thể thiếu bản dự phòng (bước ${si})`);
      const all = flat(t);
      if (/ung thư|hóa trị|xạ trị|khối u|di căn/i.test(all)) add(`nhắc bệnh nặng trong truyện chính (bước ${si})`);
      if (/cánh cửa thứ hai/i.test(all)) add(`lộ "cánh cửa thứ hai" trong truyện chính (bước ${si})`);
      all.split(" | ").forEach((p) => {
        const key = p.trim();
        if (key.length > 40) { if (seen.has(key)) add(`lặp nguyên văn với đêm ${seen.get(key)} (bước ${si})`); else seen.set(key, i + 1); }
      });
    };
    n.steps.forEach((st, si) => {
      const k = st[0];
      if (k === "@") {
        const m = toMin(st[1]);
        if (m < last - 300 === false && m < last && last - m < 720) add(`đồng hồ lùi ${last}→${m} (bước ${si})`);
        last = m;
      } else if (k === "+") {
        if (present.has(st[1])) add(`${st[1]} vào quán hai lần (bước ${si})`);
        if (!n.guests.includes(st[1])) add(`${st[1]} vào quán nhưng không nằm trong danh sách khách`);
        present.add(st[1]);
      } else if (k === "-") {
        if (!present.has(st[1])) add(`${st[1]} rời quán khi chưa có mặt (bước ${si})`);
        present.delete(st[1]);
      } else if (k === "card") cards++;
      else if (k === "?") {
        for (let j = 2; j < 5; j++) {
          const o = st[j];
          if (!o || o.length !== 3 || o.some((x) => !x)) { add(`lựa chọn ${j - 1} thiếu nội dung (bước ${si})`); continue; }
          if (o[1] !== "host" && !present.has(o[1])) add(`${o[1]} đáp lại nhưng không có mặt (bước ${si})`);
          scan(o[2], si);
        }
      } else if (k === "brew") {
        if (!present.has(st[1])) add(`ly riêng cho ${st[1]} khi chưa có mặt (bước ${si})`);
        brewed.add(st[1]);
        scan(st[2], si); scan(st[3], si);
      } else {
        if (k !== "host" && k !== "sys") {
          if (!present.has(k)) add(`${k} nói khi chưa vào/đã rời quán (bước ${si})`);
          spoke.add(k);
        }
        scan(st[1], si);
      }
    });
    if (cards !== 1) add(`có ${cards} lá bài (cần đúng 1)`);
    n.guests.forEach((g) => {
      if (!spoke.has(g)) add(`${g} không nói câu nào`);
      if (n.n !== 7 || n.ch !== 4) { if (!brewed.has(g)) add(`${g} chưa có ly riêng`); }
    });
  });
  const box = document.getElementById("history-body");
  const title = document.getElementById("history-title");
  if (!box || !title) { window.alert(issues.length ? issues.join("\n") : "Không phát hiện lỗi"); return; }
  title.textContent = `🔎 Kiểm tra kịch bản — ${issues.length ? issues.length + " điểm cần xem" : "không phát hiện lỗi"}`;
  box.innerHTML = issues.length
    ? issues.map((x) => `<div class="p-2.5 rounded-xl bg-rose-950/40 border border-rose-500/30 text-xs text-rose-100">${escapeHtml(x)}</div>`).join("")
    : `<div class="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-xs text-emerald-100">✅ 28 đêm: người nói đều đang ở trong quán, mỗi đêm đúng 1 lá bài, mọi khách đều có ly riêng, không lặp câu dài, không lộ chuyện bệnh hay cánh cửa thứ hai.</div>`;
  openModal("modal-history");
}

function devForceWeekEnd() {
  const v = window.prompt("Kết thúc ngay tuần số mấy? (1–4)\nNếu tuần này chưa pha đủ số ly của tuần đó (T1: 1, T2–4: 2) sẽ hiện màn 'chưa đạt mục tiêu'.", "1");
  const w = Math.floor(Number(v));
  if (!w || w < 1 || w > 4) return;
  ["modal-history", "modal-epilogue", "modal-finale", "mobile-drawer"].forEach(closeModal);
  if (!runState) runState = createNewRunState();
  const fake = (wk, n) => ({ weekNum: wk, nightInWeek: n, guestNames: "Khách thử nghiệm", drinkName: "—", endingTitle: "Kết đêm (dev)", pathTag: "🛠️ DEV", summary: "Đêm giả lập để thử màn tổng kết." });
  runState.nightIndex = w * 7;
  runState.awaitingNightStart = true;
  runState.beatIndex = 0;
  runState.retryWeek = 0;
  runState.weekResults = Array.from({ length: 7 }, (_, i) => fake(w, i + 1));
  runState.allMonthResults = Array.from({ length: w * 7 }, (_, i) => fake(Math.floor(i / 7) + 1, (i % 7) + 1));
  runState.monthCounted = false;
  saveRunState();
  switchScreen("screen-game");
  startNight(w * 7);
}

function initDevTools() {
  try {
    const q = new URLSearchParams(window.location.search).get("dev");
    if (q === "1") safeSetItem(DEV_FLAG_KEY, "1");
    else if (q === "0") {
      if (safeGetItem(DEV_BACKUP_KEY)) devRestoreBackup();
      safeSetItem(DEV_FLAG_KEY, "0");
    }
  } catch (err) { /* bỏ qua */ }
  document.addEventListener("keydown", (e) => {
    if (e.ctrlKey && e.shiftKey && (e.key === "D" || e.key === "d")) {
      e.preventDefault();
      devSetMode(!isDevMode());
    }
  });
  renderDevTools();
}

if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initDevTools);
else initDevTools();
