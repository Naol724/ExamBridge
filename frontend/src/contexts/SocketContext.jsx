import React, { createContext, useContext, useEffect, useState } from 'react'
import { io } from 'socket.io-client'
import { useAuth } from './AuthContext'

const SocketContext = createContext()

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null)
  const [connected, setConnected] = useState(false)
  const { token, isAuthenticated } = useAuth()

  useEffect(() => {
    if (isAuthenticated && token) {
      // Initialize socket connection
      const newSocket = io(process.env.NODE_ENV === 'production' 
        ? 'https://your-backend-domain.com' 
        : 'http://localhost:5000', {
        auth: {
          token: `Bearer ${token}`
        },
        transports: ['websocket', 'polling']
      })

      newSocket.on('connect', () => {
        console.log('Socket connected:', newSocket.id)
        setConnected(true)
      })

      newSocket.on('disconnect', () => {
        console.log('Socket disconnected')
        setConnected(false)
      })

      newSocket.on('connect_error', (error) => {
        console.error('Socket connection error:', error)
        setConnected(false)
      })

      setSocket(newSocket)

      // Cleanup on unmount
      return () => {
        newSocket.close()
        setSocket(null)
        setConnected(false)
      }
    } else {
      // Disconnect socket when not authenticated
      if (socket) {
        socket.close()
        setSocket(null)
        setConnected(false)
      }
    }
  }, [isAuthenticated, token])

  // Socket event handlers
  const joinRoom = (courseId) => {
    if (socket && connected) {
      socket.emit('joinRoom', courseId)
    }
  }

  const leaveRoom = (courseId) => {
    if (socket && connected) {
      socket.emit('leaveRoom', courseId)
    }
  }

  const sendMessage = (courseId, message) => {
    if (socket && connected) {
      socket.emit('sendMessage', { courseId, message })
    }
  }

  const startTyping = (courseId, userName) => {
    if (socket && connected) {
      socket.emit('typing', { courseId, userName })
    }
  }

  const stopTyping = (courseId, userName) => {
    if (socket && connected) {
      socket.emit('stopTyping', { courseId, userName })
    }
  }

  const value = {
    socket,
    connected,
    joinRoom,
    leaveRoom,
    sendMessage,
    startTyping,
    stopTyping,
  }

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  )
}

export const useSocket = () => {
  const context = useContext(SocketContext)
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider')
  }
  return context
}
