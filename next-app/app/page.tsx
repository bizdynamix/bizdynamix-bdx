"use client";

import { useState, useEffect, useRef } from "react";

export default function HomePage() {
  const [isStuck, setIsStuck] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [msgName, setMsgName] = useState("");
  const [msgEmail, setMsgEmail] = useState("");
  const [msgBody, setMsgBody] = useState("");
  const g1Ref = useRef<HTMLDivElement>(null);
  const g2Ref = useRef<HTMLDivElement>(null);

  // Nav scroll
  useEffect(() => {
    const handler = () => setIsStuck(window.scrollY > 60);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  // Reveal on scroll
  useEffect(() => {
    const revealObs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("in"); }),
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );
    document.querySelectorAll(".reveal").forEach((el) => revealObs.observe(el));
    return () => revealObs.disconnect();
  }, []);

  // Stat counter
  useEffect(() => {
    const countObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          const el = e.target as HTMLElement;
          const target = +(el.dataset.count || "0");
          const suffix = el.dataset.suffix || "";
          let start: number | null = null;
          const dur = 1400;
          const tick = (ts: number) => {
            if (!start) start = ts;
            const p = Math.min((ts - start) / dur, 1);
            const ease = 1 - Math.pow(1 - p, 3);
            el.textContent = Math.round(ease * target) + suffix;
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
          countObs.unobserve(el);
        });
      },
      { threshold: 0.5 }
    );
    document.querySelectorAll("[data-count]").forEach((el) => countObs.observe(el));
    return () => countObs.disconnect();
  }, []);

  // Parallax glows
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 40;
      const y = (e.clientY / window.innerHeight - 0.5) * 30;
      if (g1Ref.current) g1Ref.current.style.transform = `translate(${x}px, ${y}px)`;
      if (g2Ref.current) g2Ref.current.style.transform = `translate(${-x}px, ${-y}px)`;
    };
    document.addEventListener("mousemove", handler, { passive: true });
    return () => document.removeEventListener("mousemove", handler);
  }, []);

  const showModal = () => setIsModalOpen(true);
  const hideModal = () => setIsModalOpen(false);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Website inquiry from ${msgName}`);
    const body = encodeURIComponent(`Name: ${msgName}\nEmail: ${msgEmail}\n\n${msgBody}`);
    window.location.href = `mailto:info@bizdynamix.co.za?subject=${subject}&body=${body}`;
    hideModal();
  };

  const marqueeItems = [
    "Web Design", "E-Commerce", "App Development",
    "SEO", "Social Media", "Content Marketing",
    "PPC Ads", "Business Automation", "AI Systems",
  ];
  const marqueeRepeated = [...marqueeItems, ...marqueeItems, ...marqueeItems, ...marqueeItems];

  return (
    <>
      {/* NAV */}
      <nav className={isStuck ? "stuck" : ""}>
        <div className="logo">Biz<em>Dynamix</em></div>
        <ul className="nav-links">
          <li><a href="#services">Services</a></li>
          <li><a href="#about">About</a></li>
          <li><a href="#process">Process</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
        <a href="#contact" className="nav-cta">Get Started →</a>
        <div className="nav-ham" onClick={() => setIsMobileMenuOpen(true)} aria-label="Open menu">
          <span /><span /><span />
        </div>
      </nav>

      {/* MOBILE MENU */}
      <div className={`mobile-menu${isMobileMenuOpen ? " open" : ""}`}>
        <button className="mobile-close" onClick={() => setIsMobileMenuOpen(false)}>✕</button>
        <a href="#services" onClick={() => setIsMobileMenuOpen(false)}>Services</a>
        <a href="#about" onClick={() => setIsMobileMenuOpen(false)}>About</a>
        <a href="#process" onClick={() => setIsMobileMenuOpen(false)}>Process</a>
        <a href="#contact" onClick={() => setIsMobileMenuOpen(false)}>Contact</a>
        <a href="#contact" className="btn-main" style={{ textAlign: "center", marginTop: "1rem" }} onClick={() => setIsMobileMenuOpen(false)}>Get Started →</a>
      </div>

      {/* HERO */}
      <section className="hero">
        <div className="g1" ref={g1Ref} />
        <div className="g2" ref={g2Ref} />
        <div className="hero-badge">Cape Town Digital Agency · Est. 2014</div>
        <h1>
          <span className="l1">Grow Faster.</span>
          <span className="l2">Think Smarter.</span>
        </h1>
        <p className="hero-sub">
          Stunning websites, results-driven marketing, intelligent automation,
          and AI systems — everything your business needs to lead the digital economy.
        </p>
        <div className="hero-actions">
          <button className="btn-main" onClick={showModal}>Send a Message</button>
          <a href="https://wa.me/27712345678?text=Hello%20BizDynamix%20Chatbot" target="_blank" rel="noreferrer" className="btn-outline">WhatsApp Chat</a>
        </div>
        <div className="scroll-cue">
          <div className="scroll-line" />
          Scroll
        </div>
        <div className="hero-wm" aria-hidden="true">BIZDYNAMIX</div>
      </section>

      {/* MESSAGE MODAL */}
      <div
        className={`modal-overlay${isModalOpen ? " open" : ""}`}
        onClick={(e) => { if (e.target === e.currentTarget) hideModal(); }}
      >
        <div className="modal" role="dialog" aria-modal="true" aria-labelledby="modalTitle">
          <button className="modal-close" onClick={hideModal} aria-label="Close modal">✕</button>
          <div className="modal-label">Send a message</div>
          <h3 id="modalTitle">Contact BizDynamix</h3>
          <p>Use this form to send a quick email directly to info@bizdynamix.co.za or open WhatsApp chat instantly.</p>
          <form onSubmit={handleFormSubmit}>
            <div className="field">
              <label htmlFor="msgName">Name</label>
              <input id="msgName" type="text" placeholder="Your name" required value={msgName} onChange={(e) => setMsgName(e.target.value)} />
            </div>
            <div className="field">
              <label htmlFor="msgEmail">Email</label>
              <input id="msgEmail" type="email" placeholder="you@example.com" required value={msgEmail} onChange={(e) => setMsgEmail(e.target.value)} />
            </div>
            <div className="field">
              <label htmlFor="msgBody">Message</label>
              <textarea id="msgBody" placeholder="Tell us what you need..." required value={msgBody} onChange={(e) => setMsgBody(e.target.value)} />
            </div>
            <div className="modal-actions">
              <button type="submit" className="btn-main">Send Message</button>
              <a href="https://wa.me/27712345678?text=Hello%20BizDynamix%20Chatbot" target="_blank" rel="noreferrer" className="btn-outline">Open WhatsApp</a>
            </div>
          </form>
        </div>
      </div>

      {/* MARQUEE */}
      <div className="marquee-wrap">
        <div className="marquee-track">
          {marqueeRepeated.map((label, i) => (
            <span key={i} className="marquee-item">
              <span className="marquee-dot" />{label}
            </span>
          ))}
        </div>
      </div>

      {/* STATS */}
      <div className="stats">
        <div className="stats-grid">
          <div className="stat reveal">
            <div className="stat-n" data-count="10" data-suffix="+">10+</div>
            <div className="stat-l">Years Experience</div>
          </div>
          <div className="stat reveal reveal-d1">
            <div className="stat-n" data-count="200" data-suffix="+">200+</div>
            <div className="stat-l">Projects Delivered</div>
          </div>
          <div className="stat reveal reveal-d2">
            <div className="stat-n" data-count="9" data-suffix="">9</div>
            <div className="stat-l">Core Services</div>
          </div>
          <div className="stat reveal reveal-d3">
            <div className="stat-n" data-count="98" data-suffix="%">98%</div>
            <div className="stat-l">Client Satisfaction</div>
          </div>
        </div>
      </div>

      {/* SERVICES */}
      <section id="services" className="section">
        <div className="services-head">
          <div>
            <div className="section-tag reveal">What We Do</div>
            <h2 className="section-h reveal">End-to-End Digital<br />Solutions</h2>
            <p className="section-p reveal">From conversion-focused websites to AI-powered systems — we deliver everything your business needs to thrive online.</p>
          </div>
        </div>
        <div className="svc-grid">
          <div className="svc-card reveal">
            <div className="svc-icon">🌐</div>
            <div className="svc-name">Web Design &amp; Development</div>
            <p className="svc-desc">Bespoke websites engineered for performance, conversion, and brand impact. Mobile-first, blazing-fast, and beautifully crafted.</p>
            <span className="svc-pill pill-core">Core Service</span>
          </div>
          <div className="svc-card reveal reveal-d1">
            <div className="svc-icon">🛒</div>
            <div className="svc-name">E-Commerce Solutions</div>
            <p className="svc-desc">Full-featured online stores built to convert browsers into buyers. Integrated payments, inventory management, and analytics.</p>
            <span className="svc-pill pill-core">Core Service</span>
          </div>
          <div className="svc-card reveal reveal-d2">
            <div className="svc-icon">📱</div>
            <div className="svc-name">App Development</div>
            <p className="svc-desc">Native and cross-platform mobile &amp; web apps that extend your reach. iOS, Android, and PWAs your users will love using every day.</p>
            <span className="svc-pill pill-new">New</span>
          </div>
          <div className="svc-card reveal reveal-d3">
            <div className="svc-icon">🔍</div>
            <div className="svc-name">SEO Services</div>
            <p className="svc-desc">Data-driven search optimisation that builds sustainable organic traffic. Outrank competitors and own your niche for years to come.</p>
            <span className="svc-pill pill-core">Core Service</span>
          </div>
          <div className="svc-card reveal reveal-d4">
            <div className="svc-icon">📣</div>
            <div className="svc-name">Social Media Marketing</div>
            <p className="svc-desc">Strategic content and paid campaigns across all platforms. Build a loyal community, drive engagement, and grow your audience fast.</p>
            <span className="svc-pill pill-core">Core Service</span>
          </div>
          <div className="svc-card reveal reveal-d5">
            <div className="svc-icon">✍️</div>
            <div className="svc-name">Content Marketing</div>
            <p className="svc-desc">Compelling content that educates, engages, and converts. Blogs, video scripts, email sequences, and long-form authority pieces.</p>
            <span className="svc-pill pill-core">Core Service</span>
          </div>
          <div className="svc-card highlight reveal reveal-d6">
            <div className="svc-icon">⚡</div>
            <div className="svc-name">PPC Advertising</div>
            <p className="svc-desc">High-ROI paid campaigns on Google, Meta, and LinkedIn. We target the right people and maximise every rand of your ad spend.</p>
            <span className="svc-pill pill-core">Core Service</span>
          </div>
          <div className="svc-card highlight reveal reveal-d7">
            <div className="svc-icon">⚙️</div>
            <div className="svc-name">Business Automation</div>
            <p className="svc-desc">Eliminate repetitive tasks and streamline operations. Custom workflows, API integrations, and automated processes that scale with your business.</p>
            <span className="svc-pill pill-new">New</span>
          </div>
          <div className="svc-card highlight reveal reveal-d8">
            <div className="svc-icon">🧠</div>
            <div className="svc-name">AI Systems</div>
            <p className="svc-desc">Custom AI chatbots, intelligent agents, and ML integrations that give your business a genuine, lasting competitive edge in the market.</p>
            <span className="svc-pill pill-new">New</span>
          </div>
        </div>
      </section>

      <div className="rule" />

      {/* ABOUT */}
      <section id="about" className="section">
        <div className="about-wrap">
          <div className="about-visual reveal">
            <div className="about-frame">
              <div className="about-monogram">BD</div>
            </div>
            <div className="about-float">
              <div className="float-n">10+</div>
              <div className="float-l">Years of Excellence</div>
            </div>
          </div>
          <div className="about-content">
            <div className="section-tag reveal">About Us</div>
            <h2 className="section-h reveal">A Decade of Helping Businesses Grow Online</h2>
            <p className="section-p reveal">BizDynamix is a Cape Town-based full-service digital agency. We&apos;re not just service providers — we&apos;re growth partners who are genuinely invested in your success. For over 10 years we&apos;ve helped South African businesses thrive in an increasingly digital world.</p>
            <ul className="about-list">
              <li className="reveal">Results-first mindset</li>
              <li className="reveal reveal-d1">Data-driven decisions</li>
              <li className="reveal reveal-d2">Transparent reporting</li>
              <li className="reveal reveal-d3">Agile, fast execution</li>
              <li className="reveal reveal-d4">AI-augmented workflows</li>
              <li className="reveal reveal-d5">Deep SA market expertise</li>
            </ul>
            <div style={{ marginTop: "2.5rem" }} className="reveal">
              <a href="#contact" className="btn-main">Work With Us →</a>
            </div>
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section id="process" className="section process">
        <div className="section-tag reveal">How We Work</div>
        <h2 className="section-h reveal">A Process Built for Results</h2>
        <div className="process-grid">
          <div className="pstep reveal">
            <div className="pnum">01</div>
            <div className="ptitle">Discovery</div>
            <p className="pdesc">We start with a deep dive into your business goals, audience, and competitive landscape — building a clear picture of opportunity.</p>
          </div>
          <div className="pstep reveal reveal-d2">
            <div className="pnum">02</div>
            <div className="ptitle">Strategy</div>
            <p className="pdesc">We craft a tailored digital roadmap with clear milestones, KPIs, and a plan designed to deliver measurable, lasting results.</p>
          </div>
          <div className="pstep reveal reveal-d4">
            <div className="pnum">03</div>
            <div className="ptitle">Execution</div>
            <p className="pdesc">Our team builds, launches, and optimises with precision — from pixel-perfect design to intelligent automation and paid campaigns.</p>
          </div>
          <div className="pstep reveal reveal-d6">
            <div className="pnum">04</div>
            <div className="ptitle">Growth</div>
            <p className="pdesc">We continuously monitor, test, and iterate — turning insights into compounding improvements that accelerate your growth over time.</p>
          </div>
        </div>
      </section>

      {/* WHY US */}
      <section className="section">
        <div className="section-tag reveal">Why BizDynamix</div>
        <h2 className="section-h reveal">Built Different</h2>
        <div className="why-grid">
          <div className="why-card reveal">
            <span className="why-icon">🎯</span>
            <div className="why-title">Results Over Everything</div>
            <p className="why-desc">We measure success in leads, sales, and growth — not vanity metrics. Every decision we make is anchored to your business outcomes.</p>
          </div>
          <div className="why-card reveal reveal-d2">
            <span className="why-icon">🔬</span>
            <div className="why-title">Data at the Core</div>
            <p className="why-desc">Our strategies are built on real data, not guesswork. We test, analyse, and iterate — continuously improving what works and cutting what doesn&apos;t.</p>
          </div>
          <div className="why-card reveal reveal-d4">
            <span className="why-icon">🚀</span>
            <div className="why-title">Future-Ready Tech</div>
            <p className="why-desc">From AI-powered chatbots to full business automation, we integrate cutting-edge technology to keep your business ahead of the curve.</p>
          </div>
          <div className="why-card reveal reveal-d1">
            <span className="why-icon">🤝</span>
            <div className="why-title">True Partnerships</div>
            <p className="why-desc">We embed ourselves in your business. You&apos;ll always know what we&apos;re doing, why, and what it&apos;s delivering — total transparency, always.</p>
          </div>
          <div className="why-card reveal reveal-d3">
            <span className="why-icon">⚡</span>
            <div className="why-title">Fast, Agile Delivery</div>
            <p className="why-desc">No bloated processes or long waits. We move quickly, adapt to change, and ship high-quality work on time, every time.</p>
          </div>
          <div className="why-card reveal reveal-d5">
            <span className="why-icon">🌍</span>
            <div className="why-title">Local SA Expertise</div>
            <p className="why-desc">We understand the South African market — the culture, consumer behaviour, and digital landscape — giving our clients a genuine local edge.</p>
          </div>
        </div>
      </section>

      <div className="rule" />

      {/* TESTIMONIALS */}
      <section className="section">
        <div className="section-tag reveal">Client Stories</div>
        <h2 className="section-h reveal">Trusted by Businesses<br />Across South Africa</h2>
        <div className="testi-grid">
          <div className="testi-card reveal">
            <div className="stars">★★★★★</div>
            <p className="testi-q">BizDynamix completely transformed our online presence. Our new website is stunning and our marketing efforts are paying off in a big way. Revenue is up significantly.</p>
            <div className="testi-auth">
              <div className="avatar">JS</div>
              <div>
                <div className="auth-name">John Smith</div>
                <div className="auth-role">Founder, Tech Startup</div>
              </div>
            </div>
          </div>
          <div className="testi-card reveal reveal-d3">
            <div className="stars">★★★★★</div>
            <p className="testi-q">The team at BizDynamix is amazing! Professional, responsive, and they always go above and beyond. The automation systems they built save us hours every single week.</p>
            <div className="testi-auth">
              <div className="avatar">DL</div>
              <div>
                <div className="auth-name">David Lee</div>
                <div className="auth-role">Business Owner</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="contact">
        <div className="cta-inner">
          <div className="section-tag reveal" style={{ justifyContent: "center" }}>Let&apos;s Talk</div>
          <h2 className="reveal">Ready to Grow<br /><span className="grad-text">Your Business?</span></h2>
          <p className="reveal">Book a free strategy call and let&apos;s map out exactly how we can accelerate your digital growth — no hard sell, just honest advice.</p>
          <div className="cta-actions reveal">
            <button className="cta-email" onClick={showModal}>✉ Send a Message</button>
            <a href="https://wa.me/27712345678?text=Hello%20BizDynamix%20Chatbot" target="_blank" rel="noreferrer" className="cta-call">WhatsApp Chat</a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="foot-top">
          <div className="foot-brand">
            <div className="logo">Biz<em>Dynamix</em></div>
            <p>Stunning websites, effective marketing, intelligent automation, and AI systems for South African businesses ready to grow.</p>
          </div>
          <div className="foot-col">
            <h5>Services</h5>
            <ul>
              <li><a href="#services">Web Design</a></li>
              <li><a href="#services">E-Commerce</a></li>
              <li><a href="#services">App Development</a></li>
              <li><a href="#services">SEO Services</a></li>
              <li><a href="#services">PPC Advertising</a></li>
              <li><a href="#services">Business Automation</a></li>
              <li><a href="#services">AI Systems</a></li>
            </ul>
          </div>
          <div className="foot-col">
            <h5>Company</h5>
            <ul>
              <li><a href="#about">About Us</a></li>
              <li><a href="#process">Our Process</a></li>
              <li><a href="#contact">Contact</a></li>
              <li><a href="mailto:info@bizdynamix.co.za">info@bizdynamix.co.za</a></li>
            </ul>
          </div>
        </div>
        <div className="foot-bottom">
          <div className="foot-loc">Cape Town, South Africa</div>
          <div>© 2025 BizDynamix. All rights reserved.</div>
        </div>
      </footer>
    </>
  );
}
