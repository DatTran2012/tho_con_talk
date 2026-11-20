"use strict";

const CHARACTER_DOSSIERS = [
  {
    id: "vy",
    avatar: "🎓",
    name: "Vy (22 tuổi) — Phóng Viên Trẻ",
    tier1: "Tốt nghiệp báo chí loại ưu đúng mùa cắt giảm nhân sự. Chiếc máy ghi âm cũ đeo trên cổ là kỷ vật anh trai để lại trước khi đi làm xa.",
    tier2: "Đêm nào không có lịch phỏng vấn, Vy thường ngồi ở trạm xe buýt cuối phố ghi chép lại nhịp sống của những người lao động ca đêm.",
    tier3: "6 tháng sau: Loạt phóng sự nhân văn của Vy giúp một khu xóm lao động nghèo được hỗ trợ sửa chữa mái nhà trước mùa bão."
  },
  {
    id: "minh",
    avatar: "💻",
    name: "Minh (27 tuổi) — Kỹ Sư AI",
    tier1: "Từng đạt giải lập trình toàn quốc và được săn đón vào tập đoàn công nghệ lớn, nhưng luôn mang mặc cảm khi sản phẩm mình viết vô tình thay thế nhân sự cũ.",
    tier2: "Trong ba lô của Minh luôn có một cuốn sổ phác thảo tay — nơi anh vẽ những ý tưởng phần mềm hỗ trợ người khuyết tật và người cao tuổi.",
    tier3: "6 tháng sau: Minh dẫn dắt nhóm nghiên cứu công nghệ vì cộng đồng và giữ thói quen tắt toàn bộ thiết bị điện tử sau 9 giờ tối mỗi ngày."
  },
  {
    id: "linh",
    avatar: "🖋️",
    name: "Chị Linh (31 tuổi) — Biên Tập Viên",
    tier1: "Rời quê lên thành phố với ước mơ xuất bản sách văn học, nhưng cuốn vào guồng quay tin tức nhanh khiến chị dần đánh mất niềm vui viết lách.",
    tier2: "Cuốn sổ bìa đỏ chị luôn ôm theo đã viết kín hơn 200 trang bản thảo về những cuộc gặp gỡ tình cờ nơi góc phố.",
    tier3: "6 tháng sau: Tập tản văn đầu tay của chị Linh được tái bản lần thứ ba và nằm trên kệ sách trang trọng nhất của Thỏ Con Talk."
  },
  {
    id: "tuan",
    avatar: "🚚",
    name: "Anh Tuấn (35 tuổi) — Tài Xế & Thợ Cơ Khí",
    tier1: "Có 12 năm kinh nghiệm sửa chữa động cơ; tạm chạy giao hàng đêm để giữ trọn tiền học cho hai con nhỏ trong giai đoạn chuyển giao.",
    tier2: "Trong ví anh luôn kẹp bức tranh vẽ bằng bút sáp màu của cô con gái nhỏ với dòng chữ: 'Bố Tuấn là siêu nhân chạy đêm'.",
    tier3: "6 tháng sau: Anh Tuấn trở thành tổ trưởng kỹ thuật xưởng xe điện và cuối tuần nào cũng đưa hai con đi công viên thả diều."
  },
  {
    id: "khang",
    avatar: "🧵",
    name: "Anh Khang (38 tuổi) — Nghệ Nhân Đồ Da",
    tier1: "Gắn bó với nghề thuộc da và khâu tay thủ công gần 20 năm, gồng mình giữ xưởng để 12 anh em thợ không phải rời bỏ nghề.",
    tier2: "Anh có thói quen khắc một dấu hiệu nhỏ bí mật ở mặt trong mỗi sản phẩm như lời chúc bình an gửi tới người sử dụng.",
    tier3: "6 tháng sau: Xưởng da sáp ong của anh Khang trở thành điểm trải nghiệm thủ công nổi tiếng, đào tạo thêm nhiều học viên trẻ yêu nghề."
  },
  {
    id: "hoa",
    avatar: "🧶",
    name: "Cô Hoa (44 tuổi) — Kế Toán & Người Mẹ",
    tier1: "Một mình nuôi con trai khôn lớn suốt nhiều năm bằng sự cần mẫn và đức hy sinh thầm lặng.",
    tier2: "Chiếc khăn len màu hổ phách cô đan tặng quán được cô thức đan từng mũi vào mỗi tối sau khi hoàn thành sổ sách.",
    tier3: "6 tháng sau: Cô Hoa tự tin điều hành bộ phận phân tích tài chính số và có những buổi tối trò chuyện đầy tiếng cười cùng con trai."
  },
  {
    id: "an",
    avatar: "👓",
    name: "Bác An (68 tuổi) — Cựu Giáo Viên Văn",
    tier1: "Bốn mươi năm đứng trên bục giảng dạy Văn, vẫn giữ thói quen đi bộ mỗi đêm ngang qua hiệu sách cũ đầu phố.",
    tier2: "Bác lưu giữ cẩn thận từng lá thư học trò cũ gửi về từ khắp mọi miền đất nước trong một chiếc hộp gỗ trầm.",
    tier3: "6 tháng sau: Góc tủ sách cộng đồng tại quán Thỏ Con do bác An khởi xướng đã quy tụ hàng trăm đầu sách quý và nhiều bạn trẻ yêu văn chương."
  },
  {
    id: "thocon",
    avatar: "🐰",
    name: "Chủ Quán Thỏ Con — Người Gác Đêm",
    tier1: "Mở tiệm nước nhỏ cuối hẻm từ 00:00 đến 05:00 sáng, tin rằng một ly nước ấm và sự lắng nghe chân thành có thể xoa dịu mọi cơn bão lòng.",
    tier2: "Trước khi mở quán, Thỏ Con từng là một người thức trắng nhiều đêm vì lạc hướng giữa thành phố lớn, và được cứu rỗi bởi một tách trà ấm từ người lạ.",
    tier3: "6 tháng sau: Ngọn đèn vàng của Thỏ Con Talk vẫn sáng đều mỗi đêm mưa, trở thành ngôi nhà thứ hai của những tâm hồn biết tử tế với nhau.",
    tier4: "Sự thật: Thỏ Con từng nhận chẩn đoán ung thư và có lúc không còn muốn ở lại. Một chén trà ấm, bảy cuộc đời và những buổi sáng ở bệnh viện đã giúp Thỏ Con chọn ở lại, mỗi ngày một lần."
  }
];

