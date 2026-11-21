"use strict";

/* -----------------------------------------------------------------------
   CHƯƠNG 4 — TƯƠNG LAI (Tuần 4, 7 đêm)
   Tương lai của MỌI NGƯỜI: mỗi vị khách đứng trước một ngã rẽ và chọn đường đi tiếp.
   Thỏ Con vẫn là người lắng nghe; chuyện của riêng Thỏ Con để dành cho Cánh Cửa Thứ Hai.
   Đêm 28: cả bảy người cùng ngồi trong quán tới bình minh.
------------------------------------------------------------------------ */
const STORY_CH4 = [
  /* ========== ĐÊM 22 — VY ========== */
  {
    ch: 4, n: 1, t0: "21:00", icon: "🎙️", title: "Lời Mời Từ Tòa Soạn Lớn",
    guests: ["vy"], end: null,
    close: "Vy chọn kể chuyện bằng giọng của mình thay vì giọng của một cỗ máy.",
    intro: [
      "Tuần thứ tư. Cuộc suy thoái vẫn chưa hết, giá cả vẫn đắt đỏ, nhưng người ta bắt đầu nói về chuyện sau này: sau mùa mưa, mình sẽ làm gì?",
      "Một chiếc ghế cạnh bếp than đã được kê sẵn từ chiều. Thỏ Con đoán đêm nay Vy sẽ có chuyện lớn."
    ],
    steps: [
      ["@", "21:15"],
      ["+", "vy"],
      ["vy", {
        h: "Thỏ Con ơi! Chị nhớ chuyện em viết bằng sự chân thành không? Loạt phóng sự của em có một tòa soạn lớn gọi rồi! Em chưa dám tin!",
        m: "Thỏ Con ơi! Kênh phóng sự độc lập của em có hơn mười ngàn người theo dõi rồi! Và có một tòa soạn lớn đã nhắn tin cho em!",
        s: "Thỏ Con ơi. Em đã học được cách lắng nghe, như cái đêm chị để em ngồi im. Và có một tòa soạn lớn vừa nhắn cho em.",
        d: "Thỏ Con ơi, em có tin này. Có một tòa soạn lớn vừa nhắn cho em. Em chưa biết nên mừng hay lo."
      }],
      ["host", "Vy ngồi xuống đã. Kể từ đầu cho mình nghe."],
      ["vy", "Họ muốn em làm biên tập viên mảng nhân vật, lương gấp ba lần. Nhưng họ có một điều kiện: mỗi ngày phải đăng mười lăm bài, và em được dùng công cụ viết tự động để kịp tiến độ."],
      ["vy", "Mười lăm bài một ngày. Em tính thử rồi. Em sẽ không còn thời gian gõ cửa một nhà nào."],
      ["@", "21:45"],
      ["host", "Mình nghe thấy tiếng máy ghi âm của em đang tắt. Em ghi âm bao nhiêu giờ rồi?"],
      ["vy", "Cả trăm giờ ạ. Em có giọng của bác bán vé số, cô lao công, chủ tiệm bánh mì. Em chưa viết hết một phần mười."],
      ["?", "Mình đẩy tách trà sang phía Vy, nghe tiếng mưa nhỏ dần ngoài cửa.",
        ["Mình thấy em đang giữ một kho báu mà chưa ai có. Chắc em biết câu trả lời rồi, đúng không?", "vy", "Em biết. Em chỉ cần một ai đó nói ra thành tiếng để em dám chọn."],
        ["Em có thể làm hai việc: nhận vị trí để có thu nhập ổn định, nhưng thương lượng làm một chuyên mục dài hơi riêng, mỗi tháng một nhân vật, không dùng máy viết.", "vy", "Một chuyên mục dài hơi riêng. Em chưa nghĩ ra đường này. Nếu họ từ chối thì em từ chối họ lại, thế thôi."],
        ["Gật đầu thật chậm và rót thêm trà, để Vy tự nghe lòng mình.", "vy", "Chị im lặng mà em nghe rõ câu trả lời trong đầu. Lạ thật."]],
      ["@", "22:10"],
      ["brew", "vy", "Em một ly tỉnh táo, chua dịu của trái cây, the mát đầu lưỡi, để em còn viết thư trả lời họ ngay tối nay.", "Vy nhấp ngụm đầu, gõ phím liền tay: vị thanh này làm đầu em sáng ra, em biết mình sẽ viết gì."],
      ["@", "22:40"],
      ["vy", "Em đọc cho chị nghe thư trả lời nhé: ‘Cảm ơn lời mời. Tôi xin nhận với một điều kiện: mỗi bài phải do một người thật viết và một người thật đọc.’"],
      ["card"],
      ["@", "23:30"],
      ["vy", "Em gửi rồi. Nếu họ từ chối thì em vẫn còn kênh của mình, và còn cái quán này. Em sẽ ổn."],
      ["host", "Mình tin em. Một năm nữa, mình đoán em sẽ có một cuốn sách đầu tay."],
      ["vy", "Chị nói lớn đi! Biết đâu thành thật!"]
    ]
  },

  /* ========== ĐÊM 23 — MINH ========== */
  {
    ch: 4, n: 2, t0: "01:30", icon: "🧭", title: "La Bàn Trong Dòng Mã",
    guests: ["minh"], end: null,
    close: "Minh chọn con đường vừa giữ nghề, vừa giữ lương tâm.",
    intro: [
      "Đêm thứ hai của tuần thứ tư. Công ty của Minh thông báo giai đoạn hai của kế hoạch tự động hóa. Có một lời đề nghị: lên chức, tăng lương, đổi lại là ký vào bản kế hoạch cắt giảm lớn hơn.",
      "Chiếc ghế cạnh cửa sổ quen thuộc vẫn đợi. Có ai đó đã đặt sẵn chú vịt cao su lên đó, từ lúc nào chẳng rõ."
    ],
    steps: [
      ["@", "01:45"],
      ["+", "minh"],
      ["minh", {
        h: "Chào chủ quán. Tôi ghé vì nhớ chỗ này. Tuần qua tôi nhớ lời cô nói, và tôi đã dám nói ‘khoan đã’ trong một cuộc họp lớn.",
        m: "Chào chủ quán. Bản đề xuất thiết kế lấy con người làm trung tâm của tôi được duyệt thử. Nhưng đồng thời tôi nhận được một đề nghị khó.",
        s: "Chào chủ quán. Cái khoảng lặng ở đây tôi nhớ hoài. Hôm nay tôi cần một khoảng lặng giữa hai quyết định.",
        d: "Chào chủ quán. Tôi ghé một lúc. Tôi đang phải chọn giữa hai con đường."
      }],
      ["minh", "Công ty đề nghị tôi lên làm trưởng nhóm. Đổi lại, tôi ký vào kế hoạch cắt giảm sáu mươi người. Mức lương mới gấp đôi, đủ để tôi trả hết tiền nhà."],
      ["minh", "Tôi đứng trước cửa phòng họp hai mươi phút, nghe tiếng chú vịt cao su trong túi, cái âm thanh nhỏ nhoi nhắc tôi lắng nghe bằng trái tim."],
      ["host", "Mình thấy anh cầm chú vịt chặt lắm. Sáu mươi người đó, anh có quen ai không?"],
      ["minh", "Có. Một cô bé thực tập sinh mới ra trường, và một chú lớn tuổi sắp nghỉ hưu. Tôi nhớ tên cả hai."],
      ["@", "02:15"],
      ["?", "Minh nhìn chú vịt cao su rất lâu. Mình rót một ly nước ấm và chờ anh nói tiếp.",
        ["Mình tin anh biết câu trả lời rồi. Điều anh cần không phải lời khuyên, mà là một người ngồi cạnh khi anh chọn nó.", "minh", "Cô nói đúng. Tôi biết rồi. Tôi sẽ từ chối bản kế hoạch ấy và đề xuất phương án thay thế."],
        ["Anh có thể đề xuất mô hình đào tạo lại nhân viên thay vì cắt giảm. Kèm số liệu chi phí để ban giám đốc khó từ chối.", "minh", "Mô hình đào tạo lại. Đúng. Cô Hoa sẽ giúp tôi tính chi phí, anh Tuấn cho tôi dữ liệu thực địa. Tôi có cả một đội hậu thuẫn."],
        ["Chỉ lặng lẽ đẩy chú vịt cao su sang cạnh bàn tay anh Minh.", "minh", "Chú vịt kêu một tiếng ‘quẹc’. Tôi nghe thấy câu trả lời trong tiếng kêu ấy."]],
      ["@", "02:40"],
      ["brew", "minh", "Cho tôi ly đậm, đắng gọn, hậu mặn dịu hoặc ấm cay, để đầu thật tỉnh trước khi nói với sếp.", "Minh ngửa cổ uống hết: cái đắng này gọn, hệt như quyết định tôi vừa đưa ra."],
      ["@", "03:10"],
      ["minh", "Sáng mai tôi nộp bản đề xuất đào tạo lại. Nếu họ từ chối, tôi nghỉ và mở xưởng công nghệ cộng đồng cùng vài người bạn."],
      ["card"],
      ["@", "04:00"],
      ["host", "Anh sẽ làm được. Một năm nữa, mình mong được nghe anh kể về cái xưởng ấy."],
      ["minh", "Tôi sẽ mang chú vịt tới làm khách đầu tiên của xưởng."]
    ]
  },

  /* ========== ĐÊM 24 — CHỊ LINH & BÁC AN ========== */
  {
    ch: 4, n: 3, t0: "19:00", icon: "📖", title: "Buổi Đọc Chậm Đầu Tiên",
    guests: ["linh", "an"], end: null,
    close: "Cuốn sổ đỏ được đọc lên thành tiếng giữa quán, và lần đầu tiên có người khóc vì một trang chữ viết tay.",
    intro: [
      "Đêm thứ ba của tuần thứ tư. Cuốn tản văn của chị Linh vừa in xong một trăm bản, bìa vải bố do anh Khang ép nóng. Giá giấy đã tăng thêm hai lần kể từ khi chị gửi bản thảo, nhưng sách vẫn ra được.",
      "Kệ sách ở góc quán giờ có hơn bốn mươi cuốn. Hôm nay là buổi đọc chậm đầu tiên."
    ],
    steps: [
      ["@", "19:15"],
      ["+", "an"],
      ["an", {
        h: "Chào cháu. Bác tới sớm để xếp ghế. Hôm nay là buổi đọc chậm đầu tiên cho sách của cháu Linh. Bác sẽ đọc lời mở đầu.",
        m: "Chào cháu. Nhóm đọc chậm của bác tới đủ rồi, mười tám người, hầu hết là người trẻ. Bác thấy tự hào.",
        s: "Chào cháu. Bác xếp ghế cho gọn. Có những buổi tối bác chỉ muốn lặng lẽ xếp ghế cho người khác.",
        d: "Chào cháu. Bác xếp ghế giúp cháu chủ quán. Hôm nay là buổi đọc đầu tiên."
      }],
      ["@", "19:40"],
      ["+", "linh"],
      ["linh", {
        h: "Chào bác, chào em. Cuốn sách ra rồi! Trang cuối chị viết lời cảm ơn Tiệm Nước Nửa Đêm, đúng như chị hứa.",
        m: "Chào bác, chào em. Cuốn sách ra rồi! Hội chợ sách tháng sau đã nhận gian của chị.",
        s: "Chào bác, chào em. Cuốn sách ra rồi. Chị muốn mọi người nghe chứ không cần ai khen.",
        d: "Chào bác, chào em. Sách ra rồi, và chị đang run."
      }],
      ["linh", "Bác An, cháu xin bác đọc đoạn đầu cho mọi người. Giọng bác ấm hơn giọng cháu."],
      ["an", "Bác đọc nhé. ‘Mẹ khâu áo bằng chỉ trắng mà chỉ nhớ màu xanh.’ (ngừng một lúc lâu, giọng hơi nghẹn) Đoạn này bác từng đọc một mình, giờ đọc cho mọi người nghe thì khác hẳn."],
      ["@", "20:15"],
      ["host", "Cả quán im phăng phắc. Có người lau mắt. Mình cũng thế."],
      ["?", "Buổi đọc kết thúc, mọi người vẫn ngồi lại. Mình mở lời.",
        ["Chị Linh, cuốn sách của chị là một ngọn đèn. Mình nghe được cả quán đang cùng nhớ về mẹ mình.", "linh", "Chị muốn mẹ chị nghe giọng bác An đọc đoạn này. Mẹ chị mắt kém lắm."],
        ["Chị có thể thu giọng bác An đọc, làm bản sách nói bằng giọng người thật để gửi cho mẹ chị và những cụ ông cụ bà mắt kém.", "an", "Giọng của ông già này mà làm sách nói à? Bác thấy chuyện này vui, cháu Linh ạ."],
        ["Lặng lẽ rót thêm trà, để mọi người ngồi lại với những trang sách.", "linh", "Em chẳng nói gì mà chị thấy mình được lắng nghe. Cảm ơn em."]],
      ["@", "20:40"],
      ["brew", "linh", "Chị một ly chua ngọt dịu nhẹ, thơm hoa, gợi hoài niệm thôi, để đọc tiếp đoạn sau.", "Chị Linh nhấp ngụm nhỏ: vị này giống cảm giác giữ một cuốn sách còn thơm mùi mực."],
      ["@", "21:00"],
      ["brew", "an", "Bác ly hoài niệm, chua ngọt thanh tao, thoảng mùi hoa nhẹ như chiều thu.", "Bác An nhấp ngụm, khẽ gật: vị này gợi bác nhớ lớp học cuối cùng của mình."],
      ["card"],
      ["@", "22:30"],
      ["an", "Mười người mua sách ngay tại quán. Có một bạn trẻ hỏi bác: ‘Sách giấy còn tương lai không ạ?’ Bác bảo: ‘Còn chừng nào còn người biết đọc chậm’."],
      ["linh", "Câu đó chị chép vào sổ đỏ rồi. Một năm nữa chị muốn có cuốn thứ hai, và thêm một cuốn sách nói gửi mẹ."]
    ]
  },

  /* ========== ĐÊM 25 — ANH KHANG & CÔ HOA ========== */
  {
    ch: 4, n: 4, t0: "22:00", icon: "👜", title: "Lô Ví Mang Tên Cô Hoa",
    guests: ["khang", "hoa"], end: null,
    close: "Xưởng da giữ được cả mười hai người thợ, và cô Hoa tìm ra việc mình muốn làm đến cuối đời.",
    intro: [
      "Đêm thứ tư của tuần thứ tư. Lô ví đầu tiên theo bảng giá mới đã bán hết sạch trong ba ngày. Có người đặt hàng từ tận nước ngoài.",
      "Giá da thuộc vẫn chưa hạ, nhưng lần này xưởng không còn lo. Ai đó trong xưởng vừa ghi lên tường: ‘Làm chậm mà chắc’."
    ],
    steps: [
      ["@", "22:15"],
      ["+", "khang"],
      ["khang", {
        h: "Chào em. Anh mang tin vui. Lô ví theo bảng giá mới bán sạch trong ba ngày. Mười hai anh em giữ được việc, và còn tuyển thêm một thợ phụ mới.",
        m: "Chào em. Anh mở buổi trải nghiệm thứ ba rồi, khách đông, đơn đặt trước kín hết quý. Mười hai anh em ai cũng vui.",
        s: "Chào em. Anh giữ được cả mười hai anh em. Anh nhớ cái im lặng của em lần trước, nhờ nó anh dám nói thật với họ.",
        d: "Chào em. Xưởng còn đủ mười hai người, dù anh vẫn chưa hết lo."
      }],
      ["@", "22:35"],
      ["+", "hoa"],
      ["hoa", {
        h: "Chào cháu, chào anh Khang. Cô nhận được tin tốt. Công ty giữ lại cô, vì cô bé trưởng nhóm lên tiếng giúp. Nhưng cô vẫn muốn làm cố vấn cho xưởng của anh Khang buổi tối.",
        m: "Chào cháu, chào anh Khang. Cô nhận được tin tốt. Công ty đổi mô hình, giữ lại cô làm người kiểm tra cuối cùng. Máy làm, cô soát.",
        s: "Chào cháu, chào anh Khang. Cô nhận tin khá bất ngờ. Công ty giữ lại cô vì cô là người duy nhất ngờ ra một khoản sai.",
        d: "Chào cháu, chào anh Khang. Cô vẫn chưa nhận tin chắc chắn, nhưng cô bớt sợ rồi, vì tối nay có chỗ để đến."
      }],
      ["khang", "Cô Hoa, anh có cái này tặng cô. (đưa chiếc ví da nhỏ, mặt sau khắc dòng chữ ‘Hoa — người giữ sổ’)"],
      ["hoa", "Ôi anh Khang. Cô xúc động quá. Cô sẽ dùng nó đựng tiền chợ, tiền cô chia cho thằng con."],
      ["@", "23:05"],
      ["?", "Hai người đang giữ cho nhau một cái nghề. Mình rót thêm hai ly nước nóng.",
        ["Hai người là điều tuyệt nhất mình thấy trong cả mùa mưa dài này. Cảm ơn hai người.", "hoa", "Cháu lúc nào cũng nói điều làm cô muốn khóc. Cháu ăn cơm cô nấu chưa đấy?"],
        ["Hai người có thể mở một khóa nhỏ dạy làm sổ sách cho thợ thủ công, đi kèm buổi trải nghiệm làm đồ da. Vừa kiếm thêm, vừa giữ nghề.", "khang", "Một khóa học ba buổi, anh dạy da, cô dạy sổ sách. Anh thích ý đó."],
        ["Mỉm cười ngắm hai người nói chuyện, không chen vào.", "hoa", "Cháu đứng đó mà cô thấy ấm. Cô biết cháu đang vui cho bọn cô."]],
      ["@", "23:30"],
      ["brew", "khang", "Cho anh ly đậm, ấm trầm, hậu cay ấm của gia vị, thoảng mùi gỗ với sáp ong.", "Anh Khang nhấp ngụm, mỉm cười: lâu lắm rồi anh mới uống mà không nghĩ tới con số."],
      ["@", "23:50"],
      ["brew", "hoa", "Cô xin tách dịu, ngọt thanh, thoảng hương hoa, để cô còn tỉnh táo dạy sổ sách.", "Cô Hoa nâng tách: ngọt thanh và ấm, giống bát canh mẹ nấu hồi cô còn nhỏ."],
      ["card"],
      ["@", "00:40"],
      ["khang", "Cô Hoa, sau này xưởng cần cô cả đời. Anh nói thật đấy."],
      ["hoa", "Cô thì cần những người như anh. Chúng ta giữ nhau là được. Một năm nữa, cô muốn có một lớp học đầy ắp thợ thủ công."]
    ]
  },

  /* ========== ĐÊM 26 — ANH TUẤN ========== */
  {
    ch: 4, n: 5, t0: "02:00", icon: "🧒", title: "Tờ Giấy Siêu Nhân Lớn Lên",
    guests: ["tuan"], end: null,
    close: "Anh Tuấn nhìn thấy tương lai của hai đứa nhỏ, và cả của chính mình.",
    intro: [
      "Đêm thứ năm của tuần thứ tư. Giá sữa, giá học phí, giá xăng đều tăng, nhưng ở đầu hẻm, một biển hiệu mới vừa treo lên: ‘Trạm Bảo Trì Xe Điện — Tuyển Thợ Lành Nghề’.",
      "Chiếc mũ bảo hiểm cũ vẫn treo ở giá cạnh cửa. Thỏ Con lau nó mỗi ngày, như đang giữ chỗ."
    ],
    steps: [
      ["@", "02:10"],
      ["+", "tuan"],
      ["tuan", {
        h: "Chào em! Anh có tin vui nhất đời! Xưởng xe điện nhận anh làm tổ phó kỹ thuật, bắt đầu thứ Hai! Anh nghĩ tới em đầu tiên, vì em là người đã nói anh nên nộp hồ sơ.",
        m: "Chào em. Cậu Minh gửi tin: bên ứng dụng đã bỏ luật trừ điểm vùng ngập nhờ bản đồ của anh em chạy đêm. Anh em ai cũng mừng. Anh cũng vừa nhận được lời mời vào xưởng xe điện.",
        s: "Chào em. Dạo này anh học cách ngồi yên, nhờ cái chạm tay lặng lẽ của em. Anh cũng nhận được lời mời vào xưởng xe điện.",
        d: "Chào em. Anh ngồi một lúc nhé. Xưởng xe điện gọi anh phỏng vấn lại vòng hai, anh vừa mừng vừa sợ."
      }],
      ["host", "Anh Tuấn ngồi đi. Hôm nay anh không phải chạy chuyến nào à?"],
      ["tuan", "Anh xin nghỉ một đêm. Đêm nay hai đứa nhỏ đòi bố ở nhà ngủ cùng, nhưng anh lại ra đây. Anh có chuyện muốn nghĩ cho kỹ."],
      ["@", "02:35"],
      ["tuan", "Làm tổ phó thì ổn định, nhưng phải đi làm ban ngày, tối không chạy giao hàng được nữa. Thu nhập chạy đêm hiện giờ nhiều hơn lương xưởng. Anh sợ thiếu tiền."],
      ["tuan", "Mà đứa lớn năm nay đã biết hỏi: ‘Bố ơi, sao bố toàn ngủ ban ngày?’. Anh không biết trả lời thế nào."],
      ["?", "Mình đặt tờ giấy siêu nhân anh Tuấn vừa lấy ra từ túi áo lên quầy.",
        ["Tờ giấy này đã đi cùng anh qua bao đêm mưa. Có lẽ hai đứa nhỏ không cần bố giàu hơn, chỉ cần bố ở nhà vào buổi tối.", "tuan", "Em nói đúng. Anh biết mà. Anh chỉ cần ai đó nói ra thôi."],
        ["Anh có thể nhận vị trí tổ phó, đồng thời chạy giao hàng cuối tuần vài tháng đầu để bù lại chênh lệch, rồi giảm dần khi lương ổn định.", "tuan", "Chạy cuối tuần để bù. Cách này khả thi. Anh sẽ lập bảng chi tiêu với cô Hoa."],
        ["Lặng lẽ ngồi cạnh anh, cùng nhìn tờ giấy siêu nhân.", "tuan", "Em ngồi im mà anh thấy được thấu hiểu. Thế là đủ."]],
      ["@", "03:00"],
      ["brew", "tuan", "Cho anh ly ấm bụng, đậm đà, có chút cay nồng với ngọt hậu, y như đêm đầu tiên anh ghé.", "Anh Tuấn nhấp ngụm, rưng rưng: đúng vị đêm mưa đầu tiên anh vào đây. Anh nhớ lắm."],
      ["@", "03:30"],
      ["tuan", "Anh sẽ nhận việc ở xưởng. Một năm nữa, anh muốn đứng ở cổng trường đón hai đứa nhỏ vào buổi chiều, mỗi ngày."],
      ["card"],
      ["@", "04:15"],
      ["host", "Mình sẽ nhớ lời anh. Đến lúc đó, nhớ mang hai đứa nhỏ ghé quán nhé."],
      ["tuan", "Nhất định. Anh sẽ bảo chúng nó vẽ một tờ giấy mới, vẽ chú thỏ cầm ấm trà."]
    ]
  },

  /* ========== ĐÊM 27 — THƯ GỬI CHÍNH MÌNH MỘT NĂM SAU (3 KHÁCH) ========== */
  {
    ch: 4, n: 6, t0: "21:00", icon: "💌", title: "Thư Gửi Chính Mình Một Năm Sau",
    guests: ["vy", "khang", "an"], end: null,
    close: "Ba người viết ba lá thư cho chính mình, và Thỏ Con cất chúng vào ngăn kéo quầy.",
    intro: [
      "Đêm thứ sáu của tuần thứ tư. Khi một mùa mưa dài sắp qua, người ta thường nghĩ về mùa sau. Cuối quý, giá cả vẫn chưa hạ, nhưng trong quán có người đang cầm bút.",
      "Thỏ Con đặt ba tờ giấy, ba chiếc phong bì và một ngăn kéo gỗ nhỏ dưới quầy. Ngăn kéo ấy chưa từng được mở."
    ],
    steps: [
      ["@", "21:15"],
      ["+", "an"],
      ["an", "Chào cháu. Cháu bảo hôm nay viết thư cho chính mình một năm sau à? Bác đã dạy học trò viết thư cả đời, mà chưa viết cho mình lần nào."],
      ["@", "21:35"],
      ["+", "khang"],
      ["khang", "Chào em. Anh nghe bác An nói có lớp viết thư. Anh chữ xấu, nhưng anh viết bằng chân thành."],
      ["@", "21:55"],
      ["+", "vy"],
      ["vy", "Em đây! Em xin phép ghi âm lúc mọi người viết thư, không ghi nội dung, chỉ ghi tiếng ngòi bút thôi."],
      ["host", "Mỗi người một tờ giấy. Viết xong thì cho vào phong bì, đề ngày một năm sau. Mình sẽ giữ trong ngăn kéo."],
      ["@", "22:20"],
      ["?", "Ba người cúi đầu, bắt đầu viết. Chỉ còn tiếng ngòi bút và tiếng mưa. Mình mở lời nhỏ nhẹ.",
        ["Mình nghĩ mỗi người cứ viết thật lòng. Một năm nữa đọc lại, mình sẽ thấy mình đã đi được bao xa.", "an", "Cháu nói đúng. Bác sẽ viết rằng bác đã sống đủ lâu để thấy học trò mình lớn."],
        ["Nếu muốn, mỗi người có thể viết một mục tiêu cụ thể và một điều muốn buông bỏ. Một năm sau mình kiểm tra lại cả hai.", "khang", "Mục tiêu và điều buông bỏ. Anh viết: mở rộng xưởng, và bỏ thói không dám nhờ ai giúp."],
        ["Lặng lẽ để mọi người viết, không nói thêm gì.", "vy", "Chị im lặng mà em viết được dài hơn cả khi nghĩ. Cảm ơn chị."]],
      ["@", "22:50"],
      ["brew", "vy", "Em ly tỉnh táo, chua dịu, the mát, để em viết cho hết lá thư này.", "Vy nhấp ngụm đầu, nét chữ nhanh hơn: em đang viết cho cô gái hai mươi ba tuổi của năm sau."],
      ["@", "23:10"],
      ["brew", "khang", "Cho anh ly ấm trầm, hậu cay ấm, thoảng mùi gỗ, uống chậm trong lúc anh viết.", "Anh Khang nhấp ngụm, gật đầu: anh viết chậm, nhưng chữ nào cũng thật."],
      ["@", "23:30"],
      ["brew", "an", "Bác ly hoài niệm, chua ngọt thanh tao, thoảng mùi hoa nhẹ, để bác viết cho trọn lá thư.", "Bác An nhấp ngụm, mắt long lanh: vị này gợi bác nhớ những lá thư thời trẻ, viết bằng mực tím."],
      ["card"],
      ["@", "00:20"],
      ["an", "Xong rồi. Bác gấp lá thư lại, dán kín. Cảm giác lạ lắm: như gửi một lời hứa cho người còn chưa gặp."],
      ["khang", "Anh cũng xong. Anh để chữ ký to hơn bình thường."],
      ["vy", "Em viết tới ba trang. Em hẹn với chính em một điều."],
      ["host", "Mình cất vào ngăn kéo rồi nhé. Một năm nữa, ngày này, mình sẽ trả lại cho từng người."],
      ["sys", "Ba chiếc phong bì nằm cạnh nhau trong ngăn kéo gỗ. Thỏ Con đóng ngăn lại, đặt tay lên một lúc lâu rồi nhìn đồng hồ. Còn vài tiếng nữa là sáng."]
    ]
  },

  /* ========== ĐÊM 28 — ĐÊM CUỐI: BẢY NGƯỜI ========== */
  {
    ch: 4, n: 7, t0: "21:00", icon: "🌅", title: "Bảy Chiếc Ghế, Một Buổi Bình Minh",
    guests: ["vy", "minh", "linh", "tuan", "khang", "hoa", "an"], end: null,
    close: "Bảy người quen ngồi quanh một quầy gỗ cho đến khi mặt trời lên. Mưa tạnh, và quán vẫn mở.",
    intro: [
      "Đêm cuối của Tháng Mưa. Ngoài kia giá cả vẫn còn đắt đỏ, suy thoái chưa hết hẳn, và những chiếc máy vẫn học thêm điều mới mỗi ngày. Nhưng cả bảy người đều đã tìm thấy hướng đi của mình.",
      "Thỏ Con kê bảy chiếc ghế quanh quầy, và một chiếc thứ tám, nhỏ hơn, cho chính mình. Tấm biển MỞ CỬA được lật sang, lần này không phải để đợi khách lạ, mà để đón những người quen."
    ],
    steps: [
      ["@", "21:15"],
      ["+", "an"],
      ["an", "Chào cháu Thỏ Con. Bác tới sớm nhất. Bác mang theo một bài thơ, nhưng chưa vội đọc."],
      ["@", "21:25"],
      ["+", "hoa"],
      ["hoa", "Cô mang cháo và bánh nếp. Nhiều lắm, đủ cho cả bảy người. Cô nấu từ chiều."],
      ["@", "21:40"],
      ["+", "linh"],
      ["linh", "Chị mang sách tới. Cuốn đầu tiên chị để dành cho em, ký tên rồi."],
      ["@", "21:55"],
      ["+", "khang"],
      ["khang", "Anh mang vài chiếc ví cho cả nhóm. Mỗi chiếc khắc một chữ cái đầu tên người nhận."],
      ["@", "22:10"],
      ["+", "tuan"],
      ["tuan", "Anh đến rồi! Hai đứa nhỏ gửi tranh siêu nhân cho chủ quán. Mỗi tờ vẽ một chú thỏ cầm ấm trà."],
      ["@", "22:30"],
      ["+", "minh"],
      ["minh", "Tôi đến cuối cùng. Công ty chấp nhận bản đề xuất đào tạo lại của tôi, nhưng chỉ cho thử một nhóm nhỏ. Tôi coi đó là chiến thắng."],
      ["@", "22:45"],
      ["+", "vy"],
      ["vy", "Em đây! Em mang cả máy ghi âm. Tối nay em ghi lại giọng của cả bảy người."],
      ["host", "Bảy người, bảy chiếc ghế. Mình nhớ lần đầu tiên, khi mình ngồi một mình và nghĩ chắc chẳng ai ghé."],
      ["@", "23:15"],
      ["?", "Cả bảy người nhìn mình. Ánh đèn vàng đọng trên mặt quầy gỗ. Mình hỏi một câu mình ấp ủ từ lâu.",
        ["Một năm nữa, mỗi người muốn mình thấy mình đang ở đâu, đang làm gì?", "an", "Bác muốn thấy nhóm đọc chậm có một trăm người, và bác vẫn ngồi đây đọc thơ cho các cháu."],
        ["Mình đề nghị mỗi người nói ra một điều sẽ làm trong năm tới, và một người ngồi đây sẽ nhắc mình về điều đó.", "linh", "Chị đồng ý. Có người nhắc thì dễ giữ lời hơn. Chị nhắc em nhé, Vy."],
        ["Mỉm cười, nhìn từng gương mặt thân quen quanh quầy.", "vy", "Chị không cần nói gì cả. Em đọc được hết trong mắt chị."]],
      ["@", "23:45"],
      ["brew", "an", "Cho bác một ly hoài niệm, chua ngọt thanh tao, thoảng mùi hoa nhẹ như chiều thu. Đêm nay bác muốn uống thật chậm.", "Bác An nhấp một ngụm, mắt long lanh: vị này gợi bác nhớ đêm đầu tiên bác tới đây, mưa còn lất phất."],
      ["@", "00:10"],
      ["brew", "vy", "Em một ly tỉnh táo, chua dịu, the mát. Đêm nay em muốn thức tới sáng.", "Vy nhấp ngụm đầu, bật cười: em nhớ ngụm đầu tiên của đêm đầu tiên. Một ly nước đã đổi cả hướng đi của em."],
      ["@", "01:00"],
      ["card"],
      ["@", "01:45"],
      ["vy", "Em muốn nói điều này. Mỗi người trong chúng ta vào đây đều đang sợ một thứ: bị thay thế, bị bỏ lại, hết tiền, hết việc. Nhưng đêm nay chẳng ai còn sợ."],
      ["minh", "Có lẽ vì chúng ta nhận ra mình không phải con số. Mỗi người ở đây đều có một người nhớ tên."],
      ["hoa", "Có lẽ vì quán này cho phép chúng ta chậm lại."],
      ["@", "03:30"],
      ["an", "Thôi bác đọc bài thơ nhé. Bài này bác viết mới, cho quán: ‘Mưa đi qua con hẻm, đèn vàng vẫn đợi. Mỗi người một chiếc ghế, mỗi người một câu chuyện. Ai cũng từng lạc, ai cũng được về.’"],
      ["tuan", "Câu cuối anh sẽ nhớ cả đời."],
      ["@", "05:10"],
      ["sys", "Trời hửng sáng. Cơn mưa cuối cùng của Tháng Mưa tạnh hẳn. Bảy người ngồi quanh quầy gỗ, bên cạnh Thỏ Con, nhìn tia nắng đầu tiên chiếu vào kệ sách ở góc quán."],
      ["@", "05:30"],
      ["host", "Chào buổi sáng, mọi người. Cảm ơn vì đã đi cùng mình hết một mùa mưa. Cửa quán lúc nào cũng mở."],
      ["vy", "Mình sẽ quay lại. Cả bảy người."],
      ["@", "05:40"],
      ["host", "(nhìn đồng hồ, khẽ mỉm cười) Còn khoảng một tiếng rưỡi nữa là bảy giờ. Mình có một cuộc hẹn sớm. Mọi người cứ ngồi thêm một lát, mình quay lại ngay."]
    ]
  }
];
