<template>
  <div class="space-y-2">
    <div class="flex justify-between items-center">
      <div
        v-for="round in 5"
        :key="round"
        class="flex-1 mx-1 first:ml-0 last:mr-0"
      >
        <div
          class="h-2 rounded-full transition-colors duration-300"
          :class="{
            'bg-indigo-600': round <= currentRound,
            'bg-gray-200': round > currentRound
          }"
        />
        <div class="text-center mt-1">
          <span
            class="text-xs font-medium"
            :class="{
              'text-indigo-600': round === currentRound,
              'text-gray-400': round !== currentRound
            }"
          >
            {{ round }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  currentRound: number
}>();
</script>
