import React, { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { UserGrade, Subject } from '../types';
import { Logo } from '../components/Logo';

interface OnboardingProps {
    onComplete: () => void;
}

const SUBJECTS_BY_GRADE: Record<UserGrade, Subject[]> = {
    [UserGrade.BASIC_4]: [
        Subject.ENGLISH, 
        Subject.MATH, 
        Subject.SCIENCE, 
        Subject.SOCIAL, 
        Subject.GHANAIAN_LANGUAGE, 
        Subject.RME, 
        Subject.CREATIVE_ARTS, 
        Subject.ICT, 
        Subject.HISTORY
    ],
    [UserGrade.BASIC_5]: [
        Subject.ENGLISH, 
        Subject.MATH, 
        Subject.SCIENCE, 
        Subject.SOCIAL, 
        Subject.GHANAIAN_LANGUAGE, 
        Subject.RME, 
        Subject.CREATIVE_ARTS, 
        Subject.ICT, 
        Subject.HISTORY
    ],
    [UserGrade.BASIC_6]: [
        Subject.ENGLISH, 
        Subject.MATH, 
        Subject.SCIENCE, 
        Subject.SOCIAL, 
        Subject.GHANAIAN_LANGUAGE, 
        Subject.RME, 
        Subject.CREATIVE_ARTS, 
        Subject.ICT, 
        Subject.HISTORY
    ],
    [UserGrade.JHS_1]: [
        Subject.ENGLISH, 
        Subject.MATH, 
        Subject.SCIENCE, 
        Subject.SOCIAL, 
        Subject.ICT, 
        Subject.RME, 
        Subject.GHANAIAN_LANGUAGE, 
        Subject.CAREER_TECH, 
        Subject.CREATIVE_ARTS, 
        Subject.FRENCH,
        Subject.HISTORY
    ],
    [UserGrade.JHS_2]: [
        Subject.ENGLISH, 
        Subject.MATH, 
        Subject.SCIENCE, 
        Subject.SOCIAL, 
        Subject.ICT, 
        Subject.RME, 
        Subject.GHANAIAN_LANGUAGE, 
        Subject.CAREER_TECH, 
        Subject.CREATIVE_ARTS, 
        Subject.FRENCH,
        Subject.HISTORY
    ],
    [UserGrade.JHS_3]: [
        Subject.ENGLISH, 
        Subject.MATH, 
        Subject.SCIENCE, 
        Subject.SOCIAL, 
        Subject.ICT, 
        Subject.RME, 
        Subject.GHANAIAN_LANGUAGE, 
        Subject.CAREER_TECH, 
        Subject.CREATIVE_ARTS, 
        Subject.FRENCH,
        Subject.HISTORY
    ],
    [UserGrade.SHS_1]: Object.values(Subject),
    [UserGrade.SHS_2]: Object.values(Subject),
    [UserGrade.SHS_3]: Object.values(Subject),
};

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const setUser = useStore((state) => state.setUser);
  
  const [name, setName] = useState('');
  const [grade, setGrade] = useState<UserGrade>(UserGrade.JHS_3); 
  const [selectedSubjects, setSelectedSubjects] = useState<Subject[]>([]); 
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const availableSubjects = SUBJECTS_BY_GRADE[grade] || Object.values(Subject);

  const handleGradeChange = (newGrade: UserGrade) => {
    setGrade(newGrade);
    setSelectedSubjects([]); 
  };

  const handleSubjectToggle = (sub: Subject) => {
    if (selectedSubjects.includes(sub)) {
      setSelectedSubjects(selectedSubjects.filter(s => s !== sub));
    } else {
      setSelectedSubjects([...selectedSubjects, sub]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    if (selectedSubjects.length === 0) {
        alert("Please select at least one subject.");
        return;
    }
    if (!agreedToTerms) {
        alert("Please acknowledge the AI disclaimer.");
        return;
    }

    setUser({
        name,
        grade,
        subjects: selectedSubjects,
        setupComplete: true
    });
    onComplete();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-6 sm:px-10 font-sans">
      <div className="max-w-md mx-auto w-full bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-2xl shadow-blue-900/10 border border-white p-8">
          
          <div className="mb-8 text-center">
            <div className="flex justify-center mb-5">
                <Logo className="w-16 h-16" />
            </div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-2">Setup Profile</h1>
            <p className="text-gray-500 font-medium text-sm">Personalize your learning experience</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Name Input */}
            <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide ml-1">Full Name</label>
                <input 
                    type="text" 
                    required
                    className="w-full px-5 py-4 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100/50 outline-none transition-all font-medium"
                    placeholder="e.g. Kwame Mensah"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </div>

            {/* Grade Select */}
            <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide ml-1">Grade Level</label>
                <div className="relative">
                    <select 
                        className="w-full px-5 py-4 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100/50 outline-none appearance-none transition-all font-medium cursor-pointer"
                        value={grade}
                        onChange={(e) => handleGradeChange(e.target.value as UserGrade)}
                    >
                        {Object.values(UserGrade).map((g) => (
                            <option key={g} value={g}>{g}</option>
                        ))}
                    </select>
                    <div className="absolute inset-y-0 right-5 flex items-center pointer-events-none text-gray-500">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                    </div>
                </div>
            </div>

            {/* Subject Selection */}
            <div className="space-y-2">
                <div className="flex justify-between items-baseline px-1">
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide">Select Subjects</label>
                    <span className="text-xs text-blue-600 font-semibold">{selectedSubjects.length} selected</span>
                </div>
                <div className="bg-gray-50 rounded-2xl p-2 border border-gray-100 max-h-52 overflow-y-auto">
                    <div className="flex flex-wrap gap-2">
                        {availableSubjects.map((sub) => (
                            <button
                                key={sub}
                                type="button"
                                onClick={() => handleSubjectToggle(sub)}
                                className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-200 border ${
                                    selectedSubjects.includes(sub)
                                    ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-200'
                                    : 'bg-white text-gray-500 border-gray-200 hover:border-blue-300 hover:text-blue-500'
                                }`}
                            >
                                {sub}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Disclaimer */}
            <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-xl border border-blue-100">
                <input 
                    type="checkbox" 
                    id="terms"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    className="mt-1 w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 cursor-pointer"
                />
                <label htmlFor="terms" className="text-xs text-blue-900 leading-relaxed font-medium cursor-pointer select-none">
                    I understand that Lexis AI is an automated tool. I will verify important information with my teachers or textbooks.
                </label>
            </div>

            <button 
                type="submit"
                disabled={!name.trim() || selectedSubjects.length === 0 || !agreedToTerms}
                className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg shadow-xl shadow-blue-200 active:scale-95 transition-all disabled:opacity-50 disabled:shadow-none hover:bg-blue-700"
            >
                Get Started
            </button>
          </form>
      </div>
      
      <p className="text-center text-gray-400 text-xs mt-8 font-medium">Built for Ghanaian Students 🇬🇭</p>
    </div>
  );
};

export default Onboarding;