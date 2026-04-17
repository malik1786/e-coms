import { useState } from 'react';
import { Navigate, useNavigate, Link } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const { isAuthenticated, login } = useAdminAuth();
  const [form, setForm] = useState({
    username: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({
      ...current,
      [name]: value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(form);
      navigate('/admin', { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-lg">
      <div className="rounded-[2rem] border border-white/80 bg-white/90 p-8 shadow-[0_24px_70px_rgba(15,23,42,0.08)]">
        <p className="text-sm font-bold uppercase tracking-[0.3em] text-amber-600">
          Admin access
        </p>
        <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-950">
          Login to manage products
        </h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          Use the admin credentials defined in `backend/src/config/admin.js`.
        </p>

        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          <input
            type="text"
            name="username"
            value={form.username}
            onChange={handleChange}
            placeholder="Admin username"
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-amber-500 focus:ring-4 focus:ring-amber-100"
            required
          />
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Admin password"
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-amber-500 focus:ring-4 focus:ring-amber-100"
            required
          />

          {error ? (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
              {error}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-slate-950 px-5 py-3.5 text-sm font-black text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <Link
          to="/"
          className="mt-6 inline-flex text-sm font-bold text-slate-700 underline-offset-4 hover:underline"
        >
          Back to storefront
        </Link>
      </div>
    </div>
  );
}
