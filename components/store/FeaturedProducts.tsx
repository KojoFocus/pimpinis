'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import type { Product } from '@/types'
import { useCart } from '@/components/CartContext'
import { ShoppingBag, ArrowRight } from 'lucide-react'

const CARD_BGS = [
  'bg-[#F0EAE0]', 'bg-[#DAE0EC]', 'bg-[#DAE8DA]',
  'bg-[#EAD8D8]', 'bg-[#E8DAEC]', 'bg-[#EAE8D8]', 'bg-[#F0DAE8]',
]

const BADGE_STYLES: Record<string, string> = {
  new:  'bg-[#1A1208] text-white',
  hot:  'bg-[#C4873A] text-white',
  sale: 'bg-red-500 text-white',
}

// Map colour names → CSS colors for the dot swatches
const COLOUR_CSS: Record<string, string> = {
  black:  '#111111',
  white:  '#f0ece8',
  red:    '#e53e3e',
  blue:   '#3b82f6',
  navy:   '#1e3a5f',
  green:  '#22c55e',
  yellow: '#eab308',
  pink:   '#ec4899',
  brown:  '#7c4f2e',
  grey:   '#9ca3af',
  gray:   '#9ca3af',
  beige:  '#d4b896',
  purple: '#a855f7',
  orange: '#f97316',
  gold:   '#c8961e',
  silver: '#b0b8c1',
}

function ColourDots({ colours }: { colours: string[] }) {
  if (!colours.length) return null
  const shown = colours.slice(0, 5)
  const extra = colours.length - shown.length
  return (
    <div className="flex items-center gap-1 mb-2.5">
      {shown.map(c => {
        const css = COLOUR_CSS[c.toLowerCase()]
        return css ? (
          <span
            key={c}
            title={c}
            style={{ background: css }}
            className={`w-3.5 h-3.5 rounded-full flex-shrink-0 border ${c.toLowerCase() === 'white' ? 'border-gray-300' : 'border-transparent'}`}
          />
        ) : (
          <span key={c} title={c} className="w-3.5 h-3.5 rounded-full bg-gray-200 flex-shrink-0 border border-transparent" />
        )
      })}
      {extra > 0 && (
        <span className="text-[10px] text-gray-400 font-semibold ml-0.5">+{extra}</span>
      )}
    </div>
  )
}

const FILTERS = [
  { label: 'All',           key: 'all' },
  { label: 'Footwear',      key: 'footwear' },
  { label: 'Clothing',      key: 'clothing' },
  { label: 'New In',        key: 'new' },
  { label: 'Sale',          key: 'sale' },
  { label: 'Under GH₵100', key: 'under100' },
]

export default function FeaturedProducts({ products }: { products: Product[] }) {
  const [active, setActive] = useState('all')
  const { add } = useCart()
  const router = useRouter()

  const filtered = products.filter(p => {
    if (active === 'all')      return true
    if (active === 'footwear') return p.category?.slug === 'footwear'
    if (active === 'clothing') return ['dresses','others'].includes(p.category?.slug ?? '')
    if (active === 'new')      return p.badge === 'new'
    if (active === 'sale')     return p.badge === 'sale'
    if (active === 'under100') return p.selling_price < 100
    return true
  })

  function cardButtonLabel(p: Product) {
    const hasSizes   = p.sizes   && p.sizes.length   > 0
    const hasColours = p.colours && p.colours.length > 0
    if (hasSizes && hasColours) return 'Pick Options'
    if (hasSizes)   return 'Pick Size'
    if (hasColours) return 'Pick Colour'
    return 'Add to Cart'
  }

  function handleCart(e: React.MouseEvent, p: Product) {
    e.preventDefault()
    e.stopPropagation()
    const needsPage = (p.sizes && p.sizes.length > 0) || (p.colours && p.colours.length > 0)
    if (needsPage) {
      router.push(`/product/${p.id}`)
    } else {
      add(p, undefined)
    }
  }

  return (
    <section id="shop-section" className="py-14 px-4 bg-[#FAF8F5]">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex items-end justify-between mb-6">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[#C4873A] font-semibold mb-1">Curated for you</p>
            <h2 className="font-serif text-2xl md:text-3xl text-[#1A1208]">Featured Products</h2>
          </div>
          <Link href="/shop" className="hidden sm:flex items-center gap-1 text-sm text-[#C4873A] hover:text-[#7A4F2D] font-medium transition-colors">
            See all <ArrowRight size={14} />
          </Link>
        </div>

        {/* Filter pills */}
        <div className="flex gap-2 mb-8 overflow-x-auto scrollbar-hide pb-1">
          {FILTERS.map(f => (
            <button
              key={f.key}
              onClick={() => setActive(f.key)}
              className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold transition-all border ${
                active === f.key
                  ? 'bg-[#1A1208] text-white border-[#1A1208]'
                  : 'bg-white text-[#1A1208]/70 border-gray-200 hover:border-[#1A1208] hover:text-[#1A1208]'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-5">
            {filtered.map((p, idx) => {
              const soldOut = p.stock_qty === 0
              return (
                <Link key={p.id} href={`/product/${p.id}`} className="group block">
                  <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-[#C4873A]/30 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">

                    {/* Image */}
                    <div className={`relative aspect-[4/5] ${CARD_BGS[idx % CARD_BGS.length]} overflow-hidden`}>
                      {p.images?.[0] ? (
                        <img
                          src={p.images[0]}
                          alt={p.name}
                          className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${soldOut ? 'opacity-60' : ''}`}
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-gray-300 gap-1">
                          <ShoppingBag size={28} />
                          <span className="text-xs">No image</span>
                        </div>
                      )}

                      {/* Sold out overlay */}
                      {soldOut && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="bg-[#1A1208]/80 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest backdrop-blur-sm">
                            Sold Out
                          </span>
                        </div>
                      )}

                      {/* Badge */}
                      {p.badge && !soldOut && (
                        <span className={`absolute top-2.5 left-2.5 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${BADGE_STYLES[p.badge]}`}>
                          {p.badge === 'sale' ? '-30%' : p.badge}
                        </span>
                      )}
                    </div>

                    {/* Info */}
                    <div className="p-3 md:p-4">
                      <p className="text-[10px] text-[#C4873A] uppercase tracking-[0.15em] font-semibold mb-1">
                        {p.category?.name}
                      </p>
                      <h3 className="font-medium text-[#1A1208] text-sm line-clamp-2 leading-snug mb-2">
                        {p.name}
                      </h3>

                      {/* Colour dots */}
                      <ColourDots colours={p.colours ?? []} />

                      <div className="flex items-center justify-between gap-2">
                        <span className="font-serif text-base md:text-lg text-[#7A4F2D] font-bold">
                          GH₵{Number(p.selling_price).toFixed(0)}
                        </span>
                        {!soldOut && (
                          <button
                            type="button"
                            onClick={e => handleCart(e, p)}
                            className="bg-[#1A1208] hover:bg-[#C4873A] text-white text-[11px] px-3 py-1.5 rounded-full font-semibold transition-colors whitespace-nowrap"
                          >
                            {cardButtonLabel(p)}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-20 text-[#8C7B6A]">
            <ShoppingBag size={40} className="mx-auto mb-4 text-gray-300" />
            <p className="font-medium">No products in this filter yet.</p>
          </div>
        )}

        {filtered.length > 0 && (
          <div className="text-center mt-12">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 bg-[#1A1208] hover:bg-[#C4873A] text-white font-semibold px-10 py-3.5 rounded-full transition-colors text-sm"
            >
              View All Products <ArrowRight size={15} />
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
