import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseServerClient, isSupabaseConfigured } from '@/lib/supabase'
// @ts-ignore
import { v2 as cloudinary } from 'cloudinary'

// Configure Cloudinary from server environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function POST(request: NextRequest) {
  try {
    if (!isSupabaseConfigured()) {
      return NextResponse.json(
        { success: false, error: 'Database not configured. Please set up Supabase.' },
        { status: 501 }
      )
    }

    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      )
    }

    // Convert file to Base64 URI for serverless Cloudinary upload
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    const base64Data = buffer.toString('base64')
    const fileUri = `data:${file.type};base64,${base64Data}`

    // Upload directly to Cloudinary (using 'wcc_media' folder for neatness)
    const uploadResponse = await cloudinary.uploader.upload(fileUri, {
      folder: 'wcc_media',
      resource_type: 'auto',
    })

    const publicUrl = uploadResponse.secure_url

    const supabase = getSupabaseServerClient()
    // Save media record in Supabase DB for site gallery and references
    await supabase.from('media').insert([
      {
        url: publicUrl,
        filename: file.name,
        size: file.size,
        mime_type: file.type,
      }
    ])

    return NextResponse.json({ success: true, url: publicUrl })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to upload file to Cloudinary' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const url = searchParams.get('url')

    if (!url) {
      return NextResponse.json(
        { success: false, error: 'No URL provided' },
        { status: 400 }
      )
    }

    // Extract public ID from Cloudinary URL (handles folders like wcc_media)
    const match = url.match(/\/upload\/(?:v\d+\/)?([^\s?#]+)$/)
    if (match) {
      const pathPart = match[1]
      const lastDot = pathPart.lastIndexOf('.')
      const publicId = lastDot === -1 ? pathPart : pathPart.substring(0, lastDot)

      // Delete directly from Cloudinary
      await cloudinary.uploader.destroy(publicId)
    }

    // Delete media record in Supabase DB
    if (isSupabaseConfigured()) {
      const supabase = getSupabaseServerClient()
      await supabase.from('media').delete().eq('url', url)
    }

    return NextResponse.json({ success: true, message: 'Asset deleted successfully' })
  } catch (error) {
    console.error('Delete asset error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete asset from Cloudinary' },
      { status: 500 }
    )
  }
}
