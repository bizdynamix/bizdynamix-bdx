import re

with open('/Users/edwinbrooks/Projects/WEBSITES/BDX/index.html', 'r') as f:
    html = f.read()

original_len = len(html)

# ══════════════════════════════════════════════════
# 1. CSS — add new styles before </style>
# ══════════════════════════════════════════════════
new_css = """
    /* ─── CURSOR GLOW ─── */
    #cursor-glow {
      position:fixed; width:420px; height:420px; border-radius:50%;
      pointer-events:none; z-index:9999;
      background:radial-gradient(circle, rgba(var(--cyan-rgb),.055) 0%, transparent 70%);
      transform:translate(-50%,-50%);
      transition:left .1s ease, top .1s ease;
      display:none;
    }
    @media (hover:hover) { #cursor-glow { display:block; } }

    /* ─── HERO VIDEO ─── */
    .hero-vid {
      position:absolute; inset:0; width:100%; height:100%;
      object-fit:cover; z-index:0; opacity:.38; pointer-events:none;
    }
    .hero-overlay {
      position:absolute; inset:0; z-index:1; pointer-events:none;
      background:linear-gradient(180deg,
        rgba(9,9,15,.6) 0%,
        rgba(9,9,15,.4) 40%,
        rgba(9,9,15,.88) 100%);
    }
    .hero-content {
      position:relative; z-index:2;
      display:flex; flex-direction:column; align-items:center;
    }

    /* ─── ABOUT IMAGE ─── */
    .about-img {
      position:absolute; inset:0; width:100%; height:100%;
      object-fit:cover; border-radius:var(--r-lg);
    }
    .about-img-overlay {
      position:absolute; inset:0; border-radius:var(--r-lg); z-index:1;
      background:linear-gradient(135deg,
        rgba(9,9,15,.18) 0%,
        rgba(9,9,15,.52) 100%);
    }

    /* ─── TESTIMONIAL AVATARS ─── */
    .testi-avatar {
      width:48px; height:48px; border-radius:50%;
      border:2px solid rgba(var(--cyan-rgb),.35);
      object-fit:cover; flex-shrink:0;
    }

    /* ─── PROCESS STEP WATERMARK ─── */
    .pstep { position:relative; overflow:hidden; }
    .pstep-wm {
      position:absolute; bottom:-1.2rem; right:-.5rem;
      font-family:var(--display); font-weight:800; font-size:7rem;
      color:transparent;
      -webkit-text-stroke:1px rgba(255,255,255,.04);
      line-height:1; pointer-events:none; user-select:none;
      transition:.25s var(--ease);
    }
    .pstep:hover .pstep-wm { -webkit-text-stroke-color:rgba(var(--cyan-rgb),.1); }

    /* ─── REDUCED MOTION ─── */
    @media (prefers-reduced-motion: reduce) {
      .reveal { transition:none !important; opacity:1 !important; transform:none !important; }
      .hero-content, .hero-badge, .hero h1, .hero-sub, .hero-actions, .scroll-cue { animation:none !important; opacity:1 !important; transform:none !important; }
      #cursor-glow { display:none !important; }
    }
  </style>"""

html = html.replace('  </style>', new_css, 1)

# ══════════════════════════════════════════════════
# 2. CSS — spring easing on .reveal
# ══════════════════════════════════════════════════
html = html.replace(
    '    .reveal {\n      opacity:0; transform:translateY(32px);\n      transition:opacity .65s var(--ease), transform .65s var(--ease);\n    }',
    '    .reveal {\n      opacity:0; transform:translateY(40px);\n      transition:opacity .65s cubic-bezier(.16,1,.3,1), transform .65s cubic-bezier(.16,1,.3,1);\n    }'
)

# ══════════════════════════════════════════════════
# 3. HTML — add cursor glow div after <body>
# ══════════════════════════════════════════════════
html = html.replace('<body>\n\n<!-- \u2500\u2500\u2500 NAV', '<body>\n<div id="cursor-glow" aria-hidden="true"></div>\n\n<!-- \u2500\u2500\u2500 NAV', 1)

