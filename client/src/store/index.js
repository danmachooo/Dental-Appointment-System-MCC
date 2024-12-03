import { createStore } from 'vuex'
import api from '@/services/api'

export default createStore({
  state: {
    user: null,
    appointments: [],
    upcomingAppointments: [],
    appointmentHistory: [],
    services: [],
    messages: [],
  },
  mutations: {
    setUser(state, user) {
      state.user = user
    },
    setAppointments(state, appointments) {
      state.appointments = appointments
    },
    setUpcomingAppointments(state, appointments) {
      state.upcomingAppointments = appointments
    },
    setAppointmentHistory(state, appointments) {
      state.appointmentHistory = appointments
    },
    setServices(state, services) {
      state.services = services
    },
    setMessages(state, messages) {
      state.messages = messages
    },
  },
  actions: {
    async register({ commit }, userData) {
      try {
        const response = await api.register(userData)
        commit('setUser', response.data.user)
        localStorage.setItem('token', response.data.token)
        return response.data
      } catch (error) {
        console.error('Registration error:', error)
        throw error
      }
    },
    async login({ commit }, credentials) {
      try {
        const response = await api.login(credentials)
        commit('setUser', response.data.user)
        localStorage.setItem('token', response.data.token)
        return response.data
      } catch (error) {
        console.error('Login error:', error)
        throw error
      }
    },
    async fetchUserProfile({ commit }) {
      try {
        const response = await api.getUserProfile()
        commit('setUser', response.data)
      } catch (error) {
        console.error('Error fetching user profile:', error)
        throw error
      }
    },
    async updateUserProfile({ commit }, userData) {
      try {
        const response = await api.updateUserProfile(userData)
        commit('setUser', response.data)
      } catch (error) {
        console.error('Error updating user profile:', error)
        throw error
      }
    },
    logout({ commit }) {
      localStorage.removeItem('token')
      commit('setUser', null)
    },
    async fetchAppointments({ commit }) {
      try {
        const response = await api.getAppointments()
        commit('setAppointments', response.data)
      } catch (error) {
        console.error('Error fetching appointments:', error)
        throw error
      }
    },
    async fetchUpcomingAppointments({ commit }) {
      try {
        const response = await api.getUpcomingAppointments()
        commit('setUpcomingAppointments', response.data)
      } catch (error) {
        console.error('Error fetching upcoming appointments:', error)
        throw error
      }
    },
    async fetchAppointmentHistory({ commit }) {
      try {
        const response = await api.getAppointmentHistory()
        commit('setAppointmentHistory', response.data)
      } catch (error) {
        console.error('Error fetching appointment history:', error)
        throw error
      }
    },
    async updateAppointmentStatus({ dispatch }, { appointmentId, status }) {
      try {
        await api.updateAppointmentStatus(appointmentId, status)
        dispatch('fetchAppointments')
      } catch (error) {
        console.error('Error updating appointment status:', error)
        throw error
      }
    },
    async fetchServices({ commit }) {
      try {
        const response = await api.getServices()
        commit('setServices', response.data)
      } catch (error) {
        console.error('Error fetching services:', error)
        throw error
      }
    },
    async createService({ dispatch }, serviceData) {
      try {
        await api.createService(serviceData)
        dispatch('fetchServices')
      } catch (error) {
        console.error('Error creating service:', error)
        throw error
      }
    },
    async updateService({ dispatch }, { id, ...serviceData }) {
      try {
        await api.updateService(id, serviceData)
        dispatch('fetchServices')
      } catch (error) {
        console.error('Error updating service:', error)
        throw error
      }
    },
    async deleteService({ dispatch }, serviceId) {
      try {
        await api.deleteService(serviceId)
        dispatch('fetchServices')
      } catch (error) {
        console.error('Error deleting service:', error)
        throw error
      }
    },
    async fetchMessages({ commit }) {
      try {
        const response = await api.getMessages()
        commit('setMessages', response.data)
      } catch (error) {
        console.error('Error fetching messages:', error)
        throw error
      }
    },
    async sendMessage({ dispatch }, messageContent) {
      try {
        await api.sendMessage(messageContent)
        dispatch('fetchMessages')
      } catch (error) {
        console.error('Error sending message:', error)
        throw error
      }
    },
    async fetchAvailableSlots({ commit }, { date, serviceId }) {
      try {
        const response = await api.getAvailableSlots(date, serviceId)
        return response.data
      } catch (error) {
        console.error('Error fetching available slots:', error)
        throw error
      }
    },
    async bookAppointment({ dispatch }, appointmentData) {
      try {
        await api.bookAppointment(appointmentData)
        dispatch('fetchUpcomingAppointments')
      } catch (error) {
        console.error('Error booking appointment:', error)
        throw error
      }
    },
  },
  getters: {
    isAuthenticated: (state) => !!state.user,
    userRole: (state) => state.user ? state.user.role : null,
  },
})