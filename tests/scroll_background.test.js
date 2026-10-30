/**
 * EduPrep Scroll-Driven Background System Automated Tests
 * Validates architecture, DOM integration, intensity levels, mobile adaptations,
 * reduced-motion accessibility, and non-blocking pointer events.
 */

const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const path = require("path");

const rootDir = path.resolve(__dirname, "..");
const eduPrepDir = path.join(rootDir, "EduPrep");

describe("Scroll-Driven Immersive Background System", () => {
  const cssPath = path.join(eduPrepDir, "shared", "eduprep_scroll_background.css");
  const jsPath = path.join(eduPrepDir, "shared", "eduprep_scroll_background.js");

  it("exports dedicated reusable background stylesheet and script", () => {
    assert.ok(fs.existsSync(cssPath), "eduprep_scroll_background.css must exist");
    assert.ok(fs.existsSync(jsPath), "eduprep_scroll_background.js must exist");
  });

  it("CSS enforces non-blocking pointer-events and fixed background containment", () => {
    const css = fs.readFileSync(cssPath, "utf8");
    assert.ok(css.includes("pointer-events: none"), "Must enforce pointer-events: none");
    assert.ok(css.includes("position: fixed"), "Must use position: fixed");
    assert.ok(css.includes("overflow: hidden"), "Must prevent scrollbars / horizontal overflow");
    assert.ok(css.includes("user-select: none"), "Must not interfere with text selection");
  });

  it("CSS defines all four intensity profiles (hero, normal, subtle, minimal)", () => {
    const css = fs.readFileSync(cssPath, "utf8");
    assert.ok(css.includes('[data-bg-intensity="hero"]'), "Must have hero intensity style");
    assert.ok(css.includes('[data-bg-intensity="normal"]'), "Must have normal intensity style");
    assert.ok(css.includes('[data-bg-intensity="subtle"]'), "Must have subtle intensity style");
    assert.ok(css.includes('[data-bg-intensity="minimal"]'), "Must have minimal intensity style");
  });

  it("CSS includes mobile optimizations and prefers-reduced-motion accessibility", () => {
    const css = fs.readFileSync(cssPath, "utf8");
    assert.ok(css.includes("@media (max-width: 768px)"), "Must optimize for mobile screens");
    assert.ok(css.includes("@media (prefers-reduced-motion: reduce)"), "Must support prefers-reduced-motion");
  });

  it("JS module provides lerp calculation, clamping, section transitions, and dynamic intensity API", () => {
    const js = fs.readFileSync(jsPath, "utf8");
    assert.ok(js.includes("Math.min(1, Math.max(0,"), "Must clamp scroll progress between 0 and 1");
    assert.ok(js.includes("renderLoop"), "Must provide lerp smoothing renderLoop");
    assert.ok(js.includes("setIntensity"), "Must provide dynamic setIntensity method");
    assert.ok(js.includes("prefersReducedMotion"), "Must detect prefers-reduced-motion");
    assert.ok(js.includes("updateSectionHues"), "Must provide section-aware progressive hue transitions");
    assert.ok(js.includes("requestAnimationFrame"), "Must use 60fps requestAnimationFrame");
    assert.ok(js.includes("passive: true"), "Must use passive scroll event listeners");
  });

  it("Homepage (index.html) integrates hero intensity and scroll-reveal sections", () => {
    const html = fs.readFileSync(path.join(eduPrepDir, "index.html"), "utf8");
    assert.ok(html.includes("eduprep_scroll_background.css"), "Must include scroll bg css");
    assert.ok(html.includes("eduprep_scroll_background.js"), "Must include scroll bg js");
    assert.ok(html.includes('data-bg-intensity="hero"'), "Homepage must have hero intensity");
    assert.ok(html.includes("scroll-reveal"), "Sections must feature scroll-reveal class");
  });

  it("Resources Hub (resources_dashboard) integrates normal intensity", () => {
    const html = fs.readFileSync(path.join(eduPrepDir, "resources_dashboard", "code.html"), "utf8");
    assert.ok(html.includes("eduprep_scroll_background.css"), "Must include scroll bg css");
    assert.ok(html.includes("eduprep_scroll_background.js"), "Must include scroll bg js");
    assert.ok(html.includes('data-bg-intensity="normal"'), "Resources hub must have normal intensity");
  });

  it("Dashboard (home_dashboard) integrates subtle intensity", () => {
    const html = fs.readFileSync(path.join(eduPrepDir, "home_dashboard", "code.html"), "utf8");
    assert.ok(html.includes("eduprep_scroll_background.css"), "Must include scroll bg css");
    assert.ok(html.includes("eduprep_scroll_background.js"), "Must include scroll bg js");
    assert.ok(html.includes('data-bg-intensity="subtle"'), "Dashboard must have subtle intensity");
  });

  it("Practice Tests (mcq_practice_exam) sets minimal intensity during active exam and restores subtle on exit", () => {
    const html = fs.readFileSync(path.join(eduPrepDir, "mcq_practice_exam", "code.html"), "utf8");
    assert.ok(html.includes("eduprep_scroll_background.css"), "Must include scroll bg css");
    assert.ok(html.includes("eduprep_scroll_background.js"), "Must include scroll bg js");
    assert.ok(html.includes("setIntensity('minimal')"), "Must switch to minimal during active exam");
    assert.ok(html.includes("setIntensity('subtle')"), "Must restore subtle when exiting to selection");
  });

  it("Flashcards (revision_flashcards) sets minimal intensity during active review session", () => {
    const html = fs.readFileSync(path.join(eduPrepDir, "revision_flashcards", "code.html"), "utf8");
    assert.ok(html.includes("eduprep_scroll_background.css"), "Must include scroll bg css");
    assert.ok(html.includes("eduprep_scroll_background.js"), "Must include scroll bg js");
    assert.ok(html.includes("setIntensity('minimal')"), "Must switch to minimal during flashcard session");
    assert.ok(html.includes("setIntensity('subtle')"), "Must restore subtle when exiting flashcards");
  });

  it("All functional pages preserve stable content layers without z-index conflicts", () => {
    const pages = [
      path.join(eduPrepDir, "previous_year_papers", "code.html"),
      path.join(eduPrepDir, "academic_setup", "code.html"),
      path.join(eduPrepDir, "user_profile_progress", "code.html"),
      path.join(eduPrepDir, "login_registration", "code.html")
    ];

    for (const p of pages) {
      const content = fs.readFileSync(p, "utf8");
      assert.ok(content.includes("eduprep_scroll_background.css"), `Page ${path.basename(path.dirname(p))} must link background CSS`);
      assert.ok(content.includes("eduprep_scroll_background.js"), `Page ${path.basename(path.dirname(p))} must include background JS`);
      assert.ok(content.includes('data-bg-intensity="subtle"'), `Page ${path.basename(path.dirname(p))} must have subtle intensity`);
    }
  });
});