const ALL_DUO_KEYS = Object.keys(DUO_PAIRINGS);
const STANDARD_GUEST_ORDER = ["vy", "minh", "linh", "tuan", "khang", "hoa", "an"];

/* ---- KHO BÍ MẬT: phần thưởng khi hoàn thành các mốc sưu tầm ---- */
const SECRET_VAULT = [
  {
    id: "secret_message", icon: "💌🌙", title: "Thông Điệp Dưới Đáy Ly",
    hint: "Khám phá cả 5 bí mật ẩn trên sân khấu quán để ghép trọn thông điệp.",
    reward: "🌙 Mở khóa «Đèn Trăng Khuyết» trong Custom Không Gian Quán",
    story: "Khi năm mảnh bí mật ghép lại, đáy chiếc ly cũ trên kệ hiện lên một dòng chữ khắc tay: “Giữ ngọn đèn này sáng không phải vì có ai đến — mà vì ai cũng có thể đến.” Đó là câu người chủ quán già từng nói với Thỏ Con trong đêm mưa năm xưa."
  },
  {
    id: "secret_card_17", icon: "🃏✨", title: "Lá Bài Thứ 17: Người Gác Đêm",
    hint: "Rút đủ cả 16 lá bài DRINK trên quầy gỗ.",
    reward: "🎴 Mở khóa góc trang trí «Chồng Bài DRINK Phát Sáng»",
    story: "Dưới đáy hộp bài DRINK còn một lá trắng chưa từng ai rút. Mặt trước viết bằng bút mực vàng: “Nếu đêm nay là đêm cuối cùng quán mở cửa, bạn muốn nói gì với người đang ngồi đối diện?” Thỏ Con lật lá bài, mỉm cười đáp: “Cảm ơn bạn đã ghé — vì nhờ có bạn, ngọn đèn này mới có lý do để sáng.”"
  },
  {
    id: "secret_signature", icon: "🍵🤍", title: "Ly Thứ Bảy Không Tên",
    hint: "Mở khóa đủ 6 món độc quyền của quán.",
    reward: "🪵 Mở khóa «Quầy Gỗ Viền Vàng» trong Custom Không Gian Quán",
    story: "Sau khi thuộc lòng sáu công thức, Thỏ Con tìm thấy trong ngăn kéo quầy một mảnh giấy ố vàng của người chủ quán già: “Ly thứ bảy: một chén trà hoa cúc mật ong, thêm một lát gừng mỏng, và một lần lắng nghe thật lòng.” Bên dưới ghi thêm: “Món này không có tên — tên của nó là tên của người đang uống.”"
  },
  {
    id: "secret_keepsakes", icon: "🏺💡", title: "Kệ Kỷ Vật Sáng Đèn",
    hint: "Sưu tầm đủ 7 kỷ vật từ 7 vị khách.",
    reward: "🏺 Mở khóa góc trang trí «Kệ Bảy Kỷ Vật» trên quầy",
    story: "Cuộn băng phỏng vấn, chú vịt cao su, cuốn sổ bìa đỏ, chiếc cờ lê bạc, thẻ da sáp ong, khăn len hổ phách và cây bút ngòi vàng — bảy món đồ nhỏ xếp cạnh nhau bỗng tỏa ra một quầng sáng ấm. Thỏ Con chợt hiểu: quán này không chỉ pha nước, mà còn giữ hộ mọi người những mảnh ký ức đẹp nhất."
  },
  {
    id: "secret_endings", icon: "📖🕯️", title: "Trang Cuối Sổ Tay Thỏ Con",
    hint: "Mở khóa toàn bộ 33 kết cục câu chuyện.",
    reward: "🎼 Mở khóa kênh nhạc «Khúc Ca Của Người Gác Đêm»",
    story: "Ba mươi ba ngã rẽ đã khép lại. Ở trang cuối cuốn sổ tay, Thỏ Con viết: “Gửi những người đã ngồi trước quầy gỗ này — tôi không cứu ai cả. Tôi chỉ giữ cho đèn sáng, còn các bạn tự tìm thấy đường về. Cảm ơn vì đã cho một người lạc hướng năm nào có lý do để ở lại.”"
  },
  {
    id: "secret_cat", icon: "🐱🔔", title: "Tên Thật Của Mèo Tam Thể",
    hint: "Vuốt ve chú mèo tam thể thật nhiều lần (đủ 20 lần).",
    reward: "🔔 Chú mèo được đeo chiếc chuông vàng nhỏ trên sân khấu quán",
    story: "Sau lần vuốt thứ hai mươi, chú mèo tam thể ngẩng đầu, kêu một tiếng thật khẽ. Thỏ Con chợt nhớ ra: người chủ quán già từng gọi nó là “Bánh Quy” — vì nó luôn nằm cạnh đĩa bánh quy gừng. Từ giờ, chú mèo có tên, và có cả một chiếc chuông vàng để báo hiệu mỗi khi khách đến."
  },
  {
    id: "secret_clock", icon: "🕰️🌌", title: "Giờ Thứ Hai Mươi Lăm",
    hint: "Chiếc đồng hồ treo tường dường như đang đợi ai đó chạm vào nó… thật nhiều lần.",
    reward: "🕰️ Đồng hồ viền vàng, kim chạy theo giờ thật của bạn",
    hiddenProgress: true,
    story: "Lần chạm thứ bảy, kim đồng hồ khẽ rung rồi dừng lại giữa hai con số. Có một giờ không nằm trên mặt đồng hồ — giờ của những người thức khuya mà không ai kể, nơi mọi mệt mỏi được phép nghỉ ngơi. Thỏ Con thì thầm: “Chào mừng đến giờ thứ hai mươi lăm.”"
  },
  {
    id: "secret_seasons", icon: "🌸🍂❄️", title: "Mùa Thứ Năm: Hừng Đông",
    hint: "Ngắm đủ cả 4 mùa Xuân – Hạ – Thu – Đông qua ô cửa sổ quán.",
    reward: "🌅 Ô cửa sổ có thêm vệt nắng Hừng Đông ở chân trời",
    story: "Xuân có hoa đào, hạ có đom đóm, thu có mưa rả rích, đông có tuyết rơi. Nhưng mùa thứ năm không nằm trong lịch: đó là khoảnh khắc ngay trước bình minh, khi mọi cơn mưa tạnh. Một vệt nắng vàng nhạt chạm vào bậu cửa — mùa của những người vừa vượt qua đêm dài."
  },
  {
    id: "secret_perfect", icon: "🤲🌟", title: "Bàn Tay Vàng Của Thỏ Con",
    hint: "Pha chế đạt chuẩn Hoàn Hảo 8 ly nước.",
    reward: "🥂 Ly nước trên quầy có viền vàng lấp lánh",
    story: "Tám ly hoàn hảo — nhưng khách nhớ mãi không phải vị nước, mà là cảm giác được pha riêng cho mình. Bí quyết của người chủ quán già hóa ra đơn giản: “Pha bằng đôi tay, nhưng rót bằng cả tấm lòng.” Chiếc ly trên quầy bắt đầu ánh lên một viền vàng nhỏ."
  },
  {
    id: "secret_master", icon: "🚪🌅", title: "Cánh Cửa Thứ Hai",
    hint: "Mở mọi bí mật còn lại, rồi vào «🌅 Đêm Hội Ngộ» trong Menu và bấm nút tiếp tục ở cuối đêm hội ngộ.",
    reward: "👑 Ngôi sao vàng lấp lánh trên đầu Thỏ Con",
    hiddenProgress: true,
    story: "Khi mọi bí mật đã được kể, phía sau quầy gỗ hiện ra một cánh cửa nhỏ chưa từng có. Thỏ Con đẩy nhẹ: bên kia là con hẻm sáng nắng, và ở đầu hẻm, người chủ quán già đang đứng mỉm cười, gật đầu như muốn nói: “Cháu đã giữ đèn thay ta rất tốt.” Ngọn đèn vàng của Tiệm Nước Nửa Đêm sẽ sáng mãi."
  }
];
