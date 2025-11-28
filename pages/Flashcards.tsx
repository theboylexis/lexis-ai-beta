import React, { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { generateFlashcards } from '../services/geminiService';
import { Subject } from '../types';

const Flashcards: React.FC = () => {
  const { user, flashcards, addFlashcards, incrementReviewCount, incrementStudyTime, setPendingTutorQuery, setCurrentSubject } = useStore();
  const [mode, setMode] = useState<'generate' | 'review'>('review');
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Generation State
  const [topic, setTopic] = useState('');
  const [selectedSub, setSelectedSub] = useState<Subject | ''>('');

  // Review State
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // TRACK STUDY TIME
  useEffect(() => {
    if (mode !== 'review' || flashcards.length === 0) return;
    const timer = setInterval(() => {
        incrementStudyTime(1);
    }, 60000); 
    return () => clearInterval(timer);
  }, [mode, flashcards.length, incrementStudyTime]);

  const handleGenerate = async () => {
    if (!topic || !selectedSub || !user) return;
    setIsGenerating(true);
    try {
        const newCards = await generateFlashcards(topic, user.grade, selectedSub);
        if (!newCards || newCards.length === 0) {
             alert("AI could not generate cards. Please try a different topic.");
             setIsGenerating(false);
             return;
        }
        const cardsWithId = newCards.map(c => ({
            ...c,
            id: Math.random().toString(36).substr(2, 9),
            nextReviewDate: Date.now(),
            repetitionCount: 0,
            easeFactor: 2.5
        }));
        addFlashcards(cardsWithId);
        setMode('review');
        setCurrentIndex(flashcards.length); 
        setTopic('');
    } catch (e) {
        console.error(e);
        alert('Failed to generate cards. Please try again.');
    } finally {
        setIsGenerating(false);
    }
  };

  const handleNext = () => {
    setIsFlipped(false);
    incrementReviewCount();
    if (currentIndex < flashcards.length - 1) {
        setTimeout(() => setCurrentIndex(prev => prev + 1), 250);
    } else {
        alert("Session complete! Great job.");
        setCurrentIndex(0);
    }
  };

  const handlePrev = () => {
      if (currentIndex > 0) {
          setIsFlipped(false);
          setCurrentIndex(prev => prev - 1);
      }
  };
  
  const handleExplain = (e: React.MouseEvent) => {
      e.stopPropagation();
      const currentCard = flashcards[currentIndex];
      const query = `Can you explain this concept in more detail: "${currentCard.front}"? The answer given was "${currentCard.back}".`;
      setCurrentSubject(currentCard.subject as Subject);
      setPendingTutorQuery(query);
  };

  const handleCopy = (e: React.MouseEvent) => {
      e.stopPropagation();
      const currentCard = flashcards[currentIndex];
      const text = `Q: ${currentCard.front}\nA: ${currentCard.back}`;
      navigator.clipboard.writeText(text);
      alert("Flashcard copied to clipboard!");
  };

  if (mode === 'generate') {
    return (
        <div className="p-6 bg-gray-50/50 min-h-full pb-24">
            <div className="flex items-center gap-3 mb-8">
                <button onClick={() => setMode('review')} className="p-2 rounded-full bg-white border border-gray-200 text-gray-500 hover:bg-gray-50 shadow-sm transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                </button>
                <h2 className="text-xl font-bold text-gray-900">New Deck</h2>
            </div>
            
            <div className="space-y-5 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Subject</label>
                    <div className="relative">
                        <select 
                            className="w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100/50 outline-none appearance-none transition-all text-sm font-medium"
                            value={selectedSub}
                            onChange={(e) => setSelectedSub(e.target.value as Subject)}
                        >
                            <option value="">Select a subject...</option>
                            {user?.subjects.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                        <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray-500">
                             <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                        </div>
                    </div>
                </div>
                <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Topic or Notes</label>
                    <textarea 
                        className="w-full p-4 rounded-xl border border-gray-200 bg-gray-50 h-32 text-gray-900 outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100/50 transition-all text-sm resize-none"
                        placeholder="e.g. Photosynthesis, Gold Coast History, Linear Equations..."
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                    />
                </div>
                <button 
                    onClick={handleGenerate}
                    disabled={isGenerating || !topic || !selectedSub}
                    className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold shadow-lg shadow-blue-200 disabled:opacity-50 disabled:shadow-none hover:bg-blue-700 active:scale-95 transition-all flex justify-center items-center gap-2"
                >
                    {isGenerating ? (
                        <>
                           <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                           Generating...
                        </>
                    ) : 'Generate Cards'}
                </button>
            </div>
        </div>
    );
  }

  // Review Mode
  if (flashcards.length === 0) {
      return (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-gray-50/50">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-[2rem] flex items-center justify-center mb-6 text-blue-600 shadow-sm border border-white">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 18H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v1h-3.414a2 2 0 0 0-1.414.586L16.586 7.172A2 2 0 0 1 15.172 7.757H6a2 2 0 0 0-2 2v8.243a2 2 0 0 0 2 2z"/><path d="M6 18h14a2 2 0 0 0 2-2v-8"/><path d="M6 18v2a2 2 0 0 0 2 2h12"/></svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3 tracking-tight">No Cards Yet</h2>
              <p className="text-gray-500 mb-8 leading-relaxed max-w-xs mx-auto">Create your first AI-powered deck to start mastering your subjects.</p>
              <button onClick={() => setMode('generate')} className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-xl shadow-blue-200 hover:shadow-2xl hover:-translate-y-1 transition-all">
                  Generate Deck
              </button>
          </div>
      )
  }

  const currentCard = flashcards[currentIndex];

  return (
    <div className="p-6 h-full flex flex-col bg-gray-50/30">
        <div className="flex justify-between items-center mb-4 shrink-0">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Card {currentIndex + 1} / {flashcards.length}</span>
            <div className="flex items-center gap-2">
                 {/* Top Navigation */}
                 <div className="flex bg-white rounded-lg border border-gray-200 shadow-sm mr-2 overflow-hidden">
                     <button 
                        onClick={(e) => { e.stopPropagation(); handlePrev(); }}
                        disabled={currentIndex === 0}
                        className="p-1.5 px-3 text-gray-400 hover:text-blue-600 hover:bg-gray-50 disabled:opacity-30 border-r border-gray-100 transition-colors"
                        title="Previous Card"
                     >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                     </button>
                     <button 
                        onClick={(e) => { e.stopPropagation(); handleNext(); }}
                        className="p-1.5 px-3 text-gray-400 hover:text-blue-600 hover:bg-gray-50 transition-colors"
                        title="Next Card"
                     >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                     </button>
                 </div>
                <button onClick={() => setMode('generate')} className="text-blue-600 text-xs font-bold bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors">+ New</button>
            </div>
        </div>

        {/* Card Container */}
        <div className="flex-1 perspective-1000 relative my-2 group min-h-[350px]" onClick={() => setIsFlipped(!isFlipped)}>
            <div className={`relative w-full h-full duration-500 transform-style-3d cursor-pointer ${isFlipped ? 'rotate-y-180' : ''}`}>
                
                {/* Front Face */}
                <div className="absolute inset-0 backface-hidden bg-white rounded-[2rem] shadow-xl shadow-gray-200/50 border border-gray-100 flex flex-col overflow-hidden">
                    <div className="h-16 flex justify-between items-center px-6 border-b border-gray-50 bg-gray-50/30 shrink-0">
                         <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Question</span>
                         <span className="text-[10px] font-bold text-blue-600 bg-blue-50 border border-blue-100 px-2 py-1 rounded-md uppercase tracking-wide truncate max-w-[120px]">{currentCard.subject}</span>
                    </div>
                    <div className="flex-1 overflow-y-auto p-6 flex flex-col items-center justify-center text-center">
                         <h3 className="text-xl font-semibold text-gray-800 leading-relaxed">{currentCard.front}</h3>
                    </div>
                    {/* Front Footer Actions */}
                    <div className="h-14 flex items-center justify-between px-6 border-t border-gray-50 bg-gray-50/30 shrink-0">
                         <div className="flex gap-2">
                             <button onClick={handleCopy} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-gray-500 bg-white border border-gray-200 rounded-lg hover:text-blue-600 hover:border-blue-200 transition-all shadow-sm">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                                Copy
                             </button>
                             <button onClick={handleExplain} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-indigo-500 bg-white border border-indigo-100 rounded-lg hover:bg-indigo-50 hover:border-indigo-200 transition-all shadow-sm">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><path d="M12 12h.01"/><path d="M16 12h.01"/><path d="M8 12h.01"/></svg>
                                AI Explain
                             </button>
                         </div>
                        <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest hidden sm:block">Tap to reveal</p>
                    </div>
                </div>

                {/* Back Face */}
                <div className="absolute inset-0 backface-hidden bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[2rem] shadow-xl shadow-blue-500/20 flex flex-col rotate-y-180 text-white overflow-hidden">
                    <div className="h-16 flex items-center px-6 border-b border-white/10 shrink-0">
                        <span className="text-[10px] font-bold text-blue-100 uppercase tracking-wider opacity-70">Answer</span>
                    </div>
                    <div className="flex-1 overflow-y-auto p-8 flex flex-col items-center justify-center text-center">
                        <h3 className="text-lg font-medium leading-relaxed text-white">{currentCard.back}</h3>
                    </div>
                    {/* Back Footer Actions */}
                    <div className="h-14 flex items-center justify-between px-6 border-t border-white/10 shrink-0">
                         <div className="flex gap-2">
                             <button onClick={handleCopy} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-blue-100 bg-white/10 border border-white/10 rounded-lg hover:bg-white hover:text-blue-600 transition-all">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                                Copy
                             </button>
                             <button onClick={handleExplain} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-blue-100 bg-white/10 border border-white/10 rounded-lg hover:bg-white hover:text-indigo-600 transition-all">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><path d="M12 12h.01"/><path d="M16 12h.01"/><path d="M8 12h.01"/></svg>
                                Explain
                             </button>
                         </div>
                         <p className="text-[10px] font-bold text-blue-200 uppercase tracking-widest opacity-50 hidden sm:block">Tap to flip back</p>
                    </div>
                </div>
            </div>
        </div>

        {/* Controls */}
        <div className="mt-6 mb-2 flex flex-col items-center shrink-0">
            <div className="flex gap-4 w-full max-w-sm">
                 <button 
                    onClick={(e) => { e.stopPropagation(); handleNext(); }} 
                    className="flex-1 py-3.5 px-4 rounded-xl bg-white border border-red-100 text-red-500 font-bold text-sm shadow-[0_4px_10px_rgba(0,0,0,0.03)] hover:bg-red-50 hover:border-red-200 active:scale-95 transition-all flex flex-col items-center gap-1.5"
                 >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" x2="6" y1="6" y2="18"/><line x1="6" x2="18" y1="6" y2="18"/></svg>
                    <span>Still Learning</span>
                 </button>
                 <button 
                    onClick={(e) => { e.stopPropagation(); handleNext(); }} 
                    className="flex-1 py-3.5 px-4 rounded-xl bg-white border border-green-100 text-green-600 font-bold text-sm shadow-[0_4px_10px_rgba(0,0,0,0.03)] hover:bg-green-50 hover:border-green-200 active:scale-95 transition-all flex flex-col items-center gap-1.5"
                 >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                    <span>Got it</span>
                 </button>
            </div>
        </div>
    </div>
  );
};

export default Flashcards;