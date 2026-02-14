import React, { useState } from 'react';
import { supabase } from '../supabaseClient';

function Auth() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function handleSignUp() {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password
      });
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
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password
      });
      if (error) throw error;
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: '40px', maxWidth: '400px', margin: '0 auto' }}>
      <h2>Welcome to Prometheus</h2>
      <p>Sign in or create an account</p>
      
      <input
        type="email"
        placeholder="Your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ 
          display: 'block', 
          margin: '10px 0', 
          padding: '10px', 
          width: '100%',
          fontSize: '16px'
        }}
      />
      
      <input
        type="password"
        placeholder="Your password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ 
          display: 'block', 
          margin: '10px 0', 
          padding: '10px', 
          width: '100%',
          fontSize: '16px'
        }}
      />
      
      <button 
        onClick={handleSignIn} 
        disabled={loading}
        style={{ 
          margin: '5px', 
          padding: '10px 20px',
          fontSize: '16px',
          cursor: 'pointer'
        }}
      >
        Sign In
      </button>
      
      <button 
        onClick={handleSignUp} 
        disabled={loading}
        style={{ 
          margin: '5px', 
          padding: '10px 20px',
          fontSize: '16px',
          cursor: 'pointer'
        }}
      >
        Sign Up
      </button>
    </div>
  );
}

export default Auth;