import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api';

export default function Dashboard() {
  const { user } = useAuth();
  const [stats,   setStats]   = useState({ watchlist: 0, watched: 0, reviews: 0 });
  const [recent,  setRecent]  = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [wlRes, revRes] = await Promise.all([
          api.get('/watchlist'),
          api.get(`/reviews/movie/all`).catch(() => ({ data: [] })),
        ]);
        const wl = wlRes.data;
        const watched = wl.filter(i => i.status === 'watched').length;
        setStats({ watchlist: wl.length, watched, reviews: 0 });
        setRecent(wl.slice(0, 4));
      } catch {}
      setLoading(false);
    };
    load();
  }, []);

  if (loading) return <div className="text-center mt-20 text-gray-400">Loading...</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-5xl text-white mb-2">Dashboard</h1>
      <p className="text-gray-400 font-body mb-10">Welcome back, <span className="text-white">{user?.username}</span></p>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4 mb-10">
        {[
          { label: 'In Watchlist', value: stats.watchlist, color: 'text-brand' },
          { label: 'Watched',      value: stats.watched,   color: 'text-green-400' },
          { label: 'Reviews',      value: stats.reviews,   color: 'text-yellow-400' },
        ].map(s => (
          <div key={s.label} className="bg-dark-800 border border-dark-600 rounded-lg p-5 text-center">
            <p className={`text-4xl font-sans ${s.color}`}>{s.value}</p>
            <p className="text-gray-400 text-sm font-body mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Quick links */}
      <div className="flex gap-3 mb-10">
        <Link to="/movies"    className="btn-primary">Browse Movies</Link>
        <Link to="/watchlist" className="btn-secondary">My Watchlist</Link>
        <Link to="/profile"   className="btn-secondary">Edit Profile</Link>
      </div>

      {/* Recent watchlist */}
      {recent.length > 0 && (
        <div>
          <h2 className="text-2xl text-white mb-4">Recently Added</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {recent.map(item => (
              <Link
                key={item._id}
                to={`/movies/${item.movieId?._id}`}
                className="card p-3 block hover:border-brand transition-colors"
              >
                <p className="font-sans text-white truncate">{item.movieId?.title}</p>
                <span className={`text-xs font-body mt-1 inline-block ${
                  item.status === 'watched'       ? 'text-green-400' :
                  item.status === 'watching'      ? 'text-yellow-400' : 'text-gray-400'
                }`}>
                  {item.status.replace(/-/g, ' ')}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
