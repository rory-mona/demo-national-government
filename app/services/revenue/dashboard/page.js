"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function RevenueDashboard() {
  const router = useRouter()
  const [user, setUser] = useState(null)

  useEffect(() => {
    // Get user data from localStorage
    const userData = localStorage.getItem('paymonaUser')
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  const handleBack = () => {
    router.push('/dashboard')
  }

  const handleLogout = () => {
    localStorage.removeItem('paymonaToken')
    localStorage.removeItem('paymonaUser')
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
                ← Back to Main Dashboard
              </button>
              <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center mr-3">
                <span className="text-white text-lg font-bold">G</span>
              </div>
              <h1 className="text-xl font-semibold text-gray-900">National Revenue & Customs</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              {user && (
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 text-sm font-medium">
                      {user.name?.charAt(0) || 'U'}
                    </span>
                  </div>
                  <span className="text-sm text-gray-700">{user.name || 'User'}</span>
                </div>
              )}
              <button
                onClick={handleLogout}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-12 bg-white rounded-lg p-8 shadow-sm">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            Revenue & Customs Dashboard
          </h2>
          <p className="text-gray-600 text-lg">
            Manage your tax filings, compliance, and customs declarations.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-md transition-shadow cursor-pointer">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-blue-600 text-xl">📄</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">File Tax Return</h3>
            <p className="text-sm text-gray-600">Submit your personal or corporate tax return</p>
          </div>

          <div className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-md transition-shadow cursor-pointer">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-green-600 text-xl">🆔</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Tax ID</h3>
            <p className="text-sm text-gray-600">Apply for tax identification credentials</p>
          </div>

          <div className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-md transition-shadow cursor-pointer">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-purple-600 text-xl">📋</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Compliance</h3>
            <p className="text-sm text-gray-600">View compliance certificates and status</p>
          </div>

          <div className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-md transition-shadow cursor-pointer">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-orange-600 text-xl">🚢</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Customs</h3>
            <p className="text-sm text-gray-600">Submit import/export declarations</p>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Filings</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Personal Income Tax 2024</p>
                  <p className="text-sm text-gray-600">Filed on March 15, 2024</p>
                </div>
                <span className="text-green-600 text-sm font-medium">Approved</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">VAT Return Q1 2024</p>
                  <p className="text-sm text-gray-600">Filed on April 30, 2024</p>
                </div>
                <span className="text-yellow-600 text-sm font-medium">Pending</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Deadlines</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg border border-orange-200">
                <div>
                  <p className="font-medium text-gray-900">Corporate Tax Return</p>
                  <p className="text-sm text-gray-600">Due: June 30, 2024</p>
                </div>
                <span className="text-orange-600 text-sm font-medium">15 days</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div>
                  <p className="font-medium text-gray-900">VAT Return Q2</p>
                  <p className="text-sm text-gray-600">Due: July 31, 2024</p>
                </div>
                <span className="text-blue-600 text-sm font-medium">46 days</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-gray-200">
          <div className="text-center text-sm text-gray-500">
            <p>© 2024 Federal Government of Nigeria. All rights reserved.</p>
            <p className="mt-1">
              Need assistance? Contact{' '}
              <a href="mailto:revenue@egov.ng" className="text-green-600 hover:text-green-700">
                revenue@egov.ng
              </a>
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
