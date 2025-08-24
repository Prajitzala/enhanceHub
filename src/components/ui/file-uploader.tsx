import React, { useCallback, useState, useRef } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, X, Image as ImageIcon } from 'lucide-react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { Button } from './button'

interface FileUploaderProps {
  onFileSelect: (file: File) => void
  selectedFile?: File | null
  onRemoveFile: () => void
  className?: string
}

export function FileUploader({ 
  onFileSelect, 
  selectedFile, 
  onRemoveFile, 
  className 
}: FileUploaderProps) {
  const [isDragActive, setIsDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onFileSelect(acceptedFiles[0])
    }
  }, [onFileSelect])

  const { getRootProps, getInputProps, isDragReject } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg']
    },
    maxFiles: 1,
    onDragEnter: () => setIsDragActive(true),
    onDragLeave: () => setIsDragActive(false),
    onDropAccepted: () => setIsDragActive(false),
    onDropRejected: () => setIsDragActive(false),
  })

  const handleChooseFileClick = () => {
    fileInputRef.current?.click()
  }

  if (selectedFile) {
    return (
      <div className={cn("relative", className)}>
        <div className="relative rounded-2xl border-2 border-dashed border-gray-300 bg-white p-8">
          <div className="flex items-center justify-center">
            <Image
              src={URL.createObjectURL(selectedFile)}
              alt="Preview"
              width={400}
              height={256}
              className="max-h-64 max-w-full rounded-xl object-contain"
            />
          </div>
          <div className="absolute top-4 right-4">
            <Button
              variant="outline"
              size="sm"
              className="bg-white hover:bg-gray-50 text-gray-700 border-gray-300"
              onClick={onRemoveFile}
            >
              <X className="h-4 w-4 mr-1" />
              Remove
            </Button>
          </div>
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              <span className="font-medium">{selectedFile.name}</span> • {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      {...getRootProps()}
      className={cn(
        "relative rounded-2xl border-2 border-dashed transition-all duration-200 ease-in-out cursor-pointer",
        isDragActive && !isDragReject
          ? "border-black bg-gray-50"
          : isDragReject
          ? "border-red-500 bg-red-50"
          : "border-gray-300 bg-white hover:border-gray-400 hover:bg-gray-50",
        className
      )}
    >
      <input {...getInputProps()} ref={fileInputRef} />
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <div className="mb-6">
          {isDragActive && !isDragReject ? (
            <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto">
              <Upload className="h-8 w-8 text-white" />
            </div>
          ) : isDragReject ? (
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
              <X className="h-8 w-8 text-red-600" />
            </div>
          ) : (
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
              <ImageIcon className="h-8 w-8 text-gray-600" />
            </div>
          )}
        </div>
        
        <div className="mb-4">
          <h4 className="text-xl font-semibold text-gray-900 mb-2">
            {isDragActive && !isDragReject
              ? "Drop your image here"
              : isDragReject
              ? "Invalid file type"
              : "Upload your image"}
          </h4>
          <p className="text-gray-600">
            {isDragReject
              ? "Please upload a valid image file (PNG, JPG, JPEG)"
              : "Drag & drop your image here, or click to browse"}
          </p>
        </div>
        
        <div className="space-y-2 text-sm text-gray-500">
          <p>Supports: PNG, JPG, JPEG</p>
          <p>Maximum file size: 10MB</p>
        </div>
        
        {!isDragActive && !isDragReject && (
          <Button
            variant="outline"
            size="sm"
            className="mt-6 bg-white hover:bg-gray-50 border-gray-300"
            onClick={handleChooseFileClick}
          >
            <Upload className="h-4 w-4 mr-2" />
            Choose File
          </Button>
        )}
      </div>
    </div>
  )
}

