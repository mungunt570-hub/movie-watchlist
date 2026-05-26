import { Link } from 'react-router-dom';

export default function MovieCard({ movie }) {
  const posterUrl = movie.poster || `https://via.placeholder.com/300x450/1a1a1a/e50914?text=${encodeURIComponent(movie.title)}`;

  return (
    <Link to={`/movies/${movie._id}`} className="card group block">
      <div className="relative aspect-[2/3] overflow-hidden bg-dark-700">
        <img
          src={posterUrl}
          alt={movie.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={e => { e.target.src = `https://via.placeholder.com/300x450/1a1a1a/e50914?text=${encodeURIComponent(movie.title)}`; }}
        />
        {/* Year badge */}
        {movie.releaseYear && (
          <span className="absolute top-2 left-2 badge">{movie.releaseYear}</span>
        )}
      </div>

      <div className="p-3">
        <h3 className="font-sans text-lg leading-tight text-white group-hover:text-brand transition-colors truncate">
          {movie.title}
        </h3>

        {/* Genres */}
        <div className="flex flex-wrap gap-1 mt-1">
          {movie.genreIds?.slice(0, 2).map(g => (
            <span key={g._id} className="badge">{g.name}</span>
          ))}
        </div>

        {/* Duration */}
        {movie.duration && (
          <p className="text-xs text-gray-500 mt-2 font-body">{movie.duration} min</p>
        )}
      </div>
    </Link>
  );
}
