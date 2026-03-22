'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authService } from '@/services/auth.service';
import { showToast } from '@/lib/toast';

export default function RegisterPage() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // add zod validator too if this becomes more complex data
      const res = await authService.register(formData)
      if(res.ok){
        router.push('/dashboard');
        router.refresh();
      }
      else{
        showToast.error('Register Failed','Something went wrong. Please try again.');
      }

    } catch (err) {
       const errorMessage = err instanceof Error ? err.message : 'Something went wrong. Please try again.';
      showToast.error('Register Failed', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-black text-white">
      <div className="w-full max-w-md p-8 bg-zinc-900/50 border border-zinc-800 rounded-3xl backdrop-blur-xl shadow-2xl">
        <div className="text-center mb-8">
          <div className="inline-block p-3 rounded-2xl bg-purple-600/20 text-purple-400 mb-4 text-2xl">✨</div>
          <h1 className="text-3xl font-bold tracking-tight">Create Account</h1>
          <p className="text-zinc-400 mt-2">Join TaskAI to start managing with Groq</p>
        </div>

        {/* {error && <p className="mb-4 text-sm text-red-400 bg-red-400/10 p-3 rounded-xl border border-red-400/20">{error}</p>} */}

        <form onSubmit={handleRegister} className="space-y-4">
          <input 
            type="text" placeholder="Full Name" required
            className="w-full p-4 bg-zinc-800/50 border border-zinc-700 rounded-2xl outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <input 
            type="email" placeholder="Email Address" required
            className="w-full p-4 bg-zinc-800/50 border border-zinc-700 rounded-2xl outline-none focus:ring-2 focus:ring-purple-500 transition-all"
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          <input 
            type="password" placeholder="Password" required
            className="w-full p-4 bg-zinc-800/50 border border-zinc-700 rounded-2xl outline-none focus:ring-2 focus:ring-purple-500 transition-all"
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />
          <button 
            type="submit" disabled={loading}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white p-4 rounded-2xl font-bold transition-all transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating Account...' : 'Get Started'}
          </button>
        </form>

        <p className="mt-6 text-center text-zinc-500 text-sm">
          Already have an account? <Link href="/login" className="text-purple-400 font-bold hover:text-purple-300">Login</Link>
        </p>
      </div>
    </main>
  );
}