'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Film, UserPlus, Mail, Lock, User, AlertCircle, Loader2 } from 'lucide-react';
import { signUpUser } from '@/lib/supabase';

export default function RegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      await signUpUser({ email, password, fullName, username: username || undefined });
      setSuccessMsg('Account created successfully! Redirecting to login...');
      setTimeout(() => {
        router.push('/login');
      }, 1500);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Registration failed. Please check details and try again.';
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
          <div className="w-12 h-12 rounded-2xl bg-cinema-gold flex items-center justify-center mx-auto shadow-lg shadow-cinema-gold/30">
            <Film className="w-7 h-7 text-cinema-bg" />
          </div>
          <h1 className="font-display font-black text-2xl text-white">Create Account</h1>
          <p className="text-xs text-cinema-muted">Join the Indian Short Films community</p>
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

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="text-xs text-cinema-muted font-medium block mb-1">Full Name</label>
            <div className="relative">
              <User className="absolute left-3.5 top-3 w-4 h-4 text-cinema-muted" />
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Aarav Sharma"
                className="w-full bg-cinema-surface border border-cinema-border rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-cinema-gold"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-cinema-muted font-medium block mb-1">Username (Optional)</label>
            <div className="relative">
              <User className="absolute left-3.5 top-3 w-4 h-4 text-cinema-muted" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. aarav_cinema"
                className="w-full bg-cinema-surface border border-cinema-border rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-cinema-gold"
              />
            </div>
          </div>

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
                className="w-full bg-cinema-surface border border-cinema-border rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-cinema-gold"
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
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-cinema-surface border border-cinema-border rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-cinema-gold"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-cinema-gold hover:bg-yellow-500 text-cinema-bg text-xs font-bold shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />} Register Account
          </button>
        </form>

        <div className="text-center text-xs text-cinema-muted pt-2 border-t border-cinema-border/50">
          Already have an account?{' '}
          <Link href="/login" className="text-cinema-accent font-bold hover:underline">
            Sign In
          </Link>
        </div>

      </div>
    </div>
  );
}
