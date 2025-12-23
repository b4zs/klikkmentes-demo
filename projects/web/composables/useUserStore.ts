import type { User } from '@lib/logic';

const users = ref<User[]>([]);
let nextId = 1;

export const useUserStore = () => {
  const addUser = (name: string): User => {
    const user: User = {
      id: nextId++,
      name
    };
    users.value.push(user);
    return user;
  };

  const getUser = (id: number): User | undefined => {
    return users.value.find(u => u.id === id);
  };

  const getAllUsers = (): User[] => {
    return users.value;
  };

  const getUsersByIds = (ids: number[]): User[] => {
    return users.value.filter(u => ids.includes(u.id));
  };

  return {
    users: readonly(users),
    addUser,
    getUser,
    getAllUsers,
    getUsersByIds
  };
};
