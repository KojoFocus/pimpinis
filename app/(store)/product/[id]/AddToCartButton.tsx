'use client'
import { useCart } from '@/components/CartContext'
import type { Product } from '@/types'
import { ShoppingBag } from 'lucide-react'
import { useState } from 'react'

export default function AddToCartButton({ product, sizes }: { product: Product; sizes?: string[] }) {
  const { add } = useCart()
  const [added, setAdded] = useState(false)
  const [selectedSize, setSelectedSize] = useState<string>('')

  function handleAdd() {
    if (sizes && sizes.length > 0 && !selectedSize) {
      alert('Please select a size first')
      return
    }
    add(product, selectedSize || undefined)
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  return (
    <div className="space-y-4">
      {sizes && sizes.length > 0 && (
        <div>
          <p className="text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">Select Size</p>
          <div className="flex flex-wrap gap-2">
            {sizes.map(size => (
              <button
                key={size}
                type="button"
                onClick={() => setSelectedSize(size)}
                className={`min-w-[48px] px-3 py-2 rounded-lg text-sm font-medium border transition-all ${
                  selectedSize === size
                    ? 'bg-[#1A1208] text-white border-[#1A1208]'
                    : 'bg-white text-gray-700 border-gray-200 hover:border-[#C4873A]'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
          {!selectedSize && <p className="text-xs text-[#C4873A] mt-2">Please select a size</p>}
        </div>
      )}

      <button
        onClick={handleAdd}
        className="w-full flex items-center justify-center gap-2 bg-[#C4873A] hover:bg-[#7A4F2D] text-white font-bold py-4 rounded-lg text-base transition-colors shadow-md"
      >
        <ShoppingBag size={20} />
        {added ? 'Added to Cart!' : 'Add to Cart'}
      </button>
    </div>
  )
}
