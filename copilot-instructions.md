# BizDynamix — Copilot Instructions

## Project Overview

BizDynamix has two primary codebases:

1. **Main Marketing Site** (`index.html`, `portfolio.html`, `contact.php`)
   - Plain HTML/CSS/JS hosted on cPanel
   - No framework, no npm, no build step
   - PHP 8.x for form handling and mail

2. **AI Chatbot Stack** (MERT: MongoDB/Express/React-like/TypeScript)
   - `next-app/` — Next.js 14 frontend with Tailwind CSS
   - `mert-backend/` — Express + TypeScript backend with OpenAI integration
   - Deployed on a separate VPS (port 4000), proxied via Nginx
   - Supports multi-site/multi-mode system prompts (BizDynamix, LogicRealty, etc.)

**Default assumption**: When working on file edits, clarify which codebase (plain site or MERT stack). Do not suggest framework modernization unless explicitly asked.

---

## Stack — Non-Negotiables

### Main Marketing Site
| Layer       | Technology                          |
|-------------|-------------------------------------|
| Markup      | Vanilla HTML5                       |
| Styling     | Vanilla CSS (CSS custom properties) |
| Behaviour   | Vanilla JS (ES6+, no jQuery)        |
| Backend     | PHP 8.x (`mail()` / PHPMailer)      |
| Hosting     | cPanel shared hosting               |
| Fonts       | Google Fonts (Syne + DM Sans)       |
| No bundler  | No Webpack, Vite, Parcel, etc.      |

### MERT Chatbot Stack
| Layer       | Technology                          |
|-------------|-------------------------------------|
| Frontend    | Next.js 14 + React 18 + TypeScript  |
| Styling     | Tailwind CSS 3.4                    |
| Backend     | Express + TypeScript                |
| Runtime     | Node.js with ts-node-dev (dev)      |
| AI Model    | OpenAI (gpt-4o-mini)                |
| Hosting     | VPS (Nginx proxy at port 4000)      |
| Widget      | Standalone JS (embeddable anywhere) |

---

## Chatbot Architecture — Conversation Memory & Learning

### Current State (Stateless API)

The backend (`mert-backend/src/routes/chat.ts`) currently sends **each message independently** to OpenAI with a system prompt. Messages do not persist and the model has no conversation history — this is intentional for cost control.

**Stateless trade-off:**
- ✅ Lower API costs (no token waste on history)
- ✅ Simpler backend, no database setup required
- ❌ Chatbot cannot reference previous messages
- ❌ No conversation context or "learning" across sessions

### Implementing Conversation Memory (3 Options)

#### Option 1: Client-Side Memory (Simplest)
**When**: Low-volume testing, single-browser sessions, demo mode.

- Store conversation history in `localStorage` (browser)
- Include full history in each request payload
- Backend: Include `messages: [{role, content}]` array in POST body
- **Cost**: Higher token usage (history sent each time)
- **Privacy**: Data stays on user's machine; no server-side logging

**Implementation**:
```typescript
// In frontend (next-app/app/api/chat/route.ts or chat-widget/widget.js)
const conversationHistory = JSON.parse(localStorage.getItem('chat-history') || '[]');
const payload = {
  message: userInput,
  conversationHistory, // Include full history
  site: 'bdx',
  mode: 'default'
};
```

#### Option 2: Server-Side Session Memory (Recommended for Production)
**When**: Production chatbot, need conversation continuity, acceptable storage.

- Store conversation history in a **MongoDB** collection (add to MERT stack)
- Index by `sessionId` (UUID or user ID)
- Include only recent messages in API request to save tokens
- **Cost**: Mid-range token usage + database storage
- **Privacy**: Conversations stored on server; implement retention policy

**Required additions to MERT stack:**
1. Add MongoDB connection to `mert-backend/src/server.ts`
2. Create `src/models/Conversation.ts` schema:
   ```typescript
   interface Conversation {
     sessionId: string;
     site: string;
     messages: Array<{ role: 'user' | 'assistant', content: string, timestamp }>;
     createdAt: Date;
     updatedAt: Date;
   }
   ```
