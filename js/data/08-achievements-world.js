"use strict";

const ACHIEVEMENTS = [
  { id: "ach_first_drink", title: "Tách Nước Đầu Tiên", desc: "Phục vụ thành công ly nước đầu tiên cho khách đêm mưa.", titleReward: "Người Pha Chế Tập Sự" },
  { id: "ach_duo_first", title: "Nhịp Cầu Giao Thoa", desc: "Hoàn thành thành công một Đêm Song Khách Giao Thoa.", titleReward: "Người Kết Nối Tâm Hồn" },
  { id: "ach_duo_all", title: "Sợi Chỉ Đỏ Giữa Hai Thế Hệ", desc: "Mở khóa cả 6 cặp kết cục giao thoa song khách.", titleReward: "Bậc Thầy Dệt Duyên" },
  { id: "ach_signature_1", title: "Công Thức Bí Truyền", desc: "Phối thành công 1 trong 7 món độc quyền của quán.", titleReward: "Nghệ Nhân Pha Chế" },
  { id: "ach_signature_all", title: "Bậc Thầy Quầy Gỗ", desc: "Mở khóa toàn bộ 7 món độc quyền thường của Thỏ Con Talk.", titleReward: "Chủ Quán Tuyệt Đỉnh" },
  { id: "ach_keepsake_1", title: "Kỷ Vật Đầu Đời", desc: "Nhận được kỷ vật đầu tiên từ vị khách đêm khuya.", titleReward: "Người Lưu Giữ Ký Ức" },
  { id: "ach_bookshelf_all", title: "Kệ Sách Đã Đầy", desc: "Sưu tầm đủ 7 cuốn sách của 7 vị khách trên kệ sách của quán.", titleReward: "Người Giữ Kệ Sách" },
  { id: "ach_keepsake_all", title: "Bảy Mảnh Ghép Trái Tim", desc: "Sưu tầm đủ 7 kỷ vật của 7 vị khách.", titleReward: "Người Bạn Tri Kỷ" },
  { id: "ach_endings_7", title: "Bảy Ngã Rẽ Bình Minh", desc: "Mở khóa 7 kết cục câu chuyện khác nhau.", titleReward: "Người Lắng Nghe Đêm Mưa" },
  { id: "ach_endings_18", title: "Ngọn Đèn Giữa Mùa Suy Thoái", desc: "Mở khóa 18 kết cục câu chuyện khác nhau.", titleReward: "Ngọn Đèn Hẻm Khuya" },
  { id: "ach_endings_27", title: "Trọn Vẹn 33 Ngã Rẽ Đối Thoại", desc: "Mở khóa toàn bộ 33 kết cục câu chuyện.", titleReward: "Chủ Quán Huyền Thoại" },
  { id: "ach_cards_8", title: "Người Chơi Bài Tâm Giao", desc: "Rút được 8 lá bài DRINK khác nhau.", titleReward: "Người Gợi Mở Tâm Hồn" },
  { id: "ach_cards_16", title: "Trọn Bộ Bài DRINK", desc: "Sưu tầm đủ toàn bộ 16 lá bài DRINK trên quầy.", titleReward: "Nhà Tâm Lý Nửa Đêm" },
  { id: "ach_pet_cat", title: "Người Bạn Của Mèo Tam Thể", desc: "Vuốt ve chú mèo tam thể trên quầy 5 lần.", titleReward: "Quản Gia Mèo Tam Thể" },
  { id: "ach_night_8", title: "Bình Minh Hội Ngộ", desc: "Hoàn thành Đêm Hội Ngộ Bí Mật cùng tất cả vị khách.", titleReward: "Trái Tim Tiệm Nước" },
  { id: "ach_peace_all", title: "Năm Dấu Ấn Bình Yên", desc: "Khám phá trọn vẹn 5 bí mật ẩn trên sân khấu quán.", titleReward: "Người Giữ Sự Bình Yên" },
  { id: "ach_perfect_brew", title: "Bàn Tay Vàng Quầy Gỗ", desc: "Pha chế đạt chuẩn Hoàn Hảo 3 ly nước qua thử thách quầy bar.", titleReward: "Nghệ Nhân Tinh Hoa" },
  { id: "ach_secret_5", title: "Người Giữ Bí Mật", desc: "Mở khóa 5 bí mật trong Kho Bí Mật.", titleReward: "Người Giữ Bí Mật Quán" },
  { id: "ach_secret_all", title: "Chìa Khóa Vạn Năng", desc: "Mở khóa toàn bộ bí mật trong Kho Bí Mật.", titleReward: "Người Gác Đêm Vĩnh Cửu" },
  { id: "ach_twist", title: "Người Gác Đêm Đã Về", desc: "Lắng nghe câu chuyện thật của Thỏ Con ở Cánh Cửa Thứ Hai.", titleReward: "Chiến Binh Ánh Đèn" }
];

const EASTER_EGGS = [
  { id: "egg_window", icon: "🌧️", name: "Ô Cửa Sổ Mưa Rơi", hint: "Chạm vào khung cửa sổ ngắm mưa trên sân khấu quán." },
  { id: "egg_radio", icon: "📻", name: "Chiếc Radio Cổ Trên Quầy", hint: "Chạm vào chiếc radio cổ để nghe bản tin thành phố." },
  { id: "egg_cat", icon: "🐱", name: "Chú Mèo Tam Thể Ngủ Gật", hint: "Chạm vào chú mèo tam thể nằm trên quầy gỗ." },
  { id: "egg_bunny", icon: "🐰", name: "Đôi Tai Thỏ Con", hint: "Chạm vào Chủ Quán Thỏ Con đứng sau quầy pha chế." },
  { id: "egg_deep_night", icon: "🌙", name: "Khoảnh Khắc Đêm Khuya", hint: "Tiếp tục hành trình trò chuyện đến nhịp truyện giữa đêm." }
];

