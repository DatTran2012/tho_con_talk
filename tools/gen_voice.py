#!/usr/bin/env python3
"""Tạo file mp3 thoại cho mọi câu trong lines.json (sinh bởi voice_lines.js / voice_lines_runtime.js).
Mọi giọng đều lấy từ mô hình Piper vi_VN-vais1000-medium (rõ chữ nhất: sai ~5% khi nhận dạng ngược),
rồi đổi cao độ/âm sắc (như đổi "cỡ giọng") và tốc độ riêng cho từng nhân vật.
Mỗi câu được tách theo dấu câu, đọc riêng từng đoạn kèm quãng nghỉ (… dài hơn . ), tốc độ dao động nhẹ cho đỡ đều đều.
Cần: pip install sherpa-onnx==1.12.40 numpy; ffmpeg; mô hình vits-piper-vi_VN-vais1000-medium ở thư mục MODELS.
Dùng: MODELS=. python3 tools/gen_voice.py lines.json out_dir [voice_id ...]"""
import sys, os, json, subprocess, glob, re, hashlib
import numpy as np, sherpa_onnx
MODELS = os.environ.get('MODELS', '.')
# r = hệ số đổi cao độ+âm sắc (<1: trầm/già/nam hơn), speed = tốc độ đọc, eq = tinh chỉnh âm sắc (ffmpeg)
VOICES = {
  'thocon':  dict(lively=1.1, r=1.00, speed=0.92, eq='equalizer=f=250:t=q:w=1:g=1.5,equalizer=f=3300:t=q:w=1:g=2'),
  'narrator':dict(lively=0.9, r=0.94, speed=0.90, eq='equalizer=f=220:t=q:w=1:g=2,equalizer=f=3000:t=q:w=1:g=1.5'),
  'vy':      dict(lively=1.4, r=1.10, speed=0.98, eq='equalizer=f=3500:t=q:w=1:g=2.5'),
  'linh':    dict(lively=1.0, r=0.96, speed=0.92, eq='equalizer=f=280:t=q:w=1:g=1.5,equalizer=f=3200:t=q:w=1:g=2'),
  'hoa':     dict(lively=1.0, r=0.89, speed=0.88, eq='equalizer=f=260:t=q:w=1:g=2.5,equalizer=f=3000:t=q:w=1:g=1.5'),
  'minh':    dict(lively=0.9, r=0.79, speed=0.93, eq='equalizer=f=160:t=q:w=1:g=2,equalizer=f=2800:t=q:w=1:g=2.5'),
  'tuan':    dict(lively=1.2, r=0.72, speed=0.90, eq='equalizer=f=140:t=q:w=1:g=3,equalizer=f=2600:t=q:w=1:g=2.5'),
  'khang':   dict(lively=1.1, r=0.82, speed=0.92, eq='equalizer=f=170:t=q:w=1:g=2.5,equalizer=f=2800:t=q:w=1:g=2'),
  'an':      dict(lively=0.7, r=0.69, speed=0.84, eq='equalizer=f=150:t=q:w=1:g=3,equalizer=f=2400:t=q:w=1:g=2'),
}
PAUSE = {'…': 0.45, '.': 0.30, '?': 0.34, '!': 0.28, '—': 0.20, '\n': 0.32}
_tts = None
def tts():
    global _tts
    if _tts is None:
        d = os.path.abspath(f'{MODELS}/vits-piper-vi_VN-vais1000-medium')
        cfg = sherpa_onnx.OfflineTtsConfig(model=sherpa_onnx.OfflineTtsModelConfig(vits=sherpa_onnx.OfflineTtsVitsModelConfig(
            model=glob.glob(d + '/*.onnx')[0], tokens=d + '/tokens.txt', data_dir=d + '/espeak-ng-data', noise_scale=0.3, noise_scale_w=0.9), num_threads=2))
        _tts = sherpa_onnx.OfflineTts(cfg)
    return _tts
EMOJI = re.compile('[\U0001F000-\U0001FAFF☀-➿⬀-⯿️‍]')
def segments(raw):
    t = re.sub(r'<[^>]*>', ' ', raw); t = EMOJI.sub('', t); t = re.sub(r'[“”"«»]', '', t)
    t = re.sub(r'\s*[—–]\s*', ' — ', t); t = re.sub(r'\.{2,}', '…', t)
    out = []; buf = ''
    for piece in re.split(r'(…|[.!?]+|—|\n+)', t):
        if not piece: continue
        if re.fullmatch(r'…|[.!?]+|—|\n+', piece):
            k = '…' if piece == '…' else '—' if piece == '—' else '\n' if piece.startswith('\n') else piece[-1] if piece[-1] in '.!?' else '.'
            if buf.strip(): out.append((buf.strip(), k)); buf = ''
            elif out: out[-1] = (out[-1][0], k if PAUSE[k] > PAUSE[out[-1][1]] else out[-1][1])
        else: buf += piece
    if buf.strip(): out.append((buf.strip(), '.'))
    # gộp đoạn quá ngắn (1 từ) vào đoạn sau để khỏi cụt
    merged = []
    for s, k in out:
        if merged and len(merged[-1][0].split()) < 2 and merged[-1][1] != '…':
            merged[-1] = (merged[-1][0] + ', ' + s, k)
        else: merged.append((s, k))
    return merged
