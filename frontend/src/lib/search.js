const normalize = (value) => String(value || '').trim().toLowerCase();

const scoreProduct = (product, query) => {
  const normalizedQuery = normalize(query);

  if (!normalizedQuery) {
    return 0;
  }

  const name = normalize(product.name);
  const description = normalize(product.description);
  const badges = [product.featured ? 'featured' : '', product.trending ? 'trending' : '']
    .filter(Boolean)
    .join(' ');

  let score = 0;

  if (name === normalizedQuery) score += 200;
  if (name.startsWith(normalizedQuery)) score += 120;
  if (name.includes(normalizedQuery)) score += 80;
  if (description.includes(normalizedQuery)) score += 35;
  if (badges.includes(normalizedQuery)) score += 25;

  const queryWords = normalizedQuery.split(/\s+/).filter(Boolean);
  queryWords.forEach((word) => {
    if (name.startsWith(word)) score += 30;
    else if (name.includes(word)) score += 20;
    if (description.includes(word)) score += 8;
  });

  if (product.featured) score += 6;
  if (product.trending) score += 4;

  return score;
};

export const rankProducts = (products, query) => {
  const normalizedQuery = normalize(query);

  if (!normalizedQuery) {
    return products;
  }

  return [...products]
    .map((product) => ({
      product,
      score: scoreProduct(product, normalizedQuery)
    }))
    .filter((item) => item.score > 0)
    .sort((left, right) => right.score - left.score)
    .map((item) => item.product);
};

export const getSearchSuggestions = (products, query, limit = 5) =>
  rankProducts(products, query).slice(0, limit);
