import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import SmartSearchBar from '../components/SmartSearchBar';
import { getProducts } from '../lib/api';
import { rankProducts } from '../lib/search';
import { useCart } from '../context/CartContext';

const categories = [
  'All Fragrances',
  'Woody & Oud',
  'Floral & Bloom',
  'Citrus & Fresh',
  'Musk & Leather'
];

const intensityOptions = ['Parfum', 'Eau de Parfum', 'Extrait', 'Pure Oil'];

const heroImage =
  'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=1600';

const normalize = (value) => String(value || '').toLowerCase();

const matchesCategory = (product, activeCategory) => {
  if (!activeCategory || activeCategory === 'All Fragrances') {
    return true;
  }

  const source = normalize(`${product.name} ${product.description}`);

  if (activeCategory === 'Woody & Oud') {
    return source.includes('oud') || source.includes('wood') || source.includes('agarwood');
  }

  if (activeCategory === 'Floral & Bloom') {
    return source.includes('rose') || source.includes('floral') || source.includes('jasmine') || source.includes('peony');
  }

  if (activeCategory === 'Citrus & Fresh') {
    return source.includes('citrus') || source.includes('fresh') || source.includes('neroli') || source.includes('bergamot');
  }

  if (activeCategory === 'Musk & Leather') {
    return source.includes('musk') || source.includes('leather');
  }

  return true;
};

const sortProducts = (items, sortBy) => {
  const copy = [...items];

  if (sortBy === 'Price: High to Low') {
    return copy.sort((left, right) => Number(right.price) - Number(left.price));
  }

  if (sortBy === 'Price: Low to High') {
    return copy.sort((left, right) => Number(left.price) - Number(right.price));
  }

  if (sortBy === 'Newest') {
    return copy.sort((left, right) => new Date(right.createdAt) - new Date(left.createdAt));
  }

  return copy.sort((left, right) => {
    const rightScore = (right.featured ? 3 : 0) + (right.trending ? 2 : 0);
    const leftScore = (left.featured ? 3 : 0) + (left.trending ? 2 : 0);
    return rightScore - leftScore;
  });
};

