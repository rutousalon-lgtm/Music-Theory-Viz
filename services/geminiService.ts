import { GoogleGenAI } from "@google/genai";

let ai: GoogleGenAI | null = null;

const getAiClient = () => {
  if (!ai) {
    ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }
  return ai;
};

export const explainConcept = async (concept: string, detail: string): Promise<string> => {
  try {
    const prompt = `
      You are an expert music theory tutor. 
      Briefly explain the concept of "${concept}" in the context of "${detail}".
      Keep the explanation concise (under 80 words), engaging, and easy to understand for a beginner.
      Do not use markdown formatting like bold or headers, just plain text or simple paragraphs.
    `;

    const response = await getAiClient().models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "I couldn't generate an explanation right now.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Sorry, I'm having trouble connecting to the AI tutor right now.";
  }
};