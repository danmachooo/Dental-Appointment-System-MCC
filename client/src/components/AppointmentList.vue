<template>
    <ul class="divide-y divide-gray-200">
      <li v-for="appointment in appointments" :key="appointment.id" class="py-4">
        <div class="flex items-center space-x-4">
          <div class="flex-shrink-0">
            <CalendarIcon class="h-6 w-6 text-gray-400" />
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-gray-900 truncate">
              {{ appointment.service }}
            </p>
            <p class="text-sm text-gray-500">
              {{ formatDate(appointment.date) }} at {{ appointment.time }}
            </p>
          </div>
          <div>
            <span :class="[
              'px-2 inline-flex text-xs leading-5 font-semibold rounded-full',
              statusColors[appointment.status]
            ]">
              {{ appointment.status }}
            </span>
          </div>
        </div>
      </li>
    </ul>
  </template>
  
  <script setup>
  import { CalendarIcon } from 'lucide-vue-next'
  
  const props = defineProps({
    appointments: {
      type: Array,
      required: true
    }
  })
  
  const statusColors = {
    scheduled: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
    completed: 'bg-blue-100 text-blue-800'
  }
  
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }
  </script>