import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-black font-sans">
      {/* Simple Navigation */}
      <nav className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center text-white font-bold">✨</div>
          <span className="text-xl font-bold tracking-tight">TaskAI</span>
        </div>
        <div className="flex gap-4">
          <Link href="/login" className="px-4 py-2 text-sm font-medium hover:text-purple-600 transition">
            Login
          </Link>
          <Link href="/register" className="px-4 py-2 text-sm font-medium bg-black text-white dark:bg-white dark:text-black rounded-full hover:opacity-80 transition">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex flex-1 flex-col items-center justify-center text-center px-6">
        <div className="inline-block px-3 py-1 mb-6 text-xs font-semibold tracking-wider text-purple-600 uppercase bg-purple-100 rounded-full">
          Powered by Groq & Llama 3.3
        </div>
        <h1 className="max-w-4xl text-5xl md:text-7xl font-bold leading-tight tracking-tighter text-black dark:text-white">
          Manage tasks with <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-500">
            Artificial Intelligence.
          </span>
        </h1>
        <p className="max-w-2xl mt-6 text-lg md:text-xl text-zinc-600 dark:text-zinc-400 leading-relaxed">
          The only task manager that briefs you every morning. Get smart summaries, 
          priority alerts, and high-velocity focus powered by Groq.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 mt-10">
          <Link
            href="/register"
            className="flex h-14 items-center justify-center rounded-full bg-purple-600 px-8 text-lg font-semibold text-white transition-all hover:bg-purple-700 hover:shadow-lg hover:shadow-purple-200"
          >
            Start for Free
          </Link>
          <Link
            href="https://github.com/harshpreetsingh12/Task-manager"
            target="_blank"
            className="flex h-14 items-center justify-center rounded-full border border-zinc-200 dark:border-zinc-800 px-8 text-lg font-semibold transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-900"
          >
            View Source
          </Link>
        </div>

        {/* Floating Feature Tags */}
        <div className="mt-16 flex flex-wrap justify-center gap-8 opacity-50 grayscale hover:grayscale-0 transition-all">
          <div className="flex items-center gap-2 font-medium">⚡ Ultra Fast Inference</div>
          <div className="flex items-center gap-2 font-medium">🔒 Secure Auth</div>
          <div className="flex items-center gap-2 font-medium">🤖 Smart summarization</div>
        </div>
      </main>

      <footer className="py-8 text-center text-sm text-zinc-500 border-t border-zinc-100 dark:border-zinc-900">
        © 2026 TaskAI 
      </footer>
    </div>
  );
}