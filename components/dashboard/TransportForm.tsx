'use client'
import { useState } from 'react'

export default function TransportForm() {
  const [form, setForm] = useState({ description: '', amount: '', transport_date: new Date().toISOString().split('T')[0] })
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }))

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    const res = await fetch('/api/finance/transport', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, amount: Number(form.amount) }),
    })
    if (res.ok) {
      setSuccess(true)
      setForm(f => ({ ...f, description: '', amount: '' }))
      setTimeout(() => setSuccess(false), 2000)
    }
    setSaving(false)
  }

  const field = 'w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#C4873A] bg-white'

  return (
    <form onSubmit={handleSubmit} className="max-w-xl space-y-4 bg-white rounded-lg p-6 border border-gray-100">
      <h2 className="font-serif text-lg text-[#1A1208]">Log Transport Cost</h2>
      <div>
        <label className="block text-xs font-medium uppercase tracking-wide mb-1 text-[#1A1208]">Description *</label>
        <input className={field} value={form.description} onChange={set('description')} required placeholder="e.g. Delivery to Kumasi – April batch" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium uppercase tracking-wide mb-1 text-[#1A1208]">Amount (GHS) *</label>
          <input type="number" step="0.01" className={field} value={form.amount} onChange={set('amount')} required />
        </div>
        <div>
          <label className="block text-xs font-medium uppercase tracking-wide mb-1 text-[#1A1208]">Date *</label>
          <input type="date" className={field} value={form.transport_date} onChange={set('transport_date')} required />
        </div>
      </div>
      <button type="submit" disabled={saving}
        className="w-full bg-[#C4873A] hover:bg-[#7A4F2D] text-white py-2 rounded font-medium text-sm disabled:opacity-50 transition-colors">
        {saving ? 'Saving…' : success ? 'Logged ✓' : 'Log Transport Cost'}
      </button>
    </form>
  )
}
