import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import SmartSearchBar from '../components/SmartSearchBar';
import { getProducts } from '../lib/api';
import { rankProducts } from '../lib/search';
import { useCart } from '../context/CartContext';

export default function ProductsPage() {
  const { addToCart } = useCart();
  const [searchParams] = useSearchParams();
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
  const filteredProducts = useMemo(
    () => rankProducts(products, searchQuery),
    [products, searchQuery]
  );

  return (
    <div className="space-y-6">
      <div className="animate-fade-up flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-amber-600">
            Catalog
          </p>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950">
            Our Fragrances
          </h1>
        </div>
        <div className="flex w-full sm:w-auto items-center gap-3">
          <div className="w-full sm:w-[26rem]">
            <SmartSearchBar
              products={products}
              initialValue={searchQuery}
              compact
              placeholder="Smart search by fragrance name, oud, amber, featured..."
            />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="rounded-[1.75rem] border border-white/80 bg-white/85 p-8 text-center text-slate-500 shadow-[0_18px_45px_rgba(15,23,42,0.08)]">
          Loading fragrances...
        </div>
      ) : error ? (
        <div className="rounded-[1.75rem] border border-rose-200 bg-rose-50 p-8 text-center text-rose-700">
          {error}
        </div>
      ) : filteredProducts.length ? (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {filteredProducts.map((product) => (
            <ProductCard key={product._id} product={product} onAddToCart={addToCart} />
          ))}
        </div>
      ) : (
        <div className="rounded-[1.75rem] border border-white/80 bg-white/85 p-8 text-center text-slate-500 shadow-[0_18px_45px_rgba(15,23,42,0.08)]">
          {searchQuery ? "No perfumes match your smart search yet." : "No perfumes available right now."}
        </div>
      )}
    </div>
  );
}
