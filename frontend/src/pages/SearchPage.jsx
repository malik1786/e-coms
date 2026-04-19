import { useEffect, useMemo, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { getProducts } from '../lib/api';
import { rankProducts } from '../lib/search';
import ProductCard from '../components/ProductCard';
import { useCart } from '../context/CartContext';

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const query = searchParams.get('q') || '';

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
  }, [query]);

  const results = useMemo(() => rankProducts(products, query), [products, query]);

  const handleQueryChange = (e) => {
    e.preventDefault();
    const val = e.target.search.value.trim();
    if (val) {
      setSearchParams({ q: val });
    } else {
      setSearchParams({});
    }
  };

  return (
    <div className="space-y-12 py-8">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[var(--np-gold)]">
          Search Results
        </p>
        <h1 className="font-editorial mt-4 text-4xl text-[var(--np-ink)] md:text-5xl">
          {query ? `"${query}"` : 'Universal Search'}
        </h1>
        
        <form onSubmit={handleQueryChange} className="mt-10 relative">
          <input 
            type="text" 
            name="search"
            defaultValue={query}
            placeholder="Search fragrances, notes, collections..." 
            className="w-full rounded-2xl bg-white border border-slate-100 p-6 pr-32 text-lg shadow-[0_20px_50px_rgba(0,0,0,0.04)] outline-none focus:ring-4 focus:ring-[rgba(205,158,45,0.12)] transition"
          />
          <button 
            type="submit"
            className="gold-button absolute right-3 top-3 bottom-3 rounded-xl px-8 text-sm font-bold uppercase tracking-widest"
          >
            Search
          </button>
        </form>
      </div>

      <div className="space-y-8">
        <div className="flex items-center justify-between border-b border-slate-100 pb-6">
          <p className="text-sm font-medium text-[var(--np-muted)]">
            {loading ? 'Finding your scents...' : `Found ${results.length} matches`}
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="aspect-[3/4] animate-pulse rounded-[2rem] bg-white/50" />
            ))}
          </div>
        ) : results.length > 0 ? (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {results.map((product) => (
              <ProductCard key={product._id} product={product} onAddToCart={addToCart} />
            ))}
          </div>
        ) : query ? (
          <div className="rounded-[2.5rem] bg-white py-24 text-center">
            <h3 className="font-editorial text-3xl text-[var(--np-ink)]">No matches found</h3>
            <p className="mt-4 text-[var(--np-muted)]">Try searching for generic terms like "Oud", "Musk", or "Rose".</p>
            <Link 
              to="/products"
              className="mt-8 inline-block text-sm font-bold uppercase tracking-widest text-[var(--np-gold)] underline underline-offset-8"
            >
              Browse Full Collection
            </Link>
          </div>
        ) : null}
      </div>
    </div>
  );
}
