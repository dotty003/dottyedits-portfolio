import { GoogleGenAI, Type } from "@google/genai";
import { CreativeBriefResponse } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generateCreativeBrief = async (
  clientName: string,
  projectType: string,
  description: string
): Promise<CreativeBriefResponse> => {
  try {
    const model = 'gemini-3-flash-preview';
    
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

    const response = await ai.models.generateContent({
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
