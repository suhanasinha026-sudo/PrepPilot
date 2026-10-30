// ============================================================================
// EduPrep — Official Supabase Client & Centralized Auth Manager
// File: EduPrep/shared/supabase_client.js
// Integrates official @supabase/supabase-js for Email & Password Auth,
// session persistence, auth state listeners, password recovery, and RLS queries.
// NEVER exposes service-role keys or silently falls back to fake credentials.
// ============================================================================

(function (root) {
  let cachedClient = null;

  function getEnvConfig() {
    let cfg = (root && root.__EDUPREP_CONFIG__) || {};
    let storedOverride = {};
    try {
      if (typeof localStorage !== "undefined") {
        const raw = localStorage.getItem("eduprep_runtime_env");
        if (raw) storedOverride = JSON.parse(raw);
      }
    } catch (_) {}

    // In Node.js environment, fall back to process.env if available
    const nodeEnv = typeof process !== "undefined" && process.env ? process.env : {};

    const url = (
      storedOverride.VITE_SUPABASE_URL ||
      cfg.VITE_SUPABASE_URL ||
      nodeEnv.VITE_SUPABASE_URL ||
      ""
    ).trim();

    const key = (
      storedOverride.VITE_SUPABASE_PUBLISHABLE_KEY ||
      cfg.VITE_SUPABASE_PUBLISHABLE_KEY ||
      nodeEnv.VITE_SUPABASE_PUBLISHABLE_KEY ||
      ""
    ).trim();

    const aiUrl = (
      storedOverride.VITE_AI_FUNCTION_URL ||
      cfg.VITE_AI_FUNCTION_URL ||
      nodeEnv.VITE_AI_FUNCTION_URL ||
      "/api/ai-assistant"
    ).trim();

    const isPlaceholderUrl = !url || url.includes("your-project-ref.supabase.co");
    const isPlaceholderKey =
      !key ||
      key.includes("your-supabase-anon") ||
      key.includes("your-supabase-publishable") ||
      key.includes("your-supabase-anon-or-publishable-key");

    const isConfigured = Boolean(url && key && !isPlaceholderUrl && !isPlaceholderKey);

    return {
      appName: cfg.VITE_APP_NAME || nodeEnv.VITE_APP_NAME || "EduPrep",
      supabaseUrl: url.replace(/\/+$/, ""),
      supabaseKey: key,
      aiFunctionUrl: aiUrl,
      isConfigured,
      missingConfigReason: !url
        ? "VITE_SUPABASE_URL is missing."
        : isPlaceholderUrl
        ? "VITE_SUPABASE_URL is currently set to placeholder."
        : !key
        ? "VITE_SUPABASE_PUBLISHABLE_KEY is missing."
        : isPlaceholderKey
        ? "VITE_SUPABASE_PUBLISHABLE_KEY is currently set to placeholder."
        : null,
    };
  }

  // Obtains or initializes the official @supabase/supabase-js client instance
  function getClient() {
    if (cachedClient) return cachedClient;

    const env = getEnvConfig();
    if (!env.isConfigured) {
      return null;
    }

    let createClientFn = null;

    // 1. Check browser global (loaded via vendor bundle or CDN)
    if (root && root.supabase && typeof root.supabase.createClient === "function") {
      createClientFn = root.supabase.createClient;
    } else if (typeof window !== "undefined" && window.supabase && typeof window.supabase.createClient === "function") {
      createClientFn = window.supabase.createClient;
    }

    // 2. Check Node.js require
    if (!createClientFn && typeof require !== "undefined") {
      try {
        const pkg = require("@supabase/supabase-js");
        createClientFn = pkg.createClient || (pkg.default && pkg.default.createClient);
      } catch (_) {}
    }

    if (createClientFn) {
      cachedClient = createClientFn(env.supabaseUrl, env.supabaseKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
          storageKey: "eduprep_auth_token",
        },
      });
      return cachedClient;
    }

    return null;
  }

  // Formats human-friendly error messages from Supabase Auth responses
  function formatAuthError(err) {
    if (!err) return null;
    const msg = String(err.message || err.error_description || err.msg || "Authentication failed.");
    const lower = msg.toLowerCase();

    if (lower.includes("invalid login credentials") || lower.includes("invalid credentials")) {
      return { message: "Invalid email or password. Please verify your credentials and try again.", code: err.code || "INVALID_CREDENTIALS" };
    }
    if (lower.includes("email not confirmed")) {
      return {
        message: "Your email address has not been confirmed yet. Please check your inbox for the verification link.",
        code: "EMAIL_NOT_CONFIRMED",
        requiresConfirmation: true,
      };
    }
    if (lower.includes("user already registered") || lower.includes("already registered")) {
      return { message: "An account is already registered with this email address. Please sign in instead.", code: "USER_ALREADY_EXISTS" };
    }
    if (lower.includes("password should be at least")) {
      return { message: "Password must be at least 8 characters long.", code: "WEAK_PASSWORD" };
    }
    if (lower.includes("over_email_send_rate_limit") || lower.includes("rate limit")) {
      return { message: "Too many requests. Please wait a minute before requesting another email.", code: "RATE_LIMITED" };
    }
    return { message: msg, code: err.code || "AUTH_ERROR" };
  }

  // --- Supabase Authentication Methods ---

  async function signUp(email, password, fullName) {
    const env = getEnvConfig();
    if (!env.isConfigured) {
      return {
        data: null,
        error: {
          message:
            "Supabase backend is not configured in .env.local (" +
            (env.missingConfigReason || "Missing credentials") +
            "). Please provide VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY.",
          code: "SUPABASE_NOT_CONFIGURED",
        },
      };
    }

    const client = getClient();
    if (client) {
      try {
        const normalizedEmail = String(email || "").trim().toLowerCase();
        const { data, error } = await client.auth.signUp({
          email: normalizedEmail,
          password: String(password || ""),
          options: {
            data: {
              full_name: String(fullName || "").trim(),
            },
          },
        });

        if (error) {
          return { data: null, error: formatAuthError(error) };
        }

        // If a session was immediately established, sync with public.profiles if trigger didn't run
        if (data && data.user && data.session) {
          try {
            await client.from("profiles").upsert({
              user_id: data.user.id,
              full_name: fullName || normalizedEmail.split("@")[0],
              email: normalizedEmail,
              updated_at: new Date().toISOString(),
            }, { onConflict: "user_id" });
          } catch (_) {}
        }

        return { data, error: null };
      } catch (err) {
        return { data: null, error: { message: err.message || "Network error during sign-up." } };
      }
    }

    // Direct REST fallback if official client library script is still loading
    try {
      const res = await fetch(`${env.supabaseUrl}/auth/v1/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: env.supabaseKey,
        },
        body: JSON.stringify({
          email: String(email || "").trim().toLowerCase(),
          password,
          data: { full_name: fullName },
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        return { data: null, error: formatAuthError(json) };
      }
      return { data: json, error: null };
    } catch (err) {
      return { data: null, error: { message: err.message || "Network connection failed." } };
    }
  }

  async function signInWithPassword(email, password) {
    const env = getEnvConfig();
    if (!env.isConfigured) {
      return {
        data: null,
        error: {
          message:
            "Supabase backend is not configured in .env.local (" +
            (env.missingConfigReason || "Missing credentials") +
            "). Please configure VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY.",
          code: "SUPABASE_NOT_CONFIGURED",
        },
      };
    }

    const client = getClient();
    if (client) {
      try {
        const normalizedEmail = String(email || "").trim().toLowerCase();
        const { data, error } = await client.auth.signInWithPassword({
          email: normalizedEmail,
          password: String(password || ""),
        });

        if (error) {
          return { data: null, error: formatAuthError(error) };
        }
        return { data, error: null };
      } catch (err) {
        return { data: null, error: { message: err.message || "Network error during sign-in." } };
      }
    }

    // Direct REST fallback
    try {
      const res = await fetch(`${env.supabaseUrl}/auth/v1/token?grant_type=password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: env.supabaseKey,
        },
        body: JSON.stringify({
          email: String(email || "").trim().toLowerCase(),
          password,
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        return { data: null, error: formatAuthError(json) };
      }
      return { data: json, error: null };
    } catch (err) {
      return { data: null, error: { message: err.message || "Network error during sign-in." } };
    }
  }

  async function signOut() {
    const client = getClient();
    if (client) {
      try {
        const { error } = await client.auth.signOut();
        return { error: error ? formatAuthError(error) : null };
      } catch (err) {
        return { error: { message: err.message } };
      }
    }

    // Direct REST fallback
    const env = getEnvConfig();
    const session = getSessionSync();
    if (env.isConfigured && session && session.access_token) {
      try {
        await fetch(`${env.supabaseUrl}/auth/v1/logout`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: env.supabaseKey,
            Authorization: `Bearer ${session.access_token}`,
          },
        });
      } catch (_) {}
    }
    return { error: null };
  }

  async function resetPasswordForEmail(email, options = {}) {
    const env = getEnvConfig();
    if (!env.isConfigured) {
      return {
        data: null,
        error: {
          message:
            "Password recovery requires active Supabase configuration (" +
            (env.missingConfigReason || "Missing credentials") +
            ").",
          code: "SUPABASE_NOT_CONFIGURED",
        },
      };
    }

    const defaultRedirect =
      typeof window !== "undefined" && window.location
        ? `${window.location.origin}/update-password`
        : "";

    const redirectTo = (options && options.redirectTo) || defaultRedirect;

    const client = getClient();
    if (client) {
      try {
        const normalizedEmail = String(email || "").trim().toLowerCase();
        const { data, error } = await client.auth.resetPasswordForEmail(normalizedEmail, {
          redirectTo: redirectTo || undefined,
        });
        if (error) {
          return { data: null, error: formatAuthError(error) };
        }
        return { data: data || { sent: true }, error: null };
      } catch (err) {
        return { data: null, error: { message: err.message || "Unable to send recovery email." } };
      }
    }

    // Direct REST fallback
    try {
      const payload = { email: String(email || "").trim().toLowerCase() };
      const qs = redirectTo ? `?redirect_to=${encodeURIComponent(redirectTo)}` : "";
      const res = await fetch(`${env.supabaseUrl}/auth/v1/recover${qs}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: env.supabaseKey,
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        return { data: null, error: formatAuthError(json) };
      }
      return { data: { sent: true }, error: null };
    } catch (err) {
      return { data: null, error: { message: err.message } };
    }
  }

  async function updatePassword(newPassword) {
    const env = getEnvConfig();
    if (!env.isConfigured) {
      return {
        data: null,
        error: {
          message: "Supabase credentials are not configured in .env.local.",
          code: "SUPABASE_NOT_CONFIGURED",
        },
      };
    }

    const client = getClient();
    if (client) {
      try {
        const { data, error } = await client.auth.updateUser({
          password: String(newPassword || ""),
        });
        if (error) {
          return { data: null, error: formatAuthError(error) };
        }
        return { data, error: null };
      } catch (err) {
        return { data: null, error: { message: err.message } };
      }
    }

    // Direct REST fallback
    const session = getSessionSync();
    if (!session || !session.access_token) {
      return {
        data: null,
        error: { message: "No active recovery session found. Please request a new password recovery link.", code: "NO_SESSION" },
      };
    }

    try {
      const res = await fetch(`${env.supabaseUrl}/auth/v1/user`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          apikey: env.supabaseKey,
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ password: newPassword }),
      });
      const json = await res.json();
      if (!res.ok) {
        return { data: null, error: formatAuthError(json) };
      }
      return { data: json, error: null };
    } catch (err) {
      return { data: null, error: { message: err.message } };
    }
  }

  async function getSession() {
    const client = getClient();
    if (client) {
      try {
        const { data, error } = await client.auth.getSession();
        if (error) return { session: null, error };
        return { session: data ? data.session : null, error: null };
      } catch (err) {
        return { session: null, error: err };
      }
    }
    return { session: getSessionSync(), error: null };
  }

  function getSessionSync() {
    try {
      if (typeof localStorage === "undefined") return null;
      // 1. Try official supabase token storage
      const env = getEnvConfig();
      const keysToCheck = [
        "eduprep_auth_token",
        `sb-${env.supabaseUrl ? new URL(env.supabaseUrl).hostname.split(".")[0] : "local"}-auth-token`,
        "eduprep_supabase_session_v1",
      ];
      for (const k of keysToCheck) {
        const raw = localStorage.getItem(k);
        if (raw) {
          const parsed = JSON.parse(raw);
          const sess = parsed && parsed.access_token ? parsed : parsed && parsed.session ? parsed.session : null;
          if (sess && sess.access_token) {
            if (sess.expires_at && Date.now() / 1000 > sess.expires_at) {
              localStorage.removeItem(k);
              continue;
            }
            return sess;
          }
        }
      }
      return null;
    } catch (_) {
      return null;
    }
  }

  async function getUser() {
    const client = getClient();
    if (client) {
      try {
        const { data, error } = await client.auth.getUser();
        if (error) return { user: null, error };
        return { user: data ? data.user : null, error: null };
      } catch (err) {
        return { user: null, error: err };
      }
    }
    const session = getSessionSync();
    return { user: session ? session.user : null, error: null };
  }

  function onAuthStateChange(callback) {
    const client = getClient();
    if (client) {
      return client.auth.onAuthStateChange(callback);
    }
    // Return dummy unsubscriber if client is not configured
    return {
      data: {
        subscription: {
          unsubscribe: () => {},
        },
      },
    };
  }

  // --- Student Profiles (public.profiles) Helper Methods ---
  async function getProfile(userId) {
    const client = getClient();
    if (client) {
      try {
        const { data, error } = await client
          .from("profiles")
          .select("*")
          .eq("user_id", userId)
          .single();
        return { data, error };
      } catch (err) {
        return { data: null, error: err };
      }
    }
    return { data: null, error: { message: "Supabase client not initialized." } };
  }

  async function upsertProfile(profilePayload) {
    const client = getClient();
    if (client) {
      try {
        const { data, error } = await client
          .from("profiles")
          .upsert(
            Object.assign({}, profilePayload, { updated_at: new Date().toISOString() }),
            { onConflict: "user_id" }
          )
          .select()
          .single();
        return { data, error };
      } catch (err) {
        return { data: null, error: err };
      }
    }
    return { data: null, error: { message: "Supabase client not initialized." } };
  }

  // --- PostgREST Table & RPC Backward Compatibility Helpers ---
  function buildHeaders(extraHeaders = {}) {
    const env = getEnvConfig();
    const session = getSessionSync();
    const token = session && session.access_token ? session.access_token : env.supabaseKey;
    return Object.assign(
      {
        "Content-Type": "application/json",
        apikey: env.supabaseKey,
        Authorization: `Bearer ${token}`,
      },
      extraHeaders
    );
  }

  async function selectFromTable(table, queryString = "") {
    const env = getEnvConfig();
    if (!env.isConfigured) return { data: null, error: { code: "SUPABASE_NOT_CONFIGURED" } };
    try {
      const qs = queryString ? `?${queryString.replace(/^\?/, "")}` : "";
      const res = await fetch(`${env.supabaseUrl}/rest/v1/${table}${qs}`, {
        method: "GET",
        headers: buildHeaders(),
      });
      const data = await res.json();
      if (!res.ok) return { data: null, error: data };
      return { data, error: null };
    } catch (err) {
      return { data: null, error: { message: err.message } };
    }
  }

  async function upsertIntoTable(table, payload, onConflict = "") {
    const env = getEnvConfig();
    if (!env.isConfigured) return { data: null, error: { code: "SUPABASE_NOT_CONFIGURED" } };
    try {
      const qs = onConflict ? `?on_conflict=${encodeURIComponent(onConflict)}` : "";
      const res = await fetch(`${env.supabaseUrl}/rest/v1/${table}${qs}`, {
        method: "POST",
        headers: buildHeaders({
          Prefer: "resolution=merge-duplicates,return=representation",
        }),
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) return { data: null, error: data };
      return { data, error: null };
    } catch (err) {
      return { data: null, error: { message: err.message } };
    }
  }

  async function deleteFromTable(table, filterQuery) {
    const env = getEnvConfig();
    if (!env.isConfigured) return { data: null, error: { code: "SUPABASE_NOT_CONFIGURED" } };
    try {
      const res = await fetch(`${env.supabaseUrl}/rest/v1/${table}?${filterQuery}`, {
        method: "DELETE",
        headers: buildHeaders(),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        return { data: null, error: err };
      }
      return { data: true, error: null };
    } catch (err) {
      return { data: null, error: { message: err.message } };
    }
  }

  async function callRpc(fnName, args = {}) {
    const env = getEnvConfig();
    if (!env.isConfigured) return { data: null, error: { code: "SUPABASE_NOT_CONFIGURED" } };
    try {
      const res = await fetch(`${env.supabaseUrl}/rest/v1/rpc/${fnName}`, {
        method: "POST",
        headers: buildHeaders(),
        body: JSON.stringify(args),
      });
      const data = await res.json();
      if (!res.ok) return { data: null, error: data };
      return { data, error: null };
    } catch (err) {
      return { data: null, error: { message: err.message } };
    }
  }

  async function createSignedStorageUrl(bucket, storagePath, expiresInSeconds = 3600) {
    const env = getEnvConfig();
    if (!env.isConfigured || !storagePath) {
      return { data: null, error: { code: "STORAGE_UNAVAILABLE" } };
    }
    try {
      const cleanPath = storagePath.replace(/^\/+/, "");
      const res = await fetch(
        `${env.supabaseUrl}/storage/v1/object/sign/${bucket}/${cleanPath}`,
        {
          method: "POST",
          headers: buildHeaders(),
          body: JSON.stringify({ expiresIn: expiresInSeconds }),
        }
      );
      const data = await res.json();
      if (!res.ok || !data.signedURL) {
        return { data: null, error: data };
      }
      return {
        data: { signedUrl: `${env.supabaseUrl}/storage/v1${data.signedURL}` },
        error: null,
      };
    } catch (err) {
      return { data: null, error: { message: err.message } };
    }
  }

  const EduPrepSupabase = {
    getEnvConfig,
    isConfigured: () => getEnvConfig().isConfigured,
    getClient,
    getSession,
    getSessionSync,
    getUser,
    auth: {
      signUp,
      signIn: signInWithPassword,
      signInWithPassword,
      signOut,
      resetPasswordForEmail,
      updatePassword,
      getSession,
      getUser,
      onAuthStateChange,
    },
    profiles: {
      get: getProfile,
      upsert: upsertProfile,
    },
    db: {
      select: selectFromTable,
      upsert: upsertIntoTable,
      delete: deleteFromTable,
      rpc: callRpc,
    },
    storage: {
      createSignedUrl: createSignedStorageUrl,
    },
  };

  root.EduPrepSupabase = EduPrepSupabase;
  if (typeof module !== "undefined" && module.exports) {
    module.exports = EduPrepSupabase;
  }
})(typeof window !== "undefined" ? window : globalThis);
