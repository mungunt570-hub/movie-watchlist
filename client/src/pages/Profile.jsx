import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api';

export default function Profile() {
  const { user } = useAuth();
  const [form,    setForm]    = useState({ fullName: '', avatar: '', bio: '', favoriteGenre: '' });
  const [saved,   setSaved]   = useState(false);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');

  useEffect(() => {
    api.get('/profile/me').then(({ data }) => {
      setForm({
        fullName:      data.fullName      || '',
        avatar:        data.avatar        || '',
        bio:           data.bio           || '',
        favoriteGenre: data.favoriteGenre || '',
      });
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setSaved(false);
    try {
      await api.put('/profile/me', form);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save');
    }
  };

  if (loading) return <div className="text-center mt-20 text-gray-400">Loading...</div>;

  return (
    <div className="max-w-xl mx-auto px-4 py-10">
      <h1 className="text-5xl text-white mb-2">Profile</h1>
      <p className="text-gray-400 font-body mb-8">@{user?.username} · {user?.email}</p>

      {/* Avatar preview */}
      {form.avatar && (
        <img src={form.avatar} alt="avatar" className="w-20 h-20 rounded-full object-cover mb-6 border-2 border-dark-500" />
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {[
          { name: 'fullName',      label: 'Full Name',      placeholder: 'John Doe' },
          { name: 'avatar',        label: 'Avatar URL',     placeholder: 'https://...' },
          { name: 'favoriteGenre', label: 'Favorite Genre', placeholder: 'Thriller, Sci-Fi...' },
        ].map(field => (
          <div key={field.name}>
            <label className="block text-xs text-gray-400 mb-1 font-body">{field.label}</label>
            <input
              name={field.name}
              value={form[field.name]}
              onChange={handleChange}
              placeholder={field.placeholder}
              className="input-field"
            />
          </div>
        ))}

        <div>
          <label className="block text-xs text-gray-400 mb-1 font-body">Bio</label>
          <textarea
            name="bio"
            value={form.bio}
            onChange={handleChange}
            placeholder="Tell us about yourself..."
            rows={4}
            className="input-field resize-none"
          />
        </div>

        {error  && <p className="text-brand text-sm font-body">{error}</p>}
        {saved  && <p className="text-green-400 text-sm font-body">✓ Profile saved!</p>}

        <button type="submit" className="btn-primary w-full py-3">Save Profile</button>
      </form>
    </div>
  );
}
