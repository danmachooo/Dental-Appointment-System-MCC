<template>
  <div class="bg-white shadow overflow-hidden sm:rounded-lg">
    <div class="px-4 py-5 sm:px-6">
      <h3 class="text-lg leading-6 font-medium text-gray-900">
        User Profile
      </h3>
      <p class="mt-1 max-w-2xl text-sm text-gray-500">
        View and edit your personal information.
      </p>
    </div>
    <div v-if="loading">
      <LoadingSpinner />
    </div>
    <div v-else-if="error" class="px-4 py-5 sm:p-6 text-red-600">
      {{ error }}
    </div>
    <div v-else class="border-t border-gray-200 px-4 py-5 sm:p-0">
      <dl class="sm:divide-y sm:divide-gray-200">
        <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
          <dt class="text-sm font-medium text-gray-500">Full name</dt>
          <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
            <div v-if="!editing.name">
              {{ user.name }}
              <button @click="startEditing('name')" class="ml-2 text-indigo-600 hover:text-indigo-900">Edit</button>
            </div>
            <div v-else>
              <input v-model="editForm.name" type="text" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
              <div class="mt-2">
                <button @click="saveEdit('name')" class="mr-2 text-green-600 hover:text-green-900">Save</button>
                <button @click="cancelEdit('name')" class="text-red-600 hover:text-red-900">Cancel</button>
              </div>
            </div>
          </dd>
        </div>
        <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
          <dt class="text-sm font-medium text-gray-500">Email address</dt>
          <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
            <div v-if="!editing.email">
              {{ user.email }}
              <button @click="startEditing('email')" class="ml-2 text-indigo-600 hover:text-indigo-900">Edit</button>
            </div>
            <div v-else>
              <input v-model="editForm.email" type="email" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
              <div class="mt-2">
                <button @click="saveEdit('email')" class="mr-2 text-green-600 hover:text-green-900">Save</button>
                <button @click="cancelEdit('email')" class="text-red-600 hover:text-red-900">Cancel</button>
              </div>
            </div>
          </dd>
        </div>
        <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
          <dt class="text-sm font-medium text-gray-500">Phone number</dt>
          <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
            <div v-if="!editing.phone">
              {{ user.phone }}
              <button @click="startEditing('phone')" class="ml-2 text-indigo-600 hover:text-indigo-900">Edit</button>
            </div>
            <div v-else>
              <input v-model="editForm.phone" type="tel" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
              <div class="mt-2">
                <button @click="saveEdit('phone')" class="mr-2 text-green-600 hover:text-green-900">Save</button>
                <button @click="cancelEdit('phone')" class="text-red-600 hover:text-red-900">Cancel</button>
              </div>
            </div>
          </dd>
        </div>
      </dl>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useStore } from 'vuex'
import LoadingSpinner from '@/components/LoadingSpinner.vue'

const store = useStore()
const user = ref({})
const loading = ref(true)
const error = ref(null)

const editing = reactive({
  name: false,
  email: false,
  phone: false
})

const editForm = reactive({
  name: '',
  email: '',
  phone: ''
})

onMounted(async () => {
  try {
    await store.dispatch('fetchUserProfile')
    user.value = store.state.user
    Object.assign(editForm, user.value)
  } catch (err) {
    error.value = 'Failed to load user profile. Please try again.'
  } finally {
    loading.value = false
  }
})

const startEditing = (field) => {
  editing[field] = true
}

const cancelEdit = (field) => {
  editing[field] = false
  editForm[field] = user.value[field]
}

const saveEdit = async (field) => {
  try {
    await store.dispatch('updateUserProfile', { [field]: editForm[field] })
    user.value[field] = editForm[field]
    editing[field] = false
  } catch (err) {
    error.value = `Failed to update ${field}. Please try again.`
  }
}
</script>