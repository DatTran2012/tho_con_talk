"use strict";

const SOLO_ENDINGS_DATA = {
  vy: {
    heart: { title: "Giọng Của Chính Mình", summary: "Vy gửi lá thư trả lời tòa soạn: cô nhận vị trí với một điều kiện, mỗi bài phải do một người thật viết và một người thật đọc. Dù tòa soạn còn do dự, cô vẫn đi tiếp bằng chiếc máy ghi âm của mình.", radioNews: "Phóng viên trẻ Vy mở loạt 'Giọng Người', ghi lại những người ít được lắng nghe nhất của thành phố đêm." },
    mind: { title: "Chuyên Mục Một Người Một Tháng", summary: "Vy nhận vị trí biên tập viên, đồng thời thương lượng được một chuyên mục dài hơi riêng: mỗi tháng một nhân vật, không dùng máy viết. Thu nhập ổn định và những câu chuyện chậm cùng tồn tại.", radioNews: "Chuyên mục 'Một Người Một Tháng' của biên tập viên trẻ Vy ra số đầu tiên, kể về bác bán vé số cuối phố." },
    silent: { title: "Câu Trả Lời Trong Đầu", summary: "Không ai nói thay, Vy ngồi nghe mưa nhỏ dần và tự hỏi: nếu lối nào cũng có thứ phải bỏ lại, thì thứ mình sợ mất nhất là gì? Lúc rời quán cô vẫn chưa trả lời được, nhưng lần đầu tiên không thấy vội.", radioNews: "Một cô phóng viên trẻ bỏ dở lá thư trả lời trên điện thoại đêm qua. Người ta thấy cô đi bộ rất lâu, và không ai biết cô đã gửi hay chưa." },
  },
  minh: {
    heart: { title: "Từ Chối Một Chữ Ký", summary: "Minh từ chối ký vào kế hoạch cắt giảm sáu mươi người. Anh chưa biết công ty sẽ đáp lại ra sao, nhưng đêm đó anh ngủ một giấc yên lần đầu sau nhiều tháng, chú vịt cao su vẫn nằm trong túi áo.", radioNews: "Một kỹ sư trưởng nhóm gây chú ý khi từ chối kế hoạch cắt giảm nhân sự và đề nghị công ty tìm giải pháp khác." },
    mind: { title: "Mô Hình Đào Tạo Lại", summary: "Minh nộp bản đề xuất đào tạo lại nhân viên thay vì cắt giảm, kèm số liệu của cô Hoa và dữ liệu thực địa của anh Tuấn. Ban giám đốc đồng ý thử nghiệm với nhóm đầu tiên.", radioNews: "Một công ty công nghệ vừa thử chương trình đào tạo lại thay cho kế hoạch cắt giảm, theo đề xuất của một kỹ sư trẻ." },
    silent: { title: "Tiếng Quẹc Của Chú Vịt", summary: "Minh nghe một tiếng 'quẹc' rất nhỏ từ chú vịt cao su và bật cười, rồi thôi cười. Anh vẫn chưa quyết giữa giữ nghề và giữ người, chỉ biết đêm nay mình không phải trả lời một mình.", radioNews: "Chú vịt cao su trên bàn làm việc của một kỹ sư trẻ được thấy nằm ngửa, như đang chờ ai đó quyết định." },
  },
  linh: {
    heart: { title: "Ngọn Đèn Cho Người Nhớ Mẹ", summary: "Sau buổi đọc chậm, chị Linh hiểu cuốn sách của mình đã thành một ngọn đèn nhỏ giữa quán. Chị bắt đầu cuốn thứ hai, viết cho những ai từng muốn giữ lại một chiếc áo cũ của mẹ.", radioNews: "Cuốn sách của biên tập viên Linh được nhiều người đọc lại trong các buổi đọc chậm tại quán nhỏ cuối hẻm." },
    mind: { title: "Sách Nói Giọng Người Thật", summary: "Chị Linh cùng bác An thu bản sách nói bằng giọng người thật, gửi về cho mẹ chị và những cụ mắt kém. Chỗ giọng nghẹn ở đoạn đầu được giữ nguyên, không ai cắt đi.", radioNews: "Bản sách nói do một ông giáo già đọc bằng giọng thật vừa được gửi tới hàng chục cụ cao tuổi trong khu phố." },
    silent: { title: "Trang Chữ Lắng Lại", summary: "Sau buổi đọc, chị Linh ngồi lại với những trang sách. Chị nghe nhịp thở của mình chậm lại và tự hỏi liệu một người quen cầm bút đỏ có dám viết một câu mà không ai sửa. Trang đầu của cuốn thứ hai vẫn trắng.", radioNews: "Biên tập viên Linh nói với độc giả: 'Cuốn tiếp theo sẽ ra khi tôi viết được một câu mà chính tôi không muốn gạch.'" },
  },
  tuan: {
    heart: { title: "Cổng Trường Mỗi Chiều", summary: "Anh Tuấn nhận vị trí tổ phó kỹ thuật và về nhà vào buổi tối. Việc đầu tiên anh làm là đứng ở cổng trường đón hai đứa nhỏ, còn tờ giấy siêu nhân được dán lên tường bếp.", radioNews: "Một tổ phó kỹ thuật mới của xưởng xe điện xin tan ca đúng giờ để đón con, và đồng nghiệp bắt đầu làm theo." },
    mind: { title: "Bảng Chi Tiêu Hai Chữ Ký", summary: "Anh Tuấn nhận việc tổ phó, chạy giao hàng cuối tuần vài tháng đầu rồi giảm dần theo bảng chi tiêu lập cùng cô Hoa. Mọi thứ khớp từng con số, và đến cuối quý anh nghỉ hẳn chạy đêm.", radioNews: "Một tài xế giao hàng đêm cùng kế toán hưu trí lập 'bảng chuyển nghề', và nó đang được nhiều người xin mẫu." },
    silent: { title: "Ngồi Cạnh Tờ Giấy", summary: "Anh Tuấn ngồi cạnh tờ giấy siêu nhân đến lúc quán sắp đóng cửa. Anh biết mình muốn về ngủ cùng hai đứa nhỏ, nhưng cũng biết nghề xe đêm là thứ nuôi chúng. Anh chưa nhận việc, cũng chưa từ chối.", radioNews: "Một chiếc xe giao hàng đỗ ở đầu hẻm đến gần sáng, đèn tắt, người trong xe chưa xuống." },
  },
  khang: {
    heart: { title: "Mười Hai Chiếc Ghế Trong Xưởng", summary: "Xưởng giữ trọn mười hai người thợ. Anh Khang nhận ra mình không còn phải gánh một mình: đã có cô Hoa giữ sổ, và trong túi cô có chiếc ví khắc tên 'người giữ sổ'.", radioNews: "Xưởng da thủ công cuối hẻm giữ nguyên cả mười hai người thợ qua mùa khó khăn nhờ một cuốn sổ chi tiêu minh bạch." },
    mind: { title: "Lớp Học Ba Buổi Da Và Sổ Sách", summary: "Anh Khang và cô Hoa mở một lớp ba buổi: sáng dạy cắt da, chiều dạy ghi sổ. Xưởng có thêm khách trải nghiệm mà vẫn giữ nguyên nghề.", radioNews: "Lớp học ba buổi 'Da Và Sổ Sách' tại xưởng thủ công cuối hẻm kín chỗ ngay tuần đầu." },
    silent: { title: "Hơi Ấm Của Đôi Bàn Tay Thợ", summary: "Anh Khang nhìn cô Hoa mân mê chiếc ví mới mà không nói gì. Có những lời cảm ơn anh muốn nói, và có những điều anh chưa biết mình đủ sức giữ không. Mũi chỉ cuối cùng vẫn chưa khâu.", radioNews: "Một nghệ nhân đồ da cuối hẻm ngồi rất lâu bên bàn thợ, cây kim vẫn cầm trên tay, chưa xuống mũi nào." },
  },
  hoa: {
    heart: { title: "Người Giữ Sổ Của Cả Xưởng", summary: "Chiếc ví khắc tên 'Hoa — người giữ sổ' khiến cô Hoa thấy mình có chỗ đứng. Cô nhận cố vấn sổ sách cho xưởng, và bữa cơm cô nấu bắt đầu có thêm người ngồi.", radioNews: "Một kế toán hưu trí nhận làm cố vấn sổ sách cho xưởng da cuối hẻm, và thường mang theo cả nồi canh cho các thợ." },
    mind: { title: "Lớp Học Đầy Thợ Thủ Công", summary: "Cô Hoa dạy ghi sổ cho thợ thủ công từng bước một, như cô từng làm suốt hai mươi năm. Một năm nữa, cô muốn lớp học đầy ắp.", radioNews: "Lớp 'Sổ Sách Cho Thợ Thủ Công' do một kế toán lâu năm giảng dạy vừa nhận thêm học viên." },
    silent: { title: "Giấc Ngủ Bình Yên Sau Đêm Mưa", summary: "Cô Hoa ngồi giữa những người cùng giữ một cái nghề và thấy ấm lên. Nhưng về tới nhà, cô vẫn bày bộ chén đũa thứ hai ra bàn, rồi đứng đó, chưa biết nên cất đi hay để lại.", radioNews: "Đèn nhà cô Hoa trong hẻm sáng gần tới sáng. Có người thấy cô đứng ở cửa bếp, tay cầm hai đôi đũa." },
  },
  an: {
    heart: { title: "Giọng Đọc Của Một Ông Giáo Già", summary: "Lần đầu tiên bác An đọc thành tiếng cho cả một căn phòng, giọng nghẹn ở đoạn đầu mà không thấy ngượng. Bác nhận ra kể chuyện không cần hoàn hảo, chỉ cần thật.", radioNews: "Một buổi đọc chậm tại quán nhỏ cuối hẻm khiến nhiều người trẻ lau mắt khi nghe một ông giáo già đọc." },
    mind: { title: "Tủ Sách Giấy Cuối Hẻm", summary: "Bác An nhận làm giọng đọc cho sách nói và mở thêm một tủ sách giấy cuối hẻm. Một bạn trẻ hỏi sách giấy còn tương lai không, bác đáp: còn, chừng nào còn người biết đọc chậm.", radioNews: "Tủ sách giấy cuối hẻm do một thầy giáo hưu trí lập nên đã có hơn hai trăm cuốn cho mượn miễn phí." },
    silent: { title: "Bài Thơ Giữa Đêm Tĩnh Lặng", summary: "Khi mọi người đã tản, bác An ngồi lại bên cửa sổ, nhẩm một bài thơ cũ rất khẽ, chỉ đủ cho chú mèo nghe. Bác nghĩ tới lá thư chưa gửi trong túi áo và tự hỏi liệu đêm nay có phải là đêm để dán tem.", radioNews: "Một bài thơ không tên được nghe thấy ở quán nhỏ lúc gần sáng. Không ai biết ai đã đọc, và có lá thư nào đó vẫn đang chờ được gửi." },
  },
};

