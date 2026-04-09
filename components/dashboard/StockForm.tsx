'use client'
import { useState } from 'react'
import type { Product } from '@/types'

export default function StockForm({ products }: { products: Product[] }) {
  const [form, setForm] = useState({ product_id: '', quantity: '', unit_cost: '', supplier: '', notes: '', entry_date: new Date().toISOString().split('T')[0] })
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }))

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    const res = await fetch('/api/finance/stock', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, quantity: Number(form.quantity), unit_cost: Number(form.unit_cost) }),
    })
    if (res.ok) {
      setSuccess(true)
      setForm(f => ({ ...f, product_id: '', quantity: '', unit_cost: '', supplier: '', notes: '' }))
      setTimeout(() => setSuccess(false), 2000)
    }
    setSaving(false)
  }

  const field = 'w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#C4873A] bg-white'

  return (
    <form onSubmit={handleSubmit} className="max-w-xl space-y-4 bg-white rounded-lg p-6 border border-gray-100">
      <h2 className="font-serif text-lg text-[#1A1208]">Record Stock Entry</h2>
      <div>
        <label className="block text-xs font-medium uppercase tracking-wide mb-1 text-[#1A1208]">Product *</label>
        <select className={field} value={form.product_id} onChange={set('product_id')} required>
          <option value="">Select product</option>
          {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium uppercase tracking-wide mb-1 text-[#1A1208]">Quantity *</label>
          <input type="number" min="1" className={field} value={form.quantity} onChange={set('quantity')} required />
        </div>
        <div>
          <label className="block text-xs font-medium uppercase tracking-wide mb-1 text-[#1A1208]">Unit cost (GHS) *</label>
          <input type="number" step="0.01" className={field} value={form.unit_cost} onChange={set('unit_cost')} required />
        </div>
      </div>
      <div>
        <label className="block text-xs font-medium uppercase tracking-wide mb-1 text-[#1A1208]">Supplier</label>
        <input className={field} value={form.supplier} onChange={set('supplier')} />
      </div>
      <div>
        <label className="block text-xs font-medium uppercase tracking-wide mb-1 text-[#1A1208]">Date *</label>
        <input type="date" className={field} value={form.entry_date} onChange={set('entry_date')} required />
      </div>
      <div>
        <label className="block text-xs font-medium uppercase tracking-wide mb-1 text-[#1A1208]">Notes</label>
        <textarea className={`${field} min-h-[50px]`} value={form.notes} onChange={set('notes')} />
      </div>
      <button type="submit" disabled={saving}
        className="w-full bg-[#C4873A] hover:bg-[#7A4F2D] text-white py-2 rounded font-medium text-sm disabled:opacity-50 transition-colors">
        {saving ? 'Saving…' : success ? 'Saved ✓' : 'Record Entry'}
      </button>
    </form>
  )
}
