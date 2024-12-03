<template>
  <div class="bg-white shadow overflow-hidden sm:rounded-lg">
    <div class="px-4 py-5 sm:px-6">
      <h3 class="text-lg leading-6 font-medium text-gray-900">
        Manage Services
      </h3>
      <p class="mt-1 max-w-2xl text-sm text-gray-500">
        Add, edit, or remove dental services.
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
        <li v-for="service in services" :key="service.id" class="py-4 flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-900">{{ service.name }}</p>
            <p class="text-sm text-gray-500">${{ service.price }}</p>
          </div>
          <div class="flex space-x-2">
            <button @click="editService(service)" class="px-3 py-1 bg-blue-500 text-white rounded-md text-sm">Edit</button>
            <button @click="deleteService(service.id)" class="px-3 py-1 bg-red-500 text-white rounded-md text-sm">Delete</button>
          </div>
        </li>
      </ul>
      <div class="mt-4">
        <button @click="showAddServiceModal = true" class="px-4 py-2 bg-green-500 text-white rounded-md text-sm">Add New Service</button>
      </div>
    </div>

    <!-- Add/Edit Service Modal -->
    <div v-if="showAddServiceModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
      <div class="bg-white p-5 rounded-lg w-full max-w-md">
        <h3 class="text-lg font-medium text-gray-900 mb-4">{{ editingService ? 'Edit Service' : 'Add New Service' }}</h3>
        <form @submit.prevent="saveService">
          <div class="mb-4">
            <label for="serviceName" class="block text-sm font-medium text-gray-700">Service Name</label>
            <input type="text" id="serviceName" v-model="serviceForm.name" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
          </div>
          <div class="mb-4">
            <label for="servicePrice" class="block text-sm font-medium text-gray-700">Price</label>
            <input type="number" id="servicePrice" v-model="serviceForm.price" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
          </div>
          <div class="flex justify-end space-x-2">
            <button type="button" @click="showAddServiceModal = false" class="px-4 py-2 bg-gray-300 text-gray-800 rounded-md">Cancel</button>
            <button type="submit" class="px-4 py-2 bg-blue-500 text-white rounded-md">Save</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useStore } from 'vuex'
import LoadingSpinner from '@/components/LoadingSpinner.vue'

const store = useStore()
const services = ref([])
const loading = ref(true)
const error = ref(null)
const showAddServiceModal = ref(false)
const editingService = ref(null)
const serviceForm = ref({ name: '', price: 0 })

onMounted(async () => {
  try {
    await store.dispatch('fetchServices')
    services.value = store.state.services
  } catch (err) {
    error.value = 'Failed to load services. Please try again.'
  } finally {
    loading.value = false
  }
})

const editService = (service) => {
  editingService.value = service
  serviceForm.value = { ...service }
  showAddServiceModal.value = true
}

const deleteService = async (serviceId) => {
  if (confirm('Are you sure you want to delete this service?')) {
    try {
      await store.dispatch('deleteService', serviceId)
      await store.dispatch('fetchServices')
      services.value = store.state.services
    } catch (err) {
      error.value = 'Failed to delete service. Please try again.'
    }
  }
}

const saveService = async () => {
  try {
    if (editingService.value) {
      await store.dispatch('updateService', { id: editingService.value.id, ...serviceForm.value })
    } else {
      await store.dispatch('createService', serviceForm.value)
    }
    await store.dispatch('fetchServices')
    services.value = store.state.services
    showAddServiceModal.value = false
    editingService.value = null
    serviceForm.value = { name: '', price: 0 }
  } catch (err) {
    error.value = `Failed to ${editingService.value ? 'update' : 'create'} service. Please try again.`
  }
}
</script>