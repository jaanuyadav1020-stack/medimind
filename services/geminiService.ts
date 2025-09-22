
import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.error("Gemini API key not found. Please set the API_KEY environment variable.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

export const extractTextFromImage = async (
  base64Image: string,
  mimeType: string
): Promise<string> => {
  if (!API_KEY) {
    return "API Key not configured.";
  }
  
  try {
    const imagePart = {
      inlineData: {
        mimeType: mimeType,
        data: base64Image,
      },
    };

    const textPart = {
      text: "From the provided image of medication packaging, extract only the primary medicine name and its dosage (e.g., 'Aspirin 81mg'). Do not include any other text, instructions, or descriptions.",
    };

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts: [imagePart, textPart] },
    });

    return response.text.trim();
  } catch (error) {
    console.error("Error extracting text from image:", error);
    return "Could not read medicine name from image.";
  }
};
