'use client'
import { useState } from 'react'

const STATUSES = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled']

const COLORS: Record<string, string> = {
  pending:   'bg-yellow-100 text-yellow-700 border-yellow-200',
  confirmed: 'bg-blue-100 text-blue-700 border-blue-200',
  shipped:   'bg-indigo-100 text-indigo-700 border-indigo-200',
  delivered: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  cancelled: 'bg-red-100 text-red-700 border-red-200',
}

export default function OrderStatusSelect({ orderId, currentStatus }: { orderId: string; currentStatus: string }) {
  const [status, setStatus] = useState(currentStatus)
  const [saving, setSaving] = useState(false)

  async function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const next = e.target.value
    setSaving(true)
    const res = await fetch(`/api/orders/${orderId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: next }),
    })
    if (res.ok) setStatus(next)
    setSaving(false)
  }

  return (
    <select
      value={status}
      onChange={handleChange}
      disabled={saving}
      className={`text-xs font-medium px-2 py-1 rounded-lg border capitalize cursor-pointer focus:outline-none disabled:opacity-50 ${COLORS[status] ?? 'bg-gray-100 text-gray-600 border-gray-200'}`}
    >
      {STATUSES.map(s => (
        <option key={s} value={s} className="bg-white text-gray-800">{s}</option>
      ))}
    </select>
  )
}
