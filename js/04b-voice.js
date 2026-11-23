"use strict";

/* -----------------------------------------------------------------------
   SECTION 4b: GIỌNG ĐỌC (Web Speech API — không cần tải thêm file nào)
   Bật/tắt, tốc độ và giọng đọc chỉnh trong Menu → 🗣️ Giọng Đọc.
------------------------------------------------------------------------ */
const CafeVoice = (() => {
  const ttsSupported = typeof window !== "undefined" && "speechSynthesis" in window && typeof window.SpeechSynthesisUtterance === "function";
  // Có file mp3 thoại (assets/voice) thì không cần giọng của trình duyệt
  const clipsSupported = typeof window !== "undefined" && typeof window.Audio === "function" && typeof VOICE_CLIPS !== "undefined";
  const supported = ttsSupported || clipsSupported;
  const VOICE_DIR = "assets/voice/";
  let currentAudio = null;

  /* Khóa của một câu thoại = băm(id giọng | chữ đã làm sạch). PHẢI giống tools/voice_lines.js */
  function cyrb53(str, seed = 0) {
    let h1 = 0xdeadbeef ^ seed, h2 = 0x41c6ce57 ^ seed;
    for (let i = 0, ch; i < str.length; i++) {
      ch = str.charCodeAt(i);
      h1 = Math.imul(h1 ^ ch, 2654435761);
      h2 = Math.imul(h2 ^ ch, 1597334677);
    }
    h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507);
    h1 ^= Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507);
    h2 ^= Math.imul(h1 ^ (h1 >>> 13), 3266489909);
    return (h2 >>> 0).toString(16).padStart(8, "0") + (h1 >>> 0).toString(16).padStart(8, "0");
  }
  function voiceKey(profileId, clean) { return cyrb53(profileId + "|" + clean); }
  function hasClip(key) { return clipsSupported && VOICE_CLIPS.has(key); }
  let voices = [];
  let warnedNoVietnamese = false;
  let speakToken = 0;

  function loadVoices() {
    if (!ttsSupported) return;
    voices = window.speechSynthesis.getVoices() || [];
  }

  if (ttsSupported) {
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
    { id: "vy", match: /\bVy\b/, gender: "f", pitch: 1.3, rate: 1.04 }, //  22 tuổi, nữ, trẻ
    { id: "minh", match: /\bMinh\b/, gender: "m", pitch: 1.0, rate: 1.06 }, // 27 tuổi, nam, trẻ
    { id: "linh", match: /\bLinh\b/, gender: "f", pitch: 1.12, rate: 0.98 }, // 31 tuổi, nữ
    { id: "tuan", match: /Tuấn/, gender: "m", pitch: 0.82, rate: 0.98 }, // 35 tuổi, nam
    { id: "khang", match: /\bKhang\b/, gender: "m", pitch: 0.7, rate: 0.92 }, // 38 tuổi, nam, trầm
    { id: "hoa", match: /\bHoa\b/, gender: "f", pitch: 0.92, rate: 0.9 }, // 44 tuổi, nữ trung niên
    { id: "an", match: /\bAn\b/, gender: "m", pitch: 0.52, rate: 0.8 }, // 68 tuổi, nam, già
    { id: "thocon", match: /Thỏ Con/, gender: "f", pitch: 1.4, rate: 1.0 }, // chủ quán nhỏ nhắn, dịu dàng
    { id: "narrator", match: /./, gender: "f", pitch: 0.95, rate: 0.9, narrator: true } // người dẫn chuyện / sự kiện
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
    duck(false);
    liveUtterances.length = 0;
    if (currentAudio) {
      try { currentAudio.pause(); } catch (e) { /* bỏ qua */ }
      currentAudio = null;
    }
    if (ttsSupported) window.speechSynthesis.cancel();
  }

  function duck(on) {
    if (typeof audioEngine !== "undefined" && audioEngine && typeof audioEngine.setDuck === "function") audioEngine.setDuck(on);
  }

  function speak(text, speaker, force = false, onDone = null) {
    return speakMany([{ text, speaker }], force, onDone);
  }

  /* Đọc lần lượt nhiều đoạn, mỗi đoạn một nhân vật. Ưu tiên file mp3 đã thu sẵn (assets/voice);
     câu nào chưa có file thì dùng giọng của trình duyệt. */
  function speakMany(items, force = false, onDone = null) {
    if (!supported) return false;
    if (!force && !persistentArchive.voiceEnabled) return false;
    stop();
    const token = speakToken;
    const userRate = Math.min(2.5, Math.max(0.6, Number(persistentArchive.voiceRate) || 0.95));
    const jobs = [];
    items.forEach(({ text, speaker }) => {
      const clean = cleanText(text);
      if (!clean) return;
      const profile = profileFor(speaker);
      const ttsJobs = [];
      if (ttsSupported) {
        const voice = pickVoice(profile.gender);
        const singleVoice = vietnameseVoices().length < 2;
        const pitch = singleVoice ? profile.pitch : profile.gender === "m" ? Math.max(0.5, profile.pitch) : profile.pitch;
        splitChunks(clean).forEach((chunk) => ttsJobs.push({ chunk, voice, pitch, rate: userRate * profile.rate }));
      }
      const key = voiceKey(profile.id || "narrator", clean);
      if (hasClip(key)) jobs.push({ clip: VOICE_DIR + key + ".mp3", fallback: ttsJobs });
      else jobs.push(...ttsJobs);
    });
    if (!jobs.length) return false;
    if (ttsSupported && jobs.some((j) => j.chunk)) {
      if (!voices.length) loadVoices();
      if (!vietnameseVoices().length && !warnedNoVietnamese) {
        warnedNoVietnamese = true;
        if (typeof showToast === "function") showToast("🗣️ Thiết bị chưa có giọng tiếng Việt; sẽ dùng giọng mặc định (có thể đọc chưa chuẩn).");
      }
    }
    let idx = 0;
    const next = () => {
      if (token !== speakToken) return;
      if (idx >= jobs.length) {
        duck(false);
        if (typeof onDone === "function") onDone();
        return;
      }
      runJob(jobs[idx++]);
    };
    const blocked = () => {
      pending = { items, onDone };
    };
    function runJob(job) {
      if (job.clip) {
        const a = new window.Audio(job.clip);
        a.preload = "auto";
        a.playbackRate = Math.min(2.5, Math.max(0.5, userRate / 0.95));
        currentAudio = a;
        a.onended = () => {
          if (currentAudio === a) currentAudio = null;
          next();
        };
        a.onerror = () => {
          if (token !== speakToken) return;
          jobs.splice(idx, 0, ...(job.fallback || [])); // không tải được: đọc bằng giọng trình duyệt
          next();
        };
        const p = a.play();
        if (p && typeof p.catch === "function") {
          p.catch((err) => {
            if (token !== speakToken) return;
            if (err && err.name === "NotAllowedError") blocked();
            else a.onerror();
          });
        }
        return;
      }
      const synth = window.speechSynthesis;
      if (synth.paused) synth.resume();
      const u = new window.SpeechSynthesisUtterance(job.chunk);
      u.lang = "vi-VN";
      if (job.voice) u.voice = job.voice;
      u.rate = Math.min(3, Math.max(0.5, job.rate));
      u.pitch = Math.min(1.8, Math.max(0.4, job.pitch));
      u.onend = () => {
        const i = liveUtterances.indexOf(u);
        if (i >= 0) liveUtterances.splice(i, 1);
        next();
      };
      u.onerror = (ev) => {
        const err = ev && ev.error;
        if (err === "not-allowed") return blocked();
        if (err === "canceled" || err === "interrupted") return;
        next();
        if (err && !errorToastShown) {
          errorToastShown = true;
          if (typeof showToast === "function") showToast(`🗣️ Giọng đọc không phát được (${err}). Thử đổi giọng trong Menu.`);
        }
      };
      liveUtterances.push(u);
      synth.speak(u);
    }
    // Chrome hay nuốt câu nếu speak() ngay sau cancel(): chờ một nhịp ngắn
    duck(true);
    setTimeout(next, 90);
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

  return { supported, isOn: () => supported && Boolean(persistentArchive.voiceEnabled), speak, speakMany, profileFor, guessGender, pickVoice, stop, vietnameseVoices, loadVoices, cleanText, splitChunks, voiceKey };
})();

window.addEventListener("pagehide", () => CafeVoice.stop());
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "hidden") CafeVoice.stop();
});
