# 🚀 Quick GitHub Setup & Deployment Guide

## ✅ Git Repository Initialized!

Your InternFair project has been committed to Git. Now let's push it to GitHub!

---

## 📝 Step-by-Step GitHub Setup

### Step 1: Create GitHub Repository

1. **Go to GitHub**: https://github.com/new

2. **Fill in repository details:**
   - **Repository name**: `internfair-scholarship-platform`
   - **Description**: `AI-powered scholarship finder with intelligent matching algorithm - Built for InternFair/UDGAM by E-Cell IIT Guwahati`
   - **Visibility**: Choose **Public** (recommended for portfolio) or **Private**
   - **Important**: ❌ **DO NOT** check "Add a README file" (we already have one)
   - ❌ **DO NOT** check "Add .gitignore"
   - ❌ **DO NOT** choose a license yet

3. **Click** "Create repository"

---

### Step 2: Connect Local Repository to GitHub

After creating the repository, GitHub will show you commands. Use these:

```bash
# Run these commands in your project directory
git remote add origin https://github.com/YOUR_USERNAME/internfair-scholarship-platform.git
git branch -M main
git push -u origin main
```

**Replace `YOUR_USERNAME` with your actual GitHub username!**

---

### Step 3: Push to GitHub

Run this command to push your code:

```bash
git push -u origin main
```

You'll be prompted to enter your GitHub credentials:
- **Username**: Your GitHub username
- **Password**: Use a **Personal Access Token** (not your password)

#### How to Create Personal Access Token:
1. Go to: https://github.com/settings/tokens
2. Click "Generate new token" → "Generate new token (classic)"
3. Give it a name: "InternFair Deployment"
4. Select scopes: ✅ `repo` (all)
5. Click "Generate token"
6. **Copy the token** (you won't see it again!)
7. Use this token as your password when pushing

---

## 🌐 Hosting Options (Choose One)

### Option 1: Vercel + Railway (RECOMMENDED - FREE)

#### **A. Deploy Frontend to Vercel**

1. **Go to**: https://vercel.com
2. **Sign up** with GitHub
3. **Click** "Add New Project"
4. **Import** your GitHub repository
5. **Configure:**
   - Framework Preset: Create React App
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `build`
6. **Add Environment Variable:**
   - Key: `REACT_APP_API_URL`
   - Value: (You'll get this from Railway in next step)
7. **Click** "Deploy"

#### **B. Deploy Backend to Railway**

1. **Go to**: https://railway.app
2. **Sign up** with GitHub
3. **Click** "New Project" → "Deploy from GitHub repo"
4. **Select** your repository
5. **Configure:**
   - Root Directory: `backend`
   - Start Command: `npm start`
6. **Add Environment Variables:**
   ```
   NODE_ENV=production
   JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_2024
   MONGODB_URI=(get from MongoDB Atlas - see below)
   CORS_ORIGIN=(your Vercel frontend URL)
   PORT=5000
   ```
7. **Copy** your Railway backend URL
8. **Go back to Vercel** → Settings → Environment Variables
9. **Update** `REACT_APP_API_URL` with Railway URL
10. **Redeploy** frontend

#### **C. Set Up MongoDB Atlas (FREE)**

1. **Go to**: https://www.mongodb.com/cloud/atlas
2. **Sign up** for free
3. **Create** a free cluster (M0 Sandbox)
4. **Create** database user:
   - Username: `internfair`
   - Password: (generate strong password)
5. **Network Access**:
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (0.0.0.0/0)
6. **Get Connection String**:
   - Click "Connect" → "Connect your application"
   - Copy connection string
   - Replace `<password>` with your database password
   - Example: `mongodb+srv://internfair:PASSWORD@cluster0.xxxxx.mongodb.net/internfair?retryWrites=true&w=majority`
7. **Add to Railway**:
   - Go to Railway → Variables
   - Update `MONGODB_URI` with your connection string

#### **D. Populate Database**

1. **In Railway**, go to your backend service
2. **Click** "Deploy Logs"
3. **Wait** for deployment to complete
4. **Run scraper**:
   - Option 1: Add to Railway start script
   - Option 2: Use Railway CLI to run `npm run scrape`

---

### Option 2: Netlify + Render (Alternative FREE)

#### **Frontend on Netlify:**
1. Go to https://netlify.com
2. "Add new site" → "Import an existing project"
3. Connect GitHub repository
4. Configure:
   - Base directory: `frontend`
   - Build command: `npm run build`
   - Publish directory: `frontend/build`
5. Add environment variable: `REACT_APP_API_URL`

#### **Backend on Render:**
1. Go to https://render.com
2. "New" → "Web Service"
3. Connect GitHub repository
4. Configure:
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `npm start`
5. Add environment variables

---

## 🔧 Quick Commands Reference

### Push Changes to GitHub
```bash
git add .
git commit -m "Your commit message"
git push origin main
```

### Check Git Status
```bash
git status
```

### View Remote URL
```bash
git remote -v
```

### Change Remote URL
```bash
git remote set-url origin https://github.com/YOUR_USERNAME/new-repo-name.git
```

---

## ✅ Post-Deployment Checklist

After deploying, verify:

- [ ] Frontend is accessible and loads correctly
- [ ] Backend API is responding (check /api/health)
- [ ] Database connection is working
- [ ] Can register a new account
- [ ] Can login successfully
- [ ] Dashboard shows recommendations
- [ ] Search and filters work
- [ ] Can save scholarships
- [ ] Mobile responsive design works

---

## 🎯 Your URLs After Deployment

Once deployed, you'll have:

- **Frontend**: `https://your-app.vercel.app`
- **Backend**: `https://your-app.up.railway.app`
- **GitHub**: `https://github.com/YOUR_USERNAME/internfair-scholarship-platform`

---

## 🐛 Common Issues & Solutions

### Issue: Git push requires password
**Solution**: Use Personal Access Token instead of password

### Issue: Vercel build fails
**Solution**: 
- Check Node.js version in Vercel settings
- Ensure all dependencies are in package.json
- Check build logs for specific errors

### Issue: Backend can't connect to database
**Solution**:
- Verify MongoDB Atlas IP whitelist includes 0.0.0.0/0
- Check connection string is correct
- Ensure database user has read/write permissions

### Issue: CORS errors in production
**Solution**:
- Update CORS_ORIGIN in Railway to match Vercel URL
- Redeploy backend after changing environment variables

---

## 📞 Need Help?

1. Check `DEPLOYMENT.md` for detailed deployment guide
2. Review platform-specific documentation:
   - Vercel: https://vercel.com/docs
   - Railway: https://docs.railway.app
   - MongoDB Atlas: https://docs.atlas.mongodb.com

---

## 🎉 You're Ready!

Your InternFair project is:
- ✅ Committed to Git
- ✅ Ready to push to GitHub
- ✅ Prepared for deployment

**Next Steps:**
1. Create GitHub repository
2. Push your code
3. Deploy to Vercel + Railway
4. Share your live URL!

---

**Good luck with your deployment! 🚀**
