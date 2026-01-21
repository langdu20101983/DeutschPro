
import { Lesson } from '../types';

export const lessons: Lesson[] = [
  {
    id: 'l1',
    title: 'Chào hỏi & Giới thiệu',
    germanTitle: 'Begrüßung & Vorstellung',
    description: 'Bắt đầu những bước đầu tiên với cách chào hỏi và giới thiệu bản thân tự nhiên.',
    category: 'Conversation',
    level: 'A1',
    content: [
      {
        section: 'Cách chào hỏi thông dụng',
        text: 'Người Đức rất coi trọng sự chào hỏi. Tùy thời điểm mà chúng ta có các câu khác nhau.',
        examples: [
          { de: 'Hallo!', vi: 'Xin chào!' },
          { de: 'Guten Morgen!', vi: 'Chào buổi sáng!' },
          { de: 'Guten Tag!', vi: 'Chào buổi ngày (11h-18h)!' },
          { de: 'Guten Abend!', vi: 'Chào buổi tối!' }
        ]
      },
      {
        section: 'Giới thiệu tên tuổi',
        text: 'Sử dụng cấu trúc đơn giản để mọi người biết bạn là ai.',
        examples: [
          { de: 'Ich heiße...', vi: 'Tôi tên là...' },
          { de: 'Ich bin...', vi: 'Tôi là...' },
          { de: 'Wer bist du?', vi: 'Bạn là ai?' }
        ]
      }
    ],
    exercises: [
      {
        id: 'e1-1',
        question: 'Câu nào dùng để chào vào lúc 8 giờ sáng?',
        options: ['Guten Tag', 'Guten Morgen', 'Guten Abend', 'Gute Nacht'],
        correctAnswer: 'Guten Morgen',
        explanation: 'Guten Morgen dùng cho buổi sáng sớm.'
      },
      {
        id: 'e1-2',
        question: '"Tôi tên là..." tiếng Đức nói thế nào?',
        options: ['Ich heiße', 'Du heißt', 'Wir heißen', 'Er heißt'],
        correctAnswer: 'Ich heiße',
        explanation: '"Ich" đi với động từ chia đuôi -e.'
      }
    ]
  },
  {
    id: 'l2',
    title: 'Đại từ nhân xưng',
    germanTitle: 'Personalpronomen',
    description: 'Nắm vững các ngôi trong tiếng Đức để xây dựng câu chính xác.',
    category: 'Grammar',
    level: 'A1',
    content: [
      {
        section: 'Các ngôi số ít',
        text: 'Cơ sở của mọi câu nói là biết mình đang nói về ai.',
        examples: [
          { de: 'Ich', vi: 'Tôi' },
          { de: 'Du', vi: 'Bạn (thân mật)' },
          { de: 'Er / Sie / Es', vi: 'Anh ấy / Cô ấy / Nó' }
        ]
      },
      {
        section: 'Sự trang trọng',
        text: 'Trong công việc hoặc với người lạ, người Đức dùng "Sie".',
        examples: [
          { de: 'Sie', vi: 'Ngài / Bà (trang trọng)' },
          { de: 'Wir', vi: 'Chúng tôi' }
        ]
      }
    ],
    exercises: [
      {
        id: 'e2-1',
        question: 'Từ nào nghĩa là "Chúng tôi"?',
        options: ['Ich', 'Wir', 'Ihr', 'Sie'],
        correctAnswer: 'Wir',
        explanation: 'Wir là ngôi thứ nhất số nhiều.'
      }
    ]
  },
  {
    id: 'l3',
    title: 'Số đếm & Thời gian',
    germanTitle: 'Zahlen & Uhrzeit',
    description: 'Học cách đếm số và hỏi giờ - kỹ năng sinh tồn quan trọng tại Đức.',
    category: 'Vocabulary',
    level: 'A1',
    content: [
      {
        section: 'Số đếm từ 0-10',
        text: 'Nền tảng để đọc số điện thoại và giá tiền.',
        examples: [
          { de: 'Eins, Zwei, Drei', vi: '1, 2, 3' },
          { de: 'Vier, Fünf, Sechs', vi: '4, 5, 6' },
          { de: 'Sieben, Acht, Neun, Zehn', vi: '7, 8, 9, 10' }
        ]
      },
      {
        section: 'Hỏi giờ',
        text: 'Đừng để bị trễ tàu ở Đức nhé!',
        examples: [
          { de: 'Wie spät ist es?', vi: 'Mấy giờ rồi?' },
          { de: 'Es ist năm giờ.', vi: 'Es ist fünf Uhr.' }
        ]
      }
    ],
    exercises: [
      {
        id: 'e3-1',
        question: 'Số 4 trong tiếng Đức là gì?',
        options: ['Drei', 'Vier', 'Fünf', 'Sechs'],
        correctAnswer: 'Vier',
        explanation: 'Eins(1), Zwei(2), Drei(3), Vier(4).'
      }
    ]
  },
  {
    id: 'l4',
    title: 'Gia đình của tôi',
    germanTitle: 'Meine Familie',
    description: 'Học cách giới thiệu về những người thân yêu trong gia đình.',
    category: 'Vocabulary',
    level: 'A1',
    content: [
      {
        section: 'Các thành viên chính',
        text: 'Ghi nhớ giống (Der/Die) của các thành viên.',
        examples: [
          { de: 'Der Vater / Die Mutter', vi: 'Bố / Mẹ' },
          { de: 'Der Bruder / Die Schwester', vi: 'Anh em trai / Chị em gái' },
          { de: 'Die Großeltern', vi: 'Ông bà' }
        ]
      }
    ],
    exercises: [
      {
        id: 'e4-1',
        question: '"Mẹ" trong tiếng Đức là gì?',
        options: ['Der Vater', 'Die Mutter', 'Das Kind', 'Die Schwester'],
        correctAnswer: 'Die Mutter',
        explanation: 'Mutter là giống cái (Die).'
      }
    ]
  },
  {
    id: 'l5',
    title: 'Tại nhà hàng',
    germanTitle: 'Im Restaurant',
    description: 'Cách gọi món, hỏi giá và thanh toán khi đi ăn ngoài.',
    category: 'Conversation',
    level: 'A2',
    content: [
      {
        section: 'Gọi đồ ăn',
        text: 'Sử dụng cấu trúc lịch sự "Ich möchte..."',
        examples: [
          { de: 'Die Speisekarte, bitte!', vi: 'Cho tôi xem thực đơn!' },
          { de: 'Ich möchte một cốc bia.', vi: 'Ich möchte ein Bier.' },
          { de: 'Haben Sie xúc xích?', vi: 'Haben Sie Wurst?' }
        ]
      },
      {
        section: 'Thanh toán',
        text: 'Văn hóa tip (tiền boa) ở Đức thường là 5-10%.',
        examples: [
          { de: 'Zahlen, bitte!', vi: 'Làm ơn thanh toán!' },
          { de: ' Zusammen oder getrennt?', vi: 'Trả chung hay trả riêng?' }
        ]
      }
    ],
    exercises: [
      {
        id: 'e5-1',
        question: 'Khi muốn thanh toán, bạn nói gì?',
        options: ['Hallo', 'Danke', 'Zahlen, bitte', 'Guten Appetit'],
        correctAnswer: 'Zahlen, bitte',
        explanation: 'Zahlen là động từ trả tiền.'
      }
    ]
  },
  {
    id: 'l6',
    title: 'Công việc & Nghề nghiệp',
    germanTitle: 'Arbeit & Berufe',
    description: 'Hỏi về nghề nghiệp và nói về nơi làm việc của bạn.',
    category: 'Vocabulary',
    level: 'A2',
    content: [
      {
        section: 'Các nghề nghiệp phổ biến',
        text: 'Lưu ý: Nghề nghiệp giống cái thường thêm đuôi -in.',
        examples: [
          { de: 'Der Lehrer / Die Lehrerin', vi: 'Thầy giáo / Cô giáo' },
          { de: 'Der Arzt / Die Ärztin', vi: 'Nam bác sĩ / Nữ bác sĩ' },
          { de: 'Ich arbeite als...', vi: 'Tôi làm nghề...' }
        ]
      }
    ],
    exercises: [
      {
        id: 'e6-1',
        question: '"Nữ bác sĩ" tiếng Đức là gì?',
        options: ['Der Arzt', 'Die Ärztin', 'Der Lehrer', 'Die Lehrerin'],
        correctAnswer: 'Die Ärztin',
        explanation: 'Thêm đuôi -in cho phái nữ.'
      }
    ]
  },
  {
    id: 'l7',
    title: 'Giống của danh từ (Der/Die/Das)',
    germanTitle: 'Artikel im Deutschen',
    description: 'Bí kíp để nhớ giống của danh từ - nỗi ám ảnh của người học tiếng Đức.',
    category: 'Grammar',
    level: 'A1',
    content: [
      {
        section: 'Quy tắc cơ bản',
        text: 'Mặc dù có nhiều ngoại lệ, nhưng một số đuôi từ sẽ giúp bạn đoán đúng giống.',
        examples: [
          { de: 'Der (Giống đực)', vi: 'Thường cho phái nam, ngày, tháng.' },
          { de: 'Die (Giống cái)', vi: 'Thường kết thúc bằng -ung, -heit, -keit.' },
          { de: 'Das (Giống trung)', vi: 'Từ mượn, từ chỉ trẻ con hoặc con vật nhỏ.' }
        ]
      }
    ],
    exercises: [
      {
        id: 'e7-1',
        question: 'Từ kết thúc bằng "-ung" thường là giống gì?',
        options: ['Der', 'Die', 'Das', 'Không có giống'],
        correctAnswer: 'Die',
        explanation: 'Ví dụ: Die Übung (Bài tập), Die Wohnung (Căn hộ).'
      }
    ]
  },
  {
    id: 'l8',
    title: 'Sở thích & Thời gian rảnh',
    germanTitle: 'Hobbys & Freizeit',
    description: 'Chia sẻ về những điều bạn thích làm khi không phải làm việc.',
    category: 'Conversation',
    level: 'A2',
    content: [
      {
        section: 'Nói về sở thích',
        text: 'Sử dụng động từ "gern" để nói về sở thích.',
        examples: [
          { de: 'Ich spiele gern Fußball.', vi: 'Tôi thích chơi bóng đá.' },
          { de: 'Ich lese gern Bücher.', vi: 'Tôi thích đọc sách.' },
          { de: 'Was machst du gern?', vi: 'Bạn thích làm gì?' }
        ]
      }
    ],
    exercises: [
      {
        id: 'e8-1',
        question: 'Câu nào nghĩa là "Tôi thích nghe nhạc"?',
        options: [
          'Ich höre gern Musik', 
          'Ich spiele gern Musik', 
          'Ich mache gern Musik', 
          'Ich bin Musik'
        ],
        correctAnswer: 'Ich höre gern Musik',
        explanation: 'Hören là nghe, gern chỉ sở thích.'
      }
    ]
  }
];
