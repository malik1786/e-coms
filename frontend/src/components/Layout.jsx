import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

export default function Layout() {
  const storeName = import.meta.env.VITE_STORE_NAME || 'Nafees Perfumes';

  return (
    <div className="editorial-shell min-h-screen">
      <Navbar />
      <main className="mx-auto w-full max-w-[1440px] px-4 pb-28 pt-6 sm:px-6 sm:pb-8 lg:px-8">
        <Outlet />
      </main>
      <footer className="mt-16 bg-[#e7e3de]">
        <div className="mx-auto grid max-w-[1440px] gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.2fr_.9fr_.9fr_.9fr] lg:px-8 lg:py-16">
          <div>
            <p className="font-editorial text-2xl italic text-[var(--np-gold)]">{storeName}</p>
            <p className="mt-4 max-w-xs text-sm leading-7 text-[var(--np-muted)]">
              Curated perfume compositions presented with a luxury editorial feel and direct WhatsApp ordering.
            </p>
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--np-gold)]">Customer Care</p>
            <div className="mt-5 space-y-3 text-sm text-[var(--np-ink)]">
              <p>Shipping & Returns</p>
              <p>Privacy Policy</p>
              <p>Contact Us</p>
            </div>
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--np-gold)]">Discover</p>
            <div className="mt-5 space-y-3 text-sm text-[var(--np-ink)]">
              <p>Store Locator</p>
              <p>Sustainability</p>
              <p>Our Story</p>
            </div>
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--np-gold)]">Connect</p>
            <div className="mt-5 flex flex-wrap gap-4 text-sm text-[var(--np-gold)]">
              <p>Instagram</p>
              <p>Facebook</p>
              <p>Pinterest</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
