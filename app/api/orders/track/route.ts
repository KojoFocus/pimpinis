import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

// Public endpoint — customers look up their own orders by phone number
export async function GET(req: NextRequest) {
  const phone = req.nextUrl.searchParams.get('phone')?.trim()
  if (!phone) return NextResponse.json({ error: 'Phone number required' }, { status: 400 })

  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('orders')
    .select('id, status, total_amount, created_at, items:order_items(quantity, size, unit_price, product:products(name, images))')
    .eq('customer_phone', phone)
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data ?? [])
}
