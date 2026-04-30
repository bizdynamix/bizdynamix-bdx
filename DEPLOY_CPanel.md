# Deploying BDX to cPanel

## Option 1: Static HTML upload (recommended for cPanel)

If you only need the landing page, use the existing static `index.html`:

1. Open your cPanel file manager.
2. Navigate to `public_html` or the desired subfolder.
3. Upload `WEBSITES/BDX/index.html`.
4. If you have any assets or CSS files, upload them alongside it in the same folder.
5. Point your domain or subdomain to that folder.

This is the simplest and most compatible deployment for a standard cPanel hosting plan.

## Option 2: Next.js frontend on cPanel as a static export

The `next-app/` directory is a modern React app. Standard cPanel shared hosting usually cannot run the Next.js server directly, but you can export the frontend as static HTML.

### Steps

1. In `WEBSITES/BDX/next-app`, run:
   ```bash
   npm install
   npm run build
   npm run export
   ```
2. This creates an `out/` directory with static files.
3. Upload the contents of `out/` into `public_html`.

### Important

- The static export only works for the frontend UI.
- The built-in `/api/chat` endpoint will not run on static cPanel hosting.
- To keep an AI chatbot, you need a separate backend host or serverless endpoint that the frontend can call.

## AI chatbot on cPanel

Standard cPanel hosting usually cannot run Node/Express or other long-running backend services.

### Recommended setup

- Host the frontend on cPanel as static files.
- Host the backend chatbot API separately on a service that supports Node or serverless functions.
- Configure the Next.js frontend to call that external API, e.g. `https://api.yourdomain.com/chat`.

### If your cPanel supports Node apps

If your cPanel plan includes Node.js support, you may be able to deploy `next-app/` directly using the cPanel "Setup Node.js App" feature.

- Set the application root to `WEBSITES/BDX/next-app`.
- Install dependencies with `npm install`.
- Set the startup file to `npm run start` after building.

## What to upload now

For a quick cPanel publish, use:

- `WEBSITES/BDX/index.html`
- Any linked CSS/asset files if they exist

If you want the new Next.js site, export it to static and upload the `out/` contents.

## Notes

- `mert-backend/` is a separate Express API server and cannot be deployed to plain cPanel unless your hosting explicitly supports Node.
- If you want a truly reusable AI chatbot plug-in, keep the frontend static and run the chatbot backend on a dedicated Node host or serverless provider.
