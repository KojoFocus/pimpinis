import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'

export async function GET(req: NextRequest) {
  const supabase = await createServerSupabaseClient()
  const { searchParams } = new URL(req.url)
  const category = searchParams.get('category')
  const featured = searchParams.get('featured')

  let query = supabase
    .from('products')
    .select('*, category:categories(id, name, slug)')
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  if (featured === 'true') query = query.eq('is_featured', true)

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const result = category
    ? (data ?? []).filter((p: any) => p.category?.slug === category)
    : data

  return NextResponse.json(result)
}

export async function POST(req: NextRequest) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { data, error } = await supabase.from('products').insert(body).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}
