"use client"

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function RevenueService() {
  const router = useRouter()
  const [isMonaAttest, setIsMonaAttest] = useState(false)
  const [showAttestContainer, setShowAttestContainer] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [user, setUser] = useState(null)
  const attestContainerRef = useRef(null)

  useEffect(() => {
    // Check if Mona Attest is enabled
    const frontendUrl = process.env.NEXT_PUBLIC_ATTEST_FRONTEND
    const apiUrl = process.env.NEXT_PUBLIC_ATTEST_BACKEND
    setIsMonaAttest(!!(frontendUrl && apiUrl))

    // Get user data from localStorage
    const userData = localStorage.getItem('paymonaUser')
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  const handleMonaAttestLogin = async () => {
    setIsLoading(true)
    setShowAttestContainer(true)

    try {
      // Mock discovery call
      const discoveryResponse = await fetch('/api/consent/oyamoney-discovery', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          component: 'RevenueService'
        })
      })

      if (!discoveryResponse.ok) {
        throw new Error('Discovery failed')
      }

      // Load and initialize AttestFrontendSDK
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
        apiUrl: apiUrl,
        scale: 1.0
      }

      const attestSDK = new AttestFrontendSDK(config)

      // Grow the target component by 50% when SDK is instantiated
      if (attestContainerRef.current) {
        attestContainerRef.current.style.transform = 'scale(1.5)'
        attestContainerRef.current.style.transformOrigin = 'center'
        attestContainerRef.current.style.transition = 'transform 0.3s ease-in-out'
      }

      // Real Mona API login endpoint
      const monaApiUrl = process.env.NEXT_PUBLIC_MONA_API
      if (!monaApiUrl) {
        throw new Error('Mona API URL not configured')
      }
      
      const loginUrl = `${monaApiUrl}/api/auth/login`
      
      // Use fetchWithAttestation for the login call
      const response = await attestSDK.fetchWithAttestation(loginUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      })

      if (response.ok) {
        const data = await response.json()
        localStorage.setItem('paymonaToken', data.token)
        localStorage.setItem('paymonaUser', JSON.stringify(data.user))
        
        // Navigate to revenue dashboard
        router.push('/services/revenue/dashboard')
      } else {
        throw new Error('Login failed')
      }
    } catch (error) {
      console.error('Mona Attest login error:', error)
      setShowAttestContainer(false)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegularLogin = () => {
    // Navigate directly to revenue dashboard
    router.push('/services/revenue/dashboard')
  }

  const handleBack = () => {
    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <button
                onClick={handleBack}
                className="mr-4 text-gray-500 hover:text-gray-700"
              >
                ← Back to Dashboard
              </button>
              <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center mr-3">
                <span className="text-white text-lg font-bold">G</span>
              </div>
              <h1 className="text-xl font-semibold text-gray-900">National Revenue & Customs</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Panel - Content */}
          <div className="flex flex-col justify-center">
            <div className="mb-8">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                National Revenue & Customs
              </h2>
              <p className="text-xl text-gray-600 mb-6">
                {isMonaAttest 
                  ? 'Please securely authenticate yourself to access tax and customs services'
                  : 'Please enter your credentials to access tax and customs services'
                }
              </p>
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Available Services</h3>
                <ul className="space-y-3">
                  <li className="flex items-center text-gray-700">
                    <span className="text-green-500 mr-3">•</span>
                    File personal & corporate taxes online
                  </li>
                  <li className="flex items-center text-gray-700">
                    <span className="text-green-500 mr-3">•</span>
                    Apply for tax identification credentials
                  </li>
                  <li className="flex items-center text-gray-700">
                    <span className="text-green-500 mr-3">•</span>
                    View compliance certificates
                  </li>
                  <li className="flex items-center text-gray-700">
                    <span className="text-green-500 mr-3">•</span>
                    Submit import/export declarations
                  </li>
                </ul>
              </div>

              {/* Mona Attest Toggle */}
              {isMonaAttest && (
                <div className="flex items-center space-x-3">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={showAttestContainer}
                      onChange={(e) => setShowAttestContainer(e.target.checked)}
                      className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Use Secure Authentication</span>
                  </label>
                </div>
              )}

              {/* Continue Button or Attest Container */}
              {showAttestContainer ? (
                <div 
                  ref={attestContainerRef}
                  className="w-full min-h-[400px] border border-gray-300 rounded-lg bg-white"
                />
              ) : (
                <button
                  onClick={isMonaAttest ? handleMonaAttestLogin : handleRegularLogin}
                  disabled={isLoading}
                  className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold py-4 px-6 rounded-lg transition-colors"
                >
                  {isLoading ? 'Processing...' : 'Continue'}
                </button>
              )}

              {isMonaAttest && (
                <p className="text-center text-sm text-gray-500">
                  Have an account? Sign in on regular login side.
                </p>
              )}
            </div>
          </div>

          {/* Right Panel - Image */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative w-full max-w-md">
              <Image
                src="/coat.png"
                alt="Republic of Nadira Coat of Arms"
                width={400}
                height={400}
                className="w-full h-auto"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
