# Deployment Guide - InternFair

## 🚀 Deploying to GitHub & Hosting Options

This guide covers deploying InternFair to GitHub and various hosting platforms.

---

## 📋 Prerequisites

- GitHub account
- Git installed locally
- Project running successfully locally

---

## 🔧 Step 1: Prepare for Deployment

### Update Environment Variables

**Backend (.env):**
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=your_production_mongodb_uri
JWT_SECRET=your_super_secure_jwt_secret_change_this
CORS_ORIGIN=your_frontend_url
```

**Frontend:**
Create `.env` file in frontend directory:
```env
REACT_APP_API_URL=your_backend_api_url
```

---

## 📦 Step 2: Push to GitHub

### Initialize Git Repository (Already Done)
```bash
git init
```

### Add All Files
```bash
git add .
```

### Commit Changes
```bash
git commit -m "Initial commit: InternFair Scholarship Platform"
```

### Create GitHub Repository
1. Go to https://github.com/new
2. Repository name: `internfair-scholarship-platform`
3. Description: "AI-powered scholarship finder with intelligent matching"
4. Choose Public or Private
5. **DO NOT** initialize with README (we already have one)
6. Click "Create repository"

### Connect and Push
```bash
# Replace YOUR_USERNAME with your GitHub username
git remote add origin https://github.com/YOUR_USERNAME/internfair-scholarship-platform.git
git branch -M main
git push -u origin main
```

---

## 🌐 Hosting Options

### Option 1: Vercel (Frontend) + Railway/Render (Backend) [RECOMMENDED]

#### **Frontend on Vercel**

1. **Install Vercel CLI:**
```bash
npm install -g vercel
```

2. **Deploy Frontend:**
```bash
cd frontend
vercel
```

3. **Configure:**
   - Follow prompts
   - Set environment variable: `REACT_APP_API_URL`
   - Production URL will be provided

#### **Backend on Railway**

1. Go to https://railway.app
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Choose `backend` folder as root directory
5. Add environment variables:
   - `MONGODB_URI` (use MongoDB Atlas)
   - `JWT_SECRET`
   - `CORS_ORIGIN` (your Vercel frontend URL)
   - `NODE_ENV=production`
6. Deploy!

#### **Database on MongoDB Atlas**

1. Go to https://www.mongodb.com/cloud/atlas
2. Create free cluster
3. Create database user
4. Whitelist IP (0.0.0.0/0 for all)
5. Get connection string
6. Update `MONGODB_URI` in Railway

---

### Option 2: Heroku (Full Stack)

#### **Prepare for Heroku:**

Create `Procfile` in root:
```
web: cd backend && npm start
```

Create `package.json` in root:
```json
{
  "name": "internfair",
  "version": "1.0.0",
  "scripts": {
    "install-backend": "cd backend && npm install",
    "install-frontend": "cd frontend && npm install",
    "build-frontend": "cd frontend && npm run build",
    "start": "cd backend && npm start",
    "heroku-postbuild": "npm run install-backend && npm run install-frontend && npm run build-frontend"
  }
}
```

#### **Deploy to Heroku:**

```bash
# Install Heroku CLI
# Download from: https://devcenter.heroku.com/articles/heroku-cli

# Login
heroku login

# Create app
heroku create internfair-app

# Add MongoDB addon
heroku addons:create mongolab:sandbox

# Set environment variables
heroku config:set JWT_SECRET=your_secret
heroku config:set NODE_ENV=production

# Deploy
git push heroku main

