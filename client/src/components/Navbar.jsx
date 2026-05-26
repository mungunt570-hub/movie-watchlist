import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-dark-800 border-b border-dark-600 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-2xl text-brand font-sans tracking-widest">
          CINELIST
        </Link>

        {/* Nav links */}
        <div className="flex items-center gap-6 font-body text-sm">
          <Link to="/movies" className="text-gray-300 hover:text-white transition-colors">Movies</Link>

          {user ? (
            <>
              <Link to="/watchlist" className="text-gray-300 hover:text-white transition-colors">Watchlist</Link>
              <Link to="/dashboard"  className="text-gray-300 hover:text-white transition-colors">Dashboard</Link>
              <Link to="/profile"    className="text-gray-300 hover:text-white transition-colors">{user.username}</Link>
              <Link to="/genres" className="text-gray-300 hover:text-white transition-colors">Genres</Link>
              <button onClick={handleLogout} className="btn-primary text-sm py-1 px-4">Logout</button>
            </>
          ) : (
            <Link to="/login" className="btn-primary text-sm py-1 px-4">Sign In</Link>
          )}
        </div>
      </div>
    </nav>
  );
}
