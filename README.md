# Thỏ Con Talk — Tiệm Nước Nửa Đêm

Mở `index.html` trực tiếp bằng trình duyệt là chơi được (cần mạng để tải Tailwind và font).

```
index.html            khung HTML + các màn hình/modal
css/styles.css        toàn bộ CSS tuỳ chỉnh
assets/icons/         icon trang web (SVG + PNG), manifest.webmanifest cho "Thêm vào màn hình chính"
js/01-core.js         polyfill, hằng số, lớp lưu trữ localStorage
js/data/              dữ liệu: đồ uống, nhân vật, kết cục, bài, bí mật, cutscene, thành tựu
js/03-state.js        archive lưu vĩnh viễn + lịch 28 đêm
js/04-audio.js        âm thanh Web Audio
js/04b-voice.js      giọng đọc (Web Speech API) — **bản phát hành đang tắt hẳn**, chỉ hiện khi bật chế độ DEV (đổi `VOICE_DEV_ONLY` ở đầu file để mở lại cho mọi người)
js/04c-dialogue-format.js  tách lời thoại ngôi thứ nhất khỏi phần dẫn chuyện
js/05-stage.js        sân khấu canvas
js/06-ui-cutscene.js  chuyển màn, gõ chữ, HUD, trình chiếu cutscene
js/07-narrative.js    động cơ kể chuyện (solo, song khách, chặng 2)
js/08-brewing.js      quầy pha chế 3 bước + minigame (chỉnh độ khó ở BREW_TUNING)
js/09-epilogue.js     bài DRINK, tổng kết tuần/tháng
js/09b-night-history.js  nhật ký các đêm (xem lại thoại + lựa chọn)
js/10-events-boot.js  đêm 8, thành tựu, thư viện, gắn sự kiện, khởi động
js/11-dev-tools.js      công cụ dev nội bộ (?dev=1 hoặc Ctrl+Shift+D) - người chơi không thấy
```

Các file JS là script thường (không phải module) và **phải giữ đúng thứ tự** như trong `index.html`,
vì chúng dùng chung biến toàn cục.
## Giọng đọc & nhạc nền
## Giọng đọc mp3 & nhạc nền (tự tạo, không cần mạng)
- `assets/music/*.mp3` (7 bản lo-fi): xuân / hạ / thu / đông (theo mùa của tuần), Piano Cũ, Đêm Tĩnh Lặng, Khúc Ca Người Gác Đêm (kênh bí mật). Nhạc lặp liền mạch (chồng mờ 3 giây) và tự nhỏ đi khi có người nói.
- Giọng đọc dùng giọng tiếng Việt của trình duyệt (file mp3 thoại đã được gỡ khỏi bản này; các script trong `tools/` chỉ còn để tham khảo).
- Chế độ dev có thêm nút nghe thử 8 giọng, nghe thử từng bản nhạc, thống kê file.

## Tailwind (CSS đã build sẵn, chạy được khi offline)
`css/tailwind.css` được build từ `index.html` + `js/**/*.js`. Nếu thêm class Tailwind mới, build lại:

    cd tools && npm i tailwindcss@3.4.17 && npx tailwindcss -c tailwind.config.js -i tailwind.input.css -o ../css/tailwind.css --minify


## Kết cục và Cánh Cửa Thứ Hai (cập nhật)
- **21 kết cục** (7 vị khách × 3 nhánh tim/trí/lặng), mở ở **Chương 4** khi từng khách chọn đường đi tương lai:
  đêm 22 Vy, 23 Minh, 24 Linh + bác An, 25 Khang + cô Hoa, 26 Tuấn. Các đêm có hai khách mở cả hai kết cục cùng lúc.
  Dữ liệu: `js/data/03-endings.js`, cảnh chữ: `js/data/07-ending-cutscenes.js`. Kết cục song khách cũ đã bỏ.
- **Hai kết sau 28 đêm.** Lần đầu đi trọn 28 đêm sẽ tự phát **Kết thứ nhất «Tấm Biển Tạm Nghỉ»** (3 cảnh `quiet_01..03`: quán vẫn rôm rả, rồi đóng cửa vô thời hạn, không ai biết Thỏ Con bị gì). **Cánh Cửa Thứ Hai** (sự thật) là kết thứ hai và có điều kiện: đã xem kết thứ nhất VÀ nghe đủ 10/28 «lời thật» của khách (lời thật cộng dồn qua các lần chơi). Hằng `TWIST_TRUTHS_NEEDED`, hàm `isTwistUnlocked()`, cờ `quietEndingSeen`. Ai đã xem Cánh Cửa từ trước vẫn giữ quyền mở.
- **3 kết cuối của Thỏ Con** (Tám Chiếc Ghế / Tấm Lịch Trên Tường / Giấc Ngủ Đầu Tiên) tùy đa số trong 3 lựa chọn (hai lựa chọn trong cảnh bảy người + nguyên liệu ly cuối 🍯/🍋/🌼; nếu cả ba khác nhau thì nguyên liệu ly cuối quyết định) trong cảnh bảy người.
  Cảnh động: `SceneFX` các kind `tw_book`, `tw_card`, `tw_drink`, `tw_birds`, `tw_final` (xem thử trong bảng DEV).
