export const PRODUCT_IMAGE_FALLBACK =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="900" height="1100" viewBox="0 0 900 1100"><rect width="900" height="1100" rx="48" fill="%23f5f3ef"/><text x="50%25" y="46%25" text-anchor="middle" fill="%23795900" font-family="Georgia, serif" font-size="54">Oops</text><text x="50%25" y="54%25" text-anchor="middle" fill="%236f6c66" font-family="Arial, sans-serif" font-size="28">Image unavailable</text></svg>';

export const getProductImages = (product) => {
  const images = Array.isArray(product?.images) ? product.images : [];
  const normalized = images.filter(Boolean);

  if (normalized.length) {
    return normalized;
  }

  return product?.image ? [product.image] : [];
};

export const getPrimaryProductImage = (product) => getProductImages(product)[0] || PRODUCT_IMAGE_FALLBACK;

export const handleProductImageError = (event) => {
  if (event.currentTarget.src !== PRODUCT_IMAGE_FALLBACK) {
    event.currentTarget.src = PRODUCT_IMAGE_FALLBACK;
  }
};
