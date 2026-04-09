import { createServerSupabaseClient } from '@/lib/supabase/server'
import ProductForm from '@/components/admin/ProductForm'
import { notFound } from 'next/navigation'
import type { Category, Product } from '@/types'

export default async function EditProductPage(props: PageProps<'/admin/products/[id]/edit'>) {
  const { id } = await props.params
  const supabase = await createServerSupabaseClient()

  const [{ data: product }, { data: categories }] = await Promise.all([
    supabase.from('products').select('*').eq('id', id).single(),
    supabase.from('categories').select('*').order('name'),
  ])

  if (!product) notFound()

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Edit Product</h1>
      <ProductForm categories={(categories as Category[]) ?? []} product={product as Product} />
    </div>
  )
}
