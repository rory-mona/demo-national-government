"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function EducationDashboard() {
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
              <h1 className="text-xl font-semibold text-gray-900">National Education Services</h1>
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
            Education Services Dashboard
          </h2>
          <p className="text-gray-600 text-lg">
            Manage educational enrollment, academic records, and student services.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-md transition-shadow cursor-pointer">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-blue-600 text-xl">📚</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Enroll Student</h3>
            <p className="text-sm text-gray-600">Enrol learners in basic or secondary education</p>
          </div>

          <div className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-md transition-shadow cursor-pointer">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-green-600 text-xl">🆔</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Student ID</h3>
            <p className="text-sm text-gray-600">Access learner ID and academic records</p>
          </div>

          <div className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-md transition-shadow cursor-pointer">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-purple-600 text-xl">💰</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Exam Fees</h3>
            <p className="text-sm text-gray-600">Pay exam fees & retrieve results</p>
          </div>

          <div className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-md transition-shadow cursor-pointer">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-orange-600 text-xl">🎓</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Scholarships</h3>
            <p className="text-sm text-gray-600">Apply for national scholarships or bursaries</p>
          </div>
        </div>

        {/* Student Information */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Student Records</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                <div>
                  <p className="font-medium text-gray-900">Enrollment Status</p>
                  <p className="text-sm text-gray-600">Student ID: NED123456789</p>
                </div>
                <span className="text-green-600 text-sm font-medium">Active</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div>
                  <p className="font-medium text-gray-900">Current Level</p>
                  <p className="text-sm text-gray-600">Senior Secondary School Year 2</p>
                </div>
                <span className="text-blue-600 text-sm font-medium">SS2</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Academic Calendar</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg border border-orange-200">
                <div>
                  <p className="font-medium text-gray-900">End of Term Exams</p>
                  <p className="text-sm text-gray-600">Date: June 20, 2024</p>
                </div>
                <span className="text-orange-600 text-sm font-medium">15 days</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div>
                  <p className="font-medium text-gray-900">School Resumption</p>
                  <p className="text-sm text-gray-600">Date: September 9, 2024</p>
                </div>
                <span className="text-gray-600 text-sm font-medium">3 months</span>
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
                <p className="font-medium text-gray-900">Exam Fee Payment</p>
                <p className="text-sm text-gray-600">WAEC fees paid on March 15, 2024</p>
              </div>
              <span className="text-green-600 text-sm font-medium">Completed</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Academic Record Updated</p>
                <p className="text-sm text-gray-600">Mid-term results uploaded on March 10, 2024</p>
              </div>
              <span className="text-blue-600 text-sm font-medium">Updated</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Scholarship Application</p>
                <p className="text-sm text-gray-600">National scholarship applied on February 28, 2024</p>
              </div>
              <span className="text-yellow-600 text-sm font-medium">Pending</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-gray-200">
          <div className="text-center text-sm text-gray-500">
            <p>© 2024 Federal Government of Republic of Nadira. All rights reserved.</p>
            <p className="mt-1">
              Need assistance? Contact{' '}
              <a href="mailto:education@egov.ng" className="text-green-600 hover:text-green-700">
                education@egov.ng
              </a>
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
