# AI Integration Setup Guide

This guide will help you set up AI processing for the AI Text Behind Image application.

## Prerequisites

- Node.js 18+ installed
- A Replicate account (free tier available)

## Step 1: Get Replicate API Token

1. Go to [Replicate](https://replicate.com) and create an account
2. Navigate to your [API tokens page](https://replicate.com/account/api-tokens)
3. Create a new API token
4. Copy the token (it starts with `r8_`)

## Step 2: Configure Environment Variables

1. Create a `.env.local` file in the project root:
```bash
# Create the file
touch .env.local
```

2. Add your Replicate API token to the file:
```env
REPLICATE_API_TOKEN=r8_your_token_here
```

## Step 3: Test the Setup

1. Start the development server:
```bash
npm run dev
```

2. Open http://localhost:3000
3. Upload an image and add some text
4. Click "Generate AI Text Behind Image"

## How It Works

The AI processing pipeline includes:

1. **Object Detection**: Uses YOLOv8 to detect objects in your image
2. **Text Generation**: Creates a text image using Stable Diffusion
3. **Image Composition**: Combines the original image with text behind objects
4. **Fallback Methods**: Multiple AI approaches ensure reliability

## Alternative AI Services

You can also configure other AI services by adding their API keys:

```env
# OpenAI (for GPT-4 Vision + DALL-E)
OPENAI_API_KEY=your_openai_key_here

# Hugging Face (for open-source models)
HUGGINGFACE_API_KEY=your_hf_key_here
```

## Troubleshooting

### "AI processing is not configured" Error
- Make sure you've created the `.env.local` file
- Verify your Replicate API token is correct
- Restart the development server after adding environment variables

### Processing Takes Too Long
- The first request may take longer as models are loaded
- Subsequent requests should be faster
- Consider using a paid Replicate plan for faster processing

### "Failed to process image" Error
- Check your internet connection
- Verify your Replicate account has sufficient credits
- Try with a smaller image file

## Cost Considerations

- Replicate offers a free tier with limited usage
- Each AI processing request costs credits
- Monitor your usage at https://replicate.com/account/usage

## Advanced Configuration

You can customize AI models and settings in `src/lib/config.ts`:

```typescript
models: {
  objectDetection: {
    confidence: 0.25,  // Lower = more objects detected
    iou: 0.45,         // Intersection over Union threshold
  },
  textGeneration: {
    steps: 50,         // More steps = higher quality (slower)
    guidance: 7.5,     // Higher = more prompt adherence
  },
}
```