# Open app
heroku open
```

---

### Option 3: Netlify (Frontend) + Render (Backend)

#### **Frontend on Netlify:**

1. Go to https://netlify.com
2. Click "Add new site" → "Import an existing project"
3. Connect to GitHub
4. Select repository
5. Configure:
   - Base directory: `frontend`
   - Build command: `npm run build`
   - Publish directory: `frontend/build`
6. Add environment variable: `REACT_APP_API_URL`
7. Deploy!

#### **Backend on Render:**

1. Go to https://render.com
2. Click "New" → "Web Service"
3. Connect GitHub repository
4. Configure:
   - Name: internfair-backend
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `npm start`
5. Add environment variables
6. Deploy!

---

### Option 4: AWS (Advanced)

#### **Frontend on S3 + CloudFront:**
- Upload build files to S3 bucket
- Enable static website hosting
- Configure CloudFront for CDN

#### **Backend on EC2 or Elastic Beanstalk:**
- Deploy Node.js application
- Configure security groups
- Set up load balancer

#### **Database on MongoDB Atlas or DocumentDB**

---

## 🔒 Security Checklist for Production

- [ ] Change JWT_SECRET to strong random string
- [ ] Use environment variables (never commit secrets)
- [ ] Enable HTTPS/SSL
- [ ] Configure CORS properly
- [ ] Set up rate limiting
- [ ] Enable MongoDB authentication
- [ ] Use strong database passwords
- [ ] Set up monitoring and logging
- [ ] Configure backup strategy
- [ ] Enable security headers

---

## 📊 Post-Deployment Steps

### 1. Populate Production Database
```bash
# SSH into your backend server or use Railway/Render shell
npm run scrape
```

### 2. Test the Application
- Register a test account
- Verify recommendations work
- Test all features
- Check mobile responsiveness

### 3. Monitor Performance
- Set up error tracking (Sentry)
- Monitor API response times
- Track user analytics (Google Analytics)

### 4. Set up CI/CD
Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to production
        run: |
          # Your deployment commands
```

---

## 🌍 Custom Domain Setup

### For Vercel:
1. Go to project settings
2. Add custom domain
3. Update DNS records (provided by Vercel)

### For Netlify:
1. Go to Domain settings
2. Add custom domain
3. Configure DNS

### For Railway:
1. Go to Settings → Domains
2. Add custom domain
3. Update DNS CNAME record

---

## 🔄 Updating the Application

```bash
# Make changes locally
git add .
git commit -m "Description of changes"
git push origin main

# Most platforms auto-deploy on push
# Or manually trigger deployment from platform dashboard
```

---

## 🐛 Troubleshooting Deployment

### Build Fails
- Check Node.js version compatibility
- Verify all dependencies in package.json
- Check build logs for specific errors

### Database Connection Issues
- Verify MongoDB URI is correct
- Check IP whitelist in MongoDB Atlas
- Ensure database user has correct permissions

### CORS Errors
- Update CORS_ORIGIN in backend .env
- Verify frontend URL is correct
- Check CORS middleware configuration

### Environment Variables Not Working
- Ensure variables are set in platform dashboard
- Restart application after adding variables
- Check variable names match code

---

## 📱 Progressive Web App (Optional)

To make InternFair installable:

1. Add manifest.json to frontend/public
2. Configure service worker
3. Add PWA meta tags
4. Test with Lighthouse

---

## 🎯 Recommended Setup for Production

**Best Performance & Cost:**
- **Frontend**: Vercel (Free tier, excellent performance)
- **Backend**: Railway (Free tier, easy deployment)
- **Database**: MongoDB Atlas (Free tier, 512MB)
- **Domain**: Namecheap or Google Domains
- **SSL**: Automatic with Vercel/Railway
- **Monitoring**: Vercel Analytics + Railway Logs

**Total Cost**: $0/month (free tiers) or ~$10-20/month with custom domain

---

## 📞 Support

If you encounter issues during deployment:
1. Check platform-specific documentation
2. Review deployment logs
3. Verify environment variables
4. Test locally first
5. Check GitHub Issues for similar problems

---

## ✅ Deployment Checklist

- [ ] Code pushed to GitHub
- [ ] Environment variables configured
- [ ] Frontend deployed and accessible
- [ ] Backend deployed and accessible
- [ ] Database connected and populated
- [ ] CORS configured correctly
- [ ] HTTPS enabled
- [ ] Custom domain configured (optional)
- [ ] Monitoring set up
- [ ] Backup strategy in place
- [ ] Documentation updated with live URLs

---

**Your InternFair platform is ready for the world! 🚀**
