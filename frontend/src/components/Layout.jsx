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
        <div className="mx-auto max-w-[1440px] px-4 py-16 text-center sm:px-6 lg:px-8">
          <p className="font-editorial mx-auto max-w-2xl text-2xl italic leading-relaxed text-[var(--np-ink)]">
            "A perfume is an intimate object, it is the reflector of the heart." 
          </p>
        </div>
      </footer>
    </div>
  );
}