# ══════════════════════════════════════════════════
# 4. HTML — hero: add video, overlay, wrap content
# ══════════════════════════════════════════════════
old_hero = """<section class="hero">
  <div class="g1" id="g1"></div>
  <div class="g2" id="g2"></div>

  <div class="hero-badge">Cape Town Digital Agency \u00b7 Est. 2014</div>

  <h1>
    <span class="l1">Grow Faster.</span>
    <span class="l2">Think Smarter.</span>
  </h1>

  <p class="hero-sub">
    Stunning websites, results-driven marketing, intelligent automation,
    and AI systems \u2014 everything your business needs to lead the digital economy.
  </p>

  <div class="hero-actions">
    <button class="btn-main" id="openMessageBtn">Send a Message</button>
    <a href="https://wa.me/27712345678?text=Hello%20BizDynamix%20Chatbot" target="_blank" rel="noreferrer" class="btn-outline">WhatsApp Chat</a>
  </div>

  <div class="scroll-cue">
    <div class="scroll-line"></div>
    Scroll
  </div>

  <div class="hero-wm" aria-hidden="true">BIZDYNAMIX</div>
</section>"""

new_hero = """<section class="hero">
  <div class="g1" id="g1"></div>
  <div class="g2" id="g2"></div>

  <!-- Background video -->
  <video class="hero-vid" autoplay muted loop playsinline aria-hidden="true">
    <source src="https://assets.mixkit.co/videos/preview/mixkit-digital-animation-of-futuristic-blue-technology-particles-47645-large.mp4" type="video/mp4">
    <source src="https://assets.mixkit.co/videos/preview/mixkit-abstract-tech-circuit-board-on-dark-background-26440-large.mp4" type="video/mp4">
  </video>
  <div class="hero-overlay" aria-hidden="true"></div>

  <div class="hero-content">
    <div class="hero-badge">Cape Town Digital Agency \u00b7 Est. 2014</div>

    <h1>
      <span class="l1">Grow Faster.</span>
      <span class="l2">Think Smarter.</span>
    </h1>

    <p class="hero-sub">
      Stunning websites, results-driven marketing, intelligent automation,
      and AI systems \u2014 everything your business needs to lead the digital economy.
    </p>

    <div class="hero-actions">
      <button class="btn-main" id="openMessageBtn">Send a Message</button>
      <button class="btn-outline" id="openChatBtn">Chat with Us</button>
    </div>
  </div>

  <div class="scroll-cue">
    <div class="scroll-line"></div>
    Scroll
  </div>

  <div class="hero-wm" aria-hidden="true">BIZDYNAMIX</div>
</section>"""

html = html.replace(old_hero, new_hero, 1)

# ══════════════════════════════════════════════════
# 5. HTML — remove 3 service cards (SEO, Social, Content)
# ══════════════════════════════════════════════════
old_row2 = """    <!-- Row 2: Marketing -->
    <div class="svc-card reveal reveal-d3">
      <div class="svc-icon">\U0001f50d</div>
      <div class="svc-name">SEO Services</div>
      <p class="svc-desc">Data-driven search optimisation that builds sustainable organic traffic. Outrank competitors and own your niche for years to come.</p>
      <span class="svc-pill pill-core">Core Service</span>
    </div>

    <div class="svc-card reveal reveal-d4">
      <div class="svc-icon">\U0001f4e3</div>
      <div class="svc-name">Social Media Marketing</div>
      <p class="svc-desc">Strategic content and paid campaigns across all platforms. Build a loyal community, drive engagement, and grow your audience fast.</p>
      <span class="svc-pill pill-core">Core Service</span>
    </div>

    <div class="svc-card reveal reveal-d5">
      <div class="svc-icon">\u270d\ufe0f</div>
      <div class="svc-name">Content Marketing</div>
      <p class="svc-desc">Compelling content that educates, engages, and converts. Blogs, video scripts, email sequences, and long-form authority pieces.</p>
      <span class="svc-pill pill-core">Core Service</span>
    </div>

    <!-- Row 3: Growth & Intelligence -->"""

new_row2 = "    <!-- Row 2: Growth & Intelligence -->"
html = html.replace(old_row2, new_row2, 1)

