"use strict";

/* ---- CUTSCENE NGẮN CHO TỪNG KẾT CỤC (3 trang: khoảnh khắc ra về → hậu truyện → bản tin radio) ---- */
const SOLO_ENDING_SCENES = {
  vy: {
    heart: "Sáng hôm sau, Vy không nộp thêm hồ sơ nào nữa. Cô đeo máy ghi âm, đi bộ ra bến xe buýt đầu tiên, ngồi xuống cạnh một bác tài gác đêm và hỏi: \"Bác kể cháu nghe một đêm làm việc của bác được không ạ?\"",
    mind: "Trong phòng trọ, Vy mở bảng dữ liệu và gạch đầu dòng kế hoạch cho kênh phóng sự độc lập: tên kênh, mười nhân vật đầu tiên, lịch đăng mỗi tuần. Tối đó cô đăng tập đầu tiên, và con số lượt xem nhỏ xíu khiến cô cười đến rưng rưng.",
    silent: "Vy bước ra hẻm mà chưa vội viết gì. Cô bật máy ghi âm chỉ để thu tiếng mưa tạnh dần trên mái tôn, rồi lặng lẽ nghe lại chính tiếng ấy suốt quãng đường về."
  },
  minh: {
    heart: "Trên chuyến xe buýt sớm, Minh mở máy phác thảo giao diện một ứng dụng nhỏ: nơi các quán ăn đăng suất cơm dư mỗi tối. Lần đầu sau nhiều tháng, anh quên kiểm tra email.",
    mind: "Minh vào văn phòng sớm hơn mọi ngày và viết lên bảng trắng một dòng chữ to: \"Công cụ phải nâng đỡ con người trước.\" Rồi anh bắt đầu vẽ lại cả sơ đồ hệ thống.",
    silent: "Minh tháo kính, lau thật chậm bằng vạt áo rồi đeo lại. Anh bước ra phố trong im lặng, đôi vai đã hạ xuống một nấc, và điện thoại nằm yên trong túi suốt cả đoạn đường."
  },
  linh: {
    heart: "Trên chuyến xe điện đầu ngày, chị Linh mở cuốn sổ bìa đỏ, viết dòng đầu cho chương mới: \"Có những người thức khuya chỉ để giữ cho thành phố bớt lạnh.\" Ngòi bút lần này không còn run.",
    mind: "Chị Linh soạn một email dài gửi nhà xuất bản độc lập, đính kèm ba chương bản thảo. Trước khi bấm gửi, chị khẽ đọc to lời giới thiệu như đọc cho một người bạn nghe.",
    silent: "Chị Linh khép cuốn sổ, ôm nó vào lòng rồi đi chậm dọc con hẻm. Chị không viết gì cả, chỉ để từng bước chân tự tìm lại nhịp của câu văn."
  },
  tuan: {
    heart: "Anh Tuấn chạy nốt chuyến cuối rồi ghé mua hai phần xôi nóng. Về tới đầu ngõ, hai đứa nhỏ đã đứng chờ, reo to: \"Bố về rồi!\", và cả đêm mệt nhọc tan đi trong một cái ôm.",
    mind: "Giao ca xong, anh Tuấn không về nhà ngay. Anh lau tay, cầm xấp hồ sơ, đi thẳng tới xưởng bảo trì xe điện và gõ cửa phòng tuyển dụng.",
    silent: "Anh Tuấn ngồi thêm một lúc bên ấm nước nguội dần rồi gật đầu với chính mình. Anh đội mũ, bước ra đường, và tiếng động cơ lần này nghe êm hơn hẳn."
  },
  khang: {
    heart: "Về tới xưởng, anh Khang bật đèn trước khi các anh em đến. Anh trải một tấm da sáp ong lên bàn, đặt từng mũi kim, và khi mười hai người thợ bước vào, mùi sáp ong đã thơm khắp gian xưởng.",
    mind: "Anh Khang cầm phấn, viết lên bảng đen của xưởng một lịch mới: thứ Hai đến thứ Sáu chế tác, cuối tuần mở cửa đón khách trải nghiệm. Các anh em đọc xong, ai cũng gật đầu.",
    silent: "Anh Khang ngồi bên bàn gỗ, mân mê chiếc thẻ da nhỏ trong tay mà không nói gì. Ánh sáng đầu ngày chạm lên đôi bàn tay chai sần, và anh thấy lòng yên."
  },
  hoa: {
    heart: "Cô Hoa đi chợ sớm, mua đúng món con trai thích. Khi cậu bước ra khỏi phòng với mái tóc rối, cô chỉ hỏi: \"Hôm nay con ăn có ngon không?\", và hai mẹ con cùng bật cười.",
    mind: "Tối hôm đó, cô Hoa ngồi cạnh con trai, mở chiếc bảng tính mới. Cậu chỉ từng ô, từng công thức, còn cô ghi chép cẩn thận như một học trò chăm chỉ.",
    silent: "Cô Hoa quấn chiếc khăn len lên vai, ngồi lặng bên cửa sổ nhìn trời sáng dần. Lần đầu sau nhiều tuần, cô ngủ một giấc thật sâu."
  },
  an: {
    heart: "Bác An đứng trước một buổi giao lưu thơ đông kín người. Bác cất giọng đọc, những gương mặt trẻ lặng đi, rồi tiếng vỗ tay vang lên.",
    mind: "Bác An bê chiếc thùng sách đầu tiên tới quán, xếp lên kệ gỗ bên cửa sổ. Trên gáy mỗi cuốn, bác dán một nhãn mực tím: \"Mượn miễn phí, trả lúc nào cũng được.\"",
    silent: "Bác An ngồi bên cửa sổ quán thêm một lúc, nhẩm lại một bài thơ cũ. Giọng đọc rất khẽ, chỉ đủ cho chú mèo tam thể nghe."
  }
};

