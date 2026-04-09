import HeroSection from '@/components/store/HeroSection'
import CategoryGrid from '@/components/store/CategoryGrid'
import FeaturedProducts from '@/components/store/FeaturedProducts'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import type { Product } from '@/types'

export default async function HomePage() {
  let products: Product[] = []
  try {
    const supabase = await createServerSupabaseClient()
    const { data } = await supabase
      .from('products')
      .select('*, category:categories(id, name, slug)')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(12)
    products = (data as Product[]) ?? []
  } catch {
    // Supabase not configured yet — show page without products
  }

  return (
    <>
      <HeroSection />
      <CategoryGrid />

      <FeaturedProducts products={products} />

    </>
  )
}
