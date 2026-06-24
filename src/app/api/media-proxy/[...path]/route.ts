import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    // Extract file path after /api/media-proxy/ using pathname replacement
    const filePath = url.pathname.replace(/^\/api\/media-proxy\//, '')
    
    if (!filePath) {
      return new Response('File path missing', { status: 400 })
    }

    const supabaseUrl = process.env.SUPABASE_URL || 'https://aouhgpeonexfofllurlh.supabase.co'
    const targetUrl = `${supabaseUrl}/storage/v1/object/public/wcc_media/${filePath}`

    // Fetch original media from Supabase storage securely on the server-side
    const response = await fetch(targetUrl, {
      next: { revalidate: 31536000 } // Next.js cache flag
    })

    if (!response.ok) {
      return new Response('File not found', { status: response.status })
    }

    const contentType = response.headers.get('content-type') || 'application/octet-stream'
    const arrayBuffer = await response.arrayBuffer()

    return new NextResponse(arrayBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable', // Cache in client browser & CDN Edge forever
        'X-Content-Type-Options': 'nosniff',
      },
    })
  } catch (error) {
    console.error('Media proxy error:', error)
    return new Response('Internal Server Error', { status: 500 })
  }
}