# Re-sequence reveal delays on remaining PPC/Automation/AI cards
html = html.replace('<div class="svc-card highlight reveal reveal-d6">', '<div class="svc-card highlight reveal reveal-d3">', 1)
html = html.replace('<div class="svc-card highlight reveal reveal-d7">', '<div class="svc-card highlight reveal reveal-d4">', 1)
html = html.replace('<div class="svc-card highlight reveal reveal-d8">', '<div class="svc-card highlight reveal reveal-d5">', 1)

# ══════════════════════════════════════════════════
# 6. HTML — about: real image
# ══════════════════════════════════════════════════
html = html.replace(
    '      <div class="about-frame">\n        <div class="about-monogram">BD</div>\n      </div>',
    '      <div class="about-frame">\n        <img\n          class="about-img"\n          src="https://images.pexels.com/photos/3182812/pexels-photo-3182812.jpeg?auto=compress&cs=tinysrgb&w=800"\n          alt="BizDynamix team collaborating in a modern office"\n          loading="lazy"\n        >\n        <div class="about-img-overlay" aria-hidden="true"></div>\n      </div>',
    1
)

# ══════════════════════════════════════════════════
# 7. HTML — testimonial avatars
# ══════════════════════════════════════════════════
html = html.replace(
    '        <div class="avatar">JS</div>',
    '        <img src="https://i.pravatar.cc/96?img=11" class="testi-avatar" alt="John Smith" loading="lazy">',
    1
)
html = html.replace(
    '        <div class="avatar">DL</div>',
    '        <img src="https://i.pravatar.cc/96?img=33" class="testi-avatar" alt="David Lee" loading="lazy">',
    1
)

# ══════════════════════════════════════════════════
# 8. HTML — process watermarks
# ══════════════════════════════════════════════════
for num in ['01', '02', '03', '04']:
    titles = {'01': 'Discovery', '02': 'Strategy', '03': 'Execution', '04': 'Growth'}
    old = f'      <div class="pnum">{num}</div>\n      <div class="ptitle">{titles[num]}</div>'
    new = f'      <div class="pstep-wm" aria-hidden="true">{num}</div>\n      <div class="pnum">{num}</div>\n      <div class="ptitle">{titles[num]}</div>'
    html = html.replace(old, new, 1)

# ══════════════════════════════════════════════════
# 9. HTML — CTA: remove WhatsApp, add chat button
# ══════════════════════════════════════════════════
html = html.replace(
    '      <a href="https://wa.me/27712345678?text=Hello%20BizDynamix%20Chatbot" target="_blank" rel="noreferrer" class="cta-call">WhatsApp Chat</a>',
    '      <button class="cta-call" id="openChatBtnBottom">Chat with Us</button>',
    1
)

# ══════════════════════════════════════════════════
# 10. HTML — modal: fix WhatsApp references
# ══════════════════════════════════════════════════
html = html.replace(
    '    <p>Use this form to send a quick email to info@bizdynamix.co.za or open WhatsApp chat instantly.</p>',
    '    <p>Use this form to send a quick email to info@bizdynamix.co.za.</p>',
    1
)
html = html.replace(
    '        <label for="msgMobile">Mobile number (WhatsApp)</label>',
    '        <label for="msgMobile">Mobile number</label>',
    1
)
html = html.replace(
    '        <a id="openWhatsAppBtn" href="https://wa.me/27712345678?text=Hello%20BizDynamix%20Chatbot" target="_blank" rel="noreferrer" class="btn-outline">Open WhatsApp</a>',
    '',
    1
)
# SEO from modal dropdown
html = html.replace('          <option value="SEO Services">SEO Services</option>\n', '', 1)

# ══════════════════════════════════════════════════
# 11. HTML — footer: remove SEO
# ══════════════════════════════════════════════════
html = html.replace('        <li><a href="#services">SEO Services</a></li>\n', '', 1)

# ══════════════════════════════════════════════════
# 12. JS — add cursor glow before nav scroll
# ══════════════════════════════════════════════════
old_nav_js = """<script>
  /* \u2500\u2500\u2500 NAV SCROLL \u2500\u2500\u2500 */"""

