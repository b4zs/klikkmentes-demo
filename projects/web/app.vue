<template>
  <div>
    <NuxtPage />
  </div>
</template>

<script setup lang="ts">
const { initializeDemo } = useDemoData();

onMounted(() => {
  initializeDemo();
});
</script>
