"use strict";

/* -----------------------------------------------------------------------
   CHƯƠNG 1 — GẶP GỠ (Tuần 1, 7 đêm)
   Bảy vị khách lần lượt đẩy cửa tiệm lần đầu tiên. Mỗi đêm một câu chuyện riêng.
   Quy ước bước: xem chú thích đầu js/07-narrative.js
------------------------------------------------------------------------ */
const STORY_CH1 = [
  /* ========== ĐÊM 1 — VY ========== */
  {
    ch: 1, n: 1, t0: "00:00", icon: "🪧", title: "Tấm Biển Gỗ Lật Mặt MỞ CỬA",
    guests: ["vy"], end: "solo:vy",
    intro: [
      "Mùa mưa năm nay kéo dài hơn mọi người nhớ. Giá điện tăng bậc, giá gạo nhích lên từng tuần, và cứ vài ngày lại có thêm một công ty thông báo “tối ưu nhân sự”. Cuối con hẻm nhỏ, tấm biển gỗ của Tiệm Nước Nửa Đêm lại được lật sang mặt MỞ CỬA.",
      "Đây là đêm đầu tiên của Tháng Mưa. Thỏ Con lau quầy, thắp đèn lồng, đặt ấm nước lên bếp than rồi ngồi chờ xem ai sẽ là người đầu tiên tìm tới ánh đèn vàng này."
    ],
    steps: [
      ["@", "00:10"],
      ["host", "Mười hai giờ mười. Ấm nước sắp sôi, Bánh Quy đã ngủ gật trên ghế rồi. Mưa to thế này, chắc chẳng ai ghé đâu nhỉ…"],
      ["@", "00:25"],
      ["+", "vy"],
      ["vy", "Chào Thỏ Con… quán vẫn còn mở cửa ạ? Em vừa đi bộ qua ba con phố, ba lô ướt hết cả rồi."],
      ["host", "Còn mở chứ. Bạn đặt ba lô cạnh bếp than cho mau khô, rồi ngồi xuống đây. Trông bạn như vừa chạy một quãng dài vậy."],
      ["vy", "Em vừa nộp hồ sơ thứ mười hai. Vị trí phóng viên thực địa, nhưng hồ sơ của em bị hệ thống lọc tự động loại sau đúng ba giây. Ba giây thôi! Em chuẩn bị hai tuần liền."],
      ["host", "Ba giây… còn ngắn hơn thời gian ấm nước sôi."],
      ["vy", "Họ nói giờ chỉ cần gõ vài dòng lệnh là có ngay một bài tổng hợp tin tức. Tòa soạn nào cũng cắt phóng viên trẻ vì suy thoái. Em tự hỏi… còn ai cần một người đi gõ cửa từng căn nhà để nghe sự thật nữa không?"],
      ["vy", "Tiền trọ vừa tăng thêm tám trăm nghìn. Mì gói cũng đắt lên rồi. Vậy mà em vẫn đeo cái máy ghi âm cũ này, cứ như đeo theo một lời hứa."],
      ["@", "01:20"],
      ["host", "(nhìn chiếc máy ghi âm có vết xước ở góc) Nó đã nghe được những gì rồi?"],
      ["vy", "Nhiều lắm ạ. Một bác bán vé số kể về đứa cháu học xa. Một cô lao công dậy từ ba giờ sáng. Chẳng ai cho em điểm cả, nhưng em nhớ từng giọng nói của họ."],
      ["?", "Mình rót thêm nước vào ly của Vy, chọn cách mở lời thật khẽ.",
        ["Khi cầm máy ghi âm trước một người thật, điều gì khiến tim bạn rung động nhất?", "vy", "Là lúc người đối diện nhận ra có người thật sự muốn nghe họ, chứ không phải để lấy lượt xem. Khoảnh khắc họ thôi dè chừng ấy, em không muốn đánh mất nó."],
        ["Nếu bài tổng hợp ai cũng làm được, đâu là góc nhìn thực địa chỉ người có mặt tại hiện trường mới khai thác được?", "vy", "Những chi tiết mà con số không nói được: tiếng dép lê, ánh mắt, đoạn người ta ngừng lại giữa câu. Có khi em làm được một chuyên mục phóng sự nhân vật độc lập đấy!"],
        ["Đặt một chén nước ấm trước mặt Vy, không nói gì, để quán yên tĩnh.", "vy", "Em thở ra một hơi thật dài… Cả buổi nay em phải nói sao cho thật “chuyên nghiệp”. Ở đây thì không cần. Cảm ơn Thỏ Con."]],
      ["@", "01:45"],
      ["brew", "vy", "Thỏ Con ơi, cho em một ly thật mát, vị thanh và tỉnh người, chua dịu của trái cây và chút the mát ở đầu lưỡi nhé. Em còn một bản thảo phải viết xong trước khi trời sáng.", "Em nhấp một ngụm dài, vai em thả lỏng hẳn. Vị thanh này làm em nhớ ngày đầu bước vào cổng trường báo chí, cái lúc em còn tin chữ nghĩa đổi được điều gì đó."],
      ["@", "02:50"],
      ["vy", "Hồi mới vào trường, em tưởng làm báo là đi thay đổi thế giới. Giờ em chỉ mong ai đó đọc bài của em qua khỏi dòng đầu tiên."],
      ["host", "Vậy hôm nay ta chơi một ván nhỏ nhé. Mình có một bộ bài ghi những câu hỏi khó trả lời nhất lúc nửa đêm."],
      ["card"],
      ["@", "04:10"],
      ["host", "Bốn giờ mười rồi. Mưa nhỏ dần, nghe như ai đó đang gõ phím rất khẽ trên mái tôn. Trước khi Vy đi, mình muốn nói với bạn điều này."],
      ["?", "Mưa vẫn rả rích, trời còn tối. Mình muốn gửi cho Vy một câu thật lòng.",
        ["Đừng để một bộ lọc tự động định nghĩa giá trị của trái tim nhiệt huyết. Câu chuyện tử tế luôn tìm được độc giả của riêng nó.", "vy", "Em hiểu rồi. Em sẽ tiếp tục đi và viết bằng tất cả sự chân thành của mình, kể cả khi chưa ai đọc!"],
        ["Hãy biến thế mạnh phỏng vấn ngoài hiện trường thành dấu ấn cá nhân không thể sao chép của bạn.", "vy", "Dạ! Em sẽ lập kênh phóng sự độc lập, chuyên kể chuyện người lao động giữa mùa biến động. Em ghi lại luôn đây."],
        ["Mỉm cười tiễn bạn ấy bằng ánh mắt ấm và một cái gật đầu tin tưởng.", "vy", "Em hiểu mà. Không cần nói thêm gì nữa đâu ạ. Em cúi đầu cảm ơn Thỏ Con."]],
      ["@", "04:50"],
      ["vy", "Mưa tạnh rồi này! Cảm ơn Thỏ Con nhiều lắm. Em về viết bài phóng sự đầu tiên bằng tất cả lòng tự trọng nghề nghiệp của mình."],
      ["host", "Hẹn gặp lại bạn, Vy. Cửa quán lúc nào cũng mở cho đến khi trời sáng. Mình sẽ để dành cho bạn chiếc ghế cạnh bếp than."]
    ]
  },

  /* ========== ĐÊM 2 — MINH ========== */
  {
    ch: 1, n: 2, t0: "00:00", icon: "🌃", title: "Ánh Sáng Xanh Của Màn Hình",
    guests: ["minh"], end: "solo:minh",
    intro: [
      "Đêm thứ hai. Đài FM Nửa Đêm đọc bản tin: thêm ba công ty công nghệ công bố kế hoạch giảm nhân sự, giá điện tháng này lại nhích lên một bậc. Trong tòa nhà kính sáng đèn cuối phố, một văn phòng vẫn chưa tắt.",
      "Tiệm Nước Nửa Đêm lặng như một chiếc hộp nhạc đang chờ được vặn dây cót. Thỏ Con lau lại chiếc ghế gỗ trong góc yên tĩnh nhất, như thể đã đoán trước có người sẽ cần đến."
    ],
    steps: [
      ["@", "00:40"],
      ["host", "Gần một giờ sáng. Hôm nay mình để ý góc yên tĩnh nhất, cạnh cửa sổ. Ngồi đó nhìn ra mưa rất dễ chịu."],
      ["@", "01:10"],
      ["+", "minh"],
      ["minh", "Cho tôi một góc ngồi yên tĩnh nhất nhé. Tôi vừa rời văn phòng sau cuộc họp triển khai hệ thống tự động hóa mới."],
      ["host", "Chiếc ghế cạnh cửa sổ còn trống. Anh cứ ngồi, đừng lo gì cả. Trông anh mệt hơn là buồn ngủ."],
      ["minh", "Mệt thì đúng. Công ty gọi đó là “tối ưu chi phí mùa suy thoái”, nhưng tôi biết sáng mai sẽ có thêm hai mươi đồng nghiệp nhận thông báo nghỉ việc."],
      ["minh", "Điều trớ trêu là tôi viết ra những dòng mã ấy. Tối nay nhìn lại màn hình, tôi thấy mình giống một cỗ máy đang dần đánh mất khả năng đồng cảm với con người."],
      ["host", "Nghe như anh vừa nhìn vào tên của những người quen trong bảng dữ liệu."],
      ["minh", "Làm sao cô biết? Đúng vậy. Có một cột dữ liệu chỉ có mã số. Tôi bấm nhầm vào một dòng và nhận ra mã số ấy là của người bạn ngồi cạnh tôi bốn năm. Chị ấy vừa trả hết tiền trước nhà."],
      ["@", "01:50"],
      ["minh", "Đây là chú vịt cao su của tôi. Đồng nghiệp bảo cứ gặp lỗi thì kể cho nó nghe. Tối nay tôi kể hết cho nó rồi mà vẫn không gỡ được lỗi nào cả."],
      ["host", "Chú vịt này nghe chắc kiên nhẫn hơn mình. Nhưng nếu anh muốn, mình cũng nghe."],
      ["?", "Mình đặt chú vịt cao su lên quầy cạnh ly của Minh và hỏi nhẹ một câu.",
        ["Khi tắt hết màn hình, có khoảnh khắc nào trong tuần này khiến anh thật sự cảm thấy mình đang sống như một con người không?", "minh", "Có lẽ là lúc tôi ghé mua ổ bánh mì nóng của bác bán hàng đầu ngõ, và bác hỏi thăm hôm nay có mệt không. Tôi đứng đó cả phút, không biết trả lời thế nào."],
        ["Công nghệ vốn là công cụ trung tính. Anh có thể thiết kế lại hệ thống để hỗ trợ con người thay vì thay thế họ không?", "minh", "Thực ra có thể! Nếu đổi từ tự động hóa để cắt giảm sang công cụ hỗ trợ năng suất và an toàn cho nhân viên, mọi thứ sẽ khác hẳn. Tôi chưa dám nói với ai."],
        ["Rót cho anh một ly nước ấm, đẩy sang cạnh con vịt rồi ngồi im lặng cùng anh.", "minh", "Cô không hỏi thêm gì. Lạ thật, lâu lắm rồi tôi mới có một khoảng lặng mà không có thông báo nào bật lên."]],
      ["@", "02:20"],
      ["brew", "minh", "Cho tôi một ly thật đậm, đắng gọn để tỉnh táo, nhưng hậu vị phải có chút mặn dịu hoặc ấm cay để làm mềm sự căng thẳng trong đầu.", "Minh thở phào sau ngụm đầu tiên: “Lâu lắm rồi tôi mới uống một ly mà không vừa uống vừa kiểm tra email.”"],
      ["@", "03:00"],
      ["minh", "Tôi từng nghĩ viết một thuật toán giỏi là cách duy nhất để giữ chỗ đứng. Giờ tôi thấy thuật toán nào cũng cần một người dám nói “khoan đã”."],
      ["host", "Vậy anh có muốn thử rút một lá bài không? Mỗi lá là một câu hỏi để người ta nói thật với chính mình."],
      ["card"],
      ["@", "04:15"],
      ["host", "Chiếc đồng hồ chỉ bốn giờ mười lăm. Trời vẫn tối, nhưng mưa đã thưa. Mình có một lời nhắn cho anh trước khi anh về."],
      ["?", "Trời vẫn còn tối, mình chọn lời cuối.",
        ["Đừng tự trách mình vì sự phát triển của thời đại. Chỉ cần anh còn trăn trở vì người khác, trái tim anh vẫn là la bàn.", "minh", "Cảm ơn Thỏ Con. Tôi nhận ra mình không cần gồng lên cho lạnh lùng để làm một kỹ sư giỏi."],
        ["Hãy đưa yếu tố con người vào ngay kiến trúc thuật toán của anh. Đó mới là đỉnh cao của trí tuệ.", "minh", "Đúng. Sáng mai tôi sẽ đề xuất phương án thiết kế lại quy trình lấy con người làm trung tâm. Dù họ có nghe hay không."],
        ["Mỉm cười gật đầu với anh rồi quay đi rửa ly, để anh được yên tĩnh một mình.", "minh", "Tôi ngồi thêm một lúc nữa. Chỉ nghe mưa và tiếng nước chảy, thế là đủ."]],
      ["@", "04:50"],
      ["minh", "Cảm ơn chủ quán. Đêm nay tôi có thể ngủ một giấc thật sâu mà không bị những dòng mã ám ảnh nữa."],
      ["host", "Anh cứ giữ chú vịt nhé. Và nếu mai lại gặp lỗi, cửa quán vẫn mở cho đến khi trời sáng."]
    ]
  },

  /* ========== ĐÊM 3 — LINH ========== */
  {
    ch: 1, n: 3, t0: "00:00", icon: "📕", title: "Cuốn Sổ Bìa Đỏ Sờn Gáy",
    guests: ["linh"], end: "solo:linh",
    intro: [
      "Đêm thứ ba, gió đổi hướng, mang theo mùi ẩm của những trang sách cũ trong hiệu sách cuối phố. Tin tức sáng nay: một nhà xuất bản lâu đời vừa tuyên bố ngừng in sách mới để chuyển sang nội dung tạo tự động.",
      "Thỏ Con đặt một lọ hoa nhài nhỏ lên quầy. Mùi hương thoang thoảng gợi nhớ những buổi chiều đọc sách ở đâu đó rất xa."
    ],
    steps: [
      ["@", "01:35"],
      ["host", "(ho khẽ vài tiếng rồi uống ngụm nước) Gió lùa mạnh quá. Mình khép bớt cánh cửa lại một chút."],
      ["@", "01:50"],
      ["+", "linh"],
      ["linh", "Chào Thỏ Con. Ngoài trời lạnh quá, chị ghé xin một chút hơi ấm trước khi về căn hộ nhỏ cuối phố."],
      ["host", "Mời chị vào. Chị ôm cuốn sổ chặt thế, sợ ướt à?"],
      ["linh", "Nó là cuốn sổ cũ của chị, bìa đỏ sờn cả gáy. Chị chép những đoạn tản văn viết bằng bút máy trong những đêm mưa. Thứ duy nhất chị chưa dám đưa cho ai đọc."],
      ["linh", "Ngân sách xuất bản bị thu hẹp, tòa soạn bắt mỗi ngày phải đăng hàng chục bài ngắn chạy theo xu hướng. Chị biên tập mà chẳng còn thời gian đọc nổi một bài cho hết."],
      ["linh", "Đồng nghiệp dùng công cụ tạo bài chỉ mất ba mươi giây. Chị thì trau chuốt cả đêm cho một đoạn mà vẫn bị chê là chậm chạp."],
      ["host", "Ba mươi giây và cả một đêm. Hai thứ ấy khó mà đem so với nhau."],
      ["linh", "Tiền thuê căn hộ vừa tăng mười lăm phần trăm. Chị tính đi tính lại: nếu theo kịp tốc độ thì chị mất cuốn sổ này, còn nếu giữ cuốn sổ thì chị mất việc."],
      ["@", "02:15"],
      ["host", "Chị Linh, cuốn sổ ấy chị viết cho ai?"],
      ["linh", "Cho mẹ chị. Bà ở quê, mắt kém rồi, không đọc được chữ máy tính. Chị định in thành một cuốn nhỏ, chữ thật to, gửi về cho bà."],
      ["?", "Mình khẽ nghiêng ly trà hoa của chị Linh và hỏi.",
        ["Nếu không có bất kỳ chỉ số lượt đọc nào, chị muốn viết câu chuyện gì nhất cho chính tâm hồn mình?", "linh", "Chị muốn viết về những người bình thường vẫn âm thầm tử tế với nhau giữa những ngày khó khăn nhất. Như bà bán xôi dành thêm miếng chả cho đứa học trò hết tiền."],
        ["Giữa biển nội dung công nghiệp giống nhau, điều gì khiến độc giả sẵn sàng dừng lại và trân trọng một trang viết tay?", "linh", "Là trải nghiệm sống thật và giọng văn có linh hồn. Thứ mà thuật toán thống kê không thể tự trải qua!"],
        ["Đẩy khay đường nhỏ lại gần chị và ngồi nghe mưa cùng chị, không hỏi thêm.", "linh", "Cảm ơn em. Mấy ngày nay chị toàn bị hỏi “đã xong chưa”. Ngồi yên thế này, chị mới nhớ mình cũng được phép chậm."]],
      ["@", "02:40"],
      ["brew", "linh", "Chị muốn một thức uống chua ngọt dịu nhẹ, thơm như hương hoa, gợi một chút hoài niệm của những buổi chiều đọc sách thôi.", "Chị Linh nhấp một ngụm nhỏ, hương hoa lan tỏa: vị ngọt dịu này giống hệt cảm giác khi đọc xong một trang văn hay."],
      ["@", "03:20"],
      ["linh", "Hồi nhỏ chị đọc bên đèn dầu, bà ngồi cạnh khâu áo. Bà bảo con chữ cũng như mũi chỉ, vội thì bung ngay. Chị nhớ câu đó mãi, mà hôm nay chị lại sắp quên."],
      ["host", "Đừng quên mà. Chị muốn rút một lá bài không? Mỗi lá giống như một trang sổ nhỏ của quán."],
      ["card"],
      ["@", "04:20"],
      ["host", "Gần bốn rưỡi rồi chị ạ. Trước khi chị về, mình muốn gửi chị một câu."],
      ["?", "Chị Linh gập cuốn sổ lại. Mình nói điều cuối cùng.",
        ["Những câu chữ viết ra từ trái tim bền hơn mọi cơn sốt nhất thời. Chị đừng cất cuốn sổ đỏ vào ngăn kéo.", "linh", "Chị sẽ tiếp tục viết cuốn bản thảo của mình, dù mỗi đêm chỉ thêm được một trang!"],
        ["Hãy đặt ngòi bút của chị ở phân khúc văn chương sâu sắc và ấn phẩm độc lập, nơi độc giả tìm giá trị thật.", "linh", "Đúng rồi! Chị sẽ gửi bản thảo cho nhà xuất bản độc lập ngay tuần này."],
        ["Mỉm cười tiễn chị bằng cái chạm tay nhẹ lên cuốn sổ đỏ.", "linh", "Chị hiểu, Thỏ Con. Chị sẽ không nói thêm. Có những điều chỉ cần được gật đầu đồng ý."]],
      ["@", "05:00"],
      ["linh", "Cảm ơn Thỏ Con đã giữ lại một góc bình yên cho những người còn yêu chữ nghĩa như chị."],
      ["host", "Chị cứ đến khi cần nhé. Quán nhỏ, nhưng chiếc ghế gần cửa sổ ấy lúc nào cũng có đèn."]
    ]
  },

  /* ========== ĐÊM 4 — TUẤN ========== */
  {
    ch: 1, n: 4, t0: "00:00", icon: "🚚", title: "Chuyến Hàng Đêm Cuối",
    guests: ["tuan"], end: "solo:tuan",
    intro: [
      "Đêm thứ tư. Giá xăng vừa tăng lần thứ ba trong hai tháng, những chiếc xe giao hàng phải đổ thêm tiền để chạy cùng một quãng đường. Ở đại lộ, nước dâng đến nửa bánh xe, vậy mà ứng dụng vẫn đếm từng phút trễ.",
      "Tiệm Nước Nửa Đêm bật thêm một ngọn đèn nhỏ ở trước hiên, như một dấu chấm sáng cho những người đang chạy dưới mưa."
    ],
    steps: [
      ["@", "02:20"],
      ["host", "Giờ này ngoài đường chỉ còn xe giao hàng và xe rác. Nghe tiếng pô xe từ xa là mình biết có người sắp ghé."],
      ["@", "02:30"],
      ["+", "tuan"],
      ["tuan", "Chào chủ quán! Cho anh ngồi nhờ chút cho ấm người rồi chạy nốt chuyến hàng đêm cuối cùng."],
      ["host", "Anh vào đây, đặt mũ lên ghế cho ráo. Xe anh dừng ngoài đầu hẻm à?"],
      ["tuan", "Ừ, anh để sát tường cho khỏi ngập. Xưởng cơ khí cũ cắt giảm ca từ đầu năm, nên anh chuyển sang chạy giao hàng đêm. Phải giữ cho đủ tiền học phí với tiền sữa của hai đứa nhỏ ở nhà."],
      ["tuan", "Giờ ứng dụng giao việc hoàn toàn bằng thuật toán. Đường ngập mà trễ một phút cũng bị trừ điểm. Nhiều lúc anh thấy mình chạy đua với một cái đồng hồ vô cảm."],
      ["host", "Một cái đồng hồ không biết đường đang ngập."],
      ["tuan", "Đúng thế! Nó đâu biết con hẻm này bị chắn lúc hai giờ. Còn xăng thì lên liên tục. Một chuyến hàng giờ trừ xăng trừ phí còn chưa đủ một tô phở."],
      ["@", "03:05"],
      ["tuan", "Anh cũng đùa thế thôi. Thật ra mỗi đêm lúc dắt xe ra khỏi nhà, hai đứa chạy theo nhét tờ giấy vẽ siêu nhân vào túi áo khoác của bố. Anh mang theo suốt."],
      ["host", "Tờ giấy ấy nặng hơn mọi chuyến hàng nhỉ."],
      ["?", "Mình đặt ly xuống cạnh bàn tay chai sạn của anh Tuấn và hỏi.",
        ["Mỗi đêm trước khi dắt xe ra khỏi nhà, hình ảnh nào của hai bé tiếp thêm sức mạnh cho anh nhiều nhất?", "tuan", "Là lúc hai đứa nhét tờ giấy vẽ siêu nhân vào túi áo. Đứa lớn còn dặn bố đội mũ bảo hiểm cho cẩn thận. Có hôm anh dừng đèn đỏ, mở ra xem, cười một mình."],
        ["Với tay nghề cơ khí mười hai năm của anh, có hướng chuyển sang bảo trì phương tiện xanh đang thiếu thợ lành nghề không?", "tuan", "Có chứ! Mấy trạm bảo trì xe điện mới mở đang tìm thợ có kinh nghiệm cơ khí thực tế. Tại anh cứ mải chạy xe nên chưa kịp nộp hồ sơ!"],
        ["Mời anh một chén nước ấm, ngồi lau chiếc bàn gỗ và để anh được nghỉ.", "tuan", "Chà, ấm quá. Em không hỏi gì mà anh lại thấy nhẹ cả người. Có khi cả tuần nay anh chưa ngồi yên được năm phút."]],
      ["@", "03:20"],
      ["brew", "tuan", "Pha cho anh ly gì thật ấm bụng, đậm đà, có chút cay nồng với ngọt hậu để tan hết hơi lạnh ngoài đường nhé.", "Anh Tuấn xoa hai bàn tay vào ly rồi uống một ngụm lớn: “Ấm từ cổ họng xuống tận lòng bàn tay luôn em ạ!”"],
      ["@", "03:55"],
      ["tuan", "Hồi trước anh sửa một chiếc máy tiện cả buổi chiều vì thương nó. Giờ chiếc máy giao việc cho anh thì chẳng ai thương anh cả. Thật đấy."],
      ["host", "Vậy tối nay quán thương anh một chút. Anh rút một lá bài nhé?"],
      ["card"],
      ["@", "04:35"],
      ["host", "Hơn bốn rưỡi rồi anh Tuấn, mưa đã nhẹ lại. Anh còn một chuyến chạy nữa, mình có lời này muốn gửi anh."],
      ["?", "Anh Tuấn đứng dậy khoác lại áo gió. Mình nói điều cuối cùng.",
        ["Sự hy sinh thầm lặng của anh chính là mái nhà vững chãi nhất cho hai con. Anh đã làm một người cha tuyệt vời.", "tuan", "Nghe em nói mà anh thấy bao nhiêu mệt nhọc cả tuần tan hết!"],
        ["Đừng bỏ phí đôi bàn tay thợ lành nghề của anh. Sáng mai hãy ghé xưởng kỹ thuật xe điện nộp hồ sơ nhé.", "tuan", "Chốt luôn! Giao xong ca đêm là anh ghé xưởng nộp hồ sơ ngay!"],
        ["Mỉm cười đưa anh chiếc mũ bảo hiểm và gật đầu tin tưởng.", "tuan", "Em chẳng nói gì mà anh thấy được cổ vũ ghê. Cảm ơn nhé."]],
      ["@", "05:00"],
      ["tuan", "Cảm ơn Thỏ Con! Chúc quán luôn đắt khách. Anh lên đường nốt chuyến cuối đây."],
      ["host", "Anh đi cẩn thận nhé. Đường ngập nhớ đi chậm, tờ giấy siêu nhân sẽ không phạt anh đâu."]
    ]
  },

  /* ========== ĐÊM 5 — KHANG ========== */
  {
    ch: 1, n: 5, t0: "00:00", icon: "🧵", title: "Mùi Sáp Ong Và Sợi Chỉ Gai",
    guests: ["khang"], end: "solo:khang",
    intro: [
      "Đêm thứ năm. Giá da thuộc nhập khẩu lại nhích lên, giá điện của những xưởng nhỏ tăng theo từng bậc. Trên mạng, hàng loạt trang bán túi xách với hình ảnh dựng bằng trí tuệ nhân tạo, đẹp lung linh mà giá chỉ bằng một phần ba.",
      "Cuối hẻm có một xưởng da sáng đèn muộn hơn mọi nhà. Thỏ Con đặt thêm một thanh gỗ vào bếp than, như thể biết sắp có người cần hơi ấm của gỗ."
    ],
    steps: [
      ["@", "02:50"],
      ["host", "Ba giờ sáng chưa tới. Mình nghe tiếng cửa xưởng da ở cuối hẻm khép lại, rồi đến tiếng bước chân nặng nề. Hôm nay anh ấy lâu hơn mọi ngày."],
      ["@", "03:05"],
      ["+", "khang"],
      ["khang", "Chào Thỏ Con. Anh vừa đóng cửa xưởng da, ghé xin một góc yên tĩnh để suy nghĩ chút chuyện."],
      ["host", "Anh Khang cứ ngồi. Trên tạp dề anh còn vương sợi chỉ sáp ong. Mùi thơm lắm."],
      ["khang", "Quen rồi, không giặt ra nổi. Kinh tế khó khăn, khách thắt chặt chi tiêu, mà xưởng anh vẫn còn mười hai anh em thợ gắn bó suốt chục năm."],
      ["khang", "Mỗi chiếc ví da anh làm mất ba ngày. Người ta lên mạng thấy cái túi trông y hệt mà giá chỉ bằng một phần ba. Họ đâu biết hình ấy là ảnh dựng bằng máy."],
      ["host", "Hình thì đẹp, nhưng da thì không thật."],
      ["khang", "Chuẩn. Đơn hàng giảm một nửa. Trong khi giá da nhập, tiền điện, tiền sáp… cái gì cũng tăng. Tháng này anh phải ngồi tính xem cắt ai đi."],
      ["khang", "Anh chưa dám nói với anh em. Hôm qua có thằng nhóc thợ phụ bảo anh, ‘Anh Khang ơi, em mới học được đường khâu yên ngựa’. Mặt nó vui như Tết."],
      ["@", "03:35"],
      ["host", "Mười hai người thợ, mười hai gia đình. Anh gánh nặng thế nào mà vẫn thức đến giờ này."],
      ["khang", "Thì xưởng này anh dựng từ một chiếc máy khâu cũ. Bỏ thì dễ, giữ mới khó."],
      ["?", "Mình lấy ly của anh Khang rót lại, nói thật chậm.",
        ["Điều gì ở từng mũi chỉ khâu tay khiến anh vẫn kiên quyết giữ xưởng suốt bao năm qua?", "khang", "Là dấu ấn của người thợ. Một chiếc ví dùng mười năm vẫn bền đẹp, mang theo hơi ấm của người làm ra nó. Hàng ảnh dựng làm sao có được cái đó."],
        ["Nếu không thể cạnh tranh về giá với hàng công nghiệp, anh có thể biến chính quy trình chế tác thủ công thành trải nghiệm độc bản cho khách không?", "khang", "Ý hay đấy! Khách giờ thích tự tay khắc tên và nhìn người thợ hoàn thiện món đồ dành riêng cho mình. Anh sẽ thử."],
        ["Đặt một chén trà nóng trước mặt anh Khang rồi lặng lẽ ngồi cùng anh nhìn than hồng.", "khang", "Anh không biết nói gì. Nhưng cái chén này ấm hơn cả tấm da vừa thuộc xong. Cảm ơn em."]],
      ["@", "03:55"],
      ["brew", "khang", "Cho anh một ly đậm, ấm và trầm, hậu vị có chút cay ấm của gia vị, thoang thoảng mùi gỗ và sáp ong thôi.", "Anh Khang nhấp một ngụm, gật đầu: hương vị đậm đà và chân thật hệt như một tấm da thuộc mộc nguyên bản."],
      ["@", "04:30"],
      ["khang", "Hồi anh mười chín tuổi, ông thầy dạy nghề đưa anh một tấm da bò, bảo ‘Cứ vuốt tay lên đó, nó sẽ nói với con khi nào nên cắt’. Mãi sau này anh mới hiểu."],
      ["host", "Giờ anh có muốn nghe tấm da khác nói một chút không? Mình có bộ bài tâm giao."],
      ["card"],
      ["@", "04:50"],
      ["host", "Gần năm giờ rồi anh Khang, trời đã mờ sáng. Mình muốn nói vài lời cuối trước khi anh mở xưởng."],
      ["?", "Anh Khang đứng lên chỉnh lại chiếc tạp dề. Mình chọn điều cuối cùng.",
        ["Giá trị của sự tử tế và lòng tự trọng nghề nghiệp không bao giờ lỗi thời. Các anh em thợ may mắn khi có một người anh như anh.", "khang", "Cảm ơn Thỏ Con. Anh sẽ giữ ngọn lửa của xưởng bằng tất cả tâm huyết!"],
        ["Hãy mở thêm các buổi trải nghiệm chế tác thủ công cuối tuần và kể câu chuyện thật của từng người thợ.", "khang", "Tuần tới anh mở cửa xưởng đón khách trải nghiệm khâu da thủ công luôn!"],
        ["Gật đầu thật chậm, rót nốt chút nước cuối cùng vào ly anh.", "khang", "Em không nói nhiều, nhưng anh hiểu. Cái gật đầu của em đáng giá hơn mấy lời an ủi."]],
      ["@", "05:10"],
      ["khang", "Cảm ơn chủ quán. Hẹn một ngày gần nhất anh sẽ mang tặng quán một món đồ da thủ công thật đẹp."],
      ["host", "Mình mong chờ lắm. Đến lúc ấy xin anh khâu cho Bánh Quy một chiếc vòng cổ nhỏ."]
    ]
  },

  /* ========== ĐÊM 6 — HOA ========== */
  {
    ch: 1, n: 6, t0: "00:00", icon: "🧶", title: "Chiếc Khăn Len Hổ Phách",
    guests: ["hoa"], end: "solo:hoa",
    intro: [
      "Đêm thứ sáu. Công ty tài chính nơi cô Hoa làm việc vừa cài đặt một phần mềm kế toán tự động. Hàng ngàn dòng số liệu, trước đây phải đối chiếu bằng tay mất cả tuần, nay chỉ mất vài phút. Ai cũng khen tiện lợi, chỉ có những người kế toán lâu năm ngồi im lặng.",
      "Thỏ Con đặt thêm một cuộn len ấm lên chiếc ghế cạnh bếp than, dành cho ai đó đang cần một cái ôm bằng sợi len."
    ],
    steps: [
      ["@", "03:20"],
      ["host", "Ba giờ hai mươi. Mình pha sẵn ấm trà hoa cúc, cạnh khay có hai cái chén sứ nhỏ. Chẳng biết sao mình có linh cảm đêm nay có người cần nó."],
      ["@", "03:40"],
      ["+", "hoa"],
      ["hoa", "Chào cháu… Cô mất ngủ nên đi dạo một chút, thấy ánh đèn vàng của quán ấm quá nên ghé vào."],
      ["host", "Cô vào đi ạ. Chiếc khăn len của cô ẩm sương hết rồi, cháu treo cạnh bếp than cho cô nhé."],
      ["hoa", "Cảm ơn cháu. Cô bốn mươi bốn tuổi rồi, mà công ty bắt đầu tái cấu trúc bộ phận kế toán bằng phần mềm tự động. Cô lo không biết mình có theo kịp sự thay đổi này không."],
      ["hoa", "Cô làm kế toán hai mươi năm, nhìn con số là biết chỗ sai. Giờ cái máy nó nhìn nhanh hơn cô, chẳng cần cà phê cũng chẳng mệt. Cô chỉ sợ một ngày mình thành người thừa trong chính phòng của mình."],
      ["host", "Còn chuyện giá cả thì sao cô? Cháu nghe người ta than gạo, dầu ăn, tiền điện đều lên."],
      ["hoa", "Đúng đấy. Lương cô vẫn nguyên, mà tiền chợ mỗi tuần cứ đội lên. Cô nấu cơm mà phải tính từng quả trứng."],
      ["@", "04:05"],
      ["hoa", "Về tới nhà thì thằng con trai hai mươi tuổi cũng chỉ đeo tai nghe, trò chuyện với trợ lý ảo trên máy tính. Hai mẹ con ngồi gần nhau mà chẳng biết bắt đầu câu chuyện từ đâu."],
      ["host", "Nghe cô nói, cháu nhớ một mùi thơm của nồi canh đang sôi mà không có ai ngồi ăn cùng."],
      ["hoa", "Cháu hiểu nhanh thật. Cô muốn hỏi nó ăn sáng chưa, mà lại sợ nó thấy phiền."],
      ["?", "Mình rót trà hoa cúc vào chén sứ của cô Hoa, chọn lời thật dịu dàng.",
        ["Nếu được ngồi xuống bên con mà không nhắc chuyện học hành hay công việc, cô muốn nói với con điều gì nhất ạ?", "hoa", "Cô chỉ muốn hỏi hôm nay con ăn có ngon miệng không, và nhắc con rằng lúc nào mệt thì mẹ vẫn luôn ở đây."],
        ["Tại sao cô không thử nhờ chính con trai làm “thầy giáo” hướng dẫn cô làm chủ công cụ công nghệ mới trong công việc?", "hoa", "Ôi, đúng rồi! Bọn trẻ thích được hướng dẫn người lớn lắm. Vừa là cách cô học cái mới, vừa là cầu nối cho hai mẹ con!"],
        ["Đặt thêm một chiếc chăn mỏng lên vai cô và để cô ngồi yên một lúc.", "hoa", "Cháu chẳng nói gì mà cô thấy được dỗ dành. Lâu lắm rồi cô mới được ai đó chăm một lần như thế."]],
      ["@", "04:20"],
      ["brew", "hoa", "Pha cho cô một tách nước ấm, dịu nhẹ, ngọt thanh và thoang thoảng hương hoa để lòng thư thái dễ ngủ nhé cháu.", "Cô Hoa nâng tách bằng hai tay, nhấp một ngụm nhỏ: ngọt thanh và dịu dàng quá, bao nhiêu lo âu trong lòng cô như lắng xuống."],
      ["@", "04:35"],
      ["hoa", "Cô đan chiếc khăn này từ lúc con nó còn học cấp hai. Màu hổ phách là màu nó thích. Giờ nó lớn rồi, quên mất màu đó."],
      ["host", "Chiếc khăn vẫn nhớ. Cô thử rút một lá bài nhé, xem đêm nay quán gợi ý điều gì."],
      ["card"],
      ["@", "04:55"],
      ["host", "Gần năm giờ rồi cô Hoa. Trước khi cô về chuẩn bị bữa sáng, cháu có một lời nhỏ."],
      ["?", "Cô Hoa quàng lại chiếc khăn len. Mình chọn nói điều cuối cùng.",
        ["Tình yêu thương của một người mẹ là điều ấm áp nhất mà không công nghệ nào thay thế được. Con trai cô chắc chắn cảm nhận được.", "hoa", "Cảm ơn cháu nhiều lắm. Sáng mai cô sẽ nấu món con thích nhất rồi cùng nó trò chuyện!"],
        ["Kinh nghiệm quản lý tài chính của cô kết hợp với công cụ mới sẽ tạo nên sự vững vàng mà lớp trẻ rất cần học hỏi.", "hoa", "Cô sẽ không sợ công nghệ nữa. Tối mai cô nhờ con chỉ cho cô dùng phần mềm mới!"],
        ["Mỉm cười rót thêm một chút trà cuối cùng vào chén cô.", "hoa", "Cô hiểu, cháu à. Có những lúc im lặng ấm hơn trăm lời khuyên."]],
      ["@", "05:10"],
      ["hoa", "Cảm ơn cháu Thỏ Con. Chúc cháu một đêm bình yên nhé. Cô về chuẩn bị bữa sáng cho con đây."],
      ["host", "Cô đi cẩn thận ạ. Nếu một lần nào đó cháu cũng mệt, chắc cháu sẽ nhớ chiếc khăn len màu hổ phách của cô."]
    ]
  },

  /* ========== ĐÊM 7 — AN ========== */
  {
    ch: 1, n: 7, t0: "00:00", icon: "📚", title: "Hiệu Sách Cuối Phố Sắp Đóng Cửa",
    guests: ["an"], end: "solo:an",
    intro: [
      "Đêm thứ bảy, cũng là đêm cuối của tuần đầu tiên. Tờ thông báo dán trên cửa hiệu sách cũ cuối phố nói rằng nơi này sẽ đóng cửa trong ít ngày nữa để nhường chỗ cho một trung tâm thương mại. Lương hưu của những người già mua được ít gạo hơn so với năm ngoái.",
      "Thỏ Con kê sáu chiếc ghế quanh quầy, rồi chiếc thứ bảy ở cạnh cửa sổ. Sáu đêm qua, mỗi người một ly, một câu chuyện. Còn một người nữa chưa tới."
    ],
    steps: [
      ["@", "04:00"],
      ["host", "Bốn giờ. Sáu ly, sáu người, đêm nay là ly thứ bảy. Ngoài trời mưa đã thành những hạt nhỏ li ti rồi."],
      ["@", "04:15"],
      ["+", "an"],
      ["an", "Chào cháu chủ quán trẻ. Bác vừa đi dạo ngang hiệu sách cũ cuối phố, nơi sắp đóng cửa nhường chỗ cho một trung tâm thương mại."],
      ["host", "Bác ngồi ghế cạnh cửa sổ đi ạ. Túi sách của bác nặng quá, cháu cầm cho bác."],
      ["an", "Cảm ơn cháu. Bốn mươi năm dạy văn, bác nhìn những hiệu sách thân quen khép cửa dần vì người ta thắt chặt chi tiêu. Lòng bác man mác buồn."],
      ["an", "Lương hưu của bác tháng này mua được ít hơn năm ngoái mất một phần ba. Bác dạy học trò hai chữ “đủ đầy”, mà giờ chính bác phải tính từng đồng."],
      ["host", "Còn những cuốn sách trong túi?"],
      ["an", "Bác mua những cuốn cuối cùng trước khi hiệu sách dỡ kệ. Học trò bây giờ chỉ cần bấm nút là có ngay bản tóm tắt một tác phẩm kinh điển trong vài giây. Chẳng còn mấy ai kiên nhẫn lật từng trang giấy thơm mùi mực."],
      ["@", "04:30"],
      ["an", "Có người học trò cũ nhắn cho bác, bảo “Thầy ơi, em đọc Truyện Kiều qua tóm tắt rồi, thầy giảng lại giùm em cái ý nghĩa nhé”. Bác bật cười. Bác muốn đáp: ‘nghĩa nằm ở chỗ con phải đọc.’"],
      ["host", "Cháu không rành văn chương, nhưng cháu nghĩ có những thứ chỉ hiện ra khi mình đọc chậm."],
      ["an", "Cháu nói đúng. Bác chỉ sợ rồi cũng không còn ai biết đọc chậm nữa."],
      ["?", "Mình đặt một ly nhỏ lên chiếc khăn trải bàn và mở lời với bác An.",
        ["Trong suốt bốn mươi năm đứng lớp, kỷ niệm nào về một trang sách làm thay đổi cuộc đời học trò khiến bác nhớ mãi?", "an", "Có một cậu học trò cá biệt năm xưa đã tìm thấy lẽ sống từ một câu thơ. Giờ cậu ấy là bác sĩ tận tụy. Mỗi lần gặp, cậu vẫn đọc lại câu thơ đó cho bác nghe."],
        ["Nếu hiệu sách cũ đóng cửa, bác có nghĩ tới việc lập tủ sách cộng đồng và câu lạc bộ đọc chậm ngay tại khu phố này không?", "an", "Ý tưởng tuyệt vời! Những người yêu sách giấy vẫn ở đó, chỉ cần một góc nhỏ ấm áp như quán của cháu để hội tụ!"],
        ["Đặt chén nước ấm cạnh quyển sách cũ của bác, rồi lặng lẽ lật giúp bác một trang.", "an", "Cháu lật sách rất dịu. Đã lâu lắm rồi, bác mới thấy có người lật trang không vội."]],
      ["@", "04:40"],
      ["brew", "an", "Cho bác một ly mang hương vị hoài niệm, chua ngọt thanh tao, thoảng hương hoa nhẹ như một chiều thu xưa nhé.", "Bác An nhấp một ngụm nhỏ, khẽ gật đầu: hương vị tinh tế này gợi nhớ những buổi chiều thu ngồi đàm đạo văn chương bên hiên nhà cổ."],
      ["@", "04:50"],
      ["an", "Hóa ra cái quán nhỏ này đã có đủ cả: ánh đèn vàng, tiếng mưa, và một kệ cuốn sách bỏ trống kia. Bác có thể để vài cuốn lên đó được không?"],
      ["host", "Bác cứ đặt ạ. Cháu cũng định xin bác một lá bài đọc chậm của quán, xem tối nay nó chọn câu gì."],
      ["card"],
      ["@", "05:10"],
      ["host", "Năm giờ mười rồi bác. Mưa tạnh hẳn, trời bắt đầu sáng. Cháu có một lời nhỏ gửi bác."],
      ["?", "Bác An đặt cuốn sách cuối cùng lên kệ. Mình nói điều cuối cùng.",
        ["Những hạt giống tâm hồn bác đã gieo suốt bốn mươi năm vẫn đang nở hoa trong lòng bao thế hệ học trò.", "an", "Cảm ơn cháu. Nghe cháu nói, bác thấy đời dạy học của mình thật trọn vẹn!"],
        ["Hãy biến góc nhỏ của quán Thỏ Con thành điểm hẹn đầu tiên cho tủ sách giấy cộng đồng của bác nhé!", "an", "Nhất trí! Tuần sau bác sẽ mang những cuốn sách quý nhất tới góp vào kệ sách của quán!"],
        ["Cúi đầu thật nhẹ, để bác một mình đọc nốt trang sách bên cửa sổ.", "an", "Cháu để bác đọc nốt trang sách. Bác già rồi mới biết quý những phút như thế này."]],
      ["@", "05:25"],
      ["an", "Trời sắp sáng rồi. Cảm ơn cháu vì một cuộc trò chuyện đẹp như một bài thơ."],
      ["host", "Cảm ơn bác. Bảy ly nước, bảy câu chuyện. Một tuần đầu tiên của tiệm nhỏ… đúng như mình mong."],
      ["sys", "Bác An ra về. Trên bảy chiếc ghế quanh quầy, mỗi chiếc đều còn vương hơi ấm của một người lạ. Thỏ Con ngồi xuống, ho khẽ và nhìn lên chiếc đồng hồ. Còn một tiếng rưỡi nữa là bảy giờ sáng, lúc mình có một cuộc hẹn rất sớm."]
    ]
  }
];