new_nav_js = """<script>
  /* \u2500\u2500\u2500 CURSOR GLOW \u2500\u2500\u2500 */
  const cursorGlow = document.getElementById('cursor-glow');
  if (window.matchMedia('(hover:hover)').matches) {
    document.addEventListener('mousemove', (e) => {
      cursorGlow.style.left = e.clientX + 'px';
      cursorGlow.style.top  = e.clientY + 'px';
    }, { passive: true });
  }

  /* \u2500\u2500\u2500 NAV SCROLL \u2500\u2500\u2500 */"""

html = html.replace(old_nav_js, new_nav_js, 1)

# ══════════════════════════════════════════════════
# 13. JS — replace modal JS (remove WhatsApp, add chatbot)
# ══════════════════════════════════════════════════
old_modal_js = """  /* \u2500\u2500\u2500 MESSAGE MODAL \u2500\u2500\u2500 */
  const openMessageBtn = document.getElementById('openMessageBtn');
  const openMessageBtnAbout = document.getElementById('openMessageBtnAbout');
  const openMessageBtnBottom = document.getElementById('openMessageBtnBottom');
  const messageModal = document.getElementById('messageModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const messageForm = document.getElementById('messageForm');
  const msgName = document.getElementById('msgName');
  const msgService = document.getElementById('msgService');
  const msgMobile = document.getElementById('msgMobile');
  const msgBody = document.getElementById('msgBody');
  const openWhatsAppBtn = document.getElementById('openWhatsAppBtn');

  const showModal = () => {
    messageModal.classList.add('open');
    messageModal.setAttribute('aria-hidden', 'false');
    msgName.focus();
    updateWhatsAppLink();
  };

  const hideModal = () => {
    messageModal.classList.remove('open');
    messageModal.setAttribute('aria-hidden', 'true');
  };

  const updateWhatsAppLink = () => {
    const message = encodeURIComponent(`Hi BizDynamix, I am ${msgName.value || 'interested'} and I want help with ${msgService.value || 'your services'}. My WhatsApp number is ${msgMobile.value || 'not provided'}. ${msgBody.value || ''}`);
    openWhatsAppBtn.href = `https://wa.me/27712345678?text=${message}`;
  };

  openMessageBtn.addEventListener('click', showModal);
  openMessageBtnAbout.addEventListener('click', showModal);
  openMessageBtnBottom.addEventListener('click', showModal);
  modalCloseBtn.addEventListener('click', hideModal);
  messageModal.addEventListener('click', (event) => {
    if (event.target === messageModal) hideModal();
  });

  [msgName, msgService, msgMobile, msgBody].forEach(el => {
    el.addEventListener('input', updateWhatsAppLink);
    el.addEventListener('change', updateWhatsAppLink);
  });

  messageForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const subject = encodeURIComponent(`Website inquiry from ${msgName.value}`);
    const body = encodeURIComponent(`Name: ${msgName.value}\\nService: ${msgService.value}\\nWhatsApp: ${msgMobile.value || 'Not provided'}\\n\\n${msgBody.value}`);
    window.location.href = `mailto:info@bizdynamix.co.za?subject=${subject}&body=${body}`;
    hideModal();
  });"""

