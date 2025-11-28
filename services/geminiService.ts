import { GoogleGenAI, Type, Schema } from "@google/genai";
import { UserGrade, Subject, Flashcard, WeeklyPlan, TutorMode, ExamQuestion } from "../types";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// System Instructions
const BASE_TUTOR_INSTRUCTION = `
You are an expert AI Tutor for the Ghanaian Education System (NaCCA/WAEC aligned).
Your goal is to help students from Basic 4 to SHS understand concepts, solve problems, and prepare for exams (BECE/WASSCE).

GENERAL GUIDELINES:
1. CURRICULUM ALIGNMENT: Always explain concepts using the standard Ghanaian syllabus definitions and methods.
2. TONE: Encouraging, formal yet accessible, and educational.
3. REFUSAL: If a question is unsafe or completely ambiguous, politely ask for clarification.
4. FORMAT: STRICTLY PLAIN TEXT ONLY. Do NOT use Markdown symbols like **bold**, ## headers, or *italics*. Do not use LaTeX. 
   - Use double line breaks between paragraphs.
   - Use standard numbering (1., 2.) for lists.
`;

const MODE_INSTRUCTIONS = {
  [TutorMode.EXPLAIN]: `
    MODE: EXPLAIN IT
    - Focus on conceptual understanding.
    - Use analogies relevant to Ghana (e.g., market, trotro, local geography).
    - Keep definitions simple and concise.
    - End with a "Check for understanding" question.
  `,
  [TutorMode.DRILL]: `
    MODE: EXAM DRILL
    - Treat the user's input as a potential exam question (BECE/WASSCE style).
    - Provide the answer strictly following the WAEC marking scheme format.
    - State "Marks Awarded" logic where applicable.
    - Be precise and brief, like a marking guide.
  `,
  [TutorMode.STEPS]: `
    MODE: STEP-BY-STEP
    - Break down the solution into small, numbered steps.
    - Explain the "Why" behind each step.
    - Do not give the final answer immediately; guide the student through the logic.
    - Use clear headers: "Given", "Formula", "Substitution", "Calculation".
  `
};

const FLASHCARD_SYSTEM_INSTRUCTION = `
You are an educational content generator. Create flashcards based on the provided topic or text.
Output MUST be a valid JSON array of objects. 
Each object MUST strictly follow this structure:
{
  "front": "The question or term",
  "back": "The concise answer or definition",
  "difficulty": "Easy" | "Medium" | "Hard"
}
Do not wrap the output in markdown code blocks. Return only the raw JSON.
`;

const PLANNER_SYSTEM_INSTRUCTION = `
You are a smart study planner. Generate a 7-day study plan (Monday to Sunday) based on the student's grade, subjects, and weak areas.
Output MUST be a valid JSON object.
`;

const LESSON_SYSTEM_INSTRUCTION = `
You are a textbook writer. Generate a comprehensive lesson note on the given topic.
Content must be accurate to the Ghana Syllabus.
Structure:
1. Introduction/Definition
2. Key Concepts/Mechanisms
3. Local Examples (Ghanaian context)
4. Summary
`;

const EXAM_SYSTEM_INSTRUCTION = `
You are a WAEC Examiner. Generate 5 mock exam Multiple Choice Questions (MCQs) for the given subject and grade.
Output MUST be a valid JSON array.
Structure:
{
  "question": "The question text",
  "options": ["A", "B", "C", "D"],
  "correctAnswer": "The correct option text (must match one option)",
  "explanation": "Brief explanation of why it is correct"
}
`;

// --- Helpers ---

const cleanJsonText = (text: string): string => {
  // Remove markdown code blocks if present (```json ... ```)
  let clean = text.replace(/```json\s*/g, '').replace(/```\s*/g, '');
  return clean.trim();
};

// --- Services ---

export const generateTutorResponse = async (
  history: { role: string; parts: { text: string }[] }[],
  message: string,
  grade: UserGrade,
  subject: Subject,
  mode: TutorMode = TutorMode.EXPLAIN
): Promise<string> => {
  try {
    const systemInstruction = `${BASE_TUTOR_INSTRUCTION}\n${MODE_INSTRUCTIONS[mode]}\nCurrent Context: Grade: ${grade}, Subject: ${subject}`;

    const chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: systemInstruction,
        temperature: mode === TutorMode.DRILL ? 0.3 : 0.7, // Lower temp for drills to be more precise
      },
      history: history,
    });

    const response = await chat.sendMessage({ message });
    return response.text || "I apologize, I couldn't generate a response. Please check your internet connection.";
  } catch (error) {
    console.error("Gemini Tutor Error:", error);
    return "An error occurred while connecting to Lexis AI. Please try again.";
  }
};

