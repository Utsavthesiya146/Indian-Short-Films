'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Film, LogIn, Mail, Lock, AlertCircle, Loader2 } from 'lucide-react';
import { signInUser } from '@/lib/supabase';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      await signInUser({ email, password });
      setSuccessMsg('Successfully signed in! Redirecting to home page...');
      setTimeout(() => {
        router.push('/');
        router.refresh();
      }, 1000);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Invalid login credentials. Please try again.';
      setErrorMsg(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="bg-cinema-card rounded-3xl p-8 border border-cinema-border shadow-2xl space-y-6">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-cinema-accent flex items-center justify-center mx-auto shadow-lg shadow-cinema-accent/30">
            <Film className="w-7 h-7 text-white" />
          </div>
          <h1 className="font-display font-black text-2xl text-white">Welcome Back</h1>
          <p className="text-xs text-cinema-muted">Sign in to sync watchlists and review short films</p>
        </div>

        {errorMsg && (
          <div className="p-3.5 bg-rose-500/10 border border-rose-500/30 text-rose-400 rounded-2xl text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-2xl text-center text-xs font-semibold">
            {successMsg}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-xs text-cinema-muted font-medium block mb-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 w-4 h-4 text-cinema-muted" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full bg-cinema-surface border border-cinema-border rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-cinema-accent"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-cinema-muted font-medium block mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 w-4 h-4 text-cinema-muted" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-cinema-surface border border-cinema-border rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-cinema-accent"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-cinema-accent hover:bg-cinema-accentHover text-white text-xs font-bold shadow-lg shadow-cinema-accent/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogIn className="w-4 h-4" />} Sign In
          </button>
        </form>

        <div className="text-center text-xs text-cinema-muted pt-2 border-t border-cinema-border/50">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="text-cinema-gold font-bold hover:underline">
            Register Here
          </Link>
        </div>

      </div>
    </div>
  );
}
