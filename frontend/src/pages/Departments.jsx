import React from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from 'react-query'
import { BookOpen, Clock, Users, Grid } from 'lucide-react'
import { departmentsAPI } from '../services/api'
import LoadingSpinner from '../components/LoadingSpinner'

const Departments = () => {
  const { data: departments, isLoading } = useQuery(
    'departments',
    departmentsAPI.getAll,
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  )

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Departments</h1>
          <p className="text-gray-600 mt-2">
            Browse through all available departments and their academic programs
          </p>
        </div>
        <div className="flex items-center text-sm text-gray-500">
          <Grid className="h-4 w-4 mr-2" />
          {departments?.data?.length || 0} Departments
        </div>
      </div>

      {/* Departments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {departments?.data?.map((dept, index) => (
          <Link
            key={dept._id}
            to={`/departments/${dept._id}`}
            className="group bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-lg hover:border-primary-300 transition-all duration-200"
          >
            <div className="p-6">
              {/* Department Icon */}
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-primary-200 transition-colors">
                <BookOpen className="h-8 w-8 text-primary-600" />
              </div>

              {/* Department Info */}
              <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                {dept.name}
              </h3>
              
              <p className="text-gray-600 mb-4">
                {dept.description || `Comprehensive ${dept.name.toLowerCase()} program with modern curriculum and industry-relevant courses.`}
              </p>

              {/* Department Stats */}
              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-500">
                  <Clock className="h-4 w-4 mr-2" />
                  {dept.total_years} Year{dept.total_years > 1 ? 's' : ''} Program
                </div>
                
                <div className="flex items-center text-sm text-gray-500">
                  <Users className="h-4 w-4 mr-2" />
                  {dept.total_years * 2} Semesters
                </div>
              </div>

              {/* View Details Button */}
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-primary-600 group-hover:text-primary-700">
                    Explore Courses
                  </span>
                  <svg 
                    className="h-4 w-4 text-primary-600 group-hover:translate-x-1 transition-transform" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Empty State */}
      {departments?.data?.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Departments Available</h3>
          <p className="text-gray-500">
            Departments will be available once they are added by the administrator.
          </p>
        </div>
      )}

      {/* Department Overview Card */}
      <div className="bg-gradient-to-r from-primary-50 to-primary-100 rounded-lg p-6 border border-primary-200">
        <h2 className="text-xl font-semibold text-primary-900 mb-4">
          Academic Structure Overview
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-primary-800 font-medium mb-2">Program Duration</h3>
            <ul className="space-y-1 text-primary-700 text-sm">
              <li>• Software Engineering: 5 Years (10 Semesters)</li>
              <li>• Computer Science: 4 Years (8 Semesters)</li>
              <li>• Information Systems: 4 Years (8 Semesters)</li>
            </ul>
          </div>
          <div>
            <h3 className="text-primary-800 font-medium mb-2">Available Resources</h3>
            <ul className="space-y-1 text-primary-700 text-sm">
              <li>• Past Exam Questions & Answers</li>
              <li>• Practice Questions by Difficulty</li>
              <li>• PDF Notes & Study Materials</li>
              <li>• Real-time Course Chat Rooms</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Departments
