"use strict";

const DUO_PAIRINGS = {
  vy_an: {
    id: "vy_an",
    guests: ["vy", "an"],
    script: {
      intro: "01:20 sáng. Vy vừa cất chiếc máy ghi âm vào ba lô và ngồi xuống chiếc ghế gỗ bên quầy, lặng lẽ ngắm những giọt mưa lăn dài trên khung cửa kính.",
      g1Line: "Vy khẽ thở dài nhìn tập hồ sơ thực tập: 'Cháu đi phỏng vấn cả tháng nay, nơi nào cũng bảo tin tức giờ chỉ cần thuật toán tổng hợp trong vài giây là xong...'",
      g2React: "Cánh cửa gỗ khẽ mở — bác An thong thả bước vào với túi sách giấy cũ, đặt cuốn sách bìa vải lên bàn cạnh Vy và mỉm cười hiền từ: 'Hiệu sách cũ đầu phố nơi bác hay ngồi đọc suốt hai mươi năm cũng sắp đóng cửa rồi cháu ạ. Người ta bảo thời nay ít ai còn kiên nhẫn với những câu chuyện chậm rãi.'",
      bridgePrompt: "Hai thế hệ cầm bút — một người vừa bắt đầu hành trình, một người đã đi qua bốn thập kỷ chữ nghĩa — đang ngồi cạnh nhau. Bạn sẽ kết nối họ thế nào?",
      choices: [
        {
          label: "❤️ 'Bác An có cả kho ký ức sống động của khu phố, còn Vy có đôi tai biết lắng nghe — hai người chính là mảnh ghép của nhau đấy!'",
          stance: "heart",
          reply: "Vy quay sang nhìn bác An đầy ngưỡng mộ, còn đôi mắt bác An bỗng sáng lên niềm vui ấm áp như gặp lại một người học trò tri kỷ."
        },
        {
          label: "✨ 'Nếu Vy ghi lại loạt phóng sự về hiệu sách cuối cùng của bác An và những người giữ chữ, đó sẽ là câu chuyện không AI nào viết thay được!'",
          stance: "mind",
          reply: "Vy bật mở ngay cuốn sổ tay, còn bác An gật gù tâm đắc: 'Ý tưởng hay lắm! Bác có hàng trăm lá thư và lưu bút cũ chưa từng kể với ai!'"
        },
        {
          label: "🤫 Đặt hai tách nước ấm sát nhau trên mặt quầy gỗ, để ánh mắt đồng cảm tự dẫn dắt cuộc trò chuyện.",
          stance: "silent",
          reply: "Trong sự tĩnh lặng dịu dàng của quán, bác An khẽ lật mở trang sách cũ chỉ cho Vy xem những dòng ghi chú viết tay, mở đầu một cuộc trò chuyện say sưa."
        }
      ],
      clue: "Vy mong một vị thanh mát, tỉnh người để đánh thức sự sáng tạo, còn bác An thích vị chua ngọt thanh tao, thoảng hương hoa gợi nhớ những chiều thu xưa.",
      synergyReflection: "Cả hai cùng nâng ly giữa tiếng mưa rơi ngoài hiên — vị thanh trẻ trung hòa quyện cùng hương thơm hoài niệm như nhịp cầu nối liền hai thế hệ.",
      finalPrompt: "Trước khi trời rạng sáng, bác An và Vy đang bàn về dự án chung đầu tiên. Bạn muốn cổ vũ họ theo hướng nào?",
      finalChoices: [
        {
          label: "🤝 'Hãy cùng nhau lưu giữ những ký ức ấm áp của con hẻm này bằng tất cả sự chân thành!'",
          stance: "duo_heart",
          reply: "Bác An bắt tay Vy thật chặt: 'Sáng mai cháu ghé hiệu sách trước giờ đóng cửa nhé, bác sẽ kể cho cháu nghe từ trang đầu tiên!'"
        },
        {
          label: "🚀 'Hãy biến loạt ký sự này thành một lưu trữ số kết hợp sách in độc bản cho cả khu phố!'",
          stance: "duo_mind",
          reply: "Vy rạng rỡ gật đầu: 'Cháu sẽ thu âm giọng đọc của bác kèm ảnh tư liệu thực địa để lan tỏa tới thật nhiều bạn trẻ!'"
        }
      ]
    },
    endings: {
      heart: {
        title: "Những Trang Ký Ức Không Bao Giờ Cũ",
        summary: "Vy thực hiện loạt bài chân dung đầy xúc động về bác An và hiệu sách cuối phố, chạm tới trái tim hàng vạn độc giả và giữ lại linh hồn văn hóa của khu phố.",
        radioNews: "Loạt bài 'Người Giữ Đèn Hiệu Sách Cuối Hẻm' của phóng viên trẻ Vy và thầy giáo nghỉ hưu An đang gây xúc động mạnh trên diễn đàn văn học."
      },
      mind: {
        title: "Bảo Tàng Ký Ức Sống Hai Thế Hệ",
        summary: "Bác An và Vy cùng sáng lập dự án lưu trữ ký ức đô thị kết hợp sách giấy thủ công và podcast thực địa, mở ra hướng đi mới cho báo chí nhân văn.",
        radioNews: "Dự án 'Ký Ức Hẻm Nhỏ' do thầy giáo An và cây bút trẻ Vy đồng sáng lập vừa nhận giải thưởng Sáng Kiến Văn Hóa Cộng Đồng."
      }
    }
  },
  minh_hoa: {
    id: "minh_hoa",
    guests: ["minh", "hoa"],
    script: {
      intro: "01:40 sáng. Minh đang ngồi trầm ngâm bên chiếc laptop khép hờ trên quầy gỗ, ánh đèn vàng ấm hắt lên cặp kính cận.",
      g1Line: "Minh khẽ xoa thái dương: 'Cháu viết phần mềm tự động hóa cả ngày, nhưng tối về lại thấy giữa con người với nhau sao ngày càng khó mở lời...'",
      g2React: "Cánh cửa khẽ mở — cô Hoa bước vào với chiếc khăn len mỏng, nhẹ nhàng ngồi xuống chiếc ghế bên cạnh Minh và mỉm cười hiền hậu: 'Cô cũng vậy cháu ạ. Ở công ty thì lo phần mềm thay thế kế toán lớn tuổi, về nhà thì cậu con trai bằng tuổi cháu cứ đeo tai nghe cả tối, cô chẳng biết bắt chuyện thế nào.'",
      bridgePrompt: "Chàng kỹ sư trẻ trăn trở vì khoảng cách nhân văn và người mẹ đang loay hoay bước vào thế giới số của con trai. Bạn sẽ kết nối họ ra sao?",
      choices: [
        {
          label: "❤️ 'Cô Hoa giống hệt mẹ của Minh ở nhà, còn Minh cũng mang đúng tâm sự của con trai cô — hai người thử lắng nghe góc nhìn của nhau xem!'",
          stance: "heart",
          reply: "Cô Hoa nhìn Minh đầy trìu mến, còn Minh bất ngờ nhận ra sự ấm áp ẩn sau những lời nhắc nhở vụng về của người lớn."
        },
        {
          label: "✨ 'Minh có thể chỉ cô Hoa cách làm chủ phần mềm mới trong 10 phút, còn cô Hoa sẽ chia sẻ bí quyết giúp Minh trò chuyện lại với gia đình!'",
          stance: "mind",
          reply: "Cả hai cùng bật cười thích thú trước sự trao đổi công bằng đầy ấm áp ngay trên mặt quầy gỗ."
        },
        {
          label: "🤫 Mỉm cười rót hai ly nước ấm đặt cạnh nhau, tạo một khoảng không gian gia đình dịu dàng.",
          stance: "silent",
          reply: "Không khí căng thẳng tan biến nhanh chóng; cô Hoa hỏi thăm Minh đã ăn tối chưa, khiến chàng kỹ sư bỗng thấy sống mũi cay cay."
        }
      ],
      clue: "Minh cần vị đậm, tỉnh táo nhưng hậu dịu nhẹ, còn cô Hoa mong một thức uống ấm áp, ngọt thanh để xoa dịu nỗi lo âu.",
      synergyReflection: "Hương cà phê quyện cùng mùi trà hoa cúc mật ong lan tỏa, biến góc quầy nửa đêm thành một căn bếp gia đình ấm cúng.",
      finalPrompt: "Trước lúc chia tay ra về, hai cô cháu đã tìm thấy sự đồng cảm sâu sắc. Bạn gửi gắm lời chúc nào cho họ?",
      finalChoices: [
        {
          label: "🤝 'Chúc cô Hoa có một bữa cơm thật ấm bên con trai, và Minh cũng sớm về thăm nhà một chuyến nhé!'",
          stance: "duo_heart",
          reply: "Minh mỉm cười lấy điện thoại đặt ngay vé xe cuối tuần về thăm mẹ, còn cô Hoa rạng rỡ cảm ơn chàng kỹ sư trẻ."
        },
        {
          label: "🚀 'Hãy cùng nhau chứng minh rằng công nghệ chỉ thực sự tỏa sáng khi được dẫn dắt bởi kinh nghiệm và tình thương!'",
          stance: "duo_mind",
          reply: "Cô Hoa tự tin ghi chép lại những mẹo công nghệ Minh vừa hướng dẫn, sẵn sàng làm chủ vị trí mới tại công ty."
        }
      ]
    },
    endings: {
      heart: {
        title: "Cầu Nối Ấm Áp Giữa Hai Thế Hệ Số",
        summary: "Nhờ cuộc trò chuyện với Minh, cô Hoa thấu hiểu áp lực của con trai và mở lòng kết nối lại tình cảm gia đình, còn Minh cũng trở về sum họp bên bữa cơm mẹ nấu.",
        radioNews: "Những câu chuyện gắn kết cha mẹ và con cái giữa thời đại số đang lan tỏa nguồn cảm hứng ấm áp khắp thành phố."
      },
      mind: {
        title: "Lớp Học Công Nghệ Liên Thế Hệ",
        summary: "Cô Hoa làm chủ thành công hệ thống kế toán mới và cùng Minh tổ chức các buổi hướng dẫn kỹ năng số miễn phí cho người lao động trung niên.",
        radioNews: "Câu lạc bộ 'Cùng Nhau Làm Chủ Kỷ Nguyên Số' do kỹ sư Minh và chị Hoa khởi xướng vừa đón nhận hơn 200 học viên."
      }
    }
  },
  linh_khang: {
    id: "linh_khang",
    guests: ["linh", "khang"],
    script: {
      intro: "02:10 sáng. Chị Linh đang nắn nót viết từng dòng bút máy vào cuốn sổ bìa đỏ dưới ánh đèn vàng ấm của quán.",
      g1Line: "Chị Linh khẽ khép cuốn sổ: 'Người ta bảo viết chậm và biên tập thủ công từng chữ như em giờ không cạnh tranh nổi với nội dung sản xuất hàng loạt...'",
      g2React: "Cánh cửa khẽ mở — anh Khang bước vào với chiếc tạp dề còn vương hương sáp ong, gật đầu đồng cảm khi ngồi xuống cạnh chị Linh: 'Xưởng đồ da khâu tay của anh cũng vậy. Hàng công nghiệp dựng hình quảng cáo rẻ bèo tràn ngập, nhưng anh vẫn tin thứ làm bằng tay có hơi ấm riêng.'",
      bridgePrompt: "Hai người nghệ sĩ của sự tỉ mỉ — một người giữ từng câu chữ, một người giữ từng mũi chỉ — đã gặp nhau. Bạn sẽ kết nối họ thế nào?",
      choices: [
        {
          label: "❤️ 'Một cuốn sổ bìa da khâu tay của anh Khang ôm trọn những trang tản văn viết tay của chị Linh — đó chẳng phải là sự kết hợp hoàn hảo sao?'",
          stance: "heart",
          reply: "Đôi mắt chị Linh và anh Khang cùng sáng lên; cả hai nhận ra giá trị của sự kiên nhẫn không hề đơn độc."
        },
        {
          label: "✨ 'Nếu hai người kết hợp làm bộ ấn phẩm sách thủ công kể chuyện nghề truyền thống, giá trị độc bản sẽ vượt xa mọi hàng công nghiệp!'",
          stance: "mind",
          reply: "Anh Khang vỗ nhẹ lên quầy gỗ: 'Ý tưởng tuyệt vời! Xưởng anh lo phần bìa da chạm nổi, còn Linh chắp bút câu chuyện của từng người thợ!'"
        },
        {
          label: "🤫 Đặt cuốn sổ bìa đỏ của chị Linh cạnh chiếc thẻ da sáp ong của anh Khang trên quầy gỗ.",
          stance: "silent",
          reply: "Nhìn hai món đồ thủ công nằm cạnh nhau, cả hai tự nhiên mỉm cười và bắt đầu trao đổi say sưa về cái đẹp của sự chậm rãi."
        }
      ],
      clue: "Chị Linh thích vị chua ngọt dịu dàng thơm hương hoa gợi hoài niệm, còn anh Khang hợp với vị đậm, ấm và trầm lắng.",
      synergyReflection: "Hương sáp ong, mùi mực bút máy và vị nước ấm hòa quyện tạo nên một không gian nghệ thuật tĩnh tại hiếm có.",
      finalPrompt: "Hai tâm hồn đồng điệu đã tìm thấy tri kỷ nghề nghiệp. Bạn muốn gửi lời chúc nào cho sự hợp tác này?",
      finalChoices: [
        {
          label: "🤝 'Chúc những trang viết và mũi chỉ thủ công của hai người luôn sưởi ấm những tâm hồn biết trân trọng cái đẹp!'",
          stance: "duo_heart",
          reply: "Chị Linh mỉm cười rạng rỡ: 'Tác phẩm hoàn thành đầu tiên tụi em nhất định sẽ mang tới tặng quầy sách của Thỏ Con!'"
        },
        {
          label: "🚀 'Hãy đưa thương hiệu ấn phẩm thủ công độc bản này vươn xa để tôn vinh giá trị lao động chân chính!'",
          stance: "duo_mind",
          reply: "Anh Khang và chị Linh cùng phác thảo ngay kế hoạch ra mắt bộ sưu tập sách bìa da thủ công đầu tiên."
        }
      ]
    },
    endings: {
      heart: {
        title: "Những Trang Sách Bọc Da Sáp Ong",
        summary: "Chị Linh và anh Khang cùng tạo nên những cuốn tản văn bìa da khâu tay ấm áp, trở thành món quà tinh thần được những người yêu cái đẹp nâng niu.",
        radioNews: "Bộ sưu tập sách thủ công 'Chữ & Da' của biên tập viên Linh và nghệ nhân Khang vừa cháy hàng ngay trong ngày đầu ra mắt."
      },
      mind: {
        title: "Xưởng Nghệ Thuật Độc Bản Đô Thị",
        summary: "Hai người đồng sáng lập không gian kết hợp xưởng thủ công truyền thống và xuất bản sách nghệ thuật độc lập, tạo việc làm bền vững cho nhiều nghệ nhân.",
        radioNews: "Mô hình kinh tế sáng tạo kết hợp thủ công mỹ nghệ và xuất bản độc lập tại thành phố đang tạo tiếng vang lớn."
      }
    }
  },
  tuan_minh: {
    id: "tuan_minh",
    guests: ["tuan", "minh"],
    script: {
      intro: "02:35 sáng. Anh Tuấn vừa phủi những giọt nước mưa trên chiếc áo khoác gió và ngồi xuống cạnh quầy gỗ ấm.",
      g1Line: "Anh Tuấn nhấp ngụm nước lọc, thở dài: 'Nhiều đêm đường ngập kẹt xe mà ứng dụng vẫn tự động trừ điểm vì trễ hai phút, giá mà người viết phần mềm hiểu cho cánh tài xế tụi anh...'",
      g2React: "Cánh cửa quán đẩy mở — Minh bước vào với màn hình bản đồ điều phối giao thông đêm vẫn sáng trên điện thoại, khẽ sững người khi nghe câu nói của anh Tuấn: 'Thực ra... em chính là người tham gia viết thuật toán điều phối đó. Nghe anh nói trực tiếp thế này em mới thấy hết góc khuất ngoài đường.'",
      bridgePrompt: "Người cầm lái ngoài mưa đêm và người viết thuật toán sau màn hình đang ngồi đối diện nhau. Bạn sẽ làm cầu nối thế nào?",
      choices: [
        {
          label: "❤️ 'Cả hai đều đang cố gắng hết sức vì trách nhiệm của mình — đêm nay hãy gác lại màn hình và nghe nhau bằng sự cảm thông nhé!'",
          stance: "heart",
          reply: "Anh Tuấn cười hiền xua tay: 'Anh hiểu mà, chú em cũng thức trắng đêm đâu có nhàn hạ gì!' khiến Minh trút bỏ được mặc cảm tội lỗi."
        },
        {
          label: "✨ 'Anh Tuấn có trải nghiệm thực địa, còn Minh có công cụ kỹ thuật — hai người cùng chỉnh lại những điểm bất hợp lý của thuật toán ngay tại đây đi!'",
          stance: "mind",
          reply: "Minh mở ngay sổ ghi chú kỹ thuật, hào hứng lắng nghe anh Tuấn chỉ ra từng điểm nghẽn giao thông và thời tiết thực tế."
        },
        {
          label: "🤫 Rót thêm nước ấm cho cả hai, giữ bầu không khí bình tĩnh và tôn trọng lẫn nhau.",
          stance: "silent",
          reply: "Không có sự trách móc nào xảy ra — trái lại, anh Tuấn và Minh bắt đầu trò chuyện cởi mở như hai người anh em cùng thức khuya."
        }
      ],
      clue: "Anh Tuấn cần thức uống ấm bụng, cay nồng và ngọt hậu, còn Minh hợp với vị đậm đà, tỉnh táo.",
      synergyReflection: "Bên quầy gỗ ấm, khoảng cách giữa thế giới thuật toán và thực tế đường phố được xóa nhòa sau từng ngụm nước.",
      finalPrompt: "Cuộc đối thoại thẳng thắn đã mở ra góc nhìn mới cho cả hai. Bạn muốn chốt lại đêm nay thế nào?",
      finalChoices: [
        {
          label: "🤝 'Khi người làm công nghệ biết lắng nghe người lao động, mọi hệ thống đều sẽ trở nên nhân văn hơn!'",
          stance: "duo_heart",
          reply: "Anh Tuấn vỗ vai Minh thân tình: 'Chúc chú em luôn giữ được cái tâm sáng này nhé!'"
        },
        {
          label: "🚀 'Hãy đưa những dữ liệu thực tế từ đường phố vào thuật toán để bảo vệ an toàn và thu nhập cho tài xế!'",
          stance: "duo_mind",
          reply: "Minh gật đầu dứt khoát: 'Sáng mai em sẽ cập nhật ngay cơ chế bù trừ thời tiết và giao thông thực tế vào hệ thống!'"
        }
      ]
    },
    endings: {
      heart: {
        title: "Thấu Hiểu Giữa Đường Phố & Màn Hình",
        summary: "Cuộc gặp gỡ tình cờ giúp Minh thấu cảm sâu sắc với người lao động thực địa, còn anh Tuấn cũng cảm nhận được sự trân trọng từ những người làm công nghệ.",
        radioNews: "Câu chuyện đối thoại ấm áp giữa kỹ sư phần mềm và tài xế giao hàng đêm đang lan tỏa thông điệp thấu hiểu trong cộng đồng."
      },
      mind: {
        title: "Thuật Toán Nhân Văn Vì Người Cầm Lái",
        summary: "Với sự tư vấn thực địa từ anh Tuấn, Minh thiết kế thành công bộ thuật toán điều phối thông minh ưu tiên an toàn thời tiết và quyền lợi tài xế.",
        radioNews: "Cập nhật thuật toán mới biết tự động điều chỉnh thời gian khi trời mưa ngập đang nhận được sự ủng hộ nhiệt liệt từ giới tài xế."
      }
    }
  },
  tuan_hoa: {
    id: "tuan_hoa",
    guests: ["tuan", "hoa"],
    script: {
      intro: "03:00 sáng. Anh Tuấn đang ngồi nghỉ chân bên quầy gỗ, lấy tấm ảnh hai con nhỏ trong ví ra ngắm với nụ cười hiền hậu.",
      g1Line: "Anh Tuấn cười hiền: 'Mấy tháng nay chạy ca đêm bù tiền học cho hai đứa nhỏ, nhiều lúc mệt rã rời nhưng chỉ cần nghĩ tới tụi nó lại cố thêm chút nữa.'",
      g2React: "Cánh cửa gỗ khẽ mở — cô Hoa bước vào với chiếc khăn len mỏng trên vai, mỉm cười ngồi xuống chiếc ghế bên cạnh anh Tuấn và gật đầu xúc động: 'Cô hiểu cảm giác đó lắm. Làm cha làm mẹ ai cũng sẵn sàng gồng gánh hết vất vả, chỉ mong con cái bình an khôn lớn.'",
      bridgePrompt: "Hai bậc phụ huynh tận tụy đang sưởi ấm lòng nhau giữa đêm mưa. Bạn sẽ tiếp thêm sức mạnh cho họ thế nào?",
      choices: [
        {
          label: "❤️ 'Hai người đều là những điểm tựa vững chãi nhất của gia đình, nhưng đêm nay hãy cho phép bản thân được nghỉ ngơi một chút nhé!'",
          stance: "heart",
          reply: "Cả anh Tuấn và cô Hoa cùng mỉm cười nhẹ nhõm, chia sẻ cho nhau những câu chuyện vui đầy tự hào về con cái."
        },
        {
          label: "✨ 'Sự kiên cường của thế hệ cha mẹ chính là tấm gương sống động nhất dạy con cái cách vượt qua khó khăn!'",
          stance: "mind",
          reply: "Cô Hoa gật gù tâm đắc, còn anh Tuấn cảm thấy mọi nỗ lực thầm lặng của mình đều mang ý nghĩa lớn lao."
        },
        {
          label: "🤫 Lặng lẽ đặt đĩa bánh quy gừng ấm lên giữa hai người như một lời tri ân.",
          stance: "silent",
          reply: "Hai người phụ huynh vừa thưởng thức bánh ấm vừa trò chuyện rôm rả như những người bạn hàng xóm thân thiết."
        }
      ],
      clue: "Cả anh Tuấn và cô Hoa đều cần một thức uống thật ấm, ngọt hậu và dịu dàng như vòng tay người thân.",
      synergyReflection: "Hơi ấm từ hai ly nước lan tỏa, vỗ về những đôi vai đã gồng gánh suốt cả tuần dài.",
      finalPrompt: "Trước khi chia tay trở về với tổ ấm của mình, bạn muốn gửi lời chúc nào tới hai người?",
      finalChoices: [
        {
          label: "🤝 'Chúc gia đình anh Tuấn và cô Hoa luôn tràn ngập tiếng cười và những bữa cơm sum vầy!'",
          stance: "duo_heart",
          reply: "Cô Hoa và anh Tuấn cùng gửi lời chúc bình an tới quán nhỏ rồi bước ra phố trong niềm vui ấm áp."
        },
        {
          label: "🚀 'Chúc hai anh chị vững vàng chuyển mình trong công việc để tương lai của các con ngày càng rộng mở!'",
          stance: "duo_mind",
          reply: "Anh Tuấn phấn khởi chia sẻ dự định nộp hồ sơ kỹ thuật xe điện, còn cô Hoa cũng tự tin hơn hẳn với công việc mới."
        }
      ]
    },
    endings: {
      heart: {
        title: "Ngọn Lửa Ấm Của Những Người Làm Cha Mẹ",
        summary: "Sự đồng cảm chân thành giúp anh Tuấn và cô Hoa trút bỏ gánh nặng lo âu, trở về nhà với nguồn năng lượng yêu thương trọn vẹn dành cho con cái.",
        radioNews: "Những câu chuyện giản dị về tình cảm gia đình giữa mùa biến động đang sưởi ấm lòng người nghe đài mỗi sớm mai."
      },
      mind: {
        title: "Bến Đỗ Vững Vàng Cho Thế Hệ Tương Lai",
        summary: "Được tiếp thêm niềm tin, cả anh Tuấn và cô Hoa đều mạnh dạn nắm bắt cơ hội nghề nghiệp mới, xây dựng nền tảng kinh tế ổn định cho gia đình.",
        radioNews: "Nhiều lao động trung niên đang chuyển đổi nghề nghiệp thành công nhờ tinh thần học hỏi bền bỉ và sự đồng hành của gia đình."
      }
    }
  },
  linh_an: {
    id: "linh_an",
    guests: ["linh", "an"],
    script: {
      intro: "03:45 sáng. Chị Linh đang ngồi ở góc quầy gỗ đọc nhẩm lại một đoạn tản văn vừa viết trong cuốn sổ bìa đỏ.",
      g1Line: "Chị Linh khẽ mỉm cười tự nhủ: 'Có lẽ chỉ khi đọc thành tiếng thế này, mình mới nghe rõ nhịp điệu thật sự của từng câu chữ...'",
      g2React: "Chuông gió khẽ ngân — bác An bước vào với túi sách giấy cũ, vỗ nhẹ tay tán thưởng khi ngồi xuống bên cạnh chị Linh: 'Văn chương hay là phải có nhịp điệu như thế! Bốn mươi năm dạy văn, bác luôn trân trọng những người viết biết nâng niu từng con chữ như cháu.'",
      bridgePrompt: "Một cây bút trẻ đang tìm chỗ đứng cho văn chương sâu sắc và một người thầy cả đời yêu chữ nghĩa đang ngồi cạnh nhau. Bạn sẽ kết nối họ ra sao?",
      choices: [
        {
          label: "❤️ 'Tình yêu tiếng Việt đẹp đẽ của bác An và chị Linh chính là sợi dây nối liền hai thế hệ cầm bút!'",
          stance: "heart",
          reply: "Chị Linh xúc động mở cuốn sổ đỏ nhờ bác An góp ý, còn bác An đeo kính lên đọc từng dòng với tất cả sự trân trọng."
        },
        {
          label: "✨ 'Nếu bác An và chị Linh cùng tổ chức những buổi đọc sách và giao lưu văn chương cuối tuần, độc giả yêu sách giấy chắc chắn sẽ tìm về!'",
          stance: "mind",
          reply: "Bác An gật đầu hào hứng: 'Chính xác! Tủ sách cộng đồng kết hợp với những buổi đàm đạo văn chương của Linh sẽ rất tuyệt vời!'"
        },
        {
          label: "🤫 Giữ không gian quán tĩnh lặng tuyệt đối, chỉ còn tiếng mưa rơi hòa cùng giọng đàm đạo văn chương.",
          stance: "silent",
          reply: "Hai tâm hồn yêu sách say sưa trao đổi về những tác phẩm kinh điển suốt cả giờ đồng hồ mà quên cả thời gian."
        }
      ],
      clue: "Cả chị Linh và bác An đều yêu thích vị chua ngọt hoài niệm, thanh tao và thơm hương hoa dịu nhẹ.",
      synergyReflection: "Vị ngọt thanh của mơ ủ và hương hoa nhài nâng niu từng câu chuyện văn chương đẹp như một bài thơ đêm.",
      finalPrompt: "Trời sắp hửng sáng sau một đêm đàm đạo tri kỷ. Bạn muốn chúc hai người điều gì?",
      finalChoices: [
        {
          label: "🤝 'Chúc ngòi bút của chị Linh và tâm huyết của bác An mãi giữ được vẻ đẹp thuần khiết giữa đời sống!'",
          stance: "duo_heart",
          reply: "Bác An tặng chị Linh cây bút máy cũ làm kỷ niệm, hẹn ngày cuốn sách của chị chính thức ra mắt bạn đọc."
        },
        {
          label: "🚀 'Chúc góc đọc sách và câu lạc bộ văn chương của hai bác cháu sớm trở thành điểm hẹn văn hóa của khu phố!'",
          stance: "duo_mind",
          reply: "Chị Linh và bác An cùng lên danh sách những đầu sách đầu tiên cho buổi sinh hoạt văn học cuối tuần này."
        }
      ]
    },
    endings: {
      heart: {
        title: "Tri Kỷ Bên Trang Bản Thảo Đêm Mưa",
        summary: "Sự khích lệ của bác An tiếp thêm sức mạnh để chị Linh hoàn thành cuốn tiểu thuyết đầu tay thấm đẫm tình người và vẻ đẹp tiếng Việt.",
        radioNews: "Tác phẩm đầu tay của nhà văn trẻ Linh với lời tựa của thầy giáo lão thành An đang được giới phê bình đánh giá cao."
      },
      mind: {
        title: "Góc Đọc Sách Văn Chương Cuối Hẻm",
        summary: "Bác An và chị Linh đồng sáng lập câu lạc bộ đọc chậm và tủ sách văn học cộng đồng, thu hút đông đảo người trẻ quay lại với sách giấy.",
        radioNews: "Câu lạc bộ 'Đọc Chậm Giữa Phố' do thầy giáo An và biên tập viên Linh khởi xướng vừa mở rộng thêm ba điểm đọc cộng đồng."
      }
    }
  }
};
