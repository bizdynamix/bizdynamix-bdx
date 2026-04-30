# BDX Next.js App

This is the starter Next.js frontend for the BDX project.

## Setup

```bash
cd next-app
npm install
npm run dev
```

The app will run on `http://localhost:3000`.

## Structure

- `app/page.tsx` — landing page with the built-in chat UI
- `app/api/chat/route.ts` — starter AI chat endpoint
- `styles/globals.css` — Tailwind base styling

## Next steps

- Replace the `POST /api/chat` stub with a real AI integration or a remote backend request
- Connect this frontend to the MERT backend API for chatbot orchestration and persistence
