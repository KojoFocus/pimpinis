export const CATEGORIES = [
  { name: 'Dresses',     slug: 'dresses',     emoji: '👗' },
  { name: 'Footwear',    slug: 'footwear',    emoji: '👟' },
  { name: 'Belts',       slug: 'belts',       emoji: '🪢' },
  { name: 'Sunglasses',  slug: 'sunglasses',  emoji: '🕶️' },
  { name: 'Accessories', slug: 'accessories', emoji: '💍' },
  { name: 'Hats',        slug: 'hats',        emoji: '🎩' },
  { name: 'Others',      slug: 'others',      emoji: '🛍️' },
] as const

export type CategorySlug = typeof CATEGORIES[number]['slug']
