import { createServerSupabaseClient } from '@/lib/supabase/server'
import ProductCard from '@/components/store/ProductCard'
import { CATEGORIES } from '@/lib/categories'
import type { Product } from '@/types'
import Link from 'next/link'

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; badge?: string }>
}) {
  const { category, badge } = await searchParams
  const supabase = await createServerSupabaseClient()

  let query = supabase
    .from('products')
    .select('*, category:categories(id, name, slug)')
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  if (badge) query = (query as any).eq('badge', badge)

  const { data: products } = await query

  let filtered = (products as Product[]) ?? []
  if (category) {
    filtered = filtered.filter(p => p.category?.slug === category)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h2 className="font-serif text-3xl text-[#1A1208] mb-2">
        {category ? CATEGORIES.find(c => c.slug === category)?.name ?? 'Products' : 'All Products'}
      </h2>
      <p className="text-[#8C7B6A] text-sm mb-8">Browse our collection of premium fashion items.</p>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2 mb-8">
        <Link
          href="/shop"
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
            !category
              ? 'bg-[#1A1208] text-white'
              : 'bg-[#F0EAE0] text-[#1A1208] hover:bg-[#1A1208] hover:text-white'
          }`}
        >
          All
        </Link>
        {CATEGORIES.map(c => (
          <Link
            key={c.slug}
            href={`/shop?category=${c.slug}`}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              category === c.slug
                ? 'bg-[#1A1208] text-white'
                : 'bg-[#F0EAE0] text-[#1A1208] hover:bg-[#1A1208] hover:text-white'
            }`}
          >
            {c.emoji} {c.name}
          </Link>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20 text-[#8C7B6A]">
          <p className="text-5xl mb-4">🛍️</p>
          <p className="text-lg">No products in this category yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-4 md:gap-6">
          {filtered.map((p, idx) => <ProductCard key={p.id} product={p} index={idx} />)}
        </div>
      )}
    </div>
  )
}
