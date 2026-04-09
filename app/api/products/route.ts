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

  // Input validation
  if (!body.name || typeof body.name !== 'string' || body.name.trim().length === 0) {
    return NextResponse.json({ error: 'Name is required and must be a non-empty string' }, { status: 400 })
  }
  if (!body.category_id || typeof body.category_id !== 'string') {
    return NextResponse.json({ error: 'Category ID is required' }, { status: 400 })
  }
  if (!body.selling_price || typeof body.selling_price !== 'number' || body.selling_price <= 0) {
    return NextResponse.json({ error: 'Selling price must be a positive number' }, { status: 400 })
  }
  if (body.cost_price && (typeof body.cost_price !== 'number' || body.cost_price < 0)) {
    return NextResponse.json({ error: 'Cost price must be a non-negative number' }, { status: 400 })
  }
  if (body.stock_qty && (typeof body.stock_qty !== 'number' || body.stock_qty < 0)) {
    return NextResponse.json({ error: 'Stock quantity must be a non-negative number' }, { status: 400 })
  }
  if (body.images && !Array.isArray(body.images)) {
    return NextResponse.json({ error: 'Images must be an array' }, { status: 400 })
  }
  if (body.badge && !['new', 'hot', 'sale'].includes(body.badge)) {
    return NextResponse.json({ error: 'Badge must be one of: new, hot, sale' }, { status: 400 })
  }

  const validatedData = {
    name: body.name.trim(),
    description: body.description?.trim() || null,
    category_id: body.category_id,
    selling_price: body.selling_price,
    cost_price: body.cost_price || null,
    stock_qty: body.stock_qty || 0,
    images: body.images || [],
    is_featured: body.is_featured || false,
    is_active: body.is_active !== undefined ? body.is_active : true,
    badge: body.badge || null,
    colours: body.colours || [],
    sizes: body.sizes || [],
    colour_variants: body.colour_variants || [],
  }

  const { data, error } = await supabase.from('products').insert(validatedData).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}
