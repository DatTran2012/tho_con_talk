"use strict";

const CHARACTERS = {
  vy: {
    id: "vy",
    name: "Vy (22 tuổi)",
    role: "Sinh Viên Báo Chí Mới Ra Trường",
    avatar: "🎓",
    hairColor: "#292524",
    outfitColor: "#d97706",
    accessory: "headphones",
    preferredBases: ["coldbrew", "peach_tea"],
    preferredAccents: ["orange_peel", "mint", "chamomile", "lemongrass"],
    needEmotion: "awake",
    keepsake: { icon: "🎙️", name: "Cuộn Băng Phỏng Vấn Đầu Tay", desc: "Cuộn băng cassette ghi lại những câu chuyện người thật việc thật trên phố đêm của Vy." },
    postcard: { title: "Bưu Thiếp Từ Tòa Soạn Độc Lập", text: "Thỏ Con ơi, bài phóng sự đầu tiên của em đã được đăng trang nhất rồi! Cảm ơn ly nước đêm mưa hôm ấy." },
    catDiary: "Cô bé đeo tai nghe này uống từng ngụm nhỏ như đang ghi âm cả hương vị. Lúc bước ra cửa, bước chân cô ấy nhẹ hơn lúc vào gấp đôi.",
    cassette: { id: "cas_vy", title: "Băng Thu Tiếng Mưa & Máy Chữ Cũ", freq: 293.66 }
  },
  minh: {
    id: "minh",
    name: "Minh (27 tuổi)",
    role: "Kỹ Sư Trí Tuệ Nhân Tạo",
    avatar: "💻",
    hairColor: "#1c1917",
    outfitColor: "#0284c7",
    accessory: "glasses",
    preferredBases: ["phin", "coldbrew", "lotus_milk"],
    preferredAccents: ["sea_salt", "mint", "nutmeg", "lavender"],
    needEmotion: "gentle",
    keepsake: { icon: "🦆", name: "Chú Vịt Cao Su Gỡ Lỗi", desc: "Chú vịt vàng nhỏ luôn ngồi cạnh bàn phím của Minh để nhắc anh lắng nghe bằng trái tim." },
    postcard: { title: "Bưu Thiếp Từ Xưởng Công Nghệ Cộng Đồng", text: "Mình đã viết lại thuật toán với chế độ ưu tiên sự an toàn của con người. Hẹn gặp lại ở quầy gỗ nhé!" },
    catDiary: "Anh chàng đeo kính này ban đầu gõ ngón tay lên bàn theo nhịp nhị phân. Sau khi uống xong ly nước, anh ấy đã biết gãi cằm cho ta đúng nhịp!",
    cassette: { id: "cas_minh", title: "Nhịp Đêm Thành Phố & Synth Ấm", freq: 329.63 }
  },
  linh: {
    id: "linh",
    name: "Chị Linh (31 tuổi)",
    role: "Biên Tập Viên Nội Dung",
    avatar: "🖋️",
    hairColor: "#451a03",
    outfitColor: "#be123c",
    accessory: "scarf",
    preferredBases: ["plum", "peach_tea"],
    preferredAccents: ["jasmine", "chamomile", "honey"],
    needEmotion: "nostalgic",
    keepsake: { icon: "📕", name: "Cuốn Sổ Tay Bìa Đỏ", desc: "Cuốn sổ chép đầy những đoạn tản văn viết bằng bút máy trong những đêm mưa." },
    postcard: { title: "Bưu Thiếp Từ Hiệu Sách Cuối Hẻm", text: "Cuốn tập san tản văn đầu tay của chị đã in xong rồi. Trang đầu tiên chị viết lời cảm ơn Tiệm Nước Nửa Đêm đấy." },
    catDiary: "Cô gái quàng khăn đỏ này có mùi mực bút máy rất thơm. Cô ấy viết vào sổ tay nhanh như cách ta vồ bóng đèn vậy.",
    cassette: { id: "cas_linh", title: "Tiếng Lật Trang Sách & Piano Mưa", freq: 349.23 }
  },
  tuan: {
    id: "tuan",
    name: "Anh Tuấn (35 tuổi)",
    role: "Tài Xế Đêm & Thợ Cơ Khí",
    avatar: "🚚",
    hairColor: "#18181b",
    outfitColor: "#15803d",
    accessory: "cap",
    preferredBases: ["phin", "malt", "brown_rice"],
    preferredAccents: ["ginger", "honey", "sea_salt", "lemongrass"],
    needEmotion: "warm",
    keepsake: { icon: "🔧", name: "Chiếc Cờ Lê Bạc Đánh Bóng", desc: "Món đồ nghề gắn bó suốt 12 năm làm thợ cơ khí của anh Tuấn, sáng bóng và bền bỉ." },
    postcard: { title: "Bưu Thiếp Từ Xưởng Bảo Trì Xe Điện", text: "Anh đã trở lại làm tổ trưởng kỹ thuật rồi em ạ. Hai đứa nhỏ ở nhà gửi lời cảm ơn chú Thỏ Con!" },
    catDiary: "Người đàn ông đội mũ lưỡi trai này có bàn tay thô ráp nhưng vuốt lông cực kỳ êm. Anh ấy mang theo mùi gió đêm và sự vững chãi.",
    cassette: { id: "cas_tuan", title: "Đài FM Quốc Lộ & Đèn Vàng Đêm", freq: 261.63 }
  },
  khang: {
    id: "khang",
    name: "Anh Khang (38 tuổi)",
    role: "Nghệ Nhân Đồ Da Thủ Công",
    avatar: "🧵",
    hairColor: "#27272a",
    outfitColor: "#92400e",
    accessory: "apron",
    preferredBases: ["malt", "phin", "brown_rice"],
    preferredAccents: ["nutmeg", "orange_peel", "ginger", "osmanthus"],
    needEmotion: "warm",
    keepsake: { icon: "🔖", name: "Thẻ Đánh Dấu Sách Da Khâu Tay", desc: "Miếng da bò thuộc khâu tay bằng chỉ sáp ong thơm dịu, khắc hình chú thỏ nhỏ." },
    postcard: { title: "Bưu Thiếp Từ Xưởng Da Sáp Ong", text: "Xưởng của anh vừa nhận được đơn đặt hàng cho cả quý tới, 12 anh em thợ ai cũng phấn khởi. Cảm ơn em!" },
    catDiary: "Người thợ đeo tạp dề da này có mùi sáp ong dễ chịu lắm. Ta đã ngủ gật ngay cạnh khuỷu tay anh ấy suốt mười phút.",
    cassette: { id: "cas_khang", title: "Nhịp Búa Gỗ & Lửa Ấm Xưởng Thủ Công", freq: 246.94 }
  },
  hoa: {
    id: "hoa",
    name: "Cô Hoa (44 tuổi)",
    role: "Kế Toán & Người Mẹ Tận Tụy",
    avatar: "🧶",
    hairColor: "#3f3f46",
    outfitColor: "#7e22ce",
    accessory: "shawl",
    preferredBases: ["peach_tea", "yuzu", "lotus_milk"],
    preferredAccents: ["honey", "ginger", "chamomile", "lavender"],
    needEmotion: "gentle",
    keepsake: { icon: "🧣", name: "Chiếc Khăn Len Đan Tay", desc: "Chiếc khăn len màu hổ phách cô Hoa tự tay đan tặng để giữ ấm cho quầy nước nửa đêm." },
    postcard: { title: "Bưu Thiếp Từ Căn Bếp Cuối Tuần", text: "Hai mẹ con cô vừa cùng nhau nấu bữa tối và trò chuyện suốt hai tiếng liền. Cảm ơn cháu đã giúp cô mở lòng." },
    catDiary: "Người phụ nữ này nhìn ta bằng ánh mắt dịu dàng hệt như nhìn một đứa trẻ. Cô ấy xứng đáng được thưởng những ngụm trà ngọt nhất.",
    cassette: { id: "cas_hoa", title: "Khúc Hát Ru & Tiếng Ấm Nước Sôi", freq: 392.00 }
  },
  an: {
    id: "an",
    name: "Bác An (68 tuổi)",
    role: "Cựu Giáo Viên Văn Học",
    avatar: "👓",
    hairColor: "#d4d4d8",
    outfitColor: "#475569",
    accessory: "round_glasses",
    preferredBases: ["plum", "yuzu"],
    preferredAccents: ["jasmine", "orange_peel", "honey", "osmanthus"],
    needEmotion: "nostalgic",
    keepsake: { icon: "✒️", name: "Cây Bút Máy Ngòi Vàng Cũ", desc: "Cây bút máy đã cùng bác An chấm hàng nghìn bài tập làm văn suốt bốn thập kỷ." },
    postcard: { title: "Bưu Thiếp Từ Tủ Sách Cộng Đồng", text: "Góc đọc sách cuối hẻm của chúng ta tuần này đã có thêm mười bạn trẻ tới mượn sách giấy rồi cháu ạ!" },
    catDiary: "Ông lão tóc bạc này nói chuyện trầm ấm như tiếng sấm xa. Ông ấy đọc thơ khẽ đến mức ta cứ tưởng gió đang hát.",
    cassette: { id: "cas_an", title: "Đĩa Than Cổ Điển & Chiều Thu", freq: 220.00 }
  }
};

