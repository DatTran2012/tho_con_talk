"use strict";

/* -----------------------------------------------------------------------
   SECTION 3: PERSISTENT ARCHIVE & 28-NIGHT MONTHLY SCHEDULE STATE
------------------------------------------------------------------------ */
function createDefaultArchive() {
  return {
    playthroughCount: 0,
    completedModes: {},
    maxChapter: 1,
    totalDrinksServed: 0,
    perfectBrewsCount: 0,
    petCatCount: 0,
    selectedTitleId: "auto",
    selectedShiftMode: "standard",
    selectedSeasonTheme: "autumn_rain",
    autoCycleSeasons: true,
    autoCycleCafe: true,
    autoCycleV2: true,
    visitedSeasons: { autumn_rain: true },
    cafeCustom: {
      lantern: "lantern_classic",
      counter: "wood_oak",
      decor: "decor_seasonal"
    },
    selectedLofiChannel: "seasonal_auto",
    rainVolume: 0.45,
    voiceEnabled: true,
    voiceV2: true,
    autoAdvance: true,
    voiceRate: 0.95,
    voiceFemale: "",
    voiceMale: "",
    unlockedEndings: {},
    unlockedCutscenes: { origin_thocon_1: true },
    unlockedKeepsakes: {},
    shelfBooks: {},
    unlockedDrinkCards: {},
    unlockedSignatures: {},
    unlockedAchievements: {},
    unlockedCatDiary: {},
    unlockedCassettes: {},
    discoveredEasterEggs: {},
    postcards: {},
    drinkAlbum: [],
    stickyNotes: [],
    unlockedSecrets: {},
    clockTapCount: 0,
    twistEndingSeen: false,
    twistAnnounced: false,
    thanksSeen: false
  };
}

function sanitizeArchive(rawObj) {
  const def = createDefaultArchive();
  if (!rawObj || typeof rawObj !== "object") return def;

  const safeObj = (val, fallback) =>
    val && typeof val === "object" && !Array.isArray(val) ? { ...val } : fallback;

  const validSeason = SEASON_THEMES.some((s) => s.id === rawObj.selectedSeasonTheme)
    ? rawObj.selectedSeasonTheme
    : def.selectedSeasonTheme;

  const validMode = SHIFT_MODES.some((m) => m.id === rawObj.selectedShiftMode)
    ? rawObj.selectedShiftMode
    : def.selectedShiftMode;

  return {
    ...def,
    ...rawObj,
    selectedShiftMode: validMode,
    selectedSeasonTheme: validSeason,
    rainVolume: Math.min(1, Math.max(0, Number(rawObj.rainVolume) || 0.45)),
    // Save cũ: bật giọng đọc một lần, sau đó giữ đúng lựa chọn của người chơi
    voiceEnabled: rawObj.voiceV2 ? Boolean(rawObj.voiceEnabled) : true,
    voiceV2: true,
    autoAdvance: rawObj.autoAdvance === undefined ? true : Boolean(rawObj.autoAdvance),
    voiceRate: Math.min(2.5, Math.max(0.6, Number(rawObj.voiceRate) || 0.95)),
    voiceFemale: typeof rawObj.voiceFemale === "string" ? rawObj.voiceFemale.slice(0, 120) : typeof rawObj.voiceName === "string" ? rawObj.voiceName.slice(0, 120) : "",
    voiceMale: typeof rawObj.voiceMale === "string" ? rawObj.voiceMale.slice(0, 120) : "",
    completedModes: safeObj(rawObj.completedModes, {}),
    maxChapter: Math.min(4, Math.max(1, Math.floor(Number(rawObj.maxChapter)) || 1)),
    visitedSeasons: { ...def.visitedSeasons, ...safeObj(rawObj.visitedSeasons, {}) },
    cafeCustom: { ...def.cafeCustom, ...safeObj(rawObj.cafeCustom, {}) },
    // Save cũ: bật tự đổi mùa/không gian quán một lần (sau đó người chơi tắt được trong menu Âm Thanh & Mùa)
    autoCycleSeasons: rawObj.autoCycleV2 ? Boolean(rawObj.autoCycleSeasons) : true,
    autoCycleCafe: rawObj.autoCycleV2 ? rawObj.autoCycleCafe !== false : true,
    autoCycleV2: true,
    unlockedEndings: safeObj(rawObj.unlockedEndings, {}),
    unlockedCutscenes: { origin_thocon_1: true, ...safeObj(rawObj.unlockedCutscenes, {}) },
    unlockedKeepsakes: safeObj(rawObj.unlockedKeepsakes, {}),
    shelfBooks: safeObj(rawObj.shelfBooks, {}),
    unlockedDrinkCards: safeObj(rawObj.unlockedDrinkCards, {}),
    unlockedSignatures: safeObj(rawObj.unlockedSignatures, {}),
    unlockedAchievements: safeObj(rawObj.unlockedAchievements, {}),
    unlockedCatDiary: safeObj(rawObj.unlockedCatDiary, {}),
    unlockedCassettes: safeObj(rawObj.unlockedCassettes, {}),
    discoveredEasterEggs: safeObj(rawObj.discoveredEasterEggs, {}),
    postcards: safeObj(rawObj.postcards, {}),
    drinkAlbum: Array.isArray(rawObj.drinkAlbum) ? rawObj.drinkAlbum.slice(0, 40) : [],
    stickyNotes: Array.isArray(rawObj.stickyNotes) ? rawObj.stickyNotes.slice(0, 35) : [],
    unlockedSecrets: safeObj(rawObj.unlockedSecrets, {}),
    clockTapCount: Math.max(0, Number(rawObj.clockTapCount) || 0),
    twistEndingSeen: Boolean(rawObj.twistEndingSeen),
    twistAnnounced: Boolean(rawObj.twistAnnounced),
    thanksSeen: Boolean(rawObj.thanksSeen)
  };
}

