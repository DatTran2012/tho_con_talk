"use strict";

/* Gộp 4 chương thành STORY_NIGHTS (28 đêm) và tạo cảnh mở đầu cho từng đêm. Phải nạp trước js/03-state.js. */
const STORY_NIGHTS = [...STORY_CH1, ...STORY_CH2, ...STORY_CH3, ...STORY_CH4];


/* -----------------------------------------------------------------------
   BỔ SUNG KỊCH BẢN (chèn khi nạp, không sửa từng chương):
   1) Chi tiết báo trước cho Cánh Cửa Thứ Hai: tờ giấy gấp tư, bàn tay run, thẻ da, mũ len... (không nói ra bệnh)
   2) Hai cảnh khách phản ứng khác đi: nói thẳng điều khó nghe / không muốn nghe "rồi sẽ ổn"
   Vị trí: {end:true} cuối đêm | {beforeLastAt:true} trước mốc giờ cuối | {after:"đầu câu"} sau câu thoại có đầu câu này
------------------------------------------------------------------------ */
/* LỜI THẬT: khi bạn pha cho khách một ly hoàn hảo, họ nói thêm một điều mà ly thường không nghe được.
   Mỗi vị khách có 1 lời thật cho mỗi chương (4 chương), chỉ nghe một lần. */
const GUEST_TRUTHS = {
  "vy": [
    "Thật ra em chưa dám nói với ai: em sợ mình viết dở, và sợ hơn nữa là bị người ta nhận ra điều đó.",
    "Từ hôm nói chuyện với chị, em tập ghi âm cả những câu mình không dám nói to. Chị là người đầu tiên em cho nghe.",
    "Có hôm em ngồi ngoài cửa quán gần mười phút mới vào. Em sợ chị hỏi han em, còn em thì chẳng hỏi han lại chị.",
    "Em để ý chị chưa bao giờ ghi âm giọng của chính mình. Nếu một ngày chị muốn kể, em xin được giữ máy ghi âm lại."
  ],
  "minh": [
    "Tôi nói với ai cũng là tôi ổn. Chú vịt này là thứ duy nhất không bắt tôi giả vờ.",
    "Tôi từng tắt hết thông báo ba ngày để thử cảm giác không ai cần mình. Thú vị, nhưng không dễ chịu.",
    "Một hệ thống chạy được không có nghĩa là người dùng ổn. Chủ quán cũng vậy, phải không?",
    "Tôi thấy cách chủ quán liếc đồng hồ lúc gần sáng. Nếu có việc cần nhờ, đừng đợi đến khi nó thành sự cố."
  ],
  "linh": [
    "Chị cầm bút đỏ không phải vì thích sửa. Chị sợ nếu buông ra, mình sẽ chẳng còn gì để nắm.",
    "Em biết không, chị chưa từng đọc to văn của mình cho ai nghe. Em là người đầu tiên chị dám thử.",
    "Chị học cách không hỏi những điều người ta chưa muốn kể. Nhưng không hỏi không có nghĩa là không thương.",
    "Nhân vật chủ quán trong sổ của chị, chị viết kết cho cô ấy rồi: cuối cùng có người hỏi cô ấy có ổn không, và cô ấy dám trả lời thật."
  ],
  "tuan": [
    "Anh chạy xe đêm vì không muốn hai đứa nhỏ thấy bố đếm tiền. Nói ra nghe ngốc quá.",
    "Có đêm anh dừng xe ở đầu hẻm, ngồi mười phút chỉ để nghe tiếng mưa trước khi vào quán. Chỗ này đỡ cô đơn.",
    "Anh tính được tiền nhà, tiền học, tiền xăng. Mà chẳng ai tính cho anh một bữa cơm ấm.",
    "Anh thấy em gầy đi nhiều. Anh không hỏi vì sợ em phải trả lời. Nhưng anh có xe, và anh có thời gian."
  ],
  "khang": [
    "Anh chưa từng nói với thợ rằng anh sợ mất xưởng. Ông chủ mà sợ thì ai chống lưng cho ai?",
    "Anh khâu da giỏi vì quen giữ chặt mọi thứ. Học buông ra khó hơn học khâu nhiều.",
    "Em nói với anh rất đúng, rất nhiều, mà chẳng bao giờ nói điều gì của em.",
    "Em cho anh nhiều quá rồi. Lần này anh muốn làm gì đó cho em, dù chỉ là một thứ nhỏ bằng bàn tay."
  ],
  "hoa": [
    "Cô giấu con trai vài chuyện, chuyện nào cũng vì thương nó. Mà thương kiểu giấu thì mệt lắm.",
    "Cô nấu hơi nhiều mỗi tối, cứ như vẫn còn người đợi cơm. Ở quán này có người ăn là cô vui rồi.",
    "Cô đếm sổ cả đời mà không đếm nổi những đêm mình ngủ ngon. Từ hôm quen cháu, cô ngủ được nhiều hơn.",
    "Cô biết nhìn người ta khi họ cố cười. Cháu cười giống thế. Cô không hỏi, cô chỉ nấu cho cháu."
  ],
  "an": [
    "Bác hay nói bác ổn. Thật ra bác chỉ quen nói ổn, như quen ký tên.",
    "Bác dạy học trò viết thư cả đời mà chưa viết cho người bác thương lá thư nào. Có lẽ bác sợ nó thành thật.",
    "Bác giấu mấy toa thuốc dưới tập thơ. Bác không sợ thuốc, bác sợ ánh mắt thương hại. Cháu không nhìn bác như thế, bác biết ơn.",
    "Người cứ lo cho tất cả mà không cho phép mình được lo cho, thì ngày nào đó chính người ấy sẽ cần được chăm lại. Bác chỉ nói thế thôi."
  ]
};

