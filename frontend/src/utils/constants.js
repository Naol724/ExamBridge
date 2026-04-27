export const DEPARTMENTS = [
  { name: 'Software Engineering', total_years: 5 },
  { name: 'Computer Science', total_years: 4 },
  { name: 'Information Systems', total_years: 4 },
  { name: 'Information Technology', total_years: 4 },
  { name: 'Information Science', total_years: 4 },
]

export const QUESTION_TYPES = [
  { value: 'past', label: 'Past Exam Questions' },
  { value: 'practice', label: 'Practice Questions' },
]

export const DIFFICULTY_LEVELS = [
  { value: 'easy', label: 'Easy', color: 'success' },
  { value: 'medium', label: 'Medium', color: 'warning' },
  { value: 'hard', label: 'Hard', color: 'error' },
]

export const SEMESTERS = [
  { value: 1, label: 'Semester 1' },
  { value: 2, label: 'Semester 2' },
]

export const USER_ROLES = [
  { value: 'student', label: 'Student' },
  { value: 'admin', label: 'Administrator' },
]

export const FILE_TYPES = {
  PDF: 'application/pdf',
  DOC: 'application/msword',
  DOCX: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
}

export const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

export const API_ENDPOINTS = {
  BASE_URL: process.env.NODE_ENV === 'production' 
    ? 'https://your-backend-domain.com/api' 
    : 'http://localhost:5000/api',
  SOCKET_URL: process.env.NODE_ENV === 'production' 
    ? 'https://your-backend-domain.com' 
    : 'http://localhost:5000',
}

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  DEPARTMENTS: '/departments',
  DEPARTMENT_DETAIL: '/departments/:id',
  COURSE_DETAIL: '/courses/:id',
  CHAT: '/chat/:courseId',
  PROFILE: '/profile',
  ADMIN_DASHBOARD: '/admin',
}

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  DEFAULT_PAGE: 1,
}

export const TOAST_CONFIG = {
  duration: 4000,
  position: 'top-right',
  style: {
    background: '#363636',
    color: '#fff',
  },
  success: {
    duration: 3000,
    iconTheme: {
      primary: '#22c55e',
      secondary: '#fff',
    },
  },
  error: {
    duration: 5000,
    iconTheme: {
      primary: '#ef4444',
      secondary: '#fff',
    },
  },
}
