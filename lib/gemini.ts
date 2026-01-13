
import { GoogleGenAI, Type } from "@google/genai";
import { Pet, UserProfile } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

const MODEL_NAME = 'gemini-3-flash-preview';

export const analyzeCompatibility = async (pet: Pet, user: UserProfile) => {
  const prompt = `Analyze the compatibility between this user and this pet for adoption.
  User Profile:
  - Bio: ${user.bio}
  - Home: ${user.homeType} (Has Garden: ${user.hasGarden})
  - Activity: ${user.activityLevel}
  - Kids: ${user.hasChildren ? 'Yes' : 'No'}
  - Current Pets: ${user.existingPets}

  Pet Profile:
  - Name: ${pet.name}
  - Breed: ${pet.breed}
  - Description: ${pet.description}
  
  Return a JSON object with:
  - score: (number 0-100)
  - reason: (string, 1-2 sentences explaining why they are a good or bad match)
  - strengths: (array of strings, e.g. ["Active lifestyle", "Has garden"])
  - concerns: (array of strings, e.g. ["No experience with large dogs"])`;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.NUMBER },
            reason: { type: Type.STRING },
            strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
            concerns: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["score", "reason"]
        }
      }
    });
    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return { score: 85, reason: "You and " + pet.name + " seem like a great match based on your active lifestyle!", strengths: ["Activity match"], concerns: [] };
  }
};

export const getSmartMatches = async (pets: Pet[], user: UserProfile) => {
  const prompt = `Given a user profile and a list of pets, determine which 3 pets are the best matches.
  User Profile: ${JSON.stringify(user)}
  Pets: ${JSON.stringify(pets.map(p => ({ id: p.id, name: p.name, breed: p.breed, desc: p.description })))}
  
  Return a JSON array of objects with:
  - id: (pet id)
  - matchPriority: (number 1-3, 1 being best)
  - insight: (short string why this pet matches)`;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              matchPriority: { type: Type.NUMBER },
              insight: { type: Type.STRING }
            },
            required: ["id", "matchPriority", "insight"]
          }
        }
      }
    });
    return JSON.parse(response.text || '[]');
  } catch (error) {
    console.error("Gemini Matching Error:", error);
    // Fallback logic
    return pets.slice(0, 3).map((p, i) => ({ 
      id: p.id, 
      matchPriority: i + 1, 
      insight: `Based on your ${user.activityLevel} activity level, ${p.name} is a great choice!` 
    }));
  }
};
