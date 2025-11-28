import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { generateStudyPlan } from '../services/geminiService';

const Planner: React.FC = () => {
  const { user, weeklyPlan, setWeeklyPlan } = useStore();
  const [weakAreas, setWeakAreas] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = async () => {
    if (!user) return;
    setIsLoading(true);
    const tasks = await generateStudyPlan(user.grade, user.subjects, weakAreas || "General revision");
    const formattedPlan = {
      weekId: Date.now().toString(),
      generatedAt: Date.now(),
      tasks: tasks.map((t: any) => ({ ...t, id: Math.random().toString(36), completed: false }))
    };
    setWeeklyPlan(formattedPlan);
    setIsLoading(false);
  };

  return (
    <div className="p-6 min-h-full bg-white">
      {!weeklyPlan ? (
        <>
          <div className="bg-gradient-to-r from-blue-600 to-blue-400 rounded-3xl p-8 text-white mb-8 shadow-xl shadow-blue-200">
            <h2 className="text-2xl font-bold mb-2">Smart Planner</h2>
            <p className="text-blue-100 text-sm leading-relaxed opacity-90">
              Tell me what you're struggling with, and I'll build a custom timetable for you.
            </p>
            <div className="flex justify-center mt-8">
              <button
                onClick={handleGenerate}
                disabled={isLoading}
                className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all flex items-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Thinking...
                  </>
                ) : 'Generate Study Plan'}
              </button>
            </div>
          </div>
          <div className="space-y-5 bg-white p-6 rounded-3xl border border-blue-100 shadow-sm">
            <div>
              <label className="block text-xs font-semibold text-blue-500 uppercase tracking-wider mb-2">
                Weak Areas / Focus Topics
              </label>
              <textarea
                className="w-full p-4 rounded-xl border border-blue-200 bg-blue-50 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100/50 outline-none transition-all text-sm h-32 resize-none"
                placeholder="e.g., Algebra, Organic Chemistry, French Grammar"
                value={weakAreas}
                onChange={(e) => setWeakAreas(e.target.value)}
              />
            </div>
          </div>
        </>
      ) : (
        <div className="pb-24">
          <div className="flex justify-between items-center mb-8 sticky top-0 bg-white/95 backdrop-blur py-2 z-10">
            <div>
              <h2 className="text-xl font-bold text-blue-700">Your Schedule</h2>
              <p className="text-xs text-blue-500">7-Day Personal Plan</p>
            </div>
            <button
              onClick={() => setWeeklyPlan(null as any)}
              className="text-blue-600 text-xs font-bold bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors"
            >
              RESET
            </button>
          </div>
          <div className="relative border-l-2 border-blue-100 ml-3 space-y-8">
            {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => {
              const dayTasks = weeklyPlan.tasks.filter((t: any) => t.day.includes(day));
              if (dayTasks.length === 0) return null;
              return (
                <div key={day} className="relative pl-8">
                  {/* Dot */}
                  <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-indigo-600 border-4 border-white shadow-sm"></div>
                  <h3 className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-wide">{day}</h3>
                  <div className="space-y-3">
                    {dayTasks.map((task: any) => (
                      <div
                        key={task.id}
                        className="group flex items-start justify-between p-4 rounded-2xl bg-white border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:shadow-md transition-all"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded-md uppercase">
                              {task.subject}
                            </span>
                          </div>
                          <p className="font-semibold text-gray-800 text-sm">{task.topic}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="text-xs font-bold text-gray-400">{task.durationMinutes}m</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default Planner;