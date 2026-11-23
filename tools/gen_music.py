#!/usr/bin/env python3
"""Tạo nhạc nền lo-fi chill (tổng hợp bằng numpy, không dùng mẫu âm có sẵn) -> assets/music/*.mp3
Dùng: python3 tools/gen_music.py out_dir [track ...]   (track: spring summer autumn winter piano dawn keeper)"""
import sys, os, subprocess, numpy as np
from scipy import signal
SR = 44100
rng_global = None
def midi(m): return 440.0 * 2 ** ((m - 69) / 12)

# ---------- cấu hình từng bản nhạc ----------
# v2: chỉ dùng hợp âm êm tai (bỏ 9/11/13, m7b5, sus) để bớt "rùn rợn"
Q = {'maj9': [0, 4, 7, 11], 'min9': [0, 3, 7, 10], 'dom13': [0, 4, 7, 10], 'maj7': [0, 4, 7, 11], 'min7': [0, 3, 7, 10],
     'm7b5': [0, 3, 7, 10], 'dom7': [0, 4, 7, 10], 'sus': [0, 4, 7, 11], 'six9': [0, 4, 7, 9], 'min11': [0, 3, 7, 10], 'maj13': [0, 4, 7, 11]}
TRACKS = {
 'spring': dict(bpm=76, swing=0.58, root_oct=48, key='C', scale=[0, 2, 4, 7, 9], seed=11, lead='pluck', keys='epiano', pad=True, drums='soft',
   prog=[(0, 'maj9'), (9, 'min9'), (2, 'min9'), (7, 'dom13'), (5, 'maj9'), (4, 'min7'), (2, 'min9'), (7, 'sus')], bass=True, bright=1.0),
 'summer': dict(bpm=84, swing=0.62, root_oct=41, key='F', scale=[0, 2, 4, 7, 9], seed=23, lead='epiano', keys='epiano', pad=True, drums='shaker',
   prog=[(5, 'maj9'), (2, 'min9'), (7, 'min9'), (0, 'dom13'), (5, 'six9'), (9, 'min7'), (2, 'min9'), (7, 'dom7')], bass=True, bright=1.15),
 'autumn': dict(bpm=70, swing=0.6, root_oct=45, key='A', scale=[0, 3, 5, 7, 10], seed=37, lead='epiano', keys='epiano', pad=True, drums='soft',
   prog=[(9, 'min9'), (2, 'min9'), (7, 'dom13'), (0, 'maj9'), (5, 'maj9'), (11, 'm7b5'), (4, 'dom7'), (9, 'min9')], bass=True, bright=0.85),
 'winter': dict(bpm=64, swing=0.57, root_oct=50, key='D', scale=[0, 3, 5, 7, 10], seed=41, lead='pluck', keys='felt', pad=True, drums='brush',
   prog=[(2, 'min9'), (10, 'maj9'), (7, 'min9'), (9, 'sus'), (5, 'maj9'), (0, 'maj7'), (7, 'min11'), (9, 'dom7')], bass=True, bright=0.8),
 'piano': dict(bpm=66, swing=0.55, root_oct=51, key='Eb', scale=[0, 2, 4, 7, 9], seed=53, lead='felt', keys='felt', pad=False, drums=None,
   prog=[(3, 'maj9'), (0, 'min9'), (8, 'maj9'), (10, 'sus'), (3, 'six9'), (5, 'min7'), (8, 'maj7'), (10, 'dom7')], bass=False, bright=0.9),
 'dawn': dict(bpm=58, swing=0.5, root_oct=53, key='F', scale=[0, 2, 4, 7, 9], seed=67, lead='felt', keys='felt', pad=True, drums=None,
   prog=[(5, 'maj7'), (4, 'min7'), (2, 'min9'), (0, 'maj7'), (5, 'maj9'), (7, 'sus'), (2, 'min7'), (0, 'six9')], bass=False, bright=0.7),
 'keeper': dict(bpm=72, swing=0.55, root_oct=43, key='G', scale=[0, 2, 4, 7, 9], seed=79, lead='guitar', keys='guitar', pad=True, drums='brush',
   prog=[(7, 'maj9'), (4, 'min9'), (0, 'maj9'), (2, 'six9'), (7, 'maj7'), (9, 'min7'), (0, 'maj9'), (2, 'sus')], bass=True, bright=0.95),
}
BARS = 32

