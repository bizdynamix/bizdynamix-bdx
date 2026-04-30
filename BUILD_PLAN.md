# BDX Site Build Plan

## Project scan: Projects workspace

Relevant resources found in `/Users/edwinbrooks/Projects`:

- `AGENTS.md`
  - Central project index and conventions for this multi-project workspace.
  - Useful for understanding the current owner’s preferred workflow, git conventions, and deployment notes.
- `AGENTSKILLS/`
  - `frontend-website.skill`
    - Best fit for this site: frontend HTML/CSS/JS, Tailwind, responsive layout, screenshot-driven design matching.
    - Key rules: serve from localhost, use Tailwind via CDN by default, prefer inline/static `index.html` output unless asked for app structure.
  - `wat-framework.skill`
    - Useful if this project evolves into a more structured workspace with `tools/`, `workflows/`, or `.tmp/`.
    - Encourages deterministic execution and separation of tasks from code generation.
  - `audio-transcribe.skill`
    - Not directly relevant for this site build, unless audio transcription features are added later.

## Recommended approach for this site

The current workspace is a simple static site with only `index.html`. For a quick landing page, keep the build simple and static.

If the goal is to grow this into a full app or modern frontend stack, choose one of these two directions:

### 1. MERT stack plan

Use this when the site needs a traditional full-stack architecture with a separate backend and React frontend.

- Backend:
  - MongoDB for data storage
  - Express for API routing and backend logic
  - Node.js runtime
- Frontend:
  - React for component-based UI
  - TypeScript for safer code and better editor support
  - Tailwind CSS for fast styling and responsive layout
- Folder structure:
  - `/backend`
    - `package.json`, `tsconfig.json`, `server.ts` or `app.ts`
    - `src/routes`, `src/models`, `src/controllers`
  - `/frontend`
    - `package.json`, `tsconfig.json`, `tailwind.config.js`
    - `src/App.tsx`, `src/components`, `src/styles`
- Core features:
  - REST API endpoints in Express for data/content management
  - React app consuming backend APIs
  - Shared environment variables via `.env` files
  - Use Mongoose or Prisma for MongoDB access
- Build/serve:
  - `npm run dev` for frontend and backend concurrently
  - Optionally use `concurrently` or a simple proxy for dev flow

### 2. Next.js stack plan

Use this when the site should be built as a modern React app with server-rendering, static generation, and built-in API routes.

- App type:
  - `next` with TypeScript
  - `tailwindcss`
- Project structure:
  - `/pages` or `/app` router
  - `/styles/globals.css`
  - `/public` for images and static assets
  - `/pages/api` or `/app/api` for backend endpoints
- Data strategy:
  - Static content pages: `getStaticProps` / `generateStaticParams`
  - Dynamic or user-driven content: `getServerSideProps` / server components
  - API endpoints for form submission, content, or data storage
- Deployment:
  - Vercel or any Node-compatible host
  - Environment variables in Vercel/dashboard or local `.env.local`
- Benefits:
  - Fast page loads with SSG/ISR
  - Built-in image optimization and routing
  - One repository for frontend + API

## Notes

- If `BDX` remains a simple marketing page, keep it as static `index.html` and only move to React/Next.js when more interactive features are needed.
- If you want a fast proof-of-concept, the `frontend-website` skill is the best fit.
- If the site should grow into a product with backend data, use MERT for a classic split or Next.js for a more modern integrated stack.
