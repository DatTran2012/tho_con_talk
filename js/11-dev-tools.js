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
  panel.style.cssText = "position:fixed;left:8px;bottom:46px;z-index:99999;width:min(260px,86vw);padding:10px;border-radius:14px;background:#1c1917;color:#e7e5e4;border:1px solid #7c3aed;font:12px sans-serif;display:none";
  const btn = (id, label) => `<button type="button" data-dev="${id}" style="display:block;width:100%;margin-top:6px;padding:8px;border-radius:10px;background:#292524;border:1px solid #57534e;color:#e7e5e4;font-size:12px;cursor:pointer;text-align:left">${label}</button>`;
  panel.innerHTML = `<div style="font-weight:700;color:#c4b5fd">🛠️ Chế độ DEV (nội bộ)</div>` +
    btn("unlock", "🔓 Mở khóa TẤT CẢ (33 kết, bí mật, cutscene…)") +
    btn("restore", "♻️ Khôi phục save thật") +
    btn("secret", "🌟 Đặt sẵn điều kiện cho kết bí mật (giữ twist chưa xem)") +
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
    } else if (k === "restore") devRestoreBackup();
    else if (k === "off") {
      if (safeGetItem(DEV_BACKUP_KEY)) devRestoreBackup();
      devSetMode(false);
    }
  });
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
