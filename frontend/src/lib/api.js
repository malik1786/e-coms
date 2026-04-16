// In dev the Vite proxy forwards /products & /auth to localhost:5000 – no CORS needed.
// In production the full URL from .env is used.
// In production, we use the VITE_API_URL env var. In dev, we use an empty string to trigger the Vite proxy.
const API_URL = import.meta.env.PROD 
  ? (import.meta.env.VITE_API_URL || '').replace(/\/$/, '') 
  : '';
const TOKEN_KEY = 'client2_admin_token';

async function request(path, options = {}) {
  const { auth = true, body, headers = {}, ...rest } = options;
  const requestHeaders = { ...headers };

  if (body !== undefined) {
    requestHeaders['Content-Type'] = 'application/json';
  }

  if (auth) {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      requestHeaders.Authorization = `Bearer ${token}`;
    }
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...rest,
    body,
    headers: requestHeaders
  });

  const text = await response.text();
  let data = null;

  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }

  if (!response.ok) {
    throw new Error((data && data.message) || 'Request failed');
  }

  return data;
}

export const getProducts = () => request('/products', { auth: false });
export const getProduct = (id) => request(`/products/${id}`, { auth: false });
export const loginAdmin = (credentials) =>
  request('/auth/login', {
    method: 'POST',
    auth: false,
    body: JSON.stringify(credentials)
  });
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