const EGG_FRAGMENTS = {
  egg_window: "Giữ ngọn đèn",
  egg_radio: "này sáng",
  egg_cat: "không phải vì có ai đến —",
  egg_bunny: "mà vì",
  egg_deep_night: "ai cũng có thể đến."
};

const LOFI_CHANNELS = [
  { id: "seasonal_auto", name: "🌿 Hòa Âm Theo Mùa", notes: [261.63, 329.63, 392.0, 493.88] },
  { id: "old_piano", name: "🎹 Piano Cũ Ấm Áp", notes: [220.0, 261.63, 329.63, 392.0] },
  { id: "quiet_dawn", name: "🌅 Đêm Tĩnh Lặng", notes: [293.66, 349.23, 440.0, 523.25] },
  { id: "night_keeper", name: "🕯️ Khúc Ca Người Gác Đêm", notes: [196.0, 246.94, 293.66, 392.0], requires: "secret_endings" }
];

const SEASON_THEMES = [
  {
    id: "spring_blossom",
    icon: "🌸",
    name: "🌸 Xuân Phố Nhỏ",
    shortLabel: "🌸 Xuân Phố Nhỏ",
    bgTop: "#1e1b38",
    bgBottom: "#0e0c18",
    lantern: "#f472b6",
    weatherType: "petals",
    filterFreq: 1350,
    ambienceLabel: "Mưa phùn xuân & chuông gió",
    notes: [329.63, 392.0, 440.0, 523.25, 659.25],
    desc: "Cánh hoa đào bay lất phất ngoài ô cửa, mưa phùn nhẹ và tiếng chuông gió thanh thoát."
  },
  {
    id: "summer_breeze",
    icon: "🌿",
    name: "🌿 Hạ Đêm Đom Đóm",
    shortLabel: "🌿 Hạ Đêm Đom Đóm",
    bgTop: "#0a2922",
    bgBottom: "#080f0d",
    lantern: "#34d399",
    weatherType: "fireflies",
    filterFreq: 720,
    ambienceLabel: "Gió đêm mùa hạ & tiếng dế",
    notes: [293.66, 349.23, 440.0, 523.25],
    desc: "Đom đóm lập lòe ngoài hiên xanh, gió hạ dịu mát hòa cùng tiếng dế đêm êm đềm."
  },
  {
    id: "autumn_rain",
    icon: "🍂",
    name: "🍂 Thu Mưa Hẻm Nhỏ",
    shortLabel: "🍂 Thu Mưa Hẻm Nhỏ",
    bgTop: "#1c1917",
    bgBottom: "#0c0a09",
    lantern: "#f59e0b",
    weatherType: "rain",
    filterFreq: 950,
    ambienceLabel: "Mưa thu rả rích & lá vàng",
    notes: [261.63, 329.63, 392.0, 493.88],
    desc: "Mưa thu rả rích bên hiên vàng ấm, lá thu rơi khẽ và giai điệu piano hoài niệm."
  },
  {
    id: "winter_chill",
    icon: "❄️",
    name: "❄️ Đông Sương Giá",
    shortLabel: "❄️ Đông Sương Giá",
    bgTop: "#0f172a",
    bgBottom: "#090d16",
    lantern: "#38bdf8",
    weatherType: "snow",
    filterFreq: 520,
    ambienceLabel: "Gió đông trầm & bếp than hồng",
    notes: [220.0, 261.63, 329.63, 392.0],
    desc: "Bông tuyết rơi nhẹ đọng trên bậu cửa, tiếng gió đông trầm ấm quyện ánh lửa hồng."
  }
];

const CAFE_CUSTOM_OPTIONS = {
  lantern: {
    label: "🏮 Kiểu Ánh Đèn Quán",
    choices: [
      { id: "lantern_classic", name: "🏮 Đèn Lồng Giấy" },
      { id: "lantern_star", name: "✨ Dây Đèn Sao" },
      { id: "lantern_vintage", name: "🕯️ Đèn Đồng Cổ" },
      { id: "lantern_moon", name: "🌙 Đèn Trăng Khuyết", requires: "secret_message" }
    ]
  },
  counter: {
    label: "🪵 Chất Liệu Quầy Gỗ",
    choices: [
      { id: "wood_oak", name: "🪵 Gỗ Thông Mật" },
      { id: "wood_walnut", name: "🌰 Gỗ Óc Chó" },
      { id: "wood_linen", name: "🧵 Khăn Thổ Cẩm" },
      { id: "wood_gold", name: "✨ Viền Vàng", requires: "secret_signature" }
    ]
  },
  decor: {
    label: "🪴 Góc Trang Trí Trên Quầy",
    choices: [
      { id: "decor_seasonal", name: "🌸 Tự Động Theo Mùa" },
      { id: "decor_books", name: "📚 Sách Cũ & Nến" },
      { id: "decor_gramophone", name: "🎶 Đĩa Than & Cây" },
      { id: "decor_deck", name: "🎴 Chồng Bài Phát Sáng", requires: "secret_card_17" },
      { id: "decor_keepsakes", name: "🏺 Kệ Bảy Kỷ Vật", requires: "secret_keepsakes" }
    ]
  }
};
