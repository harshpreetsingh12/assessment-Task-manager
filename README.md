    # 🧠 Smart Task Manager (AI-Powered)

    A full-stack task manager with an AI-powered daily briefing using Generative AI.

    **🚀 Live Demo:** [https://task-manager-teal-phi-87.vercel.app/](https://task-manager-teal-phi-87.vercel.app/)

    > **⏳ Note on Deployment:** The backend is hosted on Render's free tier. If the site hasn't been visited recently, the server will "sleep." after nearly 15 minutes of inactivity  **Please allow up to 60 seconds for the initial wake-up** during your first login attempt.

    -----

    ### ✨ Key Features

    * **AI Daily Briefing:** Leverages **Groq (Llama 3.3 70B)** to generate a daily summary based on the user’s tasks.
    * **Streaming UI:** Real-time AI response streaming with **requestAnimationFrame** optimization for a smooth "typing" experience.
    * **Secure Authentication:** Custom JWT flow stored in **HttpOnly Cookies** for maximum XSS protection and Server Component compatibility.
    * **Responsive Dashboard:** A clean, minimalist UI built with **Next.js 16 (App Router)** and **Tailwind CSS**.
    Fallback handling: If the AI is slow or unavailable, the app falls back to a simple local summary so the UI never breaks.

    -----

    ### 🛠️ The Tech Stack

    | Layer | Technology |
    | :--- | :--- |
    | **Frontend** | Next.js 16 (App Router), Tailwind CSS |
    | **Backend** | Node.js, Express.js (TypeScript / CommonJS) |
    | **Database** | MongoDB with Mongoose |
    | **AI Engine** | Groq LPU (Llama 3.3 70B Model) |
    | **Deployment** | Vercel (Frontend), Render (Backend) |

    -----

    ### ⚙️ Local Setup (From Scratch)

    *Check `.env.sample` in both directories for required environment keys.*

    #### **1. Backend**

    ```bash
    cd backend
    npm install
    # Configure your .env (see .env.sample)
    npm run dev
    ```

    #### **2. Frontend**

    ```bash
    cd frontend
    npm install
    # Create .env.local with NEXT_PUBLIC_API_URL=http://localhost:5000/api
    npm run dev
    ```

    -----

    ### 📂 Project Structure

    * **`/backend`**:
        * `src/models`: Mongoose schemas for Users and Tasks.
        * `src/controllers`: Core logic for auth, task CRUD, and AI integration.
        * `src/services`: Decoupled AI streaming and embedding logic.
    * **`/frontend`**:
        * `src/app`: Next.js App Router pages, layouts, and Server Components.
        * `src/context`: Global Auth & Task state management.
        * `src/components`: UI components (Modals, Task Cards, Streamed AI Summary).

    -----

    ### 🧪 Testing Credentials

    You can register a new account or use these test credentials:

    * **Email:** `test@gmail.com`
    * **Password:** `test123`

    -----

    ### ⚖️ Technical Decisions

    **[Read NOTES.md](./NOTES.md)** for a full breakdown of:
    - Why HttpOnly Cookies over LocalStorage
    - How SSE streaming and requestAnimationFrame work together
    - The heuristic fallback engine
    - The ESM → CommonJS build pivot


    #### **Future Roadmap**

    * **Smart Search (RAG):** Transition to semantic task lookups using MongoDB Atlas Vector Search.
    * **Distributed Caching:** Utilize Redis to store generated AI briefings, reducing latency and API costs.
    * **Proactive Notifications:** Automated morning briefings delivered via Web Push API at 8:00 AM daily.

    -----
