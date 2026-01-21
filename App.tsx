
import React, { useState, useEffect, useRef } from 'react';
import Layout from './components/Layout';
import LessonContent from './components/LessonContent';
import { lessons } from './data/lessons';
import { hints, Hint } from './data/hints';
import { UserProgress, Lesson } from './types';
import { chatWithHans } from './services/geminiService';
import { 
  Sparkles, Send, Flame, Trophy, CheckCircle, 
  BookOpen, MessageCircle, Info, Landmark, 
  Zap, AlertCircle, RefreshCw, Volume2, ShieldAlert
} from 'lucide-react';

// Define the interface for the platform-provided AI key selection tools
// Use inline definition in declare global to avoid subsequent property declaration conflicts
declare global {
  interface Window {
    aistudio?: {
      hasSelectedApiKey: () => Promise<boolean>;
      openSelectKey: () => Promise<void>;
    };
  }
}

const wordOfTheDay = [
  { de: 'Fernweh', vi: 'Nỗi nhớ những nơi xa lạ', ex: 'Ich habe Fernweh.' },
  { de: 'Feierabend', vi: 'Thời gian nghỉ sau giờ làm', ex: 'Endlich Feierabend!' },
  { de: 'Gemütlichkeit', vi: 'Sự ấm cúng, dễ chịu', ex: 'Das ist Gemütlichkeit.' },
  { de: 'Kummerspeck', vi: 'Cân nặng tăng do ăn quá nhiều vì buồn', ex: 'Ich habe Kummerspeck.' }
];

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [randomHint, setRandomHint] = useState<Hint>(hints[0]);
  const [dailyWord, setDailyWord] = useState(wordOfTheDay[0]);
  const [progress, setProgress] = useState<UserProgress>({
    completedLessons: [],
    score: 0
  });

  const [chatHistory, setChatHistory] = useState<{ role: 'user' | 'model'; parts: { text: string }[] }[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // track whether the API key is ready for use
  const [isApiKeyReady, setIsApiKeyReady] = useState(!!process.env.API_KEY && process.env.API_KEY !== "undefined");

  useEffect(() => {
    const saved = localStorage.getItem('deutsch_progress');
    if (saved) setProgress(JSON.parse(saved));
    setRandomHint(hints[Math.floor(Math.random() * hints.length)]);
    setDailyWord(wordOfTheDay[Math.floor(Math.random() * wordOfTheDay.length)]);

    // Check key selection state on mount
    const checkKeyStatus = async () => {
      if (window.aistudio) {
        try {
          const selected = await window.aistudio.hasSelectedApiKey();
          setIsApiKeyReady(selected);
        } catch (err) {
          console.error("Error checking key status:", err);
        }
      }
    };
    checkKeyStatus();
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  // Handle opening the key selection dialog
  const handleOpenKeySelector = async () => {
    if (window.aistudio) {
      try {
        await window.aistudio.openSelectKey();
        // After calling openSelectKey, we assume success to avoid race conditions
        setIsApiKeyReady(true);
      } catch (err) {
        console.error("Error opening key selector:", err);
      }
    }
  };

  const handleSendMessage = async () => {
    if (!userInput.trim() || !isApiKeyReady) return;
    const msg = userInput;
    setUserInput('');
    setChatHistory(prev => [...prev, { role: 'user', parts: [{ text: msg }] }]);
    setIsTyping(true);

    try {
      const response = await chatWithHans(msg, chatHistory);
      if (response) {
        setChatHistory(prev => [...prev, { role: 'model', parts: [{ text: response }] }]);
      } else {
        setChatHistory(prev => [...prev, { role: 'model', parts: [{ text: "Hans đang tạm nghỉ một chút. Bạn thử lại sau nhé!" }] }]);
      }
    } catch (error: any) {
      // If the API key is invalid or has issues, prompt for re-selection
      if (error?.message?.includes("Requested entity was not found.")) {
        setIsApiKeyReady(false);
      }
      setChatHistory(prev => [...prev, { role: 'model', parts: [{ text: "Có lỗi kết nối với Hans. Vui lòng kiểm tra lại API Key." }] }]);
    } finally {
      setIsTyping(false);
    }
  };

  const speak = (text: string) => {
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'de-DE';
    window.speechSynthesis.speak(u);
  };

  const renderHome = () => (
    <div className="space-y-8 pb-20 animate-in fade-in slide-in-from-bottom-5 duration-700">
      <div className="relative group overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800 rounded-[3rem] p-10 text-white shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-red-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
          <div className="flex-1 space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-400/20 text-yellow-400 rounded-full text-sm font-bold border border-yellow-400/30">
              <Sparkles size={16} /> <span>Học tiếng Đức cùng AI Hans</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-outfit font-extrabold leading-tight tracking-tight">
              Làm chủ tiếng Đức <br/> <span className="text-yellow-400">thật dễ dàng.</span>
            </h1>
            <p className="text-slate-400 text-lg max-w-lg leading-relaxed">
              Phương pháp học sinh động, ví dụ thực tế và gia sư AI hỗ trợ 24/7.
            </p>
            <div className="flex flex-wrap gap-4">
              <button 
                onClick={() => setActiveTab('lessons')}
                className="px-8 py-4 bg-yellow-400 text-black font-bold rounded-2xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)] hover:translate-x-1 hover:translate-y-1 transition-all"
              >
                Khám phá bài học
              </button>
              <button 
                onClick={() => setActiveTab('tutor')}
                className="px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl font-bold hover:bg-white/20 transition-all"
              >
                Chat với Hans
              </button>
            </div>
          </div>
          <div className="hidden lg:block w-64 h-64 bg-slate-700/50 rounded-full border-8 border-slate-700 flex items-center justify-center text-8xl shadow-inner relative">
            🇩🇪
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] border-2 border-slate-100 shadow-sm relative group overflow-hidden">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <Zap className="text-yellow-500" fill="currentColor" /> Từ vựng mỗi ngày
            </h3>
            <button onClick={() => setDailyWord(wordOfTheDay[Math.floor(Math.random() * wordOfTheDay.length)])} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
              <RefreshCw size={18} className="text-slate-400" />
            </button>
          </div>
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-3">
                <span className="text-5xl font-outfit font-black text-slate-900">{dailyWord.de}</span>
                <button onClick={() => speak(dailyWord.de)} className="p-2 bg-slate-900 text-white rounded-xl hover:bg-red-600 transition-colors">
                  <Volume2 size={20} />
                </button>
              </div>
              <p className="text-2xl text-slate-500 font-medium">{dailyWord.vi}</p>
            </div>
            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 italic text-slate-600 flex-1 relative">
              "{dailyWord.ex}"
            </div>
          </div>
        </div>

        <div className={`p-8 rounded-[2.5rem] border-2 shadow-sm flex flex-col justify-between ${randomHint.type === 'culture' ? 'bg-orange-50 border-orange-100' : 'bg-blue-50 border-blue-100'}`}>
          <div className="space-y-4">
            <h4 className="text-lg font-bold text-slate-900">{randomHint.title}</h4>
            <p className="text-sm text-slate-600 leading-relaxed">{randomHint.content}</p>
          </div>
          <button 
            onClick={() => setRandomHint(hints[Math.floor(Math.random() * hints.length)])}
            className="mt-6 text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-slate-900"
          >
            Mẹo tiếp theo →
          </button>
        </div>
      </div>
    </div>
  );

  const renderTutor = () => (
    <div className="h-[calc(100vh-10rem)] flex flex-col bg-white rounded-[3rem] border-2 border-slate-100 overflow-hidden shadow-xl mb-10">
      <div className="px-8 py-6 bg-slate-900 text-white flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-red-600 rounded-2xl flex items-center justify-center font-bold text-2xl border-2 border-white relative">
            H
            <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-slate-900 ${isApiKeyReady ? 'bg-green-400' : 'bg-red-400 animate-pulse'}`}></div>
          </div>
          <div>
            <h3 className="font-outfit font-bold text-lg">Hans - AI Tutor</h3>
            <p className="text-slate-400 text-xs">
              {isApiKeyReady ? 'Sẵn sàng hỗ trợ bạn!' : 'Yêu cầu API Key'}
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-slate-50/50">
        {!isApiKeyReady && (
          <div className="max-w-md mx-auto bg-white border-2 border-red-100 p-8 rounded-[2rem] text-center space-y-6 shadow-xl">
            <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto">
              <ShieldAlert size={32} />
            </div>
            <div>
              <h4 className="text-lg font-bold text-slate-900 mb-2">Chưa có API Key</h4>
              <p className="text-slate-500 text-sm leading-relaxed mb-4">
                Để trò chuyện với Hans, bạn cần chọn một API Key từ một dự án Google Cloud có trả phí.
              </p>
              <a 
                href="https://ai.google.dev/gemini-api/docs/billing" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:underline block mb-6"
              >
                Tài liệu về thanh toán API
              </a>
              <button 
                onClick={handleOpenKeySelector}
                className="w-full py-4 bg-red-600 text-white font-bold rounded-xl hover:bg-slate-900 transition-all flex items-center justify-center gap-2 shadow-lg"
              >
                <RefreshCw size={18} /> Chọn API Key để bắt đầu
              </button>
            </div>
          </div>
        )}

        {chatHistory.map((chat, idx) => (
          <div key={idx} className={`flex ${chat.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`
              max-w-[80%] p-5 rounded-[1.5rem] text-sm leading-relaxed shadow-sm
              ${chat.role === 'user' 
                ? 'bg-slate-900 text-white rounded-br-none' 
                : 'bg-white text-slate-800 rounded-bl-none border-2 border-slate-100'}
            `}>
              {chat.parts[0].text}
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white border-2 border-slate-100 p-4 rounded-2xl flex gap-1">
              <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce delay-100"></div>
              <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce delay-200"></div>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      <div className="p-8 bg-white border-t">
        <div className="relative max-w-4xl mx-auto">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder={isApiKeyReady ? "Hỏi Hans bất cứ điều gì..." : "Vui lòng chọn API Key..."}
            disabled={!isApiKeyReady || isTyping}
            className="w-full pl-6 pr-20 py-5 bg-slate-50 border-2 border-slate-100 rounded-[1.5rem] focus:outline-none focus:border-red-500 focus:bg-white transition-all shadow-sm disabled:opacity-50"
          />
          <button 
            onClick={handleSendMessage}
            disabled={!userInput.trim() || isTyping || !isApiKeyReady}
            className="absolute right-2 top-2 bottom-2 px-6 bg-red-600 text-white rounded-xl font-bold hover:bg-slate-900 transition-all disabled:opacity-50"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      {activeTab === 'home' && renderHome()}
      {activeTab === 'lessons' && (
        <div className="space-y-10 pb-20 animate-in fade-in duration-500">
          <h1 className="text-4xl font-outfit font-extrabold text-slate-900">Lộ trình học tập</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {lessons.map(lesson => {
              const isCompleted = progress.completedLessons.includes(lesson.id);
              return (
                <div 
                  key={lesson.id} 
                  onClick={() => { setSelectedLesson(lesson); setActiveTab('lesson-detail'); }}
                  className={`
                    group bg-white p-8 rounded-[2.5rem] border-2 transition-all cursor-pointer relative flex flex-col h-full
                    ${isCompleted ? 'border-green-200' : 'border-slate-100 hover:border-yellow-400 hover:shadow-2xl hover:-translate-y-2'}
                  `}
                >
                  <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center mb-6 group-hover:bg-yellow-400 group-hover:text-white transition-all">
                    <BookOpen size={28} />
                  </div>
                  <h3 className="font-outfit font-bold text-xl mb-2 text-slate-900">{lesson.title}</h3>
                  <p className="text-slate-400 text-sm mb-6 flex-grow">{lesson.description}</p>
                  <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                    <span className="text-[10px] font-black uppercase px-3 py-1 bg-slate-900 text-white rounded-lg">{lesson.level}</span>
                    {isCompleted && <CheckCircle size={20} className="text-green-500" />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
      {activeTab === 'tutor' && renderTutor()}
      {activeTab === 'progress' && (
        <div className="space-y-10 animate-in zoom-in-95 duration-500 pb-20">
          <h1 className="text-4xl font-outfit font-extrabold">Thành tích</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-slate-900 p-10 rounded-[3rem] text-white flex flex-col items-center">
              <Trophy size={48} className="text-yellow-400 mb-4" />
              <h2 className="text-5xl font-black mb-2">{progress.score}</h2>
              <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Điểm XP</p>
            </div>
            <div className="bg-white p-10 rounded-[3rem] border-2 border-slate-100 flex flex-col items-center shadow-sm">
              <CheckCircle size={48} className="text-green-500 mb-4" />
              <h2 className="text-5xl font-black mb-2 text-slate-900">{progress.completedLessons.length}</h2>
              <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Bài học hoàn tất</p>
            </div>
          </div>
        </div>
      )}
      {activeTab === 'lesson-detail' && selectedLesson && (
        <LessonContent 
          lesson={selectedLesson} 
          onComplete={(score) => {
            const newScore = progress.score + score;
            const newCompleted = Array.from(new Set([...progress.completedLessons, selectedLesson.id]));
            const newProgress = { completedLessons: newCompleted, score: newScore };
            setProgress(newProgress);
            localStorage.setItem('deutsch_progress', JSON.stringify(newProgress));
            setActiveTab('home');
          }}
          onBack={() => setActiveTab('lessons')}
        />
      )}
    </Layout>
  );
};

export default App;
