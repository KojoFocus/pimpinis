'use client'
import { createContext, useContext, useEffect, useState } from 'react'
import type { Product } from '@/types'

export interface CartItem {
  product: Product
  quantity: number
  size?: string
  colour?: string
}

interface CartCtx {
  items: CartItem[]
  add: (product: Product, size?: string, colour?: string) => void
  remove: (productId: string, size?: string, colour?: string) => void
  updateQty: (productId: string, qty: number, size?: string, colour?: string) => void
  clear: () => void
  total: number
  count: number
}

const CartContext = createContext<CartCtx | null>(null)

function itemKey(productId: string, size?: string, colour?: string) {
  return `${productId}__${size ?? ''}__${colour ?? ''}`
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  useEffect(() => {
    try {
      const stored = localStorage.getItem('pimpinis_cart')
      if (stored) setItems(JSON.parse(stored))
    } catch {}
  }, [])

  useEffect(() => {
    localStorage.setItem('pimpinis_cart', JSON.stringify(items))
  }, [items])

  function add(product: Product, size?: string, colour?: string) {
    setItems(prev => {
      const key = itemKey(product.id, size, colour)
      const existing = prev.find(i => itemKey(i.product.id, i.size, i.colour) === key)
      if (existing) {
        return prev.map(i =>
          itemKey(i.product.id, i.size, i.colour) === key
            ? { ...i, quantity: i.quantity + 1 }
            : i
        )
      }
      return [...prev, { product, quantity: 1, size, colour }]
    })
  }

  function remove(productId: string, size?: string, colour?: string) {
    setItems(prev => prev.filter(i => itemKey(i.product.id, i.size, i.colour) !== itemKey(productId, size, colour)))
  }

  function updateQty(productId: string, qty: number, size?: string, colour?: string) {
    if (qty < 1) { remove(productId, size, colour); return }
    setItems(prev => prev.map(i =>
      itemKey(i.product.id, i.size, i.colour) === itemKey(productId, size, colour)
        ? { ...i, quantity: qty }
        : i
    ))
  }

  function clear() { setItems([]) }

  const total = items.reduce((s, i) => s + i.product.selling_price * i.quantity, 0)
  const count = items.reduce((s, i) => s + i.quantity, 0)

  return (
    <CartContext.Provider value={{ items, add, remove, updateQty, clear, total, count }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used inside CartProvider')
  return ctx
}
