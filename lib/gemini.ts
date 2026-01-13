import { Pet, UserProfile } from "../types";

const OPENROUTER_API_KEY = (import.meta as any).env.VITE_OPENROUTER_API_KEY || (import.meta as any).env.VITE_GEMINI_API_KEY || '';
const SITE_URL = 'http://localhost:3000'; // Or your production URL
const SITE_NAME = 'Pet Discovery';

// Using Google Gemini Flash 2.0 via OpenRouter
const MODEL_NAME = 'google/gemini-2.0-flash-001';

const callOpenRouter = async (messages: any[], responseSchema?: any) => {
  if (!OPENROUTER_API_KEY) {
    console.warn("Missing VITE_OPENROUTER_API_KEY");
    throw new Error("Missing API Key");
  }

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "HTTP-Referer": SITE_URL,
        "X-Title": SITE_NAME,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: MODEL_NAME,
        messages: messages,
        response_format: responseSchema ? { type: "json_object" } : undefined
      })
    });

    if (!response.ok) {
      throw new Error(`OpenRouter API Error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error("AI Request Failed:", error);
    throw error;
  }
};

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
  
  Return a VALID JSON object with:
  - score: (number 0-100)
  - reason: (string, 1-2 sentences explaining why they are a good or bad match)
  - strengths: (array of strings, e.g. ["Active lifestyle", "Has garden"])
  - concerns: (array of strings, e.g. ["No experience with large dogs"])`;

  try {
    const jsonStr = await callOpenRouter(
      [{ role: "user", content: prompt }],
      true // request JSON
    );
    return JSON.parse(jsonStr || '{}');
  } catch (error) {
    return { score: 85, reason: "You and " + pet.name + " seem like a great match based on your active lifestyle!", strengths: ["Activity match"], concerns: [] };
  }
};

export const getSmartMatches = async (pets: Pet[], user: UserProfile) => {
  const prompt = `Given a user profile and a list of pets, determine which 3 pets are the best matches.
  User Profile: ${JSON.stringify(user)}
  Pets: ${JSON.stringify(pets.map(p => ({ id: p.id, name: p.name, breed: p.breed, desc: p.description })))}
  
  Return a VALID JSON object with a key "matches" containing an array of objects:
  {
      "matches": [
          {
              "id": "(pet id)",
              "matchPriority": (number 1-3, 1 being best),
              "insight": "short string why this pet matches"
          }
      ]
  }`;

  try {
    const jsonStr = await callOpenRouter(
      [{ role: "user", content: prompt }],
      true
    );
    const result = JSON.parse(jsonStr || '{}');
    return result.matches || [];
  } catch (error) {
    // Fallback logic
    return pets.slice(0, 3).map((p, i) => ({
      id: p.id,
      matchPriority: i + 1,
      insight: `Based on your ${user.activityLevel} activity level, ${p.name} is a great choice!`
    }));
  }
};

export const generateShelterResponse = async (shelterName: string, petName: string, petBreed: string, userMessage: string, userBio: string) => {
  const prompt = `You are a shelter staff member at "${shelterName}". 
    The user Jane is asking about the pet "${petName}" (${petBreed}).
    Latest message from Jane: "${userMessage}"
    Keep the response warm, professional, and under 2 sentences. 
    Jane has a bio: "${userBio}"`;

  try {
    const text = await callOpenRouter([{ role: "user", content: prompt }]);
    return text || "Thanks for your message! We'll get back to you soon.";
  } catch (error) {
    return "Thanks for your message! We'll get back to you soon.";
  }
};
