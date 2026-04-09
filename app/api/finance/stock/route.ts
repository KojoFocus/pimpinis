import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = await createServerSupabaseClient()
  const { data, error } = await supabase
    .from('stock_entries')
    .select('*, product:products(id, name)')
    .order('entry_date', { ascending: false })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  const supabase = await createServerSupabaseClient()
  const body = await req.json()
  const { data, error } = await supabase.from('stock_entries').insert(body).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  await supabase.rpc('increment_stock', {
    p_product_id: body.product_id,
    p_qty: body.quantity,
  })

  return NextResponse.json(data, { status: 201 })
}
