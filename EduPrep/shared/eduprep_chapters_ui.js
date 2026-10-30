/**
 * EduPrep — Reusable Semester Chapters & Notes UI Component
 * Provides interactive semester selection, chapter list display,
 * Watch Videos viewer, View Full Notes viewer, and seamless return navigation.
 */

(function () {
  'use strict';

  const root = typeof window !== 'undefined' ? window : (typeof global !== 'undefined' ? global : this);
  const EduPrep = root.EduPrep || {};
  const CE = EduPrep.chaptersEngine || (typeof require !== 'undefined' ? require('./eduprep_chapters_data.js') : null);

  const state = {
    stream: null,
    subjectName: null,
    subjectId: null,
    semester: 1,
    activeView: "chapters", // "chapters" | "videos" | "notes"
    activeChapterId: null,
    containerId: null
  };

  const ChaptersUI = {
    getState: function () {
      return Object.assign({}, state);
    },

    // Initialize or render the Subject Workspace into a container element
    render: function (containerId, subjectNameOrId, streamKey, initialSemester, initialView, initialChapterId) {
      state.containerId = containerId;
      const container = document.getElementById(containerId);
      if (!container) return;

      const engine = CE || root.EduPrep.chaptersEngine;
      if (!engine) {
        container.innerHTML = '<div class="p-4 text-xs text-red-600 bg-red-50 rounded-xl">Chapters engine not loaded.</div>';
        return;
      }

      const meta = engine.getSubjectMeta(subjectNameOrId);
      if (!meta) {
        container.innerHTML = `
          <div class="p-6 bg-surface-container-low rounded-2xl border border-outline-variant/40 text-center space-y-3">
            <span class="material-symbols-outlined text-3xl text-outline">error_outline</span>
            <h4 class="font-bold text-sm text-on-surface">Subject Not Found</h4>
            <p class="text-xs text-on-surface-variant max-w-md mx-auto">
              The requested subject "${escapeHtml(subjectNameOrId || 'Unknown')}" was not found in the curriculum catalog.
            </p>
            <button type="button" onclick="EduPrepChaptersUI.returnToSubjectList()" class="px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-container transition-colors">
              Return to Subject Catalog
            </button>
          </div>
        `;
        return;
      }

      state.subjectName = meta.name;
      state.subjectId = meta.id;
      state.stream = streamKey || meta.stream;

      const primarySems = meta.primarySemesters || [1];
      state.semester = parseInt(initialSemester || primarySems[0] || 1, 10);
      state.activeView = initialView || "chapters";
      state.activeChapterId = initialChapterId || null;

      this.updateView();
    },

    // Refresh current view in the container
    updateView: function () {
      if (typeof document === 'undefined') return;
      const container = document.getElementById(state.containerId);
      if (!container) return;

      const engine = CE || root.EduPrep.chaptersEngine;
      const meta = engine.getSubjectMeta(state.subjectId);
      if (!meta) return;

      if (state.activeView === "notes" && state.activeChapterId) {
        container.innerHTML = this.renderNotesView(meta);
      } else if (state.activeView === "videos" && state.activeChapterId) {
        container.innerHTML = this.renderVideosView(meta);
      } else {
        container.innerHTML = this.renderChaptersListView(meta);
      }

      container.classList.remove("hidden");
    },

    // Render Chapters List View (with Semester Selector)
    renderChaptersListView: function (meta, optSemester) {
      const engine = CE || root.EduPrep.chaptersEngine;
      const periods = engine.getSubjectPeriods(meta.id);
      const sem = typeof optSemester !== 'undefined' ? optSemester : (state.semester || (meta.primarySemesters ? meta.primarySemesters[0] : 1));
      const chapters = engine.getChapters(meta.id, sem);
      const streamLabel = meta.stream.charAt(0).toUpperCase() + meta.stream.slice(1);

      // Semester pills HTML
      const semesterPillsHtml = periods.map(p => {
        const isCurrent = p.number === state.semester;
        const hasData = engine.hasChapters(meta.id, p.number);
        return `
          <button 
            type="button" 
            onclick="EduPrepChaptersUI.selectSemester(${p.number})"
            class="px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
              isCurrent 
                ? 'bg-primary text-white border-primary shadow-xs' 
                : hasData 
                  ? 'bg-white hover:bg-primary-fixed/20 text-on-surface border-outline-variant/60'
                  : 'bg-surface-container-low text-on-surface-variant/80 border-outline-variant/30 hover:border-outline-variant'
            }"
            title="${p.label}${hasData ? ' (Syllabus Mapped)' : ' (Not currently offered)'}"
          >
            ${p.label}
            ${hasData && !isCurrent ? '<span class="inline-block w-1.5 h-1.5 rounded-full bg-primary ml-1 align-middle"></span>' : ''}
          </button>
        `;
      }).join("");

      // Chapters cards HTML
      let chaptersBodyHtml = "";
      if (chapters.length > 0) {
        chaptersBodyHtml = `
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-2">
            ${chapters.map(ch => `
              <div class="p-4 sm:p-5 rounded-2xl bg-white border border-outline-variant/40 hover:border-primary/60 transition-all flex flex-col justify-between shadow-xs">
                <div>
                  <div class="flex items-center justify-between gap-2 mb-2">
                    <span class="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-primary-fixed text-primary">
                      Chapter ${ch.chapterNum}
                    </span>
                    <span class="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md flex items-center gap-1">
                      <span class="material-symbols-outlined text-xs">verified</span>
                      <span>Syllabus Aligned</span>
                    </span>
                  </div>
                  <h4 class="font-headline font-bold text-sm sm:text-base text-on-surface leading-snug">
                    ${escapeHtml(ch.title)}
                  </h4>
                  <p class="text-xs text-on-surface-variant mt-1.5 leading-relaxed line-clamp-2">
                    ${escapeHtml(ch.description)}
                  </p>
                </div>

                <div class="mt-4 pt-3.5 border-t border-surface-container flex items-center justify-between gap-1.5 sm:gap-2">
                  <button 
                    type="button" 
                    onclick="EduPrepChaptersUI.openChapterVideos('${ch.id}')"
                    class="flex-1 py-2 px-2 sm:px-2.5 rounded-xl bg-surface-container hover:bg-primary-fixed/40 text-on-surface text-xs font-bold transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap"
                    title="Watch Recommended Videos for ${escapeHtml(ch.title)}"
                  >
                    <span class="material-symbols-outlined text-base text-primary">smart_display</span>
                    <span>Watch Videos</span>
                  </button>
                  <a 
                    href="${engine.getReferenceBookUrl ? engine.getReferenceBookUrl(meta.name, ch.title) : ('https://www.google.com/search?tbm=bks&q=' + encodeURIComponent(meta.name + ' ' + ch.title + ' textbook'))}"
                    target="_blank" 
                    rel="noopener noreferrer"
                    class="flex-1 py-2 px-2 sm:px-2.5 rounded-xl bg-surface-container hover:bg-primary-fixed/40 text-on-surface text-xs font-bold transition-colors flex items-center justify-center gap-1.5 border border-outline-variant/40 whitespace-nowrap"
                    title="Find Reference Books & Textbooks for ${escapeHtml(ch.title)}"
                  >
                    <span class="material-symbols-outlined text-base text-secondary">auto_stories</span>
                    <span>Reference Book</span>
                  </a>
                  <button 
                    type="button" 
                    onclick="EduPrepChaptersUI.openChapterNotes('${ch.id}')"
                    class="flex-1 py-2 px-2 sm:px-2.5 rounded-xl bg-primary hover:bg-primary-container text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-xs whitespace-nowrap"
                    title="View Full Notes for ${escapeHtml(ch.title)}"
                  >
                    <span class="material-symbols-outlined text-base">menu_book</span>
                    <span>View Full Notes</span>
                  </button>
                </div>
              </div>
            `).join("")}
          </div>
        `;
      } else {
        const primaryNums = meta.primarySemesters || [1];
        const primaryLabels = primaryNums.map(n => "Semester " + n).join(", ");
        chaptersBodyHtml = `
          <div class="p-6 sm:p-8 rounded-2xl bg-surface-container-low border border-outline-variant/40 text-center space-y-3 mt-2">
            <div class="w-12 h-12 rounded-2xl bg-primary-fixed/50 text-primary flex items-center justify-center mx-auto">
              <span class="material-symbols-outlined text-2xl">event_busy</span>
            </div>
            <h4 class="font-headline font-bold text-sm sm:text-base text-on-surface">
              No Curriculum Chapters Mapped for Semester ${state.semester}
            </h4>
            <p class="text-xs sm:text-sm text-on-surface-variant max-w-md mx-auto leading-relaxed">
              <strong>${escapeHtml(meta.name)}</strong> is typically offered in <strong>${primaryLabels}</strong> under the ${escapeHtml(meta.degree || 'Degree')} syllabus.
            </p>
            <div class="pt-1">
              <button 
                type="button" 
                onclick="EduPrepChaptersUI.selectSemester(${primaryNums[0]})"
                class="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-container transition-colors shadow-xs"
              >
                <span>Jump to ${meta.stream === 'medical' ? '1st Prof' : 'Semester ' + primaryNums[0]} (Syllabus Mapped)</span>
                <span class="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            </div>
          </div>
        `;
      }

      return `
        <div class="space-y-5 animate-fade-in">
          <!-- Subject Details Header -->
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-outline-variant/30">
            <div class="flex items-start gap-3">
              <div class="w-10 h-10 rounded-xl bg-primary-fixed text-primary flex items-center justify-center shrink-0 mt-0.5">
                <span class="material-symbols-outlined text-xl">school</span>
              </div>
              <div>
                <div class="flex items-center gap-2 flex-wrap">
                  <h3 class="font-headline font-bold text-lg sm:text-xl text-on-surface leading-tight">
                    ${escapeHtml(meta.name)}
                  </h3>
                  <span class="text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-primary-fixed text-primary">
                    ${streamLabel} Stream
                  </span>
                  <span class="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant">
                    ${escapeHtml(meta.degree || 'Curriculum')}
                  </span>
                </div>
                <p class="text-xs text-on-surface-variant mt-1 leading-relaxed max-w-2xl">
                  ${escapeHtml(meta.description || 'Syllabus and chapter resources.')}
                </p>
              </div>
            </div>

            <!-- Return Action Button -->
            <button 
              type="button" 
              onclick="EduPrepChaptersUI.returnToSubjectList()" 
              class="self-start sm:self-center px-3.5 py-2 rounded-xl bg-white border border-outline-variant/60 hover:bg-surface-container text-on-surface text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs shrink-0"
              title="Return to Subject List"
            >
              <span class="material-symbols-outlined text-base">arrow_back</span>
              <span>Back to Subjects</span>
            </button>
          </div>

          <!-- Academic Period / Semester Selector -->
          <div class="space-y-2">
            <div class="flex items-center justify-between">
              <label class="text-xs font-bold uppercase tracking-wider text-on-surface-variant flex items-center gap-1.5">
                <span class="material-symbols-outlined text-sm text-primary">calendar_month</span>
                <span>Select Academic Period / Semester:</span>
              </label>
              <span class="text-[11px] text-outline">
                Viewing Semester ${state.semester}
              </span>
            </div>
            <div class="flex items-center gap-2 flex-wrap">
              ${semesterPillsHtml}
            </div>
          </div>

          <!-- Chapters List Header -->
          <div class="flex items-center justify-between pt-1">
            <div class="flex items-center gap-2">
              <h4 class="font-headline font-bold text-sm sm:text-base text-on-surface">
                Chapters & Study Units
              </h4>
              <span class="text-xs font-semibold px-2 py-0.5 rounded-md bg-surface-container text-on-surface-variant">
                ${chapters.length} ${chapters.length === 1 ? 'Chapter' : 'Chapters'}
              </span>
            </div>
            <span class="text-xs text-on-surface-variant hidden sm:inline">
              Choose a chapter to watch videos or read full study notes
            </span>
          </div>

          <!-- Chapters Grid Body -->
          ${chaptersBodyHtml}

          <!-- Quick Exam Preparation Tools Hub -->
          <div class="mt-4 pt-4 border-t border-outline-variant/30">
            <h5 class="text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-3 flex items-center gap-1.5">
              <span class="material-symbols-outlined text-sm text-primary">apps</span>
              <span>Available Semester Tools for ${escapeHtml(meta.name)}</span>
            </h5>
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5">
              <a href="resources_dashboard/code.html?subject=${encodeURIComponent(meta.name)}" class="p-3 rounded-xl bg-surface-container-low hover:bg-primary-fixed/40 border border-outline-variant/40 flex items-center justify-between text-xs font-semibold text-primary transition-colors">
                <span class="flex items-center gap-2">
                  <span class="material-symbols-outlined text-base">menu_book</span>
                  <span>Study Resources</span>
                </span>
                <span class="material-symbols-outlined text-sm">arrow_forward</span>
              </a>
              <a href="previous_year_papers/code.html?subject=${encodeURIComponent(meta.name)}" class="p-3 rounded-xl bg-surface-container-low hover:bg-primary-fixed/40 border border-outline-variant/40 flex items-center justify-between text-xs font-semibold text-primary transition-colors">
                <span class="flex items-center gap-2">
                  <span class="material-symbols-outlined text-base">description</span>
                  <span>PYQ Papers</span>
                </span>
                <span class="material-symbols-outlined text-sm">arrow_forward</span>
              </a>
              <a href="mcq_practice_exam/code.html?subject=${encodeURIComponent(meta.name)}" class="p-3 rounded-xl bg-surface-container-low hover:bg-primary-fixed/40 border border-outline-variant/40 flex items-center justify-between text-xs font-semibold text-primary transition-colors">
                <span class="flex items-center gap-2">
                  <span class="material-symbols-outlined text-base">quiz</span>
                  <span>Practice Tests</span>
                </span>
                <span class="material-symbols-outlined text-sm">arrow_forward</span>
              </a>
              <a href="revision_flashcards/code.html?subject=${encodeURIComponent(meta.name)}" class="p-3 rounded-xl bg-surface-container-low hover:bg-primary-fixed/40 border border-outline-variant/40 flex items-center justify-between text-xs font-semibold text-primary transition-colors">
                <span class="flex items-center gap-2">
                  <span class="material-symbols-outlined text-base">style</span>
                  <span>3D Flashcards</span>
                </span>
                <span class="material-symbols-outlined text-sm">arrow_forward</span>
              </a>
            </div>
          </div>
        </div>
      `;
    },


    // Render Watch Videos View (Dynamic YouTube Discovery with Synchronous SSR/Test Support)
    renderVideosView: function (meta, optChapterId) {
      const engine = CE || root.EduPrep.chaptersEngine;
      const chId = optChapterId || state.activeChapterId;
      const chapter = engine.getChapterById(chId);
      if (!chapter) {
        return this.renderChaptersListView(meta);
      }

      const searchUrl = engine.getYouTubeSearchUrl(meta.name, chapter.title);
      const isNode = typeof window === 'undefined' || typeof document === 'undefined';

      // Query verified videos from curated catalog
      const verifiedVideos = (engine.getChapterVideos ? engine.getChapterVideos(chId) : []) || [];
      const hasVerified = Array.isArray(verifiedVideos) && verifiedVideos.length > 0;

      // In Node.js / test environment, return synchronous verified or fallback HTML
      if (isNode) {
        return this._renderStaticVideosHtml(meta, chapter, verifiedVideos, searchUrl);
      }

      // --- BROWSER ENVIRONMENT ---
      const ve = root.EduPrepVideos || (root.EduPrep && root.EduPrep.videoEngine);

      // Check if we have cached discovered videos for this chapter
      let cachedVideos = null;
      if (ve && typeof ve.discoverVideos === 'function') {
        const cacheKey = [state.stream || meta.stream || '', meta.name, state.semester, chapter.id, 1].join('|');
        // Check cache if accessible
      }

      // If chapter already has verified videos, render them right away (zero latency)
      if (hasVerified) {
        return this._renderStaticVideosHtml(meta, chapter, verifiedVideos, searchUrl);
      }

      // If no verified videos in catalog, initiate dynamic YouTube discovery
      const shellHtml = `
        <div class="space-y-5 animate-fade-in">
          <!-- Top Return Navigation Bar -->
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-outline-variant/30">
            <div>
              <div class="flex items-center gap-2 mb-1">
                <button 
                  type="button" 
                  onclick="EduPrepChaptersUI.backToChapters()"
                  class="p-1.5 rounded-lg hover:bg-surface-container text-primary font-bold flex items-center gap-1 text-xs transition-colors"
                  aria-label="Back to Chapters"
                >
                  <span class="material-symbols-outlined text-base">arrow_back</span>
                  <span>Back to Chapters</span>
                </button>
                <span class="text-xs text-outline">•</span>
                <span class="text-xs font-bold text-on-surface-variant">${escapeHtml(meta.name)}</span>
                <span class="text-xs text-outline">•</span>
                <span class="text-xs font-bold text-primary">Semester ${state.semester}</span>
              </div>
              <h3 class="font-headline font-extrabold text-lg sm:text-xl text-on-surface leading-tight" id="videosViewTitle">
                Recommended YouTube Videos
              </h3>
              <p class="text-xs text-on-surface-variant mt-0.5">
                Chapter ${chapter.chapterNum}: <strong>${escapeHtml(chapter.title)}</strong>
              </p>
            </div>

            <!-- Notes & Reference Shortcuts -->
            <div class="flex items-center gap-2 self-start sm:self-center shrink-0">
              <a 
                href="${engine.getReferenceBookUrl ? engine.getReferenceBookUrl(meta.name, chapter.title) : ('https://www.google.com/search?tbm=bks&q=' + encodeURIComponent(meta.name + ' ' + chapter.title + ' textbook'))}"
                target="_blank" 
                rel="noopener noreferrer"
                class="px-3.5 py-2 rounded-xl bg-white border border-outline-variant/60 hover:bg-surface-container text-on-surface text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
                title="Find Reference Books on Google Books"
              >
                <span class="material-symbols-outlined text-base text-secondary">auto_stories</span>
                <span>Reference Book</span>
              </a>
              <button 
                type="button" 
                onclick="EduPrepChaptersUI.openChapterNotes('${chapter.id}')"
                class="px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-container transition-colors flex items-center gap-1.5 shadow-xs"
              >
                <span class="material-symbols-outlined text-base">menu_book</span>
                <span>View Full Notes</span>
              </button>
            </div>
          </div>

          <!-- Dynamic Video Content Area -->
          <div id="videoDiscoveryContent">
            <!-- Loading State -->
            <div class="p-8 sm:p-12 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 text-center max-w-2xl mx-auto space-y-4">
              <div class="w-14 h-14 rounded-2xl bg-primary-fixed/50 text-primary flex items-center justify-center mx-auto animate-pulse">
                <span class="material-symbols-outlined text-3xl">smart_display</span>
              </div>
              <div class="space-y-2">
                <h4 class="font-headline font-bold text-sm sm:text-base text-on-surface">
                  Finding the best relevant video…
                </h4>
                <p class="text-xs text-on-surface-variant max-w-md mx-auto">
                  Searching YouTube for educational lectures on <strong>${escapeHtml(chapter.title)}</strong>
                </p>
                <div class="flex justify-center pt-2">
                  <div class="flex items-center gap-1.5">
                    <div class="w-2 h-2 rounded-full bg-primary animate-bounce" style="animation-delay: 0ms"></div>
                    <div class="w-2 h-2 rounded-full bg-primary animate-bounce" style="animation-delay: 150ms"></div>
                    <div class="w-2 h-2 rounded-full bg-primary animate-bounce" style="animation-delay: 300ms"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Bottom Return Action -->
          <div class="pt-2">
            <button 
              type="button" 
              onclick="EduPrepChaptersUI.backToChapters()"
              class="px-4 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-bold transition-colors inline-flex items-center gap-1.5"
            >
              <span class="material-symbols-outlined text-sm">arrow_back</span>
              <span>Back to Chapter List</span>
            </button>
          </div>
        </div>
      `;

      if (ve && typeof ve.discoverVideos === 'function') {
        ve.cancelPendingDiscovery();

        const discoveryContext = {
          stream: state.stream || meta.stream || '',
          subject: meta.name,
          semester: state.semester,
          chapter: chapter.title,
          chapterId: chapter.id
        };

        setTimeout(function () {
          ve.discoverVideos(discoveryContext).then(function (result) {
            if (state.activeView !== 'videos' || state.activeChapterId !== chId) return;
            
            const contentEl = document.getElementById('videoDiscoveryContent');
            const titleEl = document.getElementById('videosViewTitle');
            if (!contentEl) return;

            if (result.source === 'stale') return;

            if (result.videos && result.videos.length > 0) {
              if (titleEl) titleEl.textContent = 'Recommended YouTube Videos';

              const videoCardsHtml = result.videos.slice(0, 4).map(function (v, idx) {
                return ChaptersUI._renderVideoCard(v, idx === 0);
              }).join('');

              const sourceLabel = result.source === 'api' || result.source === 'youtube-api' ? 'Discovered via YouTube API' :
                                  result.source === 'youtube-public' ? 'Discovered via YouTube' :
                                  result.source === 'cache' ? 'Cached verified result' :
                                  result.source === 'curated' ? 'Curated verified lecture' : 'Verified Educational Resource';

              contentEl.innerHTML = `
                <div class="space-y-4">
                  <div class="flex items-center justify-between gap-2 flex-wrap">
                    <span class="text-xs font-extrabold uppercase tracking-wider text-primary flex items-center gap-1.5">
                      <span class="material-symbols-outlined text-sm">verified</span>
                      <span>Syllabus-Aligned Video Lectures</span>
                    </span>
                    ${sourceLabel ? '<span class="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-surface-container text-on-surface-variant">' + escapeHtml(sourceLabel) + '</span>' : ''}
                  </div>

                  <!-- 2-Column Recommended Videos Grid (Matching Image 2) -->
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
                    ${videoCardsHtml}
                  </div>
                </div>

                <!-- Explore More Banner -->
                <div class="mt-6 p-4 sm:p-5 rounded-2xl bg-surface-container-low border border-outline-variant/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-xl bg-red-100 text-red-700 flex items-center justify-center shrink-0">
                      <span class="material-symbols-outlined text-xl">search</span>
                    </div>
                    <div>
                      <h5 class="font-bold text-xs sm:text-sm text-on-surface">Explore More Video Lectures on YouTube</h5>
                      <p class="text-xs text-on-surface-variant mt-0.5">Search verified university lectures for "${escapeHtml(chapter.title)}"</p>
                    </div>
                  </div>
                  <div class="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                    <a 
                      href="${engine.getReferenceBookUrl ? engine.getReferenceBookUrl(meta.name, chapter.title) : ('https://www.google.com/search?tbm=bks&q=' + encodeURIComponent(meta.name + ' ' + chapter.title + ' textbook'))}"
                      target="_blank" 
                      rel="noopener noreferrer"
                      class="px-3.5 py-2 rounded-xl bg-white border border-outline-variant/70 hover:bg-surface-container text-on-surface text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                      title="Find Reference Books on Google Books"
                    >
                      <span class="material-symbols-outlined text-sm text-secondary">auto_stories</span>
                      <span>Reference Books</span>
                    </a>
                    <a 
                      href="${searchUrl}" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      class="px-4 py-2 rounded-xl bg-white border border-outline-variant/70 hover:bg-surface-container text-on-surface text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-xs shrink-0"
                    >
                      <span>Search YouTube</span>
                      <span class="material-symbols-outlined text-sm">open_in_new</span>
                    </a>
                  </div>
                </div>
              `;
            } else {
              if (titleEl) titleEl.textContent = 'Video Resources';

              contentEl.innerHTML = `
                <div class="p-6 sm:p-8 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 text-center max-w-2xl mx-auto space-y-4">
                  <div class="w-14 h-14 rounded-2xl bg-surface-container text-outline flex items-center justify-center mx-auto">
                    <span class="material-symbols-outlined text-3xl">smart_display</span>
                  </div>
                  <div class="space-y-1.5">
                    <h4 class="font-headline font-extrabold text-base sm:text-lg text-on-surface">
                      No verified videos are currently available for this chapter
                    </h4>
                    <p class="text-xs sm:text-sm text-on-surface-variant max-w-lg mx-auto leading-relaxed">
                      EduPrep only curates and links verified educational lectures that strictly align with your syllabus. You can study the complete chapter notes below or search YouTube directly for this topic.
                    </p>
                  </div>
                  <div class="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                    <button 
                      type="button" 
                      onclick="EduPrepChaptersUI.openChapterNotes('${chapter.id}')"
                      class="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-primary text-white text-xs font-bold hover:opacity-90 flex items-center justify-center gap-1.5 transition-opacity shadow-xs"
                    >
                      <span class="material-symbols-outlined text-base">menu_book</span>
                      <span>View Full Notes</span>
                    </button>
                    <a 
                      href="${searchUrl}" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      class="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-outline-variant hover:bg-surface-container text-on-surface text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <span class="material-symbols-outlined text-base text-red-600">search</span>
                      <span>Search YouTube</span>
                      <span class="material-symbols-outlined text-xs">open_in_new</span>
                    </a>
                  </div>
                  <p class="text-[11px] text-outline italic pt-1">
                    Notice: Search results open YouTube directly in a new tab and are not pre-verified by EduPrep.
                  </p>
                </div>
              `;
            }
          });
        }, 50);
      }

      return shellHtml;
    },

    // Helper to render static HTML (used for SSR/tests or instant verified render)
    _renderStaticVideosHtml: function (meta, chapter, videos, searchUrl) {
      const engine = CE || (root.EduPrep && root.EduPrep.chaptersEngine) || root.EduPrepChapters;
      const hasVerified = Array.isArray(videos) && videos.length > 0;
      const headerTitle = hasVerified ? "Recommended YouTube Videos" : "Video Resources";

      let contentBodyHtml = "";

      if (hasVerified) {
        const videosCardsHtml = videos.map((v) => `
          <div class="p-4 sm:p-5 rounded-2xl bg-white border border-outline-variant/40 hover:border-primary/60 transition-all flex flex-col justify-between shadow-xs">
            <div>
              <div class="relative w-full aspect-video rounded-xl overflow-hidden bg-slate-900 mb-3.5 group">
                <img 
                  src="${v.thumbnail || `https://img.youtube.com/vi/${v.id}/mqdefault.jpg`}" 
                  alt="${escapeHtml(v.title)}" 
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                  onerror="this.onerror=null; this.parentElement.classList.add('bg-slate-800'); this.style.opacity='0.4';"
                />
                <a 
                  href="${v.url}" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  class="absolute inset-0 bg-black/30 hover:bg-black/10 flex items-center justify-center transition-colors"
                  title="Watch on YouTube: ${escapeHtml(v.title)}"
                >
                  <div class="w-12 h-12 rounded-full bg-red-600/90 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <span class="material-symbols-outlined text-2xl" style="font-variation-settings: 'FILL' 1;">play_arrow</span>
                  </div>
                </a>
              </div>

              <div class="space-y-1">
                <div class="flex items-center justify-between text-[11px] font-bold text-red-700">
                  <span class="flex items-center gap-1.5">
                    <span class="material-symbols-outlined text-sm">smart_display</span>
                    <span>${escapeHtml(v.channel || 'Educational Channel')}</span>
                  </span>
                  ${v.duration ? `<span class="bg-surface-container px-2 py-0.5 rounded text-[10px] text-on-surface-variant font-semibold">${v.duration}</span>` : ''}
                </div>
                <h5 class="font-headline font-bold text-sm text-on-surface leading-snug">
                  ${escapeHtml(v.title)}
                </h5>
              </div>
            </div>

            <div class="mt-4 pt-3 border-t border-surface-container flex items-center justify-between gap-2">
              <a 
                href="${v.url}" 
                target="_blank" 
                rel="noopener noreferrer"
                class="w-full py-2 px-3 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Open on YouTube</span>
                <span class="material-symbols-outlined text-sm">open_in_new</span>
              </a>
            </div>
          </div>
        `).join("");

        contentBodyHtml = `
          <!-- Verified Videos Grid -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            ${videosCardsHtml}
          </div>

          <!-- Direct YouTube Search Link Banner -->
          <div class="p-4 sm:p-5 rounded-2xl bg-surface-container-low border border-outline-variant/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-red-100 text-red-700 flex items-center justify-center shrink-0">
                <span class="material-symbols-outlined text-xl">search</span>
              </div>
              <div>
                <h5 class="font-bold text-xs sm:text-sm text-on-surface">Explore More Video Lectures on YouTube</h5>
                <p class="text-xs text-on-surface-variant mt-0.5">Search verified university lectures for "${escapeHtml(chapter.title)}"</p>
              </div>
            </div>
            <a 
              href="${searchUrl}" 
              target="_blank" 
              rel="noopener noreferrer"
              class="px-4 py-2 rounded-xl bg-white border border-outline-variant/70 hover:bg-surface-container text-on-surface text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-xs shrink-0"
            >
              <span>Search YouTube Directly</span>
              <span class="material-symbols-outlined text-sm">open_in_new</span>
            </a>
          </div>
        `;
      } else {
        contentBodyHtml = `
          <div class="p-6 sm:p-8 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 text-center max-w-2xl mx-auto space-y-4">
            <div class="w-14 h-14 rounded-2xl bg-surface-container text-outline flex items-center justify-center mx-auto">
              <span class="material-symbols-outlined text-3xl">smart_display</span>
            </div>
            <div class="space-y-1.5">
              <h4 class="font-headline font-extrabold text-base sm:text-lg text-on-surface">
                No verified videos are currently available for this chapter
              </h4>
              <p class="text-xs sm:text-sm text-on-surface-variant max-w-lg mx-auto leading-relaxed">
                EduPrep only curates and links verified educational lectures that strictly align with your syllabus. You can study the complete chapter notes below or search YouTube directly for this topic.
              </p>
            </div>
            <div class="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button 
                type="button" 
                onclick="EduPrepChaptersUI.openChapterNotes('${chapter.id}')"
                class="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-primary text-white text-xs font-bold hover:opacity-90 flex items-center justify-center gap-1.5 transition-opacity shadow-xs"
              >
                <span class="material-symbols-outlined text-base">menu_book</span>
                <span>View Full Notes</span>
              </button>
              <a 
                href="${searchUrl}" 
                target="_blank" 
                rel="noopener noreferrer"
                class="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-outline-variant hover:bg-surface-container text-on-surface text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
              >
                <span class="material-symbols-outlined text-base text-red-600">search</span>
                <span>Search YouTube</span>
                <span class="material-symbols-outlined text-xs">open_in_new</span>
              </a>
            </div>
            <p class="text-[11px] text-outline italic pt-1">
              Notice: Search results open YouTube directly in a new tab and are not pre-verified by EduPrep.
            </p>
          </div>
        `;
      }

      return `
        <div class="space-y-5 animate-fade-in">
          <!-- Top Return Navigation Bar -->
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-outline-variant/30">
            <div>
              <div class="flex items-center gap-2 mb-1">
                <button 
                  type="button" 
                  onclick="EduPrepChaptersUI.backToChapters()"
                  class="p-1.5 rounded-lg hover:bg-surface-container text-primary font-bold flex items-center gap-1 text-xs transition-colors"
                >
                  <span class="material-symbols-outlined text-base">arrow_back</span>
                  <span>Back to Chapters</span>
                </button>
                <span class="text-xs text-outline">•</span>
                <span class="text-xs font-bold text-on-surface-variant">${escapeHtml(meta.name)}</span>
                <span class="text-xs text-outline">•</span>
                <span class="text-xs font-bold text-primary">Semester ${state.semester}</span>
              </div>
              <h3 class="font-headline font-extrabold text-lg sm:text-xl text-on-surface leading-tight">
                ${headerTitle}
              </h3>
              <p class="text-xs text-on-surface-variant mt-0.5">
                Chapter ${chapter.chapterNum}: <strong>${escapeHtml(chapter.title)}</strong>
              </p>
            </div>

            <!-- Action Shortcuts -->
            <div class="flex items-center gap-2 self-start sm:self-center shrink-0">
              <a 
                href="${engine.getReferenceBookUrl ? engine.getReferenceBookUrl(meta.name, chapter.title) : ('https://www.google.com/search?tbm=bks&q=' + encodeURIComponent(meta.name + ' ' + chapter.title + ' textbook'))}"
                target="_blank" 
                rel="noopener noreferrer"
                class="px-3.5 py-2 rounded-xl bg-white border border-outline-variant/60 hover:bg-surface-container text-on-surface text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
                title="Find Reference Books on Google Books"
              >
                <span class="material-symbols-outlined text-base text-secondary">auto_stories</span>
                <span>Reference Book</span>
              </a>
              <button 
                type="button" 
                onclick="EduPrepChaptersUI.openChapterNotes('${chapter.id}')"
                class="px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-container transition-colors flex items-center gap-1.5 shadow-xs"
              >
                <span class="material-symbols-outlined text-base">menu_book</span>
                <span>View Full Notes</span>
              </button>
            </div>
          </div>

          ${contentBodyHtml}

          <!-- Bottom Return Action -->
          <div class="pt-2">
            <button 
              type="button" 
              onclick="EduPrepChaptersUI.backToChapters()"
              class="px-4 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-bold transition-colors inline-flex items-center gap-1.5"
            >
              <span class="material-symbols-outlined text-sm">arrow_back</span>
              <span>Back to Chapter List</span>
            </button>
          </div>
        </div>
      `;
    },

    /**
     * Render a single video card (used internally by renderVideosView)
     * @param {Object} v - Video data object
     * @param {boolean} isPrimary - Whether this is the primary (featured) video
     * @returns {string} HTML string
     */
    _renderVideoCard: function (v, isPrimary) {
      let viewInfo = '';
      if (v.viewCountFormatted) {
        viewInfo = v.viewCountFormatted;
      } else if (v.viewCount) {
        const ve = root.EduPrepVideos || (root.EduPrep && root.EduPrep.videoEngine);
        viewInfo = ve && typeof ve.formatViewCount === 'function' ? ve.formatViewCount(v.viewCount) : (v.viewCount + ' views');
      }

      let durationStr = v.duration || '';
      if (!durationStr && v.durationFormatted) durationStr = v.durationFormatted;

      const cardClass = isPrimary
        ? 'p-4 sm:p-5 rounded-2xl bg-white border-2 border-primary/30 hover:border-primary/60 transition-all flex flex-col justify-between shadow-md'
        : 'p-4 rounded-2xl bg-white border border-outline-variant/40 hover:border-primary/60 transition-all flex flex-col justify-between shadow-xs';

      return `
        <div class="${cardClass}">
          <div>
            <!-- Video Thumbnail -->
            <div class="relative w-full aspect-video rounded-xl overflow-hidden bg-slate-900 mb-3.5 group">
              <img 
                src="${v.thumbnail || 'https://img.youtube.com/vi/' + v.id + '/mqdefault.jpg'}" 
                alt="${escapeHtml(v.title)}" 
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
                onerror="this.onerror=null; this.parentElement.classList.add('bg-slate-800'); this.style.opacity='0.4';"
              />
              <a 
                href="${v.url}" 
                target="_blank" 
                rel="noopener noreferrer" 
                class="absolute inset-0 bg-black/30 hover:bg-black/10 flex items-center justify-center transition-colors"
                title="Watch on YouTube: ${escapeHtml(v.title)}"
              >
                <div class="w-12 h-12 rounded-full bg-red-600/90 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <span class="material-symbols-outlined text-2xl" style="font-variation-settings: 'FILL' 1;">play_arrow</span>
                </div>
              </a>
              ${durationStr ? '<span class="absolute bottom-2 right-2 bg-black/80 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">' + escapeHtml(durationStr) + '</span>' : ''}
            </div>

            <div class="space-y-1.5">
              <div class="flex items-center justify-between gap-2">
                <span class="flex items-center gap-1.5 text-[11px] font-bold text-red-700">
                  <span class="material-symbols-outlined text-sm">smart_display</span>
                  <span>${escapeHtml(v.channel || 'Educational Channel')}</span>
                </span>
                ${viewInfo ? '<span class="text-[10px] font-semibold text-on-surface-variant bg-surface-container px-2 py-0.5 rounded">' + escapeHtml(viewInfo) + '</span>' : ''}
              </div>
              <h5 class="font-headline font-bold text-sm text-on-surface leading-snug line-clamp-2">
                ${escapeHtml(v.title)}
              </h5>
            </div>
          </div>

          <div class="mt-4 pt-3 border-t border-surface-container flex items-center gap-2">
            <a 
              href="${v.url}" 
              target="_blank" 
              rel="noopener noreferrer"
              class="flex-1 py-2 px-3 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Open on YouTube</span>
              <span class="material-symbols-outlined text-sm">open_in_new</span>
            </a>
          </div>
        </div>
      `;
    },

    // Render View Full Notes View
    renderNotesView: function (meta, optChapterId) {
      const engine = CE || root.EduPrep.chaptersEngine;
      const chId = optChapterId || state.activeChapterId;
      const chapter = engine.getChapterById(chId);
      if (!chapter || !chapter.notes) {
        return this.renderChaptersListView(meta);
      }

      const n = chapter.notes;

      // Objectives list HTML
      const objectivesHtml = (n.learningObjectives || []).map(obj => `
        <li class="flex items-start gap-2 text-xs sm:text-sm text-on-surface">
          <span class="material-symbols-outlined text-base text-primary shrink-0 mt-0.5">check_circle</span>
          <span>${escapeHtml(obj)}</span>
        </li>
      `).join("");

      // Definitions list HTML
      const definitionsHtml = (n.keyDefinitions || []).map(d => `
        <div class="p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/40 space-y-1">
          <div class="text-xs font-bold text-primary flex items-center gap-1">
            <span class="material-symbols-outlined text-sm">bookmark</span>
            <span>${escapeHtml(d.term)}</span>
          </div>
          <p class="text-xs text-on-surface-variant leading-relaxed">
            ${escapeHtml(d.definition)}
          </p>
        </div>
      `).join("");

      // Conceptual Explanations HTML
      const conceptsHtml = (n.conceptualExplanations || []).map(c => `
        <div class="space-y-1.5">
          <h5 class="font-headline font-bold text-sm sm:text-base text-on-surface">
            ${escapeHtml(c.heading)}
          </h5>
          <p class="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
            ${escapeHtml(c.content)}
          </p>
        </div>
      `).join("");

      // Formulas list HTML
      const formulasHtml = (n.formulasOrRules || []).map(f => `
        <div class="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start justify-between gap-3">
          <div class="space-y-1">
            <span class="text-[10px] font-extrabold uppercase tracking-wider text-amber-800 dark:text-amber-200 block">
              ${escapeHtml(f.name)}
            </span>
            <code class="text-xs sm:text-sm font-mono font-bold text-amber-950 dark:text-amber-100 block">
              ${escapeHtml(f.formula)}
            </code>
          </div>
          <span class="material-symbols-outlined text-base text-amber-700 shrink-0 mt-0.5">functions</span>
        </div>
      `).join("");

      // Examples / Problems HTML
      const problemsHtml = (n.examplesOrProblems || []).map(p => `
        <div class="p-4 rounded-xl bg-surface-container-low border border-outline-variant/40 space-y-2">
          <div class="flex items-center gap-1.5 text-xs font-bold text-secondary">
            <span class="material-symbols-outlined text-sm">calculate</span>
            <span>${escapeHtml(p.title)}</span>
          </div>
          <p class="text-xs sm:text-sm font-semibold text-on-surface">
            <strong>Problem:</strong> ${escapeHtml(p.problem)}
          </p>
          <div class="text-xs text-on-surface-variant bg-white p-3 rounded-lg border border-outline-variant/30 leading-relaxed">
            <strong>Step-by-Step Solution:</strong><br/>
            ${escapeHtml(p.solution)}
          </div>
        </div>
      `).join("");

      // Revision points list HTML
      const revisionHtml = (n.revisionPoints || []).map(pt => `
        <li class="flex items-start gap-2 text-xs text-on-surface">
          <span class="material-symbols-outlined text-sm text-amber-600 shrink-0 mt-0.5">bolt</span>
          <span>${escapeHtml(pt)}</span>
        </li>
      `).join("");

      return `
        <div class="space-y-6 animate-fade-in">
          <!-- Top Return Navigation Bar -->
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-outline-variant/30">
            <div>
              <div class="flex items-center gap-2 mb-1">
                <button 
                  type="button" 
                  onclick="EduPrepChaptersUI.backToChapters()"
                  class="p-1.5 rounded-lg hover:bg-surface-container text-primary font-bold flex items-center gap-1 text-xs transition-colors"
                >
                  <span class="material-symbols-outlined text-base">arrow_back</span>
                  <span>Back to Chapters</span>
                </button>
                <span class="text-xs text-outline">•</span>
                <span class="text-xs font-bold text-on-surface-variant">${escapeHtml(meta.name)}</span>
                <span class="text-xs text-outline">•</span>
                <span class="text-xs font-bold text-primary">Semester ${state.semester}</span>
              </div>
              <h3 class="font-headline font-extrabold text-lg sm:text-2xl text-on-surface leading-tight">
                ${escapeHtml(chapter.title)}
              </h3>
              <div class="flex items-center gap-2 mt-1.5 flex-wrap">
                <span class="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-primary-fixed text-primary">
                  Chapter ${chapter.chapterNum}
                </span>
                <span class="text-xs text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full font-semibold border border-emerald-200">
                  ${escapeHtml(n.attribution || 'Syllabus Aligned Study Material')}
                </span>
              </div>
            </div>

            <!-- Action Shortcuts -->
            <div class="flex items-center gap-2 self-start sm:self-center shrink-0">
              <a 
                href="${engine.getReferenceBookUrl ? engine.getReferenceBookUrl(meta.name, chapter.title) : ('https://www.google.com/search?tbm=bks&q=' + encodeURIComponent(meta.name + ' ' + chapter.title + ' textbook'))}"
                target="_blank" 
                rel="noopener noreferrer"
                class="px-3.5 py-2 rounded-xl bg-white border border-outline-variant/60 hover:bg-surface-container text-on-surface text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
                title="Find Reference Books on Google Books"
              >
                <span class="material-symbols-outlined text-base text-secondary">auto_stories</span>
                <span>Reference Book</span>
              </a>
              <button 
                type="button" 
                onclick="EduPrepChaptersUI.openChapterVideos('${chapter.id}')"
                class="px-4 py-2 rounded-xl bg-surface-container hover:bg-primary-fixed/40 text-on-surface text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs"
              >
                <span class="material-symbols-outlined text-base text-primary">smart_display</span>
                <span>Watch Videos</span>
              </button>
            </div>
          </div>

          <!-- Section 1: Learning Objectives -->
          <div class="p-5 rounded-2xl bg-white border border-outline-variant/40 space-y-2.5 shadow-xs">
            <h4 class="font-headline font-bold text-xs uppercase tracking-wider text-primary flex items-center gap-1.5">
              <span class="material-symbols-outlined text-base">checklist</span>
              <span>Learning Objectives</span>
            </h4>
            <ul class="space-y-1.5">
              ${objectivesHtml}
            </ul>
          </div>

          <!-- Section 2: Key Definitions & Terminology -->
          <div class="space-y-2.5">
            <h4 class="font-headline font-bold text-xs uppercase tracking-wider text-on-surface-variant flex items-center gap-1.5">
              <span class="material-symbols-outlined text-base text-secondary">menu_book</span>
              <span>Key Definitions & Core Terminology</span>
            </h4>
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              ${definitionsHtml}
            </div>
          </div>

          <!-- Section 3: Conceptual Explanations -->
          <div class="p-5 sm:p-6 rounded-2xl bg-white border border-outline-variant/40 space-y-4 shadow-xs">
            <h4 class="font-headline font-bold text-xs uppercase tracking-wider text-primary flex items-center gap-1.5 border-b border-surface-container pb-2.5">
              <span class="material-symbols-outlined text-base">article</span>
              <span>Detailed Conceptual Explanations</span>
            </h4>
            <div class="space-y-4">
              ${conceptsHtml}
            </div>
          </div>

          <!-- Section 4: Key Formulas & Rules (if present) -->
          ${formulasHtml ? `
            <div class="space-y-2.5">
              <h4 class="font-headline font-bold text-xs uppercase tracking-wider text-amber-800 dark:text-amber-200 flex items-center gap-1.5">
                <span class="material-symbols-outlined text-base">bolt</span>
                <span>Important Formulas & Governing Principles</span>
              </h4>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                ${formulasHtml}
              </div>
            </div>
          ` : ''}

          <!-- Section 5: Worked Exam Problems / Applications -->
          <div class="space-y-2.5">
            <h4 class="font-headline font-bold text-xs uppercase tracking-wider text-secondary flex items-center gap-1.5">
              <span class="material-symbols-outlined text-base">edit_note</span>
              <span>Worked Example & Exam Problem Solution</span>
            </h4>
            ${problemsHtml}
          </div>

          <!-- Section 6: Summary & Revision Points -->
          <div class="p-5 rounded-2xl bg-gradient-to-r from-primary-fixed/30 to-surface-container border border-primary/20 space-y-3">
            <h4 class="font-headline font-bold text-xs uppercase tracking-wider text-primary flex items-center gap-1.5">
              <span class="material-symbols-outlined text-base">lightbulb</span>
              <span>Chapter Summary & High-Yield Revision Points</span>
            </h4>
            <p class="text-xs sm:text-sm text-on-surface leading-relaxed">
              ${escapeHtml(n.summary || '')}
            </p>
            <ul class="space-y-1 pt-1 border-t border-primary/10">
              ${revisionHtml}
            </ul>
          </div>

          <!-- Bottom Navigation Actions -->
          <div class="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
            <button 
              type="button" 
              onclick="EduPrepChaptersUI.backToChapters()"
              class="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-bold transition-colors inline-flex items-center justify-center gap-1.5"
            >
              <span class="material-symbols-outlined text-sm">arrow_back</span>
              <span>Back to Chapter List</span>
            </button>
            <button 
              type="button" 
              onclick="EduPrepChaptersUI.openChapterVideos('${chapter.id}')"
              class="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-container text-white text-xs font-bold transition-colors inline-flex items-center justify-center gap-1.5 shadow-xs"
            >
              <span class="material-symbols-outlined text-base">smart_display</span>
              <span>Watch Chapter Videos</span>
            </button>
          </div>
        </div>
      `;
    },

    // Action handlers
    selectSemester: function (semesterNumber) {
      state.semester = parseInt(semesterNumber, 10);
      state.activeView = "chapters";
      state.activeChapterId = null;
      this.updateView();
      this.syncUrlHash();
    },

    openChapterVideos: function (chapterId) {
      state.activeChapterId = chapterId;
      state.activeView = "videos";
      this.updateView();
      this.syncUrlHash();
      this.scrollToTop();
    },

    openChapterNotes: function (chapterId) {
      state.activeChapterId = chapterId;
      state.activeView = "notes";
      this.updateView();
      this.syncUrlHash();
      this.scrollToTop();
    },

    backToChapters: function () {
      state.activeView = "chapters";
      state.activeChapterId = null;
      this.updateView();
      this.syncUrlHash();
      this.scrollToTop();
    },

    returnToChaptersList: function () {
      this.backToChapters();
    },

    returnToSubjectList: function () {
      state.activeView = "chapters";
      state.activeChapterId = null;
      if (typeof document !== 'undefined') {
        const container = document.getElementById(state.containerId);
        if (container) container.classList.add("hidden");
      }

      if (typeof root.closeSubjectDetail === "function") {
        root.closeSubjectDetail();
      } else if (typeof window !== "undefined" && window.location && (window.location.pathname.includes("subject_details") || (typeof document !== 'undefined' && !document.getElementById("streamSubjectsPanel")))) {
        window.location.href = "../index.html#stream=" + encodeURIComponent(state.stream || "engineering");
        return;
      }

      // Restore URL hash to stream level
      if (typeof window !== "undefined" && window.history && window.history.replaceState) {
        window.history.replaceState(null, "", state.stream ? "#stream=" + state.stream : window.location.pathname);
      }

      if (typeof document !== 'undefined') {
        const panel = document.getElementById("streamSubjectsPanel");
        if (panel && typeof panel.scrollIntoView === 'function') {
          panel.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }
      }
    },

    syncUrlHash: function () {
      if (typeof window !== 'undefined' && window.history && window.history.replaceState) {
        let hash = "#stream=" + encodeURIComponent(state.stream || "engineering") + 
                   "&subject=" + encodeURIComponent(state.subjectName || "") + 
                   "&sem=" + state.semester;
        if (state.activeView !== "chapters") {
          hash += "&view=" + state.activeView;
        }
        if (state.activeChapterId) {
          hash += "&ch=" + encodeURIComponent(state.activeChapterId);
        }
        window.history.replaceState(null, "", hash);
      }
    },

    scrollToTop: function () {
      if (typeof document === 'undefined') return;
      const container = document.getElementById(state.containerId);
      if (container && typeof container.scrollIntoView === 'function') {
        container.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  function escapeHtml(str) {
    if (str === null || str === undefined) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  // Expose globally
  root.EduPrepChaptersUI = ChaptersUI;
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = ChaptersUI;
  }
})();
