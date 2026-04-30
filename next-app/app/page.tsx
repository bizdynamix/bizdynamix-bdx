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
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactMessage, setContactMessage] = useState("");

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
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <nav className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/95 backdrop-blur-xl px-6 py-5">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-6">
          <a href="#" className="font-display text-xl font-black tracking-[-0.03em] text-cyan-300">BizDynamix</a>
          <div className="hidden items-center gap-6 md:flex">
            <a href="#services" className="text-sm font-medium text-slate-300 transition hover:text-white">Services</a>
            <a href="#" className="text-sm font-medium text-slate-300 transition hover:text-white">About</a>
            <a href="https://wa.me/27712345678?text=Hello%20BizDynamix%20Chatbot" target="_blank" rel="noreferrer" className="text-sm font-medium text-slate-300 transition hover:text-white">WhatsApp Chat</a>
          </div>
          <button onClick={() => setIsContactOpen(true)} className="rounded-full bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300">Send a message</button>
        </div>
      </nav>

      <section className="relative overflow-hidden py-20">
        <div className="absolute left-0 top-0 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute right-0 bottom-0 h-96 w-96 translate-x-1/3 translate-y-1/3 rounded-full bg-violet-500/10 blur-3xl" />

        <div className="mx-auto grid max-w-6xl gap-12 px-6 lg:grid-cols-[1.3fr_0.9fr]">
          <div className="relative rounded-[2rem] border border-white/10 bg-slate-950/90 p-10 shadow-2xl shadow-slate-950/40 backdrop-blur-xl sm:p-14">
            <span className="inline-flex items-center gap-3 rounded-full border border-cyan-300/30 bg-cyan-300/10 px-4 py-2 text-xs uppercase tracking-[0.25em] text-cyan-300">
              <span className="h-2 w-2 rounded-full bg-cyan-300" /> AI-first digital growth
            </span>
            <h1 className="mt-8 text-5xl font-black tracking-[-0.05em] text-white sm:text-6xl">AI-first digital solutions for modern businesses</h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              Build a smarter brand presence with a website that showcases your services and embeds an AI chatbot experience on demand. Fast, modern, and designed to convert visitors into customers.
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <button onClick={() => setIsContactOpen(true)} className="inline-flex items-center justify-center rounded-full bg-cyan-400 px-8 py-4 font-semibold text-slate-950 transition hover:bg-cyan-300">
                Send a message
              </button>
              <a href="https://wa.me/27712345678?text=Hello%20BizDynamix%20Chatbot" target="_blank" rel="noreferrer" className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-8 py-4 text-sm font-semibold text-white transition hover:border-cyan-300 hover:bg-white/10">
                WhatsApp Chat
              </a>
            </div>
          </div>

          <aside className="rounded-[2rem] border border-white/10 bg-slate-900/90 p-10 shadow-2xl shadow-slate-950/50 backdrop-blur-xl sm:p-14">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-300">What we do</p>
            <div className="mt-8 space-y-5">
              <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6">
                <h2 className="text-lg font-semibold text-white">Brand-led website design</h2>
                <p className="mt-3 text-sm leading-7 text-slate-300">Responsive, professional sites that match your business identity and convert visitors.</p>
              </div>
              <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6">
                <h2 className="text-lg font-semibold text-white">AI chatbot integration</h2>
                <p className="mt-3 text-sm leading-7 text-slate-300">Deploy a plug-in chatbot in a modal that can be reused across client sites.</p>
              </div>
              <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6">
                <h2 className="text-lg font-semibold text-white">Fast frontend + backend</h2>
                <p className="mt-3 text-sm leading-7 text-slate-300">Next.js frontend with a separate Express backend for flexible AI orchestration.</p>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section id="services" className="mx-auto max-w-6xl px-6 pb-24">
        <div className="grid gap-6 lg:grid-cols-3">
          {[
            {
              title: "Creative marketing websites",
              caption: "Beautiful landing pages that build trust and drive action."
            },
            {
              title: "AI assistant modal",
              caption: "A modern chatbot experience that opens only when your visitor asks for it."
            },
            {
              title: "Backend-ready architecture",
              caption: "Scalable split architecture with reusable API and chatbot backend."
            }
          ].map((item) => (
            <div key={item.title} className="rounded-[1.75rem] border border-white/10 bg-slate-900/90 p-8 shadow-xl shadow-slate-950/40 transition hover:border-cyan-300/30 hover:bg-slate-900">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">{item.title}</p>
              <p className="mt-4 text-sm leading-7 text-slate-300">{item.caption}</p>
            </div>
          ))}
        </div>
      </section>

      {isChatOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/80 p-4 backdrop-blur-sm md:items-center">
          <div className="w-full max-w-4xl overflow-hidden rounded-[2rem] bg-slate-900 shadow-2xl ring-1 ring-white/10">
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-slate-400">BizDynamix AI Chat</p>
                <h2 className="mt-1 text-2xl font-semibold text-white">Ask the bot</h2>
              </div>
              <button type="button" onClick={() => setIsChatOpen(false)} className="rounded-full bg-white/5 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:bg-white/10">Close</button>
            </div>
            <div className="p-6">
              <div className="max-h-[60vh] space-y-4 overflow-y-auto pr-2 pb-4">
                {messages.map((message, index) => (
                  <div key={index} className={`rounded-3xl p-5 ${message.role === "user" ? "ml-auto w-full max-w-[72%] bg-cyan-400/10 text-cyan-100" : "bg-white/5 text-slate-100"}`}>
                    <p className="text-[11px] uppercase tracking-[0.25em] text-slate-400">{message.role}</p>
                    <p className="mt-3 text-sm leading-7 whitespace-pre-line">{message.text}</p>
                  </div>
                ))}
              </div>
              <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-3 sm:flex-row">
                <label className="sr-only" htmlFor="chat-input">Send message</label>
                <input
                  id="chat-input"
                  className="flex-1 rounded-3xl border border-white/10 bg-slate-950 px-5 py-4 text-sm text-white outline-none transition focus:border-cyan-300/70 focus:ring-4 focus:ring-cyan-300/15"
                  placeholder="Type your question..."
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                />
                <button
                  type="submit"
                  disabled={isLoading}
                  className="inline-flex items-center justify-center rounded-3xl bg-cyan-400 px-6 py-4 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:bg-slate-600"
                >
                  {isLoading ? "Sending..." : "Send"}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {isContactOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/80 p-4 backdrop-blur-sm md:items-center">
          <div className="w-full max-w-2xl overflow-hidden rounded-[2rem] bg-slate-900 shadow-2xl ring-1 ring-white/10">
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Contact BizDynamix</p>
                <h2 className="mt-1 text-2xl font-semibold text-white">Send us a message</h2>
              </div>
              <button type="button" onClick={() => setIsContactOpen(false)} className="rounded-full bg-white/5 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:bg-white/10">Close</button>
            </div>
            <div className="p-6">
              <form onSubmit={(event) => {
                event.preventDefault();
                const subject = encodeURIComponent("Website inquiry from BizDynamix site");
                const body = encodeURIComponent(`Name: ${contactName}\nEmail: ${contactEmail}\n\n${contactMessage}`);
                window.location.href = `mailto:info@bizdynamix.co.za?subject=${subject}&body=${body}`;
                setIsContactOpen(false);
              }} className="space-y-4">
                <div>
                  <label htmlFor="contact-name" className="mb-2 block text-sm font-medium text-slate-200">Name</label>
                  <input
                    id="contact-name"
                    value={contactName}
                    onChange={(event) => setContactName(event.target.value)}
                    className="w-full rounded-3xl border border-white/10 bg-slate-950 px-5 py-4 text-sm text-white outline-none transition focus:border-cyan-300/70 focus:ring-4 focus:ring-cyan-300/15"
                    placeholder="Your name"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="contact-email" className="mb-2 block text-sm font-medium text-slate-200">Email</label>
                  <input
                    id="contact-email"
                    type="email"
                    value={contactEmail}
                    onChange={(event) => setContactEmail(event.target.value)}
                    className="w-full rounded-3xl border border-white/10 bg-slate-950 px-5 py-4 text-sm text-white outline-none transition focus:border-cyan-300/70 focus:ring-4 focus:ring-cyan-300/15"
                    placeholder="you@example.com"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="contact-message" className="mb-2 block text-sm font-medium text-slate-200">Message</label>
                  <textarea
                    id="contact-message"
                    value={contactMessage}
                    onChange={(event) => setContactMessage(event.target.value)}
                    className="h-40 w-full rounded-[1.75rem] border border-white/10 bg-slate-950 px-5 py-4 text-sm text-white outline-none transition focus:border-cyan-300/70 focus:ring-4 focus:ring-cyan-300/15"
                    placeholder="Tell us what you need..."
                    required
                  />
                </div>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <button type="submit" className="inline-flex items-center justify-center rounded-full bg-cyan-400 px-6 py-4 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300">
                    Send to info@bizdynamix.co.za
                  </button>
                  <a href="https://wa.me/27712345678?text=Hello%20BizDynamix%20Chatbot" target="_blank" rel="noreferrer" className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-6 py-4 text-sm font-semibold text-white transition hover:border-cyan-300 hover:bg-white/10">
                    Open WhatsApp chatbot
                  </a>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
