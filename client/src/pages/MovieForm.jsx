import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMovies } from '../context/MovieContext';
import { useAuth } from '../context/AuthContext';
import api from '../api';

export default function MovieForm() {
  const { id } = useParams();           // present = edit mode
  const isEdit  = Boolean(id);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { genres, fetchGenres } = useMovies();

  const [form, setForm] = useState({
    title: '', description: '', releaseYear: '', duration: '', poster: '', genreIds: [],
  });
  const [error,   setError]   = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => { fetchGenres(); }, [fetchGenres]);

  useEffect(() => {
    if (isEdit) {
      api.get(`/movies/${id}`).then(({ data }) => {
        setForm({
          title:       data.title       || '',
          description: data.description || '',
          releaseYear: data.releaseYear || '',
          duration:    data.duration    || '',
          poster:      data.poster      || '',
          genreIds:    data.genreIds?.map(g => g._id) || [],
        });
      });
    }
  }, [id]);

  // Redirect non-admins
  if (user?.role !== 'admin') {
    return <div className="text-center mt-20 text-gray-400">Admin access required.</div>;
  }

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const toggleGenre = gid => {
    setForm(f => ({
      ...f,
      genreIds: f.genreIds.includes(gid)
        ? f.genreIds.filter(x => x !== gid)
        : [...f.genreIds, gid],
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const payload = { ...form, releaseYear: Number(form.releaseYear), duration: Number(form.duration) };
      if (isEdit) {
        await api.put(`/movies/${id}`, payload);
      } else {
        await api.post('/movies', payload);
      }
      navigate('/movies');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save movie');
    }
    setLoading(false);
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-10">
      <h1 className="text-5xl text-white mb-8">{isEdit ? 'Edit Movie' : 'Add Movie'}</h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        {[
          { name: 'title',       label: 'Title',        placeholder: 'Inception' },
          { name: 'poster',      label: 'Poster URL',   placeholder: 'https://...' },
          { name: 'releaseYear', label: 'Release Year', placeholder: '2010', type: 'number' },
          { name: 'duration',    label: 'Duration (min)',placeholder: '148', type: 'number' },
        ].map(f => (
          <div key={f.name}>
            <label className="block text-xs text-gray-400 mb-1 font-body">{f.label}</label>
            <input
              name={f.name} type={f.type || 'text'}
              value={form[f.name]} onChange={handleChange}
              placeholder={f.placeholder} className="input-field"
              required={f.name === 'title'}
            />
          </div>
        ))}

        <div>
          <label className="block text-xs text-gray-400 mb-1 font-body">Description</label>
          <textarea
            name="description" value={form.description} onChange={handleChange}
            rows={4} className="input-field resize-none" placeholder="Plot summary..."
          />
        </div>

        {/* Genres */}
        <div>
          <label className="block text-xs text-gray-400 mb-2 font-body">Genres</label>
          <div className="flex flex-wrap gap-2">
            {genres.map(g => (
              <button
                key={g._id} type="button"
                onClick={() => toggleGenre(g._id)}
                className={`badge py-1 px-3 cursor-pointer transition-colors ${
                  form.genreIds.includes(g._id) ? 'bg-brand text-white' : 'hover:bg-dark-500'
                }`}
              >
                {g.name}
              </button>
            ))}
          </div>
        </div>

        {error && <p className="text-brand text-sm font-body">{error}</p>}

        <div className="flex gap-3">
          <button type="submit" disabled={loading} className="btn-primary flex-1 py-3">
            {loading ? 'Saving...' : isEdit ? 'Update Movie' : 'Add Movie'}
          </button>
          <button type="button" onClick={() => navigate(-1)} className="btn-secondary px-6">Cancel</button>
        </div>
      </form>
    </div>
  );
}
