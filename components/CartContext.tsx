'use client'
import { createContext, useContext, useEffect, useState } from 'react'
import type { Product } from '@/types'

export interface CartItem {
  product: Product
  quantity: number
  size?: string
}

interface CartCtx {
  items: CartItem[]
  add: (product: Product, size?: string) => void
  remove: (productId: string, size?: string) => void
  updateQty: (productId: string, qty: number, size?: string) => void
  clear: () => void
  total: number
  count: number
}

const CartContext = createContext<CartCtx | null>(null)

function itemKey(productId: string, size?: string) {
  return size ? `${productId}__${size}` : productId
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

  function add(product: Product, size?: string) {
    setItems(prev => {
      const existing = prev.find(i => itemKey(i.product.id, i.size) === itemKey(product.id, size))
      if (existing) {
        return prev.map(i =>
          itemKey(i.product.id, i.size) === itemKey(product.id, size)
            ? { ...i, quantity: i.quantity + 1 }
            : i
        )
      }
      return [...prev, { product, quantity: 1, size }]
    })
  }

  function remove(productId: string, size?: string) {
    setItems(prev => prev.filter(i => itemKey(i.product.id, i.size) !== itemKey(productId, size)))
  }

  function updateQty(productId: string, qty: number, size?: string) {
    if (qty < 1) { remove(productId, size); return }
    setItems(prev => prev.map(i =>
      itemKey(i.product.id, i.size) === itemKey(productId, size) ? { ...i, quantity: qty } : i
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
