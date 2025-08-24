import { NextResponse } from "next/server";
import Replicate from "replicate";

export async function POST(req: Request) {
  try {
    // Check if Replicate API token is configured
    if (!process.env.REPLICATE_API_TOKEN) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'REPLICATE_API_TOKEN_MISSING: Please set up your Replicate API token in .env.local file' 
        },
        { status: 401 }
      );
    }

    // Initialize Replicate client only if token exists
    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
    });

    const { imageUrl } = await req.json();

    if (!imageUrl) {
      return NextResponse.json(
        { success: false, error: 'Missing imageUrl' },
        { status: 400 }
      );
    }

    // Example: RemBG (remove background / segmentation)
    const output = await replicate.run(
      "cjwbw/rembg:fb8af171cfa1616ddcf1242c093f9c46bcada5ad4cf6f2fbe8b81b330ec5c003",
      {
        input: {
          image: imageUrl,   // URL or base64
          background: "transparent"
        }
      }
    );

    // output = URL to processed image
    return NextResponse.json({ 
      success: true,
      mask: output 
    });

  } catch (error) {
    console.error('Error in segmentation:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Segmentation failed' 
      },
      { status: 500 }
    );
  }
}
