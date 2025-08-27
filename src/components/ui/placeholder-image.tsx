'use client'

interface PlaceholderImageProps {
  width: number
  height: number
  alt: string
  className?: string
}

export function PlaceholderImage({ width, height, alt, className = '' }: PlaceholderImageProps) {
  return (
    <div
      className={`bg-gradient-to-br from-gray-200 to-gray-300 rounded-xl shadow-md ${className}`}
      style={{ width, height }}
    >
      <div className="w-full h-full flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-12 h-12 bg-gray-400 rounded-lg mx-auto mb-3 flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-sm text-gray-600 font-medium">{alt}</p>
          <p className="text-xs text-gray-500 mt-1">Placeholder</p>
        </div>
      </div>
    </div>
  )
}
