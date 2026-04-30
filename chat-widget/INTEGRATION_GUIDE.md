# Widget Integration Guide

This guide shows how to integrate the ai-embed-widget into BizDynamix and LogicRealty websites.

## Quick Setup

### 1. BizDynamix (BDX)

Add this to `index.html` or any BDX page before `</body>`:

```html
<script
  src="/chat-widget/widget.js"
  data-api="/api/chat"
  data-backend="openai"
  data-site="bdx"
  data-mode="default"
  data-name="Sarah"
  data-label="BizDynamix AI"
  data-greeting="Hey there 👋 I'm Sarah from the BizDynamix team. I can help you with web design, e-commerce, mobile apps, AI solutions, and more. What brings you here today?"
  data-primary="#00e5c8"
  data-bg="#111119"
></script>
```

**What it does:**
- Shows a cyan chat button (BDX brand color)
- Loads `Sarah` as the AI assistant
- Uses BDX-specific system prompt
- Stores conversation history in browser

---

### 2. LogicRealty - Buyer Mode

For pages helping property buyers:

```html
<script
  src="/chat-widget/widget.js"
  data-api="/api/chat"
  data-backend="openai"
  data-site="logicrealty"
  data-mode="buyer"
  data-name="Property Advisor"
  data-label="Logic Realty AI"
  data-greeting="Welcome to Logic Realty! 👋 I'm here to help you find your dream property in Hermanus and the Overberg. Are you looking to buy, rent, or just exploring?"
  data-primary="#2563eb"
  data-bg="#ffffff"
></script>
```

**What it does:**
- Shows a blue chat button (LogicRealty brand color)
- Uses buyer-focused system prompt
- Helps with property search, financing, viewings
- Recommends contacting agents for details

---

### 3. LogicRealty - Seller Mode

For pages helping property sellers:

```html
<script
  src="/chat-widget/widget.js"
  data-api="/api/chat"
  data-backend="openai"
  data-site="logicrealty"
  data-mode="seller"
  data-name="Seller Advisor"
  data-label="Logic Realty AI"
  data-greeting="Welcome! 👋 I'm here to help you prepare and market your property for sale in Hermanus and the Overberg. How can I assist you today?"
  data-primary="#2563eb"
  data-bg="#ffffff"
></script>
```

**What it does:**
- Helps sellers price, prepare, and market properties
- Explains SA property selling process
- Recommends contacting agents for personalized advice

---

## How It Works

### Backend Processing

When a user sends a message:

1. **Widget captures**: message, sessionId, conversation history
2. **Sends to**: `/api/chat` endpoint (POST)
3. **Backend processes**:
   - Selects system prompt based on `site` (bdx/logicrealty) and `mode` (default/buyer/seller)
   - Includes conversation history for context
   - Calls OpenAI API with full context
4. **Returns**: AI response + sessionId
5. **Widget displays**: Response and stores in browser storage

### Request Example

```json
POST /api/chat
{
  "message": "How much does web design cost?",
  "sessionId": "session-1714470000000-a1b2c3d4",
  "conversationHistory": [
    {
      "role": "user",
      "content": "Hi, I need help with my website"
    },
    {
      "role": "assistant",
      "content": "I can help! BizDynamix offers web design, e-commerce, and more."
    }
  ],
  "site": "bdx",
  "mode": "default"
}
```

### Response Example

```json
{
  "reply": "Pricing varies by scope and complexity. We offer custom quotes starting from basic landing pages to full e-commerce platforms. Book a free 45-minute strategy call to discuss your specific needs.",
  "sessionId": "session-1714470000000-a1b2c3d4",
  "timestamp": "2026-04-30T10:05:00Z"
}
```

---

## System Prompts

### BizDynamix Default Mode

```
You are a friendly BizDynamix support assistant. BizDynamix is a Cape Town-based digital agency (bizdynamix.co.za) that helps South African businesses with:
- Web design & development (custom sites, landing pages, WordPress)
- E-commerce solutions (Shopify, WooCommerce, custom stores)
- Mobile app development (iOS, Android, PWA)
- AI systems & chatbots (automation, intelligent agents)
- PPC advertising (Google Ads, Meta, LinkedIn)
- Business automation & workflow optimisation

Be concise, helpful, and professional. Keep responses under 150 words.
If asked about pricing, say it varies by scope and invite them to book a free strategy call.
```

### LogicRealty Buyer Mode

```
You are a knowledgeable Buyer Advisor for Logic Realty, an independent real estate agency based in Hermanus and the Overberg region of South Africa.

Help buyers with:
- Finding and evaluating properties in the Hermanus & Overberg area
- Understanding the bond/mortgage pre-approval process in South Africa
- What to look for during property viewings
- How to make an offer and what happens next
- Transfer and conveyancing process in SA
- Rental vs buy considerations

Tone: warm, professional, knowledgeable. Max 150 words per reply.
Always invite the user to contact a Logic Realty agent for personalised advice.
Do not quote specific property prices unless provided in context.
```

