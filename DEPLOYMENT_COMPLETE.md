# BizDynamix VPS Deployment — Final Steps

## ✅ COMPLETED

**Website Files Deployed to VPS (154.66.198.46):**
- ✅ index.html (BizDynamix marketing site)
- ✅ portfolio.html (3 case studies)
- ✅ contact.php (email handler)
- ✅ api-proxy.php (API gateway)

**Backend Services Running:**
- ✅ Node.js API on port 4000 (OpenAI chat integration)
- ✅ nginx web server on port 80 & 443
- ✅ PM2 process manager (bdx-api)

**Nginx Configuration:**
- ✅ BizDynamix: `/var/www/bizdynamix/public_html`
- ✅ Logic Realty: `/var/www/logicrealty/public_html`
- ✅ Chat API proxy: `/api/chat` → localhost:4000
- ✅ HTTP → HTTPS redirect configured

**OpenAI Integration:**
- ✅ API key updated and validated
- ✅ Chat endpoint responding with GPT-3.5-turbo
- ✅ Backup stored in `.env.backup` (gitignored)

---

## 🔴 NEXT STEPS — Update DNS Records

You must update your DNS A records to point to the VPS:

### Domain Records to Update:

| Domain | Type | Target IP | TTL |
|--------|------|-----------|-----|
| bizdynamix.co.za | A | 154.66.198.46 | 3600 |
| www.bizdynamix.co.za | A | 154.66.198.46 | 3600 |
| logicrealty.co.za | A | 154.66.198.46 | 3600 |
| www.logicrealty.co.za | A | 154.66.198.46 | 3600 |

**Where to update:**
- Your domain registrar's DNS management panel
- Or cPanel DNS Zone Editor
- Or your current DNS provider

---

## 🔐 SSL/TLS Status

**Current:** Temporary certificates (using logicrealty.co.za cert)

**After DNS propagates (5-30 minutes):**
1. Domains will resolve to VPS IP
2. Run this command to generate proper Let's Encrypt certificates:

```bash
ssh root@154.66.198.46 "certbot certonly --nginx \
  -d bizdynamix.co.za -d www.bizdynamix.co.za \
  -d logicrealty.co.za -d www.logicrealty.co.za \
  --non-interactive --agree-tos -m admin@bizdynamix.co.za"
```

3. Then restart nginx:
```bash
ssh root@154.66.198.46 "systemctl restart nginx"
```

---

## 📋 VPS Services Status

```bash
# Check all services
ssh root@154.66.198.46 "pm2 list && systemctl status nginx"

# Check chat API
curl -X POST http://154.66.198.46/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"test"}'
```

---

## 💾 Important Files

**Local (Git tracked):**
- `/Users/edwinbrooks/Projects/WEBSITES/BDX/index.html`
- `/Users/edwinbrooks/Projects/WEBSITES/BDX/portfolio.html`
- `/Users/edwinbrooks/Projects/WEBSITES/BDX/contact.php`
- `/Users/edwinbrooks/Projects/WEBSITES/BDX/api-proxy.php`

**VPS Production:**
- `/var/www/bizdynamix/public_html/`
- `/var/www/bizdynamix/mert-backend/` (Node.js API)

**Backup:**
- `.env.backup` (contains OpenAI API key history)

---

## ✨ Once DNS Points Here:

✅ Both websites fully functional with proper HTTPS  
✅ Chat widget works on BizDynamix  
✅ Contact form submits successfully  
✅ All traffic encrypted with Let's Encrypt certificates  
✅ Auto-renewal of certificates (built into Certbot)

---

**Status:** 🟢 Ready for DNS update
