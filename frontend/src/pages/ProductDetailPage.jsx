import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getProduct } from '../lib/api';
import { formatPrice } from '../lib/format';
import { getProductImages } from '../lib/productImages';
import { useCart } from '../context/CartContext';
import { buildWhatsAppLink } from '../lib/whatsapp';

const inferNotes = (product) => {
  const source = `${product?.name || ''} ${product?.description || ''}`.toLowerCase();

  return {
    top: source.includes('citrus') || source.includes('bergamot') ? 'Bergamot, Citrus Peel' : 'Saffron, Cardamom',
    heart: source.includes('rose') ? 'Rose, Velvet Petals' : source.includes('jasmine') ? 'Jasmine, Neroli' : 'Amber Bloom, Geranium',
    base: source.includes('musk') ? 'Musk, Soft Woods' : source.includes('oud') ? 'Agarwood, Resin' : 'Sandalwood, Warm Amber'
  };
};

export default function ProductDetailPage() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [notice, setNotice] = useState('');
  const [selectedImage, setSelectedImage] = useState('');

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        const data = await getProduct(id);
        setProduct(data);
        setQuantity(1);
        setSelectedImage(getProductImages(data)[0] || '');
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
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
    return <div className="rounded-[1.8rem] bg-white/80 p-8 text-center text-[var(--np-muted)]">Loading product...</div>;
  }

  if (error) {
    return (
      <div className="space-y-4">
        <div className="rounded-[1.8rem] bg-rose-50 p-8 text-center text-rose-700">{error}</div>
        <Link to="/products" className="inline-flex rounded-full bg-[var(--np-gold)] px-5 py-3 text-sm font-semibold text-white">
          Back to products
        </Link>
      </div>
    );
  }

  if (!product) return null;

  const soldOut = Number(product.stock || 0) <= 0;
  const images = getProductImages(product);
  const activeImage = selectedImage || images[0];
  const notes = inferNotes(product);

  return (
    <div className="space-y-6 lg:space-y-10">
      <Link to="/products" className="text-sm font-medium text-[var(--np-gold)]">Back to products</Link>

      <section className="lg:hidden space-y-5">
        <div className="overflow-hidden rounded-[2rem] bg-white/82 shadow-[0_14px_36px_rgba(27,28,26,0.05)]">
          <div className="aspect-[4/5] bg-[var(--np-surface)]">
            <img src={activeImage} alt={product.name} className="h-full w-full object-cover" />
          </div>
          {images.length > 1 ? (
            <div className="hide-scrollbar flex gap-3 overflow-x-auto p-4">
              {images.map((image, index) => (
                <button
                  key={`${product._id}-${index}`}
                  type="button"
                  onClick={() => setSelectedImage(image)}
                  className={[
                    'h-20 w-16 flex-none overflow-hidden rounded-[1rem]',
                    activeImage === image ? 'ring-2 ring-[var(--np-gold)]' : ''
                  ].join(' ')}
                >
                  <img src={image} alt={`${product.name} ${index + 1}`} className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          ) : null}
        </div>

        <div className="rounded-[1.8rem] bg-[var(--np-surface)] p-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--np-gold)]">Mobile Product View</p>
          <h1 className="font-editorial mt-3 text-4xl leading-tight text-[var(--np-ink)]">{product.name}</h1>
          <p className="mt-3 text-2xl font-semibold text-[var(--np-gold)]">{formatPrice(product.price)}</p>
          <p className="mt-4 text-sm leading-7 text-[var(--np-muted)]">{product.description}</p>

          <div className="mt-5 flex flex-wrap gap-2">
            <span className="rounded-full bg-white px-4 py-2 text-xs text-[var(--np-muted)]">{product.stock} in stock</span>
            <span className={`rounded-full px-4 py-2 text-xs ${soldOut ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'}`}>
              {soldOut ? 'Sold out' : 'Ready to order'}
            </span>
          </div>
        </div>

        <div className="rounded-[1.8rem] bg-white/82 p-5 shadow-[0_14px_36px_rgba(27,28,26,0.05)]">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--np-gold)]">Fragrance profile</p>
          <div className="mt-4 grid grid-cols-3 gap-3">
            {[
              ['Top', notes.top],
              ['Heart', notes.heart],
              ['Base', notes.base]
            ].map(([label, value]) => (
              <div key={label} className="rounded-[1.2rem] bg-[var(--np-surface)] p-3 text-center">
                <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--np-muted)]">{label}</p>
                <p className="mt-2 text-xs font-medium text-[var(--np-ink)]">{value}</p>
              </div>
            ))}
          </div>

          <div className="mt-5 flex items-center gap-3">
            <button type="button" onClick={() => setQuantity((current) => Math.max(1, current - 1))} className="h-11 w-11 rounded-full bg-[var(--np-surface)] text-lg text-[var(--np-ink)]">
              -
            </button>
            <div className="min-w-16 rounded-full bg-[var(--np-surface)] px-4 py-3 text-center text-sm text-[var(--np-ink)]">{quantity}</div>
            <button
              type="button"
              onClick={() => setQuantity((current) => Math.min(current + 1, Number(product.stock || 1)))}
              className="h-11 w-11 rounded-full bg-[var(--np-surface)] text-lg text-[var(--np-ink)]"
            >
              +
            </button>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <button type="button" onClick={handleAddToCart} disabled={soldOut} className="rounded-full bg-white px-4 py-3 text-sm font-semibold text-[var(--np-ink)] disabled:opacity-50">
              Add to cart
            </button>
            <button type="button" onClick={handleBuyNow} disabled={soldOut} className="gold-button rounded-full px-4 py-3 text-sm font-semibold disabled:opacity-50">
              Buy now
            </button>
          </div>

          {notice ? <p className="mt-4 rounded-[1rem] bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{notice}</p> : null}
        </div>
      </section>

      <section className="hidden lg:grid lg:grid-cols-[1fr_.92fr] lg:gap-10">
        <div className="overflow-hidden rounded-[2.3rem] bg-white/86 shadow-[0_20px_50px_rgba(27,28,26,0.05)]">
          <div className="aspect-square bg-[var(--np-surface)]">
            <img src={activeImage} alt={product.name} className="h-full w-full object-cover" />
          </div>
          {images.length > 1 ? (
            <div className="grid grid-cols-4 gap-4 p-5">
              {images.map((image, index) => (
                <button
                  key={`${product._id}-${index}`}
                  type="button"
                  onClick={() => setSelectedImage(image)}
                  className={[
                    'overflow-hidden rounded-[1.3rem] bg-[var(--np-surface)]',
                    activeImage === image ? 'ring-2 ring-[var(--np-gold)]' : ''
                  ].join(' ')}
                >
                  <img src={image} alt={`${product.name} ${index + 1}`} className="h-24 w-full object-cover" />
                </button>
              ))}
            </div>
          ) : null}
        </div>

        <div className="rounded-[2.3rem] bg-white/82 p-8 shadow-[0_20px_50px_rgba(27,28,26,0.05)]">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--np-gold)]">Product detail</p>
          <h1 className="font-editorial mt-3 text-5xl leading-tight text-[var(--np-ink)]">{product.name}</h1>
          <p className="mt-4 text-3xl font-semibold text-[var(--np-gold)]">{formatPrice(product.price)}</p>
          <p className="mt-5 text-base leading-8 text-[var(--np-muted)]">{product.description}</p>

          <div className="mt-8 grid grid-cols-3 gap-4">
            {[
              ['Top', notes.top],
              ['Heart', notes.heart],
              ['Base', notes.base]
            ].map(([label, value]) => (
              <div key={label} className="rounded-[1.5rem] bg-[var(--np-surface)] p-4 text-center">
                <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--np-muted)]">{label}</p>
                <p className="mt-2 text-sm font-medium text-[var(--np-ink)]">{value}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <span className="rounded-full bg-[var(--np-surface)] px-4 py-2 text-sm text-[var(--np-muted)]">{product.stock} in stock</span>
            <span className={`rounded-full px-4 py-2 text-sm ${soldOut ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'}`}>
              {soldOut ? 'Sold out' : 'Ready to order'}
            </span>
          </div>

          <div className="mt-8 flex items-center gap-3">
            <button type="button" onClick={() => setQuantity((current) => Math.max(1, current - 1))} className="h-12 w-12 rounded-full bg-[var(--np-surface)] text-lg text-[var(--np-ink)]">
              -
            </button>
            <div className="min-w-20 rounded-full bg-[var(--np-surface)] px-5 py-3 text-center text-sm text-[var(--np-ink)]">{quantity}</div>
            <button
              type="button"
              onClick={() => setQuantity((current) => Math.min(current + 1, Number(product.stock || 1)))}
              className="h-12 w-12 rounded-full bg-[var(--np-surface)] text-lg text-[var(--np-ink)]"
            >
              +
            </button>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-4">
            <button type="button" onClick={handleAddToCart} disabled={soldOut} className="rounded-full bg-[var(--np-surface)] px-5 py-4 text-sm font-semibold text-[var(--np-ink)] disabled:opacity-50">
              Add to cart
            </button>
            <button type="button" onClick={handleBuyNow} disabled={soldOut} className="gold-button rounded-full px-5 py-4 text-sm font-semibold disabled:opacity-50">
              {soldOut ? 'Out of stock' : 'Buy now'}
            </button>
          </div>

          {notice ? <p className="mt-5 rounded-[1.1rem] bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{notice}</p> : null}
        </div>
      </section>
    </div>
  );
}