3. Modify `src/routes/chat.ts`:
   - Accept `sessionId` in request body
   - Fetch last 5-10 messages from DB
   - Add user message to history
   - Send condensed history + system prompt to OpenAI
   - Save assistant response to DB
4. Add `.env` variable: `MONGODB_URI=mongodb+srv://...`

**Package additions**:
```bash
npm install mongoose
```

#### Option 3: Specialized RAG System (Advanced)
**When**: Need semantic search over past conversations, topic extraction, or knowledge base.

- Store embeddings of past conversations in **Pinecone** or **Weaviate**
- Use semantic similarity to inject relevant past context into system prompt
- Implement topic clustering for intelligent context selection
- **Cost**: Highest (embeddings API calls + vector DB)
- **Benefit**: Can "learn" patterns and recall most relevant past interactions

**Implementation requires**:
- OpenAI embeddings API integration
- Vector database (Pinecone, Weaviate, Chroma)
- Message clustering and relevance ranking
- This is beyond the current scope; consider for v2

### Multi-Site & Multi-Mode System Prompts

The backend already supports multiple sites and modes via system prompts. Configuration in `mert-backend/src/routes/chat.ts`:

```typescript
const SYSTEM_PROMPTS: Record<string, Record<string, string>> = {
  bdx: {
    default: "BizDynamix support assistant...",
    // Add more modes if needed (e.g., 'sales', 'support')
  },
  logicrealty: {
    buyer: "Logic Realty buyer advisor...",
    seller: "Logic Realty seller advisor...",
    default: "Logic Realty property advisor...",
  },
};
```

**To add a new site or mode:**
1. Add entry to `SYSTEM_PROMPTS` object
2. Frontend sends `site` and `mode` in request body
3. Backend selects appropriate system prompt
4. If implementing conversation memory, include `site` in the sessionId key

---

## Design Tokens — Always Use These (Main Site Only)

Every colour, font, radius, and easing value is defined as a CSS custom property in `:root`. Never hardcode hex values or font names outside of `:root`.

```css
:root {
  --bg:         #09090f;
  --surf:       #111119;
  --surf2:      #18182a;
  --border:     rgba(255,255,255,0.07);
  --border2:    rgba(255,255,255,0.12);
  --text:       #eeeef6;
  --muted:      #9ca3af;
  --dim:        #6b7280;
  --cyan:       #00e5c8;
  --cyan-rgb:   0,229,200;
  --violet:     #7c6cf5;
  --violet-rgb: 124,108,245;
  --gold:       #f5c518;
  --gold-rgb:   245,197,24;
  --display:    'Syne', sans-serif;
  --body:       'DM Sans', sans-serif;
  --ease:       cubic-bezier(.4,0,.2,1);
  --r:          14px;
  --r-lg:       22px;
}
```

---

## File Structure

```
public_html/
├── index.html          # Main site — single page
├── portfolio.html      # Case studies page
├── contact.php         # Form handler — sends two HTML emails
└── assets/
    └── (images, icons if added later)
```

Do not create subdirectories for CSS or JS. Everything stays in `public_html/` root unless explicitly restructured.

---

## MERT Stack Structure

```
mert-backend/
├── src/
│   ├── server.ts       # Express app setup, CORS, middleware
│   └── routes/
│       └── chat.ts     # POST /api/chat — OpenAI integration with multi-site prompts
├── package.json
└── tsconfig.json

next-app/
├── app/
│   ├── page.tsx        # Landing page with chat UI
│   ├── layout.tsx      # Root layout with Tailwind
│   └── api/
│       └── chat/route.ts  # Next.js API route (optional; can proxy to mert-backend)
├── styles/globals.css
├── tailwind.config.ts
└── package.json

chat-widget/
├── widget.js           # Embeddable JS widget (data-attribute config)
└── demo.html           # Standalone demo page
```

---

## Contact Form — How It Works (Main Site)

The modal form in `index.html` posts to `/contact.php` via `fetch()` using `application/x-www-form-urlencoded`. Fields: `name`, `email`, `service`, `mobile`, `message`.

`contact.php` handles:
1. Input sanitisation (`strip_tags`, `filter_var`)
2. Internal HTML email → `info@bizdynamix.co.za`
3. Client auto-reply HTML email → visitor's email address
4. Returns `{ success: true|false }` as JSON

