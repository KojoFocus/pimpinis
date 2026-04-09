'use client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import type { Product } from '@/types'
import { useCart } from '@/components/CartContext'

const BADGE_STYLES: Record<string, string> = {
  new:  'bg-[#1A1208] text-white',
  hot:  'bg-[#C4873A] text-white',
  sale: 'bg-[#C43A3A] text-white',
}

const COLOUR_CSS: Record<string, string> = {
  black: '#111111',
  white: '#f8f5ef',
  red: '#dc2626',
  blue: '#2563eb',
  navy: '#1e293b',
  green: '#16a34a',
  yellow: '#eab308',
  pink: '#db2777',
  brown: '#7c4f2d',
  beige: '#d6c9b5',
  purple: '#8b5cf6',
  orange: '#f97316',
  grey: '#6b7280',
}

function ColourDots({ colours }: { colours: string[] }) {
  const shown = colours.slice(0, 4)
  return (
    <div className="flex items-center gap-1">
      {shown.map(colour => {
        const css = COLOUR_CSS[colour.toLowerCase()]
        return (
          <span
            key={colour}
            title={colour}
            style={{ background: css ?? '#d1d5db' }}
            className={`w-3.5 h-3.5 rounded-full border ${css ? '' : 'border-gray-300'}`}
          />
        )
      })}
      {colours.length > shown.length && <span className="text-[10px] text-[#8C7B6A]">+{colours.length - shown.length}</span>}
    </div>
  )
}

export default function ProductCard({ product, index }: { product: Product & { sizes?: string[] }; index?: number }) {
  const { add } = useCart()
  const router = useRouter()
  const hasSizes = product.sizes && product.sizes.length > 0
  const hasColours = product.colours && product.colours.length > 0

  function cardButtonLabel() {
    if (hasSizes && hasColours) return 'Pick Options'
    if (hasSizes) return 'Pick Size'
    if (hasColours) return 'Pick Colour'
    return 'Add to Cart'
  }

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    const needsPage = hasSizes || hasColours
    if (needsPage) {
      router.push(`/product/${product.id}`)
    } else {
      add(product, undefined)
    }
  }

  return (
    <Link href={`/product/${product.id}`}>
      <div className="group relative bg-white rounded-xl overflow-hidden border border-black/5 hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer">
        {/* Image */}
        <div className="aspect-square relative overflow-hidden bg-gray-100">
          {product.images?.[0]
            ? <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
            : <div className="w-full h-full flex items-center justify-center text-gray-300 text-sm">No image</div>
          }
          {product.badge && (
            <span className={`absolute top-2 left-2 text-xs font-bold px-2 py-1 rounded-sm uppercase tracking-wide ${BADGE_STYLES[product.badge]}`}>
              {product.badge}
            </span>
          )}
        </div>

        {/* Info */}
        <div className="p-3 md:p-4">
          <p className="text-xs text-[#8C7B6A] uppercase tracking-wider mb-1">{product.category?.name}</p>
          <h3 className="font-medium text-[#1A1208] text-sm line-clamp-2 mb-2 leading-snug">
            {product.name}
          </h3>

          {hasColours && (
            <div className="flex items-center gap-2 flex-wrap mb-3">
              <ColourDots colours={product.colours ?? []} />
              <span className="text-[10px] text-[#8C7B6A] uppercase tracking-[0.2em] font-semibold">
                {product.colours?.length} colour{product.colours?.length === 1 ? '' : 's'}
              </span>
            </div>
          )}

          <div className="flex items-center justify-between mt-1">
            <span className="font-serif text-base md:text-lg text-[#7A4F2D]">GH₵{Number(product.selling_price).toFixed(0)}</span>
            <button
              type="button"
              onClick={handleAddToCart}
              className="bg-[#1A1208] hover:bg-[#C4873A] text-white text-xs px-3 py-1.5 rounded font-medium transition-colors"
            >
              {cardButtonLabel()}
            </button>
          </div>
        </div>
      </div>
    </Link>
  )
}