export default function ProductsPage() {
  const { addToCart } = useCart();
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeCategory, setActiveCategory] = useState('All Fragrances');
  const [sortBy, setSortBy] = useState('Curated Selection');
  const [activeIntensity, setActiveIntensity] = useState('');

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const data = await getProducts();
        if (Array.isArray(data)) {
          setProducts(data);
        } else {
          setProducts([]);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const searchQuery = searchParams.get('q') || '';

  const filteredProducts = useMemo(() => {
    const ranked = rankProducts(products, searchQuery);
    const categoryFiltered = ranked.filter((product) => matchesCategory(product, activeCategory));
    return sortProducts(categoryFiltered, sortBy);
  }, [activeCategory, products, searchQuery, sortBy]);

  const spotlightProducts = filteredProducts.slice(0, 3);
  const collectionProducts = filteredProducts.slice(0, 6);
  const storeName = import.meta.env.VITE_STORE_NAME || 'Nafees Perfumes';

  const handleQueryChange = (nextValue) => {
    const trimmed = nextValue.trim();

    if (!trimmed) {
      setSearchParams({}, { replace: true });
      return;
    }

    setSearchParams({ q: trimmed }, { replace: true });
  };

  const renderProductGrid = (items) => (
    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 xl:grid-cols-3">
      {items.map((product) => (
        <ProductCard key={product._id} product={product} onAddToCart={addToCart} />
      ))}
    </div>
  );

  return (
    <div className="space-y-8 lg:space-y-12">
      <section className="overflow-hidden rounded-[2rem] lg:rounded-[2.4rem]">
        <div className="relative min-h-[540px] lg:min-h-[420px]">
          <img
            src={heroImage}
            alt={`${storeName} collection hero`}
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="hero-amber absolute inset-0" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_35%,rgba(255,220,160,0.36),transparent_18%),radial-gradient(circle_at_92%_52%,rgba(255,214,121,0.28),transparent_18%)]" />

          <div className="relative z-10 flex h-full flex-col justify-end px-5 py-8 text-white sm:px-8 lg:grid lg:grid-cols-[1.05fr_.95fr] lg:items-center lg:px-10 lg:py-10">
            <div className="max-w-xl">
              <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#f0c562]">
                Limited Release
              </p>
              <h1 className="font-editorial mt-4 text-4xl leading-[0.98] text-[#201a14] sm:text-5xl lg:text-6xl">
                Private Collection:
                <span className="mt-2 block italic text-[#181410]">Sultans of the East</span>
              </h1>
              <p className="mt-5 max-w-lg text-sm leading-7 text-white/78 sm:text-base">
                An uncompromising exploration of rare oud, rose, amber, and smoke curated for customers who want a fragrance collection that feels ceremonial.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  to="/products"
                  className="gold-button inline-flex rounded-full px-6 py-3 text-sm font-semibold shadow-[0_14px_34px_rgba(121,89,0,0.25)]"
                >
                  Explore the Collection
                </Link>
                <Link
                  to="/cart"
                  className="inline-flex rounded-full bg-white/12 px-6 py-3 text-sm font-semibold text-white backdrop-blur-md"
                >
                  Review Cart
                </Link>
              </div>
            </div>


          </div>
        </div>
      </section>

      <section className="lg:hidden space-y-6">
        <div className="rounded-[1.8rem] bg-[var(--np-surface)] p-4">
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-[var(--np-gold)]">Mobile Edit</p>
              <h2 className="font-editorial mt-2 text-3xl leading-tight text-[var(--np-ink)]">The Collection</h2>
            </div>
            <div className="text-right">
              <p className="text-xs uppercase tracking-[0.18em] text-[var(--np-muted)]">Sort by</p>
              <select
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value)}
                className="bg-transparent pt-1 text-sm text-[var(--np-ink)] outline-none"
              >
                <option>Curated Selection</option>
                <option>Newest</option>
                <option>Price: High to Low</option>
                <option>Price: Low to High</option>
              </select>
            </div>
          </div>

          <p className="mt-3 text-sm text-[var(--np-muted)]">
            Showing {filteredProducts.length} refined expressions
          </p>

          <div className="hide-scrollbar mt-5 flex gap-2 overflow-x-auto pb-1">
            {categories.map((category) => {
              const active = category === activeCategory;

              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => setActiveCategory(category)}
                  className={[
                    'whitespace-nowrap rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] transition',
                    active
                      ? 'bg-[var(--np-gold)] text-white'
                      : 'bg-white text-[var(--np-muted)] shadow-[0_8px_18px_rgba(27,28,26,0.04)]'
                  ].join(' ')}
                >
                  {category}
                </button>
              );
            })}
          </div>

          <div className="hide-scrollbar mt-3 flex gap-2 overflow-x-auto pb-1">
            {intensityOptions.map((option) => {
              const active = option === activeIntensity;

              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => setActiveIntensity(active ? '' : option)}
                  className={[
                    'whitespace-nowrap rounded-full px-4 py-2 text-xs transition',
                    active
                      ? 'bg-white text-[var(--np-gold)] shadow-[0_8px_18px_rgba(27,28,26,0.04)]'
                      : 'bg-transparent text-[var(--np-muted)] ghost-stroke'
                  ].join(' ')}
                >
                  {option}
                </button>
              );
            })}
          </div>
        </div>

        {loading ? (
          <div className="rounded-[1.7rem] bg-white/80 p-8 text-center text-[var(--np-muted)]">
            Loading fragrances...
          </div>
        ) : error ? (
          <div className="rounded-[1.7rem] bg-rose-50 p-8 text-center text-rose-700">
            {error}
          </div>
        ) : filteredProducts.length ? (
          <div className="space-y-6">
            {spotlightProducts.length ? (
              <div className="space-y-4">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-[var(--np-gold)]">Spotlight</p>
                  <h3 className="font-editorial mt-2 text-2xl text-[var(--np-ink)]">Most wanted on mobile</h3>
                </div>
                <div className="hide-scrollbar flex gap-4 overflow-x-auto pb-1">
                  {spotlightProducts.map((product) => (
                    <div key={product._id} className="w-[82vw] max-w-[320px] flex-none">
                      <ProductCard product={product} onAddToCart={addToCart} />
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            <div className="space-y-4">
              <div className="rounded-[1.7rem] bg-[var(--np-surface)] p-5">
                <p className="font-editorial text-2xl text-[var(--np-ink)]">Scent Discovery</p>
                <p className="mt-3 text-sm leading-6 text-[var(--np-muted)]">
                  Unsure where to start? Explore featured picks, then open WhatsApp checkout when the shortlist feels right.
                </p>
              </div>
              {renderProductGrid(collectionProducts)}
            </div>
          </div>
        ) : (
          <div className="rounded-[1.7rem] bg-white/80 p-8 text-center text-[var(--np-muted)]">
            {searchQuery ? 'No perfumes match your current search.' : 'No perfumes available right now.'}
          </div>
        )}
      </section>

      <section className="hidden items-start gap-10 lg:grid lg:grid-cols-[250px_minmax(0,1fr)] xl:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="sticky top-28 space-y-10">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--np-muted)]">Categories</p>
            <div className="mt-5 space-y-4">
              {categories.map((category) => (
                <label key={category} className="flex items-center gap-3 text-sm text-[var(--np-ink)]">
                  <input
                    type="checkbox"
                    checked={activeCategory === category}
                    onChange={() => setActiveCategory(category)}
                    className="h-4 w-4 rounded-sm border-[var(--np-outline)] text-[var(--np-gold)] focus:ring-[var(--np-gold)]"
                  />
                  <span>{category}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--np-muted)]">Fragrance Intensity</p>
            <div className="mt-5 grid grid-cols-2 gap-2">
              {intensityOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setActiveIntensity(activeIntensity === option ? '' : option)}
                  className={[
                    'rounded-full px-3 py-2 text-xs transition',
                    activeIntensity === option
                      ? 'bg-white text-[var(--np-gold)] shadow-[0_10px_18px_rgba(27,28,26,0.04)]'
                      : 'ghost-stroke text-[var(--np-muted)]'
                  ].join(' ')}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-[1.6rem] bg-[var(--np-surface)] p-6">
            <p className="font-editorial text-2xl text-[var(--np-ink)]">Scent Discovery</p>
            <p className="mt-4 text-sm leading-7 text-[var(--np-muted)]">
              Take the collection as a guided edit. Start with featured oud, compare the florals, then let the finish decide the signature.
            </p>
            <button type="button" className="mt-6 text-sm font-medium text-[var(--np-gold)] underline-offset-4 hover:underline">
              Start Journey
            </button>
          </div>
        </aside>

        <div>
          <div className="mb-10 flex items-end justify-between gap-6">
            <div>
              <h2 className="font-editorial text-5xl leading-none text-[var(--np-ink)]">The Collection</h2>
              <p className="mt-3 text-sm text-[var(--np-muted)]">
                Showing {filteredProducts.length} refined expressions
              </p>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-[11px] font-semibold uppercase tracking-[0.26em] text-[var(--np-muted)]">Sort by</span>
              <select
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value)}
                className="bg-transparent text-sm text-[var(--np-ink)] outline-none"
              >
                <option>Curated Selection</option>
                <option>Newest</option>
                <option>Price: High to Low</option>
                <option>Price: Low to High</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="rounded-[1.8rem] bg-white/80 p-10 text-center text-[var(--np-muted)]">
              Loading fragrances...
            </div>
          ) : error ? (
            <div className="rounded-[1.8rem] bg-rose-50 p-10 text-center text-rose-700">
              {error}
            </div>
          ) : filteredProducts.length ? (
            <>
              {renderProductGrid(collectionProducts)}

              <div className="mt-16 flex items-center justify-center gap-4">
                <button type="button" className="ghost-stroke flex h-10 w-10 items-center justify-center rounded-full text-[var(--np-muted)]">
                  ‹
                </button>
                <span className="text-sm text-[var(--np-muted)]">Page 1 of 4</span>
                <button type="button" className="ghost-stroke flex h-10 w-10 items-center justify-center rounded-full text-[var(--np-muted)]">
                  ›
                </button>
              </div>
            </>
          ) : (
            <div className="rounded-[1.8rem] bg-white/80 p-10 text-center text-[var(--np-muted)]">
              {searchQuery ? 'No perfumes match your current search.' : 'No perfumes available right now.'}
            </div>
          )}
        </div>
      </section>


    </div>
  );
}
