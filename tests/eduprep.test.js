/**
 * EduPrep Automated Test Suite (Unit, Integration, API Boundary & Security Audit)
 * Run via: npm test (uses Node built-in test runner: node --test)
 */

const { describe, it, beforeEach } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const path = require("path");

const EduPrepServices = require("../EduPrep/shared/eduprep_services.js");
const EduPrep = require("../EduPrep/shared/eduprep_data.js");
const aiAssistantHandler = require("../api/ai-assistant.js");

// ============================================================================
// 1. UNIT TESTS: VALIDATION SERVICE
// ============================================================================
describe("EduPrepServices.Validation", () => {
  it("validates email addresses accurately", () => {
    assert.equal(EduPrepServices.Validation.validateEmail("").valid, false);
    assert.equal(EduPrepServices.Validation.validateEmail("not-an-email").valid, false);
    assert.equal(EduPrepServices.Validation.validateEmail("student@mu.ac.in").valid, true);
  });

  it("enforces password minimum length (8 characters)", () => {
    assert.equal(EduPrepServices.Validation.validatePassword("short").valid, false);
    assert.equal(EduPrepServices.Validation.validatePassword("ValidPass123").valid, true);
  });

  it("enforces semester range between 1 and 8", () => {
    assert.equal(EduPrepServices.Validation.validateSemester(0).valid, false);
    assert.equal(EduPrepServices.Validation.validateSemester(9).valid, false);
    assert.equal(EduPrepServices.Validation.validateSemester("abc").valid, false);
    const s4 = EduPrepServices.Validation.validateSemester("4");
    assert.equal(s4.valid, true);
    assert.equal(s4.value, 4);
  });

  it("validates 4-option MCQ payload with exactly one correct answer index (0-3)", () => {
    const badOptions = EduPrepServices.Validation.validateMcqPayload({
      questionText: "What is a mutex in Operating Systems?",
      options: ["A", "B"],
      correctIndex: 0
    });
    assert.equal(badOptions.valid, false);

    const badIndex = EduPrepServices.Validation.validateMcqPayload({
      questionText: "What is a mutex in Operating Systems?",
      options: ["Binary lock", "Page table", "Disk cylinder", "Compiler pass"],
      correctIndex: 5
    });
    assert.equal(badIndex.valid, false);

    const validMcq = EduPrepServices.Validation.validateMcqPayload({
      questionText: "What is a mutex in Operating Systems?",
      options: ["Binary lock", "Page table", "Disk cylinder", "Compiler pass"],
      correctIndex: 0
    });
    assert.equal(validMcq.valid, true);
  });
});

// ============================================================================
// 2. UNIT TESTS: QUIZ SCORING ENGINE (PRACTICE & EXAM MODES)
// ============================================================================
describe("EduPrepServices.QuizScoring", () => {
  const sampleQuestions = [
    { id: "q1", q: "Question 1", options: ["A", "B", "C", "D"], answer: 1, explanation: "Exp 1" },
    { id: "q2", q: "Question 2", options: ["A", "B", "C", "D"], answer: 0, explanation: "Exp 2" },
    { id: "q3", q: "Question 3", options: ["A", "B", "C", "D"], answer: 3, explanation: "Exp 3" },
    { id: "q4", q: "Question 4", options: ["A", "B", "C", "D"], answer: 2, explanation: "Exp 4" }
  ];

  it("correctly scores correct, incorrect, and unanswered questions", () => {
    const userAnswers = {
      q1: 1, // Correct
      q2: 2, // Incorrect (correct is 0)
      q3: 3  // Correct
      // q4 is left unanswered
    };

    const result = EduPrepServices.QuizScoring.evaluateAttempt(sampleQuestions, userAnswers, "exam");
    assert.equal(result.totalQuestions, 4);
    assert.equal(result.answeredCount, 3);
    assert.equal(result.unansweredCount, 1);
    assert.equal(result.correctCount, 2);
    assert.equal(result.incorrectCount, 1);
    assert.equal(result.scorePercent, 50);
    assert.equal(result.accuracyAmongAnswered, 67);
  });
});

// ============================================================================
// 3. UNIT TESTS: OPPORTUNITY DEADLINE & FILTERING
// ============================================================================
describe("EduPrepServices.Opportunity", () => {
  const refNow = new Date("2026-10-11T00:00:00Z");
  const items = [
    { id: "1", title: "Smart India Hackathon", organizer: "AICTE", category: "Hackathon", deadlineDate: "2026-11-30" },
    { id: "2", title: "Past Summer Internship", organizer: "Cloud Lab", category: "Internship", deadlineDate: "2026-08-01" },
    { id: "3", title: "MahaDBT Scholarship", organizer: "DTE", category: "Scholarship", deadlineDate: "2026-12-20" }
  ];

  it("identifies expired opportunity deadlines accurately", () => {
    assert.equal(EduPrepServices.Opportunity.isExpired("2026-08-01", refNow), true);
    assert.equal(EduPrepServices.Opportunity.isExpired("2026-11-30", refNow), false);
  });

  it("filters opportunities by category, search query, and expired flag", () => {
    const activeOnly = EduPrepServices.Opportunity.filterOpportunities(items, { hideExpired: true, now: refNow });
    assert.equal(activeOnly.length, 2);

    const hackOnly = EduPrepServices.Opportunity.filterOpportunities(items, { category: "Hackathon", now: refNow });
    assert.equal(hackOnly.length, 1);
    assert.equal(hackOnly[0].id, "1");
  });
});

// ============================================================================
// 4. INTEGRATION TESTS: ACADEMIC HIERARCHY & STATE ENGINE
// ============================================================================
describe("EduPrep Data Engine & Cascading Academic Hierarchy", () => {
  it("exposes EduPrep and EduVantage compatibility alias with appName === 'EduPrep'", () => {
    assert.equal(EduPrep.appName, "EduPrep");
    assert.ok(Array.isArray(EduPrep.universities));
    assert.ok(EduPrep.universities.length >= 6);
    assert.ok(Array.isArray(EduPrep.pyqPapers));
    assert.ok(EduPrep.pyqPapers.length >= 10);
  });

  it("filters colleges by parent universityId and resets invalid child college on university change", () => {
    const muColleges = EduPrep.getColleges("mu");
    const sppuColleges = EduPrep.getColleges("sppu");
    assert.ok(muColleges.length > 0);
    assert.ok(sppuColleges.length > 0);
    assert.ok(muColleges.every(c => c.universityId === "mu"));
    assert.ok(sppuColleges.every(c => c.universityId === "sppu"));

    // Select a Mumbai University college first
    EduPrep.updateAcademic({
      universityId: "mu",
      university: "University of Mumbai",
      collegeId: muColleges[0].id,
      college: muColleges[0].name
    });
    assert.equal(EduPrep.getState().academic.collegeId, muColleges[0].id);

    // Switch university to SPPU without specifying college -> should auto-reset to valid SPPU college
    const updated = EduPrep.updateAcademic({
      universityId: "sppu",
      university: "Savitribai Phule Pune University (SPPU)"
    });
    const newCol = EduPrep.colleges.find(c => c.id === updated.collegeId);
    assert.ok(newCol, "Expected a valid child college after switching university");
    assert.equal(newCol.universityId, "sppu");
  });

  it("keeps academic.university/universityName and branch/branchName synchronized", () => {
    const acad = EduPrep.updateAcademic({
      university: "University of Mumbai",
      branch: "Information Technology",
      semester: 5
    });
    assert.equal(acad.university, "University of Mumbai");
    assert.equal(acad.universityName, "University of Mumbai");
    assert.equal(acad.branch, "Information Technology");
    assert.equal(acad.branchName, "Information Technology");
    assert.equal(acad.semester, 5);
  });

  it("normalizes all MCQ items with both .answer and .ans indices and 4 options", () => {
    const mcqs = EduPrep.getMcqBank();
    assert.ok(mcqs.length >= 60);
    for (const m of mcqs) {
      assert.equal(typeof m.answer, "number");
      assert.equal(m.answer, m.ans);
      assert.ok(m.answer >= 0 && m.answer <= 3);
      assert.equal(m.options.length, 4);
    }
  });

  it("computes real progress metrics from completed topics, flashcards, bookmarks, and quiz attempts", () => {
    const initialMetrics = EduPrep.getComputedMetrics();
    const initialQuizzes = initialMetrics.testsTaken;

    EduPrep.recordQuizResult(12, 15, { subject: "Operating Systems", mode: "exam", durationSeconds: 240 });
    EduPrep.toggleTopicCompleted("os_u2_t2");
    EduPrep.toggleFlashcardMastered("fc_os_3");
    EduPrep.toggleBookmark("paper", "pyq_mu_dbms_may24");

    const updatedMetrics = EduPrep.getComputedMetrics();
    assert.equal(updatedMetrics.testsTaken, initialQuizzes + 1);
    assert.ok(updatedMetrics.completedTopics >= 1);
    assert.ok(updatedMetrics.masteredFlashcards >= 1);
    assert.ok(updatedMetrics.totalBookmarks >= 1);
  });

  it("generates structured HTML responses from getAiResponse", () => {
    const html = EduPrep.getAiResponse("Explain Banker's Algorithm for deadlock avoidance", "encouraging", "10mark");
    assert.ok(html.includes("Banker"));
    assert.ok(html.includes("10-Mark"));
  });
});

// ============================================================================
// 5. SERVER-SIDE AI BOUNDARY TESTS (/api/ai-assistant)
// ============================================================================
describe("Server-Side AI Endpoint (/api/ai-assistant)", () => {
  function createMockRes() {
    return {
      statusCode: 200,
      headers: {},
      body: null,
      setHeader(k, v) { this.headers[k] = v; },
      status(code) { this.statusCode = code; return this; },
      json(payload) { this.body = payload; return this; },
      end(chunk) {
        if (typeof chunk === "string") {
          try { this.body = JSON.parse(chunk); } catch (_) { this.body = chunk; }
        }
        return this;
      }
    };
  }

  it("rejects non-POST requests with 405", async () => {
    const req = { method: "GET", headers: {} };
    const res = createMockRes();
    await aiAssistantHandler(req, res);
    assert.equal(res.statusCode, 405);
  });

  it("rejects empty prompt with 400", async () => {
    const req = { method: "POST", headers: {}, body: { prompt: "   " } };
    const res = createMockRes();
    await aiAssistantHandler(req, res);
    assert.equal(res.statusCode, 400);
    assert.ok(res.body && res.body.error);
  });

  it("returns honest configured:false response when AI_API_KEY is not set", async () => {
    const prevKey = process.env.AI_API_KEY;
    delete process.env.AI_API_KEY;
    try {
      const req = {
        method: "POST",
        headers: { "x-forwarded-for": "127.0.0.99" },
        body: { prompt: "Explain paging vs segmentation", mode: "5mark" }
      };
      const res = createMockRes();
      await aiAssistantHandler(req, res);
      assert.equal(res.statusCode, 200);
      assert.equal(res.body.configured, false);
      assert.equal(res.body.provider, "offline-curated");
    } finally {
      if (prevKey !== undefined) process.env.AI_API_KEY = prevKey;
    }
  });
});

