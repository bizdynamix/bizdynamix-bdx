# BizDynamix Chat API Deployment Guide

## Overview
The chatbot now uses **OpenAI GPT-3.5-turbo** instead of keyword matching. The system consists of:
- **Frontend**: Single-page `index.html` with chat widget
- **Backend**: Node.js/Express server at `mert-backend/` running on port 4000
- **Proxy**: Nginx forwards `/api/chat` → `localhost:4000`

## Setup Steps

### 1. Get OpenAI API Key

Choose one of these options:

#### Option A: Use Your Copilot Subscription
If you have an Azure/Copilot subscription, get your API key from:
- **Azure OpenAI**: https://portal.azure.com → find your resource → API Keys → copy key
- **Use as**: `OPENAI_API_KEY=your-azure-key-here`
- **Note**: May require different endpoint; see Azure docs

#### Option B: Use OpenAI Direct
1. Go to https://platform.openai.com/account/api-keys
2. Create a new API key
3. Copy and save securely

### 2. Update .env on VPS

```bash
ssh root@154.66.198.46

# Edit the .env file in mert-backend directory
nano /var/www/bizdynamix/mert-backend/.env
```

Add:
```
PORT=4000
OPENAI_API_KEY=sk-xxxxxxxxxxxxx
```

Save and exit (Ctrl+X, Y, Enter)

### 3. Install Dependencies & Build

```bash
cd /var/www/bizdynamix/mert-backend

# Install new openai package
npm install

# Build TypeScript
npm run build
```

### 4. Update Nginx Config

Add the proxy block to your nginx server config for `bizdynamix.co.za`:

```bash
# Find the nginx config
sudo find /etc/nginx -name "*.conf" | grep bizdynamix

# Or edit the main nginx file
sudo nano /etc/nginx/sites-available/bizdynamix.co.za
```

Add this inside the `server { }` block:
```nginx
location /api/chat {
  proxy_pass http://localhost:4000/api/chat;
  proxy_http_version 1.1;
  proxy_set_header Host $host;
  proxy_set_header X-Real-IP $remote_addr;
  proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
  proxy_set_header X-Forwarded-Proto $scheme;
  proxy_read_timeout 60s;
}
```

### 5. Restart Services

```bash
# Restart nginx
sudo systemctl restart nginx

# Start/restart the mert-backend with PM2
cd /var/www/bizdynamix/mert-backend
pm2 start "npm start" --name bdx-api

# Or if it already exists
pm2 restart bdx-api

# Verify it's running
pm2 list
pm2 logs bdx-api
```

### 6. Test the Chat

1. Visit https://bizdynamix.co.za
2. Click the chat button
3. Ask a question like "Tell me about your web design services"
4. The bot should respond using OpenAI

## Frontend Changes

- **Hidden cards**: Business Automation & AI Systems service cards are hidden (CSS `display:none`)
- **Chat function**: Now makes async POST requests to `/api/chat`
- **Response field**: Expects `{ reply: string }` from the API

## Troubleshooting

**Chat returns "I'm having trouble connecting"**:
- Check if mert-backend is running: `pm2 logs bdx-api`
- Check nginx is proxying: `sudo curl http://localhost:4000/api/chat -X POST -d '{"message":"test"}'`
- Check OpenAI API key is valid and has credits

**PM2 shows "errored" status**:
- Check logs: `pm2 logs bdx-api --lines 100`
- Verify `.env` file exists with correct key
- Ensure npm install completed successfully

**CORS errors in browser console**:
- Verify nginx proxy headers include CORS (already in config)
- Check CORS is enabled in Express (it is in server.ts)

## Costs

- **OpenAI**: ~$0.50-2 per 1M tokens (depending on model; gpt-3.5-turbo is cheapest)
- **Typical chat**: ~100-200 tokens per exchange = very low cost
- **Recommendation**: Set usage limits/alerts in OpenAI dashboard

## Next Steps

- **Monitor costs**: https://platform.openai.com/account/billing/usage
- **Improve prompts**: Edit the system prompt in `mert-backend/src/routes/chat.ts` to customize bot personality
- **Switch models**: Change `"gpt-3.5-turbo"` to `"gpt-4"` for better responses (higher cost)
- **Add context**: Store conversation history to provide more intelligent responses
