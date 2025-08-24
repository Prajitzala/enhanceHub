import { NextRequest, NextResponse } from 'next/server'
import Replicate from 'replicate'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const image = formData.get('image') as File
    const modelName = formData.get('model_name') as string || 'Artistic'

    if (!image) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing image'
        },
        { status: 400 }
      )
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png']
    if (!allowedTypes.includes(image.type)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid file type. Please upload PNG, JPG, or JPEG.'
        },
        { status: 400 }
      )
    }

    // Validate file size (10MB limit)
    if (image.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        {
          success: false,
          error: 'File size too large. Please upload an image smaller than 10MB.'
        },
        { status: 400 }
      )
    }

    // Check if Replicate API token is configured
    if (!process.env.REPLICATE_API_TOKEN) {
      return NextResponse.json(
        {
          success: false,
          error: 'Replicate API token not configured'
        },
        { status: 500 }
      )
    }

    // Convert image to base64
    const bytes = await image.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64Image = buffer.toString('base64')
    const dataUrl = `data:${image.type};base64,${base64Image}`

    // Initialize Replicate
    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
    })

    // Prepare input for the deoldify_image model
    const modelInput = {
      model_name: modelName,
      input_image: dataUrl
    }

    console.log('Using model: arielreplicate/deoldify_image')
    console.log('With input:', { model_name: modelName, input_image: '[base64 image data]' })

    const output = await replicate.run(
      'arielreplicate/deoldify_image:0da600fab0c45a66211339f1c16b71345d22f26ef5fea3dca1bb90bb5711e950',
      { input: modelInput }
    )

    if (!output) {
      throw new Error('No output received from model')
    }

    // Handle the output - it might be a file object or URL
    let imageUrl
    if (typeof output === 'string') {
      imageUrl = output
    } else if (output && typeof (output as any).url === 'function') {
      imageUrl = (output as any).url()
    } else if (output && (output as any).url) {
      imageUrl = (output as any).url
    } else {
      throw new Error('Invalid output format from model')
    }

    return NextResponse.json({
      success: true,
      imageUrl: imageUrl,
      message: 'Photo colorized successfully with AI'
    })

  } catch (error) {
    console.error('Error colorizing image:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to colorize image'
      },
      { status: 500 }
    )
  }
}
