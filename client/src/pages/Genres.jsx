import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api';

export default function Genres() {
  const { user } = useAuth();
  const [genres,  setGenres]  = useState([]);
  const [form,    setForm]    = useState({ name: '', description: '' });
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => { loadGenres(); }, []);

  const loadGenres = async () => {
    try {
      const { data } = await api.get('/genres');
      setGenres(data);
    } catch {}
    setLoading(false);
  };

  const handleAdd = async e => {
    e.preventDefault();
    setError(''); setSuccess('');
    try {
      const { data } = await api.post('/genres', form);
      setGenres(prev => [...prev, data]);
      setForm({ name: '', description: '' });
      setSuccess(`"${data.name}" added!`);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add genre');
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"?`)) return;
    try {
      await api.delete(`/genres/${id}`);
      setGenres(prev => prev.filter(g => g._id !== id));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete');
    }
  };

  if (user?.role !== 'admin') {
    return <div className="text-center mt-20 text-gray-400">Admin access required.</div>;
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-5xl text-white mb-2">Manage Genres</h1>
      <p className="text-gray-400 font-body mb-8">Add or remove movie genres.</p>

      {/* Add form */}
      <form onSubmit={handleAdd} className="bg-dark-800 border border-dark-600 rounded-lg p-6 mb-8">
        <h2 className="text-2xl text-white mb-4">Add Genre</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-xs text-gray-400 mb-1 font-body">Genre Name</label>
            <input
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              className="input-field"
              placeholder="e.g. Action"
              required
            />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1 font-body">Description (optional)</label>
            <input
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              className="input-field"
              placeholder="e.g. High energy action films"
            />
          </div>
          {error   && <p className="text-brand text-sm font-body">{error}</p>}
          {success && <p className="text-green-400 text-sm font-body">{success}</p>}
          <button type="submit" className="btn-primary w-full py-3">Add Genre</button>
        </div>
      </form>

      {/* Genre list */}
      <h2 className="text-2xl text-white mb-4">All Genres ({genres.length})</h2>
      {loading ? (
        <p className="text-gray-400 font-body">Loading...</p>
      ) : genres.length === 0 ? (
        <p className="text-gray-500 font-body">No genres yet. Add one above.</p>
      ) : (
        <div className="space-y-2">
          {genres.map(g => (
            <div key={g._id} className="flex items-center justify-between bg-dark-800 border border-dark-600 rounded-lg px-4 py-3">
              <div>
                <p className="font-sans text-lg text-white">{g.name}</p>
                {g.description && <p className="text-gray-500 text-sm font-body">{g.description}</p>}
              </div>
              <button
                onClick={() => handleDelete(g._id, g.name)}
                className="text-gray-600 hover:text-brand text-sm font-body transition-colors"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
