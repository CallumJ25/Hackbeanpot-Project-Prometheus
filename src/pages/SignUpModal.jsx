import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { isUsernameTaken, createUserAndPortfolio } from '../supabaseFunctions';

function SignUpModal({ isOpen, onClose, onSuccess }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function handleCreateAccount(e) {
    e?.preventDefault();
    setError('');
    const u = username?.trim();
    if (!u) {
      setError('Please choose a username.');
      return;
    }
    if (!email?.trim()) {
      setError('Please enter your email.');
      return;
    }
    if (!password) {
      setError('Please enter a password.');
      return;
    }
    try {
      setLoading(true);
      const taken = await isUsernameTaken(u);
      if (taken) {
        setError('Username already taken. Please choose another.');
        setLoading(false);
        return;
      }
      const { error: signUpError } = await supabase.auth.signUp({
        email: email.trim(),
        password
      });
      if (signUpError) throw signUpError;
      await createUserAndPortfolio(email.trim(), u);
      await supabase.auth.updateUser({ data: { username: u } });
      onSuccess?.();
      onClose?.();
      navigate('/dashboard', { replace: true });
      // Success: user is on dashboard. If email confirmation is required, they may need to confirm first.
    } catch (err) {
      setError(err.message || 'Could not create account.');
    } finally {
      setLoading(false);
    }
  }

  function handleCancel() {
    setError('');
    setUsername('');
    setEmail('');
    setPassword('');
    onClose?.();
  }

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="signup-modal-title"
    >
      <button
        type="button"
        onClick={handleCancel}
        className="absolute inset-0 bg-navy/60 backdrop-blur-sm"
        aria-label="Close"
      />
      <div className="relative w-full max-w-md rounded-2xl bg-cream shadow-xl border border-navy/10 p-6 sm:p-8">
        <div className="flex justify-between items-start mb-6">
          <h2 id="signup-modal-title" className="text-xl font-bold text-navy">
            Create Account
          </h2>
          <button
            type="button"
            onClick={handleCancel}
            className="text-navy/60 hover:text-navy p-1 rounded-full hover:bg-navy/10 transition-colors"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleCreateAccount}>
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-coral/20 text-coral text-sm">
              {error}
            </div>
          )}
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="block w-full mb-3 px-4 py-3 rounded-xl border border-navy/20 text-navy placeholder:text-navy/50 focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent"
            autoComplete="username"
          />
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
            autoComplete="new-password"
          />
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleCancel}
              className="flex-1 py-3 px-4 rounded-xl font-semibold border border-navy/30 text-navy hover:bg-navy/5 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 px-4 rounded-xl font-semibold bg-teal text-white hover:bg-teal-light transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating…' : 'Create Account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SignUpModal;
