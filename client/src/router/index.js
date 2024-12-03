import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import Login from '@/views/Login.vue'
import Registration from '@/views/Registration.vue'
import UserProfile from '@/views/UserProfile.vue'
import BookAppointment from '@/views/BookAppointment.vue'
import ManageAppointments from '@/views/ManageAppointments.vue'
import Messaging from '@/views/Messaging.vue'
import ManageServices from '@/views/ManageServices.vue'
import AppointmentHistory from '@/views/AppointmentHistory.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/register',
    name: 'Registration',
    component: Registration
  },
  {
    path: '/profile',
    name: 'UserProfile',
    component: UserProfile,
    meta: { requiresAuth: true }
  },
  {
    path: '/book-appointment',
    name: 'BookAppointment',
    component: BookAppointment,
    meta: { requiresAuth: true, role: 'patient' }
  },
  {
    path: '/manage-appointments',
    name: 'ManageAppointments',
    component: ManageAppointments,
    meta: { requiresAuth: true, role: 'dentist' }
  },
  {
    path: '/messaging',
    name: 'Messaging',
    component: Messaging,
    meta: { requiresAuth: true }
  },
  {
    path: '/manage-services',
    name: 'ManageServices',
    component: ManageServices,
    meta: { requiresAuth: true, role: 'dentist' }
  },
  {
    path: '/appointment-history',
    name: 'AppointmentHistory',
    component: AppointmentHistory,
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem('token')
  const userRole = localStorage.getItem('userRole')

  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!isAuthenticated) {
      next({ name: 'Login' })
    } else if (to.meta.role && to.meta.role !== userRole) {
      next({ name: 'Home' })
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router