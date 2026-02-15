import React, { useState } from 'react';
import { supabase } from '../supabaseClient';

function AuthModal({ isOpen, onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function handleSignUp() {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;
      alert('Check your email for confirmation link!');
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleSignIn() {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      onSuccess?.();
      onClose?.();
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
    >
      {/* Backdrop */}
      <button
        type="button"
        onClick={onClose}
        className="absolute inset-0 bg-navy/60 backdrop-blur-sm"
        aria-label="Close"
      />
      {/* Modal card */}
      <div className="relative w-full max-w-md rounded-2xl bg-cream shadow-xl border border-navy/10 p-6 sm:p-8">
        <div className="flex justify-between items-start mb-6">
          <h2 id="auth-modal-title" className="text-xl font-bold text-navy">
            Welcome to Prometheus
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
        <p className="text-navy/80 mb-4">Sign in or create an account</p>

        <input
          type="email"
          placeholder="Your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="block w-full mb-3 px-4 py-3 rounded-xl border border-navy/20 text-navy placeholder:text-navy/50 focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent"
        />
        <input
          type="password"
          placeholder="Your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="block w-full mb-4 px-4 py-3 rounded-xl border border-navy/20 text-navy placeholder:text-navy/50 focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent"
        />

        <div className="flex gap-3">
          <button
            type="button"
            onClick={handleSignIn}
            disabled={loading}
            className="flex-1 py-3 px-4 rounded-xl font-semibold bg-teal text-white hover:bg-teal-light transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
          <button
            type="button"
            onClick={handleSignUp}
            disabled={loading}
            className="flex-1 py-3 px-4 rounded-xl font-semibold bg-navy text-cream hover:bg-navy/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
}

export default AuthModal;
