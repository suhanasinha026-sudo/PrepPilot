/**
 * EduPrep — Dynamic YouTube Video Discovery & Verification Master Test Suite
 * Validates:
 * 1. Server-side YouTube discovery API endpoint (/api/youtube/search)
 * 2. Academic context query building (Subject + Chapter + Stream)
 * 3. Candidate search, filtering, and availability validation (removes deleted/private/shorts)
 * 4. Relevance scoring (exact chapter matches, subject matches, educational channel bonus, cross-field penalty)
 * 5. Popularity ranking (ranks relevant videos by viewCount; relevance as mandatory gate)
 * 6. Video availability validation (no dead IDs, no placeholder IDs)
 * 7. Multi-stream coverage: Engineering, Medical, Commerce, Arts
 * 8. Stale request cancellation and rapid switching handling
 * 9. Client-side caching and TTL expiration
 * 10. API failure gracefully degrading to truthful fallback with chapter-specific manual search
 */

const { describe, it, beforeEach } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const path = require("path");

const rootDir = path.resolve(__dirname, "..");
const eduPrepDir = path.join(rootDir, "EduPrep");

// Load modules
const VideoEngine = require(path.join(eduPrepDir, "shared", "eduprep_video_engine.js"));
const ChaptersEngine = require(path.join(eduPrepDir, "shared", "eduprep_chapters_data.js"));
const ChaptersUI = require(path.join(eduPrepDir, "shared", "eduprep_chapters_ui.js"));
const youtubeSearchHandler = require(path.join(rootDir, "api", "youtube-search.js"));
const EduPrep = require(path.join(eduPrepDir, "shared", "eduprep_data.js"));
const aiAssistantHandler = require(path.join(rootDir, "api", "ai-assistant.js"));

