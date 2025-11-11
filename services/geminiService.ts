
import { GoogleGenAI } from "@google/genai";
import { SYSTEM_INSTRUCTION } from '../constants';

const getApiKey = (): string => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API_KEY environment variable not set. Please add it to your environment.");
  }
  return apiKey;
};

let ai: GoogleGenAI | null = null;

const getAIInstance = () => {
  if (!ai) {
    ai = new GoogleGenAI({ apiKey: getApiKey() });
  }
  return ai;
};


export const getHealthInfo = async (prompt: string): Promise<string> => {
  try {
    const genAI = getAIInstance();
    const response = await genAI.models.generateContent({
        model: "gemini-2.5-pro",
        contents: prompt,
        config: {
            systemInstruction: SYSTEM_INSTRUCTION,
        },
    });

    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error) {
        if (error.message.includes('API key not valid')) {
            throw new Error('The provided API key is not valid. Please check your configuration.');
        }
        throw new Error(`Failed to get response from AI: ${error.message}`);
    }
    throw new Error("An unknown error occurred while communicating with the AI service.");
  }
};
