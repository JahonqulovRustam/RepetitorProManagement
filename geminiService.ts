
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateTestQuestions = async (subject: string, topic: string) => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Generate 5 multiple-choice questions for the subject: ${subject} on the topic: ${topic}. Include 4 options for each and mark the correct one. Output MUST be a valid JSON array.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            question: { type: Type.STRING },
            options: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            correctAnswer: { type: Type.STRING }
          },
          required: ["question", "options", "correctAnswer"]
        }
      }
    }
  });

  try {
    return JSON.parse(response.text || '[]');
  } catch (e) {
    console.error("JSON parse error:", e);
    return [];
  }
};

export const getStudentPerformanceFeedback = async (studentName: string, attendance: string, homeworkStatus: string) => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Student Name: ${studentName}. Attendance: ${attendance}. Homework completion: ${homeworkStatus}. Provide a short, encouraging professional feedback for the student in 3 sentences. Output just the feedback text.`,
  });
  return response.text || "No feedback generated.";
};
