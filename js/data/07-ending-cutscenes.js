"use strict";

/* ---- CUTSCENE NGẮN CHO TỪNG KẾT CỤC (3 trang: khoảnh khắc ra về → hậu truyện → bản tin radio) ---- */
const SOLO_ENDING_SCENES = {
  vy: {
    heart: "Sáng hôm sau, Vy bấm gửi lá thư trả lời tòa soạn. Rồi cô đeo máy ghi âm, đi bộ ra bến xe buýt đầu tiên, ngồi xuống cạnh một bác tài gác đêm và hỏi: \"Bác kể cháu nghe một đêm làm việc của bác được không ạ?\"",
    mind: "Trong phòng trọ, Vy mở bảng kế hoạch cho chuyên mục riêng: tên chuyên mục, mười nhân vật đầu tiên, lịch đăng mỗi tháng. Cô gửi bản đề xuất cho tòa soạn, và dòng chữ \"mỗi tháng một nhân vật\" khiến cô cười đến rưng rưng.",
    silent: "Vy ngồi lại bên cửa sổ khi mọi người đã đi. Bức thư trả lời nằm trong điện thoại, chưa gửi. Cô nhìn nút gửi một lúc lâu, rồi úp màn hình xuống bàn.",
  },
  minh: {
    heart: "Trên chuyến xe buýt sớm, Minh soạn một email ngắn gửi ban giám đốc: \"Tôi xin không ký.\" Anh bấm gửi, rồi lần đầu sau nhiều tháng, anh quên kiểm tra hộp thư.",
    mind: "Minh vào văn phòng sớm hơn mọi ngày, đặt bản đề xuất đào tạo lại lên bàn ban giám đốc và viết lên bảng trắng một dòng chữ to: \"Công cụ phải nâng đỡ con người trước.\"",
    silent: "Minh đặt chiếc vịt cao su lên bàn phím, bản đề xuất nằm bên cạnh. Con trỏ nhấp nháy ở dòng cuối cùng. Anh không gõ thêm, cũng không xóa.",
  },
  linh: {
    heart: "Sáng hôm sau, chị Linh mở cuốn sổ bìa đỏ, viết dòng đầu cho cuốn thứ hai: \"Có những người thức khuya chỉ để giữ cho thành phố bớt lạnh.\" Ngòi bút lần này không còn run.",
    mind: "Trong góc quán mượn làm phòng thu, bác An ngồi trước chiếc micro nhỏ, chị Linh ngồi bên bấm nghỉ mỗi khi giọng bác nghẹn. Bản thu đầu tiên xong, chị gửi tập tin về quê cho mẹ.",
    silent: "Chị Linh để cây bút đỏ cạnh cuốn sổ mới. Trang đầu còn trắng. Chị cầm bút xanh lên, rồi lại đặt xuống.",
  },
  tuan: {
    heart: "Anh Tuấn chạy nốt chuyến cuối rồi ghé mua hai phần xôi nóng. Về tới đầu ngõ, hai đứa nhỏ đã đứng chờ, reo to: \"Bố về rồi!\", và tờ giấy siêu nhân bước lên tường bếp.",
    mind: "Anh Tuấn mở tờ bảng chi tiêu, gạch dòng \"chạy đêm\" sau ba tháng, rồi đi thẳng tới xưởng bảo trì xe điện và bắt tay trưởng xưởng.",
    silent: "Anh Tuấn gấp tờ giấy siêu nhân làm tư, nhét vào túi áo. Ngoài cửa, chiếc xe vẫn đỗ đó, đèn pha chưa bật.",
  },
  khang: {
    heart: "Về tới xưởng, anh Khang bật đèn trước khi các anh em đến. Anh trải một tấm da sáp ong lên bàn, đặt từng mũi kim, và khi mười hai người thợ bước vào, mùi sáp ong đã thơm khắp gian xưởng.",
    mind: "Anh Khang cầm phấn, viết lên bảng đen của xưởng: \"Thứ Bảy: Da và sổ sách. Ba buổi, mười chỗ.\" Cô Hoa đứng cạnh chỉnh lại nét chữ, các anh em đọc xong, ai cũng gật đầu.",
    silent: "Anh Khang mân mê chiếc thẻ da nhỏ mà không nói gì. Mũi chỉ cuối cùng còn dở trên bàn gỗ, ánh sáng đầu ngày chạm vào đôi bàn tay chai sần.",
  },
  hoa: {
    heart: "Cô Hoa đi chợ sớm, mua nhiều hơn mọi lần. Cô xách một nồi canh lớn tới xưởng, trong chiếc ví mới có tiền chợ và một mẩu giấy: \"Cho mười hai người thợ và một người con trai.\"",
    mind: "Tối hôm đó, cô Hoa soạn giáo án ba buổi trên bảng tính: cột nào dành cho tiền da, cột nào cho tiền công. Cô ghi cẩn thận như một học trò chăm chỉ.",
    silent: "Cô Hoa quấn chiếc khăn len lên vai, ngồi bên cửa sổ nhìn trời sáng dần. Trên bàn bếp, hai bộ chén đũa vẫn đặt cạnh nhau.",
  },
  an: {
    heart: "Bác An đứng trước một buổi đọc chậm đông kín người. Bác cất giọng, nghẹn ở câu đầu, rồi đọc tiếp. Những gương mặt trẻ lặng đi, và tiếng vỗ tay vang lên.",
    mind: "Bác An bê chiếc thùng sách đầu tiên tới quán, xếp lên kệ gỗ bên cửa sổ. Trên gáy mỗi cuốn, bác dán một nhãn mực tím: \"Mượn miễn phí, trả lúc nào cũng được.\"",
    silent: "Bác An ngồi bên cửa sổ, nhẩm lại một bài thơ cũ. Trong túi áo có một lá thư chưa dán tem. Bác chạm vào nó, rồi lại thôi.",
  },
};

