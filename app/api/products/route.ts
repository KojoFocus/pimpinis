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
  const sellingPrice = Number(body.selling_price)
  const costPrice = body.cost_price !== undefined ? Number(body.cost_price) : null
  const stockQty = body.stock_qty !== undefined ? Number(body.stock_qty) : 0

  // Input validation
  if (!body.name || typeof body.name !== 'string' || body.name.trim().length === 0) {
    return NextResponse.json({ error: 'Name is required and must be a non-empty string' }, { status: 400 })
  }
  if (!body.category_id || typeof body.category_id !== 'string') {
    return NextResponse.json({ error: 'Category ID is required' }, { status: 400 })
  }
  if (Number.isNaN(sellingPrice) || sellingPrice <= 0) {
    return NextResponse.json({ error: 'Selling price must be a positive number' }, { status: 400 })
  }
  if (body.cost_price !== undefined && (Number.isNaN(costPrice) || (costPrice !== null && costPrice < 0))) {
    return NextResponse.json({ error: 'Cost price must be a non-negative number' }, { status: 400 })
  }
  if (!Number.isInteger(stockQty) || stockQty < 0) {
    return NextResponse.json({ error: 'Stock quantity must be a non-negative integer' }, { status: 400 })
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
    selling_price: sellingPrice,
    cost_price: costPrice !== null ? costPrice : null,
    stock_qty: stockQty,
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
