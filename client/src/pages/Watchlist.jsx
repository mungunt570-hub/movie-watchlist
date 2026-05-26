import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

const STATUS_LABELS = {
  'want-to-watch': { label: 'Want to Watch', color: 'text-gray-400' },
  'watching':      { label: 'Watching',       color: 'text-yellow-400' },
  'watched':       { label: 'Watched',         color: 'text-green-400' },
};

export default function Watchlist() {
  const [items,   setItems]   = useState([]);
  const [filter,  setFilter]  = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadWatchlist(); }, []);

  const loadWatchlist = async () => {
    try {
      const { data } = await api.get('/watchlist');
      setItems(data);
    } catch {}
    setLoading(false);
  };

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/watchlist/${id}`, { status });
      setItems(prev => prev.map(i => i._id === id ? { ...i, status } : i));
    } catch {}
  };

  const remove = async (id) => {
    try {
      await api.delete(`/watchlist/${id}`);
      setItems(prev => prev.filter(i => i._id !== id));
    } catch {}
  };

  const displayed = filter ? items.filter(i => i.status === filter) : items;

  if (loading) return <div className="text-center mt-20 text-gray-400">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-5xl text-white mb-6">My Watchlist</h1>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-8">
        {[['', 'All'], ...Object.entries(STATUS_LABELS).map(([k, v]) => [k, v.label])].map(([key, label]) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`badge py-1.5 px-4 cursor-pointer transition-colors ${
              filter === key ? 'bg-brand text-white' : 'hover:bg-dark-500'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {displayed.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-500 font-body mb-4">Nothing here yet.</p>
          <Link to="/movies" className="btn-primary">Browse Movies</Link>
        </div>
      ) : (
        <div className="space-y-3">
          {displayed.map(item => {
            const movie = item.movieId;
            if (!movie) return null;
            return (
              <div key={item._id} className="card flex items-center gap-4 p-4">
                {/* Poster thumb */}
                <img
                  src={movie.poster || `https://via.placeholder.com/60x90/1a1a1a/e50914?text=🎬`}
                  alt={movie.title}
                  className="w-12 h-16 object-cover rounded shrink-0"
                />

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <Link to={`/movies/${movie._id}`} className="font-sans text-lg text-white hover:text-brand transition-colors truncate block">
                    {movie.title}
                  </Link>
                  <div className="flex gap-2 mt-1">
                    {movie.genreIds?.slice(0, 2).map(g => <span key={g._id} className="badge">{g.name}</span>)}
                  </div>
                </div>

                {/* Status selector */}
                <select
                  value={item.status}
                  onChange={e => updateStatus(item._id, e.target.value)}
                  className="bg-dark-700 border border-dark-500 text-gray-300 text-sm rounded px-2 py-1 font-body focus:outline-none focus:border-brand"
                >
                  {Object.entries(STATUS_LABELS).map(([k, v]) => (
                    <option key={k} value={k}>{v.label}</option>
                  ))}
                </select>

                {/* Remove */}
                <button
                  onClick={() => remove(item._id)}
                  className="text-gray-600 hover:text-brand text-xl transition-colors ml-2"
                  title="Remove"
                >
                  ×
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
