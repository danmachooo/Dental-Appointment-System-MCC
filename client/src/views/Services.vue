<template>
    <div class="bg-white shadow overflow-hidden sm:rounded-lg">
      <div class="px-4 py-5 sm:px-6">
        <h3 class="text-lg leading-6 font-medium text-gray-900">
          Available Services
        </h3>
      </div>
      <div class="border-t border-gray-200">
        <ul class="divide-y divide-gray-200">
          <li v-for="service in services" :key="service.id" class="px-4 py-4 sm:px-6">
            <div class="flex items-center justify-between">
              <p class="text-sm font-medium text-indigo-600 truncate">
                {{ service.name }}
              </p>
              <div class="ml-2 flex-shrink-0 flex">
                <p class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                  ${{ service.price }}
                </p>
              </div>
            </div>
            <div class="mt-2 sm:flex sm:justify-between">
              <p class="text-sm text-gray-500">
                {{ service.description }}
              </p>
              <p class="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                <ClockIcon class="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                {{ service.duration }} minutes
              </p>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import { ClockIcon } from 'lucide-vue-next'
  
  const services = ref([])
  
  onMounted(async () => {
    // Fetch services from API
    // For demonstration purposes, we'll use placeholder data
    services.value = [
      { id: 1, name: 'Teeth Cleaning', description: 'Professional teeth cleaning service', price: 80, duration: 60 },
      { id: 2, name: 'Dental Checkup', description: 'Comprehensive dental examination', price: 100, duration: 45 },
    ]
  })
  </script>