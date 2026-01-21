
import React, { useState, useEffect, useRef } from 'react';
import Layout from './components/Layout';
import LessonContent from './components/LessonContent';
import { lessons } from './data/lessons';
import { hints, Hint } from './data/hints';
import { UserProgress, Lesson } from './types';
import { chatWithHans } from './services/geminiService';
import { Sparkles, Send, BrainCircuit, Star, Flame, Trophy, CheckCircle, BookOpen, MessageCircle, Info, Lightbulb, Landmark, Zap, AlertCircle } from 'lucide-react';

const wordOfTheDay = [
  { de: 'Fernweh', vi: 'Nỗi nhớ những nơi xa lạ (khao khát đi du lịch)', ex: 'Ich habe Fernweh.' },
  { de: 'Feierabend', vi: 'Thời gian nghỉ ngơi sau giờ làm việc', ex: 'Endlich Feierabend!' },
  { de: 'Gemütlichkeit', vi: 'Sự ấm cúng, dễ chịu, thoải mái', ex: 'Die Wohnung hat viel Gemütlichkeit.' },
  { de: 'Weltschmerz', vi: 'Nỗi đau thế giới (cảm giác u sầu về thực tại)', ex: 'Er fühlt Weltschmerz.' }
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
  const [isApiReady, setIsApiReady] = useState(true);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem('deutsch_progress');
    if (saved) setProgress(JSON.parse(saved));
    setRandomHint(hints[Math.floor(Math.random() * hints.length)]);
    setDailyWord(wordOfTheDay[Math.floor(Math.random() * wordOfTheDay.length)]);
    
    // Kiểm tra API Key sơ bộ
    if (!process.env.API_KEY || process.env.API_KEY === "undefined") {
      setIsApiReady(false);
    }
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  const saveProgress = (lessonId: string, score: number) => {
    const newProgress = {
      completedLessons: Array.from(new Set([...progress.completedLessons, lessonId])),
      score: progress.score + score
    };
    setProgress(newProgress);
    localStorage.setItem('deutsch_progress', JSON.stringify(newProgress));
  };

  const handleSendMessage = async () => {
    if (!userInput.trim()) return;
    const msg = userInput;
    setUserInput('');
    setChatHistory(prev => [...prev, { role: 'user', parts: [{ text: msg }] }]);
    setIsTyping(true);

    const response = await chatWithHans(msg, chatHistory);
    setChatHistory(prev => [...prev, { role: 'model', parts: [{ text: response }] }]);
    setIsTyping(false);
  };

  const renderHome = () => (
    <div className="space-y-10 animate-in fade-in duration-700 pb-10">
      <div className="relative overflow-hidden bg-slate-900 rounded-[2.5rem] p-8 md:p-12 text-white shadow-2xl shadow-slate-200">
        <div className="absolute top-0 right-0 w-64 h-64 bg-red-500 opacity-10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-yellow-400 opacity-10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl"></div>
        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-2 text-yellow-400 font-bold mb-4">
            <Sparkles size={20} />
            <span>Herzlich Willkommen!</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-outfit font-bold mb-4 leading-tight">Chinh phục tiếng Đức cùng Hans AI.</h1>
          <p className="text-slate-400 text-lg mb-8 leading-relaxed">Hans là gia sư AI am hiểu văn hóa Đức, giúp bạn học nhanh hơn, nhớ lâu hơn thông qua hội thoại thực tế.</p>
          <div className="flex flex-wrap gap-4">
            <button 
              onClick={() => setActiveTab('lessons')}
              className="px-8 py-4 bg-yellow-400 text-black font-bold rounded-2xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)] hover:translate-y-0.5 transition-transform"
            >
              Bắt đầu học ngay
            </button>
            <div className="flex items-center gap-4 px-6 py-4 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10">
               <span className="text-sm font-medium text-slate-300">Học phí: 0đ (Mãi mãi)</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Word of the day */}
        <div className="bg-white p-8 rounded-[2rem] border-2 border-slate-100 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Zap size={100} />
          </div>
          <div className="flex items-center gap-2 mb-6 text-red-600 font-bold uppercase tracking-tighter text-sm">
            <Zap size={16} /> Wort des Tages (Từ vựng mỗi ngày)
          </div>
          <h3 className="text-4xl font-bold text-slate-900 mb-2 font-outfit">{dailyWord.de}</h3>
          <p className="text-xl text-slate-500 mb-6">{dailyWord.vi}</p>
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 italic text-slate-600">
            "{dailyWord.ex}"
          </div>
        </div>

        {/* Daily Tip */}
        <div className={`p-8 rounded-[2rem] border-2 shadow-sm flex flex-col justify-center gap-4 ${randomHint.type === 'culture' ? 'bg-orange-50 border-orange-100' : 'bg-blue-50 border-blue-100'}`}>
          <div className="flex items-center gap-2">
            <div className={`p-2 rounded-lg ${randomHint.type === 'culture' ? 'bg-orange-500' : 'bg-blue-500'} text-white`}>
              {randomHint.type === 'culture' ? <Landmark size={20} /> : <Info size={20} />}
            </div>
            <span className="font-bold text-slate-900">{randomHint.title}</span>
          </div>
          <p className="text-slate-600 leading-relaxed">{randomHint.content}</p>
          <button onClick={() => setRandomHint(hints[Math.floor(Math.random() * hints.length)])} className="text-sm font-bold text-slate-900 flex items-center gap-1 hover:underline">Xem mẹo khác <Zap size={14} /></button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border-2 border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center">
            <Flame size={28} />
          </div>
          <div>
            <p className="text-slate-400 text-sm font-medium">Chuỗi ngày (Streak)</p>
            <p className="text-2xl font-bold">5 Ngày</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border-2 border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center">
            <Trophy size={28} />
          </div>
          <div>
            <p className="text-slate-400 text-sm font-medium">Tổng điểm</p>
            <p className="text-2xl font-bold">{progress.score} XP</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border-2 border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center">
            <CheckCircle size={28} />
          </div>
          <div>
            <p className="text-slate-400 text-sm font-medium">Bài học đã xong</p>
            <p className="text-2xl font-bold">{progress.completedLessons.length}/{lessons.length}</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTutor = () => (
    <div className="h-[calc(100vh-8rem)] flex flex-col bg-white rounded-[2.5rem] border-2 border-slate-100 overflow-hidden shadow-sm">
      <div className="p-6 bg-slate-50 border-b flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-14 h-14 bg-red-600 rounded-2xl flex items-center justify-center font-bold text-2xl border-2 border-black text-white">H</div>
            <div className={`absolute -bottom-1 -right-1 w-4 h-4 border-2 border-white rounded-full ${isApiReady ? 'bg-green-500' : 'bg-red-500 animate-pulse'}`}></div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-lg">Hans - Gia sư AI</h3>
              {!isApiReady && <span className="bg-red-100 text-red-600 text-[10px] px-2 py-0.5 rounded-full font-bold">LỖI CẤU HÌNH</span>}
            </div>
            <p className="text-slate-500 text-xs">{isApiReady ? 'Đang trực tuyến • Sẵn sàng giúp đỡ' : 'Đang ngoại tuyến • Cần kiểm tra API Key'}</p>
          </div>
        </div>
        <button onClick={() => setChatHistory([])} className="text-slate-400 hover:text-red-500 text-xs font-bold uppercase tracking-wider transition-colors">Xóa lịch sử</button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {!isApiReady && chatHistory.length === 0 && (
          <div className="bg-red-50 border-2 border-red-100 p-6 rounded-3xl space-y-4">
            <div className="flex items-center gap-3 text-red-700 font-bold">
              <AlertCircle size={24} /> Ồ! Hans chưa nhận được chìa khóa (API Key).
            </div>
            <p className="text-red-600 text-sm leading-relaxed">
              Vercel cần bạn thêm biến môi trường có tên <strong>API_KEY</strong> trong phần Project Settings. Nếu bạn đã thêm rồi mà vẫn thấy thông báo này, hãy thử **Redeploy** lại trang web.
            </p>
            <div className="bg-white/50 p-4 rounded-xl border border-red-200">
               <code className="text-xs text-red-900 break-all">Cài đặt -> Environment Variables -> Key: API_KEY -> Value: (Dán key của bạn)</code>
            </div>
          </div>
        )}
        
        {chatHistory.length === 0 && isApiReady && (
          <div className="h-full flex flex-col items-center justify-center text-center max-w-sm mx-auto space-y-4">
             <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mb-2">
                <MessageCircle size={40} />
             </div>
             <p className="text-slate-500 font-medium">Bắt đầu bằng cách hỏi: <strong>"Chào Hans, tiếng Đức khó nhất là phần nào?"</strong></p>
          </div>
        )}

        {chatHistory.map((chat, idx) => (
          <div key={idx} className={`flex ${chat.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`
              max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed
              ${chat.role === 'user' 
                ? 'bg-slate-900 text-white rounded-tr-none' 
                : 'bg-slate-100 text-slate-800 rounded-tl-none border border-slate-200'}
            `}>
              {chat.parts[0].text.split('\n').map((line, i) => {
                if (line.startsWith('HANS_CONFIG_ERROR:')) {
                  return (
                    <div key={i} className="bg-red-50 p-4 rounded-xl border border-red-100 text-red-800 my-2">
                      <p className="font-bold flex items-center gap-2 mb-2"><AlertCircle size={16}/> Lỗi hệ thống</p>
                      {line.replace('HANS_CONFIG_ERROR:', '').split('\n').map((l, j) => <p key={j} className="mb-1">{l}</p>)}
                    </div>
                  );
                }
                return <p key={i} className="mb-2 last:mb-0">{line}</p>
              })}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-slate-100 p-4 rounded-2xl rounded-tl-none flex gap-1">
              <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></span>
              <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-100"></span>
              <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-200"></span>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      <div className="p-6 border-t bg-slate-50">
        <div className="relative">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder={isApiReady ? "Hỏi Hans bất cứ điều gì..." : "Vui lòng cấu hình API Key trước..."}
            disabled={!isApiReady}
            className="w-full pl-6 pr-16 py-4 bg-white border-2 border-slate-200 rounded-2xl focus:outline-none focus:border-red-500 transition-colors shadow-sm disabled:bg-slate-100 disabled:cursor-not-allowed"
          />
          <button 
            onClick={handleSendMessage}
            disabled={!userInput.trim() || isTyping || !isApiReady}
            className="absolute right-2 top-2 p-3 bg-red-600 text-white rounded-xl hover:bg-yellow-400 hover:text-black transition-all disabled:opacity-50"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      {activeTab === 'home' && renderHome()}
      {activeTab === 'lessons' && (
        <div className="space-y-8 animate-in slide-in-from-right-10 duration-500 pb-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl font-outfit font-bold mb-2">Lộ trình học tập</h1>
              <p className="text-slate-500">Học theo từng bước để xây dựng nền móng vững chắc.</p>
            </div>
            <div className="flex gap-2">
              {['A1', 'A2', 'B1'].map(lv => (
                <button key={lv} className={`px-4 py-2 rounded-xl font-bold border-2 ${lv === 'A1' ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-400 border-slate-100'}`}>{lv}</button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {lessons.map(lesson => {
              const isCompleted = progress.completedLessons.includes(lesson.id);
              return (
                <div 
                  key={lesson.id} 
                  onClick={() => { setSelectedLesson(lesson); setActiveTab('lesson-detail'); }}
                  className={`
                    group bg-white p-6 rounded-[2rem] border-2 transition-all cursor-pointer relative overflow-hidden
                    ${isCompleted ? 'border-green-200' : 'border-slate-100 hover:border-yellow-400 hover:shadow-xl hover:-translate-y-1'}
                  `}
                >
                  {isCompleted && (
                    <div className="absolute top-4 right-4 text-green-500">
                      <CheckCircle size={24} fill="currentColor" className="text-white" />
                    </div>
                  )}
                  <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <BookOpen className="text-slate-700" size={24} />
                  </div>
                  <h3 className="font-bold text-lg mb-1 leading-tight">{lesson.title}</h3>
                  <p className="text-slate-400 text-sm mb-4 line-clamp-2">{lesson.description}</p>
                  <div className="mt-auto flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800 bg-slate-100 px-3 py-1 rounded-full">{lesson.level}</span>
                    <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">{lesson.category}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
      {activeTab === 'tutor' && renderTutor()}
      {activeTab === 'progress' && (
         <div className="space-y-8 animate-in zoom-in-95 duration-500 pb-10">
           <h1 className="text-3xl font-outfit font-bold">Bảng vàng thành tích</h1>
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-white p-8 rounded-[2rem] border-2 border-slate-100 flex flex-col items-center text-center">
                 <div className="w-24 h-24 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center mb-6 border-4 border-yellow-50">
                    <Trophy size={48} />
                 </div>
                 <h2 className="text-3xl font-bold mb-2">{progress.score}</h2>
                 <p className="text-slate-500 font-medium">Tổng điểm kinh nghiệm (XP)</p>
              </div>
              <div className="bg-white p-8 rounded-[2rem] border-2 border-slate-100 flex flex-col items-center text-center">
                 <div className="w-24 h-24 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-6 border-4 border-blue-50">
                    <BookOpen size={48} />
                 </div>
                 <h2 className="text-3xl font-bold mb-2">{progress.completedLessons.length}</h2>
                 <p className="text-slate-500 font-medium">Bài học đã hoàn thành</p>
              </div>
           </div>
         </div>
      )}
      {activeTab === 'lesson-detail' && selectedLesson && (
        <LessonContent 
          lesson={selectedLesson} 
          onComplete={(score) => {
            saveProgress(selectedLesson.id, score);
            setActiveTab('home');
          }}
          onBack={() => setActiveTab('lessons')}
        />
      )}
    </Layout>
  );
};

export default App;