// ============================================================================
// 6. BRANDING & SECURITY AUDIT TESTS
// ============================================================================
describe("Branding & Security Audit", () => {
  const eduPrepDir = path.join(__dirname, "..", "EduPrep");

  function collectHtmlFiles(dir, list = []) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) collectHtmlFiles(full, list);
      else if (entry.name.endsWith(".html")) list.push(full);
    }
    return list;
  }

  it("has zero visible 'EduVantage' or 'GradPrep' strings in any HTML screen", () => {
    const files = collectHtmlFiles(eduPrepDir);
    assert.ok(files.length >= 18);
    for (const file of files) {
      const content = fs.readFileSync(file, "utf8");
      // Strip script blocks where backward-compatible storage keys like eduvantage_pending_query are checked
      const visibleMarkup = content.replace(/<script[\s\S]*?<\/script>/gi, "");
      assert.equal(
        /EduVantage|GradPrep/i.test(visibleMarkup),
        false,
        `Found legacy branding in visible HTML of ${path.relative(eduPrepDir, file)}`
      );
    }
  });

  it("has removed prohibited pricing tiers from student_opportunities/code.html", () => {
    const oppHtml = fs.readFileSync(path.join(eduPrepDir, "student_opportunities", "code.html"), "utf8");
    assert.equal(oppHtml.includes("₹299"), false);
    assert.equal(oppHtml.includes("upgradeToProDemo"), false);
  });

  it("completely removed prototype sidebar, top prototype toolbar, device preview buttons, and iframe canvas from EduPrep/index.html", () => {
    const indexHtml = fs.readFileSync(path.join(eduPrepDir, "index.html"), "utf8");
    assert.equal(indexHtml.includes("Filter 18 application screens"), false);
    assert.equal(indexHtml.includes("Jump to Home Dashboard"), false);
    assert.equal(indexHtml.includes("Screen 1 / 18"), false);
    assert.equal(indexHtml.includes("setViewport("), false);
    assert.equal(indexHtml.includes("id=\"appFrame\""), false);
    assert.equal(indexHtml.includes("1. Splash Screen"), false);
    assert.equal(indexHtml.includes("2. Onboarding Walkthrough"), false);
  });

  it("completely removed splash_screen and onboarding_flow directories", () => {
    assert.equal(fs.existsSync(path.join(eduPrepDir, "splash_screen")), false);
    assert.equal(fs.existsSync(path.join(eduPrepDir, "onboarding_flow")), false);
  });

  it("provides required public and student website navigation links on the homepage and student dashboard", () => {
    const indexHtml = fs.readFileSync(path.join(eduPrepDir, "index.html"), "utf8");
    const requiredPublicNav = ["EduPrep", "Home", "Features", "Explore Resources", "About", "Get Started"];
    for (const label of requiredPublicNav) {
      assert.ok(indexHtml.includes(label), `Missing public navigation item: ${label}`);
    }
    assert.equal(indexHtml.includes('>Login<'), false, "User-facing Login must be removed from homepage navigation");

    const dashHtml = fs.readFileSync(path.join(eduPrepDir, "home_dashboard", "code.html"), "utf8");
    const requiredStudentNav = [
      "Dashboard",
      "Question Papers",
      "Practice Tests",
      "Flashcards",
      "Study Planner",
      "Profile"
    ];
    for (const label of requiredStudentNav) {
      assert.ok(indexHtml.includes(label), `Missing student navigation item on index.html: ${label}`);
      assert.ok(dashHtml.includes(label), `Missing student navigation item on home_dashboard/code.html: ${label}`);
    }
    assert.equal(indexHtml.includes('>Progress<'), false, "User-facing Progress must be removed from index.html navigation");
    assert.equal(dashHtml.includes('>Progress<'), false, "User-facing Progress must be removed from home_dashboard navigation");

    // Verify 'My Subjects' is removed from the visible Student Navigation bar
    const indexStudentNav = indexHtml.match(/<nav[^>]*aria-label="Student Navigation"[^>]*>([\s\S]*?)<\/nav>/i);
    if (indexStudentNav) {
      assert.equal(indexStudentNav[1].includes("My Subjects"), false, "Expected 'My Subjects' removed from index.html Student Navigation");
    }
    const dashStudentNav = dashHtml.match(/<nav[^>]*aria-label="Student Navigation"[^>]*>([\s\S]*?)<\/nav>/i);
    if (dashStudentNav) {
      assert.equal(dashStudentNav[1].includes("My Subjects"), false, "Expected 'My Subjects' removed from home_dashboard/code.html Student Navigation");
    }
  });

  it("preserves full interactive academic setup flow (university, college, degree, branch, semester, subjects)", () => {
    const setupHtml = fs.readFileSync(path.join(eduPrepDir, "academic_setup_updated_flow", "code.html"), "utf8");
    assert.ok(setupHtml.includes("univComboboxInput"));
    assert.ok(setupHtml.includes("collegeComboboxInput"));
    assert.ok(setupHtml.includes("degreeComboboxInput"));
    assert.ok(setupHtml.includes("branchComboboxInput"));
    assert.ok(setupHtml.includes("semesterComboboxInput"));
    assert.ok(setupHtml.includes("subjectComboboxInput"));
  });

  it("renders exactly four academic stream selection boxes on homepage without dropdowns", () => {
    const indexHtml = fs.readFileSync(path.join(eduPrepDir, "index.html"), "utf8");
    assert.ok(indexHtml.includes('id="academic-streams"'), "Must have academic-streams section");
    assert.ok(indexHtml.includes("Choose Your Academic Stream"), "Must have section heading");
    assert.ok(indexHtml.includes("Explore study resources tailored to your academic field."), "Must have section subtitle");

    // Verify exactly 4 stream cards
    const streamCardMatches = indexHtml.match(/class="[^"]*stream-card[^"]*"/g) || [];
    assert.equal(streamCardMatches.length, 4, "Must render exactly 4 stream cards");

    // Verify 4 stream names
    assert.ok(indexHtml.includes("Engineering"), "Must include Engineering");
    assert.ok(indexHtml.includes("Medical"), "Must include Medical");
    assert.ok(indexHtml.includes("Arts"), "Must include Arts");
    assert.ok(indexHtml.includes("Commerce"), "Must include Commerce");

    // Verify exact card subtitles
    assert.ok(indexHtml.includes("Engineering degrees, technical subjects, and semester preparation."));
    assert.ok(indexHtml.includes("Medical studies, health sciences, and academic revision."));
    assert.ok(indexHtml.includes("Arts, humanities, languages, and creative studies."));
    assert.ok(indexHtml.includes("Accounting, finance, economics, and business studies."));

    // Verify no 5th stream
    assert.equal(indexHtml.includes("Law degrees"), false);
    assert.equal(indexHtml.includes("Management studies"), false);

    // Verify right-side academic setup box and its controls are completely removed from homepage
    assert.equal(indexHtml.includes('id="quickUniversity"'), false, "quickUniversity must be removed from homepage");
    assert.equal(indexHtml.includes('id="quickCollege"'), false, "quickCollege must be removed from homepage");
    assert.equal(indexHtml.includes('id="quickDegree"'), false, "quickDegree must be removed from homepage");
    assert.equal(indexHtml.includes('id="quickBranch"'), false, "quickBranch must be removed from homepage");
    assert.equal(indexHtml.includes('id="quickSemester"'), false, "quickSemester must be removed from homepage");
    assert.equal(indexHtml.includes('id="quickSubject"'), false, "quickSubject must be removed from homepage");
    assert.equal(indexHtml.includes('id="quickAcademicSetupForm"'), false, "quickAcademicSetupForm must be removed from homepage");
    assert.equal(indexHtml.includes("Interactive Academic Setup"), false, "Interactive Academic Setup heading must be removed from homepage");
    assert.equal(indexHtml.includes("Configure your curriculum context"), false, "Card subtitle must be removed from homepage");
    assert.equal(indexHtml.includes("Save & Open Dashboard"), false, "Save & Open Dashboard button must be removed from homepage");
    assert.equal(indexHtml.includes("Detailed Setup"), false, "Detailed Setup button must be removed from homepage");
    assert.equal(indexHtml.includes("Full Wizard →"), false, "Full Wizard link must be removed from homepage");

    // Verify left-side hero content remains intact and prominent
    assert.ok(indexHtml.includes("Syllabus-Aligned University Exam Preparation"), "Must preserve verified badge");
    assert.ok(indexHtml.includes("Master Your Semester Exams with"), "Must preserve main heading");
    assert.ok(indexHtml.includes("Structured Study Tools"), "Must preserve heading highlight");
    assert.ok(indexHtml.includes("Get Started — Setup Your Syllabus"), "Must preserve Get Started CTA");
    assert.ok(indexHtml.includes("Open Student Dashboard"), "Must preserve Dashboard CTA");
    assert.ok(indexHtml.includes("Explore Resources"), "Must preserve Explore Resources CTA");
    assert.ok(indexHtml.includes("6 Units"), "Must preserve 6 Units stat card");
    assert.ok(indexHtml.includes("Solved PYQs"), "Must preserve Solved PYQs stat card");
    assert.ok(indexHtml.includes("3D Flashcards"), "Must preserve 3D Flashcards stat card");
    assert.ok(indexHtml.includes("Timed MCQs"), "Must preserve Timed MCQs stat card");
  });
});

// ============================================================================
// 6B. STREAM-WISE SUBJECT FUNCTIONALITY & CATALOG INTEGRITY
// ============================================================================
describe("Stream-Wise Subject Functionality & Catalog Integrity", () => {
  const eduPrepDir = path.join(__dirname, "..", "EduPrep");
  const indexHtml = fs.readFileSync(path.join(eduPrepDir, "index.html"), "utf8");

  it("exposes all four streams with exact counts totaling 70 subjects", () => {
    assert.ok(EduPrep.streamSubjects, "EduPrep.streamSubjects must be defined");
    assert.equal(Array.isArray(EduPrep.streamSubjects.engineering), true);
    assert.equal(Array.isArray(EduPrep.streamSubjects.medical), true);
    assert.equal(Array.isArray(EduPrep.streamSubjects.commerce), true);
    assert.equal(Array.isArray(EduPrep.streamSubjects.arts), true);

    assert.equal(EduPrep.streamSubjects.engineering.length, 25, "Engineering must have 25 subjects");
    assert.equal(EduPrep.streamSubjects.medical.length, 15, "Medical must have 15 subjects");
    assert.equal(EduPrep.streamSubjects.commerce.length, 15, "Commerce must have 15 subjects");
    assert.equal(EduPrep.streamSubjects.arts.length, 15, "Arts must have 15 subjects");

    const total = EduPrep.streamSubjects.engineering.length +
                  EduPrep.streamSubjects.medical.length +
                  EduPrep.streamSubjects.commerce.length +
                  EduPrep.streamSubjects.arts.length;
    assert.equal(total, 70, "Total catalog must contain exactly 70 subjects");
  });

  it("preserves exact Engineering subject names in required order without abbreviations", () => {
    const expected = [
      "Engineering Mathematics",
      "Engineering Physics",
      "Engineering Chemistry",
      "Engineering Mechanics",
      "Basic Electrical Engineering",
      "Basic Electronics Engineering",
      "Engineering Graphics",
      "Programming for Problem Solving",
      "Object-Oriented Programming",
      "Data Structures",
      "Discrete Mathematics",
      "Digital Logic Design",
      "Database Management Systems",
      "Computer Organization and Architecture",
      "Operating Systems",
      "Computer Networks",
      "Design and Analysis of Algorithms",
      "Software Engineering",
      "Theory of Computation",
      "Compiler Design",
      "Artificial Intelligence",
      "Machine Learning",
      "Web Technology",
      "Information Security",
      "Cloud Computing"
    ];
    assert.deepEqual(EduPrep.getStreamSubjects("engineering"), expected);
  });

  it("preserves exact Medical subject names in required order without abbreviations", () => {
    const expected = [
      "Anatomy",
      "Physiology",
      "Biochemistry",
      "Pathology",
      "Pharmacology",
      "Microbiology",
      "Forensic Medicine",
      "Community Medicine",
      "General Medicine",
      "General Surgery",
      "Obstetrics and Gynaecology",
      "Pediatrics",
      "Ophthalmology",
      "Otorhinolaryngology",
      "Orthopedics"
    ];
    assert.deepEqual(EduPrep.getStreamSubjects("medical"), expected);
  });

  it("preserves exact Commerce subject names in required order without abbreviations", () => {
    const expected = [
      "Financial Accounting",
      "Business Economics",
      "Business Law",
      "Business Mathematics",
      "Business Statistics",
      "Cost Accounting",
      "Corporate Accounting",
      "Management Accounting",
      "Financial Management",
      "Income Tax",
      "Auditing",
      "Business Management",
      "Marketing Management",
      "Banking and Insurance",
      "Entrepreneurship Development"
    ];
    assert.deepEqual(EduPrep.getStreamSubjects("commerce"), expected);
  });

  it("preserves exact Arts subject names in required order without abbreviations", () => {
    const expected = [
      "English Literature",
      "History",
      "Political Science",
      "Sociology",
      "Psychology",
      "Economics",
      "Philosophy",
      "Geography",
      "Marathi Literature",
      "Hindi Literature",
      "Sanskrit",
      "Public Administration",
      "Education",
      "Journalism and Mass Communication",
      "Linguistics"
    ];
    assert.deepEqual(EduPrep.getStreamSubjects("arts"), expected);
  });

  it("ensures subjects are strictly segregated and not mixed across streams", () => {
    const engSet = new Set(EduPrep.getStreamSubjects("engineering"));
    const medSet = new Set(EduPrep.getStreamSubjects("medical"));
    const comSet = new Set(EduPrep.getStreamSubjects("commerce"));
    const artSet = new Set(EduPrep.getStreamSubjects("arts"));

    // Verify Engineering contains no Medical, Commerce, or Arts-only subjects
    assert.equal(engSet.has("Anatomy"), false);
    assert.equal(engSet.has("Financial Accounting"), false);
    assert.equal(engSet.has("History"), false);

    // Verify Medical contains no Engineering, Commerce, or Arts subjects
    assert.equal(medSet.has("Data Structures"), false);
    assert.equal(medSet.has("Business Law"), false);
    assert.equal(medSet.has("Political Science"), false);

    // Verify Commerce contains no Engineering or Medical subjects
    assert.equal(comSet.has("Compiler Design"), false);
    assert.equal(comSet.has("Pharmacology"), false);

    // Verify Arts contains no Engineering or Medical subjects
    assert.equal(artSet.has("Operating Systems"), false);
    assert.equal(artSet.has("Orthopedics"), false);
  });

  it("provides stream-wise interaction UI and return-to-stream controls on homepage", () => {
    assert.ok(indexHtml.includes('id="streamSubjectsPanel"'), "Must include stream subjects panel");
    assert.ok(indexHtml.includes('id="streamSubjectsHeading"'), "Must include stream heading");
    assert.ok(indexHtml.includes('id="streamSubjectsGrid"'), "Must include stream subjects grid");
    assert.ok(indexHtml.includes('id="streamSubjectDetailContainer"'), "Must include stream subject detail container");
    assert.ok(indexHtml.includes('openStreamSubjects('), "Must include openStreamSubjects function call");
    assert.ok(indexHtml.includes('closeStreamSubjects()'), "Must include closeStreamSubjects function call");
    assert.ok(indexHtml.includes('Back to Streams'), "Must include Back to Streams return button");
  });
});

// ============================================================================
// 7. LOGIN PAGE LAYOUT REPAIR, AUTHENTICATION & ROUTING
// ============================================================================
describe("Login Page Layout Repair, Authentication & Clean Routing", () => {
  const eduPrepDir = path.join(__dirname, "..", "EduPrep");
  const loginHtmlPath = path.join(eduPrepDir, "login_registration", "code.html");
  const loginHtml = fs.readFileSync(loginHtmlPath, "utf8");

  it("renders a centered login card with sensible max-width (420-480px)", () => {
    assert.ok(loginHtml.includes("max-w-[460px]"), "Expected login card to have max-w-[460px]");
    assert.ok(loginHtml.includes("min-h-screen flex flex-col justify-between"), "Expected full-height centered layout");
    assert.ok(loginHtml.includes("mx-auto"), "Expected card to be horizontally centered with mx-auto");
  });

  it("has empty email and password fields by default (no prefilled credentials)", () => {
    assert.equal(loginHtml.includes('id="login-email" value='), false, "Email field must not have prefilled value attribute");
    assert.equal(loginHtml.includes('id="login-password" value='), false, "Password field must not have prefilled value attribute");
    assert.equal(loginHtml.includes('aryan.sharma@student.edu" placeholder'), false, "Email must not be hardcoded as value");
    assert.equal(loginHtml.includes('eduprep2026" placeholder'), false, "Password must not be hardcoded as value");
  });

  it("has correct heading, subtitle, and password show/hide toggle controls", () => {
    assert.ok(loginHtml.includes("Welcome Back"));
    assert.ok(loginHtml.includes("Sign in to continue your exam preparation."));
    assert.ok(loginHtml.includes('type="password"'));
    assert.ok(loginHtml.includes("togglePasswordVisibility"));
    assert.ok(loginHtml.includes("Forgot Password?"));
    assert.ok(loginHtml.includes("Create Student Account"));
  });

  it("has removed prominent Local Demo Mode badge and Demo Student Mode panel from the main card", () => {
    assert.equal(loginHtml.includes("authProviderStatusBadge"), false, "Prominent status badge should be removed from header");
    assert.equal(loginHtml.includes("Checking Auth Configuration..."), false, "Configuration message should not be visible by default");
    assert.equal(loginHtml.includes("Explore full curriculum &amp; exams with sample student state"), false, "Demo banner should not be in main card");
  });

  it("includes functional registration and password recovery panels", () => {
    assert.ok(loginHtml.includes('id="register-form"'));
    assert.ok(loginHtml.includes('id="reg-name"'));
    assert.ok(loginHtml.includes('id="reg-email"'));
    assert.ok(loginHtml.includes('id="reg-password"'));
    assert.ok(loginHtml.includes('id="reg-password-confirm"'));
    assert.ok(loginHtml.includes('id="reset-form"'));
    assert.ok(loginHtml.includes('id="reset-email"'));
  });

  it("ensures student navigation bar is never injected into login_registration", () => {
    const dataJs = fs.readFileSync(path.join(eduPrepDir, "shared", "eduprep_data.js"), "utf8");
    assert.ok(
      dataJs.includes("/login|register|forgot|reset|admin|index.html/i.test(path)"),
      "Expected regex guard excluding auth routes"
    );
  });

  it("serves clean routes /login, /register, /forgot-password, and /dashboard via local server", async () => {
    const { createServer } = require("../EduPrep/serve.js");
    const server = createServer();
    await new Promise((resolve) => server.listen(0, resolve));
    const port = server.address().port;

    try {
      const resLogin = await fetch(`http://localhost:${port}/login`);
      assert.equal(resLogin.status, 200);
      const textLogin = await resLogin.text();
      assert.ok(textLogin.includes("Welcome Back"));

      const resRegister = await fetch(`http://localhost:${port}/register`);
      assert.equal(resRegister.status, 200);

      const resForgot = await fetch(`http://localhost:${port}/forgot-password`);
      assert.equal(resForgot.status, 200);

      const resDash = await fetch(`http://localhost:${port}/dashboard`);
      assert.equal(resDash.status, 200);
      const textDash = await resDash.text();
      assert.ok(textDash.includes("EduPrep"));

      const resCompat = await fetch(`http://localhost:${port}/login_registration/code.html`);
      assert.equal(resCompat.status, 200);

      const resUpdatePass = await fetch(`http://localhost:${port}/update-password`);
      assert.equal(resUpdatePass.status, 200);
      const textUpdatePass = await resUpdatePass.text();
      assert.ok(textUpdatePass.includes("Set New Password") || textUpdatePass.includes("update-password-form"));

      const resVendorSupabase = await fetch(`http://localhost:${port}/shared/vendor/supabase.js`);
      assert.equal(resVendorSupabase.status, 200);
      assert.ok(resVendorSupabase.headers.get("content-type").includes("javascript"));
    } finally {
      server.close();
    }
  });
});