- Hạt giống báo trước và hai cảnh khách phản ứng khác đi nằm trong `STORY_EXTRAS` ở `js/data/09-story-index.js`.
- **Ly nước trong cảnh kết:** cảnh kết mở khóa có thêm một trang nhắc ly nước bạn đã pha cho vị khách đó (lưu ở `endingDrinks`, xem lại được trong Thư viện).
- **Giữ giọng:** `CafeVoice.hold/release` — cảnh hiệu ứng toàn màn hình tạm dừng giọng đọc, câu thoại gọi trong lúc chiếu sẽ được đọc sau.
- **Ly hỏng:** hỏng ly bắt buộc pha lại; hết 3 lượt vẫn phải mời nhưng chỉ là Mộc Mạc.
- **Hộp Thư Khuya (radio):** đêm 1–7 radio đọc một lá thư giấu tên của từng vị khách; vài đêm sau, người viết lỡ miệng nhắc lại. Đêm 28 radio đọc lá thư cuối của "một người gác đêm". Dữ liệu ở `STORY_EXTRAS` (`start:true`) trong `js/data/09-story-index.js`.
- **Chuyện đời thường:** mỗi khách có một đoạn vừa buồn cười vừa nặng (giá cả, AI, hàng xóm, thuốc men...) chèn vào chương 2–3.
- **Hỏi mở Cánh Cửa Thứ Hai:** sau khi xong 28 đêm (và kết thứ nhất đã xem, điều kiện đã đủ), bấm "Tiếp Tục" ở tổng kết tháng sẽ hiện hộp hỏi "Mở Cánh Cửa / Để Sau" (chỉ hỏi một lần, cờ `twistAsked`; nút trong Menu vẫn còn).
- **Chỗ thở:** hầu hết các đêm có một chi tiết vặt vui vui (Bánh Quy, radio lạc sóng, chú vịt cao su...) đặt trước mốc cuối đêm, để chuyện nặng có chỗ lắng xuống (`STORY_EXTRAS`, mục "CHỖ THỞ").
- **Đêm lắng nghe (đêm 16, cô Hoa):** bước `brew` có cờ `{ quiet: true }` → không minigame, chỉ rót một tách chậm; đổi lại cô Hoa nói luôn "lời thật" của chương 3.
- **Kết "Khoảng Lặng" bỏ ngỏ:** 7 kết thuộc nhánh im lặng không khép trọn, để lại một câu hỏi (thư chưa gửi, bộ chén đũa thứ hai...).
- **Lời thật:** pha một ly hoàn hảo cho khách thì họ nói thêm một điều ly thường không nghe được (mỗi khách 1 lời/chương, 28 lời).
  Dữ liệu `GUEST_TRUTHS` trong `js/data/09-story-index.js`; xem lại ở Sổ Tay (sơ đồ nhánh).

- **DEV:** nút «🪧 Xem thử KẾT THỨ NHẤT»; các nút mô phỏng hết 28 đêm (simlow/simmid/simfull) đã đặt lại cờ để đi qua đúng luồng mới.
- **3 kết lớn bổ sung** (`FINALE_ENDINGS`, cờ `finalesSeen`, mỗi kết tự phát một lần, xem lại trong Sổ Cảnh): «Người Nghe Cuối Cùng» (lượt chơi nghiêng về 🤫 và nghe ≥ 5 lời thật; lời thật cộng dồn nên người giỏi cũng gặp được, kết bỏ ngỏ), «Bảy Chiếc Chìa Khóa» (đã có kết tim/trí của cả 7 khách), «Ngày Thỏ Con Khỏe Lại» (tự phát sau khi xem đủ 3 biến thể Cánh Cửa Thứ Hai). Lần đầu xong 28 đêm luôn chỉ ra kết thứ nhất; hai kết đầu chỉ xuất hiện từ lần chơi sau, mỗi lần tối đa một kết. DEV có nút «🎬 Xem thử 3 KẾT MỚI».
- **DEV tái hiện luồng thật 3 kết bổ sung:** «🎯 Tái hiện luồng thật…» ×3 (tự đặt điều kiện rồi chạy tổng kết 28 đêm / Cánh Cửa).
- **Tiến độ & thống kê:** thanh tiến độ có dòng «👑 Kết lớn x/5» (thay dòng Cánh Cửa cũ, trọng số 8; Kết cục còn 26). 100% cần đủ 5 kết lớn: Tấm Biển Tạm Nghỉ, Cánh Cửa Thứ Hai, Người Nghe Cuối Cùng, Bảy Chiếc Chìa Khóa, Ngày Thỏ Con Khỏe Lại. Trang cảm ơn/chúc mừng cũng hiện «Kết lớn». Kết «Ngày Thỏ Con Khỏe Lại» nói rõ bác sĩ báo kết quả đã ổn (tái khám định kỳ), không hứa điều gì tuyệt đối.
- **Cảnh động cho 4 kết lớn** (SceneFX: `end_quiet`, `end_last`, `end_hands`, `end_heal`) chen giữa cảnh chữ đầu và các cảnh chữ còn lại (`playEndingSequence`). Chạm để bỏ qua; nếu bật giảm chuyển động thì tự bỏ qua cảnh động.
- **Save cũ** (đã xong 28 đêm trước khi có kết thứ nhất): Menu hiện nút «🪧 Xem Kết Thứ Nhất» cho đến khi xem xong (`#btn-quiet-ending`).
- **Chỉnh ngưỡng lời thật:** DEV có nút «💬 Đặt số LỜI THẬT…»; toast mỗi lần nghe lời thật hiện thêm «mở cửa: x/10» sau khi đã xem kết thứ nhất.
