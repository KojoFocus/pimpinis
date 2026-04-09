'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Package, PlusCircle, ShoppingBag, LogOut, Tag, Menu, X, Store } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useState } from 'react'

const links = [
  { href: '/admin',              label: 'Overview',    icon: LayoutDashboard },
  { href: '/admin/products',     label: 'Products',    icon: Package },
  { href: '/admin/products/new', label: 'Add Product', icon: PlusCircle },
  { href: '/admin/orders',       label: 'Orders',      icon: ShoppingBag },
  { href: '/admin/categories',   label: 'Categories',  icon: Tag },
]

function NavLinks({ onClose }: { onClose?: () => void }) {
  const path = usePathname()
  return (
    <nav className="space-y-0.5">
      {links.map(({ href, label, icon: Icon }) => {
        const active = href === '/admin' ? path === '/admin' : path.startsWith(href)
        return (
          <Link
            key={href}
            href={href}
            onClick={onClose}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
              active
                ? 'bg-[#C4873A]/15 text-[#C4873A] border border-[#C4873A]/20'
                : 'text-white/50 hover:text-white hover:bg-white/6'
            }`}
          >
            <Icon size={16} className={active ? 'text-[#C4873A]' : ''} />
            {label}
          </Link>
        )
      })}
    </nav>
  )
}

export default function AdminSidebar() {
  const [open, setOpen] = useState(false)

  async function signOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  const BrandMark = () => (
    <div className="px-5 py-5 border-b border-white/8">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-[#C4873A] flex items-center justify-center flex-shrink-0">
          <span className="font-serif text-white text-sm font-bold">P</span>
        </div>
        <div>
          <p className="font-serif text-white text-base tracking-wide leading-none">Pimpinis</p>
          <p className="text-[10px] text-[#C4873A] tracking-[0.2em] uppercase mt-0.5">Admin Panel</p>
        </div>
      </div>
    </div>
  )

  const Footer = () => (
    <div className="px-3 py-4 border-t border-white/8 space-y-1">
      <Link
        href="/"
        className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-white/40 hover:text-white hover:bg-white/6 transition-all"
      >
        <Store size={16} /> View Store
      </Link>
      <button
        onClick={signOut}
        className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-sm text-white/40 hover:text-red-400 hover:bg-red-500/8 transition-all"
      >
        <LogOut size={16} /> Sign Out
      </button>
    </div>
  )

  return (
    <>
      {/* Mobile top bar */}
      <div className="md:hidden bg-[#1A1208] text-white flex items-center justify-between px-4 py-3 sticky top-0 z-50 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-[#C4873A] flex items-center justify-center">
            <span className="font-serif text-white text-xs font-bold">P</span>
          </div>
          <div>
            <p className="font-serif text-sm text-white leading-none">Pimpinis</p>
            <p className="text-[9px] text-[#C4873A] tracking-widest uppercase">Admin</p>
          </div>
        </div>
        <button
          onClick={() => setOpen(!open)}
          className="p-1.5 rounded-lg bg-white/8 hover:bg-white/15 transition-colors"
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden fixed inset-0 z-40" onClick={() => setOpen(false)}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div className="absolute left-0 top-0 h-full w-64 bg-[#1A1208] flex flex-col shadow-2xl" onClick={e => e.stopPropagation()}>
            <BrandMark />
            <div className="flex-1 px-3 py-4 overflow-y-auto admin-scroll">
              <NavLinks onClose={() => setOpen(false)} />
            </div>
            <Footer />
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-60 bg-[#1A1208] text-white flex-col sticky top-0 h-screen shrink-0">
        <BrandMark />
        <div className="flex-1 px-3 py-4 overflow-y-auto admin-scroll">
          <p className="text-[10px] uppercase tracking-[0.2em] text-white/25 font-semibold px-4 mb-2">Navigation</p>
          <NavLinks />
        </div>
        <Footer />
      </aside>
    </>
  )
}