# ---------- bộ tạo âm ----------
def tvec(n): return np.arange(n, dtype=np.float64) / SR
def rel(t, dur, k=10.0):
    return np.where(t < dur, 1.0, np.exp(-(t - dur) * k))
def attack(t, a=0.004): return 1 - np.exp(-t / a)

def epiano(f, dur, vel, bright=1.0):
    n = int(SR * (dur + 0.7)); t = tvec(n)
    idx = (0.35 + vel * 1.5 * bright) * np.exp(-t * 3.2) + 0.12
    mod = np.sin(2 * np.pi * f * t)
    body = np.sin(2 * np.pi * f * t + idx * mod)
    tine = 0.06 * vel * np.sin(2 * np.pi * f * 7 * t + 1.2 * np.sin(2 * np.pi * f * 7 * t * 0.5)) * np.exp(-t * 22)
    trem = 1 + 0.03 * np.sin(2 * np.pi * 4.6 * t) * (1 - np.exp(-t * 1.5))
    return (body + tine) * np.exp(-t * 1.25) * attack(t, 0.003) * rel(t, dur, 9) * trem * vel

def felt(f, dur, vel, bright=1.0):
    n = int(SR * (dur + 1.2)); t = tvec(n); y = np.zeros(n)
    for k, a in enumerate([1, .55, .3, .16, .08, .05], 1):
        d = 1.3 + k * 1.1
        for det in (0.0, 0.0011):
            y += a * 0.5 * np.sin(2 * np.pi * f * k * (1 + det * k * 0.3) * t) * np.exp(-t * d)
    hammer = 0.05 * vel * np.random.default_rng(int(f)).standard_normal(n) * np.exp(-t * 60)
    return (y + hammer) * attack(t, 0.006) * rel(t, dur + 0.4, 6) * vel

def pluck(f, dur, vel, bright=1.0):
    n = int(SR * (dur + 1.0)); t = tvec(n); y = np.zeros(n)
    for k in range(1, 9):
        y += (1.0 / k ** 1.15) * np.sin(2 * np.pi * f * k * (1 + 0.0004 * k * k) * t) * np.exp(-t * (1.8 + 1.7 * k))
    return y * attack(t, 0.002) * rel(t, dur + 0.5, 7) * vel * 0.9

def guitar(f, dur, vel, bright=1.0):
    n = int(SR * (dur + 1.3)); t = tvec(n); y = np.zeros(n)
    for k in range(1, 11):
        y += (1.0 / k ** 1.05) * np.sin(2 * np.pi * f * k * (1 + 0.00035 * k * k) * t + k) * np.exp(-t * (1.2 + 1.2 * k))
    pick = 0.06 * np.random.default_rng(int(f * 7)).standard_normal(n) * np.exp(-t * 90)
    return (y + pick) * attack(t, 0.0015) * rel(t, dur + 0.6, 7) * vel * 0.95

def vibes(f, dur, vel, bright=1.0):
    n = int(SR * (dur + 1.4)); t = tvec(n)
    y = np.sin(2 * np.pi * f * t) + 0.35 * np.sin(2 * np.pi * f * 4 * t) * np.exp(-t * 5) + 0.12 * np.sin(2 * np.pi * f * 10 * t) * np.exp(-t * 14)
    trem = 1 + 0.22 * np.sin(2 * np.pi * 4.8 * t)
    return y * np.exp(-t * 1.5) * trem * attack(t, 0.002) * rel(t, dur + 0.6, 6) * vel * 0.8

