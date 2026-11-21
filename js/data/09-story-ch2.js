"use strict";

/* -----------------------------------------------------------------------
   CHƯƠNG 2 — TRỞ LẠI (Tuần 2, 7 đêm)
   Mọi người quay lại, mỗi người mang theo một điều đã đổi khác. Từ đêm này có 2–3 khách.
   Lời thoại dạng {h,m,s,d} thay đổi theo cách bạn đã đối xử với họ ở Chương 1.
------------------------------------------------------------------------ */
const STORY_CH2 = [
  /* ========== ĐÊM 8 — VY & BÁC AN ========== */
  {
    ch: 2, n: 1, t0: "21:30", icon: "🎙️", title: "Chiếc Máy Ghi Âm Gặp Cuốn Sách Cũ",
    guests: ["vy", "an"], end: "duo:vy_an",
    intro: [
      "Tuần thứ hai của Tháng Mưa. Giá gạo lại nhích thêm, ba trung tâm thương mại mới mọc lên, và trên mạng ngập những bản tin viết bằng máy, đọc trơn tru mà chẳng ai nhớ nổi một chữ.",
      "Lần này Thỏ Con mở cửa sớm hơn. Chín giờ rưỡi tối, đèn lồng đã sáng. Ai đó trong con hẻm hình như vừa nhắc đến tên quán."
    ],
    steps: [
      ["@", "21:40"],
      ["host", "Chín giờ bốn mươi. Lần đầu tiên mình mở quán lúc tối chưa khuya. Cảm giác như đón khách buổi chiều vậy."],
      ["@", "21:55"],
      ["+", "vy"],
      ["vy", {
        h: "Thỏ Con ơi! Em quay lại rồi nè! Hôm đó chị nói em cứ viết bằng chân thành, em viết thật luôn. Bài phóng sự đầu tiên có ba trăm lượt đọc, toàn người lạ!",
        m: "Chào Thỏ Con! Em lập kênh phóng sự độc lập rồi, đúng như mình bàn hôm trước. Mới có bốn mươi người theo dõi nhưng ai cũng để lại bình luận dài.",
        s: "Chào Thỏ Con. Hôm đó mình không nói gì nhiều, mà em lại nhớ im lặng ấy suốt cả tuần. Tuần này em đã dám gõ cửa phỏng vấn người ta lại.",
        d: "Chào Thỏ Con! Em quay lại rồi. Tuần này em gõ cửa được năm nhà, mới có hai nhà mở cửa. Nhưng hai nhà ấy kể cho em nghe nhiều lắm."
      }],
      ["host", "Mừng quá. Nghe giọng bạn khác hẳn đêm mưa đầu tiên. Ngồi cạnh bếp than nhé."],
      ["vy", "Nhưng em đang vướng một chuyện. Em muốn viết về những hiệu sách cũ sắp đóng cửa vì giá thuê mặt bằng leo thang. Mà em chưa tìm được người chịu mở lòng, ai cũng sợ lên báo."],
      ["@", "22:30"],
      ["+", "an"],
      ["an", {
        h: "Chào hai cháu. Bác quay lại rồi đây. Bác mang theo ba cuốn sách cho cái kệ trống ở góc quán, như đã hứa với cháu Thỏ Con.",
        m: "Chào hai cháu. Bác đã nghĩ kỹ chuyện tủ sách cộng đồng cháu gợi ý. Bác mang vài cuốn đến thử xem sao.",
        s: "Chào hai cháu. Bác chẳng nhớ mình đã nói gì tuần trước, chỉ nhớ có người lật trang sách giúp bác rất dịu. Nên bác quay lại.",
        d: "Chào hai cháu. Bác tới đưa mấy cuốn sách lên kệ trống ở góc quán, nếu chủ quán không phiền."
      }],
      ["host", "Bác An ngồi cạnh Vy đi ạ. Hai người có thể chưa quen nhau, nhưng đêm nay hình như cùng đang nghĩ về một chuyện."],
      ["vy", "Chào bác ạ! Cháu là Vy, đang làm phóng sự về những hiệu sách cũ. Cháu nghe nói cuối phố sắp đóng một hiệu rồi."],
      ["an", "Chính là hiệu sách bác hay lui tới suốt hai mươi năm đấy cháu. Chủ tiệm bảo giá thuê sắp gấp đôi, mà người mua lại ít đi. Ông ấy sắp gói sách vào thùng."],
      ["an", "Cháu cầm cái máy ghi âm cũ kỹ kia, trông giống hệt cái máy bác dùng thu bài giảng thuở trước. Nó còn ghi được tiếng không?"],
      ["@", "22:50"],
      ["?", "Hai thế hệ cầm bút đang ngồi cạnh nhau. Mình đẩy nhẹ ấm trà ra giữa hai người.",
        ["Bác An có cả kho ký ức của khu phố, Vy có đôi tai biết lắng nghe. Hai người đúng là mảnh ghép của nhau.", "vy", "Bác ơi, bác kể cháu nghe được không? Cháu không cần bài hay, cháu chỉ cần giọng của bác thôi."],
        ["Nếu Vy ghi lại loạt phóng sự về hiệu sách cuối cùng và những người giữ chữ, đó là câu chuyện không thuật toán nào kể thay được.", "an", "Một loạt phóng sự về người giữ chữ. Nghe giống một tiết văn hay hơn mọi bài giảng bác từng soạn."],
        ["Rót thêm trà cho cả hai rồi lùi lại, để hai người tự tìm đường đến với nhau.", "an", "Cháu để hai bác cháu tự nói chuyện. Khéo thế. Nào, Vy, ngồi gần hơn đi cháu."]],
      ["@", "23:10"],
      ["brew", "vy", "Thỏ Con ơi, em lại cần một ly thật tỉnh người, chua dịu của trái cây và chút the mát. Em còn phải gõ lại ghi chú buổi phỏng vấn tối nay.", "Vy nhấp một ngụm, mắt sáng lên: vị thanh tỉnh này khiến em muốn gõ phím liền tay luôn."],
      ["@", "23:25"],
      ["brew", "an", "Còn bác thì một ly mang chút hoài niệm thôi cháu, chua ngọt thanh tao, thoảng mùi hoa nhẹ như chiều thu.", "Bác An nhấp một ngụm, gật đầu thật chậm: vị này làm bác nhớ những buổi chiều chấm bài bên hiên nhà."],
      ["@", "23:40"],
      ["an", "Vy này, cuốn sách trên cùng bác từng cho một học trò mượn. Nó bảo đọc nửa cuốn thì thấy tim đập nhanh. Bác nhớ mãi cái từ ‘tim đập nhanh’ ấy."],
      ["vy", "Bác kể thêm đi. Cháu ghi âm bác nhé? Chỉ để cháu giữ lại giọng bác thôi, cháu không đăng nếu bác không muốn."],
      ["an", "Được thôi. Giọng của ông già bảy mươi mà còn có người muốn giữ, chuyện lạ."],
      ["card"],
      ["@", "00:20"],
      ["host", "Mười hai giờ hai mươi rồi. Hai người nói chuyện lâu mà ly còn ấm, mình đã châm nước thêm hai lần. Trước khi hai người về, mình xin góp một lời."],
      ["?", "Vy tắt máy ghi âm. Bác An đặt tay lên cuốn sách. Mình chọn lời cuối.",
        ["Câu chuyện của người giữ chữ cần được kể bằng chính giọng của họ. Hai người đã làm được điều đó trong một đêm.", "vy", "Cháu sẽ gửi bản thảo cho bác nghe trước khi đăng. Bác là người đầu tiên."],
        ["Vy làm phóng sự, bác An làm cố vấn ngôn từ. Hai người có thể mở một chuyên mục chung về sách giấy.", "an", "Bác làm cố vấn à? Cũng hay. Học trò bác ngày xưa nay thành đồng nghiệp rồi."],
        ["Mỉm cười nhìn hai người, không nói thêm.", "vy", "Em hiểu rồi, Thỏ Con. Có những lời không cần nói ra."]],
      ["@", "00:40"],
      ["vy", "Cảm ơn Thỏ Con và bác. Em về viết liền, kẻo sáng ra lại thấy sợ."],
      ["an", "Cảm ơn cháu chủ quán. Cái kệ trống ở góc kia xong rồi. Tuần sau bác sẽ mang thêm."],
      ["host", "Hai người đi cẩn thận. Cửa quán luôn mở."]
    ]
  },

  /* ========== ĐÊM 9 — MINH & CÔ HOA ========== */
  {
    ch: 2, n: 2, t0: "22:00", icon: "🧮", title: "Hai Thế Hệ Một Màn Hình",
    guests: ["minh", "hoa"], end: "duo:minh_hoa",
    intro: [
      "Tối thứ hai của tuần thứ hai. Bản tin giá cả đọc lên: xăng lên, điện lên, gạo lên. Người ta bảo suy thoái chưa chạm đáy. Trong các tòa nhà văn phòng, thêm một phần mềm mới vừa được bật.",
      "Thỏ Con đặt hai chiếc chén sứ cạnh nhau trên quầy. Một chén có hoa cúc, một chén có hạt dẻ rang."
    ],
    steps: [
      ["@", "22:15"],
      ["+", "hoa"],
      ["hoa", {
        h: "Chào cháu Thỏ Con. Cô đem theo bánh nếp tự làm. Hôm đó cháu nghe cô nói chuyện con trai rất kỹ, cô muốn cảm ơn.",
        m: "Chào cháu. Cô nghe lời cháu rồi, cô nhờ con trai chỉ cô dùng phần mềm kế toán mới. Nó chỉ cô cả tiếng đồng hồ, cô mừng lắm.",
        s: "Chào cháu. Hôm đó cháu chỉ ngồi nghe cô thôi, vậy mà tối về cô ngủ ngon lạ. Cô quay lại cảm ơn cháu.",
        d: "Chào cháu Thỏ Con. Cô lại mất ngủ, nên ghé đây ngồi cho đỡ trống trải."
      }],
      ["host", "Cô ngồi đi ạ. Chiếc khăn len màu hổ phách lần này cô không quàng à?"],
      ["hoa", "Cô để ở nhà cho thằng nhỏ. Nó bảo trời lạnh, nó mượn đi chạy xe ra ngoài. Lâu lắm rồi nó mới nhờ cô thứ gì."],
      ["@", "22:40"],
      ["+", "minh"],
      ["minh", {
        h: "Chào chủ quán. Tôi quay lại. Chú vịt cao su nói tôi nên cảm ơn cô lần nữa. Tuần này tôi dám mở lời với trưởng nhóm thật.",
        m: "Chào chủ quán. Bản đề xuất thiết kế lại quy trình lấy con người làm trung tâm của tôi bị hoãn lại. Nhưng sếp bảo cho tôi thử trong một nhóm nhỏ.",
        s: "Chào chủ quán. Đêm trước cô không hỏi thêm gì, mà đến sáng tôi nhận ra mình đã nghĩ được cả một giải pháp. Cảm ơn khoảng lặng ấy.",
        d: "Chào chủ quán. Tôi lại tới vì một lỗi không gỡ được, và chú vịt thì hết kiên nhẫn."
      }],
      ["host", "Anh Minh, đây là cô Hoa. Cô ấy làm kế toán hai mươi năm. Cô Hoa, đây là anh Minh, người viết ra những phần mềm như cái cô vừa học."],
      ["hoa", "Ôi, người viết phần mềm! Cháu ơi, cô hỏi thật: cái máy nó tính đúng hơn cô, vậy cô còn đáng giá chỗ nào?"],
      ["minh", "Cô hỏi đúng câu tôi tự hỏi mỗi tối. Tôi viết ra thứ có thể thay người, mà chưa bao giờ trả lời được câu đó."],
      ["@", "23:05"],
      ["hoa", "Cô nói cho cháu nghe nhé. Có tháng máy báo đúng hết, mà cô vẫn thấy sai. Hóa ra có một khoản chi người ta cố tình ghi khác đi để giấu. Máy không biết ngờ, cô thì ngờ."],
      ["minh", "Ngờ vực có cơ sở. Cái đó tôi chưa dạy được cho thuật toán. Hóa ra phần của cô, thứ cô gọi là linh cảm, mới là chỗ máy cần học."],
      ["?", "Hai người lạ vừa tìm thấy một chủ đề chung. Mình đẩy nhẹ đĩa bánh nếp ra giữa bàn.",
        ["Anh Minh viết phần mềm, cô Hoa hiểu con số bằng trực giác. Hai người đứng cạnh nhau là đủ cả hai nửa của một hệ thống tốt.", "minh", "Một hệ thống kiểm toán có người ngồi cạnh thuật toán. Cô Hoa, cô có muốn thử làm cố vấn cho nhóm của tôi không?"],
        ["Cô Hoa có thể dạy máy cách nhận ra khoản chi bất thường, anh Minh viết thành quy tắc. Đó là công cụ không công ty nào có sẵn.", "hoa", "Chà, cô dạy máy à? Nghe vui đấy. Vậy cô cần một cuốn sổ để ghi lại những điều cô vẫn nhìn thấy."],
        ["Đặt thêm hai chén nước ấm, ngồi yên cho hai người nói với nhau.", "hoa", "Cháu rót nước mà không nói gì. Hay thật. Cô cháu mình cứ thế này một lúc đi."]],
      ["@", "23:30"],
      ["brew", "minh", "Cho tôi một ly đậm, đắng gọn để tỉnh táo, nhưng hậu vị phải mặn dịu hoặc ấm cay để dịu đầu óc.", "Minh thở phào: ly này làm đầu tôi dịu hẳn, không còn nghe tiếng quạt máy chủ trong tai nữa."],
      ["@", "23:50"],
      ["brew", "hoa", "Còn cô một tách nhẹ nhàng, ngọt thanh, thoảng mùi hoa thôi cháu, để lòng thư thái.", "Cô Hoa nâng tách bằng hai tay: cái ngọt thanh này làm cô nhớ giọng hát ru của bà ngoại."],
      ["@", "00:15"],
      ["hoa", "Này cháu Minh, cháu có con chưa? Cô thấy cháu gầy quá."],
      ["minh", "Dạ chưa, cô. Cháu chỉ có một chú vịt cao su và một căn hộ nhỏ."],
      ["hoa", "Vậy thứ Bảy này qua nhà cô ăn cơm. Cô nấu thật nhiều, thằng con cô cũng thích bàn chuyện máy móc, hai người nói chuyện được với nhau đấy."],
      ["card"],
      ["@", "01:05"],
      ["host", "Một giờ năm phút. Hai người nói chuyện như quen nhau từ lâu rồi. Trước khi hai người về, mình xin góp một lời."],
      ["?", "Cô Hoa gói nốt chiếc bánh nếp cuối cho Minh. Mình chọn lời kết.",
        ["Có những người xa lạ gặp một đêm mưa mà trở thành điểm tựa cho nhau. Hai người xứng đáng với điều đó.", "hoa", "Cô nhớ lời này của cháu. Cô sẽ rủ cả thằng con tới ăn cơm."],
        ["Anh Minh mang công cụ, cô Hoa mang trực giác. Hai người có thể bắt đầu từ một buổi hướng dẫn nhỏ cho những người kế toán lớn tuổi.", "minh", "Nhất trí! Tôi soạn tài liệu, cô Hoa dẫn buổi học. Tôi chỉ cần cô nói thật chậm."],
        ["Gật đầu thật khẽ, để hai người mang theo chiếc bánh nếp ra cửa.", "minh", "Chủ quán chẳng nói gì mà tôi thấy được dặn dò. Cảm ơn."]],
      ["@", "01:25"],
      ["hoa", "Cảm ơn cháu Thỏ Con. Cháu nhớ giữ gìn sức khỏe, cô thấy cháu hay ho."],
      ["host", "Dạ, chắc tại gió ấy cô. Cô và anh Minh đi cẩn thận nhé."]
    ]
  },

  /* ========== ĐÊM 10 — LINH & KHANG ========== */
  {
    ch: 2, n: 3, t0: "23:00", icon: "📘", title: "Bìa Da Cho Trang Sách Đỏ",
    guests: ["linh", "khang"], end: "duo:linh_khang",
    intro: [
      "Đêm thứ ba của tuần thứ hai. Nhà xuất bản độc lập đầu phố thông báo tăng giá giấy ba lần trong sáu tháng. Giá da thuộc cũng chưa dừng lại.",
      "Thỏ Con lấy ra hai tấm lót ly, một bằng vải, một bằng da sáp ong do ai đó từng làm tặng. Đêm nay có vẻ sẽ cần cả hai."
    ],
    steps: [
      ["@", "23:20"],
      ["+", "linh"],
      ["linh", {
        h: "Chào em. Chị gửi bản thảo cho nhà xuất bản độc lập rồi, đúng như mình nói. Họ chưa trả lời, mà chị đã thấy nhẹ hơn nhiều.",
        m: "Chào em. Chị đã gửi thư chào hàng cho ba nhà xuất bản nhỏ. Họ chưa trả lời, nhưng chị đã có kế hoạch cho cả quý.",
        s: "Chào em. Đêm đó em để chị ngồi yên, nên chị nhớ mình cũng được phép chậm. Tuần này chị viết được bảy trang.",
        d: "Chào em. Chị lại đến. Cuốn sổ đỏ vẫn mới viết được vài trang, mà chị đã thấy mình có lỗi với nó."
      }],
      ["host", "Chị Linh ngồi chỗ cạnh cửa sổ nhé. Có bánh nếp của cô Hoa đây, mời chị."],
      ["linh", "Cảm ơn em. Chị có một việc nhờ. Nhà xuất bản độc lập bảo họ làm được sách nhưng không đủ tiền làm bìa đẹp. Chị đang cần một người làm bìa thật."],
      ["@", "23:50"],
      ["+", "khang"],
      ["khang", {
        h: "Chào Thỏ Con. Anh quay lại. Tuần trước em nói câu ấy xong, anh về mở xưởng đón khách trải nghiệm. Có tám người tới, hai người đặt hàng ngay.",
        m: "Chào Thỏ Con. Anh quay lại. Anh mở buổi trải nghiệm khâu da cuối tuần như em gợi ý. Mới có ba khách, mà anh em thợ vui như Tết.",
        s: "Chào Thỏ Con. Anh quay lại. Cái gật đầu của em tuần trước anh nghĩ mãi. Anh đã nói thật với anh em về chuyện cắt giảm.",
        d: "Chào Thỏ Con. Anh quay lại. Đơn hàng vẫn ế, mà anh thì chưa dám nói với ai."
      }],
      ["host", "Anh Khang, đây là chị Linh, biên tập viên. Chị ấy đang cần ai đó làm bìa thật cho một tập tản văn."],
      ["khang", "Làm bìa thật? Chị cầm cuốn sổ đỏ kia đi, cho anh xem thử gáy nó. Gáy sờn thế này là đã được cầm nhiều lắm."],
      ["linh", "Anh Khang nhận ra à? Chị cầm nó mỗi đêm. Chị định in một trăm cuốn thôi, bìa bìa cứng, chữ to cho mẹ chị đọc được."],
      ["@", "00:15"],
      ["khang", "Một trăm cuốn bìa da thì anh chịu. Nhưng nếu chị chịu bìa vải bố thuộc, ép nóng tên sách, thì làm được. Giá chỉ bằng nửa."],
      ["?", "Hai người đang tìm cách làm một cuốn sách có hồn giữa lúc giá giấy, giá da đều tăng.",
        ["Chị Linh có chữ, anh Khang có bàn tay. Một cuốn sách thủ công hai người cùng làm sẽ có giá trị hơn một ngàn bản in máy.", "linh", "Chị chưa bao giờ nghĩ tới điều đó. Một cuốn sách có hai dấu tay: tay chữ và tay da."],
        ["Chị Linh có thể mở đợt đặt trước một trăm bản, anh Khang làm bìa theo đơn. Vốn ít, nhưng cả hai đều không phải gánh rủi ro một mình.", "khang", "Đặt trước thì anh không sợ tồn kho. Anh làm cầm chừng ba tuần là xong một lô. Chị Linh tính được số lượng chưa?"],
        ["Rót thêm trà cho cả hai, đẩy chiếc tấm lót da sáp ong sang cạnh cuốn sổ đỏ.", "khang", "Em đặt tấm lót da của anh cạnh cuốn sổ đỏ à. Hợp nhau thật. Cứ như hai thứ ấy sinh ra để đi cùng."]],
      ["@", "00:45"],
      ["brew", "linh", "Chị muốn một thức uống chua ngọt dịu nhẹ, thơm mùi hoa, gợi một chút hoài niệm của buổi chiều đọc sách thôi.", "Chị Linh nhấp ngụm đầu, mỉm cười: vị này làm chị nhớ cái hiệu sách đầu tiên chị từng làm thêm hồi sinh viên."],
      ["@", "01:05"],
      ["brew", "khang", "Cho anh một ly đậm, ấm và trầm, hậu có chút cay ấm, thoảng mùi gỗ với sáp ong thôi.", "Anh Khang nhấp một ngụm, gật đầu: đúng cái vị của cái xưởng lúc sáu giờ chiều, khi mọi người đã xong việc."],
      ["@", "01:30"],
      ["linh", "Anh Khang, bìa mà làm xong, chị muốn khắc một dòng nhỏ ở mặt sau: ‘Viết ở Tiệm Nước Nửa Đêm.’ Anh làm được không?"],
      ["khang", "Làm được. Anh khắc thêm hình một chú thỏ nhỏ ở góc nữa, kẻo chủ quán giận."],
      ["card"],
      ["@", "02:20"],
      ["host", "Hai giờ hai mươi. Hai người bàn chuyện bìa sách mà mình đã nghe được tên một cuốn sách chưa ra đời. Trước khi về, mình có lời này."],
      ["?", "Chị Linh gói cuốn sổ đỏ lại. Anh Khang vuốt nhẹ tấm lót da. Mình chọn lời cuối.",
        ["Một cuốn sách là nơi chữ và da gặp nhau. Mình tin nó sẽ có chỗ trong tay những người cần nó.", "linh", "Chị cũng tin vậy. Cảm ơn em vì đã đặt hai người lạ ngồi cạnh nhau."],
        ["Hãy bắt đầu bằng một bản mẫu thật, đem tới hội chợ sách độc lập tháng sau.", "khang", "Hội chợ sách thì anh chưa từng dự. Nhưng anh sẽ thử. Chị Linh viết, anh làm, mình cùng đi."],
        ["Mỉm cười nhìn hai người, không nói gì thêm.", "linh", "Em chẳng nói gì mà chị thấy được tin tưởng. Cảm ơn em."]],
      ["@", "02:40"],
      ["khang", "Cảm ơn Thỏ Con. Em hay ho thế, nhớ uống nước ấm vào."],
      ["host", "Dạ, em biết rồi. Anh chị về cẩn thận."]
    ]
  },

  /* ========== ĐÊM 11 — ANH TUẤN & MINH ========== */
  {
    ch: 2, n: 4, t0: "01:00", icon: "📱", title: "Thuật Toán Gặp Người Cầm Lái",
    guests: ["tuan", "minh"], end: "duo:tuan_minh",
    intro: [
      "Đêm thứ tư của tuần thứ hai. Ứng dụng giao hàng vừa thay đổi cách tính điểm, tài xế bị trừ điểm nếu từ chối đơn trong vùng ngập. Cùng lúc ấy, một kỹ sư ở tòa nhà kính cuối phố đang rà lại đoạn mã quyết định điều đó.",
      "Thỏ Con đặt một chiếc mũ bảo hiểm cũ lên giá cạnh cửa. Chủ nhân của nó chắc sắp ghé."
    ],
    steps: [
      ["@", "01:10"],
      ["+", "tuan"],
      ["tuan", {
        h: "Chào chủ quán! Anh quay lại rồi nè! Tuần trước nghe em nói xong, anh ghé xưởng xe điện nộp hồ sơ thật. Họ hẹn phỏng vấn thứ Sáu này!",
        m: "Chào em. Anh đã nộp hồ sơ vào xưởng xe điện như em gợi ý. Họ chưa trả lời, nhưng anh thấy mình đã làm đúng việc.",
        s: "Chào em. Cái chạm im lặng của em tuần trước anh nhớ mãi. Cuối tuần anh dắt hai đứa nhỏ đi chơi, lâu lắm mới được thế.",
        d: "Chào chủ quán. Anh lại ghé nghỉ chân. Giá xăng lại lên rồi, tháng này chạy mà chưa đủ tiền sữa."
      }],
      ["host", "Anh Tuấn ngồi đi ạ. Ngoài kia còn mưa không?"],
      ["tuan", "Còn. Nhưng hôm nay ứng dụng gửi thông báo mới: tài xế từ chối đơn vùng ngập sẽ bị trừ ba điểm uy tín. Anh đọc xong muốn quăng điện thoại xuống nước."],
      ["@", "01:35"],
      ["+", "minh"],
      ["minh", {
        h: "Chào chủ quán. Tôi quay lại. Cô Hoa mời tôi ăn cơm hôm thứ Bảy, đã lâu rồi tôi mới ăn một bữa không nhìn màn hình.",
        m: "Chào chủ quán. Tôi quay lại, đang rà một đoạn mã mà bỗng thấy bất an. Tôi hy vọng nói ra được.",
        s: "Chào chủ quán. Tuần trước tôi nhớ lắm cái khoảng lặng ở đây. Tôi muốn ngồi lại một chút.",
        d: "Chào chủ quán. Tôi ghé một chút cho đỡ mệt. Đêm nay tôi lại phải rà một đoạn mã khó chịu."
      }],
      ["host", "Anh Minh, đây là anh Tuấn, tài xế giao hàng đêm. Anh Tuấn, đây là anh Minh, kỹ sư viết phần mềm."],
      ["tuan", "Kỹ sư à? Vậy chắc cậu là người viết ra cái cục thuật toán trừ điểm tụi anh rồi?"],
      ["minh", "Tôi không viết phần ứng dụng giao hàng. Nhưng tôi viết loại thuật toán y hệt. Và tối nay tôi đang rà một đoạn tính điểm tương tự."],
      ["@", "02:00"],
      ["minh", "Anh Tuấn, nếu anh cho tôi biết: ngày ngập, đoạn đường nào anh thấy khó nhất? Tôi muốn hiểu ứng dụng đang bỏ sót điều gì."],
      ["tuan", "Cậu hỏi thật hả? Được. Con hẻm sau chợ lúc hai giờ bị chắn xe rác. Ứng dụng báo đường thông, mà thực ra phải đi vòng mười phút."],
      ["?", "Một người cầm lái, một người viết mã. Hai người đang nhìn cùng một điểm từ hai phía.",
        ["Anh Tuấn biết đường thật, anh Minh viết được quy tắc. Chỉ cần hai người cùng ngồi một bàn là đủ sửa một lỗi mà cả công ty chưa nhìn thấy.", "minh", "Anh Tuấn, anh có thể đánh dấu giúp tôi những điểm thường bị ngập hoặc chắn không? Tôi sẽ gửi cho nhóm như dữ liệu thực địa."],
        ["Nếu có bản đồ do chính tài xế đánh dấu, thuật toán sẽ không còn trừ điểm oan cho anh em chạy đêm nữa.", "tuan", "Bản đồ do tài xế đánh dấu à? Anh có cả một nhóm chục anh em chạy đêm, thằng nào cũng thuộc đường như lòng bàn tay."],
        ["Đẩy hai ly nước ấm ra giữa, để hai người tự nói chuyện.", "tuan", "Em không nói gì mà anh với cậu kỹ sư này nói được với nhau. Lạ thật."]],
      ["@", "02:30"],
      ["brew", "tuan", "Pha cho anh ly gì ấm bụng, đậm đà, cay nồng với ngọt hậu để tan hết hơi lạnh nhé.", "Anh Tuấn xoa tay quanh ly: ấm thấu từ cổ họng xuống lòng bàn tay, đúng thứ anh cần."],
      ["@", "02:50"],
      ["brew", "minh", "Còn tôi ly đậm, đắng gọn, hậu mặn dịu hoặc ấm cay, để đầu óc bớt căng.", "Minh dựa lưng vào ghế, thở ra: cái đắng này làm đầu tôi gọn lại, không còn rối nữa."],
      ["@", "03:15"],
      ["tuan", "Cậu Minh, anh kể cậu nghe. Con gái anh vẽ tờ giấy siêu nhân cho anh mỗi ngày. Có hôm anh trễ đơn bị trừ điểm, anh nhìn tờ giấy mà thấy mình đáng giá hơn một con số."],
      ["minh", "Tôi sẽ nhớ tờ giấy đó. Có thể tôi không đổi được cả hệ thống, nhưng tôi đổi được đoạn mã của mình."],
      ["card"],
      ["@", "04:00"],
      ["host", "Bốn giờ rồi. Hai người nói chuyện lâu, ly nào cũng nguội mà chẳng ai để ý. Trước khi về, mình xin góp một lời."],
      ["?", "Anh Tuấn khoác lại áo mưa. Minh gấp chiếc laptop. Mình chọn lời cuối.",
        ["Đằng sau mỗi con số là một người đang cố giữ nhà mình ấm. Hai người vừa nhắc nhau điều đó.", "tuan", "Cậu Minh, hứa với anh nhé, mỗi lần viết dòng mã nào, nhớ có người cầm lái ngoài mưa."],
        ["Hãy gửi dữ liệu thực địa của anh Tuấn lên cho nhóm sản phẩm, như một đề xuất có số liệu cụ thể.", "minh", "Sáng mai tôi làm bản đề xuất. Anh Tuấn gửi tôi danh sách điểm ngập nhé."],
        ["Mỉm cười gật đầu với hai người.", "tuan", "Em không nói thêm. Nhưng anh hiểu. Cảm ơn em."]],
      ["@", "04:20"],
      ["minh", "Cảm ơn chủ quán. Lần sau tôi sẽ mang theo dữ liệu thực địa thay vì lỗi cần gỡ."],
      ["host", "Anh đi cẩn thận. Cả hai đều nhớ ăn sáng nhé, mình biết hai người hay bỏ bữa."]
    ]
  },

  /* ========== ĐÊM 12 — ANH TUẤN & CÔ HOA ========== */
  {
    ch: 2, n: 5, t0: "20:30", icon: "🍲", title: "Bữa Cơm Giá Gạo Tăng",
    guests: ["hoa", "tuan"], end: "duo:tuan_hoa",
    intro: [
      "Đêm thứ năm của tuần thứ hai, và là buổi tối sớm nhất từ khi quán mở. Giá gạo lại lên, giá dầu ăn cũng vậy. Ở chợ cuối phố, người ta đếm từng quả trứng.",
      "Thỏ Con bày ra một nồi cháo nhỏ trên bếp than, để dành cho những ai chưa kịp ăn tối."
    ],
    steps: [
      ["@", "20:45"],
      ["+", "tuan"],
      ["tuan", {
        h: "Chào Thỏ Con! Anh ghé sớm cho ấm bụng trước chuyến hàng. Anh phỏng vấn ở xưởng xe điện xong rồi, họ bảo chờ hai tuần.",
        m: "Chào Thỏ Con. Anh ghé sớm một chút. Anh nghĩ về cái bản đồ tài xế của cậu Minh mãi, nhắn tin cho anh em rồi, hơn hai chục người đồng ý.",
        s: "Chào Thỏ Con. Anh ghé sớm. Lâu lắm anh mới ăn một bữa tối có người ngồi cùng.",
        d: "Chào Thỏ Con. Anh ghé ăn chút gì trước chuyến hàng, tuần này chạy mà thấy nặng nề."
      }],
      ["host", "Anh Tuấn ngồi đi. Có cháo nóng trên bếp, mình múc một bát nhé."],
      ["@", "21:10"],
      ["+", "hoa"],
      ["hoa", {
        h: "Chào hai đứa. Cô nấu dư nồi canh, mang qua cho chủ quán. Thằng con trai cô hôm nay ăn hết cả bát, cô mừng đến mức muốn kể cho ai đó nghe.",
        m: "Chào hai đứa. Cô mang tới ít canh. Cô đang nhờ thằng con chỉ cô lập bảng tính, hai mẹ con ngồi cạnh nhau cả tối. Chuyện nhỏ thôi mà cô nhớ.",
        s: "Chào hai đứa. Cô mang tới ít canh. Cô nghĩ nhiều về cái đêm ngồi yên ấy, nên muốn tới ngồi thêm.",
        d: "Chào hai đứa. Cô mang tới ít canh. Cô nấu nhiều quá, mà ở nhà chẳng ai ăn cùng."
      }],
      ["host", "Cô Hoa, đây là anh Tuấn, tài xế đêm. Anh Tuấn, đây là cô Hoa, kế toán, người mẹ nấu canh ngon nhất khu này."],
      ["tuan", "Canh của cô thơm quá. Hai đứa nhỏ nhà anh mà ngửi được, chắc chúng nó chạy theo cô luôn."],
      ["hoa", "Vậy cháu mang về cho hai đứa một hộp. Cô thấy cháu hơi gầy. Nuôi con một mình khó lắm đúng không?"],
      ["tuan", "Dạ, cô. Vợ cháu mất đã ba năm. Lúc ấy cháu mới làm cái đêm cuối ở xưởng. Từ đó chạy giao hàng nuôi hai đứa."],
      ["@", "21:40"],
      ["host", "Mình đặt hộp canh vào khay giữ nhiệt, lặng lẽ nghe hai người."],
      ["hoa", "Cô xin lỗi cháu. Cô hỏi bất ngờ quá. Cô cũng một mình, chồng cô đi từ khi thằng nhỏ học lớp mười."],
      ["?", "Hai người cùng gánh một nhà một mình. Mình rót thêm nước vào hai ly.",
        ["Anh Tuấn và cô Hoa đều biết cái mệt của việc nấu cơm một mình. Hôm nay, hai người ngồi chung một bữa.", "hoa", "Cháu nói đúng. Hôm nay cô ngồi ăn cùng người, ngon hẳn."],
        ["Nếu hai người trao đổi công thức rẻ mà đủ chất, tiền chợ của cả hai nhà sẽ nhẹ bớt giữa lúc giá cả đang tăng.", "tuan", "Cô dạy cháu mấy món rẻ mà ngon đi. Hai đứa nhỏ nhà cháu kén ăn lắm, cháu cần mẹo."],
        ["Múc thêm một bát cháo cho mỗi người, ngồi nghe nồi nước sôi lục bục.", "hoa", "Chủ quán không nói gì mà làm cô thấy mình được chăm. Lạ thật."]],
      ["@", "22:10"],
      ["brew", "tuan", "Cho anh một ly ấm bụng, đậm đà, có chút cay nồng với ngọt hậu nhé.", "Anh Tuấn nhấp một ngụm, gật gù: vị ấm cay này làm anh nhớ hơi ấm trong bếp nhà mình hồi còn đủ ba người lớn."],
      ["@", "22:30"],
      ["brew", "hoa", "Cô xin một tách dịu, ngọt thanh, thoảng hương hoa, để mai còn ngủ được.", "Cô Hoa nâng tách bằng hai tay: ngọt thanh và dịu làm lòng cô lắng xuống."],
      ["@", "22:55"],
      ["hoa", "Cháu Tuấn này, thứ Bảy này hai đứa nhỏ qua nhà cô được không? Thằng con cô sẽ dẫn chúng nó đi chơi, còn cô nấu cơm cho cháu ngồi nghỉ."],
      ["tuan", "Cháu cảm ơn cô. Lâu lắm rồi cháu mới nghe lời mời như vậy."],
      ["card"],
      ["@", "23:40"],
      ["host", "Mười một giờ bốn mươi. Hai người ngồi lâu, nồi cháo đã cạn. Trước khi về, mình xin góp một lời."],
      ["?", "Cô Hoa gói thêm hộp canh cho hai đứa nhỏ. Mình chọn lời kết.",
        ["Gánh một nhà không dễ, nhưng đêm nay hai người đã không gánh một mình. Mình mong điều đó còn lặp lại.", "tuan", "Cảm ơn em. Cháu sẽ mang hai đứa qua nhà cô thứ Bảy."],
        ["Hai người có thể lập một bữa cơm chung mỗi cuối tuần cho những gia đình chạy đêm. Vừa tiết kiệm, vừa có người bên cạnh.", "hoa", "Bữa cơm chung à? Cô nấu, cháu Tuấn rủ anh em chạy đêm tới. Hay lắm."],
        ["Mỉm cười nhìn hai người, rồi tiễn ra tận cửa.", "hoa", "Cháu tiễn cô tận cửa à? Cô cảm ơn nhé, cô nhớ."]],
      ["@", "00:00"],
      ["tuan", "Cảm ơn Thỏ Con. Cho cháu gửi lời cảm ơn thêm một lần nữa nhé."],
      ["host", "Anh cô đi cẩn thận. Hộp canh còn nóng, đừng để đổ."]
    ]
  },

  /* ========== ĐÊM 13 — CHỊ LINH & BÁC AN ========== */
  {
    ch: 2, n: 6, t0: "22:30", icon: "✒️", title: "Cuộc Đối Thoại Giữa Hai Cây Bút",
    guests: ["linh", "an"], end: "duo:linh_an",
    intro: [
      "Đêm thứ sáu của tuần thứ hai. Trung tâm thương mại mới khai trương ngay chỗ hiệu sách cũ. Biển quảng cáo điện tử chiếu sáng cả con phố, còn cuốn sách cuối cùng của hiệu cũ đã được đóng thùng.",
      "Thỏ Con kê hai chiếc ghế cạnh kệ sách ở góc quán. Kệ giờ đã có sáu cuốn, tất cả đều do bác An mang tới."
    ],
    steps: [
      ["@", "22:45"],
      ["+", "an"],
      ["an", {
        h: "Chào cháu. Bác đem thêm hai cuốn nữa. Hôm đó cháu nói về những hạt giống bác đã gieo, bác về nghĩ mãi, thấy nhẹ cả lòng.",
        m: "Chào cháu. Bác có tin vui: nhóm đọc chậm của bác giờ đã có năm người. Đều là người trẻ, cháu có tin không?",
        s: "Chào cháu. Bác nhớ cái im lặng của cháu bên cửa sổ. Bác muốn ngồi lại chỗ ấy.",
        d: "Chào cháu. Bác lại tới. Hiệu sách cũ đóng cửa rồi, bác chẳng còn chỗ nào để ghé."
      }],
      ["host", "Bác An ngồi cạnh kệ sách ạ. Kệ cũng chờ bác cả tuần rồi."],
      ["@", "23:10"],
      ["+", "linh"],
      ["linh", {
        h: "Chào em, chào bác. Chị mang bản thảo tới. Hôm trước em tin chị, nên chị tin lại bản thảo của mình.",
        m: "Chào em, chào bác. Chị vừa nhận thư trả lời của nhà xuất bản độc lập. Họ chưa nhận, nhưng khen văn chị có hồn.",
        s: "Chào em, chào bác. Chị nhớ cái đêm yên tĩnh ấy lắm. Mong đêm nay cũng bình yên như thế.",
        d: "Chào em, chào bác. Chị mang bản thảo tới, dù chị vẫn chưa dám đưa ai đọc."
      }],
      ["host", "Chị Linh, đây là bác An, cựu giáo viên dạy Văn bốn mươi năm. Bác An, đây là chị Linh, biên tập viên đang giữ một cuốn sổ đỏ."],
      ["an", "Biên tập viên à? Vậy là cháu cầm bút đỏ rồi. Bác chấm bài bằng bút đỏ bốn mươi năm đấy."],
      ["linh", "Dạ. Cháu cũng biên tập bằng bút đỏ, nhưng lâu rồi cháu không được đọc chậm một bài nào hết. Tòa soạn bắt cháu đọc sơ để kịp đăng."],
      ["@", "23:40"],
      ["an", "Cháu cho bác xem một đoạn trong sổ đi. Bác hứa không sửa."],
      ["linh", "Dạ… đây là đoạn cháu viết về mẹ, tối mưa hôm cháu mất việc cũ. (đưa cuốn sổ đỏ cho bác An, tay hơi run)"],
      ["an", "Bác đọc chậm nhé. (đọc rất lâu, rồi đặt sổ xuống) Cháu viết một câu: ‘Mẹ khâu áo bằng chỉ trắng mà chỉ nhớ màu xanh.’ Bác không sửa chữ nào cả."],
      ["?", "Một người đọc hết đời, một người viết hết lòng. Mình đẩy nhẹ ấm trà ra giữa hai người.",
        ["Bác An đọc bằng bốn mươi năm tình yêu chữ nghĩa. Chị Linh viết bằng cả nỗi nhớ. Hai người có thể cho nhau điều mà không công cụ nào cho được.", "linh", "Bác ơi, bác có thể làm người đọc đầu tiên cho cuốn sổ này không? Cháu muốn ai đó đọc chậm."],
        ["Nhóm đọc chậm của bác có thể làm buổi giới thiệu bản thảo chị Linh. Mười người đọc thật còn quý hơn mười ngàn lượt xem.", "an", "Một buổi đọc chậm bản thảo mới. Bác thích. Bác sẽ rủ cả nhóm tới quán này."],
        ["Đặt chén nước ấm cạnh cuốn sổ đỏ, ngồi im lặng cùng hai người.", "an", "Cháu để hai người đọc nhau. Khéo lắm, cháu chủ quán."]],
      ["@", "00:10"],
      ["brew", "linh", "Chị muốn thức uống chua ngọt dịu nhẹ, thơm như hương hoa, gợi hoài niệm một chút thôi.", "Chị Linh nhấp ngụm nhỏ: vị ngọt dịu này giống cảm giác khi có người đọc hết một trang mình viết."],
      ["@", "00:30"],
      ["brew", "an", "Bác cũng một ly hoài niệm, chua ngọt thanh tao, thoảng hoa nhẹ như chiều thu.", "Bác An nhấp một ngụm, khẽ gật đầu: vị này gợi bác nhớ những buổi chiều thu đọc thơ cho học trò nghe."],
      ["@", "00:55"],
      ["an", "Này cháu Linh, bác có một câu hỏi. Cháu viết cho mẹ, mà cháu đã đọc cho bà nghe chưa?"],
      ["linh", "Dạ chưa ạ. Mẹ cháu ở quê, mắt kém. Cháu sợ bà nghe xong lại khóc."],
      ["an", "Bà khóc cũng không sao. Học trò bác hay khóc khi nghe bài văn của chính mình. Khóc xong, chúng nó viết hay hơn."],
      ["card"],
      ["@", "01:40"],
      ["host", "Một giờ bốn mươi. Hai người ngồi đọc nhau lâu quá, đến mức ấm trà đã nguội. Trước khi về, mình xin góp một lời."],
      ["?", "Chị Linh ôm lại cuốn sổ đỏ. Bác An đặt tay lên kệ sách. Mình chọn lời kết.",
        ["Có những người đọc nhau bằng cả sự kiên nhẫn. Mình mong hai người còn đọc nhau nhiều đêm nữa.", "an", "Bác cảm ơn cháu. Cuối tuần này, bác sẽ đến đọc nốt phần còn lại của cuốn sổ."],
        ["Hai người có thể làm một buổi đọc chậm đầu tiên, ngay tại quán, cho những ai còn nhớ cách đọc một cuốn sách thật chậm.", "linh", "Chị đồng ý. Chị sẽ đọc to đoạn đầu cho mọi người nghe."],
        ["Mỉm cười nhìn cuốn sổ đỏ và kệ sách, không nói thêm.", "linh", "Em chẳng nói gì mà chị thấy mình được tin. Cảm ơn em."]],
      ["@", "02:00"],
      ["an", "Cảm ơn cháu, Thỏ Con. Cháu nhớ ăn uống đầy đủ. Bác thấy cháu có vẻ mệt."],
      ["host", "Dạ, cháu ổn mà bác. Bác và chị Linh về cẩn thận."]
    ]
  },

  /* ========== ĐÊM 14 — ĐÊM MẤT ĐIỆN (3 KHÁCH) ========== */
  {
    ch: 2, n: 7, t0: "23:00", icon: "🕯️", title: "Đêm Mất Điện Ở Cuối Hẻm",
    guests: ["vy", "tuan", "khang"], end: null,
    close: "Cả con hẻm mất điện, nhưng ánh nến trong quán lại làm mọi người ngồi gần nhau hơn. Và cũng lần đầu tiên, Thỏ Con để ai đó nhìn thấy mình yếu đi.",
    intro: [
      "Đêm cuối của tuần thứ hai. Điện lưới bị cắt luân phiên vì thiếu tải. Cả con hẻm tối om, chỉ còn vài ô cửa sổ le lói ánh nến. Ngoài kia, tin tức nói giá điện sẽ còn tăng nữa.",
      "Thỏ Con thắp mười hai ngọn nến trong quán. Tiệm Nước Nửa Đêm giờ giống một chiếc đèn lồng đặt giữa phố tối."
    ],
    steps: [
      ["@", "23:10"],
      ["host", "Điện cắt rồi. Mình thắp nến, bếp than vẫn cháy. Chắc lát nữa có ai đó cần tới đây."],
      ["@", "23:25"],
      ["+", "tuan"],
      ["tuan", "Chủ quán! Điện cắt hết cả khu, ứng dụng giao hàng cũng treo luôn. Anh dắt xe vào hiên, xin ngồi nhờ chút."],
      ["host", "Anh Tuấn vào đi. Có nến và nước ấm đây."],
      ["@", "23:40"],
      ["+", "khang"],
      ["khang", "Thỏ Con ơi, xưởng anh mất điện, máy cắt da dừng hết. Anh đóng cửa sớm. Thấy ánh nến trong quán, anh vào luôn."],
      ["@", "23:55"],
      ["+", "vy"],
      ["vy", "Thỏ Con! Em đi phỏng vấn người bán hàng rong, mất điện đột ngột, em chạy về hướng có ánh sáng. Ơ, quán đầy người này!"],
      ["host", "Vy, anh Khang, anh Tuấn. Ba người ngồi cạnh nhau đi. Đêm nay quán sáng bằng nến thôi."],
      ["vy", "Em cầm máy ghi âm, nhưng pin còn mười phần trăm. Em ghi vài câu thôi nhé. Mọi người kể xem, mất điện thì sao?"],
      ["tuan", "Mất điện thì chạy bằng đèn pin. Nhưng anh lo cho bình sữa của hai đứa nhỏ, không biết bên nhà có nước nóng không."],
      ["khang", "Máy cắt da dừng thì anh cắt bằng tay. Dao tay anh học từ năm mười chín tuổi, thì lúc này lại cần tới."],
      ["@", "00:20"],
      ["?", "Ba người lạ ngồi quanh ánh nến. Mình đặt một ngọn nến giữa bàn.",
        ["Điện có thể mất, nhưng những điều ba người đang nhớ đến thì không. Mình thấy ánh sáng nhất vào những lúc như thế này.", "vy", "Cháu ghi lại câu này. Cháu sẽ đặt tên bài phóng sự là ‘Ánh nến’."],
        ["Nếu cả khu cùng chia sẻ một kế hoạch ứng phó mất điện, như pin sạc chung và bếp than dùng chung, ai cũng nhẹ gánh hơn.", "khang", "Chia sẻ à? Anh có hai bếp than ở xưởng, mang ra khu phố được. Anh em thợ chắc cũng sẵn lòng."],
        ["Châm thêm một ngọn nến, ngồi yên cạnh ba người.", "tuan", "Em không nói gì. Mà anh thấy ba người mình đỡ cô đơn. Ngồi quanh nến lạ thật, nó ấm hơn đèn điện."]],
      ["@", "00:50"],
      ["brew", "vy", "Em cần một ly tỉnh táo, chua dịu của trái cây, the mát đầu lưỡi, để còn gõ nốt ghi chú dưới ánh nến.", "Vy nhấp ngụm đầu: vị thanh tỉnh này làm em quên mất trời đang tối."],
      ["@", "01:10"],
      ["brew", "tuan", "Cho anh ly ấm bụng, đậm đà, có chút cay nồng với ngọt hậu nhé. Đêm nay lạnh quá.", "Anh Tuấn uống một hơi, gật gù: ấm thật, trời tối mà lòng anh sáng."],
      ["@", "01:30"],
      ["brew", "khang", "Còn anh thì ly đậm, ấm trầm, hậu cay ấm của gia vị, thoảng mùi gỗ với sáp ong.", "Anh Khang nhấp ngụm, khẽ gật đầu: cái vị này hợp lắm với ánh nến."],
      ["@", "01:55"],
      ["host", "(ho, ho dồn dập, tay chống vào quầy) Xin… xin lỗi, mình… mình ổn."],
      ["tuan", "Thỏ Con! Em ngồi xuống đi. Em ho như vậy từ đầu tuần rồi, anh nghe thấy."],
      ["vy", "Em có sao không? Mặt em hơi tái. Để em lấy nước cho em."],
      ["khang", "Ngồi xuống đi em. Bếp than anh trông giúp, nước anh pha giúp. Em nghỉ đi."],
      ["host", "Mình chỉ hơi mệt thôi. Mấy tuần nay hay vậy. Đừng để ý. Có lẽ mình nên đi khám, nhưng quán… quán cần có người trông."],
      ["card"],
      ["@", "02:40"],
      ["host", "Hai giờ bốn mươi. Điện vẫn chưa có lại, nhưng ba người vẫn ngồi cạnh nhau. Trước khi mọi người về, mình có lời này."],
      ["?", "Ba người nhìn mình, ánh nến lung linh trên mặt bàn gỗ. Mình chọn lời cuối.",
        ["Cảm ơn mọi người đã ở lại đêm nay. Có những lúc mình mới biết mình cần người bên cạnh đến thế nào.", "tuan", "Em nghỉ ngơi đi. Tuần sau anh ghé sớm, anh pha nước giúp em."],
        ["Nếu mọi người cùng chia ca ghé quán, bếp than và ấm nước luôn có người trông, và mình cũng có thời gian đi khám.", "vy", "Em xin ca thứ Tư! Em không biết pha nước, nhưng em biết lau quầy và trông bếp."],
        ["Gật đầu thật chậm, nắm nhẹ tay áo ai đó đang ngồi cạnh.", "khang", "Em không cần nói thêm. Anh em mình hiểu mà."]],
      ["@", "03:10"],
      ["vy", "Thỏ Con, đi khám nhé. Chủ nhật này em rảnh, em đi cùng."],
      ["host", "Mình cảm ơn. Mình sẽ nghĩ… Giờ mọi người về nghỉ đi, điện chắc sắp có lại rồi."],
      ["sys", "Điện sáng lại lúc ba giờ rưỡi. Ba người rời quán, Thỏ Con ngồi một mình dưới ngọn đèn vừa bật. Chiếc đồng hồ gỗ nhích sang ba giờ rưỡi, và lần đầu tiên, Thỏ Con ngồi lâu hơn thường lệ."]
    ]
  }
];
