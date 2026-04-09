'use client'

import { useState } from 'react'
import { Plus, Minus } from 'lucide-react'

interface Product {
  id: string
  name: string
  stock_qty: number
  emoji: string
  price: number
}

export function StockForm({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState('')
  const [reason, setReason] = useState('')
  const [loading, setLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)

  const adjustStock = async (adjustment: number) => {
    if (!quantity || !reason) return

    setLoading(true)
    try {
      const res = await fetch('/api/stock/adjustments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_id: product.id,
          adjustment: adjustment * parseInt(quantity),
          reason,
        }),
      })

      if (res.ok) {
        setQuantity('')
        setReason('')
        setShowForm(false)
        // Refresh the page to show updated stock
        window.location.reload()
      }
    } catch (error) {
      console.error('Stock adjustment failed:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!showForm) {
    return (
      <button
        onClick={() => setShowForm(true)}
        className="px-4 py-2 bg-[#C4873A] text-white rounded-lg text-sm font-medium hover:bg-[#7A4F2D] transition-colors"
      >
        Adjust Stock
      </button>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <input
        type="number"
        placeholder="Qty"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
        className="w-16 px-2 py-1 border border-gray-300 rounded text-sm text-center"
        min="1"
      />
      <input
        type="text"
        placeholder="Reason"
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        className="w-32 px-2 py-1 border border-gray-300 rounded text-sm"
      />
      <button
        onClick={() => adjustStock(1)}
        disabled={loading || !quantity || !reason}
        className="p-1 bg-green-100 text-green-700 rounded hover:bg-green-200 disabled:opacity-50"
        title="Increase stock"
      >
        <Plus size={16} />
      </button>
      <button
        onClick={() => adjustStock(-1)}
        disabled={loading || !quantity || !reason}
        className="p-1 bg-red-100 text-red-700 rounded hover:bg-red-200 disabled:opacity-50"
        title="Decrease stock"
      >
        <Minus size={16} />
      </button>
      <button
        onClick={() => setShowForm(false)}
        className="px-2 py-1 text-gray-500 hover:text-gray-700 text-sm"
      >
        Cancel
      </button>
    </div>
  )
}