function buildEndingPages(icon, scene, summary, radioNews) {
  return [
    { icon, text: scene },
    { icon: "🌤️", text: summary },
    { icon: "📻", text: `Đài FM Nửa Đêm: ${radioNews}` }
  ];
}

const TWIST_CUTSCENES = [
  { id: "twist_01", icon: "🐱📄🕊️", location: "CÁNH CỬA THỨ HAI • 05:00", title: "Tờ Giấy Hẹn Khám Dưới Chiếc Khăn Len",
    caption: "Bánh Quy — chú mèo tam thể — nhảy xuống khỏi quầy, tha theo một tờ giấy gấp tư lọt ra từ túi tạp dề của Thỏ Con. Đó là lịch hẹn điều trị lúc 07:00 sáng tại bệnh viện, ghi tên một căn bệnh mà chưa ai trong quán từng nghe Thỏ Con nhắc tới: ung thư.\n\nBảy vị khách lặng đi. Hóa ra suốt những đêm qua, người lắng nghe tất cả mọi người... chưa từng kể cho ai nghe về chính mình." },
  { id: "twist_02", icon: "🌧️📞", location: "KHỞI NGUỒN THẬT SỰ • ĐÊM MƯA BA NĂM TRƯỚC", title: "Đêm Mà Thỏ Con Không Còn Muốn Ở Lại",
    caption: "Ba năm trước, sau cuộc gọi từ phòng khám, Thỏ Con đứng giữa phố mưa với tờ kết quả trong tay. Nỗi sợ, nỗi xấu hổ và cảm giác mình sẽ chỉ là gánh nặng chồng lên nhau, đến mức có một khoảnh khắc Thỏ Con tin rằng nếu mình biến mất khỏi thế giới này thì mọi người sẽ nhẹ nhõm hơn.\n\nĐó không phải sự yếu đuối. Đó là một nỗi đau quá lớn mà không có ai ở bên để chia bớt.\n\nRồi ánh đèn hiên của người chủ quán già sáng lên cuối hẻm, và một chén trà hoa cúc mật ong được đặt xuống, không một câu hỏi." },
  { id: "twist_03", icon: "🌙🤝", location: "TRONG MỘT THÁNG QUA • BẢY CÂU CHUYỆN", title: "Những Ly Nước Quay Ngược Về Phía Chủ Quán",
    caption: "Mỗi lời Thỏ Con nói với khách, hóa ra cũng là lời tự nói với chính mình.\n\nVy bị từ chối mười hai lần mà vẫn đi tiếp. Minh chọn lên tiếng thay vì im lặng. Chị Linh viết tiếp dù chỉ một trang mỗi đêm. Anh Tuấn gồng gánh vì hai đứa nhỏ. Anh Khang giữ lửa cho mười hai người thợ. Cô Hoa học cách nhờ con giúp đỡ. Bác An tin rằng một hạt giống tử tế sẽ nở hoa.\n\nBảy cuộc đời ấy, không ai hay biết, đã trở thành bảy lý do để Thỏ Con ở lại và tiếp tục điều trị." },
  { id: "twist_04", icon: "🏥🌅🧣", location: "07:00 • SAU KHI QUÁN ĐÓNG CỬA", title: "Phòng Điều Trị Lúc Bình Minh",
    caption: "Mỗi sáng, khi vị khách cuối cùng rời đi, Thỏ Con quấn chiếc khăn len hổ phách của cô Hoa, mang theo chú vịt cao su của Minh và cuốn băng của Vy, rồi đến bệnh viện. Có những buổi sáng mệt rã rời, có những ngày nỗi sợ quay lại thì thầm bên tai.\n\nNhưng ở đó, Thỏ Con nhớ tới ánh đèn vàng của quán, tới những người sẽ đẩy cửa bước vào lúc nửa đêm, và tự nhủ: \"Mình vẫn ở đây. Hôm nay mình vẫn chọn ở lại.\"" },
  { id: "twist_05", icon: "🍵🤍", location: "05:10 • LY THỨ BẢY CÓ TÊN", title: "Ly Thứ Bảy Mang Tên Thỏ Con",
    caption: "Lần này không phải Thỏ Con pha nước. Bảy người khách cùng đứng sau quầy gỗ: một chén trà hoa cúc mật ong, một lát gừng mỏng, và một lần lắng nghe thật lòng.\n\nMảnh giấy ố vàng của người chủ quán già đã nói đúng: \"Món này không có tên — tên của nó là tên của người đang uống.\" Chiếc ly được đặt trước mặt Thỏ Con." },
  { id: "twist_06", icon: "🕊️🎗️", location: "LỜI TRI ÂN • GỬI NHỮNG NGƯỜI ĐANG CHIẾN ĐẤU", title: "Gửi Những Người Đã Và Đang Đi Qua Ung Thư",
    caption: "Trò chơi này xin gửi tới những người đã và đang chiến đấu với ung thư, đặc biệt là những ai từng có lúc kiệt sức, tuyệt vọng, tưởng mình chỉ là gánh nặng. Nỗi sợ ấy là thật, và bạn không có lỗi khi cảm thấy như vậy.\n\nBạn xứng đáng được nâng đỡ. Nếu bạn đang nặng lòng, hãy nói với một người bạn tin tưởng, với bác sĩ hoặc chuyên viên tâm lý, hoặc gọi đường dây hỗ trợ khủng hoảng tại nơi bạn sống. Xin đừng giữ một mình.\n\nVà xin cúi đầu tri ân những người đã không thể ở lại tới sáng: ngọn đèn này cũng được thắp lên vì các bạn." },
  { id: "twist_07", icon: "🏮🐰🌅", location: "05:30 • NGỌN ĐÈN VẪN SÁNG", title: "Ai Cũng Có Thể Đến — Kể Cả Người Gác Đèn",
    caption: "Mưa tạnh. Tia nắng đầu tiên chạm vào ô cửa, rọi lên quầy gỗ nơi tám con người ngồi cạnh nhau. Thỏ Con vẫn còn một chặng đường điều trị dài phía trước, nhưng không còn đi một mình.\n\nHóa ra dòng chữ dưới đáy ly năm nào cũng là lời gửi cho chính người giữ đèn: \"Giữ ngọn đèn này sáng không phải vì có ai đến — mà vì ai cũng có thể đến.\" Kể cả bạn." },
  /* Ba cách Thỏ Con kết thúc Cánh Cửa Thứ Hai (tùy lời bạn đã chọn trong cảnh bảy người) */
  { id: "twist_end_heart", icon: "🪑🤍🐰", location: "05:45 • TÁM CHIẾC GHẾ", title: "Tám Chiếc Ghế Quanh Quầy",
    caption: "Thỏ Con không giấu nữa. Có đêm cô khóc ngay trên vai anh Tuấn, có đêm cô cười đến ngộp thở vì chuyện chú vịt cao su của Minh. Không ai nói được câu nào thật sáng suốt. Họ chỉ ở đó.\n\nTừ hôm ấy, quán kê thêm chiếc ghế thứ tám cạnh bếp than, chiếc ghế của người gác đèn. Tối nào cũng có ai đó ngồi vào chiếc ghế bên cạnh, để Thỏ Con biết mình không phải người duy nhất được phép yếu đuối.\n\nNhững buổi sáng ở viện vẫn dài. Nhưng mỗi lần cô bước ra, luôn có một bàn tay đang chờ ngoài cửa." },
  { id: "twist_end_mind", icon: "📅🖋️🐰", location: "05:45 • TẤM LỊCH TRÊN TƯỜNG", title: "Tấm Lịch Trên Tường",
    caption: "Thỏ Con trải tờ giấy hẹn lên quầy. Bảy người cùng đọc, cùng ghi. Chị Linh kẻ bảng bằng bút đỏ. Minh cài nhắc lịch. Anh Tuấn nhận cung đường mỗi sáng, cô Hoa nhận phần cháo nóng, anh Khang nhận chiếc áo ấm, bác An nhận những buổi chiều đọc sách bên giường, còn Vy nhận việc ghi lại để sau này Thỏ Con đọc lại và biết mình đã đi qua như thế nào.\n\nTấm lịch được dán lên tường quán, ô nào cũng có một cái tên. Ô cuối cùng để trống, ghi: “Ngày Thỏ Con khỏe lại. Chưa biết là khi nào, cứ để trống.”\n\nThỏ Con nhìn nó thật lâu: “Hóa ra đi điều trị cũng có thể là một kế hoạch, không chỉ là một bản án.”" },
  { id: "twist_end_silent", icon: "🌙🧣🐰", location: "05:45 • GIẤC NGỦ ĐẦU TIÊN", title: "Giấc Ngủ Đầu Tiên",
    caption: "Thỏ Con không nói gì. Cô đặt tờ giấy hẹn lên quầy rồi để im lặng nói thay. Không ai hỏi, không ai khuyên. Cô Hoa khoác chiếc khăn len lên vai cô. Anh Khang kéo chiếc ghế gần bếp than lại. Bác An đọc rất khẽ một bài thơ.\n\nLần đầu sau nhiều tháng, Thỏ Con ngủ gục ngay trên quầy, ly nước vẫn còn ấm bên tay. Bảy người ngồi canh đèn thay cô, không ai dám bật radio, cho đến khi mặt trời lên hẳn.\n\nKhi Thỏ Con tỉnh dậy, nắng đã rọi đầy quán. Trên quầy là bảy ly nước đã nguội và bảy mẩu giấy nhỏ: “Khi nào em muốn nói, tụi anh chị vẫn ở đây.”" }
];

