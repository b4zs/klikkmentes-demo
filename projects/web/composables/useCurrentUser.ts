import type { User } from '@lib/logic';

const currentUser = ref<User | null>(null);

export const useCurrentUser = () => {
  const setCurrentUser = (user: User | null) => {
    currentUser.value = user;
  };

  const getCurrentUser = (): User | null => {
    return currentUser.value;
  };

  return {
    currentUser: readonly(currentUser),
    setCurrentUser,
    getCurrentUser
  };
};