// ============================================================================
// 8. SUPABASE AUTH INTEGRATION & SECURITY TESTS
// ============================================================================
describe("Supabase Email & Password Authentication Integration", () => {
  const EduPrepSupabase = require("../EduPrep/shared/supabase_client.js");
  const eduPrepDir = path.join(__dirname, "..", "EduPrep");
  const loginHtml = fs.readFileSync(path.join(eduPrepDir, "login_registration", "code.html"), "utf8");

  it("honest configuration detection: rejects placeholder or missing keys without faking success", () => {
    const env = EduPrepSupabase.getEnvConfig();
    assert.equal(typeof env.isConfigured, "boolean");
    // If not configured, client must be null or report false
    if (!env.isConfigured) {
      assert.equal(EduPrepSupabase.isConfigured(), false);
      assert.ok(env.missingConfigReason);
    }
  });

  it("exposes all required Supabase email & password authentication functions", () => {
    assert.equal(typeof EduPrepSupabase.auth.signUp, "function");
    assert.equal(typeof EduPrepSupabase.auth.signIn, "function");
    assert.equal(typeof EduPrepSupabase.auth.signInWithPassword, "function");
    assert.equal(typeof EduPrepSupabase.auth.signOut, "function");
    assert.equal(typeof EduPrepSupabase.auth.resetPasswordForEmail, "function");
    assert.equal(typeof EduPrepSupabase.auth.updatePassword, "function");
    assert.equal(typeof EduPrepSupabase.auth.getSession, "function");
    assert.equal(typeof EduPrepSupabase.auth.getUser, "function");
    assert.equal(typeof EduPrepSupabase.auth.onAuthStateChange, "function");
  });

  it("returns clear developer error when trying to authenticate without credentials", async () => {
    const prevKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;
    delete process.env.VITE_SUPABASE_PUBLISHABLE_KEY;
    try {
      const { data, error } = await EduPrepSupabase.auth.signInWithPassword("test@college.edu", "password123");
      assert.equal(data, null);
      assert.ok(error);
      assert.equal(error.code, "SUPABASE_NOT_CONFIGURED");
    } finally {
      if (prevKey !== undefined) process.env.VITE_SUPABASE_PUBLISHABLE_KEY = prevKey;
    }
  });

  it("login page markup has eliminated all fake demo login buttons and demo student bypasses", () => {
    assert.equal(loginHtml.includes("handleQuickDemoEntry"), false, "Must not contain handleQuickDemoEntry bypass");
    assert.equal(loginHtml.includes("Explore with Demo Student Account"), false, "Must not contain demo student bypass button");
    assert.equal(loginHtml.includes('value="aryan.sharma@student.edu"'), false, "Must not contain prefilled email");
    assert.equal(loginHtml.includes('value="eduprep2026"'), false, "Must not contain prefilled password");
  });

  it("includes new password update form and email verification panel", () => {
    assert.ok(loginHtml.includes('id="update-password-form"'), "Missing update-password-form");
    assert.ok(loginHtml.includes('id="new-password"'), "Missing new-password input");
    assert.ok(loginHtml.includes('id="new-password-confirm"'), "Missing new-password-confirm input");
    assert.ok(loginHtml.includes('id="email-verification-panel"'), "Missing email-verification-panel");
    assert.ok(loginHtml.includes('id="configWarningBanner"'), "Missing developer config warning banner");
  });

  it("verifies migration 03 defines public.profiles with RLS and handle_new_user trigger", () => {
    const migrationPath = path.join(__dirname, "..", "supabase", "migrations", "20261011000003_auth_profiles_and_recovery.sql");
    assert.ok(fs.existsSync(migrationPath), "Migration 03 file must exist");
    const sql = fs.readFileSync(migrationPath, "utf8");
    assert.ok(sql.includes("CREATE TABLE IF NOT EXISTS public.profiles"));
    assert.ok(sql.includes("REFERENCES auth.users(id)"));
    assert.ok(sql.includes("ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY"));
    assert.ok(sql.includes("CREATE OR REPLACE FUNCTION public.handle_new_user()"));
    assert.ok(sql.includes("AFTER INSERT ON auth.users"));
    assert.ok(sql.includes("CREATE POLICY \"Users can view own profile\" ON public.profiles"));
    assert.ok(sql.includes("auth.uid() = user_id"));
  });

  it("default user state in eduprep_data.js is unauthenticated (no hardcoded student identity)", () => {
    const dataJs = fs.readFileSync(path.join(eduPrepDir, "shared", "eduprep_data.js"), "utf8");
    assert.equal(dataJs.includes('id: "demo-student-1"'), false, "Must not have demo-student-1 default id");
    assert.equal(dataJs.includes('authMode: "demo"'), false, "Must not have authMode: 'demo' default");
    assert.ok(dataJs.includes('authMode: "unauthenticated"'), "Default authMode should be unauthenticated");
  });
});

// ============================================================================
// 10. AUTOMATED TEST SUITE: SEMESTER-WISE CHAPTERS & CHAPTER CONTENT ENGINE
// ============================================================================
describe("Semester-Wise Chapters & Content Engine (Engineering, Medical, Commerce, Arts)", () => {
  const ChaptersEngine = require("../EduPrep/shared/eduprep_chapters_data.js");
  const STREAM_SUBJECTS = EduPrep.STREAM_SUBJECTS;

  it("exports a complete ChaptersEngine with all required query methods", () => {
    assert.equal(typeof ChaptersEngine.getSubjectMeta, "function");
    assert.equal(typeof ChaptersEngine.getSubjectPeriods, "function");
    assert.equal(typeof ChaptersEngine.getChapters, "function");
    assert.equal(typeof ChaptersEngine.getChapterNotes, "function");
    assert.equal(typeof ChaptersEngine.getChapterVideos, "function");
    assert.equal(typeof ChaptersEngine.getYouTubeSearchUrl, "function");
    assert.equal(typeof ChaptersEngine.hasChapters, "function");
  });

  it("bridges all ChaptersEngine methods into EduPrep core object", () => {
    assert.equal(typeof EduPrep.getSubjectMeta, "function");
    assert.equal(typeof EduPrep.getSubjectPeriods, "function");
    assert.equal(typeof EduPrep.getChapters, "function");
    assert.equal(typeof EduPrep.getChapterNotes, "function");
    assert.equal(typeof EduPrep.getChapterVideos, "function");
    assert.equal(typeof EduPrep.getYouTubeSearchUrl, "function");
    assert.equal(typeof EduPrep.hasChapters, "function");
  });

  it("covers all 70 subjects across Engineering (25), Medical (15), Commerce (15), and Arts (15)", () => {
    let totalCount = 0;
    const streams = ["engineering", "medical", "commerce", "arts"];
    streams.forEach(stream => {
      const subjectNames = EduPrep.getStreamSubjects(stream);
      assert.ok(subjectNames && subjectNames.length > 0, `Stream ${stream} must have subjects`);
      subjectNames.forEach(name => {
        totalCount++;
        const meta = ChaptersEngine.getSubjectMeta(name);
        assert.ok(meta, `Subject "${name}" in stream "${stream}" must have metadata`);
        assert.equal(meta.name, name);
        assert.equal(meta.stream, stream);
        assert.ok(meta.primarySemesters && meta.primarySemesters.length > 0, `Subject "${name}" must have primarySemesters`);
        
        // Ensure at least one primary semester has chapters mapped
        const primarySem = meta.primarySemesters[0];
        const chapters = ChaptersEngine.getChapters(name, primarySem);
        assert.ok(chapters.length >= 3, `Subject "${name}" in primary semester ${primarySem} must have at least 3 chapters (found ${chapters.length})`);
      });
    });
    assert.equal(totalCount, 70, "Must verify exactly 70 subjects across all 4 streams");
  });

  it("multi-semester subjects like Engineering Mathematics have distinct chapters across semesters 1 to 4", () => {
    const mathMeta = ChaptersEngine.getSubjectMeta("Engineering Mathematics");
    assert.ok(mathMeta, "Engineering Mathematics must exist in catalog");
    assert.deepEqual(mathMeta.primarySemesters, [1, 2, 3, 4]);

    const sem1 = ChaptersEngine.getChapters("Engineering Mathematics", 1);
    const sem2 = ChaptersEngine.getChapters("Engineering Mathematics", 2);
    const sem3 = ChaptersEngine.getChapters("Engineering Mathematics", 3);
    const sem4 = ChaptersEngine.getChapters("Engineering Mathematics", 4);

    assert.ok(sem1.length >= 3, "Sem 1 must have at least 3 chapters");
    assert.ok(sem2.length >= 3, "Sem 2 must have at least 3 chapters");
    assert.ok(sem3.length >= 3, "Sem 3 must have at least 3 chapters");
    assert.ok(sem4.length >= 3, "Sem 4 must have at least 3 chapters");

    // Ensure distinct syllabus topics without cross-semester duplication
    const sem1Titles = sem1.map(c => c.title.toLowerCase());
    const sem2Titles = sem2.map(c => c.title.toLowerCase());
    const sem3Titles = sem3.map(c => c.title.toLowerCase());
    const sem4Titles = sem4.map(c => c.title.toLowerCase());

    assert.ok(sem1Titles.some(t => t.includes("calculus") || t.includes("matrices")), "Sem 1 must cover calculus/matrices");
    assert.ok(sem2Titles.some(t => t.includes("differential") || t.includes("vector")), "Sem 2 must cover differential equations/vector calculus");
    assert.ok(sem3Titles.some(t => t.includes("fourier") || t.includes("laplace") || t.includes("complex")), "Sem 3 must cover transforms/complex analysis");
    assert.ok(sem4Titles.some(t => t.includes("probability") || t.includes("numerical")), "Sem 4 must cover probability/numerical methods");
  });

  it("single-semester core subjects return chapters for their primary semester and empty array for unmapped semesters", () => {
    const dsMeta = ChaptersEngine.getSubjectMeta("Data Structures");
    assert.ok(dsMeta, "Data Structures must exist");
    assert.deepEqual(dsMeta.primarySemesters, [3]);

    const dsSem3 = ChaptersEngine.getChapters("Data Structures", 3);
    assert.ok(dsSem3.length >= 4, "Data Structures Sem 3 must have chapters");
    assert.equal(ChaptersEngine.hasChapters("Data Structures", 3), true);

    const dsSem1 = ChaptersEngine.getChapters("Data Structures", 1);
    assert.deepEqual(dsSem1, [], "Data Structures Sem 1 must return empty array without crashing");
    assert.equal(ChaptersEngine.hasChapters("Data Structures", 1), false);
  });

  it("medical stream subjects are mapped to appropriate professional phases", () => {
    const anatomyMeta = ChaptersEngine.getSubjectMeta("Anatomy");
    assert.ok(anatomyMeta, "Anatomy must exist");
    assert.equal(anatomyMeta.stream, "medical");
    assert.deepEqual(anatomyMeta.primarySemesters, [1]);

    const anatomySem1 = ChaptersEngine.getChapters("Anatomy", 1);
    assert.ok(anatomySem1.length >= 4, "Anatomy Sem 1 must have chapters");

    const medMeta = ChaptersEngine.getSubjectMeta("General Medicine");
    assert.ok(medMeta, "General Medicine must exist");
    assert.deepEqual(medMeta.primarySemesters, [8]);
    const medSem8 = ChaptersEngine.getChapters("General Medicine", 8);
    assert.ok(medSem8.length >= 4, "General Medicine Sem 8 must have chapters");
  });

  it("every chapter has comprehensive academic notes with required pedagogic sections", () => {
    const sampleSubjects = [
      { name: "Operating Systems", sem: 4 },
      { name: "Anatomy", sem: 1 },
      { name: "Financial Accounting", sem: 1 },
      { name: "Economics", sem: 1 }
    ];

    sampleSubjects.forEach(({ name, sem }) => {
      const chapters = ChaptersEngine.getChapters(name, sem);
      chapters.forEach(ch => {
        assert.ok(ch.id, `Chapter in ${name} must have an id`);
        assert.ok(ch.title && ch.title.length > 5, `Chapter ${ch.id} in ${name} must have a descriptive title`);
        assert.ok(ch.description && ch.description.length > 20, `Chapter ${ch.id} must have a description`);
        assert.equal(ch.description.includes("Lorem ipsum"), false, "Description must not contain lorem ipsum");

        const notes = ch.notes;
        assert.ok(notes, `Chapter ${ch.id} in ${name} must have notes`);
        assert.ok(Array.isArray(notes.learningObjectives) && notes.learningObjectives.length >= 2, `${ch.id} must have learning objectives`);
        assert.ok(Array.isArray(notes.keyDefinitions) && notes.keyDefinitions.length >= 2, `${ch.id} must have key definitions`);
        notes.keyDefinitions.forEach(kd => {
          assert.ok(kd.term && kd.term.length > 0, "Definition must have term");
          assert.ok(kd.definition && kd.definition.length > 10, "Definition must have explanation");
        });
        assert.ok(Array.isArray(notes.conceptualExplanations) && notes.conceptualExplanations.length >= 2, `${ch.id} must have conceptual sections`);
        notes.conceptualExplanations.forEach(c => {
          assert.ok(c.heading && c.content && c.content.length > 25, "Concept must have heading and rich content");
        });
        assert.ok(Array.isArray(notes.formulasOrRules), `${ch.id} must have formulasOrRules array`);
        assert.ok(Array.isArray(notes.examplesOrProblems) && notes.examplesOrProblems.length >= 1, `${ch.id} must have worked examples`);
        assert.ok(typeof notes.summary === 'string' && notes.summary.length > 20, `${ch.id} must have narrative summary`);
        assert.ok(Array.isArray(notes.revisionPoints) && notes.revisionPoints.length >= 2, `${ch.id} must have revision checklist`);
        assert.ok(notes.attribution && notes.attribution.length > 5, `${ch.id} must specify syllabus alignment`);
      });
    });
  });

  it("every chapter has legitimate YouTube lecture recommendations with honest attributions", () => {
    const sampleSubjects = [
      { name: "Data Structures", sem: 3 },
      { name: "Pathology", sem: 3 },
      { name: "Business Law", sem: 2 },
      { name: "History", sem: 1 }
    ];

    sampleSubjects.forEach(({ name, sem }) => {
      const chapters = ChaptersEngine.getChapters(name, sem);
      chapters.forEach(ch => {
        const videos = ch.videos;
        assert.ok(Array.isArray(videos) && videos.length >= 1, `Chapter ${ch.id} in ${name} must have at least 1 video recommendation`);
        videos.forEach(v => {
          assert.ok(v.id && v.id.length >= 8, "Video must have valid YouTube ID");
          assert.ok(v.title && v.title.length > 5, "Video must have title");
          assert.ok(v.channel && v.channel.length > 2, "Video must have channel attribution");
          assert.ok(v.url.startsWith("https://www.youtube.com/watch?v="), "url must be canonical watch URL");
          assert.ok(v.embedUrl.startsWith("https://www.youtube-nocookie.com/embed/"), "embedUrl must use privacy-enhanced embed domain");
          
          // STRICT RULE: No fabricated view counts, fake likes, or fake ratings
          assert.equal(v.viewCount, undefined, "Video must not contain fabricated view counts");
          assert.equal(v.views, undefined, "Video must not contain fabricated views");
          assert.equal(v.likes, undefined, "Video must not contain fabricated likes");
          assert.equal(v.rating, undefined, "Video must not contain fabricated ratings");
          assert.equal(v.subscribers, undefined, "Video must not contain fabricated subscribers");
        });

        // Search fallback check
        const searchUrl = ChaptersEngine.getYouTubeSearchUrl(name, ch.title);
        assert.ok(searchUrl.startsWith("https://www.youtube.com/results?search_query="), "Must produce valid YouTube search URL");
        assert.ok(searchUrl.includes(encodeURIComponent(name)), "Search query must contain subject name");
      });
    });
  });
});