**Never replace this with a third-party form service** (Formspree, Netlify Forms, etc.) unless explicitly instructed. The server has `mail()` available.

---

## Chat Widget Integration

The standalone widget in `chat-widget/widget.js` can be embedded on any page (main site, third-party sites, etc.) via a single `<script>` tag with configuration attributes:

```html
<script
  src="/chat-widget/widget.js"
  data-api="/api/chat"
  data-site="bdx"
  data-name="Sarah"
  data-greeting="Hey there 👋 I'm Sarah..."
  data-primary="#00e5c8"
  data-bg="#111119"
></script>
```

**Configuration attributes:**
- `data-api` — Chat endpoint URL (default: `/api/chat`)
- `data-site` — Site identifier sent to backend (default: `bdx`)
- `data-mode` — Mode/role selector if multi-mode (default: `default`)
- `data-name` — Display name of chatbot agent
- `data-label` — Header label (e.g., "BizDynamix AI")
- `data-greeting` — Greeting message on load
- `data-primary` — Primary colour for button/highlights
- `data-bg` — Widget panel background colour

The widget handles:
- Floating button (fixed, bottom-right)
- Smooth open/close animations
- Message history display
- Form submission with loading state
- Error handling and retry logic

**No modification needed** unless you need custom styling or new features. Widget is self-contained.

---

## Deployment — Main Site (cPanel)

Upload files to `public_html/` via cPanel File Manager or FTP:
- `index.html`, `portfolio.html` — static pages
- `contact.php` — must have write permissions in parent for mail log (if applicable)
- `assets/` — any images, CSS, JS

No CI/CD. No staging. Test locally in a text editor, validate in browser, then deploy.

---

## Deployment — MERT Stack (VPS)

See [SETUP_OPENAI_CHAT.md](SETUP_OPENAI_CHAT.md) for complete setup guide.

**Quick reference:**
1. SSH to VPS (`root@154.66.198.46`)
2. Clone/update repo to `/var/www/bizdynamix/`
3. Set `OPENAI_API_KEY` in `mert-backend/.env`
4. Run `npm install && npm run build` in `mert-backend/`
5. Start backend via PM2: `pm2 start dist/server.js --name "bdx-chat"`
6. Nginx proxies `/api/chat` → `localhost:4000`

**Development locally:**
```bash
# Terminal 1: Backend
cd mert-backend
npm run dev

# Terminal 2: Frontend
cd next-app
npm run dev
```

Frontend runs on `http://localhost:3000`, backend on `http://localhost:4000`.

---

## Copilot Behaviour Rules (Main Site)

### Always
- Use CSS custom properties from `:root` — never raw values
- Write mobile-first CSS with `@media (max-width: ...)` breakpoints at `900px` and `600px`
- Use `IntersectionObserver` for scroll-triggered animations — never scroll event listeners
- Use `{ passive: true }` on all scroll and touch event listeners
- Sanitise all PHP `$_POST` values with `strip_tags(trim(...))` before use
- Set `Content-Type: application/json` before any `echo` in PHP endpoints
- Use `font-family: var(--display)` for headings, `var(--body)` for body text
- Match the existing animation pattern: `opacity: 0` + `transform: translateY(28px)` → `.in` class via `IntersectionObserver`

### Never
- Introduce npm, node_modules, or any build toolchain
- Use `window.location.href = 'mailto:...'` for form submission
- Use `innerHTML` to insert unsanitised user data
- Hardcode colours, fonts, or spacing values outside `:root`
- Add jQuery or any JS library not already present
- Use `var` — always `const` or `let`
- Use inline `style=""` attributes for anything that belongs in CSS
- Generate placeholder testimonials, fake stats, or stock imagery suggestions
- Use `localhost` references or environment-specific paths

---

## Copilot Behaviour Rules (MERT Stack)

### Next.js Frontend (`next-app/`)

**Always:**
- Import React hooks from 'react' (not 'next/link' for hooks)
- Use `'use client'` directive at the top of components that need interactivity
- Style via Tailwind classes (no inline CSS unless absolutely necessary)
- Use TypeScript for type safety; avoid `any` types
- Keep API routes in `app/api/` organized by resource (e.g., `app/api/chat/route.ts`)

