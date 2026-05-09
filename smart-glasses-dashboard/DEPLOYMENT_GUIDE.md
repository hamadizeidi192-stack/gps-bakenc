# Deployment Guide

Guide to deploy the Smart Glasses GPS Dashboard to production.

## Pre-Deployment Checklist

- [ ] Backend API is production-ready
- [ ] Environment variables configured
- [ ] No sensitive data in code
- [ ] Build passes without errors
- [ ] Tested in production build locally
- [ ] SSL/HTTPS enabled on backend

## Local Production Build

### Build the Application

```bash
npm run build
```

Output:
```
✓ 1234 modules transformed
✓ built in 45.32s

dist/
├── index.html
├── assets/
│   ├── main.*.js
│   ├── main.*.css
│   └── index.*.js
```

### Test Production Build

```bash
npm run preview
```

Navigate to `http://localhost:4173` to verify everything works.

## Deployment Options

### Option 1: Vercel (Recommended for Beginners)

**Fastest and easiest deployment**

#### Prerequisites
- Vercel account ([vercel.com](https://vercel.com))
- GitHub account

#### Steps

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourname/repo
   git push -u origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Select your GitHub repository
   - Configure project settings

3. **Set Environment Variables**
   - In Vercel dashboard: Settings → Environment Variables
   - Add: `VITE_API_URL=https://your-api.com`

4. **Deploy**
   - Vercel automatically deploys on push to main
   - Your site is live at `your-project.vercel.app`

### Option 2: Netlify

**Simple and free hosting**

#### Steps

1. **Connect GitHub**
   - Go to [netlify.com](https://netlify.com)
   - Click "Add new site"
   - Select GitHub repository

2. **Configure Build Settings**
   - Build command: `npm run build`
   - Publish directory: `dist`

3. **Environment Variables**
   - In Netlify: Site settings → Build & deploy → Environment
   - Add: `VITE_API_URL=https://your-api.com`

4. **Deploy**
   - Netlify automatically deploys on push
   - Site available at `your-site.netlify.app`

### Option 3: GitHub Pages

**Free hosting for static sites**

1. **Edit package.json**
   ```json
   {
     "homepage": "https://username.github.io/repo-name"
   }
   ```

2. **Install gh-pages**
   ```bash
   npm install gh-pages --save-dev
   ```

3. **Add deploy scripts**
   ```json
   {
     "scripts": {
       "predeploy": "npm run build",
       "deploy": "gh-pages -d dist"
     }
   }
   ```

4. **Deploy**
   ```bash
   npm run deploy
   ```

### Option 4: Self-Hosted (Advanced)

**Full control over deployment**

#### Prerequisites
- Web server (Nginx, Apache)
- Linux server or Windows Server
- SSL certificate

#### Steps

1. **Build application**
   ```bash
   npm run build
   ```

2. **Copy dist folder to server**
   ```bash
   scp -r dist/ user@server:/var/www/glasses-dashboard/
   ```

3. **Configure Nginx**
   ```nginx
   server {
     listen 80;
     server_name your-domain.com;
     
     # Redirect to HTTPS
     return 301 https://$server_name$request_uri;
   }
   
   server {
     listen 443 ssl http2;
     server_name your-domain.com;
     
     # SSL certificates
     ssl_certificate /etc/ssl/certs/cert.pem;
     ssl_certificate_key /etc/ssl/private/key.pem;
     
     # Root directory
     root /var/www/glasses-dashboard/dist;
     
     # Single Page App routing
     location / {
       try_files $uri $uri/ /index.html;
     }
     
     # API proxy
     location /api/ {
       proxy_pass http://localhost:8000/;
       proxy_http_version 1.1;
       proxy_set_header Upgrade $http_upgrade;
       proxy_set_header Connection 'upgrade';
       proxy_set_header Host $host;
       proxy_cache_bypass $http_upgrade;
       proxy_set_header X-Real-IP $remote_addr;
       proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
       proxy_set_header X-Forwarded-Proto $scheme;
     }
     
     # Cache static assets
     location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
       expires 1y;
       add_header Cache-Control "public, immutable";
     }
   }
   ```

4. **Enable HTTPS with Let's Encrypt**
   ```bash
   sudo certbot certonly --webroot -w /var/www/glasses-dashboard/dist -d your-domain.com
   ```

## Environment Configuration

### Production Environment Variables

Create `.env.production`:

```env
VITE_API_URL=https://api.your-domain.com
VITE_POLLING_INTERVAL=5000
VITE_MAP_DEFAULT_LAT=36.8065
VITE_MAP_DEFAULT_LON=10.1815
```

### Backend CORS for Production

Update FastAPI backend:

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://your-frontend.com",
        "https://www.your-frontend.com",
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
    max_age=3600,
)
```

## Performance Optimization

### Enable Gzip Compression

Vercel/Netlify: Automatic

Nginx:
```nginx
gzip on;
gzip_types text/plain text/css text/xml application/json application/javascript;
gzip_min_length 1024;
```

### Add Cache Headers

```nginx
# Static assets - cache for 1 year
location ~* \.(js|css|png|jpg|gif|svg|woff)$ {
  expires 1y;
  add_header Cache-Control "public, immutable";
}

# HTML - don't cache
location / {
  expires -1;
  add_header Cache-Control "public, must-revalidate, proxy-revalidate";
}
```

### CDN Configuration

Use CloudFlare for automatic CDN:

1. Update nameservers to CloudFlare
2. In CloudFlare dashboard: Caching → Cache Level (Standard)
3. Security → HTTPS

## Monitoring

### Setup Error Tracking

Install Sentry:

```bash
npm install @sentry/react @sentry/tracing
```

Configure in `src/main.jsx`:

```javascript
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "https://your-key@sentry.io/project-id",
  environment: "production",
  tracesSampleRate: 0.1,
});
```

### Setup Analytics

Add Google Analytics:

```html
<!-- In index.html -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_ID');
</script>
```

## Continuous Integration/Deployment

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm install
      
      - name: Build
        run: npm run build
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          github-token: ${{ secrets.GITHUB_TOKEN }}
```

