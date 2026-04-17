import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getProducts } from '../lib/api';
import ProductCard from '../components/ProductCard';
import SmartSearchBar from '../components/SmartSearchBar';
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

  const featured = products.filter((product) => product.featured).slice(0, 4);
  const trending = products.filter((product) => product.trending).slice(0, 3);
  const fallbackProducts = products.slice(0, 4);
  const storeName = import.meta.env.VITE_STORE_NAME || 'Nafees Perfumes';
  const highlights = [
    'Authentic oriental fragrance notes',
    'Long-lasting concentration and rich dry-down',
    'Fast ordering directly on WhatsApp'
  ];
  const pillars = [
    {
      title: 'Signature Oud',
      text: 'Deep woody blends made for clients who want presence, warmth, and lasting character.'
    },
    {
      title: 'Refined Attars',
      text: 'Elegant oil-based fragrances with soft floral, musky, and spicy accords for daily wear.'
    },
    {
      title: 'Gift-Ready Selection',
      text: 'Premium-looking bottles and presentation suited for personal use and thoughtful gifting.'
    }
  ];

  return (
    <div className="space-y-10">
      <section className="animate-fade-up relative overflow-hidden rounded-[2.25rem] border border-white/80 bg-[radial-gradient(circle_at_top_left,_rgba(245,158,11,0.18),_transparent_32%),linear-gradient(135deg,_rgba(255,255,255,0.96),_rgba(255,248,235,0.94))] p-8 shadow-[0_28px_80px_rgba(15,23,42,0.1)] sm:p-10">
        <div className="absolute -right-10 top-6 hidden h-44 w-44 rounded-full bg-amber-200/25 blur-3xl lg:block" />
        <div className="absolute left-10 top-0 hidden h-28 w-28 rounded-full bg-amber-300/20 blur-2xl lg:block" />

        <div className="relative grid gap-8 lg:grid-cols-[1.15fr_.85fr] lg:items-center">
          <div>
            <p className="inline-flex rounded-full border border-amber-200 bg-amber-50 px-4 py-1 text-sm font-bold text-amber-800">
              Heritage Fragrance House
            </p>
            <h1 className="mt-6 max-w-3xl text-4xl font-black uppercase tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
              {storeName}
              <span className="mt-2 block text-amber-700">Luxury Oud and Attar for Everyday Elegance</span>
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
              Discover a curated collection of oriental perfumes crafted to feel rich, memorable, and gift-worthy.
              From smoky oud to soft floral attars, each fragrance is selected to leave a strong impression.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/products"
                className="rounded-full bg-slate-950 px-8 py-4 text-sm font-bold text-white transition hover:bg-slate-800"
              >
                Shop The Collection
              </Link>
              <Link
                to="/cart"
                className="rounded-full border border-slate-200 bg-white/90 px-8 py-4 text-sm font-bold text-slate-800 transition hover:border-slate-300 hover:bg-slate-50"
              >
                Review Cart
              </Link>
            </div>

            <div className="mt-6 max-w-2xl">
              <SmartSearchBar
                products={products}
                placeholder="Smart search perfumes, oud, musk, amber, featured..."
              />
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {highlights.map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-white/80 bg-white/80 px-4 py-4 text-sm font-semibold text-slate-700 shadow-[0_8px_22px_rgba(15,23,42,0.05)]"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>

          <aside className="relative min-h-[430px] overflow-hidden rounded-[2rem] border border-white/70 shadow-[0_24px_70px_rgba(15,23,42,0.16)]">
            <img
              src="https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=1200"
              alt={`${storeName} signature perfume`}
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,23,42,0.1)_0%,rgba(15,23,42,0.82)_100%)]" />
            <div className="absolute inset-x-0 bottom-0 p-8 text-white">
              <p className="text-xs font-bold uppercase tracking-[0.35em] text-amber-300">
                Featured House Style
              </p>
              <h2 className="mt-3 text-3xl font-black tracking-tight">
                Bold woods, soft florals, and a luxurious finish.
              </h2>
              <p className="mt-3 max-w-md text-sm leading-6 text-slate-200">
                Designed for customers who want their fragrance to feel premium from first note to final dry-down.
              </p>
            </div>
          </aside>
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-3">
        {pillars.map((pillar) => (
          <article
            key={pillar.title}
            className="animate-fade-up rounded-[1.75rem] border border-white/80 bg-white/85 p-6 shadow-[0_18px_45px_rgba(15,23,42,0.07)]"
          >
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-amber-700">
              Collection Focus
            </p>
            <h2 className="mt-3 text-2xl font-black tracking-tight text-slate-950">
              {pillar.title}
            </h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              {pillar.text}
            </p>
          </article>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.05fr_.95fr]">
        <div className="animate-fade-up rounded-[2rem] border border-white/80 bg-white/85 p-8 shadow-[0_24px_70px_rgba(15,23,42,0.08)]">
          <p className="inline-flex rounded-full bg-amber-100 px-4 py-1 text-sm font-bold text-amber-700">
            Why Customers Choose {storeName}
          </p>
          <h2 className="mt-5 max-w-2xl text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
            A storefront that feels premium before the first order is even placed.
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
            The collection is presented with a clean luxury look, simple product discovery, and a direct ordering flow
            that keeps the buying experience fast and personal.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {[
              'Premium visual presentation for perfumes and attars',
              'Fast catalog browsing with direct product pages',
              'WhatsApp checkout for quick customer communication',
              'Website-based admin management for products and stock'
            ].map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-slate-200/80 bg-slate-50 px-4 py-4 text-sm font-semibold text-slate-700"
              >
                {item}
              </div>
            ))}
          </div>
        </div>

        <article className="animate-fade-up rounded-[2rem] border border-slate-900 bg-slate-950 p-8 text-white shadow-glow">
          <p className="text-xs font-bold uppercase tracking-[0.35em] text-amber-300">
            Ordering Experience
          </p>
          <h2 className="mt-4 text-3xl font-black tracking-tight">
            Browse. Select. Order directly on WhatsApp.
          </h2>
          <p className="mt-4 text-sm leading-7 text-slate-300">
            Customers can add items to the cart or buy instantly from a product card. The checkout flow opens WhatsApp
            with a ready-to-send order summary, keeping the process quick and familiar.
          </p>
          <div className="mt-8 space-y-4">
            {[
              'Step 1: Explore the perfume collection',
              'Step 2: Add to cart or use Buy Now',
              'Step 3: Send the prepared order message on WhatsApp'
            ].map((step) => (
              <div key={step} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-sm font-semibold text-slate-100">
                {step}
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="space-y-5">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-rose-600">
              Trending Now
            </p>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950">
              Most wanted fragrances
            </h2>
          </div>
          <Link
            to="/products"
            className="text-sm font-bold text-slate-700 underline-offset-4 hover:underline"
          >
            Explore full catalog
          </Link>
        </div>

        {loading ? (
          <div className="rounded-[1.75rem] border border-white/80 bg-white/85 p-8 text-center text-slate-500 shadow-[0_18px_45px_rgba(15,23,42,0.08)]">
            Loading trending fragrances...
          </div>
        ) : error ? (
          <div className="rounded-[1.75rem] border border-rose-200 bg-rose-50 p-8 text-center text-rose-700">
            {error}
          </div>
        ) : trending.length ? (
          <div className="grid gap-6 lg:grid-cols-3">
            {trending.map((product) => (
              <ProductCard key={product._id} product={product} onAddToCart={addToCart} />
            ))}
          </div>
        ) : (
          <div className="rounded-[1.75rem] border border-white/80 bg-white/85 p-8 text-center text-slate-500 shadow-[0_18px_45px_rgba(15,23,42,0.08)]">
            Mark products as trending from the admin panel to highlight them here.
          </div>
        )}
      </section>

      <section className="space-y-5">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-amber-600">
              Featured
            </p>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950">
              Featured fragrances
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
        ) : (featured.length || fallbackProducts.length) ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {(featured.length ? featured : fallbackProducts).map((product) => (
              <ProductCard key={product._id} product={product} onAddToCart={addToCart} />
            ))}
          </div>
        ) : (
          <div className="rounded-[1.75rem] border border-white/80 bg-white/85 p-8 text-center text-slate-500 shadow-[0_18px_45px_rgba(15,23,42,0.08)]">
            No products yet. Add your first fragrance from the admin panel.
          </div>
        )}
      </section>
    </div>
  );
}
