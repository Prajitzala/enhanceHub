'use client'

import { useRef } from 'react'
import { useScroll, useTransform } from 'framer-motion'
import { PlaceholderImage } from './placeholder-image'

export function HeroParallaxImages() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start']
  })

  // Create multiple columns with different scroll speeds for more dynamic effect
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -300])
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -600])
  const y3 = useTransform(scrollYProgress, [0, 1], [0, -150])

  return (
    <section className="w-full py-20 bg-gradient-to-br from-blue-50 via-white to-purple-50 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-32 h-32 bg-blue-200 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-purple-200 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-pink-200 rounded-full opacity-15 blur-2xl"></div>
      </div>

      <div className="w-full relative z-10">
        <div className="text-center mb-16 px-6">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            See the Magic in Action
          </h2>
          <p className="text-xl sm:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Watch as our AI transforms old, damaged photos into stunning restored images with incredible detail and quality
          </p>
        </div>

        <div ref={ref} className="relative w-full h-[900px] overflow-hidden">
          <div className="absolute inset-0 flex justify-center">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-7xl px-6">
              {/* Left Column */}
              <div className="space-y-8" style={{ transform: `translateY(${y1}px)` }}>
                <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden transform hover:scale-105 transition-transform duration-300">
                  <PlaceholderImage width={350} height={450} alt="Before and after photo restoration" />
                  <div className="p-6">
                    <h4 className="font-semibold text-gray-900 mb-2">Photo Restoration</h4>
                    <p className="text-sm text-gray-600">Remove scratches and damage</p>
                  </div>
                </div>
                
                <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden transform hover:scale-105 transition-transform duration-300">
                  <PlaceholderImage width={350} height={450} alt="AI enhanced photo" />
                  <div className="p-6">
                    <h4 className="font-semibold text-gray-900 mb-2">AI Enhancement</h4>
                    <p className="text-sm text-gray-600">Improve image quality</p>
                  </div>
                </div>
                
                <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden transform hover:scale-105 transition-transform duration-300">
                  <PlaceholderImage width={350} height={450} alt="Colorized black and white photo" />
                  <div className="p-6">
                    <h4 className="font-semibold text-gray-900 mb-2">Colorization</h4>
                    <p className="text-sm text-gray-600">Bring old photos to life</p>
                  </div>
                </div>
              </div>
              
              {/* Center Column */}
              <div className="space-y-8" style={{ transform: `translateY(${y2}px)` }}>
                <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden transform hover:scale-105 transition-transform duration-300">
                  <PlaceholderImage width={350} height={450} alt="Scratch removal example" />
                  <div className="p-6">
                    <h4 className="font-semibold text-gray-900 mb-2">Scratch Removal</h4>
                    <p className="text-sm text-gray-600">Perfect surface restoration</p>
                  </div>
                </div>
                
                <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden transform hover:scale-105 transition-transform duration-300">
                  <PlaceholderImage width={350} height={450} alt="Photo restoration showcase" />
                  <div className="p-6">
                    <h4 className="font-semibold text-gray-900 mb-2">Detail Recovery</h4>
                    <p className="text-sm text-gray-600">Restore lost details</p>
                  </div>
                </div>
                
                <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden transform hover:scale-105 transition-transform duration-300">
                  <PlaceholderImage width={350} height={450} alt="AI photo enhancement" />
                  <div className="p-6">
                    <h4 className="font-semibold text-gray-900 mb-2">Smart Enhancement</h4>
                    <p className="text-sm text-gray-600">AI-powered improvements</p>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-8" style={{ transform: `translateY(${y3}px)` }}>
                <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden transform hover:scale-105 transition-transform duration-300">
                  <PlaceholderImage width={350} height={450} alt="Background removal" />
                  <div className="p-6">
                    <h4 className="font-semibold text-gray-900 mb-2">Background Removal</h4>
                    <p className="text-sm text-gray-600">Clean subject isolation</p>
                  </div>
                </div>
                
                <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden transform hover:scale-105 transition-transform duration-300">
                  <PlaceholderImage width={350} height={450} alt="Text behind image effect" />
                  <div className="p-6">
                    <h4 className="font-semibold text-gray-900 mb-2">Text Effects</h4>
                    <p className="text-sm text-gray-600">Creative text placement</p>
                  </div>
                </div>
                
                <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden transform hover:scale-105 transition-transform duration-300">
                  <PlaceholderImage width={350} height={450} alt="Professional restoration" />
                  <div className="p-6">
                    <h4 className="font-semibold text-gray-900 mb-2">Professional Quality</h4>
                    <p className="text-sm text-gray-600">Studio-grade results</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Call to action */}
        <div className="text-center mt-16 px-6">
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
              Ready to Transform Your Photos?
            </h3>
            <p className="text-lg text-gray-600 mb-6">
              Join thousands of users who have already restored their precious memories
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-black text-white px-8 py-3 rounded-xl font-semibold hover:bg-gray-800 transition-colors">
                Start Restoring Now
              </button>
              <button className="border-2 border-gray-300 text-gray-700 px-8 py-3 rounded-xl font-semibold hover:border-gray-400 hover:bg-gray-50 transition-colors">
                View Examples
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
