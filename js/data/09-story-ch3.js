"use strict";

/* -----------------------------------------------------------------------
   CHƯƠNG 3 — HIỆN TẠI (Tuần 3, 7 đêm)
   Không còn mở đầu hay quay lại: đây là lúc mọi người đối diện hiện tại — công việc, tiền bạc,
   sức khỏe — và nhìn thấy Thỏ Con đang yếu đi.
------------------------------------------------------------------------ */
const STORY_CH3 = [
  /* ========== ĐÊM 15 — MINH & VY ========== */
  {
    ch: 3, n: 1, t0: "22:00", icon: "🎞️", title: "Tin Giả Nhìn Thật Như Thật",
    guests: ["minh", "vy"], end: null,
    close: "Một kỹ sư và một phóng viên cùng nhìn vào một đoạn video giả, và cùng chọn cách trả lời.",
    intro: [
      "Tuần thứ ba. Tin tức đêm qua: một đoạn video giả do máy tạo ra lan khắp mạng, khiến một cửa hàng nhỏ bị tẩy chay chỉ sau một đêm. Cuộc suy thoái đã kéo dài sang tháng thứ chín.",
      "Thỏ Con kê hai ghế cạnh nhau ở đầu quầy. Mấy hôm nay mình hay đứng dậy chậm hơn. Mình tự nhủ: chắc tại thức khuya."
    ],
    steps: [
      ["@", "22:15"],
      ["+", "vy"],
      ["vy", "Thỏ Con ơi, em đang điên đầu. Có đoạn video giả đang tố một tiệm bánh mì ở quận bên, nhìn y như thật. Chủ tiệm khóc suốt, sắp đóng cửa rồi."],
      ["host", "Vy ngồi xuống đã. Bạn có biết đoạn video đó giả bằng cách nào không?"],
      ["vy", "Em chỉ cảm thấy nó không đúng. Cái bóng đổ lệch, tiếng nói hơi đều. Nhưng em không có công cụ để chứng minh."],
      ["@", "22:40"],
      ["+", "minh"],
      ["minh", "Chào chủ quán. Chào cô… à, Vy phải không? Tôi nghe kể về loạt phóng sự của cô rồi."],
      ["vy", "Anh ơi, anh làm về AI đúng không? Anh giúp em được không? Em cần phân biệt đoạn video giả này."],
      ["minh", "Tôi cũng thấy đoạn đó. Thành thật mà nói, người viết ra loại công cụ ấy có phần trách nhiệm. Tôi nợ cô và chủ tiệm bánh mì một lời giải thích."],
      ["@", "23:05"],
      ["minh", "Cô thử phát lại thật chậm đoạn tay chủ tiệm. Máy thường vẽ sai khớp ngón. Và nhịp thở của người nói bị lệch với khẩu hình."],
      ["vy", "Đúng! Em thấy bàn tay có sáu ngón ở giây thứ mười một! Em đã xem mười lần mà không nhìn ra."],
      ["?", "Hai người đang tìm cách làm sự thật chạy nhanh hơn tin giả. Mình đẩy ấm trà ra giữa.",
        ["Một phóng viên có đôi mắt kiên nhẫn, một kỹ sư biết máy làm giả thế nào. Hai người ngồi cạnh nhau, tin giả khó sống lâu.", "vy", "Anh Minh, anh dạy em cách kiểm tra không? Em viết hướng dẫn cho người đọc luôn."],
        ["Hãy làm một loạt bài kiểm chứng ngắn, có hình minh họa, để ai cũng tự kiểm tra video giả được.", "minh", "Tôi sẽ viết công cụ nhỏ, mã nguồn mở. Cô viết bài. Chủ tiệm bánh mì cần được trả lại tên."],
        ["Rót thêm trà, lặng lẽ để hai người làm việc.", "minh", "Tôi biết chủ quán sẽ không hỏi tôi có làm hay không. Và vì thế tôi thấy mình phải làm."]],
      ["@", "23:30"],
      ["brew", "minh", "Cho tôi một ly đậm, đắng gọn, hậu có chút mặn dịu hoặc ấm cay để đầu bớt nóng.", "Minh thở ra: cái đắng này làm đầu gọn hẳn, tôi sẵn sàng viết mã cả đêm."],
      ["@", "23:50"],
      ["brew", "vy", "Em một ly tỉnh táo, chua dịu của trái cây, the mát đầu lưỡi, để còn viết nháp.", "Vy nhấp ngụm đầu, gõ liền tay: vị thanh này làm em quên cả buồn ngủ."],
      ["@", "00:30"],
      ["vy", "Bản nháp bài kiểm chứng xong rồi. Sáng mai em đăng, anh Minh gửi công cụ cho bạn đọc trước trưa nhé. Em mong chủ tiệm bánh mì sớm mở cửa lại."],
      ["minh", "Nếu dòng mã của tôi cứu được một tiệm bánh mì, đó sẽ là lần đầu tiên nó làm được việc như vậy."],
      ["card"],
      ["@", "01:15"],
      ["host", "Một giờ mười lăm. Mình đứng dậy hơi chậm. (ho khẽ) Xin lỗi, hai người cứ nói tiếp."],
      ["vy", "Thỏ Con, đi khám chưa? Chủ nhật em rủ chị rồi mà."],
      ["host", "Mình sắp đi. Chắc tuần này. Đừng lo."]
    ]
  },

  /* ========== ĐÊM 16 — CÔ HOA ========== */
  {
    ch: 3, n: 2, t0: "23:30", icon: "📉", title: "Bảng Lương Có Một Dòng Bị Gạch",
    guests: ["hoa"], end: null,
    close: "Cô Hoa nhận ra mình đã mạnh mẽ hơn chính nỗi sợ của mình.",
    intro: [
      "Đêm thứ hai của tuần thứ ba. Công ty tài chính của cô Hoa thông báo cắt giảm một phần ba nhân sự, vì tự động hóa và vì suy thoái. Danh sách chưa công bố, nhưng ai cũng đã đoán.",
      "Thỏ Con bày một ấm trà hoa cúc, ấm đã được hâm lại hai lần mà chưa có ai tới."
    ],
    steps: [
      ["@", "23:50"],
      ["+", "hoa"],
      ["hoa", {
        h: "Chào cháu. Cô hơi mệt. Tuần này cô thấy mình bớt sợ máy móc nhờ cháu nói hôm trước, mà giờ lại sợ chuyện khác.",
        m: "Chào cháu. Cô đã dùng được phần mềm mới nhờ thằng con chỉ. Nhưng hôm nay công ty lại báo một tin.",
        s: "Chào cháu. Cô thích ngồi đây lắm, vì cháu không hỏi dồn. Hôm nay cô cần chỗ như vậy.",
        d: "Chào cháu. Cô ngồi một lúc nhé. Công ty vừa báo tin, cô chưa biết nói với ai."
      }],
      ["host", "Cô cứ ngồi, chén trà vừa pha xong ạ. Tin gì thế cô?"],
      ["hoa", "Bộ phận kế toán cắt một phần ba người. Danh sách thứ Hai công bố. Cô bốn mươi bốn, thằng con còn học, tiền nhà cũng chưa trả hết."],
      ["hoa", "Cô nhìn giá gạo lên mỗi tuần, nhìn bảng lương nguyên vẹn mà lòng đứng ngồi không yên."],
      ["@", "00:20"],
      ["host", "Cô à, cháu hỏi thế này: ngoài con số, cô có thứ gì mà phần mềm kia không có?"],
      ["hoa", "Cô nhớ từng đồng nghiệp. Cô biết ai đang khó khăn, ai vừa có con nhỏ. Có lần cô che một khoản sai cho cô bé mới vào, để cô bé khỏi bị trừ lương."],
      ["?", "Mình đặt một chiếc khăn mỏng của quán lên vai cô Hoa, hỏi thật chậm.",
        ["Chuyện cô che lỗi cho cô bé là điều con số không ghi lại. Cô có nghĩ người trong công ty nhớ điều đó không?", "hoa", "Cháu nói làm cô nhớ ra. Cô bé ấy giờ là trưởng nhóm. Con bé từng bảo ‘cô Hoa là người duy nhất không nhìn em như một khoản chi’."],
        ["Cô có thể chuyển hướng sang tư vấn tài chính cho các tiệm nhỏ, những nơi cần người hiểu cả con số lẫn con người.", "hoa", "Tư vấn cho tiệm nhỏ à? Cô từng giúp tiệm bánh mì quen. Họ không có phần mềm, chỉ có cuốn sổ."],
        ["Châm thêm trà, ngồi cạnh cô nghe tiếng mưa.", "hoa", "Cháu chẳng nói gì mà cô thấy bớt sợ. Có những nỗi sợ chỉ cần có người ngồi nghe là nhỏ lại."]],
      ["@", "00:45"],
      ["sys", "Đêm nay là một đêm lắng nghe. Thỏ Con cất bình lắc đi, không đo, không canh giờ, chỉ để chiếc ấm nhỏ nhất lên bếp."],
      ["brew", "hoa", "Cháu đừng pha gì cầu kỳ. Cô chỉ cần một tách nước ấm cầm cho đỡ run, rồi cô ngồi đây là đủ.", "Cô Hoa nâng tách bằng hai tay: ngọt thanh quá, cô thấy mình đang được ai đó ôm.", { quiet: true }],
      ["@", "01:10"],
      ["hoa", "Cháu Thỏ Con, cô để ý cháu ho nhiều quá. Mắt cháu thâm nữa. Cháu nhớ giữ ấm, uống chút nước gừng mật ong cho đỡ."],
      ["host", "Dạ, cháu cảm ơn cô. Cháu chỉ hơi mệt thôi ạ."],
      ["card"],
      ["@", "02:00"],
      ["hoa", "Cảm ơn cháu. Dù thứ Hai ra sao, cô sẽ bình tĩnh. Cô nhớ cháu dặn."],
      ["host", "Cô đi cẩn thận. Mong cô thứ Hai nhận tin tốt."]
    ]
  },

  /* ========== ĐÊM 17 — LINH, TUẤN, KHANG (3 KHÁCH) ========== */
  {
    ch: 3, n: 3, t0: "21:00", icon: "🍚", title: "Bữa Cơm Chung Giữa Mùa Giá Tăng",
    guests: ["tuan", "khang", "linh"], end: null,
    close: "Ba người lạ biến bữa tối ở quán thành bữa cơm chung đầu tiên của cả khu phố.",
    intro: [
      "Giữa tuần thứ ba. Giá thịt, giá rau, giá dầu ăn đều tăng. Những quán cơm bình dân ở đầu phố giảm suất, đóng cửa sớm. Có tin ở cuối phố đã mở bếp cháo từ thiện.",
      "Thỏ Con kéo ba chiếc bàn lại gần nhau, đặt một nồi canh lớn giữa quầy. Đêm nay, quán biến thành một gian bếp."
    ],
    steps: [
      ["@", "21:15"],
      ["+", "tuan"],
      ["tuan", "Chủ quán! Anh mang mấy hộp cơm nhà làm, tối nay mình ăn chung ở đây được không?"],
      ["host", "Được chứ anh. Mình có nồi canh đây, anh cứ để hộp cơm lên bàn."],
      ["@", "21:40"],
      ["+", "khang"],
      ["khang", "Thỏ Con, anh mang theo ít bánh bột chiên của anh em thợ. Hôm nay xưởng nhận đơn nhỏ, anh em ăn mừng."],
      ["@", "22:00"],
      ["+", "linh"],
      ["linh", "Chào cả nhà. Chị mang theo ít bánh quy tự nướng. Chị vừa nhận tin nhà xuất bản độc lập đồng ý in thử một trăm cuốn, nhưng bắt chị tự lo phần phát hành."],
      ["host", "Chị Linh, đây là anh Tuấn, tài xế đêm. Anh Tuấn, chị Linh là biên tập viên đang làm cuốn sách mà anh Khang sẽ làm bìa."],
      ["tuan", "Vậy là chị có sách rồi! Phát hành thì anh em chạy giao giúp được."],
      ["khang", "Bìa thì anh làm. Giá vốn anh tính sát đáy."],
      ["linh", "Mọi người nói như thể sách của chị là việc chung. Chị xúc động quá."],
      ["@", "22:30"],
      ["?", "Ba người đang chia nhau bữa tối và những khó khăn của mình. Mình múc thêm canh vào từng chiếc bát.",
        ["Giá cả có thể tăng, nhưng bữa cơm ngồi chung thì vẫn rẻ nhất, và ấm nhất. Mình thấy ba người đang giữ cho nhau điều đó.", "tuan", "Chủ quán nói đúng. Mỗi tuần mình làm một bữa như vậy đi, ai có gì mang nấy, chẳng ai phải ăn một mình."],
        ["Hãy lập quỹ cơm chung nhỏ: mỗi người góp theo khả năng, nấu một nồi lớn cho cả anh em chạy đêm và thợ thủ công.", "khang", "Anh góp bếp than và củi. Anh em thợ mang gạo. Chị Linh viết thực đơn dán tường."],
        ["Lặng lẽ múc thêm cho mỗi người một muỗng canh nữa.", "linh", "Em cứ múc im lặng thế, mà chị thấy no cả lòng."]],
      ["@", "22:50"],
      ["brew", "tuan", "Cho anh một ly ấm, đậm đà, có chút cay nồng với ngọt hậu để ăn xong còn ấm bụng.", "Anh Tuấn uống một hơi, cười: ấm thật! Ăn cơm xong mà có thêm ly nước này là no luôn tâm hồn."],
      ["@", "23:10"],
      ["brew", "khang", "Anh một ly đậm, ấm trầm, cay ấm vừa phải, thoảng mùi gỗ với sáp ong.", "Anh Khang nhấp ngụm, khẽ gật: cái vị này như mùi xưởng lúc hết ca."],
      ["@", "23:30"],
      ["brew", "linh", "Chị một ly chua ngọt dịu nhẹ, thơm mùi hoa, gợi hoài niệm chút thôi.", "Chị Linh nhấp ngụm nhỏ: vị này giống như đọc xong một trang văn hay giữa một đêm thu."],
      ["@", "23:55"],
      ["tuan", "Chủ quán, thấy em hơi xanh xao. Em ăn chưa? Mới đứng dậy mà đã phải vịn vào quầy."],
      ["host", "Dạ, em ăn rồi anh. Chắc tại chưa ngủ đủ."],
      ["khang", "Em nghỉ đi, để anh rửa bát cho. Em đừng cố."],
      ["card"],
      ["@", "00:40"],
      ["linh", "Chị chép tên từng người vào cuốn sổ đỏ. Sau này sách ra, chị sẽ để trang cuối ghi ‘cảm ơn bữa cơm chung ở Tiệm Nước Nửa Đêm’."],
      ["host", "Mình xúc động lắm. Cảm ơn ba người đã đến. Mình sẽ nhớ bữa tối này."]
    ]
  },

  /* ========== ĐÊM 18 — BÁC AN ========== */
  {
    ch: 3, n: 4, t0: "00:00", icon: "💊", title: "Những Toa Thuốc Của Người Nghỉ Hưu",
    guests: ["an"], end: null,
    close: "Bác An nói ra điều bác chưa nói với ai, và bác không còn một mình với nó.",
    intro: [
      "Đêm thứ tư của tuần thứ ba. Giá thuốc, giá viện phí lên từng quý, trong khi lương hưu giữ nguyên. Ở hiệu thuốc đầu phố, những người già đếm từng viên một.",
      "Thỏ Con đặt chiếc áo khoác dày lên ghế, nhìn kệ sách ở góc quán giờ đã đầy gần hết."
    ],
    steps: [
      ["@", "00:20"],
      ["+", "an"],
      ["an", {
        h: "Chào cháu. Hôm đó cháu nói có những người đọc nhau bằng cả sự kiên nhẫn, bác về nghĩ mãi. Hôm nay bác có điều muốn kể.",
        m: "Chào cháu. Nhóm đọc chậm của bác giờ đã mười lăm người. Mà bác lại có chuyện riêng muốn tâm sự với cháu.",
        s: "Chào cháu. Bác thích cái im lặng ở đây. Hôm nay bác cũng cần nó.",
        d: "Chào cháu. Bác ngồi nhờ một chút. Bác đi khám về, đang muốn có người ngồi cùng."
      }],
      ["host", "Bác cứ ngồi đi ạ. Ấm trà vừa sôi."],
      ["an", "Bác đi khám tim. Bác sĩ bảo cần uống thuốc đều, thuốc không rẻ. Lương hưu của bác mua thuốc xong còn lại ít để ăn."],
      ["an", "Bác không muốn nói với con gái. Nó ở xa, nuôi hai đứa nhỏ, cũng đang khó khăn. Bác sợ nó lo."],
      ["host", "Bác giấu thế không mệt à?"],
      ["an", "Mệt chứ cháu. Cái giấu nặng hơn cả cái thuốc."],
      ["@", "00:50"],
      ["?", "Mình rót thêm trà, hỏi khẽ.",
        ["Bác dạy học trò bốn mươi năm rằng nói thật với người mình thương là dũng cảm. Bác có thể dạy mình một lần được không?", "an", "Cháu dùng chính lời bác dạy bác. Hay lắm. Bác sẽ gọi cho con gái ngay sáng mai."],
        ["Có quỹ hỗ trợ thuốc men cho người cao tuổi ở trạm y tế phường. Bác thử hỏi giúp, và nhóm đọc chậm có thể đi cùng bác.", "an", "Nhóm đọc chậm của bác toàn người trẻ nhiệt tình. Bác sẽ nhờ họ đi cùng tới trạm y tế. Bác nên bớt tự ái đi."],
        ["Đặt bàn tay lên bàn, ngồi im bên bác.", "an", "Cháu ngồi im mà bác thấy được nghe thật sự. Lâu lắm rồi bác mới nói ra điều này."]],
      ["@", "01:15"],
      ["brew", "an", "Cho bác một ly hoài niệm, chua ngọt thanh tao, thoảng mùi hoa, uống cho ấm lòng thôi cháu.", "Bác An nhấp một ngụm, mỉm cười: vị này làm bác nhớ ngày đầu nhận lớp, tay run mà lòng vui."],
      ["@", "01:40"],
      ["an", "Cháu Thỏ Con, cháu ho nhiều quá. Bác từng nghe tiếng ho ấy ở một người học trò. Cháu đi khám sớm nhé, đừng để như bác."],
      ["host", "Dạ… cháu sẽ đi bác ạ."],
      ["card"],
      ["@", "02:20"],
      ["an", "Cảm ơn cháu. Bác sẽ gọi con gái sáng mai, bác hứa."],
      ["host", "Cháu cũng hứa với bác một điều: cháu sẽ đi khám tuần này."]
    ]
  },

  /* ========== ĐÊM 19 — LINH & MINH ========== */
  {
    ch: 3, n: 5, t0: "22:30", icon: "🤖", title: "Cây Bút Đỏ Gặp Cỗ Máy Viết",
    guests: ["linh", "minh"], end: null,
    close: "Hai người tìm ra ranh giới nhỏ giữa việc mượn công cụ và nhường lại linh hồn.",
    intro: [
      "Đêm thứ năm của tuần thứ ba. Một nhà xuất bản lớn tuyên bố sẽ thay hoàn toàn biên tập viên bằng phần mềm kiểm duyệt. Nhóm của Minh vừa nộp bản demo công cụ tương tự.",
      "Thỏ Con đặt cây bút đỏ của chị Linh cạnh chiếc máy tính của Minh trên quầy, như hai kẻ thù cũ buộc phải ngồi chung bàn."
    ],
    steps: [
      ["@", "22:45"],
      ["+", "linh"],
      ["linh", "Chào em. Chị đang bực mình. Nhà xuất bản lớn họ dùng phần mềm tự duyệt bản thảo, thay luôn bộ phận biên tập. Chị biên tập mười năm, cái máy làm xong trong ba mươi giây."],
      ["host", "Chị cứ ngồi đã. Tối nay có anh Minh, kỹ sư, sắp tới."],
      ["@", "23:05"],
      ["+", "minh"],
      ["minh", "Chào chủ quán, chào chị. Tôi nghe thấy chị nhắc tới phần mềm duyệt bản thảo. Tôi xin thú nhận: nhóm tôi vừa nộp bản demo của một công cụ giống vậy."],
      ["linh", "Vậy là anh cũng là một phần của chuyện này. Anh nói xem, cái máy của anh có biết đọc hay không?"],
      ["minh", "Nó biết nhận ra lỗi chính tả, cấu trúc câu. Nhưng nó không biết ‘mẹ khâu áo bằng chỉ trắng mà chỉ nhớ màu xanh’ là một câu đẹp."],
      ["linh", "Sao anh biết câu đó? Đó là câu tôi viết trong sổ."],
      ["minh", "Tôi tình cờ đọc được trên tờ giấy chị kẹp ở góc quầy lần trước, xin lỗi chị. Chủ quán bảo đó là câu đẹp nhất cô ấy nghe trong tháng này."],
      ["@", "23:40"],
      ["?", "Một người giữ chữ, một người viết máy. Mình đặt hai ly nước giữa họ.",
        ["Máy có thể soát lỗi, nhưng chỉ người mới cảm được sức nặng của một câu. Hai người không cần là đối thủ.", "minh", "Tôi muốn làm công cụ để biên tập viên như chị dùng, chứ không thay chị. Chị chỉ cho tôi chỗ nào cần giữ cho người."],
        ["Chị Linh có thể đề xuất quy tắc: máy chỉ gợi ý, người quyết định. Anh Minh viết thành tính năng, và hai người cùng chuyển ý tưởng này cho nhà xuất bản.", "linh", "Chị đồng ý. Máy gợi ý, người quyết định. Chị sẽ viết nguyên tắc ra giấy bằng bút đỏ."],
        ["Rót nước, mỉm cười nhìn hai người, không nói thêm.", "minh", "Chủ quán không nói, và tôi cũng bớt phòng thủ hơn. Tôi muốn nghe chị Linh nói trước."]],
      ["@", "00:05"],
      ["brew", "linh", "Chị một ly chua ngọt dịu nhẹ, thơm hoa, gợi một chút hoài niệm thôi.", "Chị Linh nhấp ngụm nhỏ: ly này làm chị thấy mình vẫn còn mềm lòng trước một trang văn hay."],
      ["@", "00:25"],
      ["brew", "minh", "Cho tôi ly đậm, đắng gọn, hậu mặn dịu hoặc ấm cay, giúp đầu bớt căng.", "Minh thở ra: cái đắng này gọn, hợp với một bản đề xuất ngắn và rõ."],
      ["@", "00:55"],
      ["linh", "Anh Minh, chị có một yêu cầu. Cái máy của anh đừng bao giờ ghi ‘viết bởi máy’ lên một cuốn sách mà con người không có tên."],
      ["minh", "Tôi sẽ ghi vào quy tắc thiết kế. Con người luôn đứng tên."],
      ["card"],
      ["@", "01:40"],
      ["host", "Một giờ bốn mươi. (đặt tay lên ngực, thở chậm) Mình… mình xin lỗi, hai người cứ nói tiếp. Mình nghỉ một lát."],
      ["linh", "Em ngồi xuống đi. Sao dạo này em hay thế?"],
      ["host", "Mình sẽ đi khám. Hứa với chị."]
    ]
  },

  /* ========== ĐÊM 20 — KHANG & CÔ HOA ========== */
  {
    ch: 3, n: 6, t0: "23:00", icon: "💰", title: "Con Số Cuối Quý",
    guests: ["khang", "hoa"], end: null,
    close: "Cô Hoa và anh Khang tìm ra con đường nhỏ giữ cả xưởng và cả nghề.",
    intro: [
      "Đêm thứ sáu của tuần thứ ba. Cuối quý, giá nguyên liệu tăng thêm một lần nữa. Xưởng da của anh Khang chưa đủ tiền trả lương tháng sau. Ở một góc khác của thành phố, cô Hoa đang chờ danh sách nhân sự sẽ được công bố vào thứ Hai.",
      "Thỏ Con để ngỏ cánh cửa, như thể đoán rằng đêm nay hai người sẽ cần tới nhau."
    ],
    steps: [
      ["@", "23:15"],
      ["+", "khang"],
      ["khang", "Chào Thỏ Con. Anh ghé ngồi. Xưởng sắp hụt tiền lương tháng sau. Anh chưa dám nói hết với anh em."],
      ["host", "Anh Khang ngồi đã. Mình có người này muốn giới thiệu cho anh."],
      ["@", "23:35"],
      ["+", "hoa"],
      ["hoa", "Chào cháu. Cô nghe cháu giới thiệu có người cần tính toán chi phí. Cô chỉ là người cũ làm sổ sách thôi."],
      ["host", "Anh Khang, đây là cô Hoa, kế toán hai mươi năm. Cô Hoa, đây là anh Khang, chủ xưởng da thủ công, mười hai người thợ."],
      ["khang", "Chào cô. Cháu nói thật, cháu giỏi cắt da, dở tính tiền. Xưởng mười năm vẫn chạy bằng cuốn sổ tay."],
      ["hoa", "Vậy anh cho cô xem cuốn sổ. Cô sẽ không phán xét. Cô chỉ xem những khoản nào đang chảy đi."],
      ["@", "00:05"],
      ["hoa", "Anh Khang, anh đang bán ví với giá gần bằng giá vốn. Mỗi chiếc anh chỉ lời tám nghìn. Mà anh làm ba ngày một chiếc."],
      ["khang", "Anh biết. Nhưng đẩy giá lên thì khách bỏ đi."],
      ["hoa", "Khách bỏ đi là khách mua hàng ảnh dựng. Còn khách tìm anh là khách hiểu giá trị. Anh chỉ cần nói với họ giá trị ấy."],
      ["?", "Một người giữ nghề, một người giữ con số. Mình rót thêm nước cho cả hai.",
        ["Anh Khang giữ tay nghề, cô Hoa giữ sổ sách. Cả hai đang giữ một thứ: sự tử tế cho những người xung quanh.", "khang", "Cô Hoa, cô làm giúp anh bảng giá mới được không? Anh trả công bằng một chiếc ví."],
        ["Hãy đề xuất đặt hàng trước theo quý, trả trước một phần. Xưởng có vốn quay vòng, khách có hàng thủ công theo đúng ý.", "hoa", "Đặt trước theo quý à? Cô làm được. Cô soạn bảng giá, anh Khang đứng tên."],
        ["Đặt hai chén nước ấm cạnh cuốn sổ tay của anh Khang.", "hoa", "Cháu đặt chén nước cạnh cuốn sổ mà cô thấy dễ chịu. Như được mời vào một chiếc bàn sạch."]],
      ["@", "00:30"],
      ["brew", "khang", "Cho anh ly đậm, ấm trầm, hậu có chút cay ấm, thoảng mùi gỗ với sáp ong.", "Anh Khang nhấp ngụm, gật đầu: lần này thấy rõ con số đằng sau mùi gỗ."],
      ["@", "00:50"],
      ["brew", "hoa", "Cô xin tách dịu, ngọt thanh, thoảng hương hoa, cho lòng thư thái.", "Cô Hoa nâng tách bằng hai tay: lâu rồi cô mới được tính toán cho người khác bằng cả niềm vui."],
      ["@", "01:20"],
      ["hoa", "Anh Khang, cô nhận lời làm cố vấn sổ sách cho xưởng. Cô thấy mình có việc làm có ý nghĩa rồi."],
      ["khang", "Cô Hoa, cảm ơn cô. Anh sẽ khắc tên cô vào mặt sau mỗi chiếc ví của lô đầu tiên."],
      ["card"],
      ["@", "02:00"],
      ["host", "Hai giờ. (tay run nhẹ khi cầm ấm) Mình… để mình tự rót. Cảm ơn hai người."],
      ["hoa", "Cháu ơi, đưa ấm cho cô. Cô rót."],
      ["khang", "Em vào ghế đi. Anh trông bếp. Cả hai người bọn anh đều nhìn thấy rồi, em đừng giấu nữa."]
    ]
  },

  /* ========== ĐÊM 21 — ĐÈN LỒNG CỦA CẢ KHU PHỐ (VY, HOA, AN) ========== */
  {
    ch: 3, n: 7, t0: "21:30", icon: "🏮", title: "Đèn Lồng Của Cả Khu Phố",
    guests: ["vy", "hoa", "an"], end: null,
    close: "Cuối tuần thứ ba, ngọn đèn của quán được cả khu phố cùng thắp. Chỉ có một chiếc phong bì vẫn nằm im trên tay Thỏ Con.",
    intro: [
      "Đêm cuối của tuần thứ ba. Giá điện tăng thêm một bậc nữa, nhiều hàng quán trong hẻm tắt bớt đèn để tiết kiệm. Tiệm Nước Nửa Đêm vẫn giữ nguyên ngọn đèn lồng trước cửa, dù hóa đơn tháng này khiến Thỏ Con phải ngồi tính rất lâu.",
      "Trên quầy, bên cạnh ấm trà, có một chiếc phong bì in tên bệnh viện. Thỏ Con liếc nhìn nó mỗi khi đi ngang, rồi lại quay đi."
    ],
    steps: [
      ["@", "21:45"],
      ["+", "vy"],
      ["vy", "Thỏ Con ơi, em ghé sớm! Em đi ngang thấy bao nhiêu nhà trong hẻm tắt đèn hết rồi. Chỉ còn quán mình sáng thôi. Đẹp mà cũng xót."],
      ["host", "Giá điện lên mà. Mình nghĩ giữ một ngọn đèn nhỏ thôi cũng đáng, vì ai đi ngang cũng cần một chỗ sáng."],
      ["@", "22:05"],
      ["+", "hoa"],
      ["hoa", "Cháu ơi, cô tính hộ cháu rồi. Tiền điện của quán tháng này gần gấp đôi tháng trước. Mà cháu vẫn không tăng giá nước. Cháu định lỗ mãi sao?"],
      ["host", "Mình cũng chưa biết nữa cô. Nhưng mình không nỡ tăng giá, ai cũng đang khó khăn."],
      ["host", "Cô Hoa, đây là Vy, cô bé phóng viên hay ghé quán. Vy, cô Hoa là người giữ sổ sách giỏi nhất mà mình biết."],
      ["@", "22:20"],
      ["+", "an"],
      ["an", "Chào các cháu. Bác mang tới một xấp giấy dó và hồ dán. Bác nghe Vy nói quán đang cần tiết kiệm điện, bác nghĩ ra một chuyện."],
      ["an", "Hồi nhỏ, cả xóm bác làm đèn lồng giấy trong dịp Trung thu, dùng nến nhỏ. Sao mình không làm một đêm đèn lồng, để cả hẻm cùng treo đèn trước hiên, mỗi nhà một chiếc?"],
      ["host", "Bác An, đây là cô Hoa, kế toán, người vừa tính hộ quán một bài toán rất khó. Cô Hoa, bác An dạy Văn bốn mươi năm ạ."],
      ["@", "22:40"],
      ["?", "Ba người nhìn xấp giấy dó, rồi nhìn mình. Mình đẩy ấm trà ra giữa bàn.",
        ["Mình thích lắm. Một chiếc đèn lồng giấy ấm hơn một bóng đèn điện, và không ai phải trả thêm tiền điện.", "an", "Đúng chứ! Mỗi chiếc đèn bác dạy các cháu gấp, ai tự làm thì tự thấy thương."],
        ["Mình có thể tính chi phí nến và giấy, rồi mời hàng xóm góp vài nghìn mỗi người. Cả hẻm cùng giữ ánh sáng, không ai gánh một mình.", "hoa", "Để cô tính. Mỗi chiếc đèn chừng hai nghìn tiền nến, cả hẻm bốn mươi nhà thì tốn chưa tới một bữa phở."],
        ["Gật đầu, lặng lẽ trải giấy dó lên mặt quầy.", "vy", "Chị trải giấy mà em thấy chị đã quyết định rồi. Làm thôi!"]],
      ["@", "23:00"],
      ["brew", "vy", "Em một ly tỉnh táo, chua dịu trái cây, the mát nhẹ. Em còn phải gấp đèn và ghi hình cho kênh nữa.", "Vy nhấp ngụm đầu, bật cười: vị thanh này làm em tỉnh hẳn, em gấp được ba chiếc đèn liền."],
      ["@", "23:20"],
      ["brew", "hoa", "Cô xin tách dịu, ngọt thanh, thoảng hương hoa. Cô muốn giữ bình tĩnh mà tính cho kỹ.", "Cô Hoa nâng tách bằng hai tay: ngọt thanh quá, cô thấy lòng nhẹ hẳn."],
      ["@", "23:40"],
      ["brew", "an", "Cho bác ly hoài niệm, chua ngọt thanh tao, thoảng mùi hoa nhẹ, nhớ lại những đêm Trung thu xưa.", "Bác An nhấp ngụm, mắt long lanh: vị này gợi bác nhớ ánh nến lập lòe trong chiếc đèn ông sao ngày bé."],
      ["card"],
      ["@", "00:30"],
      ["vy", "Mười hai chiếc xong rồi! Em chụp một tấm thật đẹp, đăng lên kênh, biết đâu cả khu đều muốn tham gia."],
      ["hoa", "Cô đã ghi tên bảy nhà góp nến rồi. Sáng mai cô đi gõ thêm mấy nhà nữa."],
      ["an", "Bác dán nốt chiếc cuối. Chiếc này bác dành cho cháu Thỏ Con, treo ngay trước cửa quán."],
      ["@", "01:20"],
      ["host", "Cảm ơn ba người nhiều lắm. Mình cứ nghĩ giữ quán sáng đèn là chuyện riêng của mình, hóa ra cả khu cùng muốn giữ nó."],
      ["an", "Một ngọn đèn đứng một mình thì dễ tắt. Mười hai ngọn đứng cạnh nhau đã khó, huống chi cả con hẻm."],
      ["@", "01:45"],
      ["vy", "Mọi người về thôi, trời khuya lắm rồi. Thỏ Con nghỉ sớm nhé!"],
      ["-", "vy"],
      ["-", "hoa"],
      ["-", "an"],
      ["host", "(nhìn chiếc phong bì trên quầy, nói rất khẽ) Mai hẵng mở vậy."],
      ["sys", "Mười hai chiếc đèn lồng giấy đung đưa trước hiên, ánh nến lập lòe trong gió. Thỏ Con cầm chiếc phong bì trên tay, nhìn nó một lúc lâu, rồi thở dài."]
    ]
  }
];
