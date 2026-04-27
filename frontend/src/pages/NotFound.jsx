import React from 'react'
import { Link } from 'react-router-dom'
import { Home, ArrowLeft } from 'lucide-react'

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-primary-600">404</h1>
          <h2 className="text-3xl font-semibold text-gray-900 mt-4 mb-4">
            Page Not Found
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
            Sorry, we couldn't find the page you're looking for. 
            The page might have been removed, renamed, or is temporarily unavailable.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/dashboard"
            className="btn btn-md btn-primary flex items-center justify-center"
          >
            <Home className="h-4 w-4 mr-2" />
            Go to Dashboard
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className="btn btn-md btn-outline flex items-center justify-center"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </button>
        </div>

        <div className="mt-12">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            You might be looking for:
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
            <Link
              to="/departments"
              className="p-4 bg-white rounded-lg border border-gray-200 hover:border-primary-300 hover:shadow-md transition-all text-left"
            >
              <h4 className="font-medium text-gray-900 mb-1">Departments</h4>
              <p className="text-sm text-gray-600">Browse all academic departments</p>
            </Link>
            
            <Link
              to="/dashboard"
              className="p-4 bg-white rounded-lg border border-gray-200 hover:border-primary-300 hover:shadow-md transition-all text-left"
            >
              <h4 className="font-medium text-gray-900 mb-1">Dashboard</h4>
              <p className="text-sm text-gray-600">View your personalized dashboard</p>
            </Link>
            
            <Link
              to="/profile"
              className="p-4 bg-white rounded-lg border border-gray-200 hover:border-primary-300 hover:shadow-md transition-all text-left"
            >
              <h4 className="font-medium text-gray-900 mb-1">Profile</h4>
              <p className="text-sm text-gray-600">Manage your account settings</p>
            </Link>
            
            <Link
              to="/"
              className="p-4 bg-white rounded-lg border border-gray-200 hover:border-primary-300 hover:shadow-md transition-all text-left"
            >
              <h4 className="font-medium text-gray-900 mb-1">Home</h4>
              <p className="text-sm text-gray-600">Return to the homepage</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NotFound
