import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

export default function Layout() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <Outlet />
      </main>
      <footer className="mx-auto max-w-6xl px-4 pb-10 pt-4">
        <div className="rounded-[1.75rem] border border-white/80 bg-white/70 px-6 py-6 text-center shadow-[0_12px_30px_rgba(15,23,42,0.05)]">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-amber-700">
            Nafees Perfumes
          </p>
          <p className="mt-2 text-sm text-slate-600">
            Crafted fragrance experiences with direct WhatsApp ordering and simple website-based admin control.
          </p>
        </div>
      </footer>
    </div>
  );
}
