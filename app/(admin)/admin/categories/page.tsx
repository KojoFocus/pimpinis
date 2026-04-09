import { createServerSupabaseClient } from '@/lib/supabase/server'
import CategoryManager from './CategoryManager'

export default async function CategoriesPage() {
  const supabase = await createServerSupabaseClient()
  const { data } = await supabase.from('categories').select('*').order('name')
  return <CategoryManager initialCategories={data ?? []} />
}