**Never:**
- Mix Tailwind with external CSS frameworks
- Use CSS Modules unless there's a specific naming conflict
- Hard-code environment variables; use `.env.local` and `process.env`
- Import Server Components into Client Components directly

### Express Backend (`mert-backend/`)

**Always:**
- Use environment variables for all secrets: `OPENAI_API_KEY`, `PORT`, `MONGODB_URI` (when added)
- Set appropriate HTTP status codes: `400` for bad request, `401` for auth, `500` for server error
- Validate request payloads before processing
- Log errors with context (file, function, error message)
- Return JSON with consistent shape: `{ reply?, error? }` for chat; `{ sessionId?, messages? }` for history
- Use `cors()` middleware to allow cross-origin requests from the frontend

**Never:**
- Expose API keys or secrets in error messages
- Store sensitive data unencrypted
- Use `any` in TypeScript; define proper interfaces
- Make blocking calls (use `async/await`)
- Hardcode site/mode names; use the `SYSTEM_PROMPTS` object

### Chat Widget (`chat-widget/widget.js`)

**Always:**
- Check for existing `bdx-` elements before injecting to avoid duplicates
- Use `currentScript` to get widget configuration from data attributes
- Clean up event listeners on widget close (if applicable)
- Handle API errors gracefully with user-friendly messages
- Support both HTTP and HTTPS (use protocol-relative URLs where needed)

**Never:**
- Modify external page DOM except for the widget container
- Use jQuery or external dependencies
- Store sensitive data in localStorage without encryption
- Make changes to page styles outside the injected `<style>` block

---

## Brand & Copy Voice

BizDynamix targets South African small business owners and entrepreneurs. The tone is:
- **Direct** — no filler, no corporate waffle
- **Confident without arrogance** — earned authority, not posturing
- **Local** — references to South Africa, Cape Town, and the local business context are appropriate
- **Action-oriented** — every section should have a clear next step

Do not use phrases like "cutting-edge", "synergy", "leverage", "unlock your potential", or any generic agency clichés.

---

## Email Templates (Main Site)

Both emails in `contact.php` are HTML. The internal notification uses the dark theme (`#09090f` background). The client auto-reply uses a light theme (`#ffffff` body). Both use inline CSS only — no `<style>` blocks — for maximum email client compatibility.

The client auto-reply links to `https://www.bizdynamix.co.za/portfolio.html` as the soft upsell destination.

---

## Environment Setup

### Main Site (cPanel)
No setup needed. Upload files directly and ensure `contact.php` is executable. PHP 8.x is pre-installed.

### MERT Stack (Local Dev)
```bash
# Create .env files
echo "OPENAI_API_KEY=sk-xxxxxxxxxxxxx" > mert-backend/.env
echo "PORT=4000" >> mert-backend/.env

npm install # Run in both mert-backend/ and next-app/
npm run dev # Run in each directory in separate terminals
```

### MERT Stack (VPS Production)
See [SETUP_OPENAI_CHAT.md](SETUP_OPENAI_CHAT.md) for complete production setup (SSH, PM2, Nginx, environment variables, etc.).

---

## Out of Scope for This Project

The following are separate projects on the same developer's workstation and should not be confused with this codebase:

- `logic-realty` — PHP/MySQL rental platform (separate repo/VPS)
- `sc-translation-tracker` — Seed Company client project (separate repo)
- `bizdynamix-vps-dev` — General VPS infrastructure (not BDX-specific)
- `tsco-integrations` — Monday.com integrations
- `monday-sharepoint-migration` — SharePoint migration project

If a file or reference from those projects appears in context, flag it rather than assuming it belongs here.

**Within the BDX project, do NOT confuse:**
- Main site (`index.html`, `portfolio.html`, `contact.php`) — cPanel deployment
- MERT stack (`next-app/`, `mert-backend/`, `chat-widget/`) — VPS deployment with Node.js runtime

Each has its own deployment process, environment setup, and tech stack. Always clarify which one is being modified.
