<template>
    <div class="bg-white shadow overflow-hidden sm:rounded-lg">
      <div class="px-4 py-5 sm:px-6">
        <h3 class="text-lg leading-6 font-medium text-gray-900">
          Welcome to Dental Appointment System
        </h3>
        <p class="mt-1 max-w-2xl text-sm text-gray-500">
          Book your dental appointment with ease.
        </p>
      </div>
      <div class="border-t border-gray-200">
        <dl>
          <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt class="text-sm font-medium text-gray-500">
              Total Appointments
            </dt>
            <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {{ totalAppointments }}
            </dd>
          </div>
          <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt class="text-sm font-medium text-gray-500">
              Available Services
            </dt>
            <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {{ availableServices }}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  
  const totalAppointments = ref(0)
  const availableServices = ref(0)
  
  onMounted(async () => {
    // Fetch data from API
    // For demonstration purposes, we'll use placeholder values
    totalAppointments.value = 150
    availableServices.value = 10
  })
  </script>