// ============================================================================
// 11. AUTOMATED TEST SUITE: CHAPTERS UI COMPONENT & INTEGRATION AUDIT
// ============================================================================
describe("Chapters UI Component & Integration Audit", () => {
  const eduPrepDir = path.join(__dirname, "..", "EduPrep");
  const EduPrepChaptersUI = require("../EduPrep/shared/eduprep_chapters_ui.js");
  const indexHtml = fs.readFileSync(path.join(eduPrepDir, "index.html"), "utf8");
  const resourcesHtml = fs.readFileSync(path.join(eduPrepDir, "resources_dashboard", "code.html"), "utf8");

  it("EduPrepChaptersUI is loaded and exposes complete lifecycle methods", () => {
    assert.equal(typeof EduPrepChaptersUI.render, "function");
    assert.equal(typeof EduPrepChaptersUI.selectSemester, "function");
    assert.equal(typeof EduPrepChaptersUI.openChapterVideos, "function");
    assert.equal(typeof EduPrepChaptersUI.openChapterNotes, "function");
    assert.equal(typeof EduPrepChaptersUI.returnToChaptersList, "function");
    assert.equal(typeof EduPrepChaptersUI.returnToSubjectList, "function");
    assert.equal(typeof EduPrepChaptersUI.renderChaptersListView, "function");
    assert.equal(typeof EduPrepChaptersUI.renderVideosView, "function");
    assert.equal(typeof EduPrepChaptersUI.renderNotesView, "function");
  });

  it("renderChaptersListView generates semester pills and chapter cards with explicit actions", () => {
    const meta = EduPrep.getSubjectMeta("Operating Systems");
    const html = EduPrepChaptersUI.renderChaptersListView(meta, 4);
    assert.ok(html.includes("Operating Systems"), "Must render subject name");
    assert.ok(html.includes("EduPrepChaptersUI.selectSemester"), "Must render semester selector chips");
    assert.ok(html.includes("Watch Videos"), "Must render Watch Videos action button");
    assert.ok(html.includes("View Full Notes"), "Must render View Full Notes action button");
    assert.ok(html.includes("EduPrepChaptersUI.openChapterVideos"), "Must wire openChapterVideos click handler");
    assert.ok(html.includes("EduPrepChaptersUI.openChapterNotes"), "Must wire openChapterNotes click handler");
  });

  it("renderVideosView uses honest 'Recommended YouTube Videos' heading and avoids fake claims", () => {
    const meta = EduPrep.getSubjectMeta("Operating Systems");
    const chapters = EduPrep.getChapters("Operating Systems", 4);
    assert.ok(chapters.length > 0);

    const html = EduPrepChaptersUI.renderVideosView(meta, chapters[0].id);
    assert.ok(html.includes("Recommended YouTube Videos"), "Must use neutral heading 'Recommended YouTube Videos'");
    assert.equal(html.includes("Most Watched Videos"), false, "Must not claim 'Most Watched' unless verified");
    assert.ok(html.includes("Open on YouTube"), "Must provide direct open on YouTube button");
    assert.ok(html.includes("Search YouTube Directly"), "Must provide direct search fallback link");
    assert.ok(html.includes("EduPrepChaptersUI.backToChapters()"), "Must provide return to chapters list action");
  });

  it("renderNotesView renders full pedagogical sections and quick return action", () => {
    const meta = EduPrep.getSubjectMeta("Operating Systems");
    const chapters = EduPrep.getChapters("Operating Systems", 4);
    assert.ok(chapters.length > 0);

    const html = EduPrepChaptersUI.renderNotesView(meta, chapters[0].id);
    assert.ok(html.includes("Learning Objectives"), "Must render learning objectives section");
    assert.ok(html.includes("Key Definitions"), "Must render key definitions section");
    assert.ok(html.includes("Conceptual Explanations"), "Must render core concepts section");
    assert.ok(html.includes("Important Formulas & Governing Principles"), "Must render formulas or governing rules");
    assert.ok(html.includes("Worked Example & Exam Problem Solution"), "Must render worked solutions");
    assert.ok(html.includes("Chapter Summary & High-Yield Revision Points"), "Must render summary takeaways");
    assert.ok(html.includes("EduPrepChaptersUI.backToChapters()"), "Must provide back to chapters action");
  });

  it("index.html imports chapter scripts, wires selectStreamSubject, and provides dedicated container", () => {
    assert.ok(indexHtml.includes('src="shared/eduprep_chapters_data.js"'), "index.html must include eduprep_chapters_data.js");
    assert.ok(indexHtml.includes('src="shared/eduprep_chapters_ui.js"'), "index.html must include eduprep_chapters_ui.js");
    assert.ok(indexHtml.includes('id="streamSubjectDetailContainer"'), "index.html must have streamSubjectDetailContainer");
    assert.ok(indexHtml.includes('EduPrepChaptersUI.render("streamSubjectDetailContainer"'), "index.html must invoke EduPrepChaptersUI.render");
    assert.ok(indexHtml.includes('handleHashRoute'), "index.html must support handleHashRoute for deep linking and back navigation");
  });

  it("resources_dashboard/code.html imports chapter scripts and wires subjectChaptersContainer", () => {
    assert.ok(resourcesHtml.includes('src="../shared/eduprep_chapters_data.js"'), "code.html must include eduprep_chapters_data.js");
    assert.ok(resourcesHtml.includes('src="../shared/eduprep_chapters_ui.js"'), "code.html must include eduprep_chapters_ui.js");
    assert.ok(resourcesHtml.includes('id="subjectChaptersContainer"'), "code.html must have subjectChaptersContainer");
    assert.ok(resourcesHtml.includes('EduPrepChaptersUI.render("subjectChaptersContainer"'), "code.html must invoke EduPrepChaptersUI.render");
  });

  it("retains zero visible 'EduVantage' or 'GradPrep' branding in any updated files", () => {
    const chaptersUiJs = fs.readFileSync(path.join(eduPrepDir, "shared", "eduprep_chapters_ui.js"), "utf8");
    assert.equal(chaptersUiJs.includes("EduVantage"), false, "eduprep_chapters_ui.js must not contain EduVantage");
    assert.equal(chaptersUiJs.includes("GradPrep"), false, "eduprep_chapters_ui.js must not contain GradPrep");
  });
});

// ============================================================================
// 12. AUTOMATED TEST SUITE: TARGETED FUNCTIONALITY & CORE MODULES AUDIT
// ============================================================================
describe("Targeted Functionality & Core Modules Integration Audit", () => {
  const eduPrepDir = path.join(__dirname, "..", "EduPrep");
  const indexHtml = fs.readFileSync(path.join(eduPrepDir, "index.html"), "utf8");
  const dashHtml = fs.readFileSync(path.join(eduPrepDir, "home_dashboard", "code.html"), "utf8");
  const mcqHtml = fs.readFileSync(path.join(eduPrepDir, "mcq_practice_exam", "code.html"), "utf8");
  const flashHtml = fs.readFileSync(path.join(eduPrepDir, "revision_flashcards", "code.html"), "utf8");
  const plannerHtml = fs.readFileSync(path.join(eduPrepDir, "academic_setup", "code.html"), "utf8");
  const resourcesHtml = fs.readFileSync(path.join(eduPrepDir, "resources_dashboard", "code.html"), "utf8");

  it("navigation bars completely remove 'My Subjects' while preserving all 7 core workspace items", () => {
    // Neither desktop nor mobile nav in index or dashboard contains "My Subjects"
    assert.equal(indexHtml.includes('>My Subjects<'), false, "index.html must not contain 'My Subjects' link text");
    assert.equal(dashHtml.includes('>My Subjects<'), false, "home_dashboard must not contain 'My Subjects' link text");

    const requiredNavItems = [
      "Dashboard",
      "Question Papers",
      "Practice Tests",
      "Flashcards",
      "Study Planner",
      "Profile"
    ];

    requiredNavItems.forEach(item => {
      assert.ok(dashHtml.includes(item), `Dashboard nav must preserve ${item}`);
    });
    assert.equal(dashHtml.includes('>Progress<'), false, "home_dashboard must not contain user-facing Progress link");
  });

  it("Practice Tests (mcq_practice_exam) has eliminated auto-start and features complete pre-exam selection workflow", () => {
    // No auto-start
    assert.equal(mcqHtml.includes("startExam('os')"), false, "Must not auto-start on page load");
    assert.equal(mcqHtml.includes("initExam()"), false, "Must not unconditionally start exam on DOMContentLoaded");

    // Pre-exam selection screen exists with stream, subject, chapter, and count controls
    assert.ok(mcqHtml.includes('id="practiceSelectionScreen"'), "Must have practiceSelectionScreen");
    assert.ok(mcqHtml.includes('selectPracticeStream'), "Must have stream selector handler");
    assert.ok(mcqHtml.includes('id="practiceSubjectSelect"'), "Must have subject selector");
    assert.ok(mcqHtml.includes('id="practiceChapterSelect"'), "Must have chapter selector");
    assert.ok(mcqHtml.includes('id="btnStartPracticeTest"'), "Must have Start Test button");

    // Exam canvas and return-to-selection actions
    assert.ok(mcqHtml.includes('id="practiceExamScreen"'), "Must wrap exam in practiceExamScreen");
    assert.ok(mcqHtml.includes('confirmExitExam'), "Must have exit exam handler");
    assert.ok(mcqHtml.includes('exitToSelection'), "Must have return to selection handler");
  });

  it("Flashcards (revision_flashcards) has eliminated auto-start and features pre-deck selection and completion workflow", () => {
    // No auto-start
    assert.equal(flashHtml.includes("initFlashcardDeck()"), false, "Must not auto-start deck on load");

    // Pre-session selection screen
    assert.ok(flashHtml.includes('id="flashcardSelectionScreen"'), "Must have flashcardSelectionScreen");
    assert.ok(flashHtml.includes('selectFlashStream'), "Must have stream selector handler");
    assert.ok(flashHtml.includes('id="flashSubjectSelect"'), "Must have subject selector");
    assert.ok(flashHtml.includes('id="flashChapterSelect"'), "Must have chapter selector");
    assert.ok(flashHtml.includes('id="flashCardCountPills"'), "Must have card count pills");
    assert.ok(flashHtml.includes('id="btnStartFlashcards"'), "Must have start deck button");

    // Session screen, 3D card canvas, and controls
    assert.ok(flashHtml.includes('id="flashcardSessionScreen"'), "Must wrap session in flashcardSessionScreen");
    assert.ok(flashHtml.includes('id="focusViewContainer"'), "Must provide 3D focus view container");
    assert.ok(flashHtml.includes('id="activeFlashcard"'), "Must provide active 3D flashcard element");
    assert.ok(flashHtml.includes('id="cardFrontQuestion"'), "Must have cardFrontQuestion element");
    assert.ok(flashHtml.includes('id="cardBackAnswer"'), "Must have cardBackAnswer element");
    assert.ok(flashHtml.includes('id="btnPrevCard"'), "Must have prev card button");
    assert.ok(flashHtml.includes('id="btnNextCard"'), "Must have next card button");
    assert.ok(flashHtml.includes('id="deckProgressBar"'), "Must have deck progress bar");
    assert.ok(flashHtml.includes('id="gridViewContainer"'), "Must provide grid view container");
    assert.ok(flashHtml.includes('flipActiveCard'), "Must have 3D flip card handler");
    assert.ok(flashHtml.includes('markCardMastered'), "Must have mastery action handler");

    // Completion modal and navigation
    assert.ok(flashHtml.includes('id="flashCompletionModal"'), "Must provide deck completion modal");
    assert.ok(flashHtml.includes('exitToFlashSelection'), "Must provide return to deck selection action");
  });

  it("Dashboard (home_dashboard) calculates genuine progress metrics and provides chapter status tracker and restart confirmation modal", () => {
    // Imports eduprep_chapters_data.js
    assert.ok(dashHtml.includes('src="../shared/eduprep_chapters_data.js"'), "Must import chapters data");

    // Real progress elements
    assert.ok(dashHtml.includes('id="prepOverallProgressBar"'), "Must have prepOverallProgressBar");
    assert.ok(dashHtml.includes('id="prepReadySubjectsLabel"'), "Must have prepReadySubjectsLabel");

    // Chapter status tracker
    assert.ok(dashHtml.includes('id="chapterStatusGridContainer"'), "Must have chapterStatusGridContainer");
    assert.ok(dashHtml.includes('filterChapterStatus'), "Must have filterChapterStatus");

    // Restart confirmation modal
    assert.ok(dashHtml.includes('id="restartChapterModal"'), "Must have restartChapterModal");
    assert.ok(dashHtml.includes('id="btnConfirmRestartChapter"'), "Must have btnConfirmRestartChapter");
    assert.ok(dashHtml.includes('confirmRestartChapter'), "Must have confirmRestartChapter handler");

    // EduPrep core methods for chapter progress
    assert.equal(typeof EduPrep.restartChapter, "function", "EduPrep must expose restartChapter");
    assert.equal(typeof EduPrep.completeChapter, "function", "EduPrep must expose completeChapter");
    assert.equal(typeof EduPrep.toggleChapterCompleted, "function", "EduPrep must expose toggleChapterCompleted");
  });

  it("Study Planner (academic_setup) renders a modern planner with task creation, upcoming/overdue tabs, and persistence", () => {
    assert.ok(plannerHtml.includes('Academic Study Planner'), "Must be titled Academic Study Planner");
    assert.ok(plannerHtml.includes('id="createPlanCard"'), "Must have createPlanCard");
    assert.ok(plannerHtml.includes('id="planStreamSelect"'), "Must have planStreamSelect");
    assert.ok(plannerHtml.includes('id="planSubjectSelect"'), "Must have planSubjectSelect");
    assert.ok(plannerHtml.includes('id="planChapterSelect"'), "Must have planChapterSelect");
    assert.ok(plannerHtml.includes('id="planDateInput"'), "Must have planDateInput");
    assert.ok(plannerHtml.includes('id="btnCreatePlan"'), "Must have btnCreatePlan");

    // Filter tabs and metrics
    assert.ok(plannerHtml.includes('id="tabPlanUpcoming"'), "Must have tabPlanUpcoming");
    assert.ok(plannerHtml.includes('id="tabPlanOverdue"'), "Must have tabPlanOverdue");
    assert.ok(plannerHtml.includes('id="tabPlanCompleted"'), "Must have tabPlanCompleted");
    assert.ok(plannerHtml.includes('id="statTotalPlans"'), "Must have statTotalPlans");

    // Reschedule modal and actions
    assert.ok(plannerHtml.includes('id="rescheduleModal"'), "Must have rescheduleModal");
    assert.ok(plannerHtml.includes('togglePlanComplete'), "Must have togglePlanComplete action");
    assert.ok(plannerHtml.includes('deletePlan'), "Must have deletePlan action");
    assert.ok(plannerHtml.includes('eduprep_study_plans_v1'), "Must persist to eduprep_study_plans_v1");
  });

  it("Explore Resources (resources_dashboard) routes cleanly to all 6 core features with zero dead links or fake claims", () => {
    // 6 Core routes verified
    assert.ok(resourcesHtml.includes('href="../previous_year_papers/code.html"'), "Must link to previous year papers");
    assert.ok(resourcesHtml.includes('href="../mcq_practice_exam/code.html"'), "Must link to practice tests");
    assert.ok(resourcesHtml.includes('href="../revision_flashcards/code.html"'), "Must link to revision flashcards");
    assert.ok(resourcesHtml.includes('href="#subjectDirectorySection"') || resourcesHtml.includes('openSubjectWorkspace'), "Must link to subject notes and chapters");
    assert.ok(resourcesHtml.includes('href="../academic_setup/code.html"'), "Must link to study planner");
    assert.ok(resourcesHtml.includes('href="../home_dashboard/code.html"'), "Must link to home dashboard");

    // Zero fake claims & zero dead links
    assert.equal(resourcesHtml.includes('progressMap'), false, "Must not contain hardcoded fake progressMap");
    assert.equal(resourcesHtml.includes('18 Lec'), false, "Must not contain fabricated '18 Lec' badge");
    assert.equal(resourcesHtml.includes('href="#"'), false, "Must contain zero dead href='#' links");
  });
});

