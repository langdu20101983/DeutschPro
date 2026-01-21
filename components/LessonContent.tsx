
import React, { useState } from 'react';
import { Lesson } from '../types';
import { generateQuizFeedback } from '../services/geminiService';
import { 
  Play, CheckCircle2, ArrowRight, MessageSquareQuote, 
  ChevronRight, Lightbulb, Info, Landmark, Volume2, Sparkles,
  Trophy
} from 'lucide-react';

interface Props {
  lesson: Lesson;
  onComplete: (score: number) => void;
  onBack: () => void;
}

const LessonContent: React.FC<Props> = ({ lesson, onComplete, onBack }) => {
  const [currentStep, setCurrentStep] = useState<'reading' | 'quiz'>('reading');
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [aiFeedback, setAiFeedback] = useState<Record<string, string | null>>({});

  const speak = (text: string) => {
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'de-DE';
    window.speechSynthesis.speak(u);
  };

  const handleQuizSubmit = async () => {
    setShowResults(true);
    let correct = 0;
    
    // Tạo feedback từ AI cho từng câu (chỉ nếu có API key)
    if (process.env.API_KEY) {
      for (const ex of lesson.exercises) {
        const isCorrect = quizAnswers[ex.id] === ex.correctAnswer;
        if (isCorrect) correct++;
        generateQuizFeedback(ex.question, quizAnswers[ex.id], isCorrect).then(feedback => {
          setAiFeedback(prev => ({ ...prev, [ex.id]: feedback }));
        });
      }
    } else {
      lesson.exercises.forEach(ex => {
        if (quizAnswers[ex.id] === ex.correctAnswer) correct++;
      });
    }

    const finalScore = Math.round((correct / lesson.exercises.length) * 100);
    setTimeout(() => onComplete(finalScore), 8000);
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-5 duration-500 pb-24">
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="flex items-center gap-2 text-slate-400 hover:text-slate-900 font-bold transition-colors group">
          <div className="p-2 group-hover:bg-slate-100 rounded-full transition-colors">
            <ArrowRight className="rotate-180" size={20} />
          </div>
          Quay lại danh sách
        </button>
        <div className="flex gap-2">
          <span className="px-4 py-1.5 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-full">{lesson.level}</span>
          <span className="px-4 py-1.5 bg-blue-100 text-blue-600 text-[10px] font-black uppercase tracking-widest rounded-full">{lesson.category}</span>
        </div>
      </div>

      <div className="space-y-2">
        <h1 className="text-5xl font-outfit font-black text-slate-900 leading-tight">{lesson.title}</h1>
        <h2 className="text-2xl font-outfit font-bold text-slate-400 flex items-center gap-3">
          {lesson.germanTitle}
          <button onClick={() => speak(lesson.germanTitle)} className="p-2 hover:bg-slate-100 rounded-full text-slate-300 hover:text-red-500 transition-all">
            <Volume2 size={20} />
          </button>
        </h2>
      </div>

      {currentStep === 'reading' ? (
        <div className="space-y-10">
          {lesson.content.map((section, idx) => (
            <div key={idx} className="bg-white p-10 rounded-[3rem] border-2 border-slate-100 shadow-sm relative group">
              <div className="absolute top-8 left-[-1.5rem] w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center font-bold text-xl shadow-lg">
                {idx + 1}
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-6 ml-4">{section.section}</h3>
              <p className="text-slate-500 mb-10 leading-relaxed text-xl ml-4">{section.text}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ml-4">
                {section.examples.map((ex, exIdx) => (
                  <div key={exIdx} className="group/item p-6 bg-slate-50 rounded-[2rem] border-2 border-transparent hover:border-yellow-400 hover:bg-white hover:shadow-xl transition-all flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-black text-slate-900 mb-1">{ex.de}</p>
                      <p className="text-slate-400 font-medium">{ex.vi}</p>
                    </div>
                    <button 
                      onClick={() => speak(ex.de)}
                      className="w-12 h-12 bg-white text-slate-400 rounded-2xl border-2 border-slate-100 flex items-center justify-center group-hover/item:bg-red-600 group-hover/item:text-white group-hover/item:border-red-600 transition-all shadow-sm"
                    >
                      <Play size={20} fill="currentColor" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <button 
            onClick={() => {
               setCurrentStep('quiz');
               window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="w-full py-6 bg-slate-900 text-white font-bold text-2xl rounded-[2rem] border-4 border-slate-800 shadow-[0_10px_0_0_rgba(0,0,0,0.1)] hover:translate-y-1 hover:shadow-none transition-all flex items-center justify-center gap-4 group"
          >
            Sẵn sàng kiểm tra kiến thức <ChevronRight className="group-hover:translate-x-2 transition-transform" />
          </button>
        </div>
      ) : (
        <div className="space-y-8 animate-in slide-in-from-right-10">
          <div className="bg-white p-10 rounded-[3rem] border-2 border-slate-100 shadow-xl">
            <h3 className="text-3xl font-black mb-12 flex items-center gap-4">
              <div className="p-3 bg-green-100 text-green-600 rounded-2xl">
                <CheckCircle2 size={32} />
              </div>
              Übungen (Bài tập)
            </h3>

            <div className="space-y-16">
              {lesson.exercises.map((ex, exIdx) => (
                <div key={ex.id} className="space-y-6 relative">
                  <div className="flex items-start gap-4">
                     <span className="text-4xl font-black text-slate-100 leading-none">{exIdx + 1}</span>
                     <p className="text-2xl font-bold text-slate-800 pt-1 leading-tight">
                       {ex.question}
                     </p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 ml-12">
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
                            p-6 rounded-[1.5rem] border-2 text-left transition-all font-bold text-lg
                            ${isSelected ? 'border-yellow-400 bg-yellow-50 text-slate-900 shadow-lg' : 'border-slate-100 text-slate-400 hover:border-slate-300'}
                            ${isCorrect ? '!bg-green-100 !border-green-500 !text-green-800 !shadow-none' : ''}
                            ${isWrong ? '!bg-red-100 !border-red-500 !text-red-800 !shadow-none' : ''}
                          `}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                  {showResults && (
                    <div className="ml-12 mt-6 space-y-4">
                       <div className="p-6 bg-slate-50 rounded-[2rem] border-2 border-slate-100 flex gap-4">
                          <MessageSquareQuote size={24} className="text-slate-300 shrink-0" />
                          <div>
                            <p className="font-bold text-slate-700 mb-1">Giải thích:</p>
                            <p className="text-slate-500">{ex.explanation}</p>
                          </div>
                       </div>
                       
                       {aiFeedback[ex.id] && (
                         <div className="p-6 bg-yellow-50 rounded-[2rem] border-2 border-yellow-100 flex gap-4 animate-in fade-in slide-in-from-top-2">
                           <Sparkles size={24} className="text-yellow-500 shrink-0" />
                           <div>
                             <p className="font-bold text-yellow-800 mb-1 italic">Lời khuyên từ Hans:</p>
                             <p className="text-yellow-700 text-sm leading-relaxed">{aiFeedback[ex.id]}</p>
                           </div>
                         </div>
                       )}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {!showResults && (
              <button 
                onClick={handleQuizSubmit}
                disabled={Object.keys(quizAnswers).length < lesson.exercises.length}
                className="mt-20 w-full py-6 bg-slate-900 text-white font-black text-xl rounded-[1.5rem] disabled:opacity-20 shadow-xl hover:-translate-y-1 active:translate-y-0 transition-all"
              >
                Hoàn thành bài tập
              </button>
            )}
          </div>
          
          {showResults && (
            <div className="p-8 bg-green-500 text-white rounded-[2.5rem] flex items-center justify-between shadow-2xl animate-pulse">
               <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-white/20 rounded-3xl flex items-center justify-center">
                    <Trophy size={32} />
                  </div>
                  <div>
                    <h4 className="text-2xl font-black">Xong rồi! Toll!</h4>
                    <p className="opacity-80">Kết quả của bạn đang được lưu lại...</p>
                  </div>
               </div>
               <Sparkles size={40} className="opacity-40" />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LessonContent;
