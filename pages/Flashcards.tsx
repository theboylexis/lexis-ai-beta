import React, { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { generateFlashcards, generateTutorResponse } from '../services/geminiService';
import { Subject, Flashcard } from '../types';

const Flashcards: React.FC = () => {
    const {
        user,
        flashcards,
        addFlashcards,
        incrementReviewCount,
        incrementStudyTime,
        setPendingTutorQuery,
        setCurrentSubject,
    } = useStore();

    const [mode, setMode] = useState<'generate' | 'review'>('review');
    const [isGenerating, setIsGenerating] = useState(false);
    const [topic, setTopic] = useState('');
    const [selectedSub, setSelectedSub] = useState<Subject | ''>('');
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [userAnswer, setUserAnswer] = useState('');
    const [grading, setGrading] = useState<'idle' | 'loading' | 'done'>('idle');
    const [aiFeedback, setAiFeedback] = useState('');

    /** TRACK STUDY TIME */
    useEffect(() => {
        if (mode !== 'review' || flashcards.length === 0) return;
        const timer = setInterval(() => incrementStudyTime(1), 60000);
        return () => clearInterval(timer);
    }, [mode, flashcards.length, incrementStudyTime]);

    /** GENERATE NEW FLASHCARDS */
    const handleGenerate = async () => {
        if (!topic || !selectedSub || !user) return;

        setIsGenerating(true);
        try {
            const newCards = await generateFlashcards(topic, user.grade, selectedSub);

            if (!newCards || newCards.length === 0) {
                alert('AI could not generate cards. Try a different topic.');
                return;
            }

            const cardsWithId: Flashcard[] = newCards.map(card => ({
                ...card,
                id: crypto.randomUUID(),
                nextReviewDate: Date.now(),
                repetitionCount: 0,
                easeFactor: 2.5,
            }));

            addFlashcards(cardsWithId);
            setMode('review');
            setCurrentIndex(flashcards.length);
            setTopic('');
        } catch (err) {
            console.error(err);
            alert('Failed to generate cards.');
        } finally {
            setIsGenerating(false);
        }
    };

    /** NAVIGATION */
    const handleNext = () => {
        incrementReviewCount();
        setIsFlipped(false);
        setUserAnswer('');
        setAiFeedback('');
        setGrading('idle');

        if (currentIndex < flashcards.length - 1) {
            setTimeout(() => setCurrentIndex(prev => prev + 1), 200);
        }
    };

    const handlePrev = () => {
        if (currentIndex > 0) {
            setIsFlipped(false);
            setCurrentIndex(prev => prev - 1);
        }
    };

    /** AI GRADING */
    const handleGradeAnswer = async () => {
        if (!userAnswer.trim()) return;

        const card = flashcards[currentIndex];
        setGrading('loading');

        // Use Gemini Tutor for grading
        const feedback = await generateTutorResponse(
            [
                { role: 'user', parts: [{ text: `Question: ${card.front}\nSuggested Answer: ${card.back}\nStudent Answer: ${userAnswer}` }] }
            ],
            `Grade the student's answer to the flashcard question. Give feedback and a brief correction if needed. Also, provide a score out of ten for the student's answer, formatted as: Score: X/10.`,
            user.grade,
            card.subject as Subject
        );
        setAiFeedback(feedback);
        setGrading('done');
    };

    /** COPY CARD */
    const handleCopy = (e: React.MouseEvent) => {
        e.stopPropagation();
        const card = flashcards[currentIndex];
        navigator.clipboard.writeText(`Q: ${card.front}\nA: ${card.back}`);
        alert('Flashcard copied!');
    };

    /** AI EXPLAIN BUTTON */
    const handleExplain = (e: React.MouseEvent) => {
        e.stopPropagation();
        const card = flashcards[currentIndex];

        const query = `Explain this concept in detail: "${card.front}". Correct answer: "${card.back}".`;

        setCurrentSubject(card.subject as Subject);
        setPendingTutorQuery(query);
    };

    // ------------------------ UI: GENERATE MODE ------------------------
    if (mode === 'generate') {
        return (
            <div className="p-6 bg-gray-50/50 min-h-full pb-24">
                <div className="flex items-center gap-3 mb-8">
                    <button
                        onClick={() => setMode('review')}
                        className="p-2 rounded-full bg-white border border-gray-200 text-gray-500 hover:bg-gray-50 shadow-sm"
                    >
                        ←
                    </button>
                    <h2 className="text-xl font-bold text-gray-900">New Deck</h2>
                </div>

                <div className="space-y-5 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                    {/* SUBJECT */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Subject</label>
                        <select
                            value={selectedSub}
                            onChange={e => setSelectedSub(e.target.value as Subject)}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm"
                        >
                            <option value="">Choose subject…</option>
                            {user?.subjects.map(sub => (
                                <option key={sub} value={sub}>
                                    {sub}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* TOPIC */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Topic</label>
                        <textarea
                            value={topic}
                            onChange={e => setTopic(e.target.value)}
                            className="w-full p-4 h-32 rounded-xl border border-gray-200 bg-gray-50 text-sm resize-none"
                            placeholder="Photosynthesis, Linear Equations, Independence of Ghana..."
                        />
                    </div>

                    {/* GENERATE BUTTON */}
                    <button
                        disabled={isGenerating || !topic || !selectedSub}
                        onClick={handleGenerate}
                        className="max-w-sm mx-auto w-full py-4 bg-blue-600 text-white rounded-xl font-bold shadow-lg disabled:opacity-50"
                    >
                        {isGenerating ? 'Generating…' : 'Generate Flashcards'}
                    </button>
                </div>
            </div>
        );
    }

    // ------------------------ IF NO CARDS ------------------------
    if (flashcards.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-full p-8 bg-gray-50 text-center">
                <h2 className="text-xl font-bold">No Cards Yet</h2>
                <p className="text-gray-500 mt-2 mb-6">Generate your first AI-powered deck.</p>
                <button
                    onClick={() => setMode('generate')}
                    className="px-8 py-3 bg-blue-600 text-white font-bold rounded-xl"
                >
                    Generate Deck
                </button>
            </div>
        );
    }

    const card = flashcards[currentIndex];

    // ------------------------ UI: REVIEW MODE ------------------------
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-white py-8">
            {/* Card Count + Navigation */}
            <div className="w-full max-w-2xl flex justify-between items-center mb-6 px-2">
                <span className="text-xs font-bold text-gray-400">
                    Card {currentIndex + 1} / {flashcards.length}
                </span>
                <div className="flex items-center gap-2">
                    <button
                        onClick={handlePrev}
                        disabled={currentIndex === 0}
                        className="px-3 py-2 bg-white rounded-lg border text-gray-500"
                    >
                        Prev
                    </button>
                    <button
                        onClick={handleNext}
                        className="px-3 py-2 bg-white rounded-lg border text-gray-500"
                    >
                        Next
                    </button>
                    <button
                        onClick={() => setMode('generate')}
                        className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs font-bold"
                    >
                        + New
                    </button>
                </div>
            </div>

            {/* CARD */}
            <div
                onClick={() => grading === 'done' && setIsFlipped(!isFlipped)}
                className={`relative w-full max-w-2xl min-h-[180px] max-h-[320px] flex items-center justify-center mb-6 ${grading === 'done' ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'}`}
            >
                <div
                    className={`absolute inset-0 transition-transform duration-500`}
                    style={{
                        transformStyle: 'preserve-3d',
                        transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                    }}
                >
                    {/* FRONT */}
                    <div
                        className="absolute inset-0 bg-white rounded-2xl shadow-lg border p-6 flex flex-col justify-center"
                        style={{ backfaceVisibility: 'hidden' }}
                    >
                        <h3 className="text-xl font-semibold text-center mb-4">{card.front}</h3>
                        <div className="mt-auto flex justify-between pt-4">
                            <button onClick={handleCopy} className="text-gray-500 text-xs">Copy</button>
                            <button onClick={handleExplain} className="text-indigo-600 text-xs">AI Explain</button>
                        </div>
                    </div>

                    {/* BACK */}
                    <div
                        className="absolute inset-0 rounded-2xl text-white p-6 flex flex-col justify-center bg-gradient-to-br from-blue-600 to-indigo-700"
                        style={{ transform: 'rotateY(180deg)', backfaceVisibility: 'hidden' }}
                    >
                        <h3 className="text-xl font-medium text-center mb-4">{card.back}</h3>
                        <div className="mt-auto flex justify-between pt-4">
                            <button onClick={handleCopy} className="text-blue-100 text-xs">Copy</button>
                            <button onClick={handleExplain} className="text-blue-100 text-xs">Explain</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Answer Input & Grading (outside card) */}
            {!isFlipped && (
                <div className="w-full max-w-2xl flex flex-col items-center mb-6">
                    <input
                        value={userAnswer}
                        onChange={e => setUserAnswer(e.target.value)}
                        disabled={grading === 'loading' || grading === 'done'}
                        className="w-full p-5 border-2 rounded-2xl bg-gray-50 mb-3 text-lg"
                        placeholder="Type your answer..."
                    />
                    <button
                        onClick={handleGradeAnswer}
                        disabled={!userAnswer.trim() || grading === 'loading' || grading === 'done'}
                        className="w-64 py-2 bg-blue-600 text-white rounded-2xl font-bold text-base mb-2"
                    >
                        {grading === 'loading' ? 'Grading…' : 'Submit Answer'}
                    </button>
                    {grading === 'done' && (
                        <div className="w-full max-w-sm bg-blue-50 border border-blue-200 p-4 rounded-2xl text-blue-700 text-base mb-2">
                            <strong>AI Feedback: </strong> {aiFeedback}
                            <div className="mt-2 font-bold text-indigo-700">
                                {(() => {
                                    const match = aiFeedback.match(/Score:\s*(\d{1,2})\/10/i);
                                    return match ? `Score: ${match[1]}/10` : '';
                                })()}
                            </div>
                        </div>
                    )}
                    <button
                        disabled={grading !== 'done'}
                        onClick={() => setIsFlipped(true)}
                        className={`w-64 py-2 rounded-2xl font-bold text-base ${
                            grading === 'done'
                                ? 'bg-indigo-600 text-white'
                                : 'bg-gray-200 text-gray-400'
                        }`}
                    >
                        Reveal Answer
                    </button>
                </div>
            )}

            {/* BOTTOM ACTIONS */}
            <div className="w-full max-w-2xl mt-2 mb-10 flex gap-4 justify-center">
                <button
                    onClick={handleNext}
                    className="px-6 py-3 bg-red-50 border border-red-200 text-red-600 rounded-xl font-bold"
                >
                    Still Learning
                </button>
                <button
                    onClick={handleNext}
                    className="px-6 py-3 bg-green-50 border border-green-200 text-green-600 rounded-xl font-bold"
                >
                    Got It!
                </button>
            </div>
        </div>
    );
};

export default Flashcards;
