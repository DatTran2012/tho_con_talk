"use strict";

/* Gộp 4 chương thành STORY_NIGHTS (28 đêm) và tạo cảnh mở đầu cho từng đêm. Phải nạp trước js/03-state.js. */
const STORY_NIGHTS = [...STORY_CH1, ...STORY_CH2, ...STORY_CH3, ...STORY_CH4];

STORY_NIGHTS.forEach((s) => {
  const chapter = STORY_CHAPTERS[s.ch - 1];
  CUTSCENE_CATALOG.push({
    id: `story_${s.ch}_${s.n}`,
    icon: s.icon,
    location: `CHƯƠNG ${s.ch} • ${chapter.name.toUpperCase()} • ĐÊM ${s.n}`,
    title: s.title,
    caption: s.intro.join("\n\n"),
    pages: s.intro.map((text, i) => ({ icon: i === 0 ? s.icon : "🏮", text }))
  });
});
