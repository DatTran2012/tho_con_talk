"use strict";
/* Sổ Tay Của Thỏ Con: gộp 14 cửa sổ sưu tầm rời rạc thành MỘT cửa sổ có 4 tab.
   Không đổi logic cũ: các hàm openXxxModal() vẫn chạy như trước, chỉ là openModal("modal-xxx") được chuyển hướng
   vào đúng tab của Sổ Tay. Nút cũ trong menu được chuyển thành "chip" phụ ở đầu tab (giữ nguyên số đếm). */
(function () {
  const TABS = [
    { id: "guest", icon: "📖", label: "Khách", subs: [
      ['[data-drawer-action="dossiers"]', "modal-dossiers"],
      ['[data-drawer-action="keepsakes"]', "modal-keepsakes"],
      ['[data-drawer-action="postcards"]', "modal-postcards"],
      ['[data-drawer-action="cat-diary"]', "modal-cat-diary"],
      ['[data-drawer-action="notes"]', "modal-notes"]] },
    { id: "drink", icon: "🍹", label: "Ly Nước", subs: [
      ['[data-drawer-action="album"]', "modal-album"],
      ['[data-drawer-action="drink-deck"]', "modal-drink-deck"]] },
    { id: "story", icon: "🎬", label: "Câu Chuyện", subs: [
      ['[data-drawer-action="endings"]', "modal-endings-gallery"],
      ['[data-drawer-action="cutscenes"]', "modal-cutscenes"],
      ["#btn-drawer-history", "modal-history"],
      ['[data-drawer-action="flowchart"]', "modal-flowchart"]] },
    { id: "achv", icon: "🏆", label: "Thành Tựu", subs: [
      ['[data-drawer-action="achievements"]', "modal-achievements"],
      ['[data-drawer-action="easter-eggs"]', "modal-easter-eggs"],
      ['[data-drawer-action="secrets"]', "modal-secrets"]] },
    { id: "shop", icon: "🏠", label: "Quán", subs: [] }   // Custom Quán · Băng Cassette · Mùa & Âm nhạc (tách từ modal-ambience)
  ];
  const root = document.createElement("div");
  root.id = "modal-journal";
  root.setAttribute("data-modal-overlay", "true");
  root.className = "hidden fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4";
  root.innerHTML = `
    <div class="journal-book w-full max-w-3xl rounded-3xl flex flex-col">
      <div class="journal-head">
        <div class="min-w-0">
          <h3 class="font-serif-story text-lg sm:text-xl font-bold text-amber-100">📖 Sổ Tay Của Thỏ Con</h3>
          <div class="flex items-center gap-2 mt-1"><div class="journal-bar"><i data-progress-bar style="width:0%"></i></div><span class="text-[11px] font-mono-code text-amber-300" data-progress-percent>0%</span></div>
        </div>
        <button type="button" data-close-modal="modal-journal" class="journal-x" aria-label="Đóng">✕</button>
      </div>
      <div class="journal-tabs" id="journal-tabs"></div>
      <div class="journal-subs" id="journal-subs"></div>
      <div class="journal-panes" id="journal-panes"></div>
    </div>`;
  document.body.appendChild(root);
  const tabsEl = root.querySelector("#journal-tabs"), subsEl = root.querySelector("#journal-subs"), panesEl = root.querySelector("#journal-panes");
  const byModal = {};   // modalId -> { tab, btn, pane }
  TABS.forEach((t) => {
    const tb = document.createElement("button");
    tb.type = "button"; tb.className = "journal-tab"; tb.dataset.tab = t.id;
    tb.innerHTML = `<span class="text-base">${t.icon}</span><span>${t.label}</span>`;
    tb.addEventListener("click", () => {
      const first = t.row.querySelector(".journal-chip:not(.hidden)");
      if (first) first.click();
    });
    tabsEl.appendChild(tb);
    t.el = tb;
    const row = document.createElement("div");
    row.className = "journal-subrow hidden"; row.dataset.tab = t.id;
    subsEl.appendChild(row);
    t.row = row;
    t.subs.forEach(([sel, mid]) => {
      const btn = document.querySelector(sel), modal = document.getElementById(mid);
      if (!btn || !modal || !modal.firstElementChild) return;
      const pane = modal.firstElementChild;
      const x = pane.querySelector("[data-close-modal]"); if (x) x.style.display = "none";
      pane.className = "journal-pane flex-col min-h-0";
      pane.style.display = "none";
      panesEl.appendChild(pane);
      btn.className = "journal-chip";
      row.appendChild(btn);
      byModal[mid] = { tab: t, btn, pane };
    });
  });
  // ---- Tab "Quán": tách cửa sổ 4 Mùa & Quán thành 3 ngăn riêng, mỗi ngăn một chip ----
  const shopTab = TABS.find((x) => x.id === "shop");
  (function buildShop() {
    const amb = document.getElementById("modal-ambience");
    const body = amb && amb.querySelector(".overflow-y-auto");
    if (!body || body.children.length < 4) return;
    const [cSound, cSeason, cCustom, cCass] = [...body.children];
    const autoCafe = document.getElementById("btn-toggle-auto-cafe");
    const mkPane = (title, desc, nodes) => {
      const p = document.createElement("div");
      p.className = "journal-pane flex-col min-h-0"; p.style.display = "none";
      p.innerHTML = `<div class="pb-2"><h3 class="font-serif-story text-lg font-bold text-sky-200">${title}</h3><p class="text-[11px] text-stone-400">${desc}</p></div><div class="overflow-y-auto py-3 space-y-4 pr-1 text-xs"></div>`;
      nodes.forEach((n) => n && p.lastElementChild.appendChild(n));
      panesEl.appendChild(p);
      return p;
    };
    const wrapAuto = autoCafe ? (() => { const d = document.createElement("div"); d.className = "flex justify-end"; d.appendChild(autoCafe); return d; })() : null;
    const defs = [
      ["modal-ambience", "🌦️ Mùa & Âm Nhạc", mkPane("🌦️ Mùa & Âm Nhạc Quán", "Chọn kênh nhạc lo-fi, âm lượng thiên nhiên và mùa ngoài ô cửa kính", [cSound, cSeason]), null],
      ["modal-custom-cafe", "🎨 Custom Quán", mkPane("🎨 Custom Không Gian Quán", "Đổi ánh đèn, mặt quầy gỗ và góc trang trí ngay trên sân khấu", [wrapAuto, cCustom]), null],
      ["modal-cassettes", "📼 Băng Cassette", mkPane("📼 Băng Cassette Khách Tặng", "Mỗi vị khách để lại một cuốn băng — nghe lại bất cứ lúc nào", [cCass]), "#mobile-cassette-badge"]
    ];
    defs.forEach(([mid, label, pane, badgeSel]) => {
      const btn = document.createElement("button");
      btn.type = "button"; btn.className = "journal-chip";
      btn.innerHTML = `<span>${label}</span>${badgeSel ? '<span data-jbadge></span>' : ""}`;
      btn.addEventListener("click", () => { if (typeof openAmbienceModal === "function") openAmbienceModal(); show(mid); });
      shopTab.row.appendChild(btn);
      byModal[mid] = { tab: shopTab, btn, pane, badgeSel };
    });
  })();
  let current = "";
  function show(mid) {
    const e = byModal[mid]; if (!e) return false;
    current = mid;
    TABS.forEach((t) => { t.el.classList.toggle("on", t === e.tab); t.row.classList.toggle("hidden", t !== e.tab); });
    Object.entries(byModal).forEach(([id, x]) => { x.btn.classList.toggle("on", id === mid); x.pane.style.display = id === mid ? "flex" : "none"; });
    const bs = e.badgeSel && document.querySelector(e.badgeSel), bt = e.btn.querySelector("[data-jbadge]");
    if (bt && bs) bt.textContent = bs.textContent;
    root.classList.remove("hidden");
    return true;
  }
  const _open = openModal, _close = closeModal;
  openModal = function (id) { if (!show(id)) _open(id); };
  closeModal = function (id) {
    if (byModal[id]) { if (current === id) { root.classList.add("hidden"); current = ""; } return; }
    if (id === "modal-journal") current = "";
    _close(id);
  };
  window.openJournal = function (tabId) {
    const t = TABS.find((x) => x.id === (tabId || "guest")) || TABS[0];
    t.el.click();
  };
  const openBtn = document.getElementById("btn-open-journal");
  if (openBtn) openBtn.addEventListener("click", () => { closeModal("mobile-drawer"); window.openJournal("guest"); });
})();
