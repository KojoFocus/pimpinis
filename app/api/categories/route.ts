import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = await createServerSupabaseClient()
  const { data, error } = await supabase.from('categories').select('*').order('name')
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
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
  if (body.slug && (typeof body.slug !== 'string' || !/^[a-z0-9-]+$/.test(body.slug))) {
    return NextResponse.json({ error: 'Slug must be lowercase alphanumeric with hyphens only' }, { status: 400 })
  }
  if (body.image_url && typeof body.image_url !== 'string') {
    return NextResponse.json({ error: 'Image URL must be a string' }, { status: 400 })
  }

  const validatedData = {
    name: body.name.trim(),
    slug: body.slug || body.name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-'),
    image_url: body.image_url?.trim() || null,
  }

  const { data, error } = await supabase.from('categories').insert(validatedData).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}
