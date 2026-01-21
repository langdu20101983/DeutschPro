
import { Lesson } from '../types';

export const lessons: Lesson[] = [
  {
    id: 'l1',
    title: 'Chào hỏi & Giới thiệu',
    germanTitle: 'Begrüßung & Vorstellung',
    description: 'Học cách chào hỏi và giới thiệu bản thân bằng tiếng Đức một cách tự nhiên.',
    category: 'Conversation',
    level: 'A1',
    content: [
      {
        section: 'Cách chào hỏi thông dụng',
        text: 'Trong tiếng Đức, có nhiều cách chào hỏi tùy thuộc vào thời gian và mức độ thân mật.',
        examples: [
          { de: 'Hallo!', vi: 'Xin chào!' },
          { de: 'Guten Morgen!', vi: 'Chào buổi sáng!' },
          { de: 'Guten Tag!', vi: 'Chào buổi chiều/ngày!' },
          { de: 'Guten Abend!', vi: 'Chào buổi tối!' }
        ]
      },
      {
        section: 'Giới thiệu bản thân',
        text: 'Để giới thiệu tên, bạn có thể dùng cấu trúc "Ich bin..." hoặc "Ich heiße...".',
        examples: [
          { de: 'Ich heiße Minh.', vi: 'Tôi tên là Minh.' },
          { de: 'Wie heißt du?', vi: 'Bạn tên là gì?' },
          { de: 'Freut mich!', vi: 'Rất vui được gặp bạn!' }
        ]
      }
    ],
    exercises: [
      {
        id: 'e1-1',
        question: 'Câu nào dùng để chào vào buổi sáng?',
        options: ['Guten Tag', 'Guten Morgen', 'Guten Abend', 'Gute Nacht'],
        correctAnswer: 'Guten Morgen',
        explanation: 'Guten Morgen dùng để chào từ sáng sớm cho đến khoảng 11h trưa.'
      },
      {
        id: 'e1-2',
        question: '"Tôi tên là..." trong tiếng Đức là gì?',
        options: ['Ich bin tên là', 'Ich heiße', 'Mein name tên là', 'Ich bin'],
        correctAnswer: 'Ich heiße',
        explanation: '"Ich heiße" hoặc "Ich bin" đều đúng, nhưng "Ich heiße" chuyên dùng cho tên gọi.'
      }
    ]
  },
  {
    id: 'l2',
    title: 'Đại từ nhân xưng',
    germanTitle: 'Personalpronomen',
    description: 'Nắm vững các ngôi trong tiếng Đức (Tôi, Bạn, Anh ấy, Cô ấy...).',
    category: 'Grammar',
    level: 'A1',
    content: [
      {
        section: 'Ngôi số ít',
        text: 'Tiếng Đức có sự phân biệt rõ ràng giữa các ngôi.',
        examples: [
          { de: 'Ich', vi: 'Tôi' },
          { de: 'Du', vi: 'Bạn (thân mật)' },
          { de: 'Er / Sie / Es', vi: 'Anh ấy / Cô ấy / Nó' }
        ]
      }
    ],
    exercises: [
      {
        id: 'e2-1',
        question: 'Từ nào nghĩa là "Bạn" (thân mật)?',
        options: ['Ich', 'Du', 'Sie', 'Wir'],
        correctAnswer: 'Du',
        explanation: 'Du dùng cho bạn bè, người thân. Sie (viết hoa) dùng cho sự trang trọng.'
      }
    ]
  }
];
