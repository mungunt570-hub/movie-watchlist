import { useEffect, useState } from 'react';
import { useMovies } from '../context/MovieContext';
import MovieCard from '../components/MovieCard';

export default function Movies() {
  const {
    movies, genres, loading, error, total, page, pages,
    search, setSearch, genreFilter, setGenreFilter,
    fetchMovies, fetchGenres, setPage,
  } = useMovies();

  const [inputVal, setInputVal] = useState(search);

  useEffect(() => { fetchGenres(); }, [fetchGenres]);
  useEffect(() => { fetchMovies(); }, []);           // initial load

  const handleSearch = e => {
    e.preventDefault();
    setSearch(inputVal);
    setPage(1);
    fetchMovies({ search: inputVal, genre: genreFilter, page: 1 });
  };

  const handleGenre = gid => {
    const next = genreFilter === gid ? '' : gid;
    setGenreFilter(next);
    setPage(1);
    fetchMovies({ search, genre: next, page: 1 });
  };

  const handlePage = p => {
    setPage(p);
    fetchMovies({ page: p });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-5xl text-white mb-6">Movies</h1>

      {/* Search bar */}
      <form onSubmit={handleSearch} className="flex gap-2 mb-6">
        <input
          className="input-field max-w-md"
          placeholder="Search movies..."
          value={inputVal}
          onChange={e => setInputVal(e.target.value)}
        />
        <button type="submit" className="btn-primary px-6">Search</button>
      </form>

      {/* Genre filters */}
      <div className="flex flex-wrap gap-2 mb-8">
        <button
          onClick={() => handleGenre('')}
          className={`badge py-1 px-3 cursor-pointer transition-colors ${
            !genreFilter ? 'bg-brand text-white' : 'hover:bg-dark-500'
          }`}
        >
          All
        </button>
        {genres.map(g => (
          <button
            key={g._id}
            onClick={() => handleGenre(g._id)}
            className={`badge py-1 px-3 cursor-pointer transition-colors ${
              genreFilter === g._id ? 'bg-brand text-white' : 'hover:bg-dark-500'
            }`}
          >
            {g.name}
          </button>
        ))}
      </div>

      {/* Results count */}
      <p className="text-gray-500 text-sm font-body mb-6">{total} movie{total !== 1 ? 's' : ''} found</p>

      {/* Error */}
      {error && <p className="text-brand font-body mb-6">{error}</p>}

      {/* Grid */}
      {loading ? (
        <div className="text-center text-gray-400 py-20">Loading...</div>
      ) : movies.length === 0 ? (
        <div className="text-center text-gray-500 py-20 font-body">No movies found.</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {movies.map(m => <MovieCard key={m._id} movie={m} />)}
        </div>
      )}

      {/* Pagination */}
      {pages > 1 && (
        <div className="flex justify-center gap-2 mt-10">
          {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
            <button
              key={p}
              onClick={() => handlePage(p)}
              className={`w-9 h-9 rounded font-body text-sm transition-colors ${
                p === page ? 'bg-brand text-white' : 'bg-dark-700 text-gray-300 hover:bg-dark-500'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
