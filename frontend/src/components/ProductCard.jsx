import { Link } from 'react-router-dom';
import { formatPrice } from '../lib/format';
import { buildWhatsAppLink } from '../lib/whatsapp';

export default function ProductCard({ product, onAddToCart }) {
  const soldOut = Number(product.stock || 0) <= 0;
  const description =
    product.description.length > 95
      ? `${product.description.slice(0, 95)}...`
      : product.description;

  const phone = import.meta.env.VITE_WHATSAPP_NUMBER;
  const storeName = import.meta.env.VITE_STORE_NAME;

  const handleBuyNow = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const link = buildWhatsAppLink({
      phone,
      storeName,
      items: [{ ...product, qty: 1 }],
      total: product.price
    });
    window.open(link, '_blank');
  };

  return (
    <article className="group animate-fade-up overflow-hidden rounded-[1.75rem] border border-white/80 bg-white/90 shadow-[0_18px_45px_rgba(15,23,42,0.08)] transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_24px_55px_rgba(15,23,42,0.12)]">
      <Link to={`/products/${product._id}`} className="block">
        <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
          <div className="absolute left-4 top-4 flex flex-wrap gap-2">
            {product.featured ? (
              <span className="rounded-full bg-amber-500 px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em] text-white shadow-lg">
                Featured
              </span>
            ) : null}
            {product.trending ? (
              <span className="rounded-full bg-slate-950/85 px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em] text-white shadow-lg">
                Trending
              </span>
            ) : null}
          </div>
          {soldOut ? (
            <span className="absolute bottom-4 left-4 rounded-full bg-rose-600 px-3 py-1 text-xs font-bold text-white">
              Out of stock
            </span>
          ) : null}
        </div>
      </Link>

      <div className="space-y-4 p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-black tracking-tight text-slate-950">
              {product.name}
            </h3>
            <p className="mt-1 text-sm leading-6 text-slate-500">{description}</p>
          </div>
          <p className="whitespace-nowrap text-lg font-black text-amber-600">
            {formatPrice(product.price)}
          </p>
        </div>

        <div className="flex items-center justify-between gap-3 text-sm">
          <span className="rounded-full bg-slate-100 px-3 py-1 font-semibold text-slate-600">
            {product.stock} in stock
          </span>
          <Link
            to={`/products/${product._id}`}
            className="font-semibold text-slate-700 underline-offset-4 hover:underline"
          >
            Details
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => onAddToCart(product)}
            disabled={soldOut}
            className="rounded-2xl bg-white border border-slate-200 px-3 py-3 text-xs font-bold text-slate-900 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:bg-slate-100"
          >
            + Cart
          </button>
          <button
            type="button"
            onClick={handleBuyNow}
            disabled={soldOut}
            className="rounded-2xl bg-slate-900 px-3 py-3 text-xs font-bold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            Buy Now
          </button>
        </div>
      </div>
    </article>
  );
}