const STORY_EXTRAS = [
  /* —— hạt giống —— */
  { night: 1, end: true, steps: [
    ["sys", "Sau khi Vy đi, Bánh Quy nhảy lên quầy, kéo một tờ giấy gấp tư lòi ra khỏi túi tạp dề của Thỏ Con. Thỏ Con nhẹ nhàng nhét nó lại, như chưa từng có gì."]
  ] },
  { night: 5, beforeLastAt: true, steps: [
    ["khang", "Anh đo cổ tay em để khâu thử cái vòng cho Bánh Quy, mà thấy em gầy đi nhiều quá."],
    ["host", "Áo em rộng thôi anh. Đừng lo."]
  ] },
  { night: 11, beforeLastAt: true, steps: [
    ["sys", "Lúc rót nước, tay Thỏ Con run nhẹ. Thỏ Con đặt ấm xuống, nắm bàn tay lại một lát rồi mới rót tiếp. Không ai nói gì."]
  ] },
  { night: 17, beforeLastAt: true, steps: [
    ["sys", "Bánh Quy tha tờ giấy gấp tư lăn đến chân chị Linh. Thỏ Con vội nhặt: “Hóa đơn thôi chị.” Chị Linh kịp thấy con dấu đỏ ở góc giấy, và quyết định không hỏi."]
  ] },
  { night: 23, beforeLastAt: true, steps: [
    ["minh", "Tôi để ý một điều: hệ thống nào cũng cần người báo lỗi. Chỉ có chủ quán là chưa bao giờ ghi lỗi của chính mình vào sổ."]
  ] },
  { night: 24, beforeLastAt: true, steps: [
    ["linh", "Chị vừa viết thêm một nhân vật cho cuốn sổ: một người chủ quán nhỏ, đêm nào cũng hỏi han người khác mà chẳng bao giờ kể về mình. Chị chưa nghĩ ra kết cho cô ấy."]
  ] },
  { night: 25, beforeLastAt: true, steps: [
    ["khang", "Anh khâu một thẻ da nhỏ để đánh dấu trang. Chưa biết tặng ai. Em giữ giùm anh đi."],
    ["hoa", "Cô đang đan dở một chiếc mũ len. Cô đo theo cỡ đầu một người quen, cháu đừng hỏi là ai."]
  ] },
  { night: 26, beforeLastAt: true, steps: [
    ["tuan", "Sáng nào anh cũng đi ngang chỗ em hay rẽ vào lúc bảy giờ. Anh thấy, nhưng anh không hỏi. Khi nào em muốn nói, anh có xe."]
  ] },
  { night: 27, beforeLastAt: true, steps: [
    ["an", "Bác chấm bài cả đời, bác biết khi nào một học trò sắp nói điều khó nói. Bác chờ, không vội đâu cháu."]
  ] },


  /* —— HỘP THƯ KHUYA: radio đọc thư giấu tên của các vị khách (mỗi người một lá). Lá cuối ở đêm 28 là thư của người gác đêm. —— */
  { night: 1, start: true, steps: [
    ["sys", "📻 Đài FM Nửa Đêm — Hộp Thư Khuya: “Tôi khâu da hai mươi năm, đường chỉ nào cũng chặt. Tháng nào tôi cũng nói với thợ là ổn, rồi về nằm tính xem tháng sau còn lấy gì trả lương. Tôi gửi cho radio vì radio không hỏi lại.” — Một người giữ xưởng."]
  ] },
  { night: 2, start: true, steps: [
    ["sys", "📻 Hộp Thư Khuya: “Tôi chạy xe đêm đã ba năm. Có hôm dừng ở đầu một con hẻm, tắt máy mười phút chỉ để nghe mưa rơi trên mui xe. Ở nhà hai đứa nhỏ tưởng bố đang giao hàng. Đúng là bố đang giao hàng, giao cho mình mười phút yên lặng.” — Một tài xế."]
  ] },
  { night: 3, start: true, steps: [
    ["sys", "📻 Hộp Thư Khuya: “Tôi nấu cơm cho hai người suốt nhiều năm, giờ chỉ còn một. Tay vẫn bốc gạo hai phần, như tay nhớ hơn đầu. Tối nào tôi cũng dọn thừa một bộ chén đũa, rồi cất đi trước khi ai thấy.” — Một người mẹ."]
  ] },
  { night: 4, start: true, steps: [
    ["sys", "📻 Hộp Thư Khuya: “Tôi dạy học bốn mươi năm, sửa lỗi chính tả cho hàng ngàn người. Có một lá thư tôi nháp mười lần mà chưa dám gửi, vì sợ nó thành thật. Học trò nào của tôi cũng viết thư giỏi hơn tôi.” — Một thầy giáo về hưu."]
  ] },
  { night: 5, start: true, steps: [
    ["sys", "📻 Hộp Thư Khuya: “Tôi cầm bút đỏ gạch lỗi cho người khác mười lăm năm. Cuốn sổ riêng của tôi thì để trống ba trang cuối, vì tôi chưa biết nên viết nó bằng giọng của ai.” — Một biên tập viên."]
  ] },
  { night: 6, start: true, steps: [
    ["sys", "📻 Hộp Thư Khuya: “Tuần trước tôi đếm: tôi đã nói ‘không sao’ bốn mươi mốt lần, và không lần nào nó là thật. Nếu có cách tự động hóa việc nói thật, tôi sẽ là người đầu tiên cài.” — Một kỹ sư."]
  ] },
  { night: 7, start: true, steps: [
    ["sys", "📻 Hộp Thư Khuya: “Em ghi âm giọng của rất nhiều người, nhưng chưa dám bấm nút ghi âm giọng của chính mình. Em sợ nghe lại sẽ thấy mình nói chưa hay. Ai nghe thư này, xin nói giùm em rằng lần đầu nghe giọng thật của mình luôn là lần khó nhất.” — Một cô bé làm báo."]
  ] },
  { night: 28, beforeLastAt: true, steps: [
    ["sys", "📻 Radio bật lên đúng lúc trời hửng sáng, đọc lá thư cuối của Hộp Thư Khuya: “Đêm nào tôi cũng pha nước cho người khác, và tôi tự hào về điều đó. Gần đây tôi chỉ hay nghĩ: nếu một đêm mình ngồi xuống, ai sẽ pha cho mình? Tôi chưa trả lời được. Tôi gửi vào hộp thư này để biết có ai nghe không.” — Một người gác đêm."],
    ["sys", "Không ai nói gì. Bảy chiếc ghế quay về phía quầy, và chú mèo Bánh Quy nhảy lên, ngồi gọn trong lòng Thỏ Con."]
  ] },

  /* —— người viết thư lỡ miệng (nghe tiếng radio hôm trước) —— */
  { night: 4, beforeLastAt: true, steps: [
    ["tuan", "Hôm qua anh nghe radio, có ông tài xế nào đó dừng xe nghe mưa. Nghề này ai cũng có chỗ dừng xe riêng, em nhỉ."]
  ] },
  { night: 5, beforeLastAt: true, steps: [
    ["khang", "Anh nghe cái thư trên đài hôm qua mà chạnh lòng. Ai làm xưởng chắc cũng nằm tính y như thế."]
  ] },
  { night: 6, beforeLastAt: true, steps: [
    ["hoa", "Hôm qua radio đọc thư của một bà mẹ, nghe cứ như ai viết giùm cô. Thôi, cô không kể nữa, cháu rót thêm trà cho cô."]
  ] },
  { night: 7, beforeLastAt: true, steps: [
    ["an", "Đài đọc thư của một thầy giáo về hưu đêm kia. Nét chữ nào mà bác chẳng thấy quen, như học trò cũ gửi cho thầy."]
  ] },
  { night: 8, beforeLastAt: true, steps: [
    ["vy", "Chị ơi, em nghe radio thấy có bạn nhỏ làm báo giống em quá. Chắc em thử bấm nút ghi âm giọng mình xem sao."],
    ["host", "Bấm thử đi em. Lần đầu nghe giọng thật của mình bao giờ cũng khó nhất."]
  ] },
  { night: 9, beforeLastAt: true, steps: [
    ["minh", "Hộp Thư Khuya có người đếm đúng một con số cụ thể. Tôi thích điều đó, vì con số thì không biết nói dối."]
  ] },
  { night: 10, beforeLastAt: true, steps: [
    ["linh", "Chị nghe đài, có biên tập viên nào để trống ba trang cuối. Chị ghen với người dám gửi thư đó đi."]
  ] },


  /* —— chuyện đời thường (vừa buồn cười vừa nặng): nỗi sợ thời đại nói bằng giọng quen thuộc —— */
  { night: 10, beforeLastAt: true, steps: [
    ["khang", "Hôm qua khách đặt ví trả giá còn một nửa, bảo bên kia bán rẻ hơn. Anh nói bên kia da ép, bên anh da thật. Nó hỏi: ‘Da thật khác gì da ép ạ?’ Anh đứng im nửa phút, không biết nên cười hay khóc."],
    ["linh", "Chị cũng vừa có bạn đọc nhắn: ‘Sách giấy đắt quá, em chờ bản PDF lậu.’ Chị trả lời: ‘Bản lậu có ba lỗi chính tả, em tìm giúp chị nhé.’ Nó chưa trả lời."]
  ] },
  { night: 11, beforeLastAt: true, steps: [
    ["minh", "Ba mẹ tôi khoe cả xóm là con làm bên AI. Xóm hỏi AI là chi, ba tôi bảo: ‘Cái máy nó làm hết, nên con tôi khỏi lo.’ Tôi chưa dám nói cái máy ấy có thể làm hết cả phần của tôi."],
    ["tuan", "Ba mẹ anh khoe con làm ‘giao hàng công nghệ cao’ đấy. Công nghệ cao tới mức tuần rồi app trừ điểm anh vì dừng xe tránh nước ngập."]
  ] },
  { night: 12, beforeLastAt: true, steps: [
    ["hoa", "Cô nấu canh mà lỡ nấu hai nồi, sợ thiếu. Thằng con gọi từ xa bảo mẹ nấu ít thôi, cô ừ ừ, rồi quay vô nêm thêm."],
    ["tuan", "Cô để phần anh một nồi. Hôm qua con bé hỏi anh: ‘Bố đi hoài mà sao không giàu?’ Anh bảo giàu chứ, giàu mùi xăng."],
    ["hoa", "(cười, rồi thôi) Con nít hỏi gì cũng trúng chỗ đau nhất. Thôi, ăn đi cháu."]
  ] },
  { night: 13, beforeLastAt: true, steps: [
    ["an", "Cháu gái bác rủ sang ở cùng cho tiện. Bác bảo bác ở đây cho tiện sách. Thật ra nhà nó chật, mà lòng bác còn chật hơn."],
    ["linh", "Sách chiếm chỗ, nhưng chắc cô đơn còn chiếm nhiều hơn, bác nhỉ. Nhưng bác ở đây thì quán còn có người đọc thơ."]
  ] },
  { night: 15, beforeLastAt: true, steps: [
    ["vy", "Nhóm Zalo gia đình chuyển cho em một tin sốc. Em kiểm chứng, tin giả. Em gửi lại. Bà ngoại thả tim, khen ‘cháu giỏi’, rồi chuyển tiếp tin khác ngay."],
    ["minh", "Đó là thuật toán lan truyền lâu đời nhất, và chưa ai vá được: bà ngoại."]
  ] },
  { night: 18, beforeLastAt: true, steps: [
    ["an", "Bác chia thuốc ra hộp nhựa theo từng ngày, bác gọi nó là thời khóa biểu. Học trò cũ tới chơi thấy, tưởng bác sắp thi."],
    ["host", "Bác thi môn gì thế ạ?"],
    ["an", "Môn kiên nhẫn. Điểm chuẩn năm nào cũng cao hơn năm trước."]
  ] },


  /* —— CHỖ THỞ: mỗi đêm một chi tiết vặt vui vui đặt trước mốc cuối, để chuyện nặng có chỗ lắng xuống —— */
  { night: 1, beforeLastAt: true, steps: [
    ["sys", "Bánh Quy nhảy lên quầy, ngồi đúng lên dòng ‘Hết đá’ trong sổ ghi đơn. Thỏ Con đành sửa thành ‘Hết đá, còn mèo’."]
  ] },
  { night: 2, beforeLastAt: true, steps: [
    ["sys", "Chú vịt cao su lăn khỏi bàn, rơi vào ly đá. Nó nổi lềnh bềnh, trông bình thản hơn hẳn chủ của nó."]
  ] },
  { night: 3, beforeLastAt: true, steps: [
    ["sys", "Radio lạc sóng giữa bản tin, chen vào một bài cải lương."],
    ["linh", "Ít ra bài này không do máy viết. (gật gù) Mà hát nhỏ lại đi, nó giành lời của chị."]
  ] },
  { night: 4, beforeLastAt: true, steps: [
    ["tuan", "Anh đi bảy cây số mà mưa chui vào tận… ba lô. Giờ cái hộp cơm của anh gần thành canh."]
  ] },
  { night: 5, beforeLastAt: true, steps: [
    ["khang", "Mà sao trà quán có mùi sáp ong thế nhỉ?"],
    ["host", "(chỉ vào tay áo anh) Mùi từ đó đó anh."]
  ] },
  { night: 6, beforeLastAt: true, steps: [
    ["hoa", "Cô nướng dư hộp bánh gừng, cháu nhận giúp cô, đem về cũng không ai ăn."],
    ["sys", "Bánh Quy nghe thấy chữ ‘bánh’, lập tức xuất hiện, ngồi nghiêm chỉnh như học trò ngoan."]
  ] },
  { night: 7, beforeLastAt: true, steps: [
    ["an", "Mấy cái tên ly nước trên bảng viết theo vần gì mà vui thế hả cháu?"],
    ["host", "Vần của cô chủ quán ạ."]
  ] },
  { night: 8, beforeLastAt: true, steps: [
    ["sys", "Chiếc máy ghi âm của Vy bấm nhầm, thu luôn tiếng bác An ho khẽ. Hai người nghe lại và cùng bật cười: bản ghi đầu tiên có thêm nhạc nền."]
  ] },
  { night: 9, beforeLastAt: true, steps: [
    ["sys", "Điện thoại Minh sáng lên tin nhắn của mẹ: ‘Con ăn cơm chưa?’ Anh nhìn nó như nhìn một lỗi hệ thống mà chưa ai viết tài liệu sửa."]
  ] },
  { night: 14, beforeLastAt: true, steps: [
    ["sys", "Trong bóng tối, ai đó quơ tay chạm vào chuông gió, nó kêu một tiếng. Cả quán cùng hét lên, rồi cùng bật cười trong ánh nến."]
  ] },
  { night: 17, beforeLastAt: true, steps: [
    ["sys", "Ba người nhường nhau bát cháo đầy cho tới lúc cháo nguội. Cuối cùng bát đầy thuộc về Bánh Quy, vì nó không biết nhường."]
  ] },
  { night: 19, beforeLastAt: true, steps: [
    ["sys", "Bánh Quy bước qua bàn phím máy tính của Minh, gõ ra một dòng ‘jjjjjjj’."],
    ["minh", "Đây là bản nháp tốt nhất tôi thấy trong tuần. Không lỗi logic nào."]
  ] },
  { night: 20, beforeLastAt: true, steps: [
    ["hoa", "Dòng chi phí này anh ghi ‘khác’ ba năm nay mà chưa bao giờ ghi khác cái gì."],
    ["khang", "(cười trừ) Khác… là khác thôi cô."]
  ] },
  { night: 21, beforeLastAt: true, steps: [
    ["sys", "Ba chiếc đèn lồng giấy treo lệch nhau. Cả ba người cùng chỉnh, mỗi người một hướng, và cuối cùng chúng lại lệch đúng như ban đầu."]
  ] },
  { night: 22, beforeLastAt: true, steps: [
    ["vy", "Em tính nhẩm rồi: nếu họ trả lương gấp ba, em sẽ mua cho chị cái ấm mới. Chị đừng nhìn cái ấm cũ như thế, nó nghe được đó."]
  ] },
  { night: 23, beforeLastAt: true, steps: [
    ["minh", "Tôi đã viết ba bản đề xuất. Bản một có chín trang, bản hai có một trang, bản ba chỉ có một câu. Chú vịt thích bản thứ ba."]
  ] },
  { night: 24, beforeLastAt: true, steps: [
    ["an", "Bác tập đọc ba trang này từ chiều, tập tới nỗi con mèo hàng xóm cũng thuộc."]
  ] },
  { night: 25, beforeLastAt: true, steps: [
    ["hoa", "Cô tính lại giá ví ba lần, lần nào ra số cũng khác. Cô nghĩ không phải cô sai, chắc là con số sợ cô."]
  ] },
  { night: 26, beforeLastAt: true, steps: [
    ["tuan", "Anh tập nói ‘Dạ em nhận việc’ trước gương ba lần, lần nào nhìn lên cũng thấy mình nghiêm mặt như đọc điếu văn."]
  ] },
  { night: 27, beforeLastAt: true, steps: [
    ["khang", "Anh viết xong thư thì thấy ghi nhầm nghề: anh viết ‘thợ may’."],
    ["an", "Cứ để vậy. Một năm nữa biết đâu anh đổi nghề thật, bác đọc lại sẽ thấy vui."]
  ] },
  { night: 28, beforeLastAt: true, steps: [
    ["sys", "Bánh Quy chọn đúng lúc ấy để làm đổ ly nước cuối cùng. Không ai nỡ mắng."],
    ["minh", "Tôi ghi vào sổ: sự cố hợp lý nhất của đêm nay."]
  ] },

  /* —— khách phản ứng khác đi —— */
  { night: 19, after: "Tôi tình cờ đọc được", steps: [
    ["linh", "(đặt cây bút đỏ xuống) Đọc trộm thì chị bỏ qua. Nhưng cái máy của anh đang dạy người ta rằng viết chậm là có lỗi."],
    ["minh", "Tôi nói thẳng nhé, chị Linh: chậm không phải điều đáng tự hào. Chị bám cây bút đỏ vì chị sợ bị thay thế, không phải vì chữ cần chậm."],
    ["linh", "(sững lại, giọng khô đi) Anh nói gì cơ?"],
    ["sys", "Chị Linh đứng dậy, đẩy ghế. Cả quán im phăng phắc. Chỉ còn tiếng mưa và tiếng ấm nước sắp sôi."],
    ["?", "Một người vừa nói quá thẳng, một người vừa bị chạm đúng chỗ đau. Mình phải chọn cách giữ cả hai ở lại.",
      ["Anh Minh nói thẳng, nhưng em biết anh ấy không cố ý làm chị đau. Chị ngồi lại nhé? Nước còn nóng.", "linh", "Chị không giận anh ấy. Chị giận vì anh ấy nói đúng một phần. (ngồi xuống thật chậm) Để chị nghe hết đã."],
      ["Anh Minh, anh đúng một phần. Nhưng người ta không đổi vì bị chỉ ra lỗi, họ đổi vì thấy an toàn. Anh thử nói lại được không?", "minh", "(thở ra) Xin lỗi chị Linh. Tôi quen nói như đọc log lỗi. Ý tôi là chị không cần chọn giữa chậm và nhanh. Chị chỉ cần luôn đứng tên."],
      ["Mình lặng lẽ đặt hai ly nước xuống, không bênh ai, để cả hai nghe tiếng mưa.", "linh", "(một lúc lâu sau, ngồi xuống) Xin lỗi anh Minh, chị hơi gắt. Nhưng anh cũng đừng nói như thể chị không biết điều đó."]]
  ] },
  { night: 20, after: "Cô Hoa, cảm ơn cô.", steps: [
    ["khang", "Thỏ Con này. Hôm nay đừng nói với anh câu ‘rồi sẽ ổn’ nữa. Anh nghe đủ rồi. Em nói câu đó với ai cũng trơn tru, vậy em có tin nó không?"],
    ["?", "Anh Khang không cần một lời an ủi quen thuộc. Anh ấy hỏi thật, và mình phải trả lời thật.",
      ["Có những đêm mình không tin. Nhưng mình vẫn muốn ngồi đây nói với anh.", "khang", "(im một lúc, gật) Câu đó thì anh nghe lọt. Cảm ơn em đã không nói trơn."],
      ["Vậy mình bỏ câu đó. Mình hỏi thẳng nhé: con số nào đang làm anh nghẹt thở nhất bây giờ?", "khang", "Cái dòng lương tháng sau. Cô Hoa đã gạch ra rồi, anh vẫn sợ. Hỏi thế này dễ trả lời hơn."],
      ["Mình không nói gì, chỉ rót thêm một ngụm trà vào ly còn dở của anh.", "khang", "(cười khẽ) Em im lặng giỏi hơn khối người nói. Nhưng một ngày nào đó, em cũng phải nói ra đấy."]]
  ] }
];

