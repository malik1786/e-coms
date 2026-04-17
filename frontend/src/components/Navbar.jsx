import { NavLink, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAdminAuth } from '../context/AdminAuthContext';

const brandName = import.meta.env.VITE_STORE_NAME || 'Nafees Perfumes';

const navClass = ({ isActive }) =>
  [
    'rounded-full px-4 py-2 text-sm font-semibold transition',
    isActive
      ? 'bg-slate-900 text-white shadow-glow'
      : 'text-slate-600 hover:bg-white/80 hover:text-slate-950'
  ].join(' ');

export default function Navbar() {
  const { itemCount } = useCart();
  const { isAuthenticated } = useAdminAuth();

  return (
    <header className="sticky top-0 z-40 border-b border-white/70 bg-[#fffaf2]/85 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-slate-950 text-sm font-black uppercase tracking-[0.22em] text-white shadow-glow">
            NP
          </span>
          <span className="leading-tight">
            <span className="block text-lg font-black tracking-tight text-slate-950">
              {brandName}
            </span>
            <span className="block text-xs font-semibold uppercase tracking-[0.24em] text-amber-700">
              Oud, Attar, Bakhoor
            </span>
          </span>
        </Link>

        <nav className="flex flex-wrap items-center gap-2">
          <NavLink to="/" className={navClass}>
            Home
          </NavLink>
          <NavLink to="/products" className={navClass}>
            Products
          </NavLink>
          <NavLink to="/cart" className={navClass}>
            Cart
            <span className="ml-2 inline-flex min-w-6 items-center justify-center rounded-full bg-amber-500 px-2 py-0.5 text-xs font-black text-white">
              {itemCount}
            </span>
          </NavLink>
          {isAuthenticated ? (
            <NavLink to="/admin" className={navClass}>
              Admin
            </NavLink>
          ) : null}
        </nav>
      </div>
    </header>
  );
}
