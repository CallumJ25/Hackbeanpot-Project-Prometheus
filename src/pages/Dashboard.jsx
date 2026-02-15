import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { createUserAndPortfolio, getUserData, getLeaderboard } from '../supabaseFunctions';

function Dashboard({ session }) {
  const [userData, setUserData] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserData();
    loadLeaderboard();
  }, [session]);

  async function loadUserData() {
    try {
      const email = session.user.email;
      // Ensure user row exists (optional username for legacy auth users)
      const username = session.user.user_metadata?.username;
      await createUserAndPortfolio(email, username || undefined);
      const data = await getUserData(email);
      setUserData(data);
    } catch (error) {
      console.error('Error loading user:', error);
    } finally {
      setLoading(false);
    }
  }

  async function loadLeaderboard() {
    try {
      const data = await getLeaderboard(10);
      setLeaderboard(data);
    } catch (error) {
      console.error('Error loading leaderboard:', error);
    }
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
  }

  if (loading) {
    return <div style={{ padding: '40px' }}>Loading...</div>;
  }

  const portfolio = userData?.portfolios?.[0];

  return (
    <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Welcome, {userData?.username}!</h2>
        <button onClick={handleSignOut} style={{ padding: '10px 20px' }}>
          Sign Out
        </button>
      </div>
      
      {portfolio && (
        <div style={{ 
          marginTop: '30px', 
          padding: '20px', 
          border: '1px solid #ddd',
          borderRadius: '8px'
        }}>
          <h3>Your Portfolio</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
            <div>
              <p style={{ fontSize: '14px', color: '#666' }}>Total Balance</p>
              <p style={{ fontSize: '24px', fontWeight: 'bold' }}>
                ${portfolio.current_balance.toFixed(2)}
              </p>
            </div>
            <div>
              <p style={{ fontSize: '14px', color: '#666' }}>Cash Available</p>
              <p style={{ fontSize: '24px', fontWeight: 'bold' }}>
                ${portfolio.cash_available.toFixed(2)}
              </p>
            </div>
            <div>
              <p style={{ fontSize: '14px', color: '#666' }}>ROI</p>
              <p style={{ 
                fontSize: '24px', 
                fontWeight: 'bold',
                color: portfolio.roi >= 0 ? 'green' : 'red'
              }}>
                {portfolio.roi.toFixed(2)}%
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Leaderboard */}
      <div style={{ marginTop: '40px' }}>
        <h3>Leaderboard 🏆</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #ddd' }}>
              <th style={{ padding: '10px', textAlign: 'left' }}>Rank</th>
              <th style={{ padding: '10px', textAlign: 'left' }}>Username</th>
              <th style={{ padding: '10px', textAlign: 'right' }}>Balance</th>
              <th style={{ padding: '10px', textAlign: 'right' }}>Profit</th>
              <th style={{ padding: '10px', textAlign: 'right' }}>ROI</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((user) => (
              <tr key={user.rank} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '10px' }}>{user.rank}</td>
                <td style={{ padding: '10px' }}>{user.username}</td>
                <td style={{ padding: '10px', textAlign: 'right' }}>
                  ${user.current_balance.toFixed(2)}
                </td>
                <td style={{ 
                  padding: '10px', 
                  textAlign: 'right',
                  color: user.profit >= 0 ? 'green' : 'red'
                }}>
                  ${user.profit.toFixed(2)}
                </td>
                <td style={{ 
                  padding: '10px', 
                  textAlign: 'right',
                  color: user.roi >= 0 ? 'green' : 'red',
                  fontWeight: 'bold'
                }}>
                  {user.roi.toFixed(2)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Dashboard;