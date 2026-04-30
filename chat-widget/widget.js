/**
 * BizDynamix Chat Widget — standalone, pluggable
 *
 * Usage (drop before </body>):
 *   <script
 *     src="/chat-widget/widget.js"
 *     data-api="/api/chat"
 *     data-site="bdx"
 *     data-name="Sarah"
 *     data-greeting="Hey there 👋 I'm Sarah..."
 *   ></script>
 *
 * Config attributes (all optional):
 *   data-api       — chat endpoint  (default: /api/chat)
 *   data-site      — site key sent to the API (default: bdx)
 *   data-name      — agent display name  (default: Sarah)
 *   data-label     — header eyebrow text (default: BizDynamix AI)
 *   data-greeting  — opening bot message
 *   data-primary   — primary colour hex  (default: #00e5c8)
 *   data-bg        — widget panel bg     (default: #111119)
 */
(function () {
  'use strict';

  /* ── Config from data attributes ─────────────────────────────────────── */
  const s = document.currentScript || (function () {
    const scripts = document.querySelectorAll('script[src*="widget.js"]');
    return scripts[scripts.length - 1];
  })();

  const cfg = {
    api:      s.dataset.api      || '/api/chat',
    site:     s.dataset.site     || 'bdx',
    name:     s.dataset.name     || 'Sarah',
    label:    s.dataset.label    || 'BizDynamix AI',
    greeting: s.dataset.greeting || "Hey there 👋 I'm Sarah from the BizDynamix team. I can answer your questions and help you figure out if we're a good fit. What brings you here today?",
    primary:  s.dataset.primary  || '#00e5c8',
    bg:       s.dataset.bg       || '#111119',
  };

  /* ── Inject styles ────────────────────────────────────────────────────── */
  const style = document.createElement('style');
  style.textContent = `
    #bdx-fab {
      position: fixed; bottom: 28px; right: 28px; z-index: 9900;
      width: 56px; height: 56px; border-radius: 50%;
      background: ${cfg.primary}; border: none; cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      box-shadow: 0 4px 24px color-mix(in srgb, ${cfg.primary} 45%, transparent),
                  0 2px 8px rgba(0,0,0,0.3);
      transition: transform 0.2s cubic-bezier(.16,1,.3,1), box-shadow 0.2s;
    }
    #bdx-fab:hover {
      transform: scale(1.1);
      box-shadow: 0 8px 32px color-mix(in srgb, ${cfg.primary} 55%, transparent),
                  0 2px 8px rgba(0,0,0,0.3);
    }
    #bdx-fab svg { width: 24px; height: 24px; color: #000; }
    #bdx-fab .bdx-close-icon { display: none; }
    #bdx-fab.open .bdx-chat-icon { display: none; }
    #bdx-fab.open .bdx-close-icon { display: block; }

    #bdx-panel {
      position: fixed; bottom: 96px; right: 28px; z-index: 9900;
      width: min(380px, calc(100vw - 32px));
      height: min(560px, calc(100vh - 140px));
      background: ${cfg.bg};
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 20px;
      box-shadow: 0 32px 80px rgba(0,0,0,0.5), 0 4px 16px rgba(0,0,0,0.3);
      display: flex; flex-direction: column; overflow: hidden;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      transform: translateY(16px) scale(0.97);
      opacity: 0; pointer-events: none;
      transition: transform 0.3s cubic-bezier(.16,1,.3,1),
                  opacity 0.25s ease;
    }
    #bdx-panel.open {
      transform: translateY(0) scale(1);
      opacity: 1; pointer-events: all;
    }

    .bdx-header {
      display: flex; align-items: center; justify-content: space-between;
      padding: 14px 16px; flex-shrink: 0;
      border-bottom: 1px solid rgba(255,255,255,0.07);
      background: rgba(255,255,255,0.03);
    }
    .bdx-header-left { display: flex; align-items: center; gap: 10px; }
    .bdx-avatar {
      width: 38px; height: 38px; border-radius: 50%;
      background: color-mix(in srgb, ${cfg.primary} 20%, transparent);
      border: 1.5px solid color-mix(in srgb, ${cfg.primary} 40%, transparent);
      display: flex; align-items: center; justify-content: center;
      font-size: 17px; flex-shrink: 0;
    }
    .bdx-title-wrap {}
    .bdx-eyebrow {
      font-size: 10px; font-weight: 700; letter-spacing: 0.12em;
      text-transform: uppercase; color: ${cfg.primary}; line-height: 1;
      margin-bottom: 2px;
    }
    .bdx-title {
      font-size: 14px; font-weight: 600; color: #eeeef6; line-height: 1;
    }
    .bdx-status {
      display: flex; align-items: center; gap: 5px;
      font-size: 11px; color: rgba(255,255,255,0.4); margin-top: 3px;
    }
    .bdx-dot {
      width: 6px; height: 6px; border-radius: 50%;
      background: #22c55e;
      animation: bdx-blink 2s ease-in-out infinite;
    }
    @keyframes bdx-blink {
      0%, 100% { opacity: 1; } 50% { opacity: 0.4; }
    }
    .bdx-header-close {
      width: 30px; height: 30px; border-radius: 50%;
      background: rgba(255,255,255,0.06); border: none; cursor: pointer;
      color: rgba(255,255,255,0.5); display: flex; align-items: center;
      justify-content: center; transition: background 0.15s, color 0.15s;
    }
    .bdx-header-close:hover { background: rgba(255,255,255,0.12); color: #fff; }

    #bdx-msgs {
      flex: 1; overflow-y: auto; padding: 16px;
      display: flex; flex-direction: column; gap: 10px;
      scroll-behavior: smooth;
    }
    #bdx-msgs::-webkit-scrollbar { width: 4px; }
    #bdx-msgs::-webkit-scrollbar-track { background: transparent; }
    #bdx-msgs::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 2px; }

    .bdx-msg {
      max-width: 84%; padding: 10px 14px;
      border-radius: 16px; font-size: 13.5px; line-height: 1.6;
      word-wrap: break-word; white-space: pre-wrap;
    }
    .bdx-msg.bot {
      background: rgba(255,255,255,0.06); color: #eeeef6;
      border-bottom-left-radius: 4px; align-self: flex-start;
    }
    .bdx-msg.user {
      background: color-mix(in srgb, ${cfg.primary} 15%, transparent);
      color: #eeeef6; border: 1px solid color-mix(in srgb, ${cfg.primary} 25%, transparent);
      border-bottom-right-radius: 4px; align-self: flex-end;
    }
    .bdx-msg.typing { color: rgba(255,255,255,0.4); font-style: italic; }

    .bdx-quick {
      display: flex; align-items: flex-start; gap: 8px;
      align-self: flex-start; width: 100%;
    }
    .bdx-quick-text {
      max-width: 70%; padding: 10px 14px; border-radius: 16px;
      border-bottom-left-radius: 4px; font-size: 13.5px; line-height: 1.6;
      background: rgba(255,255,255,0.06); color: #eeeef6;
    }
    .bdx-quick-btn {
      padding: 9px 14px; border-radius: 10px; font-size: 12.5px; font-weight: 600;
      background: color-mix(in srgb, ${cfg.primary} 15%, transparent);
      color: ${cfg.primary};
      border: 1px solid color-mix(in srgb, ${cfg.primary} 30%, transparent);
      cursor: pointer; white-space: nowrap; flex-shrink: 0;
      transition: background 0.15s;
    }
    .bdx-quick-btn:hover {
      background: color-mix(in srgb, ${cfg.primary} 25%, transparent);
    }

    .bdx-form {
      display: flex; gap: 8px; padding: 12px 14px;
      border-top: 1px solid rgba(255,255,255,0.07); flex-shrink: 0;
    }
    #bdx-input {
      flex: 1; padding: 10px 14px; border-radius: 12px;
      background: rgba(255,255,255,0.05);
      border: 1px solid rgba(255,255,255,0.08);
      color: #eeeef6; font-size: 13.5px; font-family: inherit;
      outline: none; transition: border-color 0.2s, box-shadow 0.2s;
    }
    #bdx-input::placeholder { color: rgba(255,255,255,0.3); }
    #bdx-input:focus {
      border-color: color-mix(in srgb, ${cfg.primary} 50%, transparent);
      box-shadow: 0 0 0 4px color-mix(in srgb, ${cfg.primary} 10%, transparent);
    }
    #bdx-send {
      width: 38px; height: 38px; border-radius: 10px; flex-shrink: 0;
      background: ${cfg.primary}; border: none; cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      transition: opacity 0.15s, transform 0.15s;
    }
    #bdx-send:hover { opacity: 0.85; transform: scale(1.05); }
    #bdx-send:disabled { opacity: 0.4; cursor: not-allowed; transform: none; }
    #bdx-send svg { width: 16px; height: 16px; color: #000; }

    @media (max-width: 480px) {
      #bdx-panel { right: 10px; bottom: 80px; width: calc(100vw - 20px); }
      #bdx-fab { right: 16px; bottom: 16px; }
    }
    @media (prefers-reduced-motion: reduce) {
      #bdx-panel { transition: none; }
      #bdx-fab { transition: none; }
      .bdx-dot { animation: none; }
    }
  `;
  document.head.appendChild(style);

  /* ── Build DOM ────────────────────────────────────────────────────────── */
  const fab = document.createElement('button');
  fab.id = 'bdx-fab';
  fab.setAttribute('aria-label', 'Open chat');
  fab.setAttribute('aria-expanded', 'false');
  fab.innerHTML = `
    <svg class="bdx-chat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </svg>
    <svg class="bdx-close-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
    </svg>`;

  const panel = document.createElement('div');
  panel.id = 'bdx-panel';
  panel.setAttribute('role', 'dialog');
  panel.setAttribute('aria-modal', 'true');
  panel.setAttribute('aria-label', 'Chat with ' + cfg.name);
  panel.innerHTML = `
    <div class="bdx-header">
      <div class="bdx-header-left">
        <div class="bdx-avatar">💬</div>
        <div class="bdx-title-wrap">
          <div class="bdx-eyebrow">${cfg.label}</div>
          <div class="bdx-title">${cfg.name}</div>
          <div class="bdx-status"><span class="bdx-dot"></span>Online now</div>
        </div>
      </div>
      <button class="bdx-header-close" id="bdx-close" aria-label="Close chat">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
    </div>
    <div id="bdx-msgs" aria-live="polite" aria-label="Chat messages"></div>
    <form class="bdx-form" id="bdx-form" autocomplete="off">
      <label for="bdx-input" style="position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0)">Message</label>
      <input id="bdx-input" type="text" placeholder="Ask anything…" maxlength="500" />
      <button type="submit" id="bdx-send" aria-label="Send">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <line x1="22" y1="2" x2="11" y2="13"/>
          <polygon points="22 2 15 22 11 13 2 9 22 2"/>
        </svg>
      </button>
    </form>`;

  document.body.appendChild(fab);
  document.body.appendChild(panel);

  /* ── Widget logic ─────────────────────────────────────────────────────── */
  const msgsEl  = document.getElementById('bdx-msgs');
  const inputEl = document.getElementById('bdx-input');
  const sendEl  = document.getElementById('bdx-send');
  let busy = false;
  let initialised = false;

  function addMsg(text, role) {
    const el = document.createElement('div');
    el.className = 'bdx-msg ' + role;
    el.textContent = text;
    msgsEl.appendChild(el);
    msgsEl.scrollTop = msgsEl.scrollHeight;
    return el;
  }

  function addQuickReply(text, btnLabel, onClick) {
    const wrap = document.createElement('div');
    wrap.className = 'bdx-quick';
    const msgEl = document.createElement('div');
    msgEl.className = 'bdx-quick-text';
    msgEl.textContent = text;
    const btn = document.createElement('button');
    btn.className = 'bdx-quick-btn';
    btn.textContent = btnLabel;
    btn.addEventListener('click', onClick);
    wrap.appendChild(msgEl);
    wrap.appendChild(btn);
    msgsEl.appendChild(wrap);
    msgsEl.scrollTop = msgsEl.scrollHeight;
  }

  function init() {
    if (initialised) return;
    initialised = true;
    addMsg(cfg.greeting, 'bot');
  }

  async function getBotReply(userText) {
    const lower = userText.toLowerCase();
    try {
      const res = await fetch(cfg.api, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userText, site: cfg.site })
      });
      const data = await res.json();
      let reply = data.reply || "Tell me more about what you're looking for.";

      if (lower.includes('interested') || lower.includes('pricing') || lower.includes('cost') || lower.includes('how much') || lower.includes('learn more')) {
        reply += '\n\n💬 Want a custom proposal? I can grab your details and get the ball rolling.';
      } else if (lower.includes('email') || lower.includes('contact') || lower.includes('phone')) {
        reply += "\n\n👉 Use the form and we'll be in touch within 24 hours!";
      } else if (lower.includes('yes') || lower.includes("sounds good") || lower.includes("let's") || lower.includes("when can we")) {
        reply += "\n\n🎯 Let's get your details so we can move forward.";
      }

      return reply;
    } catch {
      return "I'm having trouble connecting right now. No worries — fill out the form and we'll follow up within 24 hours!";
    }
  }

  async function send() {
    const text = inputEl.value.trim();
    if (!text || busy) return;
    busy = true;
    sendEl.disabled = true;
    inputEl.value = '';

    addMsg(text, 'user');
    const typing = addMsg('Thinking…', 'bot typing');

    const reply = await getBotReply(text);
    typing.textContent = reply;
    typing.classList.remove('typing');

    // Show contact form CTA after engagement signals
    const lower = text.toLowerCase();
    if ((lower.includes('interested') || lower.includes('learn more') || lower.includes('how') || lower.includes('pricing') || lower.includes('ready') || lower.includes("let's")) && !lower.includes('no')) {
      setTimeout(() => {
        addQuickReply('Want to move forward?', '📝 Open Form', () => {
          close();
          const contactModal = document.getElementById('messageModal');
          if (contactModal) {
            contactModal.classList.add('open');
            contactModal.setAttribute('aria-hidden', 'false');
            const nameInput = document.getElementById('msgName');
            if (nameInput) setTimeout(() => nameInput.focus(), 50);
          }
        });
      }, 600);
    }

    busy = false;
    sendEl.disabled = false;
    inputEl.focus();
  }

  function open() {
    init();
    panel.classList.add('open');
    fab.classList.add('open');
    fab.setAttribute('aria-expanded', 'true');
    setTimeout(() => inputEl.focus(), 50);
  }

  function close() {
    panel.classList.remove('open');
    fab.classList.remove('open');
    fab.setAttribute('aria-expanded', 'false');
  }

  function toggle() {
    panel.classList.contains('open') ? close() : open();
  }

  /* ── Events ───────────────────────────────────────────────────────────── */
  fab.addEventListener('click', toggle);
  document.getElementById('bdx-close').addEventListener('click', close);
  document.getElementById('bdx-form').addEventListener('submit', e => { e.preventDefault(); send(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && panel.classList.contains('open')) close(); });

  /* ── Wire existing page trigger buttons ──────────────────────────────── */
  // Any element with id="openChatBtn" or id="openChatBtnBottom" will open this widget
  ['openChatBtn', 'openChatBtnBottom'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('click', open);
  });

  /* ── Public API ───────────────────────────────────────────────────────── */
  window.BdxChat = { open, close, toggle };
})();
