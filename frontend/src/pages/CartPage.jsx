import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../lib/format';
import { buildWhatsAppLink } from '../lib/whatsapp';

export default function CartPage() {
  const { cart, updateQty, removeFromCart, clearCart, subtotal } = useCart();

  const phone = import.meta.env.VITE_WHATSAPP_NUMBER;
  const storeName = import.meta.env.VITE_STORE_NAME || 'Nafees Perfumes';

  const handleCheckout = () => {
    if (!phone) {
      window.alert('Set VITE_WHATSAPP_NUMBER in frontend/.env to enable checkout.');
      return;
    }

    if (!cart.length) {
      return;
    }

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
      <div className="rounded-[1.75rem] border border-white/80 bg-white/90 p-10 text-center shadow-[0_18px_45px_rgba(15,23,42,0.08)]">
        <h1 className="text-3xl font-black tracking-tight text-slate-950">
          Your cart is empty
        </h1>
        <p className="mt-3 text-slate-600">
          Browse products and add items before opening WhatsApp checkout.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            to="/products"
            className="rounded-full bg-slate-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-800"
          >
            Continue shopping
          </Link>
          <Link
            to="/"
            className="rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-800 transition hover:border-slate-300 hover:bg-slate-50"
          >
            Go home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-amber-600">
            Cart
          </p>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950">
            Review your order
          </h1>
        </div>
        <button
          type="button"
          onClick={clearCart}
          className="rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-800 transition hover:border-slate-300 hover:bg-slate-50"
        >
          Clear cart
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.15fr_.85fr]">
        <section className="space-y-4">
          {cart.map((item) => (
            <article
              key={item._id}
              className="flex flex-col gap-4 rounded-[1.75rem] border border-white/80 bg-white/90 p-4 shadow-[0_18px_45px_rgba(15,23,42,0.08)] sm:flex-row"
            >
              <img
                src={item.image}
                alt={item.name}
                className="h-36 w-full rounded-[1.25rem] object-cover sm:w-36"
              />

              <div className="flex-1">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-black tracking-tight text-slate-950">
                      {item.name}
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                      {formatPrice(item.price)} each
                    </p>
                  </div>
                  <p className="text-lg font-black text-amber-600">
                    {formatPrice(item.price * item.qty)}
                  </p>
                </div>

                <div className="mt-5 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      item.qty === 1
                        ? removeFromCart(item._id)
                        : updateQty(item._id, item.qty - 1)
                    }
                    className="h-11 w-11 rounded-2xl border border-slate-200 bg-white text-lg font-black text-slate-800 transition hover:bg-slate-50"
                  >
                    -
                  </button>
                  <div className="min-w-20 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-center text-sm font-bold text-slate-700">
                    {item.qty}
                  </div>
                  <button
                    type="button"
                    onClick={() => updateQty(item._id, item.qty + 1)}
                    className="h-11 w-11 rounded-2xl border border-slate-200 bg-white text-lg font-black text-slate-800 transition hover:bg-slate-50"
                  >
                    +
                  </button>
                  <button
                    type="button"
                    onClick={() => removeFromCart(item._id)}
                    className="rounded-full border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-bold text-rose-700 transition hover:bg-rose-100"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </article>
          ))}
        </section>

        <aside className="h-fit rounded-[2rem] border border-slate-900 bg-slate-950 p-8 text-white shadow-glow">
          <p className="text-sm font-bold uppercase tracking-[0.35em] text-orange-300">
            Summary
          </p>
          <div className="mt-6 space-y-3">
            <div className="flex items-center justify-between text-sm text-slate-300">
              <span>Items</span>
              <span>{cart.reduce((total, item) => total + item.qty, 0)}</span>
            </div>
            <div className="flex items-center justify-between text-sm text-slate-300">
              <span>Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
          </div>
          <div className="mt-6 rounded-[1.5rem] border border-white/10 bg-white/5 p-5 text-sm leading-6 text-slate-300">
            Orders are sent directly to WhatsApp. No payment gateway is used.
          </div>
          <button
            type="button"
            onClick={handleCheckout}
            className="mt-6 w-full rounded-2xl bg-white px-5 py-4 text-sm font-black text-slate-950 transition hover:bg-slate-100"
          >
            Checkout on WhatsApp
          </button>
        </aside>
      </div>
    </div>
  );
}