function loadArchive() {
  const raw = safeGetItem(STORAGE_KEY_ARCHIVE);
  if (!raw) return createDefaultArchive();
  try {
    return sanitizeArchive(JSON.parse(raw));
  } catch (err) {
    return createDefaultArchive();
  }
}

let persistentArchive = loadArchive();

function saveArchive() {
  if (typeof renderGameProgress === "function") renderGameProgress();
  safeSetItem(STORAGE_KEY_ARCHIVE, JSON.stringify(persistentArchive));
}

function isShiftModeUnlocked(modeId) {
  return modeId === "standard";
}

/* Lịch 28 đêm lấy trực tiếp từ kịch bản 4 chương (STORY_NIGHTS): mỗi đêm có khách và nội dung riêng. */
function buildStorySchedule() {
  return STORY_NIGHTS.map((s) => ({
    type: s.guests.length === 1 ? "solo" : s.guests.length === 2 ? "duo" : "trio",
    duoId: s.end && s.end.startsWith("duo:") ? s.end.slice(4) : null,
    guests: [...s.guests]
  }));
}

function createNewRunState() {
  const mode = isShiftModeUnlocked(persistentArchive.selectedShiftMode)
    ? persistentArchive.selectedShiftMode
    : "standard";
  return {
    shiftMode: mode,
    schedule: buildStorySchedule(),
    nightIndex: 0,
    beatIndex: 0,
    subBeat: 0,
    trust: 0,
    clarity: 0,
    bond: 0,
    nightStances: [],
    weeklyStanceCounts: { heart: 0, mind: 0, silent: 0, duo: 0, duo_heart: 0, duo_mind: 0 },
    monthlyStanceCounts: { heart: 0, mind: 0, silent: 0, duo: 0, duo_heart: 0, duo_mind: 0 },
    guestPath: {},
    weekSigs: [],
    presentGuests: [],
    pendingReply: null,
    brewDoneAt: -1,
    nightDrinks: [],
    currentBrewReflection: "",
    clock: "",
    lastDrinkName: "",
    lastBrewQuality: "",
    lastDrinkReflectionText: "",
    lastDrinkCardMode: "",
    drawnCardData: null,
    dialogueLog: [],
    nightLines: [],
    weekResults: [],
    allMonthResults: [],
    previousNightRadioNews: "",
    awaitingNightStart: true,
    monthCounted: false
  };
}

