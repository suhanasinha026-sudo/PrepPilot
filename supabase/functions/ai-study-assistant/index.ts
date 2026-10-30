// ============================================================================
// EduPrep — Supabase Edge Function: ai-study-assistant
// Secure server-side boundary for AI study help.
// Keeps AI_API_KEY strictly on the server, validates input length, enforces
// per-user/IP rate limits, and provides structured academic responses.
// ============================================================================

import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const MAX_PROMPT_LENGTH = 1500;
const RATE_LIMIT_WINDOW_MS = 60_000;
const MAX_REQUESTS_PER_WINDOW = 15;
const rateBuckets = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(clientKey: string): boolean {
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

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Method not allowed. Use POST." }),
      { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  try {
    const clientIp = req.headers.get("x-forwarded-for") || "anonymous";
    if (!checkRateLimit(clientIp)) {
      return new Response(
        JSON.stringify({
          error: "Rate limit exceeded. Please wait a minute before sending more study queries.",
        }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const body = await req.json().catch(() => ({}));
    const prompt = typeof body.prompt === "string" ? body.prompt.trim() : "";
    const subject = typeof body.subject === "string" ? body.subject.trim() : "General Engineering";
    const semester = body.semester ? Number(body.semester) : 4;
    const mode = typeof body.mode === "string" ? body.mode : "explain";
    const persona = typeof body.persona === "string" ? body.persona : "encouraging";

    if (!prompt) {
      return new Response(
        JSON.stringify({ error: "Please enter a non-empty academic question or topic." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (prompt.length > MAX_PROMPT_LENGTH) {
      return new Response(
        JSON.stringify({
          error: `Question is too long (${prompt.length} chars). Maximum allowed is ${MAX_PROMPT_LENGTH} characters.`,
        }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const apiKey = Deno.env.get("AI_API_KEY");
    const aiModel = Deno.env.get("AI_MODEL") || "gemini-2.5-flash";

    if (!apiKey) {
      return new Response(
        JSON.stringify({
          configured: false,
          provider: "offline-curated",
          message:
            "Server-side AI provider key (AI_API_KEY) is not configured yet. Using EduPrep's built-in curated syllabus knowledge base.",
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const systemInstruction = [
      `You are EduPrep Study AI, an academic exam-preparation tutor for university students (Subject: ${subject}, Semester: ${semester}).`,
      `Mode: ${mode}. Tutor Persona: ${persona}.`,
      "Focus strictly on syllabus-accurate explanations, step-by-step derivations, exam-ready bullet points, and practice self-tests.",
      "Never fabricate official university notices, marks, or exam dates.",
    ].join(" ");

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(
      aiModel
    )}:generateContent?key=${encodeURIComponent(apiKey)}`;

    const upstreamRes = await fetch(geminiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: systemInstruction }] },
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 1024,
        },
      }),
    });

    if (!upstreamRes.ok) {
      return new Response(
        JSON.stringify({
          configured: true,
          error: `Upstream AI provider returned HTTP ${upstreamRes.status}. Falling back to local syllabus notes.`,
        }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await upstreamRes.json();
    const replyText =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Unable to generate a response for that topic. Please try rephrasing your question.";

    return new Response(
      JSON.stringify({
        configured: true,
        provider: "gemini",
        model: aiModel,
        reply: replyText,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({
        error: "Unexpected server error while processing your study request.",
        detail: err instanceof Error ? err.message : String(err),
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
