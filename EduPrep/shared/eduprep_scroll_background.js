// ============================================================================
// EduPrep — Scroll-Driven Immersive Background System
// Reusable, performant, 60fps lerped parallax background with section awareness,
// academic motifs, mobile adaptation, and reduced-motion support.
// ============================================================================

(function () {
  "use strict";

  const EduPrepScrollBackground = {
    // Centralized configuration
    config: {
      movementStrength: 1.0,      // Desktop movement scalar
      mobileMovementStrength: 0.35, // Mobile movement scalar
      smoothing: 0.075,            // Lerp easing factor (lower = smoother)
      intensity: "hero",          // 'hero' | 'normal' | 'subtle' | 'minimal'
      orbCount: 4,
      autoInit: true
    },

    state: {
      initialized: false,
      isMobile: false,
      prefersReducedMotion: false,
      targetProgress: 0,
      currentProgress: 0,
      rafId: null,
      isTicking: false,
      maxScroll: 1,
      elements: {}
    },

    /**
     * Initializes the scroll-driven background system
     * @param {Object} customConfig
     */
    init(customConfig = {}) {
      if (this.state.initialized) {
        if (customConfig.intensity) {
          this.setIntensity(customConfig.intensity);
        }
        return this;
      }

      // Merge user config
      this.config = Object.assign({}, this.config, customConfig);

      // Check user preferences
      this.state.prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      this.state.isMobile = window.innerWidth <= 768;

      // Determine intensity if not specified
      if (!customConfig.intensity) {
        const bodyAttr = document.body.getAttribute("data-bg-intensity");
        if (bodyAttr) {
          this.config.intensity = bodyAttr;
        } else {
          this.config.intensity = this.detectPageIntensity();
        }
      }
      document.body.setAttribute("data-bg-intensity", this.config.intensity);

      // Ensure DOM is ready before mounting
      if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", () => this.mount());
      } else {
        this.mount();
      }

      return this;
    },

    /**
     * Auto-detect appropriate background intensity based on current page path
     */
    detectPageIntensity() {
      const pathname = window.location.pathname.toLowerCase();
      if (pathname.endsWith("index.html") || pathname === "/" || pathname.endsWith("/eduprep/") || pathname.endsWith("/eduprep")) {
        return "hero";
      }
      if (pathname.includes("resources_dashboard")) {
        return "normal";
      }
      if (pathname.includes("mcq_practice_exam")) {
        return "subtle";
      }
      if (pathname.includes("revision_flashcards")) {
        return "subtle";
      }
      if (pathname.includes("home_dashboard") ||
          pathname.includes("previous_year_papers") ||
          pathname.includes("subject_details") ||
          pathname.includes("academic_setup") ||
          pathname.includes("user_profile_progress") ||
          pathname.includes("study_ai_assistant")) {
        return "subtle";
      }
      return "subtle";
    },

    /**
     * Mounts DOM elements and attaches listeners
     */
    mount() {
      if (this.state.initialized) return;

      // Ensure container exists
      let container = document.querySelector(".scroll-background");
      if (!container) {
        container = this.buildBackgroundMarkup();
        // Insert as very first child of body so it remains behind all page content
        document.body.insertBefore(container, document.body.firstChild);
      }

      // Cache DOM references to avoid layout thrashing
      this.state.elements = {
        container,
        canvas: container.querySelector(".scroll-bg-canvas"),
        gradientField: container.querySelector(".scroll-bg-gradient-field"),
        orb1: container.querySelector(".scroll-bg-orb-1"),
        orb2: container.querySelector(".scroll-bg-orb-2"),
        orb3: container.querySelector(".scroll-bg-orb-3"),
        orb4: container.querySelector(".scroll-bg-orb-4"),
        grid: container.querySelector(".scroll-bg-grid"),
        motifs: container.querySelectorAll(".scroll-bg-motif-item")
      };

      // Measure dimensions
      this.updateScrollBounds();

      // Listeners
      this.onScroll = this.onScroll.bind(this);
      this.onResize = this.onResize.bind(this);
      this.renderLoop = this.renderLoop.bind(this);

      window.addEventListener("scroll", this.onScroll, { passive: true });
      window.addEventListener("resize", this.onResize, { passive: true });

      // Init Scroll Reveal Observer for sections
      this.initScrollReveal();

      this.state.initialized = true;

      // If reduced motion is requested, stop here (leave static background)
      if (this.state.prefersReducedMotion) {
        return;
      }

      // Initial layout tick
      this.onScroll();
    },

    /**
     * Constructs the background DOM markup with abstract educational motifs
     */
    buildBackgroundMarkup() {
      const wrapper = document.createElement("div");
      wrapper.className = "scroll-background";
      wrapper.setAttribute("aria-hidden", "true");

      wrapper.innerHTML = `
        <div class="scroll-bg-canvas">
          <div class="scroll-bg-gradient-field"></div>
          <div class="scroll-bg-orb scroll-bg-orb-1"></div>
          <div class="scroll-bg-orb-2 scroll-bg-orb"></div>
          <div class="scroll-bg-orb-3 scroll-bg-orb"></div>
          <div class="scroll-bg-orb-4 scroll-bg-orb"></div>
          <div class="scroll-bg-grid"></div>
          <div class="scroll-bg-motifs">
            <!-- Academic Motif 1: Academic Ring / Degree Arc (Top Right) -->
            <svg class="scroll-bg-motif-item scroll-bg-motif-1" style="top: 8%; right: 7%; width: 140px; height: 140px; opacity: 0.18;" viewBox="0 0 100 100" fill="none" stroke="currentColor">
              <circle cx="50" cy="50" r="44" stroke-width="1.2" stroke-dasharray="6 4"/>
              <circle cx="50" cy="50" r="32" stroke-width="0.8"/>
              <circle cx="50" cy="50" r="16" stroke-width="1.5" stroke-dasharray="2 3"/>
              <path d="M50 6 L50 94 M6 50 L94 50" stroke-width="0.5" stroke-dasharray="1 5"/>
            </svg>

            <!-- Academic Motif 2: Knowledge Graph Nodes (Mid Left) -->
            <svg class="scroll-bg-motif-item scroll-bg-motif-2" style="top: 36%; left: 4%; width: 160px; height: 160px; opacity: 0.15;" viewBox="0 0 120 120" fill="none" stroke="currentColor">
              <line x1="20" y1="30" x2="60" y2="60" stroke-width="1" stroke-dasharray="3 3"/>
              <line x1="60" y1="60" x2="100" y2="40" stroke-width="1"/>
              <line x1="60" y1="60" x2="50" y2="100" stroke-width="1"/>
              <line x1="100" y1="40" x2="85" y2="95" stroke-width="0.8" stroke-dasharray="2 2"/>
              <circle cx="20" cy="30" r="4" fill="currentColor"/>
              <circle cx="60" cy="60" r="6" fill="currentColor" fill-opacity="0.3" stroke-width="1.5"/>
              <circle cx="100" cy="40" r="4.5" fill="currentColor"/>
              <circle cx="50" cy="100" r="3.5" fill="currentColor"/>
              <circle cx="85" cy="95" r="4" fill="currentColor"/>
            </svg>

            <!-- Academic Motif 3: Mathematical Sigma / Calculus Integral (Mid Right - Desktop only) -->
            <svg class="scroll-bg-motif-item scroll-bg-motif-3 scroll-bg-motif-desktop" style="top: 58%; right: 6%; width: 100px; height: 120px; opacity: 0.12;" viewBox="0 0 80 100" fill="none" stroke="currentColor">
              <!-- Sigma Symbol -->
              <path d="M60 20 L25 20 L45 45 L25 70 L60 70" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
              <!-- Limit bounds dots -->
              <circle cx="25" cy="12" r="2.5" fill="currentColor"/>
              <circle cx="25" cy="78" r="2.5" fill="currentColor"/>
            </svg>

            <!-- Academic Motif 4: Performance / Study Curve Graph (Bottom Left) -->
            <svg class="scroll-bg-motif-item scroll-bg-motif-4" style="top: 76%; left: 8%; width: 150px; height: 90px; opacity: 0.14;" viewBox="0 0 140 80" fill="none" stroke="currentColor">
              <path d="M10 70 L130 70" stroke-width="1"/>
              <path d="M10 10 L10 70" stroke-width="1"/>
              <path d="M10 65 Q 45 60, 70 35 T 130 15" stroke-width="1.8" stroke-dasharray="4 2"/>
              <circle cx="70" cy="35" r="3" fill="currentColor"/>
              <circle cx="130" cy="15" r="3.5" fill="currentColor"/>
            </svg>
          </div>
          <div class="scroll-bg-glow"></div>
        </div>
      `;

      return wrapper;
    },

    /**
     * Cache scroll dimensions cleanly without repeated layout thrashing
     */
    updateScrollBounds() {
      const scrollHeight = Math.max(
        document.body.scrollHeight,
        document.documentElement.scrollHeight,
        document.body.offsetHeight,
        document.documentElement.offsetHeight,
        document.body.clientHeight,
        document.documentElement.clientHeight
      );
      const viewportHeight = window.innerHeight || 800;
      this.state.maxScroll = Math.max(1, scrollHeight - viewportHeight);
      this.state.isMobile = window.innerWidth <= 768;
    },

    /**
     * Throttled resize listener
     */
    onResize() {
      this.updateScrollBounds();
      this.onScroll();
    },

    /**
     * Passive scroll listener
     */
    onScroll() {
      if (this.state.prefersReducedMotion) return;

      const scrollY = window.pageYOffset || document.documentElement.scrollTop || 0;
      const progress = Math.min(1, Math.max(0, scrollY / this.state.maxScroll));

      this.state.targetProgress = progress;

      // Wake up the rAF render loop if not currently active
      if (!this.state.isTicking) {
        this.state.isTicking = true;
        this.state.rafId = requestAnimationFrame(this.renderLoop);
      }
    },

    /**
     * 60fps Lerping Render Loop
     * Calculates smooth interpolation: current += (target - current) * easing
     * Automatically sleeps when progress stabilizes.
     */
    renderLoop() {
      const { targetProgress, smoothing } = {
        targetProgress: this.state.targetProgress,
        smoothing: this.config.smoothing
      };

      // Lerp
      const diff = targetProgress - this.state.currentProgress;
      if (Math.abs(diff) < 0.0001) {
        this.state.currentProgress = targetProgress;
        this.applyTransforms(this.state.currentProgress);
        this.state.isTicking = false;
        return; // Enter idle sleep mode to save 100% CPU when not scrolling
      }

      this.state.currentProgress += diff * smoothing;
      this.applyTransforms(this.state.currentProgress);

      // Continue loop
      this.state.rafId = requestAnimationFrame(this.renderLoop);
    },

    /**
     * Applies hardware-accelerated transforms based on progress
     * @param {number} p Normalized scroll progress (0.0 to 1.0)
     */
    applyTransforms(p) {
      const el = this.state.elements;
      if (!el || !el.container) return;

      const strength = (this.state.isMobile ? this.config.mobileMovementStrength : this.config.movementStrength);
      const intensity = this.config.intensity;

      // Intensity multipliers
      const mult = intensity === "minimal" ? 0.15 : (intensity === "subtle" ? 0.45 : (intensity === "normal" ? 0.75 : 1.0));
      const factor = strength * mult;

      // 1. Layer A: Ambient Gradient Field (Slow gentle pan & subtle scale)
      if (el.gradientField) {
        const gradY = (p * -40 * factor).toFixed(2);
        const gradX = (Math.sin(p * Math.PI) * 20 * factor).toFixed(2);
        const gradScale = (1 + p * 0.04 * factor).toFixed(3);
        el.gradientField.style.transform = `translate3d(${gradX}px, ${gradY}px, 0) scale(${gradScale})`;
      }

      // 2. Layer B: Primary Orb 1 (Top Left) - Moves down and slightly right
      if (el.orb1) {
        const y1 = (p * 110 * factor).toFixed(2);
        const x1 = (p * -35 * factor).toFixed(2);
        const s1 = (1 + p * 0.06 * factor).toFixed(3);
        el.orb1.style.transform = `translate3d(${x1}px, ${y1}px, 0) scale(${s1})`;
      }

      // 3. Layer B: Tertiary Orb 2 (Top Right) - Moves upward-left
      if (el.orb2) {
        const y2 = (p * -90 * factor).toFixed(2);
        const x2 = (p * 45 * factor).toFixed(2);
        const s2 = (1 - p * 0.05 * factor).toFixed(3);
        el.orb2.style.transform = `translate3d(${x2}px, ${y2}px, 0) scale(${s2})`;
      }

      // 4. Layer C: Secondary Orb 3 (Mid Left) - Diagonal drift
      if (el.orb3) {
        const y3 = (p * 85 * factor).toFixed(2);
        const x3 = (p * -40 * factor).toFixed(2);
        el.orb3.style.transform = `translate3d(${x3}px, ${y3}px, 0)`;
      }

      // 5. Layer C: Violet Orb 4 (Bottom Right) - Counter-movement
      if (el.orb4) {
        const y4 = (p * -70 * factor).toFixed(2);
        const x4 = (p * 30 * factor).toFixed(2);
        el.orb4.style.transform = `translate3d(${x4}px, ${y4}px, 0)`;
      }

      // 6. Layer 3: Educational Grid (Micro subtle vertical drift)
      if (el.grid) {
        const gridY = (p * 25 * factor).toFixed(2);
        el.grid.style.transform = `translate3d(0, ${gridY}px, 0)`;
      }

      // 7. Layer D: Educational Motifs (Distinct parallax speeds & subtle rotation)
      if (el.motifs && el.motifs.length) {
        // Motif 1 (Academic Ring): rotates subtly up to 18 deg
        if (el.motifs[0]) {
          const m1Y = (p * 50 * factor).toFixed(2);
          const m1Rot = (p * 18 * factor).toFixed(2);
          el.motifs[0].style.transform = `translate3d(0, ${m1Y}px, 0) rotate(${m1Rot}deg)`;
        }
        // Motif 2 (Nodes Graph): floats upward
        if (el.motifs[1]) {
          const m2Y = (p * -45 * factor).toFixed(2);
          const m2X = (p * 15 * factor).toFixed(2);
          el.motifs[1].style.transform = `translate3d(${m2X}px, ${m2Y}px, 0)`;
        }
        // Motif 3 (Sigma/Math): subtle drift
        if (el.motifs[2]) {
          const m3Y = (p * 35 * factor).toFixed(2);
          const m3Rot = (p * -8 * factor).toFixed(2);
          el.motifs[2].style.transform = `translate3d(0, ${m3Y}px, 0) rotate(${m3Rot}deg)`;
        }
        // Motif 4 (Graph Curve): gentle horizontal/vertical follow
        if (el.motifs[3]) {
          const m4Y = (p * -30 * factor).toFixed(2);
          el.motifs[3].style.transform = `translate3d(0, ${m4Y}px, 0)`;
        }
      }

      // 8. Dynamic Section Transitions (Storytelling through progressive hue shifts)
      this.updateSectionHues(p);
    },

    /**
     * Adjusts background gradient hue dynamically across page journey
     * Hero -> Streams -> Features -> Resources -> About
     */
    updateSectionHues(p) {
      if (this.config.intensity !== "hero") return;

      const root = document.documentElement;

      if (p < 0.25) {
        // Hero: Indigo dominant
        root.style.setProperty("--eduprep-bg-orb1", "rgba(70, 72, 212, 0.12)");
        root.style.setProperty("--eduprep-bg-orb2", "rgba(177, 14, 107, 0.09)");
      } else if (p < 0.50) {
        // Streams: Soft Blue/Indigo
        root.style.setProperty("--eduprep-bg-orb1", "rgba(0, 88, 190, 0.11)");
        root.style.setProperty("--eduprep-bg-orb2", "rgba(70, 72, 212, 0.08)");
      } else if (p < 0.75) {
        // Features & Resources: Purple/Pink subtle warmth
        root.style.setProperty("--eduprep-bg-orb1", "rgba(177, 14, 107, 0.08)");
        root.style.setProperty("--eduprep-bg-orb2", "rgba(139, 92, 246, 0.08)");
      } else {
        // About / Footer: Neutral calm indigo
        root.style.setProperty("--eduprep-bg-orb1", "rgba(99, 102, 241, 0.08)");
        root.style.setProperty("--eduprep-bg-orb2", "rgba(70, 72, 212, 0.07)");
      }
    },

    /**
     * Sets background intensity dynamically
     * @param {'hero' | 'normal' | 'subtle' | 'minimal'} level
     */
    setIntensity(level) {
      if (["hero", "normal", "subtle", "minimal"].includes(level)) {
        this.config.intensity = level;
        document.body.setAttribute("data-bg-intensity", level);
        this.onScroll();
      }
    },

    /**
     * Initializes single-trigger IntersectionObserver for smooth section reveal
     */
    initScrollReveal() {
      if (!("IntersectionObserver" in window)) {
        // Fallback for older environments: reveal immediately
        document.querySelectorAll(".scroll-reveal").forEach(el => el.classList.add("is-revealed"));
        return;
      }

      const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-revealed");
            obs.unobserve(entry.target); // Trigger once only
          }
        });
      }, {
        threshold: 0.08,
        rootMargin: "0px 0px -40px 0px"
      });

      document.querySelectorAll(".scroll-reveal").forEach(el => observer.observe(el));
    },

    /**
     * Cleanup for tests or SPA tear-downs
     */
    destroy() {
      if (!this.state.initialized) return;
      window.removeEventListener("scroll", this.onScroll);
      window.removeEventListener("resize", this.onResize);
      if (this.state.rafId) {
        cancelAnimationFrame(this.state.rafId);
      }
      if (this.state.elements.container && this.state.elements.container.parentNode) {
        this.state.elements.container.parentNode.removeChild(this.state.elements.container);
      }
      this.state.initialized = false;
    }
  };

  // Expose globally
  window.EduPrepScrollBackground = EduPrepScrollBackground;

  // Auto-boot on load
  if (typeof document !== "undefined") {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => {
        EduPrepScrollBackground.init();
      });
    } else {
      EduPrepScrollBackground.init();
    }
  }

  // Export for CommonJS test environments if required
  if (typeof module !== "undefined" && module.exports) {
    module.exports = EduPrepScrollBackground;
  }
})();