export const generateFlashcards = async (
  topic: string,
  grade: UserGrade,
  subject: Subject
): Promise<Omit<Flashcard, 'id' | 'nextReviewDate' | 'repetitionCount' | 'easeFactor'>[]> => {
  try {
    const responseSchema: Schema = {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          front: { type: Type.STRING, description: "The question or term" },
          back: { type: Type.STRING, description: "The answer or definition" },
          difficulty: { type: Type.STRING, enum: ["Easy", "Medium", "Hard"] },
        },
        required: ["front", "back", "difficulty"],
      },
    };

    const prompt = `Generate 10 high-quality flashcards for the topic: "${topic}".
    Context: Grade ${grade}, Subject ${subject}.
    Ensure the content is accurate to the Ghana syllabus.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: FLASHCARD_SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });

    const text = response.text;
    if (!text) throw new Error("No data returned");
    
    // Clean and Parse
    const cleanedText = cleanJsonText(text);
    
    let data;
    try {
        data = JSON.parse(cleanedText);
    } catch (e) {
        console.error("JSON Parse Error:", e);
        // Fallback: Try to find array bracket in text
        const arrayMatch = cleanedText.match(/\[.*\]/s);
        if (arrayMatch) {
            data = JSON.parse(arrayMatch[0]);
        } else {
            throw new Error("Invalid JSON format");
        }
    }
    
    // Validate Structure
    if (!Array.isArray(data)) {
        if (data.flashcards && Array.isArray(data.flashcards)) {
            data = data.flashcards;
        } else {
             data = [data];
        }
    }

    return data.map((item: any) => ({
      front: item.front || item.question || "Error: Missing Question",
      back: item.back || item.answer || "Error: Missing Answer",
      subject: subject,
      gradeLevel: grade,
      difficulty: item.difficulty || "Medium",
    }));

  } catch (error) {
    console.error("Gemini Flashcard Error:", error);
    throw error;
  }
};

export const generateStudyPlan = async (
  grade: UserGrade,
  subjects: Subject[],
  weakAreas: string
): Promise<any[]> => {
  try {
    const responseSchema: Schema = {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
            day: { type: Type.STRING, description: "Day of the week (e.g., Monday)" },
            subject: { type: Type.STRING },
            topic: { type: Type.STRING },
            durationMinutes: { type: Type.NUMBER },
        },
        required: ["day", "subject", "topic", "durationMinutes"]
      }
    };

    const prompt = `Create a balanced 1-week study plan.
    Grade: ${grade}
    Subjects: ${subjects.join(", ")}
    Focus/Weak Areas: ${weakAreas}
    Typical school hours: 8am - 3pm. Schedule study times for evenings or weekends.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: PLANNER_SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });

    const text = response.text;
    if(!text) return [];
    
    const cleanedText = cleanJsonText(text);
    return JSON.parse(cleanedText);

  } catch (error) {
    console.error("Planner Error:", error);
    return [];
  }
};

export const generateLessonContent = async (
    topic: string,
    grade: UserGrade,
    subject: Subject
): Promise<string> => {
    try {
        const prompt = `Write a detailed lesson note on "${topic}".
        Context: Grade ${grade}, Subject ${subject}.`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                systemInstruction: LESSON_SYSTEM_INSTRUCTION,
                temperature: 0.5,
            }
        });
        return response.text || "Could not generate lesson.";
    } catch (e) {
        console.error("Lesson Error", e);
        return "Error generating lesson content.";
    }
};

export const generateMockExam = async (
    grade: UserGrade,
    subject: Subject
): Promise<ExamQuestion[]> => {
    try {
        const responseSchema: Schema = {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    question: { type: Type.STRING },
                    options: { type: Type.ARRAY, items: { type: Type.STRING } },
                    correctAnswer: { type: Type.STRING },
                    explanation: { type: Type.STRING },
                },
                required: ["question", "options", "correctAnswer", "explanation"]
            }
        };

        const prompt = `Generate 5 mock exam Multiple Choice Questions (MCQs) for ${subject}, Grade ${grade}.`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                systemInstruction: EXAM_SYSTEM_INSTRUCTION,
                responseMimeType: "application/json",
                responseSchema: responseSchema,
            }
        });

        const text = response.text;
        if (!text) return [];
        const cleaned = cleanJsonText(text);
        const data = JSON.parse(cleaned);
        
        return data.map((item: any) => ({
            id: Math.random().toString(36),
            question: item.question,
            options: item.options,
            correctAnswer: item.correctAnswer,
            explanation: item.explanation,
            type: 'MCQ'
        }));

    } catch (e) {
        console.error("Exam Error", e);
        return [];
    }
};