const DUO_ENDING_SCENES = {
  vy_an: {
    heart: "Chiều hôm sau, Vy tới hiệu sách cũ trước giờ đóng cửa. Bác An pha trà, lật từng lá thư của học trò xưa, còn Vy bật máy ghi âm, nghe say sưa cho tới khi nắng tắt.",
    mind: "Hai người trải tấm bản đồ khu phố lên bàn: mỗi chấm đỏ là một người cần được ghi lại. Vy đánh số, bác An đặt tên, và \"Ký Ức Hẻm Nhỏ\" bắt đầu từ chiếc bàn ấy."
  },
  minh_hoa: {
    heart: "Cuối tuần, Minh mua vé xe về quê thăm mẹ. Cùng lúc đó, cô Hoa gõ cửa phòng con trai, mang theo đĩa trái cây, và lần này cậu mở cửa.",
    mind: "Cô Hoa ngồi trước máy tính, Minh chỉ cho cô vài phím tắt. Cô ghi vào sổ từng bước, rồi cả hai hẹn nhau mở một lớp nhỏ cho các cô chú cùng tuổi."
  },
  linh_khang: {
    heart: "Anh Khang cắt một tấm da mềm, chị Linh chọn trang giấy đầu tiên. Hai món thủ công đặt cạnh nhau trên bàn gỗ, và một cuốn sổ bọc da sáp ong dần thành hình.",
    mind: "Hai người ngồi vạch kế hoạch cho bộ sưu tập: ngày ra mắt, số lượng giới hạn, câu chuyện của từng người thợ. Mỗi dòng viết xong, anh Khang lại gõ nhẹ lên bàn như đóng một mũi chỉ."
  },
  tuan_minh: {
    heart: "Hôm sau, Minh ngồi sau xe anh Tuấn trong một chuyến giao hàng ngắn, nhìn qua vai anh những con đường ngập mưa. Hai người không nói nhiều, nhưng Minh hiểu nhiều hơn cả ngàn dòng báo cáo.",
    mind: "Minh mở màn hình, nhập vào hệ thống một dòng mới: \"Điều chỉnh thời gian khi mưa ngập.\" Anh Tuấn đứng sau lưng, gật gù: \"Đấy, đúng chỗ đó!\""
  },
  tuan_hoa: {
    heart: "Anh Tuấn và cô Hoa chia tay nhau ở đầu ngõ, mỗi người một hướng về nhà. Cả hai cùng ngoái lại vẫy tay, như hai người hàng xóm quen nhau từ lâu.",
    mind: "Anh Tuấn đưa cô Hoa tờ thông tin về lớp bổ túc kỹ thuật, cô Hoa ghi lại địa chỉ một khóa học số. Hai người đổi số điện thoại, hẹn nhắn nhau khi có kết quả."
  },
  linh_an: {
    heart: "Bác An viết lên trang đầu một cuốn sổ trắng: \"Tặng cô học trò của cuộc đời.\" Chị Linh đón lấy, không nói được lời nào, chỉ cúi đầu thật sâu.",
    mind: "Hai người chọn ra mười cuốn sách đầu tiên cho câu lạc bộ đọc chậm, mỗi cuốn kẹp một tờ giấy câu hỏi. Chị Linh viết, bác An đọc lại, và tờ nào cũng có một nét mực tím."
  }
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
    caption: "Mưa tạnh. Tia nắng đầu tiên chạm vào ô cửa, rọi lên quầy gỗ nơi tám con người ngồi cạnh nhau. Thỏ Con vẫn còn một chặng đường điều trị dài phía trước, nhưng không còn đi một mình.\n\nHóa ra dòng chữ dưới đáy ly năm nào cũng là lời gửi cho chính người giữ đèn: \"Giữ ngọn đèn này sáng không phải vì có ai đến — mà vì ai cũng có thể đến.\" Kể cả bạn." }
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

  ...Object.values(DUO_PAIRINGS).flatMap((duo) => {
    const g1 = CHARACTERS[duo.guests[0]];
    const g2 = CHARACTERS[duo.guests[1]];
    return [
      {
        id: `duo_${duo.id}_heart`,
        icon: `${g1.avatar}🤝${g2.avatar}`,
        location: `GIAO THOA TRÁI TIM • ${g1.name.split(" (")[0].toUpperCase()} & ${g2.name.split(" (")[0].toUpperCase()}`,
        title: duo.endings.heart.title,
        caption: duo.endings.heart.summary,
        pages: buildEndingPages(`${g1.avatar}🤝${g2.avatar}`, DUO_ENDING_SCENES[duo.id].heart, duo.endings.heart.summary, duo.endings.heart.radioNews)
      },
      {
        id: `duo_${duo.id}_mind`,
        icon: `${g1.avatar}🚀${g2.avatar}`,
        location: `LIÊN MINH SÁNG TẠO • ${g1.name.split(" (")[0].toUpperCase()} & ${g2.name.split(" (")[0].toUpperCase()}`,
        title: duo.endings.mind.title,
        caption: duo.endings.mind.summary,
        pages: buildEndingPages(`${g1.avatar}🚀${g2.avatar}`, DUO_ENDING_SCENES[duo.id].mind, duo.endings.mind.summary, duo.endings.mind.radioNews)
      }
    ];
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

  ...TWIST_CUTSCENES
];
