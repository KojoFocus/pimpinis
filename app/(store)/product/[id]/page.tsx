import { createAdminClient } from '@/lib/supabase/admin'
import { notFound } from 'next/navigation'
import type { Product } from '@/types'
import ProductInteractive from './ProductInteractive'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

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
      <ProductInteractive
        product={p}
        colourVariants={(p as any).colour_variants ?? []}
        globalSizes={(p as any).sizes ?? []}
      />
    </div>
  )
}
