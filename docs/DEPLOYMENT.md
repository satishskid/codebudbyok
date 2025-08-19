# Code Buddy - Deployment Guide

## Overview

This guide covers deploying Code Buddy to various hosting platforms. The application is a static React build that can be deployed to any static hosting service.

## Table of Contents
1. [Build Process](#build-process)
2. [Netlify Deployment](#netlify-deployment)
3. [Vercel Deployment](#vercel-deployment)
4. [GitHub Pages](#github-pages)
5. [Custom Server Deployment](#custom-server-deployment)
6. [Environment Configuration](#environment-configuration)
7. [Post-Deployment Setup](#post-deployment-setup)
8. [Monitoring and Maintenance](#monitoring-and-maintenance)

---

## Build Process

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager
- Git repository access

### Local Build
```bash
# Clone repository
git clone https://github.com/satishskid/codebudbyok.git
cd codebudbyok

# Install dependencies
npm install

# Build for production
npm run build

# Preview build locally
npm run preview
```

### Build Output
The build process creates a `dist` folder containing:
```
dist/
├── index.html          # Main HTML file
├── assets/
│   ├── index-[hash].js    # JavaScript bundle
│   ├── index-[hash].css   # CSS bundle
│   └── favicon.svg        # Favicon
└── skids-logo.svg      # Logo file
```

---

## Netlify Deployment

### Method 1: Git Integration (Recommended)

1. **Connect Repository**
   - Log in to [Netlify](https://netlify.com)
   - Click "New site from Git"
   - Connect your GitHub account
   - Select the `codebudbyok` repository

2. **Configure Build Settings**
   ```
   Build command: npm run build
   Publish directory: dist
   ```

3. **Deploy**
   - Click "Deploy site"
   - Netlify will automatically build and deploy
   - Get your deployment URL (e.g., `https://amazing-name-123456.netlify.app`)

### Method 2: Manual Deploy

1. **Build Locally**
   ```bash
   npm run build
   ```

2. **Deploy via Netlify CLI**
   ```bash
   # Install Netlify CLI
   npm install -g netlify-cli

   # Login to Netlify
   netlify login

   # Deploy
   netlify deploy --prod --dir=dist
   ```

3. **Deploy via Web Interface**
   - Go to Netlify dashboard
   - Drag and drop the `dist` folder

### Netlify Configuration

Create `netlify.toml` in project root:
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[build.environment]
  NODE_VERSION = "18"
```

---

## Vercel Deployment

### Method 1: Git Integration

1. **Connect Repository**
   - Log in to [Vercel](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository

2. **Configure Settings**
   ```
   Framework Preset: Vite
   Build Command: npm run build
   Output Directory: dist
   Install Command: npm install
   ```

3. **Deploy**
   - Click "Deploy"
   - Get your deployment URL (e.g., `https://codebudbyok.vercel.app`)

### Method 2: Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

### Vercel Configuration

Create `vercel.json` in project root:
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

---

## GitHub Pages

### Setup GitHub Actions

Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout
      uses: actions/checkout@v3
      
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Build
      run: npm run build
      
    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./dist
```

### Enable GitHub Pages
1. Go to repository Settings
2. Navigate to Pages section
3. Select "Deploy from a branch"
4. Choose `gh-pages` branch
5. Save settings

---

## Custom Server Deployment

### Nginx Configuration

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/codebuddy/dist;
    index index.html;

    # Handle client-side routing
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' https:; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';" always;
}
```

### Apache Configuration

Create `.htaccess` in the `dist` folder:
```apache
RewriteEngine On
RewriteBase /

# Handle client-side routing
RewriteRule ^index\.html$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]

# Cache static assets
<FilesMatch "\.(css|js|png|jpg|jpeg|gif|svg|ico)$">
    ExpiresActive On
    ExpiresDefault "access plus 1 year"
</FilesMatch>

# Security headers
Header always set X-Frame-Options "SAMEORIGIN"
Header always set X-Content-Type-Options "nosniff"
Header always set Referrer-Policy "no-referrer-when-downgrade"
```

### Docker Deployment

Create `Dockerfile`:
```dockerfile
# Build stage
FROM node:18-alpine as build

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built assets
COPY --from=build /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

Create `docker-compose.yml`:
```yaml
version: '3.8'

services:
  codebuddy:
    build: .
    ports:
      - "80:80"
    restart: unless-stopped
```

Deploy with Docker:
```bash
# Build and run
docker-compose up -d

# Or build and run manually
docker build -t codebuddy .
docker run -d -p 80:80 codebuddy
```

---

## Environment Configuration

### Build-time Configuration

Update `vite.config.ts` for environment-specific builds:
```typescript
import { defineConfig, loadEnv } from 'vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  
  return {
    plugins: [tailwindcss()],
    define: {
      'process.env': {
        NODE_ENV: JSON.stringify(mode),
        VERSION: JSON.stringify(process.env.npm_package_version),
      }
    },
    build: {
      target: 'esnext',
      minify: 'terser',
      sourcemap: mode === 'development'
    }
  };
});
```

### Runtime Configuration

For different environments, you can create configuration files:

`public/config.js`:
```javascript
window.APP_CONFIG = {
  environment: 'production',
  apiEndpoint: 'https://api.example.com',
  features: {
    analytics: true,
    debugging: false
  }
};
```

Load in `index.html`:
```html
<script src="/config.js"></script>
```

---

## Post-Deployment Setup

### SSL Certificate

#### Netlify/Vercel
- SSL is automatically provided
- Custom domains get free SSL certificates

#### Custom Server
```bash
# Using Let's Encrypt with Certbot
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

### Custom Domain Setup

#### Netlify
1. Go to Site settings → Domain management
2. Add custom domain
3. Update DNS records:
   ```
   Type: CNAME
   Name: www
   Value: your-site.netlify.app
   ```

#### Vercel
1. Go to Project settings → Domains
2. Add domain
3. Update DNS records as instructed

### Performance Optimization

#### CDN Configuration
```javascript
// Add to index.html for CDN assets
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://cdn.jsdelivr.net">
```

#### Compression
Most hosting platforms enable gzip/brotli automatically. For custom servers:

```nginx
# Nginx gzip configuration
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
```

---

## Monitoring and Maintenance

### Health Checks

Create a simple health check endpoint by adding to `public/health.json`:
```json
{
  "status": "healthy",
  "version": "1.0.0",
  "timestamp": "2025-01-01T00:00:00Z"
}
```

### Analytics Integration

#### Google Analytics
Add to `index.html`:
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

#### Netlify Analytics
- Enable in Netlify dashboard
- Provides server-side analytics without JavaScript

### Error Monitoring

#### Sentry Integration
```bash
npm install @sentry/react @sentry/tracing
```

Add to `main.tsx`:
```typescript
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "YOUR_SENTRY_DSN",
  environment: process.env.NODE_ENV,
});
```

### Uptime Monitoring

#### Simple Monitoring Script
```bash
#!/bin/bash
# monitor.sh
URL="https://your-domain.com/health.json"
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" $URL)

if [ $RESPONSE -eq 200 ]; then
    echo "Site is up"
else
    echo "Site is down - HTTP $RESPONSE"
    # Send alert (email, Slack, etc.)
fi
```

Run with cron:
```bash
# Check every 5 minutes
*/5 * * * * /path/to/monitor.sh
```

### Backup Strategy

#### Git-based Backup
- Code is backed up in Git repository
- Deployment configurations in version control

#### Database Backup (Future)
When database integration is added:
```bash
# Example backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
pg_dump codebuddy > backup_$DATE.sql
aws s3 cp backup_$DATE.sql s3://backups/codebuddy/
```

---

## Troubleshooting

### Common Deployment Issues

#### Build Failures
```bash
# Clear cache and rebuild
rm -rf node_modules package-lock.json
npm install
npm run build
```

#### Routing Issues
- Ensure SPA routing is configured
- Check for proper redirects to `index.html`

#### Asset Loading Issues
- Verify base URL configuration
- Check for CORS issues with external resources

#### Performance Issues
- Enable compression
- Optimize images and assets
- Use CDN for static resources

### Debugging Production Issues

#### Enable Source Maps
```typescript
// vite.config.ts
export default defineConfig({
  build: {
    sourcemap: true
  }
});
```

#### Console Logging
```typescript
// Add debug logging
if (process.env.NODE_ENV === 'development') {
  console.log('Debug info:', data);
}
```

#### Network Monitoring
- Use browser dev tools Network tab
- Monitor API response times
- Check for failed requests

---

## Security Considerations

### Content Security Policy
```html
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  font-src 'self' https://fonts.gstatic.com;
  img-src 'self' data: https:;
  connect-src 'self' https://generativelanguage.googleapis.com;
">
```

### Security Headers
```nginx
# Nginx security headers
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
```

### API Key Security
- Never commit API keys to version control
- Use environment variables for sensitive data
- Implement proper key rotation procedures

---

## Scaling Considerations

### CDN Integration
- Use CDN for static assets
- Configure proper cache headers
- Implement cache invalidation strategy

### Load Balancing
```nginx
# Nginx load balancing
upstream codebuddy {
    server 127.0.0.1:3001;
    server 127.0.0.1:3002;
    server 127.0.0.1:3003;
}

server {
    location / {
        proxy_pass http://codebuddy;
    }
}
```

### Database Scaling (Future)
- Read replicas for better performance
- Connection pooling
- Query optimization

---

## Maintenance Procedures

### Regular Updates
```bash
# Update dependencies
npm update
npm audit fix

# Test updates
npm run build
npm run preview

# Deploy updates
git add .
git commit -m "Update dependencies"
git push origin main
```

### Monitoring Checklist
- [ ] Site accessibility
- [ ] API response times
- [ ] Error rates
- [ ] SSL certificate expiry
- [ ] Domain renewal
- [ ] Dependency vulnerabilities

### Backup Verification
- [ ] Test restore procedures
- [ ] Verify backup integrity
- [ ] Document recovery steps

---

*Last updated: January 2025*