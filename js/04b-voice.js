"use strict";

/* -----------------------------------------------------------------------
   SECTION 4b: GIỌNG ĐỌC (Web Speech API — không cần tải thêm file nào)
   Bật/tắt, tốc độ và giọng đọc chỉnh trong Menu → 🗣️ Giọng Đọc.
------------------------------------------------------------------------ */
const CafeVoice = (() => {
  const supported = typeof window !== "undefined" && "speechSynthesis" in window && typeof window.SpeechSynthesisUtterance === "function";
  let voices = [];
  let warnedNoVietnamese = false;
  let speakToken = 0;

  function loadVoices() {
    if (!supported) return;
    voices = window.speechSynthesis.getVoices() || [];
  }

  if (supported) {
    loadVoices();
    // Chrome nạp danh sách giọng bất đồng bộ
    if (typeof window.speechSynthesis.addEventListener === "function") {
      window.speechSynthesis.addEventListener("voiceschanged", loadVoices);
    } else {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }

  function vietnameseVoices() {
    return voices.filter((v) => /^vi([-_]|$)/i.test(v.lang || ""));
  }

  function pickVoice() {
    const list = vietnameseVoices();
    if (!list.length) return null;
    const wanted = persistentArchive.voiceName;
    return list.find((v) => v.name === wanted) || list[0];
  }

  /* Bỏ emoji, ký hiệu và định dạng để giọng đọc không đọc thành chữ lạ */
  function cleanText(text) {
    return String(text || "")
      .replace(/<[^>]*>/g, " ")
      .replace(/[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}\u{FE0F}\u{200D}]/gu, "")
      .replace(/[“”"«»]/g, "")
      .replace(/\s*[—–]\s*/g, ", ")
      .replace(/\.{2,}|…/g, ". ")
      .replace(/\s+/g, " ")
      .trim();
  }

  /* Chia câu để tránh lỗi Chrome tự ngắt các đoạn dài */
  function splitChunks(text) {
    const parts = text.match(/[^.!?\n]+[.!?]*/g) || [text];
    const chunks = [];
    let cur = "";
    parts.forEach((p) => {
      if ((cur + p).length > 170 && cur) {
        chunks.push(cur.trim());
        cur = p;
      } else {
        cur += p;
      }
    });
    if (cur.trim()) chunks.push(cur.trim());
    return chunks;
  }

  /* Mỗi nhân vật một cao độ riêng để dễ phân biệt người nói */
  function pitchFor(speaker) {
    const name = String(speaker || "");
    if (!name) return 1;
    let h = 0;
    for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) % 997;
    return 0.85 + (h % 36) / 100; // 0.85 – 1.20
  }

  let pending = null; // câu bị trình duyệt chặn vì chưa có thao tác người dùng
  let errorToastShown = false;
  const liveUtterances = []; // giữ tham chiếu: Chrome có lỗi tự thu gom utterance đang đọc

  function stop() {
    speakToken++;
    pending = null;
    liveUtterances.length = 0;
    if (supported) window.speechSynthesis.cancel();
  }

  function speak(text, speaker, force = false) {
    if (!supported) return false;
    if (!force && !persistentArchive.voiceEnabled) return false;
    stop();
    const clean = cleanText(text);
    if (!clean) return false;
    if (!voices.length) loadVoices();
    const voice = pickVoice();
    if (!voice && !warnedNoVietnamese) {
      warnedNoVietnamese = true;
      if (typeof showToast === "function") {
        showToast("🗣️ Thiết bị chưa có giọng tiếng Việt; sẽ dùng giọng mặc định (có thể đọc chưa chuẩn).");
      }
    }
    const token = speakToken;
    const pitch = pitchFor(speaker);
    const rate = Math.min(1.4, Math.max(0.6, Number(persistentArchive.voiceRate) || 0.95));
    const chunks = splitChunks(clean);
    // Chrome hay nuốt câu nếu speak() ngay sau cancel(): chờ một nhịp ngắn rồi mới đọc.
    setTimeout(() => {
      if (token !== speakToken) return;
      const synth = window.speechSynthesis;
      if (synth.paused) synth.resume();
      chunks.forEach((chunk) => {
        const u = new window.SpeechSynthesisUtterance(chunk);
        u.lang = "vi-VN";
        if (voice) u.voice = voice;
        u.rate = rate;
        u.pitch = pitch;
        u.onend = () => {
          const i = liveUtterances.indexOf(u);
          if (i >= 0) liveUtterances.splice(i, 1);
        };
        u.onerror = (ev) => {
          const err = ev && ev.error;
          if (err === "not-allowed") {
            pending = { text, speaker };
            return;
          }
          if (err && err !== "canceled" && err !== "interrupted" && !errorToastShown) {
            errorToastShown = true;
            if (typeof showToast === "function") showToast(`🗣️ Giọng đọc không phát được (${err}). Thử đổi giọng trong Menu.`);
          }
        };
        liveUtterances.push(u);
        synth.speak(u);
      });
    }, 90);
    return true;
  }

  // Lần chạm đầu tiên của người chơi: đọc lại câu bị trình duyệt chặn trước đó
  window.addEventListener(
    "pointerdown",
    () => {
      if (pending && persistentArchive.voiceEnabled) {
        const p = pending;
        pending = null;
        speak(p.text, p.speaker);
      }
    },
    true
  );

  return { supported, speak, stop, vietnameseVoices, loadVoices, cleanText, splitChunks };
})();

window.addEventListener("pagehide", () => CafeVoice.stop());
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "hidden") CafeVoice.stop();
});
