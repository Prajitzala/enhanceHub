import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About Us - AI Text Behind Image',
  description: 'Learn about our AI-powered image processing service and the team behind it.',
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">
            About Us
          </h1>
          
          <div className="prose prose-lg max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our Mission</h2>
              <p className="text-gray-700 mb-4">
                At AI Text Behind Image, we're passionate about making advanced AI technology accessible to everyone. 
                Our mission is to provide cutting-edge image processing tools that help users extract valuable information 
                from images, restore damaged photos, and enhance visual content with the power of artificial intelligence.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">What We Do</h2>
              <p className="text-gray-700 mb-4">
                We specialize in AI-powered image processing services that include:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li><strong>Text Extraction:</strong> Extract text from images using advanced OCR technology</li>
                <li><strong>Image Restoration:</strong> Restore damaged, blurry, or low-quality images</li>
                <li><strong>Image Colorization:</strong> Add color to black and white photographs</li>
                <li><strong>Image Segmentation:</strong> Separate objects and backgrounds in images</li>
                <li><strong>Background Removal:</strong> Remove and replace image backgrounds</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our Technology</h2>
              <p className="text-gray-700 mb-4">
                We leverage state-of-the-art artificial intelligence and machine learning algorithms to provide 
                the best possible results. Our platform combines multiple AI models to ensure accuracy, speed, 
                and reliability in all our image processing tasks.
              </p>
              <p className="text-gray-700 mb-4">
                Our technology stack includes:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Advanced Computer Vision algorithms</li>
                <li>Natural Language Processing for text recognition</li>
                <li>Deep Learning models for image enhancement</li>
                <li>Cloud-based processing for scalability</li>
                <li>Real-time processing capabilities</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Why Choose Us</h2>
              <div className="grid md:grid-cols-2 gap-6 mb-4">
                <div className="bg-blue-50 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold text-blue-900 mb-2">Easy to Use</h3>
                  <p className="text-blue-800">
                    Our intuitive interface makes complex AI processing simple and accessible to everyone.
                  </p>
                </div>
                <div className="bg-green-50 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold text-green-900 mb-2">High Quality Results</h3>
                  <p className="text-green-800">
                    We use the latest AI models to ensure the highest quality output for all your images.
                  </p>
                </div>
                <div className="bg-purple-50 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold text-purple-900 mb-2">Fast Processing</h3>
                  <p className="text-purple-800">
                    Get your processed images in seconds with our optimized cloud infrastructure.
                  </p>
                </div>
                <div className="bg-orange-50 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold text-orange-900 mb-2">Secure & Private</h3>
                  <p className="text-orange-800">
                    Your images are processed securely and deleted after processing to protect your privacy.
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our Commitment</h2>
              <p className="text-gray-700 mb-4">
                We are committed to:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Providing reliable and accurate AI processing services</li>
                <li>Protecting user privacy and data security</li>
                <li>Continuously improving our technology and user experience</li>
                <li>Making AI tools accessible to users of all skill levels</li>
                <li>Providing excellent customer support</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Get Started</h2>
              <p className="text-gray-700 mb-4">
                Ready to experience the power of AI image processing? Upload your first image and see the magic happen! 
                Our platform is designed to be user-friendly while delivering professional-grade results.
              </p>
              <div className="text-center">
                <a 
                  href="/" 
                  className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Try Our Service
                </a>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact Us</h2>
              <p className="text-gray-700 mb-4">
                Have questions or need support? We're here to help! Visit our contact page to get in touch with our team.
              </p>
              <div className="text-center">
                <a 
                  href="/contact" 
                  className="inline-block bg-gray-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
                >
                  Contact Us
                </a>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