new_modal_js = """  /* \u2500\u2500\u2500 MESSAGE MODAL \u2500\u2500\u2500 */
  const openMessageBtn      = document.getElementById('openMessageBtn');
  const openMessageBtnAbout = document.getElementById('openMessageBtnAbout');
  const openMessageBtnBottom= document.getElementById('openMessageBtnBottom');
  const messageModal        = document.getElementById('messageModal');
  const modalCloseBtn       = document.getElementById('modalCloseBtn');
  const messageForm         = document.getElementById('messageForm');
  const msgName             = document.getElementById('msgName');
  const msgService          = document.getElementById('msgService');
  const msgMobile           = document.getElementById('msgMobile');
  const msgBody             = document.getElementById('msgBody');

  const showModal = () => {
    messageModal.classList.add('open');
    messageModal.setAttribute('aria-hidden','false');
    msgName.focus();
  };
  const hideModal = () => {
    messageModal.classList.remove('open');
    messageModal.setAttribute('aria-hidden','true');
  };

  openMessageBtn.addEventListener('click', showModal);
  openMessageBtnAbout.addEventListener('click', showModal);
  openMessageBtnBottom.addEventListener('click', showModal);
  modalCloseBtn.addEventListener('click', hideModal);
  messageModal.addEventListener('click', (e) => { if (e.target === messageModal) hideModal(); });

  messageForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Website inquiry from ${msgName.value}`);
    const body    = encodeURIComponent(`Name: ${msgName.value}\\nService: ${msgService.value}\\nMobile: ${msgMobile.value || 'Not provided'}\\n\\n${msgBody.value}`);
    window.location.href = `mailto:info@bizdynamix.co.za?subject=${subject}&body=${body}`;
    hideModal();
  });

  /* \u2500\u2500\u2500 CHATBOT \u2500\u2500\u2500 */
  const openChatBtn        = document.getElementById('openChatBtn');
  const openChatBtnBottom2 = document.getElementById('openChatBtnBottom');

  const BOT_REPLIES = {
    hello:   "Hi there! \ud83d\udc4b I'm the BizDynamix virtual assistant. Ask me about our services, pricing, or how we can help your business grow.",
    web:     "We build stunning, fast, mobile-first websites tailored to your brand \u2014 from simple landing pages to complex portals. Send us a message to get a free quote!",
    ecom:    "Our e-commerce solutions cover storefront design, secure payments, and inventory. We work with WooCommerce, Shopify, and fully custom builds.",
    app:     "We develop iOS, Android, and cross-platform apps. Tell us about your idea and we'll map out a build plan.",
    ppc:     "Our PPC service covers Google Ads, Meta, and LinkedIn. We maximise every rand of your ad spend with data-driven targeting.",
    auto:    "We design custom business automation workflows \u2014 CRM integrations, automated reporting, API connections, and more.",
    ai:      "We build custom AI chatbots, intelligent agents, and ML integrations that give your business a genuine competitive edge.",
    price:   "Pricing depends on scope and service. Click 'Send a Message' for a tailored quote \u2014 no hard sell, just honest advice.",
    contact: "Reach us at info@bizdynamix.co.za, or click 'Send a Message' to drop us a quick note.",
    fallback:"Great question! We specialise in web design, e-commerce, app development, PPC advertising, business automation, and AI systems. What would you like to know more about?"
  };

  const getBotReply = (t) => {
    t = t.toLowerCase();
    if (/hello|hi|hey|howzit|greet/.test(t))              return BOT_REPLIES.hello;
    if (/web|website|design|landing|page/.test(t))         return BOT_REPLIES.web;
    if (/shop|ecommerce|e-commerce|store|shopify|woo/.test(t)) return BOT_REPLIES.ecom;
    if (/app|mobile|ios|android|pwa/.test(t))              return BOT_REPLIES.app;
    if (/ppc|advert|google ad|meta ad|paid|campaign/.test(t)) return BOT_REPLIES.ppc;
    if (/automat|workflow|integrat|crm|zapier/.test(t))    return BOT_REPLIES.auto;
    if (/ai|chatbot|intelligence|ml|openai/.test(t))       return BOT_REPLIES.ai;
    if (/price|cost|quote|package|how much|rate/.test(t))  return BOT_REPLIES.price;
    if (/contact|email|call|reach|speak|talk/.test(t))     return BOT_REPLIES.contact;
    return BOT_REPLIES.fallback;
  };

  let chatModal, chatMessages, chatForm, chatInput;
  const initChat = () => {
    if (chatModal) return;
    chatModal = document.createElement('div');
    chatModal.className = 'modal-overlay';
    chatModal.id = 'chatModal';
    chatModal.setAttribute('aria-hidden','true');
    chatModal.innerHTML =
      '<div class="modal" style="width:min(100%,560px);display:flex;flex-direction:column;height:min(88vh,620px);padding:0;overflow:hidden;" role="dialog" aria-modal="true" aria-labelledby="chatModalTitle">' +
        '<div style="display:flex;align-items:center;justify-content:space-between;padding:1.3rem 1.7rem;border-bottom:1px solid rgba(255,255,255,.08);flex-shrink:0;">' +
          '<div><div class="modal-label" style="margin-bottom:.2rem;">BizDynamix AI</div><h3 id="chatModalTitle" style="font-size:1.25rem;margin:0;">Chat with Us</h3></div>' +
          '<button id="chatClose" class="modal-close" aria-label="Close chat" style="position:static;">\u2715</button>' +
        '</div>' +
        '<div id="chatMsgs" style="flex:1;overflow-y:auto;padding:1.2rem 1.7rem;display:flex;flex-direction:column;gap:.9rem;"></div>' +
        '<form id="chatFrm" style="display:flex;gap:.7rem;padding:1.1rem 1.7rem;border-top:1px solid rgba(255,255,255,.08);flex-shrink:0;">' +
          '<input id="chatIn" type="text" placeholder="Ask anything\u2026" autocomplete="off" aria-label="Chat message" style="flex:1;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:14px;padding:12px 15px;color:var(--text);font-family:var(--body);font-size:.9rem;outline:none;transition:.2s;">' +
          '<button type="submit" class="btn-main" style="padding:12px 20px;font-size:.85rem;flex-shrink:0;">Send</button>' +
        '</form>' +
      '</div>';
    document.body.appendChild(chatModal);
    chatMessages = document.getElementById('chatMsgs');
    chatForm     = document.getElementById('chatFrm');
    chatInput    = document.getElementById('chatIn');
    document.getElementById('chatClose').addEventListener('click', hideChat);
    chatModal.addEventListener('click', (e) => { if (e.target === chatModal) hideChat(); });
    chatForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const text = chatInput.value.trim();
      if (!text) return;
      appendMsg(text, 'user');
      chatInput.value = '';
      setTimeout(() => appendMsg(getBotReply(text), 'bot'), 420);
    });
    appendMsg("Hi! \ud83d\udc4b I'm the BizDynamix virtual assistant. How can I help you today?", 'bot');
  };

  const appendMsg = (text, role) => {
    const d = document.createElement('div');
    d.style.cssText = 'max-width:82%;padding:11px 15px;border-radius:18px;font-size:.88rem;line-height:1.65;word-wrap:break-word;' +
      (role === 'user'
        ? 'align-self:flex-end;background:rgba(0,229,200,.12);color:var(--text);border-bottom-right-radius:4px;'
        : 'align-self:flex-start;background:rgba(255,255,255,.06);color:var(--text);border-bottom-left-radius:4px;');
    d.textContent = text;
    chatMessages.appendChild(d);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  };

  const showChat = () => {
    initChat();
    chatModal.classList.add('open');
    chatModal.setAttribute('aria-hidden','false');
    setTimeout(() => chatInput && chatInput.focus(), 50);
  };
  const hideChat = () => {
    if (!chatModal) return;
    chatModal.classList.remove('open');
    chatModal.setAttribute('aria-hidden','true');
  };

  if (openChatBtn)        openChatBtn.addEventListener('click', showChat);
  if (openChatBtnBottom2) openChatBtnBottom2.addEventListener('click', showChat);"""

