# InternFair - Scholarship Finder & Recommendation Platform

A complete, production-ready web application that helps students discover relevant scholarships efficiently through intelligent matching and personalized recommendations.

## 🌟 Features

### Core Functionality
- **Centralized Scholarship Database**: Access scholarships from multiple trusted sources in one place
- **Intelligent Matching Algorithm**: AI-powered recommendation system that matches students with scholarships based on:
  - Academic performance (GPA)
  - Course of study
  - Educational level
  - Location
  - Income bracket
  - Demographics (gender, minority status, disability)
  - Deadline urgency
  - Funding amount

### Student Features
- **User Authentication**: Secure registration and login with JWT tokens
- **Comprehensive Profile Management**: Detailed student profiles with academic and demographic information
- **Personalized Dashboard**: View top scholarship recommendations ranked by relevance
- **Advanced Search & Filters**: Search scholarships by name, category, amount, and more
- **Bookmark System**: Save scholarships for later review
- **Deadline Tracking**: Visual indicators for urgent deadlines
- **Match Scoring**: See how well each scholarship matches your profile (0-100%)

### Technical Features
- **Web Scraping System**: Modular scraper architecture (with mock data generator for demo)
- **Sentiment Analysis**: Analyze scholarship descriptions for favorable opportunities
- **RESTful API**: Clean, well-documented backend APIs
- **Responsive Design**: Beautiful, modern UI that works on all devices
- **Real-time Updates**: Dynamic content loading and state management

## 🏗️ System Architecture

```
internfair/
├── backend/                    # Node.js + Express Backend
│   ├── config/                # Database configuration
│   ├── models/                # MongoDB schemas (Student, Scholarship)
│   ├── routes/                # API routes (auth, students, scholarships)
│   ├── middleware/            # Authentication middleware
│   ├── scrapers/              # Web scraping modules
│   ├── utils/                 # Matching algorithm
│   └── server.js              # Main server file
│
└── frontend/                  # React Frontend
    ├── public/                # Static files
    └── src/
        ├── components/        # Reusable components (Navbar, etc.)
        ├── context/           # React Context (Auth)
        ├── pages/             # Page components
        ├── services/          # API service layer
        └── index.css          # Design system & styles
```

## 🗄️ Database Schema

### Student Collection
```javascript
{
  email: String (unique),
  password: String (hashed),
  fullName: String,
  courseOfStudy: String,
  educationalLevel: String,
  gpa: Number,
  currentLocation: {
    country: String,
    state: String,
    city: String
  },
  incomeBracket: String,
  gender: String,
  minorityStatus: String,
  hasDisability: Boolean,
  disabilityDetails: String,
  fieldInterests: [String],
  savedScholarships: [ObjectId],
  emailNotifications: Boolean,
  profileCompleted: Boolean
}
```

### Scholarship Collection
```javascript
{
  name: String,
  provider: String,
  description: String,
  awardAmount: {
    min: Number,
    max: Number,
    currency: String,
    type: String
  },
  eligibility: {
    courses: [String],
    educationalLevels: [String],
    minGPA: Number,
    locations: {
      countries: [String],
      states: [String],
      cities: [String]
    },
    incomeCriteria: Object,
    genderSpecific: String,
    minorityOnly: Boolean,
    disabilityFriendly: Boolean
  },
  applicationDeadline: Date,
  applicationLink: String,
  category: String,
  tags: [String],
  sourceUrl: String,
  sourcePlatform: String,
  sentimentScore: Number,
  sentimentLabel: String,
  isActive: Boolean,
  verified: Boolean
}
```

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

### Backend Setup

1. **Navigate to backend directory**
```bash
cd backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
Create a `.env` file in the backend directory (already provided) and update:
```env
MONGODB_URI=mongodb://localhost:27017/internfair
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_2024
PORT=5000
```

4. **Start MongoDB**
```bash
# Windows
mongod

# Linux/Mac
sudo systemctl start mongod
```

5. **Populate database with mock data**
```bash
npm run scrape
```

6. **Start the backend server**
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

Backend will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory**
```bash
cd frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Start the development server**
```bash
npm start
```

Frontend will run on `http://localhost:3000`

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new student
- `POST /api/auth/login` - Login student
- `GET /api/auth/me` - Get current student (Protected)

### Students
- `GET /api/students/profile` - Get student profile (Protected)
- `PUT /api/students/profile` - Update student profile (Protected)
- `POST /api/students/save-scholarship/:id` - Save scholarship (Protected)
- `DELETE /api/students/save-scholarship/:id` - Remove saved scholarship (Protected)
- `GET /api/students/saved-scholarships` - Get saved scholarships (Protected)