### LogicRealty Seller Mode

```
You are a knowledgeable Seller Advisor for Logic Realty, an independent real estate agency based in Hermanus and the Overberg region of South Africa.

Help sellers with:
- How to price and prepare their property for sale
- Marketing strategies for the Overberg/Hermanus market
- What to expect during the selling process in SA
- Required documentation and compliance certificates
- Transfer and conveyancing process
- How to choose the right agent and what to ask them

Tone: warm, professional, knowledgeable. Max 150 words per reply.
Always invite the user to contact a Logic Realty agent for personalised advice.
Do not quote specific property prices unless provided in context.
```

---

## Conversation History

The widget automatically:

1. **Stores locally** in browser (`localStorage`)
2. **Sends with each message** to the backend
3. **Uses in OpenAI requests** for context (last 5 messages)
4. **Persists across page reloads** (same browser)
5. **Clears after timeout** (default: 1 hour, configurable)

This means conversations are:
- ✅ Private (no server-side storage by default)
- ✅ Contextual (bot remembers previous messages)
- ✅ Persistent (survives page refresh)
- ✅ Secure (stays in user's browser)

---

## Customization

### Change Colors

```html
<!-- BDX with custom colors -->
<script
  src="/chat-widget/widget.js"
  data-api="/api/chat"
  data-site="bdx"
  data-primary="#ff6b6b"
  data-bg="#1a1a2e"
></script>
```

### Change Position

```html
<!-- Bottom-left instead of bottom-right -->
<script
  src="/chat-widget/widget.js"
  data-api="/api/chat"
  data-site="bdx"
  data-position="bottom-left"
></script>
```

Available positions:
- `bottom-right` (default)
- `bottom-left`
- `top-right`
- `top-left`

### Disable History Storage

```html
<!-- Widget won't store conversation -->
<script
  src="/chat-widget/widget.js"
  data-api="/api/chat"
  data-site="bdx"
  data-store-history="false"
></script>
```

### Change Session Timeout

```html
<!-- Session expires after 2 hours instead of 1 hour -->
<script
  src="/chat-widget/widget.js"
  data-api="/api/chat"
  data-site="bdx"
  data-session-timeout="7200000"
></script>
```

---

## Testing

### Local Testing

```bash
cd mert-backend
npm run dev  # Backend on http://localhost:4000

# In another terminal
cd next-app
npm run dev  # Frontend on http://localhost:3000
```

Update widget script tag in demo HTML:
```html
<script
  src="http://localhost:3000/chat-widget/widget.js"
  data-api="http://localhost:4000/api/chat"
  data-site="bdx"
></script>
```

### Production Deployment

Widget script URL depends on where you deploy:

**Option 1: Nginx proxy** (current setup)
```html
<script
  src="/chat-widget/widget.js"
  data-api="/api/chat"
></script>
```

**Option 2: CDN deployment**
```html
<script
  src="https://cdn.bizdynamix.co.za/widget.js"
  data-api="https://api.bizdynamix.co.za/chat"
></script>
```

**Option 3: Separate domain**
```html
<script
  src="https://widget.bizdynamix.co.za/widget.js"
  data-api="https://api.bizdynamix.co.za/chat"
></script>
```

---

## Troubleshooting

### Widget not showing?
- Check browser console for errors
- Verify `/chat-widget/widget.js` is accessible
- Ensure HTTPS is enabled
- Check `data-api` URL is correct

### Chat not responding?
- Verify backend is running (`npm run dev` in mert-backend/)
- Check OPENAI_API_KEY is set in `.env`
- Look at Network tab in DevTools
- Check backend logs for errors

### Styling looks wrong?
- Verify `data-primary` color is valid hex (e.g., `#00e5c8`)
- Check no CSS conflicts on page
- Try different `data-position` value

---

## Multiple Sites on Same Page

To embed widgets for multiple sites on the same page (for demo/testing):

```html
<!-- BizDynamix -->
<script
  src="/chat-widget/widget.js"
  data-api="/api/chat"
  data-site="bdx"
  data-name="Sarah"
  data-position="bottom-right"
></script>

<!-- LogicRealty Buyer (positioned left) -->
<script
  src="/chat-widget/widget.js"
  data-api="/api/chat"
  data-site="logicrealty"
  data-mode="buyer"
  data-name="Buyer Advisor"
  data-position="bottom-left"
></script>
```

---

## Next Steps

1. ✅ Widget integrated into BDX pages
2. ✅ Widget integrated into LogicRealty pages
3. ✅ Backend supporting conversation history
4. 📊 Monitor conversations and improve prompts
5. 🔄 Add more sites/modes as needed
6. 📈 Track usage analytics
7. 🚀 Deploy to production

---

See [INTEGRATION_BDX.html](INTEGRATION_BDX.html) and [INTEGRATION_LOGICREALTY.html](INTEGRATION_LOGICREALTY.html) for copy-paste examples.
