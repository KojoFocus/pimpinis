'use client'
import { useState } from 'react'
import type { Product, ColourVariant } from '@/types'
import ImageGallery from './ImageGallery'
import AddToCartButton from './AddToCartButton'

const BADGE_STYLE: Record<string, string> = {
  new:  'bg-[#1A1208] text-white',
  hot:  'bg-[#C4873A] text-white',
  sale: 'bg-red-500 text-white',
}

interface Props {
  product: Product
  colourVariants: ColourVariant[]
  globalSizes: string[]  // fallback sizes (union of all variants, or legacy sizes[])
}

export default function ProductInteractive({ product, colourVariants, globalSizes }: Props) {
  const [selectedColour, setSelectedColour] = useState('')
  const [selectedSize, setSelectedSize] = useState('')

  function handleColourChange(colour: string) {
    const next = colour === selectedColour ? '' : colour
    setSelectedColour(next)
    setSelectedSize('')  // reset size when colour changes
  }

  // Named colours for the colour selector
  const colours = [...new Set(colourVariants.map(v => v.colour).filter(Boolean))]

  // Image for selected colour
  const activeImageUrl = selectedColour
    ? colourVariants.find(v => v.colour === selectedColour)?.image
    : undefined

  // Sizes for the selected colour, or global fallback
  const activeSizes = (() => {
    if (selectedColour) {
      const variant = colourVariants.find(v => v.colour === selectedColour)
      if (variant?.sizes?.length) return variant.sizes
    }
    return globalSizes
  })()

  return (
    <div className="grid md:grid-cols-2 gap-10">
      <ImageGallery
        images={product.images ?? []}
        name={product.name}
        activeImageUrl={activeImageUrl}
      />

      <div className="flex flex-col">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#C4873A] mb-2">
          {product.category?.name}
        </p>
        <h1 className="font-serif text-2xl md:text-3xl text-[#1A1208] mb-3 leading-tight">
          {product.name}
        </h1>

        {product.badge && (
          <span className={`self-start text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest mb-4 ${BADGE_STYLE[product.badge] ?? 'bg-gray-100 text-gray-600'}`}>
            {product.badge}
          </span>
        )}

        <p className="font-serif text-3xl font-bold text-[#7A4F2D] mb-4">
          GHS {Number(product.selling_price).toFixed(2)}
        </p>

        {product.description && (
          <p className="text-[#8C7B6A] mb-5 leading-relaxed text-sm">{product.description}</p>
        )}

        <p className="text-sm mb-6">
          {product.stock_qty > 0
            ? <span className="text-emerald-600 font-semibold">In stock ({product.stock_qty} available)</span>
            : <span className="text-red-500 font-semibold">Out of stock</span>
          }
        </p>

        {product.stock_qty > 0 && (
          <AddToCartButton
            product={product}
            sizes={activeSizes}
            colours={colours}
            selectedSize={selectedSize}
            onSizeChange={setSelectedSize}
            selectedColour={selectedColour}
            onColourChange={handleColourChange}
          />
        )}
      </div>
    </div>
  )
}