function loadRunState() {
  const raw = safeGetItem(STORAGE_KEY_RUN);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    if (!parsed || !Array.isArray(parsed.schedule) || parsed.schedule.length !== 28) return null;
    return normalizeRunState(parsed);
  } catch (err) {
    return null;
  }
}

function normalizeRunState(parsed) {
  if (!parsed || !Array.isArray(parsed.schedule) || parsed.schedule.length !== 28) return null;
  if (typeof parsed.nightIndex !== "number" || !isFinite(parsed.nightIndex)) return null;
  const valid = parsed.schedule.every(
    (s) =>
      s &&
      Array.isArray(s.guests) &&
      s.guests.length > 0 &&
      s.guests.every((id) => CHARACTERS[id]) &&
      (s.type === "solo" || s.type === "duo" || s.type === "trio")
  );
  if (!valid) return null;
  if (parsed.schedule.some((s, i) => !STORY_NIGHTS[i] || s.guests.join() !== STORY_NIGHTS[i].guests.join())) return null;
  const base = createNewRunState();
  base.awaitingNightStart = false;
  return { ...base, ...parsed, nightIndex: Math.max(0, Math.min(28, Math.floor(parsed.nightIndex))) };
}

let runState = loadRunState();
let activeBrewAnimId = null;

let activeBrewTimeouts = [];
function cancelActiveBrewAnimation() {
  activeBrewTimeouts.forEach((id) => clearTimeout(id));
  activeBrewTimeouts = [];
  if (activeBrewAnimId !== null) {
    cancelAnimationFrame(activeBrewAnimId);
    activeBrewAnimId = null;
  }
}

function saveRunState() {
  if (runState) safeSetItem(STORAGE_KEY_RUN, JSON.stringify(runState));
}

function getCurrentNightSlot() {
  if (!runState) return { type: "solo", duoId: null, guests: ["vy"] };
  return runState.schedule[runState.nightIndex] || { type: "solo", duoId: null, guests: ["vy"] };
}

function getCurrentNightGuests() {
  const slot = getCurrentNightSlot();
  return slot.guests.map((id) => CHARACTERS[id] || CHARACTERS.vy);
}

let twistStageMode = null; // null | "alone" | "all"

function getStageVisibleGuests() {
  if (twistStageMode === "alone") return [];
  if (twistStageMode === "all") return STANDARD_GUEST_ORDER.map((id) => CHARACTERS[id]);
  const slot = getCurrentNightSlot();
  const guests = getCurrentNightGuests();
  if (runState && Array.isArray(runState.presentGuests)) {
    return runState.presentGuests.map((id) => CHARACTERS[id]).filter(Boolean);
  }
  return guests;
}

/* ---- Helper đếm tiến độ sưu tầm (dùng chung cho HUD, bí mật, thành tựu) ---- */
const TOTAL_ENDINGS = 33;

/* Đếm số mục đã mở nhưng chỉ tính những mục còn nằm trong danh mục (tránh vượt tổng khi save cũ có id lạ) */
function countUnlockedIn(list, map) {
  return list.filter((x) => map && map[x.id]).length;
}

/* Tổng 9 ly: 7 ly thường + 2 ly bí mật của "Cánh Cửa Thứ Hai".
   Mục tiêu mỗi tuần: pha thành công số công thức độc quyền KHÁC NHAU trong tuần đó = 1 + 2 + 2 + 2 = 7. */
