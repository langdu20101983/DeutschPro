
import { GoogleGenAI } from "@google/genai";

export const chatWithHans = async (message: string, history: { role: 'user' | 'model'; parts: { text: string }[] }[]) => {
  try {
    // Ưu tiên lấy từ process.env.API_KEY theo yêu cầu hệ thống
    const key = process.env.API_KEY;
    
    if (!key || key === "undefined" || key === "") {
      console.error("DEBUG: API_KEY is missing from process.env");
      return "HANS_CONFIG_ERROR: Chào bạn! Mình là Hans. Có vẻ như bạn chưa cấu hình API_KEY trên Vercel hoặc môi trường của bạn không cho phép đọc biến này trực tiếp. \n\n**Cách khắc phục nhanh:** \n1. Vào Vercel Project -> Settings -> Environment Variables.\n2. Thêm biến có tên là `API_KEY`.\n3. Đảm bảo bạn đã nhấn 'Save' và 'Redeploy' lại phiên bản mới nhất.";
    }

    const ai = new GoogleGenAI({ apiKey: key });
    
    const chat = ai.chats.create({
      model: 'gemini-3-flash-preview',
      config: {
        systemInstruction: `Bạn là Hans, một giáo viên tiếng Đức vui tính và am hiểu sâu sắc về văn hóa Đức.
        - Hãy trả lời bằng tiếng Việt và thỉnh thoảng xen kẽ các câu tiếng Đức đơn giản.
        - Ngoài việc dạy ngôn ngữ, hãy thỉnh thoảng lồng ghép các sự thật thú vị về lịch sử (như sự thống nhất nước Đức), thành tựu khoa học (Einstein, Max Planck) hoặc văn hóa (triết học, âm nhạc cổ điển).
        - Nếu người học hỏi về mẹo học tập, hãy đưa ra những phương pháp hiện đại như Shadowing hoặc Spaced Repetition.
        - Luôn giữ thái độ khuyến khích và tích cực.
        - Định dạng phản hồi bằng Markdown sạch sẽ.`,
      },
      history: history.map(h => ({
        role: h.role,
        parts: h.parts
      }))
    });

    const response = await chat.sendMessage({ message });
    return response.text;
  } catch (error: any) {
    console.error("Gemini Error:", error);
    return "Ồ, Hans đang gặp chút vấn đề về kết nối mạng. Bạn hãy thử lại sau nhé!";
  }
};

export const generateQuizFeedback = async (question: string, userAnswer: string, isCorrect: boolean) => {
    try {
        const key = process.env.API_KEY;
        if (!key) return null;
        const ai = new GoogleGenAI({ apiKey: key });
        const prompt = `Câu hỏi: ${question}. Người học trả lời: ${userAnswer}. Kết quả: ${isCorrect ? 'Đúng' : 'Sai'}. 
        Hãy giải thích ngắn gọn tại sao đúng/sai và cho thêm 1 ví dụ tương tự bằng tiếng Đức và dịch sang tiếng Việt.`;
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt,
        });
        return response.text;
    } catch (error) {
        return null;
    }
}
