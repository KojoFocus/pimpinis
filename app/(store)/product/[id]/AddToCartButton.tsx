'use client'
import { useCart } from '@/components/CartContext'
import type { Product } from '@/types'
import { ShoppingBag, Check } from 'lucide-react'
import { useState } from 'react'

interface Props {
  product: Product
  sizes?: string[]
  colours?: string[]
}

export default function AddToCartButton({ product, sizes, colours }: Props) {
  const { add } = useCart()
  const [added, setAdded] = useState(false)
  const [selectedSize, setSelectedSize] = useState('')
  const [selectedColour, setSelectedColour] = useState('')

  function handleAdd() {
    if (sizes && sizes.length > 0 && !selectedSize) {
      alert('Please select a size first')
      return
    }
    if (colours && colours.length > 0 && !selectedColour) {
      alert('Please select a colour first')
      return
    }
    add(product, selectedSize || undefined, selectedColour || undefined)
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  return (
    <div className="space-y-5">
      {/* Size selector */}
      {sizes && sizes.length > 0 && (
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2.5">
            Select Size {!selectedSize && <span className="text-[#C4873A] normal-case font-normal tracking-normal">— required</span>}
          </p>
          <div className="flex flex-wrap gap-2">
            {sizes.map(size => (
              <button
                key={size}
                type="button"
                onClick={() => setSelectedSize(size)}
                className={`min-w-[48px] px-3 py-2 rounded-xl text-sm font-semibold border transition-all ${
                  selectedSize === size
                    ? 'bg-[#1A1208] text-white border-[#1A1208] shadow-sm'
                    : 'bg-white text-gray-700 border-gray-200 hover:border-[#C4873A]'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Colour selector */}
      {colours && colours.length > 0 && (
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2.5">
            Select Colour
            {selectedColour
              ? <span className="text-[#1A1208] font-semibold normal-case tracking-normal ml-1">— {selectedColour}</span>
              : <span className="text-[#C4873A] normal-case font-normal tracking-normal"> — required</span>
            }
          </p>
          <div className="flex flex-wrap gap-2">
            {colours.map(colour => (
              <button
                key={colour}
                type="button"
                onClick={() => setSelectedColour(colour)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold border transition-all ${
                  selectedColour === colour
                    ? 'bg-[#1A1208] text-white border-[#1A1208] shadow-sm'
                    : 'bg-white text-gray-700 border-gray-200 hover:border-[#C4873A]'
                }`}
              >
                {selectedColour === colour && <Check size={12} />}
                {colour}
              </button>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={handleAdd}
        className="w-full flex items-center justify-center gap-2 bg-[#1A1208] hover:bg-[#C4873A] text-white font-bold py-4 rounded-2xl text-base transition-colors shadow-md"
      >
        <ShoppingBag size={20} />
        {added ? 'Added to Cart!' : 'Add to Cart'}
      </button>
    </div>
  )
}
