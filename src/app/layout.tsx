import type { Metadata } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import "./globals.css";

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: ["400"],
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI EnhanceHub - Professional Photo Restoration & Enhancement",
  description: "Transform old, damaged photos with AI-powered restoration. Remove scratches, fix tears, colorize black & white photos, and enhance image quality instantly. Professional photo restoration made simple.",
  keywords: [
    "AI photo restoration",
    "photo enhancement",
    "image restoration",
    "remove scratches from photos",
    "fix damaged photos",
    "photo colorization",
    "AI image enhancement",
    "restore old photos",
    "photo repair",
    "vintage photo restoration",
    "black and white photo colorization",
    "professional photo restoration",
    "AI photo editor",
    "photo restoration online",
    "enhance photo quality"
  ],
  authors: [{ name: "AI EnhanceHub" }],
  creator: "AI EnhanceHub",
  publisher: "AI EnhanceHub",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: "AI EnhanceHub - Professional Photo Restoration & Enhancement",
    description: "Transform old, damaged photos with AI-powered restoration. Remove scratches, fix tears, colorize black & white photos, and enhance image quality instantly.",
    type: "website",
    locale: "en_US",
    siteName: "AI EnhanceHub",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "AI EnhanceHub - Professional Photo Restoration",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI EnhanceHub - Professional Photo Restoration & Enhancement",
    description: "Transform old, damaged photos with AI-powered restoration. Remove scratches, fix tears, colorize black & white photos, and enhance image quality instantly.",
    images: ["/og-image.jpg"],
  },
  alternates: {
    canonical: "https://aienhancehub.com",
  },
  verification: {
    google: "your-google-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Favicon */}
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        
        {/* Google AdSense Auto Ads */}
        <script 
          async 
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1159282031048772"
          crossOrigin="anonymous"
        />
        <script>
          (adsbygoogle = window.adsbygoogle || []).push({});
        </script>
        
        {/* Google Ads Global Site Tag */}
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=AW-CONVERSION_ID"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'AW-CONVERSION_ID');
            `,
          }}
        />
        
        {/* Google Ads Remarketing Tag */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              gtag('config', 'AW-CONVERSION_ID', {
                'allow_enhanced_conversions': true
              });
            `,
          }}
        />
        
        {/* Structured Data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "AI EnhanceHub",
              "description": "Professional AI-powered photo restoration and enhancement tool. Remove scratches, fix damaged photos, colorize black and white images, and enhance photo quality instantly.",
              "url": "https://aienhancehub.com",
              "applicationCategory": "PhotoEditorApplication",
              "operatingSystem": "Web Browser",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD",
                "description": "Free photo restoration with AI"
              },
              "featureList": [
                "AI Photo Restoration",
                "Scratch Removal",
                "Photo Colorization",
                "Damage Repair",
                "Image Enhancement"
              ],
              "author": {
                "@type": "Organization",
                "name": "AI EnhanceHub"
              },
              "publisher": {
                "@type": "Organization",
                "name": "AI EnhanceHub",
                "logo": {
                  "@type": "ImageObject",
                  "url": "https://aienhancehub.com/logo.png"
                }
              }
            })
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable} antialiased`}
        suppressHydrationWarning={true}
      >
        {children}
      </body>
    </html>
  );
}
