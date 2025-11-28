import React from 'react';
import { useStore } from '../store/useStore';

const Settings: React.FC = () => {
  const { user, logout } = useStore();

  const handleReset = () => {
    if (confirm("Are you sure? This will delete all your chats, cards, and progress.")) {
        logout();
        // Removed window.location.reload(); 
        // The state change in useStore (user -> null) immediately triggers App.tsx to render Onboarding.
    }
  };

  const handleFeedback = () => {
    const feedback = prompt("What can we improve?");
    if (feedback) {
        alert("Thank you! Your feedback has been recorded.");
        console.log("User Feedback:", feedback);
    }
  };

  return (
    <div className="p-6 space-y-8 bg-gray-50/30 min-h-full">
        <div className="text-center pt-8">
            <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl text-white font-bold shadow-xl shadow-blue-200">
                {user?.name.charAt(0)}
            </div>
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">{user?.name}</h2>
            <div className="inline-block mt-2 px-3 py-1 bg-white border border-gray-100 rounded-full text-xs font-semibold text-gray-500 uppercase tracking-wide shadow-sm">
                {user?.grade}
            </div>
        </div>

        <div className="bg-white rounded-3xl shadow-[0_2px_8px_rgba(0,0,0,0.02)] border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-50">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">My Subjects</h3>
                <div className="flex flex-wrap gap-2">
                    {user?.subjects.map(s => (
                        <span key={s} className="px-3 py-1.5 bg-gray-50 border border-gray-100 text-gray-600 text-xs font-medium rounded-lg">{s}</span>
                    ))}
                </div>
            </div>
            
            <button 
                onClick={handleFeedback}
                className="w-full text-left p-6 hover:bg-gray-50 flex justify-between items-center transition-colors group"
            >
                <span className="text-gray-700 font-medium group-hover:text-blue-600 transition-colors">Send Feedback</span>
                <span className="text-gray-300 group-hover:translate-x-1 transition-transform">→</span>
            </button>
        </div>

        <div className="bg-blue-50/50 rounded-2xl p-6 border border-blue-100/50">
            <p className="text-xs text-blue-800 leading-relaxed font-medium">
                <strong>Disclaimer:</strong> Lexis AI uses artificial intelligence. While we strive for accuracy based on the NaCCA/GES curriculum, mistakes can happen. Always verify critical information.
            </p>
        </div>

        <button 
            onClick={handleReset}
            className="w-full py-4 text-red-600 font-semibold bg-white border border-red-100 hover:bg-red-50 hover:border-red-200 rounded-2xl transition-all shadow-sm active:scale-95"
        >
            Reset App / Logout
        </button>

        <div className="text-center pb-8 opacity-50">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                Lexis AI MVP v0.1.3
            </p>
            <p className="text-[10px] text-gray-400 mt-1">Built for Ghana 🇬🇭</p>
        </div>
    </div>
  );
};

export default Settings;