### Scholarships
- `GET /api/scholarships` - Get all scholarships (with filters)
- `GET /api/scholarships/:id` - Get single scholarship
- `GET /api/scholarships/recommendations` - Get personalized recommendations (Protected)
- `POST /api/scholarships/:id/apply` - Track application (Protected)
- `GET /api/scholarships/stats/overview` - Get statistics

## 🧮 Matching Algorithm

The intelligent matching algorithm calculates a relevance score (0-100%) based on:

1. **Course Match (25%)**: Matches student's course with scholarship requirements
2. **Educational Level Match (20%)**: Matches student's education level
3. **GPA Match (20%)**: Compares student GPA with minimum requirements
4. **Location Match (15%)**: Matches country and state
5. **Income Criteria (10%)**: Checks income eligibility
6. **Gender Match (5%)**: Gender-specific scholarships
7. **Minority Status (5%)**: Minority-specific scholarships
8. **Disability Bonus (5%)**: Extra points for disability-friendly scholarships

**Priority Score** combines:
- Match Score (60%)
- Deadline Urgency (25%)
- Funding Amount (15%)

## 🎨 Design System

### Color Palette
- **Primary**: Indigo/Purple gradient (#6366f1 → #a855f7)
- **Accent**: Cyan, Emerald, Amber, Rose
- **Neutral**: Dark theme with glassmorphism effects

### Key Design Features
- Modern dark theme with gradient accents
- Glassmorphism cards with backdrop blur
- Smooth animations and transitions
- Responsive grid layouts
- Interactive hover effects
- Loading states and skeletons

## 🔒 Security Features

- Password hashing with bcrypt
- JWT-based authentication
- Protected API routes
- Input validation
- CORS configuration
- Secure HTTP headers

## 📱 Responsive Design

The application is fully responsive and optimized for:
- Desktop (1920px+)
- Laptop (1024px - 1919px)
- Tablet (768px - 1023px)
- Mobile (320px - 767px)

## 🧪 Testing the Application

### Test User Flow

1. **Register a new account**
   - Navigate to `/register`
   - Fill in all required fields
   - Submit the form

2. **Complete your profile**
   - Go to `/profile`
   - Add optional demographic information
   - Save changes

3. **View recommendations**
   - Visit `/dashboard`
   - See personalized scholarship matches
   - Check match scores and urgency badges

4. **Browse all scholarships**
   - Go to `/scholarships`
   - Use search and filters
   - Save interesting scholarships

5. **Apply to scholarships**
   - Click "Apply Now" on any scholarship
   - Application is tracked automatically

## 🔄 Extending the System

### Adding Real Scrapers

Replace mock data generator with real scrapers:

1. Create a new scraper class extending `BaseScraper`
2. Implement the `scrape()` method
3. Add to `runScraper.js`

Example:
```javascript
class GovernmentPortalScraper extends BaseScraper {
  async scrape() {
    const html = await this.fetchPage(this.baseUrl);
    // Parse HTML and extract scholarship data
    // Use this.scholarships.push(scholarshipData)
    await this.saveScholarships();
  }
}
```

### Adding New Features

- **Email Notifications**: Integrate with SendGrid or Nodemailer
- **Application Tracking**: Add application status management
- **Document Upload**: Allow students to upload required documents
- **Admin Panel**: Create admin interface for scholarship management
- **Analytics**: Add scholarship success rate tracking

## 🐛 Troubleshooting

### MongoDB Connection Issues
```bash
# Check if MongoDB is running
mongod --version

# Start MongoDB service
# Windows: Start MongoDB service from Services
# Linux: sudo systemctl start mongod
# Mac: brew services start mongodb-community
```

### Port Already in Use
```bash
# Kill process on port 5000 (backend)
# Windows: netstat -ano | findstr :5000
# Linux/Mac: lsof -ti:5000 | xargs kill

# Kill process on port 3000 (frontend)
# Windows: netstat -ano | findstr :3000
# Linux/Mac: lsof -ti:3000 | xargs kill
```

### CORS Errors
Ensure `CORS_ORIGIN` in `.env` matches your frontend URL

## 📄 License

MIT License - feel free to use this project for learning or production

## 👥 Contributing

This is a submission for the InternFair/UDGAM problem statement by E-Cell IIT Guwahati.

## 🎯 Future Enhancements

- [ ] Email notification system
- [ ] Advanced analytics dashboard
- [ ] Mobile app (React Native)
- [ ] Multi-language support
- [ ] Social sharing features
- [ ] Scholarship comparison tool
- [ ] Success stories section
- [ ] Chatbot for scholarship queries

## 📞 Support

For issues or questions, please create an issue in the repository.

---

**Built with ❤️ for students seeking educational opportunities**
