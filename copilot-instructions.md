# BizDynamix — Copilot Instructions

## Project Overview
This is the main marketing and contact website for **BizDynamix**, a Cape Town-based digital agency serving South African small businesses. The site is **plain HTML/CSS/JS** hosted on a cPanel server with PHP mail available. There is no framework, no build step, no npm. Do not suggest React, Vue, Next.js, or any bundler unless explicitly asked.

---

## Stack — Non-Negotiables

| Layer       | Technology                          |
|-------------|-------------------------------------|
| Markup      | Vanilla HTML5                       |
| Styling     | Vanilla CSS (CSS custom properties) |
| Behaviour   | Vanilla JS (ES6+, no jQuery)        |
| Backend     | PHP 8.x (`mail()` / PHPMailer)      |
| Hosting     | cPanel shared hosting               |
| Fonts       | Google Fonts (Syne + DM Sans)       |
| No bundler  | No Webpack, Vite, Parcel, etc.      |

---

## Design Tokens — Always Use These

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

## Contact Form — How It Works

The modal form in `index.html` posts to `/contact.php` via `fetch()` using `application/x-www-form-urlencoded`. Fields: `name`, `email`, `service`, `mobile`, `message`.

`contact.php` handles:
1. Input sanitisation (`strip_tags`, `filter_var`)
2. Internal HTML email → `info@bizdynamix.co.za`
3. Client auto-reply HTML email → visitor's email address
4. Returns `{ success: true|false }` as JSON

**Never replace this with a third-party form service** (Formspree, Netlify Forms, etc.) unless explicitly instructed. The server has `mail()` available.

---

## Copilot Behaviour Rules

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

## Brand & Copy Voice

BizDynamix targets South African small business owners and entrepreneurs. The tone is:
- **Direct** — no filler, no corporate waffle
- **Confident without arrogance** — earned authority, not posturing
- **Local** — references to South Africa, Cape Town, and the local business context are appropriate
- **Action-oriented** — every section should have a clear next step

Do not use phrases like "cutting-edge", "synergy", "leverage", "unlock your potential", or any generic agency clichés.

---

## Email Templates

Both emails in `contact.php` are HTML. The internal notification uses the dark theme (`#09090f` background). The client auto-reply uses a light theme (`#ffffff` body). Both use inline CSS only — no `<style>` blocks — for maximum email client compatibility.

The client auto-reply links to `https://www.bizdynamix.co.za/portfolio.html` as the soft upsell destination.

---

## Deployment

Upload files directly via cPanel File Manager or FTP to `public_html/`. No CI/CD pipeline exists. There is no staging environment — test locally, then deploy.

When suggesting PHP, always assume PHP 8.x on a shared cPanel host. Do not use features that require CLI access, Composer, or root privileges.

---

## Out of Scope for This Project

The following are separate projects on the same developer's workstation and should not be confused with this codebase:

- `logic-realty` — `logicrealty.co.za` (PHP/MySQL rental platform)
- `sc-translation-tracker` — Seed Company client project
- `bizdynamix-vps-dev` — VPS infrastructure work (separate from this site)
- `tsco-integrations` — Monday.com integrations
- `monday-sharepoint-migration` — SharePoint migration project

If a file or reference from those projects appears in context, flag it rather than assuming it belongs here.
