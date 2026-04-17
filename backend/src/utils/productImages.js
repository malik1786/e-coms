const normalizeImages = (payload = {}) => {
  const rawImages = Array.isArray(payload.images) ? payload.images : [];
  const normalizedImages = rawImages
    .map((image) => String(image || '').trim())
    .filter(Boolean);

  const legacyImage = String(payload.image || '').trim();

  if (legacyImage && !normalizedImages.includes(legacyImage)) {
    normalizedImages.unshift(legacyImage);
  }

  const primaryImage = normalizedImages[0] || '';

  return {
    image: primaryImage,
    images: normalizedImages
  };
};

module.exports = {
  normalizeImages
};
