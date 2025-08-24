'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { FileUploader } from '@/components/ui/file-uploader'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Toaster } from '@/components/ui/toaster'
import { useToast } from '@/hooks/use-toast'
import { Download, Wand2, ArrowRight, CheckCircle, Zap, Shield, RefreshCw, Palette, Scissors, X } from 'lucide-react'
import { trackPhotoRestoration, trackEngagement } from '@/lib/google-ads'
import FaviconIcon from '@/components/ui/favicon'
import dynamic from 'next/dynamic'

const AdBanner = dynamic(() => import('@/components/ui/ad-banner'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-12 bg-gray-100 rounded flex items-center justify-center">
      <div className="text-gray-500 text-sm">Loading ad...</div>
    </div>
  )
})

export default function Home() {
  const [mounted, setMounted] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [restoredImage, setRestoredImage] = useState<string | null>(null)
  const [showStickyAd, setShowStickyAd] = useState(true)
  const { toast } = useToast()
  const uploadSectionRef = useRef<HTMLDivElement>(null)

  // Handle hydration
  useEffect(() => {
    setMounted(true)
  }, [])

  // Don't render anything until mounted to prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center relative overflow-hidden">
        {/* Grid overlay background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="grid-overlay"></div>
        </div>
        <div className="text-center relative z-10">
          <div className="w-32 h-32 mx-auto mb-4 flex items-center justify-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 bg-black rounded-lg flex items-center justify-center"
            >
              <FaviconIcon className="h-8 w-8" />
            </motion.div>
          </div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  const handleFileSelect = (file: File) => {
    setSelectedFile(file)
    setRestoredImage(null)
    trackPhotoRestoration.upload()
  }

  const handleRemoveFile = () => {
    setSelectedFile(null)
    setRestoredImage(null)
  }

  const scrollToUpload = () => {
    uploadSectionRef.current?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    })
    
    trackEngagement.ctaClick('start_restoring_now')
  }

  const handleRestore = async () => {
    if (!selectedFile) {
      toast({
        title: "No image selected",
        description: "Please upload an old, damaged, or scratched photo to restore.",
        variant: "destructive",
      })
      return
    }

    trackPhotoRestoration.start()

    setIsProcessing(true)
    setProgress(0)

    try {
      const formData = new FormData()
      formData.append('image', selectedFile)

      setProgress(30)

      const response = await fetch('/api/restore-image', {
        method: 'POST',
        body: formData,
      })

      setProgress(70)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `Restoration failed: ${response.status}`)
      }

      const result = await response.json()
      
      if (!result.success) {
        throw new Error(result.error || 'Restoration failed')
      }

      setProgress(100)
      setRestoredImage(result.imageUrl)

      trackPhotoRestoration.complete()

      toast({
        title: "Success!",
        description: "Your photo has been restored and enhanced with AI.",
      })

    } catch (error) {
      console.error('Error restoring image:', error)
      
      let errorMessage = "Failed to restore image. Please try again."
      let errorType = "general_error"
      
      if (error instanceof Error) {
        if (error.message.includes('REPLICATE_API_TOKEN_MISSING')) {
          errorMessage = "Replicate API token is missing. Please create a .env.local file with your REPLICATE_API_TOKEN."
          errorType = "api_token_missing"
        } else if (error.message.includes('REPLICATE_API_TOKEN')) {
          errorMessage = "AI processing is not configured. Please set up your API key."
          errorType = "api_not_configured"
        } else if (error.message.includes('HTTP 503')) {
          errorMessage = "AI service is temporarily unavailable. Please try again later."
          errorType = "service_unavailable"
        } else if (error.message.includes('HTTP 400')) {
          errorMessage = "Invalid file. Please check your image."
          errorType = "invalid_file"
        } else {
          errorMessage = error.message
          errorType = "unknown_error"
        }
      }

      trackPhotoRestoration.error(errorType)

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
      setProgress(0)
    }
  }

  const handleDownload = async () => {
    if (restoredImage) {
      setIsDownloading(true)
      trackPhotoRestoration.download()

      try {
        // Fetch the image from the URL
        const response = await fetch(restoredImage)
        const blob = await response.blob()
        
        // Create a blob URL
        const blobUrl = window.URL.createObjectURL(blob)
        
        // Determine file extension based on content type
        let fileExtension = 'png' // default
        if (blob.type === 'image/jpeg' || blob.type === 'image/jpg') {
          fileExtension = 'jpg'
        } else if (blob.type === 'image/webp') {
          fileExtension = 'webp'
        }
        
        // Create filename with original file name if available
        let filename = 'restored-photo'
        if (selectedFile) {
          const originalName = selectedFile.name
          const nameWithoutExt = originalName.substring(0, originalName.lastIndexOf('.')) || originalName
          filename = `${nameWithoutExt}-restored`
        }
        
        // Create download link
        const link = document.createElement('a')
        link.href = blobUrl
        link.download = `${filename}.${fileExtension}`
        link.style.display = 'none'
        
        // Trigger download
        document.body.appendChild(link)
        link.click()
        
        // Cleanup
        document.body.removeChild(link)
        window.URL.revokeObjectURL(blobUrl)
        
        // Show success message
        toast({
          title: "Download Started",
          description: `Your restored photo is being downloaded as ${filename}.${fileExtension}`,
        })
        
      } catch (error) {
        console.error('Download failed:', error)
        
        // Fallback to direct link method
        const link = document.createElement('a')
        link.href = restoredImage
        link.download = 'restored-photo.png'
        link.target = '_blank'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        
        toast({
          title: "Download Started",
          description: "Your restored photo download has started.",
        })
      } finally {
        setIsDownloading(false)
      }
    }
  }

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Grid overlay background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="grid-overlay"></div>
      </div>
      
      <Toaster />
      
      {/* Header */}
      <motion.header 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="border-b border-gray-100 relative z-20"
      >
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <motion.div 
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
                className="w-10 h-10 bg-black rounded-lg flex items-center justify-center"
              >
                <FaviconIcon className="h-6 w-6" />
              </motion.div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  AI EnhanceHub
                </h1>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <Button 
                onClick={scrollToUpload}
                size="sm" 
                className="bg-gray-100 hover:bg-gray-200 text-black"
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-16 relative z-20">
        {/* Hero Section */}
        <motion.div 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Professional AI Photo <span className="font-instrument-serif font-bold italic">Restoration</span> & Enhancement
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed mb-8">
            Transform old, damaged photos with AI-powered restoration. Remove scratches, fix tears, colorize black & white photos, and enhance image quality instantly. Professional photo restoration made simple.
          </p>
          <div className="flex items-center justify-center space-x-8 text-sm text-gray-500">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>No registration required</span>
            </div>
            <div className="flex items-center space-x-2">
              <Zap className="h-4 w-4 text-yellow-500" />
              <span>Instant restoration</span>
            </div>
            <div className="flex items-center space-x-2">
              <Shield className="h-4 w-4 text-blue-500" />
              <span>Privacy focused</span>
            </div>
          </div>
        </motion.div>

        {/* Main Container */}
        <motion.div 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="bg-gray-50 rounded-3xl p-12"
        >
          {/* Upload Area */}
          <section ref={uploadSectionRef} className="mb-12" aria-labelledby="upload-heading">
            <h2 id="upload-heading" className="text-2xl font-semibold text-gray-900 text-center mb-8">
              Upload Your Old Photo for AI Restoration
            </h2>
            <FileUploader
              onFileSelect={handleFileSelect}
              selectedFile={selectedFile}
              onRemoveFile={handleRemoveFile}
              className="max-w-2xl mx-auto"
            />
          </section>

          {/* Process Button */}
          <div className="text-center mb-8">
            <Button
              onClick={handleRestore}
              disabled={!selectedFile || isProcessing}
              size="lg"
              className="bg-black hover:bg-gray-800 text-white px-12 py-4 rounded-2xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <div className="flex items-center space-x-3">
                  <Wand2 className="h-5 w-5 animate-spin" />
                  <span>Restoring your photo...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Wand2 className="h-5 w-5" />
                  <span>Restore Photo with AI</span>
                  <ArrowRight className="h-5 w-5" />
                </div>
              )}
            </Button>
          </div>



          {/* Progress Bar */}
          {isProcessing && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-md mx-auto space-y-3"
            >
              <Progress value={progress} className="h-3 rounded-full bg-gray-200" />
              <p className="text-sm text-gray-600 text-center">
                Restoring your photo... {progress}%
              </p>
            </motion.div>
          )}
        </motion.div>

        {/* Results Section */}
        <AnimatePresence>
          {restoredImage && (
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.6 }}
              className="mt-16"
            >
              <h3 className="text-3xl font-bold text-gray-900 text-center mb-12">
                Your Restored Photo
              </h3>
              <div className="grid lg:grid-cols-2 gap-8">
                {/* Original Photo */}
                <motion.div 
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="bg-gray-50 rounded-3xl p-8"
                >
                  <h4 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                    <Scissors className="h-5 w-5 mr-2" />
                    Original Photo
                  </h4>
                  <div className="rounded-2xl overflow-hidden shadow-2xl">
                    <Image
                      src={selectedFile ? URL.createObjectURL(selectedFile) : ''}
                      alt="Original photo"
                      width={800}
                      height={600}
                      className="w-full h-auto rounded-xl"
                    />
                  </div>
                </motion.div>

                {/* Restored Photo */}
                <motion.div 
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="bg-gray-50 rounded-3xl p-8"
                >
                  <h4 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                    <RefreshCw className="h-5 w-5 mr-2" />
                    Restored Photo
                  </h4>
                  <div className="relative">
                    <div className="rounded-2xl overflow-hidden shadow-2xl">
                      <Image
                        src={restoredImage}
                        alt="Restored photo"
                        width={800}
                        height={600}
                        className="w-full h-auto rounded-xl"
                      />
                    </div>
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4, delay: 0.6 }}
                    >
                      <Button
                        onClick={handleDownload}
                        disabled={isDownloading}
                        className="absolute top-6 right-6 bg-white/90 backdrop-blur-sm hover:bg-white text-gray-900 shadow-lg border border-gray-200 disabled:opacity-50"
                      >
                        {isDownloading ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900 mr-2"></div>
                            Downloading...
                          </>
                        ) : (
                          <>
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </>
                        )}
                      </Button>
                    </motion.div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Features Section */}
        <section 
          aria-labelledby="features-heading"
          className="mt-16"
        >
          <motion.div 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <h2 id="features-heading" className="text-3xl font-bold text-gray-900 text-center mb-12">
              Advanced AI Photo Enhancement Features
            </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div 
              whileHover={{ y: -10 }}
              transition={{ duration: 0.3 }}
              className="text-center space-y-4"
            >
              <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center mx-auto">
                <Scissors className="h-8 w-8 text-white" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900">Remove Scratches</h4>
              <p className="text-gray-600">AI-powered scratch removal that preserves the original photo details while eliminating surface damage.</p>
            </motion.div>
            <motion.div 
              whileHover={{ y: -10 }}
              transition={{ duration: 0.3 }}
              className="text-center space-y-4"
            >
              <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center mx-auto">
                <RefreshCw className="h-8 w-8 text-white" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900">Fix Damage</h4>
              <p className="text-gray-600">Repair tears, holes, and other physical damage to restore the photo's original appearance.</p>
            </motion.div>
            <motion.div 
              whileHover={{ y: -10 }}
              transition={{ duration: 0.3 }}
              className="text-center space-y-4"
            >
              <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center mx-auto">
                <Palette className="h-8 w-8 text-white" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900">Colorize Photos</h4>
              <p className="text-gray-600">Bring black and white photos to life with realistic colorization using advanced AI technology.</p>
            </motion.div>
          </div>
        </motion.div>
        </section>



        {/* CTA Section */}
        <motion.div 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-16 text-center bg-black rounded-3xl p-12 text-white"
        >
          <h3 className="text-3xl font-bold mb-4">Ready to Restore Your Memories?</h3>
          <p className="text-xl mb-8 opacity-90">Join thousands of users bringing their old photos back to life</p>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button 
              onClick={scrollToUpload}
              size="lg" 
              variant="secondary" 
              className="bg-white text-black hover:bg-gray-100 px-8 py-3 rounded-xl font-semibold"
            >
              Start Restoring Now
            </Button>
          </motion.div>
        </motion.div>
      </main>

      {/* Sticky Bottom Ad Bar */}
      {showStickyAd && (
        <motion.div 
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          exit={{ y: 100 }}
          className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50"
        >
          <div className="max-w-6xl mx-auto px-4 py-2 relative">
            <button
              onClick={() => setShowStickyAd(false)}
              className="absolute top-2 right-2 p-1 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Close ad"
            >
              <X className="h-4 w-4 text-gray-500" />
            </button>
            <AdBanner 
              adSlot="5678901234"
              adFormat="auto"
              fullWidthResponsive={true}
              className="w-full"
              style={{ minHeight: '50px' }}
            />
          </div>
        </motion.div>
      )}

      {/* Footer */}
      <footer className="mt-16 bg-gray-50 border-t border-gray-200 relative z-20 pb-20">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                <FaviconIcon className="h-5 w-5" />
              </div>
              <h4 className="text-lg font-bold text-gray-900">
                AI EnhanceHub
              </h4>
            </div>
            <p className="text-gray-600 text-sm max-w-md mx-auto">
              Restore your precious memories with advanced AI photo restoration technology. Transform old, damaged photos into stunning restored images.
            </p>
          </div>
          <div className="border-t border-gray-200 mt-8 pt-8 text-center text-gray-600">
            <p>&copy; 2025 AI EnhanceHub.</p>
          </div>
        </div>
      </footer>

      {/* Grid Overlay CSS */}
      <style jsx global>{`
        .grid-overlay {
          background-image: 
            linear-gradient(rgba(0,0,0,0.12) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,0,0,0.12) 1px, transparent 1px);
          background-size: 30px 30px;
          width: 100%;
          height: 100%;
          position: absolute;
          top: 0;
          left: 0;
          pointer-events: none;
          z-index: 1;
        }
        
        .grid-overlay::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-image: 
            linear-gradient(rgba(0,0,0,0.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,0,0,0.06) 1px, transparent 1px);
          background-size: 10px 10px;
          pointer-events: none;
        }
      `}</style>
    </div>
  )
}
