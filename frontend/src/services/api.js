import axios from 'axios'
import toast from 'react-hot-toast'

// Create axios instance
const api = axios.create({
  baseURL: process.env.NODE_ENV === 'production' 
    ? 'https://your-backend-domain.com/api' 
    : 'http://localhost:5000/api',
  timeout: 10000,
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token')
      window.location.href = '/login'
      toast.error('Session expired. Please login again.')
    } else if (error.response?.status === 403) {
      toast.error('Access denied')
    } else if (error.response?.status >= 500) {
      toast.error('Server error. Please try again later.')
    } else if (error.code === 'ECONNABORTED') {
      toast.error('Request timeout. Please check your connection.')
    } else if (!window.navigator.onLine) {
      toast.error('No internet connection')
    }
    return Promise.reject(error)
  }
)

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getMe: () => api.get('/auth/me'),
}

// Departments API
export const departmentsAPI = {
  getAll: () => api.get('/departments'),
  getById: (id) => api.get(`/departments/${id}`),
  create: (data) => api.post('/departments', data),
  update: (id, data) => api.put(`/departments/${id}`, data),
  delete: (id) => api.delete(`/departments/${id}`),
}

// Years API
export const yearsAPI = {
  getByDepartment: (departmentId) => api.get(`/departments/${departmentId}/years`),
  getById: (id) => api.get(`/years/${id}`),
  create: (data) => api.post('/years', data),
  update: (id, data) => api.put(`/years/${id}`, data),
  delete: (id) => api.delete(`/years/${id}`),
}

// Semesters API
export const semestersAPI = {
  getByYear: (yearId) => api.get(`/years/${yearId}/semesters`),
  getById: (id) => api.get(`/semesters/${id}`),
  create: (data) => api.post('/semesters', data),
  update: (id, data) => api.put(`/semesters/${id}`, data),
  delete: (id) => api.delete(`/semesters/${id}`),
}

// Courses API
export const coursesAPI = {
  getAll: () => api.get('/courses'),
  getBySemester: (semesterId) => api.get(`/semesters/${semesterId}/courses`),
  getById: (id) => api.get(`/courses/${id}`),
  create: (data) => api.post('/courses', data),
  update: (id, data) => api.put(`/courses/${id}`, data),
  delete: (id) => api.delete(`/courses/${id}`),
}

// Questions API
export const questionsAPI = {
  getAll: (params = {}) => api.get('/questions', { params }),
  getByCourse: (courseId, params = {}) => api.get(`/courses/${courseId}/questions`, { params }),
  getPractice: (courseId, params = {}) => api.get(`/courses/${courseId}/practice`, { params }),
  getById: (id) => api.get(`/questions/${id}`),
  create: (data) => api.post('/questions', data),
  update: (id, data) => api.put(`/questions/${id}`, data),
  delete: (id) => api.delete(`/questions/${id}`),
}

// Notes API
export const notesAPI = {
  getAll: (params = {}) => api.get('/notes', { params }),
  getPopular: (params = {}) => api.get('/notes/popular', { params }),
  getByCourse: (courseId) => api.get(`/courses/${courseId}/notes`),
  getById: (id) => api.get(`/notes/${id}`),
  upload: (formData) => api.post('/notes', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  update: (id, data) => api.put(`/notes/${id}`, data),
  delete: (id) => api.delete(`/notes/${id}`),
}

// Chat API
export const chatAPI = {
  getMessages: (courseId, params = {}) => api.get(`/courses/${courseId}/chat`, { params }),
  sendMessage: (courseId, data) => api.post(`/courses/${courseId}/chat`, data),
  editMessage: (messageId, data) => api.put(`/chat/${messageId}`, data),
  deleteMessage: (messageId) => api.delete(`/chat/${messageId}`),
  addReaction: (messageId, data) => api.post(`/chat/${messageId}/reactions`, data),
  getStats: (courseId) => api.get(`/courses/${courseId}/chat/stats`),
}

export default api
