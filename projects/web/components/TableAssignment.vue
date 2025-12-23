<template>
  <div class="bg-white rounded-lg shadow-md p-6">
    <h2 class="text-lg font-semibold text-gray-900 mb-4">Your Table</h2>

    <div v-if="!currentAssignment" class="text-center py-8 text-gray-500">
      <p>No table assignment yet.</p>
      <p class="text-sm mt-1">Your table will appear when the next round starts.</p>
    </div>

    <div v-else class="space-y-4">
      <div class="text-center py-6 bg-indigo-50 rounded-lg">
        <div class="text-sm font-medium text-indigo-600 mb-1">Table Number</div>
        <div class="text-5xl font-bold text-indigo-700">{{ currentAssignment.tableId }}</div>
      </div>

      <div>
        <h3 class="text-sm font-medium text-gray-700 mb-3">Your Tablemates</h3>
        <div class="space-y-2">
          <div
            v-for="tablemate in tablemates"
            :key="tablemate.id"
            class="flex items-center px-4 py-3 bg-gray-50 rounded-lg"
          >
            <div class="w-8 h-8 bg-indigo-200 rounded-full flex items-center justify-center mr-3">
              <span class="text-indigo-700 font-medium text-sm">
                {{ tablemate.name.charAt(0) }}
              </span>
            </div>
            <span class="text-gray-900">{{ tablemate.name }}</span>
          </div>
        </div>
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
const { getUserRoundSet } = useRoundSetStore();
const { getUsersByIds } = useUserStore();

const event = computed(() => getActiveEvent());

const currentRound = computed(() => {
  if (!event.value || event.value.startedAt === 0) return 0;

  const eventService = new EventService({
    getAll: () => [event.value!],
    update: () => event.value!
  });

  const status = eventService.getEventStatus(event.value);
  return status.currentRound;
});

const currentAssignment = computed(() => {
  if (!event.value || currentRound.value === 0) return null;

  return getUserRoundSet(event.value.id, currentRound.value, props.userId);
});

const tablemates = computed(() => {
  if (!currentAssignment.value) return [];

  const tablemateIds = currentAssignment.value.userIds.filter(id => id !== props.userId);
  return getUsersByIds(tablemateIds);
});
</script>