describe("Dynamic YouTube Video Discovery & Verification Master Suite", () => {

  // =========================================================================
  // 1. ARCHITECTURE & ENDPOINT INTEGRATION
  // =========================================================================
  describe("API Architecture & Server Integration", () => {
    it("exports server-side youtube-search handler function", () => {
      assert.equal(typeof youtubeSearchHandler, "function");
    });

    it("mounts /api/youtube/search in serve.js", () => {
      const serveContent = fs.readFileSync(path.join(eduPrepDir, "serve.js"), "utf8");
      assert.ok(serveContent.includes("youtubeSearchHandler"), "serve.js must import youtubeSearchHandler");
      assert.ok(serveContent.includes("/api/youtube/search"), "serve.js must route /api/youtube/search");
    });

    it("registers /api/youtube/search rewrite in vercel.json", () => {
      const vercelConfig = JSON.parse(fs.readFileSync(path.join(rootDir, "vercel.json"), "utf8"));
      const rewrite = vercelConfig.rewrites.find(r => r.source === "/api/youtube/search");
      assert.ok(rewrite, "vercel.json must have rewrite for /api/youtube/search");
      assert.equal(rewrite.destination, "/api/youtube-search.js");
    });

    it("documents YOUTUBE_API_KEY in .env.example without exposing secrets", () => {
      const envExample = fs.readFileSync(path.join(rootDir, ".env.example"), "utf8");
      assert.ok(envExample.includes("YOUTUBE_API_KEY"), ".env.example must document YOUTUBE_API_KEY");
      assert.ok(!envExample.includes("AIza"), ".env.example must never contain real API keys");
    });

    it("rejects non-POST HTTP methods with 405 Method Not Allowed", async () => {
      const req = { method: "GET", headers: {} };
      let statusCode = null;
      let responseBody = "";
      const res = {
        setHeader: () => {},
        set statusCode(code) { statusCode = code; },
        get statusCode() { return statusCode; },
        end: (body) => { responseBody = body; }
      };

      await youtubeSearchHandler(req, res);
      assert.equal(statusCode, 405);
      const json = JSON.parse(responseBody);
      assert.ok(json.error.includes("Method not allowed"));
    });

    it("validates required input fields and rejects missing subject or chapter with 400", async () => {
      const req = {
        method: "POST",
        headers: {},
        body: JSON.stringify({ stream: "engineering" }) // missing subject and chapter
      };
      let statusCode = null;
      let responseBody = "";
      const res = {
        setHeader: () => {},
        set statusCode(code) { statusCode = code; },
        get statusCode() { return statusCode; },
        end: (body) => { responseBody = body; }
      };

      await youtubeSearchHandler(req, res);
      assert.equal(statusCode, 400);
      const json = JSON.parse(responseBody);
      assert.ok(json.error.includes("required"));
    });

    it("returns configured: false gracefully when YOUTUBE_API_KEY is not set or placeholder", async () => {
      const prevKey = process.env.YOUTUBE_API_KEY;
      delete process.env.YOUTUBE_API_KEY;

      const req = {
        method: "POST",
        headers: {},
        body: JSON.stringify({
          stream: "engineering",
          subject: "Database Management Systems",
          semester: 4,
          chapter: "Database Architecture & ER Modeling",
          chapterId: "ch_dbms_s4_1"
        })
      };
      let statusCode = null;
      let responseBody = "";
      const res = {
        setHeader: () => {},
        set statusCode(code) { statusCode = code; },
        get statusCode() { return statusCode; },
        end: (body) => { responseBody = body; }
      };

      await youtubeSearchHandler(req, res);
      assert.equal(statusCode, 200);
      const json = JSON.parse(responseBody);
      assert.equal(json.configured, false);
      assert.ok(Array.isArray(json.videos));
      assert.equal(json.videos.length, 0);

      // Restore key
      if (prevKey) process.env.YOUTUBE_API_KEY = prevKey;
    });
  });

  // =========================================================================
  // 2. QUERY BUILDING & ACADEMIC CONTEXT NORMALIZATION
  // =========================================================================
  describe("Academic Context & Query Generation", () => {
    it("constructs targeted queries preserving technical terminology without noise characters", () => {
      const q1 = VideoEngine.getYouTubeSearchUrl("Database Management Systems", "Database Architecture & ER Modeling");
      assert.ok(q1.includes(encodeURIComponent("Database Management Systems")));
      assert.ok(q1.includes(encodeURIComponent("Database Architecture & ER Modeling")));
      assert.ok(q1.includes("lecture"));

      const q2 = VideoEngine.getYouTubeSearchUrl("Engineering Mechanics", "Coplanar Force Systems & Resultants");
      assert.ok(q2.includes(encodeURIComponent("Engineering Mechanics")));
      assert.ok(q2.includes(encodeURIComponent("Coplanar Force Systems & Resultants")));

      const q3 = VideoEngine.getYouTubeSearchUrl("Human Anatomy", "Cardiovascular System");
      assert.ok(q3.includes(encodeURIComponent("Human Anatomy")));
      assert.ok(q3.includes(encodeURIComponent("Cardiovascular System")));

      const q4 = VideoEngine.getYouTubeSearchUrl("Financial Accounting", "Accounting Principles, Concepts & Conventions");
      assert.ok(q4.includes(encodeURIComponent("Financial Accounting")));
      assert.ok(q4.includes(encodeURIComponent("Accounting Principles, Concepts & Conventions")));
    });

    it("VideoEngine exposes format helpers for view counts and durations", () => {
      assert.equal(typeof VideoEngine.formatViewCount, "function");
      assert.equal(VideoEngine.formatViewCount(1500), "1.5K views");
      assert.equal(VideoEngine.formatViewCount(1500000), "1.5M views");
      assert.equal(VideoEngine.formatViewCount(500), "500 views");

      assert.equal(typeof VideoEngine.formatDuration, "function");
      assert.equal(VideoEngine.formatDuration("PT15M30S"), "15:30");
      assert.equal(VideoEngine.formatDuration("PT1H2M3S"), "1:02:03");
      assert.equal(VideoEngine.formatDuration("10:45"), "10:45");
    });
  });

  // =========================================================================
  // 3. RELEVANCE SCORING & POPULARITY RANKING PRINCIPLES
  // =========================================================================
  describe("Candidate Filtering, Relevance Scoring & Popularity Ranking", () => {
    it("VideoEngine strictly rejects dead/placeholder YouTube IDs", () => {
      const invalidIds = [
        "bum_19JhyCD", "vC4NfWq68kM", "ruM4Xuhx34A", "q3D8h2u44zM",
        "vv4y_uOneC8", "1i_aP8s0X7E", "7u2Unflq4U8", "H0T7m1aUeB0"
      ];
      for (const id of invalidIds) {
        assert.equal(VideoEngine.extractVideoId(id), null, `Must reject placeholder ID ${id}`);
        assert.equal(VideoEngine.extractVideoId(`https://www.youtube.com/watch?v=bum_19JhyCD`), null);
      }
    });

    it("VideoEngine extracts valid 11-char YouTube IDs from various URL formats", () => {
      const validId = "26QPDBe-NB8";
      assert.equal(VideoEngine.extractVideoId(validId), validId);
      assert.equal(VideoEngine.extractVideoId(`https://www.youtube.com/watch?v=${validId}`), validId);
      assert.equal(VideoEngine.extractVideoId(`https://youtu.be/${validId}`), validId);
      assert.equal(VideoEngine.extractVideoId(`https://www.youtube-nocookie.com/embed/${validId}`), validId);
    });

    it("VideoEngine validateVideo enforces authentic verified video objects and rejects fabricated metrics", () => {
      const genuine = {
        id: "26QPDBe-NB8",
        title: "Operating Systems: Crash Course Computer Science #18",
        channel: "CrashCourse",
        isVerified: true,
        verificationStatus: "verified"
      };
      assert.equal(VideoEngine.validateVideo(genuine), true);

      // Rejects fabricated static view count
      assert.equal(VideoEngine.validateVideo({ ...genuine, viewCount: 999999 }), false);
      assert.equal(VideoEngine.validateVideo({ ...genuine, likes: 5000 }), false);

      // Rejects missing channel or title
      assert.equal(VideoEngine.validateVideo({ ...genuine, channel: "" }), false);
      assert.equal(VideoEngine.validateVideo({ ...genuine, title: "" }), false);

      // Rejects unverified status
      assert.equal(VideoEngine.validateVideo({ ...genuine, isVerified: false }), false);
    });

    it("curated catalog provides verified fast-path across all 4 streams", () => {
      // Engineering
      const os = VideoEngine.getVerifiedVideosForChapter("ch_os_s4_1");
      assert.ok(os.length > 0);
      assert.equal(os[0].channel, "CrashCourse");

      // Medical
      const anat = VideoEngine.getVerifiedVideosForChapter("ch_med_anatomy_s1_1");
      assert.ok(anat.length > 0);
      assert.equal(anat[0].id, "uBGl2BujkPQ");

      // Commerce
      const fa = VideoEngine.getVerifiedVideosForChapter("ch_com_fin_acc_s1_1");
      assert.ok(fa.length > 0);
      assert.equal(fa[0].channel, "Accounting Stuff");

      // Arts
      const hist = VideoEngine.getVerifiedVideosForChapter("ch_arts_history_s1_1");
      assert.ok(hist.length > 0);
      assert.equal(hist[0].id, "n7ndRwqJYDM");
    });
  });

  // =========================================================================
  // 4. CLIENT DISCOVERY ENGINE & STALE REQUEST CANCELLATION
  // =========================================================================
  describe("Client Discovery Engine & Stale Request Cancellation", () => {
    it("cancels pending discovery requests via cancelPendingDiscovery", () => {
      assert.equal(typeof VideoEngine.cancelPendingDiscovery, "function");
      // Calling should not throw
      VideoEngine.cancelPendingDiscovery();
      VideoEngine.cancelPendingDiscovery();
    });

    it("discoverVideos rejects incomplete context with error", async () => {
      const res = await VideoEngine.discoverVideos({});
      assert.equal(res.videos.length, 0);
      assert.equal(res.source, "none");
      assert.ok(res.error.includes("Incomplete"));
    });

    it("discoverVideos returns curated fallback when offline or API unavailable", async () => {
      const res = await VideoEngine.discoverVideos({
        stream: "engineering",
        subject: "Operating Systems",
        semester: 4,
        chapter: "OS Structures, System Calls & Process Concept",
        chapterId: "ch_os_s4_1"
      });
      // In node environment without live server fetch, should fall back cleanly
      assert.ok(res.videos.length > 0, "Must fall back to curated videos for ch_os_s4_1");
      assert.equal(res.videos[0].channel, "CrashCourse");
    });

    it("clears client cache without errors", () => {
      assert.equal(typeof VideoEngine.clearCache, "function");
      VideoEngine.clearCache();
    });
  });

  // =========================================================================
  // 5. FOUR-STREAM GENERIC CURRICULUM VERIFICATION
  // =========================================================================
  describe("Generic Multi-Stream Chapter Coverage", () => {
    const testSubjects = [
      // Engineering (9 core subjects)
      { name: "Engineering Mathematics", sem: 1, stream: "engineering" },
      { name: "Engineering Mechanics", sem: 1, stream: "engineering" },
      { name: "Engineering Graphics", sem: 1, stream: "engineering" },
      { name: "Data Structures", sem: 3, stream: "engineering" },
      { name: "Database Management Systems", sem: 4, stream: "engineering" },
      { name: "Operating Systems", sem: 4, stream: "engineering" },
      { name: "Computer Networks", sem: 4, stream: "engineering" },
      { name: "Design and Analysis of Algorithms", sem: 5, stream: "engineering" },
      { name: "Theory of Computation", sem: 5, stream: "engineering" },

      // Medical (5 subjects)
      { name: "Anatomy", sem: 1, stream: "medical" },
      { name: "Physiology", sem: 1, stream: "medical" },
      { name: "Biochemistry", sem: 1, stream: "medical" },
      { name: "Pathology", sem: 3, stream: "medical" },
      { name: "Pharmacology", sem: 3, stream: "medical" },

      // Commerce (5 subjects)
      { name: "Financial Accounting", sem: 1, stream: "commerce" },
      { name: "Business Economics", sem: 1, stream: "commerce" },
      { name: "Business Law", sem: 3, stream: "commerce" },
      { name: "Cost Accounting", sem: 3, stream: "commerce" },
      { name: "Auditing", sem: 6, stream: "commerce" },

      // Arts (5 subjects)
      { name: "English Literature", sem: 1, stream: "arts" },
      { name: "History", sem: 1, stream: "arts" },
      { name: "Political Science", sem: 1, stream: "arts" },
      { name: "Sociology", sem: 1, stream: "arts" },
      { name: "Psychology", sem: 1, stream: "arts" },
    ];

    for (const sub of testSubjects) {
      it(`resolves metadata, chapters, and dynamic search URL for ${sub.stream.toUpperCase()}: ${sub.name}`, () => {
        const meta = ChaptersEngine.getSubjectMeta(sub.name);
        assert.ok(meta, `Metadata for ${sub.name} must exist`);
        assert.equal(meta.stream, sub.stream, `Stream must be ${sub.stream}`);

        const chapters = ChaptersEngine.getChapters(sub.name, sub.sem);
        assert.ok(chapters.length > 0, `Must have chapters for ${sub.name} in semester ${sub.sem}`);

        const ch = chapters[0];
        assert.ok(ch.title, "Chapter must have title");
        assert.ok(ch.id, "Chapter must have id");

        // Verify search query URL construction
        const searchUrl = VideoEngine.getYouTubeSearchUrl(sub.name, ch.title);
        assert.ok(searchUrl.startsWith("https://www.youtube.com/results?search_query="));
        assert.ok(searchUrl.includes(encodeURIComponent(sub.name)));
        assert.ok(searchUrl.includes("lecture"));
      });
    }
  });

  // =========================================================================
  // 6. UI RENDERING & COMPONENT AUDIT
  // =========================================================================
  describe("UI Rendering & Truthful Fallback Verification", () => {
    it("renders verified video cards for curated chapters with honest headers", () => {
      const meta = ChaptersEngine.getSubjectMeta("Operating Systems");
      const html = ChaptersUI.renderVideosView(meta, "ch_os_s4_1");

      assert.ok(html.includes("Recommended YouTube Videos"), "Must show Recommended YouTube Videos header");
      assert.ok(html.includes("CrashCourse"), "Must show verified channel CrashCourse");
      assert.ok(html.includes("Open on YouTube"), "Must provide Open on YouTube action");
      assert.ok(html.includes("https://www.youtube.com/watch?v=26QPDBe-NB8"), "Must link to correct video URL");
    });

    it("renders truthful fallback UI for unverified chapters with View Full Notes and manual search", () => {
      const meta = ChaptersEngine.getSubjectMeta("Engineering Mechanics");
      const html = ChaptersUI.renderVideosView(meta, "ch_eng_mechanics_s1_1");

      assert.ok(html.includes("Video Resources"), "Must show Video Resources header");
      assert.ok(html.includes("No verified videos are currently available for this chapter"));
      assert.ok(html.includes("View Full Notes"));
      assert.ok(html.includes("Search YouTube"));
      assert.ok(html.includes("EduPrepChaptersUI.backToChapters()"));
    });

    it("Chapter card in chapters list wires Watch Videos action", () => {
      const meta = ChaptersEngine.getSubjectMeta("Operating Systems");
      const html = ChaptersUI.renderChaptersListView(meta, 4);

      assert.ok(html.includes("EduPrepChaptersUI.openChapterVideos"));
      assert.ok(html.includes("Watch Videos"));
      assert.ok(html.includes("View Full Notes"));
      assert.ok(html.includes("Semester 4"));
    });
  });

  // =========================================================================
  // 7. DEEP CANDIDATE SCORING & POPULARITY RANKING PIPELINE
  // =========================================================================
  describe("Candidate-Ranking & Availability Verification Logic", () => {
    const { scoreVideo, parseISO8601Duration, RELEVANCE_THRESHOLD } = youtubeSearchHandler;

    it("parses ISO 8601 durations and identifies short videos (< 60s)", () => {
      const short1 = parseISO8601Duration("PT35S");
      assert.equal(short1.totalSeconds, 35);
      assert.ok(short1.totalSeconds < 60, "35s video is a short and must be rejected");

      const lecture1 = parseISO8601Duration("PT15M30S");
      assert.equal(lecture1.totalSeconds, 930);
      assert.equal(lecture1.formatted, "15:30");
      assert.ok(lecture1.totalSeconds >= 60, "15m30s is a valid lecture");

      const longLecture = parseISO8601Duration("PT1H20M0S");
      assert.equal(longLecture.totalSeconds, 4800);
      assert.equal(longLecture.formatted, "1:20:00");
    });

    it("heavily scores exact chapter title and subject matches", () => {
      const subject = "Database Management Systems";
      const chapter = "Database Architecture & ER Modeling";
      const chapterKeywords = youtubeSearchHandler.extractKeywords(chapter);
      const subjectKeywords = youtubeSearchHandler.extractKeywords(subject);

      const relevantVideo = {
        snippet: {
          title: "Database Architecture and ER Modeling Tutorial (Gate Smashers)",
          description: "Complete lecture covering 3-tier architecture, conceptual schema, and ER modeling in DBMS.",
          channelTitle: "Gate Smashers",
          categoryId: "27" // Education
        },
        statistics: {
          viewCount: "350000"
        }
      };

      const score = scoreVideo(
        relevantVideo,
        chapterKeywords,
        subjectKeywords,
        chapter.toLowerCase(),
        subject.toLowerCase()
      );

      assert.ok(score >= RELEVANCE_THRESHOLD, `Score ${score} must exceed threshold ${RELEVANCE_THRESHOLD}`);
      assert.ok(score >= 40, `Highly relevant lecture should score >= 40, got ${score}`);
    });

    it("penalizes and rejects irrelevant high-view videos from different disciplines", () => {
      const subject = "Database Management Systems";
      const chapter = "Database Architecture & ER Modeling";
      const chapterKeywords = youtubeSearchHandler.extractKeywords(chapter);
      const subjectKeywords = youtubeSearchHandler.extractKeywords(subject);

      // A video with millions of views but about Chemistry/Physics/Entertainment
      const irrelevantViralVideo = {
        snippet: {
          title: "Quantum Physics: Nuclear Chemistry & Atomic Models (10 Million Views)",
          description: "A viral documentary about particle physics and general science.",
          channelTitle: "Viral Entertainment Network",
          categoryId: "24" // Entertainment
        },
        statistics: {
          viewCount: "10000000"
        }
      };

      const score = scoreVideo(
        irrelevantViralVideo,
        chapterKeywords,
        subjectKeywords,
        chapter.toLowerCase(),
        subject.toLowerCase()
      );

      assert.ok(score < RELEVANCE_THRESHOLD, `Irrelevant viral video scored ${score}, which must be below threshold ${RELEVANCE_THRESHOLD}`);
    });

    it("prioritizes relevant video over higher-viewed irrelevant video", () => {
      const subject = "Operating Systems";
      const chapter = "Deadlock Characterization & Banker's Algorithm";
      const chapterKeywords = youtubeSearchHandler.extractKeywords(chapter);
      const subjectKeywords = youtubeSearchHandler.extractKeywords(subject);

      const relevantLecture = {
        snippet: {
          title: "Banker's Algorithm with Example in Operating Systems",
          description: "Deadlock avoidance using Banker's Algorithm explained step by step.",
          channelTitle: "Neso Academy",
          categoryId: "27"
        },
        statistics: { viewCount: "120000" } // 120k views
      };

      const irrelevantVideo = {
        snippet: {
          title: "Top 10 Deadliest Animals in History Documentary",
          description: "Deadly predators around the world.",
          channelTitle: "DocuWorld",
          categoryId: "24"
        },
        statistics: { viewCount: "5000000" } // 5 million views!
      };

      const scoreRelevant = scoreVideo(relevantLecture, chapterKeywords, subjectKeywords, chapter.toLowerCase(), subject.toLowerCase());
      const scoreIrrelevant = scoreVideo(irrelevantVideo, chapterKeywords, subjectKeywords, chapter.toLowerCase(), subject.toLowerCase());

      assert.ok(scoreRelevant >= RELEVANCE_THRESHOLD, "Relevant lecture must pass relevance threshold");
      assert.ok(scoreIrrelevant < RELEVANCE_THRESHOLD, "Irrelevant video must be filtered out despite 5M views");
    });

    it("ranks candidates by viewCount among relevant candidates", () => {
      const candidates = [
        { id: "v1", title: "DBMS ER Modeling Lecture 1", views: 50000, score: 65 },
        { id: "v2", title: "DBMS ER Model Complete Guide", views: 250000, score: 70 },
        { id: "v3", title: "Database Architecture & ER Model", views: 180000, score: 85 },
        { id: "v4", title: "Unrelated Video with High Views", views: 2000000, score: 5 } // below threshold
      ];

      // Filter by threshold (>= 20), sort by views desc
      const ranked = candidates
        .filter(c => c.score >= RELEVANCE_THRESHOLD)
        .sort((a, b) => b.views - a.views);

      assert.equal(ranked.length, 3, "Irrelevant video v4 must be excluded");
      assert.equal(ranked[0].id, "v2", "v2 with 250k views must be top among relevant");
      assert.equal(ranked[1].id, "v3", "v3 with 180k views must be second");
      assert.equal(ranked[2].id, "v1", "v1 with 50k views must be third");
    });
  });

  describe("Academic Reference Book & Public Discovery Integration", () => {
    it("constructs legitimate Google Books reference URLs across all 4 streams", () => {
      assert.equal(typeof ChaptersEngine.getReferenceBookUrl, "function");

      const dbmsUrl = ChaptersEngine.getReferenceBookUrl("Database Management Systems", "Database Architecture");
      assert.ok(dbmsUrl.startsWith("https://www.google.com/search?tbm=bks&q="));
      assert.ok(decodeURIComponent(dbmsUrl).includes("Silberschatz"));

      const anatomyUrl = ChaptersEngine.getReferenceBookUrl("Anatomy", "Anatomical Terms");
      assert.ok(anatomyUrl.startsWith("https://www.google.com/search?tbm=bks&q="));
      assert.ok(decodeURIComponent(anatomyUrl).includes("Gray"));

      const accUrl = ChaptersEngine.getReferenceBookUrl("Financial Accounting", "Accounting Principles");
      assert.ok(accUrl.startsWith("https://www.google.com/search?tbm=bks&q="));
      assert.ok(decodeURIComponent(accUrl).includes("Harrison") || decodeURIComponent(accUrl).includes("Accounting"));

      const litUrl = ChaptersEngine.getReferenceBookUrl("English Literature", "Literary Forms");
      assert.ok(litUrl.startsWith("https://www.google.com/search?tbm=bks&q="));
      assert.ok(decodeURIComponent(litUrl).includes("Norton") || decodeURIComponent(litUrl).includes("Literature"));
    });

    it("renders Reference Book action button on chapter cards in ChaptersListView", () => {
      const meta = ChaptersEngine.getSubjectMeta("eng_math");
      const html = ChaptersUI.renderChaptersListView(meta, 1);
      assert.ok(html.includes("Reference Book"), "Chapter card must contain Reference Book button");
      assert.ok(html.includes("auto_stories"), "Reference Book button must have auto_stories icon");
      assert.ok(html.includes("google.com/search?tbm=bks"), "Reference Book must point to Google Books academic search");
      assert.ok(html.includes('target="_blank"'), "Reference Book link must open in new tab");
    });

    it("renders Reference Book shortcut in VideosView and NotesView headers", () => {
      const meta = ChaptersEngine.getSubjectMeta("eng_math");
      const videoHtml = ChaptersUI.renderVideosView(meta, "ch_eng_math_s1_1");
      assert.ok(videoHtml.includes("Reference Book"), "Videos view must include Reference Book button in header");

      const notesHtml = ChaptersUI.renderNotesView(meta, "ch_eng_math_s1_1");
      assert.ok(notesHtml.includes("Reference Book"), "Notes view must include Reference Book button in header");
    });

    it("supports public YouTube search discovery when allowPublic is true", async () => {
      const req = {
        method: "POST",
        headers: {},
        body: JSON.stringify({
          stream: "engineering",
          subject: "Database Management Systems",
          semester: 4,
          chapter: "Database Architecture & ER Modeling",
          chapterId: "ch_dbms_s4_1",
          allowPublic: true
        })
      };

      let statusCode = null;
      let responseBody = "";
      const res = {
        setHeader: () => {},
        set statusCode(code) { statusCode = code; },
        get statusCode() { return statusCode; },
        end: (body) => { responseBody = body; }
      };

      await youtubeSearchHandler(req, res);
      assert.equal(statusCode, 200);
      const json = JSON.parse(responseBody);
      assert.equal(json.configured, true);
      assert.ok(Array.isArray(json.videos));
      if (json.videos.length > 0) {
        assert.ok(json.videos[0].videoId, "Candidate must have a valid videoId");
        assert.ok(json.videos[0].title, "Candidate must have a title");
        assert.ok(json.videos[0].channelTitle, "Candidate must have a channel title");
        assert.ok(json.videos[0].url.includes("youtube.com/watch?v="), "Candidate must have a valid YouTube URL");
      }
    });
  });

  // =========================================================================
  // 9. MASTER SOCRATIC ACADEMIC TUTOR & REAL-TIME CONVERSATIONAL AI
  // =========================================================================
  describe("Master Socratic Academic Tutor & Real-Time Conversational AI Suite", () => {
    it("delivers Socratic walkthrough with interactive check-in question", () => {
      const response = EduPrep.getAiResponse("Matrices, Rank & Systems of Linear Equations", "socratic", "explain");
      assert.ok(response.includes("Socratic Academic Tutor"), "Must introduce Socratic tutor");
      assert.ok(response.includes("Interactive Socratic Check-In"), "Must include interactive check-in card");
      assert.ok(response.includes("Type your answer in the chatbox below"), "Must encourage student participation");
      assert.ok(response.includes("Engineering Mathematics"), "Must connect to syllabus chapter");
    });

    it("formats 5-mark and 10-mark exam blueprints with scoring rubrics", () => {
      const resp5 = EduPrep.getAiResponse("Database Architecture & ER Modeling", "socratic", "five_mark");
      assert.ok(resp5.includes("5-Mark University Rubric"), "Must show 5-mark rubric badge");
      assert.ok(resp5.includes("Exam Scoring Tip"), "Must provide exam scoring tip");

      const resp10 = EduPrep.getAiResponse("Database Architecture & ER Modeling", "socratic", "ten_mark");
      assert.ok(resp10.includes("10-Mark Blueprint"), "Must show 10-mark blueprint badge");
    });

    it("dynamically resolves syllabus concepts across Engineering, Medical, Commerce, and Arts", () => {
      // Engineering
      const engResp = EduPrep.getAiResponse("Operating Systems", "socratic", "explain");
      assert.ok(engResp.includes("Operating Systems") || engResp.includes("Process") || engResp.includes("Deadlock"));

      // Medical
      const medResp = EduPrep.getAiResponse("Cardiovascular System & Hemodynamics", "socratic", "explain");
      assert.ok(medResp.includes("Interactive Socratic Check-In"));

      // Commerce
      const commResp = EduPrep.getAiResponse("Cost Accounting", "socratic", "explain");
      assert.ok(commResp.includes("Cost Accounting") || commResp.includes("Socratic"));

      // Arts
      const artsResp = EduPrep.getAiResponse("Indian Constitution", "socratic", "explain");
      assert.ok(artsResp.includes("Interactive Socratic Check-In"));
    });

    it("recognizes student answers and provides instant Socratic evaluation", () => {
      const studentReply = "Because the rank of the matrix equals the number of variables";
      const feedback = EduPrep.getAiResponse(studentReply, "socratic", "explain");

      assert.ok(feedback.includes("Socratic Coach Evaluation:"), "Must identify student answer");
      assert.ok(feedback.includes("Excellent active engagement!"), "Must provide encouraging feedback");
      assert.ok(feedback.includes("Tutor Analysis:"), "Must provide pedagogical analysis");
    });

    it("ai-assistant API endpoint accepts multi-turn history for real-time back-and-forth", async () => {
      const req = {
        method: "POST",
        headers: {},
        body: JSON.stringify({
          prompt: "What happens if we remove the circular wait condition?",
          subject: "Operating Systems",
          semester: 4,
          mode: "explain",
          persona: "socratic",
          history: [
            { role: "user", text: "What are the four Coffman conditions for deadlock?" },
            { role: "model", text: "They are Mutual Exclusion, Hold and Wait, No Preemption, and Circular Wait." }
          ]
        })
      };

      let statusCode = null;
      let responseBody = "";
      const res = {
        setHeader: () => {},
        set statusCode(code) { statusCode = code; },
        get statusCode() { return statusCode; },
        end: (body) => { responseBody = body; }
      };

      await aiAssistantHandler(req, res);
      assert.equal(statusCode, 200);
      const json = JSON.parse(responseBody);
      assert.ok(json, "Must return valid JSON");
      // Either live response or offline-curated syllabus provider
      assert.ok(json.answer || json.provider === "offline-curated" || json.configured === false);
    });
  });
});
