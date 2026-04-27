import React, { useState, useEffect, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { useSocket } from '../contexts/SocketContext'
import { useAuth } from '../contexts/AuthContext'
import { coursesAPI, chatAPI } from '../services/api'
import LoadingSpinner from '../components/LoadingSpinner'
import { Send, Users, ArrowLeft, Smile } from 'lucide-react'
import { getRelativeTime } from '../utils/helpers'

const Chat = () => {
  const { courseId } = useParams()
  const { user } = useAuth()
  const { socket, connected, joinRoom, leaveRoom, sendMessage } = useSocket()
  const queryClient = useQueryClient()
  
  const [message, setMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [typingUsers, setTypingUsers] = useState([])
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  const { data: course, isLoading: courseLoading } = useQuery(
    ['course', courseId],
    () => coursesAPI.getById(courseId),
    {
      enabled: !!courseId,
      staleTime: 5 * 60 * 1000,
    }
  )

  const { data: messagesData, isLoading: messagesLoading } = useQuery(
    ['chatMessages', courseId],
    () => chatAPI.getMessages(courseId),
    {
      enabled: !!courseId,
      staleTime: 2 * 60 * 1000, // 2 minutes
    }
  )

  const sendMessageMutation = useMutation(chatAPI.sendMessage, {
    onSuccess: (newMessage) => {
      queryClient.setQueryData(['chatMessages', courseId], (old) => ({
        ...old,
        data: [...(old?.data || []), newMessage.data]
      }))
      setMessage('')
      inputRef.current?.focus()
    },
  })

  // Join room when component mounts
  useEffect(() => {
    if (courseId && connected) {
      joinRoom(courseId)
      return () => leaveRoom(courseId)
    }
  }, [courseId, connected, joinRoom, leaveRoom])

  // Socket event listeners
  useEffect(() => {
    if (!socket) return

    const handleNewMessage = (newMessage) => {
      queryClient.setQueryData(['chatMessages', courseId], (old) => ({
        ...old,
        data: [...(old?.data || []), newMessage]
      }))
      scrollToBottom()
    }

    const handleUserJoined = (data) => {
      console.log('User joined:', data)
    }

    const handleUserLeft = (data) => {
      console.log('User left:', data)
    }

    const handleUserTyping = ({ userName }) => {
      setTypingUsers(prev => {
        const filtered = prev.filter(name => name !== userName)
        return [...filtered, userName]
      })
    }

    const handleUserStopTyping = ({ userName }) => {
      setTypingUsers(prev => prev.filter(name => name !== userName))
    }

    socket.on('newMessage', handleNewMessage)
    socket.on('userJoined', handleUserJoined)
    socket.on('userLeft', handleUserLeft)
    socket.on('userTyping', handleUserTyping)
    socket.on('userStopTyping', handleUserStopTyping)

    return () => {
      socket.off('newMessage', handleNewMessage)
      socket.off('userJoined', handleUserJoined)
      socket.off('userLeft', handleUserLeft)
      socket.off('userTyping', handleUserTyping)
      socket.off('userStopTyping', handleUserStopTyping)
    }
  }, [socket, courseId, queryClient])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messagesData?.data])

  const handleSendMessage = (e) => {
    e.preventDefault()
    if (message.trim() && connected) {
      sendMessageMutation.mutate({
        courseId,
        message: message.trim()
      })
    }
  }

  const handleTyping = (value) => {
    setMessage(value)
    
    if (!isTyping && value.trim()) {
      setIsTyping(true)
      // Emit typing event (implementation depends on your socket setup)
    }
    
    if (isTyping && !value.trim()) {
      setIsTyping(false)
      // Emit stop typing event
    }
  }

  if (courseLoading || messagesLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  const courseData = course?.data
  const messages = messagesData?.data || []

  return (
    <div className="h-full flex flex-col bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Chat Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link
              to={`/courses/${courseId}`}
              className="mr-3 p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </Link>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {courseData?.name}
              </h2>
              <div className="flex items-center text-sm text-gray-500">
                <Users className="h-4 w-4 mr-1" />
                {connected ? (
                  <span className="text-success-600">Connected</span>
                ) : (
                  <span className="text-warning-600">Connecting...</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center py-8">
            <Users className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg._id}
              className={`flex ${msg.user._id === user?.id ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  msg.user._id === user?.id
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                {msg.user._id !== user?.id && (
                  <p className="text-xs font-medium mb-1 opacity-75">
                    {msg.user.name}
                  </p>
                )}
                <p className="text-sm break-words">{msg.message}</p>
                <p className={`text-xs mt-1 ${
                  msg.user._id === user?.id ? 'text-primary-200' : 'text-gray-500'
                }`}>
                  {getRelativeTime(msg.timestamp)}
                </p>
              </div>
            </div>
          ))
        )}
        
        {/* Typing Indicator */}
        {typingUsers.length > 0 && (
          <div className="flex justify-start">
            <div className="bg-gray-100 px-4 py-2 rounded-lg">
              <p className="text-sm text-gray-600">
                {typingUsers.join(', ')} {typingUsers.length === 1 ? 'is' : 'are'} typing...
              </p>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="border-t border-gray-200 p-4">
        <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
          <button
            type="button"
            className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
          >
            <Smile className="h-5 w-5" />
          </button>
          
          <input
            ref={inputRef}
            type="text"
            value={message}
            onChange={(e) => handleTyping(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 input"
            disabled={!connected}
          />
          
          <button
            type="submit"
            disabled={!message.trim() || !connected || sendMessageMutation.isLoading}
            className="p-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {sendMessageMutation.isLoading ? (
              <LoadingSpinner size="sm" />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </button>
        </form>
        
        {!connected && (
          <p className="text-sm text-warning-600 mt-2 text-center">
            Connecting to chat room...
          </p>
        )}
      </div>
    </div>
  )
}

export default Chat
