<template>
  <div class="bg-white shadow overflow-hidden sm:rounded-lg">
    <div class="px-4 py-5 sm:px-6">
      <h3 class="text-lg leading-6 font-medium text-gray-900">
        Messages
      </h3>
      <p class="mt-1 max-w-2xl text-sm text-gray-500">
        Communicate with your patients or dentist.
      </p>
    </div>
    <div v-if="loading">
      <LoadingSpinner />
    </div>
    <div v-else-if="error" class="px-4 py-5 sm:p-6 text-red-600">
      {{ error }}
    </div>
    <div v-else class="border-t border-gray-200 px-4 py-5 sm:p-0">
      <div class="flex flex-col h-96">
        <div class="flex-1 overflow-y-auto p-4 space-y-4">
          <div v-for="message in messages" :key="message.id" :class="['flex', message.sender === currentUser ? 'justify-end' : 'justify-start']">
            <div :class="['max-w-xs px-4 py-2 rounded-lg', message.sender === currentUser ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800']">
              <p class="text-sm">{{ message.content }}</p>
              <p class="text-xs mt-1 text-gray-500">{{ formatDate(message.timestamp) }}</p>
            </div>
          </div>
        </div>
        <div class="border-t p-4">
          <form @submit.prevent="sendMessage" class="flex space-x-2">
            <input v-model="newMessage" type="text" placeholder="Type a message..." class="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
            <button type="submit" class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">Send</button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useStore } from 'vuex'
import LoadingSpinner from '@/components/LoadingSpinner.vue'

const store = useStore()
const messages = ref([])
const loading = ref(true)
const error = ref(null)
const newMessage = ref('')

const currentUser = computed(() => store.state.user.id)

onMounted(async () => {
  try {
    await store.dispatch('fetchMessages')
    messages.value = store.state.messages
  } catch (err) {
    error.value = 'Failed to load messages. Please try again.'
  } finally {
    loading.value = false
  }
})

const formatDate = (timestamp) => {
  return new Date(timestamp).toLocaleString()
}

const sendMessage = async () => {
  if (newMessage.value.trim()) {
    try {
      await store.dispatch('sendMessage', newMessage.value)
      newMessage.value = ''
      // Refresh messages after sending
      await store.dispatch('fetchMessages')
      messages.value = store.state.messages
    } catch (err) {
      error.value = 'Failed to send message. Please try again.'
    }
  }
}
</script>