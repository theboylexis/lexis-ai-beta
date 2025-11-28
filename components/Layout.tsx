
import React from 'react';
import { useStore } from '../store/useStore';
import { Logo } from './Logo';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, onTabChange }) => {
  const user = useStore((state) => state.user);

  // SVG Icons
  const Icons = {
    Dashboard: (props: any) => (
      <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="9" x="3" y="3" rx="1" /><rect width="7" height="5" x="14" y="3" rx="1" /><rect width="7" height="9" x="14" y="12" rx="1" /><rect width="7" height="5" x="3" y="16" rx="1" /></svg>
    ),
    Tutor: (props: any) => (
      <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><path d="M8 10h.01"/><path d="M12 10h.01"/><path d="M16 10h.01"/></svg>
    ),
    Library: (props: any) => (
      <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></svg>
    ),
    Exams: (props: any) => (
      <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22h6a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v10" /><path d="M14 2v4a2 2 0 0 0 2 2h4" /><path d="M10.4 12.6a2 2 0 1 1 3 3L8 21l-4 1 1-4Z" /></svg>
    ),
    Cards: (props: any) => (
      <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 18H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v1h-3.414a2 2 0 0 0-1.414.586L16.586 7.172A2 2 0 0 1 15.172 7.757H6a2 2 0 0 0-2 2v8.243a2 2 0 0 0 2 2z"/><path d="M6 18h14a2 2 0 0 0 2-2v-8"/><path d="M6 18v2a2 2 0 0 0 2 2h12"/></svg>
    ),
    Planner: (props: any) => (
      <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2" /><line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" /></svg>
    ),
    Settings: (props: any) => (
        <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.09a2 2 0 0 1-1-1.74v-.47a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.39a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
    )
  };

  const navItems = [
      { id: 'dashboard', icon: Icons.Dashboard, label: 'Home' },
      { id: 'library', icon: Icons.Library, label: 'Library' },
      { id: 'tutor', icon: Icons.Tutor, label: 'AI Tutor' },
      { id: 'exams', icon: Icons.Exams, label: 'Exams' },
      { id: 'flashcards', icon: Icons.Cards, label: 'Flashcards' },
      { id: 'planner', icon: Icons.Planner, label: 'Planner' },
  ];

  return (
    // ROOT CONTAINER: Forces Full Screen Desktop Layout (No mobile frame)
    <div className="flex h-screen w-full bg-gray-50 font-sans text-gray-900 overflow-hidden">
      
      {/* --- DESKTOP SIDEBAR (Visible on md+) --- */}
      <aside className="hidden md:flex w-64 bg-white border-r border-gray-200 flex-col shrink-0 z-20 h-full shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
        {/* Logo Area */}
        <div className="h-16 flex items-center px-6 border-b border-gray-100">
            <Logo className="w-8 h-8 mr-3" />
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">Lexis AI</h1>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
            {navItems.map((item) => (
                <button
                    key={item.id}
                    onClick={() => onTabChange(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${
                        activeTab === item.id 
                        ? 'bg-blue-50 text-blue-700 shadow-sm ring-1 ring-blue-100' 
                        : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                >
                    <item.icon className={`w-5 h-5 transition-colors ${activeTab === item.id ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'}`} strokeWidth={activeTab === item.id ? 2.5 : 2} />
                    {item.label}
                </button>
            ))}
        </nav>

        {/* User Profile Footer */}
        <div className="p-4 border-t border-gray-100">
            <button 
                onClick={() => onTabChange('settings')}
                className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 transition-colors text-left"
            >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center text-indigo-700 font-bold border border-white shadow-sm shrink-0">
                    {user?.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{user?.name}</p>
                    <p className="text-xs text-gray-500 truncate">{user?.grade}</p>
                </div>
                <Icons.Settings className="w-4 h-4 text-gray-400" />
            </button>
        </div>
      </aside>


      {/* --- MAIN CONTENT AREA --- */}
      <main className="flex-1 flex flex-col h-full relative w-full overflow-hidden bg-gray-50/30">
        
        {/* Mobile Header (Hidden on Desktop) */}
        <header className="md:hidden flex-none bg-white border-b border-gray-200/50 px-5 py-4 flex justify-between items-center z-30 sticky top-0">
          <div className="flex items-center gap-3">
             <Logo className="w-8 h-8" />
             <h1 className="text-lg font-bold text-gray-900 tracking-tight">Lexis AI</h1>
          </div>
          <button 
              onClick={() => onTabChange('settings')}
              className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center text-indigo-700 font-semibold border border-white shadow-sm text-sm"
          >
              {user?.name.charAt(0)}
          </button>
        </header>

        {/* Page Content - Full Width & Height */}
        <div className="flex-1 overflow-y-auto scroll-smooth">
            <div className="h-full w-full max-w-7xl mx-auto md:p-8">
                {children}
            </div>
        </div>

        {/* Mobile Bottom Nav (Hidden on Desktop) */}
        <nav className="md:hidden flex-none bg-white border-t border-gray-200/50 w-full z-30 pb-safe">
          <div className="flex justify-between items-center h-16 px-2 overflow-x-auto no-scrollbar">
              {navItems.map((item) => (
                  <button 
                      key={item.id}
                      onClick={() => onTabChange(item.id)}
                      className={`relative flex flex-col items-center justify-center min-w-[60px] h-full space-y-1 group transition-all duration-200 ${
                          activeTab === item.id ? 'text-blue-600' : 'text-gray-400 hover:text-gray-500'
                      }`}
                  >
                      {activeTab === item.id && (
                          <span className="absolute -top-[1px] w-8 h-0.5 bg-blue-600 rounded-full shadow-[0_0_8px_rgba(37,99,235,0.5)]"></span>
                      )}
                      <item.icon className={`w-6 h-6 transition-transform duration-200 ${activeTab === item.id ? 'scale-110' : 'group-hover:scale-105'}`} strokeWidth={activeTab === item.id ? 2.5 : 2} />
                      <span className="text-[10px] font-medium tracking-wide">{item.label}</span>
                  </button>
              ))}
          </div>
        </nav>

      </main>
    </div>
  );
};

export default Layout;
