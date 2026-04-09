'use client'
import { useCart } from '@/components/CartContext'
import { Trash2, Plus, Minus, ShoppingBag, MessageCircle, X, User, Phone, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useState, useEffect } from 'react'

const WHATSAPP_NUMBER = '233240395127'

interface CustomerInfo { name: string; phone: string }

function itemKey(productId: string, size?: string) {
  return size ? `${productId}__${size}` : productId
}

export default function CartPage() {
  const { items, remove, updateQty, clear } = useCart()
  const [showCheckout, setShowCheckout] = useState(false)
  const [customer, setCustomer] = useState<CustomerInfo>({ name: '', phone: '' })
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [selected, setSelected] = useState<Set<string>>(new Set())

  // Keep selected in sync with items (select all by default, remove stale keys)
  useEffect(() => {
    setSelected(new Set(items.map(i => itemKey(i.product.id, i.size))))
  }, [items.length])

  useEffect(() => {
    try {
      const saved = localStorage.getItem('pimpinis_customer')
      if (saved) setCustomer(JSON.parse(saved))
    } catch {}
  }, [])

  function toggleSelect(key: string) {
    setSelected(prev => {
      const next = new Set(prev)
      next.has(key) ? next.delete(key) : next.add(key)
      return next
    })
  }

  function toggleAll() {
    if (selected.size === items.length) {
      setSelected(new Set())
    } else {
      setSelected(new Set(items.map(i => itemKey(i.product.id, i.size))))
    }
  }

  const selectedItems = items.filter(i => selected.has(itemKey(i.product.id, i.size)))
  const selectedTotal = selectedItems.reduce((s, i) => s + i.product.selling_price * i.quantity, 0)

  async function handleCheckout(e: React.FormEvent) {
    e.preventDefault()
    if (selectedItems.length === 0) return
    setSaving(true)

    localStorage.setItem('pimpinis_customer', JSON.stringify(customer))
    setSaveError(null)

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_name: customer.name,
          customer_phone: customer.phone,
          total_amount: selectedTotal,
          status: 'pending',
          items: selectedItems.map(i => ({
            product_id: i.product.id,
            quantity: i.quantity,
            unit_price: i.product.selling_price,
            size: i.size,
          })),
        }),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        setSaveError(err.error ?? `Server error ${res.status}`)
        setSaving(false)
        return
      }
    } catch (e: any) {
      setSaveError(e?.message ?? 'Network error — could not save order')
      setSaving(false)
      return
    }

    const lines = selectedItems.map(i => {
      const size = i.size ? ` (Size: ${i.size})` : ''
      return `• ${i.product.name}${size} × ${i.quantity} — GHS ${(i.product.selling_price * i.quantity).toFixed(2)}`
    })

    const msg = [
      `Hello Pimpinis! I'd like to place an order.`,
      ``,
      `*Customer:* ${customer.name}`,
      `*WhatsApp:* ${customer.phone}`,
      ``,
      ...lines,
      ``,
      `*Total: GHS ${selectedTotal.toFixed(2)}*`,
      ``,
      `Please confirm availability and delivery. Thank you!`,
    ].join('\n')

    // Remove only the checked-out items from cart
    selectedItems.forEach(i => remove(i.product.id, i.size))
    setShowCheckout(false)
    setSaving(false)
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank')
  }

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-20 text-center">
        <div className="w-20 h-20 rounded-full bg-[#F0EAE0] flex items-center justify-center mb-5">
          <ShoppingBag size={32} className="text-[#C4873A]" />
        </div>
        <h2 className="text-xl font-bold text-[#1A1208] mb-2">Your cart is empty</h2>
        <p className="text-[#8C7B6A] mb-8 max-w-xs">Looks like you haven't added anything yet. Browse our collection and find something you love.</p>
        <Link
          href="/#shop-section"
          className="inline-flex items-center gap-2 bg-[#1A1208] hover:bg-[#C4873A] text-white font-semibold px-8 py-3.5 rounded-full transition-colors"
        >
          Shop Now
        </Link>
      </div>
    )
  }

  const allSelected = selected.size === items.length

  return (
    <>
      <div className="max-w-3xl mx-auto px-4 py-10">

        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link href="/" className="p-2 rounded-xl bg-white border border-gray-100 text-gray-400 hover:text-[#1A1208] transition-colors shadow-sm">
            <ArrowLeft size={16} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-[#1A1208]">Your Cart</h1>
            <p className="text-sm text-[#8C7B6A] mt-0.5">{items.length} item{items.length !== 1 ? 's' : ''}</p>
          </div>
        </div>

        {/* Select all */}
        <div className="flex items-center justify-between mb-3 px-1">
          <button
            onClick={toggleAll}
            className="flex items-center gap-2 text-sm text-[#8C7B6A] hover:text-[#1A1208] transition-colors"
          >
            <span className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors ${allSelected ? 'bg-[#1A1208] border-[#1A1208]' : 'border-gray-300'}`}>
              {allSelected && <span className="text-white text-[10px] font-bold">✓</span>}
            </span>
            {allSelected ? 'Deselect all' : 'Select all'}
          </button>
          {selected.size > 0 && selected.size < items.length && (
            <span className="text-xs text-[#C4873A] font-semibold">{selected.size} of {items.length} selected</span>
          )}
        </div>

        {/* Items */}
        <div className="space-y-3 mb-6">
          {items.map(item => {
            const key = itemKey(item.product.id, item.size)
            const isSelected = selected.has(key)
            return (
              <div
                key={key}
                className={`flex items-center gap-3 bg-white rounded-2xl p-4 shadow-sm border transition-all ${isSelected ? 'border-[#C4873A]/40' : 'border-gray-100 opacity-60'}`}
              >
                {/* Checkbox */}
                <button
                  onClick={() => toggleSelect(key)}
                  className={`w-5 h-5 rounded-md border-2 flex-shrink-0 flex items-center justify-center transition-colors ${isSelected ? 'bg-[#1A1208] border-[#1A1208]' : 'border-gray-300'}`}
                >
                  {isSelected && <span className="text-white text-[10px] font-bold">✓</span>}
                </button>

                <div className="w-16 h-16 rounded-xl overflow-hidden bg-[#F0EAE0] flex-shrink-0 border border-gray-100">
                  {item.product.images?.[0]
                    ? <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />
                    : <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">No img</div>
                  }
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-[#1A1208] text-sm line-clamp-1">{item.product.name}</h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <p className="text-xs text-[#8C7B6A]">{item.product.category?.name}</p>
                    {item.size && (
                      <span className="text-[10px] bg-[#1A1208] text-white px-2 py-0.5 rounded-full font-semibold">
                        {item.size}
                      </span>
                    )}
                  </div>
                  <p className="font-bold text-[#7A4F2D] font-serif mt-1.5">
                    GHS {(item.product.selling_price * item.quantity).toFixed(2)}
                  </p>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => updateQty(item.product.id, item.quantity - 1, item.size)}
                    className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center hover:border-[#C4873A] hover:text-[#C4873A] transition-colors text-gray-400"
                  >
                    <Minus size={11} />
                  </button>
                  <span className="w-7 text-center font-bold text-sm text-[#1A1208]">{item.quantity}</span>
                  <button
                    onClick={() => updateQty(item.product.id, item.quantity + 1, item.size)}
                    className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center hover:border-[#C4873A] hover:text-[#C4873A] transition-colors text-gray-400"
                  >
                    <Plus size={11} />
                  </button>
                </div>

                <button
                  onClick={() => remove(item.product.id, item.size)}
                  className="text-gray-200 hover:text-red-400 transition-colors ml-1 flex-shrink-0"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            )
          })}
        </div>

        {/* Summary */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex justify-between items-center pb-4 border-b border-gray-100 mb-4">
            <span className="text-gray-500 text-sm">
              {selectedItems.length < items.length
                ? `${selectedItems.length} item${selectedItems.length !== 1 ? 's' : ''} selected`
                : 'Subtotal'}
            </span>
            <span className="font-bold text-gray-900 font-serif text-xl">GHS {selectedTotal.toFixed(2)}</span>
          </div>

          <p className="text-xs text-[#8C7B6A] mb-4 text-center">
            Final pricing confirmed via WhatsApp · Delivery fee may apply
          </p>

          <button
            onClick={() => selectedItems.length > 0 && setShowCheckout(true)}
            disabled={selectedItems.length === 0}
            className="w-full flex items-center justify-center gap-3 bg-[#25D366] hover:bg-[#1da851] text-white font-bold py-4 rounded-2xl text-base transition-colors shadow-md disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <MessageCircle size={20} />
            {selectedItems.length === 0
              ? 'Select items to order'
              : selectedItems.length < items.length
                ? `Order ${selectedItems.length} item${selectedItems.length !== 1 ? 's' : ''} via WhatsApp`
                : 'Order via WhatsApp'}
          </button>

          <button
            onClick={clear}
            className="w-full mt-3 text-xs text-gray-300 hover:text-red-400 transition-colors py-2"
          >
            Clear cart
          </button>
        </div>
      </div>

      {/* Checkout Modal */}
      {showCheckout && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4" onClick={() => setShowCheckout(false)}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div
            className="relative bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={() => setShowCheckout(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition-colors"
            >
              <X size={15} />
            </button>

            <div className="mb-6">
              <div className="w-10 h-10 rounded-2xl bg-[#25D366]/10 flex items-center justify-center mb-3">
                <MessageCircle size={20} className="text-[#25D366]" />
              </div>
              <h2 className="text-xl font-bold text-[#1A1208]">Almost there!</h2>
              <p className="text-[#8C7B6A] text-sm mt-1">Enter your details to send your order</p>
            </div>

            <form onSubmit={handleCheckout} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-1.5">Your Name *</label>
                <div className="relative">
                  <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300" />
                  <input
                    type="text"
                    required
                    autoFocus
                    className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-[#C4873A] focus:ring-2 focus:ring-[#C4873A]/10 transition-all"
                    placeholder="e.g. Kofi Mensah"
                    value={customer.name}
                    onChange={e => setCustomer(c => ({ ...c, name: e.target.value }))}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-1.5">WhatsApp Number *</label>
                <div className="relative">
                  <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300" />
                  <input
                    type="tel"
                    required
                    className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-[#C4873A] focus:ring-2 focus:ring-[#C4873A]/10 transition-all"
                    placeholder="e.g. 0241234567"
                    value={customer.phone}
                    onChange={e => setCustomer(c => ({ ...c, phone: e.target.value }))}
                  />
                </div>
              </div>

              {/* Order summary — only selected items */}
              <div className="bg-[#FAF8F5] rounded-2xl p-4 space-y-2">
                {selectedItems.map(i => (
                  <div key={`${i.product.id}-${i.size}`} className="flex justify-between text-sm">
                    <span className="text-[#8C7B6A] truncate max-w-[200px]">
                      {i.product.name}{i.size ? ` (${i.size})` : ''} ×{i.quantity}
                    </span>
                    <span className="font-semibold text-[#1A1208] ml-2">GHS {(i.product.selling_price * i.quantity).toFixed(2)}</span>
                  </div>
                ))}
                <div className="border-t border-[#E8E0D6] pt-2 mt-1 flex justify-between font-bold">
                  <span className="text-[#1A1208]">Total</span>
                  <span className="text-[#7A4F2D] font-serif">GHS {selectedTotal.toFixed(2)}</span>
                </div>
              </div>

              {saveError && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-xs text-red-600 font-medium">
                  ⚠ Order save failed: {saveError}
                </div>
              )}

              <button
                type="submit"
                disabled={saving}
                className="w-full flex items-center justify-center gap-2.5 bg-[#25D366] hover:bg-[#1da851] text-white font-bold py-4 rounded-2xl transition-colors disabled:opacity-50 text-base shadow-md"
              >
                <MessageCircle size={18} />
                {saving ? 'Processing…' : 'Send Order on WhatsApp'}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
