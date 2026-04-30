import { Router } from "express";
import { OpenAI } from "openai";

const router = Router();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

router.post("/", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || typeof message !== "string" || message.trim().length === 0) {
      return res.status(400).json({ error: "Message is required" });
    }

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are a friendly BizDynamix support assistant. You help clients with questions about:
- Web design and development
- E-commerce platforms
- Mobile app development (iOS, Android, PWA)
- PPC advertising campaigns (Google Ads, Meta, LinkedIn)
- Business automation and workflows
- AI chatbots and intelligent systems

Be concise, helpful, and professional. Keep responses under 150 words. If asked about pricing, suggest they contact for a quote.`
        },
        { role: "user", content: message.trim() }
      ],
      temperature: 0.7,
      max_tokens: 200,
    });

    const reply = response.choices[0]?.message?.content || "I couldn't generate a response. Please try again.";

    return res.json({
      reply,
      received: message
    });
  } catch (error: any) {
    console.error("Chat API error:", error.message);
    return res.status(500).json({
      reply: "I'm having trouble connecting to the AI service. Please try again later or contact support.",
      error: error.message
    });
  }
});

export default router;
