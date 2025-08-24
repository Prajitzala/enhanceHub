'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { FileUploader } from '@/components/ui/file-uploader'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Toaster } from '@/components/ui/toaster'
import { useToast } from '@/hooks/use-toast'
import { Download, Wand2, ArrowRight, CheckCircle, Zap, Shield, RefreshCw, Palette, Scissors } from 'lucide-react'
import { trackPhotoRestoration, trackEngagement } from '@/lib/google-ads'
import FaviconIcon from '@/components/ui/favicon'

export default function Home() {
  const [mounted, setMounted] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [restoredImage, setRestoredImage] = useState<string | null>(null)
  const [colorizedImage, setColorizedImage] = useState<string | null>(null)
  const [isColorizing, setIsColorizing] = useState(false)
  const [colorizeProgress, setColorizeProgress] = useState(0)
  const { toast } = useToast()
  const uploadSectionRef = useRef<HTMLDivElement>(null)
  const colorizeSectionRef = useRef<HTMLDivElement>(null)

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
            <div className="w-16 h-16 bg-black rounded-lg flex items-center justify-center">
              <FaviconIcon className="h-8 w-8" />
            </div>
          </div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  const handleFileSelect = (file: File) => {
    setSelectedFile(file)
    setRestoredImage(null)
    setColorizedImage(null)
    trackPhotoRestoration.upload()
  }

  const handleRemoveFile = () => {
    setSelectedFile(null)
    setRestoredImage(null)
    setColorizedImage(null)
  }

  const scrollToUpload = () => {
    uploadSectionRef.current?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    })
    
    trackEngagement.ctaClick('start_restoring_now')
  }

  const scrollToColorize = () => {
    colorizeSectionRef.current?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    })
    
    trackEngagement.ctaClick('start_colorizing_now')
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

  const handleColorize = async () => {
    if (!selectedFile) {
      toast({
        title: "No image selected",
        description: "Please upload a black and white photo to colorize.",
        variant: "destructive",
      })
      return
    }

    trackPhotoRestoration.start()

    setIsColorizing(true)
    setColorizeProgress(0)

    try {
      const formData = new FormData()
      formData.append('image', selectedFile)
      formData.append('model_name', 'Artistic')

      setColorizeProgress(30)

      const response = await fetch('/api/colorize-image', {
        method: 'POST',
        body: formData,
      })

      setColorizeProgress(70)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `Colorization failed: ${response.status}`)
      }

      const result = await response.json()
      
      if (!result.success) {
        throw new Error(result.error || 'Colorization failed')
      }

      setColorizeProgress(100)
      setColorizedImage(result.imageUrl)

      trackPhotoRestoration.complete()

      toast({
        title: "Success!",
        description: "Your photo has been colorized with AI.",
      })

    } catch (error) {
      console.error('Error colorizing image:', error)
      
      let errorMessage = "Failed to colorize image. Please try again."
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
      setIsColorizing(false)
      setColorizeProgress(0)
    }
  }

  const handleDownloadColorized = async () => {
    if (colorizedImage) {
      setIsDownloading(true)
      trackPhotoRestoration.download()

      try {
        // Fetch the image from the URL
        const response = await fetch(colorizedImage)
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
        let filename = 'colorized-photo'
        if (selectedFile) {
          const originalName = selectedFile.name
          const nameWithoutExt = originalName.substring(0, originalName.lastIndexOf('.')) || originalName
          filename = `${nameWithoutExt}-colorized`
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
          description: `Your colorized photo is being downloaded as ${filename}.${fileExtension}`,
        })
        
      } catch (error) {
        console.error('Download failed:', error)
        
        // Fallback to direct link method
        const link = document.createElement('a')
        link.href = colorizedImage
        link.download = 'colorized-photo.png'
        link.target = '_blank'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        
        toast({
          title: "Download Started",
          description: "Your colorized photo download has started.",
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
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <motion.div 
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
                className="w-8 h-8 sm:w-10 sm:h-10 bg-black rounded-lg flex items-center justify-center"
              >
                <FaviconIcon className="h-4 w-4 sm:h-6 sm:w-6" />
              </motion.div>
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-gray-900">
                  AI EnhanceHub
                </h1>
              </div>
            </div>
            <div className="flex items-center">
              <Button 
                onClick={scrollToUpload}
                size="sm" 
                className="bg-gray-100 hover:bg-gray-200 text-black text-sm px-3 py-2 sm:px-4 sm:py-2"
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16 relative z-20">
        {/* Hero Section */}
        <motion.div 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-center mb-8 sm:mb-12 lg:mb-16"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight px-2">
            Professional AI Photo <span className="font-instrument-serif font-bold italic">Restoration</span> & Enhancement
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed mb-6 sm:mb-8 px-4">
            Transform old, damaged photos with AI-powered restoration. Remove scratches, fix tears, colorize black & white photos, and enhance image quality instantly. Professional photo restoration made simple.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-4 lg:space-x-8 text-xs sm:text-sm text-gray-500 px-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-500" />
              <span>No registration required</span>
            </div>
            <div className="flex items-center space-x-2">
              <Zap className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-500" />
              <span>Instant restoration</span>
            </div>
            <div className="flex items-center space-x-2">
              <Shield className="h-3 w-3 sm:h-4 sm:w-4 text-blue-500" />
              <span>Privacy focused</span>
            </div>
          </div>
        </motion.div>

        {/* Main Container */}
        <motion.div 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="bg-gray-50 rounded-2xl sm:rounded-3xl p-4 sm:p-8 lg:p-12"
        >
          {/* Upload Area */}
          <section ref={uploadSectionRef} className="mb-8 sm:mb-12" aria-labelledby="upload-heading">
            <h2 id="upload-heading" className="text-xl sm:text-2xl font-semibold text-gray-900 text-center mb-6 sm:mb-8 px-2">
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
          <div className="text-center mb-6 sm:mb-8">
            <Button
              onClick={handleRestore}
              disabled={!selectedFile || isProcessing}
              size="lg"
              className="bg-black hover:bg-gray-800 text-white px-6 sm:px-8 lg:px-12 py-3 sm:py-4 rounded-xl sm:rounded-2xl text-base sm:text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
            >
              {mounted && isProcessing ? (
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
          {mounted && isProcessing && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-md mx-auto space-y-3 px-4"
            >
              <Progress value={progress} className="h-2 sm:h-3 rounded-full bg-gray-200" />
              <p className="text-xs sm:text-sm text-gray-600 text-center">
                Restoring your photo... {progress}%
              </p>
            </motion.div>
          )}
        </motion.div>

        {/* Results Section */}
        <AnimatePresence>
          {mounted && restoredImage && (
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.6 }}
              className="mt-8 sm:mt-12 lg:mt-16"
            >
              <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-8 sm:mb-12 px-2">
                Your Restored Photo
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
                {/* Original Photo */}
                <motion.div 
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="bg-gray-50 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8"
                >
                  <h4 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6 flex items-center">
                    <Scissors className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                    Original Photo
                  </h4>
                  <div className="rounded-xl sm:rounded-2xl overflow-hidden shadow-lg sm:shadow-2xl">
                    {selectedFile && (
                      <Image
                        src={URL.createObjectURL(selectedFile)}
                        alt="Original photo"
                        width={800}
                        height={600}
                        className="w-full h-auto rounded-lg sm:rounded-xl"
                      />
                    )}
                  </div>
                </motion.div>

                {/* Restored Photo */}
                <motion.div 
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="bg-gray-50 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8"
                >
                  <h4 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6 flex items-center">
                    <RefreshCw className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                    Restored Photo
                  </h4>
                  <div className="relative">
                                      <div className="rounded-xl sm:rounded-2xl overflow-hidden shadow-lg sm:shadow-2xl">
                    {restoredImage && (
                      <Image
                        src={restoredImage}
                        alt="Restored photo"
                        width={800}
                        height={600}
                        className="w-full h-auto rounded-lg sm:rounded-xl"
                      />
                    )}
                  </div>
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4, delay: 0.6 }}
                    >
                      <Button
                        onClick={handleDownload}
                        disabled={isDownloading}
                        className="absolute top-3 right-3 sm:top-6 sm:right-6 bg-white/90 backdrop-blur-sm hover:bg-white text-gray-900 shadow-lg border border-gray-200 disabled:opacity-50 text-xs sm:text-sm px-2 py-1 sm:px-3 sm:py-2"
                      >
                        {mounted && isDownloading ? (
                          <>
                            <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-b-2 border-gray-900 mr-1 sm:mr-2"></div>
                            <span className="hidden sm:inline">Downloading...</span>
                          </>
                        ) : (
                          <>
                            <Download className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                            <span className="hidden sm:inline">Download</span>
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

        {/* Colorization Section */}
        <motion.div 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-8 sm:mt-12 lg:mt-16 bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl sm:rounded-3xl p-4 sm:p-8 lg:p-12 border border-purple-100"
        >
          {/* Colorization Upload Area */}
          <section ref={colorizeSectionRef} className="mb-8 sm:mb-12" aria-labelledby="colorize-heading">
            <h2 id="colorize-heading" className="text-xl sm:text-2xl font-semibold text-gray-900 text-center mb-6 sm:mb-8 px-2">
              Add Colors to Old Images Using AI
            </h2>
            <p className="text-sm sm:text-base text-gray-600 text-center mb-6 sm:mb-8 px-4 max-w-2xl mx-auto">
              Transform black and white photos into vibrant, realistic color images using advanced AI colorization technology.
            </p>
            <FileUploader
              onFileSelect={handleFileSelect}
              selectedFile={selectedFile}
              onRemoveFile={handleRemoveFile}
              className="max-w-2xl mx-auto"
            />
          </section>

          {/* Colorize Button */}
          <div className="text-center mb-6 sm:mb-8">
            <Button
              onClick={handleColorize}
              disabled={!selectedFile || isColorizing}
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 sm:px-8 lg:px-12 py-3 sm:py-4 rounded-xl sm:rounded-2xl text-base sm:text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
            >
              {mounted && isColorizing ? (
                <div className="flex items-center space-x-3">
                  <Palette className="h-5 w-5 animate-spin" />
                  <span>Colorizing your photo...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Palette className="h-5 w-5" />
                  <span>Add Colors to Old Photo with AI</span>
                  <ArrowRight className="h-5 w-5" />
                </div>
              )}
            </Button>
          </div>

          {/* Colorize Progress Bar */}
          {mounted && isColorizing && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-md mx-auto space-y-3 px-4"
            >
              <Progress value={colorizeProgress} className="h-2 sm:h-3 rounded-full bg-gray-200" />
              <p className="text-xs sm:text-sm text-gray-600 text-center">
                Colorizing your photo... {colorizeProgress}%
              </p>
            </motion.div>
          )}
        </motion.div>

        {/* Colorized Results Section */}
        <AnimatePresence>
          {mounted && colorizedImage && (
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.6 }}
              className="mt-8 sm:mt-12 lg:mt-16"
            >
              <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-8 sm:mb-12 px-2">
                Your Colorized Photo
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
                {/* Original Photo */}
                <motion.div 
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="bg-gray-50 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8"
                >
                  <h4 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6 flex items-center">
                    <Scissors className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                    Original Black & White Photo
                  </h4>
                  <div className="rounded-xl sm:rounded-2xl overflow-hidden shadow-lg sm:shadow-2xl">
                    {selectedFile && (
                      <Image
                        src={URL.createObjectURL(selectedFile)}
                        alt="Original black and white photo"
                        width={800}
                        height={600}
                        className="w-full h-auto rounded-lg sm:rounded-xl"
                      />
                    )}
                  </div>
                </motion.div>

                {/* Colorized Photo */}
                <motion.div 
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="bg-gray-50 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8"
                >
                  <h4 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6 flex items-center">
                    <Palette className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                    Colorized Photo
                  </h4>
                  <div className="relative">
                                      <div className="rounded-xl sm:rounded-2xl overflow-hidden shadow-lg sm:shadow-2xl">
                    {colorizedImage && (
                      <Image
                        src={colorizedImage}
                        alt="Colorized photo"
                        width={800}
                        height={600}
                        className="w-full h-auto rounded-lg sm:rounded-xl"
                      />
                    )}
                  </div>
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4, delay: 0.6 }}
                    >
                      <Button
                        onClick={handleDownloadColorized}
                        disabled={isDownloading}
                        className="absolute top-3 right-3 sm:top-6 sm:right-6 bg-white/90 backdrop-blur-sm hover:bg-white text-gray-900 shadow-lg border border-gray-200 disabled:opacity-50 text-xs sm:text-sm px-2 py-1 sm:px-3 sm:py-2"
                      >
                        {mounted && isDownloading ? (
                          <>
                            <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-b-2 border-gray-900 mr-1 sm:mr-2"></div>
                            <span className="hidden sm:inline">Downloading...</span>
                          </>
                        ) : (
                          <>
                            <Download className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                            <span className="hidden sm:inline">Download</span>
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
          className="mt-8 sm:mt-12 lg:mt-16"
        >
          <motion.div 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <h2 id="features-heading" className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-8 sm:mb-12 px-2">
              Advanced AI Photo Enhancement Features
            </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <motion.div 
              whileHover={{ y: -10 }}
              transition={{ duration: 0.3 }}
              className="text-center space-y-3 sm:space-y-4"
            >
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-black rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto">
                <Scissors className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
              </div>
              <h4 className="text-lg sm:text-xl font-semibold text-gray-900">Remove Scratches</h4>
              <p className="text-sm sm:text-base text-gray-600">AI-powered scratch removal that preserves the original photo details while eliminating surface damage.</p>
            </motion.div>
            <motion.div 
              whileHover={{ y: -10 }}
              transition={{ duration: 0.3 }}
              className="text-center space-y-3 sm:space-y-4"
            >
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-black rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto">
                <RefreshCw className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
              </div>
              <h4 className="text-lg sm:text-xl font-semibold text-gray-900">Fix Damage</h4>
              <p className="text-sm sm:text-base text-gray-600">Repair tears, holes, and other physical damage to restore the photo's original appearance.</p>
            </motion.div>
            <motion.div 
              whileHover={{ y: -10 }}
              transition={{ duration: 0.3 }}
              className="text-center space-y-3 sm:space-y-4"
            >
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-black rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto">
                <Palette className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
              </div>
              <h4 className="text-lg sm:text-xl font-semibold text-gray-900">Colorize Photos</h4>
              <p className="text-sm sm:text-base text-gray-600">Bring black and white photos to life with realistic colorization using advanced AI technology.</p>
            </motion.div>
          </div>
        </motion.div>
        </section>



        {/* CTA Section */}
        <motion.div 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-8 sm:mt-12 lg:mt-16 text-center bg-black rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-12 text-white"
        >
          <h3 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4 px-2">Ready to Transform Your Photos?</h3>
          <p className="text-base sm:text-lg lg:text-xl mb-6 sm:mb-8 opacity-90 px-4">Join thousands of users restoring and colorizing their old photos</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                onClick={scrollToUpload}
                size="lg" 
                variant="secondary" 
                className="bg-white text-black hover:bg-gray-100 px-6 sm:px-8 py-2 sm:py-3 rounded-lg sm:rounded-xl font-semibold text-sm sm:text-base w-full sm:w-auto"
              >
                Start Restoring Now
              </Button>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                onClick={scrollToColorize}
                size="lg" 
                variant="secondary" 
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 sm:px-8 py-2 sm:py-3 rounded-lg sm:rounded-xl font-semibold text-sm sm:text-base w-full sm:w-auto"
              >
                Start Colorizing Now
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </main>



      {/* Footer */}
      <footer className="mt-8 sm:mt-12 lg:mt-16 bg-gray-50 border-t border-gray-200 relative z-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-black rounded-lg flex items-center justify-center">
                <FaviconIcon className="h-4 w-4 sm:h-5 sm:w-5" />
              </div>
              <h4 className="text-base sm:text-lg font-bold text-gray-900">
                AI EnhanceHub
              </h4>
            </div>
            <p className="text-gray-600 text-xs sm:text-sm max-w-md mx-auto px-4">
              Restore your precious memories with advanced AI photo restoration technology. Transform old, damaged photos into stunning restored images.
            </p>
          </div>
          <div className="border-t border-gray-200 mt-6 sm:mt-8 pt-6 sm:pt-8 text-center text-gray-600">
            <p className="text-xs sm:text-sm">&copy; 2025 AI EnhanceHub.</p>
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
