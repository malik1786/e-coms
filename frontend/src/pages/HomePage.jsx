import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getProducts } from '../lib/api';
import ProductCard from '../components/ProductCard';
import SmartSearchBar from '../components/SmartSearchBar';
import { useCart } from '../context/CartContext';

const heroImage =
  'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=1600';

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
        setProducts(Array.isArray(data) ? data : []);
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
  const editorialPicks = (featured.length ? featured : fallbackProducts).slice(0, 3);
  const storeName = import.meta.env.VITE_STORE_NAME || 'Nafees Perfumes';

  return (
    <div className="space-y-8 lg:space-y-12">
      <section className="lg:hidden space-y-6">
        <div className="relative overflow-hidden rounded-[2rem]">
          <img src={heroImage} alt={`${storeName} mobile hero`} className="absolute inset-0 h-full w-full object-cover" />
          <div className="hero-amber absolute inset-0" />
          <div className="relative z-10 px-5 pb-8 pt-24 text-white">
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#f0c562]">Private Edit</p>
            <h1 className="font-editorial mt-4 text-4xl leading-[0.96] text-[#181410]">
              Scent stories
              <span className="mt-2 block italic">for the phone screen</span>
            </h1>
            <p className="mt-4 max-w-sm text-sm leading-7 text-white/78">
              Explore oud, musk, amber, and rose through a mobile-first storefront built as a separate experience.
            </p>
            <div className="mt-6 flex gap-3">
              <Link to="/products" className="gold-button rounded-full px-5 py-3 text-sm font-semibold">
                Shop now
              </Link>
              <Link to="/cart" className="rounded-full bg-white/12 px-5 py-3 text-sm font-semibold text-white backdrop-blur-md">
                Cart
              </Link>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {['Long-lasting blends', 'Gift-worthy bottles', 'WhatsApp ordering', 'Curated signatures'].map((item) => (
            <div key={item} className="rounded-[1.4rem] bg-white/80 p-4 text-sm font-medium text-[var(--np-ink)] shadow-[0_10px_24px_rgba(27,28,26,0.04)]">
              {item}
            </div>
          ))}
        </div>

        {loading ? (
          <div className="rounded-[1.8rem] bg-white/80 p-8 text-center text-[var(--np-muted)]">Loading selections...</div>
        ) : error ? (
          <div className="rounded-[1.8rem] bg-rose-50 p-8 text-center text-rose-700">{error}</div>
        ) : (
          <>
            <div className="space-y-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--np-gold)]">Mobile Spotlight</p>
                <h2 className="font-editorial mt-2 text-3xl text-[var(--np-ink)]">Swipe the collection</h2>
              </div>
              <div className="hide-scrollbar flex gap-4 overflow-x-auto pb-1">
                {editorialPicks.map((product) => (
                  <div key={product._id} className="w-[82vw] max-w-[320px] flex-none">
                    <ProductCard product={product} onAddToCart={addToCart} />
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[1.8rem] bg-[var(--np-surface)] p-5">
              <p className="font-editorial text-2xl text-[var(--np-ink)]">Order in three steps</p>
              <div className="mt-4 space-y-3">
                {['Explore the collection', 'Save favorites to cart', 'Open WhatsApp checkout'].map((step) => (
                  <div key={step} className="rounded-[1.2rem] bg-white px-4 py-4 text-sm text-[var(--np-muted)] shadow-[0_8px_18px_rgba(27,28,26,0.04)]">
                    {step}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </section>

      <section className="hidden lg:block">
        <div className="relative overflow-hidden rounded-[2.5rem]">
          <img src={heroImage} alt={`${storeName} desktop hero`} className="absolute inset-0 h-full w-full object-cover" />
          <div className="hero-amber absolute inset-0" />
          <div className="relative z-10 grid min-h-[620px] grid-cols-[1fr_.92fr] items-center px-10 py-10 text-white xl:px-14">
            <div className="max-w-2xl">
              <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#f0c562]">Heritage Fragrance House</p>
              <h1 className="font-editorial mt-5 text-6xl leading-[0.95] text-[#181410]">
                {storeName}
                <span className="mt-2 block italic">Luxury Oud and Attar</span>
              </h1>
              <p className="mt-6 max-w-xl text-base leading-8 text-white/78">
                A desktop-first editorial spread for customers who want to browse the collection like a private catalog rather than a standard store grid.
              </p>
              <div className="mt-8 flex gap-4">
                <Link to="/products" className="gold-button rounded-full px-7 py-4 text-sm font-semibold">
                  Explore The Collection
                </Link>
                <Link to="/cart" className="rounded-full bg-white/12 px-7 py-4 text-sm font-semibold text-white backdrop-blur-md">
                  Review Cart
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="hidden gap-6 lg:grid lg:grid-cols-3">
        {[
          {
            title: 'Signature Oud',
            text: 'Deep smoky woods for customers who want presence and lasting character.'
          },
          {
            title: 'Refined Attars',
            text: 'Elegant oils with floral, musky, and spiced accents for daily wear.'
          },
          {
            title: 'Gift-Ready Edit',
            text: 'A collection arranged to feel ceremonial, premium, and easy to shortlist.'
          }
        ].map((item) => (
          <article key={item.title} className="rounded-[1.8rem] bg-white/82 p-7 shadow-[0_14px_36px_rgba(27,28,26,0.04)]">
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--np-gold)]">Collection Focus</p>
            <h2 className="font-editorial mt-4 text-3xl text-[var(--np-ink)]">{item.title}</h2>
            <p className="mt-4 text-sm leading-7 text-[var(--np-muted)]">{item.text}</p>
          </article>
        ))}
      </section>

      <section className="space-y-5">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--np-gold)]">Trending Now</p>
            <h2 className="font-editorial mt-2 text-3xl text-[var(--np-ink)] lg:text-5xl">Most wanted fragrances</h2>
          </div>
          <Link to="/products" className="hidden text-sm font-medium text-[var(--np-gold)] lg:inline">
            Explore full catalog
          </Link>
        </div>

        {loading ? (
          <div className="rounded-[1.8rem] bg-white/80 p-8 text-center text-[var(--np-muted)]">Loading trending fragrances...</div>
        ) : error ? (
          <div className="rounded-[1.8rem] bg-rose-50 p-8 text-center text-rose-700">{error}</div>
        ) : trending.length ? (
          <div className="grid gap-6 lg:grid-cols-3">
            {trending.map((product) => (
              <ProductCard key={product._id} product={product} onAddToCart={addToCart} />
            ))}
          </div>
        ) : null}
      </section>
    </div>
  );
}
