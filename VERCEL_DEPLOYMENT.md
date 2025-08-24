# Vercel Deployment Guide for AI EnhanceHub

## Prerequisites

1. **GitHub Account**: Your code should be in a GitHub repository
2. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
3. **Replicate API Token**: You'll need your Replicate API token for the AI functionality

## Step 1: Prepare Your Repository

### 1.1 Push to GitHub
```bash
# Initialize git if not already done
git init
git add .
git commit -m "Initial commit for Vercel deployment"

# Create a new repository on GitHub and push
git remote add origin https://github.com/yourusername/ai-enhancehub.git
git branch -M main
git push -u origin main
```

### 1.2 Verify Repository Structure
Ensure your repository has these key files:
- `package.json` ✅
- `next.config.ts` ✅
- `tailwind.config.ts` ✅
- `src/app/page.tsx` ✅
- `src/app/layout.tsx` ✅
- `vercel.json` ✅

## Step 2: Deploy to Vercel

### 2.1 Connect to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Vercel will auto-detect it's a Next.js project

### 2.2 Configure Project Settings
- **Project Name**: `ai-enhancehub` (or your preferred name)
- **Framework Preset**: Next.js (should be auto-detected)
- **Root Directory**: `./` (leave as default)
- **Build Command**: `npm run build` (should be auto-detected)
- **Output Directory**: `.next` (should be auto-detected)
- **Install Command**: `npm install` (should be auto-detected)

### 2.3 Environment Variables
Add these environment variables in Vercel:

| Variable Name | Value | Description |
|---------------|-------|-------------|
| `REPLICATE_API_TOKEN` | `your-replicate-api-token` | Your Replicate API token for AI processing |
| `NEXT_PUBLIC_SITE_URL` | `https://your-domain.vercel.app` | Your Vercel deployment URL |

### 2.4 Deploy
Click "Deploy" and wait for the build to complete.

## Step 3: Post-Deployment Configuration

### 3.1 Custom Domain (Optional)
1. Go to your project settings in Vercel
2. Navigate to "Domains"
3. Add your custom domain (e.g., `aienhancehub.com`)
4. Configure DNS settings as instructed

### 3.2 Google AdSense Setup
1. **Update Ad Slot ID**: Replace `5678901234` in `src/app/page.tsx` with your actual ad slot ID
2. **Verify Domain**: Add your Vercel domain to AdSense
3. **Test Ads**: Ensure ads load correctly on the live site

### 3.3 SEO Configuration
Update these files with your actual domain:

#### Update `src/app/layout.tsx`:
```typescript
alternates: {
  canonical: "https://your-domain.vercel.app", // Update this
},
```

#### Update `src/app/sitemap.ts`:
```typescript
{
  url: 'https://your-domain.vercel.app', // Update this
  // ... other URLs
}
```

#### Update `src/app/robots.ts`:
```typescript
sitemap: 'https://your-domain.vercel.app/sitemap.xml', // Update this
```

## Step 4: Testing Your Deployment

### 4.1 Functionality Tests
- ✅ Photo upload and restoration
- ✅ AI processing with Replicate
- ✅ Download functionality
- ✅ Responsive design
- ✅ AdSense integration

### 4.2 Performance Tests
- ✅ Page load speed
- ✅ Image processing time
- ✅ Mobile responsiveness
- ✅ Ad loading

## Step 5: Monitoring and Analytics

### 5.1 Vercel Analytics
- Enable Vercel Analytics in project settings
- Monitor performance metrics
- Track user behavior

### 5.2 Google Analytics (Optional)
Add Google Analytics tracking code to `src/app/layout.tsx` if needed.

## Troubleshooting

### Common Issues

#### 1. Build Failures
```bash
# Check build logs in Vercel dashboard
# Common fixes:
npm install --legacy-peer-deps
# or
npm install --force
```

#### 2. API Route Issues
- Ensure `REPLICATE_API_TOKEN` is set correctly
- Check function timeout settings in `vercel.json`
- Verify API routes are in `src/app/api/` directory

#### 3. AdSense Issues
- Verify domain is approved in AdSense
- Check ad slot IDs are correct
- Ensure AdSense script loads properly

#### 4. Image Processing Issues
- Check Replicate API token validity
- Verify image upload limits
- Monitor function execution time

### Debug Commands
```bash
# Local testing
npm run build
npm run start

# Check environment variables
echo $REPLICATE_API_TOKEN

# Test API routes locally
curl -X POST http://localhost:3000/api/restore-image
```

## Performance Optimization

### 1. Image Optimization
- Next.js Image component is already optimized
- Consider adding image compression
- Use appropriate image formats

### 2. Caching
- Vercel automatically caches static assets
- API responses are cached based on headers
- Consider implementing Redis for session storage

### 3. CDN
- Vercel provides global CDN automatically
- Images are served from edge locations
- API routes are distributed globally

## Security Considerations

### 1. Environment Variables
- Never commit API tokens to Git
- Use Vercel's environment variable system
- Rotate tokens regularly

### 2. API Security
- Implement rate limiting if needed
- Validate file uploads
- Sanitize user inputs

### 3. CORS Configuration
- Configure CORS for your domain
- Restrict API access if needed

## Maintenance

### 1. Regular Updates
- Keep dependencies updated
- Monitor for security vulnerabilities
- Update Next.js and React versions

### 2. Backup Strategy
- Your code is backed up in GitHub
- Consider database backups if adding one
- Document configuration changes

### 3. Monitoring
- Set up uptime monitoring
- Monitor error rates
- Track performance metrics

## Support Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Replicate API Documentation](https://replicate.com/docs)
- [Google AdSense Help](https://support.google.com/adsense)

## Deployment Checklist

- [ ] Code pushed to GitHub
- [ ] Vercel project created
- [ ] Environment variables configured
- [ ] Build successful
- [ ] Domain configured (optional)
- [ ] AdSense integrated
- [ ] SEO metadata updated
- [ ] Functionality tested
- [ ] Performance optimized
- [ ] Monitoring set up