const SOLO_NIGHT_SCRIPTS = {
  vy: {
    entranceNarration: "00:25 sáng. Tiếng mưa gõ đều lên mái tôn. Vy bước vào quán với chiếc ba lô ướt sũng và chiếc máy ghi âm cũ treo trên cổ.",
    greeting: "Chào Thỏ Con... Quán vẫn còn mở cửa ạ? Em vừa đi bộ suốt ba con phố sau buổi phỏng vấn xin việc thứ mười hai.",
    economicLine: "Tòa soạn nào cũng bảo mùa suy thoái phải cắt giảm phóng viên trẻ. Hồ sơ thực địa của em bị hệ thống lọc tự động loại chỉ sau 3 giây...",
    aiLine: "Họ bảo giờ chỉ cần nhập vài dòng lệnh là có ngay một bài tổng hợp tin tức. Em tự hỏi... còn ai cần những người trẻ đi gõ cửa từng căn nhà để lắng nghe sự thật nữa không?",
    qHeart: "Khi em cầm máy ghi âm đứng trước một nhân vật ngoài đời thật, điều gì khiến tim em rung động nhất?",
    rHeart: "Vy khẽ siết chặt chiếc máy ghi âm: 'Là khoảnh khắc người đối diện nhận ra có người thực sự muốn nghe câu chuyện của họ, chứ không phải để câu lượt xem...'",
    qMind: "Nếu bài viết tổng hợp đã phổ biến, đâu là góc nhìn thực địa mà chỉ một phóng viên trẻ có mặt tại hiện trường mới khai thác được?",
    rMind: "Đôi mắt Vy sáng lên: 'Đó là những chi tiết đời thường và cảm xúc thật phía sau các con số khô khan! Em có thể xây dựng chuyên mục phóng sự nhân vật độc lập!'",
    clue: "Em cần một ly thật mát lạnh, vị thanh và tỉnh người, thoảng chút chua dịu của quả và hơi the mát nơi đầu lưỡi để đầu óc sáng rõ trở lại...",
    reflection: "Vy nhấp một ngụm dài, đôi vai căng cứng bỗng thả lỏng: 'Vị thanh mát này làm em nhớ lại cảm giác hào hứng ngày đầu tiên bước chân vào cổng trường báo chí.'",
    advHeart: "Đừng để một bộ lọc tự động định nghĩa giá trị trái tim nhiệt huyết của em. Những câu chuyện tử tế luôn tìm được độc giả của riêng mình.",
    rAdvHeart: "Vy mỉm cười rạng rỡ, đôi mắt long lanh: 'Em hiểu rồi! Em sẽ tiếp tục đi và viết bằng tất cả sự chân thành của mình!'",
    advMind: "Hãy biến chính thế mạnh phỏng vấn sâu ngoài hiện trường thành dấu ấn cá nhân không thể sao chép của em.",
    rAdvMind: "Vy rút cuốn sổ nhỏ ghi ngay kế hoạch: 'Đúng vậy! Em sẽ lập kênh phóng sự độc lập chuyên kể chuyện người lao động giữa mùa biến động!'",
    partingLine: "Cảm ơn Thỏ Con nhiều lắm! Đêm nay em về sẽ viết ngay bài phóng sự đầu tiên bằng tất cả lòng tự trọng nghề nghiệp."
  },
  minh: {
    entranceNarration: "01:10 sáng. Minh đẩy cửa bước vào, ánh sáng xanh từ màn hình điện thoại vẫn phản chiếu trên cặp kính cận dày.",
    greeting: "Cho tôi một góc ngồi yên tĩnh nhất nhé. Tôi vừa rời văn phòng sau cuộc họp triển khai hệ thống tự động hóa mới...",
    economicLine: "Công ty gọi đó là 'tối ưu chi phí mùa suy thoái', nhưng tôi biết sáng mai sẽ có thêm hai mươi đồng nghiệp nhận thông báo nghỉ việc.",
    aiLine: "Tôi là người viết ra những dòng mã ấy... Vậy mà tối nay nhìn màn hình, tôi thấy mình giống một cỗ máy đang dần đánh mất khả năng đồng cảm với con người.",
    qHeart: "Khi tắt hết màn hình đi, có khoảnh khắc nào trong tuần này khiến anh thực sự cảm thấy mình đang sống như một con người không?",
    rHeart: "Minh tháo kính xuống, giọng trầm hẳn: 'Có lẽ là lúc tôi ghé mua ổ bánh mì nóng của bác bán hàng đầu ngõ và nghe bác hỏi thăm hôm nay có mệt không...'",
    qMind: "Công nghệ vốn là công cụ trung tính — anh có thể thiết kế lại hệ thống theo hướng hỗ trợ con người thay vì thay thế họ không?",
    rMind: "Minh khẽ gõ tay lên bàn: 'Thực ra có! Nếu chuyển từ tự động hóa cắt giảm sang công cụ trợ giúp nâng cao năng suất và an toàn cho nhân viên, mọi thứ sẽ khác hẳn!'",
    clue: "Cho tôi một ly thật đậm, đắng gọn để tỉnh táo, nhưng hậu vị phải có chút mặn dịu hoặc ấm cay nhẹ để làm mềm đi sự căng thẳng trong đầu...",
    reflection: "Minh thở phào một hơi dài sau ngụm cà phê đầu tiên: 'Lâu lắm rồi tôi mới thưởng thức một ly nước mà không vừa uống vừa kiểm tra email.'",
    advHeart: "Đừng tự trách mình vì sự phát triển của thời đại. Chỉ cần anh còn trăn trở vì người khác, trái tim anh vẫn luôn là người dẫn đường.",
    rAdvHeart: "Minh mỉm cười nhẹ nhõm: 'Cảm ơn Thỏ Con. Tôi nhận ra mình không cần phải gồng mình trở nên lạnh lùng để làm một kỹ sư giỏi.'",
    advMind: "Hãy đưa yếu tố nhân văn vào ngay trong kiến trúc thuật toán mà anh xây dựng — đó mới là đỉnh cao của trí tuệ.",
    rAdvMind: "Minh gật đầu dứt khoát: 'Sáng mai tôi sẽ đề xuất phương án thiết kế lại quy trình lấy con người làm trung tâm!'",
    partingLine: "Cảm ơn chủ quán. Đêm nay tôi có thể ngủ một giấc thật sâu mà không bị những dòng mã ám ảnh nữa rồi."
  },
  linh: {
    entranceNarration: "01:50 sáng. Chị Linh bước vào quán, tay ôm chặt cuốn sổ bìa đỏ đã sờn gáy và chiếc khăn quàng cổ màu rượu vang.",
    greeting: "Chào Thỏ Con. Ngoài trời mưa lạnh quá, chị ghé xin một chút hơi ấm trước khi về căn hộ nhỏ cuối phố.",
    economicLine: "Ngân sách xuất bản bị thu hẹp, tòa soạn yêu cầu mỗi ngày phải xuất bản hàng chục bài viết ngắn chạy theo xu hướng để giữ tương tác.",
    aiLine: "Đồng nghiệp chị dùng công cụ tạo bài chỉ mất 30 giây, còn chị mất cả đêm để trau chuốt từng câu chữ mà vẫn bị chê là chậm chạp...",
    qHeart: "Nếu không có bất kỳ chỉ số lượt đọc nào, chị muốn viết câu chuyện gì nhất cho chính tâm hồn mình?",
    rHeart: "Chị Linh mở cuốn sổ đỏ ra, ánh mắt dịu lại: 'Chị muốn viết về những người bình thường vẫn âm thầm tử tế với nhau giữa những ngày khó khăn nhất.'",
    qMind: "Giữa biển nội dung công nghiệp giống hệt nhau, điều gì khiến độc giả sẵn sàng dừng lại và trân trọng một tác phẩm viết tay?",
    rMind: "Chị Linh mỉm cười: 'Là trải nghiệm sống thật và giọng văn có linh hồn — thứ mà không thuật toán thống kê nào có thể tự trải qua!'",
    clue: "Chị muốn một thức uống chua ngọt dịu nhẹ, thơm như hương hoa và gợi chút hoài niệm của những buổi chiều đọc sách...",
    reflection: "Chị Linh nhấp một ngụm nhỏ, hương hoa lan tỏa: 'Vị ngọt dịu này giống hệt cảm giác khi đọc xong một trang văn hay.'",
    advHeart: "Những câu chữ được viết ra từ trái tim có sức sống bền bỉ hơn mọi cơn sốt nhất thời. Xin chị đừng cất cuốn sổ đỏ ấy vào ngăn kéo.",
    rAdvHeart: "Chị Linh khẽ lau khóe mắt, nụ cười rạng rỡ: 'Chị sẽ tiếp tục viết cuốn bản thảo của mình, dù mỗi đêm chỉ thêm được một trang!'",
    advMind: "Hãy định vị ngòi bút của chị ở phân khúc văn chương sâu sắc và ấn phẩm độc lập — nơi độc giả tìm kiếm giá trị thật.",
    rAdvMind: "Chị Linh gật đầu đầy cảm hứng: 'Đúng vậy! Chị sẽ gửi bản thảo cho nhà xuất bản độc lập ngay tuần này!'",
    partingLine: "Cảm ơn Thỏ Con đã giữ lại một góc bình yên cho những người còn yêu chữ nghĩa như chị."
  },
  tuan: {
    entranceNarration: "02:30 sáng. Tiếng động cơ xe máy tắt hẳn ngoài đầu hẻm. Anh Tuấn bước vào, phủi những giọt nước mưa trên chiếc áo khoác gió.",
    greeting: "Chào chủ quán! Cho anh ngồi nhờ chút cho ấm người rồi chạy nốt chuyến hàng đêm cuối cùng.",
    economicLine: "Xưởng cơ khí cũ cắt giảm ca làm từ đầu năm. Anh chuyển sang chạy giao hàng đêm để giữ trọn tiền học phí và sữa cho hai đứa nhỏ ở nhà.",
    aiLine: "Giờ ứng dụng giao việc hoàn toàn bằng thuật toán tự động — trễ một phút vì đường ngập cũng bị trừ điểm, nhiều lúc thấy mình chạy đua với một cái đồng hồ vô cảm.",
    qHeart: "Mỗi đêm trước khi dắt xe ra khỏi nhà, hình ảnh nào của hai bé tiếp thêm sức mạnh cho anh nhiều nhất?",
    rHeart: "Anh Tuấn mỉm cười hiền hậu, lấy ví cho bạn xem tấm ảnh nhỏ: 'Là lúc hai đứa nhét tờ giấy vẽ hình siêu nhân vào túi áo khoác của bố...'",
    qMind: "Với tay nghề cơ khí 12 năm của anh, liệu có hướng chuyển dịch nào sang bảo trì phương tiện xanh đang thiếu thợ lành nghề không?",
    rMind: "Anh Tuấn mắt sáng lên: 'Có chứ! Mấy trạm bảo trì xe điện mới mở đang tìm thợ có kinh nghiệm cơ khí thực tế, tại anh cứ mải chạy xe nên chưa kịp nộp hồ sơ!'",
    clue: "Pha cho anh ly gì thật ấm bụng, đậm đà, có chút cay nồng và ngọt hậu cho tan hết hơi lạnh ngoài đường nhé...",
    reflection: "Anh Tuấn xoa hai bàn tay vào ly nước ấm rồi uống một ngụm lớn: 'Ấm từ cổ họng xuống tới tận lòng bàn tay luôn em ạ!'",
    advHeart: "Sự hy sinh thầm lặng của anh chính là mái nhà vững chãi nhất cho hai con. Anh đã làm một người cha tuyệt vời rồi.",
    rAdvHeart: "Anh Tuấn xúc động gật đầu: 'Nghe em nói mà anh thấy bao nhiêu mệt nhọc suốt cả tuần tan biến hết!'",
    advMind: "Đừng bỏ phí đôi bàn tay thợ lành nghề của anh — sáng mai hãy ghé nộp hồ sơ vào xưởng kỹ thuật xe điện nhé.",
    rAdvMind: "Anh Tuấn vỗ nhẹ lên quầy gỗ: 'Chốt luôn! Sáng mai giao xong ca đêm anh sẽ ghé xưởng nộp hồ sơ ngay!'",
    partingLine: "Cảm ơn Thỏ Con! Chúc quán luôn đắt khách, anh lên đường nốt chuyến cuối đây."
  },
  khang: {
    entranceNarration: "03:05 sáng. Anh Khang bước vào quán, trên chiếc tạp dề vải dày vẫn còn vương vài sợi chỉ sáp ong.",
    greeting: "Chào Thỏ Con. Anh vừa đóng cửa xưởng da, ghé qua xin một góc yên tĩnh để suy nghĩ chút chuyện.",
    economicLine: "Kinh tế khó khăn, khách thắt chặt chi tiêu, trong khi xưởng của anh vẫn còn 12 anh em thợ gắn bó suốt chục năm trời.",
    aiLine: "Trên mạng giờ tràn ngập những mẫu túi quảng cáo bằng hình ảnh dựng sẵn đẹp lung linh nhưng giá rẻ bèo, khiến đồ da khâu tay tỉ mỉ của xưởng anh khó cạnh tranh...",
    qHeart: "Điều gì ở từng mũi chỉ khâu tay khiến anh vẫn kiên quyết giữ xưởng suốt bao năm qua?",
    rHeart: "Anh Khang nhìn đôi bàn tay chai sần của mình: 'Là dấu ấn của người thợ. Mỗi chiếc ví dùng mười năm vẫn bền đẹp, mang theo hơi ấm của người làm ra nó.'",
    qMind: "Nếu không thể cạnh tranh về giá với hàng công nghiệp, anh có thể biến chính quy trình chế tác thủ công thành trải nghiệm độc bản cho khách hàng không?",
    rMind: "Anh Khang gật gù suy ngẫm: 'Ý hay đấy! Khách hàng giờ rất thích được tự tay khắc tên và chứng kiến người thợ hoàn thiện món đồ dành riêng cho mình!'",
    clue: "Cho anh một ly đậm, ấm và trầm, hậu vị có chút cay ấm của gia vị và thoang thoảng mùi gỗ, mùi sáp ong...",
    reflection: "Anh Khang nhấp một ngụm, gật đầu tán thưởng: 'Hương vị đậm đà và chân thật hệt như một tấm da thuộc mộc nguyên bản vậy.'",
    advHeart: "Giá trị của sự tử tế và lòng tự trọng nghề nghiệp không bao giờ lỗi thời. Anh em thợ trong xưởng thật may mắn khi có một người anh như anh.",
    rAdvHeart: "Anh Khang mỉm cười vững tin: 'Cảm ơn Thỏ Con. Anh sẽ giữ vững ngọn lửa của xưởng bằng tất cả tâm huyết!'",
    advMind: "Hãy mở thêm các buổi trải nghiệm chế tác thủ công cuối tuần và kể câu chuyện thật của từng người thợ.",
    rAdvMind: "Anh Khang hào hứng: 'Tuần tới anh sẽ mở cửa xưởng đón khách tới trải nghiệm khâu da thủ công luôn!'",
    partingLine: "Cảm ơn chủ quán. Hẹn một ngày gần nhất anh sẽ mang tặng quán một món đồ da thủ công thật đẹp."
  },
  hoa: {
    entranceNarration: "03:40 sáng. Cô Hoa khẽ đẩy cửa bước vào, chiếc khăn choàng len mỏng phủ trên vai hơi ẩm sương đêm.",
    greeting: "Chào cháu... Cô mất ngủ nên đi dạo một chút, thấy ánh đèn vàng của quán ấm quá nên ghé vào.",
    economicLine: "Ở tuổi 44, công ty cô bắt đầu tái cấu trúc bộ phận kế toán bằng phần mềm tự động. Cô lo không biết mình có theo kịp sự thay đổi này không...",
    aiLine: "Về tới nhà thì cậu con trai hai mươi tuổi cũng chỉ đeo tai nghe trò chuyện với trợ lý ảo trên máy tính, hai mẹ con chẳng biết bắt đầu câu chuyện từ đâu.",
    qHeart: "Nếu được ngồi xuống bên con trai mà không nhắc gì đến chuyện học hành hay công việc, cô muốn nói với con điều gì nhất?",
    rHeart: "Cô Hoa rưng rưng mỉm cười: 'Cô chỉ muốn hỏi hôm nay con ăn có ngon miệng không, và nhắc con rằng lúc nào mệt mỏi thì mẹ vẫn luôn ở đây.'",
    qMind: "Tại sao cô không thử nhờ chính cậu con trai làm 'thầy giáo' hướng dẫn cô làm chủ các công cụ công nghệ mới trong công việc?",
    rMind: "Cô Hoa khẽ reo lên: 'Ôi đúng rồi! Bọn trẻ rất thích được hướng dẫn người lớn — đó vừa là cách cô học cái mới, vừa là cầu nối để hai mẹ con trò chuyện!'",
    clue: "Pha cho cô một tách nước ấm, dịu nhẹ, ngọt thanh và thoang thoảng hương hoa để lòng thư thái dễ ngủ nhé cháu...",
    reflection: "Cô Hoa nâng tách trà ấm bằng hai tay, nhấp một ngụm nhỏ: 'Ngọt thanh và dịu dàng quá, bao nhiêu lo âu trong lòng cô như lắng xuống hết.'",
    advHeart: "Tình yêu thương của một người mẹ là điều ấm áp nhất mà không công nghệ nào thay thế được. Con trai cô chắc chắn luôn cảm nhận được điều đó.",
    rAdvHeart: "Cô Hoa mỉm cười rạng rỡ: 'Cảm ơn cháu nhiều lắm. Sáng mai cô sẽ nấu món con thích nhất và trò chuyện cùng con!'",
    advMind: "Kinh nghiệm quản lý tài chính của cô kết hợp với công cụ mới sẽ tạo nên sự vững vàng mà lớp trẻ rất cần học hỏi.",
    rAdvMind: "Cô Hoa gật đầu tự tin: 'Cô sẽ không sợ công nghệ nữa, tối mai cô sẽ nhờ con trai chỉ cho cô dùng phần mềm mới!'",
    partingLine: "Cảm ơn cháu Thỏ Con. Chúc cháu một đêm bình yên nhé, cô về chuẩn bị bữa sáng cho con đây."
  },
  an: {
    entranceNarration: "04:15 sáng. Bác An thong thả bước vào quán, tay cầm chiếc túi vải đựng vài cuốn sách giấy cũ kỹ.",
    greeting: "Chào cháu chủ quán trẻ. Bác vừa đi dạo ngang qua hiệu sách cũ đầu phố — nơi sắp đóng cửa để nhường chỗ cho một trung tâm thương mại.",
    economicLine: "Bốn mươi năm dạy văn, nhìn những hiệu sách thân quen lần lượt khép cửa vì người ta thắt chặt chi tiêu, lòng bác không khỏi man mác buồn.",
    aiLine: "Học trò bây giờ chỉ cần bấm nút là có ngay bản tóm tắt một tác phẩm kinh điển trong vài giây, chẳng còn mấy ai kiên nhẫn lật từng trang giấy thơm mùi mực...",
    qHeart: "Trong suốt bốn mươi năm đứng lớp, kỷ niệm nào về một trang sách làm thay đổi cuộc đời học trò khiến bác nhớ mãi?",
    rHeart: "Bác An vuốt nhẹ chòm râu bạc, ánh mắt sáng ngời: 'Có một cậu học trò cá biệt năm xưa đã tìm thấy lẽ sống từ một câu thơ, giờ cậu ấy đã trở thành một bác sĩ tận tụy.'",
    qMind: "Nếu hiệu sách cũ đóng cửa, bác có nghĩ tới việc lập một tủ sách cộng đồng và câu lạc bộ đọc chậm ngay tại khu phố này không?",
    rMind: "Bác An mỉm cười gật gù: 'Ý tưởng tuyệt vời! Những người yêu sách giấy vẫn luôn ở đó, chỉ cần một góc nhỏ ấm áp như quán của cháu để hội tụ!'",
    clue: "Cho bác một ly mang hương vị hoài niệm, chua ngọt thanh tao, thoảng hương hoa nhẹ như một chiều thu xưa nhé...",
    reflection: "Bác An nhấp một ngụm nhỏ, khẽ gật đầu: 'Hương vị tinh tế này gợi nhớ những buổi chiều thu ngồi đàm đạo văn chương bên hiên nhà cổ.'",
    advHeart: "Những hạt giống tâm hồn bác đã gieo suốt bốn mươi năm vẫn đang nở hoa trong lòng bao thế hệ học trò.",
    rAdvHeart: "Bác An xúc động mỉm cười: 'Cảm ơn cháu. Nghe cháu nói, bác thấy đời dạy học của mình thật trọn vẹn!'",
    advMind: "Hãy biến góc nhỏ của quán Thỏ Con thành điểm hẹn đầu tiên cho tủ sách giấy cộng đồng của bác nhé!",
    rAdvMind: "Bác An vui mừng bắt tay bạn: 'Nhất trí! Tuần sau bác sẽ mang những cuốn sách quý nhất tới góp vào kệ sách của quán!'",
    partingLine: "Trời sắp sáng rồi. Cảm ơn cháu vì một cuộc trò chuyện đẹp như một bài thơ."
  }
};

