Smart Task Manager (AI-Powered)
    This is a full-stack task manager I built to actually make productivity feel "smart." It’s got secure login, and the best part—an AI Daily Briefing that uses Groq (Llama 3.3) to tell you exactly how to tackle your day.

The Tech Stack
    I kept things modern and fast:

    Frontend: Next.js 15 (App Router) + Tailwind CSS .
    Backend: Node.js & Express.
    Database: MongoDB with Mongoose .
    AI: Groq LPU (Llama 3.3 70B) — it's fast for generating summaries.
    Auth: JWTs tucked away in HTTP-Only Cookies.

How to set it up (from scratch)
    The project is split into two folders: frontend and backend. You’ll need to set up .env files for both.

    1. The Backend
        Bash
        cd backend
        npm install
        # Create a .env file and paste everything from .env.sample file:
            PORT=5000
            MONGO_URI=your_mongodb_url
            JWT_SECRET=something_random_and_long
            GROQ_API_KEY=your_groq_key
            FRONTEND_URL=http://localhost:3000
            NODE_ENV=development
            npm run dev to start the server.

    2. The Frontend
        Bash
        cd frontend
        npm install
        # Create a .env.local file and paste this:
        NEXT_PUBLIC_API_URL=http://localhost:5000/api
        npm run dev and you’re live at localhost:3000.

Project Structure
    /backend
    ├── src/models      # Task & User schemas
    ├── src/controllers # The logic for tasks, auth, and AI
    ├── src/middleware  # Auth checks
    /frontend
    ├── src/app         # Next.js pages & layouts
    ├── src/context     # AuthContext (keeps user data everywhere)
    ├── src/components  # Modals, Task cards, AI summary box



Note: Initial login may take up to 60 seconds as the backend wakes up from sleep on the Free Tier