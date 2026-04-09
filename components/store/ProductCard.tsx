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

export default function ProductCard({ product, index }: { product: Product & { sizes?: string[] }; index?: number }) {
  const { add } = useCart()
  const router = useRouter()

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    const hasSizes = product.sizes && product.sizes.length > 0
    if (hasSizes) {
      // Go to product page to pick a size
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

<div className="flex items-center justify-between mt-1">
            <span className="font-serif text-base md:text-lg text-[#7A4F2D]">GH₵{Number(product.selling_price).toFixed(0)}</span>
            <button
              onClick={handleAddToCart}
              className="bg-[#1A1208] hover:bg-[#C4873A] text-white text-xs px-3 py-1.5 rounded font-medium transition-colors"
            >
              {product.sizes && product.sizes.length > 0 ? 'Pick Size' : 'Add to Cart'}
            </button>
          </div>
        </div>
      </div>
    </Link>
  )
}
