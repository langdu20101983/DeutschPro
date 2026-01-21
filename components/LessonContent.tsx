
import React, { useState } from 'react';
import { Lesson } from '../types';
import { Play, CheckCircle2, ArrowRight, MessageSquareQuote, ChevronRight, Lightbulb, Info, Landmark } from 'lucide-react';

interface Props {
  lesson: Lesson;
  onComplete: (score: number) => void;
  onBack: () => void;
}

const LessonContent: React.FC<Props> = ({ lesson, onComplete, onBack }) => {
  const [currentStep, setCurrentStep] = useState<'reading' | 'quiz'>('reading');
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);

  const speak = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'de-DE';
    window.speechSynthesis.speak(utterance);
  };

  const handleQuizSubmit = () => {
    setShowResults(true);
    let correct = 0;
    lesson.exercises.forEach(ex => {
      if (quizAnswers[ex.id] === ex.correctAnswer) correct++;
    });
    const finalScore = Math.round((correct / lesson.exercises.length) * 100);
    setTimeout(() => onComplete(finalScore), 3000);
  };

  const renderContextualHint = (idx: number) => {
    if (lesson.id === 'l1' && idx === 0) {
      return (
        <div className="bg-orange-50 p-6 rounded-3xl border-2 border-orange-100 my-6 flex gap-4">
          <div className="w-12 h-12 bg-orange-500 text-white rounded-2xl flex items-center justify-center shrink-0">
             <Landmark size={24} />
          </div>
          <div>
            <h4 className="font-bold text-orange-900 mb-1">Góc văn hóa</h4>
            <p className="text-orange-800 text-sm">Ở Đức, cách chào hỏi "Moin" rất phổ biến ở miền Bắc, trong khi người miền Nam thường nói "Grüß Gott".</p>
          </div>
        </div>
      );
    }
    if (lesson.id === 'l2' && idx === 0) {
      return (
        <div className="bg-blue-50 p-6 rounded-3xl border-2 border-blue-100 my-6 flex gap-4">
          <div className="w-12 h-12 bg-blue-500 text-white rounded-2xl flex items-center justify-center shrink-0">
             <Info size={24} />
          </div>
          <div>
            <h4 className="font-bold text-blue-900 mb-1">Mẹo ngữ pháp</h4>
            <p className="text-blue-800 text-sm">Hãy luôn viết hoa đại từ "Sie" khi muốn thể hiện sự trang trọng, nếu không người nghe có thể nhầm thành "cô ấy" hoặc "họ"!</p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="text-slate-500 hover:text-slate-800 flex items-center gap-1 font-medium transition-colors">
          <ArrowRight className="rotate-180" size={18} />
          Quay lại
        </button>
        <div className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full uppercase tracking-wider border border-blue-200">
          {lesson.level} • {lesson.category}
        </div>
      </div>

      <div className="text-center md:text-left">
        <h1 className="text-3xl md:text-4xl font-outfit font-bold text-slate-900 mb-2">{lesson.title}</h1>
        <h2 className="text-xl md:text-2xl font-outfit font-medium text-slate-500 italic">{lesson.germanTitle}</h2>
      </div>

      {currentStep === 'reading' ? (
        <div className="space-y-8">
          {lesson.content.map((section, idx) => (
            <React.Fragment key={idx}>
              <div className="bg-white p-6 md:p-8 rounded-3xl border-2 border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-sm">{idx + 1}</span>
                  {section.section}
                </h3>
                <p className="text-slate-600 mb-6 leading-relaxed text-lg">{section.text}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {section.examples.map((ex, exIdx) => (
                    <div key={exIdx} className="group p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between hover:border-yellow-400 hover:bg-yellow-50/30 transition-all">
                      <div>
                        <p className="text-lg font-bold text-slate-900">{ex.de}</p>
                        <p className="text-slate-500">{ex.vi}</p>
                      </div>
                      <button 
                        onClick={() => speak(ex.de)}
                        className="p-3 bg-white text-slate-600 rounded-full border border-slate-200 hover:bg-slate-900 hover:text-white transition-all shadow-sm"
                      >
                        <Play size={18} fill="currentColor" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              {renderContextualHint(idx)}
            </React.Fragment>
          ))}

          <button 
            onClick={() => setCurrentStep('quiz')}
            className="w-full py-5 bg-yellow-400 text-black font-bold text-xl rounded-3xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-2 active:shadow-none transition-all flex items-center justify-center gap-3"
          >
            Làm bài tập ngay <ChevronRight />
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-3xl border-2 border-slate-200">
            <h3 className="text-2xl font-bold mb-8 flex items-center gap-3">
              <CheckCircle2 className="text-green-500" />
              Kiểm tra kiến thức
            </h3>

            <div className="space-y-10">
              {lesson.exercises.map((ex, exIdx) => (
                <div key={ex.id} className="space-y-4">
                  <p className="text-lg font-semibold text-slate-800">
                    {exIdx + 1}. {ex.question}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {ex.options.map((opt) => {
                      const isSelected = quizAnswers[ex.id] === opt;
                      const isCorrect = showResults && opt === ex.correctAnswer;
                      const isWrong = showResults && isSelected && opt !== ex.correctAnswer;
                      
                      return (
                        <button
                          key={opt}
                          disabled={showResults}
                          onClick={() => setQuizAnswers(prev => ({ ...prev, [ex.id]: opt }))}
                          className={`
                            p-4 rounded-2xl border-2 text-left transition-all font-medium
                            ${isSelected ? 'border-yellow-400 bg-yellow-50' : 'border-slate-100 hover:border-slate-300'}
                            ${isCorrect ? '!bg-green-100 !border-green-500 !text-green-700' : ''}
                            ${isWrong ? '!bg-red-100 !border-red-500 !text-red-700' : ''}
                          `}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                  {showResults && (
                    <div className="mt-4 p-4 bg-blue-50 border-l-4 border-blue-500 text-blue-800 rounded-r-xl text-sm flex gap-3">
                      <MessageSquareQuote size={20} className="shrink-0" />
                      <div>
                        <p className="font-bold mb-1">Giải thích:</p>
                        <p>{ex.explanation}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {!showResults && (
              <button 
                onClick={handleQuizSubmit}
                disabled={Object.keys(quizAnswers).length < lesson.exercises.length}
                className="mt-12 w-full py-4 bg-slate-900 text-white font-bold rounded-2xl disabled:opacity-50 transition-all"
              >
                Nộp bài
              </button>
            )}
          </div>
          
          <div className="p-6 bg-yellow-50 rounded-3xl border-2 border-yellow-200 flex gap-4 items-center">
             <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center shrink-0">
                <Lightbulb size={20} className="text-black" />
             </div>
             <p className="text-yellow-900 text-sm font-medium"><strong>Mẹo:</strong> Đừng lo lắng nếu bạn làm sai. Sai lầm chính là cách tốt nhất để não bộ ghi nhớ kiến thức lâu hơn!</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default LessonContent;
