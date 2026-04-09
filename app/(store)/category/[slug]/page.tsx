import { createServerSupabaseClient } from '@/lib/supabase/server'
import ProductCard from '@/components/store/ProductCard'
import type { Category, Product } from '@/types'
import { notFound } from 'next/navigation'

const CATEGORY_EMOJI: Record<string, string> = {
  dresses: '👗',
  footwear: '👟',
  belts: '🪢',
  sunglasses: '🕶️',
  accessories: '💍',
  hats: '🎩',
  others: '🛍️',
  bags: '👜',
  watches: '⌚',
  jewelry: '💍',
  makeup: '💄',
  scarves: '🧣',
  jackets: '🧥',
  jeans: '👖',
  shirts: '👕',
  shorts: '🩳',
  backpacks: '🎒',
  perfume: '🌸',
}

function emojiForCategory(cat: Category) {
  const slug = cat.slug.toLowerCase()
  const name = cat.name.toLowerCase()
  if (CATEGORY_EMOJI[slug]) return CATEGORY_EMOJI[slug]
  if (name.includes('bag')) return '👜'
  if (name.includes('watch')) return '⌚'
  if (name.includes('ring') || name.includes('jewel') || name.includes('neck')) return '💍'
  if (name.includes('shoe') || name.includes('foot')) return '👟'
  if (name.includes('dress')) return '👗'
  if (name.includes('hat') || name.includes('cap')) return '🎩'
  if (name.includes('glass')) return '🕶️'
  if (name.includes('belt')) return '🪢'
  if (name.includes('perfume')) return '🌸'
  if (name.includes('makeup') || name.includes('lip')) return '💄'
  if (name.includes('scar') || name.includes('shawl')) return '🧣'
  if (name.includes('sock')) return '🧦'
  if (name.includes('jacket') || name.includes('coat')) return '🧥'
  if (name.includes('jean') || name.includes('pant') || name.includes('trouser')) return '👖'
  if (name.includes('shirt') || name.includes('tee')) return '👕'
  if (name.includes('short')) return '🩳'
  if (name.includes('backpack')) return '🎒'
  if (name.includes('african') || name.includes('print')) return '👗'
  return '🏷️'
}

export default async function CategoryPage(props: PageProps<'/category/[slug]'>) {
  const { slug } = await props.params

  const supabase = await createServerSupabaseClient()
  const { data: category } = await supabase
    .from('categories')
    .select('id, name, slug')
    .eq('slug', slug)
    .single()

  if (!category) notFound()

  const { data: products } = await supabase
    .from('products')
    .select('*, category:categories(id, name, slug)')
    .eq('is_active', true)
    .eq('categories.slug', slug)
    .order('created_at', { ascending: false })

  // Filter client-side since Supabase join filtering can be tricky
  const filtered = ((products as Product[]) ?? []).filter(p => p.category?.slug === slug)

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="flex items-center gap-3 mb-8">
        <span className="text-4xl">{emojiForCategory(category)}</span>
        <h1 className="text-3xl font-bold text-gray-800">{category.name}</h1>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-5xl mb-4">{emojiForCategory(category)}</p>
          <p className="text-lg">No {category.name.toLowerCase()} yet. Check back soon!</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
          {filtered.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  )
}
