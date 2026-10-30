// ============================================================================
// EduPrep — Public Runtime Environment Configuration (env_config.js)
// Populated from VITE_* public environment variables during build/dev serve.
// NEVER place service-role keys or AI_API_KEY in this file.
// ============================================================================
(function (root) {
  root.__EDUPREP_CONFIG__ = Object.assign(
    {
      VITE_APP_NAME: "EduPrep",
      VITE_SUPABASE_URL: "",
      VITE_SUPABASE_PUBLISHABLE_KEY: "",
      VITE_AI_FUNCTION_URL: "/api/ai-assistant",
    },
    root.__EDUPREP_CONFIG__ || {}
  );
})(typeof window !== "undefined" ? window : globalThis);
