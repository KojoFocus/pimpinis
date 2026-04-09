'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const SLIDES = [
  {
    image: '/hero-shirt1.png',
    tag: 'Premium Collection',
    title: 'Discover Fashion,',
    accent: 'Express Yourself',
    sub: 'Curated fashion for every occasion — dresses, shirts, accessories & more.',
  },
  {
    image: '/hero-shirt2.png',
    tag: 'Top Picks',
    title: 'Dress to',
    accent: 'Impress',
    sub: "Accra's finest fashion selection, delivered to you.",
  },
  {
    image: '/hero-shoe1.png',
    tag: 'Premium Footwear',
    title: 'Step Into',
    accent: 'Your Style',
    sub: 'From everyday sneakers to elegant kicks — find your perfect pair.',
  },
  {
    image: '/hero-shoe2.png',
    tag: 'New Arrivals',
    title: 'Fresh Drops,',
    accent: 'Fresh Looks',
    sub: 'The latest styles, just landed. Be the first to wear them.',
  },
  {
    image: '/hero-shoe3.png',
    tag: 'New In',
    title: 'Walk With',
    accent: 'Confidence',
    sub: 'Every step counts. Shop the newest footwear collection.',
  },
  {
    image: '/hero-swag.png',
    tag: 'Street Style',
    title: 'Own the',
    accent: 'Streets',
    sub: 'Bold looks for bold people. Shop the latest street fashion.',
  },
]

export default function HeroSection() {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setCurrent(c => (c + 1) % SLIDES.length), 5000)
    return () => clearInterval(t)
  }, [])

  const prev = () => setCurrent(c => (c - 1 + SLIDES.length) % SLIDES.length)
  const next = () => setCurrent(c => (c + 1) % SLIDES.length)

  const slide = SLIDES[current]

  return (
    <section className="relative bg-[#1A1208] overflow-hidden h-[85vh] min-h-[520px] max-h-[720px]">
      {/* Background images */}
      {SLIDES.map((s, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-700 ${i === current ? 'opacity-100' : 'opacity-0'}`}
        >
          <img src={s.image} alt="" className="w-full h-full object-cover object-center" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1A1208]/90 via-[#1A1208]/60 to-transparent" />
        </div>
      ))}

      {/* Content */}
      <div className="relative z-10 h-full max-w-7xl mx-auto px-6 flex flex-col justify-center">
        <div className="max-w-xl">
          <p className="text-xs font-semibold uppercase tracking-[3px] text-[#C4873A] mb-4">
            {slide.tag}
          </p>
          <h1 className="font-serif text-4xl md:text-6xl leading-tight text-white mb-4">
            {slide.title}<br />
            <em className="text-[#C4873A] not-italic">{slide.accent}</em>
          </h1>
          <p className="text-white/60 text-sm md:text-base mb-8 leading-relaxed">
            {slide.sub}
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href="/#shop-section"
              className="bg-[#C4873A] hover:bg-[#7A4F2D] text-white font-medium px-8 py-3 text-sm rounded transition-colors cursor-pointer"
            >
              Shop Now
            </a>
            <Link
              href="/cart"
              className="border border-white/40 hover:border-[#C4873A] hover:text-[#C4873A] text-white font-medium px-8 py-3 text-sm rounded transition-colors"
            >
              View Cart
            </Link>
          </div>
        </div>
      </div>

      {/* Arrows */}
      <button
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/10 hover:bg-white/20 text-white rounded-full p-2 transition-colors backdrop-blur-sm"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/10 hover:bg-white/20 text-white rounded-full p-2 transition-colors backdrop-blur-sm"
      >
        <ChevronRight size={20} />
      </button>

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`rounded-full transition-all ${i === current ? 'bg-[#C4873A] w-6 h-2' : 'bg-white/40 w-2 h-2'}`}
          />
        ))}
      </div>
    </section>
  )
}
