"use strict";

/* -----------------------------------------------------------------------
   SECTION 4c: ĐỊNH DẠNG THOẠI
   Kịch bản gốc có nhiều câu viết kiểu người dẫn chuyện:
       Vy khẽ siết chặt chiếc máy ghi âm: 'Là khoảnh khắc người đối diện...'
   Ở đây tách ra thành:
       • chú thích hành động (chữ nghiêng, KHÔNG đọc thành tiếng): "Vy khẽ siết chặt chiếc máy ghi âm"
       • lời thoại thật của nhân vật (hiện lớn, đọc bằng đúng giọng nhân vật): "Là khoảnh khắc người đối diện..."
   Nhờ vậy nhân vật đang TÂM SỰ trực tiếp với người chơi thay vì có ngôi thứ ba kể lại.
------------------------------------------------------------------------ */
const DIALOGUE_ALIASES = [
  { id: "vy", re: /\bVy\b/ },
  { id: "minh", re: /\bMinh\b/ },
  { id: "linh", re: /\bLinh\b/ },
  { id: "tuan", re: /Tuấn/ },
  { id: "khang", re: /\bKhang\b/ },
  { id: "hoa", re: /\bHoa\b/ },
  { id: "an", re: /\b(?:[Bb]ác|[Tt]hầy) An\b/ }
];

// Đoạn mở đầu bằng cụm này là lời dẫn / mô tả (ngôi thứ ba), không phải lời nhân vật
const NARRATION_START =
  /^(?:\d{1,2}:\d{2}|Cả |Đôi mắt|Ánh mắt|Cánh cửa|Bạn |Ánh đèn|Tiếng |(?:Anh|Chị|Cô|Bác|Thầy) (?:Vy|Minh|Linh|Tuấn|Khang|Hoa|An)\b|(?:Vy|Minh|Linh|Tuấn|Khang|Hoa)\b)/;

const QUOTED_LINE = /^([\s\S]*?)[:：]\s*['‘’“"„«]([\s\S]+?)['’”"»][.\s]*$/;
const WHOLE_QUOTE = /^["“„«]([\s\S]+?)["”»]$/;
const LEADING_EMOJI = /^(?:[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}\u{200D}]+\s*)+/u;

function isGuestSpeaker(speakerName) {
  const n = String(speakerName || "");
  if (n.includes("Thỏ Con")) return false;
  return /tuổi\)/.test(n) || n.includes("&");
}

// Thỏ Con và các "người dẫn" (sự kiện, bình minh) đều được chuyển sang lời của Thỏ Con ở ngôi thứ nhất
function isHostSpeaker(speakerName) {
  const n = String(speakerName || "");
  return n.includes("Thỏ Con") || n === "Sự Kiện Nửa Đêm" || n === "Bình Minh Hẻm Nhỏ";
}

function toFirstPerson(s) {
  return String(s)
    .replace(/Thỏ Con/g, "mình")
    .replace(/^mình/, "Mình")
    .replace(/(^|[.!?…]\s+)mình/g, "$1Mình")
    .replace(/\bBạn\b/g, "Mình")
    .replace(/\bbạn\b/g, "mình");
}

function parseHostDialogue(rawText, speakerName) {
  const isHost = String(speakerName).includes("Thỏ Con");
  const directions = [];
  const speech = [];
  String(rawText)
    .split(/\n{2,}/)
    .map((x) => x.trim())
    .filter(Boolean)
    .forEach((para) => {
      const p = para.replace(LEADING_EMOJI, "");
      const q = QUOTED_LINE.exec(p);
      if (q && q[1].trim()) {
        const prefix = q[1].trim();
        const guest = /^(?:Vị khách|Khách|Người)/.test(prefix);
        directions.push(toFirstPerson(prefix));
        speech.push({ speaker: guest ? "Vị khách" : "Thỏ Con", text: q[2].trim() });
        return;
      }
      if (/^Bạn\b/.test(p) || isHost) {
        speech.push({ speaker: "Thỏ Con", text: toFirstPerson(p) });
        return;
      }
      directions.push(p); // mô tả cảnh: chỉ hiện chữ nghiêng
    });
  if (!speech.length) return { directions: "", speech: [], mainText: directions.join("\n\n"), narrationOnly: true };
  const mainText = speech.map((s) => s.text).join("\n\n");
  return {
    directions: directions.map((d) => d.replace(/[:：]\s*$/, "")).join(" "),
    speech,
    mainText,
    firstSpeaker: speakerName
  };
}

function findCharacterInText(text) {
  let best = null;
  DIALOGUE_ALIASES.forEach((a) => {
    const m = a.re.exec(text);
    if (m && (!best || m.index < best.index)) best = { id: a.id, index: m.index };
  });
  return best ? CHARACTERS[best.id] : null;
}

function shortName(name) {
  return String(name || "").replace(/\s*\(.*?\)\s*/g, "").trim();
}