/* KẾT THỨ NHẤT sau 28 đêm — "Tấm Biển Tạm Nghỉ": quán vẫn rôm rả, không ai biết gì, rồi quán đóng cửa vô thời hạn.
   Cố ý KHÔNG nói Thỏ Con bị gì. Sự thật nằm ở kết thứ hai (Cánh Cửa Thứ Hai). */
const QUIET_CUTSCENES = [
  { id: "quiet_01", icon: "🏮🍵😄", location: "ĐÊM THỨ 28 • QUÁN VẪN RÔM RẢ", title: "Một Đêm Rất Bình Thường",
    caption: "Đêm cuối của Tháng Mưa, quán đông như chưa từng đông. Cô Hoa chia bát cháo nóng cho cả quầy, anh Tuấn lần đầu tắt máy xe mà không nhìn đồng hồ, bác An đọc bài thơ mới viết cho quán, anh Khang đặt lên quầy chiếc thẻ đánh dấu sách da mới khâu, Minh bật cười vì một dòng mã chạy đúng ngay lần đầu. Chị Linh và Vy hứa sẽ nhắc nhau những điều đã định làm trong năm tới.\n\nThỏ Con pha nước, rót trà, nghe chuyện, pha trò đúng chỗ. Ai cũng nghĩ: người này lúc nào cũng vững vàng. Không một ai để ý bàn tay cầm ấm trà dừng lại thật lâu mỗi lần nhìn lên đồng hồ." },
  { id: "quiet_02", icon: "🪧🌅🚪", location: "05:40 • “MÌNH QUAY LẠI NGAY”", title: "Tấm Biển Gỗ Treo Lúc Không Ai Thấy",
    caption: "Hơn năm giờ rưỡi, Thỏ Con nhìn đồng hồ, mỉm cười: “Mình có một cuộc hẹn sớm. Mọi người cứ ngồi thêm một lát, mình quay lại ngay.”\n\nBảy người ngồi chờ bên chiếc quầy còn ấm. Tới trưa. Tới chiều. Thỏ Con không quay lại.\n\nTối hôm ấy, trên cánh cửa có thêm một tấm biển gỗ nhỏ, nét chữ ngay ngắn quen thuộc: “Quán tạm nghỉ. Cảm ơn mọi người đã ghé. Hẹn một ngày không xa.” Không ai thấy ai treo nó lên. Không lý do, không số điện thoại, không lời nhắn riêng cho ai. Bảy vị khách đoán đủ điều: chắc đi xa, chắc về quê, chắc mệt rồi cần nghỉ ngơi. Họ ghé thêm vài đêm, đứng trước cánh cửa đóng, rồi lặng lẽ đi." },
  { id: "quiet_03", icon: "📻🕯️🐱", location: "MỘT MÙA MƯA SAU • KHÔNG AI BIẾT", title: "Ngọn Đèn Không Ai Thấy Tắt",
    caption: "Tấm biển “tạm nghỉ” treo mãi, rồi bụi phủ lên, rồi không ai còn hỏi tới nữa. Quán Nửa Đêm trở thành một câu chuyện cũ mà cả bảy người thỉnh thoảng nhắc lại: “Hồi đó có một quán nhỏ, chủ quán lắng nghe giỏi lắm… không biết giờ ra sao.”\n\nKhông ai biết Thỏ Con đã mang điều gì suốt những đêm ấy, kể cả lá thư cuối của Hộp Thư Khuya, ký tên “một người gác đêm”, chẳng ai biết là của ai. Không ai biết vì sao ngọn đèn tắt. Mỗi người giữ lại một món đồ nhỏ và một ly nước không bao giờ nếm lại được.\n\nChỉ có chiếc radio cũ trong quán, im lìm trên kệ, và một cánh cửa phía sau quầy mà chưa từng có ai nghĩ tới việc gõ." }
];

