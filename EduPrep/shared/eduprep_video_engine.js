/**
 * EduPrep — Dynamic YouTube Video Discovery & Verification Engine
 * 
 * Strict Resource Correctness Principles:
 * 1. Dynamically discovers educational videos via server-side YouTube Data API.
 * 2. Falls back to curated verified catalog when available (fast path).
 * 3. Implements candidate search → relevance validation → popularity ranking → availability validation.
 * 4. Client-side caching with TTL to avoid redundant API calls.
 * 5. Stale request cancellation for rapid chapter switching.
 * 6. Gracefully degrades to "No verified video available" with manual YouTube search link.
 * 7. Zero fake cards, zero grey placeholder thumbnails, zero dead buttons.
 */

(function () {
  'use strict';

  // ===== CONFIGURATION =====
  const CACHE_TTL_MS = 30 * 60 * 1000;    // 30 minutes
  const API_TIMEOUT_MS = 12000;            // 12 seconds
  const API_ENDPOINT = '/api/youtube/search';
  const CACHE_VERSION = 1;

  // ===== CLIENT-SIDE CACHE =====
  const _cache = new Map();

  function getCacheKey(stream, subject, semester, chapterId) {
    return [stream, subject, semester, chapterId, CACHE_VERSION].join('|');
  }

  function getCached(key) {
    const entry = _cache.get(key);
    if (!entry) return null;
    if (Date.now() - entry.timestamp > CACHE_TTL_MS) {
      _cache.delete(key);
      return null;
    }
    return entry.data;
  }

  function setCache(key, data) {
    _cache.set(key, { data: data, timestamp: Date.now() });
    // Evict old entries if cache grows too large
    if (_cache.size > 200) {
      const now = Date.now();
      for (const [k, v] of _cache) {
        if (now - v.timestamp > CACHE_TTL_MS) _cache.delete(k);
      }
    }
  }

  // ===== STALE REQUEST TRACKING =====
  let _currentRequestId = 0;

  // ===== KNOWN INVALID PLACEHOLDER IDS (legacy) =====
  const KNOWN_INVALID_PLACEHOLDER_IDS = new Set([
    "bum_19JhyCD", "vC4NfWq68kM", "ruM4Xuhx34A", "q3D8h2u44zM",
    "vv4y_uOneC8", "1i_aP8s0X7E", "7u2Unflq4U8", "H0T7m1aUeB0",
    "W2hHt_PXeuc", "5M1rQv_z10c", "FmEm0Cgvxm8", "kBdlM6hHQUU",
    "FwW3cR_N6l8", "sFVxsatSlic", "z9wT9M_Y6_g", "WUvTyaaNjfo",
    "0oP0q8sTfZ4", "nDcX8d_yB_E", "r5CGWVz3-dM", "lrk4oY7U_so"
  ]);

  /**
   * Verified Curated Educational Video Registry (Legacy fast-path)
   * These are manually verified entries that serve as instant fallbacks
   * when API is unavailable or as fast-path for known-good chapters.
   */
  const VERIFIED_VIDEOS_BY_CHAPTER = {
    "ch_eng_math_s1_1": [{
      id: "fNk_zzaMoSs", title: "Vectors | Chapter 1, Essence of linear algebra",
      channel: "3Blue1Brown", duration: "9:52", stream: "engineering",
      subject: "Engineering Mathematics", chapterId: "ch_eng_math_s1_1",
      chapterTitle: "Matrices, Rank & Systems of Linear Equations",
      url: "https://www.youtube.com/watch?v=fNk_zzaMoSs",
      embedUrl: "https://www.youtube-nocookie.com/embed/fNk_zzaMoSs",
      thumbnail: "https://img.youtube.com/vi/fNk_zzaMoSs/mqdefault.jpg",
      isVerified: true, verificationStatus: "verified", lastVerified: "2026-10-16"
    }],
    "ch_os_s4_1": [{
      id: "26QPDBe-NB8", title: "Operating Systems: Crash Course Computer Science #18",
      channel: "CrashCourse", duration: "10:36", stream: "engineering",
      subject: "Operating Systems", chapterId: "ch_os_s4_1",
      chapterTitle: "OS Structures, System Calls & Process Concept",
      url: "https://www.youtube.com/watch?v=26QPDBe-NB8",
      embedUrl: "https://www.youtube-nocookie.com/embed/26QPDBe-NB8",
      thumbnail: "https://img.youtube.com/vi/26QPDBe-NB8/mqdefault.jpg",
      isVerified: true, verificationStatus: "verified", lastVerified: "2026-10-16"
    }],
    "ch_os_s4_4": [{
      id: "T0FXvTHcYi4", title: "Banker's Algorithm explained",
      channel: "Computer Science", duration: "8:14", stream: "engineering",
      subject: "Operating Systems", chapterId: "ch_os_s4_4",
      chapterTitle: "Deadlock Characterization & Banker's Algorithm",
      url: "https://www.youtube.com/watch?v=T0FXvTHcYi4",
      embedUrl: "https://www.youtube-nocookie.com/embed/T0FXvTHcYi4",
      thumbnail: "https://img.youtube.com/vi/T0FXvTHcYi4/mqdefault.jpg",
      isVerified: true, verificationStatus: "verified", lastVerified: "2026-10-16"
    }],
    "ch_os_s4_5": [{
      id: "pJ6qrCB8pDw", title: "Paging in Operating Systems with Example & Working - Memory Management",
      channel: "Simple Snippets", duration: "12:45", stream: "engineering",
      subject: "Operating Systems", chapterId: "ch_os_s4_5",
      chapterTitle: "Memory Management & Virtual Memory",
      url: "https://www.youtube.com/watch?v=pJ6qrCB8pDw",
      embedUrl: "https://www.youtube-nocookie.com/embed/pJ6qrCB8pDw",
      thumbnail: "https://img.youtube.com/vi/pJ6qrCB8pDw/mqdefault.jpg",
      isVerified: true, verificationStatus: "verified", lastVerified: "2026-10-16"
    }],
    "ch_dbms_s4_3": [{
      id: "UrYLYV7WSHM", title: "Normalization - 1NF, 2NF, 3NF and 4NF",
      channel: "channel5567", duration: "11:20", stream: "engineering",
      subject: "Database Management Systems", chapterId: "ch_dbms_s4_3",
      chapterTitle: "Relational Database Design & Normalization",
      url: "https://www.youtube.com/watch?v=UrYLYV7WSHM",
      embedUrl: "https://www.youtube-nocookie.com/embed/UrYLYV7WSHM",
      thumbnail: "https://img.youtube.com/vi/UrYLYV7WSHM/mqdefault.jpg",
      isVerified: true, verificationStatus: "verified", lastVerified: "2026-10-16"
    }],
    "ch_data_structures_s3_1": [{
      id: "RBSGKlAvoiM", title: "Data Structures Easy to Advanced Course - Full Tutorial from a Google Engineer",
      channel: "freeCodeCamp.org", duration: "8:03:00", stream: "engineering",
      subject: "Data Structures", chapterId: "ch_data_structures_s3_1",
      chapterTitle: "Algorithm Analysis & Complexity Bounds",
      url: "https://www.youtube.com/watch?v=RBSGKlAvoiM",
      embedUrl: "https://www.youtube-nocookie.com/embed/RBSGKlAvoiM",
      thumbnail: "https://img.youtube.com/vi/RBSGKlAvoiM/mqdefault.jpg",
      isVerified: true, verificationStatus: "verified", lastVerified: "2026-10-16"
    }],
    "ch_med_anatomy_s1_1": [{
      id: "uBGl2BujkPQ", title: "Introduction to Anatomy & Physiology: Crash Course Anatomy & Physiology #1",
      channel: "CrashCourse", duration: "11:20", stream: "medical",
      subject: "Anatomy", chapterId: "ch_med_anatomy_s1_1",
      chapterTitle: "Introduction to Anatomical Terms & Organization",
      url: "https://www.youtube.com/watch?v=uBGl2BujkPQ",
      embedUrl: "https://www.youtube-nocookie.com/embed/uBGl2BujkPQ",
      thumbnail: "https://img.youtube.com/vi/uBGl2BujkPQ/mqdefault.jpg",
      isVerified: true, verificationStatus: "verified", lastVerified: "2026-10-16"
    }],
    "ch_med_physiology_s1_3": [{
      id: "IS9TD9fHFv0", title: "The Cardiac Cycle, Animation",
      channel: "Alila Medical Media", duration: "4:40", stream: "medical",
      subject: "Physiology", chapterId: "ch_med_physiology_s1_3",
      chapterTitle: "Cardiovascular System & Hemodynamics",
      url: "https://www.youtube.com/watch?v=IS9TD9fHFv0",
      embedUrl: "https://www.youtube-nocookie.com/embed/IS9TD9fHFv0",
      thumbnail: "https://img.youtube.com/vi/IS9TD9fHFv0/mqdefault.jpg",
      isVerified: true, verificationStatus: "verified", lastVerified: "2026-10-16"
    }],
    "ch_med_biochemistry_s1_2": [{
      id: "8Kn6BVGqKd8", title: "Glycolysis: An Overview",
      channel: "ndsuvirtualcell", duration: "7:18", stream: "medical",
      subject: "Biochemistry", chapterId: "ch_med_biochemistry_s1_2",
      chapterTitle: "Carbohydrate Metabolism",
      url: "https://www.youtube.com/watch?v=8Kn6BVGqKd8",
      embedUrl: "https://www.youtube-nocookie.com/embed/8Kn6BVGqKd8",
      thumbnail: "https://img.youtube.com/vi/8Kn6BVGqKd8/mqdefault.jpg",
      isVerified: true, verificationStatus: "verified", lastVerified: "2026-10-16"
    }],
    "ch_com_fin_acc_s1_1": [{
      id: "yYX4bvQSqbo", title: "ACCOUNTING BASICS: a Guide to (Almost) Everything",
      channel: "Accounting Stuff", duration: "14:12", stream: "commerce",
      subject: "Financial Accounting", chapterId: "ch_com_fin_acc_s1_1",
      chapterTitle: "Accounting Principles, Concepts & Conventions",
      url: "https://www.youtube.com/watch?v=yYX4bvQSqbo",
      embedUrl: "https://www.youtube-nocookie.com/embed/yYX4bvQSqbo",
      thumbnail: "https://img.youtube.com/vi/yYX4bvQSqbo/mqdefault.jpg",
      isVerified: true, verificationStatus: "verified", lastVerified: "2026-10-16"
    }],
    "ch_com_biz_econ_s1_1": [{
      id: "3ez10ADR_gM", title: "Intro to Economics: Crash Course Econ #1",
      channel: "CrashCourse", duration: "12:09", stream: "commerce",
      subject: "Business Economics", chapterId: "ch_com_biz_econ_s1_1",
      chapterTitle: "Scope of Business Economics & Demand Analysis",
      url: "https://www.youtube.com/watch?v=3ez10ADR_gM",
      embedUrl: "https://www.youtube-nocookie.com/embed/3ez10ADR_gM",
      thumbnail: "https://img.youtube.com/vi/3ez10ADR_gM/mqdefault.jpg",
      isVerified: true, verificationStatus: "verified", lastVerified: "2026-10-16"
    }],
    "ch_com_biz_econ_s1_2": [{
      id: "g9aDizJpd_s", title: "Supply and Demand: Crash Course Economics #4",
      channel: "CrashCourse", duration: "10:22", stream: "commerce",
      subject: "Business Economics", chapterId: "ch_com_biz_econ_s1_2",
      chapterTitle: "Elasticity of Demand & Forecasting",
      url: "https://www.youtube.com/watch?v=g9aDizJpd_s",
      embedUrl: "https://www.youtube-nocookie.com/embed/g9aDizJpd_s",
      thumbnail: "https://img.youtube.com/vi/g9aDizJpd_s/mqdefault.jpg",
      isVerified: true, verificationStatus: "verified", lastVerified: "2026-10-16"
    }],
    "ch_arts_eng_lit_s1_1": [{
      id: "MSYw502dJNY", title: "How and Why We Read: Crash Course English Literature #1",
      channel: "CrashCourse", duration: "11:39", stream: "arts",
      subject: "English Literature", chapterId: "ch_arts_eng_lit_s1_1",
      chapterTitle: "Forms of Literature & Literary Devices",
      url: "https://www.youtube.com/watch?v=MSYw502dJNY",
      embedUrl: "https://www.youtube-nocookie.com/embed/MSYw502dJNY",
      thumbnail: "https://img.youtube.com/vi/MSYw502dJNY/mqdefault.jpg",
      isVerified: true, verificationStatus: "verified", lastVerified: "2026-10-16"
    }],
    "ch_arts_history_s1_1": [{
      id: "n7ndRwqJYDM", title: "Indus Valley Civilization: Crash Course World History #2",
      channel: "CrashCourse", duration: "9:35", stream: "arts",
      subject: "History", chapterId: "ch_arts_history_s1_1",
      chapterTitle: "Sources of History & Indus Valley Civilization",
      url: "https://www.youtube.com/watch?v=n7ndRwqJYDM",
      embedUrl: "https://www.youtube-nocookie.com/embed/n7ndRwqJYDM",
      thumbnail: "https://img.youtube.com/vi/n7ndRwqJYDM/mqdefault.jpg",
      isVerified: true, verificationStatus: "verified", lastVerified: "2026-10-16"
    }],
    "ch_arts_pol_sci_s1_5": [{
      id: "bO7FQsCcbD8", title: "The Constitution, the Articles, and Federalism: Crash Course US History #8",
      channel: "CrashCourse", duration: "13:04", stream: "arts",
      subject: "Political Science", chapterId: "ch_arts_pol_sci_s1_5",
      chapterTitle: "Indian Constitutional Framework",
      url: "https://www.youtube.com/watch?v=bO7FQsCcbD8",
      embedUrl: "https://www.youtube-nocookie.com/embed/bO7FQsCcbD8",
      thumbnail: "https://img.youtube.com/vi/bO7FQsCcbD8/mqdefault.jpg",
      isVerified: true, verificationStatus: "verified", lastVerified: "2026-10-16"
    }],
    "ch_arts_sociology_s1_1": [{
      id: "YnCJU6PaCio", title: "What Is Sociology?: Crash Course Sociology #1",
      channel: "CrashCourse", duration: "9:42", stream: "arts",
      subject: "Sociology", chapterId: "ch_arts_sociology_s1_1",
      chapterTitle: "Sociological Imagination & Primary Concepts",
      url: "https://www.youtube.com/watch?v=YnCJU6PaCio",
      embedUrl: "https://www.youtube-nocookie.com/embed/YnCJU6PaCio",
      thumbnail: "https://img.youtube.com/vi/YnCJU6PaCio/mqdefault.jpg",
      isVerified: true, verificationStatus: "verified", lastVerified: "2026-10-16"
    }],
    "ch_arts_psychology_s1_1": [{
      id: "vo4pMVb0R6M", title: "Intro to Psychology: Crash Course Psychology #1",
      channel: "CrashCourse", duration: "10:54", stream: "arts",
      subject: "Psychology", chapterId: "ch_arts_psychology_s1_1",
      chapterTitle: "Introduction to Psychology & Research Methods",
      url: "https://www.youtube.com/watch?v=vo4pMVb0R6M",
      embedUrl: "https://www.youtube-nocookie.com/embed/vo4pMVb0R6M",
      thumbnail: "https://img.youtube.com/vi/vo4pMVb0R6M/mqdefault.jpg",
      isVerified: true, verificationStatus: "verified", lastVerified: "2026-10-16"
    }]
  };

  // Cross-reference aliases
  VERIFIED_VIDEOS_BY_CHAPTER["ch_mbbs_anat_s1_1"] = VERIFIED_VIDEOS_BY_CHAPTER["ch_med_anatomy_s1_1"];
  VERIFIED_VIDEOS_BY_CHAPTER["ch_bcom_fa_s1_1"] = VERIFIED_VIDEOS_BY_CHAPTER["ch_com_fin_acc_s1_1"];
  VERIFIED_VIDEOS_BY_CHAPTER["ch_ba_hist_s1_1"] = VERIFIED_VIDEOS_BY_CHAPTER["ch_arts_history_s1_1"];

  // ===== FORMAT HELPERS =====

  /**
   * Format a view count into a human-readable string
   */
  function formatViewCount(count) {
    if (!count && count !== 0) return '';
    const n = parseInt(count, 10);
    if (isNaN(n)) return '';
    if (n >= 1000000) return (n / 1000000).toFixed(1).replace(/\.0$/, '') + 'M views';
    if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, '') + 'K views';
    return n + ' views';
  }

  /**
   * Format ISO 8601 duration to human-readable
   */
  function formatDuration(durationStr) {
    if (!durationStr) return '';
    // If already formatted (e.g. "15:30"), return as-is
    if (/^\d+:\d{2}(:\d{2})?$/.test(durationStr)) return durationStr;
    // Parse PT format
    const match = durationStr.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    if (!match) return durationStr;
    const h = parseInt(match[1] || 0, 10);
    const m = parseInt(match[2] || 0, 10);
    const s = parseInt(match[3] || 0, 10);
    if (h > 0) return h + ':' + String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0');
    return m + ':' + String(s).padStart(2, '0');
  }

  // ===== MAIN VIDEO ENGINE =====

  const VideoEngine = {
    knownInvalidIds: KNOWN_INVALID_PLACEHOLDER_IDS,
    verifiedCatalog: VERIFIED_VIDEOS_BY_CHAPTER,

    /**
     * Extracts and validates an 11-character YouTube video ID
     */
    extractVideoId: function (urlOrId) {
      if (!urlOrId || typeof urlOrId !== 'string') return null;
      var str = urlOrId.trim();
      if (/^[a-zA-Z0-9_-]{11}$/.test(str)) {
        if (KNOWN_INVALID_PLACEHOLDER_IDS.has(str)) return null;
        return str;
      }
      var patterns = [
        /(?:youtube\.com\/watch\?.*v=|youtu\.be\/|youtube(?:-nocookie)?\.com\/embed\/)([a-zA-Z0-9_-]{11})/i
      ];
      for (var i = 0; i < patterns.length; i++) {
        var m = str.match(patterns[i]);
        if (m && m[1]) {
          var id = m[1];
          if (KNOWN_INVALID_PLACEHOLDER_IDS.has(id)) return null;
          return id;
        }
      }
      return null;
    },

    /**
     * Strictly validates a video object from the curated catalog
     */
    validateVideo: function (v) {
      if (!v || typeof v !== 'object') return false;
      var id = this.extractVideoId(v.id || v.url);
      if (!id) return false;
      if (!v.title || v.title.length < 5) return false;
      if (!v.channel || v.channel.length < 2) return false;
      if (KNOWN_INVALID_PLACEHOLDER_IDS.has(id)) return false;
      if (v.isVerified !== true || v.verificationStatus !== "verified") return false;
      if (v.viewCount !== undefined || v.views !== undefined || v.likes !== undefined || v.rating !== undefined || v.subscribers !== undefined) {
        return false;
      }
      return true;
    },

    /**
     * Retrieve verified videos from the static curated catalog (legacy fast-path)
     */
    getVerifiedVideosForChapter: function (chapterId) {
      if (!chapterId) return [];
      var list = VERIFIED_VIDEOS_BY_CHAPTER[chapterId] || [];
      return list.filter(function (v) { return VideoEngine.validateVideo(v); });
    },

    /**
     * Check if a chapter has curated verified videos in the static catalog
     */
    hasVerifiedVideos: function (chapterId) {
      return this.getVerifiedVideosForChapter(chapterId).length > 0;
    },

    /**
     * DYNAMIC YOUTUBE DISCOVERY — Main entry point
     * 
     * Searches for relevant educational videos via the server-side API.
     * Returns a Promise that resolves with an object:
     * {
     *   videos: [...],        // Array of video objects ready for display
     *   source: 'api' | 'cache' | 'curated' | 'none',
     *   query: string,        // The search query used
     *   error: string | null  // Error message if any
     * }
     * 
     * @param {Object} context - The academic context
     * @param {string} context.stream - Stream name (e.g. 'engineering')
     * @param {string} context.subject - Subject name (e.g. 'Database Management Systems')
     * @param {number} context.semester - Semester number
     * @param {string} context.chapter - Chapter title
     * @param {string} context.chapterId - Chapter ID
     * @returns {Promise<Object>}
     */
    discoverVideos: function (context) {
      var self = this;
      var requestId = ++_currentRequestId;

      if (!context || !context.subject || !context.chapter) {
        return Promise.resolve({
          videos: [],
          source: 'none',
          query: '',
          error: 'Incomplete academic context'
        });
      }

      var cacheKey = getCacheKey(
        context.stream || '',
        context.subject,
        context.semester || '',
        context.chapterId || ''
      );

      // Check client-side cache first
      var cached = getCached(cacheKey);
      if (cached && cached.videos && cached.videos.length > 0) {
        return Promise.resolve({
          videos: cached.videos,
          source: 'cache',
          query: cached.query || '',
          error: null
        });
      }

      // Check curated catalog as fast-path
      var curated = context.chapterId ? self.getVerifiedVideosForChapter(context.chapterId) : [];
      
      // Call the server-side API
      var controller = null;
      var signal = null;
      if (typeof AbortController !== 'undefined') {
        controller = new AbortController();
        signal = controller.signal;
      }

      // Set a timeout
      var timeoutId = null;
      if (controller) {
        timeoutId = setTimeout(function () { controller.abort(); }, API_TIMEOUT_MS);
      }

      var fetchOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stream: context.stream || '',
          subject: context.subject,
          semester: context.semester || '',
          chapter: context.chapter,
          chapterId: context.chapterId || '',
          allowPublic: true
        })
      };
      if (signal) fetchOptions.signal = signal;

      return fetch(API_ENDPOINT, fetchOptions)
        .then(function (res) {
          if (timeoutId) clearTimeout(timeoutId);
          if (!res.ok) throw new Error('API returned HTTP ' + res.status);
          return res.json();
        })
        .then(function (data) {
          // Check if this request is still current (user hasn't switched chapters)
          if (requestId !== _currentRequestId) {
            return { videos: [], source: 'stale', query: '', error: null };
          }

          if (!data.configured) {
            // API key not configured — fall back to curated catalog
            if (curated.length > 0) {
              return { videos: curated, source: 'curated', query: '', error: null };
            }
            return {
              videos: [],
              source: 'none',
              query: '',
              error: 'YouTube API not configured. ' + (data.message || '')
            };
          }

          if (data.error) {
            // API error — fall back to curated catalog
            if (curated.length > 0) {
              return { videos: curated, source: 'curated', query: data.query || '', error: null };
            }
            return {
              videos: [],
              source: 'none',
              query: data.query || '',
              error: data.error
            };
          }

          if (data.videos && data.videos.length > 0) {
            // Normalize videos for display
            var normalized = data.videos.map(function (v) {
              return {
                id: v.videoId,
                title: v.title,
                channel: v.channelTitle,
                duration: v.durationFormatted || formatDuration(v.duration),
                viewCount: v.viewCount,
                viewCountFormatted: formatViewCount(v.viewCount),
                publishedAt: v.publishedAt,
                url: v.url || ('https://www.youtube.com/watch?v=' + v.videoId),
                embedUrl: v.embedUrl || ('https://www.youtube-nocookie.com/embed/' + v.videoId),
                thumbnail: v.thumbnailUrl || ('https://img.youtube.com/vi/' + v.videoId + '/mqdefault.jpg'),
                relevanceScore: v.relevanceScore || 0,
                source: 'youtube-api',
                isVerified: true,
                verificationStatus: 'api-verified'
              };
            });

            // Cache the successful result
            setCache(cacheKey, { videos: normalized, query: data.query || '' });

            return {
              videos: normalized,
              source: 'api',
              query: data.query || '',
              error: null
            };
          }

          // API returned 0 videos — fall back to curated
          if (curated.length > 0) {
            return { videos: curated, source: 'curated', query: data.query || '', error: null };
          }

          return {
            videos: [],
            source: 'none',
            query: data.query || '',
            error: null
          };
        })
        .catch(function (err) {
          if (timeoutId) clearTimeout(timeoutId);
          
          // Check staleness
          if (requestId !== _currentRequestId) {
            return { videos: [], source: 'stale', query: '', error: null };
          }

          // Network/timeout error — fall back to curated
          if (curated.length > 0) {
            return { videos: curated, source: 'curated', query: '', error: null };
          }

          var errorMsg = 'Unable to reach video discovery service';
          if (err && err.name === 'AbortError') {
            errorMsg = 'Video search timed out';
          }

          return {
            videos: [],
            source: 'none',
            query: '',
            error: errorMsg
          };
        });
    },

    /**
     * Cancel any in-flight discovery request (called when user switches chapters)
     */
    cancelPendingDiscovery: function () {
      _currentRequestId++;
    },

    /**
     * Construct legitimate, dynamic YouTube search fallback URL
     */
    getYouTubeSearchUrl: function (subjectName, chapterTitle) {
      var cleanSubj = (subjectName || '').trim();
      var cleanCh = (chapterTitle || '').trim();
      var query = (cleanSubj + ' ' + cleanCh + ' lecture').replace(/\s+/g, ' ').trim();
      return "https://www.youtube.com/results?search_query=" + encodeURIComponent(query);
    },

    /**
     * Returns total count of curated verified videos in static catalog
     */
    getVerifiedCount: function () {
      var count = 0;
      Object.keys(VERIFIED_VIDEOS_BY_CHAPTER).forEach(function (k) {
        count += VERIFIED_VIDEOS_BY_CHAPTER[k].length;
      });
      return count;
    },

    /**
     * Clear the client-side cache (e.g. when API config changes)
     */
    clearCache: function () {
      _cache.clear();
    },

    /**
     * Format helpers exposed for use by UI
     */
    formatViewCount: formatViewCount,
    formatDuration: formatDuration
  };

  // Expose to global scope
  var root = typeof window !== 'undefined' ? window : (typeof global !== 'undefined' ? global : this);
  root.EduPrepVideos = VideoEngine;
  if (root.EduPrep) {
    root.EduPrep.videoEngine = VideoEngine;
  }

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = VideoEngine;
  }
})();
