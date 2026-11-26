import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { uploadToDropbox } from '@/lib/dropbox'

export async function POST(req: NextRequest) {
  // Auth check
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Niet ingelogd' }, { status: 401 })

  const formData = await req.formData()
  const file = formData.get('file') as File | null
  const projectId = formData.get('project_id') as string | null

  if (!file || !projectId) {
    return NextResponse.json({ error: 'Ontbrekende gegevens' }, { status: 400 })
  }

  if (file.size > 100 * 1024 * 1024) {
    return NextResponse.json({ error: 'Bestand te groot (max 100 MB)' }, { status: 400 })
  }

  try {
    const buffer = await file.arrayBuffer()
    const result = await uploadToDropbox(projectId, 'voor-klant', file.name, buffer)
    return NextResponse.json({ file: result })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('Admin upload error:', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
