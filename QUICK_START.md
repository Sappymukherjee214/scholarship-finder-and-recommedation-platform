# Quick Start Guide

## Prerequisites Check
Before starting, ensure you have:
- ✅ Node.js installed (v14+)
- ✅ MongoDB installed and running
- ✅ npm or yarn package manager

## Step-by-Step Setup

### 1. Install Dependencies

Both backend and frontend dependencies have been installed automatically.

### 2. Start MongoDB

**Windows:**
```bash
# Start MongoDB as a service (if configured)
net start MongoDB

# OR run mongod directly
mongod
```

**Linux/Mac:**
```bash
sudo systemctl start mongod
# OR
sudo service mongod start
```

### 3. Populate Database (Already Done!)

The database has been populated with 60 mock scholarships. You can re-run this anytime:
```bash
cd backend
npm run scrape
```

### 4. Start the Application

**Option A: Run Both Servers Manually**

Terminal 1 - Backend:
```bash
cd backend
npm run dev
```
Backend will run on http://localhost:5000

Terminal 2 - Frontend:
```bash
cd frontend
npm start
```
Frontend will run on http://localhost:3000

**Option B: Use the Start Script (Recommended)**

See `START_APPLICATION.md` for automated startup instructions.

## First Time User Guide

### 1. Register an Account
- Navigate to http://localhost:3000
- Click "Get Started" or go to /register
- Fill in your details:
  - Full Name
  - Email
  - Password
  - Course of Study (e.g., Computer Science)
  - Educational Level (e.g., Undergraduate)
  - GPA (e.g., 8.5)
  - State (e.g., Maharashtra)

### 2. Complete Your Profile
- After registration, go to /profile
- Add optional information for better matching:
  - Income bracket
  - Gender
  - Category (SC/ST/OBC/General/EWS)
  - Disability status
  - Email notification preferences

### 3. View Recommendations
- Go to /dashboard
- See your personalized scholarship recommendations
- Each scholarship shows:
  - Match score (0-100%)
  - Urgency badge (Critical/High/Medium/Low)
  - Award amount
  - Application deadline
  - Provider information

### 4. Browse All Scholarships
- Go to /scholarships
- Use search to find specific scholarships
- Apply filters:
  - Category (Merit-based, Need-based, Women, etc.)
  - Amount range
- Save scholarships for later

### 5. Save and Apply
- Click the bookmark icon to save scholarships
- Click "Apply Now" to visit the application portal
- Applications are tracked automatically

## Test Credentials

You can create your own account or use these test scenarios:

**High Achiever Student:**
- Course: Computer Science
- Level: Undergraduate
- GPA: 9.2
- State: Maharashtra
- Expected: High match scores for merit-based scholarships

**Need-Based Student:**
- Course: Engineering
- Level: Undergraduate
- GPA: 7.5
- Income: Below 1 Lakh
- State: Karnataka
- Expected: High match scores for need-based scholarships

**Women in STEM:**
- Course: Engineering
- Level: Postgraduate
- GPA: 8.0
- Gender: Female
- State: Delhi
- Expected: High match scores for women-specific scholarships

## API Testing

You can test the API directly using tools like Postman or curl:

### Register
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "courseOfStudy": "Computer Science",
    "educationalLevel": "Undergraduate",
    "gpa": 8.5,
    "currentLocation": {
      "country": "India",
      "state": "Maharashtra"
    }
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Get Recommendations (requires token)
```bash
curl -X GET http://localhost:5000/api/scholarships/recommendations \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Troubleshooting

### MongoDB Not Running
```bash
# Check MongoDB status
mongod --version

# If not installed, download from: https://www.mongodb.com/try/download/community
```

### Port Already in Use
```bash
# Backend (port 5000)
netstat -ano | findstr :5000
# Kill the process using the PID shown

# Frontend (port 3000)
netstat -ano | findstr :3000
# Kill the process using the PID shown
```

### Dependencies Issues
```bash
# Clear npm cache and reinstall
cd backend
rm -rf node_modules package-lock.json
npm install

cd ../frontend
rm -rf node_modules package-lock.json
npm install
```

### Database Connection Error
- Ensure MongoDB is running
- Check MONGODB_URI in backend/.env
- Default: mongodb://localhost:27017/internfair

## Features to Explore

1. **Smart Matching**: Notice how scholarships are ranked by match score
2. **Deadline Urgency**: Scholarships closing soon are highlighted
3. **Bookmark System**: Save scholarships and view them later
4. **Profile Completion**: Better profile = better recommendations
5. **Search & Filter**: Find exactly what you're looking for
6. **Responsive Design**: Try it on mobile, tablet, and desktop

## Next Steps

- Explore the codebase in `/backend` and `/frontend`
- Read the full documentation in `README.md`
- Customize the matching algorithm in `/backend/utils/matchingAlgorithm.js`
- Add real scrapers in `/backend/scrapers/`
- Extend the UI with new features

## Support

If you encounter any issues:
1. Check the troubleshooting section above
2. Review the console logs (browser and terminal)
3. Ensure all prerequisites are met
4. Verify MongoDB is running

---

**Enjoy using InternFair! 🎓**
