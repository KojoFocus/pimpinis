'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Package, Receipt, Truck, FileBarChart2, LogOut, ShoppingBag, Menu, X } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useState } from 'react'

const links = [
  { href: '/dashboard',             label: 'Overview',         icon: LayoutDashboard },
  { href: '/dashboard/stock',       label: 'Stock Entry',      icon: Package },
  { href: '/dashboard/expenditure', label: 'Expenditures',     icon: Receipt },
  { href: '/dashboard/transport',   label: 'Transport Costs',  icon: Truck },
  { href: '/dashboard/reports',     label: 'Income Statement', icon: FileBarChart2 },
]

export default function OwnerSidebar() {
  const path = usePathname()
  const [open, setOpen] = useState(false)

  async function signOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  const NavLinks = () => (
    <>
      {links.map(({ href, label, icon: Icon }) => {
        const active = href === '/dashboard' ? path === '/dashboard' : path.startsWith(href)
        return (
          <Link
            key={href}
            href={href}
            onClick={() => setOpen(false)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
              active ? 'bg-[#C4873A] text-white font-medium' : 'text-white/60 hover:text-white hover:bg-white/10'
            }`}
          >
            <Icon size={17} />
            {label}
          </Link>
        )
      })}
      <Link href="/admin" onClick={() => setOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/60 hover:text-white hover:bg-white/10 transition-all mt-2">
        <ShoppingBag size={17} /> Admin Panel
      </Link>
    </>
  )

  return (
    <>
      {/* Mobile top bar */}
      <div className="md:hidden bg-[#1A1208] text-white flex items-center justify-between px-4 py-3 sticky top-0 z-50">
        <div>
          <p className="font-serif text-lg">Pimpinis</p>
          <p className="text-xs text-[#C4873A] tracking-widest uppercase -mt-0.5">Owner</p>
        </div>
        <button onClick={() => setOpen(!open)} className="p-1.5 rounded-lg bg-white/10">
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden fixed inset-0 z-40" onClick={() => setOpen(false)}>
          <div className="absolute inset-0 bg-black/50" />
          <div className="absolute left-0 top-0 h-full w-64 bg-[#1A1208] flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="px-6 py-5 border-b border-white/10">
              <p className="font-serif text-xl text-white">Pimpinis</p>
              <p className="text-xs text-[#C4873A] tracking-widest uppercase">Owner Dashboard</p>
            </div>
            <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
              <p className="text-xs uppercase tracking-widest text-white/30 px-3 pb-2">Finance</p>
              <NavLinks />
            </nav>
            <div className="px-3 py-4 border-t border-white/10">
              <button onClick={signOut} className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm text-white/50 hover:text-white hover:bg-white/10 transition-all">
                <LogOut size={17} /> Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-60 bg-[#1A1208] text-white flex-col sticky top-0 h-screen shrink-0">
        <div className="px-6 py-5 border-b border-white/10">
          <p className="font-serif text-xl text-white tracking-wide">Pimpinis</p>
          <p className="text-xs text-[#C4873A] mt-0.5 tracking-widest uppercase">Owner Dashboard</p>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          <p className="text-xs uppercase tracking-widest text-white/30 px-3 pb-2">Finance</p>
          <NavLinks />
        </nav>
        <div className="px-3 py-4 border-t border-white/10">
          <button onClick={signOut} className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm text-white/50 hover:text-white hover:bg-white/10 transition-all">
            <LogOut size={17} /> Sign Out
          </button>
        </div>
      </aside>
    </>
  )
}
