"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function ElectoralDashboard() {
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
              <h1 className="text-xl font-semibold text-gray-900">Independent Electoral Authority</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              {user && (
                <div className="flex items-center space-x-2">
                  {user.imageUrl ? (
                    <img 
                      src={user.imageUrl} 
                      alt="User" 
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-green-600 text-sm font-medium">
                        {user.firstName?.charAt(0) || user.lastName?.charAt(0) || 'U'}
                      </span>
                    </div>
                  )}
                  <span className="text-sm text-gray-700">
                    {user.firstName && user.lastName 
                      ? `${user.firstName} ${user.lastName}`
                      : user.firstName || user.lastName || user.email || 'User'
                    }
                  </span>
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
            Electoral Services Dashboard
          </h2>
          <p className="text-gray-600 text-lg">
            Manage your voter registration and electoral services.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-md transition-shadow cursor-pointer">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-blue-600 text-xl">📝</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Register to Vote</h3>
            <p className="text-sm text-gray-600">Register as a voter in your constituency</p>
          </div>

          <div className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-md transition-shadow cursor-pointer">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-green-600 text-xl">🔍</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Verify Credentials</h3>
            <p className="text-sm text-gray-600">Check voting credentials & polling location</p>
          </div>

          <div className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-md transition-shadow cursor-pointer">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-purple-600 text-xl">📅</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Election Schedule</h3>
            <p className="text-sm text-gray-600">View election timetables & results</p>
          </div>

          <div className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-md transition-shadow cursor-pointer">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-orange-600 text-xl">👁️</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Observer Accreditation</h3>
            <p className="text-sm text-gray-600">Apply for observer/agent accreditation</p>
          </div>
        </div>

        {/* Voter Status */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Voter Status</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                <div>
                  <p className="font-medium text-gray-900">Registration Status</p>
                  <p className="text-sm text-gray-600">Voter ID: NGN123456789</p>
                </div>
                <span className="text-green-600 text-sm font-medium">Active</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div>
                  <p className="font-medium text-gray-900">Polling Unit</p>
                  <p className="text-sm text-gray-600">Unit 001, Ward 05, Lagos Central</p>
                </div>
                <span className="text-blue-600 text-sm font-medium">Assigned</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Elections</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg border border-orange-200">
                <div>
                  <p className="font-medium text-gray-900">Local Government Elections</p>
                  <p className="text-sm text-gray-600">Date: July 15, 2024</p>
                </div>
                <span className="text-orange-600 text-sm font-medium">30 days</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div>
                  <p className="font-medium text-gray-900">Presidential Elections</p>
                  <p className="text-sm text-gray-600">Date: February 2027</p>
                </div>
                <span className="text-gray-600 text-sm font-medium">2+ years</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Voter Registration Updated</p>
                <p className="text-sm text-gray-600">Address updated on March 10, 2024</p>
              </div>
              <span className="text-green-600 text-sm font-medium">Completed</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Polling Unit Assignment</p>
                <p className="text-sm text-gray-600">Assigned to new unit on February 28, 2024</p>
              </div>
              <span className="text-blue-600 text-sm font-medium">Updated</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-gray-200">
          <div className="text-center text-sm text-gray-500">
            <p>© 2024 Federal Government of Republic of Nadira. All rights reserved.</p>
            <p className="mt-1">
              Need assistance? Contact{' '}
              <a href="mailto:electoral@egov.ng" className="text-green-600 hover:text-green-700">
                electoral@egov.ng
              </a>
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
