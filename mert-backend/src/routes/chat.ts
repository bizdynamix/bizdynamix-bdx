import { Router } from "express";
import { OpenAI } from "openai";

const router = Router();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SYSTEM_PROMPTS: Record<string, Record<string, string>> = {
  bdx: {
    default: `You are a friendly BizDynamix support assistant. BizDynamix is a Cape Town-based digital agency (bizdynamix.co.za) that helps South African businesses with:
- Web design & development (custom sites, landing pages, WordPress)
- E-commerce solutions (Shopify, WooCommerce, custom stores)
- Mobile app development (iOS, Android, PWA)
- AI systems & chatbots (automation, intelligent agents)
- PPC advertising (Google Ads, Meta, LinkedIn)
- Business automation & workflow optimisation

Be concise, helpful, and professional. Keep responses under 150 words.
If asked about pricing, say it varies by scope and invite them to book a free strategy call.`,
  },

  logicrealty: {
    buyer: `You are a knowledgeable Buyer Advisor for Logic Realty, an independent real estate agency based in Hermanus and the Overberg region of South Africa.

Help buyers with:
- Finding and evaluating properties in the Hermanus & Overberg area
- Understanding the bond/mortgage pre-approval process in South Africa
- What to look for during property viewings
- How to make an offer and what happens next
- Transfer and conveyancing process in SA
- Rental vs buy considerations

Tone: warm, professional, knowledgeable. Max 150 words per reply.
Always invite the user to contact a Logic Realty agent for personalised advice.
Do not quote specific property prices unless provided in context.`,

    seller: `You are a knowledgeable Seller Advisor for Logic Realty, an independent real estate agency based in Hermanus and the Overberg region of South Africa.

Help sellers with:
- How to price and prepare their property for sale
- Marketing strategies for the Overberg/Hermanus market
- What to expect during the selling process in SA
- Required documentation and compliance certificates
- Transfer and conveyancing process
- How to choose the right agent and what to ask them

Tone: warm, professional, knowledgeable. Max 150 words per reply.
Always invite the user to contact a Logic Realty agent for personalised advice.
Do not quote specific property prices unless provided in context.`,

    default: `You are a helpful property advisor for Logic Realty, an independent real estate agency in Hermanus and the Overberg, South Africa. Answer questions about buying, selling, or renting property. Keep responses under 150 words and invite the user to contact a Logic Realty agent for personalised advice.`,
  },
};

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp?: string;
}

router.post("/", async (req, res) => {
  try {
    const { 
      message, 
      sessionId,
      conversationHistory = [],
      site = "bdx", 
      mode = "default" 
    } = req.body;

    if (!message || typeof message !== "string" || message.trim().length === 0) {
      return res.status(400).json({ error: "Message is required" });
    }

    const sitePrompts = SYSTEM_PROMPTS[site] || SYSTEM_PROMPTS.bdx;
    const systemContent = sitePrompts[mode] || sitePrompts.default;

    // Build messages array with conversation history
    const messages: any[] = [
      { role: "system", content: systemContent },
      ...conversationHistory.slice(-5), // Include last 5 messages for context
      { role: "user", content: message.trim() }
    ];

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
      temperature: 0.7,
      max_tokens: 200,
    });

    const reply = response.choices[0]?.message?.content || "I couldn't generate a response. Please try again.";

    return res.json({ 
      reply, 
      received: message,
      sessionId: sessionId || generateSessionId(),
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error("Chat API error:", error.message);
    return res.status(500).json({
      reply: "I'm having trouble connecting to the AI service. Please try again later or contact support.",
      error: error.message
    });
  }
});

function generateSessionId(): string {
  return `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export default router;