/* Trả về { directions: string, speech: [{ speaker, text }], mainText } */
function parseDialogue(rawText, speakerName) {
  const text = String(rawText || "");
  if (text.trim() && isHostSpeaker(speakerName)) return parseHostDialogue(text, speakerName);
  if (!text.trim() || !isGuestSpeaker(speakerName)) {
    return { directions: "", speech: text.trim() ? [{ speaker: speakerName, text }] : [], mainText: text, plain: true };
  }
  const isDuo = String(speakerName).includes("&");
  const directions = [];
  const speech = [];
  text
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean)
    .forEach((para) => {
      const p = para.replace(LEADING_EMOJI, "");
      if (p.startsWith("[")) {
        directions.push(p);
        return;
      }
      // Ghi chú hệ thống đặt cuối câu, ví dụ "(🌟 Tuyệt vời! ...)": tách ra làm chú thích
      let body = p;
      let note = "";
      const noteMatch = /\s*\(([^()]*)\)\s*$/.exec(p);
      if (noteMatch && QUOTED_LINE.test(p.slice(0, noteMatch.index))) {
        body = p.slice(0, noteMatch.index);
        note = noteMatch[1].trim();
      }
      const quoted = QUOTED_LINE.exec(body);
      if (quoted && quoted[1].trim()) {
        const prefix = quoted[1].trim();
        let who;
        if (/^Bạn\b/.test(prefix)) who = "Thỏ Con";
        else {
          const ch = findCharacterInText(prefix);
          who = ch ? ch.name : speakerName;
        }
        // Câu "Bạn rút lá bài..." chỉ là thao tác, không cần chú thích; lời hỏi trên lá bài do Thỏ Con đọc
        if (!/^Bạn\b/.test(prefix)) directions.push(prefix);
        if (note) directions.push(note);
        speech.push({ speaker: who, text: quoted[2].trim() });
        return;
      }
      const whole = WHOLE_QUOTE.exec(p);
      if (whole) {
        speech.push({ speaker: isDuo ? (findCharacterInText(p) || {}).name || speakerName : speakerName, text: whole[1].trim() });
        return;
      }
      if (isDuo || NARRATION_START.test(p)) {
        directions.push(p);
        return;
      }
      speech.push({ speaker: speakerName, text: p });
    });
  if (!speech.length) {
    return { directions: "", speech: [], mainText: directions.join("\n\n"), narrationOnly: true };
  }
  const first = speech[0].speaker;
  const mainText = speech.map((s) => (s.speaker === first ? s.text : `${shortName(s.speaker)}: ${s.text}`)).join("\n\n");
  return {
    directions: directions.map((d) => d.replace(/[:：]\s*$/, "")).join(" "),
    speech,
    mainText,
    firstSpeaker: first
  };
}


/* -----------------------------------------------------------------------
   Emoji tâm trạng: đoán cảm xúc của câu thoại từ từ khóa (chú thích hành động + lời nói)
------------------------------------------------------------------------ */
const MOOD_RULES = [
  [/bật cười|phá lên cười|cười ròn|cười tươi/i, "😄"],
  [/rưng rưng|nước mắt|khóc|nghẹn|sụt sùi|đỏ hoe/i, "🥹"],
  [/thở dài|thở phào|buông tiếng thở|nhẹ nhõm/i, "😮‍💨"],
  [/giật mình|sững|ngạc nhiên|bất ngờ|tròn mắt|há hốc/i, "😲"],
  [/giận|tức|gắt|bực|cáu/i, "😠"],
  [/sợ|run rẩy|hoảng|rùng mình/i, "😨"],
  [/lo lắng|bồn chồn|băn khoăn|day dứt|áp lực|căng thẳng/i, "😟"],
  [/mệt|kiệt sức|ngáp|díp|buồn ngủ|thiếu ngủ|mất ngủ/i, "😴"],
  [/trầm ngâm|ngẫm|suy nghĩ|nghĩ ngợi|ngập ngừng|do dự/i, "🤔"],
  [/nhớ|hoài niệm|ký ức|ngày xưa|năm xưa|hồi nhỏ/i, "🕰️"],
  [/tự hào|vững tin|kiên định|quyết tâm|hy vọng|hi vọng|tin tưởng/i, "💪"],
  [/mỉm cười|cười|nụ cười|tươi|vui/i, "😊"],
  [/ấm áp|dịu dàng|gật đầu|vỗ về|trìu mến|cảm ơn|biết ơn/i, "🥰"],
  [/rót|mời|nước ấm|ly nước|pha/i, "☕"],
  [/chúc|ngủ ngon|bình an|hẹn gặp/i, "🌙"],
  [/mưa|gió|đèn|nến/i, "🌧️"]
];

function detectMood(text) {
  const s = String(text || "");
  for (const [re, emoji] of MOOD_RULES) if (re.test(s)) return emoji;
  if (/\?\s*$/.test(s.trim())) return "🤔";
  if (/!\s*$/.test(s.trim())) return "✨";
  if (/(\.\.\.|…)\s*$/.test(s.trim())) return "💭";
  return "";
}
