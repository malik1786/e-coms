export const getProductImages = (product) => {
  const images = Array.isArray(product?.images) ? product.images : [];
  const normalized = images.filter(Boolean);

  if (normalized.length) {
    return normalized;
  }

  return product?.image ? [product.image] : [];
};

export const getPrimaryProductImage = (product) => getProductImages(product)[0] || '';
