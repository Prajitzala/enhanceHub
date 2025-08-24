# Google AdSense Integration Guide

## Overview
This project includes a complete Google AdSense integration with a reusable `AdBanner` component and strategic ad placements throughout the website.

## Components

### AdBanner Component
Located at: `src/components/ui/ad-banner.tsx`

A reusable React component that renders Google AdSense ad units with proper initialization.

#### Props
- `adSlot` (required): Your AdSense ad slot ID
- `adFormat` (optional): 'auto' | 'fluid' (default: 'auto')
- `width` (optional): Ad width in pixels
- `height` (optional): Ad height in pixels
- `fullWidthResponsive` (optional): Enable full-width responsive ads (default: false)
- `className` (optional): Additional CSS classes
- `style` (optional): Additional inline styles

#### Usage Examples

```tsx
import AdBanner from '@/components/ui/ad-banner'

// Basic responsive banner
<AdBanner 
  adSlot="1234567890"
  adFormat="auto"
  fullWidthResponsive={true}
/>

// Fixed size banner
<AdBanner 
  adSlot="2345678901"
  width={728}
  height={90}
/>

// Sidebar ad
<AdBanner 
  adSlot="3456789012"
  width={300}
  height={600}
/>
```

## Current Ad Placements

### Sticky Bottom Ad Bar
- **Location**: Fixed at bottom of screen
- **Ad Slot**: `5678901234`
- **Format**: Responsive banner
- **Visibility**: All devices
- **Features**: Closeable with X button, smooth animations

## Setup Instructions

### 1. Update Ad Slot IDs
Replace the placeholder ad slot IDs with your actual AdSense ad slot IDs:

```tsx
// In src/app/page.tsx, update these values:
adSlot="5678901234"  // Replace with your actual ad slot ID
```

### 2. Verify Client ID
The client ID is already set to: `ca-pub-1159282031048772`

### 3. Create Ad Units in AdSense
1. Go to your Google AdSense dashboard
2. Navigate to "Ads" → "By ad unit"
3. Create the following ad units:
   - **Sticky Bottom Bar**: Responsive display ad

### 4. Replace Ad Slot IDs
Copy the ad slot IDs from your AdSense dashboard and replace the placeholder values in the code.

## Best Practices

### 1. Ad Placement
- Ads are strategically placed to maximize visibility without disrupting user experience
- Sidebar ads are desktop-only to maintain mobile usability
- Ads are positioned between content sections, not interrupting the main workflow

### 2. Performance
- AdSense script loads asynchronously
- Ads are initialized only after component mount to prevent hydration errors
- Responsive ads automatically adjust to screen size

### 3. User Experience
- Ads don't interfere with the photo restoration workflow
- Loading states are handled gracefully
- Mobile-first responsive design

## Testing

### 1. Development Testing
- Use AdSense's test mode during development
- Check browser console for any AdSense-related errors
- Verify ads load correctly on different screen sizes

### 2. Production Testing
- Ensure your domain is approved in AdSense
- Wait for AdSense to crawl and approve your site
- Monitor ad performance in AdSense dashboard

## Troubleshooting

### Common Issues

1. **Ads not showing**: Check if your domain is approved in AdSense
2. **Hydration errors**: Ensure ads only initialize on client-side
3. **Layout shifts**: Use fixed dimensions for sidebar ads
4. **Mobile issues**: Test responsive ads on various devices

### Debug Steps

1. Check browser console for errors
2. Verify AdSense script is loading
3. Confirm ad slot IDs are correct
4. Test with AdSense's test mode

## Revenue Optimization

### 1. Ad Placement Strategy
- Sticky bottom bar: Persistent visibility, especially effective on mobile, non-intrusive placement

### 2. Performance Monitoring
- Track CTR (Click-Through Rate) for each ad placement
- Monitor RPM (Revenue Per Mille) by ad unit
- A/B test different ad formats and positions

### 3. User Experience Balance
- Don't overload the page with ads
- Maintain fast loading times
- Ensure ads don't interfere with core functionality