/* BA KẾT LỚN BỔ SUNG (mở theo cách chơi, xem FINALE_ENDINGS trong 10-events-boot.js):
   last_*   «Người Nghe Cuối Cùng»  — thiên về 🤫, nghe được một phần lời thật; kết bỏ ngỏ
   hands_*  «Bảy Chiếc Chìa Khóa»   — đã có kết tốt (tim/trí) của cả 7 khách
   heal_*   «Ngày Thỏ Con Khỏe Lại»  — đã xem đủ 3 biến thể Cánh Cửa Thứ Hai */
const FINALE_CUTSCENES = [
  { id: "last_01", icon: "🎙️🌧️🐰", location: "09:00 • SAU CUỘC HẸN SỚM", title: "Một Câu Hỏi Không Để Đăng Báo",
    caption: "Sáng hôm sau đêm thứ 28, Thỏ Con trở về đúng như đã hẹn: “mình quay lại ngay”. Quán đã vãn, chỉ còn Vy ngồi đợi ở cuối quầy. Cô tắt máy ghi âm, đặt nó úp xuống mặt gỗ như một lời hứa không cần nói ra.\n\n“Em hỏi một câu thôi, không để viết đâu. Lá thư cuối của Hộp Thư Khuya, người gác đêm ấy… là chị, đúng không? Suốt tháng nay ai cũng kể cho chị nghe. Còn chị thì sao?”\n\nThỏ Con đang lau một chiếc ly đã sạch từ lâu. Lau thêm một lúc nữa." },
  { id: "last_02", icon: "🍵🤍🕯️", location: "09:30 • MỘT NỬA CÂU CHUYỆN", title: "Nửa Còn Lại Chưa Kể",
    caption: "“Có một chuyện mình chưa nói hết được,” Thỏ Con nói, rất chậm. “Cho mình thêm một mùa mưa nữa nhé. Mình sẽ kể, khi mình kể được.”\n\nVy không hỏi thêm một chữ. Cô rót ly nước đầu tiên của buổi sáng ấy, và lần đầu tiên là rót cho người đứng sau quầy.\n\nQuán đóng cửa như thường lệ. Tấm biển “tạm nghỉ” không bị treo lên. Không ai biết nửa còn lại là gì, chỉ biết có một người đang kiên nhẫn chờ nghe, và ngọn đèn vẫn còn sáng." },
  { id: "hands_01", icon: "🗝️🏮🚪", location: "BẢY ĐÊM SAU • QUÁN TỐI ĐÈN", title: "Bảy Chiếc Chìa Khóa",
    caption: "Có một tối quán không mở. Trên cửa chỉ có mảnh giấy ngắn bằng nét chữ quen: “Quầy là của mọi người. Cứ pha thứ mình muốn uống.”\n\nBảy người đứng trước cánh cửa tối, mỗi người cầm theo món đồ mình từng gửi lại cho quán: cuộn băng cassette, chú vịt cao su, cuốn sổ bìa đỏ, chiếc cờ lê bạc, thẻ đánh dấu sách, chiếc khăn len, cây bút máy. Anh Khang là người đầu tiên đẩy cửa, nhóm lại bếp than." },
  { id: "hands_02", icon: "📅🏮🪑", location: "MỘT MÙA SAU • ĐÈN LUÂN PHIÊN", title: "Ngọn Đèn Của Tất Cả Mọi Người",
    caption: "Trên tường quán có thêm tấm lịch trực: anh Khang nhóm bếp, cô Hoa nấu cháo, Minh lo radio và tin nhắn, chị Linh đọc sách trước giờ đóng cửa, anh Tuấn chở khách khuya về tận nhà, bác An tưới chậu cây, Vy giữ hộp thư của Đài FM Nửa Đêm.\n\nKhi Thỏ Con trở lại, đèn đã sáng, chiếc ghế sau quầy được để trống, một ly nước còn ấm. Hóa ra quán chưa bao giờ chỉ là của một người." },
  { id: "heal_01", icon: "🗓️🖍️🌸", location: "MỘT SÁNG ĐẦU XUÂN • Ô CUỐI CỦA TẤM LỊCH", title: "Ô Trống Trên Tấm Lịch",
    caption: "Buổi hẹn khám sáng hôm ấy, bác sĩ nói bằng giọng rất bình tĩnh: “Kết quả đã ổn rồi. Từ giờ chỉ cần tái khám định kỳ.” Thỏ Con ngồi lặng trong hành lang bệnh viện thật lâu, rồi bật cười, nước mắt chảy ra cùng lúc. Tờ kết quả lần này không còn làm ai sợ nữa.\n\nThỏ Con về quán, đứng trước tấm lịch dán trên tường từ mùa mưa năm ấy. Ô cuối cùng, ô để trống, ghi “Ngày Thỏ Con khỏe lại”, được chị Linh tô một nét bút đỏ thật tròn, còn Minh chèn thêm một dấu cười." },
  { id: "heal_02", icon: "🪧🏮🌅", location: "SÁNG HÔM SAU • TẤM BIỂN LẬT MẶT", title: "Hôm Nay Quán Mở Cửa",
    caption: "Sáng hôm sau, tấm biển gỗ ở cửa được lật sang mặt còn lại, vẫn nét chữ ngay ngắn quen thuộc: “Hôm nay quán mở cửa.”\n\nBảy người khách ngồi vào đúng chỗ của mình. Lần này ly nước đầu tiên là Thỏ Con pha, rồi tự rót cho mình một ly, ngồi xuống giữa bảy người.\n\nDưới đáy ly, dòng chữ cũ vẫn còn đó: “Giữ ngọn đèn này sáng không phải vì có ai đến, mà vì ai cũng có thể đến.” Và lần này, có người đến thật." }
];

