'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { FileUploader } from '@/components/ui/file-uploader'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Toaster } from '@/components/ui/toaster'
import { useToast } from '@/hooks/use-toast'
import { Download, Wand2, ArrowRight, CheckCircle, Zap, Shield, RefreshCw, Palette, Scissors, Sparkles } from 'lucide-react'
import { trackPhotoRestoration, trackEngagement } from '@/lib/google-ads'
import FaviconIcon from '@/components/ui/favicon'
import { TextBehindImage } from '@/components/ui/text-behind-image'
import { Footer } from '@/components/ui/footer'


export default function Home() {
  const [mounted, setMounted] = useState(false)
  const [restoreFile, setRestoreFile] = useState<File | null>(null)
  const [colorizeFile, setColorizeFile] = useState<File | null>(null)
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
  const textBehindImageRef = useRef<HTMLDivElement>(null)



  // Handle hydration
  useEffect(() => {
    setMounted(true)
  }, [])



  // Don't render anything until mounted to prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
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

  const handleRestoreFileSelect = (file: File) => {
    setRestoreFile(file)
    setRestoredImage(null)
    trackPhotoRestoration.upload()
  }

  const handleColorizeFileSelect = (file: File) => {
    setColorizeFile(file)
    setColorizedImage(null)
  }

  const handleRemoveRestoreFile = () => {
    setRestoreFile(null)
    setRestoredImage(null)
  }

  const handleRemoveColorizeFile = () => {
    setColorizeFile(null)
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

  const scrollToTextBehindImage = () => {
    textBehindImageRef.current?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    })
    
    trackEngagement.ctaClick('start_text_behind_image')
  }

  const handleRestore = async () => {
    if (!restoreFile) {
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
      formData.append('image', restoreFile)

      setProgress(30)

      const response = await fetch('/api/restore-image', {
        method: 'POST',
        body: formData,
      })

      setProgress(70)

      if (!response.ok) {
        throw new Error('Failed to restore image')
      }

      const blob = await response.blob()
      const imageUrl = URL.createObjectURL(blob)
      setRestoredImage(imageUrl)
      setProgress(100)

      trackPhotoRestoration.complete()
      toast({
        title: "Success!",
        description: "Your photo has been restored successfully.",
      })
    } catch (error) {
      console.error('Restoration error:', error)
      toast({
        title: "Error",
        description: "Failed to restore the image. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleColorize = async () => {
    if (!colorizeFile) {
      toast({
        title: "No image selected",
        description: "Please upload a black and white photo to colorize.",
        variant: "destructive",
      })
      return
    }

    setIsColorizing(true)
    setColorizeProgress(0)

    try {
      const formData = new FormData()
      formData.append('image', colorizeFile)

      setColorizeProgress(30)

      const response = await fetch('/api/colorize-image', {
        method: 'POST',
        body: formData,
      })

      setColorizeProgress(70)

      if (!response.ok) {
        throw new Error('Failed to colorize image')
      }

      const blob = await response.blob()
      const imageUrl = URL.createObjectURL(blob)
      setColorizedImage(imageUrl)
      setColorizeProgress(100)

      toast({
        title: "Success!",
        description: "Your photo has been colorized successfully.",
      })
    } catch (error) {
      console.error('Colorization error:', error)
      toast({
        title: "Error",
        description: "Failed to colorize the image. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsColorizing(false)
    }
  }

  const handleDownload = async () => {
    if (!restoredImage) return

    setIsDownloading(true)
    try {
      const response = await fetch(restoredImage)
        const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'restored-photo.png'
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error('Download error:', error)
    } finally {
      setIsDownloading(false)
    }
  }

  const handleDownloadColorized = async () => {
    if (!colorizedImage) return

    setIsDownloading(true)
    try {
      const response = await fetch(colorizedImage)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'colorized-photo.png'
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      } catch (error) {
      console.error('Download error:', error)
      } finally {
        setIsDownloading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Toaster />
      
      {/* Header */}
      <motion.header 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="border-b border-gray-100 bg-white/80 backdrop-blur-sm sticky top-0 z-50"
      >
        <div className="w-full px-6 py-4">
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
            <div className="flex items-center space-x-4">
              <Button 
                onClick={scrollToUpload}
                size="sm" 
                className="bg-black hover:bg-gray-800 text-white"
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </motion.header>

        {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50"></div>
        
        <div className="relative z-10 text-center w-full px-6">
        <motion.div 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-4xl mx-auto"
          >
            <div className="w-32 h-32 mx-auto mb-8 flex items-center justify-center">
              <div className="w-16 h-16 bg-black rounded-lg flex items-center justify-center">
                <FaviconIcon className="h-8 w-8" />
              </div>
            </div>
            
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              AI-Powered Photo
              <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Transformation
              </span>
          </h1>
            
            <p className="text-xl sm:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Transform old, damaged, and scratched photos into stunning, high-quality images using advanced AI technology
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <Button 
                onClick={scrollToUpload}
                size="lg" 
                className="bg-black text-white hover:bg-gray-800 px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
              >
                <Sparkles className="mr-2 h-5 w-5" />
                Start Restoring Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              
              <Button 
                onClick={scrollToColorize}
                size="lg" 
                variant="outline"
                className="border-2 border-gray-300 hover:border-gray-400 px-8 py-4 text-lg font-semibold rounded-xl bg-white/80 backdrop-blur-sm"
              >
                <Palette className="mr-2 h-5 w-5" />
                Colorize Photos
              </Button>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-8 text-sm text-gray-500">
            <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
              <span>No registration required</span>
            </div>
            <div className="flex items-center space-x-2">
                <Zap className="h-4 w-4 text-yellow-500" />
                <span>Instant processing</span>
            </div>
            <div className="flex items-center space-x-2">
                <Shield className="h-4 w-4 text-blue-500" />
              <span>Privacy focused</span>
            </div>
          </div>
        </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <main className="w-full px-6 py-16">
        {/* Photo Restoration Section */}
        <section ref={uploadSectionRef} className="max-w-6xl mx-auto mb-20">
        <motion.div 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
            className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100"
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Photo Restoration with AI
            </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Upload your old, damaged, or scratched photos and watch our AI transform them into stunning, high-quality images
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Left Side - Upload */}
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                    <Wand2 className="h-5 w-5 mr-2 text-blue-600" />
                    Upload Your Photo
                  </h3>
                  
            <FileUploader
                    onFileSelect={handleRestoreFileSelect}
                    selectedFile={restoreFile}
                    onRemoveFile={handleRemoveRestoreFile}
                    className="w-full"
                  />
                  
                  {restoreFile && (
                    <div className="mt-6">
            <Button
              onClick={handleRestore}
                        disabled={isProcessing}
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 font-semibold rounded-xl shadow-lg"
                      >
                        {isProcessing ? (
                          <>
                            <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                            Restoring...
                          </>
                        ) : (
                          <>
                            <Wand2 className="h-5 w-5 mr-2" />
                            Restore Photo with AI
                          </>
              )}
            </Button>
                      
                      {isProcessing && (
                        <div className="mt-4">
                          <div className="flex justify-between text-sm text-gray-600 mb-2">
                            <span>Processing...</span>
                            <span>{Math.round(progress)}%</span>
                          </div>
                          <Progress value={progress} className="w-full" />
                        </div>
                      )}
                    </div>
                    )}
                  </div>
              </div>

              {/* Right Side - Results */}
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                    <Download className="h-5 w-5 mr-2 text-green-600" />
                    Restored Results
                  </h3>
                  
                  <AnimatePresence mode="wait">
                    {restoredImage ? (
                <motion.div 
                        key="restored-result"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-4"
                      >
                  <div className="relative">
                      <Image
                        src={restoredImage}
                        alt="Restored photo"
                            width={600}
                            height={400}
                            className="w-full h-auto rounded-xl shadow-lg"
                          />
                  </div>
                        
                      <Button
                        onClick={handleDownload}
                        disabled={isDownloading}
                          className="w-full bg-green-600 hover:bg-green-700 text-white py-3 font-semibold rounded-xl"
                      >
                          {isDownloading ? (
                          <>
                              <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                              Downloading...
                          </>
                        ) : (
                          <>
                              <Download className="h-5 w-5 mr-2" />
                              Download Restored Image
                          </>
                        )}
                      </Button>
                    </motion.div>
                    ) : (
                      <motion.div
                        key="restored-placeholder"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-center py-12"
                      >
                        <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Wand2 className="h-12 w-12 text-gray-400" />
                  </div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-2">Upload a Photo</h4>
                        <p className="text-gray-600">Your restored result will appear here</p>
            </motion.div>
          )}
        </AnimatePresence>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Photo Colorization Section */}
        <section ref={colorizeSectionRef} className="max-w-6xl mx-auto mb-20">
        <motion.div 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
            className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-3xl p-8 shadow-xl border border-purple-100"
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Photo Colorization with AI
            </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Transform black and white photos into vibrant, realistic color images using advanced AI colorization technology
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Left Side - Upload and Processing */}
              <div className="space-y-6">
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                    <Palette className="h-5 w-5 mr-2 text-purple-600" />
                    Upload Your Black & White Photo
                  </h3>
                  
            <FileUploader
                    onFileSelect={handleColorizeFileSelect}
                    selectedFile={colorizeFile}
                    onRemoveFile={handleRemoveColorizeFile}
                    className="w-full"
                  />
                  
                  {colorizeFile && (
                    <div className="mt-6">
            <Button
              onClick={handleColorize}
                        disabled={isColorizing}
                        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-3 font-semibold rounded-xl shadow-lg"
                      >
                        {isColorizing ? (
                          <>
                            <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                            Colorizing...
                          </>
                        ) : (
                          <>
                            <Palette className="h-5 w-5 mr-2" />
                            Colorize Photo with AI
                          </>
              )}
            </Button>
                      
                      {isColorizing && (
                        <div className="mt-4">
                          <div className="flex justify-between text-sm text-gray-600 mb-2">
                            <span>Processing...</span>
                            <span>{Math.round(colorizeProgress)}%</span>
                          </div>
                          <Progress value={colorizeProgress} className="w-full" />
                        </div>
                      )}
                    </div>
                    )}
                  </div>
              </div>

              {/* Right Side - Results */}
              <div className="space-y-6">
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                    <Download className="h-5 w-5 mr-2 text-green-600" />
                    Colorized Results
                  </h3>
                  
                  <AnimatePresence mode="wait">
                    {colorizedImage ? (
                <motion.div 
                        key="colorized-result"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-4"
                      >
                  <div className="relative">
                      <Image
                        src={colorizedImage}
                        alt="Colorized photo"
                            width={600}
                            height={400}
                            className="w-full h-auto rounded-xl shadow-lg"
                          />
                  </div>
                        
                      <Button
                        onClick={handleDownloadColorized}
                        disabled={isDownloading}
                          className="w-full bg-green-600 hover:bg-green-700 text-white py-3 font-semibold rounded-xl"
                      >
                          {isDownloading ? (
                          <>
                              <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                              Downloading...
                          </>
                        ) : (
                          <>
                              <Download className="h-5 w-5 mr-2" />
                              Download Colorized Image
                          </>
                        )}
                      </Button>
                    </motion.div>
                    ) : (
                      <motion.div
                        key="colorized-placeholder"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-center py-12"
                      >
                        <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Palette className="h-12 w-12 text-gray-400" />
                  </div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-2">Upload a Photo</h4>
                        <p className="text-gray-600">Your colorized result will appear here</p>
            </motion.div>
          )}
        </AnimatePresence>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Text Behind Image Section */}
        <div ref={textBehindImageRef}>
          <TextBehindImage />
        </div>

        {/* Features Section */}
        <section className="max-w-6xl mx-auto mb-20">
          <motion.div 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 text-center mb-12">
              Advanced AI Photo Enhancement Features
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <motion.div 
              whileHover={{ y: -10 }}
              transition={{ duration: 0.3 }}
                className="text-center space-y-4 bg-white rounded-2xl p-8 shadow-xl border border-gray-100"
            >
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto">
                  <Scissors className="h-8 w-8 text-blue-600" />
              </div>
                <h4 className="text-xl font-semibold text-gray-900">Remove Scratches</h4>
                <p className="text-gray-600">AI-powered scratch removal that preserves the original photo details while eliminating surface damage.</p>
            </motion.div>
              
            <motion.div 
              whileHover={{ y: -10 }}
              transition={{ duration: 0.3 }}
                className="text-center space-y-4 bg-white rounded-2xl p-8 shadow-xl border border-gray-100"
            >
                <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto">
                  <RefreshCw className="h-8 w-8 text-green-600" />
              </div>
                <h4 className="text-xl font-semibold text-gray-900">Fix Damage</h4>
                <p className="text-gray-600">Repair tears, holes, and other physical damage to restore the photo's original appearance.</p>
            </motion.div>
              
            <motion.div 
              whileHover={{ y: -10 }}
              transition={{ duration: 0.3 }}
                className="text-center space-y-4 bg-white rounded-2xl p-8 shadow-xl border border-gray-100"
            >
                <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto">
                  <Palette className="h-8 w-8 text-purple-600" />
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
          className="max-w-4xl mx-auto text-center bg-black rounded-3xl p-12 text-white"
        >
          <h3 className="text-3xl sm:text-4xl font-bold mb-4">Ready to Transform Your Photos?</h3>
          <p className="text-xl mb-8 opacity-90">Join thousands of users restoring and colorizing their old photos</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                onClick={scrollToUpload}
                size="lg" 
                variant="secondary" 
                className="bg-white text-black hover:bg-gray-100 px-8 py-4 rounded-xl font-semibold text-lg"
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
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 rounded-xl font-semibold text-lg"
              >
                Start Colorizing Now
              </Button>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                onClick={scrollToTextBehindImage}
                size="lg" 
                variant="secondary" 
                className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white px-8 py-4 rounded-xl font-semibold text-lg"
              >
                Try Text Behind Image
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  )
}
