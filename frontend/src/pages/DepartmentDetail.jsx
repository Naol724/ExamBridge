import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery } from 'react-query'
import { BookOpen, Calendar, FileText, Users, ChevronRight } from 'lucide-react'
import { departmentsAPI, yearsAPI } from '../services/api'
import LoadingSpinner from '../components/LoadingSpinner'

const DepartmentDetail = () => {
  const { id } = useParams()

  const { data: department, isLoading: deptLoading } = useQuery(
    ['department', id],
    () => departmentsAPI.getById(id),
    {
      enabled: !!id,
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  )

  const { data: years, isLoading: yearsLoading } = useQuery(
    ['years', id],
    () => yearsAPI.getByDepartment(id),
    {
      enabled: !!id,
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  )

  if (deptLoading || yearsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  const dept = department?.data
  const yearsList = years?.data || []

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm text-gray-500">
        <Link to="/departments" className="hover:text-primary-600">
          Departments
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-gray-900 font-medium">{dept?.name}</span>
      </nav>

      {/* Department Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg p-8 text-white">
        <div className="flex items-center mb-4">
          <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mr-4">
            <BookOpen className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">{dept?.name}</h1>
            <p className="text-primary-100">
              {dept?.total_years} Year{dept?.total_years > 1 ? 's' : ''} Program
            </p>
          </div>
        </div>
        <p className="text-primary-100 max-w-3xl">
          {dept?.description || `Comprehensive ${dept?.name?.toLowerCase()} program designed to provide students with strong theoretical foundation and practical skills in modern computing and information technology.`}
        </p>
      </div>

      {/* Program Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-primary-600" />
                Academic Structure
              </h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {yearsList.map((year, index) => (
                  <div key={year._id} className="border border-gray-200 rounded-lg p-4 hover:border-primary-300 transition-colors">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {year.name}
                      </h3>
                      <span className="badge badge-primary">
                        Year {year.year_number}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <Link
                        to={`/years/${year._id}/semester-1`}
                        className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-primary-50 hover:text-primary-600 transition-colors"
                      >
                        <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                          <span className="text-primary-600 font-semibold text-sm">1</span>
                        </div>
                        <div>
                          <p className="font-medium">Semester 1</p>
                          <p className="text-sm text-gray-500">First half of the year</p>
                        </div>
                      </Link>
                      
                      <Link
                        to={`/years/${year._id}/semester-2`}
                        className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-primary-50 hover:text-primary-600 transition-colors"
                      >
                        <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                          <span className="text-primary-600 font-semibold text-sm">2</span>
                        </div>
                        <div>
                          <p className="font-medium">Semester 2</p>
                          <p className="text-sm text-gray-500">Second half of the year</p>
                        </div>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Department Stats */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Program Statistics</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-600">Duration</span>
                </div>
                <span className="font-medium">{dept?.total_years} Years</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <FileText className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-600">Total Semesters</span>
                </div>
                <span className="font-medium">{dept?.total_years * 2}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Users className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-600">Students Enrolled</span>
                </div>
                <span className="font-medium">250+</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Links</h3>
            <div className="space-y-2">
              <Link
                to={`/departments/${id}/exit-exam`}
                className="block p-3 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-600 rounded-lg transition-colors"
              >
                🎓 Exit Exam Preparation
              </Link>
              <Link
                to={`/departments/${id}/resources`}
                className="block p-3 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-600 rounded-lg transition-colors"
              >
                📚 Study Resources
              </Link>
              <Link
                to={`/departments/${id}/faculty`}
                className="block p-3 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-600 rounded-lg transition-colors"
              >
                👨‍🏫 Faculty Members
              </Link>
            </div>
          </div>

          {/* Program Highlights */}
          <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-lg p-6 border border-primary-200">
            <h3 className="text-lg font-semibold text-primary-900 mb-3">Program Highlights</h3>
            <ul className="space-y-2 text-sm text-primary-800">
              <li>• Industry-relevant curriculum</li>
              <li>• Experienced faculty members</li>
              <li>• Modern laboratory facilities</li>
              <li>• Research opportunities</li>
              <li>• Career development support</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DepartmentDetail