SAD = re.compile(r'nhớ|buồn|mệt|xin lỗi|khóc|cô đơn|mất|đau|lo |sợ|tiếc|một mình|nặng|trống|muộn|xa |lạnh|tủi|im lặng|không biết|chưa kịp', re.I)
HAPPY = re.compile(r'cảm ơn|vui|tuyệt|thích|hạnh phúc|cười|may quá|ngon|ấm|dễ thương|nhé|nha\b|đẹp|chúc|mừng|hay quá|được rồi|tốt quá', re.I)
HESI = re.compile(r'^(ừ|ờ|à|ừm|ơ|ớ|ồ|ôi|ủa|hừ|hử)\b', re.I)
def mood(s, k):
    """Gán cảm xúc cho từng đoạn theo từ khóa + dấu câu -> (hệ số cao độ, tốc độ, dB, độ dốc đường nét)"""
    r, sp, db, slope = 1.0, 1.0, 0.0, -0.05   # câu kể: cuối câu hạ giọng nhẹ
    if SAD.search(s): r, sp, db, slope = 0.965, 0.90, -2.0, -0.09
    elif HAPPY.search(s): r, sp, db, slope = 1.045, 1.06, 1.0, 0.00
    if HESI.search(s): sp *= 0.88; r *= 0.98
    if k == '?': slope = 0.10; r *= 1.02
    elif k == '!': r *= 1.06; sp *= 1.07; db += 2.5; slope = -0.02
    elif k == '…': sp *= 0.9; db -= 1.5; slope = -0.10
    if len(s.split()) <= 3: db += 0.8; r *= 1.01   # câu ngắn nói nhấn hơn
    return r, sp, db, slope
def contour(x, slope, lively):
    """Đổi cao độ theo thời gian (rate biến thiên): giọng lên ở cuối câu hỏi, rơi xuống cuối câu buồn, thêm nhấn nhá ở giữa"""
    n = len(x)
    if n < 2000: return x
    u = np.linspace(0, 1, n)
    rate = 1 + slope_curve(u, slope * lively) + 0.025 * lively * np.sin(2 * np.pi * (u * 2.2 + 0.3)) * (1 - u)
    pos = np.concatenate([[0.0], np.cumsum(1.0 / rate[:-1])])
    idx = np.arange(int(pos[-1]) + 1)
    return np.interp(idx, pos, x).astype(np.float32)
def slope_curve(u, slope): return slope * np.clip((u - 0.55) / 0.45, 0, 1) ** 1.6 * 1.0 + (-slope * 0.3) * np.clip(1 - u / 0.25, 0, 1)
def prep(t): return re.sub(r'\bAI\b', 'ây ai', t)
def synth(raw, speed, key, lively=1.0):
    m = tts(); sr = m.sample_rate
    rng = np.random.default_rng(int(hashlib.md5(key.encode()).hexdigest()[:8], 16))
    parts = []
    for s, k in segments(raw):
        mr, ms, mdb, slope = mood(s, k)
        sp = speed * ms * (1 + rng.uniform(-0.04, 0.04))
        txt = prep(s) + (',' if k == '—' else '?' if k == '?' else '!' if k == '!' else '.')
        a = m.generate(txt, sid=0, speed=sp)
        seg = np.array(a.samples, dtype=np.float32)
        seg = contour(seg, slope, lively)
        # đổi cao độ cả đoạn theo cảm xúc (kèm bù tốc độ để không đổi nhịp)
        if abs(mr - 1) > 0.005:
            pos = np.arange(0, len(seg) - 1, mr); seg = np.interp(pos, np.arange(len(seg)), seg).astype(np.float32)
        seg *= 10 ** (mdb / 20)
        if k == '…':  # nhỏ dần cuối câu lửng
            f = int(min(len(seg), 0.25 * sr)); seg[-f:] *= np.linspace(1, 0.35, f)
        parts.append(seg); parts.append(np.zeros(int(PAUSE[k] * sr * (1.25 if mdb < -1 else 0.9 if mdb > 1.5 else 1)), dtype=np.float32))
    if parts: parts.pop()
    return (np.concatenate(parts) if parts else np.zeros(0, np.float32)), sr
def main():
    lines = json.load(open(sys.argv[1], encoding='utf8')); out = sys.argv[2]; only = set(sys.argv[3:])
    os.makedirs(out, exist_ok=True); n = 0
    for l in lines:
        if only and l['voice'] not in only: continue
        f = f"{out}/{l['key']}.mp3"
        if os.path.exists(f): continue
        v = VOICES.get(l['voice'], VOICES['narrator'])
        x, sr = synth(l.get('raw') or l['text'], v['speed'], l['key'], v.get('lively', 1.0))
        if len(x) < 100: print('RỖNG', l['key'], l['text'][:40]); continue
        r = v['r']
        af = (f"asetrate={int(sr * r)},aresample={sr},atempo={1 / r:.4f},highpass=f=80,{v['eq']},"
              "acompressor=threshold=-22dB:ratio=2.5:attack=8:release=140:makeup=3,aecho=0.85:0.3:55:0.09,"
              "loudnorm=I=-18:TP=-2:LRA=11,lowpass=f=9500,apad=pad_dur=0.3")
        subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-f', 'f32le', '-ar', str(sr), '-ac', '1', '-i', '-', '-af', af,
                        '-ac', '1', '-c:a', 'libmp3lame', '-b:a', '56k', f], input=x.tobytes(), check=True)
        n += 1
        if n % 25 == 0: print(l['voice'], n, flush=True)
    print('XONG', n)
main()
