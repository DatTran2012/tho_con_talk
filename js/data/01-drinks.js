"use strict";

/* -----------------------------------------------------------------------
   SECTION 2: GAME DATA CATALOGS
------------------------------------------------------------------------ */
const EMOTION_TAGS = {
  awake: { icon: "⚡", label: "Tỉnh Táo" },
  warm: { icon: "🔥", label: "Ấm Áp" },
  gentle: { icon: "🌸", label: "Dịu Dàng" },
  nostalgic: { icon: "🕰️", label: "Hoài Niệm" }
};

const DRINK_BASES = [
  { id: "phin", name: "Cà Phê Phin Đậm", icon: "☕", emotion: "awake", challengeType: "drip", desc: "Vị đắng đậm đà rang mộc, thích hợp cho đêm thức trắng." },
  { id: "coldbrew", name: "Cà Phê Ủ Lạnh", icon: "🧊", emotion: "awake", challengeType: "shaker", desc: "Thanh mát, chiết xuất chậm suốt 16 tiếng." },
  { id: "malt", name: "Rượu Mạch Nha Ấm", icon: "🥃", emotion: "warm", challengeType: "ember", desc: "Hương khói gỗ sồi ấm nồng, xua tan cái lạnh nửa đêm." },
  { id: "plum", name: "Rượu Mơ Lên Men", icon: "🍷", emotion: "nostalgic", challengeType: "fizz", desc: "Chua ngọt dịu dàng gợi nhớ những chiều cuối thu." },
  { id: "peach_tea", name: "Trà Đào Lên Men Nhẹ", icon: "🍑", emotion: "gentle", challengeType: "foam", desc: "Hương đào chín thanh tao, nhẹ nhàng xoa dịu lo âu." },
  { id: "yuzu", name: "Rượu Thanh Yên", icon: "🍋", emotion: "gentle", challengeType: "ember", desc: "Tinh dầu vỏ cam chanh thanh khiết đánh thức giác quan." },
  { id: "lotus_milk", name: "Sữa Hạt Sen Rang", icon: "🪷", emotion: "gentle", challengeType: "memory", desc: "Béo dịu, thơm mùi sen rang — công thức dài, phải nhớ đúng thứ tự từng bước." },
  { id: "brown_rice", name: "Trà Gạo Lứt Rang", icon: "🍚", emotion: "warm", challengeType: "triple", desc: "Hương cốm rang ấm bụng — phải rót ba lượt liên tiếp, mỗi lượt một nhịp." }
];

const DRINK_ACCENTS = [
  { id: "mint", name: "Lá Bạc Hà", icon: "🌿", emotion: "awake" },
  { id: "honey", name: "Mật Ong Rừng", icon: "🍯", emotion: "warm" },
  { id: "chamomile", name: "Hoa Cúc Khô", icon: "🌸", emotion: "gentle" },
  { id: "orange_peel", name: "Vỏ Cam Sấy", icon: "🍊", emotion: "nostalgic" },
  { id: "sea_salt", name: "Muối Biển Tinh", icon: "🧂", emotion: "awake" },
  { id: "nutmeg", name: "Hạt Nhục Đậu Khấu", icon: "🌰", emotion: "warm" },
  { id: "ginger", name: "Gừng Tươi Ấm", icon: "🫚", emotion: "warm" },
  { id: "jasmine", name: "Hoa Nhài Đêm", icon: "🌼", emotion: "nostalgic" },
  { id: "lemongrass", name: "Sả Tươi Đập Dập", icon: "🌾", emotion: "awake" },
  { id: "lavender", name: "Oải Hương Khô", icon: "🪻", emotion: "gentle" },
  { id: "osmanthus", name: "Hoa Quế Ngâm Đường", icon: "🏵️", emotion: "nostalgic" },
  { id: "pandan", name: "Lá Dứa Thơm", icon: "🍃", emotion: "gentle" }
];

/* Cặp hương vị "chọi nhau": chọn cả hai sẽ bị trừ điểm hợp vị */
const CLASH_PAIRS = [
  ["mint", "nutmeg"],
  ["sea_salt", "honey"],
  ["ginger", "chamomile"],
  ["jasmine", "sea_salt"],
  ["lemongrass", "lavender"],
  ["osmanthus", "mint"],
  ["orange_peel", "lavender"],
  ["pandan", "sea_salt"]
];