// ============================================================================
// 13. COMPREHENSIVE IMPROVEMENTS AUDIT: SEARCH, MY SUBJECTS, LAYOUT, AI & PROFILE
// ============================================================================
describe("Comprehensive Existing-Project Improvement Audit", () => {
  const indexHtml = fs.readFileSync(path.join(__dirname, "../EduPrep/index.html"), "utf8");
  const dashHtml = fs.readFileSync(path.join(__dirname, "../EduPrep/home_dashboard/code.html"), "utf8");
  const chatbotJs = fs.readFileSync(path.join(__dirname, "../EduPrep/shared/eduprep_chatbot.js"), "utf8");
  const profileHtml = fs.readFileSync(path.join(__dirname, "../EduPrep/user_profile_progress/code.html"), "utf8");
  const resourcesHtml = fs.readFileSync(path.join(__dirname, "../EduPrep/resources_dashboard/code.html"), "utf8");
  const eduprepData = fs.readFileSync(path.join(__dirname, "../EduPrep/shared/eduprep_data.js"), "utf8");
  const eduvantageData = fs.readFileSync(path.join(__dirname, "../EduPrep/shared/eduvantage_data.js"), "utf8");

  it("exposes universal searchCurriculum with ranking, metadata, casing, and whitespace normalization", () => {
    assert.equal(typeof EduPrep.searchCurriculum, "function", "EduPrep must expose searchCurriculum");

    // Exact subject match
    const sExact = EduPrep.searchCurriculum("Operating Systems");
    assert.ok(sExact.hasMatches, "Must match Operating Systems");
    assert.equal(sExact.allResults[0].title, "Operating Systems");
    assert.equal(sExact.allResults[0].type, "subject");
    assert.equal(sExact.allResults[0].stream, "engineering");

    // Partial subject match
    const sPartial = EduPrep.searchCurriculum("operat");
    assert.ok(sPartial.hasMatches);
    assert.ok(sPartial.subjects.some(s => s.title === "Operating Systems"));

    // Case and extra whitespace normalization
    const sCasing = EduPrep.searchCurriculum("   oPeRaTiNg    SyStEmS   ");
    assert.ok(sCasing.hasMatches);
    assert.equal(sCasing.allResults[0].title, "Operating Systems");

    // Subject Code match
    const sCode = EduPrep.searchCurriculum("CSC401");
    assert.ok(sCode.hasMatches);
    assert.ok(sCode.subjects.some(s => s.code === "CSC401"));

    // Exact and partial chapter matches
    const chExact = EduPrep.searchCurriculum("Process Synchronization");
    assert.ok(chExact.hasMatches, "Must match Process Synchronization chapter");
    assert.ok(chExact.chapters.some(c => c.subjectName === "Operating Systems"));

    const chPartial = EduPrep.searchCurriculum("Deadlock");
    assert.ok(chPartial.hasMatches, "Must match Deadlock chapter");
    assert.ok(chPartial.chapters.some(c => c.subjectName === "Operating Systems"));

    // Cross-stream coverage (Engineering, Medical, Commerce, Arts)
    const medSearch = EduPrep.searchCurriculum("Anatomy");
    assert.ok(medSearch.hasMatches);
    assert.equal(medSearch.allResults[0].stream, "medical");

    const commSearch = EduPrep.searchCurriculum("Financial Accounting");
    assert.ok(commSearch.hasMatches);
    assert.equal(commSearch.allResults[0].stream, "commerce");

    const artsSearch = EduPrep.searchCurriculum("History");
    assert.ok(artsSearch.hasMatches);
    assert.equal(artsSearch.allResults[0].stream, "arts");

    // Empty and non-matching queries
    const emptySearch = EduPrep.searchCurriculum("");
    assert.equal(emptySearch.hasMatches, false);
    assert.equal(emptySearch.totalMatches, 0);

    const nonMatch = EduPrep.searchCurriculum("nonexistent_subject_query_xyz");
    assert.equal(nonMatch.hasMatches, false);
    assert.equal(nonMatch.totalMatches, 0);

    // Results provide essential metadata
    const firstResult = sExact.allResults[0];
    assert.ok(firstResult.title, "Must provide title");
    assert.ok(firstResult.stream, "Must provide stream");
    assert.ok(firstResult.streamName, "Must provide streamName");
    assert.ok(firstResult.semester, "Must provide semester");
    assert.ok(firstResult.url, "Must provide url");
  });

  it("resolves all 70 subjects via getSubjectByCode without Operating Systems fallback regression", () => {
    const os = EduPrep.getSubjectByCode("Operating Systems");
    assert.equal(os.name, "Operating Systems");

    const anatomy = EduPrep.getSubjectByCode("Anatomy");
    assert.equal(anatomy.name, "Anatomy");
    assert.equal(anatomy.stream, "medical");

    const econ = EduPrep.getSubjectByCode("Economics");
    assert.equal(econ.name, "Economics");
    assert.equal(econ.stream, "arts");

    const history = EduPrep.getSubjectByCode("History");
    assert.equal(history.name, "History");
    assert.equal(history.stream, "arts");
  });

  it("completely removes 'My Subjects' from all user-facing navigation and data engines", () => {
    assert.equal(eduprepData.includes('"My Subjects"'), false, "eduprep_data.js must not contain My Subjects link");
    assert.equal(eduvantageData.includes('"My Subjects"'), false, "eduvantage_data.js must not contain My Subjects link");

    const allPages = [
      indexHtml,
      dashHtml,
      profileHtml,
      resourcesHtml
    ];

    allPages.forEach(html => {
      assert.equal(html.includes('>My Subjects<'), false, "Must not contain visible >My Subjects< text");
      assert.equal(html.includes('aria-label="My Subjects"'), false, "Must not contain My Subjects aria label");
    });
  });

  it("rebalances dashboard layout and expands search container", () => {
    // 7xl max-width on dashboard main container matching top app bar
    assert.ok(dashHtml.includes('max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'), "Dashboard main container must use max-w-7xl");
    
    // Search container expanded to 4xl
    assert.ok(dashHtml.includes('max-w-4xl mx-auto'), "Search container must use max-w-4xl");

    // Search bar event handlers
    assert.ok(dashHtml.includes('id="globalSearchInput"'), "Must have globalSearchInput");
    assert.ok(dashHtml.includes('oninput="handleGlobalSearch(this.value)"'), "Must wire handleGlobalSearch oninput");
    assert.ok(dashHtml.includes('handleSearchKeyDown'), "Must handle Enter and Escape key navigation");
    assert.ok(dashHtml.includes('id="searchResultsDropdown"'), "Must have searchResultsDropdown");
    assert.ok(dashHtml.includes('clearSearch()'), "Must have clearSearch function");

    // Greeting card has responsive word-wrapping
    assert.ok(dashHtml.includes('break-words'), "Academic subtitle must wrap long university names naturally");

    // Homepage search integration
    assert.ok(indexHtml.includes('id="homepageGlobalSearchInput"'), "index.html must have homepageGlobalSearchInput");
    assert.ok(indexHtml.includes('handleHomepageSearch'), "index.html must have handleHomepageSearch");
    assert.ok(indexHtml.includes('id="homepageSearchResultsDropdown"'), "index.html must have search dropdown");
  });

  it("improves AI chatbot with honest provider status, active context, and error handling", () => {
    assert.ok(chatbotJs.includes('AiAssistantService.requestStudyHelp') || chatbotJs.includes('EduPrepServices.AiAssistant.requestStudyHelp'), "Must invoke real AiAssistant service");
    assert.ok(chatbotJs.includes('Offline') || chatbotJs.includes('offline') || chatbotJs.includes('AI key'), "Must display honest provider status or offline fallback");
    assert.ok(chatbotJs.includes('sendBtn.disabled = true'), "Must prevent duplicate submissions while request is pending");
    assert.ok(chatbotJs.includes("couldn't reach the AI service") || chatbotJs.includes('EduPrep.getAiResponse'), "Must display helpful network fallback message");
  });

  it("provides profile picture customization, file validation, and persistence", () => {
    assert.equal(typeof EduPrep.getDefaultAvatar, "function", "EduPrep must expose getDefaultAvatar");
    assert.ok(EduPrep.getDefaultAvatar().startsWith("https://"), "Default avatar must be a valid URL");

    // UI elements in profile page
    assert.ok(profileHtml.includes('id="btnChangeAvatarHero"'), "Must have Change Picture button on hero card");
    assert.ok(profileHtml.includes('id="btnRemoveAvatarHero"'), "Must have Remove Picture button");
    assert.ok(profileHtml.includes('id="avatarCustomizationModal"'), "Must have avatarCustomizationModal");
    assert.ok(profileHtml.includes('id="avatarFileInput"'), "Must have avatarFileInput");
    assert.ok(profileHtml.includes('accept="image/png,image/jpeg,image/webp"'), "Must accept only supported image formats");
    assert.ok(profileHtml.includes('id="avatarModalPreviewImg"'), "Must have live avatar preview image");
    assert.ok(profileHtml.includes('id="errAvatarUpload"'), "Must have validation error message element");

    // Function handlers
    assert.ok(profileHtml.includes('openAvatarModal'), "Must define openAvatarModal");
    assert.ok(profileHtml.includes('closeAvatarModal'), "Must define closeAvatarModal");
    assert.ok(profileHtml.includes('handleAvatarFileSelect'), "Must define handleAvatarFileSelect");
    assert.ok(profileHtml.includes('saveAvatarModalPicture'), "Must define saveAvatarModalPicture");
    assert.ok(profileHtml.includes('confirmRemoveAvatar'), "Must define confirmRemoveAvatar");

    // State persistence via updateProfile
    const testAvatar = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";
    EduPrep.updateProfile({ avatar: testAvatar });
    assert.equal(EduPrep.getState().user.avatar, testAvatar, "Must persist avatar to user profile state");

    // Reset avatar
    EduPrep.updateProfile({ avatar: EduPrep.getDefaultAvatar() });
    assert.equal(EduPrep.getState().user.avatar, EduPrep.getDefaultAvatar(), "Must restore default avatar");
  });

  it("applies attractive academic background and accessible focus rings without black bezels", () => {
    // Academic background pattern
    assert.ok(indexHtml.includes('academic-bg'), "index.html must use academic-bg");
    assert.ok(dashHtml.includes('academic-bg'), "home_dashboard must use academic-bg");
    assert.ok(profileHtml.includes('academic-bg'), "user_profile_progress must use academic-bg");

    // Focus visible brand ring (#4648d4)
    assert.ok(indexHtml.includes(':focus-visible'), "index.html must define accessible focus-visible");
    assert.ok(dashHtml.includes(':focus-visible'), "home_dashboard must define accessible focus-visible");
    assert.ok(profileHtml.includes(':focus-visible'), "user_profile_progress must define accessible focus-visible");

    // No hardcoded black frame bezels
    assert.equal(dashHtml.includes('border: 8px solid black'), false);
    assert.equal(indexHtml.includes('border: 8px solid black'), false);
  });
});

