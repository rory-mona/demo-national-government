"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function ScalePage() {
  const router = useRouter()
  const [scale, setScale] = useState(0.6)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Load scale from localStorage
    const savedScale = localStorage.getItem('attestScale')
    if (savedScale) {
      setScale(parseFloat(savedScale))
    }
  }, [])

  const handleScaleChange = (newScale) => {
    setScale(newScale)
    localStorage.setItem('attestScale', newScale.toString())
  }

  const handleSave = () => {
    setIsLoading(true)
    // Simulate save operation
    setTimeout(() => {
      setIsLoading(false)
      alert(`Scale updated to ${scale}! This will apply to all attest SDK instances.`)
    }, 500)
  }

  const handleClearData = () => {
    if (confirm('Are you sure you want to clear all data? This will log you out and clear all stored information except scale settings.')) {
      // Get current scale value
      const currentScale = localStorage.getItem('attestScale')
      
      // Clear all localStorage
      localStorage.clear()
      
      // Clear all sessionStorage
      sessionStorage.clear()
      
      // Restore scale setting
      if (currentScale) {
        localStorage.setItem('attestScale', currentScale)
      }
      
      alert('All data cleared successfully! You will be redirected to the home page.')
      router.push('/')
    }
  }

  const handleBack = () => {
    router.push('/')
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
                ← Back to Login
              </button>
              <Image
                src="/coat.png"
                alt="Republic of Nadira Coat of Arms"
                width={32}
                height={32}
                className="w-8 h-8 object-contain mr-3"
              />
              <h1 className="hidden md:block text-xl font-semibold text-gray-900">Republic of Nadira E-Government Portal</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Attest SDK Scale Configuration
            </h2>
            <p className="text-gray-600 text-lg">
              Configure the scale factor used by the Mona Attest SDK across the application.
            </p>
          </div>

          <div className="space-y-8">
            {/* Scale Slider */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Scale Factor: <span className="font-bold text-green-600">{scale}</span>
              </label>
              <div className="space-y-4">
                <input
                  type="range"
                  min="0.1"
                  max="2.0"
                  step="0.1"
                  value={scale}
                  onChange={(e) => handleScaleChange(parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>0.1 (10%)</span>
                  <span>0.5 (50%)</span>
                  <span>1.0 (100%)</span>
                  <span>1.5 (150%)</span>
                  <span>2.0 (200%)</span>
                </div>
              </div>
            </div>

            {/* Quick Presets */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Presets</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <button
                  onClick={() => handleScaleChange(0.3)}
                  className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Small (0.3)
                </button>
                <button
                  onClick={() => handleScaleChange(0.6)}
                  className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Medium (0.6)
                </button>
                <button
                  onClick={() => handleScaleChange(1.0)}
                  className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Normal (1.0)
                </button>
                <button
                  onClick={() => handleScaleChange(1.5)}
                  className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Large (1.5)
                </button>
              </div>
            </div>

            {/* Description */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-blue-900 mb-2">How Scale Works</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• <strong>0.1-0.5:</strong> Very small - content appears tiny</li>
                <li>• <strong>0.6-0.9:</strong> Small - content appears smaller than normal</li>
                <li>• <strong>1.0:</strong> Normal - default size</li>
                <li>• <strong>1.1-1.5:</strong> Large - content appears larger</li>
                <li>• <strong>1.6-2.0:</strong> Very large - content appears very large</li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between items-center pt-6 border-t border-gray-200">
              <button
                onClick={handleClearData}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Clear All Data
              </button>
              <button
                onClick={handleSave}
                disabled={isLoading}
                className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                {isLoading ? 'Saving...' : 'Save Configuration'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
