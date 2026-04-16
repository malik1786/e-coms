import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

export default function Layout() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <Outlet />
      </main>
      <footer className="mx-auto max-w-6xl px-4 pb-10 pt-4 text-center text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
        React + Tailwind + Express + MongoDB
      </footer>
    </div>
  );
}