const CHAPTER2_RETURN_SCRIPTS = {
  vy: {
    greeting: "Chào Thỏ Con! Em quay lại quán đây — tối nay em vừa hoàn thành bản nháp phóng sự thực địa đầu tiên sau buổi trò chuyện hôm trước!",
    update: "Nhờ lời gợi mở hôm ấy, em đã phỏng vấn được ba bác thợ thủ công và cô bán hàng đêm. Hóa ra khi mình viết bằng sự chân thành, người đọc phản hồi ấm áp lắm!"
  },
  minh: {
    greeting: "Lại là tôi đây, Thỏ Con. Hôm nay tôi ghé quán không phải vì kiệt sức, mà để báo một tin vui nhỏ!",
    update: "Sáng nay tôi đã trình bày phương án thiết kế thuật toán hỗ trợ nhân viên thay vì cắt giảm. Ban giám đốc đồng ý thử nghiệm ngay tuần tới!"
  },
  linh: {
    greeting: "Chào Thỏ Con. Chị ghé qua khoe với em cuốn sổ bìa đỏ đã viết thêm được mười lăm trang mới rồi đấy!",
    update: "Chị không còn chạy theo những bài viết công nghiệp vội vã nữa. Mỗi đêm dành một giờ viết thật chậm cho bản thảo của mình khiến chị thấy bình yên vô cùng."
  },
  tuan: {
    greeting: "Chào chú Thỏ Con! Anh vừa ghé xưởng bảo trì xe điện nộp hồ sơ xong liền chạy qua báo tin cho em ngay!",
    update: "Quản lý xưởng xem tay nghề cơ khí của anh xong liền hẹn thứ Hai tới đi làm thử việc luôn. Hai đứa nhỏ ở nhà mừng rơn em ạ!"
  },
  khang: {
    greeting: "Chào Thỏ Con. Hôm nay anh mang theo một miếng da sáp ong vừa thuộc xong để tặng góc quầy của quán đây.",
    update: "Xưởng của anh vừa mở buổi trải nghiệm khâu da cuối tuần đầu tiên, các bạn trẻ tới đông hơn dự kiến và rất trân trọng công việc thủ công!"
  },
  hoa: {
    greeting: "Chào cháu Thỏ Con! Tối nay cô đi dạo sớm hơn mọi khi vì lòng đã nhẹ nhõm hẳn rồi.",
    update: "Hôm qua cậu con trai ngồi chỉ cho cô dùng bảng tính thông minh suốt một tiếng, hai mẹ con vừa học vừa cười rôm rả như hồi cháu còn bé!"
  },
  an: {
    greeting: "Chào cháu chủ quán trẻ. Bác mang tới ba cuốn sách văn học quý đầu tiên để đặt lên góc kệ sách của quán đây!",
    update: "Nghe tin bác lập tủ sách cộng đồng, mấy người học trò cũ cũng nhắn tin xin gửi thêm sách giấy về góp cùng."
  }
};

