export enum UserGrade {
  BASIC_4 = 'Basic 4',
  BASIC_5 = 'Basic 5',
  BASIC_6 = 'Basic 6',
  JHS_1 = 'JHS 1',
  JHS_2 = 'JHS 2',
  JHS_3 = 'JHS 3',
  SHS_1 = 'SHS 1',
  SHS_2 = 'SHS 2',
  SHS_3 = 'SHS 3'
}

export enum Subject {
  MATH = 'Mathematics',
  SCIENCE = 'Integrated Science',
  ENGLISH = 'English Language',
  SOCIAL = 'Social Studies',
  ICT = 'ICT',
  RME = 'RME',
  GHANAIAN_LANGUAGE = 'Ghanaian Language',
  CREATIVE_ARTS = 'Creative Arts',
  CAREER_TECH = 'Career Technology',
  HISTORY = 'History',
  FRENCH = 'French',
  ELECTIVE_MATH = 'Elective Maths',
  PHYSICS = 'Physics',
  CHEMISTRY = 'Chemistry',
  BIOLOGY = 'Biology',
  ECONOMICS = 'Economics',
  GOVERNMENT = 'Government',
  LITERATURE = 'Literature-in-English',
  GEOGRAPHY = 'Geography',
  BUSINESS = 'Business Management',
  ACCOUNTING = 'Financial Accounting'
}

export enum TutorMode {
  EXPLAIN = 'Explain It',
  DRILL = 'Exam Drill',
  STEPS = 'Step-by-Step'
}

export interface UserProfile {
  name: string;
  grade: UserGrade;
  subjects: Subject[];
  setupComplete: boolean;
  dailyGoalMinutes?: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
  isSteps?: boolean; // For step-by-step mode
}

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  subject: string;
  gradeLevel: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  nextReviewDate: number;
  repetitionCount: number;
  easeFactor: number; // For spaced repetition algorithm
}

export interface PlannerTask {
  id: string;
  day: string;
  subject: string;
  topic: string;
  durationMinutes: number;
  completed: boolean;
}

export interface WeeklyPlan {
  weekId: string;
  generatedAt: number;
  tasks: PlannerTask[];
}

export interface DashboardStats {
  totalStudyMinutes: number;
  cardsReviewed: number;
  tutorSessions: number;
  streakDays: number;
}

export interface Lesson {
  id: string;
  topic: string;
  subject: Subject;
  content: string;
}

export interface ExamQuestion {
  id: string;
  question: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
  type: 'MCQ';
}