'use client'
import Link from 'next/link'
import { ShoppingBag, Menu, X, Tag, Truck } from 'lucide-react'
import { useCart } from '@/components/CartContext'
import { CATEGORIES } from '@/lib/categories'
import { useState } from 'react'

export default function Navbar() {
  const { count } = useCart()
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* Announcement bar */}
      <div className="bg-[#C4873A] text-white text-center py-2 px-4 text-xs font-medium tracking-wide">
        <Tag size={11} className="inline mr-1.5 -mt-0.5" />
        First order? Use <span className="font-bold tracking-widest mx-1">PIMPINIS15</span> for 15% off at checkout
      </div>

      <nav className="bg-[#1A1208] sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-14">

          {/* Logo */}
          <Link href="/" className="flex flex-col leading-none">
            <span className="font-serif text-xl tracking-[0.12em] text-white">Pimpinis</span>
            <span className="text-[9px] tracking-[0.3em] text-[#C4873A] uppercase font-medium">Fashion Store</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            <a
              href="/#shop-section"
              className="text-xs font-medium text-white/70 hover:text-[#C4873A] px-3 py-1.5 rounded-full hover:bg-white/5 transition-all"
            >
              All
            </a>
            {CATEGORIES.slice(0, 5).map(c => (
              <Link
                key={c.slug}
                href={`/shop?category=${c.slug}`}
                className="text-xs font-medium text-white/70 hover:text-[#C4873A] px-3 py-1.5 rounded-full hover:bg-white/5 transition-all"
              >
                {c.name}
              </Link>
            ))}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            <Link
              href="/track"
              className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-white/60 hover:text-[#C4873A] px-3 py-2 rounded-full hover:bg-white/5 transition-all"
            >
              <Truck size={13} /> Track Order
            </Link>
            <Link
              href="/cart"
              className="relative flex items-center gap-2 bg-[#C4873A] hover:bg-[#7A4F2D] text-white px-4 py-2 rounded-full text-xs font-semibold transition-colors"
            >
              <ShoppingBag size={14} />
              <span className="hidden sm:inline">Cart</span>
              {count > 0 && (
                <span className="bg-white text-[#C4873A] text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center leading-none">
                  {count}
                </span>
              )}
            </Link>
            <button
              className="md:hidden p-2 text-white/70 hover:text-white transition-colors"
              onClick={() => setOpen(!open)}
              aria-label="Toggle menu"
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="md:hidden border-t border-white/10 bg-[#1A1208] px-4 py-4 space-y-0.5">
            <Link
              href="/track"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 text-sm text-white/70 hover:text-white hover:bg-white/5 px-3 py-2.5 rounded-xl transition-all"
            >
              <Truck size={16} className="text-[#C4873A]" /> Track Order
            </Link>
            <a
              href="/#shop-section"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 text-sm text-white/70 hover:text-white hover:bg-white/5 px-3 py-2.5 rounded-xl transition-all"
            >
              <span className="text-base">🛍️</span> All Products
            </a>
            {CATEGORIES.map(c => (
              <Link
                key={c.slug}
                href={`/shop?category=${c.slug}`}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 text-sm text-white/70 hover:text-white hover:bg-white/5 px-3 py-2.5 rounded-xl transition-all"
              >
                <span className="text-base">{c.emoji}</span> {c.name}
              </Link>
            ))}
          </div>
        )}
      </nav>
    </>
  )
}
