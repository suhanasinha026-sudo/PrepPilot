// ============================================================================
// EduPrep — Vercel Serverless Function: /api/youtube-search
// Server-side YouTube video discovery endpoint. Searches YouTube Data API v3,
// filters/scores results for educational relevance, and returns top videos.
// Never exposes YOUTUBE_API_KEY to the browser.
// ============================================================================

const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 30;
const CACHE_TTL_MS = 30 * 60 * 1000; // 30 minutes
const CACHE_CLEANUP_INTERVAL_MS = 10 * 60 * 1000; // 10 minutes
const _CACHE_VERSION = 1;
const RELEVANCE_THRESHOLD = 20;

// ---------------------------------------------------------------------------
// Rate limiter (same pattern as ai-assistant.js)
// ---------------------------------------------------------------------------
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

// ---------------------------------------------------------------------------
// In-memory cache with TTL
// ---------------------------------------------------------------------------
const cache = new Map();

function getCacheKey(stream, subject, semester, chapterId) {
  return `${stream || ""}|${subject || ""}|${semester || ""}|${chapterId || ""}`;
}

function getCached(key) {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt || entry._cacheVersion !== _CACHE_VERSION) {
    cache.delete(key);
    return null;
  }
  return entry.data;
}

function setCache(key, data) {
  cache.set(key, {
    data,
    expiresAt: Date.now() + CACHE_TTL_MS,
    _cacheVersion: _CACHE_VERSION,
  });
}

// Periodically clear expired cache entries
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of cache) {
    if (now > entry.expiresAt || entry._cacheVersion !== _CACHE_VERSION) {
      cache.delete(key);
    }
  }
}, CACHE_CLEANUP_INTERVAL_MS).unref?.();

// ---------------------------------------------------------------------------
// Stopwords & helper utilities
// ---------------------------------------------------------------------------
const STOPWORDS = new Set([
  "the", "and", "of", "in", "for", "a", "an", "to", "with", "&",
  "is", "on", "at", "by", "or", "its", "it", "be", "as", "are",
]);

/**
 * Extract meaningful keywords from a text string.
 * Splits on whitespace, removes stopwords and short noise tokens.
 */
