"use strict";

/* -----------------------------------------------------------------------
   SECTION 3: PERSISTENT ARCHIVE & 28-NIGHT MONTHLY SCHEDULE STATE
------------------------------------------------------------------------ */
function createDefaultArchive() {
  return {
    playthroughCount: 0,
    completedModes: {},
    totalDrinksServed: 0,
    perfectBrewsCount: 0,
    petCatCount: 0,
    selectedTitleId: "auto",
    selectedShiftMode: "standard",
    selectedSeasonTheme: "autumn_rain",
    autoCycleSeasons: false,
    visitedSeasons: { autumn_rain: true },
    cafeCustom: {
      lantern: "lantern_classic",
      counter: "wood_oak",
      decor: "decor_seasonal"
    },
    selectedLofiChannel: "seasonal_auto",
    rainVolume: 0.45,
    unlockedEndings: {},
    unlockedCutscenes: { origin_thocon_1: true },
    unlockedKeepsakes: {},
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
    twistAnnounced: false
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
    completedModes: safeObj(rawObj.completedModes, {}),
    visitedSeasons: { ...def.visitedSeasons, ...safeObj(rawObj.visitedSeasons, {}) },
    cafeCustom: { ...def.cafeCustom, ...safeObj(rawObj.cafeCustom, {}) },
    unlockedEndings: safeObj(rawObj.unlockedEndings, {}),
    unlockedCutscenes: { origin_thocon_1: true, ...safeObj(rawObj.unlockedCutscenes, {}) },
    unlockedKeepsakes: safeObj(rawObj.unlockedKeepsakes, {}),
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
    twistAnnounced: Boolean(rawObj.twistAnnounced)
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
  safeSetItem(STORAGE_KEY_ARCHIVE, JSON.stringify(persistentArchive));
}

function isShiftModeUnlocked(modeId) {
  if (modeId === "standard") return true;
  if (modeId === "duo_fest") {
    return Boolean(persistentArchive.completedModes.standard) || (persistentArchive.playthroughCount || 0) >= 1;
  }
  if (modeId === "midnight_mysteries") {
    return Boolean(persistentArchive.completedModes.duo_fest) || (persistentArchive.playthroughCount || 0) >= 2;
  }
  return false;
}

function generateOneMonthSchedule(shiftMode = "standard") {
  const duoOrder = shuffleArray(ALL_DUO_KEYS);
  const soloCycle1 = shuffleArray(STANDARD_GUEST_ORDER);
  const soloCycle2 = shuffleArray(STANDARD_GUEST_ORDER);
  const extraSoloPool = shuffleArray(STANDARD_GUEST_ORDER);
  const extraDuoPool = shuffleArray(ALL_DUO_KEYS);

  const weeks = [];
  let duoPtr = 0;
  let solo1Ptr = 0;
  let solo2Ptr = 0;
  let extraSoloPtr = 0;
  let extraDuoPtr = 0;

  for (let w = 0; w < 4; w++) {
    const weekSlots = new Array(7).fill(null);
    const duoCountThisWeek = shiftMode === "duo_fest" ? (w < 2 ? 3 : 2) : w < 2 ? 2 : 1;
    const duoPositions = duoCountThisWeek === 3 ? [1, 3, 5] : duoCountThisWeek === 2 ? [2, 4] : [3];

    duoPositions.forEach((pos) => {
      const dk = duoPtr < duoOrder.length ? duoOrder[duoPtr++] : extraDuoPool[extraDuoPtr++ % extraDuoPool.length];
      weekSlots[pos] = {
        type: "duo",
        duoId: dk,
        guests: [...DUO_PAIRINGS[dk].guests]
      };
    });

    for (let d = 0; d < 7; d++) {
      if (!weekSlots[d]) {
        let gid = null;
        if (solo1Ptr < soloCycle1.length) {
          gid = soloCycle1[solo1Ptr++];
        } else if (solo2Ptr < soloCycle2.length) {
          gid = soloCycle2[solo2Ptr++];
        } else {
          gid = extraSoloPool[extraSoloPtr++ % extraSoloPool.length];
        }
        weekSlots[d] = {
          type: "solo",
          duoId: null,
          guests: [gid]
        };
      }
    }
    weeks.push(...weekSlots);
  }

  return weeks;
}

function createNewRunState() {
  const mode = isShiftModeUnlocked(persistentArchive.selectedShiftMode)
    ? persistentArchive.selectedShiftMode
    : "standard";
  return {
    shiftMode: mode,
    schedule: generateOneMonthSchedule(mode),
    nightIndex: 0,
    beatIndex: 0,
    subBeat: 0,
    trust: 0,
    clarity: 0,
    bond: 0,
    nightStances: [],
    weeklyStanceCounts: { heart: 0, mind: 0, silent: 0, duo: 0, duo_heart: 0, duo_mind: 0 },
    monthlyStanceCounts: { heart: 0, mind: 0, silent: 0, duo: 0, duo_heart: 0, duo_mind: 0 },
    usedEncounterIds: [],
    activeEncounter: null,
    duoSecondGuestPresent: false,
    beat2CutscenePlayed: false,
    lastChoiceReplyText: "",
    lastDrinkName: "",
    lastBrewQuality: "",
    lastDrinkReflectionText: "",
    lastDrinkCardMode: "",
    drawnCardData: null,
    dialogueLog: [],
    weekResults: [],
    allMonthResults: [],
    previousNightRadioNews: "",
    awaitingNightStart: true,
    encounterReplyText: "",
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
      (s.type === "solo" || (s.type === "duo" && DUO_PAIRINGS[s.duoId]))
  );
  if (!valid) return null;
  const base = createNewRunState();
  base.awaitingNightStart = false;
  return { ...base, ...parsed, nightIndex: Math.max(0, Math.min(28, Math.floor(parsed.nightIndex))) };
}

let runState = loadRunState();
let activeBrewAnimId = null;

function cancelActiveBrewAnimation() {
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
  if (slot.type === "duo" && runState && !runState.duoSecondGuestPresent) {
    return [guests[0]];
  }
  return guests;
}

/* ---- Helper đếm tiến độ sưu tầm (dùng chung cho HUD, bí mật, thành tựu) ---- */
const TOTAL_ENDINGS = 33;

function countUnlockedEndings(archive = persistentArchive) {
  return Object.keys(archive.unlockedEndings).length;
}

function getDiscoveredEggs(archive = persistentArchive) {
  return EASTER_EGGS.filter((e) => archive.discoveredEasterEggs[e.id]);
}
