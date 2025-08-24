// Google Ads Configuration and Tracking Functions

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

// Google Ads Conversion ID - Replace with your actual conversion ID
export const GOOGLE_ADS_CONVERSION_ID = 'AW-CONVERSION_ID';

// Google Ads Conversion Labels - Replace with your actual conversion labels
export const GOOGLE_ADS_CONVERSION_LABELS = {
  PHOTO_RESTORATION: 'CONVERSION_LABEL',
  DOWNLOAD: 'DOWNLOAD_CONVERSION_LABEL',
  SIGNUP: 'SIGNUP_CONVERSION_LABEL',
};

// Track page view
export const trackPageView = (page: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GOOGLE_ADS_CONVERSION_ID, {
      page_title: page,
      page_location: window.location.href,
    });
  }
};

// Track conversion
export const trackConversion = (conversionLabel: string, value?: number) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'conversion', {
      'send_to': `${GOOGLE_ADS_CONVERSION_ID}/${conversionLabel}`,
      'value': value || 1.0,
      'currency': 'USD',
    });
  }
};

// Track custom event
export const trackEvent = (action: string, category: string, label?: string, value?: number) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      'event_category': category,
      'event_label': label,
      'value': value,
    });
  }
};

// Track photo restoration events
export const trackPhotoRestoration = {
  upload: () => trackEvent('file_upload', 'photo_restoration', 'photo_uploaded'),
  start: () => trackEvent('restoration_start', 'photo_restoration', 'restoration_initiated'),
  complete: () => trackEvent('restoration_complete', 'photo_restoration', 'successful_restoration'),
  download: () => trackEvent('download', 'photo_restoration', 'download_restored_photo'),
  error: (errorType: string) => trackEvent('restoration_error', 'photo_restoration', errorType),
};

// Track engagement events
export const trackEngagement = {
  ctaClick: (ctaType: string) => trackEvent('cta_click', 'engagement', ctaType),
  scrollToUpload: () => trackEvent('scroll_to_upload', 'engagement', 'scroll_action'),
  featureView: (feature: string) => trackEvent('feature_view', 'engagement', feature),
};

// Enhanced conversion tracking
export const trackEnhancedConversion = (email?: string, phone?: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    const enhancedData: any = {};
    
    if (email) {
      enhancedData.email = email;
    }
    
    if (phone) {
      enhancedData.phone_number = phone;
    }
    
    window.gtag('config', GOOGLE_ADS_CONVERSION_ID, {
      'allow_enhanced_conversions': true,
      ...enhancedData,
    });
  }
};

// Remarketing list tracking
export const trackRemarketing = (listId: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'remarketing', {
      'google_ads_remarketing_id': listId,
    });
  }
};
