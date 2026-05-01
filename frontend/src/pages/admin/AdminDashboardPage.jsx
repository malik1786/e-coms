import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createProduct, deleteProduct, getProducts, updateProduct } from '../../lib/api';
import { formatPrice } from '../../lib/format';
import { getProductImages, getPrimaryProductImage, handleProductImageError } from '../../lib/productImages';
import { useAdminAuth } from '../../context/AdminAuthContext';

const emptyForm = {
  name: '',
  price: '',
  description: '',
  images: [],
  stock: '',
  featured: false,
  trending: false
};

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const { logout } = useAdminAuth();
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const readFilesAsDataUrls = (files) =>
    Promise.all(
      files.map(
        (file) =>
          new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = () => reject(new Error(`Failed to read ${file.name}`));
            reader.readAsDataURL(file);
          })
      )
    );

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

  useEffect(() => {
    loadProducts();
  }, []);

  const safeProducts = Array.isArray(products) ? products : [];
  const stats = useMemo(
    () => [
      { label: 'Total products', value: safeProducts.length },
      { label: 'In stock', value: safeProducts.filter((product) => product.stock > 0).length },
      { label: 'Featured', value: safeProducts.filter((product) => product.featured).length },
      { label: 'Trending', value: safeProducts.filter((product) => product.trending).length }
    ],
    [safeProducts]
  );

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageUpload = async (event) => {
    const files = Array.from(event.target.files || []);

    if (!files.length) {
      return;
    }

    try {
      setError('');
      const uploadedImages = await readFilesAsDataUrls(files);
      setForm((current) => ({
        ...current,
        images: [...current.images, ...uploadedImages]
      }));
    } catch (err) {
      setError(err.message);
    } finally {
      event.target.value = '';
    }
  };

  const removeImage = (indexToRemove) => {
    setForm((current) => ({
      ...current,
      images: current.images.filter((_, index) => index !== indexToRemove)
    }));
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    setMessage('');

    if (
      !form.name.trim() ||
      !form.description.trim() ||
      !form.images.length ||
      form.price === '' ||
      form.stock === ''
    ) {
      setError('Please fill all product fields.');
      setSaving(false);
      return;
    }

    const payload = {
      name: form.name.trim(),
      price: Number(form.price),
      description: form.description.trim(),
      image: form.images[0],
      images: form.images,
      stock: Number(form.stock),
      featured: Boolean(form.featured),
      trending: Boolean(form.trending)
    };

    try {
      if (editingId) {
        await updateProduct(editingId, payload);
        setMessage('Product updated successfully.');
      } else {
        await createProduct(payload);
        setMessage('Product added successfully.');
      }

      resetForm();
      await loadProducts();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (product) => {
    setEditingId(product._id);
    setForm({
      name: product.name,
      price: String(product.price),
      description: product.description,
      images: getProductImages(product),
      stock: String(product.stock),
      featured: Boolean(product.featured),
      trending: Boolean(product.trending)
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) {
      return;
    }

    try {
      setError('');
      setMessage('');
      await deleteProduct(id);
      if (editingId === id) {
        resetForm();
      }
      setMessage('Product deleted.');
      await loadProducts();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/admin_login', { replace: true });
  };

  return (
    <div className="space-y-8">
      <section className="rounded-[2.2rem] bg-white/88 p-8 shadow-[0_24px_70px_rgba(15,23,42,0.06)]">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[var(--np-gold)]">
              Admin panel
            </p>
            <h1 className="font-editorial mt-3 text-4xl tracking-tight text-[var(--np-ink)]">
              Manage products
            </h1>
            <p className="mt-3 text-sm leading-7 text-[var(--np-muted)]">
              Add, edit, and delete products from one simple dashboard.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              to="/products"
              className="rounded-full bg-[var(--np-surface)] px-5 py-3 text-sm font-semibold text-[var(--np-ink)] transition"
            >
              View store
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="gold-button rounded-full px-5 py-3 text-sm font-semibold transition"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-4">
          {stats.map((item) => (
            <div
              key={item.label}
              className="rounded-[1.6rem] bg-[var(--np-surface)] p-5"
            >
              <p className="text-sm font-medium text-[var(--np-muted)]">{item.label}</p>
              <p className="mt-2 text-3xl font-semibold tracking-tight text-[var(--np-ink)]">
                {item.value}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[.9fr_1.1fr]">
        <form
          onSubmit={handleSubmit}
          className="rounded-[2.2rem] bg-white/88 p-8 shadow-[0_24px_70px_rgba(15,23,42,0.06)]"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[var(--np-gold)]">
                Product form
              </p>
              <h2 className="font-editorial mt-2 text-3xl tracking-tight text-[var(--np-ink)]">
                {editingId ? 'Edit product' : 'Add product'}
              </h2>
            </div>
            {editingId ? (
              <button
                type="button"
                onClick={resetForm}
                className="rounded-full bg-[var(--np-surface)] px-4 py-2 text-sm font-semibold text-[var(--np-ink)] transition"
              >
                Cancel
              </button>
            ) : null}
          </div>

          <div className="mt-6 space-y-4">
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Product name"
              className="w-full rounded-[1.2rem] bg-[var(--np-surface)] px-4 py-3 text-sm outline-none transition focus:ring-4 focus:ring-[rgba(205,158,45,0.18)]"
              required
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                placeholder="Price"
                min="0"
                className="w-full rounded-[1.2rem] bg-[var(--np-surface)] px-4 py-3 text-sm outline-none transition focus:ring-4 focus:ring-[rgba(205,158,45,0.18)]"
                required
              />
              <input
                type="number"
                name="stock"
                value={form.stock}
                onChange={handleChange}
                placeholder="Stock"
                min="0"
                className="w-full rounded-[1.2rem] bg-[var(--np-surface)] px-4 py-3 text-sm outline-none transition focus:ring-4 focus:ring-[rgba(205,158,45,0.18)]"
                required
              />
            </div>
            <div className="space-y-4 rounded-[1.5rem] bg-[var(--np-surface)] p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-[var(--np-ink)]">Product images</p>
                  <p className="text-xs text-[var(--np-muted)]">Upload multiple images. The first one becomes the main image.</p>
                </div>
                <label className="gold-button cursor-pointer rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] transition">
                  Upload Images
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {form.images.length ? (
                <div className="grid gap-4 sm:grid-cols-2">
                  {form.images.map((image, index) => (
                    <div key={`${image.slice(0, 24)}-${index}`} className="overflow-hidden rounded-[1.25rem] bg-white">
                      <img
                        src={image}
                        alt={`Upload preview ${index + 1}`}
                        onError={handleProductImageError}
                        className="h-40 w-full object-cover"
                      />
                      <div className="flex items-center justify-between px-3 py-3">
                        <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--np-muted)]">
                          {index === 0 ? 'Main image' : `Image ${index + 1}`}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="rounded-full bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700 transition hover:bg-rose-100"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl bg-white px-4 py-8 text-center text-sm font-medium text-[var(--np-muted)]">
                  No images uploaded yet.
                </div>
              )}
            </div>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Product description"
              rows="5"
              className="w-full rounded-[1.2rem] bg-[var(--np-surface)] px-4 py-3 text-sm outline-none transition focus:ring-4 focus:ring-[rgba(205,158,45,0.18)]"
              required
            />
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="flex items-center gap-3 rounded-[1.2rem] bg-[var(--np-surface)] px-4 py-3 text-sm font-medium text-[var(--np-ink)]">
                <input
                  type="checkbox"
                  name="featured"
                  checked={form.featured}
                  onChange={handleChange}
                  className="h-4 w-4 rounded border-slate-300 text-amber-600 focus:ring-amber-500"
                />
                Show in featured section
              </label>
              <label className="flex items-center gap-3 rounded-[1.2rem] bg-[var(--np-surface)] px-4 py-3 text-sm font-medium text-[var(--np-ink)]">
                <input
                  type="checkbox"
                  name="trending"
                  checked={form.trending}
                  onChange={handleChange}
                  className="h-4 w-4 rounded border-slate-300 text-amber-600 focus:ring-amber-500"
                />
                Show in trending section
              </label>
            </div>
          </div>

          {error ? (
            <div className="mt-4 rounded-[1.2rem] border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
              {error}
            </div>
          ) : null}

          {message ? (
            <div className="mt-4 rounded-[1.2rem] border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
              {message}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={saving}
            className="gold-button mt-6 w-full rounded-full px-5 py-3.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            {saving ? 'Saving...' : editingId ? 'Update product' : 'Add product'}
          </button>
        </form>

        <div className="rounded-[2.2rem] bg-white/88 p-8 shadow-[0_24px_70px_rgba(15,23,42,0.06)]">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[var(--np-gold)]">
                Inventory
              </p>
              <h2 className="font-editorial mt-2 text-3xl tracking-tight text-[var(--np-ink)]">
                All products
              </h2>
            </div>
            <p className="text-sm font-medium text-[var(--np-muted)]">{products.length} total</p>
          </div>

          {loading ? (
            <div className="mt-6 rounded-3xl bg-[var(--np-surface)] p-8 text-center text-[var(--np-muted)]">
              Loading products...
            </div>
          ) : products.length ? (
            <div className="mt-6 overflow-hidden rounded-[1.5rem] bg-[var(--np-surface)]">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200 text-left">
                  <thead className="bg-[var(--np-surface)] text-xs uppercase tracking-[0.2em] text-[var(--np-muted)]">
                    <tr>
                      <th className="px-4 py-4">Product</th>
                      <th className="px-4 py-4">Price</th>
                      <th className="px-4 py-4">Stock</th>
                      <th className="px-4 py-4">Tags</th>
                      <th className="px-4 py-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 bg-white">
                    {products.map((product) => (
                      <tr key={product._id} className="align-top">
                        <td className="px-4 py-4">
                          <div className="flex items-start gap-3">
                            <img
                              src={getPrimaryProductImage(product)}
                              alt={product.name}
                              onError={handleProductImageError}
                              className="h-16 w-16 rounded-2xl object-cover"
                            />
                            <div>
                              <p className="font-semibold text-[var(--np-ink)]">{product.name}</p>
                              <p className="mt-1 max-w-xs text-sm leading-6 text-[var(--np-muted)]">
                                {product.description}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 font-semibold text-[var(--np-ink)]">
                          {formatPrice(product.price)}
                        </td>
                        <td className="px-4 py-4 font-semibold text-[var(--np-ink)]">{product.stock}</td>
                        <td className="px-4 py-4">
                          <div className="flex flex-wrap gap-2">
                            {product.featured ? (
                              <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-amber-800">
                                Featured
                              </span>
                            ) : null}
                            {product.trending ? (
                              <span className="rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-rose-700">
                                Trending
                              </span>
                            ) : null}
                            {!product.featured && !product.trending ? (
                              <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--np-muted)]">
                                Standard
                              </span>
                            ) : null}
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex flex-wrap gap-2">
                            <button
                              type="button"
                              onClick={() => handleEdit(product)}
                              className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-[var(--np-ink)] transition hover:bg-[#faf7f1]"
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(product._id)}
                              className="rounded-full bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-700 transition hover:bg-rose-100"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="mt-6 rounded-3xl bg-[var(--np-surface)] p-8 text-center text-[var(--np-muted)]">
              No products yet.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