def music_box(f, dur, vel, bright=1.0):
    n = int(SR * (dur + 1.5)); t = tvec(n)
    y = np.sin(2 * np.pi * f * t) + 0.5 * np.sin(2 * np.pi * f * 3.01 * t) * np.exp(-t * 6) + 0.25 * np.sin(2 * np.pi * f * 5.97 * t) * np.exp(-t * 12)
    return y * np.exp(-t * 2.4) * attack(t, 0.001) * vel * 0.7

def bell(f, dur, vel, bright=1.0):
    n = int(SR * (dur + 2.2)); t = tvec(n)
    m = np.sin(2 * np.pi * f * 3.5 * t)
    y = np.sin(2 * np.pi * f * t + 2.2 * np.exp(-t * 2.5) * m) + 0.2 * np.sin(2 * np.pi * f * 2.0 * t) * np.exp(-t * 3)
    return y * np.exp(-t * 0.9) * attack(t, 0.002) * vel * 0.6

def padnote(f, dur, vel, bright=1.0):
    n = int(SR * (dur + 2.0)); t = tvec(n); y = np.zeros(n)
    for det in (-0.0035, 0.0, 0.0035):
        for k, a in enumerate([1, .5, .28, .14], 1):
            y += a * np.sin(2 * np.pi * f * k * (1 + det) * t + det * 90 * k)
    env = (1 - np.exp(-t / 0.9)) * rel(t, dur, 1.6)
    return y * env * vel * 0.05

def bassnote(f, dur, vel, bright=1.0):
    n = int(SR * (dur + 0.3)); t = tvec(n)
    y = np.sin(2 * np.pi * f * t) + 0.3 * np.sin(2 * np.pi * f * 2 * t) * np.exp(-t * 4)
    return y * attack(t, 0.01) * rel(t, dur, 18) * vel * 0.85 * (0.75 + 0.25 * np.exp(-t * 2))

INST = dict(epiano=epiano, felt=felt, pluck=pluck, guitar=guitar, vibes=vibes, music_box=music_box, bell=bell, pad=padnote)

def noise_burst(n, lo, hi, decay, seed):
    r = np.random.default_rng(seed).standard_normal(n); t = tvec(n)
    sos = signal.butter(2, [lo, hi], 'bandpass', fs=SR, output='sos') if lo else signal.butter(2, hi, 'highpass', fs=SR, output='sos')
    return signal.sosfilt(sos, r) * np.exp(-t * decay)

def kick(vel):
    n = int(SR * 0.4); t = tvec(n)
    ph = 2 * np.pi * (48 * t + (95) * (1 - np.exp(-t * 28)) / 28)
    return (np.sin(ph) * np.exp(-t * 9) + 0.2 * np.random.default_rng(1).standard_normal(n) * np.exp(-t * 200)) * vel * 0.95
def snare(vel, seed):
    n = int(SR * 0.3); t = tvec(n)
    s = noise_burst(n, 1100, 5200, 17, seed) * 0.85 + np.sin(2 * np.pi * 185 * t) * np.exp(-t * 26) * 0.5
    return s * vel * 0.8
def hat(vel, seed, open_=False):
    n = int(SR * (0.22 if open_ else 0.07)); return noise_burst(n, None, 7200, 12 if open_ else 60, seed) * vel * 0.28
def shaker(vel, seed):
    n = int(SR * 0.09); return noise_burst(n, 4500, 11000, 45, seed) * vel * 0.3
def brush(vel, seed):
    n = int(SR * 0.25); t = tvec(n); return noise_burst(n, 1500, 7000, 14, seed) * vel * 0.35 * (1 - np.exp(-t / 0.03))

# ---------- sáng tác ----------
def voicing(root, qual, prev, lo=57, hi=76):
    ivs = Q[qual]; cand = []
    for iv in ivs[1:] if len(ivs) > 4 else ivs:
        p = root + iv
        while p < lo: p += 12
        while p > hi: p -= 12
        cand.append(p)
    cand = sorted(set(cand))
    if prev:
        # nối giọng mượt: dời từng nốt về gần nốt trước
        out = []
        for p in cand:
            best = min([p - 12, p, p + 12], key=lambda q: min(abs(q - x) for x in prev))
            if lo <= best <= hi: out.append(best)
            else: out.append(p)
        cand = sorted(set(out))
    return cand[:4]

