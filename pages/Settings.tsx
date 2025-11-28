
import React from 'react';
import { useStore } from '../store/useStore';

const Settings: React.FC = () => {
    const { user, logout, dailyGoalMinutes, setDailyGoalMinutes } = useStore();
    const [goalInput, setGoalInput] = React.useState<number>(dailyGoalMinutes);

    const handleReset = () => {
        if (confirm("Are you sure? This will delete all your chats, cards, and progress.")) {
            logout();
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
        <div className="min-h-screen bg-white py-10 px-4 flex flex-col items-center">
            {/* Profile Card */}
            <div className="w-full max-w-md bg-white rounded-3xl shadow-lg border border-gray-100 mb-8 p-8 flex flex-col items-center">
                <div className="relative mb-4">
                    <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-blue-400 rounded-full flex items-center justify-center text-3xl text-white font-bold shadow-xl">
                        {user?.name.charAt(0)}
                    </div>
                    <button className="absolute bottom-2 right-2 bg-white border border-gray-200 rounded-full p-2 shadow hover:bg-gray-50 transition" title="Edit Profile">
                        <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a2 2 0 01-2.828 0L9 13z" /></svg>
                    </button>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 tracking-tight mb-1">{user?.name}</h2>
                <div className="inline-block px-3 py-1 bg-gray-50 border border-gray-100 rounded-full text-xs font-semibold text-gray-500 uppercase tracking-wide shadow-sm mb-2">
                    {user?.grade}
                </div>
                <div className="flex flex-wrap gap-2 justify-center mt-2">
                    {user?.subjects.map(s => (
                        <span key={s} className="px-3 py-1.5 bg-blue-50 border border-blue-100 text-blue-700 text-xs font-medium rounded-lg">{s}</span>
                    ))}
                </div>
            </div>

            {/* Settings Card */}
            <div className="w-full max-w-md bg-white rounded-3xl shadow-lg border border-gray-100 mb-8 p-6">
                <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-4">Preferences</h3>
                <div className="flex flex-col gap-4">
                    {/* Daily Goal Setting */}
                    <div className="flex items-center justify-between">
                        <span className="text-gray-600 font-medium">Daily Goal (minutes)</span>
                        <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 shadow-sm">
                            <span className="text-blue-600 mr-1">
                                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                            </span>
                            <input
                                type="number"
                                min={5}
                                max={180}
                                value={goalInput}
                                onChange={e => setGoalInput(Number(e.target.value))}
                                className="w-14 px-2 py-1 bg-transparent border-none text-center text-base font-semibold text-gray-900 focus:outline-none"
                            />
                            <span className="text-gray-500 text-sm font-medium ml-1">min</span>
                            <button
                                onClick={() => setDailyGoalMinutes(goalInput)}
                                className="px-3 py-1 bg-blue-600 text-white rounded-lg text-xs font-bold shadow ml-2"
                                disabled={goalInput < 5 || goalInput > 180 || goalInput === dailyGoalMinutes}
                            >
                                Save
                            </button>
                        </div>
                    </div>
                    {/* Example Toggle */}
                    <div className="flex items-center justify-between">
                        <span className="text-gray-600 font-medium">Dark Mode</span>
                        <label className="inline-flex items-center cursor-pointer">
                            <input type="checkbox" disabled className="sr-only" />
                            <span className="w-10 h-6 bg-gray-200 rounded-full flex items-center px-1">
                                <span className="w-4 h-4 bg-white rounded-full shadow transition" />
                            </span>
                        </label>
                    </div>
                </div>
            </div>

            {/* Feedback & Danger Zone */}
            <div className="w-full max-w-md flex flex-col gap-4">
                <button 
                    onClick={handleFeedback}
                    className="w-full flex items-center justify-between px-6 py-4 bg-white border border-gray-100 rounded-2xl shadow-sm hover:bg-gray-50 transition group"
                >
                    <span className="text-gray-700 font-medium group-hover:text-blue-600 transition">Send Feedback</span>
                    <svg className="w-5 h-5 text-gray-300 group-hover:text-blue-400 transition" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                </button>
                <button 
                    onClick={handleReset}
                    className="w-full flex items-center justify-between px-6 py-4 bg-red-50 border border-red-100 rounded-2xl shadow-sm hover:bg-red-100 transition group"
                >
                    <span className="text-red-700 font-medium">Reset App / Logout</span>
                    <svg className="w-5 h-5 text-red-300 group-hover:text-red-500 transition" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
            </div>

            {/* Disclaimer Card */}
            <div className="w-full max-w-md bg-blue-50 rounded-2xl p-6 border border-blue-100 mt-8">
                <p className="text-xs text-blue-800 leading-relaxed font-medium">
                    <strong>Disclaimer:</strong> Lexis AI uses artificial intelligence. While we strive for accuracy based on the NaCCA/GES curriculum, mistakes can happen. Always verify critical information.
                </p>
            </div>

            {/* Footer */}
            <div className="text-center pt-8 pb-4 opacity-50">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    Lexis AI MVP v0.1.3
                </p>
                <p className="text-[10px] text-gray-400 mt-1">Built for Ghana 🇬🇭</p>
            </div>
        </div>
    );
};

export default Settings;