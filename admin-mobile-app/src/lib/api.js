const API_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');
const TOKEN_KEY = 'client2_admin_token';

/**
 * Universal API request handler
 */
async function request(path, options = {}) {
  const { auth = true, body, headers = {}, ...rest } = options;

  const requestHeaders = { ...headers };

  // JSON handling
  if (body !== undefined) {
    requestHeaders['Content-Type'] = 'application/json';
  }

  // Auth token
  if (auth) {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      requestHeaders.Authorization = `Bearer ${token}`;
    }
  }

  // Build final URL
  const url = `${API_URL}/api${path.startsWith('/') ? path : `/${path}`}`;

  const response = await fetch(url, {
    ...rest,
    body,
    headers: requestHeaders
  });

  const text = await response.text();

  let data;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  if (!response.ok) {
    throw new Error((data && data.message) || 'Request failed');
  }

  return data;
}

/* =========================
   PRODUCT APIs
========================= */

export const getProducts = () =>
  request('/products', { auth: false });

export const getProduct = (id) =>
  request(`/products/${id}`, { auth: false });

export const createProduct = (payload) =>
  request('/products', {
    method: 'POST',
    body: JSON.stringify(payload)
  });

export const updateProduct = (id, payload) =>
  request(`/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload)
  });

export const deleteProduct = (id) =>
  request(`/products/${id}`, {
    method: 'DELETE'
  });

/* =========================
   AUTH APIs
========================= */

export const loginAdmin = (credentials) =>
  request('/auth/login', {
    method: 'POST',
    auth: false,
    body: JSON.stringify(credentials)
  });