## Troubleshooting Deployment

### Issue: Blank page after deployment

**Cause**: React app not bundled correctly

**Solution**:
1. Check browser console (F12)
2. Verify `index.html` is served
3. Check build output size

```bash
npm run build
# Check dist/ folder contents
```

### Issue: API calls fail in production

**Cause**: CORS or API URL misconfigured

**Solution**:
1. Check `VITE_API_URL` environment variable
2. Verify backend CORS headers
3. Test API with curl:

```bash
curl -H "Origin: https://your-domain.com" https://api.your-domain.com/location
```

### Issue: Map tiles not loading

**Cause**: OpenStreetMap blocked or no internet

**Solution**:
1. Check internet connection
2. Use alternative tile provider
3. Cache tiles locally

### Issue: Slow performance

**Cause**: Large bundle size

**Solution**:
```bash
npm run build

# Analyze bundle
npm install --save-dev vite-plugin-visualizer

# Check sizes
du -sh dist/assets/*
```

## Security Checklist

- [ ] HTTPS enabled
- [ ] CSP headers configured
- [ ] XSS protection enabled
- [ ] CSRF tokens implemented
- [ ] Sensitive data not in frontend code
- [ ] API endpoints validated
- [ ] Rate limiting configured
- [ ] Input sanitization implemented

## Rollback Plan

If deployment fails:

### Vercel
```bash
vercel rollback
```

### Netlify
- Go to Deploys
- Click previous successful deployment
- Click "Publish deploy"

### Self-Hosted
```bash
cd /var/www/glasses-dashboard
git checkout previous-tag
npm run build
# Copy dist to production
```

## Post-Deployment

1. **Test functionality**
   - Verify all features work
   - Test on mobile
   - Check map loads

2. **Monitor performance**
   - Check load times
   - Monitor API responses
   - Watch error logs

3. **Collect feedback**
   - User testing
   - Performance metrics
   - Error tracking

## Deployment Comparison

| Platform | Cost | Setup | Speed | Scalability |
|----------|------|-------|-------|-------------|
| Vercel | Free/Paid | ⭐ Easy | ⭐⭐ Fast | ⭐⭐⭐ Great |
| Netlify | Free/Paid | ⭐ Easy | ⭐⭐ Fast | ⭐⭐⭐ Great |
| GitHub Pages | Free | ⭐⭐ Moderate | ⭐⭐ Good | ⭐⭐ Limited |
| Self-Hosted | Paid | ⭐⭐⭐ Complex | ⭐⭐⭐ Variable | ⭐⭐⭐ Full |

## Next Steps

- [x] Deploy to production
- [ ] Setup monitoring
- [ ] Configure CI/CD
- [ ] Plan scaling strategy
- [ ] Setup backup procedures

---

**Deployment complete! 🚀**
