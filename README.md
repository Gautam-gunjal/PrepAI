# PrepAI 🤖

> An AI-powered interview preparation platform that analyzes your resume and the job description to generate a fully personalized interview strategy — including predicted questions, skill gap analysis, a day-wise preparation plan, and an ATS-optimized resume.

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#️-tech-stack)
- [Project Structure](#-project-structure)
- [API Endpoints](#-api-endpoints)
- [Getting Started](#️-getting-started)
- [How It Works](#-how-it-works)
- [Authentication Flow](#-authentication-flow)
- [Interview Report Schema](#-interview-report-schema)
- [License](#-license)
- [Author](#️-author)

---

## 📸 Overview

PrepAI takes the guesswork out of interview preparation. You paste a job description, upload your resume (or write a self-description), and our AI does the rest — returning a tailored report with everything you need to walk into your next interview with confidence.

---

## ✨ Features

- **AI Match Score** — Strict, realistic scoring (0–100) showing how well your profile aligns with the job requirements
- **Technical Questions** — 7+ job-specific technical questions with interviewer intent and suggested answers
- **Behavioural Questions** — Role-aligned behavioural questions with STAR-method guidance
- **Skill Gap Analysis** — Pinpoints missing or weak skills with severity ratings (low / medium / high)
- **Day-wise Preparation Plan** — A practical, personalized daily prep roadmap to close skill gaps before your interview
- **ATS-Optimized Resume Generator** — Generates a clean, single-column, ATS-friendly resume PDF tailored to the job description
- **Interview History** — All your past interview reports saved and accessible from your dashboard
- **Secure Auth** — JWT-based authentication with cookie storage and token blacklisting on logout

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 19 | UI framework |
| Vite | Build tool & dev server |
| React Router v7 | Client-side routing |
| Axios | HTTP client |
| React Toastify | Toast notifications |
| Context API | Global state management |

### Backend
| Technology | Purpose |
|---|---|
| Node.js + Express 5 | REST API server |
| MongoDB + Mongoose | Database & ODM |
| Google Gemini AI (`@google/genai`) | AI-powered report & resume generation |
| Zod + zod-to-json-schema | Structured AI output validation |
| Puppeteer | HTML-to-PDF conversion for resume |
| pdf-parse | Resume PDF text extraction |
| JWT + bcryptjs | Authentication & password hashing |
| Multer | File upload handling |

---

## 📁 Project Structure

```
PrepAI/
├── backend/
│   ├── server.js                      # Entry point
│   └── src/
│       ├── app.js                     # Express app setup & middleware
│       ├── config/
│       │   └── db.js                  # MongoDB connection
│       ├── controllers/
│       │   ├── auth.controller.js     # Register, Login, Logout, GetMe
│       │   └── interviewReport.controller.js  # Report generation & retrieval
│       ├── middleware/
│       │   ├── auth.middleware.js     # JWT verification
│       │   └── file.middleware.js     # Multer config (PDF upload)
│       ├── models/
│       │   ├── user.model.js          # User schema
│       │   ├── interviewReport.model.js  # Interview report schema
│       │   └── blacklist.model.js     # Token blacklist schema
│       ├── routes/
│       │   ├── auth.routes.js         # Auth endpoints
│       │   └── interview.routes.js    # Interview endpoints
│       └── services/
│           └── ai.service.js          # Gemini AI integration (report + resume PDF)
│
└── frontend/
    └── src/
        ├── App.jsx                    # Root component with providers
        ├── AppRoutes.jsx              # Route definitions
        └── features/
            ├── auth/
            │   ├── auth.context.jsx   # Auth context provider
            │   ├── hooks/useAuth.jsx  # Auth logic hook
            │   ├── pages/             # Login & Register pages
            │   ├── services/          # Auth API calls
            │   └── components/        # Protected route, Loader
            └── interview/
                ├── interview.context.jsx  # Interview context provider
                ├── hooks/useInterview.js  # Interview logic hook
                ├── pages/                 # Home (input form) & Interview report page
                ├── services/              # Interview API calls
                └── components/            # Navbar, Loader
```

---

## 🔌 API Endpoints

### Auth — `/api/auth`
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| POST | `/register` | Register a new user | ❌ |
| POST | `/login` | Login and receive JWT cookie | ❌ |
| GET | `/logout` | Logout and blacklist token | ❌ |
| GET | `/get-me` | Fetch current user profile | ✅ |

### Interview — `/api/interview`
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| POST | `/` | Generate an AI interview report | ✅ |
| GET | `/` | Get all reports for current user | ✅ |
| GET | `/report/:interviewid` | Get a specific interview report | ✅ |
| POST | `/resume/pdf/:interviewid` | Generate ATS resume PDF | ✅ |

---

## ⚙️ Getting Started

### Prerequisites
- Node.js v18+
- MongoDB URI (local or Atlas)
- Google Gemini API Key

### 1. Clone the repository
```bash
git clone https://github.com/your-username/PrepAI.git
cd PrepAI
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory:
```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
GOOGLE_GENAI_API_KEY=your_gemini_api_key
```

Start the backend server:
```bash
node server.js
```
The server runs on `http://localhost:3000`.

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
The frontend runs on `http://localhost:5173`.

---

## 🧠 How It Works

1. **User inputs** a job description (required) and either uploads a PDF resume or writes a self-description.
2. The backend **extracts text from the PDF** using `pdf-parse` if a file is provided.
3. A detailed prompt is sent to **Google Gemini** with structured JSON output enforced via a **Zod schema**.
4. Gemini returns: match score, technical questions, behavioural questions, skill gaps, preparation plan, and job title.
5. The report is **saved to MongoDB** and returned to the frontend.
6. Users can also request an **ATS-optimized resume PDF** — Gemini generates HTML, which Puppeteer converts to a downloadable PDF.

---

## 🔐 Authentication Flow

- Passwords are hashed with **bcryptjs** (salt rounds: 10).
- On login/register, a **JWT** is signed and stored as an HTTP cookie.
- Protected routes verify the token via the `authMiddleware`.
- On logout, the token is added to a **blacklist collection** in MongoDB, preventing reuse.

---

## 📊 Interview Report Schema

Each report stores:
- `title` — Job title extracted from the description
- `matchScore` — 0–100 match percentage
- `technicalQuestions` — Array of `{ question, intention, answer }` (min 7)
- `behaviouralQuestions` — Array of `{ question, intention, answer }` (min 4)
- `skillGaps` — Array of `{ skills, severity: "low" | "medium" | "high" }`
- `preparationPlan` — Array of `{ day, focus, tasks[] }`
- `resume`, `selfDescription`, `jobDescription` — Input data
- `user` — Reference to the user
- `createdAt`, `updatedAt` — Timestamps

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 🙋‍♂️ Author

Built with ❤️ — feel free to connect or raise an issue!
