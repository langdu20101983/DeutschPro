
import React, { useState, useEffect, useRef } from 'react';
import Layout from './components/Layout';
import LessonContent from './components/LessonContent';
import { lessons as staticLessons } from './data/lessons';
import { hints, Hint } from './data/hints';
import { UserProgress, Lesson } from './types';
import { chatWithHans, generateDailyLesson } from './services/geminiService';
import { 
  Sparkles, Send, Flame, Trophy, CheckCircle, 
  BookOpen, MessageCircle, Info, Landmark, 
  Zap, AlertCircle, RefreshCw, Volume2, ShieldAlert,
  Calendar, Star
} from 'lucide-react';

/* Use the pre-defined AIStudio type to avoid declaration conflicts */
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
  const [dailyAILesson, setDailyAILesson] = useState<Lesson | null>(null);
  const [isLoadingDaily, setIsLoadingDaily] = useState(false);
  const [progress, setProgress] = useState<UserProgress>({
    completedLessons: [],
    score: 0
  });

  const [chatHistory, setChatHistory] = useState<{ role: 'user' | 'model'; parts: { text: string }[] }[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const [isApiKeyReady, setIsApiKeyReady] = useState(!!process.env.API_KEY && process.env.API_KEY !== "undefined");

  useEffect(() => {
    const saved = localStorage.getItem('deutsch_progress');
    if (saved) setProgress(JSON.parse(saved));
    setRandomHint(hints[Math.floor(Math.random() * hints.length)]);
    setDailyWord(wordOfTheDay[Math.floor(Math.random() * wordOfTheDay.length)]);

    const checkKeyStatus = async () => {
      if (window.aistudio) {
        try {
          const selected = await window.aistudio.hasSelectedApiKey();
          setIsApiKeyReady(selected);
          if (selected) fetchDailyAILesson();
        } catch (err) {
          console.error("Error checking key status:", err);
        }
      } else if (isApiKeyReady) {
        fetchDailyAILesson();
      }
    };
    checkKeyStatus();
  }, []);

  const fetchDailyAILesson = async () => {
    setIsLoadingDaily(true);
    const lesson = await generateDailyLesson();
    if (lesson) setDailyAILesson(lesson);
    setIsLoadingDaily(false);
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  const handleOpenKeySelector = async () => {
    if (window.aistudio) {
      try {
        await window.aistudio.openSelectKey();
        setIsApiKeyReady(true);
        fetchDailyAILesson();
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
      }
    } catch (error: any) {
      if (error?.message?.includes("Requested entity was not found.")) setIsApiKeyReady(false);
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
              <Sparkles size={16} /> <span>Hans AI đã sẵn sàng</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-outfit font-extrabold leading-tight tracking-tight">
              Deutsch học <br/> <span className="text-yellow-400">mỗi ngày.</span>
            </h1>
            <p className="text-slate-400 text-lg max-w-lg leading-relaxed">
              Khám phá kho bài học khổng lồ và nhận giáo án riêng biệt từ AI Hans mỗi ngày.
            </p>
            <div className="flex flex-wrap gap-4">
              <button onClick={() => setActiveTab('lessons')} className="px-8 py-4 bg-yellow-400 text-black font-bold rounded-2xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)] hover:translate-x-1 hover:translate-y-1 transition-all">
                Lộ trình học
              </button>
            </div>
          </div>
          <div className="hidden lg:block w-64 h-64 bg-slate-700/50 rounded-full border-8 border-slate-700 flex items-center justify-center text-8xl shadow-inner relative">
            🥨
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* AI Daily Lesson Card */}
          <div className="bg-white p-8 rounded-[2.5rem] border-2 border-slate-100 shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Calendar className="text-red-500" /> Bài học đặc biệt hôm nay
              </h3>
              <span className="text-xs bg-red-100 text-red-600 px-3 py-1 rounded-full font-bold uppercase">AI Generated</span>
            </div>
            
            {isLoadingDaily ? (
              <div className="py-12 flex flex-col items-center justify-center space-y-4">
                <div className="w-10 h-10 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-slate-400 font-medium italic">Hans đang soạn bài cho bạn...</p>
              </div>
            ) : dailyAILesson ? (
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="flex-1 space-y-4">
                  <h4 className="text-2xl font-black text-slate-800">{dailyAILesson.title}</h4>
                  <p className="text-slate-500 line-clamp-2">{dailyAILesson.description}</p>
                  <button 
                    onClick={() => { setSelectedLesson(dailyAILesson); setActiveTab('lesson-detail'); }}
                    className="flex items-center gap-2 text-red-600 font-bold hover:gap-4 transition-all"
                  >
                    Học ngay bài này <Star size={18} fill="currentColor" />
                  </button>
                </div>
                <div className="w-24 h-24 bg-red-50 rounded-3xl flex items-center justify-center text-4xl">
                  🎓
                </div>
              </div>
            ) : (
              <div className="py-8 text-center text-slate-400 italic">
                Cần API Key để nhận bài học hàng ngày từ Hans!
              </div>
            )}
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] border-2 border-slate-100 shadow-sm">
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
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className={`p-8 rounded-[2.5rem] border-2 shadow-sm flex flex-col h-full justify-between ${randomHint.type === 'culture' ? 'bg-orange-50 border-orange-100' : 'bg-blue-50 border-blue-100'}`}>
            <div className="space-y-4">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-2xl">
                {randomHint.type === 'culture' ? '🏰' : '💡'}
              </div>
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
    </div>
  );

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      {activeTab === 'home' && renderHome()}
      {activeTab === 'lessons' && (
        <div className="space-y-10 pb-20 animate-in fade-in duration-500">
          <div className="flex items-center justify-between">
            <h1 className="text-4xl font-outfit font-extrabold text-slate-900">Lộ trình học tập</h1>
            <div className="flex gap-2">
              <span className="px-4 py-2 bg-white border rounded-full text-xs font-bold text-slate-500">{staticLessons.length} bài học có sẵn</span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {staticLessons.map(lesson => {
              const isCompleted = progress.completedLessons.includes(lesson.id);
              return (
                <div 
                  key={lesson.id} 
                  onClick={() => { setSelectedLesson(lesson); setActiveTab('lesson-detail'); }}
                  className={`
                    group bg-white p-8 rounded-[2.5rem] border-2 transition-all cursor-pointer relative flex flex-col h-full
                    ${isCompleted ? 'border-green-200' : 'border-slate-100 hover:border-red-400 hover:shadow-2xl hover:-translate-y-2'}
                  `}
                >
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-all ${isCompleted ? 'bg-green-100 text-green-600' : 'bg-slate-50 group-hover:bg-red-500 group-hover:text-white'}`}>
                    <BookOpen size={28} />
                  </div>
                  <h3 className="font-outfit font-bold text-xl mb-2 text-slate-900">{lesson.title}</h3>
                  <p className="text-slate-400 text-sm mb-6 flex-grow line-clamp-2">{lesson.description}</p>
                  <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                    <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-lg ${lesson.level === 'A1' ? 'bg-blue-100 text-blue-600' : lesson.level === 'A2' ? 'bg-orange-100 text-orange-600' : 'bg-purple-100 text-purple-600'}`}>
                      {lesson.level}
                    </span>
                    {isCompleted && <CheckCircle size={20} className="text-green-500" />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
      {activeTab === 'tutor' && (
        <div className="h-[calc(100vh-10rem)] flex flex-col bg-white rounded-[3rem] border-2 border-slate-100 overflow-hidden shadow-xl mb-10">
          <div className="px-8 py-6 bg-slate-900 text-white flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-red-600 rounded-2xl flex items-center justify-center font-bold text-2xl border-2 border-white relative">
                H
                <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-slate-900 ${isApiKeyReady ? 'bg-green-400' : 'bg-red-400 animate-pulse'}`}></div>
              </div>
              <div>
                <h3 className="font-outfit font-bold text-lg">Hans - AI Tutor</h3>
                <p className="text-slate-400 text-xs">{isApiKeyReady ? 'Đang online' : 'Yêu cầu API Key'}</p>
              </div>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-slate-50/50">
            {!isApiKeyReady && (
              <div className="max-w-md mx-auto bg-white border-2 border-red-100 p-8 rounded-[2rem] text-center space-y-6">
                <ShieldAlert size={32} className="mx-auto text-red-500" />
                <p className="text-slate-500 text-sm">Hans cần API Key để bắt đầu cuộc trò chuyện vui vẻ với bạn!</p>
                <button onClick={handleOpenKeySelector} className="w-full py-4 bg-red-600 text-white font-bold rounded-xl">Chọn API Key</button>
              </div>
            )}
            {chatHistory.map((chat, idx) => (
              <div key={idx} className={`flex ${chat.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-5 rounded-[1.5rem] text-sm ${chat.role === 'user' ? 'bg-slate-900 text-white' : 'bg-white text-slate-800 border-2 border-slate-100'}`}>
                  {chat.parts[0].text}
                </div>
              </div>
            ))}
            {isTyping && <div className="text-slate-400 text-xs italic">Hans đang gõ...</div>}
            <div ref={chatEndRef} />
          </div>
          <div className="p-8 bg-white border-t">
            <div className="relative max-w-4xl mx-auto flex gap-2">
              <input type="text" value={userInput} onChange={(e) => setUserInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()} placeholder="Hỏi Hans bất cứ điều gì..." className="flex-1 px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-xl" disabled={!isApiKeyReady} />
              <button onClick={handleSendMessage} className="p-4 bg-red-600 text-white rounded-xl"><Send size={18} /></button>
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
