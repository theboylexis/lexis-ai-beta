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
      return (
          <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Mock Exams (WASSCE/BECE)</h2>
              <p className="text-sm text-gray-500 mb-4">Select a subject to start a quick 5-question drill.</p>
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
              <div className="text-center mt-10">
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