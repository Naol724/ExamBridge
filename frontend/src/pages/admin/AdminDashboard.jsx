import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from 'react-query'
import { 
  BookOpen, 
  Users, 
  FileText, 
  MessageSquare, 
  Plus, 
  Edit, 
  Trash2,
  TrendingUp,
  BarChart3,
  Settings
} from 'lucide-react'
import { departmentsAPI, coursesAPI, questionsAPI, notesAPI } from '../services/api'
import LoadingSpinner from '../../components/LoadingSpinner'

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState('overview')

  const { data: departments, isLoading: departmentsLoading } = useQuery(
    'departments',
    departmentsAPI.getAll,
    { staleTime: 5 * 60 * 1000 }
  )

  const { data: courses, isLoading: coursesLoading } = useQuery(
    'courses',
    coursesAPI.getAll,
    { staleTime: 5 * 60 * 1000 }
  )

  const { data: questions, isLoading: questionsLoading } = useQuery(
    'questions',
    questionsAPI.getAll,
    { staleTime: 5 * 60 * 1000 }
  )

  const { data: notes, isLoading: notesLoading } = useQuery(
    'notes',
    notesAPI.getAll,
    { staleTime: 5 * 60 * 1000 }
  )

  const stats = [
    {
      name: 'Departments',
      value: departments?.data?.length || 0,
      icon: BookOpen,
      color: 'text-primary-600 bg-primary-100',
      link: '/admin/departments'
    },
    {
      name: 'Courses',
      value: courses?.data?.length || 0,
      icon: FileText,
      color: 'text-success-600 bg-success-100',
      link: '/admin/courses'
    },
    {
      name: 'Questions',
      value: questions?.data?.length || 0,
      icon: Edit,
      color: 'text-warning-600 bg-warning-100',
      link: '/admin/questions'
    },
    {
      name: 'Study Notes',
      value: notes?.data?.length || 0,
      icon: FileText,
      color: 'text-error-600 bg-error-100',
      link: '/admin/notes'
    }
  ]

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'departments', label: 'Departments', icon: BookOpen },
    { id: 'courses', label: 'Courses', icon: FileText },
    { id: 'questions', label: 'Questions', icon: Edit },
    { id: 'notes', label: 'Study Notes', icon: FileText },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'settings', label: 'Settings', icon: Settings }
  ]

  if (departmentsLoading || coursesLoading || questionsLoading || notesLoading) {
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
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Manage and monitor the ExamBridge HU platform
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <button className="btn btn-md btn-primary flex items-center">
            <Plus className="h-4 w-4 mr-2" />
            Add Content
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <nav className="p-4">
              <ul className="space-y-2">
                {menuItems.map((item) => {
                  const Icon = item.icon
                  return (
                    <li key={item.id}>
                      <button
                        onClick={() => setActiveSection(item.id)}
                        className={`
                          w-full flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors
                          ${activeSection === item.id
                            ? 'bg-primary-50 text-primary-600 border-r-2 border-primary-600'
                            : 'text-gray-700 hover:bg-gray-50'
                          }
                        `}
                      >
                        <Icon className="h-4 w-4 mr-3" />
                        {item.label}
                      </button>
                    </li>
                  )
                })}
              </ul>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {activeSection === 'overview' && (
            <div className="space-y-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                  <Link
                    key={index}
                    to={stat.link}
                    className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md hover:border-primary-300 transition-all"
                  >
                    <div className="flex items-center">
                      <div className={`p-3 rounded-full ${stat.color}`}>
                        <stat.icon className="h-6 w-6" />
                      </div>
                      <div className="ml-4">
                        <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                        <p className="text-sm text-gray-600">{stat.name}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Recent Activity */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2 text-primary-600" />
                    Recent Activity
                  </h2>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-success-100 rounded-full flex items-center justify-center mr-3">
                          <FileText className="h-4 w-4 text-success-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">New study note uploaded</p>
                          <p className="text-sm text-gray-500">Computer Networks - 2 hours ago</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                          <Users className="h-4 w-4 text-primary-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">New student registered</p>
                          <p className="text-sm text-gray-500">Software Engineering - 5 hours ago</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-warning-100 rounded-full flex items-center justify-center mr-3">
                          <Edit className="h-4 w-4 text-warning-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">Questions added</p>
                          <p className="text-sm text-gray-500">Database Systems - 1 day ago</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link
                  to="/admin/departments/new"
                  className="flex items-center p-4 bg-white border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors"
                >
                  <BookOpen className="h-8 w-8 text-primary-600 mr-3" />
                  <div>
                    <p className="font-medium text-gray-900">Add Department</p>
                    <p className="text-sm text-gray-500">Create new academic department</p>
                  </div>
                </Link>
                
                <Link
                  to="/admin/courses/new"
                  className="flex items-center p-4 bg-white border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors"
                >
                  <FileText className="h-8 w-8 text-primary-600 mr-3" />
                  <div>
                    <p className="font-medium text-gray-900">Add Course</p>
                    <p className="text-sm text-gray-500">Create new course</p>
                  </div>
                </Link>
                
                <Link
                  to="/admin/notes/upload"
                  className="flex items-center p-4 bg-white border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors"
                >
                  <Plus className="h-8 w-8 text-primary-600 mr-3" />
                  <div>
                    <p className="font-medium text-gray-900">Upload Notes</p>
                    <p className="text-sm text-gray-500">Add study materials</p>
                  </div>
                </Link>
              </div>
            </div>
          )}

          {/* Other sections would be implemented here */}
          {activeSection !== 'overview' && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
              <div className="text-center">
                <Settings className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {menuItems.find(item => item.id === activeSection)?.label}
                </h3>
                <p className="text-gray-500">
                  This section is under development. Check back soon for full functionality.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
