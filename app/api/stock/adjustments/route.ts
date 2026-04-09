import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = await createServerSupabaseClient()
  const { data, error } = await supabase
    .from('stock_adjustments')
    .select('*, product:products(name, emoji), created_by_profile:profiles(full_name)')
    .order('created_at', { ascending: false })
    .limit(50)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { product_id, adjustment, reason, notes } = body

  // Validate
  if (!product_id || typeof adjustment !== 'number' || adjustment === 0) {
    return NextResponse.json({ error: 'Invalid product_id or adjustment' }, { status: 400 })
  }

  // Insert adjustment record
  const { data: adj, error: adjError } = await supabase
    .from('stock_adjustments')
    .insert({
      product_id,
      adjustment,
      reason,
      notes,
      created_by: user.id
    })
    .select()
    .single()

  if (adjError) return NextResponse.json({ error: adjError.message }, { status: 500 })

  // Update product stock
  if (adjustment > 0) {
    await supabase.rpc('increment_stock', { product_id, quantity: adjustment })
  } else {
    await supabase.rpc('decrement_stock', { product_id, quantity: Math.abs(adjustment) })
  }

  return NextResponse.json(adj, { status: 201 })
}