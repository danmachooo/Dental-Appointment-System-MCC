<template>
    <div class="bg-white shadow overflow-hidden sm:rounded-lg">
      <div class="px-4 py-5 sm:px-6">
        <h3 class="text-lg leading-6 font-medium text-gray-900">
          Book an Appointment
        </h3>
      </div>
      <div class="border-t border-gray-200 px-4 py-5 sm:p-0">
        <dl class="sm:divide-y sm:divide-gray-200">
          <div class="sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 sm:py-5">
            <dt class="text-sm font-medium text-gray-500">
              Select Date
            </dt>
            <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              <input type="date" v-model="selectedDate" @change="fetchAvailableSlots" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
            </dd>
          </div>
          <div class="sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 sm:py-5">
            <dt class="text-sm font-medium text-gray-500">
              Select Service
            </dt>
            <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              <select v-model="selectedService" class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                <option v-for="service in services" :key="service.id" :value="service.id">
                  {{ service.name }} - ${{ service.price }}
                </option>
              </select>
            </dd>
          </div>
          <div class="sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 sm:py-5">
            <dt class="text-sm font-medium text-gray-500">
              Available Time Slots
            </dt>
            <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              <div class="grid grid-cols-3 gap-4">
                <button
                  v-for="slot in availableSlots"
                  :key="slot"
                  @click="selectTimeSlot(slot)"
                  :class="[
                    'px-4 py-2 border rounded-md text-sm font-medium',
                    selectedTimeSlot === slot
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  ]"
                >
                  {{ slot }}
                </button>
              </div>
            </dd>
          </div>
        </dl>
      </div>
      <div class="px-4 py-3 bg-gray-50 text-right sm:px-6">
        <button
          @click="bookAppointment"
          :disabled="!canBookAppointment"
          class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Book Appointment
        </button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from 'vue'
  import api from '@/services/api'
  
  const selectedDate = ref('')
  const selectedService = ref('')
  const selectedTimeSlot = ref('')
  const services = ref([])
  const availableSlots = ref([])
  
  const canBookAppointment = computed(() => 
    selectedDate.value && selectedService.value && selectedTimeSlot.value
  )
  
  onMounted(async () => {
    try {
      const response = await api.getServices()
      services.value = response.data
    } catch (error) {
      console.error('Error fetching services:', error)
    }
  })
  
  const fetchAvailableSlots = async () => {
    if (selectedDate.value) {
      try {
        const response = await api.getAvailableSlots(selectedDate.value)
        availableSlots.value = response.data
      } catch (error) {
        console.error('Error fetching available slots:', error)
      }
    }
  }
  
  const selectTimeSlot = (slot) => {
    selectedTimeSlot.value = slot
  }
  
  const bookAppointment = async () => {
    try {
      const appointmentData = {
        date: selectedDate.value,
        time: selectedTimeSlot.value,
        serviceId: selectedService.value
      }
      await api.bookAppointment(appointmentData)
      // Handle successful booking (e.g., show success message, redirect)
    } catch (error) {
      console.error('Error booking appointment:', error)
      // Handle error (e.g., show error message)
    }
  }
  </script>