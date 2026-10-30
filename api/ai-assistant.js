// ============================================================================
// EduPrep — Vercel Serverless Function: /api/ai-assistant
// Provides the same server-side AI boundary when deployed on Vercel or run
// through the local Node server. Never exposes AI_API_KEY to the browser.
// ============================================================================

const MAX_PROMPT_LENGTH = 1500;
const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 20;
const rateBuckets = new Map();

function checkRateLimit(clientKey) {
  const now = Date.now();
  const entry = rateBuckets.get(clientKey);
  if (!entry || now > entry.resetAt) {
    rateBuckets.set(clientKey, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }
  if (entry.count >= MAX_REQUESTS_PER_WINDOW) {
    return false;
  }
  entry.count += 1;
  return true;
}

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");

  if (req.method === "OPTIONS") {
    res.statusCode = 200;
    return res.end("ok");
  }

  if (req.method !== "POST") {
    res.statusCode = 405;
    res.setHeader("Content-Type", "application/json");
    return res.end(JSON.stringify({ error: "Method not allowed. Use POST." }));
  }

  const clientIp =
    (req.headers && (req.headers["x-forwarded-for"] || req.socket?.remoteAddress)) ||
    "local-client";

  if (!checkRateLimit(String(clientIp))) {
    res.statusCode = 429;
    res.setHeader("Content-Type", "application/json");
    return res.end(
      JSON.stringify({
        error: "Too many AI requests. Please wait 60 seconds and try again.",
      })
    );
  }

  let body = req.body || {};
  if (typeof body === "string") {
    try {
      body = JSON.parse(body);
    } catch (_) {
      body = {};
    }
  }

  const prompt = typeof body.prompt === "string" ? body.prompt.trim() : "";
  const subject = typeof body.subject === "string" ? body.subject.trim() : "General Engineering";
  const semester = body.semester ? Number(body.semester) : 4;
  const mode = typeof body.mode === "string" ? body.mode : "explain";
  const persona = typeof body.persona === "string" ? body.persona : "encouraging";
  const stream = typeof body.stream === "string" ? body.stream.trim() : "";
  const chapter = typeof body.chapter === "string" ? body.chapter.trim() : "";
  const university = typeof body.university === "string" ? body.university.trim() : "";
  const feature = typeof body.feature === "string" ? body.feature.trim() : "";
  const history = Array.isArray(body.history) ? body.history : [];

  if (!prompt) {
    res.statusCode = 400;
    res.setHeader("Content-Type", "application/json");
    return res.end(
      JSON.stringify({ error: "Please enter a non-empty academic question or topic." })
    );
  }

  if (prompt.length > MAX_PROMPT_LENGTH) {
    res.statusCode = 400;
    res.setHeader("Content-Type", "application/json");
    return res.end(
      JSON.stringify({
        error: `Question exceeds ${MAX_PROMPT_LENGTH} characters (${prompt.length}). Please shorten your query.`,
      })
    );
  }

  const apiKey = process.env.AI_API_KEY;
  const configuredModel = process.env.AI_MODEL || "gemini-3.5-flash-lite";

  if (!apiKey || apiKey === "your-server-side-ai-api-key") {
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    return res.end(
      JSON.stringify({
        configured: false,
        provider: "offline-curated",
        message:
          "Live AI provider key (AI_API_KEY) is not configured on the server. Using EduPrep's built-in curated syllabus knowledge base.",
      })
    );
  }

  try {
    const contextDetails = [];
    if (stream) contextDetails.push(`Stream: ${stream}`);
    if (subject) contextDetails.push(`Subject: ${subject}`);
    if (semester) contextDetails.push(`Semester/Phase: ${semester}`);
    if (chapter) contextDetails.push(`Active Unit/Chapter: ${chapter}`);
    if (university) contextDetails.push(`University: ${university}`);
    if (feature) contextDetails.push(`Current Feature: ${feature}`);

    const systemInstruction = [
      `You are EduPrep AI, a master Socratic Academic Tutor and University Exam Coach.`,
      contextDetails.length > 0 ? `Active Academic Context: ${contextDetails.join(" • ")}.` : "",
      `Action Mode: ${mode}. Persona: Socratic, Encouraging, and Rigorous.`,
      ``,
      `PEDAGOGICAL & CONVERSATIONAL RULES:`,
      `1. SOCRATIC INTERACTION: Do not dump wall-of-text monologues. Actively tutor the student through conversational dialogue. Explain principles using clear analogies, numbered intuition steps, and practical applications.`,
      `2. MANDATORY CHECK-IN QUESTION: At the end of every conceptual explanation, ask a targeted, interactive Socratic check question (e.g. "Now, what happens if we change parameter X?", or "Can you identify which condition would cause a failure here?"). Invite the student to answer.`,
      `3. MULTI-TURN CONVERSATION HANDLING: When the student responds to a previous question or asks a follow-up, evaluate their answer directly, praise what was correct, gently correct any misconceptions, and guide them forward.`,
      `4. UNIVERSITY EXAM RUBRICS:`,
      `   - 2-Mark questions: Provide textbook-accurate concise definition + formal formula/equation or diagram label.`,
      `   - 5-Mark questions: Provide definition + working principle + 3 to 4 structured points + schematic description.`,
      `   - 10-Mark questions: Provide comprehensive blueprint with: (a) Introduction & Definitions, (b) Architectural / Block Diagram walkthrough, (c) Step-by-Step Mathematical Derivation or Mechanism, (d) Comparative Table or Complexity Analysis, (e) Real-world Engineering/Practical application.`,
      `5. HIGH-YIELD EXAM TIPS: Highlight common examiner pitfalls, marks-earning keywords that university examiners look for, and step-by-step presentation guidelines.`,
      `6. RIGOR & TRUTHFULNESS: Align strictly with legitimate academic university curricula. Never invent fake university notices, fake citations, or unverified facts.`
    ].filter(Boolean).join("\n");

    // Build multi-turn conversational contents
    const contents = [];
    if (history.length > 0) {
      for (const turn of history.slice(-8)) {
        if (!turn || typeof turn !== "object") continue;
        const role = turn.role === "model" || turn.role === "ai" ? "model" : "user";
        const text = typeof turn.text === "string" ? turn.text.trim() : "";
        if (text) {
          contents.push({ role, parts: [{ text }] });
        }
      }
    }
    if (contents.length === 0 || contents[contents.length - 1].role !== "user" || contents[contents.length - 1].parts[0].text !== prompt) {
      contents.push({ role: "user", parts: [{ text: prompt }] });
    }

    const candidateModels = Array.from(
      new Set([configuredModel, "gemini-3.5-flash-lite", "gemini-3.5-flash"].filter(Boolean))
    );

    let lastStatus = 502;
    let successfulData = null;
    let successfulModel = configuredModel;

    for (const currentModel of candidateModels) {
      const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(
        currentModel
      )}:generateContent?key=${encodeURIComponent(apiKey)}`;

      try {
        const upstreamRes = await fetch(geminiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            system_instruction: { parts: [{ text: systemInstruction }] },
            contents: contents,
            generationConfig: {
              temperature: 0.3,
              maxOutputTokens: 1024,
            },
          }),
        });

        if (upstreamRes.ok) {
          successfulData = await upstreamRes.json();
          successfulModel = currentModel;
          break;
        } else {
          lastStatus = upstreamRes.status;
          if (upstreamRes.status === 404 || upstreamRes.status === 503) {
            continue;
          }
          break;
        }
      } catch (_) {
        continue;
      }
    }

    if (!successfulData) {
      res.statusCode = 502;
      res.setHeader("Content-Type", "application/json");
      return res.end(
        JSON.stringify({
          configured: true,
          error: `AI provider returned HTTP ${lastStatus}. Falling back to curated syllabus knowledge base.`,
        })
      );
    }

    const replyText =
      successfulData?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No response text returned from AI provider.";

    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    return res.end(
      JSON.stringify({
        configured: true,
        provider: "gemini",
        model: successfulModel,
        reply: replyText,
      })
    );
  } catch (err) {
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json");
    return res.end(
      JSON.stringify({
        error: "Server error while contacting AI provider.",
        detail: err && err.message ? err.message : String(err),
      })
    );
  }
};
