'use client'
import { useState } from 'react'
import { Pencil, Trash2, Plus, Check, X } from 'lucide-react'

const EMOJI_OPTIONS = ['👗','👟','🪢','🕶️','💍','🎩','🛍️','👜','👒','🧣','🧤','💄','👠','🥿','🧢']

interface Category { id: string; name: string; slug: string; image_url?: string }

export default function CategoryManager({ initialCategories }: { initialCategories: Category[] }) {
  const [cats, setCats] = useState(initialCategories)
  const [adding, setAdding] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [newName, setNewName] = useState('')
  const [editName, setEditName] = useState('')
  const [loading, setLoading] = useState(false)

  function toSlug(name: string) {
    return name.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
  }

  async function addCategory() {
    if (!newName.trim()) return
    setLoading(true)
    const res = await fetch('/api/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newName.trim(), slug: toSlug(newName) }),
    })
    if (res.ok) {
      const data = await res.json()
      setCats(c => [...c, data])
      setNewName('')
      setAdding(false)
    }
    setLoading(false)
  }

  async function updateCategory(id: string) {
    if (!editName.trim()) return
    setLoading(true)
    const res = await fetch(`/api/categories/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: editName.trim(), slug: toSlug(editName) }),
    })
    if (res.ok) {
      setCats(c => c.map(cat => cat.id === id ? { ...cat, name: editName.trim(), slug: toSlug(editName) } : cat))
      setEditId(null)
    }
    setLoading(false)
  }

  async function deleteCategory(id: string) {
    if (!confirm('Delete this category? Products in it will lose their category.')) return
    setLoading(true)
    const res = await fetch(`/api/categories/${id}`, { method: 'DELETE' })
    if (res.ok) setCats(c => c.filter(cat => cat.id !== id))
    setLoading(false)
  }

  const field = 'border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#C4873A] bg-white w-full'

  return (
    <div className="space-y-5 max-w-2xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">Categories</h1>
          <p className="text-gray-500 text-sm mt-0.5">{cats.length} categories</p>
        </div>
        <button
          onClick={() => setAdding(true)}
          className="flex items-center gap-2 bg-[#C4873A] hover:bg-[#7A4F2D] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          <Plus size={15} /> Add Category
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm divide-y divide-gray-50">
        {/* Add row */}
        {adding && (
          <div className="flex items-center gap-3 p-4">
            <input
              autoFocus
              className={field}
              placeholder="Category name (e.g. Bags)"
              value={newName}
              onChange={e => setNewName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addCategory()}
            />
            <button onClick={addCategory} disabled={loading} className="p-2 rounded-lg bg-emerald-100 text-emerald-600 hover:bg-emerald-200 transition-colors">
              <Check size={16} />
            </button>
            <button onClick={() => { setAdding(false); setNewName('') }} className="p-2 rounded-lg bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors">
              <X size={16} />
            </button>
          </div>
        )}

        {cats.map(cat => (
          <div key={cat.id} className="flex items-center gap-3 p-4">
            {editId === cat.id ? (
              <>
                <input
                  autoFocus
                  className={field}
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && updateCategory(cat.id)}
                />
                <button onClick={() => updateCategory(cat.id)} disabled={loading} className="p-2 rounded-lg bg-emerald-100 text-emerald-600 hover:bg-emerald-200 transition-colors">
                  <Check size={16} />
                </button>
                <button onClick={() => setEditId(null)} className="p-2 rounded-lg bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors">
                  <X size={16} />
                </button>
              </>
            ) : (
              <>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{cat.name}</p>
                  <p className="text-xs text-gray-400">/{cat.slug}</p>
                </div>
                <button
                  onClick={() => { setEditId(cat.id); setEditName(cat.name) }}
                  className="p-2 rounded-lg text-gray-400 hover:text-[#C4873A] hover:bg-[#C4873A]/10 transition-colors"
                >
                  <Pencil size={15} />
                </button>
                <button
                  onClick={() => deleteCategory(cat.id)}
                  className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                >
                  <Trash2 size={15} />
                </button>
              </>
            )}
          </div>
        ))}

        {cats.length === 0 && !adding && (
          <p className="text-center text-gray-400 py-10 text-sm">No categories yet</p>
        )}
      </div>
    </div>
  )
}
