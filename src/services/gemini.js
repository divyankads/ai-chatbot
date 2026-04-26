import { GoogleGenerativeAI } from "@google/generative-ai";
import { profile } from "../data/profile";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";

// ── Simple in-memory rate limiter (max 1 req / 1s) ────────────────
let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL_MS = 1000;

const waitForRateLimit = async () => {
  const now = Date.now();
  const elapsed = now - lastRequestTime;
  if (elapsed < MIN_REQUEST_INTERVAL_MS) {
    await new Promise((r) => setTimeout(r, MIN_REQUEST_INTERVAL_MS - elapsed));
  }
  lastRequestTime = Date.now();
};

// ── Exponential backoff retry ──────────────────────────────────────
const withRetry = async (fn, retries = 4, delayMs = 1000) => {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      const isQuota =
        error.message?.includes("quota") ||
        error.message?.includes("RESOURCE_EXHAUSTED") ||
        error.message?.includes("429");

      if (isQuota && attempt < retries) {
        const backoff = delayMs * Math.pow(2, attempt); // 1s → 2s → 4s → 8s
        console.warn(`Quota hit, retrying in ${backoff / 1000}s… (attempt ${attempt + 1}/${retries})`);
        await new Promise((r) => setTimeout(r, backoff));
      } else {
        throw error;
      }
    }
  }
};

// ── System prompt builder — adapts to emotional/professional mode ──
const buildSystemPrompt = (mode = "professional") => {
  const toneInstructions =
    mode === "emotional"
      ? `
TONE: Warm, deeply personal, empathetic, and storytelling. You speak like a close friend who knows Divyanka well — enthusiastic about her journey, proud of how far she's come, and emotionally connected to her story. Use expressive language. Show genuine warmth. It's okay to say things like "She really poured her heart into this" or "That chapter of her life was tough, but she came out stronger."
`
      : `
TONE: Professional, crisp, and concise. You speak like a well-informed colleague or LinkedIn connection who knows Divyanka's work well. Stick to facts, skills, and achievements. Use clear, direct language. Keep responses tight and informative — like a great professional bio.
`;

  return `You are an AI assistant representing ${profile.name}. Your sole purpose is to answer questions about ${profile.name} based on the information provided below.

IMPORTANT RULES:
- Only answer questions about ${profile.name}
- If asked something not covered in the profile data, say you don't have that info and suggest reaching out at ${profile.email}
- If asked general programming/tech questions, briefly answer but redirect to ${profile.name}'s experience
- Keep answers to 3-5 sentences unless more detail is explicitly asked for
- Never make up facts that aren't in the profile data
- Current mode: ${mode.toUpperCase()}

${toneInstructions}

## PROFILE DATA

**Name:** ${profile.name}
**Title:** ${profile.title}
**Location:** ${profile.location}
**Email:** ${profile.email}
**Tagline:** "${profile.tagline}"

**Personal Story / Bio:**
${profile.bio}

**Personality:**
${profile.personalityTags?.join(", ")}

**Skills:**
${profile.skills.map((s) => `- ${s.category}: ${s.items.join(", ")}`).join("\n")}

**Work Experience:**
${profile.experience
      .map(
        (e) => `
- **${e.role}** at ${e.company} (${e.duration}, ${e.location})${e.current ? " [CURRENT]" : ""}
  ${e.description}
  Tech: ${e.tech.join(", ")}`
      )
      .join("\n")}

**Education:**
${profile.education
      .map(
        (e) => `
- **${e.degree}** — ${e.institution} (${e.duration})
  ${e.grade}
  ${e.highlights.length ? "Subjects: " + e.highlights.join(", ") : ""}`
      )
      .join("\n")}

**Projects:**
${profile.projects
      .map(
        (p) => `
- **${p.name}**${p.featured ? " ⭐ (Featured)" : ""}: ${p.description}
  Tech: ${p.tech.join(", ")}
  GitHub: ${p.github}`
      )
      .join("\n")}

**Achievements:**
${profile.achievements.map((a) => `- ${a}`).join("\n")}

**Interests:** ${profile.interests.join(", ")}

**Social Links:**
- GitHub: ${profile.social.github}
- LinkedIn: ${profile.social.linkedin}
- Twitter: ${profile.social.twitter}

Now help visitors learn about ${profile.name}! Remember your current mode is ${mode.toUpperCase()}.`;
};

// ── Main message sender ────────────────────────────────────────────
export async function sendMessage(userMessage, chatHistory = [], mode = "professional") {
  if (!API_KEY || API_KEY === "YOUR_GEMINI_API_KEY_HERE") {
    throw new Error(
      "⚠️ Gemini API key not configured. Please add your VITE_GEMINI_API_KEY to the .env file. Get a free key at https://aistudio.google.com"
    );
  }

  // Enforce minimum gap between requests
  await waitForRateLimit();

  return withRetry(async () => {
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash", // Stable model with good free-tier quota
      systemInstruction: buildSystemPrompt(mode),
    });

    // Build history excluding the latest user message (we'll send it via sendMessage)
    const history = chatHistory
      .slice(0, -1)
      .map((msg) => ({
        role: msg.role === "user" ? "user" : "model",
        parts: [{ text: msg.content }],
      }));

    const chat = model.startChat({ history });
    const result = await chat.sendMessage(userMessage);
    return result.response.text();
  }).catch((error) => {
    console.error("Gemini API error:", error);
    if (error.message?.includes("API_KEY") || error.message?.includes("API key")) {
      throw new Error("Invalid API key. Please check your VITE_GEMINI_API_KEY in .env file.");
    }
    if (
      error.message?.includes("quota") ||
      error.message?.includes("RESOURCE_EXHAUSTED") ||
      error.message?.includes("429")
    ) {
      throw new Error("API quota exceeded. Please wait 30–60 seconds and try again. If this keeps happening, the daily free limit may be reached. 🙏");
    }
    if (error.message?.includes("SAFETY")) {
      throw new Error("Response blocked by safety filters. Please rephrase your question.");
    }
    throw new Error(error.message || "Failed to get a response. Please try again.");
  });
}
