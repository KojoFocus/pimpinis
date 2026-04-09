'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Product, Category, ColourVariant } from '@/types'
import { uploadProductImage } from '@/lib/supabase/storage'
import { X, ChevronDown, ChevronUp } from 'lucide-react'

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
  product?: Partial<Product & { sizes?: string[] }>
}

export default function ProductForm({ categories, product }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [uploading, setUploading] = useState(false)
  // Track which variant cards are expanded (showing size picker)
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null)
  const [colourVariants, setColourVariants] = useState<ColourVariant[]>(() => {
    if (product?.colour_variants?.length) return product.colour_variants
    return (product?.images ?? []).map(img => ({ image: img, colour: '', sizes: product?.sizes ?? [] }))
  })
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
    setForm(f => ({ ...f, [k]: e.target.value }))
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    if (!files.length) return
    setUploading(true)
    try {
      const urls = await Promise.all(files.map(uploadProductImage))
      setColourVariants(prev => [...prev, ...urls.map(url => ({ image: url, colour: '', sizes: [] }))])
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  function removeVariant(i: number) {
    setColourVariants(prev => prev.filter((_, idx) => idx !== i))
    if (expandedIdx === i) setExpandedIdx(null)
  }

  function updateVariantColour(i: number, colour: string) {
    setColourVariants(prev => prev.map((v, idx) => idx === i ? { ...v, colour } : v))
  }

  function toggleVariantSize(variantIdx: number, size: string) {
    setColourVariants(prev => prev.map((v, i) => {
      if (i !== variantIdx) return v
      const current = v.sizes ?? []
      return { ...v, sizes: current.includes(size) ? current.filter(s => s !== size) : [...current, size] }
    }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const images = colourVariants.map(v => v.image).filter(Boolean)
    const colours = [...new Set(colourVariants.map(v => v.colour).filter(Boolean))]
    // Global sizes = union of all variant sizes (for backward compat)
    const sizes = [...new Set(colourVariants.flatMap(v => v.sizes ?? []))]
    const payload = { ...form, images, colours, sizes, colour_variants: colourVariants }
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
  const availableSizes = getSizes(categories, form.category_id)

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
          <p className="text-xs text-gray-500 mt-2">
            Select the category first to load the right size options for colour variants.
          </p>
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

      {/* Images, Colours & Sizes */}
      <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
        <label className={label}>Images, Colours & Sizes</label>
        <p className="text-xs text-gray-500 mb-4">
          Upload one image per colour variant. Tag each with a colour, then expand to assign sizes for that colour.
        </p>

        {colourVariants.length > 0 && (
          <div className="space-y-3 mb-3">
            {colourVariants.map((v, i) => {
              const isExpanded = expandedIdx === i
              const variantSizes = v.sizes ?? []
              return (
                <div key={i} className="border border-gray-100 rounded-xl overflow-hidden">
                  {/* Main row */}
                  <div className="flex items-center gap-3 p-3 bg-gray-50">
                    {/* Thumbnail */}
                    <div className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden bg-[#F0EAE0]">
                      {v.image && <img src={v.image} alt="" className="w-full h-full object-cover" />}
                    </div>

                    {/* Colour input */}
                    <div className="flex-1 min-w-0">
                      <label className="text-xs text-gray-500 mb-1 block">
                        Colour tag <span className="text-gray-400 font-normal">(optional)</span>
                      </label>
                      <input
                        type="text"
                        list="colour-presets"
                        value={v.colour}
                        onChange={e => updateVariantColour(i, e.target.value)}
                        placeholder="e.g. Black, Red, Navy…"
                        className={field}
                      />
                      <p className="text-[11px] text-gray-500 mt-2">
                        {availableSizes.length > 0
                          ? variantSizes.length > 0
                            ? `${variantSizes.length} size${variantSizes.length === 1 ? '' : 's'} selected`
                            : 'Tap Sizes to assign available sizes for this variant.'
                          : form.category_id
                            ? 'This category has no preset size options.'
                            : 'Select a category to reveal size options.'
                        }
                      </p>
                    </div>

                    {/* Sizes toggle */}
                    <button
                      type="button"
                      onClick={() => setExpandedIdx(isExpanded ? null : i)}
                      className="flex-shrink-0 flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-lg hover:bg-white border border-gray-200 transition-colors text-gray-500 hover:text-[#C4873A] min-w-[56px]"
                    >
                      <span className="text-[10px] font-semibold uppercase tracking-wide">Sizes</span>
                      <span className="text-xs font-bold text-[#1A1208]">
                        {variantSizes.length > 0 ? variantSizes.length : (availableSizes.length > 0 ? '0' : '—')}
                      </span>
                      {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                    </button>

                    {/* Remove */}
                    <button
                      type="button"
                      onClick={() => removeVariant(i)}
                      className="flex-shrink-0 w-8 h-8 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>

                  {/* Expanded size picker */}
                  {isExpanded && (
                    <div className="px-3 pb-3 pt-2 bg-white border-t border-gray-100">
                      <p className="text-xs text-gray-500 mb-2">
                        Sizes for <strong>{v.colour || 'this image'}</strong>
                        {variantSizes.length > 0 && <span className="ml-1 text-gray-400">— {variantSizes.join(', ')}</span>}
                      </p>
                      {availableSizes.length > 0 ? (
                        <div className="flex flex-wrap gap-1.5">
                          {availableSizes.map(size => (
                            <button
                              key={size}
                              type="button"
                              onClick={() => toggleVariantSize(i, size)}
                              className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all ${
                                variantSizes.includes(size)
                                  ? 'bg-[#1A1208] text-white border-[#1A1208]'
                                  : 'bg-white text-gray-600 border-gray-200 hover:border-[#C4873A]'
                              }`}
                            >
                              {size}
                            </button>
                          ))}
                        </div>
                      ) : form.category_id ? (
                        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-3 py-3 text-sm text-amber-800">
                          This category has no preset sizes. Use the product page to enter sizes or choose a category with size variants.
                        </div>
                      ) : (
                        <div className="rounded-2xl border border-gray-200 bg-gray-50 px-3 py-3 text-sm text-gray-600">
                          Select a category first to see size options for each colour variant.
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
            <datalist id="colour-presets">
              {PRESET_COLOURS.map(c => <option key={c} value={c} />)}
            </datalist>
          </div>
        )}

        <label className="block cursor-pointer border-2 border-dashed border-gray-200 rounded-xl px-4 py-3 text-sm text-center text-gray-500 hover:border-[#C4873A] hover:text-[#C4873A] transition-colors">
          {uploading ? 'Uploading…' : '+ Add images'}
          <input type="file" accept="image/*" multiple className="hidden" onChange={handleImageUpload} disabled={uploading} />
        </label>
      </div>

      {/* Actions */}
      <div className="sticky bottom-0 left-0 z-20 bg-white/95 backdrop-blur-md border-t border-gray-100 py-4 mt-6 flex flex-wrap gap-3">
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
