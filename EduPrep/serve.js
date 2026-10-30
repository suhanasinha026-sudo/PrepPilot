// ============================================================================
// EduPrep — Local Development Server (EduPrep/serve.js)
// Serves static frontend assets, dynamically injects public VITE_* env vars
// into /shared/env_config.js, and mounts the server-side /api/ai-assistant
// handler so local development matches Vercel deployment.
// ============================================================================
const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = Number(process.env.PORT) || 3000;
const APP_DIR = __dirname;
const ROOT_DIR = path.resolve(__dirname, "..");

// Load .env.local or .env into process.env if present
function loadDotEnv() {
  const candidates = [
    path.join(ROOT_DIR, ".env.local"),
    path.join(ROOT_DIR, ".env"),
    path.join(APP_DIR, ".env.local"),
  ];
  for (const envPath of candidates) {
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, "utf8");
      content.split(/\r?\n/).forEach((line) => {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith("#")) return;
        const eqIdx = trimmed.indexOf("=");
        if (eqIdx === -1) return;
        const key = trimmed.slice(0, eqIdx).trim();
        let val = trimmed.slice(eqIdx + 1).trim();
        if (
          (val.startsWith('"') && val.endsWith('"')) ||
          (val.startsWith("'") && val.endsWith("'"))
        ) {
          val = val.slice(1, -1);
        }
        process.env[key] = val;
      });
    }
  }
}

loadDotEnv();

const aiAssistantHandler = require(path.join(ROOT_DIR, "api", "ai-assistant.js"));
const youtubeSearchHandler = require(path.join(ROOT_DIR, "api", "youtube-search.js"));

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".pdf": "application/pdf",
};

