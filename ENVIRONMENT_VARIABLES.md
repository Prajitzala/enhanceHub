# Environment Variables Configuration

## Required Environment Variables

### 1. REPLICATE_API_TOKEN
**Required for AI photo restoration functionality**

```bash
REPLICATE_API_TOKEN=your_replicate_api_token_here
```

**How to get it:**
1. Go to [replicate.com](https://replicate.com)
2. Sign in to your account
3. Go to Account Settings → API Tokens
4. Create a new API token
5. Copy the token and add it to Vercel environment variables

## Optional Environment Variables

### 2. NEXT_PUBLIC_SITE_URL
**For SEO and canonical URLs**

```bash
NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app
```

### 3. Google Ads Configuration
**For conversion tracking and analytics**

```bash
GOOGLE_ADS_CONVERSION_ID=AW-CONVERSION_ID
GOOGLE_ADS_CONVERSION_LABELS_PHOTO_RESTORATION=CONVERSION_LABEL
GOOGLE_ADS_CONVERSION_LABELS_DOWNLOAD=DOWNLOAD_CONVERSION_LABEL
GOOGLE_ADS_CONVERSION_LABELS_SIGNUP=SIGNUP_CONVERSION_LABEL
```

## Setting Environment Variables in Vercel

### Method 1: Vercel Dashboard
1. Go to your project in Vercel dashboard
2. Navigate to Settings → Environment Variables
3. Add each variable with the appropriate value
4. Select the environment (Production, Preview, Development)
5. Click "Save"

### Method 2: Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Add environment variables
vercel env add REPLICATE_API_TOKEN
vercel env add NEXT_PUBLIC_SITE_URL

# Deploy
vercel --prod
```

## Environment Variable Usage in Code

### In API Routes
```typescript
// src/app/api/restore-image/route.ts
const apiToken = process.env.REPLICATE_API_TOKEN
```

### In Client Components
```typescript
// Only NEXT_PUBLIC_* variables are available on client
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
```

## Security Best Practices

1. **Never commit environment variables to Git**
   - Add `.env*` to your `.gitignore` file
   - Use Vercel's environment variable system

2. **Use different tokens for different environments**
   - Development: Use test tokens
   - Production: Use real API tokens

3. **Rotate tokens regularly**
   - Update API tokens periodically
   - Monitor for unauthorized usage

4. **Limit token permissions**
   - Use tokens with minimal required permissions
   - Don't use admin tokens for regular operations

## Troubleshooting

### Common Issues

1. **"REPLICATE_API_TOKEN is not defined"**
   - Check if the variable is set in Vercel
   - Ensure the variable name is exactly correct
   - Redeploy after adding environment variables

2. **API calls failing**
   - Verify the token is valid
   - Check token permissions
   - Ensure sufficient API credits

3. **Client-side errors**
   - Only `NEXT_PUBLIC_*` variables are available on client
   - Use server-side API routes for sensitive data

### Debug Commands
```bash
# Check environment variables locally
echo $REPLICATE_API_TOKEN

# Test API token
curl -H "Authorization: Token $REPLICATE_API_TOKEN" \
  https://api.replicate.com/v1/models

# Check Vercel environment variables
vercel env ls
```
