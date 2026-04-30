# BDX Isolated VPS Deployment

This is a separate deployment space for the `bizdynamix` site on your VPS.

## Principles

- Keep BDX fully isolated from the existing PROPWISE deployment.
- Do not reuse PROPWISE directories, service names, or nginx configs.
- Use dedicated paths, ports, and named services for BDX.

## Recommended directories

- Application root: `/var/www/bizdynamix`
- Frontend app: `/var/www/bizdynamix/next-app`
- Backend app: `/var/www/bizdynamix/mert-backend`
- Logs: `/var/log/bdx/`
- Nginx site config: `/etc/nginx/sites-available/bdx`
- Nginx symlink: `/etc/nginx/sites-enabled/bdx`

## Recommended service names

- `bdx-mert-backend.service`
- `bdx-mert-backend.timer` (if needed)

## Recommended ports

- Frontend: 3000 (for local Next.js dev/server)
- Backend: 4000 (Express API)
- Nginx: 80 / 443

## High-level steps

1. Copy `WEBSITES/BDX` to the VPS under `/var/www/bizdynamix`.
2. Install Node and npm in the VPS environment.
3. Install frontend and backend dependencies inside their respective folders.
4. Build the Next.js frontend and backend.
5. Run the backend with `pm2` or `systemd` using the `bdx-mert-backend` service name.
6. Create a dedicated Nginx config for `bizdynamix.co.za`.
7. Reload Nginx and verify the new site is reachable without touching PROPWISE.

## Do not do

- Do not use `/opt/prop24scraper` for BDX.
- Do not copy PROPWISE `.service`, `.timer`, or `nginx` files.
- Do not use PROPWISE ports such as 5000 unless explicitly reserved for PROPWISE.

## Reference

See `DEPLOY_VPS.md` for the full deployment commands and expected workflow.
