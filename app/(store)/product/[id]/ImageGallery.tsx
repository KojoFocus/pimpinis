'use client'
import { useState, useEffect } from 'react'
import { ShoppingBag } from 'lucide-react'

interface Props {
  images: string[]
  name: string
  activeImageUrl?: string
}

export default function ImageGallery({ images, name, activeImageUrl }: Props) {
  const [active, setActive] = useState(0)

  useEffect(() => {
    if (!activeImageUrl) return
    const idx = images.indexOf(activeImageUrl)
    if (idx >= 0) setActive(idx)
  }, [activeImageUrl, images])

  if (!images.length) {
    return (
      <div className="aspect-square bg-[#F0EAE0] rounded-2xl flex items-center justify-center text-gray-300">
        <ShoppingBag size={48} />
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {/* Main image */}
      <div className="aspect-square bg-[#F0EAE0] rounded-2xl overflow-hidden">
        <img
          src={images[active]}
          alt={name}
          className="w-full h-full object-cover transition-opacity duration-200"
        />
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
          {images.map((url, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                i === active
                  ? 'border-[#C4873A] shadow-md scale-105'
                  : 'border-transparent opacity-60 hover:opacity-100 hover:border-gray-200'
              }`}
            >
              <img src={url} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
