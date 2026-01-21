
export interface Lesson {
  id: string;
  title: string;
  germanTitle: string;
  description: string;
  category: 'Grammar' | 'Vocabulary' | 'Conversation';
  level: 'A1' | 'A2' | 'B1';
  content: {
    section: string;
    text: string;
    examples: { de: string; vi: string }[];
  }[];
  exercises: Exercise[];
}

export interface Exercise {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export interface UserProgress {
  completedLessons: string[];
  score: number;
}
