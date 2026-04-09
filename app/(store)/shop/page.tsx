'use client'

import { useState, useMemo, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import ProductCard from '@/components/store/ProductCard'
import SearchBar from '@/components/store/SearchBar'
import type { Category, Product } from '@/types'
import Link from 'next/link'

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

export default function ShopPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const supabase = createClient()
        const [catsRes, prodsRes] = await Promise.all([
          supabase.from('categories').select('id, name, slug').order('name'),
          supabase.from('products').select('*, category:categories(id, name, slug)').eq('is_active', true).order('created_at', { ascending: false })
        ])
        setCategories(catsRes.data ?? [])
        setProducts(prodsRes.data ?? [])
      } catch (error) {
        console.error('Failed to load shop data', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const filteredProducts = useMemo(() => {
    let filtered = products
    if (selectedCategory) {
      filtered = filtered.filter(p => p.category?.slug === selectedCategory)
    }
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.description?.toLowerCase().includes(query) ||
        p.category?.name.toLowerCase().includes(query)
      )
    }
    return filtered
  }, [products, selectedCategory, searchQuery])

  if (loading) return <div className="text-center py-20">Loading...</div>

  const categoryMeta = selectedCategory ? categories.find(c => c.slug === selectedCategory) : null

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h2 className="font-serif text-3xl text-[#1A1208] mb-2">
        {selectedCategory ? categoryMeta?.name ?? 'Products' : 'All Products'}
      </h2>
      <p className="text-[#8C7B6A] text-sm mb-8">Browse our collection of premium fashion items.</p>

      <SearchBar onSearch={setSearchQuery} />

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2 mb-8">
        <button
          onClick={() => setSelectedCategory('')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
            !selectedCategory
              ? 'bg-[#1A1208] text-white'
              : 'bg-[#F0EAE0] text-[#1A1208] hover:bg-[#1A1208] hover:text-white'
          }`}
        >
          All
        </button>
        {categories.map(c => (
          <button
            key={c.slug}
            onClick={() => setSelectedCategory(c.slug)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              selectedCategory === c.slug
                ? 'bg-[#1A1208] text-white'
                : 'bg-[#F0EAE0] text-[#1A1208] hover:bg-[#1A1208] hover:text-white'
            }`}
          >
            <span className="mr-1">{emojiForCategory(c)}</span>
            {c.name}
          </button>
        ))}
      </div>

      {filteredProducts.length === 0 ? (
        <div className="text-center py-20 text-[#8C7B6A]">
          <p className="text-5xl mb-4">🛍️</p>
          <p className="text-lg">No products found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-4 md:gap-6">
          {filteredProducts.map((p, idx) => <ProductCard key={p.id} product={p} index={idx} />)}
        </div>
      )}
    </div>
  )
}
