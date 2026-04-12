# HireX - AI Job Portal

A MERN stack project for a job portal with AI-powered resume matching.

## Folder Structure
```
HireX/
├── backend/
│   ├── controllers/      # Logic for auth, jobs, applications
│   ├── middleware/       # JWT Auth
│   ├── models/           # MongoDB Schemas
│   ├── routes/           # API endpoints
│   ├── services/         # AI Matching Logic (Groq API)
│   ├── .env.example      # Environment variables template
│   └── index.js          # Entry point
└── frontend/
    ├── src/
    │   ├── components/   # Reusable UI parts (Navbar)
    │   ├── pages/        # Main screens (Home, Jobs, Profile, etc)
    │   ├── App.jsx       # Routing
    │   └── api.js        # Axios setup
    └── tailwind.config.js
```

## Setup Instructions

### Backend
1. `cd backend`
2. `npm install`
3. Create `.env` file from `.env.example` and add your:
   - `MONGO_URI`
   - `JWT_SECRET`
   - `GROQ_API_KEY`
   - `GOOGLE_CLIENT_ID`
4. `node index.js`

### Frontend
1. `cd frontend`
2. `npm install`
3. `npm run dev`

## AI Features
- **Resume Analyzer**: Extracts skills and suggests improvements using Llama 3 via Groq.
- **Job Matcher**: Ranks applicants based on their resume vs job description and highlights missing skills.

Authorization Redirect-
http://localhost:5000/auth/google/callback