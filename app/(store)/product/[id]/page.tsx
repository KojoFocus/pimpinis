import { createAdminClient } from '@/lib/supabase/admin'
import { notFound } from 'next/navigation'
import type { Product } from '@/types'
import AddToCartButton from './AddToCartButton'
import ImageGallery from './ImageGallery'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

const BADGE_STYLE: Record<string, string> = {
  new:  'bg-[#1A1208] text-white',
  hot:  'bg-[#C4873A] text-white',
  sale: 'bg-red-500 text-white',
}

export default async function ProductPage(props: PageProps<'/product/[id]'>) {
  const { id } = await props.params
  const supabase = createAdminClient()

  const { data: product, error } = await supabase
    .from('products')
    .select('*, category:categories(id, name, slug)')
    .eq('id', id)
    .eq('is_active', true)
    .single()

  if (error || !product) notFound()

  const p = product as Product

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <Link href="/" className="inline-flex items-center gap-2 text-sm text-[#8C7B6A] hover:text-[#1A1208] mb-6 transition-colors">
        <ArrowLeft size={15} /> Back
      </Link>

      <div className="grid md:grid-cols-2 gap-10">
        {/* Interactive image gallery */}
        <ImageGallery images={p.images ?? []} name={p.name} />

        {/* Details */}
        <div className="flex flex-col">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#C4873A] mb-2">{p.category?.name}</p>
          <h1 className="font-serif text-2xl md:text-3xl text-[#1A1208] mb-3 leading-tight">{p.name}</h1>

          {p.badge && (
            <span className={`self-start text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest mb-4 ${BADGE_STYLE[p.badge] ?? 'bg-gray-100 text-gray-600'}`}>
              {p.badge}
            </span>
          )}

          <p className="font-serif text-3xl font-bold text-[#7A4F2D] mb-4">
            GHS {Number(p.selling_price).toFixed(2)}
          </p>

          {p.description && (
            <p className="text-[#8C7B6A] mb-5 leading-relaxed text-sm">{p.description}</p>
          )}

          <p className="text-sm mb-6">
            {p.stock_qty > 0
              ? <span className="text-emerald-600 font-semibold">In stock ({p.stock_qty} available)</span>
              : <span className="text-red-500 font-semibold">Out of stock</span>
            }
          </p>

          {p.stock_qty > 0 && (
            <AddToCartButton
              product={p}
              sizes={(p as any).sizes ?? []}
              colours={(p as any).colours ?? []}
            />
          )}
        </div>
      </div>
    </div>
  )
}
