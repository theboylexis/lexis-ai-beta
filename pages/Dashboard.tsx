import React, { useMemo, useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Logo } from '../components/Logo';

const QUOTES = [
  { text: "It always seems impossible until it is done.", author: "Nelson Mandela" },
  { text: "Education is the most powerful weapon which you can use to change the world.", author: "Nelson Mandela" },
  { text: "The beautiful thing about learning is that no one can take it away from you.", author: "B.B. King" },
  { text: "Nyansa po, wim na oye. (Wisdom is like a baobab tree; no one individual can embrace it.)", author: "Akan Proverb" },
  { text: "Strive for progress, not perfection.", author: "Unknown" },
  { text: "Whatever you do, do it well.", author: "Walt Disney" },
];

const Dashboard: React.FC = () => {
  const { user, stats } = useStore();
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const data = [
    { name: 'Completed', value: stats.totalStudyMinutes },
    { name: 'Remaining', value: Math.max(0, 120 - stats.totalStudyMinutes) }, // Goal 2 hours
  ];
  const COLORS = ['#3b82f6', '#f1f5f9'];

  const dailyQuote = useMemo(() => {
    // Simple pseudo-random based on date so it stays same for the day
    const today = new Date().getDate();
    return QUOTES[today % QUOTES.length];
  }, []);

  return (
    <div className="p-5 space-y-6">
      
      {/* Welcome Card */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 rounded-3xl p-7 text-white shadow-xl shadow-indigo-200/50">
        <div className="relative z-10">
            <div className="flex items-center gap-3 mb-2">
                <Logo className="w-8 h-8 opacity-90" />
                <h2 className="text-2xl font-bold tracking-tight">Hello, {user?.name.split(' ')[0]}!</h2>
            </div>
            <p className="text-blue-100 text-sm font-medium opacity-90 ml-1">Your daily goal is 2 hours. Keep going!</p>
            
            <div className="mt-6 flex items-center gap-3">
                <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-xl px-4 py-2.5 flex flex-col min-w-[80px]">
                    <span className="text-[10px] uppercase tracking-wider text-blue-100 opacity-70 mb-0.5">Streak</span>
                    <span className="font-bold text-lg leading-none">🔥 {stats.streakDays}</span>
                </div>
                <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-xl px-4 py-2.5 flex flex-col min-w-[80px]">
                    <span className="text-[10px] uppercase tracking-wider text-blue-100 opacity-70 mb-0.5">XP</span>
                    <span className="font-bold text-lg leading-none">✨ {stats.totalStudyMinutes * 10}</span>
                </div>
            </div>
        </div>
        
        {/* Decorational Circle */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white opacity-5 rounded-full blur-2xl pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-indigo-500 opacity-20 rounded-full blur-xl pointer-events-none"></div>
      </div>

      {/* Daily Wisdom */}
      <div className="bg-amber-50 rounded-2xl p-5 border border-amber-100 relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-xs font-bold text-amber-600 uppercase tracking-widest mb-2 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" x2="12" y1="1" y2="3"/><line x1="12" x2="12" y1="21" y2="23"/><line x1="4.22" x2="5.64" y1="4.22" y2="5.64"/><line x1="18.36" x2="19.78" y1="18.36" y2="19.78"/><line x1="1" x2="3" y1="12" y2="12"/><line x1="21" x2="23" y1="12" y2="12"/><line x1="4.22" x2="5.64" y1="19.78" y2="18.36"/><line x1="18.36" x2="19.78" y1="5.64" y2="4.22"/></svg>
                Daily Wisdom
            </h3>
            <p className="text-gray-800 text-sm italic font-medium leading-relaxed">"{dailyQuote.text}"</p>
            <p className="text-gray-500 text-xs mt-2 font-semibold">— {dailyQuote.author}</p>
          </div>
          <div className="absolute top-0 right-0 -mt-2 -mr-2 w-16 h-16 bg-amber-100 rounded-full opacity-50 blur-xl"></div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
            <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                <div className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Study Time</div>
            </div>
            <div className="text-3xl font-bold text-gray-900 tracking-tight">{stats.totalStudyMinutes}<span className="text-sm text-gray-400 font-medium ml-1">min</span></div>
        </div>
        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
             <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                <div className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Reviewed</div>
            </div>
            <div className="text-3xl font-bold text-gray-900 tracking-tight">{stats.cardsReviewed}<span className="text-sm text-gray-400 font-medium ml-1">cards</span></div>
        </div>
      </div>

      {/* Goal Chart */}
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
        <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-gray-900">Daily Progress</h3>
            <span className="text-xs font-medium text-gray-400 bg-gray-50 px-2 py-1 rounded-lg">Goal: 120m</span>
        </div>
        <div className="h-48 w-full flex items-center justify-center relative">
             <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                    cornerRadius={6}
                    startAngle={90}
                    endAngle={-270}
                >
                    {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-4xl font-bold text-gray-900 tracking-tighter">{Math.min(100, Math.round((stats.totalStudyMinutes / 120) * 100))}%</span>
                <span className="text-xs text-gray-400 font-medium mt-1">COMPLETED</span>
            </div>
        </div>
      </div>

      {/* Offline Mode Indicator */}
      <div className={`border rounded-2xl p-4 flex items-center gap-3 backdrop-blur-sm transition-colors ${isOnline ? 'bg-emerald-50/50 border-emerald-100/50' : 'bg-orange-50/50 border-orange-100/50'}`}>
        <div className="relative flex h-2.5 w-2.5">
          {isOnline && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>}
          <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${isOnline ? 'bg-emerald-500' : 'bg-orange-500'}`}></span>
        </div>
        <p className={`text-xs font-medium ${isOnline ? 'text-emerald-800' : 'text-orange-800'}`}>
            {isOnline ? "Online. Data syncing." : "Offline Mode. Data saved to device."}
        </p>
      </div>
    </div>
  );
};

export default Dashboard;