const ENDING_PATH_LABELS = {
  heart: { icon: "❤️", name: "Nhánh Giữ Lửa Trái Tim" },
  mind: { icon: "✨", name: "Nhánh Chuyển Mình Lý Trí" },
  silent: { icon: "🤫", name: "Nhánh Khoảng Lặng Bỏ Ngỏ" },
  duo: { icon: "🤝", name: "Giao Thoa Đồng Điệu Trái Tim" },
  duo_mind: { icon: "🚀", name: "Giao Thoa Liên Minh Sáng Tạo" }
};

const SHIFT_MODES = [
  { id: "standard", order: 0, icon: "🌧️", name: "Tháng Mưa Bốn Chương", desc: "Bốn tuần, bảy đêm mỗi tuần: Gặp Gỡ → Trở Lại → Hiện Tại → Tương Lai. Mỗi đêm là một câu chuyện riêng, có từ một đến ba vị khách." }
];

const STORY_CHAPTERS = [
  { no: 1, icon: "🌧️", name: "Gặp Gỡ", desc: "Bảy vị khách bước vào tiệm lần đầu." },
  { no: 2, icon: "🔁", name: "Trở Lại", desc: "Họ quay lại — đôi khi cùng nhau." },
  { no: 3, icon: "⏳", name: "Hiện Tại", desc: "Giữa cơn bão giá cả, trí tuệ nhân tạo và suy thoái." },
  { no: 4, icon: "🌅", name: "Tương Lai", desc: "Mỗi người đứng trước một ngã rẽ và chọn đường đi tiếp." }
];
