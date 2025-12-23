<template>
  <div class="bg-white rounded-lg shadow-md p-6">
    <div v-if="!event || event.startedAt === 0" class="text-center py-8">
      <h2 class="text-xl font-semibold text-gray-900 mb-2">Event Not Started</h2>
      <p class="text-gray-600">Waiting for the event to begin...</p>
    </div>

    <div v-else class="space-y-6">
      <div class="text-center">
        <div class="text-sm font-medium text-gray-600 mb-1">Current Round</div>
        <div class="text-4xl font-bold text-indigo-600">{{ currentRound }}</div>
        <div class="text-sm text-gray-500 mt-1">of 5 rounds</div>
      </div>

      <RoundProgress :current-round="currentRound" />

      <div class="text-center">
        <div class="text-sm font-medium text-gray-600 mb-1">Time Remaining</div>
        <div class="text-2xl font-semibold text-gray-900">{{ timeRemaining }}</div>
      </div>

      <div v-if="eventStatus.isCompleted" class="text-center py-4 bg-green-50 rounded-lg">
        <p class="text-green-800 font-medium">Event Completed!</p>
        <p class="text-sm text-green-600 mt-1">Thank you for participating</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { EventService } from '@lib/logic';

const props = defineProps<{
  userId: number
}>();

const { getActiveEvent } = useEventStore();

const event = computed(() => getActiveEvent());

const eventStatus = computed(() => {
  if (!event.value) {
    return { currentRound: 0, isActive: false, isCompleted: false };
  }

  const eventService = new EventService({
    getAll: () => [event.value!],
    update: () => event.value!
  });

  return eventService.getEventStatus(event.value);
});

const currentRound = computed(() => eventStatus.value.currentRound);

const timeRemaining = computed(() => {
  if (!event.value || currentRound.value === 0 || eventStatus.value.isCompleted) {
    return '00:00';
  }

  const eventService = new EventService({
    getAll: () => [event.value!],
    update: () => event.value!
  });

  const roundEndTime = eventService.getRoundEndTime(event.value, currentRound.value);
  const now = Date.now();
  const remaining = Math.max(0, roundEndTime - now);

  const minutes = Math.floor(remaining / 60000);
  const seconds = Math.floor((remaining % 60000) / 1000);

  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
});

let intervalId: ReturnType<typeof setInterval> | null = null;

onMounted(() => {
  intervalId = setInterval(() => {
    if (timeRemaining.value) {
    }
  }, 1000);
});

onUnmounted(() => {
  if (intervalId) {
    clearInterval(intervalId);
  }
});
</script>
