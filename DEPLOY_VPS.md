# Deploy BDX to a VPS and point the domain

Yes — you can move the site to your VPS and point `www.bizdynamix.co.za` there. The VPS is the right place for the full Next.js + MERT stack and the AI backend, unlike cPanel shared hosting.

> Important: keep the BDX deployment completely separate from the existing `PROPWISE` deployment. Do not reuse `/opt/prop24scraper`, `propwise-dashboard`, or any PROPWISE nginx/systemd config. Use a dedicated web root and dedicated service names for the new site.

## Recommended architecture

- Host the Next.js frontend on the VPS
- Host the Express MERT backend on the same VPS
- Use `nginx` as a reverse proxy
- Point your domain A record to the VPS public IP

## What you need on the VPS

- SSH access
- Node.js 20+ installed
- npm installed
- `nginx` installed
- Optional: `pm2` or a `systemd` service for process management

## Keep the BDX deployment isolated

- Use a dedicated application root such as `/var/www/bizdynamix` or `/srv/bizdynamix`
- Do not deploy anything into `/opt/prop24scraper`, `/var/www/propwise`, or any existing PROPWISE directory
- Use distinct systemd service names such as `bdx-mert-backend.service`
- Use a distinct nginx site config such as `/etc/nginx/sites-available/bdx`
- Keep logs separate, e.g. `/var/log/bdx-nginx-access.log`, `/var/log/bdx-nginx-error.log`

## Deploy steps

### 1. Copy the project to the VPS

From your local machine:

```bash
cd /Users/edwinbrooks/Projects/WEBSITES/BDX
rsync -avz --exclude node_modules --exclude .next --exclude dist --exclude out next-app mert-backend README.md DEPLOY_VPS.md root@YOUR_VPS_IP:/var/www/bdx
```

Or use `git clone` on the VPS if the repo is available remotely.

### 2. Install dependencies

On the VPS:

```bash
cd /var/www/bdx/next-app
npm install
cd /var/www/bdx/mert-backend
npm install
```

### 3. Build the frontend and backend

#### Next.js frontend

```bash
cd /var/www/bdx/next-app
npm run build
```

#### MERT backend

```bash
cd /var/www/bdx/mert-backend
npm run build
```

### 4. Run the backend

Use one of these options:

#### Option A: `pm2`

```bash
cd /var/www/bdx/mert-backend
npm install -g pm2
pm2 start dist/server.js --name bdx-mert-backend
pm2 save
```

#### Option B: `systemd`

Create `/etc/systemd/system/bdx-mert-backend.service`:

```ini
[Unit]
Description=BDX MERT Backend
After=network.target

[Service]
Type=simple
WorkingDirectory=/var/www/bdx/mert-backend
ExecStart=/usr/bin/node /var/www/bdx/mert-backend/dist/server.js
Restart=always
RestartSec=5
Environment=NODE_ENV=production
Environment=PORT=4000

[Install]
WantedBy=multi-user.target
```

Then enable and start:

```bash
sudo systemctl daemon-reload
sudo systemctl enable bdx-mert-backend
sudo systemctl start bdx-mert-backend
```

### 5. Serve the frontend with Nginx

Create an Nginx site config like `/etc/nginx/sites-available/bdx`:

```nginx
server {
  listen 80;
  server_name bizdynamix.co.za www.bizdynamix.co.za;

  root /var/www/bdx/next-app/.next/standalone; # if using Next.js server mode
  index index.html;

  location /api/ {
    proxy_pass http://127.0.0.1:4000/api/;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }

  location / {
    try_files $uri $uri/ /index.html;
  }
}
```

> Note: If you prefer a pure static export, generate `out/` from the Next.js app and point `root` to that folder instead.

Enable the config and reload Nginx:

```bash
sudo ln -s /etc/nginx/sites-available/bdx /etc/nginx/sites-enabled/bdx
sudo nginx -t
sudo systemctl reload nginx
```

### 6. Point DNS to the VPS

Set your domain DNS records at your registrar or DNS provider:

- `A` record for `bizdynamix.co.za` → `YOUR_VPS_IP`
- `A` record for `www` → `YOUR_VPS_IP`

Wait for DNS propagation.

### 7. Add HTTPS

Use Certbot to get TLS certificates:

```bash
sudo apt update
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d bizdynamix.co.za -d www.bizdynamix.co.za
```

## Notes

- If you only want a static site, you can serve `next-app/out` from Nginx and skip the backend on cPanel/VPS.
- For the full AI chatbot, keep both `next-app` and `mert-backend` running on the VPS.
- If the Next.js frontend calls the backend from the browser, make sure the API route uses the correct public endpoint.

## Quick answer

Yes — move the project to your VPS, run the frontend and backend there, and update DNS so `www.bizdynamix.co.za` points to the VPS IP.