const EXTRA_DIALOGUE_BANK = {
  soloExtra: {
    vy: {
      hostWelcome: "🐰 Thỏ Con nhanh tay đưa chiếc khăn bông sạch cho Vy lau nước mưa trên ống kính máy ghi âm: 'Ngồi sát vào góc đèn vàng cho ấm người đã nhé, trông em chạy ngoài phố cả tối chắc chưa kịp ăn gì đúng không?'",
      guestBanterPool: [
        "🎓 Vy bật cười khẽ: 'Em có mang theo một ổ bánh mì nguội từ chiều nhưng mải ghi chép nên quên bén mất. Vào tới quán ngửi mùi vỏ cam sấy tự nhiên bụng kêu lên luôn!'",
        "🎓 Vy tháo chiếc tai nghe treo lên móc gỗ: 'Nãy đi ngang qua ngã tư, em thấy chú mèo tam thể nhà mình ngồi trên bậu cửa nhìn ra đường như đang canh giờ đón khách vậy đó.'",
        "🎓 Vy lật giở cuốn sổ nhỏ lấm tấm nước mưa: 'Em vừa ghi lại tiếng rao bánh khúc lúc 0 giờ đêm nay. Thành phố về khuya có những âm thanh đẹp mà ban ngày chẳng ai nghe thấy.'"
      ],
      hostEmpathy: "🐰 Thỏ Con chống cằm lắng nghe, đôi tai khẽ cụp xuống đầy cảm thông: 'Bị từ chối liên tiếp mà vẫn giữ được sự tò mò với cuộc đời như em không hề dễ chút nào đâu.'",
      drinkMemory: "🎓 Vy xoay nhẹ chiếc ly trên mặt gỗ: 'Hồi năm nhất đại học, cả nhóm báo chí tụi em từng thức trắng đêm bên một ấm trà nhỏ ở ký túc xá để biên tập tờ báo tường đầu tiên. Vị nước đêm nay làm em nhớ nguyên cảm giác háo hức ấy.'",
      preDawnHost: "🐰 Thỏ Con mỉm cười đẩy thêm một miếng bánh quy gừng nhỏ: 'Mỗi khi thấy nản lòng trước những con số khô khan, cứ nhớ lại ánh mắt của những nhân vật em từng phỏng vấn nhé.'",
      preDawnGuest: "🎓 Vy gật đầu chắc nịch, ánh mắt rạng rỡ hơn hẳn lúc mới bước vào: 'Vâng ạ! Em sẽ giữ cuốn sổ tay này đầy ắp những câu chuyện có hơi thở con người.'",
      hostFarewell: "🐰 Thỏ Con vẫy tay tiễn Vy ra tới bậc thềm hẻm nhỏ: 'Đi đường cẩn thận nhé cô phóng viên trẻ, chúc bài viết đêm nay của em chạm tới thật nhiều trái tim!'",
      stageTapLines: [
        "🎓 Vy: 'Chú mèo tam thể ngủ say quá, em không dám bật máy ghi âm lớn sợ đánh thức nó!'",
        "🎓 Vy: 'Ánh đèn vàng của quán mình lên ảnh chắc ấm áp lắm, hôm nào em xin phép chụp một tấm kỷ niệm nhé?'",
        "🎓 Vy: 'Em vừa nảy ra một tiêu đề mới cho chuyên mục phóng sự đêm khuya rồi!'",
        "🎓 Vy: 'Ngồi nghe tiếng mưa gõ trên mái tôn ở đây dễ chịu hơn hẳn tiếng còi xe ngoài đại lộ.'"
      ]
    },
    minh: {
      hostWelcome: "🐰 Thỏ Con khẽ đẩy chiếc đĩa gốm đựng vài viên kẹo gừng về phía Minh: 'Cặp kính của anh vẫn còn ánh phản chiếu màn hình xanh kìa. Đêm nay ở quầy gỗ này, chúng ta tạm tắt mọi thông báo nhé?'",
      guestBanterPool: [
        "💻 Minh bật cười nhẹ, đặt úp chiếc điện thoại xuống mặt bàn: 'Thỏa thuận luôn! Đây là lần đầu tiên sau ba tháng tôi để điện thoại ở chế độ im lặng quá mười phút.'",
        "💻 Minh nhìn chiếc radio cổ trên kệ: 'Trong phòng máy toàn tiếng quạt tản nhiệt vo ve, bước vào đây nghe tiếng ấm nước reo tự nhiên thấy đầu óc giãn ra hẳn.'",
        "💻 Minh khẽ gãi cằm chú mèo tam thể: 'Có vẻ chú mèo này không quan tâm tôi viết được bao nhiêu dòng code, miễn là tôi gãi đúng chỗ là nó rừ rừ ngay.'"
      ],
      hostEmpathy: "🐰 Thỏ Con rót thêm một chút nước ấm vào ly tráng miệng: 'Việc anh thấy day dứt chứng tỏ anh chưa bao giờ biến mình thành cỗ máy cả, Minh ạ.'",
      drinkMemory: "💻 Minh nhìn làn khói mỏng bay lên từ miệng ly: 'Ngày mới học lập trình, tôi từng thức xuyên đêm chỉ để viết một chương trình nhỏ chúc mừng sinh nhật mẹ. Lúc đó tôi vui vì tạo ra điều hữu ích, chứ không phải vì chạy đua hiệu suất.'",
      preDawnHost: "🐰 Thỏ Con gật gù: 'Công nghệ giỏi nhất là công nghệ biết lùi một bước để nhường chỗ cho sự tử tế của con người tỏa sáng.'",
      preDawnGuest: "💻 Minh đeo kính lại, ánh nhìn điềm tĩnh và ấm áp hơn nhiều: 'Tôi sẽ ghi câu nói đó lên bảng trắng ở phòng làm việc vào sáng mai.'",
      hostFarewell: "🐰 Thỏ Con khẽ khép cánh cửa gỗ sau lưng Minh: 'Chúc anh một giấc ngủ không mộng mị và những dòng mã mang đầy hơi ấm nhân văn!'",
      stageTapLines: [
        "💻 Minh: 'Nếu tôi viết một ứng dụng mô phỏng tiếng mưa của quán này, chắc đồng nghiệp tôi sẽ đỡ căng thẳng lắm.'",
        "💻 Minh: 'Mùi gỗ thông ở quầy nước này giúp mắt tôi dịu hẳn sau cả ngày nhìn màn hình.'",
        "💻 Minh: 'Hóa ra giải pháp cho những bài toán phức tạp đôi khi chỉ bắt đầu từ một cuộc trò chuyện bình thường.'",
        "💻 Minh: 'Chú mèo tam thể này có thuật toán ngủ trưa cực kỳ tối ưu đấy!'"
      ]
    },
    linh: {
      hostWelcome: "🐰 Thỏ Con nhẹ nhàng dọn một khoảng trống khô ráo trên quầy gỗ cho cuốn sổ bìa đỏ của chị Linh: 'Ngoài trời sương lạnh lắm, chị để cuốn sổ ở góc đèn này cho khỏi ẩm trang giấy nhé.'",
      guestBanterPool: [
        "🖋️ Chị Linh mỉm cười dịu dàng: 'Cảm ơn Thỏ Con tinh ý quá. Cuốn sổ này đi theo chị suốt năm năm rồi, trang nào cũng có vết mực loang của những đêm mưa.'",
        "🖋️ Chị Linh ngắm những tờ giấy note dán trên tường quán: 'Mỗi mảnh giấy nhỏ ở đây giống như một đoạn mở đầu của một truyện ngắn vậy, đọc lên thấy thương gì đâu.'",
        "🖋️ Chị Linh khẽ xoay cây bút máy trong tay: 'Lúc nãy đi ngang hiệu hoa cuối phố đã đóng cửa, chị vẫn ngửi thấy hương hoa nhài thoang thoảng trong gió đêm.'"
      ],
      hostEmpathy: "🐰 Thỏ Con khẽ gật đầu: 'Những thứ được ủ chậm bằng tâm huyết luôn có hương vị riêng mà không dây chuyền vội vã nào sao chép được, chị Linh nhỉ?'",
      drinkMemory: "🖋️ Chị Linh khép hờ mắt thưởng thức dư vị nơi đầu lưỡi: 'Hương vị này làm chị nhớ những buổi chiều ngồi bên hiên nhà ngoại ở quê, vừa nghe đài kể chuyện vừa hong nắng những trang sách cũ.'",
      preDawnHost: "🐰 Thỏ Con mỉm cười: 'Khi nào cuốn sách của chị in xong, nhớ dành cho kệ sách nhỏ của quán một chữ ký đầu tiên nhé!'",
      preDawnGuest: "🖋️ Chị Linh ôm cuốn sổ bìa đỏ vào ngực, ánh mắt lấp lánh niềm tin: 'Nhất định rồi! Trang đề tặng đầu tiên chị sẽ viết về ánh đèn vàng của quán mình.'",
      hostFarewell: "🐰 Thỏ Con tiễn chị Linh ra hiên nhà: 'Chúc ngòi bút của chị đêm nay tuôn chảy thật êm ái và bình yên!'",
      stageTapLines: [
        "🖋️ Chị Linh: 'Chị vừa ghi lại câu nói của Thỏ Con vào sổ tay rồi, nghe như một câu thơ vậy.'",
        "🖋️ Chị Linh: 'Ánh sáng ở quầy gỗ này vừa đủ ấm để viết mà không hề làm mỏi mắt.'",
        "🖋️ Chị Linh: 'Chị thích cách quán mình không bật nhạc quá ồn, để tiếng mưa tự kể câu chuyện của nó.'",
        "🖋️ Chị Linh: 'Mèo tam thể nhìn chị chằm chằm như đang kiểm tra xem chị đã viết xong chương mới chưa.'"
      ]
    },
    tuan: {
      hostWelcome: "🐰 Thỏ Con lấy ngay chiếc khăn ấm lau hơi sương trên chiếc mũ lưỡi trai của anh Tuấn: 'Anh ngồi ghế sát bếp than cho ấm đôi bàn tay đã, chạy gió đêm giờ này buốt lắm!'",
      guestBanterPool: [
        "🚚 Anh Tuấn cười khà khà, xoa hai bàn tay vào nhau: 'Hơi ấm từ bếp than của chú làm anh nhớ cái lò rèn của ông nội hồi xưa quá, ngồi cạnh một phút là giãn hết cả gân cốt!'",
        "🚚 Anh Tuấn lấy từ túi áo ra một chiếc móc khóa hình cờ lê nhỏ: 'Cái này con trai lớn của anh tự nặn bằng đất sét tặng bố đấy, đi chuyến nào anh cũng mang theo cho vững tay lái.'",
        "🚚 Anh Tuấn nhìn ra màn mưa ngoài cửa kính: 'Đêm nay đường vắng nhưng gió tạt ngang cầu mạnh lắm, may mà nhớ góc hẻm nhà chú vẫn sáng đèn nên anh tạt vào ngay.'"
      ],
      hostEmpathy: "🐰 Thỏ Con rót đầy ly nước ấm bằng cả hai tay: 'Người gồng gánh cả gia đình trên đôi vai như anh cũng xứng đáng có một trạm dừng chân để tựa lưng chứ.'",
      drinkMemory: "🚚 Anh Tuấn khà một tiếng sảng khoái sau ngụm nước ấm: 'Hồi mới vào nghề thợ máy, mỗi lần cả tổ thức đêm sửa xong một chiếc xe đường dài, anh em lại quây quần bên ấm nước gừng nóng hổi y hệt thế này.'",
      preDawnHost: "🐰 Thỏ Con mỉm cười tin tưởng: 'Đôi bàn tay đã giữ an toàn cho bao chuyến xe chắc chắn sẽ mở ra một khởi đầu vững vàng mới cho anh.'",
      preDawnGuest: "🚚 Anh Tuấn đội lại chiếc mũ lưỡi trai, dáng vẻ phấn chấn hẳn: 'Cảm ơn chú Thỏ Con! Anh chạy nốt chuyến cuối rồi về mua xôi nóng cho hai đứa nhỏ đây.'",
      hostFarewell: "🐰 Thỏ Con vẫy tay chúc bình an: 'Vững tay lái nhé anh Tuấn, hẹn gặp lại anh vào một đêm mưa nhẹ nhàng hơn!'",
      stageTapLines: [
        "🚚 Anh Tuấn: 'Quán chú tuy nhỏ nhưng sắp xếp gọn gàng ngăn nắp hệt như một hộp đồ nghề chuẩn chỉnh vậy!'",
        "🚚 Anh Tuấn: 'Chú mèo tam thể này gan thật, nghe tiếng xe máy của anh ngoài hẻm mà vẫn ngủ ngon lành.'",
        "🚚 Anh Tuấn: 'Cảm ơn chú đã luôn mở cửa tới tận rạng sáng cho cánh tài xế tụi anh có chỗ nghỉ chân.'",
        "🚚 Anh Tuấn: 'Sáng mai đưa hai đứa nhỏ đi học xong, anh sẽ ghé ngang xưởng xe điện ngay!'"
      ]
    },
    khang: {
      hostWelcome: "🐰 Thỏ Con khẽ hít hà mùi sáp ong thoang thoảng: 'Anh Khang vừa rời bàn chế tác đúng không ạ? Mùi da thuộc và sáp ong quyện với hương cà phê của quán hợp nhau lạ kỳ.'",
      guestBanterPool: [
        "🧵 Anh Khang bật cười trầm ấm: 'Chú tinh mũi thật đấy! Anh vừa khâu xong đường chỉ cuối cùng cho một chiếc cặp sách đặt riêng rồi mới tắt đèn xưởng.'",
        "🧵 Anh Khang ngắm chiếc quầy gỗ thông của quán: 'Mặt quầy này chú tự bào và đánh sáp đúng không? Vân gỗ lên nước bóng đẹp và có hồn lắm.'",
        "🧵 Anh Khang khẽ bẻ các khớp ngón tay: 'Làm nghề thủ công cả ngày cúi đầu bên bàn da, đêm tới được ngồi thẳng lưng ngắm mưa rơi thế này là xa xỉ phẩm rồi.'"
      ],
      hostEmpathy: "🐰 Thỏ Con gật đầu trân trọng: 'Giữa thời buổi cái gì cũng làm vội cho xong, sự kiên nhẫn của người thợ như anh chính là điều giữ lại phẩm giá cho đồ vật.'",
      drinkMemory: "🧵 Anh Khang nâng ly ngắm màu nước hổ phách dưới ánh đèn: 'Màu nước này giống hệt màu tấm da bò thảo mộc sau ba năm được người dùng nâng niu mỗi ngày — càng đi qua thời gian càng trầm ấm.'",
      preDawnHost: "🐰 Thỏ Con mỉm cười: 'Khi khách hàng chạm tay vào đường chỉ sáp ong của anh, họ sẽ cảm nhận được cả trái tim của mười hai người thợ phía sau.'",
      preDawnGuest: "🧵 Anh Khang gật đầu chắc nịch: 'Đúng vậy! Anh sẽ không bao giờ đánh đổi chất lượng thủ công để chạy theo số lượng rẻ tiền.'",
      hostFarewell: "🐰 Thỏ Con tiễn anh Khang ra bậc cửa: 'Chúc xưởng da sáp ong của anh luôn đỏ lửa và đón thật nhiều người biết yêu giá trị bền bỉ!'",
      stageTapLines: [
        "🧵 Anh Khang: 'Hôm nào rảnh anh sẽ mang bộ đục lỗ và ít da vụn tới hướng dẫn Thỏ Con tự khâu một chiếc lót ly nhé!'",
        "🧵 Anh Khang: 'Mùi gỗ thông và sáp ong trong quán làm anh thấy thân thuộc như đang ở chính góc xưởng của mình.'",
        "🧵 Anh Khang: 'Chú mèo tam thể này mà nằm lên tấm da thuộc mềm chắc ngủ tới trưa mới dậy!'",
        "🧵 Anh Khang: 'Cảm ơn Thỏ Con đã nhắc anh nhớ lý do mình cầm kim khâu da suốt hai mươi năm qua.'"
      ]
    },
    hoa: {
      hostWelcome: "🐰 Thỏ Con kéo nhẹ chiếc ghế gỗ sát quầy và đặt sẵn một chiếc gối tựa lưng êm ái: 'Cô Hoa ngồi xuống cho đỡ mỏi chân nhé, đêm khuya sương xuống dễ làm đau khớp gối lắm ạ.'",
      guestBanterPool: [
        "🧶 Cô Hoa mỉm cười hiền hậu: 'Cháu chu đáo quá, làm cô thấy ấm lòng hệt như có đứa con gái nhỏ ở bên cạnh vậy.'",
        "🧶 Cô Hoa khẽ vuốt phẳng nếp khăn len trên vai: 'Tối nay cô định gõ cửa phòng con trai mang đĩa trái cây vào, nhưng thấy con đang họp nhóm trực tuyến nên lại rón rén quay ra.'",
        "🧶 Cô Hoa nhìn ấm trà đang bốc khói nhẹ: 'Ở nhà cô toàn pha trà vội buổi sáng trước giờ đi làm, lâu lắm rồi mới được ngồi thảnh thơi nhìn từng cánh hoa cúc nở trong nước nóng.'"
      ],
      hostEmpathy: "🐰 Thỏ Con khẽ mỉm cười dịu dàng: 'Cô đã dành cả thanh xuân để chăm lo cho gia đình rồi, đêm nay cứ để Thỏ Con chăm sóc lại một chút bình yên cho cô nhé.'",
      drinkMemory: "🧶 Cô Hoa nhấp ngụm trà ấm, ánh mắt dịu lại đầy xúc động: 'Vị ngọt thanh của mật ong này làm cô nhớ hồi con trai còn học tiểu học, mỗi lần cháu ho đêm cô lại pha một chén nhỏ ngồi dỗ cháu uống từng thìa.'",
      preDawnHost: "🐰 Thỏ Con khích lệ: 'Người mẹ vừa giàu tình thương vừa chịu khó học hỏi như cô chắc chắn sẽ luôn là niềm tự hào lớn nhất của em ấy.'",
      preDawnGuest: "🧶 Cô Hoa rạng rỡ gật đầu: 'Cô hết lo lắng rồi cháu ạ. Sáng mai cô sẽ đi chợ mua đúng món sườn xào chua ngọt con trai thích!'",
      hostFarewell: "🐰 Thỏ Con tiễn cô Hoa ra đầu ngõ: 'Chúc cô về nhà có một giấc ngủ thật ngon và một bữa sáng đầy tiếng cười bên con trai nhé!'",
      stageTapLines: [
        "🧶 Cô Hoa: 'Chiếc khăn len màu hổ phách cô đang đan dở chắc hợp với màu ánh đèn của quán mình lắm đây.'",
        "🧶 Cô Hoa: 'Nghe tiếng radio trầm ấm ở đây làm cô nhớ những buổi tối cả nhà quây quần ngày xưa.'",
        "🧶 Cô Hoa: 'Cháu Thỏ Con thức khuya bán hàng cũng nhớ giữ gìn sức khỏe, đừng để bị nhiễm lạnh nhé!'",
        "🧶 Cô Hoa: 'Cô nhận ra mình không cần phải biết hết mọi thứ mới có thể đồng hành cùng con.'"
      ]
    },
    an: {
      hostWelcome: "🐰 Thỏ Con kính cẩn đỡ túi sách vải nặng trên tay bác An đặt lên chiếc ghế bên cạnh: 'Bác ngồi nghỉ chân một lát đã ạ, cháu vừa nhóm lại bếp than cho gian quán ấm hẳn lên rồi.'",
      guestBanterPool: [
        "👓 Bác An mỉm cười hiền từ: 'Cảm ơn cháu chủ quán chu đáo. Mấy cuốn sách này bác vừa phân loại lại từ kệ sách cũ, cuốn nào cũng mang theo mùi thời gian.'",
        "👓 Bác An khẽ gõ nhịp ngón tay theo tiếng mưa: 'Tiếng mưa rơi trên mái tôn hẻm nhỏ nghe thanh thoát chẳng kém gì tiếng đàn tranh trong một đêm hội thơ.'",
        "👓 Bác An nhìn những tờ giấy note dán kín một góc tường: 'Quán của cháu giống như một cuốn lưu bút sống động của cả khu phố vậy, mỗi đêm lại thêm một trang mới.'"
      ],
      hostEmpathy: "🐰 Thỏ Con rót trà bằng thái độ trân trọng: 'Những hiệu sách có thể đổi chủ, nhưng tình yêu tri thức mà bác đã truyền cho bao thế hệ thì không bao giờ khép cửa đâu bác ạ.'",
      drinkMemory: "👓 Bác An khẽ nhắm mắt thưởng thức hương thơm trong ly: 'Hương vị trầm lắng này đưa bác trở về căn phòng đọc sách cũ của cha bác năm xưa — nơi bác lần đầu tiên đọc trọn một tập thơ giữa đêm mưa.'",
      preDawnHost: "🐰 Thỏ Con mỉm cười: 'Góc kệ gỗ bên cửa sổ quán cháu luôn dành sẵn chỗ trang trọng nhất cho tủ sách cộng đồng của bác.'",
      preDawnGuest: "👓 Bác An vuốt chòm râu bạc cười sảng khoái: 'Có người trẻ đồng lòng như cháu, bác thấy mình như trẻ lại thêm hai mươi tuổi!'",
      hostFarewell: "🐰 Thỏ Con tiễn bác An ra tới đầu hẻm vừa hửng sáng: 'Cháu chúc bác luôn mạnh khỏe và bình an, hẹn đón bác cùng những cuốn sách quý vào tuần tới ạ!'",
      stageTapLines: [
        "👓 Bác An: 'Một tách trà ấm, một trang sách hay và một người biết lắng nghe — thế là đủ cho một đêm trọn vẹn.'",
        "👓 Bác An: 'Chú mèo tam thể của cháu có phong thái ung dung hệt như một nhà hiền triết vậy!'",
        "👓 Bác An: 'Chữ viết tay trên những tờ giấy note của quán cháu đẹp và chân thành lắm.'",
        "👓 Bác An: 'Sáng nay trời tạnh mưa, nắng sớm chiếu lên con hẻm nhỏ chắc sẽ đẹp như một bức tranh thủy mặc.'"
      ]
    }
  },
  chapter2Full: {
    vy: {
      deepTalk: "Sau khi bài phóng sự đầu tiên được đón nhận, em nhận ra điều khó nhất không phải là bắt đầu, mà là giữ cho ngòi bút của mình luôn tỉnh táo và không bị cuốn theo những lời khen nhất thời.",
      qHeart: "Khi gặp một nhân vật có hoàn cảnh quá éo le khiến em xúc động, làm sao em giữ được trái tim ấm áp mà vẫn kể câu chuyện thật công tâm?",
      rHeart: "Vy mỉm cười chân thành: 'Em học cách lắng nghe họ như một người bạn trước, sau đó mới đặt mình vào vị trí người kể chuyện để giữ trọn sự tôn trọng dành cho họ.'",
      qMind: "Em dự định phát triển chuỗi phóng sự độc lập này theo hướng nào để vừa bền vững tài chính vừa giữ trọn chất lượng?",
      rMind: "Vy hào hứng chia sẻ: 'Em đang kết nối với các tạp chí văn hóa và quỹ cộng đồng để xuất bản chuyên đề dài kỳ có chiều sâu thay vì chạy theo tin nhanh!'",
      advHeart: "Hãy luôn giữ đôi mắt trong veo của ngày đầu tiên cầm máy ghi âm — đó chính là ngọn hải đăng của em.",
      rAdvHeart: "Vy rạng rỡ gật đầu: 'Em sẽ không bao giờ quên ánh đèn vàng của quán mình mỗi khi đặt bút viết!'",
      advMind: "Hãy xây dựng một kho tư liệu thực địa bài bản — đó sẽ là tài sản nghề nghiệp vô giá của em trong nhiều năm tới.",
      rAdvMind: "Vy ghi ngay ý tưởng vào sổ: 'Đúng vậy ạ! Em sẽ hệ thống hóa toàn bộ phỏng vấn thành một thư viện ký ức sống động!'",
      parting: "Hẹn gặp lại Thỏ Con vào số báo đặc biệt tiếp theo nhé, em nhất định sẽ mang tờ báo in đầu tiên tới tặng quán!"
    },
    minh: {
      deepTalk: "Khi bắt đầu đề xuất mô hình công nghệ lấy con người làm trung tâm, tôi gặp không ít ánh mắt hoài nghi từ những người chỉ quen nhìn vào bảng tối ưu chi phí ngắn hạn.",
      qHeart: "Điều gì giúp anh giữ được sự kiên nhẫn để thuyết phục từng đồng nghiệp hiểu giá trị nhân văn của dự án mới?",
      rHeart: "Minh mỉm cười ấm áp: 'Tôi kể cho họ nghe câu chuyện thật của những người lao động ngoài phố mà tôi đã gặp — khi có gương mặt và cảm xúc thật, ai cũng biết đồng cảm.'",
      qMind: "Anh đã thiết kế cơ chế đo lường nào để chứng minh hệ thống nhân văn cũng mang lại hiệu quả bền vững cho doanh nghiệp?",
      rMind: "Minh gật gù: 'Tôi đo lường tỷ lệ gắn kết nhân sự và độ hài lòng thực tế của người dùng — con số chứng minh rõ ràng rằng sự tử tế tạo ra giá trị dài hạn!'",
      advHeart: "Đừng ngại đi chậm một chút để đảm bảo không ai bị bỏ lại phía sau trên chuyến tàu công nghệ.",
      rAdvHeart: "Minh thở phào nhẹ nhõm: 'Cảm ơn Thỏ Con, lời nhắc của bạn giúp tôi vững tâm hơn rất nhiều.'",
      advMind: "Hãy biến những nguyên tắc đạo đức và sự thấu cảm thành tiêu chuẩn cốt lõi ngay từ dòng code đầu tiên.",
      rAdvMind: "Minh mỉm cười tự tin: 'Bộ khung tiêu chuẩn đó đang được nhóm tôi hoàn thiện ngay trong tuần này!'",
      parting: "Cảm ơn Thỏ Con vì luôn là trạm sạc tinh thần bình yên nhất của tôi giữa thành phố này."
    },
    linh: {
      deepTalk: "Viết chậm lại giúp chị tìm thấy niềm vui thuần khiết, nhưng đôi lúc đứng trước trang giấy trắng giữa đêm khuya, chị vẫn tự hỏi liệu giọng văn thủ thỉ của mình có đủ sức vang xa.",
      qHeart: "Trong những trang bản thảo mới viết, nhân vật nào khiến chị gửi gắm nhiều tình cảm và sự dịu dàng nhất?",
      rHeart: "Chị Linh khẽ chạm tay lên bìa sổ đỏ: 'Đó là những người lao động thức khuya lặng lẽ giữ cho thành phố sạch đẹp và ấm áp trước bình minh.'",
      qMind: "Chị có nghĩ tới việc kết hợp ấn phẩm sách giấy với các buổi giao lưu đọc truyện trực tiếp để kết nối sâu hơn với độc giả?",
      rMind: "Chị Linh mỉm cười sáng bừng: 'Ý tưởng hay quá! Một buổi đọc sách nhỏ dưới ánh đèn vàng ấm áp chắc chắn sẽ chạm tới đúng những độc giả đồng điệu!'",
      advHeart: "Một ngọn nến nhỏ trong đêm tối vẫn đủ sưởi ấm cả căn phòng — câu chữ chân thành của chị cũng vậy.",
      rAdvHeart: "Chị Linh rưng rưng mỉm cười: 'Chị sẽ viết tiếp bằng tất cả sự dịu dàng của mình.'",
      advMind: "Hãy tự tin định vị tác phẩm của chị như một món quà tinh thần độc bản dành cho những tâm hồn biết trân trọng sự tĩnh tại.",
      rAdvMind: "Chị Linh gật đầu đầy hứng khởi: 'Chị đã sẵn sàng gửi bản thảo hoàn chỉnh tới nhà xuất bản rồi!'",
      parting: "Cảm ơn Thỏ Con đã luôn lắng nghe từng chương truyện của chị như một người bạn tri kỷ."
    },
    tuan: {
      deepTalk: "Ngày đầu tiên bước vào xưởng bảo trì xe điện hiện đại, nhìn những bảng mạch điện tử mới tinh, thú thực có lúc anh cũng hơi hồi hộp sợ tay nghề cơ khí truyền thống của mình bị bỡ ngỡ.",
      qHeart: "Khoảnh khắc nào ở xưởng mới khiến anh nhận ra kinh nghiệm 12 năm của mình vẫn là chỗ dựa quý giá cho anh em?",
      rHeart: "Anh Tuấn cười sảng khoái: 'Lúc một chiếc xe gặp lỗi truyền động cơ học mà máy chẩn đoán không ra, chính đôi tai nghe tiếng máy của anh đã tìm ra chỗ kẹt chỉ sau năm phút!'",
      qMind: "Anh đã lên kế hoạch học thêm chứng chỉ kỹ thuật điện tử nào để kết hợp trọn vẹn tay nghề cũ và công nghệ mới?",
      rMind: "Anh Tuấn phấn khởi: 'Anh đăng ký lớp bổ túc kỹ thuật xe điện buổi tối cùng mấy cậu em trẻ trong xưởng rồi, vừa học vừa trao đổi vui lắm!'",
      advHeart: "Sự khiêm tốn và tinh thần ham học hỏi của anh chính là tấm gương đẹp nhất cho hai con nhỏ noi theo.",
      rAdvHeart: "Anh Tuấn xúc động gật đầu: 'Nghe em nói anh thấy mình tràn đầy năng lượng luôn!'",
      advMind: "Sự kết hợp giữa kinh nghiệm thực chiến và kiến thức công nghệ mới sẽ đưa anh trở thành người thợ không thể thay thế.",
      rAdvMind: "Anh Tuấn vỗ tay lên quầy gỗ đầy tự tin: 'Anh sẽ cố gắng nắm vững toàn bộ quy trình mới trong tháng này!'",
      parting: "Chúc quán chú luôn ấm đèn! Anh về nghỉ sớm để sáng mai dậy đưa hai đứa nhỏ đi học đây."
    },
    khang: {
      deepTalk: "Khi mở cửa xưởng đón khách trải nghiệm thủ công, anh vui vì mọi người yêu thích nghề truyền thống, nhưng cũng trăn trở làm sao cân đối thời gian để anh em thợ vẫn giữ được sự tĩnh tâm chế tác.",
      qHeart: "Nhìn ánh mắt háo hức của một bạn trẻ tự tay khâu xong mũi chỉ đầu tiên, anh cảm thấy điều gì ấm áp nhất?",
      rHeart: "Anh Khang mỉm cười hiền: 'Anh thấy nghề của ông cha mình đang được tiếp nối một cách tự nhiên, không hề bị lãng quên giữa thời đại số.'",
      qMind: "Anh có thể phân chia lịch xưởng thành ngày chế tác chuyên sâu và cuối tuần trải nghiệm để tối ưu cả hai mục tiêu không?",
      rMind: "Anh Khang gật gù tâm đắc: 'Quá hợp lý! Thứ Hai đến thứ Sáu xưởng tập trung hoàn thiện đơn đặt hàng tinh xảo, còn cuối tuần dành trọn cho không gian trải nghiệm!'",
      advHeart: "Khi người thợ đặt trọn tình yêu vào từng đường kim, mỗi sản phẩm đều mang theo một câu chuyện sống động.",
      rAdvHeart: "Anh Khang mỉm cười vững tin: 'Cảm ơn Thỏ Con đã luôn tiếp thêm cảm hứng cho xưởng nhỏ của anh.'",
      advMind: "Quy trình bài bản sẽ giúp xưởng vừa bảo tồn tinh hoa thủ công vừa phát triển kinh doanh bền vững.",
      rAdvMind: "Anh Khang gật đầu: 'Tuần tới anh sẽ áp dụng ngay lịch vận hành mới này cho cả xưởng!'",
      parting: "Hẹn sớm gặp lại Thỏ Con, chúc góc quán của em luôn bình yên như một bản nhạc trầm."
    },
    hoa: {
      deepTalk: "Hai mẹ con cô giờ đã trò chuyện cởi mở hơn rất nhiều, nhưng đôi khi cô vẫn nhắc mình phải kìm lại thói quen lo xa để con trai tự do trưởng thành theo cách của cháu.",
      qHeart: "Khoảnh khắc bình dị nào bên con trai tuần qua khiến cô cảm thấy hạnh phúc và mãn nguyện nhất?",
      rHeart: "Cô Hoa mỉm cười rạng rỡ: 'Là lúc cháu chủ động pha cho cô một ly trà gừng và bảo: Mẹ cứ nghỉ ngơi đi, việc nhà để con phụ mẹ!'",
      qMind: "Ở công ty, cô đã ứng dụng những kỹ năng số mới học được vào quy trình kế toán như thế nào?",
      rMind: "Cô Hoa tự hào kể: 'Cô tự thiết lập được bảng tổng hợp tự động giúp cả phòng tiết kiệm nửa ngày làm việc, ai cũng khen cô bắt nhịp nhanh!'",
      advHeart: "Tình yêu thương biết tôn trọng khoảng trời riêng của con chính là món quà tuyệt vời nhất của một người mẹ.",
      rAdvHeart: "Cô Hoa gật đầu dịu dàng: 'Cô hiểu rồi cháu ạ, làm bạn cùng con hóa ra nhẹ nhàng và vui hơn làm người giám sát rất nhiều.'",
      advMind: "Sự điềm tĩnh của kinh nghiệm kết hợp với công cụ mới đã giúp cô tỏa sáng đầy tự tin ở tuổi 44.",
      rAdvMind: "Cô Hoa mỉm cười tươi tắn: 'Cô đang chuẩn bị hướng dẫn lại các chị đồng nghiệp lớn tuổi khác trong công ty nữa đấy!'",
      parting: "Cảm ơn cháu Thỏ Con đã luôn là nơi cô tìm thấy sự bình tâm mỗi khi cần lắng lại."
    },
    an: {
      deepTalk: "Tủ sách cộng đồng mới mở đã thu hút nhiều bạn trẻ ghé đọc, nhưng bác vẫn trăn trở làm sao để các cháu không chỉ đọc lướt qua trang giấy mà thực sự biết suy ngẫm và đối thoại cùng sách.",
      qHeart: "Kỷ niệm đẹp nhất trong buổi sinh hoạt đọc sách đầu tiên tuần qua khiến bác xúc động nhất là gì?",
      rHeart: "Bác An mỉm cười hiền từ: 'Có một cậu sinh viên chia sẻ rằng nhờ đọc một truyện ngắn trên kệ sách của quán mà cậu ấy đã gọi điện về làm hòa với bố sau hai năm giận dỗi.'",
      qMind: "Bác nghĩ sao nếu mỗi cuốn sách trên kệ đều kẹp một tờ phiếu nhỏ để người đọc trước để lại một câu hỏi gợi mở cho người đọc sau?",
      rMind: "Bác An vỗ nhẹ tay tán thưởng: 'Tuyệt diệu! Đó chính là cuộc đối thoại thầm lặng nối liền những tâm hồn yêu sách qua từng trang giấy!'",
      advHeart: "Một hạt giống thiện lành gieo vào tâm hồn người trẻ hôm nay sẽ tỏa bóng mát cho cả mai sau.",
      rAdvHeart: "Bác An xúc động gật đầu: 'Bác thấy tuổi già của mình thật ý nghĩa khi được đồng hành cùng cháu và các bạn trẻ.'",
      advMind: "Ý tưởng phiếu đối thoại kẹp sách sẽ biến tủ sách nhỏ của quán thành một không gian văn hóa tương tác độc đáo.",
      rAdvMind: "Bác An vui vẻ: 'Bác sẽ chuẩn bị ngay những tấm thẻ đánh dấu sách đầu tiên cho tuần này!'",
      parting: "Trời sắp hửng nắng rồi, bác về pha ấm trà sớm đây. Hẹn gặp lại cháu vào buổi đọc sách cuối tuần!"
    }
  },
  duoExtra: {
    vy_an: {
      hostToG1: "🐰 Thỏ Con đặt một ly nước lọc mát trước mặt Vy: 'Chạy phỏng vấn cả ngày chắc em mỏi chân lắm rồi, cứ ngồi thư giãn một chút, đêm nay hẻm nhỏ yên tĩnh lắm.'",
      g1More: "🎓 Vy khẽ mân mê chiếc máy ghi âm: 'Nhiều lúc em tự hỏi liệu những câu chuyện nhỏ bé ở góc phố này có còn ai muốn đọc giữa thời đại tin tức chớp nhoáng không...'",
      g1ToG2: "🎓 Vy ngước nhìn cuốn sách bìa vải cũ trên tay bác An với ánh mắt ngưỡng mộ: 'Thưa bác, hiệu sách đầu phố có phải nơi có giàn hoa giấy trước hiên không ạ? Hồi sinh viên cháu hay đứng trú mưa ở đó lắm!'",
      g2ToG1: "👓 Bác An mỉm cười hiền hậu: 'Đúng là nơi ấy rồi cháu ạ! Hóa ra cô bé hay đứng ghi chép dưới hiên mưa ngày nào chính là cháu. Có những người trẻ còn nhớ tới tiệm sách cũ thế này, bác thấy ấm lòng lắm.'",
      duoDrinkBanter: "🐰 Thỏ Con mỉm cười nhìn hai bác cháu say sưa trò chuyện về những trang sách và những thước phim tư liệu, hương mơ ủ và thanh yên hòa quyện dịu dàng trong không gian quán.",
      duoPreDawnHost: "🐰 Thỏ Con nhìn đồng hồ đã điểm gần 04:45: 'Ánh đèn vàng đêm nay sáng hơn hẳn nhờ cuộc gặp gỡ giữa hai thế hệ cầm bút đấy ạ.'",
      duoPreDawnGuests: "🎓👓 Vy và bác An cùng mỉm cười gật đầu — một người tìm thấy chiều sâu ký ức, một người tìm thấy sức trẻ tiếp nối.",
      duoFarewellHost: "🐰 Thỏ Con tiễn hai bác cháu ra đầu ngõ đón tia nắng đầu tiên: 'Chúc dự án lưu giữ ký ức hẻm nhỏ của hai người sẽ chạm tới thật nhiều trái tim!'"
    },
    minh_hoa: {
      hostToG1: "🐰 Thỏ Con khẽ đẩy đĩa hạt điều rang ấm về phía Minh: 'Anh vừa tăng ca xong đúng không? Uống ngụm nước ấm cho giãn đôi vai ra đã nhé.'",
      g1More: "💻 Minh tháo kính day nhẹ sống mũi: 'Tôi viết hệ thống kết nối hàng triệu người dùng, vậy mà tối nay nhìn điện thoại lại thấy mình chẳng biết nhắn gì cho mẹ ở quê...'",
      g1ToG2: "💻 Minh khẽ ngạc nhiên khi nghe cô Hoa nhắc tới cậu con trai đeo tai nghe: 'Cô ơi, thực ra nhiều lúc tụi cháu đeo tai nghe không phải vì muốn tránh mặt bố mẹ đâu, mà vì sợ mang áp lực công việc làm bố mẹ lo lắng thêm thôi ạ.'",
      g2ToG1: "🧶 Cô Hoa khẽ sững người rồi mỉm cười dịu dàng đầy thấu hiểu: 'Nghe cháu nói cô mới vỡ lẽ... Hóa ra hai mẹ con thương nhau mà lại cứ giữ im lặng vì sợ làm phiền nhau.'",
      duoDrinkBanter: "🐰 Thỏ Con mỉm cười nhìn cô Hoa ghi chép chăm chú những phím tắt thông minh Minh vừa chỉ, không khí ấm áp hệt như một buổi tối sum họp gia đình.",
      duoPreDawnHost: "🐰 Thỏ Con khẽ nói: 'Khi công nghệ được dẫn dắt bởi sự thấu cảm giữa hai thế hệ, mọi khoảng cách đều có thể xóa nhòa.'",
      duoPreDawnGuests: "💻🧶 Minh và cô Hoa cùng gửi lời cảm ơn chủ quán, ánh mắt cả hai đều ánh lên sự nhẹ nhõm chân thành.",
      duoFarewellHost: "🐰 Thỏ Con mỉm cười vẫy tay: 'Chúc hai cô cháu có những buổi trò chuyện thật ấm áp bên người thân của mình!'"
    },
    linh_khang: {
      hostToG1: "🐰 Thỏ Con đặt ngọn nến sáp ong nhỏ bên cạnh cuốn sổ bìa đỏ của chị Linh: 'Ánh nến này giúp trang giấy ấm màu hơn khi chị đọc lại bản thảo đấy ạ.'",
      g1More: "🖋️ Chị Linh khẽ thở dài: 'Đôi khi chị thấy mình giống một người thợ thủ công lạc giữa nhà máy tự động, cứ nắn nót từng chữ một mà không biết có kịp nhịp thời đại không...'",
      g1ToG2: "🖋️ Chị Linh nhìn chiếc tạp dề vương sáp ong của anh Khang mà mỉm cười đồng cảm: 'Hóa ra trên con phố đêm này không chỉ có mình em kiên trì làm những thứ chậm rãi bằng tay!'",
      g2ToG1: "🧵 Anh Khang gật đầu trầm ấm: 'Chữ viết có hồn của em cũng giống như da thuộc mộc vậy — càng đi qua năm tháng càng bóng đẹp và có giá trị riêng, không máy móc nào thay thế được.'",
      duoDrinkBanter: "🐰 Thỏ Con ngắm nhìn cuốn sổ bìa đỏ nằm cạnh miếng da sáp ong trên quầy gỗ — hai thế giới thủ công tìm thấy tiếng nói chung ngay giữa đêm mưa.",
      duoPreDawnHost: "🐰 Thỏ Con mỉm cười: 'Sự tỉ mỉ và lòng tự trọng nghề nghiệp khi gặp nhau sẽ tạo nên những tác phẩm vượt thời gian.'",
      duoPreDawnGuests: "🖋️🧵 Chị Linh và anh Khang hào hứng hẹn ngày mang mẫu sách bìa da khâu tay đầu tiên tới trưng bày tại quán.",
      duoFarewellHost: "🐰 Thỏ Con tiễn hai người nghệ sĩ ra hiên quán: 'Chúc từng trang chữ và mũi chỉ sáp ong của hai người luôn tỏa hương ấm áp!'"
    },
    tuan_minh: {
      hostToG1: "🐰 Thỏ Con rót ly nước ấm mời anh Tuấn: 'Ngoài đường gió lạnh lắm, anh ngồi nghỉ chân cho ấm người trước khi chạy chuyến cuối nhé.'",
      g1More: "🚚 Anh Tuấn phủi giọt nước mưa trên áo khoác: 'Chạy đêm anh không ngại cực, chỉ mong mấy hệ thống điều phối trên mạng hiểu cho cánh tài xế tụi anh những lúc đường ngập mưa giông...'",
      g1ToG2: "🚚 Anh Tuấn nhìn chàng kỹ sư trẻ đang áy náy mà bật cười hiền hậu: 'Này chú em, anh nói vậy là góp ý cho cái máy thôi chứ đâu có trách chú! Thấy chú thức khuya trăn trở vì anh em ngoài đường là anh quý rồi.'",
      g2ToG1: "💻 Minh cảm kích gật đầu: 'Em cảm ơn anh Tuấn nhiều lắm. Nghe anh chỉ rõ từng cung đường hay ngập và bất cập giờ cao điểm, em mới biết mình cần sửa thuật toán ở đâu.'",
      duoDrinkBanter: "🐰 Thỏ Con mỉm cười nhìn người tài xế dày dạn kinh nghiệm và chàng kỹ sư trẻ cùng phác thảo giải pháp trên tờ giấy ăn của quán.",
      duoPreDawnHost: "🐰 Thỏ Con gật gù: 'Khi người viết mã và người cầm lái ngồi cùng một bàn trà, công nghệ mới thực sự phục vụ con người.'",
      duoPreDawnGuests: "🚚💻 Anh Tuấn bắt tay Minh thật chặt, cả hai cùng bước ra phố với nguồn năng lượng tích cực.",
      duoFarewellHost: "🐰 Thỏ Con vẫy tay chào hai người bạn mới quen: 'Chúc những cung đường đêm của anh Tuấn và những dòng code của Minh luôn bình an!'"
    },
    tuan_hoa: {
      hostToG1: "🐰 Thỏ Con đẩy đĩa bánh quy gừng ấm lại gần anh Tuấn: 'Anh ăn tạm vài chiếc bánh cho ấm bụng nhé, chạy ca đêm giờ này tốn sức lắm.'",
      g1More: "🚚 Anh Tuấn cười hiền khi nhìn tấm ảnh hai con trong ví: 'Chỉ cần nghĩ tới sáng mai hai đứa có bộ đồng phục mới tới trường là anh lại thấy khỏe re!'",
      g1ToG2: "🚚 Anh Tuấn gật đầu đồng cảm với cô Hoa: 'Chị nói đúng quá, làm bố làm mẹ cứ thấy con cái khỏe mạnh, vui vẻ là bao nhiêu vất vả ngoài xã hội đều tan biến hết.'",
      g2ToG1: "🧶 Cô Hoa mỉm cười ấm áp: 'Sau này hai bé nhà anh lớn lên, chắc chắn tụi nhỏ sẽ vô cùng tự hào vì có một người bố tận tụy và lạc quan như anh.'",
      duoDrinkBanter: "🐰 Thỏ Con cảm nhận rõ hơi ấm gia đình lan tỏa khắp góc quầy gỗ qua những câu chuyện giản dị về con cái của hai vị khách.",
      duoPreDawnHost: "🐰 Thỏ Con mỉm cười chúc phúc: 'Những bậc cha mẹ hết lòng vì con cái xứng đáng nhận được mọi điều bình an nhất.'",
      duoPreDawnGuests: "🚚🧶 Anh Tuấn và cô Hoa cùng mỉm cười chào chủ quán, mang theo sự nhẹ nhõm trở về với tổ ấm của mình.",
      duoFarewellHost: "🐰 Thỏ Con tiễn hai vị phụ huynh ra đầu ngõ: 'Chúc hai gia đình một buổi sáng sum vầy thật nhiều niềm vui!'"
    },
    linh_an: {
      hostToG1: "🐰 Thỏ Con rót một chén trà ấm đặt cạnh cuốn sổ bìa đỏ của chị Linh: 'Giọng đọc của chị trầm ấm lắm, nghe giữa đêm mưa cứ như đang nghe đài phát thanh văn học vậy.'",
      g1More: "🖋️ Chị Linh khẽ mỉm cười: 'Chị đang thử đọc thành tiếng để kiểm tra nhịp điệu của từng câu văn — thứ mà những bài viết công nghiệp vội vã đã đánh mất.'",
      g1ToG2: "🖋️ Chị Linh reo lên đầy trân trọng khi nhận ra bác An: 'Thưa thầy, ngày xưa cháu từng dự buổi chuyên đề văn học của thầy ở thư viện thành phố đấy ạ!'",
      g2ToG1: "👓 Bác An ánh lên niềm vui rạng rỡ: 'Thật vậy sao? Thật hạnh phúc khi thấy cô học trò năm nào nay đã trở thành một cây bút biết nâng niu vẻ đẹp của tiếng Việt!'",
      duoDrinkBanter: "🐰 Thỏ Con lặng lẽ lắng nghe hai thế hệ yêu văn chương say sưa bàn luận về từng con chữ bên ly nước mơ ủ thơm dịu.",
      duoPreDawnHost: "🐰 Thỏ Con mỉm cười: 'Cuộc hội ngộ đêm nay đẹp hệt như một chương sách hay mà Thỏ Con may mắn được chứng kiến.'",
      duoPreDawnGuests: "🖋️👓 Chị Linh và bác An cùng nâng ly chúc cho tình yêu sách giấy và văn chương tử tế mãi lan tỏa.",
      duoFarewellHost: "🐰 Thỏ Con tiễn hai tâm hồn yêu văn chương ra bậc cửa: 'Hẹn đón bác An và chị Linh tại góc tủ sách cộng đồng của quán nhé!'"
    }
  }
};
