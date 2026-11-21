"use strict";

/* -----------------------------------------------------------------------
   SECTION 9b: NHẬT KÝ CÁC ĐÊM — xem lại thoại và những lựa chọn đã chọn
   Mỗi đêm hoàn thành được lưu riêng (khóa localStorage riêng để không làm phình sổ lưu trữ chính).
------------------------------------------------------------------------ */
const STORAGE_KEY_HISTORY = "tho_con_talk_history_v1";
const HISTORY_MAX_NIGHTS = 90;
const HISTORY_MAX_LINES = 120;

function loadNightHistory() {
  try {
    const raw = safeGetItem(STORAGE_KEY_HISTORY);
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? arr : [];
  } catch (err) {
    return [];
  }
}

let nightHistory = loadNightHistory();

function saveNightHistory() {
  safeSetItem(STORAGE_KEY_HISTORY, JSON.stringify(nightHistory));
}

function clearNightHistory() {
  nightHistory = [];
  safeRemoveItem(STORAGE_KEY_HISTORY);
}

/* Ghi một dòng vào nhật ký đêm đang chơi. entry: {type:"say"|"choice"|"drink", speaker?, avatar?, text} */
function recordNightLine(entry) {
  if (!runState || typeof twistStageMode !== "undefined" && twistStageMode) return;
  if (!Array.isArray(runState.nightLines)) runState.nightLines = [];
  const text = String(entry.text || "").trim().slice(0, 700);
  if (!text) return;
  const lines = runState.nightLines;
  const dup = lines.slice(-4).some((l) => l.type === entry.type && l.text === text && (l.speaker || "") === (entry.speaker || ""));
  if (dup) return;
  lines.push({ type: entry.type, speaker: entry.speaker || "", avatar: entry.avatar || "", text });
  if (lines.length > HISTORY_MAX_LINES) lines.shift();
}

function commitNightHistory(info) {
  if (!runState) return;
  nightHistory.push({
    id: `${Date.now()}_${nightHistory.length}`,
    modeName: (SHIFT_MODES.find((m) => m.id === runState.shiftMode) || {}).name || "",
    nightNum: info.nightNum,
    weekNum: info.weekNum,
    nightInWeek: info.nightInWeek,
    guests: info.guests,
    endingTitle: info.endingTitle,
    pathTag: info.pathTag,
    lines: Array.isArray(runState.nightLines) ? runState.nightLines.slice() : []
  });
  while (nightHistory.length > HISTORY_MAX_NIGHTS) nightHistory.shift();
  runState.nightLines = [];
  saveNightHistory();
}

function renderHistoryList() {
  const box = document.getElementById("history-body");
  const title = document.getElementById("history-title");
  title.textContent = "🗓️ Xem Lại Các Đêm";
  box.innerHTML = "";
  const items = [];
  if (runState && Array.isArray(runState.nightLines) && runState.nightLines.length) {
    items.push({ label: `🌙 Đêm ${Math.min(28, runState.nightIndex + 1)} — đang diễn ra`, sub: "Chưa kết thúc", lines: runState.nightLines });
  }
  nightHistory.slice().reverse().forEach((n) => {
    items.push({
      label: `Đêm ${n.nightNum} • Tuần ${n.weekNum} • ${n.guests}`,
      sub: `${n.modeName ? n.modeName + " • " : ""}${n.endingTitle || ""}`,
      lines: n.lines
    });
  });
  if (!items.length) {
    box.innerHTML = `<div class="text-stone-400 text-xs">Chưa có đêm nào được ghi lại. Hãy chơi hết một đêm rồi quay lại đây nhé.</div>`;
    return;
  }
  items.forEach((it) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "w-full text-left p-3 rounded-2xl bg-stone-900/90 hover:bg-stone-800 border border-stone-700 cursor-pointer";
    const choices = it.lines.filter((l) => l.type === "choice").length;
    btn.innerHTML = `<div class="text-xs font-semibold text-amber-200">${escapeHtml(it.label)}</div>
      <div class="text-[11px] text-stone-400 mt-0.5">${escapeHtml(it.sub)} • ${it.lines.length} dòng • ${choices} lựa chọn</div>`;
    btn.addEventListener("click", () => renderHistoryDetail(it));
    box.appendChild(btn);
  });
}

function renderHistoryDetail(it) {
  const box = document.getElementById("history-body");
  document.getElementById("history-title").textContent = it.label;
  box.innerHTML = "";
  const back = document.createElement("button");
  back.type = "button";
  back.id = "btn-history-back";
  back.className = "min-h-[36px] px-3 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-700 text-xs text-stone-200 cursor-pointer";
  back.textContent = "← Danh sách các đêm";
  back.addEventListener("click", renderHistoryList);
  box.appendChild(back);
  it.lines.forEach((l) => {
    const el = document.createElement("div");
    if (l.type === "choice") {
      el.className = "p-2.5 rounded-xl bg-amber-500/10 border border-amber-400/40 text-xs text-amber-100";
      el.innerHTML = `<span class="font-semibold">👉 Bạn đã chọn:</span> ${escapeHtml(l.text)}`;
    } else if (l.type === "drink") {
      el.className = "p-2.5 rounded-xl bg-teal-500/10 border border-teal-400/35 text-xs text-teal-100";
      el.textContent = l.text;
    } else {
      el.className = "p-2.5 rounded-xl bg-stone-900/90 border border-stone-800 space-y-1 text-xs";
      el.innerHTML = `<div class="font-bold text-amber-200">${escapeHtml(l.avatar)} ${escapeHtml(l.speaker)}</div>
        <p class="text-stone-300 whitespace-pre-line">${escapeHtml(l.text)}</p>`;
    }
    box.appendChild(el);
  });
}

function openHistoryModal() {
  renderHistoryList();
  openModal("modal-history");
}

function bindNightHistoryEvents() {
  const area = document.getElementById("dialogue-action-area");
  if (!area) return;
  // Bắt mọi nút lựa chọn trực tiếp trong khung hành động (không tính các nút bên trong quầy pha chế)
  area.addEventListener(
    "click",
    (e) => {
      const b = e.target.closest("button");
      if (!b || b.parentElement !== area) return;
      const text = b.textContent.trim();
      if (!text || /^Tiếp/.test(text)) return;
      recordNightLine({ type: "choice", text });
    },
    true
  );
  const btn = document.getElementById("btn-drawer-history");
  if (btn) {
    btn.addEventListener("click", () => {
      closeModal("mobile-drawer");
      openHistoryModal();
    });
  }
}
