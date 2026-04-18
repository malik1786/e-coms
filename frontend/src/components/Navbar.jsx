import { useEffect, useState } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAdminAuth } from '../context/AdminAuthContext';
import SmartSearchBar from './SmartSearchBar';
import { getProducts } from '../lib/api';

const brandName = import.meta.env.VITE_STORE_NAME || 'Nafees Perfumes';
const storeLocation = 'Shop no. 1, Nirmal complex, Meeta nagar, Kondhwa, Pune - 411048';
const mapsUrl =
  'https://www.google.com/maps/search/?api=1&query=Shop+no.+1,+Nirmal+complex,+Meeta+nagar,+Kondhwa,+Pune+411048';

const desktopNavClass = ({ isActive }) =>
  [
    'border-b pb-1 text-[11px] font-semibold uppercase tracking-[0.18em] transition',
    isActive
      ? 'border-[var(--np-gold)] text-[var(--np-gold)]'
      : 'border-transparent text-[var(--np-muted)] hover:border-[rgba(121,89,0,0.25)] hover:text-[var(--np-gold)]'
  ].join(' ');

const mobileItems = [
  { to: '/', label: 'Home', icon: 'H' },
  { to: '/products', label: 'Browse', icon: 'B' },
  { to: '/products?q=oud', label: 'Search', icon: 'S', match: '/products' },
  { to: '/cart', label: 'Cart', icon: 'C' }
];

export default function Navbar() {
  const { itemCount } = useCart();
  const { isAuthenticated } = useAdminAuth();
  const location = useLocation();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(Array.isArray(data) ? data : []);
      } catch {
        setProducts([]);
      }
    };

    loadProducts();
  }, []);

  return (
    <>
      <header className="sticky top-0 z-40 px-3 pt-3 sm:px-6 lg:px-8">
        <div className="mx-auto hidden max-w-[1440px] space-y-3 lg:block">
          <div className="glass-panel flex items-center gap-5 rounded-[1.35rem] px-5 py-3 shadow-[0_10px_35px_rgba(27,28,26,0.05)]">
            <div className="w-[260px] min-w-0">
              <Link to="/" className="min-w-0">
                <span className="font-editorial block truncate text-lg font-semibold tracking-tight text-[var(--np-gold)] sm:text-2xl">
                  {brandName}
                </span>
                <span className="hidden text-[10px] uppercase tracking-[0.22em] text-[var(--np-muted)] sm:block">
                  The Collection
                </span>
              </Link>
            </div>

            <div className="min-w-0 flex-1">
              <SmartSearchBar products={products} compact placeholder="Search fragrances, oud, musk..." />
            </div>
          </div>

          <div className="glass-panel flex items-center gap-6 rounded-[1.6rem] px-5 py-4 shadow-[0_10px_35px_rgba(27,28,26,0.05)]">
            <a
              href={mapsUrl}
              target="_blank"
              rel="noreferrer"
              className="w-[260px] rounded-[1.1rem] bg-[var(--np-surface)] px-4 py-3 transition hover:bg-white"
              aria-label="Open store location in Google Maps"
            >
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--np-gold)]">
                GPS Location
              </p>
              <p className="mt-1 truncate text-xs text-[var(--np-muted)]">
                {storeLocation}
              </p>
            </a>

            <nav className="flex min-w-0 flex-1 items-center justify-center gap-6 xl:gap-7">
              <NavLink to="/" className={desktopNavClass}>
                Home
              </NavLink>
              <NavLink to="/products" className={desktopNavClass}>
                The Collection
              </NavLink>
              <NavLink to="/products" className={desktopNavClass}>
                Bespoke Scents
              </NavLink>
              <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--np-muted)]">
                Our Story
              </span>
              <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--np-muted)]">
                Journal
              </span>
              {isAuthenticated ? (
                <NavLink to="/admin" className={desktopNavClass}>
                  Admin
                </NavLink>
              ) : null}
            </nav>

            <div className="flex items-center gap-2">
              <Link
                to="/cart"
                className="inline-flex h-10 min-w-10 items-center justify-center rounded-full bg-[var(--np-gold)] px-3 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(121,89,0,0.22)]"
                aria-label="Cart"
              >
                <span>Cart</span>
                <span className="ml-1 text-xs">{itemCount}</span>
              </Link>
            </div>
          </div>
        </div>

        <div className="glass-panel mx-auto rounded-[1.35rem] px-4 py-3 shadow-[0_10px_35px_rgba(27,28,26,0.05)] lg:hidden">
          <div className="min-w-0">
            <p className="truncate font-editorial text-lg font-semibold text-[var(--np-gold)]">
              {brandName}
            </p>
            <p className="text-[10px] uppercase tracking-[0.22em] text-[var(--np-muted)]">
              The Collection
            </p>
          </div>

          <div className="mt-3">
            <SmartSearchBar products={products} compact placeholder="Search fragrances, oud, musk..." />
          </div>

          <a
            href={mapsUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-3 flex items-center justify-between rounded-full bg-[var(--np-surface)] px-3 py-2 transition hover:bg-white"
            aria-label="Open store location in Google Maps"
          >
            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--np-gold)]">
                Store Location
              </p>
              <p className="truncate text-[11px] text-[var(--np-muted)]">
                Kondhwa, Pune 411048
              </p>
            </div>
            <span className="ml-3 whitespace-nowrap text-[11px] font-semibold text-[var(--np-gold)]">
              Maps
            </span>
          </a>
        </div>
      </header>

      <div className="fixed inset-x-0 bottom-0 z-50 px-3 pb-3 lg:hidden">
        <nav className="glass-panel mx-auto flex max-w-[560px] items-center justify-between rounded-[1.7rem] px-3 py-3 shadow-[0_18px_40px_rgba(27,28,26,0.12)]">
          {mobileItems.map((item) => {
            const active = item.match ? location.pathname === item.match : location.pathname === item.to;

            return (
              <Link
                key={`${item.label}-${item.to}`}
                to={item.to}
                className={[
                  'flex min-w-[68px] flex-col items-center justify-center rounded-[1.1rem] px-2 py-2 text-[11px] font-medium transition',
                  active
                    ? 'bg-[var(--np-gold)] text-white shadow-[0_10px_24px_rgba(121,89,0,0.22)]'
                    : 'text-[var(--np-muted)]'
                ].join(' ')}
              >
                <span className="text-sm font-semibold">{item.icon}</span>
                <span className="mt-1">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
}