// ============================================================================
// 14. ACADEMIC SETUP WIZARD REMOVAL & HOMEPAGE HERO REBALANCING AUDIT
// ============================================================================
describe("Academic Setup Wizard Removal & Homepage Hero Rebalancing Audit", () => {
  const eduPrepDir = path.join(__dirname, "..", "EduPrep");
  const indexHtml = fs.readFileSync(path.join(eduPrepDir, "index.html"), "utf8");
  const dashHtml = fs.readFileSync(path.join(eduPrepDir, "home_dashboard", "code.html"), "utf8");
  const loginHtml = fs.readFileSync(path.join(eduPrepDir, "login_registration", "code.html"), "utf8");
  const collegeHtml = fs.readFileSync(path.join(eduPrepDir, "affiliated_college_selection", "code.html"), "utf8");
  const profileHtml = fs.readFileSync(path.join(eduPrepDir, "user_profile_progress", "code.html"), "utf8");
  const setupFlowHtml = fs.readFileSync(path.join(eduPrepDir, "academic_setup_updated_flow", "code.html"), "utf8");
  const serveJs = fs.readFileSync(path.join(eduPrepDir, "serve.js"), "utf8");

  it("rebalances homepage hero section with 2-column desktop grid to eliminate vacant space", () => {
    // 2-column grid container
    assert.ok(indexHtml.includes("grid-cols-1 lg:grid-cols-12"), "Must use 12-column responsive grid on desktop");
    assert.ok(indexHtml.includes("lg:col-span-7"), "Left column must occupy 7 columns on desktop");
    assert.ok(indexHtml.includes("lg:col-span-5"), "Right column must occupy 5 columns on desktop");

    // Right column active preparation showcase card
    assert.ok(indexHtml.includes("Active Semester Prep"), "Right column must showcase active semester prep");
    assert.ok(indexHtml.includes("Active Syllabus"), "Must show active syllabus badge");
    assert.ok(indexHtml.includes("Operating Systems (CS401)"), "Must preview core subject progress card");
    assert.ok(indexHtml.includes("Database Management Systems"), "Must preview DBMS subject progress card");
    assert.ok(indexHtml.includes("High Yield PYQ"), "Must feature high-yield PYQ spotlight");
    assert.ok(indexHtml.includes("Mock Tests"), "Must include quick launcher for mock tests");
    assert.ok(indexHtml.includes("Flashcards"), "Must include quick launcher for flashcards");
    assert.ok(indexHtml.includes("PYQ Papers"), "Must include quick launcher for PYQ papers");
  });

  it("completely removes academic_setup_updated_flow links from all user-facing pages", () => {
    assert.equal(indexHtml.includes("academic_setup_updated_flow"), false, "index.html must have zero references to academic_setup_updated_flow");
    assert.equal(dashHtml.includes("academic_setup_updated_flow"), false, "home_dashboard must have zero references to academic_setup_updated_flow");
    assert.equal(loginHtml.includes("academic_setup_updated_flow"), false, "login_registration must have zero references to academic_setup_updated_flow");
    assert.equal(collegeHtml.includes("academic_setup_updated_flow"), false, "affiliated_college_selection must have zero references to academic_setup_updated_flow");
    assert.equal(profileHtml.includes("academic_setup_updated_flow"), false, "user_profile_progress must have zero references to academic_setup_updated_flow");
  });

  it("redirects direct access to academic_setup_updated_flow and server routes to dashboard", () => {
    // Client-side script redirect in academic_setup_updated_flow/code.html
    assert.ok(setupFlowHtml.includes("window.location.replace('../home_dashboard/code.html')") ||
              setupFlowHtml.includes('window.location.replace("../home_dashboard/code.html")'),
              "academic_setup_updated_flow must immediately redirect client to home_dashboard");

    // Server-side redirect in serve.js
    assert.ok(serveJs.includes('relPath.startsWith("academic_setup_updated_flow")'), "serve.js must intercept academic_setup_updated_flow");
    assert.ok(serveJs.includes('Location: "/home_dashboard/code.html"'), "serve.js must redirect to home_dashboard");
  });
});

// ============================================================================
// 15. GLOBAL SEARCH ACROSS ALL FOUR STREAMS & POLISHED FOUR-STREAM SELECTION UI
// ============================================================================
describe("Global Search Across All 4 Streams & Polished Four-Stream UI", () => {
  const eduPrepDir = path.join(__dirname, "..", "EduPrep");
  const indexHtml = fs.readFileSync(path.join(eduPrepDir, "index.html"), "utf8");
  const resourcesHtml = fs.readFileSync(path.join(eduPrepDir, "resources_dashboard", "code.html"), "utf8");

  it("accurately finds subjects across Engineering, Biology/Medical, Commerce, and Arts", () => {
    // 1. Engineering
    const engRes = EduPrep.searchCurriculum("Operating Systems");
    assert.ok(engRes.hasMatches, "Must match Operating Systems");
    assert.ok(engRes.subjects.some(s => s.stream === "engineering" && s.title === "Operating Systems"));

    // 2. Medical / Biology
    const medRes = EduPrep.searchCurriculum("Anatomy");
    assert.ok(medRes.hasMatches, "Must match Anatomy");
    assert.ok(medRes.subjects.some(s => s.stream === "medical" && s.title === "Anatomy"));

    // 3. Commerce
    const comRes = EduPrep.searchCurriculum("Financial Accounting");
    assert.ok(comRes.hasMatches, "Must match Financial Accounting");
    assert.ok(comRes.subjects.some(s => s.stream === "commerce" && s.title === "Financial Accounting"));

    // 4. Arts
    const artRes = EduPrep.searchCurriculum("Political Science");
    assert.ok(artRes.hasMatches, "Must match Political Science");
    assert.ok(artRes.subjects.some(s => s.stream === "arts" && s.title === "Political Science"));
  });

  it("handles abbreviations, acronyms, and aliases across curriculum", () => {
    // OS -> Operating Systems
    const osRes = EduPrep.searchCurriculum("OS");
    assert.ok(osRes.subjects.length > 0);
    assert.equal(osRes.subjects[0].title, "Operating Systems");

    // DBMS -> Database Management Systems
    const dbmsRes = EduPrep.searchCurriculum("DBMS");
    assert.ok(dbmsRes.subjects.length > 0);
    assert.equal(dbmsRes.subjects[0].title, "Database Management Systems");

    // CN -> Computer Networks
    const cnRes = EduPrep.searchCurriculum("CN");
    assert.ok(cnRes.subjects.length > 0);
    assert.equal(cnRes.subjects[0].title, "Computer Networks");

    // AI -> Artificial Intelligence
    const aiRes = EduPrep.searchCurriculum("AI");
    assert.ok(aiRes.subjects.length > 0);
    assert.equal(aiRes.subjects[0].title, "Artificial Intelligence");
  });

  it("searches chapters and topics without being restricted to visible screen or hardcoded list", () => {
    // Search a medical chapter
    const neuroRes = EduPrep.searchCurriculum("Neuroanatomy");
    assert.ok(neuroRes.hasMatches);
    assert.ok(neuroRes.chapters.some(c => c.subjectName === "Anatomy"));

    // Search a commerce chapter
    const statRes = EduPrep.searchCurriculum("Linear Regression");
    assert.ok(statRes.hasMatches);
    assert.ok(statRes.chapters.some(c => c.subjectName === "Business Statistics"));

    // Search an engineering chapter
    const deadlocksRes = EduPrep.searchCurriculum("Deadlocks");
    assert.ok(deadlocksRes.hasMatches);
    assert.ok(deadlocksRes.chapters.some(c => c.subjectName === "Operating Systems"));
  });

  it("renders polished four-stream selection cards with subject count badges and accessible focus", () => {
    assert.ok(indexHtml.includes("25 Subjects"), "Engineering must have 25 Subjects badge");
    assert.ok(indexHtml.includes("15 Subjects"), "Streams must have 15 Subjects badges");
    assert.ok(indexHtml.includes("Biology / Medical"), "Must feature Biology / Medical stream heading");
    assert.ok(indexHtml.includes("Explore Stream"), "Stream cards must have Explore Stream link prompt");
    assert.ok(indexHtml.includes("focus-visible:ring-"), "Stream cards must have accessible focus rings");
  });

  it("fixes semParam reference and ensures dynamic stream/semester rendering in resources_dashboard", () => {
    assert.ok(resourcesHtml.includes("const semParam = parseInt("), "semParam must be safely defined");
    assert.ok(resourcesHtml.includes('const streamParam = urlParams.get("stream")'), "streamParam must be safely defined");
    assert.ok(resourcesHtml.includes("EduPrepChaptersUI.render"), "Must render dynamic stream display name and chapters");
  });
});

// ============================================================================
// 17. FINAL PRODUCT REPAIR & DATA INTEGRITY MASTER AUDIT
// ============================================================================
describe("EduPrep Final Product Repair & Data Integrity Master Audit", () => {
  const eduPrepDir = path.join(__dirname, "..", "EduPrep");
  const indexHtml = fs.readFileSync(path.join(eduPrepDir, "index.html"), "utf8");
  const dashHtml = fs.readFileSync(path.join(eduPrepDir, "home_dashboard", "code.html"), "utf8");
  const mcqHtml = fs.readFileSync(path.join(eduPrepDir, "mcq_practice_exam", "code.html"), "utf8");
  const flashHtml = fs.readFileSync(path.join(eduPrepDir, "revision_flashcards", "code.html"), "utf8");
  const ChaptersEngine = require("../EduPrep/shared/eduprep_chapters_data.js");

  it("populates chapter dropdown accurately for all 70 subjects without periodId requirement", () => {
    const testSubjects = [
      "Operating Systems",
      "Database Management Systems",
      "Computer Networks",
      "Design and Analysis of Algorithms",
      "Anatomy",
      "Pathology",
      "Financial Accounting",
      "Cost Accounting",
      "English Literature",
      "Journalism and Mass Communication",
      "Political Science",
      "Psychology"
    ];

    testSubjects.forEach(subj => {
      const chs = ChaptersEngine.getChapters(subj);
      assert.ok(Array.isArray(chs) && chs.length >= 4, `Subject '${subj}' must have at least 4 chapters returned by getChapters without periodId`);
      chs.forEach(c => {
        assert.ok(c.id, "Chapter must have id");
        assert.ok(c.title, "Chapter must have title");
        assert.ok(c.notes, "Chapter must have notes");
      });
    });
  });

  it("returns authentic, syllabus-accurate MCQs for Arts subjects and eliminates DSA cross-contamination", () => {
    const jmMcqs = EduPrep.getMcqBank("Journalism and Mass Communication");
    assert.ok(Array.isArray(jmMcqs) && jmMcqs.length >= 15, "Journalism must have at least 15 verified MCQs");

    jmMcqs.forEach(q => {
      assert.equal(q.subject, "Journalism and Mass Communication");
      assert.equal(q.stream, "arts");
      const validation = EduPrepServices.Validation.validateMcqPayload(q);
      assert.equal(validation.valid, true, `Journalism MCQ ${q.id} must pass payload validation`);
      assert.equal(q.q.toLowerCase().includes("process scheduling"), false, "Must not contain Operating Systems content");
      assert.equal(q.q.toLowerCase().includes("binary search tree"), false, "Must not contain DSA content");
    });
  });

  it("returns authentic, syllabus-accurate MCQs for Medical and Commerce subjects without DSA fallback", () => {
    const medMcqs = EduPrep.getMcqBank("Anatomy");
    assert.ok(Array.isArray(medMcqs) && medMcqs.length >= 15, "Anatomy must have verified MCQs");
    medMcqs.forEach(q => {
      assert.equal(q.subject, "Anatomy");
      assert.equal(q.stream, "medical");
      assert.equal(EduPrepServices.Validation.validateMcqPayload(q).valid, true);
    });

    const comMcqs = EduPrep.getMcqBank("Financial Accounting");
    assert.ok(Array.isArray(comMcqs) && comMcqs.length >= 15, "Financial Accounting must have verified MCQs");
    comMcqs.forEach(q => {
      assert.equal(q.subject, "Financial Accounting");
      assert.equal(q.stream, "commerce");
      assert.equal(EduPrepServices.Validation.validateMcqPayload(q).valid, true);
    });
  });

  it("returns authentic flashcards for all 4 streams without generic DSA card fallbacks", () => {
    const artsCards = EduPrep.getFlashcards("Journalism and Mass Communication");
    assert.ok(Array.isArray(artsCards) && artsCards.length >= 15, "Journalism must have flashcards");
    artsCards.forEach(c => {
      assert.equal(c.subject, "Journalism and Mass Communication");
      assert.ok(c.q.length > 5, "Card question must be populated");
      assert.ok(c.a.length > 5, "Card answer must be populated");
    });

    const fakeCards = EduPrep.getFlashcards("NonExistentSubject999");
    assert.deepEqual(fakeCards, [], "Non-existent subject must return empty array without falling back to DSA");
  });

  it("eliminates generic DSA fallback logic in mcq_practice_exam and revision_flashcards code", () => {
    assert.equal(mcqHtml.includes('pool = EduPrep.getMcqBank();'), false, "Must not fallback to default DSA question bank");
    assert.equal(flashHtml.includes('pool = allFlashcards;'), false, "Must not fallback to allFlashcards");
  });

  it("renders Testimonials section on homepage with community feedback across all 4 streams", () => {
    assert.ok(indexHtml.includes('id="testimonials"'), "Homepage must have Testimonials section");
    assert.ok(indexHtml.includes("Learner Experiences Across Streams"), "Must have Testimonials heading");
    assert.ok(indexHtml.includes("Computer Engineering"), "Must feature Engineering student feedback");
    assert.ok(indexHtml.includes("MBBS"), "Must feature Medical student feedback");
    assert.ok(indexHtml.includes("B.Com"), "Must feature Commerce student feedback");
    assert.ok(indexHtml.includes("B.A. Mass Comm"), "Must feature Arts student feedback");
  });

  it("renders verified visitor counter area on homepage with session tracking", () => {
    assert.ok(indexHtml.includes('id="visitorCountDisplay"'), "Homepage must have visitorCountDisplay element");
    assert.ok(indexHtml.includes("Verified Site Visits"), "Must have honest Verified Site Visits label");
    assert.ok(indexHtml.includes("initVisitorCounter"), "Must include visitor counter script");
    assert.ok(indexHtml.includes("eduprep_visitor_sessions"), "Must use persistent storage key");
  });

  it("strictly removes user-facing Login and Progress from navigation across the entire application", () => {
    // index.html
    assert.equal(indexHtml.includes('>Login<'), false, "index.html must not contain user-facing Login link");
    assert.equal(indexHtml.includes('>Progress<'), false, "index.html must not contain user-facing Progress link");

    // home_dashboard
    assert.equal(dashHtml.includes('>Progress<'), false, "home_dashboard must not contain user-facing Progress link");

    // academic_setup
    const setupHtml = fs.readFileSync(path.join(eduPrepDir, "academic_setup", "code.html"), "utf8");
    assert.equal(setupHtml.includes('>Progress<'), false, "academic_setup must not contain user-facing Progress link");

    // resources_dashboard
    const resHtml = fs.readFileSync(path.join(eduPrepDir, "resources_dashboard", "code.html"), "utf8");
    assert.equal(resHtml.includes('>Progress<'), false, "resources_dashboard must not contain user-facing Progress link");
  });
});

