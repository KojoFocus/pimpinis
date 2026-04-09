'use client'
import { useState } from 'react'
import { ArrowRight, X } from 'lucide-react'

const FLOW = ['pending', 'confirmed', 'shipped', 'delivered']

const STATUS_STYLE: Record<string, { badge: string; label: string }> = {
  pending:   { badge: 'bg-amber-50 text-amber-700 border-amber-200',   label: 'Pending' },
  confirmed: { badge: 'bg-blue-50 text-blue-700 border-blue-200',      label: 'Confirmed' },
  shipped:   { badge: 'bg-indigo-50 text-indigo-700 border-indigo-200',label: 'Shipped' },
  delivered: { badge: 'bg-emerald-50 text-emerald-700 border-emerald-200', label: 'Delivered' },
  cancelled: { badge: 'bg-red-50 text-red-700 border-red-200',         label: 'Cancelled' },
}

const NEXT_LABEL: Record<string, string> = {
  pending:   'Confirm',
  confirmed: 'Mark Shipped',
  shipped:   'Mark Delivered',
}

export default function OrderStatusSelect({ orderId, currentStatus }: { orderId: string; currentStatus: string }) {
  const [status, setStatus] = useState(currentStatus)
  const [saving, setSaving] = useState(false)

  async function updateStatus(next: string) {
    setSaving(true)
    const res = await fetch(`/api/orders/${orderId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: next }),
    })
    if (res.ok) setStatus(next)
    setSaving(false)
  }

  const style = STATUS_STYLE[status] ?? STATUS_STYLE.pending
  const nextStep = FLOW[FLOW.indexOf(status) + 1]
  const nextLabel = NEXT_LABEL[status]

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {/* Current status badge */}
      <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border whitespace-nowrap ${style.badge}`}>
        {style.label}
      </span>

      {/* Next step button */}
      {nextLabel && (
        <button
          onClick={() => updateStatus(nextStep)}
          disabled={saving}
          className="flex items-center gap-1 bg-[#1A1208] hover:bg-[#C4873A] text-white text-[11px] font-semibold px-3 py-1.5 rounded-full transition-colors disabled:opacity-40 whitespace-nowrap"
        >
          {saving ? '…' : <><ArrowRight size={11} /> {nextLabel}</>}
        </button>
      )}

      {/* Cancel button — only if not already delivered/cancelled */}
      {status !== 'delivered' && status !== 'cancelled' && (
        <button
          onClick={() => updateStatus('cancelled')}
          disabled={saving}
          className="p-1 rounded-full text-gray-300 hover:text-red-400 hover:bg-red-50 transition-colors disabled:opacity-40"
          title="Cancel order"
        >
          <X size={13} />
        </button>
      )}
    </div>
  )
}
