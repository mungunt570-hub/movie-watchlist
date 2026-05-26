import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useMovies } from '../context/MovieContext';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import StarRating from '../components/StarRating';
import api from '../api';

export default function MovieDetail() {
  const { id } = useParams();
  const { selectedMovie: movie, fetchMovieById, loading } = useMovies();
  const { user } = useAuth();

  const [reviews,       setReviews]       = useState([]);
  const [myReview,      setMyReview]      = useState(null);
  const [reviewForm,    setReviewForm]    = useState({ rating: 7, comment: '' });
  const [wlStatus,      setWlStatus]      = useState('');
  const [wlId,          setWlId]          = useState(null);
  const [submitting,    setSubmitting]    = useState(false);
  const [reviewMsg,     setReviewMsg]     = useState('');

  useEffect(() => {
    fetchMovieById(id);
    loadReviews();
    if (user) loadWatchlistStatus();
  }, [id]);

  const loadReviews = async () => {
    try {
      const { data } = await api.get(`/reviews/movie/${id}`);
      setReviews(data);
      if (user) {
        const mine = data.find(r => r.userId?._id === user.id || r.userId === user.id);
        if (mine) { setMyReview(mine); setReviewForm({ rating: mine.rating, comment: mine.comment }); }
      }
    } catch {}
  };

  const loadWatchlistStatus = async () => {
    try {
      const { data } = await api.get('/watchlist');
      const item = data.find(i => i.movieId?._id === id);
      if (item) { setWlStatus(item.status); setWlId(item._id); }
    } catch {}
  };

  const handleDelete = async () => {
  if (!window.confirm('Delete this movie permanently?')) return;
  try {
    await api.delete(`/movies/${id}`);
    navigate('/movies');
  } catch (err) {
    alert('Failed to delete movie');
  }
};

  const handleWatchlist = async (status) => {
    setSubmitting(true);
    try {
      if (wlId) {
        if (wlStatus === status) {
          await api.delete(`/watchlist/${wlId}`);
          setWlId(null); setWlStatus('');
        } else {
          await api.put(`/watchlist/${wlId}`, { status });
          setWlStatus(status);
        }
      } else {
        const { data } = await api.post('/watchlist', { movieId: id, status });
        setWlId(data._id); setWlStatus(status);
      }
    } catch {}
    setSubmitting(false);
  };

  const handleReviewSubmit = async e => {
    e.preventDefault();
    setSubmitting(true);
    setReviewMsg('');
    try {
      if (myReview) {
        const { data } = await api.put(`/reviews/${myReview._id}`, reviewForm);
        setMyReview(data);
      } else {
        await api.post('/reviews', { movieId: id, ...reviewForm });
      }
      setReviewMsg('Review saved!');
      loadReviews();
    } catch (err) {
      setReviewMsg(err.response?.data?.message || 'Failed to save review');
    }
    setSubmitting(false);
  };

  if (loading) return <div className="text-center mt-20 text-gray-400">Loading...</div>;
  if (!movie)  return <div className="text-center mt-20 text-gray-500">Movie not found.</div>;

  const avgRating = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  const statusBtns = [
    { key: 'want-to-watch', label: '+ Watchlist' },
    { key: 'watching',      label: '▶ Watching' },
    { key: 'watched',       label: '✓ Watched' },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="flex flex-col md:flex-row gap-8 mb-10">
        {/* Poster */}
        <div className="w-full md:w-64 shrink-0">
          <img
            src={movie.poster || `https://via.placeholder.com/300x450/1a1a1a/e50914?text=${encodeURIComponent(movie.title)}`}
            alt={movie.title}
            className="w-full rounded-lg object-cover"
          />
        </div>

        {/* Info */}
        <div className="flex-1">
          <h1 className="text-5xl text-white mb-2">{movie.title}</h1>

          <div className="flex flex-wrap gap-2 mb-4">
            {movie.genreIds?.map(g => <span key={g._id} className="badge">{g.name}</span>)}
          </div>

          <div className="flex gap-6 text-sm text-gray-400 font-body mb-4">
            {movie.releaseYear && <span>📅 {movie.releaseYear}</span>}
            {movie.duration    && <span>⏱ {movie.duration} min</span>}
            {avgRating         && <span>⭐ {avgRating}/10 ({reviews.length} reviews)</span>}
          </div>

          <p className="text-gray-300 font-body leading-relaxed mb-6">{movie.description}</p>

          {/* Watchlist buttons */}
          {user && (
            <div className="flex flex-wrap gap-2">
              {statusBtns.map(btn => (
                <button
                  key={btn.key}
                  onClick={() => handleWatchlist(btn.key)}
                  disabled={submitting}
                  className={`font-body text-sm px-4 py-2 rounded border transition-colors ${
                    wlStatus === btn.key
                      ? 'bg-brand border-brand text-white'
                      : 'border-dark-500 text-gray-300 hover:border-gray-400'
                  }`}
                >
                  {btn.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Admin buttons */}
{user?.role === 'admin' && (
  <div className="flex gap-2 mt-4">
    <Link to={`/movies/${movie._id}/edit`} className="btn-secondary text-sm px-4 py-2">
      ✏️ Edit Movie
    </Link>
    <button
      onClick={handleDelete}
      className="font-body text-sm px-4 py-2 rounded bg-red-900 hover:bg-red-700 text-white transition-colors"
    >
      🗑 Delete Movie
    </button>
  </div>
)}

      {/* Review form */}
      {user && (
        <div className="bg-dark-800 border border-dark-600 rounded-lg p-6 mb-8">
          <h2 className="text-2xl text-white mb-4">{myReview ? 'Update Your Review' : 'Write a Review'}</h2>
          <form onSubmit={handleReviewSubmit} className="space-y-4">
            <div>
              <label className="text-xs text-gray-400 font-body block mb-1">Rating</label>
              <StarRating value={reviewForm.rating} onChange={v => setReviewForm(f => ({ ...f, rating: v }))} />
            </div>
            <div>
              <label className="text-xs text-gray-400 font-body block mb-1">Comment</label>
              <textarea
                className="input-field resize-none"
                rows={3}
                placeholder="What did you think?"
                value={reviewForm.comment}
                onChange={e => setReviewForm(f => ({ ...f, comment: e.target.value }))}
              />
            </div>
            {reviewMsg && <p className="text-sm font-body text-green-400">{reviewMsg}</p>}
            <button type="submit" disabled={submitting} className="btn-primary">
              {submitting ? 'Saving...' : 'Save Review'}
            </button>
          </form>
        </div>
      )}

      {/* Reviews list */}
      <div>
        <h2 className="text-2xl text-white mb-4">Reviews ({reviews.length})</h2>
        {reviews.length === 0 ? (
          <p className="text-gray-500 font-body">No reviews yet. Be the first!</p>
        ) : (
          <div className="space-y-4">
            {reviews.map(r => (
              <div key={r._id} className="bg-dark-800 border border-dark-600 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-2">
                  <span className="font-body text-white text-sm font-medium">{r.userId?.username}</span>
                  <span className="text-yellow-400 text-sm">★ {r.rating}/10</span>
                  <span className="text-gray-600 text-xs font-body ml-auto">
                    {new Date(r.createdAt).toLocaleDateString()}
                  </span>
                </div>
                {r.comment && <p className="text-gray-300 font-body text-sm">{r.comment}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
