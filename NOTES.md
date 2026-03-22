# 📝 Technical Decisions & Engineering Journal

### 🏗️ CommonJS vs ESM (Why I Switched)
When I started, I went with **Native ESM** because it's the modern standard. However, once I got into the thick of deployment on Render.

* **The Decision:** I made a strategic pivot to a **TypeScript-to-CommonJS** pipeline. 
* **The Result:** I still write modern import/export in dev, but the compiled build works reliably in production. It was a choice of **production stability**

### 🛡️ Security: Why I avoided LocalStorage
I chose to store JWTs in **HTTP-Only Cookies** rather than LocalStorage. 
* **The "Why":** LocalStorage is vulnerable to XSS attacks. By using cookies with the `HttpOnly` flag, the token is invisible to client-side scripts. Since cookies are automatically sent with every request, I can access the session directly within Next.js Server Components
* **The Trade-off:** This made the development harder—I had to carefully manage CORS preflights and ensure `credentials: include` was set on every frontend fetch—but the security gain for the user was worth the extra dev time.

### ⚡ Making AI feel fast: SSE Streaming
Waiting 5-10 seconds for an AI to finish "thinking" is a poor user experience. I implemented Server-Sent Events (SSE) to stream the briefing in real-time.

The Backend Challenge: Node.js likes to "buffer" (batch) data before sending it. Initially, the whole summary would just pop up at once at the end, defeating the purpose of a stream.

The Backend Fix: I bypassed the standard request-response cycle by writing directly to the response pipe (res.write). By setting text/event-stream headers, I established a "live pipe" that delivers words to the frontend as soon as the LLM generates them.

The Frontend Optimization: High-velocity data chunks from an LLM can trigger excessive React re-renders, which often leads to UI "stutter" or lag. To solve this, I implemented an Animation Buffer using requestAnimationFrame. Instead of updating the state on every single network packet, I synchronized the UI updates with the user's native display refresh rate (60Hz/120Hz). This ensures the "typing" effect looks smooth and professional.

Initially, I tried handling streaming with a normal JSON response, but that completely defeated the purpose since the UI only updated at the end. That’s when I switched to SSE.


### 🧠 Saving Money: Heuristic Fallbacks
I didn't want to burn API credits for empty task lists or crash the app if the AI provider went down.
* **The Solution:** I built a **Local Fallback Engine**. If the user has zero tasks, the system doesn't even call the AI; it uses local logic to generate a "Clean Slate" briefing.
* **The Clever Part:** I used a **Generator Function** to "fake" a stream for this local message. This way, the frontend doesn't care if the data is coming from an expensive LLM or a local script—the UI logic stays exactly the same.

### 📝 Adding the "Redux vs. Context" Note
🧩 State Management: Context API vs. Redux
    I chose to use the React Context API instead of Redux for this application.

    The "Why": For an application of this scale (handling Auth and a Task list), Redux introduces significant boilerplate and "over-engineering." Context API, provides a clean native way to manage global state without the overhead of external libraries.

    The Benefit: This keeps the frontend bundle size small and the data flow easier to reason about, which aligns with the goal of building a "minimal but functional" task manager.

### 🚀 What's next? (Future Roadmap)
* **Smart Search (RAG):** I want to implement **MongoDB Atlas Vector Search**. Instead of searching for the word "Gym," you could search for "Health," and the AI would find your gym tasks through semantic similarity.
* **Redis Caching:** AI summaries don't need to be re-generated if the tasks haven't changed. Caching them in Redis would make the app lightning-fast and save costs.
* **Proactive Briefings:** Using `node-cron` to send these summaries via **Web Push Notifications** at 8:00 AM daily, so the user doesn't even have to open the app to know their plan.
* **Testing:** Implement Playwright for End-to-End (E2E) testing of the AI streaming flow.