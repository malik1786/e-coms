import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../lib/format';
import { buildWhatsAppLink, DEFAULT_WHATSAPP_NUMBER } from '../lib/whatsapp';
import { handleProductImageError } from '../lib/productImages';

export default function CartPage() {
  const { cart, updateQty, removeFromCart, clearCart, subtotal } = useCart();

  const phone = import.meta.env.VITE_WHATSAPP_NUMBER || DEFAULT_WHATSAPP_NUMBER;
  const storeName = import.meta.env.VITE_STORE_NAME || 'Nafees Perfumes';

  const handleCheckout = () => {
    if (!cart.length) return;

    const checkoutUrl = buildWhatsAppLink({
      phone,
      storeName,
      items: cart,
      total: subtotal
    });

    window.open(checkoutUrl, '_blank', 'noopener,noreferrer');
  };

  if (!cart.length) {
    return (
      <div className="rounded-[2rem] bg-white/86 p-10 text-center shadow-[0_14px_36px_rgba(27,28,26,0.05)]">
        <h1 className="font-editorial text-4xl text-[var(--np-ink)]">Your cart is empty</h1>
        <p className="mt-3 text-[var(--np-muted)]">Browse products and add items before opening WhatsApp checkout.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link to="/products" className="gold-button rounded-full px-5 py-3 text-sm font-semibold">
            Continue shopping
          </Link>
          <Link to="/" className="rounded-full bg-[var(--np-surface)] px-5 py-3 text-sm font-semibold text-[var(--np-ink)]">
            Go home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 lg:space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--np-gold)]">Cart</p>
          <h1 className="font-editorial mt-2 text-4xl text-[var(--np-ink)] lg:text-5xl">Review your order</h1>
        </div>
        <button type="button" onClick={clearCart} className="rounded-full bg-[var(--np-surface)] px-5 py-3 text-sm font-semibold text-[var(--np-ink)]">
          Clear cart
        </button>
      </div>

      <section className="lg:hidden space-y-5">
        {cart.map((item) => (
          <article key={item._id} className="overflow-hidden rounded-[1.8rem] bg-white/84 shadow-[0_14px_36px_rgba(27,28,26,0.05)]">
            <div className="aspect-[4/3] bg-[var(--np-surface)]">
              <img src={item.image} alt={item.name} onError={handleProductImageError} className="h-full w-full object-cover" />
            </div>
            <div className="space-y-4 p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="font-editorial text-2xl text-[var(--np-ink)]">{item.name}</h2>
                  <p className="mt-1 text-sm text-[var(--np-muted)]">{formatPrice(item.price)} each</p>
                </div>
                <p className="text-lg font-semibold text-[var(--np-gold)]">{formatPrice(item.price * item.qty)}</p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => (item.qty === 1 ? removeFromCart(item._id) : updateQty(item._id, item.qty - 1))}
                  className="h-11 w-11 rounded-full bg-[var(--np-surface)] text-lg text-[var(--np-ink)]"
                >
                  -
                </button>
                <div className="min-w-16 rounded-full bg-[var(--np-surface)] px-4 py-3 text-center text-sm text-[var(--np-ink)]">{item.qty}</div>
                <button type="button" onClick={() => updateQty(item._id, item.qty + 1)} className="h-11 w-11 rounded-full bg-[var(--np-surface)] text-lg text-[var(--np-ink)]">
                  +
                </button>
                <button type="button" onClick={() => removeFromCart(item._id)} className="ml-auto rounded-full bg-rose-50 px-4 py-2 text-sm text-rose-700">
                  Remove
                </button>
              </div>
            </div>
          </article>
        ))}

        <aside className="rounded-[1.9rem] bg-[var(--np-ink)] p-6 text-white">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#f0c562]">Summary</p>
          <div className="mt-5 space-y-3 text-sm text-white/78">
            <div className="flex items-center justify-between">
              <span>Items</span>
              <span>{cart.reduce((total, item) => total + item.qty, 0)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
          </div>
          <button type="button" onClick={handleCheckout} className="mt-6 w-full rounded-full bg-white px-5 py-4 text-sm font-semibold text-[var(--np-ink)]">
            Checkout on WhatsApp
          </button>
        </aside>
      </section>

      <section className="hidden lg:grid lg:grid-cols-[1.15fr_.85fr] lg:gap-8">
        <div className="space-y-4">
          {cart.map((item) => (
            <article key={item._id} className="flex gap-5 rounded-[2rem] bg-white/84 p-5 shadow-[0_14px_36px_rgba(27,28,26,0.05)]">
              <img src={item.image} alt={item.name} onError={handleProductImageError} className="h-40 w-40 rounded-[1.4rem] object-cover" />
              <div className="flex flex-1 flex-col justify-between">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="font-editorial text-3xl text-[var(--np-ink)]">{item.name}</h2>
                    <p className="mt-2 text-sm text-[var(--np-muted)]">{formatPrice(item.price)} each</p>
                  </div>
                  <p className="text-xl font-semibold text-[var(--np-gold)]">{formatPrice(item.price * item.qty)}</p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => (item.qty === 1 ? removeFromCart(item._id) : updateQty(item._id, item.qty - 1))}
                    className="h-12 w-12 rounded-full bg-[var(--np-surface)] text-lg text-[var(--np-ink)]"
                  >
                    -
                  </button>
                  <div className="min-w-20 rounded-full bg-[var(--np-surface)] px-5 py-3 text-center text-sm text-[var(--np-ink)]">{item.qty}</div>
                  <button type="button" onClick={() => updateQty(item._id, item.qty + 1)} className="h-12 w-12 rounded-full bg-[var(--np-surface)] text-lg text-[var(--np-ink)]">
                    +
                  </button>
                  <button type="button" onClick={() => removeFromCart(item._id)} className="rounded-full bg-rose-50 px-4 py-2 text-sm text-rose-700">
                    Remove
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        <aside className="h-fit rounded-[2.2rem] bg-[var(--np-ink)] p-8 text-white">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#f0c562]">Summary</p>
          <h2 className="font-editorial mt-4 text-4xl">Private checkout</h2>
          <div className="mt-6 space-y-3 text-sm text-white/78">
            <div className="flex items-center justify-between">
              <span>Items</span>
              <span>{cart.reduce((total, item) => total + item.qty, 0)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
          </div>
          <div className="mt-6 rounded-[1.5rem] bg-white/8 p-5 text-sm leading-7 text-white/72">
            Orders are sent directly to WhatsApp, keeping the desktop checkout calm and conversational instead of form-heavy.
          </div>
          <button type="button" onClick={handleCheckout} className="mt-6 w-full rounded-full bg-white px-5 py-4 text-sm font-semibold text-[var(--np-ink)]">
            Checkout on WhatsApp
          </button>
        </aside>
      </section>
    </div>
  );
}
