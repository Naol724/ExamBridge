import React, { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery } from 'react-query'
import { BookOpen, FileText, MessageSquare, Download, Users, Clock, Star, Filter } from 'lucide-react'
import { coursesAPI, questionsAPI, notesAPI } from '../services/api'
import LoadingSpinner from '../components/LoadingSpinner'
import { formatDate, formatFileSize } from '../utils/helpers'

const CourseDetail = () => {
  const { id } = useParams()
  const [activeTab, setActiveTab] = useState('questions')
  const [questionFilter, setQuestionFilter] = useState('all')

  const { data: course, isLoading: courseLoading } = useQuery(
    ['course', id],
    () => coursesAPI.getById(id),
    {
      enabled: !!id,
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  )

  const { data: questions, isLoading: questionsLoading } = useQuery(
    ['questions', id, questionFilter],
    () => questionsAPI.getByCourse(id, questionFilter !== 'all' ? { type: questionFilter } : {}),
    {
      enabled: !!id && activeTab === 'questions',
      staleTime: 5 * 60 * 1000,
    }
  )

  const { data: notes, isLoading: notesLoading } = useQuery(
    ['notes', id],
    () => notesAPI.getByCourse(id),
    {
      enabled: !!id && activeTab === 'notes',
      staleTime: 5 * 60 * 1000,
    }
  )

  if (courseLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  const courseData = course?.data
  const questionsList = questions?.data || []
  const notesList = notes?.data || []

  return (
    <div className="space-y-6">
      {/* Course Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg p-8 text-white">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center mb-3">
              <BookOpen className="h-8 w-8 mr-3" />
              <h1 className="text-3xl font-bold">{courseData?.name}</h1>
            </div>
            <p className="text-primary-100 mb-4 max-w-3xl">
              {courseData?.description || `Comprehensive study materials and resources for ${courseData?.name}.`}
            </p>
            <div className="flex items-center space-x-6 text-sm">
              <span className="flex items-center">
                <Users className="h-4 w-4 mr-1" />
                {courseData?.semester?.name}
              </span>
              {courseData?.credits && (
                <span className="flex items-center">
                  <Star className="h-4 w-4 mr-1" />
                  {courseData.credits} Credits
                </span>
              )}
              <span className="flex items-center">
                <FileText className="h-4 w-4 mr-1" />
                {courseData?.stats?.questionsCount || 0} Questions
              </span>
              <span className="flex items-center">
                <Download className="h-4 w-4 mr-1" />
                {courseData?.stats?.notesCount || 0} Notes
              </span>
            </div>
          </div>
          
          {/* Chat Button */}
          <Link
            to={`/chat/${id}`}
            className="bg-white text-primary-600 px-6 py-3 rounded-lg font-medium hover:bg-primary-50 transition-colors flex items-center"
          >
            <MessageSquare className="h-5 w-5 mr-2" />
            Join Chat
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('questions')}
            className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'questions'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Questions ({courseData?.stats?.questionsCount || 0})
          </button>
          <button
            onClick={() => setActiveTab('notes')}
            className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'notes'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Study Notes ({courseData?.stats?.notesCount || 0})
          </button>
        </div>

        <div className="p-6">
          {/* Questions Tab */}
          {activeTab === 'questions' && (
            <div className="space-y-4">
              {/* Filter */}
              <div className="flex items-center space-x-4">
                <Filter className="h-4 w-4 text-gray-400" />
                <select
                  value={questionFilter}
                  onChange={(e) => setQuestionFilter(e.target.value)}
                  className="text-sm border border-gray-300 rounded-md px-3 py-1"
                >
                  <option value="all">All Questions</option>
                  <option value="past">Past Exam Questions</option>
                  <option value="practice">Practice Questions</option>
                </select>
              </div>

              {questionsLoading ? (
                <LoadingSpinner />
              ) : questionsList.length > 0 ? (
                <div className="space-y-3">
                  {questionsList.map((question) => (
                    <div key={question._id} className="border border-gray-200 rounded-lg p-4 hover:border-primary-300 transition-colors">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 mb-2">
                            {question.question_text}
                          </h4>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span className="badge badge-secondary">
                              {question.type === 'past' ? 'Past Exam' : 'Practice'}
                            </span>
                            {question.year_of_exam && (
                              <span>Year: {question.year_of_exam}</span>
                            )}
                            <span className="badge badge-warning">
                              {question.difficulty}
                            </span>
                            <span>{question.marks} marks</span>
                          </div>
                        </div>
                      </div>
                      
                      {question.options && question.options.length > 0 && (
                        <div className="mt-3 space-y-2">
                          {question.options.map((option, index) => (
                            <div
                              key={index}
                              className={`p-2 rounded text-sm ${
                                option.is_correct
                                  ? 'bg-success-50 text-success-700 border border-success-200'
                                  : 'bg-gray-50 text-gray-700 border border-gray-200'
                              }`}
                            >
                              {String.fromCharCode(65 + index)}. {option.text}
                              {option.is_correct && ' ✓'}
                            </div>
                          ))}
                        </div>
                      )}
                      
                      {question.correct_answer && !question.options && (
                        <div className="mt-3 p-3 bg-success-50 text-success-700 rounded-lg text-sm">
                          <strong>Answer:</strong> {question.correct_answer}
                        </div>
                      )}
                      
                      {question.explanation && (
                        <div className="mt-3 p-3 bg-blue-50 text-blue-700 rounded-lg text-sm">
                          <strong>Explanation:</strong> {question.explanation}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <FileText className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p>No questions available yet</p>
                </div>
              )}
            </div>
          )}

          {/* Notes Tab */}
          {activeTab === 'notes' && (
            <div className="space-y-4">
              {notesLoading ? (
                <LoadingSpinner />
              ) : notesList.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {notesList.map((note) => (
                    <div key={note._id} className="border border-gray-200 rounded-lg p-4 hover:border-primary-300 transition-colors">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-gray-900 flex-1 mr-2">
                          {note.title}
                        </h4>
                        <span className="text-xs text-gray-500 whitespace-nowrap">
                          {formatFileSize(note.file_size)}
                        </span>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-3">
                        {note.description || 'Study material for this course'}
                      </p>
                      
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                        <span>Uploaded by {note.uploaded_by?.name}</span>
                        <span>{formatDate(note.createdAt)}</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-xs text-gray-500">
                          <Download className="h-3 w-3 mr-1" />
                          {note.download_count} downloads
                        </div>
                        
                        <a
                          href={note.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary-600 hover:text-primary-500 text-sm font-medium flex items-center"
                        >
                          View/Download
                          <svg className="h-4 w-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <FileText className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p>No study notes available yet</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CourseDetail
