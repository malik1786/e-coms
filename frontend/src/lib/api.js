const API_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');
const TOKEN_KEY = 'client2_admin_token';

function normalizeBaseUrl(value) {
  if (!value) {
    return '';
  }

  return value.endsWith('/api') ? value : `${value}/api`;
}

function getApiBaseCandidates() {
  if (API_URL) {
    return [normalizeBaseUrl(API_URL)];
  }

  if (typeof window !== 'undefined' && window.location?.origin) {
    return ['/api', normalizeBaseUrl(window.location.origin), ''];
  }

  return ['/api', ''];
}

async function sendRequest(baseUrl, path, options = {}) {
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

  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const url = `${baseUrl}${normalizedPath}`;

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
    const error = new Error((data && data.message) || 'Request failed');
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

async function request(path, options = {}) {
  const bases = getApiBaseCandidates();
  let lastError;

  for (let index = 0; index < bases.length; index += 1) {
    try {
      return await sendRequest(bases[index], path, options);
    } catch (error) {
      lastError = error;
      const isLastAttempt = index === bases.length - 1;
      const isRouteMismatch =
        error?.data?.message === 'Route not found' ||
        error?.status === 404;

      if (isLastAttempt || !isRouteMismatch) {
        throw error;
      }
    }
  }

  throw lastError || new Error('Request failed');
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
