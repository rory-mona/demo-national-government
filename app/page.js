"use client"

import Image from 'next/image'
import { useState, useRef, useEffect } from 'react'

export default function LoginPage() {
  const [activeTab, setActiveTab] = useState('citizen')
  const [nin, setNin] = useState('')
  const [phone, setPhone] = useState('')
  const [isMonaAttest, setIsMonaAttest] = useState(true) // Always use Mona Attest
  const [isLoading, setIsLoading] = useState(false)
  const [showAttestContainer, setShowAttestContainer] = useState(false)
  const [iframeActive, setIframeActive] = useState(false)
  const [containerHeight, setContainerHeight] = useState(null)
  const [showClearDataModal, setShowClearDataModal] = useState(false)
  const [scale, setScale] = useState(0.6)
  const attestContainerRef = useRef(null)
  const mobileToggleRef = useRef(null)
  const desktopToggleRef = useRef(null)
  const longPressTimerRef = useRef(null)

  const handleContinue = async () => {
    // Always use Mona Attest login
    await handleMonaAttestLogin()
  }

  const handleMonaAttestLogin = async () => {
    setIsLoading(true)
    setShowAttestContainer(true)
    
    // Capture current height before hiding UI (same as oyaMoney)
    if (attestContainerRef.current) {
      setContainerHeight(attestContainerRef.current.scrollHeight)
    }
    
    setIframeActive(true) // Hide UI when iframe starts (same as oyaMoney)
    
    try {
      // No need for discoveryId - SDK will handle enrollment flow automatically

      // Initialize AttestFrontendSDK with same config as oyaMoney utility function
      let AttestFrontendSDK
      try {
        const sdkModule = await import('@usemona/attest-frontend-sdk')
        AttestFrontendSDK = sdkModule.AttestFrontendSDK
      } catch (error) {
        console.error('Failed to load AttestFrontendSDK:', error)
        throw new Error('AttestFrontendSDK not available')
      }
      
      const clientId = process.env.NEXT_PUBLIC_MONA_CLIENT_ID || 'api_68599512ewfef1ee33f910a_12222529311_wefwefwef'
      const targetElement = attestContainerRef.current
      
      console.log('🔧 handleMonaAttestLogin - targetElement:', targetElement ? 'provided' : 'not provided')
      
      // Use EXACT same config pattern as oyaMoney's createAttestFrontendSDK utility
      const env = process.env.NEXT_PUBLIC_ENV
      const frontendUrl = process.env.NEXT_PUBLIC_ATTEST_FRONTEND
      const apiUrl = process.env.NEXT_PUBLIC_ATTESTTOOL_BACKEND_URL
      
      console.log('🔧 AttestSDK: Environment variables from Next.js', {
        env,
        frontendUrl,
        apiUrl,
        clientId,
        targetElement: targetElement ? 'provided' : 'not provided'
      })
      
      const attestSDK = new AttestFrontendSDK({
        clientId,
        targetElement: targetElement || undefined,
        // Pass environment variables directly (EXACT same as oyaMoney utility)
        frontendUrl: env !== 'production' && frontendUrl ? frontendUrl : undefined,
        apiUrl: env !== 'production' && apiUrl ? apiUrl : undefined
      })
      
      // Debug: Check if iframe was created and is visible
      setTimeout(() => {
        const iframe = targetElement?.querySelector('iframe')
        console.log('🔍 Debug iframe after SDK creation:', {
          targetElement: targetElement,
          iframe: iframe,
          iframeStyle: iframe ? iframe.style.cssText : 'no iframe',
          iframeSrc: iframe ? iframe.src : 'no iframe'
        })
      }, 1000)
      
   
      // Real Mona API login endpoint
      const monaApiUrl = process.env.NEXT_PUBLIC_MONA_API
      if (!monaApiUrl) {
        throw new Error('Mona API URL not configured')
      }
      
      const loginUrl = `${monaApiUrl}/api/auth/login`
      
      const response = await attestSDK.fetchWithAttestation(
        loginUrl,
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
      setIframeActive(false) // Show UI again when process completes (same as oyaMoney)
    }
  }

  const onLoginSuccess = async (token, user) => {
    console.log('Login successful:', { token, user })
    // Redirect to dashboard
    window.location.href = '/dashboard'
  }

  const handleToggleMouseDown = () => {
    longPressTimerRef.current = setTimeout(() => {
      setShowClearDataModal(true)
    }, 500) // 500ms for long press
  }

  const handleToggleMouseUp = () => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current)
      longPressTimerRef.current = null
    }
  }

  const handleToggleContextMenu = (e) => {
    e.preventDefault()
    setShowClearDataModal(true)
  }

  const handleClearData = () => {
    // Clear all localStorage and sessionStorage except attestScale
    const attestScale = localStorage.getItem('attestScale')
    localStorage.clear()
    sessionStorage.clear()
    
    // Restore attestScale
    if (attestScale) {
      localStorage.setItem('attestScale', attestScale)
    }
    
    setShowClearDataModal(false)
    // Optionally refresh the page or show a success message
    window.location.reload()
  }

  const handleScaleChange = (newScale) => {
    setScale(newScale)
    localStorage.setItem('attestScale', newScale.toString())
  }

  // Load scale from localStorage when modal opens
  useEffect(() => {
    if (showClearDataModal) {
      const savedScale = localStorage.getItem('attestScale')
      if (savedScale) {
        setScale(parseFloat(savedScale))
      }
    }
  }, [showClearDataModal])

  return (
    <div className="min-h-screen bg-white flex flex-col lg:flex-row">

      {/* Mobile Settings - Visible on mobile only */}
      <div className="lg:hidden bg-green-50 p-4 border-b border-green-100">
        <div className="flex items-center justify-between">
         
          
          {/* Settings Gear Icon */}
          <button
            ref={mobileToggleRef}
            onClick={() => setShowClearDataModal(true)}
            onMouseDown={handleToggleMouseDown}
            onMouseUp={handleToggleMouseUp}
            onMouseLeave={handleToggleMouseUp}
            onTouchStart={handleToggleMouseDown}
            onTouchEnd={handleToggleMouseUp}
            onContextMenu={handleToggleContextMenu}
            className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-100 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            title="Click or long press for settings"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Left Panel - Hidden on mobile */}
      <div className="hidden lg:flex lg:w-1/2 bg-green-50 p-8 flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
         
          
          {/* Settings Gear Icon - Desktop */}
          <button
            ref={desktopToggleRef}
            onClick={() => setShowClearDataModal(true)}
            onMouseDown={handleToggleMouseDown}
            onMouseUp={handleToggleMouseUp}
            onMouseLeave={handleToggleMouseUp}
            onTouchStart={handleToggleMouseDown}
            onTouchEnd={handleToggleMouseUp}
            onContextMenu={handleToggleContextMenu}
            className="p-3 text-gray-600 hover:text-green-600 hover:bg-green-100 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            title="Click or long press for settings"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
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
              Republic of Nadira is home to the<br />
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
              
              {/* Republic of Nadira Coat of Arms */}
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                  <Image
                    src="/coat.png"
                    alt="Republic of Nadira Coat of Arms"
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

            {/* Show iframe container when active */}
            {iframeActive && (
              <div 
                ref={attestContainerRef}
                className="w-full min-h-[400px] bg-white"
                style={containerHeight ? { minHeight: `${containerHeight}px` } : {}}
              />
            )}

            {/* Show form when iframe is NOT active */}
            {!iframeActive && (
              <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); handleContinue(); }}>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-medium py-3 px-4 rounded-lg transition-colors"
                >
                  {isLoading ? 'Processing...' : 'Continue'}
                </button>
              </form>
            )}

            {/* Hidden container for SDK targeting when not active */}
            {!iframeActive && (
              <div 
                ref={attestContainerRef}
                className="w-full h-0 overflow-hidden"
              />
            )}
          </div>
        </div>
      </div>

      {/* Clear Data Modal */}
      {showClearDataModal && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setShowClearDataModal(false)}
        >
          <div 
            className="bg-white rounded-lg p-6 max-w-sm mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Attest SDK Configuration
              </h3>
              <p className="text-sm text-gray-500 mb-6">
                Configure the scale factor and manage your data settings.
              </p>

              {/* Scale Slider */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Scale Factor: <span className="font-bold text-green-600">{scale}</span>
                </label>
                <div className="space-y-3">
                  <input
                    type="range"
                    min="0.1"
                    max="2.0"
                    step="0.1"
                    value={scale}
                    onChange={(e) => handleScaleChange(parseFloat(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>0.1</span>
                    <span>0.5</span>
                    <span>1.0</span>
                    <span>1.5</span>
                    <span>2.0</span>
                  </div>
                </div>
                
                {/* Quick Presets */}
                <div className="mt-3">
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleScaleChange(0.3)}
                      className="px-2 py-1 text-xs border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                    >
                      Small (0.3)
                    </button>
                    <button
                      onClick={() => handleScaleChange(0.6)}
                      className="px-2 py-1 text-xs border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                    >
                      Medium (0.6)
                    </button>
                    <button
                      onClick={() => handleScaleChange(1.0)}
                      className="px-2 py-1 text-xs border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                    >
                      Normal (1.0)
                    </button>
                    <button
                      onClick={() => handleScaleChange(1.5)}
                      className="px-2 py-1 text-xs border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                    >
                      Large (1.5)
                    </button>
                  </div>
                </div>
              </div>
              <div className="flex flex-col space-y-3">
                <button
                  onClick={() => setShowClearDataModal(false)}
                  className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleClearData}
                  className="w-full px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                >
                  Clear Data
                </button>
                <button
                  onClick={() => {
                    const attestUrl = process.env.NEXT_PUBLIC_ATTEST_FRONTEND + '/config'
                    window.open(attestUrl, '_blank')
                  }}
                  className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                >
                  Clear Attest Data
                </button>
                <button
                  onClick={() => {
                    const monaUrl = process.env.NEXT_PUBLIC_MONA_FRONTEND + '/config'
                    window.open(monaUrl, '_blank')
                  }}
                  className="w-full px-4 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
                >
                  Clear Mona Data
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}