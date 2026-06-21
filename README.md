# 🎯 InterviewForge — AI Mock Interview Platform

[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)](https://vitejs.dev/)
[![Gemini](https://img.shields.io/badge/Gemini_AI-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev/)

A full-stack mock interview platform that simulates what actually happens in a real DSA technical interview. Not just solving problems — communicating your thought process under time pressure, with an AI interviewer asking follow-up questions the way a real engineer would.

---

## 📑 Table of Contents

- [Live Demo](#-live-demo)
- [The Problem It Solves](#-the-problem-it-solves)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Database Schema](#-database-schema)
- [API Reference](#-api-reference)
- [Key Technical Decisions](#-key-technical-decisions)
- [AI Interviewer Design](#-ai-interviewer-design)
- [Local Setup](#-local-setup)
- [Project Structure](#-project-structure)
- [Deployment](#-deployment)
- [Known Limitations](#️-known-limitations)
- [What I Learned Building This](#-what-i-learned-building-this)

---

## 🌐 Live Demo

| Service | Link |
|---|---|
| **Frontend** | [Live App](https://interview-simulator-xi.vercel.app) |
| **Backend API** | [API Endpoint](https://interview-simulator-backend-ahh8.onrender.com) |
| **Health Check** | [Health Status](https://interview-simulator-backend-ahh8.onrender.com/api/health) |

---

## 🎯 The Problem It Solves

Most people practice DSA on LeetCode comfortably at home. Then they freeze in an actual interview. The difference is not the problem — it is the pressure, the interviewer watching you, and the expectation that you explain your thinking while you code.

LeetCode does not simulate any of that:

1. **No time pressure enforced** — you can take as long as you want. Real interviews have a hard clock. *Solved with a countdown timer that auto-submits when time runs out.*
2. **No interviewer asking follow-ups** — nobody asks "what is the time complexity of this?" or "can you handle this edge case?" while you are coding. *Solved with an AI interviewer (Gemini 2.5 Flash) that watches your code and asks contextual questions.*
3. **No record of what you struggled with** — you have no idea if you freeze on trees specifically, or if your explanation quality drops under pressure. *Solved with session reports that save the full AI conversation transcript alongside your final code.*

---

## ✨ Features

### Phase 1 — Core Platform

- JWT authentication with HTTP-only cookies (secure cross-domain setup)
- 8 curated DSA problems seeded in the database
- Monaco editor in the browser — same editor as VSCode
- Language selector — Python, JavaScript, Java, C++
- Real code execution via glot.io — runs actual code, not a simulation
- AI interviewer powered by Gemini 2.5 Flash
- 45-minute countdown timer with auto-submit on expiry
- Session saving — every interview is stored with final code and AI transcript
- Session report page — time taken, test results, full AI conversation
- Dark and light theme toggle via CSS variables
- Fully deployed — Vercel frontend, Render backend, Neon PostgreSQL

---

## 🛠 Tech Stack

### Backend

| Technology | Purpose |
|---|---|
| Node.js + Express | HTTP server and REST API |
| PostgreSQL (Neon) | Stores users, problems, sessions, AI messages |
| bcryptjs | Password hashing with 10 salt rounds |
| jsonwebtoken | JWT signing and verification |
| cookie-parser | Reads HTTP-only cookies on incoming requests |
| axios | HTTP client for glot.io and Gemini API calls |
| @google/generative-ai | Official Gemini SDK |

### Frontend

| Technology | Purpose |
|---|---|
| React + Vite | Component-based UI with fast dev server |
| React Router | Client-side page navigation |
| @monaco-editor/react | VSCode-like code editor in the browser |
| Context API | Global auth state management |
| CSS Variables | Theme switching (dark/light) without a library |

### Deployment

| Service | What runs there |
|---|---|
| Render | Node.js backend |
| Neon | Managed PostgreSQL |
| Vercel | React frontend (static build) |

---

## 🗄 Database Schema

### `users`

| Column | Type | Description |
|---|---|---|
| `id` | SERIAL (PK) | Primary key |
| `name` | VARCHAR(100) | User's name |
| `email` | VARCHAR(100) UNIQUE | User email |
| `password` | VARCHAR(255) | Bcrypt hashed password |
| `created_at` | TIMESTAMP | Registration timestamp |

### `problems`

| Column | Type | Description |
|---|---|---|
| `id` | SERIAL (PK) | Primary key |
| `title` | VARCHAR(200) | Problem name |
| `description` | TEXT | Full problem statement |
| `difficulty` | VARCHAR(10) | easy / medium / hard |
| `topic` | VARCHAR(50) | arrays / trees / dp / etc |
| `examples` | TEXT | JSON string of input/output examples |
| `test_cases` | TEXT | JSON string of test cases with expected output |

### `sessions`

| Column | Type | Description |
|---|---|---|
| `id` | SERIAL (PK) | Primary key |
| `user_id` | INTEGER → users.id | Which user did this session |
| `problem_id` | INTEGER → problems.id | Which problem was attempted |
| `language` | VARCHAR(20) | python / javascript / java / cpp |
| `final_code` | TEXT | Code submitted at end of session |
| `time_taken` | INTEGER | Seconds taken to finish |
| `test_cases_passed` | INTEGER | How many test cases passed |
| `test_cases_total` | INTEGER | Total test cases for the problem |
| `status` | VARCHAR(20) | ongoing / completed / timed_out |
| `started_at` | TIMESTAMP | Session start time |
| `ended_at` | TIMESTAMP | Session end time |

### `ai_messages`

| Column | Type | Description |
|---|---|---|
| `id` | SERIAL (PK) | Primary key |
| `session_id` | INTEGER → sessions.id | Which session this belongs to |
| `message` | TEXT | The question Gemini asked |
| `code_snapshot` | TEXT | The code that triggered this question |
| `created_at` | TIMESTAMP | When the question was asked |

---

## 📡 API Reference

All protected endpoints require a valid JWT stored in an HTTP-only cookie. The cookie is set automatically on login and register.

All error responses follow this shape:

```json
{
  "message": "human readable error description"
}
```

### Auth Endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | No | Register and receive JWT cookie |
| POST | `/api/auth/login` | No | Login and receive JWT cookie |
| POST | `/api/auth/logout` | No | Clear the JWT cookie |
| GET | `/api/auth/me` | No | Check if current cookie is valid |

### Problem Endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/problems` | No | Get all problems (title, difficulty, topic) |
| GET | `/api/problems/:id` | No | Get full problem with examples and test cases |

### Execute Endpoint

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/execute` | No | Run code via glot.io, returns stdout/stderr |

### AI Endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/ai/review` | Yes | Send code to Gemini, returns one follow-up question |

### Session Endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/sessions/start` | Yes | Create a new session row, returns sessionId |
| POST | `/api/sessions/message` | Yes | Save an AI message with code snapshot |
| POST | `/api/sessions/end` | Yes | Save final code, time taken, test results |
| GET | `/api/sessions/report/:sessionId` | Yes | Full report — session + problem + AI messages |
| GET | `/api/sessions/history` | Yes | All past sessions for logged in user |

#### Example: Execute Request

```http
POST /api/execute
Content-Type: application/json

{
  "code": "print('hello world')",
  "language": "python",
  "stdin": ""
}
```

**Success Response — 200:**

```json
{
  "stdout": "hello world\n",
  "stderr": "",
  "status": "Accepted"
}
```

#### Example: AI Review Request

```http
POST /api/ai/review
Content-Type: application/json
Cookie: token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

{
  "code": "def twoSum(nums, target):\n    for i in range(len(nums)):\n        for j in range(i+1, len(nums)):\n            if nums[i] + nums[j] == target:\n                return [i, j]",
  "problemTitle": "Two Sum",
  "problemDescription": "Given an array of integers, return indices of two numbers that add up to target."
}
```

**Success Response — 200:**

```json
{
  "question": "Your nested loop works correctly — what is the time complexity of this approach, and can you think of a way to solve this in O(n)?"
}
```

---

## 🔑 Key Technical Decisions

### Why HTTP-only cookies instead of localStorage for JWT?

Storing JWT tokens in `localStorage` exposes them to XSS attacks — any injected JavaScript on the page can read `localStorage` and steal the token. HTTP-only cookies cannot be read by JavaScript at all. The browser sends them automatically on every request, but no script can access the value.

This required specific configuration for cross-domain use since the frontend (Vercel) and backend (Render) are on different domains:

```js
res.cookie('token', token, {
    httpOnly: true,
    secure: true,       // only sent over HTTPS
    sameSite: 'none',   // allows cross-domain sending
    maxAge: 7 * 24 * 60 * 60 * 1000
})
```

Without `sameSite: 'none'` and `secure: true`, the browser silently drops the cookie on cross-domain requests and every protected route returns 401.

### Why glot.io instead of Judge0?

The original plan was Judge0 for sandboxed code execution. Three approaches were attempted and failed:

- **RapidAPI hosted Judge0** — requires a credit card even for the free tier
- **Self-hosted Judge0 via Docker** — the official image is built for amd64. On Apple Silicon (ARM64), Docker runs it through emulation. The Judge0 config file uses `@` in passwords which breaks YAML parsing inside the container. Even after fixing the password, the server crashed during startup due to the platform mismatch
- **Public Judge0 instance** — the URL I planned to use did not actually exist

glot.io supports all four languages, requires only email signup, has a clean REST API, and works identically in local development and production. The tradeoff is a small per-request latency compared to self-hosted, which is acceptable for a development portfolio project.

### Why Gemini 2.5 Flash instead of Claude?

Claude API requires purchasing credits upfront — no free tier for API access. Gemini's free tier via Google AI Studio provides enough quota for development and demos without any payment. The model name itself went through two iterations — `gemini-pro` is deprecated, `gemini-1.5-flash` returned 404 for this account's API version, and `gemini-2.5-flash` is what actually works.

### Why poll for AI responses instead of streaming?

Streaming responses (where text appears token by token as it generates) would feel more live, but adds complexity — the frontend needs to handle chunked HTTP responses, the backend needs to pipe a stream instead of awaiting a complete response, and error handling becomes harder. For Phase 1, a complete response displayed at once after a brief "thinking..." state is simpler to build and debug, and sufficient for the core interview simulation use case.

---

## 🤖 AI Interviewer Design

The core of the platform is the prompt sent to Gemini. Getting this right took iteration — early versions either gave away too much or asked questions unrelated to the code.

The final prompt structure is engineered to enforce strict interviewer behavior:

```
You are a senior software engineer conducting a DSA interview.
You are interviewing a candidate for the problem: [PROBLEM_TITLE]
Problem Description: [PROBLEM_DESCRIPTION]

Here is the candidate's current code:
[USER_CODE]

Rules you MUST follow:
1. Ask EXACTLY ONE follow-up question. Do not ask multiple questions.
2. NEVER provide the solution code or complete the implementation.
3. Focus on: time/space complexity, edge cases, or alternative approaches.
4. Keep your response to 2-3 sentences max.
5. If the code is clearly wrong, gently guide them toward the bug without fixing it.
```

This prompt took multiple iterations to get right. Early versions either gave away the answer or asked generic questions completely unrelated to the code. The strict "one question" rule ensures the AI drives a natural conversation without overwhelming the user.
---

## 🚀 Local Setup

### Prerequisites

- Node.js 18+
- PostgreSQL or a Neon account (free)
- Gemini API key — [aistudio.google.com](https://aistudio.google.com)
- glot.io API token — [glot.io](https://glot.io) (free, email signup only)

### Backend

1. **Clone the repo and install dependencies**

```bash
git clone https://github.com/Anish033-coder/interview-simulator.git
cd interview-simulator/backend
npm install
```

2. **Configure environment**

Create a `.env` file inside the `backend` folder:
PORT=5000

DATABASE_URL=your_postgresql_connection_string

JWT_SECRET=any_long_random_string

GEMINI_API_KEY=your_gemini_api_key

GLOT_API_TOKEN=your_glot_api_token

3. **Create database tables**

Run the SQL from the Database Schema section above in your PostgreSQL client or Neon SQL editor.

4. **Seed the problem bank**

```bash
node db/seed.js
```

You should see:
database connected

seeding problems...

inserted: Two Sum

inserted: Valid Parentheses

inserted: Reverse Linked List

inserted: Best Time to Buy and Sell Stock

inserted: Maximum Subarray

inserted: Climbing Stairs

inserted: Binary Search

inserted: Merge Two Sorted Lists

all problems seeded successfully

5. **Start the server**

```bash
node server.js
```

Server runs at `http://localhost:5000`
Health check: `http://localhost:5000/api/health`

### Frontend

1. **Navigate and install dependencies**

```bash
cd ../frontend
npm install
```

2. **Configure environment**

```bash
echo "VITE_API_URL=http://localhost:5000" > .env
```

> Important: The frontend expects `VITE_API_URL` to point to the backend. Without this, all API calls fail with CORS errors.

3. **Start the dev server**

```bash
npm run dev
```

Frontend runs at `http://localhost:5173`

---

## 📁 Project Structure

```
interview-simulator/
├── README.md
│
├── backend/
│   ├── config/
│   │   └── db.js                 
│   ├── middleware/
│   │   └── auth.js               
│   ├── routes/
│   │   ├── authRoutes.js         
│   │   ├── problemRoutes.js      
│   │   ├── executeRoutes.js       
│   │   ├── aiRoutes.js            
│   │   └── sessionRoutes.js     
│   ├── db/
│   │   └── seed.js                
│   ├── tmp/                       
│   ├── .env                   
│   ├── .gitignore
│   ├── package.json
│   └── server.js        
│
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── api/
    │   │   └── axios.js           
    │   ├── context/
    │   │   └── AuthContext.jsx   
    │   ├── components/
    │   │   ├── Navbar.jsx       
    │   │   ├── Timer.jsx          
    │   │   ├── CodeEditor.jsx     
    │   │   ├── AIPanel.jsx        
    │   │   └── OutputPanel.jsx    
    │   ├── pages/
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   ├── Home.jsx          
    │   │   ├── Interview.jsx      
    │   │   └── Report.jsx         
    │   ├── App.jsx               
    │   ├── main.jsx             
    │   └── index.css            
    ├── vercel.json               
    ├── .env
    ├── .gitignore
    └── package.json
```
---

## 🚢 Deployment

**Backend** deployed on Render as a Web Service.

Settings used:
Root Directory:  backend

Build Command:   npm install

Start Command:   node server.js

Environment variables set directly in Render dashboard — never committed to git.

**Frontend** deployed on Vercel with `VITE_API_URL` pointing to the Render backend.

`vercel.json` handles React Router — without it, any direct URL like `/interview/1` returns 404 because Vercel tries to serve a static file that does not exist:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

Both platforms auto-deploy on every push to the main branch.

---

## ⚠️ Known Limitations (Intentional Tradeoffs)

- **Polling over WebSockets** — AI responses are fetched via standard HTTP requests rather than WebSockets. This was a deliberate tradeoff to keep deployment simple — Render and Vercel handle HTTP flawlessly, while WebSockets require persistent connections and additional infrastructure. For a portfolio project, the marginal UX gain of real-time streaming didn't justify the deployment complexity.

- **No automated test runner** — users run code manually with custom stdin. A Submit button that loops through all test cases and shows "7/10 passed" is the highest priority next feature. Without it, the platform cannot verify solution correctness automatically.

- **No Redis cache** — every code execution hits glot.io directly. In production, we would hash `code + language + stdin` with SHA256 and cache results in Redis, reducing glot.io API calls by roughly 80% for repeated submissions.

- **glot.io free tier limits** — under heavy concurrent use, the execution service may return 429. Phase 2 will add `express-rate-limit` on the execute route and a friendly retry message when the service is busy.

- **No weakness tracking across sessions** — session data is saved but not analyzed. Phase 2 will add a recency-weighted scoring algorithm that detects patterns like "accuracy on DP drops in the last 10 minutes of a session."

- **Theme preference not persisted** — the dark/light toggle resets on page refresh. Persisting it to `localStorage` is a small fix intentionally left out of Phase 1 scope.

---

## 📚 What I Learned Building This

- How to configure HTTP-only cookies for cross-domain auth between a Vercel frontend and a Render backend — specifically why `sameSite: 'none'` and `secure: true` are both required and what breaks without each one.
- How Docker image platform mismatches work on Apple Silicon and why amd64 images fail on ARM64 hosts even with emulation enabled.
- How Vercel handles SPA routing and why a catch-all rewrite rule in `vercel.json` conflicts with a manually added rule in the Vercel dashboard, causing JS module files to be served as HTML.
- How to design an AI system prompt that constrains the model to a specific persona — the difference between "ask one question" and getting a paragraph of hints.
- How to proxy external APIs (glot.io, Gemini) through an Express backend instead of calling them directly from the frontend — keeps API keys server-side and gives you a single place to add rate limiting or error handling later.
- How real code execution APIs work — the difference between submission (get a token) and polling (use the token to fetch the result).
- How CORS works in practice — not just the theory but the specific combination of `credentials: true` on axios, `credentials: true` on the CORS middleware, and the exact allowed-origins array that makes it work in production.

---

## 👤 Author

**Anish Kumawat**
2nd Year CSE — IIIT Lucknow

---

## 📄 License

MIT — free to use and modify.
