# Replicate API Setup Guide

## Step 1: Get Your Replicate API Token

1. Go to [https://replicate.com/account/api-tokens](https://replicate.com/account/api-tokens)
2. Sign in or create an account
3. Click "Create API token"
4. Give it a name (e.g., "AI Text Behind Image")
5. Copy the generated token

## Step 2: Create Environment File

Create a file called `.env.local` in the root directory of your project with this content:

```
REPLICATE_API_TOKEN=your_actual_token_here
```

Replace `your_actual_token_here` with the token you copied from Replicate.

## Step 3: Restart the Development Server

After creating the `.env.local` file, restart your development server:

```bash
npm run dev
```

## Step 4: Test the Application

1. Upload an image
2. Add some text
3. Click "Generate AI Text"
4. The app will now use AI segmentation to place text behind objects!

## Troubleshooting

- **401 Unauthorized Error**: Make sure your API token is correct and the `.env.local` file is in the right location
- **Token not working**: Check that you've restarted the server after adding the token
- **Still getting errors**: Verify the token format and that you have credits in your Replicate account

## Note

The app will work without the API token but will use fallback processing instead of AI segmentation.

