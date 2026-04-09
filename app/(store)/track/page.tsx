'use client'
import { useState } from 'react'
import { Phone, Search, Package, CheckCircle2, Truck, ShoppingBag, XCircle, Clock } from 'lucide-react'

const STEPS = [
  { key: 'pending',   label: 'Order Placed',  icon: Clock },
  { key: 'confirmed', label: 'Confirmed',      icon: CheckCircle2 },
  { key: 'shipped',   label: 'On the Way',     icon: Truck },
  { key: 'delivered', label: 'Delivered',      icon: Package },
]

const STATUS_STEP: Record<string, number> = {
  pending:   0,
  confirmed: 1,
  shipped:   2,
  delivered: 3,
  cancelled: -1,
}

function StatusTimeline({ status }: { status: string }) {
  if (status === 'cancelled') {
    return (
      <div className="flex items-center gap-2 text-red-500 mt-3">
        <XCircle size={16} />
        <span className="text-sm font-semibold">Order Cancelled</span>
      </div>
    )
  }

  const current = STATUS_STEP[status] ?? 0

  return (
    <div className="mt-4">
      <div className="flex items-center gap-0">
        {STEPS.map((step, idx) => {
          const done = idx <= current
          const active = idx === current
          const Icon = step.icon
          return (
            <div key={step.key} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center gap-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${
                  done
                    ? active
                      ? 'bg-[#C4873A] border-[#C4873A] shadow-md shadow-[#C4873A]/30'
                      : 'bg-[#1A1208] border-[#1A1208]'
                    : 'bg-white border-gray-200'
                }`}>
                  <Icon size={14} className={done ? 'text-white' : 'text-gray-300'} />
                </div>
                <span className={`text-[10px] font-semibold text-center leading-tight w-14 ${
                  active ? 'text-[#C4873A]' : done ? 'text-[#1A1208]' : 'text-gray-300'
                }`}>
                  {step.label}
                </span>
              </div>
              {idx < STEPS.length - 1 && (
                <div className={`flex-1 h-0.5 mb-5 mx-1 rounded-full transition-all ${
                  idx < current ? 'bg-[#1A1208]' : 'bg-gray-100'
                }`} />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function TrackPage() {
  const [phone, setPhone] = useState('')
  const [orders, setOrders] = useState<any[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (!phone.trim()) return
    setLoading(true)
    setSearched(false)
    try {
      const res = await fetch(`/api/orders/track?phone=${encodeURIComponent(phone.trim())}`)
      const data = await res.json()
      setOrders(Array.isArray(data) ? data : [])
    } catch {
      setOrders([])
    }
    setSearched(true)
    setLoading(false)
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-14">

      {/* Header */}
      <div className="text-center mb-10">
        <div className="w-14 h-14 rounded-2xl bg-[#F0EAE0] flex items-center justify-center mx-auto mb-4">
          <Truck size={26} className="text-[#C4873A]" />
        </div>
        <h1 className="font-serif text-3xl text-[#1A1208] mb-2">Track Your Order</h1>
        <p className="text-[#8C7B6A] text-sm">Enter the WhatsApp number you used when placing your order</p>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="flex gap-2 mb-10">
        <div className="relative flex-1">
          <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300" />
          <input
            type="tel"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            placeholder="e.g. 0241234567"
            className="w-full border border-gray-200 rounded-2xl pl-10 pr-4 py-3.5 text-sm focus:outline-none focus:border-[#C4873A] focus:ring-2 focus:ring-[#C4873A]/10 transition-all bg-white shadow-sm"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 bg-[#1A1208] hover:bg-[#C4873A] text-white font-semibold px-6 py-3.5 rounded-2xl transition-colors disabled:opacity-50 text-sm whitespace-nowrap"
        >
          <Search size={15} /> {loading ? 'Searching…' : 'Track'}
        </button>
      </form>

      {/* Results */}
      {searched && (
        orders && orders.length > 0 ? (
          <div className="space-y-5">
            <p className="text-sm text-[#8C7B6A] font-medium">{orders.length} order{orders.length !== 1 ? 's' : ''} found</p>
            {orders.map((order: any) => (
              <div key={order.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">

                {/* Order meta */}
                <div className="flex items-start justify-between mb-1">
                  <div>
                    <p className="text-xs text-[#8C7B6A] font-mono">#{order.id.slice(0, 8).toUpperCase()}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {new Date(order.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                  <span className="font-serif font-bold text-[#7A4F2D] text-lg">
                    GHS {Number(order.total_amount).toFixed(2)}
                  </span>
                </div>

                {/* Items */}
                <div className="mt-3 space-y-2">
                  {order.items?.map((item: any, idx: number) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#F0EAE0] overflow-hidden flex-shrink-0 border border-gray-100">
                        {item.product?.images?.[0]
                          ? <img src={item.product.images[0]} alt="" className="w-full h-full object-cover" />
                          : <div className="w-full h-full flex items-center justify-center"><ShoppingBag size={14} className="text-gray-300" /></div>
                        }
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-[#1A1208] truncate">{item.product?.name}</p>
                        <p className="text-xs text-[#8C7B6A]">
                          {item.size ? `Size ${item.size} · ` : ''}×{item.quantity} · GHS {Number(item.unit_price).toFixed(2)} each
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Status timeline */}
                <StatusTimeline status={order.status} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
            <ShoppingBag size={36} className="mx-auto text-gray-200 mb-3" />
            <p className="text-gray-500 font-medium">No orders found</p>
            <p className="text-gray-400 text-sm mt-1">Check the number matches what you used on WhatsApp</p>
          </div>
        )
      )}
    </div>
  )
}
