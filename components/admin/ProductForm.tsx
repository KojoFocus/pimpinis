'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Product, Category } from '@/types'
import ImageUploader from './ImageUploader'
import { X, Plus } from 'lucide-react'

const SIZE_MAP: Record<string, string[]> = {
  footwear:    ['18','19','20','21','22','23','24','25','26','27','28','29','30','31','32','33','34','35','36','37','38','39','40','41','42','43','44','45','46','47','48','49'],
  dresses:     ['XS','S','M','L','XL','XXL','XXXL','6','8','10','12','14','16','18','20'],
  belts:       ['28"','30"','32"','34"','36"','38"','40"','42"'],
  sunglasses:  [],
  accessories: [],
  hats:        ['54cm','55cm','56cm','57cm','58cm','59cm','60cm'],
  others:      ['XS','S','M','L','XL','XXL','XXXL','6','8','10','12','14','16','18','20'],
}

const PRESET_COLOURS = [
  'Black','White','Red','Blue','Navy','Green','Yellow',
  'Pink','Brown','Grey','Beige','Purple','Orange','Gold','Silver',
]

function getSizes(categories: Category[], categoryId: string): string[] {
  const cat = categories.find(c => c.id === categoryId)
  if (!cat) return []
  return SIZE_MAP[cat.slug] ?? ['XS','S','M','L','XL','XXL','Free Size']
}

interface Props {
  categories: Category[]
  product?: Partial<Product & { sizes?: string[]; colours?: string[] }>
}

