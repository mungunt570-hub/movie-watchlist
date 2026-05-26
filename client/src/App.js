import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider }  from './context/AuthContext';
import { MovieProvider } from './context/MovieContext';
import Navbar         from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

import Home        from './pages/Home';
import LoginRegister from './pages/LoginRegister';
import Dashboard   from './pages/Dashboard';
import Movies      from './pages/Movies';
import MovieDetail from './pages/MovieDetail';
import MovieForm   from './pages/MovieForm';
import Watchlist   from './pages/Watchlist';
import Profile     from './pages/Profile';
import Genres from './pages/Genres';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <MovieProvider>
          <div className="min-h-screen bg-dark-900">
            <Navbar />
            <Routes>
              <Route path="/"         element={<Home />} />
              <Route path="/login"    element={<LoginRegister mode="login" />} />
              <Route path="/register" element={<LoginRegister mode="register" />} />
              <Route path="/movies"   element={<Movies />} />
              <Route path="/movies/:id" element={<MovieDetail />} />

              {/* Protected routes */}
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/watchlist" element={<ProtectedRoute><Watchlist /></ProtectedRoute>} />
              <Route path="/profile"   element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="/movies/add"       element={<ProtectedRoute><MovieForm /></ProtectedRoute>} />
              <Route path="/movies/:id/edit"  element={<ProtectedRoute><MovieForm /></ProtectedRoute>} />
              <Route path="/genres" element={<ProtectedRoute><Genres /></ProtectedRoute>} />

              {/* 404 */}
              <Route path="*" element={
                <div className="text-center mt-32">
                  <h1 className="text-8xl text-brand">404</h1>
                  <p className="text-gray-400 font-body mt-4">Page not found.</p>
                </div>
              } />
            </Routes>
          </div>
        </MovieProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
