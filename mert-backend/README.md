# BDX MERT Backend

This is the starter Express backend for the BDX MERT stack.

## Setup

```bash
cd mert-backend
npm install
npm run dev
```

The backend will run on `http://localhost:4000` by default.

## API

- `GET /` — health/status
- `POST /api/chat` — placeholder AI chatbot endpoint

## Next steps

- Replace the stub response in `src/routes/chat.ts` with a real AI model integration.
- Use `AI_API_KEY` from `.env` when connecting to the model provider.
- Add persistence, session state, or database storage if you need conversational memory.
