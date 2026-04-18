import { Link } from 'react-router-dom';
import { formatPrice } from '../lib/format';
import { getPrimaryProductImage, handleProductImageError } from '../lib/productImages';
import { buildWhatsAppLink } from '../lib/whatsapp';

const inferFamily = (product) => {
  const source = `${product.name} ${product.description}`.toLowerCase();

  if (source.includes('rose') || source.includes('floral') || source.includes('jasmine')) {
    return 'Floral';
  }

  if (source.includes('musk')) {
    return 'Musk';
  }

  if (source.includes('amber') || source.includes('vanilla')) {
    return 'Amber';
  }

  if (source.includes('saffron') || source.includes('spice')) {
    return 'Spices';
  }

  return 'Woody & Oud';
};

export default function ProductCard({ product, onAddToCart }) {
  const soldOut = Number(product.stock || 0) <= 0;
  const primaryImage = getPrimaryProductImage(product);
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
    <article className="group animate-fade-up">
      <Link to={`/products/${product._id}`} className="block">
        <div className="relative aspect-[4/5] overflow-hidden rounded-[1.4rem] bg-[var(--np-surface)] shadow-[0_16px_40px_rgba(27,28,26,0.04)] transition duration-500 group-hover:-translate-y-1 group-hover:shadow-[0_24px_50px_rgba(27,28,26,0.08)]">
          <img
            src={primaryImage}
            alt={product.name}
            onError={handleProductImageError}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
          <div className="absolute left-4 top-4 flex flex-wrap gap-2">
            {product.featured ? (
              <span className="rounded-full bg-white/82 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--np-muted)] backdrop-blur-md">
                Bestseller
              </span>
            ) : null}
            {product.trending ? (
              <span className="rounded-full bg-[rgba(121,89,0,0.86)] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-white shadow-lg">
                New
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

      <div className="px-1 pb-2 pt-5">
        <p className="text-[10px] uppercase tracking-[0.24em] text-[var(--np-muted)]">
          {inferFamily(product)}
        </p>
        <div className="mt-3 flex items-start justify-between gap-4">
          <div>
            <h3 className="font-editorial text-[1.45rem] leading-tight text-[var(--np-ink)]">
              {product.name}
            </h3>
            <p className="mt-2 max-w-sm text-sm leading-6 text-[var(--np-muted)]">{description}</p>
          </div>
          <p className="whitespace-nowrap pt-1 text-base font-semibold text-[var(--np-gold)]">
            {formatPrice(product.price)}
          </p>
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-sm">
          <span className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-[var(--np-muted)] shadow-[0_6px_18px_rgba(27,28,26,0.04)]">
            {product.stock} in stock
          </span>
          <Link to={`/products/${product._id}`} className="text-sm font-medium text-[var(--np-gold)] underline-offset-4 hover:underline">
            View details
          </Link>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => onAddToCart(product)}
            disabled={soldOut}
            className="rounded-full bg-white px-3 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--np-ink)] shadow-[0_8px_18px_rgba(27,28,26,0.04)] transition hover:bg-[var(--np-surface)] disabled:cursor-not-allowed disabled:bg-slate-100"
          >
            + Cart
          </button>
          <button
            type="button"
            onClick={handleBuyNow}
            disabled={soldOut}
            className="gold-button rounded-full px-3 py-3 text-xs font-semibold uppercase tracking-[0.16em] transition hover:brightness-105 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            Buy Now
          </button>
        </div>
      </div>
    </article>
  );
}
