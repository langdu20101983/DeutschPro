
export interface Hint {
  id: string;
  type: 'grammar' | 'culture' | 'achievement' | 'hack';
  title: string;
  content: string;
  icon?: string;
}

export const hints: Hint[] = [
  {
    id: 'h1',
    type: 'culture',
    title: 'Văn hóa bia Đức',
    content: 'Đức có hơn 1,300 nhà máy bia và 5,000 nhãn hiệu bia khác nhau. Lễ hội Oktoberfest là lễ hội bia lớn nhất thế giới diễn ra tại Munich.',
  },
  {
    id: 'h2',
    type: 'grammar',
    title: 'Mẹo nhớ giống (Gender)',
    content: 'Các từ kết thúc bằng -ung, -heit, -keit, -schaft luôn luôn là giống cái (Die). Ví dụ: Die Freiheit (Tự do).',
  },
  {
    id: 'h3',
    type: 'achievement',
    title: 'Vùng đất của những ý tưởng',
    content: 'Người Đức đã phát minh ra xe hơi (Karl Benz), máy in (Gutenberg), và định dạng file MP3.',
  },
  {
    id: 'h4',
    type: 'hack',
    title: 'Học qua âm nhạc',
    content: 'Hãy thử nghe nhạc của Rammstein hoặc Wincent Weiss. Âm nhạc giúp bạn nhớ từ vựng và ngữ điệu tự nhiên hơn rất nhiều.',
  },
  {
    id: 'h5',
    type: 'culture',
    title: 'Đúng giờ là tôn trọng',
    content: 'Ở Đức, "đúng giờ" nghĩa là đến trước 5 phút. Nếu bạn có hẹn lúc 2 giờ, hãy có mặt lúc 1:55 nhé!',
  },
  {
    id: 'h6',
    type: 'grammar',
    title: 'Động từ ở vị trí thứ 2',
    content: 'Trong câu trần thuật cơ bản của tiếng Đức, động từ luôn luôn đứng ở vị trí thứ 2, bất kể chủ ngữ đứng đâu.',
  }
];
