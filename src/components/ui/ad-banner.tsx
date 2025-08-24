'use client'

import React, { useEffect, useRef, useState } from 'react'

interface AdBannerProps {
  adSlot: string
  adFormat?: 'auto' | 'fluid'
  style?: React.CSSProperties
  className?: string
  width?: number
  height?: number
  fullWidthResponsive?: boolean
}

declare global {
  interface Window {
    adsbygoogle: any[]
  }
}

export const AdBanner: React.FC<AdBannerProps> = ({
  adSlot,
  adFormat = 'auto',
  style,
  className = '',
  width,
  height,
  fullWidthResponsive = false
}) => {
  const adRef = useRef<HTMLElement>(null)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    // Only initialize ads on client side and after component is mounted
    if (isClient && typeof window !== 'undefined' && window.adsbygoogle) {
      try {
        window.adsbygoogle = window.adsbygoogle || []
        window.adsbygoogle.push({})
      } catch (error) {
        console.warn('AdSense initialization error:', error)
      }
    }
  }, [isClient, adSlot])

  const adStyle: React.CSSProperties = {
    display: 'block',
    textAlign: 'center',
    ...style
  }

  const insProps: any = {
    className: `adsbygoogle ${className}`,
    style: adStyle,
    'data-ad-client': 'ca-pub-1159282031048772',
    'data-ad-slot': adSlot,
    'data-ad-format': adFormat,
    'data-full-width-responsive': fullWidthResponsive
  }

  // Add width and height if specified
  if (width) insProps['data-ad-width'] = width
  if (height) insProps['data-ad-height'] = height

  // Don't render the ad until client-side
  if (!isClient) {
    return (
      <div className="ad-banner-container">
        <div 
          className={`adsbygoogle ${className}`}
          style={{ ...adStyle, minHeight: '50px', backgroundColor: '#f5f5f5' }}
        >
          <div style={{ padding: '10px', textAlign: 'center', color: '#666' }}>
            Loading ad...
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="ad-banner-container">
      <ins
        ref={adRef}
        {...insProps}
      />
    </div>
  )
}

export default AdBanner