STORY_EXTRAS.forEach((ex) => {
  const night = STORY_NIGHTS[ex.night - 1];
  if (!night) return;
  const st = night.steps;
  let at = st.length;
  if (ex.start) {
    at = 0;
  } else if (ex.after) {
    const i = st.findIndex((x) => typeof x[1] === "string" && x[1].includes(ex.after) || (x[1] && typeof x[1] === "object" && !Array.isArray(x[1]) && x[1].d && x[1].d.includes(ex.after)));
    if (i >= 0) at = i + 1;
  } else if (ex.beforeLastAt) {
    for (let i = st.length - 1; i >= 0; i--) if (st[i][0] === "@") { at = i; break; }
  }
  st.splice(at, 0, ...ex.steps);
});

STORY_NIGHTS.forEach((s) => {
  const chapter = STORY_CHAPTERS[s.ch - 1];
  CUTSCENE_CATALOG.push({
    id: `story_${s.ch}_${s.n}`,
    icon: s.icon,
    location: `CHƯƠNG ${s.ch} • ${chapter.name.toUpperCase()} • ĐÊM ${s.n}`,
    title: s.title,
    caption: s.intro.join("\n\n"),
    pages: s.intro.map((text, i) => ({ icon: i === 0 ? s.icon : "🏮", text }))
  });
});
