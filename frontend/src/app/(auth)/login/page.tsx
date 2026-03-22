'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authService } from '@/services/auth.service';
import { showToast } from '@/lib/toast';

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await authService.login(formData);

      if(res.ok){
        showToast.success('Welcome back!', 'Redirecting to your dashboard...');
        router.push('/dashboard');
        router.refresh();
      }
      else{
          showToast.error('Authentication Error', 'Login attempt failed please check email or password');
      }
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Connection failed';
      showToast.error('Authentication Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-black text-white px-4">
      {/* Background Glow Effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-600/10 blur-[120px] rounded-full -z-10" />

      <div className="w-full max-w-md p-8 bg-zinc-900/50 border border-zinc-800 rounded-3xl backdrop-blur-xl shadow-2xl">
        <div className="text-center mb-8">
          <div className="inline-block p-3 rounded-2xl bg-purple-600/20 text-purple-400 mb-4 text-2xl">🔑</div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome Back</h1>
          <p className="text-zinc-400 mt-2">Sign in to access your AI briefings</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-medium text-zinc-500 ml-1">Email Address</label>
            <input 
              type="email" 
              placeholder="name@example.com" 
              required
              className="w-full p-4 bg-zinc-800/50 border border-zinc-700 rounded-2xl outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all placeholder:text-zinc-600"
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between items-center ml-1">
              <label className="text-xs font-medium text-zinc-500">Password</label>
              {/* <Link href="#" className="text-[10px] text-purple-400 hover:underline">Forgot password?</Link> */}
            </div>
            <input 
              type="password" 
              placeholder="••••••••" 
              required
              className="w-full p-4 bg-zinc-800/50 border border-zinc-700 rounded-2xl outline-none focus:ring-2 focus:ring-purple-500 transition-all placeholder:text-zinc-600"
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full mt-2 bg-purple-600 hover:bg-purple-700 text-white p-4 rounded-2xl font-bold transition-all transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-600/20"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                Verifying...
              </span>
            ) : 'Sign In'}
          </button>
        </form>

        <p className="mt-8 text-center text-zinc-500 text-sm">
          Don't have an account? <Link href="/register" className="text-purple-400 font-bold hover:text-purple-300 transition-colors">Register for free</Link>
        </p>
      </div>
    </main>
  );
}