'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { Button } from './button'
import { Input } from './input'
import { removeBackground } from '@imgly/background-removal'
import { 
  Type, 
  RotateCw, 
  Download, 
  Plus, 
  Trash2, 
  Eye,
  EyeOff,
  Layers,
  Move,
  Settings,
  Image as ImageIcon,
  Copy,
  Palette,
  Bold,
  Italic,
  AlignLeft,
  AlignCenter,
  AlignRight,
  ChevronDown,
  ChevronUp,
  Sparkles
} from 'lucide-react'

interface TextSet {
  id: number
  text: string
  fontFamily: string
  top: number
  left: number
  color: string
  fontSize: number
  fontWeight: number
  opacity: number
  rotation: number
  tiltX: number
  tiltY: number
  letterSpacing: number
  textAlign: 'left' | 'center' | 'right'
  fontStyle: 'normal' | 'italic'
}

const FONT_FAMILIES = [
  'Inter', 'Arial', 'Helvetica', 'Times New Roman', 'Georgia', 
  'Verdana', 'Roboto', 'Open Sans', 'Lato', 'Poppins',
  'Montserrat', 'Raleway', 'Playfair Display', 'Merriweather'
]

const FONT_WEIGHTS = [
  { value: 100, label: 'Thin' },
  { value: 300, label: 'Light' },
  { value: 400, label: 'Regular' },
  { value: 500, label: 'Medium' },
  { value: 600, label: 'Semi Bold' },
  { value: 700, label: 'Bold' },
  { value: 800, label: 'Extra Bold' },
  { value: 900, label: 'Black' }
]

const COLORS = [
  '#FFFFFF', '#000000', '#FF0000', '#00FF00', '#0000FF', 
  '#FFFF00', '#FF00FF', '#00FFFF', '#FFA500', '#800080',
  '#008000', '#FFC0CB', '#A52A2A', '#808080', '#FFD700'
]

