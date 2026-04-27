import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { X, Home, BookOpen, Users, MessageSquare, User, Settings } from 'lucide-react'

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation()

  const isActivePath = (path) => {
    return location.pathname === path
  }

  const sidebarItems = [
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: Home,
    },
    {
      name: 'Departments',
      path: '/departments',
      icon: BookOpen,
    },
    {
      name: 'Profile',
      path: '/profile',
      icon: User,
    },
  ]

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed top-0 left-0 z-50 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
          lg:translate-x-0 lg:static lg:z-0
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Menu</h2>
          <button
            onClick={onClose}
            className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="p-4">
          <ul className="space-y-2">
            {sidebarItems.map((item) => {
              const Icon = item.icon
              return (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    onClick={onClose}
                    className={`
                      flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors
                      ${isActivePath(item.path)
                        ? 'bg-primary-50 text-primary-600 border-r-2 border-primary-600'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                      }
                    `}
                  >
                    <Icon className="h-5 w-5 mr-3" />
                    {item.name}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* User info section */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center">
              <span className="text-white font-medium">
                {localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user'))?.name?.charAt(0).toUpperCase() : 'U'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user'))?.name : 'User'}
              </p>
              <p className="text-xs text-gray-500 capitalize">
                {localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user'))?.role : 'student'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Sidebar
