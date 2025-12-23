<template>
  <div class="bg-white rounded-lg shadow-md overflow-hidden">
    <div class="px-6 py-4 bg-gray-50 border-b border-gray-200">
      <h2 class="text-lg font-semibold text-gray-900">Notifications</h2>
    </div>

    <div v-if="notifications.length === 0" class="px-6 py-12 text-center text-gray-500">
      No notifications yet. The event will start when all participants join!
    </div>

    <div v-else class="divide-y divide-gray-200 max-h-96 overflow-y-auto">
      <div
        v-for="notification in notifications"
        :key="notification.id"
        class="px-6 py-4 hover:bg-gray-50 transition-colors"
      >
        <p class="text-sm text-gray-900">{{ notification.text }}</p>
        <p class="text-xs text-gray-500 mt-1">{{ formatTime(notification.createdAt) }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Notification } from '@lib/logic';

const props = defineProps<{
  userId: number
}>();

const { getNotificationsByUser } = useNotificationStore();

const notifications = computed(() => getNotificationsByUser(props.userId));

const formatTime = (timestamp: number): string => {
  const date = new Date(timestamp);
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};
</script>
