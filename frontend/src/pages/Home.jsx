import React from 'react'
import { Link } from 'react-router-dom'
import { BookOpen, Users, MessageSquare, Award, ArrowRight, CheckCircle } from 'lucide-react'

const Home = () => {
  const features = [
    {
      icon: BookOpen,
      title: 'Academic Resources',
      description: 'Access comprehensive study materials, past questions, and notes organized by department and semester.',
    },
    {
      icon: Users,
      title: 'Department Structure',
      description: 'Navigate through 5 departments with year-based and semester-based organization for optimal learning.',
    },
    {
      icon: MessageSquare,
      title: 'Real-time Chat',
      description: 'Connect with peers in course-specific chat rooms for collaborative learning and discussion.',
    },
    {
      icon: Award,
      title: 'Exit Exam Prep',
      description: 'Prepare for final examinations with specialized materials and practice questions.',
    },
  ]

  const departments = [
    'Software Engineering',
    'Computer Science',
    'Information Systems',
    'Information Technology',
    'Information Science',
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Welcome to <span className="text-primary-600">ExamBridge HU</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Your centralized academic platform for CCI students at Haramaya University. 
              Access study materials, connect with peers, and excel in your academic journey.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="btn btn-lg btn-primary px-8 py-3 rounded-lg font-medium inline-flex items-center justify-center"
              >
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                to="/login"
                className="btn btn-lg btn-outline px-8 py-3 rounded-lg font-medium inline-flex items-center justify-center"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need for Academic Success
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Comprehensive tools and resources designed specifically for CCI students
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center group">
                <div className="mx-auto w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-6 group-hover:bg-primary-200 transition-colors">
                  <feature.icon className="h-8 w-8 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Departments Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Supported Departments
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Full support for all CCI departments with structured academic content
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {departments.map((dept, index) => (
              <div key={index} className="card p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center mb-4">
                  <CheckCircle className="h-5 w-5 text-success-500 mr-3" />
                  <h3 className="text-lg font-semibold text-gray-900">{dept}</h3>
                </div>
                <p className="text-gray-600">
                  {dept === 'Software Engineering' ? '5 Years (10 Semesters)' : '4 Years (8 Semesters)'}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Transform Your Learning Experience?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Join thousands of CCI students already using ExamBridge HU for academic excellence.
          </p>
          <Link
            to="/register"
            className="btn btn-lg bg-white text-primary-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-medium inline-flex items-center justify-center"
          >
            Start Your Journey
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <BookOpen className="h-8 w-8 text-primary-400 mr-2" />
              <span className="text-xl font-bold">ExamBridge HU</span>
            </div>
            <p className="text-gray-400">
              © 2024 ExamBridge HU. Empowering CCI students at Haramaya University.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Home
