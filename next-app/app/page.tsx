"use client";

import { useState } from "react";

interface Message {
  role: "user" | "assistant";
  text: string;
}

export default function HomePage() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", text: "Hello! Ask me anything about your business, website, or AI chatbot." }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!input.trim()) return;

    const userText = input.trim();
    setMessages((prev) => [...prev, { role: "user", text: userText }]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userText })
      });

      const data = await response.json();
      setMessages((prev) => [...prev, { role: "assistant", text: data.answer ?? "No response from the AI endpoint." }]);
    } catch (error) {
      setMessages((prev) => [...prev, { role: "assistant", text: "There was an error connecting to the chat endpoint." }]);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-surface text-slate-900">
      <section className="mx-auto max-w-6xl px-6 py-14 md:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-[2rem] bg-white/95 p-10 shadow-soft backdrop-blur-xl md:p-14">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-primary">BizDynamix</p>
            <h1 className="text-5xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-6xl">
              AI-first digital solutions for modern businesses
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              Build a smarter brand presence with a website that showcases your services and embeds an AI chatbot experience on demand. Fast, modern, and designed to convert visitors into customers.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <button
                type="button"
                onClick={() => setIsChatOpen(true)}
                className="inline-flex items-center justify-center rounded-3xl bg-primary px-7 py-4 text-sm font-semibold text-white transition hover:bg-slate-900"
              >
                Open AI Chat
              </button>
              <a
                href="#services"
                className="inline-flex items-center justify-center rounded-3xl border border-slate-200 bg-white px-7 py-4 text-sm font-semibold text-slate-900 transition hover:border-slate-300"
              >
                Explore services
              </a>
            </div>
          </div>

          <div className="rounded-[2rem] bg-gradient-to-br from-primary/10 via-white to-accent/20 p-10 shadow-xl md:p-14">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-slate-700">What we do</p>
            <ul className="space-y-5 text-sm text-slate-700">
              <li className="rounded-3xl bg-white/80 p-5 shadow-sm">
                <p className="font-semibold text-slate-900">Brand-led website design</p>
                <p className="mt-2 text-slate-600">Responsive, professional sites that match your business identity and convert visitors.</p>
              </li>
              <li className="rounded-3xl bg-white/80 p-5 shadow-sm">
                <p className="font-semibold text-slate-900">AI chatbot integration</p>
                <p className="mt-2 text-slate-600">Deploy a plug-in chatbot in a modal that can be reused across client sites.</p>
              </li>
              <li className="rounded-3xl bg-white/80 p-5 shadow-sm">
                <p className="font-semibold text-slate-900">Fast frontend + backend</p>
                <p className="mt-2 text-slate-600">Next.js frontend with a separate Express backend for flexible AI orchestration.</p>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section id="services" className="mx-auto max-w-6xl px-6 pb-20">
        <div className="grid gap-8 lg:grid-cols-3">
          {[
            {
              title: "Web design",
              description: "Custom landing pages, marketing sites, and service pages designed to attract and convert."
            },
            {
              title: "AI chat",
              description: "A modal chatbot that activates on demand and can connect to your AI backend or custom RAG workflow."
            },
            {
              title: "Plug-in ready",
              description: "Use the same AI chat experience on other client websites with minimal integration."
            }
          ].map((item) => (
            <div key={item.title} className="rounded-[1.75rem] border border-slate-200 bg-white p-8 shadow-sm">
              <h2 className="text-xl font-semibold text-slate-950">{item.title}</h2>
              <p className="mt-4 text-slate-600">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {isChatOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/60 px-4 py-6 backdrop-blur-sm md:items-center">
          <div className="w-full max-w-4xl overflow-hidden rounded-[2rem] bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-slate-500">BizDynamix AI Chat</p>
                <h2 className="mt-1 text-2xl font-semibold text-slate-950">Ask the bot</h2>
              </div>
              <button
                type="button"
                onClick={() => setIsChatOpen(false)}
                className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
              >
                Close
              </button>
            </div>

            <div className="p-6">
              <div className="max-h-[65vh] space-y-4 overflow-y-auto pr-2">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`rounded-3xl p-5 ${message.role === "user" ? "bg-primary/10 text-slate-900 self-end" : "bg-slate-100 text-slate-800"}`}
                  >
                    <p className="text-[11px] uppercase tracking-[0.25em] text-slate-500">{message.role}</p>
                    <p className="mt-3 text-sm leading-7 whitespace-pre-line">{message.text}</p>
                  </div>
                ))}
              </div>

              <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-3 sm:flex-row">
                <label className="sr-only" htmlFor="chat-input">Send message</label>
                <input
                  id="chat-input"
                  className="flex-1 rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
                  placeholder="Type your question..."
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                />
                <button
                  type="submit"
                  disabled={isLoading}
                  className="inline-flex items-center justify-center rounded-3xl bg-primary px-6 py-4 text-sm font-semibold text-white transition hover:bg-slate-900 disabled:cursor-not-allowed disabled:bg-slate-400"
                >
                  {isLoading ? "Sending..." : "Send"}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