export function TextBehindImage() {
  const [mounted, setMounted] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [removedBgImageUrl, setRemovedBgImageUrl] = useState<string | null>(null)
  const [textSets, setTextSets] = useState<TextSet[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [showTextLayer, setShowTextLayer] = useState(true)
  const [activeTextSet, setActiveTextSet] = useState<TextSet | null>(null)
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['text', 'position']))
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [nextId, setNextId] = useState(1)

  // Ensure component is mounted on client
  useEffect(() => {
    setMounted(true)
  }, [])

  // Don't render until mounted
  if (!mounted) {
    return (
      <div className="w-full bg-gradient-to-br from-gray-50 to-white py-16">
        <div className="w-full px-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-6 animate-pulse"></div>
            <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-4 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-96 mx-auto animate-pulse"></div>
          </div>
        </div>
      </div>
    )
  }

  // Default text set
  const createDefaultTextSet = (): TextSet => {
    const newId = nextId
    setNextId(prev => prev + 1)
    return {
      id: newId,
      text: 'Edit',
      fontFamily: 'Inter',
      top: 0,
      left: 0,
      color: '#FFFFFF',
      fontSize: 48,
      fontWeight: 700,
      opacity: 1,
      rotation: 0,
      tiltX: 0,
      tiltY: 0,
      letterSpacing: 0,
      textAlign: 'center',
      fontStyle: 'normal'
    }
  }

  // Handle file upload with actual background removal
  const handleFileSelect = async (file: File) => {
    console.log('File selected:', file.name)
    setSelectedFile(file)
    setRemovedBgImageUrl(null)
    setTextSets([])
    
    // Use actual background removal
    setIsProcessing(true)
    try {
      const imageUrl = URL.createObjectURL(file)
      const imageBlob = await removeBackground(imageUrl)
      const processedUrl = URL.createObjectURL(imageBlob)
      setRemovedBgImageUrl(processedUrl)
      setIsProcessing(false)
      console.log('Background removal completed')
    } catch (error) {
      console.error('Background removal failed:', error)
      setIsProcessing(false)
      // Fallback to original image if background removal fails
      const imageUrl = URL.createObjectURL(file)
      setRemovedBgImageUrl(imageUrl)
    }
  }

  // Add new text set
  const addTextSet = () => {
    console.log('Adding new text set')
    const newTextSet = createDefaultTextSet()
    setTextSets(prev => [...prev, newTextSet])
    setActiveTextSet(newTextSet)
  }

  // Remove text set
  const removeTextSet = (id: number) => {
    console.log('Removing text set:', id)
    setTextSets(prev => prev.filter(ts => ts.id !== id))
    if (activeTextSet?.id === id) {
      setActiveTextSet(null)
    }
  }

  // Duplicate text set
  const duplicateTextSet = (textSet: TextSet) => {
    const newId = nextId
    setNextId(prev => prev + 1)
    const duplicated = { ...textSet, id: newId, text: `${textSet.text} (Copy)` }
    setTextSets(prev => [...prev, duplicated])
    setActiveTextSet(duplicated)
  }

  // Update text set
  const updateTextSet = (id: number, updates: Partial<TextSet>) => {
    console.log('Updating text set:', id, updates)
    setTextSets(prev => prev.map(ts => 
      ts.id === id ? { ...ts, ...updates } : ts
    ))
    if (activeTextSet?.id === id) {
      setActiveTextSet(prev => prev ? { ...prev, ...updates } : null)
    }
  }

  // Toggle section expansion
  const toggleSection = (section: string) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev)
      if (newSet.has(section)) {
        newSet.delete(section)
      } else {
        newSet.add(section)
      }
      return newSet
    })
  }

  // Export composite image
  // Function to ensure font is loaded
  const ensureFontLoaded = (fontFamily: string): Promise<void> => {
    return new Promise((resolve) => {
      if (document.fonts && document.fonts.load) {
        document.fonts.load(`16px ${fontFamily}`).then(() => {
          console.log(`Font ${fontFamily} loaded`)
          resolve()
        }).catch(() => {
          console.log(`Font ${fontFamily} failed to load, using fallback`)
          resolve()
        })
      } else {
        resolve()
      }
    })
  }

  // Function to calculate optimal font scale for Canvas
  const calculateFontScale = (canvas: HTMLCanvasElement): number => {
    // Increased scale factor to better match CSS preview rendering
    // Canvas often renders fonts much smaller than CSS, so we need aggressive scaling
    return 8.8 // Optimized scale factor for better font size matching
  }

  const exportImage = async () => {
    console.log('Starting export...')
    if (!canvasRef.current || !selectedFile || !removedBgImageUrl) {
      console.error('Missing required elements for export')
      return
    }

    setIsExporting(true)
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) {
      console.error('Could not get canvas context')
      setIsExporting(false)
      return
    }

    try {
      // Set canvas size
      const img = new window.Image()
      img.onload = async () => {
        canvas.width = img.width
        canvas.height = img.height
        
        // Calculate optimal font scale for this canvas
        const fontScale = calculateFontScale(canvas)

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        // Draw original background image
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

        // Draw text layers with advanced positioning
        for (const textSet of textSets) {
          console.log('Exporting text set:', textSet.text, 'at position:', textSet.left, textSet.top)
          console.log('Export font properties:', {
            fontStyle: textSet.fontStyle,
            fontWeight: textSet.fontWeight,
            fontSize: textSet.fontSize,
            fontSizePx: textSet.fontSize,
            fontFamily: textSet.fontFamily,
            color: textSet.color,
            opacity: textSet.opacity
          })
          
          // Ensure font is loaded before drawing
          await ensureFontLoaded(textSet.fontFamily)
          
          ctx.save()
          
          // Set text properties - match preview exactly
          // Canvas often renders fonts differently than CSS, so we need to scale
          const scaledFontSize = Math.round(textSet.fontSize * fontScale)
          const exportFont = `${textSet.fontStyle} ${textSet.fontWeight} ${scaledFontSize}px ${textSet.fontFamily}`
          console.log('Export font string:', exportFont, 'Original size:', textSet.fontSize, 'Scaled size:', scaledFontSize, 'Scale factor:', fontScale)
          ctx.font = exportFont // Scale font size to match CSS rendering
          ctx.fillStyle = textSet.color
          ctx.globalAlpha = textSet.opacity
          ctx.textAlign = 'center' // Always center like the preview
          ctx.textBaseline = 'middle'
          
          // Calculate position
          const x = canvas.width * (textSet.left + 50) / 100
          const y = canvas.height * (50 - textSet.top) / 100
          
          // Apply transformations
          ctx.translate(x, y)
          ctx.rotate((textSet.rotation * Math.PI) / 180)
          
          // Apply 3D transforms
          const tiltXRad = (textSet.tiltX * Math.PI) / 180
          const tiltYRad = (textSet.tiltY * Math.PI) / 180
          ctx.transform(
            Math.cos(tiltYRad), Math.sin(0),
            -Math.sin(0), Math.cos(tiltXRad),
            0, 0
          )
          
          // Text shadows removed as requested
          // No shadow rendering in export
          
          // Draw text with letter spacing - match preview exactly with scaling
          if (textSet.letterSpacing === 0) {
            ctx.fillText(textSet.text, 0, 0)
          } else {
            const chars = textSet.text.split('')
            let currentX = 0
            const scaledLetterSpacing = Math.round(textSet.letterSpacing * fontScale)
            const totalWidth = chars.reduce((width, char, i) => {
              const charWidth = ctx.measureText(char).width
              return width + charWidth + (i < chars.length - 1 ? scaledLetterSpacing : 0)
            }, 0)
            
            currentX = -totalWidth / 2
            
            chars.forEach((char, i) => {
              const charWidth = ctx.measureText(char).width
              ctx.fillText(char, currentX + charWidth / 2, 0)
              currentX += charWidth + scaledLetterSpacing
            })
          }
          
          ctx.restore()
        }

        // Draw background-removed image on top
        const removedImg = new window.Image()
        removedImg.onload = () => {
          ctx.drawImage(removedImg, 0, 0, canvas.width, canvas.height)
          
          // Download the image
          const link = document.createElement('a')
          link.download = 'text-behind-image.png'
          link.href = canvas.toDataURL()
          link.click()
          
          setIsExporting(false)
          console.log('Export completed')
        }
        removedImg.src = removedBgImageUrl
      }
      img.src = URL.createObjectURL(selectedFile)
    } catch (error) {
      console.error('Export error:', error)
      setIsExporting(false)
    }
  }

  // File upload handler
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  return (
    <div className="w-full bg-gradient-to-br from-gray-50 to-white py-16">
      <div className="w-full px-6">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-black rounded-full mb-6">
            <Type className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Text Behind Image
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
            Create stunning visual effects by placing text behind your subjects using AI-powered background removal
          </p>
        </div>

        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 gap-8">
            {/* First Row - Upload Section */}
            <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Layers className="h-5 w-5 mr-2 text-blue-600" />
                Upload Image
              </h3>
              
              {!selectedFile ? (
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-gray-400 transition-colors">
                  <input
                    type="file"
                    onChange={handleFileUpload}
                    accept="image/*"
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 font-medium">Click to upload image</p>
                    <p className="text-gray-400 text-sm mt-1">PNG, JPG, JPEG up to 10MB</p>
                  </label>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="relative">
                    <Image
                      src={URL.createObjectURL(selectedFile)}
                      alt="Preview"
                      width={400}
                      height={256}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <Button
                      onClick={() => {
                        setSelectedFile(null)
                        setRemovedBgImageUrl(null)
                        setTextSets([])
                      }}
                      size="sm"
                      variant="outline"
                      className="absolute top-2 right-2 bg-white hover:bg-gray-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Processing Status */}
                  {isProcessing && (
                    <div className="bg-blue-50 rounded-lg p-4">
                      <div className="flex items-center">
                        <RotateCw className="h-5 w-5 text-blue-600 mr-2 animate-spin" />
                        <span className="text-sm text-blue-600">Removing background...</span>
                      </div>
                    </div>
                  )}

                  {/* Text Controls */}
                  {selectedFile && !isProcessing && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="text-lg font-semibold text-gray-900 flex items-center">
                          <Type className="h-4 w-4 mr-2 text-green-600" />
                          Text Elements ({textSets.length})
                        </h4>
                        <Button
                          onClick={addTextSet}
                          size="sm"
                          className="bg-black text-white hover:bg-gray-800 rounded-lg"
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Add Text
                        </Button>
                      </div>

                      {/* Text Sets List */}
                      <div className="space-y-2">
                        {textSets.map((textSet) => (
                          <div
                            key={textSet.id}
                            className={`p-3 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                              activeTextSet?.id === textSet.id
                                ? 'border-blue-500 bg-blue-50 shadow-md'
                                : 'border-gray-200 bg-gray-50 hover:border-gray-300 hover:bg-gray-100'
                            }`}
                            onClick={() => setActiveTextSet(textSet)}
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-medium truncate text-sm">
                                {textSet.text || 'Empty Text'}
                              </span>
                              <div className="flex items-center gap-1">
                                <Button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    duplicateTextSet(textSet)
                                  }}
                                  size="sm"
                                  variant="ghost"
                                  className="h-6 w-6 p-0 text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                                >
                                  <Copy className="h-3 w-3" />
                                </Button>
                                <Button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    removeTextSet(textSet.id)
                                  }}
                                  size="sm"
                                  variant="ghost"
                                  className="h-6 w-6 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Export Button */}
                      {textSets.length > 0 && (
                        <Button
                          onClick={exportImage}
                          disabled={isExporting}
                          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl py-3 font-semibold"
                        >
                          {isExporting ? (
                            <>
                              <RotateCw className="h-4 w-4 mr-2 animate-spin" />
                              Exporting...
                            </>
                          ) : (
                            <>
                              <Download className="h-4 w-4 mr-2" />
                              Export Image
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Second Row - Text Properties and Live Preview */}
            {selectedFile && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Panel - Text Properties (Fixed and Scrollable) */}
                {activeTextSet && (
                  <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100">
                    <div className="sticky top-8">
                      <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                        <Settings className="h-5 w-5 mr-2 text-purple-600" />
                        Text Properties
                      </h3>

                      <div className="max-h-[600px] overflow-y-auto space-y-6 pr-2">
                        {/* Text Content Section */}
                        <div className="space-y-4">
                          <button
                            onClick={() => toggleSection('text')}
                            className="flex items-center justify-between w-full text-left font-medium text-gray-900"
                          >
                            <span>Text Content</span>
                            {expandedSections.has('text') ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                          </button>
                          
                          {expandedSections.has('text') && (
                            <div className="space-y-4 pl-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Text
                                </label>
                                <Input
                                  value={activeTextSet.text}
                                  onChange={(e) => updateTextSet(activeTextSet.id, { text: e.target.value })}
                                  placeholder="Enter text..."
                                  className="w-full rounded-lg"
                                />
                              </div>

                              <div className="grid grid-cols-2 gap-3">
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Font Family
                                  </label>
                                  <select
                                    value={activeTextSet.fontFamily}
                                    onChange={(e) => updateTextSet(activeTextSet.id, { fontFamily: e.target.value })}
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                                  >
                                    {FONT_FAMILIES.map(font => (
                                      <option key={font} value={font}>{font}</option>
                                    ))}
                                  </select>
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Font Weight
                                  </label>
                                  <select
                                    value={activeTextSet.fontWeight}
                                    onChange={(e) => updateTextSet(activeTextSet.id, { fontWeight: parseInt(e.target.value) })}
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                                  >
                                    {FONT_WEIGHTS.map(weight => (
                                      <option key={weight.value} value={weight.value}>{weight.label}</option>
                                    ))}
                                  </select>
                                </div>
                              </div>

                              <div className="grid grid-cols-2 gap-3">
                                                                 <div>
                                   <label className="block text-sm font-medium text-gray-700 mb-2">
                                     Font Size: {activeTextSet.fontSize}px
                                   </label>
                                   <div className="space-y-2">
                                     <input
                                       type="range"
                                       min="8"
                                       max="200"
                                       value={activeTextSet.fontSize}
                                       onChange={(e) => updateTextSet(activeTextSet.id, { fontSize: parseInt(e.target.value) })}
                                       className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                       style={{
                                         background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${((activeTextSet.fontSize - 8) / (200 - 8)) * 100}%, #e5e7eb ${((activeTextSet.fontSize - 8) / (200 - 8)) * 100}%, #e5e7eb 100%)`,
                                         WebkitAppearance: 'none',
                                         height: '8px',
                                         borderRadius: '5px',
                                         outline: 'none'
                                       }}
                                     />
                                     <div className="flex justify-between text-xs text-gray-500">
                                       <span>8px</span>
                                       <span>200px</span>
                                     </div>
                                   </div>

                                 </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Color
                                  </label>
                                  <div className="flex items-center space-x-2">
                                    <input
                                      type="color"
                                      value={activeTextSet.color}
                                      onChange={(e) => updateTextSet(activeTextSet.id, { color: e.target.value })}
                                      className="w-8 h-8 rounded border cursor-pointer"
                                    />
                                    <Input
                                      value={activeTextSet.color}
                                      onChange={(e) => updateTextSet(activeTextSet.id, { color: e.target.value })}
                                      className="flex-1 rounded-lg"
                                    />
                                  </div>
                                </div>
                              </div>

                              <div className="grid grid-cols-3 gap-2">
                                <Button
                                  onClick={() => updateTextSet(activeTextSet.id, { textAlign: 'left' })}
                                  size="sm"
                                  variant={activeTextSet.textAlign === 'left' ? 'default' : 'outline'}
                                  className="h-8"
                                >
                                  <AlignLeft className="h-3 w-3" />
                                </Button>
                                <Button
                                  onClick={() => updateTextSet(activeTextSet.id, { textAlign: 'center' })}
                                  size="sm"
                                  variant={activeTextSet.textAlign === 'center' ? 'default' : 'outline'}
                                  className="h-8"
                                >
                                  <AlignCenter className="h-3 w-3" />
                                </Button>
                                <Button
                                  onClick={() => updateTextSet(activeTextSet.id, { textAlign: 'right' })}
                                  size="sm"
                                  variant={activeTextSet.textAlign === 'right' ? 'default' : 'outline'}
                                  className="h-8"
                                >
                                  <AlignRight className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Position Section */}
                        <div className="space-y-4">
                          <button
                            onClick={() => toggleSection('position')}
                            className="flex items-center justify-between w-full text-left font-medium text-gray-900"
                          >
                            <span>Position & Effects</span>
                            {expandedSections.has('position') ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                          </button>
                          
                          {expandedSections.has('position') && (
                            <div className="space-y-4 pl-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                                  <Move className="h-4 w-4 mr-1" />
                                  Position
                                </label>
                                <div className="grid grid-cols-2 gap-3">
                                  <div>
                                    <label className="block text-xs text-gray-500 mb-1">X Position</label>
                                    <input
                                      type="range"
                                      min="-50"
                                      max="50"
                                      value={activeTextSet.left}
                                      onChange={(e) => updateTextSet(activeTextSet.id, { left: parseInt(e.target.value) })}
                                      className="w-full"
                                    />
                                    <span className="text-xs text-gray-500">{activeTextSet.left}%</span>
                                  </div>
                                  <div>
                                    <label className="block text-xs text-gray-500 mb-1">Y Position</label>
                                    <input
                                      type="range"
                                      min="-50"
                                      max="50"
                                      value={activeTextSet.top}
                                      onChange={(e) => updateTextSet(activeTextSet.id, { top: parseInt(e.target.value) })}
                                      className="w-full"
                                    />
                                    <span className="text-xs text-gray-500">{activeTextSet.top}%</span>
                                  </div>
                                </div>
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                                  <Settings className="h-4 w-4 mr-1" />
                                  Effects
                                </label>
                                <div className="grid grid-cols-2 gap-3">
                                  <div>
                                    <label className="block text-xs text-gray-500 mb-1">Rotation</label>
                                    <input
                                      type="range"
                                      min="0"
                                      max="360"
                                      value={activeTextSet.rotation}
                                      onChange={(e) => updateTextSet(activeTextSet.id, { rotation: parseInt(e.target.value) })}
                                      className="w-full"
                                    />
                                    <span className="text-xs text-gray-500">{activeTextSet.rotation}°</span>
                                  </div>
                                  <div>
                                    <label className="block text-xs text-gray-500 mb-1">Opacity</label>
                                    <input
                                      type="range"
                                      min="0"
                                      max="1"
                                      step="0.1"
                                      value={activeTextSet.opacity}
                                      onChange={(e) => updateTextSet(activeTextSet.id, { opacity: parseFloat(e.target.value) })}
                                      className="w-full"
                                    />
                                    <span className="text-xs text-gray-500">{activeTextSet.opacity}</span>
                                  </div>
                                </div>
                                <div className="grid grid-cols-2 gap-3 mt-3">
                                  <div>
                                    <label className="block text-xs text-gray-500 mb-1">Tilt X (3D)</label>
                                    <input
                                      type="range"
                                      min="-45"
                                      max="45"
                                      value={activeTextSet.tiltX}
                                      onChange={(e) => updateTextSet(activeTextSet.id, { tiltX: parseInt(e.target.value) })}
                                      className="w-full"
                                    />
                                    <span className="text-xs text-gray-500">{activeTextSet.tiltX}°</span>
                                  </div>
                                  <div>
                                    <label className="block text-xs text-gray-500 mb-1">Tilt Y (3D)</label>
                                    <input
                                      type="range"
                                      min="-45"
                                      max="45"
                                      value={activeTextSet.tiltY}
                                      onChange={(e) => updateTextSet(activeTextSet.id, { tiltY: parseInt(e.target.value) })}
                                      className="w-full"
                                    />
                                    <span className="text-xs text-gray-500">{activeTextSet.tiltY}°</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Right Panel - Live Preview */}
                <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                      <ImageIcon className="h-5 w-5 mr-2 text-green-600" />
                      Live Preview
                    </h3>
                    <Button
                      onClick={() => setShowTextLayer(!showTextLayer)}
                      size="sm"
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      {showTextLayer ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      {showTextLayer ? 'Hide Text' : 'Show Text'}
                    </Button>
                  </div>

                  {/* Preview Area */}
                  <div className="relative bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl overflow-hidden shadow-inner flex items-center justify-center border-dashed border-gray-300">
                    {selectedFile ? (
                      <>
                        {/* Layer 1: Original Image (Background) */}
                        <Image
                          src={URL.createObjectURL(selectedFile)}
                          alt="Original image"
                          width={600}
                          height={400}
                          className="w-full object-contain max-h-[400px]"
                        />

                        {/* Layer 2: Text Overlay */}
                        {showTextLayer && textSets.map((textSet) => {
                          console.log('Preview text set:', textSet.text, 'at position:', textSet.left, textSet.top)
                                      console.log('Preview font properties:', {
              fontStyle: textSet.fontStyle,
              fontWeight: textSet.fontWeight,
              fontSize: textSet.fontSize,
              fontSizePx: textSet.fontSize,
              fontFamily: textSet.fontFamily,
              color: textSet.color,
              opacity: textSet.opacity
            })
                          return (
                          <div
                            key={textSet.id}
                            style={{
                              position: 'absolute',
                              top: `${50 - textSet.top}%`,
                              left: `${textSet.left + 50}%`,
                              transform: `
                                translate(-50%, -50%)
                                rotate(${textSet.rotation}deg)
                                perspective(1000px)
                                rotateX(${textSet.tiltX}deg)
                                rotateY(${textSet.tiltY}deg)
                              `,
                              fontFamily: textSet.fontFamily,
                              fontSize: `${textSet.fontSize}px`,
                              fontWeight: textSet.fontWeight,
                              fontStyle: textSet.fontStyle,
                              color: textSet.color,
                              opacity: textSet.opacity,
                              textAlign: textSet.textAlign,
                              letterSpacing: `${textSet.letterSpacing}px`,
                              // textShadow removed as requested
                              cursor: 'pointer',
                              zIndex: 10,
                              transition: 'all 0.2s ease',
                              transformStyle: 'preserve-3d'
                            }}
                            onClick={() => setActiveTextSet(textSet)}
                            className={`${
                              activeTextSet?.id === textSet.id 
                                ? 'ring-4 ring-blue-500 ring-opacity-50' 
                                : 'hover:scale-105'
                            }`}
                          >
                            {textSet.text}
                          </div>
                        )})}

                        {/* Layer 3: Background-Removed Image (Foreground) */}
                        {removedBgImageUrl && (
                          <Image
                            src={removedBgImageUrl}
                            alt="Background removed"
                            width={600}
                            height={400}
                            className="absolute top-0 left-0 w-full object-contain max-h-[400px]"
                            style={{ zIndex: 20 }}
                          />
                        )}

                        {/* Processing Overlay */}
                        {isProcessing && (
                          <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-30 rounded-xl">
                            <div className="text-center text-white bg-black/80 rounded-2xl p-8">
                              <RotateCw className="h-12 w-12 mx-auto mb-4 animate-spin text-blue-400" />
                              <p className="text-lg font-semibold">Removing background...</p>
                              <p className="text-sm text-gray-300 mt-2">This may take a few seconds</p>
                            </div>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="text-center text-gray-500 p-12">
                        <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                          <Type className="h-12 w-12 text-gray-400" />
                        </div>
                        <h4 className="text-xl font-semibold mb-2">Upload an Image</h4>
                        <p className="text-gray-400">Start creating stunning text-behind-image effects</p>
                      </div>
                    )}
                  </div>

                  {/* Hidden Canvas for Export */}
                  <canvas ref={canvasRef} className="hidden" />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