const CUTSCENE_CATALOG = [
  { id: "origin_thocon_1", icon: "🌧️🐰", location: "KHỞI NGUỒN • ĐÊM MƯA BA NĂM TRƯỚC", title: "Người Lạc Hướng Giữa Thành Phố Đêm", caption: "Ba năm trước, giữa một đêm mưa tầm tã của mùa suy thoái, Thỏ Con từng lang thang qua những con phố tắt đèn với đôi vai trĩu nặng nỗi hoang mang về tương lai." },
  { id: "origin_thocon_2", icon: "🏮🍵", location: "KHỞI NGUỒN • ÁNH ĐÈN HIÊN NHỎ", title: "Tách Trà Ấm Không Hỏi Tên", caption: "Một người chủ quán già nơi cuối hẻm đã mở cửa lúc 2 giờ sáng, rót mời Thỏ Con một chén trà hoa cúc mật ong ấm nóng và chỉ lặng lẽ lắng nghe mà không hề phán xét." },
  { id: "origin_thocon_3", icon: "🐰☕✨", location: "KHỞI NGUỒN • TIỆM NƯỚC NỬA ĐÊM", title: "Ngọn Đèn Sáng Từ 00:00 Đến 05:00", caption: "Từ đêm đó, Thỏ Con tự tay đóng chiếc quầy gỗ thông này, thắp lên ngọn đèn vàng mỗi nửa đêm — để bất kỳ ai đang thức khuya giữa thành phố cũng có một bến đỗ bình yên." },




  ...Object.entries(SOLO_ENDINGS_DATA).flatMap(([gid, branches]) => {
    const ch = CHARACTERS[gid];
    return ["heart", "mind", "silent"].map((bKey) => ({
      id: `${gid}_${bKey}`,
      icon: `${ch.avatar}${bKey === "heart" ? "❤️" : bKey === "mind" ? "✨" : "🤫"}`,
      location: `KẾT CỤC • ${ch.name.toUpperCase()}`,
      title: branches[bKey].title,
      caption: branches[bKey].summary,
      pages: buildEndingPages(
        `${ch.avatar}${bKey === "heart" ? "❤️" : bKey === "mind" ? "✨" : "🤫"}`,
        SOLO_ENDING_SCENES[gid][bKey],
        branches[bKey].summary,
        branches[bKey].radioNews
      )
    }));
  }),

  {
    id: "sunrise_rooftop",
    icon: "🌅🐰☕",
    location: "05:00 • BÌNH MINH HỘI NGỘ",
    title: "Ánh Nắng Đầu Ngày Trên Tiệm Nước Nhỏ",
    caption: "Cơn mưa đêm tạnh hẳn. Những tia nắng sớm đầu tiên chiếu rọi qua khung cửa sổ tiệm nước Thỏ Con — nơi mọi câu chuyện đều tìm thấy bình yên."
  },

  ...SECRET_VAULT.filter((s) => s.id !== "secret_signature").map((s) => ({
    id: s.id,
    icon: s.icon,
    location: "🗝️ KHO BÍ MẬT • BÍ MẬT ĐÃ MỞ",
    title: s.title,
    caption: s.story
  })),

  ...QUIET_CUTSCENES,
  ...FINALE_CUTSCENES,
  ...TWIST_CUTSCENES
];
