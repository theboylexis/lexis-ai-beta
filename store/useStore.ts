import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { UserProfile, UserGrade, Subject, ChatMessage, Flashcard, WeeklyPlan, DashboardStats, TutorMode } from '../types';

interface AppState {
  // User Profile
  user: UserProfile | null;
  setUser: (user: UserProfile) => void;
  
  // Dashboard Stats
  stats: DashboardStats;
  incrementStudyTime: (minutes: number) => void;
  incrementReviewCount: () => void;
  incrementSessionCount: () => void;

  // Tutor
  currentSubject: Subject | null;
  setCurrentSubject: (sub: Subject) => void;
  tutorMode: TutorMode;
  setTutorMode: (mode: TutorMode) => void;
  messages: ChatMessage[];
  addMessage: (msg: ChatMessage) => void;
  clearMessages: () => void;
  
  // Bridge for Flashcard -> Tutor Explanation
  pendingTutorQuery: string | null;
  setPendingTutorQuery: (query: string | null) => void;

  // Flashcards
  flashcards: Flashcard[];
  addFlashcards: (cards: Flashcard[]) => void;
  updateFlashcard: (updatedCard: Flashcard) => void;
  
  // Planner
  weeklyPlan: WeeklyPlan | null;
  setWeeklyPlan: (plan: WeeklyPlan) => void;

  // System
  logout: () => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      
      stats: {
        totalStudyMinutes: 0,
        cardsReviewed: 0,
        tutorSessions: 0,
        streakDays: 1,
      },
      incrementStudyTime: (mins) => set((state) => ({ 
        stats: { ...state.stats, totalStudyMinutes: state.stats.totalStudyMinutes + mins } 
      })),
      incrementReviewCount: () => set((state) => ({
        stats: { ...state.stats, cardsReviewed: state.stats.cardsReviewed + 1 }
      })),
      incrementSessionCount: () => set((state) => ({
        stats: { ...state.stats, tutorSessions: state.stats.tutorSessions + 1 }
      })),

      currentSubject: null,
      setCurrentSubject: (sub) => set({ currentSubject: sub }),
      tutorMode: TutorMode.EXPLAIN,
      setTutorMode: (mode) => set({ tutorMode: mode }),
      messages: [],
      addMessage: (msg) => set((state) => ({ messages: [...state.messages, msg] })),
      clearMessages: () => set({ messages: [] }),
      
      pendingTutorQuery: null,
      setPendingTutorQuery: (query) => set({ pendingTutorQuery: query }),

      flashcards: [],
      addFlashcards: (cards) => set((state) => ({ flashcards: [...state.flashcards, ...cards] })),
      updateFlashcard: (updatedCard) => set((state) => ({
        flashcards: state.flashcards.map((c) => (c.id === updatedCard.id ? updatedCard : c))
      })),

      weeklyPlan: null,
      setWeeklyPlan: (plan) => set({ weeklyPlan: plan }),

      logout: () => {
        set({
          user: null, 
          stats: {
            totalStudyMinutes: 0,
            cardsReviewed: 0,
            tutorSessions: 0,
            streakDays: 1,
          },
          currentSubject: null,
          messages: [],
          flashcards: [],
          weeklyPlan: null,
          pendingTutorQuery: null,
        });
      }
    }),
    {
      name: 'lexis-ai-storage', 
      storage: createJSONStorage(() => localStorage),
    }
  )
);