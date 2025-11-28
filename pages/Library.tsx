import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { Subject } from '../types';
import { generateLessonContent } from '../services/geminiService';

const Library: React.FC = () => {
  const { user } = useStore();
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [topic, setTopic] = useState('');
  const [content, setContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!selectedSubject || !topic.trim() || !user) return;
    setLoading(true);
    const result = await generateLessonContent(topic, user.grade, selectedSubject);
    setContent(result);
    setLoading(false);
  };

  const handleReset = () => {
      setContent(null);
      setTopic('');
  };

  if (!selectedSubject) {
            // Book icon with different colors per subject
            const getBookIcon = (subject: string) => {
                const colorMap: Record<string, string> = {
                    'English Language': 'text-blue-600',
                    'Integrated Science': 'text-green-600',
                    'Mathematics': 'text-purple-600',
                    'ICT': 'text-pink-600',
                    'RME': 'text-yellow-600',
                    'Social Studies': 'text-red-500',
                    'Ghanaian Language': 'text-orange-500',
                    'Creative Arts': 'text-indigo-500',
                    'Career Technology': 'text-teal-500',
                    'History': 'text-amber-700',
                    'French': 'text-blue-400',
                    'Elective Maths': 'text-fuchsia-600',
                    'Physics': 'text-cyan-600',
                    'Chemistry': 'text-lime-600',
                    'Biology': 'text-emerald-600',
                    'Economics': 'text-rose-600',
                    'Government': 'text-violet-600',
                    'Literature-in-English': 'text-pink-400',
                    'Geography': 'text-green-700',
                    'Business Management': 'text-yellow-700',
                    'Financial Accounting': 'text-gray-700',
                };
                return (
                    <svg className={`w-7 h-7 mr-2 ${colorMap[subject] || 'text-gray-400'}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                );
            };
            return (
                <div className="p-6 bg-blue-50 min-h-full">
                    <h2 className="text-2xl font-bold text-blue-700 mb-6">Library</h2>
                    <div className="grid grid-cols-2 gap-4">
                        {user?.subjects.map(sub => (
                            <button 
                                key={sub}
                                onClick={() => setSelectedSubject(sub)}
                                className="flex items-center p-4 bg-white border border-blue-100 rounded-2xl shadow-sm hover:border-blue-500 hover:shadow-md transition-all text-left font-semibold text-blue-700 text-sm"
                            >
                                {getBookIcon(sub)}
                                {sub}
                            </button>
                        ))}
                    </div>
                </div>
            );
  }

  if (content) {
      // Remove Markdown symbols and formatting from AI response
            const cleanText = (text: string) => {
                return text
                    .replace(/^#+\s?/gm, '') // Remove Markdown headers (#, ##, ###, etc.)
                    .replace(/\*\*/g, '')
                    .replace(/__/g, '')
                    .replace(/`/g, '')
                    .replace(/\* /g, '- ')
                    .replace(/^- /gm, '• ')
                    .replace(/\n{2,}/g, '\n\n')
                    .trim();
            };
      return (
          <div className="p-6 bg-white min-h-full">
              <button onClick={handleReset} className="mb-4 text-sm text-gray-500 hover:text-blue-600 flex items-center gap-1">
                  ← Back to Library
              </button>
              <span className="inline-block px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-bold uppercase mb-2">{selectedSubject}</span>
              <h1 className="text-2xl font-bold text-gray-900 mb-6">{topic}</h1>
              <div className="prose prose-sm prose-blue max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {cleanText(content)}
              </div>
          </div>
      );
  }

  return (
      <div className="p-6">
          <button onClick={() => setSelectedSubject(null)} className="mb-6 text-sm text-gray-500 hover:text-blue-600 flex items-center gap-1">
              ← Back to Subjects
          </button>
          
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
              <h2 className="text-lg font-bold text-gray-900">New Lesson</h2>
              <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Topic</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-blue-500 outline-none transition-all text-sm"
                    placeholder="e.g. Photosynthesis, Gold Coast History"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                  />
              </div>
                            <div className="flex justify-center">
                                <button 
                                    onClick={handleGenerate}
                                    disabled={loading || !topic}
                                    className="bg-blue-600 text-white px-6 py-3.5 rounded-xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 disabled:opacity-50 transition-all flex justify-center items-center gap-2"
                                >
                                        {loading ? 'Writing Lesson...' : 'Read Lesson'}
                                </button>
                            </div>
          </div>
      </div>
  );
};

export default Library;