html = html.replace(old_modal_js, new_modal_js, 1)

# ══════════════════════════════════════════════════
# 14. JS — marquee items
# ══════════════════════════════════════════════════
html = html.replace(
    "  const items = [\n    'Web Design', 'E-Commerce', 'App Development',\n    'SEO', 'Social Media', 'Content Marketing',\n    'PPC Ads', 'Business Automation', 'AI Systems',\n  ];",
    "  const items = [\n    'Web Design', 'E-Commerce', 'App Development',\n    'PPC Ads', 'Business Automation', 'AI Systems',\n  ];"
)

# ══════════════════════════════════════════════════
# 15. JS — parallax + scramble (append before </script>)
# ══════════════════════════════════════════════════
old_end = """  /* \u2500\u2500\u2500 PARALLAX GLOWS \u2500\u2500\u2500 */
  const g1 = document.getElementById('g1');
  const g2 = document.getElementById('g2');
  document.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 40;
    const y = (e.clientY / window.innerHeight - 0.5) * 30;
    g1.style.transform = `translate(${x}px, ${y}px)`;
    g2.style.transform = `translate(${-x}px, ${-y}px)`;
  }, { passive: true });
</script>"""

new_end = """  /* \u2500\u2500\u2500 PARALLAX GLOWS \u2500\u2500\u2500 */
  const g1 = document.getElementById('g1');
  const g2 = document.getElementById('g2');
  document.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 40;
    const y = (e.clientY / window.innerHeight - 0.5) * 30;
    g1.style.transform = `translate(${x}px, ${y}px)`;
    g2.style.transform = `translate(${-x}px, ${-y}px)`;
  }, { passive: true });

  /* \u2500\u2500\u2500 HERO SCROLL PARALLAX \u2500\u2500\u2500 */
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const heroContent = document.querySelector('.hero-content');
    window.addEventListener('scroll', () => {
      if (!heroContent) return;
      const y = window.scrollY;
      heroContent.style.transform = `translateY(${y * 0.28}px)`;
      heroContent.style.opacity   = Math.max(0, 1 - y / 600).toString();
    }, { passive: true });
  }

  /* \u2500\u2500\u2500 HERO TEXT SCRAMBLE \u2500\u2500\u2500 */
  (() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&*';
    const scramble = (el, finalText, duration) => {
      const len = finalText.length;
      let frame = 0;
      const totalFrames = Math.round(duration / 40);
      const timer = setInterval(() => {
        const reveal = Math.floor((frame / totalFrames) * len);
        let out = '';
        for (let i = 0; i < len; i++) {
          if (finalText[i] === ' ') { out += ' '; continue; }
          out += i < reveal ? finalText[i] : CHARS[Math.floor(Math.random() * CHARS.length)];
        }
        el.textContent = out;
        if (++frame > totalFrames) { el.textContent = finalText; clearInterval(timer); }
      }, 40);
    };
    window.addEventListener('load', () => {
      const l1 = document.querySelector('.hero h1 .l1');
      const l2 = document.querySelector('.hero h1 .l2');
      if (l1) setTimeout(() => scramble(l1, 'Grow Faster.', 640), 300);
      if (l2) setTimeout(() => scramble(l2, 'Think Smarter.', 700), 520);
    });
  })();
</script>"""

