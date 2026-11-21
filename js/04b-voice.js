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

  /* Đoán giới tính của một giọng từ tên (Web Speech không cung cấp trường giới tính) */
  function guessGender(voice) {
    const n = (voice.name || "").toLowerCase();
    if (/nam ?minh|\bnam\b|male(?!.*fe)|\bman\b|đức|duc|hùng|hung|\bminh\b/.test(n) && !/female/.test(n)) return "m";
    if (/hoài ?my|hoai ?my|linh|\bmai\b|\blan\b|hương|huong|female|woman|\bnữ\b|google/.test(n)) return "f";
    return "?";
  }

  /* Chọn giọng theo giới tính nhân vật: ưu tiên lựa chọn của người chơi, rồi đoán theo tên,
     cuối cùng chia đôi danh sách (giọng đầu = nữ, giọng sau = nam). */
  function pickVoice(gender = "f") {
    const list = vietnameseVoices();
    if (!list.length) return null;
    const chosen = gender === "m" ? persistentArchive.voiceMale : persistentArchive.voiceFemale;
    const byChoice = list.find((v) => v.name === chosen);
    if (byChoice) return byChoice;
    const sameGender = list.find((v) => guessGender(v) === gender);
    if (sameGender) return sameGender;
    if (list.length >= 2) {
      const other = list.find((v) => guessGender(v) === (gender === "m" ? "f" : "m"));
      const remaining = list.filter((v) => v !== other);
      if (remaining.length) return gender === "m" ? remaining[remaining.length - 1] : remaining[0];
    }
    return list[0];
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

  /* Hồ sơ giọng theo giới tính + độ tuổi: pitch càng cao càng trẻ/nhỏ, rate càng thấp càng già. */
  const VOICE_PROFILES = [
    { match: /\bVy\b/, gender: "f", pitch: 1.3, rate: 1.04 }, //  22 tuổi, nữ, trẻ
    { match: /\bMinh\b/, gender: "m", pitch: 1.0, rate: 1.06 }, // 27 tuổi, nam, trẻ
    { match: /\bLinh\b/, gender: "f", pitch: 1.12, rate: 0.98 }, // 31 tuổi, nữ
    { match: /Tuấn/, gender: "m", pitch: 0.82, rate: 0.98 }, // 35 tuổi, nam
    { match: /\bKhang\b/, gender: "m", pitch: 0.7, rate: 0.92 }, // 38 tuổi, nam, trầm
    { match: /\bHoa\b/, gender: "f", pitch: 0.92, rate: 0.9 }, // 44 tuổi, nữ trung niên
    { match: /\bAn\b/, gender: "m", pitch: 0.52, rate: 0.8 }, // 68 tuổi, nam, già
    { match: /Thỏ Con/, gender: "f", pitch: 1.4, rate: 1.0 }, // chủ quán nhỏ nhắn, dịu dàng
    { match: /./, gender: "f", pitch: 0.95, rate: 0.9, narrator: true } // người dẫn chuyện / sự kiện
  ];

  function profileFor(speaker) {
    const name = String(speaker || "");
    if (!name) return VOICE_PROFILES[VOICE_PROFILES.length - 1];
    return VOICE_PROFILES.find((p) => p.match.test(name)) || VOICE_PROFILES[VOICE_PROFILES.length - 1];
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

  function speak(text, speaker, force = false, onDone = null) {
    return speakMany([{ text, speaker }], force, onDone);
  }

  /* Đọc lần lượt nhiều đoạn, mỗi đoạn một nhân vật (dùng cho "Nghe thử các giọng"). */
  function speakMany(items, force = false, onDone = null) {
    if (!supported) return false;
    if (!force && !persistentArchive.voiceEnabled) return false;
    stop();
    if (!voices.length) loadVoices();
    if (!vietnameseVoices().length && !warnedNoVietnamese) {
      warnedNoVietnamese = true;
      if (typeof showToast === "function") {
        showToast("🗣️ Thiết bị chưa có giọng tiếng Việt; sẽ dùng giọng mặc định (có thể đọc chưa chuẩn).");
      }
    }
    const token = speakToken;
    const userRate = Math.min(2.5, Math.max(0.6, Number(persistentArchive.voiceRate) || 0.95));
    const jobs = [];
    items.forEach(({ text, speaker }) => {
      const clean = cleanText(text);
      if (!clean) return;
      const profile = profileFor(speaker);
      const voice = pickVoice(profile.gender);
      // Chỉ có một giọng thì giả lập nam/nữ bằng cao độ: nam trầm hơn, nữ cao hơn
      const singleVoice = vietnameseVoices().length < 2;
      const pitch = singleVoice ? profile.pitch : profile.gender === "m" ? Math.max(0.5, profile.pitch) : profile.pitch;
      splitChunks(clean).forEach((chunk) => jobs.push({ chunk, voice, pitch, rate: userRate * profile.rate, text, speaker }));
    });
    if (!jobs.length) return false;
    let remaining = jobs.length;
    const finishOne = () => {
      remaining--;
      if (remaining <= 0 && token === speakToken && typeof onDone === "function") onDone();
    };
    // Chrome hay nuốt câu nếu speak() ngay sau cancel(): chờ một nhịp ngắn rồi mới đọc.
    setTimeout(() => {
      if (token !== speakToken) return;
      const synth = window.speechSynthesis;
      if (synth.paused) synth.resume();
      jobs.forEach((job) => {
        const u = new window.SpeechSynthesisUtterance(job.chunk);
        u.lang = "vi-VN";
        if (job.voice) u.voice = job.voice;
        u.rate = Math.min(3, Math.max(0.5, job.rate));
        u.pitch = Math.min(1.8, Math.max(0.4, job.pitch));
        u.onend = () => {
          const i = liveUtterances.indexOf(u);
          if (i >= 0) liveUtterances.splice(i, 1);
          finishOne();
        };
        u.onerror = (ev) => {
          const err = ev && ev.error;
          if (err === "not-allowed") {
            pending = { items, onDone };
            return;
          }
          if (err === "canceled" || err === "interrupted") return;
          finishOne();
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
        speakMany(p.items, false, p.onDone);
      }
    },
    true
  );

  return { supported, isOn: () => supported && Boolean(persistentArchive.voiceEnabled), speak, speakMany, profileFor, guessGender, pickVoice, stop, vietnameseVoices, loadVoices, cleanText, splitChunks };
})();

window.addEventListener("pagehide", () => CafeVoice.stop());
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "hidden") CafeVoice.stop();
});
