import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseServerClient } from '@/lib/supabase'
import fs from 'fs'
import path from 'path'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return new Response('Missing ID parameter', { status: 400 })
    }

    const supabase = getSupabaseServerClient()
    const { data: reqData, error } = await supabase
      .from('catalogue_requests')
      .select('*')
      .eq('id', id)
      .single()

    if (error || !reqData) {
      return new Response('Catalogue request not found', { status: 404 })
    }

    if (reqData.status !== 'approved') {
      return new Response('Access denied: Catalogue request is not approved yet', { status: 403 })
    }

    const isHoreca = reqData.brand_slug === 'horeca24h'
    const fileName = isHoreca ? 'hospitality-catalogue.pdf' : 'household-catalogue.pdf'
    const downloadName = isHoreca ? 'WCC_Hospitality_Catalogue.pdf' : 'WCC_Household_Catalogue.pdf'
    const filePath = path.join(process.cwd(), 'secure-catalogues', fileName)

    if (!fs.existsSync(filePath)) {
      return new Response('File not found on server', { status: 404 })
    }

    const fileBuffer = fs.readFileSync(filePath)

    return new Response(fileBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${downloadName}"`,
      },
    })
  } catch (error: any) {
    console.error('Download error:', error)
    return new Response('Internal Server Error', { status: 500 })
  }
}
