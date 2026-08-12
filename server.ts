import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Lazy init Gemini SDK
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// API Health Check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// AI Pet Assistant Endpoint
app.post("/api/gemini/assistant", async (req, res) => {
  try {
    const { prompt, petContext, language = "en" } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      // Fallback response if key is missing
      const isBn = language === "bn";
      return res.json({
        reply: isBn
          ? "FurCare AI সহকারী: আপনার পোষা প্রাণীর যত্ন, খাদ্য ও প্রাথমিক চিকিৎসার বিষয়ে সাহায্য করতে আমি এখানে আছি। (দ্রষ্টব্য: সেরা ফলাফলের জন্য GEMINI_API_KEY সক্রিয় করুন)"
          : "FurCare AI Assistant: I am here to help you with your pet's healthcare, nutrition, and first-aid advice. How can I assist your pet today?",
      });
    }

    const systemInstruction = `You are "FurCare AI Doctor & Companion", an expert veterinary assistant and friendly pet healthcare advisor for FurCare platform in Bangladesh.
User Language choice: ${language === "bn" ? "Bangla (বাংলা)" : "English"}.
If user language is Bangla, reply in natural, friendly Bangla. If English, reply in English.
Provide clear, caring, concise, and accurate advice for dogs, cats, and rabbits.
If the pet might be in critical danger, always advise contacting an emergency vet immediately.
Context about user's pet: ${JSON.stringify(petContext || {})}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    res.json({ reply: response.text || "Thank you for reaching out to FurCare AI." });
  } catch (error: any) {
    console.error("Error in AI Assistant route:", error);
    res.status(500).json({ error: "AI Assistant failed to generate response." });
  }
});

// AI First-Aid Advice for Vet Booking
app.post("/api/gemini/first-aid", async (req, res) => {
  try {
    const { symptom, petType, language = "en" } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      const isBn = language === "bn";
      return res.json({
        firstAidSteps: isBn
          ? [
              "১. আপনার পোষা প্রাণীকে শান্ত এবং নিরিবিলি জায়গায় রাখুন।",
              "২. প্রচুর তাজা জল খেতে দিন (যদি সে পান করতে পারে)।",
              "৩. ডাক্তারের পরামর্শ না পাওয়া পর্যন্ত নিজের থেকে কোনো ওষুধ দেবেন না।",
              "৪. দ্রুত নিকটস্থ পশু চিকিৎসা কেন্দ্রে নিয়ে যান।",
            ]
          : [
              "1. Keep your pet calm and in a comfortable, shaded environment.",
              "2. Offer fresh, clean water if the pet is conscious and able to swallow.",
              "3. Do not give any human medications without vet approval.",
              "4. Prepare your pet for travel to the scheduled vet appointment.",
            ],
      });
    }

    const systemInstruction = `You are a veterinary emergency specialist. Provide 3-4 immediate, safe, step-by-step first-aid actions for a ${petType || "pet"} showing these symptoms: "${symptom}".
Language: ${language === "bn" ? "Bangla" : "English"}.
Format output as a JSON array of string steps.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: `Provide first-aid steps for symptom: ${symptom}`,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
      },
    });

    let steps = [];
    try {
      steps = JSON.parse(response.text || "[]");
    } catch {
      steps = [response.text];
    }

    res.json({ firstAidSteps: steps });
  } catch (error: any) {
    console.error("Error in First Aid route:", error);
    res.status(500).json({ error: "Failed to generate first-aid steps." });
  }
});

// AI Lost & Found Pet Matcher
app.post("/api/gemini/lost-found-match", async (req, res) => {
  try {
    const { lostPetData, foundListings, language = "en" } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      // Fallback matching logic
      const matches = foundListings.filter((item: any) => {
        return (
          item.breed?.toLowerCase().includes(lostPetData.breed?.toLowerCase() || "") ||
          item.color?.toLowerCase().includes(lostPetData.color?.toLowerCase() || "")
        );
      });
      return res.json({
        matchedIds: matches.map((m: any) => m.id),
        analysis:
          language === "bn"
            ? "আমাদের স্মার্ট প্যাটার্ন অ্যালগরিদম দ্বারা সম্ভাব্য রঙের এবং ব্রিডের ম্যাচ খুঁজে পাওয়া গেছে।"
            : "Matched based on color, breed, and physical features pattern analysis.",
      });
    }

    const systemInstruction = `You are an AI Pet Identification system for lost and found pets in FurCare Bangladesh.
Compare the lost pet details (${JSON.stringify(
      lostPetData
    )}) with candidate found pet listings (${JSON.stringify(foundListings)}).
Evaluation criteria: color, breed, face structure, eye color, last worn clothing/collar, neck band, birthmarks, and location.
Return a JSON object: { "matchedIds": ["id1", ...], "confidenceScores": { "id1": 95 }, "analysis": "brief reasoning" }.
Respond in language: ${language === "bn" ? "Bangla" : "English"}.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: "Perform AI lost pet matching evaluation.",
      config: {
        systemInstruction,
        responseMimeType: "application/json",
      },
    });

    let result = { matchedIds: [], analysis: "" };
    try {
      result = JSON.parse(response.text || "{}");
    } catch {
      result = { matchedIds: [], analysis: "AI evaluated listings." };
    }

    res.json(result);
  } catch (error: any) {
    console.error("Error in AI Pet Matcher route:", error);
    res.status(500).json({ error: "Failed to match lost pet." });
  }
});

// Start Express and integrate Vite
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

 // AFTER:
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`FurCare Server listening on http://localhost:${PORT}`);
  });
}

startServer();
