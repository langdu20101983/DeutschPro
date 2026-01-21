
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
  Zap, AlertCircle, RefreshCw, Volume2, Settings
} from 'lucide-react';

// Fix: Define AIStudio interface to match existing global type expectations and prevent declaration conflicts.
interface AIStudio {
  hasSelectedApiKey: () => Promise<boolean>;
  openSelectKey: () => Promise<void>;
}

declare global {
  interface Window {
    aistudio?: AIStudio;
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
  const [apiStatus, setApiStatus] = useState<'checking' | 'ready' | 'missing'>('checking');
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Fix: Standard check for API Key availability using window.aistudio and process.env.API_KEY.
  const checkApiKeyStatus = async () => {
    try {
      if (window.aistudio) {
        const hasKey = await window.aistudio.hasSelectedApiKey();
        if (hasKey || (process.env.API_KEY && process.env.API_KEY !== "undefined")) {
          setApiStatus('ready');
          return;
        }
      } else if (process.env.API_KEY && process.env.API_KEY !== "undefined") {
        setApiStatus('ready');
        return;
      }
      setApiStatus('missing');
    } catch (e) {
      setApiStatus('missing');
    }
  };

  useEffect(() => {
    checkApiKeyStatus();
    const saved = localStorage.getItem('deutsch_progress');
    if (saved) setProgress(JSON.parse(saved));
    setRandomHint(hints[Math.floor(Math.random() * hints.length)]);
    setDailyWord(wordOfTheDay[Math.floor(Math.random() * wordOfTheDay.length)]);
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  const handleWakeUpHans = async () => {
    if (window.aistudio?.openSelectKey) {
      // Fix: Follow guidelines - assume success after triggering the dialog to avoid race conditions.
      await window.aistudio.openSelectKey();
      window.location.reload(); 
    } else {
      alert("Hệ thống không tìm thấy trình quản lý Key. Vui lòng đảm bảo bạn đang chạy trong môi trường hỗ trợ.");
    }
  };

  const handleSendMessage = async () => {
    if (!userInput.trim() || apiStatus !== 'ready') return;
    const msg = userInput;
    setUserInput('');
    setChatHistory(prev => [...prev, { role: 'user', parts: [{ text: msg }] }]);
    setIsTyping(true);

    try {
      const response = await chatWithHans(msg, chatHistory);
      if (response) {
        setChatHistory(prev => [...prev, { role: 'model', parts: [{ text: response }] }]);
      } else {
        setChatHistory(prev => [...prev, { role: 'model', parts: [{ text: "Ồ, Hans đang bị 'lag' một chút hoặc API Key bị lỗi. Bạn thử hỏi lại hoặc kiểm tra lại Key nhé!" }] }]);
      }
    } catch (error: any) {
      // Fix: Handle specific "Requested entity was not found." error by prompting for a new key.
      if (error?.message?.includes("Requested entity was not found.")) {
        setApiStatus('missing');
        if (window.aistudio?.openSelectKey) {
          await window.aistudio.openSelectKey();
        }
      } else {
        setChatHistory(prev => [...prev, { role: 'model', parts: [{ text: "Hans gặp lỗi kết nối. Hãy thử lại sau nhé!" }] }]);
      }
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
              <Sparkles size={16} /> <span>Học tiếng Đức sinh động cùng Hans AI</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-outfit font-extrabold leading-tight tracking-tight">
              Làm chủ tiếng Đức <br/> <span className="text-yellow-400">cùng Hans.</span>
            </h1>
            <p className="text-slate-400 text-lg max-w-lg leading-relaxed">
              Trải nghiệm học tập cá nhân hóa, bài tập thực tế và kho tàng kiến thức văn hóa phong phú.
            </p>
            <div className="flex flex-wrap gap-4">
              <button 
                onClick={() => setActiveTab('lessons')}
                className="px-8 py-4 bg-yellow-400 text-black font-bold rounded-2xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
              >
                Khám phá bài học
              </button>
              <button 
                onClick={() => setActiveTab('tutor')}
                className="px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl font-bold hover:bg-white/20 transition-all"
              >
                Nói chuyện với Hans
              </button>
            </div>
          </div>
          <div className="hidden lg:block w-64 h-64 bg-slate-700/50 rounded-full border-8 border-slate-700 flex items-center justify-center text-8xl shadow-inner relative">
            🇩🇪
            <div className="absolute -bottom-2 -right-2 w-16 h-16 bg-yellow-400 rounded-2xl flex items-center justify-center text-3xl shadow-lg border-4 border-slate-900">🎓</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] border-2 border-slate-100 shadow-sm relative group overflow-hidden">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <Zap className="text-yellow-500" fill="currentColor" /> Wort des Tages
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
              <div className="absolute -top-3 left-6 px-2 bg-white text-[10px] font-bold text-slate-400 uppercase tracking-widest border border-slate-100 rounded-full">Ví dụ</div>
              "{dailyWord.ex}"
            </div>
          </div>
        </div>

        <div className={`p-8 rounded-[2.5rem] border-2 shadow-sm transition-all flex flex-col justify-between ${randomHint.type === 'culture' ? 'bg-orange-50 border-orange-100' : 'bg-blue-50 border-blue-100'}`}>
          <div className="space-y-4">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg ${randomHint.type === 'culture' ? 'bg-orange-500' : 'bg-blue-500'}`}>
              {randomHint.type === 'culture' ? <Landmark size={24} /> : <Info size={24} />}
            </div>
            <h4 className="text-lg font-bold text-slate-900">{randomHint.title}</h4>
            <p className="text-sm text-slate-600 leading-relaxed">{randomHint.content}</p>
          </div>
          <button 
            onClick={() => setRandomHint(hints[Math.floor(Math.random() * hints.length)])}
            className="mt-6 text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-slate-900 transition-colors"
          >
            Đổi mẹo học tập →
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
            <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-slate-900 ${apiStatus === 'ready' ? 'bg-green-400' : 'bg-red-400 animate-pulse'}`}></div>
          </div>
          <div>
            <h3 className="font-outfit font-bold text-lg">Hans - AI Tutor</h3>
            <p className="text-slate-400 text-xs flex items-center gap-1">
              {apiStatus === 'ready' ? <><CheckCircle size={10} className="text-green-400"/> Đang trực tuyến</> : <><AlertCircle size={10} className="text-red-400"/> Hans đang "ngủ gật" (Thiếu Key)</>}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={checkApiKeyStatus} className="p-2 text-slate-400 hover:text-white transition-colors">
            <RefreshCw size={20} className={apiStatus === 'checking' ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-slate-50/50">
        {apiStatus === 'missing' && (
          <div className="max-w-md mx-auto bg-white border-2 border-red-100 p-8 rounded-[2rem] text-center space-y-6 shadow-xl animate-in zoom-in-95">
            <div className="w-20 h-20 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto border-2 border-red-100">
              <AlertCircle size={40} />
            </div>
            <div>
              <h4 className="text-xl font-bold text-slate-900 mb-2">Chưa tìm thấy API Key!</h4>
              <p className="text-slate-500 text-sm leading-relaxed mb-4">
                Dù bạn đã add vào Vercel, nhưng đôi khi trình duyệt vẫn cần được kích hoạt trực tiếp hoặc Redeploy lại phiên bản mới nhất.
              </p>
              <div className="text-left bg-slate-50 p-4 rounded-xl border border-slate-100 text-[11px] font-mono text-slate-400 space-y-1">
                <p>Diagnostic Check:</p>
                <p>• Window.aistudio: {window.aistudio ? 'DETECTED' : 'NOT FOUND'}</p>
                <p>• process.env.API_KEY: {process.env.API_KEY ? 'EXISTS' : 'UNDEFINED'}</p>
              </div>
            </div>
            <button 
              onClick={handleWakeUpHans}
              className="w-full py-4 bg-red-600 text-white font-bold rounded-2xl hover:bg-slate-900 transition-all flex items-center justify-center gap-2"
            >
              <Settings size={18} /> Kết nối khóa ngay
            </button>
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
              {chat.parts[0].text.split('\n').map((line, i) => (
                <p key={i} className="mb-2 last:mb-0">{line}</p>
              ))}
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white border-2 border-slate-100 p-4 rounded-2xl rounded-tl-none flex gap-1">
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
            placeholder={apiStatus === 'ready' ? "Hỏi Hans bằng tiếng Việt hoặc tiếng Đức..." : "Vui lòng kết nối API trước..."}
            disabled={apiStatus !== 'ready' || isTyping}
            className="w-full pl-6 pr-20 py-5 bg-slate-50 border-2 border-slate-100 rounded-[1.5rem] focus:outline-none focus:border-red-500 focus:bg-white transition-all shadow-sm disabled:opacity-50"
          />
          <button 
            onClick={handleSendMessage}
            disabled={!userInput.trim() || isTyping || apiStatus !== 'ready'}
            className="absolute right-2 top-2 bottom-2 px-6 bg-red-600 text-white rounded-xl font-bold hover:bg-slate-900 transition-all disabled:opacity-50 flex items-center gap-2"
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
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-4xl font-outfit font-extrabold mb-2 text-slate-900">Lộ trình học tập</h1>
              <p className="text-slate-500 font-medium">Bắt đầu hành trình từ A1 đến B1.</p>
            </div>
          </div>
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
