import { Metadata } from 'next'
import Link from 'next/link'
import { Shield, Lock, Eye, Cookie, Users, Baby, CheckCircle, ArrowLeft } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Privacy Policy - AI EnhanceHub',
  description: 'Learn how AI EnhanceHub collects, uses, and protects your personal information. Our privacy policy covers data collection, cookies, GDPR rights, and more.',
  keywords: 'privacy policy, data protection, GDPR, cookies, personal information, AI EnhanceHub',
  openGraph: {
    title: 'Privacy Policy - AI EnhanceHub',
    description: 'Learn how AI EnhanceHub collects, uses, and protects your personal information.',
    type: 'website',
  },
}

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <Link 
            href="/"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        {/* Page Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-6">
            <Shield className="h-8 w-8 text-blue-600" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Privacy Policy
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Last updated: {new Date().toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>

        {/* Content Sections */}
        <div className="space-y-12">
          {/* Introduction */}
          <section className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                <Lock className="h-5 w-5 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Introduction</h2>
            </div>
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-700 leading-relaxed">
                At AI EnhanceHub, we are committed to protecting your privacy and ensuring the security of your personal information. 
                This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our AI-powered 
                photo enhancement services.
              </p>
              <p className="text-gray-700 leading-relaxed mt-4">
                By using our services, you agree to the collection and use of information in accordance with this policy. 
                If you have any questions about this Privacy Policy, please contact us.
              </p>
            </div>
          </section>

          {/* Information We Collect */}
          <section className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                <Eye className="h-5 w-5 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Information We Collect</h2>
            </div>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Personal Information</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Email address (when you contact us or sign up for services)</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Name and contact information (when provided)</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Payment information (processed securely through third-party providers)</span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Usage Information</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Images you upload for processing (temporarily stored for service delivery)</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Usage patterns and preferences</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Device information and browser type</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* How We Use Your Information */}
          <section className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                <Users className="h-5 w-5 text-purple-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">How We Use Your Information</h2>
            </div>
            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                We use the information we collect to:
              </p>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-purple-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span>Provide and maintain our AI photo enhancement services</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-purple-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span>Process your image uploads and deliver enhanced results</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-purple-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span>Improve our services and develop new features</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-purple-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span>Respond to your inquiries and provide customer support</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-purple-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span>Send important updates about our services</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-purple-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span>Ensure the security and integrity of our platform</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Google AdSense & Cookies */}
          <section className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mr-4">
                <Cookie className="h-5 w-5 text-orange-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Google AdSense & Cookies</h2>
            </div>
            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                Our website may use Google AdSense to display advertisements. Google AdSense uses cookies to serve ads based on your 
                visits to our site and other sites on the internet.
              </p>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Types of Cookies We Use</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-orange-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span><strong>Essential Cookies:</strong> Required for basic site functionality</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-orange-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span><strong>Analytics Cookies:</strong> Help us understand how visitors use our site</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-orange-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span><strong>Advertising Cookies:</strong> Used by Google AdSense to deliver relevant ads</span>
                  </li>
                </ul>
              </div>
              <p className="text-gray-700 leading-relaxed">
                You can control cookie settings through your browser preferences. However, disabling certain cookies may affect 
                the functionality of our services.
              </p>
            </div>
          </section>

          {/* Third-Party Privacy Policies */}
          <section className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center mr-4">
                <Shield className="h-5 w-5 text-indigo-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Third-Party Privacy Policies</h2>
            </div>
            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                Our services may contain links to third-party websites or integrate with third-party services. We are not responsible 
                for the privacy practices of these external sites.
              </p>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Third-Party Services We Use</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-indigo-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span><strong>Google AdSense:</strong> For advertising services</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-indigo-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span><strong>Payment Processors:</strong> For secure payment processing</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-indigo-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span><strong>Analytics Services:</strong> For website usage analysis</span>
                  </li>
                </ul>
              </div>
              <p className="text-gray-700 leading-relaxed">
                We encourage you to review the privacy policies of these third-party services to understand how they handle your information.
              </p>
            </div>
          </section>

          {/* GDPR & CCPA Rights */}
          <section className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center mr-4">
                <Lock className="h-5 w-5 text-teal-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">GDPR & CCPA Rights</h2>
            </div>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Your Rights Under GDPR (EU Users)</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-teal-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span><strong>Right to Access:</strong> Request a copy of your personal data</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-teal-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span><strong>Right to Rectification:</strong> Correct inaccurate personal data</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-teal-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span><strong>Right to Erasure:</strong> Request deletion of your personal data</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-teal-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span><strong>Right to Data Portability:</strong> Receive your data in a portable format</span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Your Rights Under CCPA (California Users)</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-teal-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span><strong>Right to Know:</strong> Request information about data collection and use</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-teal-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span><strong>Right to Delete:</strong> Request deletion of personal information</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-teal-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span><strong>Right to Opt-Out:</strong> Opt out of the sale of personal information</span>
                  </li>
                </ul>
              </div>
              <p className="text-gray-700 leading-relaxed">
                To exercise these rights, please contact us using the information provided at the end of this policy.
              </p>
            </div>
          </section>

          {/* Children's Information */}
          <section className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center mr-4">
                <Baby className="h-5 w-5 text-pink-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Children's Information</h2>
            </div>
            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                Our services are not intended for children under the age of 13. We do not knowingly collect personal information 
                from children under 13.
              </p>
              <p className="text-gray-700 leading-relaxed">
                If you are a parent or guardian and believe that your child has provided us with personal information, 
                please contact us immediately. We will take steps to remove such information from our records.
              </p>
              <p className="text-gray-700 leading-relaxed">
                For users between the ages of 13 and 18, we recommend parental guidance when using our services.
              </p>
            </div>
          </section>

          {/* Consent */}
          <section className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center mr-4">
                <CheckCircle className="h-5 w-5 text-emerald-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Consent</h2>
            </div>
            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                By using our services, you consent to the collection and use of your information as described in this Privacy Policy. 
                You may withdraw your consent at any time by contacting us.
              </p>
              <p className="text-gray-700 leading-relaxed">
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy 
                on this page and updating the "Last updated" date.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Your continued use of our services after any changes to this Privacy Policy constitutes acceptance of the updated policy.
              </p>
            </div>
          </section>
        </div>

        
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 mt-16">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="text-center">
            <Link 
              href="/"
              className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Return to AI EnhanceHub
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
