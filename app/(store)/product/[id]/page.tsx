import { createServerSupabaseClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import type { Product } from '@/types'
import AddToCartButton from './AddToCartButton'

export default async function ProductPage(props: PageProps<'/product/[id]'>) {
  const { id } = await props.params
  const supabase = await createServerSupabaseClient()

  const { data: product, error } = await supabase
    .from('products')
    .select('*, category:categories(id, name, slug)')
    .eq('id', id)
    .eq('is_active', true)
    .single()

  if (error || !product) notFound()

  const p = product as Product
  const mainImg = p.images?.[0]

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="grid md:grid-cols-2 gap-10">
        {/* Images */}
        <div className="space-y-3">
          <div className="aspect-square bg-gray-100 rounded-2xl overflow-hidden">
            {mainImg
              ? <img src={mainImg} alt={p.name} className="w-full h-full object-cover" />
              : <div className="w-full h-full flex items-center justify-center text-gray-300 text-sm">No image</div>
            }
          </div>
          {p.images?.length > 1 && (
            <div className="flex gap-2">
              {p.images.slice(1).map((url, i) => (
                <div key={i} className="w-16 h-16 rounded-lg overflow-hidden border-2 border-transparent hover:border-[#f05a7e] cursor-pointer">
                  <img src={url} alt="" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          <p className="text-sm text-gray-400 uppercase tracking-wide mb-2">{p.category?.name}</p>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">{p.name}</h1>
          {p.badge && (
            <span className="inline-block text-xs font-bold px-3 py-1 rounded-full bg-[#f05a7e] text-white uppercase mb-4">
              {p.badge}
            </span>
          )}
          <p className="text-3xl font-extrabold text-gray-900 mb-4">GHS {p.selling_price.toFixed(2)}</p>
          {p.description && <p className="text-gray-600 mb-6 leading-relaxed">{p.description}</p>}
          <p className="text-sm text-gray-500 mb-6">
            {p.stock_qty > 0
              ? <span className="text-emerald-600 font-medium">In stock ({p.stock_qty} available)</span>
              : <span className="text-red-500 font-medium">Out of stock</span>
            }
          </p>
          {p.stock_qty > 0 && <AddToCartButton product={p} sizes={(p as any).sizes ?? []} />}
        </div>
      </div>
    </div>
  )
}
