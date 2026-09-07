import axios from "axios";

const API_BASE_URL = "/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 60000,
});

export const chatAPI = {
  // Send a chat message (non-streaming)
  async sendMessage(message, options = {}) {
    const { data } = await api.post("/chat", {
      message,
      conversation_history: options.history || [],
      model: options.model || "gemini-2.0-flash",
      explain_mode: options.explainMode || "normal",
      stream: false,
    });
    return data;
  },

  // Stream a chat message
  async streamMessage(message, history = [], onChunk, model = "gemini-2.0-flash", explainMode = "normal") {
    const response = await fetch(`${API_BASE_URL}/chat/stream`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message,
        conversation_history: history.slice(-10).map((m) => ({
          role: m.role,
          content: m.content,
        })),
        model,
        explain_mode: explainMode,
        stream: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error ${response.status}: ${errorText}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      
      // Process complete SSE messages
      const lines = buffer.split("\n");
      buffer = lines.pop() || ""; // Keep incomplete line in buffer

      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed.startsWith("data: ")) {
          const data = trimmed.slice(6);
          if (data === "[DONE]") {
            return;
          }
          
          try {
            const parsed = JSON.parse(data);
            if (parsed.content) {
              onChunk(parsed.content);
            }
            if (parsed.error) {
              throw new Error(parsed.error);
            }
          } catch (e) {
            // Ignore parse errors for malformed data
            if (e.message && !e.message.includes("JSON")) {
              throw e;
            }
          }
        }
      }
    }
  },

  // Analyze an image
  async analyzeImage(prompt = "Analyze this image", imageBase64) {
    // Try actual image analysis if available
    try {
      const formData = new FormData();
      // Convert base64 to blob
      const base64Data = imageBase64.split(',')[1];
      const byteCharacters = atob(base64Data);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'image/jpeg' });
      
      formData.append('file', blob, 'image.jpg');
      formData.append('prompt', prompt);
      formData.append('model', 'gemini-2.0-flash');
      
      const { data } = await axios.post(`${API_BASE_URL}/analyze-image`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 60000,
      });
      return { response: data.analysis };
    } catch {
      // Fallback to text chat
      const { data } = await api.post("/chat", {
        message: `[Image Analysis Request]\n${prompt}\n\nNote: Please describe the image you're seeing in detail, and I'll help analyze it.`,
        model: "gemini-2.0-flash",
        explain_mode: "normal",
        stream: false,
        conversation_history: [],
      });
      return data;
    }
  },

  // Code Security Audit
  async auditCode(code, language = "python") {
    const { data } = await api.post("/chat/audit", { code, language });
    return data;
  },

  // Practice Quiz Hub
  async generateQuiz(topic, difficulty = "medium", num_questions = 5) {
    const { data } = await api.post("/chat/quiz", { topic, difficulty, num_questions });
    return data;
  },
};

export const healthAPI = {
  async check() {
    const { data } = await api.get("/health");
    return data;
  },
};

export default api;
