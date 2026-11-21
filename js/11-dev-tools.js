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
  ALL_DUO_KEYS.forEach((dk) => {
    a.unlockedEndings[`duo_${dk}_heart`] = true;
    a.unlockedEndings[`duo_${dk}_mind`] = true;
  });
  all(CUTSCENE_CATALOG, a.unlockedCutscenes);
  all(DRINK_CARDS, a.unlockedDrinkCards);
  all(SIGNATURE_RECIPES, a.unlockedSignatures);
  all(EASTER_EGGS, a.discoveredEasterEggs);
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
  a.playthroughCount = Math.max(a.playthroughCount || 0, 3);
  a.totalDrinksServed = Math.max(a.totalDrinksServed || 0, 100);
  a.perfectBrewsCount = Math.max(a.perfectBrewsCount || 0, 50);
  a.petCatCount = Math.max(a.petCatCount || 0, 20);
  a.clockTapCount = Math.max(a.clockTapCount || 0, 20);
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
    btn("unlock", "🔓 Mở khóa TẤT CẢ (33 kết, bí mật, cutscene…)") +
    btn("restore", "♻️ Khôi phục save thật") +
    btn("secret", "🌟 Đặt sẵn điều kiện cho kết bí mật (giữ twist chưa xem)") +
    btn("story", "📖 Đọc toàn bộ hội thoại 28 đêm") +
    btn("jump", "⏭️ Chơi thử từ một đêm bất kỳ…") +
    btn("recipes", "🍹 Đặt số công thức nước đã biết (0–8)…") +
    btn("weekend", "📅 Kết thúc ngay tuần n (kiểm tra cổng công thức)…") +
    btn("finale", "🏁 Xem trang cảm ơn hết 28 đêm") +
    btn("picker", "🔁 Mở bảng chọn đêm chơi lại") +
    btn("lockch", "🔒 Khóa lại chương (chỉ còn Chương 1) + bỏ lá bài ẩn") +
    btn("hidden17", "🎴 Mở/khóa lá bài 17 + Ly Cánh Cửa Thứ Hai") +
    btn("thanks", "🎖️ Xem trang chúc mừng (xem trước)") +
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
    else if (k === "jump") devJumpToNight();
    else if (k === "recipes") devSetRecipeCount();
    else if (k === "weekend") devForceWeekEnd();
    else if (k === "hidden17") {
      const on = !persistentArchive.unlockedDrinkCards.dc_17;
      if (on) { persistentArchive.unlockedDrinkCards.dc_17 = true; persistentArchive.unlockedSignatures.sig_second_door = true; persistentArchive.unlockedSecrets.secret_card_17 = true; persistentArchive.unlockedSecrets.secret_signature = true; }
      else { delete persistentArchive.unlockedDrinkCards.dc_17; delete persistentArchive.unlockedSignatures.sig_second_door; delete persistentArchive.unlockedSecrets.secret_card_17; delete persistentArchive.unlockedSecrets.secret_signature; }
      saveArchive();
      updateAllProgressBadges();
      showToast(on ? "🛠️ DEV: đã mở lá bài 17 + ly Cánh Cửa Thứ Hai" : "🛠️ DEV: đã khóa lại lá bài 17 + ly ẩn");
    }
    else if (k === "finale") showFinalePage();
    else if (k === "picker") openReplayPicker();
    else if (k === "lockch") {
      persistentArchive.maxChapter = 1;
      persistentArchive.completedModes = {};
      delete persistentArchive.unlockedDrinkCards.dc_17;
      delete persistentArchive.unlockedSignatures.sig_second_door;
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
  const v = window.prompt(`Số công thức nước đã khám phá (0–${reg.length}).\nMục tiêu: hết tuần 1/2/3/4 cần 1/3/5/7.`, "0");
  if (v === null) return;
  const n = Math.max(0, Math.min(reg.length, Math.floor(Number(v)) || 0));
  reg.forEach((sig, i) => {
    if (i < n) persistentArchive.unlockedSignatures[sig.id] = true;
    else delete persistentArchive.unlockedSignatures[sig.id];
  });
  saveArchive();
  updateAllProgressBadges();
  showToast(`🛠️ DEV: đang có ${n}/${reg.length} công thức nước`);
}

function devForceWeekEnd() {
  const v = window.prompt("Kết thúc ngay tuần số mấy? (1–4)\nNếu chưa đủ công thức nước sẽ hiện màn 'chưa đạt mục tiêu'.", "1");
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
