"use client"

import Image from 'next/image'
import { useState, useRef } from 'react'

export default function LoginPage() {
  const [activeTab, setActiveTab] = useState('citizen')
  const [nin, setNin] = useState('')
  const [phone, setPhone] = useState('')
  const [isMonaAttest, setIsMonaAttest] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showAttestContainer, setShowAttestContainer] = useState(false)
  const attestContainerRef = useRef(null)

  const handleContinue = async () => {
    if (isMonaAttest) {
      await handleMonaAttestLogin()
    } else {
      // Regular login logic here
      console.log('Regular login with NIN:', nin, 'Phone:', phone)
    }
  }

  const handleMonaAttestLogin = async () => {
    setIsLoading(true)
    setShowAttestContainer(true)
    
    try {
      // Mock discovery call - replace with your actual discovery endpoint
      const discoveryResponse = await fetch('/api/consent/oyamoney-discovery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ component: 'LoginPage' })
      })

      if (!discoveryResponse.ok) {
        throw new Error(`Discovery failed: ${discoveryResponse.status}`)
      }

      const discoveryData = await discoveryResponse.json()
      const discoveryId = discoveryData.discoveryId

      // Initialize AttestFrontendSDK with targetElement
      let AttestFrontendSDK
      try {
        const sdkModule = await import('@usemona/attest-frontend-sdk')
        AttestFrontendSDK = sdkModule.AttestFrontendSDK
      } catch (error) {
        console.error('Failed to load AttestFrontendSDK:', error)
        throw new Error('AttestFrontendSDK not available')
      }
      
      const frontendUrl = process.env.NEXT_PUBLIC_ATTEST_FRONTEND || 'http://localhost:3001'
      const apiUrl = process.env.NEXT_PUBLIC_ATTEST_BACKEND || 'http://localhost:4000'
      
      const config = {
        targetElement: attestContainerRef.current,
        frontendUrl: frontendUrl,
        apiUrl: apiUrl
      }
      
      const attestSDK = new AttestFrontendSDK(config)

      // Mock login endpoint - use absolute URL
      const loginUrl = `${window.location.origin}/api/auth/login`
      
      const response = await attestSDK.fetchWithAttestation(
        loginUrl,
        discoveryId,
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        }
      )

      if (response.ok) {
        const loginData = await response.json()
        if (loginData.success) {
          // Store token and user data
          localStorage.setItem('paymonaToken', loginData.token)
          localStorage.setItem('paymonaUser', JSON.stringify(loginData.user))
          
          // Call success callback
          await onLoginSuccess(loginData.token, loginData.user)
        }
      }
    } catch (error) {
      console.error('Mona Attest login error:', error)
      setShowAttestContainer(false)
    } finally {
      setIsLoading(false)
    }
  }

  const onLoginSuccess = async (token, user) => {
    console.log('Login successful:', { token, user })
    // Redirect to dashboard
    window.location.href = '/dashboard'
  }

  return (
    <div className="min-h-screen bg-white flex flex-col lg:flex-row">

      {/* Mobile Toggle - Visible on mobile only */}
      <div className="lg:hidden bg-green-50 p-4 border-b border-green-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center mr-2">
              <span className="text-white text-sm font-bold">G</span>
            </div>
            <span className="text-gray-800 text-lg font-semibold">GSP Design</span>
          </div>
          
          {/* Toggle Switch */}
          <div className="flex items-center space-x-2">
            <span className={`text-xs font-medium ${!isMonaAttest ? 'text-green-600' : 'text-gray-500'}`}>
              Regular
            </span>
            <button
              onClick={() => setIsMonaAttest(!isMonaAttest)}
              className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ${
                isMonaAttest ? 'bg-green-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                  isMonaAttest ? 'translate-x-5' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={`text-xs font-medium ${isMonaAttest ? 'text-green-600' : 'text-gray-500'}`}>
              Mona Attest
            </span>
          </div>
        </div>
      </div>

      {/* Left Panel - Hidden on mobile */}
      <div className="hidden lg:flex lg:w-1/2 bg-green-50 p-8 flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center">

          </div>
          
          {/* Toggle Switch - Desktop */}
          <div className="flex items-center space-x-2">
            <span className={`text-sm font-medium ${!isMonaAttest ? 'text-green-600' : 'text-gray-500'}`}>
              Regular
            </span>
            <button
              onClick={() => setIsMonaAttest(!isMonaAttest)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ${
                isMonaAttest ? 'bg-green-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isMonaAttest ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={`text-sm font-medium ${isMonaAttest ? 'text-green-600' : 'text-gray-500'}`}>
              Mona Attest
            </span>
          </div>
        </div>

        {/* Content with Image */}
        <div className="flex-1 flex flex-col justify-center space-y-8">
          {/* Image Card */}
          <div className="bg-white rounded-2xl p-6 shadow-sm relative">
            <div className="relative h-64 w-full mb-4">
              <Image
                src="/nollywood.png"
                alt="Nollywood film industry"
                fill
                className="object-cover rounded-lg"
              />
              {/* Film Industry Tag */}
              <div className="absolute top-4 right-4">
                <div className="bg-purple-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center">
                  <span className="mr-1">🎬</span>
                  Film Industry
                </div>
              </div>
            </div>
            
            {/* Progress Dots */}
            <div className="flex justify-center space-x-2">
              <div className="w-2 h-2 bg-gray-800 rounded-full"></div>
              <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
              <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
            </div>
          </div>

          {/* Text Content */}
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-6 leading-tight">
              Nigeria is home to the<br />
              &ldquo;Nollywood&rdquo; film industry.
            </h2>
            <p className="text-gray-600 leading-relaxed mb-8">
              Producing over 2,500 movies annually, Nollywood is the world&apos;s second-largest film industry by volume, creating more films than Hollywood and generating over $7 billion for the Nigerian economy.
            </p>
          </div>
        </div>

        {/* Footer Links */}
        <div className="flex space-x-8 text-gray-500">
          <a href="#" className="hover:text-gray-700">Frequently Asked Questions</a>
          <a href="#" className="hover:text-gray-700">Privacy Policy</a>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 lg:w-1/2 flex flex-col">
        {/* Navigation Tabs */}
        <div className="border-b border-gray-200 px-6 lg:px-12 pt-6 lg:pt-12">
          <div className="flex space-x-1">
            <button
              onClick={() => setActiveTab('citizen')}
              className={`flex items-center px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeTab === 'citizen'
                  ? 'bg-green-100 text-green-700 border border-green-200'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <span className="mr-2">👤</span>
              Citizen
            </button>
            <button
              onClick={() => setActiveTab('non-citizen')}
              className={`flex items-center px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeTab === 'non-citizen'
                  ? 'bg-green-100 text-green-700 border border-green-200'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <span className="mr-2">🌐</span>
              Non-Citizen
            </button>
            <button
              onClick={() => setActiveTab('business')}
              className={`flex items-center px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeTab === 'business'
                  ? 'bg-green-100 text-green-700 border border-green-200'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <span className="mr-2">💼</span>
              Business
            </button>
          </div>
        </div>

        {/* Form Container */}
        <div className="flex-1 flex items-center justify-center px-6 lg:px-12 py-8">
          <div className="w-full max-w-md">
            {/* Header */}
            <div className="text-center mb-8">
              <p className="text-gray-500 text-sm font-medium tracking-wider mb-4">
                CITIZEN&apos;S PORTAL
              </p>
              
              {/* Nigerian Coat of Arms */}
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                  <Image
                    src="/coat.png"
                    alt="Nigerian Coat of Arms"
                    width={64}
                    height={64}
                    className="rounded-full"
                  />
                </div>
              </div>

              <h1 className="text-4xl font-bold text-green-600 mb-4">Get Started</h1>
              <p className="text-gray-600">
                {isMonaAttest 
                  ? 'Please securely authenticate yourself'
                  : 'Please enter your credentials to access your account'
                }
              </p>
            </div>

            {/* Form */}
            <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); handleContinue(); }}>
              {/* Show form fields only in Regular mode */}
              {!isMonaAttest && (
                <>
                  {/* NIN Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      NIN
                    </label>
                    <input
                      type="text"
                      value={nin}
                      onChange={(e) => setNin(e.target.value)}
                      placeholder="Enter your 11 digit NIN"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                    />
                  </div>

                  {/* Phone Number Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Enter NIN registered phone number"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                    />
                  </div>
                </>
              )}

              {/* Mona Attest Container */}
              {isMonaAttest && showAttestContainer && (
                <div 
                  ref={attestContainerRef}
                  className="w-full min-h-[400px] bg-white"
                />
              )}

              {/* Continue Button - Only show when not showing attest container */}
              {!(isMonaAttest && showAttestContainer) && (
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-medium py-3 px-4 rounded-lg transition-colors"
                >
                  {isLoading ? 'Processing...' : 'Continue'}
                </button>
              )}

              {/* Sign In Link - Only show in Regular mode */}
              {!isMonaAttest && (
                <div className="text-center">
                  <a href="#" className="text-green-600 hover:text-green-700 text-sm">
                    Have an account? Sign in
                  </a>
                </div>
              )}
            </form>

            {/* Forgot NIN Section - Only show in Regular mode */}
            {!isMonaAttest && (
              <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium text-gray-800 mb-2">Forgot your NIN?</h3>
                <p className="text-gray-600 text-sm">
                  Dial <span className="font-medium text-gray-800">*346#</span> on your NIN registered phone number to retrieve
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}