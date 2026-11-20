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
  { id: "standard", order: 0, icon: "🌧️", name: "Tháng Mưa Giao Thoa", desc: "Chặng 1: Cân bằng giữa đêm đơn khách, đêm song khách giao thoa và khách quay lại Chương 2." },
  { id: "duo_fest", order: 1, icon: "👥", name: "Tháng Hội Ngộ Đa Chiều", desc: "Chặng 2: Tăng cường các đêm song khách giao thoa để khám phá mọi sợi dây kết nối." },
  { id: "midnight_mysteries", order: 2, icon: "🕯️", name: "Tháng Khuya Khoắt Bí Ẩn", desc: "Chặng 3: Mỗi đêm đều xảy ra Sự Kiện Nửa Đêm bất ngờ giữa tiếng mưa khuya." }
];

const MIDNIGHT_ENCOUNTERS = [
  {
    id: "me_blackout",
    title: "🕯️ Cúp Điện Hẻm Khuya & Ánh Nến Sáp Ong",
    prompt: "01:45 sáng. Cả con hẻm bất ngờ mất điện, ánh đèn neon tắt phụt. Bạn thắp lên ngọn nến sáp ong đặt giữa quầy gỗ...",
    choices: [
      { label: "❤️ 'Trong bóng tối, người ta không cần phải cố tỏ ra mạnh mẽ nữa.'", deltaTrust: 1, deltaClarity: 0, reply: "Ánh nến hắt lên đôi mắt vị khách một quầng sáng dịu dàng — tiếng thở dài nặng nề suốt cả ngày bỗng tan biến." },
      { label: "✨ 'Đôi khi tắt bớt ánh sáng nhân tạo mới giúp ta nhìn rõ phương hướng thật sự.'", deltaTrust: 0, deltaClarity: 1, reply: "Vị khách mỉm cười gật đầu trong ánh nến ấm, tâm trí trở nên sáng tỏ lạ thường." }
    ]
  },
  {
    id: "me_wrong_call",
    title: "📞 Cuộc Gọi Nhầm Số Lúc 02:15",
    prompt: "Chiếc điện thoại bàn cũ trên kệ bỗng reo vang. Đầu dây bên kia là giọng một người lạ đứng trú mưa ở trạm xe buýt gọi nhầm số...",
    choices: [
      { label: "❤️ Dịu dàng trò chuyện vài câu chúc người lạ bình an về tới nhà.", deltaTrust: 1, deltaClarity: 0, reply: "Vị khách ngồi trước quầy nghe thấy liền mỉm cười ấm áp: 'Chỉ một cuộc gọi nhầm số mà quán cũng đối xử tử tế đến vậy...'" },
      { label: "✨ Chỉ dẫn tuyến xe buýt đêm cuối cùng đang chạy qua đại lộ gần đó.", deltaTrust: 0, deltaClarity: 1, reply: "Người đầu dây bên kia rối rít cảm ơn; vị khách trong quán cũng gật gù trân trọng sự chu đáo của Thỏ Con." }
    ]
  },
  {
    id: "me_cat_ticket",
    title: "🐱 Mèo Tam Thể Tha Về Tấm Vé Tàu Cũ",
    prompt: "Chú mèo tam thể nhảy phóc lên quầy, thả xuống trước mặt khách một tấm vé tàu hỏa cũ đã phai màu mực...",
    choices: [
      { label: "❤️ 'Chắc chú mèo muốn nhắc chúng ta nhớ về chuyến đi vô tư nhất thời trẻ.'", deltaTrust: 1, deltaClarity: 0, reply: "Vị khách khẽ vuốt lưng chú mèo và kể lại kỷ niệm tuổi thơ trong trẻo mà bấy lâu đã quên mất." },
      { label: "✨ 'Mỗi chuyến tàu đều có ga dừng để kiểm tra lại hành lý trước khi đi tiếp.'", deltaTrust: 0, deltaClarity: 1, reply: "Vị khách nhìn tấm vé cũ rồi mỉm cười: 'Đúng vậy, mình cần bỏ bớt những gánh nặng không thuộc về mình.'" }
    ]
  },
  {
    id: "me_old_radio",
    title: "📻 Tần Số Radio Từ Mười Năm Trước",
    prompt: "Bạn khẽ xoay núm dò sóng trên chiếc radio cổ — bất ngờ vang lên bản thu thanh cũ về một tiệm nước từng mở cửa suốt mùa khủng hoảng năm xưa...",
    choices: [
      { label: "❤️ 'Thời đại nào cũng có những cơn bão, nhưng lòng tốt của con người thì chưa từng cũ.'", deltaTrust: 1, deltaClarity: 0, reply: "Giai điệu xưa cũ hòa cùng tiếng mưa khiến cả góc quán lắng lại đầy xúc động." },
      { label: "✨ 'Lịch sử luôn lặp lại theo vòng xoáy, và con người luôn tìm được cách thích nghi.'", deltaTrust: 0, deltaClarity: 1, reply: "Vị khách gật gù suy ngẫm, nỗi hoang mang trước biến động thời cuộc vơi đi một nửa." }
    ]
  },
  {
    id: "me_stray_postcard",
    title: "📮 Phong Thư Không Tên Dưới Khe Cửa",
    prompt: "Một cơn gió lùa đẩy qua khe cửa gỗ một phong thư nhỏ chỉ vỏn vẹn dòng chữ: 'Gửi người đang thức lúc nửa đêm: bạn đã làm rất tốt rồi.'",
    choices: [
      { label: "❤️ Đưa lá thư cho vị khách đọc cùng như một lời nhắn gửi từ thành phố.", deltaTrust: 1, deltaClarity: 0, reply: "Đôi mắt vị khách rưng rưng khi đọc dòng chữ viết tay mộc mạc ấy." },
      { label: "✨ Ghim lá thư lên bảng gỗ để tiếp sức cho tất cả những vị khách ghé sau.", deltaTrust: 0, deltaClarity: 1, reply: "Vị khách mỉm cười tán thành: 'Những điều tử tế nhỏ bé được lưu giữ lại sẽ tạo nên sức mạnh lớn.'" }
    ]
  },
  {
    id: "me_herbal_sample",
    title: "🍵 Chén Trà Hoa Cúc Thử Nghiệm",
    prompt: "Trong lúc chờ nước sôi, Thỏ Con rót mời khách một chén trà hoa cúc mật ong vừa ủ thử nghiệm...",
    choices: [
      { label: "❤️ 'Uống một ngụm ấm trước đã, chuyện công việc để sau hẵng tính.'", deltaTrust: 1, deltaClarity: 0, reply: "Hương hoa cúc thanh mát làm dịu ngay cổ họng khô rát của vị khách." },
      { label: "✨ 'Hương vị tinh tế cần thời gian ủ chậm — suy nghĩ thấu đáo cũng vậy.'", deltaTrust: 0, deltaClarity: 1, reply: "Vị khách nhấp từng ngụm nhỏ, nhịp thở chậm rãi và điềm tĩnh trở lại." }
    ]
  }
];
