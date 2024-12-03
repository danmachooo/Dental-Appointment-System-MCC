<template>
  <div class="bg-white shadow overflow-hidden sm:rounded-lg">
    <div class="px-4 py-5 sm:px-6">
      <h3 class="text-lg leading-6 font-medium text-gray-900">
        Manage Appointments
      </h3>
      <p class="mt-1 max-w-2xl text-sm text-gray-500">
        View and manage upcoming appointments.
      </p>
    </div>
    <div v-if="loading">
      <LoadingSpinner />
    </div>
    <div v-else-if="error" class="px-4 py-5 sm:p-6 text-red-600">
      {{ error }}
    </div>
    <div v-else class="border-t border-gray-200 px-4 py-5 sm:p-0">
      <ul class="divide-y divide-gray-200">
        <li v-for="appointment in appointments" :key="appointment.id" class="py-4">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-900">{{ appointment.patientName }}</p>
              <p class="text-sm text-gray-500">{{ formatDate(appointment.date) }} at {{ appointment.time }}</p>
              <p class="text-sm text-gray-500">Service: {{ appointment.service }}</p>
            </div>
            <div class="flex space-x-2">
              <button @click="updateAppointmentStatus(appointment.id, 'confirmed')" class="px-3 py-1 bg-green-500 text-white rounded-md text-sm">Confirm</button>
              <button @click="updateAppointmentStatus(appointment.id, 'cancelled')" class="px-3 py-1 bg-red-500 text-white rounded-md text-sm">Cancel</button>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useStore } from 'vuex'
import LoadingSpinner from '@/components/LoadingSpinner.vue'

const store = useStore()
const appointments = ref([])
const loading = ref(true)
const error = ref(null)

onMounted(async () => {
  try {
    await store.dispatch('fetchAppointments')
    appointments.value = store.state.appointments
  } catch (err) {
    error.value = 'Failed to load appointments. Please try again.'
  } finally {
    loading.value = false
  }
})

const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' }
  return new Date(dateString).toLocaleDateString(undefined, options)
}

const updateAppointmentStatus = async (appointmentId, status) => {
  try {
    await store.dispatch('updateAppointmentStatus', { appointmentId, status })
    // Refresh appointments after update
    await store.dispatch('fetchAppointments')
    appointments.value = store.state.appointments
  } catch (err) {
    error.value = `Failed to update appointment status. Please try again.`
  }
}
</script>