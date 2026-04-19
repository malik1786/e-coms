import { useEffect, useState } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAdminAuth } from '../context/AdminAuthContext';
import SmartSearchBar from './SmartSearchBar';

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

const desktopLinkClass =
  'border-b border-transparent pb-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--np-muted)] transition hover:border-[rgba(121,89,0,0.25)] hover:text-[var(--np-gold)]';

const mobileItems = [
  { 
    to: '/', 
    label: 'Home', 
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    )
  },
  { 
    to: '/products', 
    label: 'Store', 
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    )
  },
  { 
    to: '/cart', 
    label: 'Cart', 
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
      </svg>
    ),
    badge: true
  },
  { 
    to: '/location', 
    label: 'Locate', 
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    )
  }
];

export default function Navbar() {
  const { itemCount } = useCart();
  const { isAuthenticated } = useAdminAuth();
  const location = useLocation();

  return (
    <>
      <header className="relative z-40 px-3 pt-3 sm:px-6 lg:px-8">
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
              <SmartSearchBar compact placeholder="Search fragrances, oud, musk..." />
            </div>
          </div>

          <div className="glass-panel flex items-center gap-6 rounded-[1.6rem] px-5 py-4 shadow-[0_10px_35px_rgba(27,28,26,0.05)]">
            <nav className="flex min-w-0 flex-1 items-center justify-center gap-6 xl:gap-7">
              <NavLink to="/" className={desktopNavClass}>
                Home
              </NavLink>
              <NavLink to="/products" className={desktopNavClass}>
                The Collection
              </NavLink>
              <NavLink to="/location" className={desktopNavClass}>
                Location
              </NavLink>
              <Link
                to="/cart"
                className="inline-flex h-10 min-w-10 items-center justify-center rounded-full bg-[var(--np-gold)] px-3 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(121,89,0,0.22)]"
                aria-label="Cart"
              >
                <span>Cart</span>
                <span className="ml-1 text-xs">{itemCount}</span>
              </Link>
              {isAuthenticated ? (
                <NavLink to="/admin" className={desktopNavClass}>
                  Admin
                </NavLink>
              ) : null}
            </nav>
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
            <SmartSearchBar compact placeholder="Search fragrances, oud, musk..." />
          </div>
        </div>
      </header>

      <div className="fixed inset-x-0 bottom-0 z-50 px-3 pb-3 lg:hidden">
        <nav className="glass-panel mx-auto flex max-w-[560px] items-center justify-between rounded-[1.45rem] px-2 py-2 shadow-[0_18px_40px_rgba(27,28,26,0.12)]">
          {mobileItems.map((item) => {
            const active = item.to
              ? item.match
                ? location.pathname === item.match
                : location.pathname === item.to
              : false;

            const className = [
              'flex min-w-0 flex-1 flex-col items-center justify-center rounded-[0.95rem] px-1 py-1.5 text-[10px] font-medium transition',
              active
                ? 'bg-[rgba(121,89,0,0.08)] text-[var(--np-gold)] shadow-[inset_0_1px_1px_rgba(0,0,0,0.05)]'
                : 'text-[var(--np-muted)] hover:text-[var(--np-ink)]'
            ].join(' ');

            const content = (
              <div className="relative flex flex-col items-center">
                <div className={['transition-transform duration-300', active ? 'scale-110' : ''].join(' ')}>
                  {item.icon}
                </div>
                <span className="mt-1 text-[9px] font-bold uppercase tracking-[0.1em]">{item.label}</span>
                {item.badge && itemCount > 0 && (
                  <span className="absolute -right-3 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-600 text-[10px] font-black text-white shadow-lg ring-2 ring-white">
                    {itemCount}
                  </span>
                )}
              </div>
            );

            return (
              <Link
                key={item.label}
                to={item.to}
                className={className}
              >
                {content}
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
}
