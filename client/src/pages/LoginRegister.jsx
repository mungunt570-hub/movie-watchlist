import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginRegister({ mode = 'login' }) {
  const [tab,      setTab]      = useState(mode);
  const [form,     setForm]     = useState({ username: '', email: '', password: '' });
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);

  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (tab === 'login') {
        await login(form.email, form.password);
      } else {
        await register(form.username, form.email, form.password);
      }
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <h1 className="text-5xl text-center text-white mb-8">
          {tab === 'login' ? 'Welcome Back' : 'Join CineList'}
        </h1>

        {/* Tabs */}
        <div className="flex mb-6 bg-dark-700 rounded-lg p-1">
          {['login', 'register'].map(t => (
            <button
              key={t}
              onClick={() => { setTab(t); setError(''); }}
              className={`flex-1 py-2 rounded text-sm font-body font-semibold transition-colors ${
                tab === t ? 'bg-brand text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              {t === 'login' ? 'Sign In' : 'Register'}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {tab === 'register' && (
            <div>
              <label className="block text-xs text-gray-400 mb-1 font-body">Username</label>
              <input
                name="username" value={form.username} onChange={handleChange}
                className="input-field" placeholder="cinephile42" required
              />
            </div>
          )}

          <div>
            <label className="block text-xs text-gray-400 mb-1 font-body">Email</label>
            <input
              name="email" type="email" value={form.email} onChange={handleChange}
              className="input-field" placeholder="you@example.com" required
            />
          </div>

          <div>
            <label className="block text-xs text-gray-400 mb-1 font-body">Password</label>
            <input
              name="password" type="password" value={form.password} onChange={handleChange}
              className="input-field" placeholder="••••••••" required minLength={6}
            />
          </div>

          {error && (
            <p className="text-brand text-sm font-body text-center">{error}</p>
          )}

          <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-base">
            {loading ? 'Please wait...' : tab === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>
      </div>
    </div>
  );
}
