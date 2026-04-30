# BDX Starter Project

This folder contains a starter Next.js frontend and a separate MERT backend.

## Structure

- `next-app/` — Next.js frontend with Tailwind CSS and a built-in chat experience.
- `mert-backend/` — Express + TypeScript backend with a placeholder AI chatbot endpoint.

## Run locally

Frontend:
```bash
cd next-app
npm install
npm run dev
```

Backend:
```bash
cd mert-backend
npm install
npm run dev
```

## Purpose

The `next-app` UI is designed to be plug-and-play for other websites and clients, while `mert-backend` provides a separate API layer for AI chatbot orchestration. Replace the stub chat handlers with your model or RAG workflow when ready.
