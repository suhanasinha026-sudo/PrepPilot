/**
 * EduPrep — Global Floating AI Study Assistant Module (EduPrepChatbot)
 * 
 * Replaces the full-page Study AI Assistant with an interactive, context-aware
 * floating chatbot available throughout the entire authenticated learning experience.
 * 
 * Capabilities:
 * - Dynamic academic context detection (Stream, Subject, Semester, Chapter, Feature)
 * - Safe model output sanitization (never executes arbitrary scripts)
 * - Online hosted AI backend (/api/ai-assistant) with graceful curated fallback
 * - Exam-mode actions (Explain, 5-Mark Rubric, 10-Mark Blueprint, Quiz Me)
 * - Mobile responsive, accessible, reduced-motion friendly
 */

(function () {
  'use strict';

  let isOpen = false;
  let activeMode = 'explain';
  let chatHistory = [];
  let isSending = false;

  const STORAGE_KEY = 'eduprep_floating_chat_history';

  // Safe HTML Escaper
  function escapeHtml(str) {
    if (str === null || str === undefined) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // Safe Lightweight Markdown Parser
  function renderMarkdownSafe(text) {
    if (!text) return '';
    let escaped = escapeHtml(text);

    // Code blocks ```lang ... ```
    escaped = escaped.replace(/```([\s\S]*?)```/g, function (_, code) {
      return '<pre><code>' + code.trim() + '</code></pre>';
    });

    // Inline code `code`
    escaped = escaped.replace(/`([^`]+)`/g, '<code>$1</code>');

    // Bold **text**
    escaped = escaped.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');

    // Italic *text*
    escaped = escaped.replace(/\*([^*]+)\*/g, '<em>$1</em>');

    // Bullet lists starting with • or - or *
    const lines = escaped.split('\n');
    let inList = false;
    let listType = '';
    const output = [];

    lines.forEach(function (line) {
      const trimmed = line.trim();
      const isBullet = /^([•\-\*]|\&bull\;)\s+(.+)/.test(trimmed);
      const isNum = /^\d+\.\s+(.+)/.test(trimmed);

      if (isBullet) {
        if (!inList || listType !== 'ul') {
          if (inList) output.push(listType === 'ul' ? '</ul>' : '</ol>');
          output.push('<ul>');
          inList = true;
          listType = 'ul';
        }
        output.push('<li>' + trimmed.replace(/^([•\-\*]|\&bull\;)\s+/, '') + '</li>');
      } else if (isNum) {
        if (!inList || listType !== 'ol') {
          if (inList) output.push(listType === 'ul' ? '</ul>' : '</ol>');
          output.push('<ol>');
          inList = true;
          listType = 'ol';
        }
        output.push('<li>' + trimmed.replace(/^\d+\.\s+/, '') + '</li>');
      } else {
        if (inList) {
          output.push(listType === 'ul' ? '</ul>' : '</ol>');
          inList = false;
          listType = '';
        }
        if (trimmed) {
          output.push('<p>' + line + '</p>');
        }
      }
    });

    if (inList) {
      output.push(listType === 'ul' ? '</ul>' : '</ol>');
    }

    return output.join('');
  }

  const EduPrepChatbot = {
    /**
     * Resolves active academic context based on URL, DOM, and EduPrep state
     */
    getContext: function () {
      const root = typeof window !== 'undefined' ? window : {};
      const EduPrep = root.EduPrep || {};
      const state = (typeof EduPrep.getState === 'function') ? EduPrep.getState() : {};
      const academic = state.academic || {};

      let stream = academic.stream || academic.field || 'engineering';
      let subject = academic.branch || 'Operating Systems';
      let semester = academic.semester || 4;
      let chapter = null;
      let feature = 'Workspace';

      if (typeof window !== 'undefined') {
        const params = new URLSearchParams(window.location.search);
        const path = window.location.pathname.toLowerCase();

        if (params.get('subject')) subject = params.get('subject');
        else if (params.get('subj')) subject = params.get('subj');

        if (params.get('stream')) stream = params.get('stream');
        if (params.get('sem')) semester = parseInt(params.get('sem'), 10);
        else if (params.get('semester')) semester = parseInt(params.get('semester'), 10);

        if (params.get('chapter')) chapter = params.get('chapter');
        else if (params.get('ch')) chapter = params.get('ch');
        else if (params.get('unit')) chapter = 'Unit ' + params.get('unit');

        if (path.includes('mcq_practice_exam')) feature = 'Practice Tests';
        else if (path.includes('revision_flashcards')) feature = '3D Flashcards';
        else if (path.includes('previous_year_papers')) feature = 'Question Papers (PYQ)';
        else if (path.includes('academic_setup')) feature = 'Study Planner';
        else if (path.includes('resources_dashboard')) feature = 'Resources Hub';
        else if (path.includes('user_profile_progress')) feature = 'Student Profile';
        else if (path.includes('home_dashboard')) feature = 'Dashboard';
        else if (path.includes('index.html') || path === '/' || path.endsWith('/')) feature = 'Curriculum Hub';
      }

      // Check if subject meta gives stream info
      if (typeof EduPrep.getSubjectMeta === 'function') {
        const meta = EduPrep.getSubjectMeta(subject);
        if (meta) {
          if (meta.stream) stream = meta.stream;
          if (meta.name) subject = meta.name;
        }
      }

      // Check if chapter details can be humanized
      let chapterTitle = chapter;
      if (chapter && typeof EduPrep.getChapterById === 'function') {
        const chObj = EduPrep.getChapterById(chapter);
        if (chObj && chObj.title) {
          chapterTitle = (chObj.chapterNum ? 'Unit ' + chObj.chapterNum + ': ' : '') + chObj.title;
        }
      }

      return {
        stream: stream,
        subject: subject,
        semester: semester,
        chapter: chapter,
        chapterTitle: chapterTitle,
        university: academic.university || 'University Curriculum',
        feature: feature
      };
    },

    /**
     * Initializes DOM elements and event handlers
     */
    init: function () {
      if (typeof document === 'undefined') return;
      if (document.getElementById('eduprep-chatbot-root')) return;

      this.injectMarkup();
      this.bindEvents();
      this.loadHistory();
      this.updateContextUi();

      // Check if direct launch query was requested (e.g. ?openAi=true or pending query)
      const params = new URLSearchParams(window.location.search);
      const pending = sessionStorage.getItem('eduprep_pending_query') || sessionStorage.getItem('eduvantage_pending_query');
      if (params.get('openAi') === 'true' || pending) {
        if (pending) {
          sessionStorage.removeItem('eduprep_pending_query');
          sessionStorage.removeItem('eduvantage_pending_query');
          this.open({ prompt: pending });
        } else {
          this.open();
        }
      }
    },

    injectMarkup: function () {
      const container = document.createElement('div');
      container.id = 'eduprep-chatbot-root';
      container.innerHTML = `
        <!-- Floating Trigger Button -->
        <button 
          id="eduprep-chatbot-trigger" 
          class="eduprep-chat-trigger" 
          type="button" 
          aria-label="Open EduPrep AI Study Assistant" 
          aria-expanded="false" 
          aria-controls="eduprep-chatbot-panel"
          title="Open EduPrep AI"
        >
          <span class="material-symbols-outlined eduprep-chat-trigger-icon">smart_toy</span>
          <span class="eduprep-chat-trigger-badge"></span>
          <span class="eduprep-chat-trigger-tooltip">Ask EduPrep AI</span>
        </button>

        <!-- Floating Chat Panel -->
        <div id="eduprep-chatbot-panel" class="eduprep-chat-panel" role="dialog" aria-label="EduPrep AI Study Assistant">
          <!-- Header -->
          <div class="eduprep-chat-header">
            <div class="eduprep-chat-header-left">
              <div class="eduprep-chat-avatar">
                <span class="material-symbols-outlined text-lg">smart_toy</span>
              </div>
              <div class="eduprep-chat-header-text">
                <div class="eduprep-chat-title">
                  <span>EduPrep AI</span>
                </div>
                <div class="eduprep-chat-status">
                  <span id="eduprep-chat-status-dot" class="eduprep-chat-status-dot"></span>
                  <span id="eduprep-chat-status-text">Your study assistant</span>
                </div>
              </div>
            </div>

            <div class="eduprep-chat-header-actions">
              <button 
                id="eduprep-chat-btn-clear" 
                class="eduprep-chat-icon-btn" 
                type="button" 
                title="New Chat (Clear Conversation)" 
                aria-label="New Chat"
              >
                <span class="material-symbols-outlined text-base">delete_sweep</span>
              </button>
              <button 
                id="eduprep-chat-btn-close" 
                class="eduprep-chat-icon-btn" 
                type="button" 
                title="Close AI Assistant" 
                aria-label="Close EduPrep AI Study Assistant"
              >
                <span class="material-symbols-outlined text-base">close</span>
              </button>
            </div>
          </div>

          <!-- Academic Context Sub-header -->
          <div class="eduprep-chat-context-bar" id="eduprep-chat-context-bar">
            <div class="eduprep-chat-context-pill">
              <span class="material-symbols-outlined text-xs">school</span>
              <span id="eduprep-chat-context-label">Operating Systems</span>
            </div>
            <span class="eduprep-chat-context-sub" id="eduprep-chat-context-sub">Sem 4</span>
          </div>

          <!-- Messages Scroll Area -->
          <div class="eduprep-chat-messages" id="eduprep-chat-messages">
            <!-- Populated dynamically -->
          </div>

          <!-- Typing Indicator -->
          <div id="eduprep-chat-typing" class="eduprep-chat-typing" style="display: none;">
            <span class="eduprep-chat-dot"></span>
            <span class="eduprep-chat-dot"></span>
            <span class="eduprep-chat-dot"></span>
            <span style="font-size: 11px; color: #4648d4; margin-left: 6px; font-weight: 600;">Synthesizing answer...</span>
          </div>

          <!-- Study Action Mode Format Chips -->
          <div class="eduprep-chat-modes">
            <button type="button" class="eduprep-chat-mode-btn active" data-mode="explain">Explain</button>
            <button type="button" class="eduprep-chat-mode-btn" data-mode="5mark">5-Mark</button>
            <button type="button" class="eduprep-chat-mode-btn" data-mode="10mark">10-Mark</button>
            <button type="button" class="eduprep-chat-mode-btn" data-mode="quiz">Quiz Me</button>
          </div>

          <!-- Input Bar -->
          <div class="eduprep-chat-input-bar">
            <textarea 
              id="eduprep-chat-textarea" 
              class="eduprep-chat-textarea" 
              rows="1" 
              placeholder="Ask anything about this subject or chapter..." 
              aria-label="Ask EduPrep AI a question"
            ></textarea>
            <button 
              id="eduprep-chat-send-btn" 
              class="eduprep-chat-send-btn" 
              type="button" 
              title="Send question" 
              aria-label="Send question" 
              disabled
            >
              <span class="material-symbols-outlined text-lg" style="font-variation-settings: 'FILL' 1;">send</span>
            </button>
          </div>
        </div>
      `;
      document.body.appendChild(container);
    },

    bindEvents: function () {
      const trigger = document.getElementById('eduprep-chatbot-trigger');
      const closeBtn = document.getElementById('eduprep-chat-btn-close');
      const clearBtn = document.getElementById('eduprep-chat-btn-clear');
      const textarea = document.getElementById('eduprep-chat-textarea');
      const sendBtn = document.getElementById('eduprep-chat-send-btn');
      const modeBtns = document.querySelectorAll('.eduprep-chat-mode-btn');

      if (trigger) {
        trigger.addEventListener('click', () => this.toggle());
      }
      if (closeBtn) {
        closeBtn.addEventListener('click', () => this.close());
      }
      if (clearBtn) {
        clearBtn.addEventListener('click', () => this.clearHistory());
      }

      modeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          modeBtns.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          activeMode = btn.dataset.mode || 'explain';
        });
      });

      if (textarea) {
        textarea.addEventListener('input', () => {
          const hasText = textarea.value.trim().length > 0;
          if (sendBtn) sendBtn.disabled = !hasText || isSending;
          textarea.style.height = 'auto';
          textarea.style.height = Math.min(textarea.scrollHeight, 80) + 'px';
        });

        textarea.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            this.sendFromInput();
          } else if (e.key === 'Escape') {
            this.close();
          }
        });
      }

      if (sendBtn) {
        sendBtn.addEventListener('click', () => this.sendFromInput());
      }

      // Global keyboard shortcut: Escape closes chatbot if open
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && isOpen) {
          this.close();
        }
      });

      // Check URL parameters for auto-open (e.g. redirected from old study_ai_assistant route)
      try {
        if (typeof window !== 'undefined' && window.location && window.location.search) {
          const urlParams = new URLSearchParams(window.location.search);
          if (urlParams.get('openAi') === 'true' || urlParams.get('ai') === 'true' || urlParams.get('openChat') === 'true') {
            const prompt = urlParams.get('prompt') || urlParams.get('q') || urlParams.get('topic');
            const mode = urlParams.get('mode');
            setTimeout(() => {
              this.open({
                prompt: prompt ? (prompt.toLowerCase().startsWith('explain') ? prompt : `Explain ${prompt}`) : null,
                mode: mode || undefined
              });
            }, 250);
          }
        }
      } catch (_) {}
    },

    updateContextUi: function () {
      const ctx = this.getContext();
      const labelEl = document.getElementById('eduprep-chat-context-label');
      const subEl = document.getElementById('eduprep-chat-context-sub');

      if (labelEl) {
        if (ctx.chapterTitle) {
          labelEl.textContent = `${ctx.subject} • ${ctx.chapterTitle}`;
        } else if (ctx.subject) {
          labelEl.textContent = `${ctx.subject}`;
        } else {
          labelEl.textContent = `${ctx.stream.toUpperCase()} • ${ctx.feature}`;
        }
      }

      if (subEl) {
        const semLabel = ctx.stream === 'medical' ? `Phase ${ctx.semester}` : `Sem ${ctx.semester}`;
        subEl.textContent = `${semLabel} • ${ctx.feature}`;
      }
    },

    open: function (optData) {
      const panel = document.getElementById('eduprep-chatbot-panel');
      const trigger = document.getElementById('eduprep-chatbot-trigger');
      const textarea = document.getElementById('eduprep-chat-textarea');

      this.updateContextUi();

      if (panel) panel.classList.add('eduprep-chat-open');
      if (trigger) trigger.setAttribute('aria-expanded', 'true');
      isOpen = true;

      this.renderMessages();

      if (optData && typeof optData === 'object') {
        if (optData.mode) {
          activeMode = optData.mode;
          document.querySelectorAll('.eduprep-chat-mode-btn').forEach(b => {
            b.classList.toggle('active', b.dataset.mode === activeMode);
          });
        }
        if (optData.prompt) {
          this.ask(optData.prompt);
          return;
        }
      }

      if (textarea) {
        setTimeout(() => textarea.focus(), 150);
      }
    },

    close: function () {
      const panel = document.getElementById('eduprep-chatbot-panel');
      const trigger = document.getElementById('eduprep-chatbot-trigger');
      if (panel) panel.classList.remove('eduprep-chat-open');
      if (trigger) {
        trigger.setAttribute('aria-expanded', 'false');
        trigger.focus();
      }
      isOpen = false;
    },

    toggle: function () {
      if (isOpen) {
        this.close();
      } else {
        this.open();
      }
    },

    loadHistory: function () {
      try {
        const saved = sessionStorage.getItem(STORAGE_KEY);
        if (saved) {
          chatHistory = JSON.parse(saved);
        } else {
          chatHistory = [];
        }
      } catch (_) {
        chatHistory = [];
      }
    },

    saveHistory: function () {
      try {
        // Keep up to 20 recent messages
        if (chatHistory.length > 20) {
          chatHistory = chatHistory.slice(-20);
        }
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(chatHistory));
      } catch (_) {}
    },

    clearHistory: function () {
      chatHistory = [];
      try {
        sessionStorage.removeItem(STORAGE_KEY);
      } catch (_) {}
      this.renderMessages();
    },

    renderMessages: function () {
      const container = document.getElementById('eduprep-chat-messages');
      if (!container) return;

      const ctx = this.getContext();

      if (chatHistory.length === 0) {
        container.innerHTML = `
          <div class="eduprep-chat-welcome">
            <div class="eduprep-chat-welcome-icon">
              <span class="material-symbols-outlined text-2xl">smart_toy</span>
            </div>
            <h4 class="eduprep-chat-welcome-title">Hi! I'm EduPrep AI</h4>
            <p class="eduprep-chat-welcome-desc">
              Ask about <strong>${escapeHtml(ctx.subject)}</strong>, university exam rubrics, numerical solutions, or 5-mark answer structures.
            </p>
            <div class="eduprep-chat-quick-chips">
              <button type="button" class="eduprep-chat-chip" onclick="EduPrepChatbot.askQuick('Explain the core concepts of ${escapeHtml(ctx.subject)} step by step with an intuitive analogy')">Socratic Walkthrough</button>
              <button type="button" class="eduprep-chat-chip" onclick="EduPrepChatbot.askQuick('What is the standard 5-mark answer rubric for ${escapeHtml(ctx.subject)}?')">5-Mark Rubric</button>
              <button type="button" class="eduprep-chat-chip" onclick="EduPrepChatbot.askQuick('Give me a 10-mark blueprint and architectural diagram description for ${escapeHtml(ctx.subject)}')">10-Mark Blueprint</button>
              <button type="button" class="eduprep-chat-chip" onclick="EduPrepChatbot.askQuick('Ask me an interactive conceptual check question on ${escapeHtml(ctx.subject)}')">Check Question</button>
              <button type="button" class="eduprep-chat-chip" onclick="EduPrepChatbot.askQuick('What are the high-yield examiner tips and common mistakes in ${escapeHtml(ctx.subject)}?')">Examiner Tips</button>
            </div>
          </div>
        `;
        return;
      }

      let html = '';
      chatHistory.forEach((msg, idx) => {
        if (msg.role === 'user') {
          html += `
            <div class="eduprep-chat-msg-user">
              ${escapeHtml(msg.text)}
            </div>
          `;
        } else {
          const bodyHtml = msg.html ? msg.html : renderMarkdownSafe(msg.text);
          html += `
            <div class="eduprep-chat-msg-ai-wrap">
              <div class="eduprep-chat-msg-ai-avatar">
                <span class="material-symbols-outlined text-sm">smart_toy</span>
              </div>
              <div class="eduprep-chat-msg-ai">
                ${bodyHtml}
              </div>
            </div>
          `;
        }
      });

      container.innerHTML = html;
      container.scrollTop = container.scrollHeight;
    },

    sendFromInput: function () {
      const textarea = document.getElementById('eduprep-chat-textarea');
      if (!textarea) return;
      const text = textarea.value.trim();
      if (!text || isSending) return;
      textarea.value = '';
      textarea.style.height = 'auto';
      const sendBtn = document.getElementById('eduprep-chat-send-btn');
      if (sendBtn) sendBtn.disabled = true;
      this.ask(text);
    },

    askQuick: function (promptText) {
      this.ask(promptText);
    },

    ask: async function (promptText) {
      if (!promptText || isSending) return;
      isSending = true;

      // Add user message to UI
      chatHistory.push({ role: 'user', text: promptText });
      this.saveHistory();
      this.renderMessages();

      const typingEl = document.getElementById('eduprep-chat-typing');
      if (typingEl) typingEl.style.display = 'flex';
      const messagesContainer = document.getElementById('eduprep-chat-messages');
      if (messagesContainer) messagesContainer.scrollTop = messagesContainer.scrollHeight;

      const ctx = this.getContext();
      const statusText = document.getElementById('eduprep-chat-status-text');
      const statusDot = document.getElementById('eduprep-chat-status-dot');

      try {
        const root = typeof window !== 'undefined' ? window : {};
        let result = null;

        // Try calling server-side AI assistant service
        if (root.EduPrepServices && root.EduPrepServices.AiAssistant) {
          result = await root.EduPrepServices.AiAssistant.requestStudyHelp({
            prompt: promptText,
            subject: ctx.subject,
            semester: ctx.semester,
            mode: activeMode,
            persona: 'socratic',
            stream: ctx.stream,
            chapter: ctx.chapterTitle || ctx.chapter,
            university: ctx.university,
            feature: ctx.feature,
            history: chatHistory.slice(-8)
          });
        }

        if (typingEl) typingEl.style.display = 'none';

        if (result && result.ok && result.configured && result.reply) {
          if (statusText) statusText.textContent = `Live AI (${result.model || 'Gemini'})`;
          if (statusDot) statusDot.className = 'eduprep-chat-status-dot';
          chatHistory.push({ role: 'ai', text: result.reply });
        } else {
          // Truthful offline syllabus engine fallback
          if (statusText) statusText.textContent = 'Offline Syllabus Engine';
          if (statusDot) statusDot.className = 'eduprep-chat-status-dot offline';

          let syllabusReplyHtml = '';
          if (root.EduPrep && typeof root.EduPrep.getAiResponse === 'function') {
            syllabusReplyHtml = root.EduPrep.getAiResponse(promptText, 'encouraging', activeMode);
          } else {
            syllabusReplyHtml = `<p>Core Syllabus Breakdown for <strong>${escapeHtml(promptText)}</strong>:</p><ul><li>Follow standard university marking rubrics for ${escapeHtml(ctx.subject)}.</li><li>Define key mechanisms, formulas, and working steps.</li></ul>`;
          }

          const fallbackNotice = `
            <div style="margin-bottom: 8px; padding: 6px 10px; background: #fffbeb; border: 1px solid #fde68a; border-radius: 8px; font-size: 11px; color: #92400e;">
              <strong>Syllabus Reference Guide</strong> • Live AI key not configured on server.
            </div>
            ${syllabusReplyHtml}
          `;

          chatHistory.push({ role: 'ai', text: '', html: fallbackNotice });
        }
      } catch (err) {
        if (typingEl) typingEl.style.display = 'none';
        chatHistory.push({
          role: 'ai',
          text: '',
          html: `
            <div style="padding: 8px 10px; background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; color: #991b1b; font-size: 11px;">
              <p style="margin: 0 0 6px 0; font-weight: 700;">I couldn't reach the AI service right now.</p>
              <button type="button" onclick="EduPrepChatbot.ask('${escapeHtml(promptText).replace(/'/g, "\\'")}')" style="background: #ffffff; border: 1px solid #fca5a5; padding: 3px 8px; border-radius: 6px; font-size: 10.5px; font-weight: 700; color: #b91c1c; cursor: pointer;">
                Retry
              </button>
            </div>
          `
        });
      } finally {
        isSending = false;
        this.saveHistory();
        this.renderMessages();
        const textarea = document.getElementById('eduprep-chat-textarea');
        if (textarea) textarea.focus();
      }
    },

    sendMessage: function (text) {
      return this.ask(text);
    },

    applyPreset: function (preset) {
      return this.setFormatMode(preset);
    },

    extractPageContext: function () {
      return this.getContext();
    },

    sanitizeMarkdown: function (text) {
      return renderMarkdownSafe(text);
    }
  };

  // Expose to window and global EduPrep namespace
  const root = typeof window !== 'undefined' ? window : (typeof global !== 'undefined' ? global : this);
  root.EduPrepChatbot = EduPrepChatbot;
  if (typeof window !== 'undefined') {
    window.EduPrepChatbot = EduPrepChatbot;
  }
  if (root.EduPrep) {
    root.EduPrep.chatbot = EduPrepChatbot;
  }

  // Auto-initialize if running in browser
  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function () {
        EduPrepChatbot.init();
      });
    } else {
      EduPrepChatbot.init();
    }
  }

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = EduPrepChatbot;
  }
})();
