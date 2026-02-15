import React, { useState } from 'react';
import { supabase } from '../supabaseClient';

function SignInModal({ isOpen, onClose, onSuccess, onOpenSignUp }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function handleSignIn(e) {
    e?.preventDefault();
    setError('');
    if (!email.trim() || !password) {
      setError('Please enter email and password.');
      return;
    }
    try {
      setLoading(true);
      const { error: err } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
      if (err) throw err;
      onSuccess?.();
      onClose?.();
    } catch (err) {
      setError(err.message || 'Sign in failed.');
    } finally {
      setLoading(false);
    }
  }

  function handleOpenSignUp() {
    onClose?.();
    onOpenSignUp?.();
  }

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="signin-modal-title"
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute inset-0 bg-navy/60 backdrop-blur-sm"
        aria-label="Close"
      />
      <div className="relative w-full max-w-md rounded-2xl bg-cream shadow-xl border border-navy/10 p-6 sm:p-8">
        <div className="flex justify-between items-start mb-6">
          <h2 id="signin-modal-title" className="text-xl font-bold text-navy">
            Sign In
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-navy/60 hover:text-navy p-1 rounded-full hover:bg-navy/10 transition-colors"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSignIn}>
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-coral/20 text-coral text-sm">
              {error}
            </div>
          )}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="block w-full mb-3 px-4 py-3 rounded-xl border border-navy/20 text-navy placeholder:text-navy/50 focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent"
            autoComplete="email"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="block w-full mb-4 px-4 py-3 rounded-xl border border-navy/20 text-navy placeholder:text-navy/50 focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent"
            autoComplete="current-password"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl font-semibold bg-teal text-white hover:bg-teal-light transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <p className="mt-6 text-center text-navy/80 text-sm">
          Don&apos;t have an account?{' '}
          <button
            type="button"
            onClick={handleOpenSignUp}
            className="text-teal font-semibold hover:underline"
          >
            Sign Up
          </button>
        </p>
      </div>
    </div>
  );
}

export default SignInModal;