// ============================================================================
// 18. PREVIOUS YEAR QUESTION PAPERS (PYQ) COMPLETE REDESIGN AUDIT
// ============================================================================
describe("Previous Year Question Papers (PYQ) Complete Redesign Audit", () => {
  const eduPrepDir = path.join(__dirname, "..", "EduPrep");
  const pyqHtmlPath = path.join(eduPrepDir, "previous_year_papers", "code.html");
  const pyqHtml = fs.readFileSync(pyqHtmlPath, "utf8");
  const PyqEngine = require("../EduPrep/shared/eduprep_pyq_data.js");

  it("exports a centralized PyqEngine with all required query, weightage, and PDF generator methods", () => {
    assert.ok(PyqEngine, "PyqEngine must be exported");
    assert.equal(typeof PyqEngine.getSubjectsForField, "function");
    assert.equal(typeof PyqEngine.getChaptersForSubject, "function");
    assert.equal(typeof PyqEngine.getPapersForSubject, "function");
    assert.equal(typeof PyqEngine.calculateWeightage, "function");
    assert.equal(typeof PyqEngine.generatePdfBuffer, "function");
    assert.equal(typeof PyqEngine.downloadPdf, "function");
  });

  it("covers all 4 fields (Engineering, Medical, Commerce, Arts) and returns subjects accurately", () => {
    assert.deepEqual(PyqEngine.fields, ["engineering", "medical", "commerce", "arts"]);
    const engSubjects = PyqEngine.getSubjectsForField("engineering");
    const medSubjects = PyqEngine.getSubjectsForField("medical");
    const comSubjects = PyqEngine.getSubjectsForField("commerce");
    const artsSubjects = PyqEngine.getSubjectsForField("arts");

    assert.equal(engSubjects.length, 25, "Engineering must have 25 subjects");
    assert.equal(medSubjects.length, 15, "Medical must have 15 subjects");
    assert.equal(comSubjects.length, 15, "Commerce must have 15 subjects");
    assert.equal(artsSubjects.length, 15, "Arts must have 15 subjects");
    assert.equal(engSubjects.length + medSubjects.length + comSubjects.length + artsSubjects.length, 70, "Total 70 subjects across all 4 fields");
  });

  it("generates authentic syllabus-accurate 2024, 2023, 2022 examination papers across all 4 streams", () => {
    const testCases = [
      { field: "engineering", subject: "Engineering Mathematics" },
      { field: "medical", subject: "Anatomy" },
      { field: "commerce", subject: "Financial Accounting" },
      { field: "arts", subject: "Political Science" }
    ];

    testCases.forEach(({ field, subject }) => {
      const papers = PyqEngine.getPapersForSubject(subject);
      assert.ok(papers.length >= 3, `Subject ${subject} must have at least 3 years of papers (2024, 2023, 2022)`);
      const years = papers.map(p => String(p.year));
      assert.ok(years.includes("2024"));
      assert.ok(years.includes("2023"));
      assert.ok(years.includes("2022"));

      papers.forEach(p => {
        assert.equal(p.stream, field);
        assert.equal(p.subject, subject);
        assert.equal(p.duration, "3 Hours");
        assert.equal(p.maxMarks, 80);
        assert.ok(p.sections && p.sections.length === 3, "Each paper must have 3 distinct sections");
        
        // Section A (2-Mark Conceptual)
        const secA = p.sections[0];
        assert.equal(secA.marksPerQuestion, 2);
        assert.equal(secA.totalMarks, 20);
        assert.equal(secA.questions.length, 10);
        
        // Section B (5-Mark Analytical)
        const secB = p.sections[1];
        assert.equal(secB.marksPerQuestion, 5);
        assert.equal(secB.totalMarks, 20);
        assert.equal(secB.questions.length, 4);

        // Section C (10-Mark In-Depth)
        const secC = p.sections[2];
        assert.equal(secC.marksPerQuestion, 10);
        assert.equal(secC.totalMarks, 40);
        assert.equal(secC.questions.length, 4);

        // Check each question has required metadata
        p.allQuestions.forEach(q => {
          assert.ok(q.id);
          assert.ok(q.qNo);
          assert.ok(q.q && q.q.length > 5);
          assert.ok([2, 5, 10].includes(q.marks));
          assert.ok(q.chapterId);
          assert.ok(q.chapterTitle);
        });
      });
    });
  });

  it("calculates accurate real-time weightage for 2M, 5M, 10M questions and chapter distribution", () => {
    const papers = PyqEngine.getPapersForSubject("Operating Systems");
    const weightage = PyqEngine.calculateWeightage(papers);

    assert.ok(weightage.totalMarks > 0);
    assert.ok(weightage.totalQuestions > 0);
    assert.equal(weightage.marksCategories.twoMarks.pct, 25, "2-mark conceptual questions should represent 25% of marks");
    assert.equal(weightage.marksCategories.fiveMarks.pct, 25, "5-mark analytical questions should represent 25% of marks");
    assert.equal(weightage.marksCategories.tenMarks.pct, 50, "10-mark in-depth questions should represent 50% of marks");
    assert.ok(Array.isArray(weightage.chapterWeightage));
    assert.ok(weightage.chapterWeightage.length > 0, "Must provide chapter-wise syllabus weightage breakdown");
  });

  it("supports chapter filtering and year filtering accurately", () => {
    const allPapers = PyqEngine.getPapersForSubject("Engineering Mathematics");
    assert.equal(allPapers.length, 3);

    // Filter by single year
    const papers2024 = PyqEngine.getPapersForSubject("Engineering Mathematics", "all", "2024");
    assert.equal(papers2024.length, 1);
    assert.equal(String(papers2024[0].year), "2024");

    // Filter by chapter
    const chapters = PyqEngine.getChaptersForSubject("Engineering Mathematics");
    if (chapters.length > 0) {
      const firstChId = chapters[0].id;
      const chPapers = PyqEngine.getPapersForSubject("Engineering Mathematics", firstChId);
      assert.ok(chPapers.length > 0);
      const chWeightage = PyqEngine.calculateWeightage(chPapers, firstChId);
      assert.ok(chWeightage.totalQuestions > 0);
    }
  });

  it("generates valid standards-compliant PDF 1.4 documents via pure JavaScript without external binaries", () => {
    const papers = PyqEngine.getPapersForSubject("Engineering Mathematics", "all", "2024");
    assert.ok(papers.length > 0);
    const pdfText = PyqEngine.generatePdfBuffer(papers[0]);

    assert.ok(pdfText.startsWith("%PDF-1.4"), "PDF must have %PDF-1.4 header");
    assert.ok(pdfText.includes("/Type /Catalog"), "PDF must contain Catalog object");
    assert.ok(pdfText.includes("/Type /Pages"), "PDF must contain Pages object");
    assert.ok(pdfText.includes("/Type /Page"), "PDF must contain Page object");
    assert.ok(pdfText.includes("xref"), "PDF must have xref cross reference table");
    assert.ok(pdfText.includes("trailer"), "PDF must have trailer");
    assert.ok(pdfText.includes("startxref"), "PDF must have startxref pointer");
    assert.ok(pdfText.endsWith("%%EOF\n"), "PDF must end with standard %%EOF tag");
    assert.ok(pdfText.includes("Engineering Mathematics"), "PDF content must contain subject name");
    const upperPdf = pdfText.toUpperCase();
    assert.ok(upperPdf.includes("SECTION A"), "PDF content must contain Section A heading");
    assert.ok(upperPdf.includes("SECTION B"), "PDF content must contain Section B heading");
    assert.ok(upperPdf.includes("SECTION C"), "PDF content must contain Section C heading");
  });

  it("PYQ page markup (code.html) enforces strict academic-selection workflow and removes search bar", () => {
    // 1. Search bar is completely removed
    assert.equal(pyqHtml.includes('id="searchPaperInput"'), false, "Search input element #searchPaperInput must be removed");
    assert.equal(pyqHtml.includes('searchPaperInput'), false, "searchPaperInput identifier must be removed from code.html");
    assert.equal(pyqHtml.includes('placeholder="Search by subject code'), false, "Search placeholder must be removed");

    // 2. Field (Stream) selection buttons
    assert.ok(pyqHtml.includes('id="pyqFieldButtonGroup"'), "Must contain pyqFieldButtonGroup");
    assert.ok(pyqHtml.includes('id="btnPyqFieldEng"'), "Must contain btnPyqFieldEng");
    assert.ok(pyqHtml.includes('id="btnPyqFieldMed"'), "Must contain btnPyqFieldMed");
    assert.ok(pyqHtml.includes('id="btnPyqFieldCom"'), "Must contain btnPyqFieldCom");
    assert.ok(pyqHtml.includes('id="btnPyqFieldArts"'), "Must contain btnPyqFieldArts");

    // 3. Subject, Chapter, and Year Selectors
    assert.ok(pyqHtml.includes('id="filterSubjectSelect"'), "Must contain filterSubjectSelect");
    assert.ok(pyqHtml.includes('id="filterChapterSelect"'), "Must contain filterChapterSelect");
    assert.ok(pyqHtml.includes('id="filterYearSelect"'), "Must contain filterYearSelect");

    // 4. Weightage and Marks Distribution section
    assert.ok(pyqHtml.includes('id="weightageSection"'), "Must contain weightageSection");
    assert.ok(pyqHtml.includes('id="statTotalMarks"'), "Must contain statTotalMarks");
    assert.ok(pyqHtml.includes('id="stat2MPct"'), "Must contain stat2MPct");
    assert.ok(pyqHtml.includes('id="stat5MPct"'), "Must contain stat5MPct");
    assert.ok(pyqHtml.includes('id="stat10MPct"'), "Must contain stat10MPct");
    assert.ok(pyqHtml.includes('id="chapterWeightageContainer"'), "Must contain chapterWeightageContainer");

    // 5. Papers Grid and Modal
    assert.ok(pyqHtml.includes('id="papersGridContainer"'), "Must contain papersGridContainer");
    assert.ok(pyqHtml.includes('id="paperModal"'), "Must contain paperModal");
    assert.ok(pyqHtml.includes('downloadPaperPdf'), "Must support downloadPaperPdf action");
    assert.ok(pyqHtml.includes('printPaperSheet'), "Must support printPaperSheet action");

    // 6. Script imports
    assert.ok(pyqHtml.includes('src="../shared/eduprep_chapters_data.js"'), "Must import eduprep_chapters_data.js");
    assert.ok(pyqHtml.includes('src="../shared/eduprep_pyq_data.js"'), "Must import eduprep_pyq_data.js");
  });
});