export default function ProductForm({ categories, product }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [images, setImages] = useState<string[]>(product?.images ?? [])
  const [sizes, setSizes] = useState<string[]>(product?.sizes ?? [])
  const [colours, setColours] = useState<string[]>(product?.colours ?? [])
  const [colourInput, setColourInput] = useState('')
  const [form, setForm] = useState({
    name:          product?.name ?? '',
    description:   product?.description ?? '',
    category_id:   product?.category_id ?? '',
    selling_price: product?.selling_price ?? '',
    stock_qty:     product?.stock_qty ?? 0,
    badge:         product?.badge ?? '',
    is_active:     product?.is_active ?? true,
  })
  const isEdit = !!product?.id

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    if (k === 'category_id') setSizes([])
    setForm(f => ({ ...f, [k]: e.target.value }))
  }

  function toggleSize(size: string) {
    setSizes(prev => prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size])
  }

  function addColour(colour: string) {
    const trimmed = colour.trim()
    if (!trimmed || colours.includes(trimmed)) return
    setColours(prev => [...prev, trimmed])
    setColourInput('')
  }

  function removeColour(colour: string) {
    setColours(prev => prev.filter(c => c !== colour))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const payload = { ...form, images, sizes, colours }
    const res = await fetch(
      isEdit ? `/api/products/${product!.id}` : '/api/products',
      { method: isEdit ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }
    )
    if (res.ok) { router.push('/admin/products'); router.refresh() }
    else { const err = await res.json(); alert(err.error) }
    setLoading(false)
  }

  async function handleDelete() {
    if (!confirm('Permanently delete this product? This cannot be undone.')) return
    setDeleting(true)
    await fetch(`/api/products/${product!.id}`, { method: 'DELETE' })
    router.push('/admin/products')
    router.refresh()
  }

  const field = 'w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#C4873A] bg-white'
  const label = 'block text-xs font-semibold uppercase tracking-wide mb-1.5 text-gray-600'

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-5">
      {/* Name */}
      <div>
        <label className={label}>Product Name *</label>
        <input className={field} value={form.name} onChange={set('name')} required placeholder="e.g. Classic White Sneakers" />
      </div>

      {/* Description */}
      <div>
        <label className={label}>Description</label>
        <textarea className={`${field} min-h-[80px] resize-none`} value={form.description} onChange={set('description')} placeholder="Describe the product..." />
      </div>

      {/* Category + Badge */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={label}>Category *</label>
          <select className={field} value={form.category_id} onChange={set('category_id')} required>
            <option value="">Select category</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div>
          <label className={label}>Badge</label>
          <select className={field} value={form.badge} onChange={set('badge')}>
            <option value="">None</option>
            <option value="new">New</option>
            <option value="hot">Hot</option>
            <option value="sale">Sale</option>
          </select>
        </div>
      </div>

      {/* Price + Stock */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={label}>Selling Price (GHS) *</label>
          <input type="number" step="0.01" min="0" className={field} value={form.selling_price} onChange={set('selling_price')} required placeholder="0.00" />
        </div>
        <div>
          <label className={label}>Stock Quantity</label>
          <input type="number" min="0" className={field} value={form.stock_qty} onChange={set('stock_qty')} />
        </div>
      </div>

      {/* Sizes */}
      {form.category_id && (
        <div>
          <label className={label}>Available Sizes</label>
          {getSizes(categories, form.category_id).length > 0 ? (
            <>
              <div className="flex flex-wrap gap-2">
                {getSizes(categories, form.category_id).map(size => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => toggleSize(size)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-all ${
                      sizes.includes(size)
                        ? 'bg-[#1A1208] text-white border-[#1A1208]'
                        : 'bg-white text-gray-600 border-gray-200 hover:border-[#C4873A]'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
              {sizes.length > 0 && <p className="text-xs text-gray-400 mt-2">Selected: {sizes.join(', ')}</p>}
            </>
          ) : (
            <p className="text-xs text-gray-400">No sizes needed for this category</p>
          )}
        </div>
      )}

      {/* Colours */}
      <div>
        <label className={label}>Available Colours</label>
        {/* Preset chips */}
        <div className="flex flex-wrap gap-2 mb-3">
          {PRESET_COLOURS.map(c => (
            <button
              key={c}
              type="button"
              onClick={() => colours.includes(c) ? removeColour(c) : addColour(c)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                colours.includes(c)
                  ? 'bg-[#1A1208] text-white border-[#1A1208]'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-[#C4873A]'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
        {/* Custom colour input */}
        <div className="flex gap-2">
          <input
            type="text"
            className={`${field} flex-1`}
            value={colourInput}
            onChange={e => setColourInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addColour(colourInput) } }}
            placeholder="Type a custom colour and press Enter"
          />
          <button
            type="button"
            onClick={() => addColour(colourInput)}
            className="flex items-center gap-1 px-4 py-2 bg-[#1A1208] text-white rounded-lg text-sm font-medium hover:bg-[#C4873A] transition-colors"
          >
            <Plus size={14} /> Add
          </button>
        </div>
        {/* Selected colours */}
        {colours.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {colours.map(c => (
              <span key={c} className="flex items-center gap-1.5 bg-[#F0EAE0] text-[#7A4F2D] text-xs font-semibold px-3 py-1.5 rounded-full">
                {c}
                <button type="button" onClick={() => removeColour(c)} className="hover:text-red-500 transition-colors">
                  <X size={11} />
                </button>
              </span>
            ))}
          </div>
        )}
        {colours.length === 0 && <p className="text-xs text-gray-400 mt-2">No colour options — leave empty if product has one colour</p>}
      </div>

      {/* Active */}
      <div>
        <label className="flex items-center gap-2.5 cursor-pointer">
          <input
            type="checkbox"
            checked={form.is_active}
            onChange={e => setForm(f => ({ ...f, is_active: e.target.checked }))}
            className="w-4 h-4 accent-[#C4873A]"
          />
          <span className="text-sm font-medium text-gray-700">Active — visible on store</span>
        </label>
      </div>

      {/* Images */}
      <div>
        <label className={label}>Images</label>
        <p className="text-xs text-gray-400 mb-2">Upload one image per colour variant so customers can see each colour</p>
        <ImageUploader images={images} onChange={setImages} />
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-100">
        <button
          type="submit"
          disabled={loading}
          className="bg-[#C4873A] hover:bg-[#7A4F2D] text-white px-6 py-2.5 rounded-lg font-medium text-sm disabled:opacity-50 transition-colors"
        >
          {loading ? 'Saving…' : isEdit ? 'Save Changes' : 'Add Product'}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="border border-gray-200 text-gray-600 px-6 py-2.5 rounded-lg font-medium text-sm hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        {isEdit && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="ml-auto border border-red-200 text-red-500 px-6 py-2.5 rounded-lg font-medium text-sm hover:bg-red-50 transition-colors disabled:opacity-50"
          >
            {deleting ? 'Deleting…' : 'Delete Product'}
          </button>
        )}
      </div>
    </form>
  )
}
