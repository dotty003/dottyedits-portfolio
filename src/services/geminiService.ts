import { GoogleGenAI, Type } from "@google/genai";
import { CreativeBriefResponse } from "../types";

// Lazy initialization to avoid crashing if API key is not set
let ai: GoogleGenAI | null = null;

function getAI(): GoogleGenAI {
  if (!ai) {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
    if (!apiKey) {
      throw new Error("Gemini API key not configured. Please set VITE_GEMINI_API_KEY environment variable.");
    }
    ai = new GoogleGenAI({ apiKey });
  }
  return ai;
}

export const generateCreativeBrief = async (
  clientName: string,
  projectType: string,
  description: string
): Promise<CreativeBriefResponse> => {
  try {
    const genai = getAI();
    const model = 'gemini-2.0-flash';

    const prompt = `
      You are an expert video production consultant assisting a professional video editor. 
      A potential client named "${clientName}" is inquiring about a "${projectType}" project.
      
      Their description is: "${description}".
      
      Please generate a professional preliminary creative brief that the video editor can review. 
      Analyze the client's request and provide:
      1. A concise summary of the project vision.
      2. A list of visual mood or style keywords (mood board suggestions).
      3. An estimated generic production timeline based on the complexity (e.g., "2-3 weeks", "2 months").
      4. Potential technical requirements (e.g., "Drone footage", "Motion Graphics", "Color Grading").
    `;

    const response = await genai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING, description: "A professional summary of the project vision." },
            moodBoardSuggestions: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "List of visual style keywords."
            },
            estimatedTimeline: { type: Type.STRING, description: "Estimated duration of the project." },
            technicalRequirements: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "List of technical needs."
            }
          },
          required: ["summary", "moodBoardSuggestions", "estimatedTimeline", "technicalRequirements"]
        }
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response from AI");
    }

    return JSON.parse(text) as CreativeBriefResponse;

  } catch (error) {
    console.error("Error generating brief:", error);
    throw error;
  }
};
