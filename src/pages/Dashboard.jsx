import React, { useEffect, useState } from 'react';
import { createUserAndPortfolio, getUserData, getLeaderboard } from '../supabaseFunctions';

function Dashboard({ session }) {
  const [userData, setUserData] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('roi'); // 'roi', 'balance', 'profit', 'year'
  const [sortOrder, setSortOrder] = useState('desc'); // 'asc' or 'desc'

  useEffect(() => {
    loadUserData();
    loadLeaderboard();
  }, [session]);

  async function loadUserData() {
    try {
      const email = session.user.email;
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

  const sortedLeaderboard = [...leaderboard].sort((a, b) => {
    let aVal, bVal;
    
    switch(sortBy) {
      case 'roi':
        aVal = a.roi;
        bVal = b.roi;
        break;
      case 'balance':
        aVal = a.current_balance;
        bVal = b.current_balance;
        break;
      case 'profit':
        aVal = a.profit;
        bVal = b.profit;
        break;
      case 'year':
        aVal = a.investment_year || 0;
        bVal = b.investment_year || 0;
        break;
      default:
        return 0;
    }
    
    return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-emerald-400"></div>
      </div>
    );
  }

  const portfolio = userData?.portfolios?.[0];

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Animated background gradient */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12 animate-fade-in">
          <h1 className="font-display text-5xl font-bold bg-gradient-to-r from-emerald-400 to-emerald-900 bg-clip-text text-transparent mb-2">
            Welcome back, {userData?.username}! 👋
          </h1>
          <p className="text-slate-400">The value investment journeys of everyone on Prometheus.</p>
        </div>

        {/* Portfolio Stats */}
        {portfolio && (
          <div className="grid md:grid-cols-3 gap-6 mb-12 animate-slide-up">
            <div className="bg-slate-800/50 backdrop-blur-lg rounded-2xl p-6 border border-slate-700/50 hover:border-emerald-500/50 transition-all duration-300 hover:scale-105">
              <p className="text-slate-400 text-sm mb-2">Total Balance</p>
              <p className="text-4xl font-bold text-emerald-400">
                ${portfolio.current_balance.toFixed(2)}
              </p>
              <div className="mt-3 h-1 bg-slate-700 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 animate-shimmer" style={{ width: '70%' }}></div>
              </div>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-lg rounded-2xl p-6 border border-slate-700/50 hover:border-emerald-500/50 transition-all duration-300 hover:scale-105" style={{ animationDelay: '0.1s' }}>
              <p className="text-slate-400 text-sm mb-2">Cash Available</p>
              <p className="text-4xl font-bold text-white">
                ${portfolio.cash_available.toFixed(2)}
              </p>
              <div className="mt-3 h-1 bg-slate-700 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-slate-400 to-slate-600 animate-shimmer" style={{ width: '50%' }}></div>
              </div>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-lg rounded-2xl p-6 border border-slate-700/50 hover:border-emerald-500/50 transition-all duration-300 hover:scale-105" style={{ animationDelay: '0.2s' }}>
              <p className="text-slate-400 text-sm mb-2">ROI</p>
              <p className={`text-4xl font-bold ${portfolio.roi >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {portfolio.roi >= 0 ? '+' : ''}{portfolio.roi.toFixed(2)}%
              </p>
              <div className="mt-3 flex items-center gap-2 text-sm">
                <span className={portfolio.roi >= 0 ? 'text-emerald-400' : 'text-red-400'}>
                  {portfolio.roi >= 0 ? '↑' : '↓'}
                </span>
                <span className="text-slate-400">
                  {portfolio.roi >= 0 ? 'Profit' : 'Loss'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Leaderboard */}
        <div className="bg-slate-800/50 backdrop-blur-lg rounded-2xl p-8 border border-slate-700/50 animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-emerald-400">🏆 Leaderboard</h2>
            
            {/* Sort Dropdown */}
            <div className="flex gap-3">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 bg-slate-700 rounded-lg border border-slate-600 focus:border-emerald-500 focus:outline-none cursor-pointer transition-colors"
              >
                <option value="roi">Sort by ROI</option>
                <option value="balance">Sort by Balance</option>
                <option value="profit">Sort by Profit</option>
                <option value="year">Sort by Year</option>
              </select>
              
              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg border border-slate-600 transition-colors"
              >
                {sortOrder === 'asc' ? '↑ Asc' : '↓ Desc'}
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-slate-700">
                  <th className="px-4 py-4 text-left text-emerald-400 font-semibold">Rank</th>
                  <th className="px-4 py-4 text-left text-emerald-400 font-semibold">Username</th>
                  <th className="px-4 py-4 text-right text-emerald-400 font-semibold">Year</th>
                  <th className="px-4 py-4 text-right text-emerald-400 font-semibold">Balance</th>
                  <th className="px-4 py-4 text-right text-emerald-400 font-semibold">Profit</th>
                  <th className="px-4 py-4 text-right text-emerald-400 font-semibold">ROI</th>
                </tr>
              </thead>
              <tbody>
                {sortedLeaderboard.map((user, index) => {
                  const isCurrentUser = user.email === session.user.email;
                  return (
                    <tr 
                      key={index}
                      className={`border-b border-slate-700/50 hover:bg-slate-700/30 transition-all duration-200 ${
                        isCurrentUser ? 'bg-emerald-500/10 border-emerald-500/30' : ''
                      }`}
                      style={{ animation: `fadeInRow 0.3s ease-out ${index * 0.05}s both` }}
                    >
                      <td className="px-4 py-4">
                        <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-bold ${
                          index === 0 ? 'bg-yellow-500/20 text-yellow-400' :
                          index === 1 ? 'bg-slate-400/20 text-slate-300' :
                          index === 2 ? 'bg-orange-500/20 text-orange-400' :
                          'bg-slate-700/50 text-slate-400'
                        }`}>
                          {index + 1}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <span className={`font-semibold ${isCurrentUser ? 'text-emerald-400' : 'text-white'}`}>
                            {user.username}
                          </span>
                          {isCurrentUser && (
                            <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded-full">You</span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4 text-right text-slate-300">
                        {user.investment_year || 'N/A'}
                      </td>
                      <td className="px-4 py-4 text-right font-semibold text-white">
                        ${user.current_balance.toFixed(2)}
                      </td>
                      <td className={`px-4 py-4 text-right font-semibold ${
                        user.profit >= 0 ? 'text-emerald-400' : 'text-red-400'
                      }`}>
                        {user.profit >= 0 ? '+' : ''}${user.profit.toFixed(2)}
                      </td>
                      <td className="px-4 py-4 text-right">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full font-bold ${
                          user.roi >= 0 
                            ? 'bg-emerald-500/20 text-emerald-400' 
                            : 'bg-red-500/20 text-red-400'
                        }`}>
                          {user.roi >= 0 ? '↑' : '↓'}
                          {user.roi.toFixed(2)}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        @keyframes fadeInRow {
          from {
            opacity: 0;
            transform: translateX(-10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }

        .animate-slide-up {
          animation: slide-up 0.6s ease-out;
        }

        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </div>
  );
}

export default Dashboard;