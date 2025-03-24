import { GoogleGenerativeAI } from "@google/generative-ai";

if (!process.env.GEMINI_API_KEY) {
  throw new Error("Missing Gemini API key");
}

export const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const getMedbotModel = () => {
  return genAI.getGenerativeModel({ model: "gemini-2.0-pro-exp-02-05" });
};