<template>
  <div class="space-y-6">
    <div>
      <label for="user-select" class="block text-sm font-medium text-gray-700 mb-2">
        Select your name
      </label>
      <select
        id="user-select"
        v-model="selectedUserId"
        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
      >
        <option :value="null">Choose from list...</option>
        <option v-for="user in users" :key="user.id" :value="user.id">
          {{ user.name }}
        </option>
      </select>
    </div>

    <button
      @click="selectUser"
      :disabled="!selectedUserId"
      class="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
    >
      Continue
    </button>
  </div>
</template>

<script setup lang="ts">
import type { User } from '@lib/logic';

const emit = defineEmits<{
  userSelected: [user: User]
}>();

const { getAllUsers, getUser } = useUserStore();

const users = computed(() => getAllUsers().sort((a, b) => a.name.localeCompare(b.name)));
const selectedUserId = ref<number | null>(null);

const selectUser = () => {
  if (!selectedUserId.value) return;

  const user = getUser(selectedUserId.value);
  if (user) {
    emit('userSelected', user);
  }
};
</script>
