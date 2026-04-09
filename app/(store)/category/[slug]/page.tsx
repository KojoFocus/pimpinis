import { createServerSupabaseClient } from '@/lib/supabase/server'
import ProductCard from '@/components/store/ProductCard'
import { CATEGORIES } from '@/lib/categories'
import type { Product } from '@/types'
import { notFound } from 'next/navigation'

export default async function CategoryPage(props: PageProps<'/category/[slug]'>) {
  const { slug } = await props.params
  const cat = CATEGORIES.find(c => c.slug === slug)
  if (!cat) notFound()

  const supabase = await createServerSupabaseClient()
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
        <span className="text-4xl">{cat.emoji}</span>
        <h1 className="text-3xl font-bold text-gray-800">{cat.name}</h1>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-5xl mb-4">{cat.emoji}</p>
          <p className="text-lg">No {cat.name.toLowerCase()} yet. Check back soon!</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
          {filtered.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  )
}
