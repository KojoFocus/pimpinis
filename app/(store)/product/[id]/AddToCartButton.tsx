'use client'
import { useCart } from '@/components/CartContext'
import type { Product } from '@/types'
import { ShoppingBag, Check, Zap } from 'lucide-react'
import { useState } from 'react'

interface Props {
  product: Product
  sizes?: string[]
  colours?: string[]
  selectedSize: string
  onSizeChange: (size: string) => void
  selectedColour: string
  onColourChange: (colour: string) => void
}

const WA = '233240395127'

export default function AddToCartButton({
  product, sizes, colours,
  selectedSize, onSizeChange,
  selectedColour, onColourChange,
}: Props) {
  const { add } = useCart()
  const [added, setAdded] = useState(false)
  const requiresColour = colours && colours.length > 0
  const requiresSize = sizes && sizes.length > 0
  const canSubmit = (!requiresColour || selectedColour) && (!requiresSize || selectedSize)

  function validate() {
    if (requiresColour && !selectedColour) {
      alert('Please select a colour first')
      return false
    }
    if (requiresSize && !selectedSize) {
      alert('Please select a size first')
      return false
    }
    return true
  }

  function handleAddToCart() {
    if (!validate()) return
    add(product, selectedSize || undefined, selectedColour || undefined)
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  function handleBuyNow() {
    if (!validate()) return
    const lines = [
      `Hi! I'd like to order:`,
      ``,
      `*${product.name}*`,
      selectedColour ? `Colour: ${selectedColour}` : null,
      selectedSize   ? `Size: ${selectedSize}` : null,
      `Price: GHS ${Number(product.selling_price).toFixed(2)}`,
      ``,
      `🔗 ${typeof window !== 'undefined' ? window.location.href : ''}`,
    ].filter(l => l !== null).join('\n')
    window.open(`https://wa.me/${WA}?text=${encodeURIComponent(lines)}`, '_blank')
  }

  return (
    <div className="space-y-4">
      {/* Colour selector — first, since it determines which sizes show */}
      {colours && colours.length > 0 && (
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2.5">
            Colour
            {selectedColour
              ? <span className="text-[#1A1208] font-semibold normal-case tracking-normal ml-1.5">— {selectedColour}</span>
              : <span className="text-[#C4873A] normal-case font-normal tracking-normal ml-1">required</span>
            }
          </p>
          <div className="flex flex-wrap gap-2">
            {colours.map(colour => (
              <button
                key={colour}
                type="button"
                onClick={() => onColourChange(colour)}
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

      {/* Size selector */}
      {sizes && sizes.length > 0 && (
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2.5">
            Size
            {selectedSize
              ? <span className="text-[#1A1208] font-semibold normal-case tracking-normal ml-1.5">— {selectedSize}</span>
              : <span className="text-[#C4873A] normal-case font-normal tracking-normal ml-1">required</span>
            }
          </p>
          <div className="flex flex-wrap gap-2">
            {sizes.map(size => (
              <button
                key={size}
                type="button"
                onClick={() => onSizeChange(size)}
                className={`min-w-[44px] px-3 py-2 rounded-xl text-sm font-semibold border transition-all ${
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

      {/* Actions */}
      <div className="flex flex-col gap-3 pt-1">
        <div className="flex gap-3">
          <button
            type="button"
            onClick={handleBuyNow}
            disabled={!canSubmit}
            className={`flex-1 flex items-center justify-center gap-2 font-bold py-3.5 rounded-2xl text-sm transition-colors ${canSubmit ? 'bg-[#C4873A] hover:bg-[#7A4F2D] text-white shadow-md' : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}
          >
            <Zap size={16} fill="currentColor" />
            Buy Now
          </button>
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={!canSubmit}
            className={`flex-1 flex items-center justify-center gap-2 font-bold py-3.5 rounded-2xl text-sm transition-colors ${canSubmit ? 'bg-[#1A1208] hover:bg-[#2d1f0e] text-white' : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}
          >
            <ShoppingBag size={16} />
            {added ? 'Added!' : 'Add to Cart'}
          </button>
        </div>
        {!canSubmit && (
          <p className="text-xs text-[#C4873A]">
            {requiresColour && !selectedColour ? 'Select a colour' : ''}
            {requiresColour && !selectedColour && requiresSize && !selectedSize ? ' and ' : ''}
            {requiresSize && !selectedSize ? 'select a size' : ''}
            {!(requiresColour && !selectedColour) && !(requiresSize && !selectedSize) ? 'Complete your selection to continue.' : ''}
          </p>
        )}
      </div>
    </div>
  )
}
