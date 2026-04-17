import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createProduct, deleteProduct, getProducts, updateProduct } from '../../lib/api';
import { formatPrice } from '../../lib/format';
import { getProductImages, getPrimaryProductImage } from '../../lib/productImages';
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
      setProducts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const stats = useMemo(
    () => [
      { label: 'Total products', value: products.length },
      { label: 'In stock', value: products.filter((product) => product.stock > 0).length },
      { label: 'Featured', value: products.filter((product) => product.featured).length },
      { label: 'Trending', value: products.filter((product) => product.trending).length }
    ],
    [products]
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
      <section className="rounded-[2rem] border border-white/80 bg-white/90 p-8 shadow-[0_24px_70px_rgba(15,23,42,0.08)]">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-amber-600">
              Admin panel
            </p>
            <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-950">
              Manage products
            </h1>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Add, edit, and delete products from one simple dashboard.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              to="/products"
              className="rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-800 transition hover:border-slate-300 hover:bg-slate-50"
            >
              View store
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-full bg-slate-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-800"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-4">
          {stats.map((item) => (
            <div
              key={item.label}
              className="rounded-3xl border border-slate-200 bg-slate-50 p-5"
            >
              <p className="text-sm font-semibold text-slate-500">{item.label}</p>
              <p className="mt-2 text-3xl font-black tracking-tight text-slate-950">
                {item.value}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[.9fr_1.1fr]">
        <form
          onSubmit={handleSubmit}
          className="rounded-[2rem] border border-white/80 bg-white/90 p-8 shadow-[0_24px_70px_rgba(15,23,42,0.08)]"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.3em] text-amber-600">
                Product form
              </p>
              <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950">
                {editingId ? 'Edit product' : 'Add product'}
              </h2>
            </div>
            {editingId ? (
              <button
                type="button"
                onClick={resetForm}
                className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
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
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-amber-500 focus:ring-4 focus:ring-amber-100"
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
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-amber-500 focus:ring-4 focus:ring-amber-100"
                required
              />
              <input
                type="number"
                name="stock"
                value={form.stock}
                onChange={handleChange}
                placeholder="Stock"
                min="0"
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-amber-500 focus:ring-4 focus:ring-amber-100"
                required
              />
            </div>
            <div className="space-y-4 rounded-[1.5rem] border border-slate-200 bg-slate-50/70 p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-bold text-slate-900">Product images</p>
                  <p className="text-xs text-slate-500">Upload multiple images. The first one becomes the main image.</p>
                </div>
                <label className="cursor-pointer rounded-full bg-slate-950 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-white transition hover:bg-slate-800">
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
                    <div key={`${image.slice(0, 24)}-${index}`} className="overflow-hidden rounded-[1.25rem] border border-slate-200 bg-white">
                      <img
                        src={image}
                        alt={`Upload preview ${index + 1}`}
                        className="h-40 w-full object-cover"
                      />
                      <div className="flex items-center justify-between px-3 py-3">
                        <span className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
                          {index === 0 ? 'Main image' : `Image ${index + 1}`}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="rounded-full border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-bold text-rose-700 transition hover:bg-rose-100"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-4 py-8 text-center text-sm font-semibold text-slate-500">
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
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-amber-500 focus:ring-4 focus:ring-amber-100"
              required
            />
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700">
                <input
                  type="checkbox"
                  name="featured"
                  checked={form.featured}
                  onChange={handleChange}
                  className="h-4 w-4 rounded border-slate-300 text-amber-600 focus:ring-amber-500"
                />
                Show in featured section
              </label>
              <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700">
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
            <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
              {error}
            </div>
          ) : null}

          {message ? (
            <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
              {message}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={saving}
            className="mt-6 w-full rounded-2xl bg-slate-950 px-5 py-3.5 text-sm font-black text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            {saving ? 'Saving...' : editingId ? 'Update product' : 'Add product'}
          </button>
        </form>

        <div className="rounded-[2rem] border border-white/80 bg-white/90 p-8 shadow-[0_24px_70px_rgba(15,23,42,0.08)]">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.3em] text-amber-600">
                Inventory
              </p>
              <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950">
                All products
              </h2>
            </div>
            <p className="text-sm font-semibold text-slate-500">{products.length} total</p>
          </div>

          {loading ? (
            <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-8 text-center text-slate-500">
              Loading products...
            </div>
          ) : products.length ? (
            <div className="mt-6 overflow-hidden rounded-[1.5rem] border border-slate-200">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200 text-left">
                  <thead className="bg-slate-50 text-xs uppercase tracking-[0.2em] text-slate-500">
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
                              className="h-16 w-16 rounded-2xl object-cover"
                            />
                            <div>
                              <p className="font-black text-slate-950">{product.name}</p>
                              <p className="mt-1 max-w-xs text-sm leading-6 text-slate-500">
                                {product.description}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 font-bold text-slate-800">
                          {formatPrice(product.price)}
                        </td>
                        <td className="px-4 py-4 font-bold text-slate-800">{product.stock}</td>
                        <td className="px-4 py-4">
                          <div className="flex flex-wrap gap-2">
                            {product.featured ? (
                              <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-amber-800">
                                Featured
                              </span>
                            ) : null}
                            {product.trending ? (
                              <span className="rounded-full bg-rose-100 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-rose-700">
                                Trending
                              </span>
                            ) : null}
                            {!product.featured && !product.trending ? (
                              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
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
                              className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(product._id)}
                              className="rounded-full border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-bold text-rose-700 transition hover:bg-rose-100"
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
            <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-8 text-center text-slate-500">
              No products yet.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
