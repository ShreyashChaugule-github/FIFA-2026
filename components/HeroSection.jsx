'use client';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const { signInWithGoogle, signInWithEmail, signUpWithEmail } = useAuth();
  const [mode, setMode] = useState('signin'); // 'signin' | 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const formatAuthError = (errorValue) => {
    const message = errorValue instanceof Error ? errorValue.message : String(errorValue ?? '');
    return message.replace('Firebase: ', '').replace(/ \(auth\/.*\)\.?/, '');
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);
    try {
      await signInWithGoogle();
    } catch (e) {
      setError(formatAuthError(e));
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setError('');
    if (mode === 'signup' && password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    try {
      if (mode === 'signin') {
        await signInWithEmail(email, password);
      } else {
        await signUpWithEmail(email, password);
      }
    } catch (err) {
      setError(formatAuthError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-white">

      {/* Left: Branding Panel */}
      <div className="relative w-full lg:w-1/2 bg-black flex flex-col justify-between p-8 md:p-14 min-h-[40vh] lg:min-h-screen overflow-hidden">
        {/* Dot grid overlay */}
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.4) 0.75px, transparent 0.75px)',
            backgroundSize: '18px 18px',
          }}
        />

        {/* Top: Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-9 h-9 bg-white text-black flex items-center justify-center font-bold text-xl rounded-sm">
            S
          </div>
          <span className="text-white font-bold text-2xl tracking-tight">StadiumIQ</span>
        </div>

        {/* Middle: Hero Copy */}
        <div className="relative z-10 flex flex-col gap-6 py-10 lg:py-0">
          <div className="font-mono text-xs uppercase tracking-widest text-neutral-500">
            / FIFA World Cup 2026
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-[1.1] tracking-tight max-w-md">
            The Stadium That Thinks With You
          </h1>
          <p className="text-neutral-400 text-lg max-w-sm leading-relaxed">
            AI-powered navigation, real-time crowd intelligence, and multilingual assistance — all in one platform.
          </p>

          <div className="flex gap-4 flex-wrap mt-2">
            {['16 Venues', '48 Nations', '5M+ Fans', 'AI-Native'].map((tag) => (
              <span key={tag} className="font-mono text-[11px] uppercase border border-neutral-700 text-neutral-400 px-3 py-1.5 rounded-sm">
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom: Attribution */}
        <div className="relative z-10 font-mono text-[10px] text-neutral-600 uppercase tracking-widest">
          Powered by Google Gemini AI
        </div>
      </div>

      {/* Right: Auth Card */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-14 bg-white">
        <div className="w-full max-w-md">

          {/* Header */}
          <div className="mb-10">
            <div className="font-mono text-xs uppercase tracking-widest text-neutral-400 mb-4">
              / {mode === 'signin' ? 'Welcome Back' : 'Create Account'}
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-black tracking-tight">
              {mode === 'signin' ? 'Sign in to StadiumIQ' : 'Join StadiumIQ'}
            </h2>
            <p className="text-neutral-500 mt-2">
              {mode === 'signin'
                ? 'Access the AI command center and live ops dashboard.'
                : 'Create your account to get started.'}
            </p>
          </div>

          {/* Google Sign-In */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            aria-label="Continue with Google"
            aria-busy={loading}
            className="w-full flex items-center justify-center gap-3 border border-neutral-200 bg-white hover:bg-neutral-50 text-black font-medium py-3 px-6 rounded-lg transition-colors mb-6 disabled:opacity-50"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5 shrink-0">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-neutral-200" />
            <span className="font-mono text-[10px] uppercase text-neutral-400 tracking-widest">or</span>
            <div className="flex-1 h-px bg-neutral-200" />
          </div>

          {/* Email/Password Form */}
          <form onSubmit={handleEmailAuth} className="flex flex-col gap-4">
            <div>
              <label htmlFor="email" className="font-mono text-xs uppercase text-neutral-500 block mb-2">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                inputMode="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full border border-neutral-200 rounded-lg px-4 py-3 text-black bg-white focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-colors"
              />
            </div>
            <div>
              <label htmlFor="password" className="font-mono text-xs uppercase text-neutral-500 block mb-2">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                minLength="8"
                autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full border border-neutral-200 rounded-lg px-4 py-3 text-black bg-white focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-colors"
              />
            </div>
            {mode === 'signup' && (
              <div>
                <label htmlFor="confirm-password" className="font-mono text-xs uppercase text-neutral-500 block mb-2">Confirm Password</label>
                <input
                  id="confirm-password"
                  name="confirm-password"
                  type="password"
                  required
                  minLength="8"
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full border border-neutral-200 rounded-lg px-4 py-3 text-black bg-white focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-colors"
                />
              </div>
            )}

            {error && (
              <div role="alert" aria-live="assertive" className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              aria-busy={loading}
              className="w-full bg-black text-white font-mono uppercase text-sm tracking-wide py-3 rounded-lg hover:bg-neutral-800 transition-colors disabled:opacity-50 mt-2"
            >
              {loading ? 'Please wait...' : mode === 'signin' ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          {/* Toggle */}
          <p className="text-center text-sm text-neutral-500 mt-6">
            {mode === 'signin' ? "Don't have an account?" : 'Already have an account?'}{' '}
            <button
              onClick={() => { setMode(mode === 'signin' ? 'signup' : 'signin'); setError(''); }}
              className="font-bold text-black hover:underline"
            >
              {mode === 'signin' ? 'Sign Up' : 'Sign In'}
            </button>
          </p>

        </div>
      </div>
    </div>
  );
}