function extractKeywords(text) {
  if (!text) return [];
  return text
    .toLowerCase()
    .split(/[\s\-_/,;:()]+/)
    .map((w) => w.replace(/[^a-z0-9+#.]/g, ""))
    .filter((w) => w.length > 1 && !STOPWORDS.has(w));
}

/**
 * Parse an ISO 8601 duration (e.g. PT1H2M3S) to total seconds and a
 * human-readable formatted string like "1:02:03".
 */
function parseISO8601Duration(iso) {
  if (!iso) return { totalSeconds: 0, formatted: "0:00" };

  const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return { totalSeconds: 0, formatted: "0:00" };

  const hours = parseInt(match[1] || "0", 10);
  const minutes = parseInt(match[2] || "0", 10);
  const seconds = parseInt(match[3] || "0", 10);
  const totalSeconds = hours * 3600 + minutes * 60 + seconds;

  let formatted;
  if (hours > 0) {
    formatted = `${hours}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  } else {
    formatted = `${minutes}:${String(seconds).padStart(2, "0")}`;
  }

  return { totalSeconds, formatted };
}

/**
 * Build an optimised YouTube search query from subject + chapter + stream.
 * Strips common noise words (& etc.) and appends "lecture" for educational bias.
 */
function buildSearchQuery(subject, chapter, _stream) {
  let query = `${subject || ""} ${chapter || ""}`;
  // Strip noise characters/words for better YouTube matching
  query = query
    .replace(/&/g, " ")
    .replace(/[()]/g, " ")
    .replace(/\s{2,}/g, " ")
    .trim();
  // Append educational bias suffix
  query += " lecture";
  return query.trim();
}

// ---------------------------------------------------------------------------
// Non-educational YouTube category IDs (for penalty)
// ---------------------------------------------------------------------------
const NON_EDUCATIONAL_CATEGORIES = new Set([
  "10", // Music
  "24", // Entertainment
  "20", // Gaming
  "17", // Sports
  "2",  // Autos & Vehicles
  "23", // Comedy
  "1",  // Film & Animation
  "15", // Pets & Animals
]);

// Educational channel name keywords
const EDU_CHANNEL_KEYWORDS = [
  "academy", "lecture", "university", "gate", "neso",
  "tutorial", "education", "course", "college", "institute",
  "school", "learn", "study", "teach", "prof", "engineering",
];

// Off-topic field keywords (used for penalty)
const OFF_TOPIC_FIELDS = [
  "physics", "chemistry", "biology", "history", "geography",
  "literature", "economics", "psychology", "sociology", "philosophy",
  "medical", "law", "arts", "music", "cooking",
];

/**
 * Score a video candidate for educational relevance.
 */
function scoreVideo(video, chapterKeywords, subjectKeywords, chapterLower, subjectLower) {
  let score = 0;

  const titleLower = (video.snippet.title || "").toLowerCase();
  const descLower = (video.snippet.description || "").toLowerCase().slice(0, 500);
  const channelLower = (video.snippet.channelTitle || "").toLowerCase();

  // Keyword matching — title
  for (const kw of chapterKeywords) {
    if (titleLower.includes(kw)) score += 15;
  }
  for (const kw of subjectKeywords) {
    if (titleLower.includes(kw)) score += 10;
  }

  // Keyword matching — description
  for (const kw of chapterKeywords) {
    if (descLower.includes(kw)) score += 5;
  }
  for (const kw of subjectKeywords) {
    if (descLower.includes(kw)) score += 3;
  }

  // Exact phrase bonuses
  if (chapterLower && titleLower.includes(chapterLower)) score += 30;
  if (subjectLower && titleLower.includes(subjectLower)) score += 20;

  // Educational channel bonus
  if (EDU_CHANNEL_KEYWORDS.some((kw) => channelLower.includes(kw))) {
    score += 10;
  }

  // View-count bonuses
  const viewCount = parseInt(video.statistics?.viewCount || "0", 10);
  if (viewCount > 1000) score += 5;
  if (viewCount > 10000) score += 5;
  if (viewCount > 100000) score += 5;
  if (viewCount > 1000000) score += 5;

  // --- PENALTIES ---

  // Off-topic field detection (penalise if title contains an unrelated field keyword)
  const combinedSearchTerms = [...chapterKeywords, ...subjectKeywords];
  for (const field of OFF_TOPIC_FIELDS) {
    // Don't penalise if this field word is part of the search context itself
    if (combinedSearchTerms.includes(field)) continue;
    if (titleLower.includes(field)) {
      score -= 30;
      break; // only apply once
    }
  }

  // Non-educational category penalty
  const categoryId = video.snippet?.categoryId;
  if (categoryId && NON_EDUCATIONAL_CATEGORIES.has(categoryId)) {
    score -= 20;
  }

  return score;
}

// ---------------------------------------------------------------------------
// YouTube Data API helpers
// ---------------------------------------------------------------------------

async function youtubeSearch(query, apiKey) {
  const params = new URLSearchParams({
    part: "snippet",
    q: query,
    type: "video",
    videoEmbeddable: "true",
    safeSearch: "strict",
    maxResults: "15",
    order: "relevance",
    relevanceLanguage: "en",
    key: apiKey,
  });

  const url = `https://www.googleapis.com/youtube/v3/search?${params.toString()}`;
  const resp = await fetch(url);

  if (!resp.ok) {
    const errBody = await resp.json().catch(() => ({}));
    const reason = errBody?.error?.errors?.[0]?.reason || "";
    if (resp.status === 403 && (reason === "quotaExceeded" || reason === "dailyLimitExceeded")) {
      return { error: "quota", items: [] };
    }
    if (resp.status === 400 && reason === "keyInvalid") {
      return { error: "invalidKey", items: [] };
    }
    return { error: "network", items: [] };
  }

  const data = await resp.json();
  return { error: null, items: data.items || [] };
}

async function youtubeVideoDetails(videoIds, apiKey) {
  if (!videoIds.length) return { error: null, items: [] };

  const params = new URLSearchParams({
    part: "snippet,statistics,contentDetails,status",
    id: videoIds.join(","),
    key: apiKey,
  });

  const url = `https://www.googleapis.com/youtube/v3/videos?${params.toString()}`;
  const resp = await fetch(url);

  if (!resp.ok) {
    const errBody = await resp.json().catch(() => ({}));
    const reason = errBody?.error?.errors?.[0]?.reason || "";
    if (resp.status === 403 && (reason === "quotaExceeded" || reason === "dailyLimitExceeded")) {
      return { error: "quota", items: [] };
    }
    if (resp.status === 400 && reason === "keyInvalid") {
      return { error: "invalidKey", items: [] };
    }
    return { error: "network", items: [] };
  }

  const data = await resp.json();
  return { error: null, items: data.items || [] };
}

// ---------------------------------------------------------------------------
// YouTube Public Search Scraper (Robust fallback without API key)
// ---------------------------------------------------------------------------

const KNOWN_INVALID_PLACEHOLDER_IDS = new Set([
  "bum_19JhyCD", "vC4NfWq68kM", "ruM4Xuhx34A", "q3D8h2u44zM",
  "vv4y_uOneC8", "1i_aP8s0X7E", "7u2Unflq4U8", "H0T7m1aUeB0",
  "W2hHt_PXeuc", "5M1rQv_z10c", "FmEm0Cgvxm8", "kBdlM6hHQUU",
  "FwW3cR_N6l8", "sFVxsatSlic", "z9wT9M_Y6_g", "WUvTyaaNjfo",
  "0oP0q8sTfZ4", "nDcX8d_yB_E", "r5CGWVz3-dM", "lrk4oY7U_so"
]);

/**
 * Dynamic YouTube Public Search Scraper (fallback when API key is missing/exhausted)
 * Fetches real, live YouTube educational search results directly without requiring an API key.
 */
async function publicYouTubeSearch(query, subject, chapter) {
  const chapterKeywords = extractKeywords(chapter);
  const subjectKeywords = extractKeywords(subject);
  const chapterLower = (chapter || "").toLowerCase().replace(/&/g, " ").replace(/\s{2,}/g, " ").trim();
  const subjectLower = (subject || "").toLowerCase().trim();

  const url = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
  const resp = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      "Accept-Language": "en-US,en;q=0.9",
    },
  });

  if (!resp.ok) {
    return { error: "Failed to reach YouTube", videos: [] };
  }

  const html = await resp.text();
  const match = html.match(/var ytInitialData = ({.*?});<\/script>/) || html.match(/window\["ytInitialData"\]\s*=\s*({.*?});/);
  if (!match) {
    return { error: "Failed to parse YouTube results", videos: [] };
  }

  let data;
  try {
    data = JSON.parse(match[1]);
  } catch (e) {
    return { error: "Invalid YouTube response format", videos: [] };
  }

  const sectionList = data?.contents?.twoColumnSearchResultsRenderer?.primaryContents?.sectionListRenderer?.contents || [];
  const candidates = [];
  const seenIds = new Set();

  for (const sec of sectionList) {
    const items = sec?.itemSectionRenderer?.contents || [];
    for (const it of items) {
      const vr = it.videoRenderer;
      if (!vr || !vr.videoId) continue;
      const videoId = vr.videoId;
      if (seenIds.has(videoId) || KNOWN_INVALID_PLACEHOLDER_IDS.has(videoId)) continue;
      seenIds.add(videoId);

      const title = vr.title?.runs?.[0]?.text || vr.title?.simpleText || "";
      if (!title || title.length < 5) continue;

      const channelTitle = vr.ownerText?.runs?.[0]?.text || vr.shortBylineText?.runs?.[0]?.text || "Educational Channel";
      const durationFormatted = vr.lengthText?.simpleText || "";
      const viewsStr = vr.viewCountText?.simpleText || vr.shortViewCountText?.simpleText || "";
      const viewCount = parseInt(viewsStr.replace(/[^0-9]/g, ""), 10) || 0;
      const thumbnailUrl = vr.thumbnail?.thumbnails?.slice(-1)[0]?.url || `https://i.ytimg.com/vi/${videoId}/mqdefault.jpg`;
      const publishedAt = vr.publishedTimeText?.simpleText || "";
      const description = vr.detailedMetadataSnippets?.[0]?.snippetText?.runs?.map((r) => r.text).join("") || "";

      // Parse duration to filter out shorts (< 60 seconds)
      const parts = durationFormatted.split(":").map(Number);
      let totalSeconds = 0;
      if (parts.length === 3) totalSeconds = parts[0] * 3600 + parts[1] * 60 + parts[2];
      else if (parts.length === 2) totalSeconds = parts[0] * 60 + parts[1];
      else if (parts.length === 1) totalSeconds = parts[0];
      if (totalSeconds > 0 && totalSeconds < 60) continue;

      // Construct video candidate for scoring
      const candidateForScoring = {
        snippet: {
          title,
          description,
          channelTitle,
        },
        statistics: {
          viewCount: String(viewCount),
        },
      };

      const score = scoreVideo(
        candidateForScoring,
        chapterKeywords,
        subjectKeywords,
        chapterLower,
        subjectLower
      );

      candidates.push({
        videoId,
        title,
        channelTitle,
        thumbnailUrl,
        publishedAt,
        viewCount,
        duration: durationFormatted,
        durationFormatted,
        url: `https://www.youtube.com/watch?v=${videoId}`,
        embedUrl: `https://www.youtube-nocookie.com/embed/${videoId}`,
        relevanceScore: score,
        source: "youtube-public",
      });
    }
  }

  // Filter candidates with score >= RELEVANCE_THRESHOLD
  let relevant = candidates.filter((v) => v.relevanceScore >= RELEVANCE_THRESHOLD);
  if (relevant.length === 0) {
    relevant = candidates.filter((v) => v.relevanceScore > 0);
  }
  // Sort by popularity (view count descending)
  relevant.sort((a, b) => b.viewCount - a.viewCount);
  const topVideos = relevant.slice(0, 5);

  return {
    query,
    videos: topVideos,
    totalCandidates: candidates.length,
    filteredCount: topVideos.length,
  };
}

// ---------------------------------------------------------------------------
// Core pipeline: search → details → filter → score → rank
// ---------------------------------------------------------------------------

async function discoverVideos(subject, chapter, stream, apiKey) {
  const chapterKeywords = extractKeywords(chapter);
  const subjectKeywords = extractKeywords(subject);
  const chapterLower = chapter.toLowerCase().replace(/&/g, " ").replace(/\s{2,}/g, " ").trim();
  const subjectLower = subject.toLowerCase().trim();

  // Build fallback query strategies
  const mainChapterKeywords = chapterKeywords.slice(0, 4).join(" ");
  const queries = [
    buildSearchQuery(subject, chapter, stream),                          // strategy 1: full
    `${chapter.replace(/&/g, " ")} lecture`,                              // strategy 2: chapter only
    `${subject} ${mainChapterKeywords} tutorial`,                         // strategy 3: subject + main keywords
  ];

  const seenVideoIds = new Set();
  let allCandidates = [];
  let lastError = null;
  let totalSearchCandidates = 0;
  let usedQuery = "";

  for (let attempt = 0; attempt < queries.length; attempt++) {
    const query = queries[attempt];
    if (attempt === 0) usedQuery = query;

    // Search
    const searchResult = await youtubeSearch(query, apiKey);
    if (searchResult.error) {
      lastError = searchResult.error;
      if (searchResult.error === "quota" || searchResult.error === "invalidKey") {
        break; // no point retrying
      }
      continue;
    }

    // Extract IDs, skip already-seen
    const newIds = [];
    for (const item of searchResult.items) {
      const id = item.id?.videoId;
      if (id && !seenVideoIds.has(id)) {
        seenVideoIds.add(id);
        newIds.push(id);
      }
    }
    totalSearchCandidates += searchResult.items.length;

    if (!newIds.length) continue;

    // Get details
    const detailsResult = await youtubeVideoDetails(newIds, apiKey);
    if (detailsResult.error) {
      lastError = detailsResult.error;
      if (detailsResult.error === "quota" || detailsResult.error === "invalidKey") {
        break;
      }
      continue;
    }

    // Filter
    for (const video of detailsResult.items) {
      const status = video.status || {};
      if (status.uploadStatus !== "processed") continue;
      if (status.privacyStatus === "private") continue;
      if (status.embeddable === false) continue;

      const { totalSeconds } = parseISO8601Duration(video.contentDetails?.duration);
      if (totalSeconds < 60) continue; // skip shorts

      // Score
      const relevanceScore = scoreVideo(
        video, chapterKeywords, subjectKeywords, chapterLower, subjectLower
      );
      video._relevanceScore = relevanceScore;
      video._totalSeconds = totalSeconds;
      allCandidates.push(video);
    }

    // Check if we have enough relevant videos
    const relevant = allCandidates.filter((v) => v._relevanceScore >= RELEVANCE_THRESHOLD);
    if (relevant.length >= 5) break; // we have enough
  }

  // Error responses
  if (lastError && allCandidates.length === 0) {
    if (lastError === "quota") {
      return { error: "YouTube API quota exceeded", quotaExceeded: true };
    }
    if (lastError === "invalidKey") {
      return { error: "Invalid YouTube API key" };
    }
    return { error: "Failed to reach YouTube" };
  }

  // Rank: filter to relevant, sort by viewCount desc, take top 5
  const relevant = allCandidates
    .filter((v) => v._relevanceScore >= RELEVANCE_THRESHOLD)
    .sort((a, b) => {
      const viewsA = parseInt(a.statistics?.viewCount || "0", 10);
      const viewsB = parseInt(b.statistics?.viewCount || "0", 10);
      return viewsB - viewsA;
    })
    .slice(0, 5);

  // Format output
  const videos = relevant.map((v) => {
    const videoId = v.id;
    const { formatted } = parseISO8601Duration(v.contentDetails?.duration);
    return {
      videoId,
      title: v.snippet.title,
      channelTitle: v.snippet.channelTitle,
      thumbnailUrl:
        v.snippet.thumbnails?.medium?.url ||
        v.snippet.thumbnails?.default?.url ||
        `https://i.ytimg.com/vi/${videoId}/mqdefault.jpg`,
      publishedAt: v.snippet.publishedAt,
      viewCount: parseInt(v.statistics?.viewCount || "0", 10),
      duration: v.contentDetails?.duration || "",
      durationFormatted: formatted,
      url: `https://www.youtube.com/watch?v=${videoId}`,
      embedUrl: `https://www.youtube-nocookie.com/embed/${videoId}`,
      relevanceScore: v._relevanceScore,
      source: "youtube-api",
    };
  });

  return {
    query: usedQuery,
    videos,
    totalCandidates: totalSearchCandidates,
    filteredCount: videos.length,
  };
}

// ---------------------------------------------------------------------------
// Exported handler (same pattern as ai-assistant.js)
// ---------------------------------------------------------------------------

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

  // Rate limiting
  const clientIp =
    (req.headers && (req.headers["x-forwarded-for"] || req.socket?.remoteAddress)) ||
    "local-client";

  if (!checkRateLimit(String(clientIp))) {
    res.statusCode = 429;
    res.setHeader("Content-Type", "application/json");
    return res.end(
      JSON.stringify({
        error: "Too many requests. Please wait 60 seconds and try again.",
      })
    );
  }

  // Parse body
  let body = req.body || {};
  if (typeof body === "string") {
    try {
      body = JSON.parse(body);
    } catch (_) {
      body = {};
    }
  }

  const subject = typeof body.subject === "string" ? body.subject.trim() : "";
  const chapter = typeof body.chapter === "string" ? body.chapter.trim() : "";
  const stream = typeof body.stream === "string" ? body.stream.trim() : "";
  const semester = body.semester ? Number(body.semester) : null;
  const chapterId = typeof body.chapterId === "string" ? body.chapterId.trim() : "";

  // Validate required fields
  if (!subject || !chapter) {
    res.statusCode = 400;
    res.setHeader("Content-Type", "application/json");
    return res.end(
      JSON.stringify({
        error: "Both 'subject' and 'chapter' fields are required.",
      })
    );
  }

  // Check cache
  const cacheKey = getCacheKey(stream, subject, semester, chapterId);
  const cached = getCached(cacheKey);
  if (cached) {
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    return res.end(JSON.stringify(cached));
  }

  // Check API key
  const apiKey = process.env.YOUTUBE_API_KEY;
  const hasValidApiKey = apiKey && apiKey !== "your-youtube-data-api-v3-key";

  if (!hasValidApiKey) {
    // If client requested public YouTube discovery fallback (or when browser client calls)
    if (body.allowPublic === true) {
      const query = buildSearchQuery(subject, chapter, stream);
      try {
        const publicResult = await publicYouTubeSearch(query, subject, chapter);
        const response = {
          configured: true,
          query: publicResult.query,
          videos: publicResult.videos || [],
          totalCandidates: publicResult.totalCandidates || 0,
          filteredCount: (publicResult.videos || []).length,
          searchedAt: new Date().toISOString(),
          source: "youtube-public",
        };
        if (response.videos.length > 0) {
          setCache(cacheKey, response);
        }
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        return res.end(JSON.stringify(response));
      } catch (err) {
        // Fall back gracefully
      }
    }

    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    return res.end(
      JSON.stringify({
        configured: false,
        message: "YouTube API key not configured",
        videos: [],
      })
    );
  }

  // Run discovery pipeline via official YouTube Data API
  try {
    let result = await discoverVideos(subject, chapter, stream, apiKey);

    // If API failed due to quota/network or returned 0 videos, fall back to public search if enabled
    if ((result.error || !result.videos || result.videos.length === 0) && body.allowPublic !== false) {
      const query = buildSearchQuery(subject, chapter, stream);
      try {
        const publicResult = await publicYouTubeSearch(query, subject, chapter);
        if (publicResult.videos && publicResult.videos.length > 0) {
          result = publicResult;
        }
      } catch (_) {}
    }

    // Handle error responses from pipeline
    if (result.error && (!result.videos || result.videos.length === 0)) {
      const errorResponse = {
        configured: true,
        error: result.error,
        videos: [],
      };
      if (result.quotaExceeded) errorResponse.quotaExceeded = true;
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      return res.end(JSON.stringify(errorResponse));
    }

    const response = {
      configured: true,
      query: result.query,
      videos: result.videos,
      totalCandidates: result.totalCandidates,
      filteredCount: result.filteredCount,
      searchedAt: new Date().toISOString(),
      source: result.videos?.[0]?.source || "youtube-api",
    };

    // Cache successful responses with at least 1 video
    if (result.videos.length > 0) {
      setCache(cacheKey, response);
    }

    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    return res.end(JSON.stringify(response));
  } catch (err) {
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json");
    return res.end(
      JSON.stringify({
        configured: true,
        error: "Failed to reach YouTube",
        videos: [],
        detail: err && err.message ? err.message : String(err),
      })
    );
  }
};

module.exports.extractKeywords = extractKeywords;
module.exports.parseISO8601Duration = parseISO8601Duration;
module.exports.scoreVideo = scoreVideo;
module.exports.buildSearchQuery = buildSearchQuery;
module.exports.discoverVideos = discoverVideos;
module.exports.publicYouTubeSearch = publicYouTubeSearch;
module.exports.RELEVANCE_THRESHOLD = RELEVANCE_THRESHOLD;
