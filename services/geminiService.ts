import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { ChatMessage, MessageSender } from '../types';
import { AI_PERSONA_PROMPT } from "../constants";

const getAi = (apiKey: string) => new GoogleGenAI({ apiKey });

export const checkApiKeyHealth = async (apiKey: string): Promise<boolean> => {
    try {
        const ai = getAi(apiKey);
        // A simple, low-cost call to see if the key is valid.
        await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: 'hello'
        });
        return true;
    } catch (e) {
        console.error("API Key health check failed:", e);
        return false;
    }
};

export const getAiResponse = async (
  apiKey: string,
  userMessage: string,
  history: ChatMessage[]
): Promise<string> => {
    const ai = getAi(apiKey);
    const chatHistory = history.map((msg: ChatMessage) => ({
        role: msg.sender === MessageSender.USER ? 'user' : 'model',
        parts: [{ text: msg.text }]
    }));
    
    const contents = [...chatHistory, { role: 'user', parts: [{ text: userMessage }] }];

    const response: GenerateContentResponse = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: contents,
        config: {
            systemInstruction: AI_PERSONA_PROMPT,
        }
    });

    return response.text;
};

export const evaluateCode = async (
    apiKey: string,
    prompt: string
): Promise<string> => {
    const ai = getAi(apiKey);
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
    });
    return response.text;
};