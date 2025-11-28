import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { Subject, ExamQuestion } from '../types';
import { generateMockExam } from '../services/geminiService';

const Exams: React.FC = () => {
  const { user } = useStore();
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [questions, setQuestions] = useState<ExamQuestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const handleStart = async () => {
      if (!selectedSubject || !user) return;
      setLoading(true);
      const qs = await generateMockExam(user.grade, selectedSubject);
      setQuestions(qs);
      setLoading(false);
  };

  const handleSelectOption = (qId: string, option: string) => {
      if (submitted) return;
      setAnswers(prev => ({ ...prev, [qId]: option }));
  };

  const calculateScore = () => {
      let score = 0;
      questions.forEach(q => {
          if (answers[q.id] === q.correctAnswer) score++;
      });
      return score;
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
                    <h2 className="text-2xl font-bold text-blue-700 mb-6">Mock Exams (WASSCE/BECE)</h2>
                    <p className="text-sm text-blue-500 mb-4">Select a subject to start a quick 5-question drill.</p>
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

  if (loading) {
      return (
          <div className="flex flex-col items-center justify-center h-full p-6 text-center">
              <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
              <p className="text-gray-500 font-medium">Generating Exam Questions...</p>
          </div>
      );
  }

  return (
      <div className="p-6 pb-24">
          <div className="flex justify-between items-center mb-6">
              <button onClick={() => { setSelectedSubject(null); setQuestions([]); setSubmitted(false); setAnswers({}); }} className="text-sm text-gray-500">← Exit</button>
              <span className="font-bold text-gray-900">{selectedSubject} Drill</span>
          </div>

          {questions.length === 0 ? (
              <div className="flex justify-center mt-10">
                  <button onClick={handleStart} className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg">Start Exam</button>
              </div>
          ) : (
              <div className="space-y-8">
                  {questions.map((q, idx) => (
                      <div key={q.id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                          <p className="text-sm font-bold text-gray-400 mb-2">Question {idx + 1}</p>
                          <p className="text-gray-900 font-medium mb-4 text-base">{q.question}</p>
                          
                          <div className="space-y-2">
                              {q.options?.map(opt => {
                                  const isSelected = answers[q.id] === opt;
                                  const isCorrect = q.correctAnswer === opt;
                                  
                                  let style = "border-gray-200 hover:border-blue-300 bg-white";
                                  if (isSelected) style = "border-blue-500 bg-blue-50 text-blue-700";
                                  if (submitted) {
                                      if (isCorrect) style = "border-green-500 bg-green-50 text-green-700";
                                      if (isSelected && !isCorrect) style = "border-red-500 bg-red-50 text-red-700";
                                  }

                                  return (
                                      <button
                                        key={opt}
                                        onClick={() => handleSelectOption(q.id, opt)}
                                        className={`w-full text-left p-3 rounded-xl border transition-all text-sm ${style}`}
                                      >
                                          {opt}
                                      </button>
                                  )
                              })}
                          </div>
                          
                          {submitted && (
                              <div className="mt-4 p-3 bg-gray-50 rounded-xl text-xs text-gray-600 border border-gray-100">
                                  <span className="font-bold block mb-1">Explanation:</span>
                                  {q.explanation}
                              </div>
                          )}
                      </div>
                  ))}

                  {!submitted ? (
                      <button onClick={() => setSubmitted(true)} className="w-full py-4 bg-green-600 text-white rounded-xl font-bold shadow-lg">Submit Exam</button>
                  ) : (
                      <div className="p-6 bg-blue-600 text-white rounded-3xl text-center shadow-xl">
                          <p className="text-sm opacity-80 uppercase tracking-widest mb-1">Your Score</p>
                          <p className="text-4xl font-extrabold mb-4">{calculateScore()} / {questions.length}</p>
                          <button onClick={() => { setQuestions([]); setSubmitted(false); setAnswers({}); handleStart(); }} className="bg-white text-blue-600 px-6 py-2 rounded-lg font-bold text-sm">Try Another</button>
                      </div>
                  )}
              </div>
          )}
      </div>
  );
};

export default Exams;