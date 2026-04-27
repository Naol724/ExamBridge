import React from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from 'react-query'
import { BookOpen, Users, MessageSquare, FileText, TrendingUp, Clock, Star } from 'lucide-react'
import { departmentsAPI, notesAPI } from '../services/api'
import LoadingSpinner from '../components/LoadingSpinner'
import { formatDate, truncateText } from '../utils/helpers'

const Dashboard = () => {
  const { user } = useAuth()

  const { data: departments, isLoading: departmentsLoading } = useQuery(
    'departments',
    departmentsAPI.getAll,
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  )

  const { data: popularNotes, isLoading: notesLoading } = useQuery(
    'popularNotes',
    () => notesAPI.getPopular({ limit: 5 }),
    {
      staleTime: 10 * 60 * 1000, // 10 minutes
    }
  )

  const stats = [
    {
      name: 'Departments',
      value: departments?.data?.length || 0,
      icon: BookOpen,
      color: 'text-primary-600 bg-primary-100',
      description: 'Available departments',
    },
    {
      name: 'Total Courses',
      value: departments?.data?.reduce((acc, dept) => acc + (dept.total_years * 2), 0) || 0,
      icon: FileText,
      color: 'text-success-600 bg-success-100',
      description: 'Across all departments',
    },
    {
      name: 'Study Materials',
      value: popularNotes?.data?.length || 0,
      icon: Users,
      color: 'text-warning-600 bg-warning-100',
      description: 'Popular notes available',
    },
    {
      name: 'Active Users',
      value: '1,234',
      icon: TrendingUp,
      color: 'text-error-600 bg-error-100',
      description: 'Students and faculty',
    },
  ]

  if (departmentsLoading || notesLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">
          Welcome back, {user?.name}!
        </h1>
        <p className="text-primary-100">
          {user?.role === 'admin' 
            ? 'Manage the academic platform and oversee all departments.'
            : `Continue your learning journey in ${user?.department?.name || 'your department'}.`
          }
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className={`p-3 rounded-full ${stat.color}`}>
                <stat.icon className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-gray-600">{stat.name}</p>
                <p className="text-xs text-gray-500">{stat.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Departments */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <BookOpen className="h-5 w-5 mr-2 text-primary-600" />
              Departments
            </h2>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              {departments?.data?.slice(0, 5).map((dept, index) => (
                <Link
                  key={index}
                  to={`/departments/${dept._id}`}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                      <span className="text-primary-600 font-semibold text-sm">
                        {dept.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{dept.name}</p>
                      <p className="text-sm text-gray-500">{dept.total_years} Years</p>
                    </div>
                  </div>
                  <div className="text-gray-400">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>
              ))}
            </div>
            {departments?.data?.length > 5 && (
              <Link
                to="/departments"
                className="mt-4 text-primary-600 hover:text-primary-500 text-sm font-medium flex items-center"
              >
                View all departments
                <svg className="h-4 w-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            )}
          </div>
        </div>

        {/* Popular Notes */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <Star className="h-5 w-5 mr-2 text-warning-500" />
              Popular Study Materials
            </h2>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              {popularNotes?.data?.map((note, index) => (
                <div key={index} className="p-3 rounded-lg border border-gray-200 hover:border-primary-300 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 mb-1">
                        {truncateText(note.title, 40)}
                      </h4>
                      <p className="text-sm text-gray-500 mb-2">
                        {note.course?.name}
                      </p>
                      <div className="flex items-center text-xs text-gray-400">
                        <Clock className="h-3 w-3 mr-1" />
                        {formatDate(note.createdAt)}
                      </div>
                    </div>
                    <div className="flex items-center text-xs text-gray-500">
                      <FileText className="h-3 w-3 mr-1" />
                      {note.download_count}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {popularNotes?.data?.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <FileText className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p>No study materials available yet</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/departments"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors"
          >
            <BookOpen className="h-8 w-8 text-primary-600 mr-3" />
            <div>
              <p className="font-medium text-gray-900">Browse Departments</p>
              <p className="text-sm text-gray-500">Explore courses and materials</p>
            </div>
          </Link>
          
          {user?.role === 'student' && (
            <Link
              to="/profile"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors"
            >
              <Users className="h-8 w-8 text-primary-600 mr-3" />
              <div>
                <p className="font-medium text-gray-900">Update Profile</p>
                <p className="text-sm text-gray-500">Manage your account settings</p>
              </div>
            </Link>
          )}
          
          {user?.role === 'admin' && (
            <Link
              to="/admin"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors"
            >
              <MessageSquare className="h-8 w-8 text-primary-600 mr-3" />
              <div>
                <p className="font-medium text-gray-900">Admin Dashboard</p>
                <p className="text-sm text-gray-500">Manage platform content</p>
              </div>
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