/* Khách không nói thẳng "tôi cần cảm xúc gì" — họ chỉ bóng gió. Người chơi phải tự đoán (hoặc hỏi thẳng, nhưng đánh đổi). */
const ORDER_RIDDLES = {
  awake: [
    "Mắt mình díp lại rồi mà đầu thì chưa chịu nghỉ… cứ như còn cả núi việc chưa làm xong.",
    "Mình cần thứ gì đó kéo mình ra khỏi cơn mơ màng, đêm còn dài lắm."
  ],
  warm: [
    "Tay mình lạnh cả ngày rồi, không hẳn vì trời… mà vì lòng cứ lạnh sao đó.",
    "Mình muốn được ai đó choàng cho một tấm chăn, kiểu vậy… nhưng ở dạng ly nước."
  ],
  gentle: [
    "Đầu mình ồn ào quá. Mình muốn mọi thứ chậm lại, nhẹ lại một chút thôi.",
    "Hôm nay mình căng như dây đàn. Cho mình thứ gì đó êm êm, đừng gắt."
  ],
  nostalgic: [
    "Chiều nay mình bỗng nhớ một mùi hương cũ… mà không nhớ nổi là của ai.",
    "Có những ngày mình chỉ muốn quay về lúc còn nhỏ, về căn bếp cũ của bà."
  ]
};

const SIGNATURE_RECIPES = [
  { id: "sig_midnight_ember", name: "Than Hồng Nửa Đêm", base: "malt", accents: ["ginger", "honey"], hint: "Rượu Mạch Nha Ấm + Gừng Tươi + Mật Ong Rừng", desc: "Thức uống trứ danh sưởi ấm những đôi vai gồng gánh giữa mùa gió." },
  { id: "sig_saigon_rain", name: "Mưa Hẻm Phin Muối", base: "phin", accents: ["sea_salt", "nutmeg"], hint: "Cà Phê Phin Đậm + Muối Biển Tinh + Nhục Đậu Khấu", desc: "Đậm đà, tỉnh táo nhưng hậu vị béo mặn đầy chiều sâu." },
  { id: "sig_amber_memory", name: "Ký Ức Mơ Vàng", base: "plum", accents: ["orange_peel", "jasmine"], hint: "Rượu Mơ Lên Men + Vỏ Cam Sấy + Hoa Nhài Đêm", desc: "Hương hoa nhài và mơ ủ đánh thức những trang nhật ký cũ." },
  { id: "sig_dawn_breeze", name: "Gió Sớm Vườn Đào", base: "peach_tea", accents: ["chamomile", "honey"], hint: "Trà Đào Lên Men + Hoa Cúc Khô + Mật Ong Rừng", desc: "Nhẹ bẫng như sương mai, xoa dịu những trái tim nhiều trăn trở." },
  { id: "sig_clear_horizon", name: "Chân Trời Thanh Yên", base: "yuzu", accents: ["mint", "chamomile"], hint: "Rượu Thanh Yên + Lá Bạc Hà + Hoa Cúc Khô", desc: "Sáng trong và tĩnh tại, giúp tâm trí nhìn rõ con đường phía trước." },
  { id: "sig_starlight_brew", name: "Ủ Lạnh Ánh Sao", base: "coldbrew", accents: ["orange_peel", "mint"], hint: "Cà Phê Ủ Lạnh + Vỏ Cam Sấy + Lá Bạc Hà", desc: "Sự kết hợp tinh tế dành cho những tâm hồn sáng tạo thức cùng thành phố." },
  { id: "sig_lotus_lullaby", name: "Ru Hồ Sen Khuya", base: "lotus_milk", accents: ["lavender", "honey"], hint: "Sữa Hạt Sen Rang + Oải Hương Khô + Mật Ong Rừng", desc: "Ngọt dịu như lời ru, dành cho những đêm đầu óc không chịu ngủ." },
  { id: "sig_second_door", secret: 1, hidden: true, name: "Ly Cánh Cửa Thứ Hai", base: "", accents: [], hint: "Chỉ pha được khi cánh cửa thứ hai mở ra", desc: "Ly nước dành cho người giữ đèn: ấm, hơi đắng, hậu ngọt. Uống thật chậm để nhớ rằng mình cũng được phép ở lại.", },
  { id: "sig_door_knock", secret: 2, hidden: true, name: "Ly Tiếng Gõ Cửa", base: "", accents: [], hint: "Chỉ pha được khi cánh cửa thứ hai mở ra", desc: "Ly nước dành cho người dám gõ cửa xin được ở lại: chua dịu, ấm nồng, hậu ngọt. Một ly để nói thật rằng: mình cần có người ngồi cùng." }
];

