# Smart Task Manager (AI-Powered)

A modern, full-stack productivity application that transforms a standard task list into a strategic plan using Generative AI. 

** Live Demo:** [https://task-manager-teal-phi-87.vercel.app/]

---

###  Key Features
* **AI Daily Briefing:** Leverages **Groq (Llama 3.3 70B)** to analyze your tasks and generate a high-speed productivity summary.
* **Secure Authentication:** Custom Auth flow using **JWT** stored in **HTTP-Only Cookies** for maximum security against XSS.
* **Responsive Dashboard:** A clean, minimalist UI built with **Next.js 15** and **Tailwind CSS**.
* **Real-time Feedback:** Toast notifications and loading skeletons for a seamless user experience.

---

###  The Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | Next.js 16 (App Router), Tailwind CSS |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB with Mongoose |
| **AI Engine** | Groq LPU (Llama 3.3 70B Model) |
| **Deployment** | Vercel (Frontend), Render (Backend) |

---

###  Local Setup (From Scratch) use env.sample files for help

#### **1. Backend**
```bash
    cd backend
    npm install
    # Create a .env file based on the keys below:
    PORT=5000
    MONGO_URI=your_mongodb_url
    JWT_SECRET=your_secret_key
    GROQ_API_KEY=your_groq_key
    FRONTEND_URL=http://localhost:3000
    NODE_ENV=development

    npm run dev
```

#### **2. Frontend**
```bash
    cd frontend
    npm install
    NEXT_PUBLIC_API_URL=http://localhost:5000/api

    npm run dev
```

---

### 📂 Project Structure
* **`/backend`**:
    * `src/models`: Mongoose schemas for Users and Tasks.
    * `src/controllers`: Core logic for auth, task CRUD, and AI integration.
    * `src/middleware`: JWT verification and global error handling.
* **`/frontend`**:
    * `src/app`: Next.js App Router pages and layouts.
    * `src/context`: Global Auth state management.
    * `src/components`: UI components (Modals, Task Cards, AI Summary).

---

### 🧪 Testing Credentials
You can register your own account or use the test credentials below to skip the setup:
* **Email:** `test@gmail.com`
* **Password:** `test123`

> **⏳ Note on Deployment:** The backend is hosted on Render's free tier. If the site hasn't been visited recently, the server will "sleep." **Please allow up to 60 seconds for the initial wake-up** during your first login attempt.

---

### ⚖️ Trade-offs & Future Roadmap
**Trade-off:** Used HTTP-only cookies over LocalStorage for JWTs to ensure a **Security-First** approach, sacrificing a bit of simplicity for better protection.

**FUTURE**
Automated Productivity Pipelines: Implement Node-Cron or GitHub Actions to trigger "Morning Briefings" at 8:00 AM daily, sending AI summaries directly to users via Web Push Notifications so they can stay productive without even opening the dashboard.

Utilize Redis to store generated AI briefings. This will drastically reduce Groq API latency and cost by serving cached summaries for users whose task lists haven't changed.
