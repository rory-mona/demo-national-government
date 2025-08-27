"use client"

import { useState, useEffect } from 'react'
import Image from 'next/image'

export default function Dashboard() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    // Get user data from localStorage
    const userData = localStorage.getItem('paymonaUser')
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  const services = [
    {
      id: 'revenue',
      title: 'National Revenue & Customs',
      description: 'Tax filing, compliance, and customs services',
      actions: [
        'File personal & corporate taxes online',
        'Apply for tax identification credentials',
        'View compliance certificates',
        'Submit import/export declarations'
      ]
    },
    {
      id: 'electoral',
      title: 'Independent Electoral Authority',
      description: 'Voter registration and electoral services',
      actions: [
        'Register as a voter',
        'Verify voting credentials & polling location',
        'View election timetables & accredited results',
        'Apply for observer/agent accreditation',
        '(Future) Secure digital voting'
      ]
    },
    {
      id: 'education',
      title: 'National Education Services',
      description: 'Educational enrollment and academic services',
      actions: [
        'Enrol learners in basic or secondary education',
        'Access learner ID and academic records',
        'Pay exam fees & retrieve results',
        'Verify teacher credentials',
        'Apply for national scholarships or bursaries'
      ]
    },
    {
      id: 'transport',
      title: 'National Transport & Vehicle Registry',
      description: 'Vehicle registration and licensing services',
      actions: [
        'Register a vehicle',
        'Renew operator licences',
        'Pay for number plate issuance/replacement',
        'View ownership history & fines',
        'Report lost or stolen vehicles'
      ]
    },
    {
      id: 'corporate',
      title: 'Corporate & Business Registry',
      description: 'Business registration and corporate services',
      actions: [
        'Register a new enterprise or company',
        'File annual statutory returns',
        'Update directors/shareholders',
        'Search public business records',
        'Download incorporation certificates'
      ]
    },
    {
      id: 'health',
      title: 'National Health & Wellness Services',
      description: 'Healthcare and wellness services',
      actions: [
        'View vaccination & health records',
        'Retrieve birth certificates',
        'Access medical test results',
        'Book hospital appointments / telehealth',
        'Report outbreaks & access health advisories'
      ]
    }
  ]

  const handleServiceClick = (serviceId) => {
    // Navigate to specific service page
    if (serviceId === 'revenue') {
      window.location.href = '/services/revenue'
    } else if (serviceId === 'electoral') {
      window.location.href = '/services/electoral'
    } else if (serviceId === 'education') {
      window.location.href = '/services/education'
    } else {
      console.log(`Navigating to ${serviceId} service`)
      // You can add routing logic here for other services
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('paymonaToken')
    localStorage.removeItem('paymonaUser')
    window.location.href = '/'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center mr-3">
                <span className="text-white text-lg font-bold">G</span>
              </div>
              <h1 className="text-xl font-semibold text-gray-900">Nigerian E-Government Portal</h1>
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
            Government Services Dashboard
          </h2>
          <p className="text-gray-600 text-lg">
            Access all government services in one centralized platform.
          </p>
        </div>

        {/* User Control Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          {/* Last Login & Services Used */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Account Activity</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-600">Last Login</p>
                  <p className="text-lg font-semibold text-gray-900">Today, 2:34 PM</p>
                  <p className="text-xs text-gray-500">From Lagos, Nigeria</p>
                </div>
                <div className="pt-4 border-t border-gray-100">
                  <p className="text-sm font-medium text-gray-600">Services Used</p>
                  <p className="text-lg font-semibold text-gray-900">3 of 6</p>
                  <p className="text-xs text-gray-500">Tax filing, Vehicle reg, Health</p>
                </div>
              </div>
            </div>
          </div>

          {/* Citizen Score with Graph */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Citizen Score</h3>
              <div className="mb-4">
                <p className="text-2xl font-bold text-gray-900">A+ (95/100)</p>
                <p className="text-sm text-gray-600">Excellent compliance</p>
              </div>
              {/* Simple Graph */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Last 6 months</span>
                  <span>Trend: +5 points</span>
                </div>
                <div className="flex items-end space-x-1 h-16">
                  <div className="flex-1 bg-gray-200 rounded-t" style={{height: '40%'}}></div>
                  <div className="flex-1 bg-gray-200 rounded-t" style={{height: '60%'}}></div>
                  <div className="flex-1 bg-gray-200 rounded-t" style={{height: '50%'}}></div>
                  <div className="flex-1 bg-gray-200 rounded-t" style={{height: '70%'}}></div>
                  <div className="flex-1 bg-gray-200 rounded-t" style={{height: '80%'}}></div>
                  <div className="flex-1 bg-green-500 rounded-t" style={{height: '95%'}}></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Jan</span>
                  <span>Feb</span>
                  <span>Mar</span>
                  <span>Apr</span>
                  <span>May</span>
                  <span>Jun</span>
                </div>
              </div>
            </div>
          </div>

          {/* Upcoming Deadlines Calendar */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Upcoming Deadlines</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-orange-50 rounded-lg border border-orange-200">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                    <span className="text-orange-600 text-sm font-semibold">15</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Tax Filing Deadline</p>
                    <p className="text-xs text-gray-600">Personal Income Tax</p>
                  </div>
                  <span className="text-xs text-orange-600 font-medium">15 days</span>
                </div>
                
                <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-blue-600 text-sm font-semibold">28</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Vehicle License Renewal</p>
                    <p className="text-xs text-gray-600">Driver&apos;s License</p>
                  </div>
                  <span className="text-xs text-blue-600 font-medium">28 days</span>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <span className="text-gray-600 text-sm font-semibold">45</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Business Registration</p>
                    <p className="text-xs text-gray-600">Annual Returns</p>
                  </div>
                  <span className="text-xs text-gray-600 font-medium">45 days</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <div
              key={service.id}
              onClick={() => handleServiceClick(service.id)}
              className="bg-white border border-gray-200 rounded-xl p-6 cursor-pointer transition-all duration-200 hover:shadow-lg hover:border-green-300 group flex flex-col h-full"
            >
              {/* Service Header */}
              <div className="mb-4">
                <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-green-600 transition-colors">
                  {service.title}
                </h3>
                <p className="text-sm text-gray-600">{service.description}</p>
              </div>

              {/* Actions in Grey Box */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6 flex-grow">
                <h4 className="text-xs font-semibold text-gray-700 mb-3 uppercase tracking-wide">
                  Available Services:
                </h4>
                <ul className="space-y-1">
                  {service.actions.map((action, index) => (
                    <li key={index} className="text-xs text-gray-600 flex items-start">
                      <span className="text-green-500 mr-2 mt-1">•</span>
                      <span>{action}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Access Button - Hugs Bottom */}
              <div className="mt-auto pt-4 border-t border-gray-100">
                <button className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition-colors">
                  Access Service
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-gray-200">
          <div className="text-center text-sm text-gray-500">
            <p>© 2024 Federal Government of Nigeria. All rights reserved.</p>
            <p className="mt-1">
              Need assistance? Contact{' '}
              <a href="mailto:support@egov.ng" className="text-green-600 hover:text-green-700">
                support@egov.ng
              </a>
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