def render(name, cfg, out_dir):
    rng = np.random.default_rng(cfg['seed']); np.random.seed(cfg['seed'])
    spb = 60.0 / cfg['bpm']; bar = 4 * spb; total = BARS * bar
    tail = 4.0; N = int((total + tail) * SR)
    L = np.zeros(N); R = np.zeros(N); revL = np.zeros(N); revR = np.zeros(N)
    root_base = cfg['root_oct']
    def put(buf, x, start, gain=1.0, pan=0.0):
        i = int(start * SR)
        if i < 0 or i >= N: return
        m = min(len(x), N - i)
        l = gain * (1 - max(0, pan)); r = gain * (1 + min(0, pan))
        buf[0][i:i + m] += x[:m] * l; buf[1][i:i + m] += x[:m] * r
    dry = (L, R); rev = (revL, revR)
    def swung(beat_pos):  # vị trí phách (đơn vị: phách), đổi sang giây có swing cho nốt lẻ
        whole = np.floor(beat_pos); frac = beat_pos - whole
        if abs(frac - 0.5) < 1e-6: frac = cfg['swing']
        return (whole + frac) * spb
    keys = INST[cfg['keys']]; lead = INST[cfg['lead']]
    prog = cfg['prog']; prev = None
    chords = []
    for b in range(BARS):
        pc, q = prog[(b // 1) % len(prog)] if False else prog[b % len(prog)]
        root = root_base + pc
        while root > root_base + 11: root -= 12
        v = voicing(root, q, prev); prev = v; chords.append((root, q, v))
    # --- hợp âm (keys) ---
    for b, (root, q, v) in enumerate(chords):
        t0 = b * bar
        hits = [(0.0, 3.2, 0.62)]
        if cfg['keys'] in ('felt', 'guitar'):
            hits = [(0.0, 3.8, 0.55), (2.5, 1.3, 0.38)] if cfg['keys'] == 'felt' else [(0.0, 3.8, 0.5)]
        else:
            hits += [(2.5, 1.2, 0.42)]
            if b % 4 == 3: hits += [(3.5, 0.5, 0.35)]
        for (bp, d, vel) in hits:
            if cfg['keys'] == 'guitar':  # rải hợp âm kiểu fingerstyle
                for i, p in enumerate(v + [v[1] + 12]):
                    st = t0 + bp * spb + i * 0.5 * spb * (1 if i < 3 else 1) + rng.normal(0, 0.006)
                    put(dry, keys(midi(p), 1.6 * spb, vel * (0.8 + 0.3 * rng.random()), cfg['bright']), st, 0.5, pan=-0.15 + 0.1 * i)
                break
            st0 = t0 + swung(bp)
            for i, p in enumerate(v):
                st = st0 + i * rng.uniform(0.008, 0.02) + rng.normal(0, 0.007)
                x = keys(midi(p), d * spb, vel * rng.uniform(0.8, 1.0), cfg['bright'])
                put(dry, x, st, 0.42, pan=-0.2 + 0.13 * i); put(rev, x, st, 0.5, pan=0.0)
        if cfg['pad']:
            for p in (v[0],):
                x = padnote(midi(p - 12), 4 * spb - 0.2, 0.7); put(dry, x, t0, 0.7, pan=0.25); put(rev, x, t0, 0.5, pan=-0.2)
        if cfg['bass']:
            f = midi(root - 12 if root - 12 >= 38 else root)
            pat = [(0.0, 1.6), (2.5, 0.8)] if b % 2 == 0 else [(0.0, 1.2), (1.5, 0.6), (2.5, 1.0)]
            for bp, d in pat:
                put(dry, bassnote(f * (1.5 if (bp == 1.5) else 1.0), d * spb, 0.6 + 0.2 * rng.random()), t0 + swung(bp) + rng.normal(0, 0.005), 0.55, 0)
    # --- giai điệu ---
    scale = cfg['scale']; key_pc = (root_base) % 12
    def pitches(lo, hi):
        return [p for p in range(lo, hi) if ((p - key_pc) % 12) in scale]
    lead_lo = root_base + 24 - 2; lead_hi = root_base + 36 + 4
    pool = pitches(lead_lo, lead_hi)
    def make_motif():
        rhythm = [];
        pos = float(rng.choice([0.0, 0.5, 1.0, 1.5]))
        for _ in range(int(rng.integers(3, 6))):
            d = float(rng.choice([0.5, 1.0, 1.5, 2.0], p=[.25, .35, .2, .2]))
            if pos >= 7.5: break
            rhythm.append((pos, min(d, 8 - pos)))
            pos += d + float(rng.choice([0.0, 0.5, 1.0], p=[.5, .3, .2]))
        idx = int(rng.integers(len(pool) // 3, 2 * len(pool) // 3)); steps = []
        for _ in rhythm:
            idx = int(np.clip(idx + rng.choice([-2, -1, -1, 0, 1, 1, 2]), 0, len(pool) - 1)); steps.append(idx)
        return rhythm, steps
    motifs = [make_motif() for _ in range(3)]
    lead_active = [False] * 8 + [(b % 4 == 0) for b in range(8, 32)]
    for b2 in range(0, BARS, 2):
        if not lead_active[b2]: continue
        rhythm, steps = motifs[(b2 // 2) % 3 if (b2 // 2) % 4 != 3 else 0]
        for (pos, d), si in zip(rhythm, steps):
            si2 = si
            if (b2 // 2) % 4 == 2 and (pos, d) == rhythm[-1]: si2 = int(np.clip(si + rng.choice([-2, 2]), 0, len(pool) - 1))
            p = pool[si2]
            bar_i = b2 + int(pos // 4); bp = pos % 4
            # nốt mạnh: kéo về nốt của hợp âm
            ch = chords[min(bar_i, BARS - 1)]
            if True:
                tones = [x for x in range(lead_lo, lead_hi) if (x - ch[0]) % 12 in [i % 12 for i in Q[ch[1]]]]
                if tones: p = min(tones, key=lambda x: abs(x - p))
            st = bar_i * bar + swung(bp) + rng.normal(0, 0.012) + 0.015
            x = lead(midi(p), d * spb * 0.95, rng.uniform(0.5, 0.75), cfg['bright'])
            put(dry, x, st, 0.5, pan=0.15); put(rev, x, st, 0.7, pan=-0.1)
    # --- trống ---
    dr = cfg['drums']
    if dr:
        for b in range(BARS):
            if b < 2 or (b >= 30 and False): continue
            t0 = b * bar; full = b >= 4
            if dr in ('soft', 'shaker'):
                put(dry, kick(0.75), t0 + rng.normal(0, 0.004), 0.7)
                if full:
                    put(dry, kick(0.5), t0 + swung(2.5) + rng.normal(0, .004), 0.6)
                    if b % 4 == 3: put(dry, kick(0.45), t0 + swung(3.5), 0.55)
                put(dry, snare(0.7, b), t0 + 1 * spb + 0.018, 0.55, pan=0.05); put(dry, snare(0.8, b + 99), t0 + 3 * spb + 0.018, 0.55, pan=0.05)
                if rng.random() < 0.3 and full: put(dry, snare(0.2, b + 5), t0 + swung(3.5), 0.4)
                for e in range(8):
                    bp = e * 0.5
                    v = (0.9 if e % 2 == 0 else 0.5) * rng.uniform(0.7, 1.0)
                    (put(dry, shaker(v, b * 8 + e), t0 + swung(bp), 0.6, pan=0.3) if dr == 'shaker' else put(dry, hat(v, b * 8 + e), t0 + swung(bp), 0.5, pan=0.3))
            else:  # brush
                if full:
                    put(dry, kick(0.45), t0, 0.6)
                    for e in range(4): put(dry, brush(0.6 if e % 2 else 0.8, b * 4 + e), t0 + e * spb + (0.012 if e % 2 else 0), 0.6, pan=0.2)
                    put(dry, snare(0.35, b), t0 + 3 * spb + 0.02, 0.4)
    # --- reverb ---
    def ir(seed, secs=2.6):
        r = np.random.default_rng(seed).standard_normal(int(secs * SR)); t = tvec(len(r))
        sos = signal.butter(1, 2800, 'lowpass', fs=SR, output='sos')
        r = signal.sosfilt(sos, r) * np.exp(-t * 3.4); r[:int(0.018 * SR)] = 0; return r / np.sqrt(np.sum(r ** 2)) * 0.9
    wl = signal.oaconvolve(revL, ir(5), mode='full')[:N]; wr = signal.oaconvolve(revR, ir(6), mode='full')[:N]
    L += wl * 0.28; R += wr * 0.28
    # --- gập đuôi vào đầu để lặp liền mạch ---
    n_loop = int(total * SR)
    L = L[:n_loop] + np.pad(L[n_loop:], (0, max(0, n_loop - (N - n_loop))))[:n_loop][:n_loop] if False else _fold(L, n_loop)
    R = _fold(R, n_loop)
    # --- hiệu ứng băng cassette / đĩa than ---
    st = np.stack([L, R])
    t = np.arange(n_loop) / SR
    wob = 0.0018 * np.sin(2 * np.pi * 0.37 * t) + 0.0007 * np.sin(2 * np.pi * 5.1 * t + 1.0)
    src = t + np.cumsum(wob) / SR * 1.0
    src = np.clip(t + 0.0006 * np.sin(2 * np.pi * 0.37 * t), 0, t[-1])  # wow ~2 cent (bản cũ ~60 cent => nghe rờn rợn)
    st = np.stack([np.interp(src, t, st[0]), np.interp(src, t, st[1])])
    sos = signal.butter(2, 6800, 'lowpass', fs=SR, output='sos'); st = signal.sosfilt(sos, st, axis=1)
    sos = signal.butter(2, 45, 'highpass', fs=SR, output='sos'); st = signal.sosfilt(sos, st, axis=1)
    st = np.tanh(st * 1.1) / 1.1
    g = np.random.default_rng(cfg['seed'] + 1)
    crack = np.zeros(n_loop)
    for p in g.integers(0, n_loop - 400, int(total * 0.5)):
        a = g.uniform(0.002, 0.007) * (1 if g.random() < 0.85 else 2.5)
        crack[p:p + 60] += a * g.choice([-1, 1]) * np.exp(-np.arange(60) / g.uniform(4, 14))
    hiss = signal.sosfilt(signal.butter(2, [2500, 9000], 'bandpass', fs=SR, output='sos'), g.standard_normal(n_loop)) * 0.0006
    st += (crack + hiss)[None, :]
    peak = np.max(np.abs(st)); st = st / peak * 0.9
    raw = (st.T * 32767).astype('<i2').tobytes()
    os.makedirs(out_dir, exist_ok=True)
    f = f'{out_dir}/{name}.mp3'
    subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-f', 's16le', '-ar', str(SR), '-ac', '2', '-i', '-',
                    '-af', 'loudnorm=I=-20:TP=-2:LRA=7', '-c:a', 'libmp3lame', '-b:a', '112k', f], input=raw, check=True)
    print(name, f'{total:.0f}s', os.path.getsize(f) // 1024, 'KB', flush=True)

def _fold(x, n):
    y = x[:n].copy(); tail = x[n:]; y[:len(tail)] += tail; return y

if __name__ == '__main__':
    out = sys.argv[1]; names = sys.argv[2:] or list(TRACKS)
    for nm in names: render(nm, TRACKS[nm], out)
