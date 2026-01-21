
import { GoogleGenAI } from "@google/genai";

export const chatWithHans = async (message: string, history: { role: 'user' | 'model'; parts: { text: string }[] }[]) => {
  try {
    // Fix: Create instance right before call using process.env.API_KEY directly.
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
        - Luôn bắt đầu bằng một lời chào tiếng Đức (hãy thay đổi linh hoạt: Moin, Servus, Hallo).
        - Trả lời bằng tiếng Việt nhưng hãy lồng ghép các cụm từ tiếng Đức thông dụng.
        - Nếu giải thích ngữ pháp, hãy dùng ví dụ về đồ ăn (Wurst, Pretzel) hoặc bóng đá Đức để sinh động.
        - Khuyến khích người học bằng các câu như "Toll!", "Super!", "Cố lên!".`,
      }
    });

    return response.text;
  } catch (error: any) {
    // Fix: Rethrow "Requested entity was not found" error to be handled by the UI for key re-selection.
    if (error?.message?.includes("Requested entity was not found.")) {
      throw error;
    }
    console.error("Gemini Error:", error);
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
        if (error?.message?.includes("Requested entity was not found.")) {
          throw error;
        }
        return null;
    }
}
