import axios from 'axios'

const API_URL = process.env.VUE_APP_API_URL || 'http://localhost:3000/api'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add a request interceptor to include the auth token in all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

export default {
  // Auth
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),

  // User Profile
  getUserProfile: () => api.get('/user/profile'),
  updateUserProfile: (userData) => api.put('/user/profile', userData),

  // Appointments
  getAppointments: () => api.get('/appointments'),
  getUpcomingAppointments: () => api.get('/appointments/upcoming'),
  getAppointmentHistory: () => api.get('/appointments/history'),
  updateAppointmentStatus: (appointmentId, status) => api.put(`/appointments/${appointmentId}/status`, { status }),
  getAvailableSlots: (date, serviceId) => api.get('/appointments/available-slots', { params: { date, serviceId } }),
  bookAppointment: (appointmentData) => api.post('/appointments', appointmentData),

  // Services
  getServices: () => api.get('/services'),
  createService: (serviceData) => api.post('/services', serviceData),
  updateService: (id, serviceData) => api.put(`/services/${id}`, serviceData),
  deleteService: (id) => api.delete(`/services/${id}`),

  // Messages
  getMessages: () => api.get('/messages'),
  sendMessage: (messageContent) => api.post('/messages', { content: messageContent }),
}