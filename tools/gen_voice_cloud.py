#!/usr/bin/env python3
"""Tạo lại 1032 file mp3 thoại bằng giọng neural đám mây (nghe giống người hơn Piper offline nhiều).
Dùng Azure Speech (vi-VN-HoaiMyNeural nữ, vi-VN-NamMinhNeural nam). Gói miễn phí 500.000 ký tự/tháng; game cần ~112.000 ký tự.
Cách dùng (cần khóa của chính bạn, KHÔNG đưa khóa cho ai):
  pip install requests
  export AZURE_KEY=... AZURE_REGION=southeastasia
  python3 tools/gen_voice_cloud.py tools/voice_lines.json assets/voice [voice_id ...]
File ra trùng tên khóa (key.mp3) nên ghi đè thẳng, không phải sửa code game. Chạy lại được (bỏ qua file đã có, dùng --force để ghi đè)."""
import os, sys, re, json, requests, time
KEY, REGION = os.environ.get('AZURE_KEY'), os.environ.get('AZURE_REGION', 'southeastasia')
# giọng + cao độ (%) + tốc độ (%) cho từng nhân vật; chỉ có 2 giọng gốc nên khác biệt tạo bằng pitch/rate
VOICES = {
  'thocon':  ('vi-VN-HoaiMyNeural', '+12%', '-4%'),   # bé thỏ: nữ, cao, nhẹ
  'narrator':('vi-VN-NamMinhNeural', '-2%', '-6%'),
  'vy':      ('vi-VN-HoaiMyNeural', '+4%', '+4%'),
  'linh':    ('vi-VN-HoaiMyNeural', '-2%', '-3%'),
  'hoa':     ('vi-VN-HoaiMyNeural', '-10%', '-10%'),  # cô Hoa: nữ, trầm, chậm
  'minh':    ('vi-VN-NamMinhNeural', '+4%', '+2%'),
  'tuan':    ('vi-VN-NamMinhNeural', '-8%', '-4%'),
  'khang':   ('vi-VN-NamMinhNeural', '-4%', '-2%'),
  'an':      ('vi-VN-NamMinhNeural', '-16%', '-14%'),  # bác An: nam, trầm, chậm
}
SAD = re.compile(r'nhớ|buồn|mệt|xin lỗi|khóc|cô đơn|mất|đau|sợ|tiếc|một mình|muộn|tủi|im lặng', re.I)
HAPPY = re.compile(r'cảm ơn|vui|tuyệt|thích|hạnh phúc|cười|ngon|đẹp|chúc|mừng|tốt quá', re.I)
def esc(t): return t.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')
def ssml(raw, v):
    name, pitch, rate = VOICES.get(v, VOICES['narrator'])
    t = re.sub(r'<[^>]*>', ' ', raw); t = re.sub(r'[\U0001F000-\U0001FAFF☀-➿️‍“”"]', '', t)
    parts = []
    for s in re.findall(r'[^.!?…]+[.!?…]*', t):
        s = s.strip()
        if not s: continue
        p, r, brk = 0, 0, 250
        if SAD.search(s): p, r, brk = -4, -10, 450
        elif HAPPY.search(s): p, r = 3, 5
        if s.endswith('?'): p += 3
        if s.endswith('!'): p += 3; r += 6
        if s.endswith('…'): r -= 8; brk = 550
        parts.append(f'<prosody pitch="{p:+d}%" rate="{r:+d}%">{esc(s)}</prosody><break time="{brk}ms"/>')
    return (f"<speak version='1.0' xml:lang='vi-VN' xmlns='http://www.w3.org/2001/10/synthesis'><voice name='{name}'>"
            f"<prosody pitch='{pitch}' rate='{rate}'>{''.join(parts)}</prosody></voice></speak>")
def main():
    if not KEY: sys.exit('Thiếu AZURE_KEY')
    args = [a for a in sys.argv[1:] if not a.startswith('--')]; force = '--force' in sys.argv
    lines = json.load(open(args[0], encoding='utf8')); out = args[1]; only = set(args[2:]); os.makedirs(out, exist_ok=True)
    url = f'https://{REGION}.tts.speech.microsoft.com/cognitiveservices/v1'
    for i, l in enumerate(lines):
        if only and l['voice'] not in only: continue
        f = f"{out}/{l['key']}.mp3"
        if os.path.exists(f) and not force: continue
        for tr in range(4):
            r = requests.post(url, data=ssml(l.get('raw') or l['text'], l['voice']).encode('utf8'), headers={
                'Ocp-Apim-Subscription-Key': KEY, 'Content-Type': 'application/ssml+xml',
                'X-Microsoft-OutputFormat': 'audio-24khz-48kbitrate-mono-mp3', 'User-Agent': 'thocon-talk'})
            if r.status_code == 200: open(f, 'wb').write(r.content); break
            time.sleep(2 * (tr + 1))
        else: print('LỖI', r.status_code, r.text[:120], l['key'])
        if i % 50 == 0: print(i, '/', len(lines), flush=True)
main()
