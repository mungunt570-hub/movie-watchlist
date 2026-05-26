import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-4 py-24 bg-gradient-to-b from-dark-900 via-dark-800 to-dark-900">
        <p className="text-brand font-body text-sm tracking-widest uppercase mb-4">Your Personal Cinema</p>
        <h1 className="text-6xl md:text-8xl text-white mb-6 leading-none">
          Track Every<br />
          <span className="text-brand">Movie</span>
        </h1>
        <p className="text-gray-400 font-body max-w-md mb-10 text-base leading-relaxed">
          Build your watchlist, write reviews, discover new films.
          All in one beautiful, simple app.
        </p>

        <div className="flex gap-4 flex-wrap justify-center">
          {user ? (
            <>
              <Link to="/movies"    className="btn-primary text-base px-8 py-3">Browse Movies</Link>
              <Link to="/watchlist" className="btn-secondary text-base px-8 py-3">My Watchlist</Link>
            </>
          ) : (
            <>
              <Link to="/register" className="btn-primary text-base px-8 py-3">Get Started</Link>
              <Link to="/movies"   className="btn-secondary text-base px-8 py-3">Browse Movies</Link>
            </>
          )}
        </div>
      </section>

      {/* Feature pills */}
      <section className="border-t border-dark-700 py-12 px-4">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          {[
            { icon: '🎬', title: 'Discover',  desc: 'Search & filter movies by genre' },
            { icon: '📋', title: 'Organize',  desc: 'Track want-to-watch, watching, watched' },
            { icon: '⭐', title: 'Review',    desc: 'Rate and comment on every film' },
          ].map(f => (
            <div key={f.title} className="p-6 bg-dark-800 rounded-lg border border-dark-600">
              <div className="text-3xl mb-3">{f.icon}</div>
              <h3 className="text-xl text-white mb-2">{f.title}</h3>
              <p className="text-gray-500 text-sm font-body">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