const WEEK_RECIPE_GOALS = [1, 2, 2, 2];
function weekGoalFor(weekIdx) {
  return WEEK_RECIPE_GOALS[Math.max(0, Math.min(3, weekIdx))];
}
function currentWeekGoal() {
  return weekGoalFor(runState ? Math.floor((runState.nightIndex || 0) / 7) : 0);
}
function regularRecipes() {
  return SIGNATURE_RECIPES.filter((s) => !s.hidden);
}
function secretRecipes() {
  return SIGNATURE_RECIPES.filter((s) => s.hidden);
}
function recipesDiscoveredCount(archive = persistentArchive) {
  return countUnlockedIn(regularRecipes(), archive.unlockedSignatures);
}
function weekRecipeCount() {
  return runState && Array.isArray(runState.weekSigs) ? runState.weekSigs.length : 0;
}
/* weekIdx: tuần vừa kết thúc (0–3). Mặc định: tuần của đêm hiện tại. */
function weekRecipeGoalMet(weekIdx) {
  const w = weekIdx === undefined ? Math.floor((runState ? runState.nightIndex : 0) / 7) : weekIdx;
  return weekRecipeCount() >= weekGoalFor(w);
}

function unlockShelfBook(gid) {
  if (!SHELF_BOOKS[gid] || !persistentArchive.shelfBooks) return;
  if (persistentArchive.shelfBooks[gid]) return;
  persistentArchive.shelfBooks[gid] = true;
  saveArchive();
  const full = Object.keys(SHELF_BOOKS).every((g) => persistentArchive.shelfBooks[g]);
  if (typeof showToast === "function") {
    showToast(full
      ? "📚 Kệ sách đã đầy: bảy cuốn, bảy người. Thỏ Con khẽ lau bụi từng gáy sách."
      : `📚 Kệ sách có thêm một cuốn: ${SHELF_BOOKS[gid].title}`);
  }
  if (full && typeof checkAndUnlockAchievements === "function") checkAndUnlockAchievements();
}

function openBookshelf() {
  const box = document.getElementById("history-body");
  const title = document.getElementById("history-title");
  if (!box || !title) return;
  const got = STANDARD_GUEST_ORDER.filter((g) => persistentArchive.shelfBooks && persistentArchive.shelfBooks[g]);
  title.textContent = `📚 Kệ Sách Của Quán — ${got.length}/${STANDARD_GUEST_ORDER.length}`;
  box.innerHTML =
    `<div class="text-xs text-stone-400 mb-2">Mỗi vị khách để lại một cuốn khi họ bước vào quán lần đầu.</div>` +
    STANDARD_GUEST_ORDER.map((g) => {
      const b = SHELF_BOOKS[g];
      const c = CHARACTERS[g];
      if (!persistentArchive.shelfBooks || !persistentArchive.shelfBooks[g]) {
        return `<div class="p-2.5 rounded-xl bg-stone-900/70 border border-stone-800 text-xs text-stone-500">📕 Một chỗ trống trên kệ… chờ một vị khách chưa ghé.</div>`;
      }
      return `<div class="p-2.5 rounded-xl bg-stone-900/90 border border-amber-500/25"><div class="text-sm text-amber-200 font-bold" style="border-left:4px solid ${c.outfitColor};padding-left:8px">${escapeHtml(b.title)}</div><div class="text-[11px] text-stone-400 mt-0.5">của ${escapeHtml(c.name)}</div><div class="text-xs text-stone-200 mt-1.5 italic">${escapeHtml(b.page)}</div></div>`;
    }).join("") +
    (got.length === STANDARD_GUEST_ORDER.length
      ? `<div class="p-3 rounded-xl bg-amber-950/40 border border-amber-400/40 text-xs text-amber-100 italic">Thỏ Con xếp bảy cuốn sách cạnh nhau, gáy sách đủ màu như bảy chiếc ghế quanh quầy. “Mỗi người đã để lại một trang ở đây. Cảm ơn vì đã cho mình giữ chúng.”</div>`
      : "");
  openModal("modal-history");
}

function countUnlockedEndings(archive = persistentArchive) {
  return Object.keys(archive.unlockedEndings).length;
}

function getDiscoveredEggs(archive = persistentArchive) {
  return EASTER_EGGS.filter((e) => archive.discoveredEasterEggs[e.id]);
}
