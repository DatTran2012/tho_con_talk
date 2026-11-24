#!/usr/bin/env python3
"""Sau khi tạo/ghi đè mp3: dựng lại assets/voice/manifest.js. Chạy: python3 tools/make_manifest.py"""
import os
d = os.path.join(os.path.dirname(__file__), '..', 'assets', 'voice')
ks = sorted(f[:-4] for f in os.listdir(d) if f.endswith('.mp3'))
open(os.path.join(d, 'manifest.js'), 'w').write('/* Tự sinh: danh sách khóa các câu thoại đã có file mp3 */\nconst VOICE_CLIPS = new Set([' + ', '.join('"%s"' % k for k in ks) + ']);\n')
print(len(ks), 'clip')
