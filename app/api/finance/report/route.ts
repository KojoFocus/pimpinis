import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { computeIncomeStatement } from '@/lib/finance'

export async function GET(req: NextRequest) {
  const supabase = await createServerSupabaseClient()
  const { searchParams } = new URL(req.url)
  const from = searchParams.get('from')
  const to   = searchParams.get('to')

  let query = supabase.from('income_statement').select('*')
  if (from) query = query.gte('period', from)
  if (to)   query = query.lte('period', to)

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const enriched = computeIncomeStatement(data ?? [])
  return NextResponse.json(enriched)
}
