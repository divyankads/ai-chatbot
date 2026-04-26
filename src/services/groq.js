import Groq from "groq-sdk";
import { profile } from "../data/profile";

const API_KEY = import.meta.env.VITE_GROQ_API_KEY || "";

// ── Singleton client — created once, reused for every request ──────────
let _groq = null;
const getClient = () => {
  if (!_groq)
    _groq = new Groq({
      apiKey: API_KEY,
      dangerouslyAllowBrowser: true, // Required for client-side usage
    });
  return _groq;
};

// ── Model priority list (fallback if one model is unavailable) ─────────
const MODEL_PRIORITY = [
  "llama-3.3-70b-versatile",  // Best quality, 131K context, generous free tier
  "llama3-8b-8192",           // Fast & light fallback
  "gemma2-9b-it",             // Last resort
];

// ── Simple in-memory rate limiter (max 1 req / 1.5s) ──────────────────
let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL_MS = 1500;

const waitForRateLimit = async () => {
  const now = Date.now();
  const elapsed = now - lastRequestTime;
  if (elapsed < MIN_REQUEST_INTERVAL_MS) {
    await new Promise((r) => setTimeout(r, MIN_REQUEST_INTERVAL_MS - elapsed));
  }
  lastRequestTime = Date.now();
};

// ── Exponential backoff retry ─────────────────────────────────────────
const withRetry = async (fn, retries = 3, delayMs = 1000) => {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      const isQuota =
        error.message?.includes("quota") ||
        error.message?.includes("rate_limit") ||
        error.message?.includes("Rate limit") ||
        error.message?.includes("429");

      if (isQuota && attempt < retries) {
        const backoff = delayMs * Math.pow(2, attempt); // 1s → 2s → 4s
        console.warn(`Rate limit hit, retrying in ${backoff / 1000}s… (attempt ${attempt + 1}/${retries})`);
        await new Promise((r) => setTimeout(r, backoff));
      } else {
        throw error;
      }
    }
  }
};

// ── System prompt builder — adapts to emotional/professional mode ──────
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

// ── Main message sender ────────────────────────────────────────────────
export async function sendMessage(userMessage, chatHistory = [], mode = "professional") {
  if (!API_KEY || API_KEY === "YOUR_GROQ_API_KEY_HERE") {
    throw new Error(
      "⚠️ Groq API key not configured. Please add VITE_GROQ_API_KEY to your .env file. Get a free key at https://console.groq.com"
    );
  }

  // Enforce minimum gap between requests
  await waitForRateLimit();

  // Build messages array for Groq (OpenAI-style):
  // - System prompt goes first
  // - Then past history (excluding the current user message at the end)
  // - Then the current user message
  const pastHistory = chatHistory
    .slice(0, -1) // drop last entry (current user msg) — we add it explicitly below
    .map((msg) => ({
      role: msg.role === "user" ? "user" : "assistant",
      content: msg.content,
    }));

  const messages = [
    { role: "system", content: buildSystemPrompt(mode) },
    ...pastHistory,
    { role: "user", content: userMessage },
  ];

  // Try models in priority order
  let lastError;
  for (const modelName of MODEL_PRIORITY) {
    try {
      return await withRetry(async () => {
        const completion = await getClient().chat.completions.create({
          model: modelName,
          messages,
          temperature: 0.7,
          max_tokens: 512,
        });
        return completion.choices[0]?.message?.content || "";
      });
    } catch (error) {
      const isQuota =
        error.message?.includes("rate_limit") ||
        error.message?.includes("Rate limit") ||
        error.message?.includes("quota") ||
        error.message?.includes("429");

      const isNotFound =
        error.message?.includes("model_not_found") ||
        error.message?.includes("404") ||
        error.message?.includes("not found") ||
        error.message?.includes("not supported") ||
        error.message?.includes("decommissioned");

      if (isQuota || isNotFound) {
        console.warn(`Model ${modelName} ${isNotFound ? "not available" : "rate limited"}, trying next…`);
        lastError = error;
        continue;
      }

      // Non-recoverable error
      console.error("Groq API error:", error);
      if (error.message?.includes("API_KEY") || error.message?.includes("api_key") || error.message?.includes("Unauthorized") || error.status === 401) {
        throw new Error("Invalid Groq API key. Please check VITE_GROQ_API_KEY in your .env file.");
      }
      throw new Error(error.message || "Failed to get a response. Please try again.");
    }
  }

  // All models exhausted
  console.error("All Groq models failed:", lastError);
  throw new Error(
    "Rate limit reached across all models. Please wait a moment and try again. 🙏"
  );
}
