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
      return (
          <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Library</h2>
              <div className="grid grid-cols-2 gap-4">
                  {user?.subjects.map(sub => (
                      <button 
                        key={sub}
                        onClick={() => setSelectedSubject(sub)}
                        className="p-4 bg-white border border-gray-100 rounded-2xl shadow-sm hover:border-blue-500 hover:shadow-md transition-all text-left font-semibold text-gray-700 text-sm"
                      >
                          {sub}
                      </button>
                  ))}
              </div>
          </div>
      );
  }

  if (content) {
      return (
          <div className="p-6 bg-white min-h-full">
              <button onClick={handleReset} className="mb-4 text-sm text-gray-500 hover:text-blue-600 flex items-center gap-1">
                  ← Back to Library
              </button>
              <span className="inline-block px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-bold uppercase mb-2">{selectedSubject}</span>
              <h1 className="text-2xl font-bold text-gray-900 mb-6">{topic}</h1>
              <div className="prose prose-sm prose-blue max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {content}
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
              <button 
                onClick={handleGenerate}
                disabled={loading || !topic}
                className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 disabled:opacity-50 transition-all flex justify-center items-center gap-2"
              >
                  {loading ? 'Writing Lesson...' : 'Read Lesson'}
              </button>
          </div>
      </div>
  );
};

export default Library;