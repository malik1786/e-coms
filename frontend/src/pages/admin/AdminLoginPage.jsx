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
    <div className="mx-auto max-w-5xl">
      <div className="grid gap-6 lg:grid-cols-[.95fr_1.05fr]">
        <section className="hero-amber overflow-hidden rounded-[2.2rem] px-7 py-10 text-white lg:px-10 lg:py-14">
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#f0c562]">
            Admin access
          </p>
          <h1 className="font-editorial mt-5 text-4xl leading-tight text-[#181410] lg:text-5xl">
            Control the collection with the same luxury tone.
          </h1>
          <p className="mt-5 max-w-md text-sm leading-7 text-white/78">
            Sign in to manage stock, featured edits, trending products, and the storefront presentation from one place.
          </p>
        </section>

        <div className="rounded-[2.2rem] bg-white/88 p-8 shadow-[0_24px_70px_rgba(15,23,42,0.06)] lg:p-10">
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[var(--np-gold)]">
            Admin access
          </p>
          <h1 className="font-editorial mt-3 text-4xl leading-tight text-[var(--np-ink)]">
            Login to manage products
          </h1>
          <p className="mt-3 text-sm leading-7 text-[var(--np-muted)]">
          Use the admin credentials defined in `backend/src/config/admin.js`.
          </p>

          <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              placeholder="Admin username"
              className="w-full rounded-[1.25rem] bg-[var(--np-surface)] px-4 py-3 text-sm outline-none transition focus:ring-4 focus:ring-[rgba(205,158,45,0.18)]"
              required
            />
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Admin password"
              className="w-full rounded-[1.25rem] bg-[var(--np-surface)] px-4 py-3 text-sm outline-none transition focus:ring-4 focus:ring-[rgba(205,158,45,0.18)]"
              required
            />

            {error ? (
              <div className="rounded-[1.2rem] border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
                {error}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={loading}
              className="gold-button w-full rounded-full px-5 py-3.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <Link
            to="/"
            className="mt-6 inline-flex text-sm font-medium text-[var(--np-gold)] underline-offset-4 hover:underline"
          >
            Back to storefront
          </Link>
        </div>
      </div>
    </div>
  );
}
