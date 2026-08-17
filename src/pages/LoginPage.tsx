import React, { useState } from 'react';
import { Lock, Mail, ArrowRight, ShieldCheck, User, Sparkles, AlertCircle, Database } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { SEO } from '../components/common/SEO';

interface LoginPageProps {
  onNavigate: (path: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onNavigate }) => {
  const { login, signUp, authError } = useAuth();
  const { success, error: toastError } = useToast();

  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    try {
      if (mode === 'signin') {
        const res = await login(email, password);
        if (res.success) {
          success('Signed In Successfully', `Welcome back, ${email}!`);
          if (email.includes('admin') || email === 'admin@worlddollar.quest') {
            onNavigate('/admin');
          } else {
            onNavigate('/quest-dashboard');
          }
        } else {
          toastError('Authentication Failed', res.error || 'Check your credentials.');
        }
      } else {
        const res = await signUp(email, password, name);
        if (res.success) {
          success('Account Created', 'Check your inbox to verify your email or sign in directly.');
          setMode('signin');
        } else {
          toastError('Sign Up Failed', res.error || 'Could not register account.');
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDemoUser = async () => {
    setLoading(true);
    await login('solopreneur@worlddollar.quest', 'quest2026demo');
    success('Explorer Mode Active', 'Logged in as Quest Explorer.');
    onNavigate('/quest-dashboard');
    setLoading(false);
  };

  const handleDemoAdmin = async () => {
    setLoading(true);
    await login('admin@worlddollar.quest', 'worlddollarquest2026');
    success('Admin Access Granted', 'Connected to Supabase Admin Console.');
    onNavigate('/admin');
    setLoading(false);
  };

  return (
    <>
      <SEO title="Sign In & Account Portal" description="Access World Dollar Quest dashboard and Supabase control." />

      <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-16 px-4 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3">
          <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-teal-500/10 border border-teal-500/30 text-teal-400">
            <Lock className="w-6 h-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {mode === 'signin' ? 'Sign in to World Dollar Quest' : 'Create Your Quest Account'}
          </h1>
          <p className="text-xs text-slate-400">
            Learn • Work • Earn with practical tools and cloud-synchronized progress.
          </p>

          <div className="flex items-center justify-center gap-1.5 pt-1 text-[11px] font-mono text-teal-400">
            <Database className="w-3.5 h-3.5" />
            <span>Supabase Cloud Auth Active</span>
          </div>
        </div>

        <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-6">
            {/* Mode Switcher Tabs */}
            <div className="grid grid-cols-2 gap-1 p-1 bg-slate-950 rounded-2xl border border-slate-800 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setMode('signin')}
                className={`py-2 rounded-xl transition-all ${
                  mode === 'signin'
                    ? 'bg-teal-500 text-slate-950 font-bold shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => setMode('signup')}
                className={`py-2 rounded-xl transition-all ${
                  mode === 'signup'
                    ? 'bg-teal-500 text-slate-950 font-bold shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Create Account
              </button>
            </div>

            {authError && (
              <div className="p-3.5 rounded-2xl bg-rose-950/40 border border-rose-500/30 flex items-start gap-2.5 text-xs text-rose-300">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{authError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'signup' && (
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Your Full Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Alex Mercer"
                      className="w-full pl-10 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-xs focus:outline-none focus:border-teal-400"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full pl-10 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-xs focus:outline-none focus:border-teal-400"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-xs focus:outline-none focus:border-teal-400"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl bg-teal-500 hover:bg-teal-400 disabled:opacity-50 text-slate-950 font-bold text-xs transition-colors flex items-center justify-center gap-2 shadow-md shadow-teal-500/20"
              >
                <span>{loading ? 'Authenticating...' : mode === 'signin' ? 'Sign In with Supabase' : 'Create Account'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Quick 1-Click Access for Testing */}
            <div className="pt-4 border-t border-slate-800 space-y-3">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block text-center">
                Fast Quick-Launch Accounts
              </span>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={handleDemoUser}
                  className="p-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-teal-300 transition-colors flex items-center justify-center gap-1.5"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>User Portal</span>
                </button>
                <button
                  type="button"
                  onClick={handleDemoAdmin}
                  className="p-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-indigo-300 transition-colors flex items-center justify-center gap-1.5"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Admin Console</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
