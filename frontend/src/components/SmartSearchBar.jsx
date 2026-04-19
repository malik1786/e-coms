import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { formatPrice } from '../lib/format';
import { getSearchSuggestions } from '../lib/search';
import { handleProductImageError } from '../lib/productImages';

export default function SmartSearchBar({
  products,
  initialValue = '',
  placeholder = 'Search fragrances, oud, musk, featured...',
  compact = false,
  onQueryChange
}) {
  const navigate = useNavigate();
  const [query, setQuery] = useState(initialValue);
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    setQuery(initialValue);
  }, [initialValue]);

  const suggestions = useMemo(
    () => getSearchSuggestions(products, query, compact ? 4 : 6),
    [compact, products, query]
  );

  const showSuggestions = focused && query.trim().length > 0;

  const handleSubmit = (event) => {
    event.preventDefault();
    const trimmed = query.trim();

    if (!trimmed) {
      onQueryChange?.('');
      navigate('/products');
      return;
    }

    onQueryChange?.(trimmed);
    navigate(`/products?q=${encodeURIComponent(trimmed)}`);
  };

  const handleChange = (event) => {
    const nextValue = event.target.value;
    setQuery(nextValue);
    onQueryChange?.(nextValue);
  };

  return (
    <div className="relative">
      <form onSubmit={handleSubmit} className="relative">
        <svg
          className="pointer-events-none absolute left-4 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-slate-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          type="text"
          value={query}
          onChange={handleChange}
          onFocus={() => setFocused(true)}
          onBlur={() => window.setTimeout(() => setFocused(false), 120)}
          placeholder={placeholder}
          className={[
            'w-full rounded-full bg-white/95 pl-11 pr-28 text-sm text-[var(--np-ink)] outline-none shadow-[0_12px_30px_rgba(27,28,26,0.05)] transition focus:ring-4 focus:ring-[rgba(205,158,45,0.18)]',
            compact ? 'py-3' : 'py-4'
          ].join(' ')}
        />
        <button
          type="submit"
          className="gold-button absolute right-2 top-1/2 -translate-y-1/2 rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] transition hover:brightness-105"
        >
          Search
        </button>
      </form>

      {showSuggestions ? (
        <div 
          className="absolute left-0 right-0 top-[calc(100%+0.75rem)] z-30 overflow-hidden rounded-[1.5rem] bg-white shadow-[0_25px_60px_rgba(15,23,42,0.2)] border border-[rgba(0,0,0,0.05)]"
          onMouseDown={(e) => e.preventDefault()}
        >
          {suggestions.length ? (
            <div className="divide-y divide-slate-100">
              {suggestions.map((product) => (
                <Link
                  key={product._id}
                  to={`/products/${product._id}`}
                  onClick={() => setFocused(false)}
                  className="flex items-center gap-4 px-4 py-3 transition hover:bg-amber-50/70"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    onError={handleProductImageError}
                    className="h-14 w-14 rounded-2xl object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate font-bold text-slate-950">{product.name}</p>
                      {product.featured ? (
                        <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-black uppercase tracking-[0.18em] text-amber-800">
                          Featured
                        </span>
                      ) : null}
                      {product.trending ? (
                        <span className="rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-black uppercase tracking-[0.18em] text-rose-700">
                          Trending
                        </span>
                      ) : null}
                    </div>
                    <p className="truncate text-sm text-slate-500">{product.description}</p>
                  </div>
                  <span className="whitespace-nowrap text-sm font-black text-amber-700">
                    {formatPrice(product.price)}
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <div className="px-5 py-4 text-sm font-semibold text-slate-500">
              No close matches found. Try searching by oud, musk, rose, or amber.
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
