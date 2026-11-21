"use strict";

const SOLO_ENDINGS_DATA = {
  vy: {
    heart: { title: "Ngòi Bút Giữ Lửa Nhân Văn", summary: "Vy giữ trọn trái tim nhiệt huyết với nghề báo, tiếp tục đi khắp phố đêm ghi lại những câu chuyện người thật việc thật chạm tới trái tim độc giả.", radioNews: "Loạt phóng sự 'Những Ánh Đèn Không Tắt' của phóng viên trẻ Vy đang nhận được sự đồng cảm lớn từ cộng đồng." },
    mind: { title: "Người Tiên Phong Báo Chí Thực Địa", summary: "Vy xây dựng thành công kênh phóng sự độc lập kết hợp dữ liệu và phỏng vấn sâu, tạo nên thương hiệu cá nhân không thuật toán nào thay thế được.", radioNews: "Kênh báo chí thực địa độc lập do cây bút trẻ Vy sáng lập vừa cán mốc 100.000 độc giả trung thành." },
    silent: { title: "Thanh Âm Từ Sự Lắng Nghe", summary: "Khoảng lặng bình yên tại quán giúp Vy nhận ra sức mạnh của việc lắng nghe trọn vẹn trước khi đặt bút viết nên sự thật.", radioNews: "Một podcast thu âm tiếng nói người lao động thành phố do Vy thực hiện đang trở thành điểm tựa tinh thần mỗi tối." }
  },
  minh: {
    heart: { title: "Lập Trình Viên Có Trái Tim Ấm", summary: "Minh tìm lại sự cân bằng giữa công việc và cuộc sống, bắt đầu xây dựng những ứng dụng tình nguyện kết nối cộng đồng trong mùa khó khăn.", radioNews: "Ứng dụng kết nối bữa cơm từ thiện miễn phí do kỹ sư trẻ Minh phát triển vừa giúp đỡ hàng trăm gia đình." },
    mind: { title: "Kiến Trúc Sư Công Nghệ Nhân Bản", summary: "Minh thuyết phục thành công công ty chuyển hướng từ tự động hóa cắt giảm sang công cụ trợ giúp nâng cao năng lực và bảo vệ người lao động.", radioNews: "Mô hình 'Trí Tuệ Nhân Tạo Đồng Hành Cùng Con Người' do kỹ sư Minh đề xuất vừa được vinh danh." },
    silent: { title: "Khoảng Nghỉ Giữa Những Dòng Mã", summary: "Trong sự tĩnh lặng không phán xét bên quầy gỗ, Minh tự tháo gỡ nút thắt tâm lý và tìm lại niềm vui thuần khiết khi sáng tạo.", radioNews: "Nhóm kỹ sư trẻ tại thành phố vừa tổ chức chuỗi buổi trò chuyện sức khỏe tinh thần ngành công nghệ." }
  },
  linh: {
    heart: { title: "Trang Bản Thảo Bìa Đỏ", summary: "Chị Linh kiên trì viết tiếp cuốn tiểu thuyết về những người thức khuya ở thành phố, giữ trọn vẻ đẹp thuần khiết của văn chương.", radioNews: "Cuốn tản văn 'Những Ngọn Đèn Hẻm Nhỏ' của tác giả Linh vừa ra mắt và chạm tới trái tim nhiều bạn đọc." },
    mind: { title: "Người Giữ Lửa Xuất Bản Độc Lập", summary: "Chị Linh chuyển sang biên tập cho một nhà xuất bản sách nghệ thuật độc lập, khẳng định giá trị của những tác phẩm có chiều sâu.", radioNews: "Tủ sách văn chương độc lập do biên tập viên Linh phụ trách đang tạo dấu ấn mới mẻ trên thị trường sách." },
    silent: { title: "Dòng Chữ Nở Hoa Trong Tĩnh Lặng", summary: "Sự đồng hành lặng lẽ của Thỏ Con giúp chị Linh tìm lại nhịp thở riêng cho ngòi bút giữa thành phố hối hả.", radioNews: "Những buổi đọc sách tối thứ Bảy tại một hiệu sách nhỏ đang thu hút đông đảo người yêu văn chương." }
  },
  tuan: {
    heart: { title: "Người Cha Vững Chãi Giữa Mưa Đêm", summary: "Anh Tuấn tiếp tục chặng đường với niềm tự hào sâu sắc về gia đình nhỏ, luôn giữ nụ cười ấm áp trên mọi cung đường.", radioNews: "Câu chuyện đẹp về người tài xế đêm trả lại tài sản đánh rơi cho hành khách đang lan tỏa năng lượng tích cực." },
    mind: { title: "Tổ Trưởng Kỹ Thuật Xưởng Xanh", summary: "Anh Tuấn trở lại với nghề cơ khí sở trường tại một trung tâm bảo trì xe điện hiện đại, mang lại thu nhập ổn định cho gia đình.", radioNews: "Nhiều thợ cơ khí lành nghề đang chuyển đổi thành công sang lĩnh vực bảo trì phương tiện giao thông xanh." },
    silent: { title: "Chặng Dừng Chân Ấm Áp", summary: "Một tách nước ấm trong im lặng đủ tiếp thêm sức mạnh để người tài xế đêm vững tay lái qua mọi cơn mưa.", radioNews: "Các trạm dừng chân miễn phí dành cho tài xế chạy đêm đang được nhân rộng tại nhiều tuyến phố." }
  },
  khang: {
    heart: { title: "Mũi Chỉ Sáp Ong Vẹn Nguyên", summary: "Anh Khang cùng 12 người thợ giữ trọn ngọn lửa nghề thủ công truyền thống bằng sự tỉ mỉ và tình anh em gắn bó.", radioNews: "Xưởng đồ da thủ công của nghệ nhân Khang vừa tổ chức triển lãm tôn vinh những người thợ lành nghề." },
    mind: { title: "Trải Nghiệm Chế Tác Độc Bản", summary: "Anh Khang mở thành công các lớp trải nghiệm làm đồ da thủ công cuối tuần, biến xưởng nhỏ thành điểm đến văn hóa hút khách.", radioNews: "Mô hình kết hợp xưởng thủ công truyền thống và trải nghiệm sáng tạo đang thu hút đông đảo bạn trẻ." },
    silent: { title: "Hơi Ấm Của Đôi Bàn Tay Thợ", summary: "Khoảng lặng bên quầy gỗ giúp anh Khang tìm lại sự điềm tĩnh và niềm tin vững chắc vào giá trị bền bỉ của thời gian.", radioNews: "Các sản phẩm thủ công bền vững đang dần lấy lại vị thế trong lòng người tiêu dùng." }
  },
  hoa: {
    heart: { title: "Bữa Cơm Ấm Hai Thế Hệ", summary: "Cô Hoa mở lòng trò chuyện cùng con trai bằng sự dịu dàng của một người mẹ, xóa tan khoảng cách thế hệ trong gia đình.", radioNews: "Nhiều gia đình chia sẻ bí quyết gắn kết cha mẹ và con cái thông qua những bữa cơm trò chuyện không thiết bị điện tử." },
    mind: { title: "Người Phụ Nữ Làm Chủ Kỷ Nguyên Mới", summary: "Cô Hoa cùng con trai học cách ứng dụng phần mềm hiện đại vào công việc kế toán, trở thành nhân sự nòng cốt đầy tự tin.", radioNews: "Phong trào học tập kỹ năng số liên thế hệ trong gia đình đang giúp nhiều lao động trung niên vững vàng hơn." },
    silent: { title: "Giấc Ngủ Bình Yên Sau Đêm Mưa", summary: "Tách trà hoa cúc ấm áp và sự lắng nghe dịu dàng đã xua tan mọi nỗi lo âu của người mẹ tận tụy.", radioNews: "Các góc thư giãn trà thảo mộc đang trở thành điểm đến yêu thích giúp cân bằng nhịp sống đô thị." }
  },
  an: {
    heart: { title: "Người Gieo Hạt Tâm Hồn", summary: "Bác An tiếp tục truyền tình yêu văn chương và sự tử tế cho thế hệ trẻ bằng giọng đọc trầm ấm đầy cảm xúc.", radioNews: "Buổi giao lưu thơ ca của thầy giáo nghỉ hưu An đã thu hút hàng trăm học trò cũ và bạn trẻ tham dự." },
    mind: { title: "Tủ Sách Cộng Đồng Cuối Hẻm", summary: "Bác An cùng Thỏ Con gây dựng thành công góc đọc sách giấy cộng đồng ngay tại quán, lưu giữ kho tàng tri thức sống động.", radioNews: "Góc đọc sách giấy cộng đồng tại một tiệm nước nửa đêm đang trở thành điểm sáng văn hóa của khu phố." },
    silent: { title: "Bài Thơ Giữa Đêm Tĩnh Lặng", summary: "Trong sự tĩnh tại trước bình minh, hai tâm hồn đồng điệu cùng trân trọng vẻ đẹp vượt thời gian của chữ nghĩa.", radioNews: "Nhiều bạn trẻ đang quay trở lại với thói quen đọc sách giấy và viết nhật ký tay." }
  }
};

const ENDING_PATH_LABELS = {
  heart: { icon: "❤️", name: "Nhánh Giữ Lửa Trái Tim" },
  mind: { icon: "✨", name: "Nhánh Chuyển Mình Lý Trí" },
  silent: { icon: "🤫", name: "Nhánh Khoảng Lặng Chữa Lành" },
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
