<template>
  <div class="bg-white shadow overflow-hidden sm:rounded-lg">
    <div class="px-4 py-5 sm:px-6">
      <h3 class="text-lg leading-6 font-medium text-gray-900">
        Appointment History
      </h3>
      <p class="mt-1 max-w-2xl text-sm text-gray-500">
        View your past appointments.
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
              <p class="text-sm font-medium text-gray-900">{{ appointment.service }}</p>
              <p class="text-sm text-gray-500">{{ formatDate(appointment.date) }} at {{ appointment.time }}</p>
              <p class="text-sm text-gray-500">Status: {{ appointment.status }}</p>
            </div>
            <div>
              <span :class="[
                'px-2 py-1 text-xs font-medium rounded-full',
                appointment.status === 'completed' ? 'bg-green-100 text-green-800' :
                appointment.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                'bg-yellow-100 text-yellow-800'
              ]">
                {{ appointment.status }}
              </span>
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
    await store.dispatch('fetchAppointmentHistory')
    appointments.value = store.state.appointmentHistory
  } catch (err) {
    error.value = 'Failed to load appointment history. Please try again.'
  } finally {
    loading.value = false
  }
})

const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' }
  return new Date(dateString).toLocaleDateString(undefined, options)
}
</script>