html = html.replace(old_end, new_end, 1)

# ══════════════════════════════════════════════════
# Write
# ══════════════════════════════════════════════════
with open('/Users/edwinbrooks/Projects/WEBSITES/BDX/index.html', 'w') as f:
    f.write(html)

new_len = len(html)
print(f"Done. {original_len} -> {new_len} chars (+{new_len - original_len})")

checks = [
    ('cursor-glow div',          'id="cursor-glow"' in html),
    ('hero video tag',           'hero-vid' in html),
    ('hero overlay div',         'hero-overlay' in html),
    ('hero-content wrapper',     'hero-content' in html),
    ('SEO card removed',         'SEO Services</div>' not in html),
    ('Social card removed',      'Social Media Marketing' not in html),
    ('Content card removed',     'Content Marketing</div>' not in html),
    ('WhatsApp gone',            'wa.me' not in html),
    ('Chat btn hero',            'id="openChatBtn"' in html),
    ('Chat btn CTA',             'id="openChatBtnBottom"' in html),
    ('About image',              'about-img' in html),
    ('Testi avatars',            'testi-avatar' in html),
    ('Process watermarks',       'pstep-wm' in html),
    ('Parallax hero',            'HERO SCROLL PARALLAX' in html),
    ('Scramble',                 'HERO TEXT SCRAMBLE' in html),
    ('Chatbot JS',               'getBotReply' in html),
    ('Marquee no SEO',           "'SEO'" not in html),
    ('Footer no SEO',            'SEO Services</a>' not in html),
    ('No updateWhatsAppLink',    'updateWhatsAppLink' not in html),
    ('Reduced motion guard',     'prefers-reduced-motion: reduce' in html),
    ('Spring easing',            'cubic-bezier(.16,1,.3,1)' in html),
    ('Cursor glow CSS',          '#cursor-glow' in html),
]
all_ok = True
for name, ok in checks:
    s = '✓' if ok else '✗'
    if not ok: all_ok = False
    print(f"  {s} {name}")
print()
print('ALL PASSED' if all_ok else 'SOME FAILED')
