import { GoogleGenAI } from "@google/genai";
const ai = new GoogleGenAI({});
console.log(typeof ai.getGenerativeModel);
