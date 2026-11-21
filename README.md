# Thỏ Con Talk — Tiệm Nước Nửa Đêm

Mở `index.html` trực tiếp bằng trình duyệt là chơi được (cần mạng để tải Tailwind và font).

```
index.html            khung HTML + các màn hình/modal
css/styles.css        toàn bộ CSS tuỳ chỉnh
assets/icons/         icon trang web (SVG + PNG), manifest.webmanifest cho "Thêm vào màn hình chính"
js/01-core.js         polyfill, hằng số, lớp lưu trữ localStorage
js/data/              dữ liệu: đồ uống, nhân vật, kết cục, bài, cặp đôi, bí mật, cutscene, thành tựu
js/03-state.js        archive lưu vĩnh viễn + lịch 28 đêm
js/04-audio.js        âm thanh Web Audio
js/04b-voice.js      giọng đọc (Web Speech API), bật/tắt trong Menu
js/04c-dialogue-format.js  tách lời thoại ngôi thứ nhất khỏi phần dẫn chuyện
js/05-stage.js        sân khấu canvas
js/06-ui-cutscene.js  chuyển màn, gõ chữ, HUD, trình chiếu cutscene
js/07-narrative.js    động cơ kể chuyện (solo, song khách, chặng 2)
js/08-brewing.js      quầy pha chế 3 bước + minigame (chỉnh độ khó ở BREW_TUNING)
js/09-epilogue.js     bài DRINK, tổng kết tuần/tháng
js/10-events-boot.js  đêm 8, thành tựu, thư viện, gắn sự kiện, khởi động
js/11-dev-tools.js      công cụ dev nội bộ (?dev=1 hoặc Ctrl+Shift+D) - người chơi không thấy
```

Các file JS là script thường (không phải module) và **phải giữ đúng thứ tự** như trong `index.html`,
vì chúng dùng chung biến toàn cục.
