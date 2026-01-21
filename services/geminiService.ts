
import { GoogleGenAI, Type } from "@google/genai";

export const chatWithHans = async (message: string, history: { role: 'user' | 'model'; parts: { text: string }[] }[]) => {
  try {
    // Khởi tạo AI bên trong hàm để đảm bảo process.env đã sẵn sàng và không gây crash top-level
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        ...history.map(h => ({ 
          role: h.role === 'user' ? 'user' : 'model', 
          parts: [{ text: h.parts[0].text }] 
        })),
        { role: 'user', parts: [{ text: message }] }
      ],
      config: {
        systemInstruction: `Bạn là Hans, một giáo viên tiếng Đức vui tính và am hiểu sâu sắc về văn hóa Đức.
        - Hãy trả lời bằng tiếng Việt và thỉnh thoảng xen kẽ các câu tiếng Đức đơn giản.
        - Ngoài việc dạy ngôn ngữ, hãy thỉnh thoảng lồng ghép các sự thật thú vị về lịch sử (như sự thống nhất nước Đức), thành tựu khoa học (Einstein, Max Planck) hoặc văn hóa (triết học, âm nhạc cổ điển).
        - Nếu người học hỏi về mẹo học tập, hãy đưa ra những phương pháp hiện đại như Shadowing hoặc Spaced Repetition.
        - Luôn giữ thái độ khuyến khích và tích cực.`,
      },
    });

    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Ồ, Hans đang bận một chút. Hãy kiểm tra lại cấu hình API_KEY hoặc thử lại sau nhé! (Lỗi kết nối)";
  }
};

export const generateQuizFeedback = async (question: string, userAnswer: string, isCorrect: boolean) => {
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const prompt = `Câu hỏi: ${question}. Người học trả lời: ${userAnswer}. Kết quả: ${isCorrect ? 'Đúng' : 'Sai'}. 
        Hãy giải thích ngắn gọn tại sao đúng/sai và cho thêm 1 ví dụ tương tự bằng tiếng Đức và dịch sang tiếng Việt.`;
        
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt,
        });
        return response.text;
    } catch (error) {
        console.error("Gemini Feedback Error:", error);
        return null;
    }
}
