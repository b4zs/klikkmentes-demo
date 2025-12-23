<template>
  <div class="min-h-screen bg-gray-50">
    <header class="bg-white shadow-sm">
      <div class="max-w-4xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">{{ user?.name }}</h1>
            <p class="text-sm text-gray-500">Klikkmentes December 2025</p>
          </div>
          <button
            @click="router.push('/')"
            class="text-sm text-gray-600 hover:text-gray-900"
          >
            Switch User
          </button>
        </div>
      </div>
    </header>

    <main class="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div v-if="user" class="space-y-6">
        <EventStatus :user-id="user.id" />

        <TableAssignment :user-id="user.id" />

        <NotificationList :user-id="user.id" />
      </div>

      <div v-else class="text-center py-12">
        <p class="text-gray-500">User not found</p>
        <button
          @click="router.push('/')"
          class="mt-4 text-indigo-600 hover:text-indigo-700"
        >
          Go back
        </button>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
const router = useRouter();
const { getUser } = useUserStore();

const userId = computed(() => parseInt(route.params.userId as string));
const user = computed(() => getUser(userId.value));
</script>
