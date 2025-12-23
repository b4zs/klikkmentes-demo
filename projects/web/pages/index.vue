<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50">
    <div class="max-w-md w-full mx-4">
      <div class="bg-white rounded-2xl shadow-xl p-8">
        <div class="text-center mb-8">
          <h1 class="text-3xl font-bold text-gray-900 mb-2">Klikkmentes</h1>
          <p class="text-gray-600">No-Clique Party</p>
        </div>

        <UserRegistration @user-selected="handleUserSelected" />
      </div>

      <div class="mt-6 text-center text-sm text-gray-600">
        <p>40 participants • 10 tables • 5 rounds</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { User } from '@lib/logic';

const router = useRouter();
const { setCurrentUser } = useCurrentUser();
const { start } = useScheduler();
const { getActiveEvent, updateEvent } = useEventStore();

const handleUserSelected = (user: User) => {
  setCurrentUser(user);

  const activeEvent = getActiveEvent();
  if (!activeEvent || activeEvent.startedAt === 0) {
    const event = activeEvent || { id: 1 } as any;
    updateEvent(event.id, { startedAt: Date.now() });
    start();
  }

  router.push(`/dashboard/${user.id}`);
};
</script>
