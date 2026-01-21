
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
      }
    ],
    exercises: [
      {
        id: 'e1-1',
        question: 'Câu nào dùng để chào vào lúc 8 giờ sáng?',
        options: ['Guten Tag', 'Guten Morgen', 'Guten Abend', 'Gute Nacht'],
        correctAnswer: 'Guten Morgen',
        explanation: 'Guten Morgen dùng cho buổi sáng sớm.'
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
          { de: 'Ich möchte ein Bier.', vi: 'Tôi muốn một cốc bia.' }
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
    id: 'l9',
    title: 'Mua sắm đồ dùng',
    germanTitle: 'Einkaufen gehen',
    description: 'Học cách hỏi giá, thử đồ và mặc cả (nếu có thể) tại siêu thị Đức.',
    category: 'Vocabulary',
    level: 'A1',
    content: [
      {
        section: 'Hỏi giá tiền',
        text: 'Cấu trúc "Was kostet...?" hoặc "Wie viel kostet...?"',
        examples: [
          { de: 'Was kostet das?', vi: 'Cái này giá bao nhiêu?' },
          { de: 'Das ist zu teuer.', vi: 'Cái này đắt quá.' },
          { de: 'Das ist billig.', vi: 'Cái này rẻ.' }
        ]
      }
    ],
    exercises: [
      {
        id: 'e9-1',
        question: 'Để hỏi giá một món đồ, bạn nói gì?',
        options: ['Wer ist das?', 'Was kostet đó?', 'Wie geht es?', 'Wo ist das?'],
        correctAnswer: 'Was kostet đó?',
        explanation: 'Was kostet dùng để hỏi giá tiền.'
      }
    ]
  },
  {
    id: 'l10',
    title: 'Sức khỏe & Cơ thể',
    germanTitle: 'Gesundheit & Körper',
    description: 'Cách diễn đạt cơn đau và nói chuyện với bác sĩ khi bạn cảm thấy không khỏe.',
    category: 'Vocabulary',
    level: 'A2',
    content: [
      {
        section: 'Các bộ phận cơ thể',
        text: 'Quan trọng nhất là cấu trúc "Ich habe ...schmerzen"',
        examples: [
          { de: 'Ich habe Kopfschmerzen.', vi: 'Tôi bị đau đầu.' },
          { de: 'Mein Bauch tut weh.', vi: 'Bụng tôi bị đau.' },
          { de: 'Gute Besserung!', vi: 'Chúc mau khỏe!' }
        ]
      }
    ],
    exercises: [
      {
        id: 'e10-1',
        question: 'Câu nào dùng để chúc ai đó mau khỏe?',
        options: ['Guten Appetit', 'Gute Besserung', 'Viel Glück', 'Herzlichen Glückwunsch'],
        correctAnswer: 'Gute Besserung',
        explanation: 'Gute Besserung là lời chúc sức khỏe.'
      }
    ]
  },
  {
    id: 'l11',
    title: 'Du lịch & Phương tiện',
    germanTitle: 'Reisen & Verkehr',
    description: 'Đặt vé tàu, hỏi đường và các phương tiện công cộng tại Đức.',
    category: 'Conversation',
    level: 'A2',
    content: [
      {
        section: 'Tại nhà ga (Bahnhof)',
        text: 'Hệ thống tàu của Đức (DB) rất phức tạp nhưng thú vị.',
        examples: [
          { de: 'Eine Fahrkarte nach Berlin, bitte.', vi: 'Cho tôi một vé đi Berlin.' },
          { de: 'Hat der Zug Verspätung?', vi: 'Tàu có bị trễ không?' },
          { de: 'Gleis 4', vi: 'Đường ray số 4' }
        ]
      }
    ],
    exercises: [
      {
        id: 'e11-1',
        question: '"Trễ giờ" trong tiếng Đức là gì?',
        options: ['Pünktlich', 'Verspätung', 'Schnell', 'Langsam'],
        correctAnswer: 'Verspätung',
        explanation: 'Verspätung là sự chậm trễ.'
      }
    ]
  },
  {
    id: 'l12',
    title: 'Môi trường & Rác thải',
    germanTitle: 'Umwelt & Mülltrennung',
    description: 'Người Đức rất yêu môi trường. Học cách phân loại rác đúng chuẩn "Đức".',
    category: 'Culture',
    level: 'B1',
    content: [
      {
        section: 'Phân loại rác (Mülltrennung)',
        text: 'Mỗi loại rác có một màu thùng riêng biệt.',
        examples: [
          { de: 'Biomüll', vi: 'Rác hữu cơ (thùng nâu)' },
          { de: 'Altpapier', vi: 'Giấy cũ (thùng xanh dương)' },
          { de: 'Plastik / Gelber Sack', vi: 'Nhựa (túi vàng)' }
        ]
      }
    ],
    exercises: [
      {
        id: 'e12-1',
        question: 'Thùng rác màu xanh dương thường chứa gì?',
        options: ['Thức ăn thừa', 'Chai nhựa', 'Giấy vụn', 'Pin hỏng'],
        correctAnswer: 'Giấy vụn',
        explanation: 'Altpapier dành cho giấy và carton.'
      }
    ]
  }
];
