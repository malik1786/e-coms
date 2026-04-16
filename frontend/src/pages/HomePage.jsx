import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getProducts } from '../lib/api';
import ProductCard from '../components/ProductCard';
import { useCart } from '../context/CartContext';

export default function HomePage() {
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const data = await getProducts();
        if (Array.isArray(data)) {
          setProducts(data);
        } else {
          setProducts([]);
          console.error('Expected array of products, got:', data);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const featured = products.slice(0, 4);
  const storeName = import.meta.env.VITE_STORE_NAME || 'Nova Store';

  return (
    <div className="space-y-10">
      <section className="grid gap-6 lg:grid-cols-[1.1fr_.9fr]">
        <div className="rounded-[2rem] border border-white/80 bg-white/85 p-8 shadow-[0_24px_70px_rgba(15,23,42,0.08)]">
          <p className="inline-flex rounded-full bg-amber-100 px-4 py-1 text-sm font-bold text-amber-700">
            Royal Oriental Collection
          </p>
          <h1 className="mt-6 max-w-2xl text-4xl font-black tracking-tight text-slate-950 sm:text-5xl uppercase">
            Elevate Your Senses with the Finest Oud & Attar.
          </h1>
          <p className="mt-4 max-w-xl text-base leading-7 text-slate-600">
            Nafees Perfumes brings you a curated selection of artisanal fragrances. 
            From deep, woody Ouds to delicate floral Attars, explore our collection 
            crafted for those who appreciate the true art of oriental perfumery.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/products"
              className="rounded-full bg-slate-950 px-8 py-4 text-sm font-bold text-white transition hover:bg-slate-800"
            >
              Explore Collection
            </Link>
            <Link
              to="/cart"
              className="rounded-full border border-slate-200 bg-white px-8 py-4 text-sm font-bold text-slate-800 transition hover:border-slate-300 hover:bg-slate-50"
            >
              View Cart
            </Link>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {['Ethically Sourced Oud', 'Long-lasting Attars', 'Artisanal Preparation'].map(
              (item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-slate-200/80 bg-slate-50 px-4 py-4 text-sm font-semibold text-slate-700 text-center"
                >
                  {item}
                </div>
              )
            )}
          </div>
        </div>

        <aside className="relative overflow-hidden rounded-[2rem] shadow-[0_24px_70px_rgba(15,23,42,0.15)] min-h-[400px]">
          <img 
            src="https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=1000" 
            alt="Beautiful Oriental Perfumes" 
            className="absolute inset-0 h-full w-full object-cover transition duration-700 hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent flex flex-col justify-end p-8 text-white">
             <h2 className="text-3xl font-black tracking-tight drop-shadow-lg">Nafees Perfumes</h2>
             <p className="mt-2 text-sm font-semibold tracking-wide text-amber-300 drop-shadow">The true art of oriental perfumery</p>
          </div>
        </aside>
      </section>

      <section className="space-y-5">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-amber-600">
              Featured
            </p>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950">
              Featured products
            </h2>
          </div>
          <Link
            to="/products"
            className="text-sm font-bold text-slate-700 underline-offset-4 hover:underline"
          >
            View all products
          </Link>
        </div>

        {loading ? (
          <div className="rounded-[1.75rem] border border-white/80 bg-white/85 p-8 text-center text-slate-500 shadow-[0_18px_45px_rgba(15,23,42,0.08)]">
            Loading products...
          </div>
        ) : error ? (
          <div className="rounded-[1.75rem] border border-rose-200 bg-rose-50 p-8 text-center text-rose-700">
            {error}
          </div>
        ) : featured.length ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {featured.map((product) => (
              <ProductCard key={product._id} product={product} onAddToCart={addToCart} />
            ))}
          </div>
        ) : (
          <div className="rounded-[1.75rem] border border-white/80 bg-white/85 p-8 text-center text-slate-500 shadow-[0_18px_45px_rgba(15,23,42,0.08)]">
            No products yet. Add your first product from the admin panel.
          </div>
        )}
      </section>
    </div>
  );
}
