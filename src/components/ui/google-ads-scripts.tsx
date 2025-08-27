'use client'

import { useEffect } from 'react'

export function GoogleAdsScripts() {
  useEffect(() => {
    // Google AdSense Auto Ads
    const adsenseScript = document.createElement('script')
    adsenseScript.async = true
    adsenseScript.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1159282031048772'
    adsenseScript.crossOrigin = 'anonymous'
    document.head.appendChild(adsenseScript)

    // Google Ads Global Site Tag
    const gtagScript = document.createElement('script')
    gtagScript.async = true
    gtagScript.src = 'https://www.googletagmanager.com/gtag/js?id=AW-CONVERSION_ID'
    document.head.appendChild(gtagScript)

    // Initialize gtag
    const initScript = document.createElement('script')
    initScript.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'AW-CONVERSION_ID');
      
      // Google Ads Remarketing Tag
      gtag('config', 'AW-CONVERSION_ID', {
        'allow_enhanced_conversions': true
      });
    `
    document.head.appendChild(initScript)

    // AdSense initialization
    const adsenseInitScript = document.createElement('script')
    adsenseInitScript.innerHTML = '(adsbygoogle = window.adsbygoogle || []).push({});'
    document.head.appendChild(adsenseInitScript)

    // Cleanup function
    return () => {
      // Remove scripts on cleanup if needed
      document.head.removeChild(adsenseScript)
      document.head.removeChild(gtagScript)
      document.head.removeChild(initScript)
      document.head.removeChild(adsenseInitScript)
    }
  }, [])

  return null
}
