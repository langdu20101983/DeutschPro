
import { GoogleGenAI, Type } from "@google/genai";
import { Lesson } from "../types";

export const chatWithHans = async (message: string, history: { role: 'user' | 'model'; parts: { text: string }[] }[] | any[]) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        ...history.map(h => ({
          role: h.role === 'model' ? 'model' : 'user',
          parts: [{ text: h.parts[0].text }]
        })),
        { role: 'user', parts: [{ text: message }] }
      ],
      config: {
        systemInstruction: `Bạn là Hans, một gia sư tiếng Đức cực kỳ vui tính, nhiệt huyết.
        - Luôn bắt đầu bằng một lời chào tiếng Đức.
        - Trả lời bằng tiếng Việt nhưng lồng ghép tiếng Đức.
        - Khuyến khích người học bằng các câu như "Toll!", "Super!".`,
      }
    });
    return response.text;
  } catch (error: any) {
    if (error?.message?.includes("Requested entity was not found.")) throw error;
    console.error("Gemini Error:", error);
    return null;
  }
};

export const generateDailyLesson = async (): Promise<Lesson | null> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const date = new Date().toDateString();
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Hãy tạo một bài học tiếng Đức ngắn gọn, thú vị cho ngày ${date}. Chủ đề ngẫu nhiên (ví dụ: tiếng lóng, lễ hội, hoặc một cấu trúc ngữ pháp hay).`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            title: { type: Type.STRING },
            germanTitle: { type: Type.STRING },
            description: { type: Type.STRING },
            category: { type: Type.STRING },
            level: { type: Type.STRING },
            content: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  section: { type: Type.STRING },
                  text: { type: Type.STRING },
                  examples: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        de: { type: Type.STRING },
                        vi: { type: Type.STRING }
                      }
                    }
                  }
                }
              }
            },
            exercises: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  question: { type: Type.STRING },
                  options: { type: Type.ARRAY, items: { type: Type.STRING } },
                  correctAnswer: { type: Type.STRING },
                  explanation: { type: Type.STRING }
                }
              }
            }
          }
        }
      }
    });
    
    const lesson = JSON.parse(response.text);
    return { ...lesson, id: 'daily-' + date };
  } catch (error) {
    console.error("Error generating daily lesson:", error);
    return null;
  }
};

export const generateQuizFeedback = async (question: string, userAnswer: string, isCorrect: boolean) => {
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const prompt = `Giải thích ngắn gọn lỗi sai hoặc lời khen cho câu hỏi: "${question}". Người học chọn: "${userAnswer}". Kết quả: ${isCorrect ? 'Đúng' : 'Sai'}. Trả lời bằng tiếng Việt thật hóm hỉnh.`;
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt,
        });
        return response.text;
    } catch (error: any) {
        if (error?.message?.includes("Requested entity was not found.")) throw error;
        return null;
    }
}