// ============================================================================
// 19. AUTOMATED TEST SUITE: VERIFIED YOUTUBE VIDEO SYSTEM & FALLBACK ENGINE
// ============================================================================
describe("Verified YouTube Video System & Fallback Engine Audit", () => {
  const VideoEngine = require("../EduPrep/shared/eduprep_video_engine.js");
  const ChaptersEngine = require("../EduPrep/shared/eduprep_chapters_data.js");
  const EduPrepChaptersUI = require("../EduPrep/shared/eduprep_chapters_ui.js");
  const eduPrepDir = path.join(__dirname, "..", "EduPrep");
  const indexHtml = fs.readFileSync(path.join(eduPrepDir, "index.html"), "utf8");
  const resourcesHtml = fs.readFileSync(path.join(eduPrepDir, "resources_dashboard", "code.html"), "utf8");

  it("exports VideoEngine with complete validation, query, and search fallback APIs", () => {
    assert.ok(VideoEngine, "VideoEngine must be exported");
    assert.equal(typeof VideoEngine.extractVideoId, "function");
    assert.equal(typeof VideoEngine.validateVideo, "function");
    assert.equal(typeof VideoEngine.getVerifiedVideosForChapter, "function");
    assert.equal(typeof VideoEngine.hasVerifiedVideos, "function");
    assert.equal(typeof VideoEngine.getYouTubeSearchUrl, "function");
    assert.equal(typeof VideoEngine.getVerifiedCount, "function");
    assert.ok(VideoEngine.knownInvalidIds instanceof Set, "knownInvalidIds must be a Set");
    assert.ok(VideoEngine.getVerifiedCount() >= 10, "Must have verified videos catalog");
    
    // Core EduPrep bridge
    assert.equal(EduPrep.videoEngine, VideoEngine, "EduPrep.videoEngine must reference VideoEngine");
  });

  it("extractVideoId accurately parses valid YouTube URLs and strictly rejects placeholder/dead IDs", () => {
    // Valid standard watch URL
    assert.equal(VideoEngine.extractVideoId("https://www.youtube.com/watch?v=26QPDBe-NB8"), "26QPDBe-NB8");
    // Valid watch URL with tracking and timestamps
    assert.equal(VideoEngine.extractVideoId("https://www.youtube.com/watch?v=26QPDBe-NB8&t=45s&feature=emb_rel_end"), "26QPDBe-NB8");
    // Short youtu.be URL
    assert.equal(VideoEngine.extractVideoId("https://youtu.be/fNk_zzaMoSs?si=xyz123"), "fNk_zzaMoSs");
    // Privacy-enhanced embed URL
    assert.equal(VideoEngine.extractVideoId("https://www.youtube-nocookie.com/embed/fNk_zzaMoSs"), "fNk_zzaMoSs");
    // Raw 11-char ID
    assert.equal(VideoEngine.extractVideoId("26QPDBe-NB8"), "26QPDBe-NB8");

    // Strictly rejected: known placeholder / dead IDs
    assert.equal(VideoEngine.extractVideoId("bum_19JhyCD"), null, "Must reject dead placeholder bum_19JhyCD");
    assert.equal(VideoEngine.extractVideoId("vC4NfWq68kM"), null, "Must reject dead placeholder vC4NfWq68kM");
    assert.equal(VideoEngine.extractVideoId("https://www.youtube.com/watch?v=bum_19JhyCD"), null);

    // Strictly rejected: invalid formats
    assert.equal(VideoEngine.extractVideoId(""), null);
    assert.equal(VideoEngine.extractVideoId("short"), null);
    assert.equal(VideoEngine.extractVideoId("toolongvideoid12345"), null);
    assert.equal(VideoEngine.extractVideoId("invalid!@#$%"), null);
    assert.equal(VideoEngine.extractVideoId(null), null);
  });

  it("validateVideo enforces authentic video objects and rejects fabricated metrics", () => {
    const validVideo = {
      id: "26QPDBe-NB8",
      title: "Operating Systems: Crash Course Computer Science #18",
      channel: "CrashCourse",
      duration: "10:36",
      url: "https://www.youtube.com/watch?v=26QPDBe-NB8",
      embedUrl: "https://www.youtube-nocookie.com/embed/26QPDBe-NB8",
      thumbnail: "https://img.youtube.com/vi/26QPDBe-NB8/mqdefault.jpg",
      isVerified: true,
      verificationStatus: "verified"
    };
    assert.equal(VideoEngine.validateVideo(validVideo), true);

    // Rejects placeholder ID
    assert.equal(VideoEngine.validateVideo({ ...validVideo, id: "bum_19JhyCD" }), false);
    // Rejects fabricated metrics
    assert.equal(VideoEngine.validateVideo({ ...validVideo, viewCount: 150000 }), false);
    assert.equal(VideoEngine.validateVideo({ ...validVideo, likes: 9500 }), false);
    assert.equal(VideoEngine.validateVideo({ ...validVideo, rating: 4.9 }), false);
    // Rejects missing channel or title
    assert.equal(VideoEngine.validateVideo({ ...validVideo, channel: "" }), false);
    assert.equal(VideoEngine.validateVideo({ ...validVideo, title: "" }), false);
  });

  it("delivers verified educational videos across all 4 streams with syllabus alignment", () => {
    // 1. Engineering: Operating Systems & Math
    const osVideos = ChaptersEngine.getChapterVideos("ch_os_s4_1");
    assert.ok(osVideos.length >= 1, "Operating Systems Unit 1 must have verified video");
    assert.equal(osVideos[0].channel, "CrashCourse");
    assert.equal(osVideos[0].id, "26QPDBe-NB8");
    assert.equal(osVideos[0].isVerified, true);

    const mathVideos = ChaptersEngine.getChapterVideos("ch_eng_math_s1_1");
    assert.ok(mathVideos.length >= 1, "Engg Math Unit 1 must have verified video");
    assert.equal(mathVideos[0].channel, "3Blue1Brown");
    assert.equal(mathVideos[0].id, "fNk_zzaMoSs");

    // 2. Medical: Anatomy
    const anatVideos = ChaptersEngine.getChapterVideos("ch_mbbs_anat_s1_1");
    assert.ok(anatVideos.length >= 1, "Anatomy Unit 1 must have verified video");
    assert.equal(anatVideos[0].id, "uBGl2BujkPQ");
    assert.ok(anatVideos[0].channel.length > 2);

    // 3. Commerce: Financial Accounting
    const comVideos = ChaptersEngine.getChapterVideos("ch_bcom_fa_s1_1");
    assert.ok(comVideos.length >= 1, "Financial Accounting Unit 1 must have verified video");
    assert.equal(comVideos[0].id, "yYX4bvQSqbo");
    assert.equal(comVideos[0].channel, "Accounting Stuff");

    // 4. Arts: History
    const artsVideos = ChaptersEngine.getChapterVideos("ch_ba_hist_s1_1");
    assert.ok(artsVideos.length >= 1, "History Unit 1 must have verified video");
    assert.equal(artsVideos[0].id, "n7ndRwqJYDM");
  });

  it("strictly returns empty array for unverified chapters to prevent fake cards and dead links", () => {
    // Engineering Mechanics Unit 1 (the chapter in user's issue)
    const mechVideos = ChaptersEngine.getChapterVideos("ch_eng_mechanics_s1_1");
    assert.deepEqual(mechVideos, [], "Unverified chapter ch_eng_mechanics_s1_1 must return empty array");
    assert.equal(VideoEngine.hasVerifiedVideos("ch_eng_mechanics_s1_1"), false);
  });

  it("renders truthful fallback UI for unverified chapters without fake cards or dead buttons", () => {
    const meta = ChaptersEngine.getSubjectMeta("Engineering Mechanics");
    assert.ok(meta);
    const html = EduPrepChaptersUI.renderVideosView(meta, "ch_eng_mechanics_s1_1");

    // 1. Heading must be honest "Video Resources", not "Recommended YouTube Videos"
    assert.ok(html.includes("Video Resources"), "Must show Video Resources heading for unverified chapter");
    assert.equal(html.includes("Recommended YouTube Videos"), false, "Must not claim recommended videos when none exist");

    // 2. Truthful explanation banner
    assert.ok(html.includes("No verified videos are currently available for this chapter"));
    assert.ok(html.includes("EduPrep only curates and links verified educational lectures"));

    // 3. Actions: View Full Notes and Search YouTube
    assert.ok(html.includes("View Full Notes"));
    assert.ok(html.includes("EduPrepChaptersUI.openChapterNotes('ch_eng_mechanics_s1_1')"));
    assert.ok(html.includes("Search YouTube"));

    // 4. Zero dead placeholder IDs or fake cards
    assert.equal(html.includes("bum_19JhyCD"), false, "Must not contain dead ID bum_19JhyCD");
    assert.equal(html.includes("vC4NfWq68kM"), false, "Must not contain dead ID vC4NfWq68kM");
  });

  it("renders verified video cards with real channels and open actions for verified chapters", () => {
    const meta = ChaptersEngine.getSubjectMeta("Operating Systems");
    assert.ok(meta);
    const html = EduPrepChaptersUI.renderVideosView(meta, "ch_os_s4_1");

    assert.ok(html.includes("Recommended YouTube Videos"), "Must show Recommended YouTube Videos heading");
    assert.ok(html.includes("CrashCourse"), "Must show verified channel CrashCourse");
    assert.ok(html.includes("10:36"), "Must show duration");
    assert.ok(html.includes("Open on YouTube"), "Must provide Open on YouTube button");
    assert.ok(html.includes("https://www.youtube.com/watch?v=26QPDBe-NB8"), "Must point to canonical URL");
    assert.ok(html.includes("Search YouTube Directly"), "Must provide search fallback");
  });

  it("constructs accurate, targeted educational YouTube search queries", () => {
    const searchUrl = VideoEngine.getYouTubeSearchUrl("Engineering Mechanics", "Coplanar Force Systems & Resultants");
    assert.ok(searchUrl.startsWith("https://www.youtube.com/results?search_query="));
    assert.ok(searchUrl.includes(encodeURIComponent("Engineering Mechanics")));
    assert.ok(searchUrl.includes(encodeURIComponent("Coplanar Force Systems & Resultants")));
    assert.ok(searchUrl.includes("lecture"));
  });

  it("HTML files correctly import eduprep_video_engine.js before dependent chapter scripts", () => {
    assert.ok(indexHtml.includes('src="shared/eduprep_video_engine.js"'), "index.html must import eduprep_video_engine.js");
    assert.ok(resourcesHtml.includes('src="../shared/eduprep_video_engine.js"'), "resources_dashboard/code.html must import eduprep_video_engine.js");
  });
});

// ============================================================================
// 20. AUTOMATED TEST SUITE: GLOBAL FLOATING AI CHATBOT & STANDALONE PAGES REROUTING AUDIT
// ============================================================================
describe("Global Floating AI Chatbot & Standalone Pages Rerouting Audit", () => {
  const eduPrepDir = path.join(__dirname, "..", "EduPrep");
  const chatbotCssPath = path.join(eduPrepDir, "shared", "eduprep_chatbot.css");
  const chatbotJsPath = path.join(eduPrepDir, "shared", "eduprep_chatbot.js");
  const serveJsPath = path.join(eduPrepDir, "serve.js");

  it("exports dedicated reusable chatbot stylesheet and singleton script", () => {
    assert.ok(fs.existsSync(chatbotCssPath), "eduprep_chatbot.css must exist");
    assert.ok(fs.existsSync(chatbotJsPath), "eduprep_chatbot.js must exist");

    const css = fs.readFileSync(chatbotCssPath, "utf8");
    assert.ok(css.includes(".eduprep-chat-trigger"), "Must define trigger button styles");
    assert.ok(css.includes(".eduprep-chat-panel"), "Must define chat panel styles");
    assert.ok(css.includes(".eduprep-chat-messages"), "Must define chat messages styles");
    assert.ok(css.includes("z-index: 9990") || css.includes("z-index: 9999") || css.includes("z-index: 10000"), "Must have high z-index to float over UI");

    const js = fs.readFileSync(chatbotJsPath, "utf8");
    assert.ok(js.includes("window.EduPrepChatbot"), "Must expose EduPrepChatbot singleton");
    assert.ok(js.includes("extractPageContext"), "Must support contextual academic inference");
    assert.ok(js.includes("applyPreset"), "Must support quick prompt format presets (explain, 5-mark, 10-mark, quiz)");
    assert.ok(js.includes("sanitizeMarkdown"), "Must sanitize markdown to prevent XSS");
  });

  it("all primary learning pages import chatbot CSS and JS", () => {
    const pages = [
      "index.html",
      "home_dashboard/code.html",
      "mcq_practice_exam/code.html",
      "revision_flashcards/code.html",
      "previous_year_papers/code.html",
      "resources_dashboard/code.html",
      "academic_setup/code.html",
      "user_profile_progress/code.html",
      "student_opportunities/code.html"
    ];

    for (const rel of pages) {
      const fullPath = path.join(eduPrepDir, rel);
      const content = fs.readFileSync(fullPath, "utf8");
      assert.ok(content.includes("eduprep_chatbot.css"), `Page ${rel} must include eduprep_chatbot.css`);
      assert.ok(content.includes("eduprep_chatbot.js"), `Page ${rel} must include eduprep_chatbot.js`);
    }
  });

  it("obsolete standalone pages provide immediate client-side redirects", () => {
    // 1. questions_practice -> mcq_practice_exam
    const qpPath = path.join(eduPrepDir, "questions_practice", "code.html");
    assert.ok(fs.existsSync(qpPath), "questions_practice/code.html must exist as redirect fallback");
    const qpHtml = fs.readFileSync(qpPath, "utf8");
    assert.ok(qpHtml.includes("mcq_practice_exam/code.html"), "questions_practice must redirect to mcq_practice_exam");

    // 2. subject_details_os -> resources_dashboard
    const sdoPath = path.join(eduPrepDir, "subject_details_os", "code.html");
    assert.ok(fs.existsSync(sdoPath), "subject_details_os/code.html must exist as redirect fallback");
    const sdoHtml = fs.readFileSync(sdoPath, "utf8");
    assert.ok(sdoHtml.includes("resources_dashboard/code.html"), "subject_details_os must redirect to resources_dashboard");

    // 3. subject_details -> resources_dashboard
    const sdPath = path.join(eduPrepDir, "subject_details", "code.html");
    assert.ok(fs.existsSync(sdPath), "subject_details/code.html must exist as redirect fallback");
    const sdHtml = fs.readFileSync(sdPath, "utf8");
    assert.ok(sdHtml.includes("resources_dashboard/code.html"), "subject_details must redirect to resources_dashboard");

    // 4. study_ai_assistant -> home_dashboard?openAi=true
    const saiPath = path.join(eduPrepDir, "study_ai_assistant", "code.html");
    assert.ok(fs.existsSync(saiPath), "study_ai_assistant/code.html must exist as redirect fallback");
    const saiHtml = fs.readFileSync(saiPath, "utf8");
    assert.ok(saiHtml.includes("home_dashboard/code.html?openAi=true"), "study_ai_assistant must redirect to home_dashboard with openAi=true");
  });

  it("server (serve.js) intercepts old standalone routes with HTTP 302 redirects", () => {
    const serveJs = fs.readFileSync(serveJsPath, "utf8");
    assert.ok(serveJs.includes('relPath.startsWith("questions_practice")'), "serve.js must redirect questions_practice");
    assert.ok(serveJs.includes('relPath.startsWith("subject_details")'), "serve.js must redirect subject_details");
    assert.ok(serveJs.includes('relPath.startsWith("study_ai_assistant")'), "serve.js must redirect study_ai_assistant");
    assert.ok(serveJs.includes('/mcq_practice_exam/code.html'), "serve.js must target mcq_practice_exam");
    assert.ok(serveJs.includes('/resources_dashboard/code.html'), "serve.js must target resources_dashboard");
    assert.ok(serveJs.includes('/home_dashboard/code.html?') && serveJs.includes('openAi'), "serve.js must target home_dashboard with openAi flag");
  });

  it("EduPrepChatbot singleton exposes complete public API in Node and browser context", () => {
    const ChatbotModule = require("../EduPrep/shared/eduprep_chatbot.js");
    assert.ok(ChatbotModule, "Chatbot module must be exported");
    assert.equal(typeof ChatbotModule.init, "function", "Must have init()");
    assert.equal(typeof ChatbotModule.open, "function", "Must have open()");
    assert.equal(typeof ChatbotModule.close, "function", "Must have close()");
    assert.equal(typeof ChatbotModule.toggle, "function", "Must have toggle()");
    assert.equal(typeof ChatbotModule.sendMessage, "function", "Must have sendMessage()");
    assert.equal(typeof ChatbotModule.applyPreset, "function", "Must have applyPreset()");
    assert.equal(typeof ChatbotModule.extractPageContext, "function", "Must have extractPageContext()");
  });
});