const DRINK_CARDS = [
  {
    id: "dc_1",
    suit: "❤️ Trái Tim",
    question: "Nếu không phải lo lắng về tiền bạc hay ánh nhìn của ai, ngày mai bạn muốn thức dậy và làm điều gì đầu tiên?",
    hostAnswers: [
      { label: "❤️ 'Thỏ Con sẽ đóng cửa quán một ngày, dắt chú mèo tam thể đi dạo dọc bờ sông lúc bình minh.'", deltaTrust: 1, deltaClarity: 0 },
      { label: "✨ 'Thỏ Con sẽ viết một cuốn sổ tổng hợp những công thức pha chế ấm áp nhất gửi tặng mọi người.'", deltaTrust: 0, deltaClarity: 1 }
    ]
  },
  {
    id: "dc_2",
    suit: "✨ Lý Trí",
    question: "Trong tất cả những gánh nặng bạn đang mang, đâu là thứ thực sự thuộc về bạn và đâu là thứ bạn đang gánh giùm người khác?",
    hostAnswers: [
      { label: "❤️ 'Trách nhiệm của Thỏ Con là giữ quầy nước luôn ấm, còn nỗi buồn của thế gian thì mình chỉ có thể lắng nghe chứ không gánh thay.'", deltaTrust: 1, deltaClarity: 0 },
      { label: "✨ 'Biết phân định ranh giới giúp Thỏ Con đủ tỉnh táo để làm điểm tựa bền bỉ qua từng mùa mưa.'", deltaTrust: 0, deltaClarity: 1 }
    ]
  },
  {
    id: "dc_3",
    suit: "🕰️ Ký Ức",
    question: "Mùi hương hay âm thanh nào của tuổi thơ khiến bạn cảm thấy an toàn ngay lập tức mỗi khi nhớ về?",
    hostAnswers: [
      { label: "❤️ 'Là mùi vỏ cam sấy khô trên bếp lửa mùa đông và tiếng ấm nước reo khe khẽ.'", deltaTrust: 1, deltaClarity: 0 },
      { label: "✨ 'Là tiếng mưa rơi đều trên mái ngói cũ — âm thanh đã truyền cảm hứng cho góc cửa sổ của quán.'", deltaTrust: 0, deltaClarity: 1 }
    ]
  },
  {
    id: "dc_4",
    suit: "🌙 Nửa Đêm",
    question: "Điều gì bạn thường nghĩ tới nhất vào lúc 2 giờ sáng nhưng chưa từng kể với người thân?",
    hostAnswers: [
      { label: "❤️ 'Lúc 2 giờ sáng, Thỏ Con hay tự hỏi những vị khách rời quán đêm qua giờ này đã ngủ yên giấc chưa.'", deltaTrust: 1, deltaClarity: 0 },
      { label: "✨ 'Thỏ Con thường suy ngẫm xem làm sao để góc quán nhỏ này mãi giữ được sự bình yên trước mọi đổi thay.'", deltaTrust: 0, deltaClarity: 1 }
    ]
  },
  {
    id: "dc_5",
    suit: "🧭 La Bàn",
    question: "Giữa một thế giới cái gì cũng có thể làm tự động, điều gì ở bản thân bạn mà không cỗ máy nào thay thế được?",
    hostAnswers: [
      { label: "❤️ 'Máy móc pha được vị ngon chuẩn xác, nhưng không thể nhớ rằng hôm nay bạn vừa đi qua một ngày mệt mỏi.'", deltaTrust: 1, deltaClarity: 0 },
      { label: "✨ 'Sự đồng cảm có chủ đích và khả năng đặt đúng câu hỏi vào đúng khoảnh khắc là điều thuộc về trái tim con người.'", deltaTrust: 0, deltaClarity: 1 }
    ]
  },
  {
    id: "dc_6",
    suit: "☕ Hơi Ấm",
    question: "Lần gần nhất có ai đó làm một việc nhỏ bé cho bạn mà khiến bạn nhớ mãi là khi nào?",
    hostAnswers: [
      { label: "❤️ 'Là khi một vị khách lặng lẽ để lại chiếc khăn len đan tay trên ghế trước lúc rời quán sáng sớm.'", deltaTrust: 1, deltaClarity: 0 },
      { label: "✨ 'Là những tấm bưu thiếp bình minh gửi về báo tin mọi người đã vượt qua giai đoạn khó khăn.'", deltaTrust: 0, deltaClarity: 1 }
    ]
  },
  {
    id: "dc_7",
    suit: "🌱 Hy Vọng",
    question: "Nếu được gửi một lời nhắn cho chính mình của 3 năm tới, bạn sẽ viết câu gì?",
    hostAnswers: [
      { label: "❤️ 'Mong bạn vẫn giữ được trái tim mềm mại để rung động trước từng câu chuyện nhỏ nơi góc hẻm.'", deltaTrust: 1, deltaClarity: 0 },
      { label: "✨ 'Cảm ơn vì đã kiên trì giữ ngọn đèn quán sáng qua những mùa mưa nhiều biến động nhất.'", deltaTrust: 0, deltaClarity: 1 }
    ]
  },
  {
    id: "dc_8",
    suit: "🌧️ Mưa Đêm",
    question: "Cơn bão lớn nhất bạn từng đi qua đã dạy cho bạn bài học quý giá nào?",
    hostAnswers: [
      { label: "❤️ 'Đêm tối nhất năm xưa dạy Thỏ Con rằng chỉ một tách trà ấm từ người lạ cũng đủ cứu rỗi một tâm hồn lạc hướng.'", deltaTrust: 1, deltaClarity: 0 },
      { label: "✨ 'Mọi cơn bão đều có điểm dừng, và sự bình tĩnh chính là chiếc neo vững chắc nhất.'", deltaTrust: 0, deltaClarity: 1 }
    ]
  },
  {
    id: "dc_9",
    suit: "🕯️ Ánh Nến",
    question: "Khi mọi ánh đèn sân khấu tắt đi, bạn muốn được nhớ đến là một người như thế nào?",
    hostAnswers: [
      { label: "❤️ 'Chỉ cần được nhớ là một người bạn biết lắng nghe không phán xét giữa nửa đêm là đủ.'", deltaTrust: 1, deltaClarity: 0 },
      { label: "✨ 'Là người giữ một trạm dừng chân tử tế giúp mọi người tự tìm thấy câu trả lời của riêng mình.'", deltaTrust: 0, deltaClarity: 1 }
    ]
  },
  {
    id: "dc_10",
    suit: "📖 Trang Sách",
    question: "Có một lời xin lỗi hay lời cảm ơn nào bạn vẫn còn nợ một người cũ không?",
    hostAnswers: [
      { label: "❤️ 'Thỏ Con luôn biết ơn người chủ tiệm trà năm xưa đã cho mình trú mưa — quán nhỏ này chính là lời cảm ơn tiếp nối.'", deltaTrust: 1, deltaClarity: 0 },
      { label: "✨ 'Biết trân trọng những người đã đi qua đời mình giúp ta sống trọn vẹn hơn với hiện tại.'", deltaTrust: 0, deltaClarity: 1 }
    ]
  },
  {
    id: "dc_11",
    suit: "⚡ Bước Ngoặt",
    question: "Nếu cánh cửa cũ đang khép lại, bạn nghĩ cuộc đời đang chuẩn bị mở ra cho bạn cánh cửa nào?",
    hostAnswers: [
      { label: "❤️ 'Mỗi khi một vị khách khép cánh cửa cũ của nỗi buồn, một chương mới ấm áp lại mở ra.'", deltaTrust: 1, deltaClarity: 0 },
      { label: "✨ 'Khi nhịp sống cũ thay đổi, cánh cửa của sự sáng tạo và kết nối sâu sắc đang mở rộng.'", deltaTrust: 0, deltaClarity: 1 }
    ]
  },
  {
    id: "dc_12",
    suit: "🏡 Mái Nhà",
    question: "Với bạn, hai chữ 'bình yên' có hình dáng và âm thanh như thế nào?",
    hostAnswers: [
      { label: "❤️ 'Là tiếng mèo tam thể thở đều trên quầy gỗ và ánh đèn vàng hắt qua ô cửa kính đọng sương.'", deltaTrust: 1, deltaClarity: 0 },
      { label: "✨ 'Là khi tâm trí không còn vội vã, ngồi thưởng thức một ly nước ấm trọn vẹn từng giây.'", deltaTrust: 0, deltaClarity: 1 }
    ]
  },
  {
    id: "dc_13",
    suit: "🎨 Sáng Tạo",
    question: "Thứ gì bạn từng làm bằng cả đôi tay và sự kiên nhẫn khiến bạn tự hào nhất?",
    hostAnswers: [
      { label: "❤️ 'Chính là tự tay đóng từng tấm ván quầy gỗ thông và gây dựng góc quán nhỏ này từ con số không.'", deltaTrust: 1, deltaClarity: 0 },
      { label: "✨ 'Là việc tìm tòi cân bằng từng giọt cốt nước và thảo mộc để tạo nên 7 công thức độc quyền.'", deltaTrust: 0, deltaClarity: 1 }
    ]
  },
  {
    id: "dc_14",
    suit: "🤝 Đồng Hành",
    question: "Bạn thích được lắng nghe trong im lặng hay được nhận một lời khuyên thẳng thắn hơn?",
    hostAnswers: [
      { label: "❤️ 'Đôi khi chỉ cần một người ngồi cạnh trong im lặng ấm áp là trái tim đã tự biết cách chữa lành.'", deltaTrust: 1, deltaClarity: 0 },
      { label: "✨ 'Lắng nghe trước để thấu hiểu, rồi mới góp một góc nhìn thẳng thắn khi người đối diện đã sẵn sàng.'", deltaTrust: 0, deltaClarity: 1 }
    ]
  },
  {
    id: "dc_15",
    suit: "🌅 Bình Minh",
    question: "Điều nhỏ bé nào khiến bạn vẫn tin rằng ngày mai rồi sẽ tốt đẹp hơn?",
    hostAnswers: [
      { label: "❤️ 'Là thấy những vị khách bước vào quán với đôi vai trĩu nặng nhưng lúc ra về luôn nở nụ cười nhẹ nhõm.'", deltaTrust: 1, deltaClarity: 0 },
      { label: "✨ 'Là tia nắng sớm luôn xuất hiện sau mỗi đêm mưa dài, không bao giờ lỗi hẹn.'", deltaTrust: 0, deltaClarity: 1 }
    ]
  },
  {
    id: "dc_16",
    suit: "🔑 Chìa Khóa",
    question: "Ngay lúc này, bạn cần cho phép bản thân buông bỏ áp lực nào nhất?",
    hostAnswers: [
      { label: "❤️ 'Buông bỏ suy nghĩ rằng mình phải làm hài lòng tất cả mọi người — chỉ cần chân thành là đủ.'", deltaTrust: 1, deltaClarity: 0 },
      { label: "✨ 'Buông bỏ sự vội vã để tận hưởng từng cuộc trò chuyện như một món quà.'", deltaTrust: 0, deltaClarity: 1 }
    ]
  },
  {
    id: "dc_17",
    hidden: true,
    suit: "🚪 Cánh Cửa Thứ Hai",
    lockedHint: "🔒 Lá bài ẩn — chỉ hiện ra trong một đêm rất đặc biệt.",
    question: "Người giữ đèn cũng cần có người giữ đèn cho mình. Bạn sẽ để ai bước qua cánh cửa thứ hai của bạn?",
    hostAnswers: [
      { label: "❤️ 'Thỏ Con sẽ mở cửa và nói: Mình mệt rồi, vào ngồi với mình một lát nhé.'", deltaTrust: 1, deltaClarity: 0 },
      { label: "✨ 'Thỏ Con sẽ học cách nhờ giúp đỡ, vì nhận cũng là một cách yêu thương.'", deltaTrust: 0, deltaClarity: 1 }
    ]
  }
];
