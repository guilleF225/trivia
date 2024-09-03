/*
 * Install the Generative AI SDK
 *
 * $ npm install @google/generative-ai
 */

import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";

const apiKey = import.meta.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);
// Using `responseMimeType` requires either a Gemini 1.5 Pro or 1.5 Flash model
let model = genAI.getGenerativeModel({
  // Using `responseMimeType` requires either a Gemini 1.5 Pro or 1.5 Flash model
  model: "gemini-1.5-flash",
  // Set the `responseMimeType` to output JSON
  generationConfig: { responseMimeType: "application/json" },
});

let prompt = `
Genera 5 preguntas de trivia en español con diferentes niveles de dificultad. Las preguntas deben abarcar diversas categorías como historia, ciencia, geografía, cultura general, y entretenimiento. Para cada pregunta, proporciona cuatro opciones de respuesta, una de las cuales debe ser la correcta. Indica claramente cuál es la respuesta correcta y asigna un nivel de dificultad a cada pregunta en una escala del 1 al 5, donde 1 es muy fácil y 5 es muy difícil.
Asegúrate de que las preguntas sean variadas y que cada una tenga un nivel de dificultad diferente.
 using this JSON schema:
  type: "object",
    properties: {
      response: {
        type: "array",
        items: {
          type: "object",
          properties: {
            question: {
              type: "string"
            },
            correct_answer: {
              type: "string"
            },
            type: {
              type: "string"
            },
            category: {
              type: "string"
            },
            difficulty: {
              type: "string"
            },
            incorrect_answers: {
              type: "array",
              items: {
                type: "string"
              }
            }
          }
        }
      }
    }
  },`;

export const getDailyQuestions = async () => {
  const response = await model.generateContent(prompt);
  return response.response.text();
};
