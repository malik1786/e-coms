import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getProduct } from '../lib/api';
import { formatPrice } from '../lib/format';
import { useCart } from '../context/CartContext';
import { buildWhatsAppLink } from '../lib/whatsapp';

export default function ProductDetailPage() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [notice, setNotice] = useState('');

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        const data = await getProduct(id);
        setProduct(data);
        setQuantity(1);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!product) {
      return;
    }

    addToCart(product, quantity);
    setNotice(`${product.name} added to cart.`);
  };

  const handleBuyNow = () => {
    if (!product) return;
    const link = buildWhatsAppLink({
      phone: import.meta.env.VITE_WHATSAPP_NUMBER,
      storeName: import.meta.env.VITE_STORE_NAME || 'Nafees Perfumes',
      items: [{ ...product, qty: quantity }],
      total: product.price * quantity
    });
    window.open(link, '_blank');
  };

  if (loading) {
    return (
      <div className="rounded-[1.75rem] border border-white/80 bg-white/85 p-8 text-center text-slate-500 shadow-[0_18px_45px_rgba(15,23,42,0.08)]">
        Loading product...
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <div className="rounded-[1.75rem] border border-rose-200 bg-rose-50 p-8 text-center text-rose-700">
          {error}
        </div>
        <Link
          to="/products"
          className="inline-flex rounded-full bg-slate-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-800"
        >
          Back to products
        </Link>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  const soldOut = Number(product.stock || 0) <= 0;

  return (
    <div className="space-y-6">
      <Link to="/products" className="text-sm font-bold text-slate-700 underline-offset-4 hover:underline">
        Back to products
      </Link>

      <section className="grid gap-8 lg:grid-cols-[1fr_.95fr]">
        <div className="overflow-hidden rounded-[2rem] border border-white/80 bg-white/90 shadow-[0_24px_70px_rgba(15,23,42,0.08)]">
          <div className="aspect-square bg-slate-100">
            <img
              src={product.image}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          </div>
        </div>

        <div className="rounded-[2rem] border border-white/80 bg-white/90 p-8 shadow-[0_24px_70px_rgba(15,23,42,0.08)]">
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-amber-600">
            Product detail
          </p>
          <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-950">
            {product.name}
          </h1>
          <p className="mt-4 text-3xl font-black text-amber-600">
            {formatPrice(product.price)}
          </p>
          <p className="mt-4 leading-7 text-slate-600">{product.description}</p>

          <div className="mt-8 space-y-6">
            <div className="border-t border-slate-100 pt-6">
              <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-slate-900">
                Fragrance Profile
              </h3>
              <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                <div className="rounded-2xl bg-slate-50 p-3">
                  <p className="text-[0.65rem] font-bold uppercase tracking-widest text-slate-500">Top</p>
                  <p className="mt-1 text-xs font-bold text-slate-900">Bergamot, Saffron</p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-3">
                  <p className="text-[0.65rem] font-bold uppercase tracking-widest text-slate-500">Heart</p>
                  <p className="mt-1 text-xs font-bold text-slate-900">Rose, Geranium</p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-3">
                  <p className="text-[0.65rem] font-bold uppercase tracking-widest text-slate-500">Base</p>
                  <p className="mt-1 text-xs font-bold text-slate-900">Agarwood, Musk</p>
                </div>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-600">
                {product.stock} in stock
              </span>
              {soldOut ? (
                <span className="rounded-full bg-rose-100 px-4 py-2 text-sm font-bold text-rose-700">
                  Sold out
                </span>
              ) : (
                <span className="rounded-full bg-emerald-100 px-4 py-2 text-sm font-bold text-emerald-700">
                  Ready to ship
                </span>
              )}
            </div>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setQuantity((current) => Math.max(1, current - 1))}
              className="h-12 w-12 rounded-2xl border border-slate-200 bg-white text-lg font-black text-slate-800 transition hover:bg-slate-50"
            >
              -
            </button>
            <div className="min-w-20 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-center text-sm font-bold text-slate-700">
              {quantity}
            </div>
            <button
              type="button"
              onClick={() =>
                setQuantity((current) => Math.min(current + 1, Number(product.stock || 1)))
              }
              className="h-12 w-12 rounded-2xl border border-slate-200 bg-white text-lg font-black text-slate-800 transition hover:bg-slate-50"
            >
              +
            </button>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={soldOut}
              className="w-full rounded-2xl bg-white border border-slate-200 px-5 py-4 text-sm font-bold text-slate-900 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:bg-slate-100"
            >
              Add to cart
            </button>
            <button
              type="button"
              onClick={handleBuyNow}
              disabled={soldOut}
              className="w-full rounded-2xl bg-slate-950 px-5 py-4 text-sm font-bold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              {soldOut ? 'Out of stock' : 'Buy Now'}
            </button>
          </div>

          {notice ? (
            <p className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
              {notice}
            </p>
          ) : null}
        </div>
      </section>
    </div>
  );
}
