/**
 * EduPrep Build & Static Integrity Verification Script
 * Run via: npm run build
 */

const fs = require("fs");
const path = require("path");
const vm = require("vm");

const rootDir = path.join(__dirname, "..");
const eduPrepDir = path.join(rootDir, "EduPrep");

const REQUIRED_SCREENS = [
  "login_registration",
  "academic_setup",
  "academic_setup_updated_flow",
  "affiliated_college_selection",
  "ai_tutor_personality_setup",
  "home_dashboard",
  "subject_details_os",
  "resources_dashboard",
  "questions_practice",
  "previous_year_papers",
  "revision_flashcards",
  "mcq_practice_exam",
  "study_ai_assistant",
  "student_opportunities",
  "user_profile_progress",
  "admin_panel"
];

const REMOVED_PROTOTYPE_SCREENS = [
  "splash_screen",
  "onboarding_flow"
];

const JS_FILES_TO_CHECK = [
  "EduPrep/shared/env_config.js",
  "EduPrep/shared/supabase_client.js",
  "EduPrep/shared/eduprep_services.js",
  "EduPrep/shared/eduprep_data.js",
  "EduPrep/shared/eduvantage_data.js",
  "EduPrep/serve.js",
  "api/ai-assistant.js"
];

const SQL_FILES_TO_CHECK = [
  "supabase/migrations/20261011000001_initial_schema.sql",
  "supabase/migrations/20261011000002_rls_and_storage.sql",
  "supabase/migrations/20261011000003_auth_profiles_and_recovery.sql",
  "supabase/seed.sql"
];

function main() {
  console.log("=== EduPrep Build & Verification ===");

  // 1. Check required HTML screens
  for (const screen of REQUIRED_SCREENS) {
    const p = path.join(eduPrepDir, screen, "code.html");
    if (!fs.existsSync(p)) {
      throw new Error(`Missing required screen: EduPrep/${screen}/code.html`);
    }
    const html = fs.readFileSync(p, "utf8");
    if (!html.includes("<!DOCTYPE html>") || !html.includes("EduPrep")) {
      throw new Error(`Invalid HTML or missing EduPrep branding in: EduPrep/${screen}/code.html`);
    }
  }
  console.log(`[OK] Verified all ${REQUIRED_SCREENS.length} real application pages + EduPrep branding.`);

  // 1b. Verify prototype-only screens are removed
  for (const removed of REMOVED_PROTOTYPE_SCREENS) {
    if (fs.existsSync(path.join(eduPrepDir, removed))) {
      throw new Error(`Prototype screen directory should be removed: EduPrep/${removed}`);
    }
  }
  console.log("[OK] Verified removal of splash_screen and onboarding_flow mockup screens.");

  // 2. Check homepage & 404 pages and verify zero prototype viewer UI
  for (const rel of ["index.html", "EduPrep/index.html", "EduPrep/404.html"]) {
    const full = path.join(rootDir, rel);
    if (!fs.existsSync(full)) {
      throw new Error(`Missing homepage/error page: ${rel}`);
    }
  }
  const homeHtml = fs.readFileSync(path.join(rootDir, "EduPrep/index.html"), "utf8");
  const forbiddenPrototypeTokens = [
    "Filter 18 application screens",
    "Jump to Home Dashboard",
    "Screen 1 / 18",
    "setViewport(",
    "id=\"appFrame\"",
    "jumpToScreenById"
  ];
  for (const token of forbiddenPrototypeTokens) {
    if (homeHtml.includes(token)) {
      throw new Error(`Forbidden prototype UI token still present in EduPrep/index.html: ${token}`);
    }
  }
  console.log("[OK] Verified root index.html, EduPrep/index.html (real public homepage, zero prototype UI), and EduPrep/404.html.");

  // 3. Syntax check JS files
  for (const rel of JS_FILES_TO_CHECK) {
    const full = path.join(rootDir, rel);
    if (!fs.existsSync(full)) {
      throw new Error(`Missing JS file: ${rel}`);
    }
    const code = fs.readFileSync(full, "utf8");
    new vm.Script(code, { filename: rel });
  }
  console.log(`[OK] Verified JavaScript syntax across ${JS_FILES_TO_CHECK.length} core modules.`);

  // 4. Verify SQL migrations & seed
  for (const rel of SQL_FILES_TO_CHECK) {
    const full = path.join(rootDir, rel);
    if (!fs.existsSync(full) || fs.statSync(full).size < 100) {
      throw new Error(`Missing or empty SQL file: ${rel}`);
    }
  }
  console.log(`[OK] Verified ${SQL_FILES_TO_CHECK.length} Supabase SQL migration & seed files.`);

  console.log("=== Build & Integrity Check Passed Successfully ===");
}

main();
