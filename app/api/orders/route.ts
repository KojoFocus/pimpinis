import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function GET() {
  const supabase = await createServerSupabaseClient()
  const { data, error } = await supabase
    .from('orders')
    .select('*, items:order_items(*, product:products(id, name, images, emoji))')
    .order('created_at', { ascending: false })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  // Use admin client so unauthenticated customers can place orders
  const supabase = createAdminClient()
  const body = await req.json()
  const { items, ...orderData } = body

  // Check stock availability
  for (const item of items || []) {
    const { data: product } = await supabase
      .from('products')
      .select('stock_qty, name')
      .eq('id', item.product_id)
      .single()

    if (!product || product.stock_qty < item.quantity) {
      return NextResponse.json({
        error: `Insufficient stock for ${product?.name || 'product'}. Available: ${product?.stock_qty || 0}`
      }, { status: 400 })
    }
  }

  const { data: order, error } = await supabase
    .from('orders')
    .insert(orderData)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  if (items?.length) {
    const orderItems = items.map((i: any) => ({
      order_id: order.id,
      product_id: i.product_id,
      quantity: i.quantity,
      unit_price: i.unit_price,
      subtotal: i.unit_price * i.quantity,
      size: i.size ?? null,
    }))
    await supabase.from('order_items').insert(orderItems)

    // Update stock quantities
    for (const item of items) {
      await supabase.rpc('decrement_stock', {
        product_id: item.product_id,
        quantity: item.quantity
      })
    }
  }

  return NextResponse.json(order, { status: 201 })
}
