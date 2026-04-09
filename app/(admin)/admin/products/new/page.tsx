import { createServerSupabaseClient } from '@/lib/supabase/server'
import ProductForm from '@/components/admin/ProductForm'
import type { Category } from '@/types'

export default async function NewProductPage() {
  const supabase = await createServerSupabaseClient()
  const { data } = await supabase.from('categories').select('*').order('name')
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Add Product</h1>
      <ProductForm categories={(data as Category[]) ?? []} />
    </div>
  )
}
