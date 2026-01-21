
import React, { useState } from 'react';
import { BookOpen, MessageCircle, Home, Award, ChevronRight, Menu, X, Share2, CheckCircle } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showCopiedMsg, setShowCopiedMsg] = useState(false);

  const navItems = [
    { id: 'home', label: 'Trang chủ', icon: Home },
    { id: 'lessons', label: 'Bài học', icon: BookOpen },
    { id: 'tutor', label: 'Gia sư AI', icon: MessageCircle },
    { id: 'progress', label: 'Tiến độ', icon: Award },
  ];

  const handleShare = async () => {
    const shareData = {
      title: 'DeutschLernen Pro',
      text: 'Cùng mình học tiếng Đức cực vui với Hans AI nhé!',
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setShowCopiedMsg(true);
        setTimeout(() => setShowCopiedMsg(false), 2000);
      }
    } catch (err) {
      console.log('Error sharing:', err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50">
      {/* Mobile Header */}
      <header className="md:hidden bg-white border-b px-4 py-3 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-yellow-400 rounded-lg flex items-center justify-center font-bold text-black border-2 border-black">D</div>
          <span className="font-outfit font-bold text-xl tracking-tight">DeutschPro</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleShare} className="p-2 text-slate-500">
            <Share2 size={20} />
          </button>
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </header>

      {/* Sidebar Navigation */}
      <aside className={`
        fixed inset-0 z-40 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        w-64 bg-white border-r h-full flex flex-col p-6
      `}>
        <div className="hidden md:flex items-center gap-3 mb-10">
          <div className="w-10 h-10 bg-yellow-400 rounded-xl flex items-center justify-center font-bold text-xl text-black border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">D</div>
          <span className="font-outfit font-bold text-2xl tracking-tight text-slate-800">DeutschPro</span>
        </div>

        <nav className="flex-1 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setIsMobileMenuOpen(false);
              }}
              className={`
                w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                ${activeTab === item.id 
                  ? 'bg-yellow-400 text-black font-semibold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] border-2 border-black' 
                  : 'text-slate-500 hover:bg-slate-100'}
              `}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
              {activeTab === item.id && <ChevronRight size={16} className="ml-auto" />}
            </button>
          ))}
          
          <div className="pt-4 mt-4 border-t border-slate-100">
            <button
              onClick={handleShare}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:bg-slate-100 transition-all relative"
            >
              <Share2 size={20} />
              <span>Chia sẻ ngay</span>
              {showCopiedMsg && (
                <div className="absolute left-full ml-2 bg-slate-800 text-white text-[10px] py-1 px-2 rounded whitespace-nowrap animate-in fade-in slide-in-from-left-2">
                  Đã sao chép!
                </div>
              )}
            </button>
          </div>
        </nav>

        <div className="mt-auto pt-6 border-t">
          <div className="p-4 bg-slate-900 rounded-2xl text-white">
            <p className="text-xs font-medium text-slate-400 mb-1">Cấp độ hiện tại</p>
            <p className="font-bold text-lg mb-3">Người mới bắt đầu (A1)</p>
            <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
              <div className="bg-yellow-400 h-full w-1/4"></div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 h-screen overflow-y-auto p-4 md:p-8">
        <div className="max-w-5xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
