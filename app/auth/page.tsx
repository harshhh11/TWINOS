'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Lock, Mail, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';

export default function AuthPage() {
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('director@airport.twinos.ai');
  const [password, setPassword] = useState('••••••••••••');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      // Store session state and redirect to dashboard
      if (typeof window !== 'undefined') {
        localStorage.setItem('twinos_user_authenticated', 'true');
        localStorage.setItem('twinos_user_email', email);
      }
      router.push('/');
    }, 600);
  };

  return (
    <div className="w-screen h-screen overflow-hidden bg-twin-bg flex items-center justify-center p-4 relative font-sans select-none">
      {/* Background Subtle Gradient Blobs */}
      <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Left Return to Landing */}
      <Link
        href="/"
        className="absolute top-8 left-8 flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-white transition-all shadow-glass"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to TwinOS</span>
      </Link>

      {/* Login / Sign Up Glass Card */}
      <div className="w-full max-w-md bg-[#12161E]/90 backdrop-blur-2xl border border-white/15 rounded-3xl p-8 shadow-2xl relative z-10 flex flex-col">
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-orange-600 to-amber-500 flex items-center justify-center shadow-orange-glow mb-3">
            <span className="text-white font-black text-2xl tracking-tighter">A</span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-1">
            TwinOS Operations Portal
          </h2>
          <p className="text-xs text-white/50 mt-1">
            Sign in with authorized operations credentials to access live digital twin telemetry.
          </p>
        </div>

        {/* Demo Fast Fill Badge */}
        <div className="mb-4 p-3 rounded-xl bg-orange-500/10 border border-orange-500/25 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-twin-orange shrink-0" />
            <span className="text-white/80 text-[11px]">Authorized Demo Access Configured</span>
          </div>
          <span className="text-[10px] font-bold text-twin-orange">1-CLICK LOGIN</span>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="text-white/60 block mb-1.5 font-medium">Operations Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-white/40 absolute left-3.5 top-3" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-twin-orange transition-colors"
                placeholder="officer@airport.twinos.ai"
              />
            </div>
          </div>

          <div>
            <label className="text-white/60 block mb-1.5 font-medium">Security Token / Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-white/40 absolute left-3.5 top-3" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-twin-orange transition-colors"
                placeholder="••••••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white font-bold text-xs shadow-orange-glow transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <span>{isLoading ? 'Verifying Credentials...' : 'Authenticate & Enter Twin'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        {/* Footer Toggle */}
        <div className="mt-6 text-center text-[11px] text-white/40">
          <span>Protected Infrastructure System. Unauthorized access is monitored.</span>
        </div>
      </div>
    </div>
  );
}
