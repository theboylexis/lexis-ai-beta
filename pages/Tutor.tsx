import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { generateTutorResponse } from '../services/geminiService';
import { ChatMessage, Subject, TutorMode } from '../types';

const SubjectIcon: React.FC<{ subject: Subject, className?: string }> = ({ subject, className = "w-6 h-6" }) => {
    // Basic mapping of subjects to SVG paths or generic icons
    let path = "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"; // Book
    let color = "text-blue-500 bg-blue-50";

    if (subject.includes('Math')) {
        path = "M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"; // Calculator
        color = "text-orange-500 bg-orange-50";
    } else if (subject.includes('Science') || subject.includes('Chemistry') || subject.includes('Physics') || subject.includes('Biology')) {
        path = "M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"; // Flask
        color = "text-green-500 bg-green-50";
    } else if (subject.includes('ICT')) {
        path = "M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"; // Computer
        color = "text-purple-500 bg-purple-50";
    }

    return (
        <div className={`p-2.5 rounded-xl ${color} flex items-center justify-center shrink-0`}>
            <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d={path} />
            </svg>
        </div>
    );
};

const Tutor: React.FC = () => {
  const { user, messages, addMessage, clearMessages, currentSubject, setCurrentSubject, incrementSessionCount, incrementStudyTime, pendingTutorQuery, setPendingTutorQuery, tutorMode, setTutorMode } = useStore();
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  // TRACK STUDY TIME
  useEffect(() => {
    if (!currentSubject) return;
    const timer = setInterval(() => {
        incrementStudyTime(1);
    }, 60000);
    return () => clearInterval(timer);
  }, [currentSubject, incrementStudyTime]);

  // AUTO-SEND PENDING QUERY
  useEffect(() => {
      if (pendingTutorQuery && !isLoading && user && currentSubject) {
          const query = pendingTutorQuery;
          setPendingTutorQuery(null);
          handleAutoSend(query);
      }
  }, [pendingTutorQuery, user, currentSubject]);

  const handleAutoSend = async (query: string) => {
    if (!user || !currentSubject) return;
    
    const userMsg: ChatMessage = {
        id: Date.now().toString(),
        role: 'user',
        text: query,
        timestamp: Date.now()
    };
    addMessage(userMsg);
    setIsLoading(true);

    const history = messages.map(m => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.text }]
    }));

    const responseText = await generateTutorResponse(history, query, user.grade, currentSubject, tutorMode);
    
    const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText,
        timestamp: Date.now()
    };
    addMessage(aiMsg);
    setIsLoading(false);
    incrementSessionCount();
  };

  const cleanText = (text: string) => {
    return text
      .replace(/\*\*/g, '')
      .replace(/##/g, '')
      .replace(/__/g, '')
      .replace(/`/g, '')
      .replace(/^\s*[\-\*]\s+/gm, '• ')
      .trim();
  };

  const handleSend = async () => {
    if (!input.trim() || !user || !currentSubject) return;
    const text = input;
    setInput('');
    await handleAutoSend(text);
  };

  const handleNewChat = () => {
    if (messages.length === 0) return;
    if (window.confirm("Start a new chat? This will clear current history.")) {
        clearMessages();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
    }
  }

  // --- SUBJECT HUB VIEW ---
  if (!currentSubject) {
    return (
        <div className="p-6 h-full flex flex-col bg-gray-50/50">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Subject Hub</h2>
                <p className="text-gray-500 text-sm">Select a subject to begin learning.</p>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 overflow-y-auto pb-20">
                {user?.subjects.map(sub => (
                    <button
                        key={sub}
                        onClick={() => setCurrentSubject(sub)}
                        className="group relative flex flex-col items-center justify-center p-6 bg-white border border-gray-100 rounded-3xl shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:shadow-lg hover:border-blue-100 hover:-translate-y-1 transition-all duration-300"
                    >
                        <SubjectIcon subject={sub} className="w-8 h-8 text-white" />
                        <span className="mt-4 text-xs font-bold text-gray-700 text-center uppercase tracking-wide group-hover:text-blue-600 transition-colors">{sub}</span>
                        
                        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                        </div>
                    </button>
                ))}
                
                {/* Add Subject Button Placeholder */}
                <button className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-200 rounded-3xl hover:border-gray-300 hover:bg-gray-50 transition-all text-gray-300 hover:text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                    <span className="text-xs font-bold uppercase tracking-wide">Add</span>
                </button>
            </div>
        </div>
    );
  }

  // --- CHAT INTERFACE ---
  return (
    <div className="flex flex-col h-full bg-gray-50/30 relative">
      
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-md px-4 py-3 border-b border-gray-100 sticky top-0 z-20">
        <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-3">
                <button onClick={() => setCurrentSubject(null as any)} className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                </button>
                <div className="flex items-center gap-2">
                    <SubjectIcon subject={currentSubject} className="w-4 h-4" />
                    <span className="font-bold text-gray-800 text-sm">{currentSubject}</span>
                </div>
            </div>
            <button 
                onClick={handleNewChat} 
                className="text-xs font-medium text-gray-400 hover:text-red-500 transition-colors"
            >
                Clear Chat
            </button>
        </div>

        {/* Mode Toggles */}
        <div className="flex bg-gray-100/50 p-1 rounded-xl">
            {Object.values(TutorMode).map((mode) => (
                <button
                    key={mode}
                    onClick={() => setTutorMode(mode)}
                    className={`flex-1 py-1.5 text-[10px] font-bold uppercase tracking-wide rounded-lg transition-all ${
                        tutorMode === mode 
                        ? 'bg-white text-blue-600 shadow-sm' 
                        : 'text-gray-400 hover:text-gray-600'
                    }`}
                >
                    {mode}
                </button>
            ))}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6" ref={scrollRef}>
        {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center mt-8 px-8 opacity-60">
                <SubjectIcon subject={currentSubject} className="w-12 h-12 mb-4 opacity-50 grayscale" />
                <p className="text-gray-900 font-semibold mb-1 text-sm">How can I help with {currentSubject}?</p>
                <p className="text-gray-500 text-xs text-center max-w-[200px]">
                    Current Mode: <span className="font-bold text-blue-600">{tutorMode}</span>
                </p>
            </div>
        )}
        
        {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} group mb-4`}>
                <div 
                    className={`max-w-[90%] sm:max-w-[85%] rounded-2xl px-5 py-3.5 text-sm leading-7 shadow-sm relative whitespace-pre-wrap ${
                        msg.role === 'user' 
                        ? 'bg-blue-600 text-white rounded-tr-sm' 
                        : 'bg-white text-gray-800 border border-gray-100 rounded-tl-sm shadow-[0_2px_8px_rgba(0,0,0,0.02)]'
                    }`}
                >
                    {msg.role === 'model' ? cleanText(msg.text) : msg.text}
                    
                    {msg.role === 'model' && (
                        <button 
                            onClick={() => { navigator.clipboard.writeText(msg.text); alert("Copied!"); }}
                            className="absolute -bottom-6 right-0 text-[10px] font-bold text-gray-300 hover:text-blue-600 flex items-center gap-1 transition-all py-1 px-2"
                        >
                            COPY
                        </button>
                    )}
                </div>
            </div>
        ))}

        {isLoading && (
            <div className="flex justify-start">
                <div className="bg-white border border-gray-100 px-4 py-3 rounded-2xl rounded-tl-sm shadow-sm flex gap-1.5">
                   <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce"></div>
                   <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce delay-75"></div>
                   <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce delay-150"></div>
                </div>
            </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 pb-safe bg-gradient-to-t from-gray-50 via-gray-50 to-transparent">
        <div className="flex items-end gap-2 bg-white/80 backdrop-blur-xl border border-gray-200 rounded-[2rem] p-2 pl-4 shadow-lg shadow-gray-200/50 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-100/50 transition-all">
            
            {/* Image Upload Placeholder */}
            <button className="mb-1.5 p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all" title="Upload Image (Coming Soon)">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            </button>

            <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={`Ask ${currentSubject}...`}
                className="w-full bg-transparent border-none focus:ring-0 outline-none max-h-32 min-h-[24px] text-sm py-3 text-gray-800 placeholder-gray-400 resize-none leading-relaxed"
                rows={1}
                style={{ height: 'auto', minHeight: '44px' }}
            />
            
            <button 
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className={`mb-1 p-2.5 rounded-full flex-none transition-all duration-200 ${
                    input.trim() 
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-200 hover:bg-blue-700 hover:scale-105 active:scale-95' 
                    : 'bg-gray-100 text-gray-300'
                }`}
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><line x1="22" x2="11" y1="2" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
            </button>
        </div>
      </div>
    </div>
  );
};

export default Tutor;