function createServer() {
  return http.createServer((req, res) => {
    loadDotEnv();
    const parsedUrl = new URL(req.url, `http://${req.headers.host || "localhost"}`);
    const pathname = decodeURIComponent(parsedUrl.pathname);

    // 1. Server-side AI Assistant endpoint
    if (pathname === "/api/ai-assistant" || pathname === "/api/ai-assistant.js") {
      let rawBody = "";
      req.on("data", (chunk) => {
        rawBody += chunk;
        if (rawBody.length > 32768) req.destroy();
      });
      req.on("end", () => {
        req.body = rawBody;
        aiAssistantHandler(req, res);
      });
      return;
    }

    // 1b. Server-side YouTube Video Discovery endpoint
    if (pathname === "/api/youtube/search" || pathname === "/api/youtube-search" || pathname === "/api/youtube-search.js") {
      let rawBody = "";
      req.on("data", (chunk) => {
        rawBody += chunk;
        if (rawBody.length > 32768) req.destroy();
      });
      req.on("end", () => {
        req.body = rawBody;
        youtubeSearchHandler(req, res);
      });
      return;
    }

    // 2. Dynamic Public Environment Configuration (NEVER exposes server secrets)
    if (pathname.endsWith("/shared/env_config.js")) {
      const publicConfig = {
        VITE_APP_NAME: process.env.VITE_APP_NAME || "EduPrep",
        VITE_SUPABASE_URL: process.env.VITE_SUPABASE_URL || "",
        VITE_SUPABASE_PUBLISHABLE_KEY: process.env.VITE_SUPABASE_PUBLISHABLE_KEY || "",
        VITE_AI_FUNCTION_URL: process.env.VITE_AI_FUNCTION_URL || "/api/ai-assistant",
      };
      res.writeHead(200, { "Content-Type": "text/javascript; charset=utf-8" });
      res.end(
        `window.__EDUPREP_CONFIG__ = ${JSON.stringify(publicConfig, null, 2)};\n`
      );
      return;
    }

    // 2b. Serve official @supabase/supabase-js UMD bundle directly from node_modules if requested
    if (pathname.endsWith("/shared/vendor/supabase.js") || pathname.endsWith("/shared/supabase.umd.js")) {
      const umdPath = path.join(ROOT_DIR, "node_modules", "@supabase", "supabase-js", "dist", "umd", "supabase.js");
      if (fs.existsSync(umdPath)) {
        res.writeHead(200, { "Content-Type": "text/javascript; charset=utf-8" });
        fs.createReadStream(umdPath).pipe(res);
        return;
      }
    }

    // 3. Resolve static file path (supports both /EduPrep/... and direct /... paths)
    let relPath = pathname.replace(/^\/+/, "");
    if (relPath.startsWith("EduPrep/")) {
      relPath = relPath.slice("EduPrep/".length);
    }
    if (relPath.startsWith("splash_screen")) {
      res.writeHead(302, { Location: "/" });
      res.end();
      return;
    }
    if (relPath.startsWith("onboarding_flow") || relPath.startsWith("academic_setup_updated_flow")) {
      res.writeHead(302, { Location: "/home_dashboard/code.html" });
      res.end();
      return;
    }
    if (relPath.startsWith("questions_practice")) {
      const targetQuery = parsedUrl.search || "";
      res.writeHead(302, { Location: `/mcq_practice_exam/code.html${targetQuery}` });
      res.end();
      return;
    }
    if (relPath.startsWith("subject_details") || relPath.startsWith("subject_details_os")) {
      const targetQuery = parsedUrl.search || "";
      res.writeHead(302, { Location: `/resources_dashboard/code.html${targetQuery}` });
      res.end();
      return;
    }
    if (relPath.startsWith("study_ai_assistant")) {
      const qParams = new URLSearchParams(parsedUrl.search || "");
      qParams.set("openAi", "true");
      res.writeHead(302, { Location: `/home_dashboard/code.html?${qParams.toString()}` });
      res.end();
      return;
    }

    // Clean route aliases (e.g. /login, /register, /dashboard, etc.)
    const cleanRouteMap = {
      "login": "login_registration/code.html",
      "signin": "login_registration/code.html",
      "register": "login_registration/code.html",
      "signup": "login_registration/code.html",
      "forgot-password": "login_registration/code.html",
      "reset-password": "login_registration/code.html",
      "update-password": "login_registration/code.html",
      "new-password": "login_registration/code.html",
      "dashboard": "home_dashboard/code.html",
      "subjects": "resources_dashboard/code.html",
      "curriculum": "resources_dashboard/code.html",
      "subject-details": "resources_dashboard/code.html",
      "subject_details": "resources_dashboard/code.html",
      "subject_details/code.html": "resources_dashboard/code.html",
      "subject_details_os": "resources_dashboard/code.html",
      "subject_details_os/code.html": "resources_dashboard/code.html",
      "question-papers": "previous_year_papers/code.html",
      "papers": "previous_year_papers/code.html",
      "pyqs": "previous_year_papers/code.html",
      "practice": "mcq_practice_exam/code.html",
      "mcq": "mcq_practice_exam/code.html",
      "mock-tests": "mcq_practice_exam/code.html",
      "questions-practice": "mcq_practice_exam/code.html",
      "questions_practice": "mcq_practice_exam/code.html",
      "questions_practice/code.html": "mcq_practice_exam/code.html",
      "flashcards": "revision_flashcards/code.html",
      "study-planner": "academic_setup/code.html",
      "planner": "academic_setup/code.html",
      "progress": "user_profile_progress/code.html",
      "profile": "user_profile_progress/code.html",
      "academic-setup": "home_dashboard/code.html",
      "resources": "resources_dashboard/code.html",
      "study-ai": "home_dashboard/code.html?openAi=true",
      "ai-tutor": "home_dashboard/code.html?openAi=true",
      "study_ai_assistant": "home_dashboard/code.html?openAi=true",
      "study_ai_assistant/code.html": "home_dashboard/code.html?openAi=true",
      "opportunities": "student_opportunities/code.html",
      "colleges": "affiliated_college_selection/code.html",
      "admin": "admin_panel/code.html"
    };

    if (cleanRouteMap[relPath]) {
      relPath = cleanRouteMap[relPath];
    }

    if (!relPath || relPath === "") {
      relPath = "index.html";
    }

    let filePath = path.join(APP_DIR, relPath);
    if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
      const codeHtml = path.join(filePath, "code.html");
      const indexHtml = path.join(filePath, "index.html");
      if (fs.existsSync(codeHtml)) filePath = codeHtml;
      else if (fs.existsSync(indexHtml)) filePath = indexHtml;
    }

    const extname = String(path.extname(filePath)).toLowerCase();
    const contentType = mimeTypes[extname] || "application/octet-stream";

    fs.readFile(filePath, (error, content) => {
      if (error) {
        const notFoundPage = path.join(APP_DIR, "404.html");
        if (fs.existsSync(notFoundPage)) {
          const html404 = fs.readFileSync(notFoundPage);
          res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
          res.end(html404);
        } else {
          res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
          res.end("404 Not Found");
        }
      } else {
        res.writeHead(200, { "Content-Type": contentType });
        res.end(content);
      }
    });
  });
}

if (require.main === module) {
  const server = createServer();
  server.on("error", (err) => {
    if (err.code === "EADDRINUSE") {
      console.error(`Port ${PORT} is already in use. Please free port ${PORT} or specify a different PORT.`);
    } else {
      console.error("Server error:", err);
    }
    process.exit(1);
  });
  server.listen(PORT, () => {
    console.log(`EduPrep local server running at http://localhost:${PORT}/`);
  });
}

module.exports = { createServer };
