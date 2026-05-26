import { createContext, useContext, useState, useCallback } from 'react';
import api from '../api';

const MovieContext = createContext(null);

export function MovieProvider({ children }) {
  const [movies,       setMovies]       = useState([]);
  const [selectedMovie,setSelectedMovie]= useState(null);
  const [genres,       setGenres]       = useState([]);
  const [total,        setTotal]        = useState(0);
  const [page,         setPage]         = useState(1);
  const [pages,        setPages]        = useState(1);
  const [search,       setSearch]       = useState('');
  const [genreFilter,  setGenreFilter]  = useState('');
  const [loading,      setLoading]      = useState(false);
  const [error,        setError]        = useState(null);
 
  const fetchMovies = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get('/movies', {
        params: {
          search:  params.search  ?? search,
          genre:   params.genre   ?? genreFilter,
          page:    params.page    ?? page,
          limit:   12,
        },
      });
      setMovies(data.movies);
      setTotal(data.total);
      setPage(data.page);
      setPages(data.pages);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load movies');
    } finally {
      setLoading(false);
    }
  }, [search, genreFilter, page]);

  const fetchGenres = useCallback(async () => {
    try {
      const { data } = await api.get('/genres');
      setGenres(data);
    } catch {}
  }, []);

  const fetchMovieById = useCallback(async (id) => {
    setLoading(true);
    try {
      const { data } = await api.get(`/movies/${id}`);
      setSelectedMovie(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Movie not found');
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <MovieContext.Provider value={{
      movies, selectedMovie, genres, total, page, pages,
      search, setSearch, genreFilter, setGenreFilter,
      loading, error,
      fetchMovies, fetchGenres, fetchMovieById, setPage,
    }}>
      {children}
    </MovieContext.Provider>
  );
}

export const useMovies = () => useContext(MovieContext);
