import type { Notification } from '@lib/logic';

const notifications = ref<Notification[]>([]);

export const useNotificationStore = () => {
  const addNotification = (notification: Notification): Notification => {
    notifications.value.push(notification);
    return notification;
  };

  const addNotifications = (notifs: Notification[]): void => {
    notifications.value.push(...notifs);
  };

  const getNotificationsByUser = (userId: number): Notification[] => {
    return notifications.value
      .filter(n => n.userId === userId)
      .sort((a, b) => b.createdAt - a.createdAt);
  };

  const getAllNotifications = (): Notification[] => {
    return notifications.value;
  };

  return {
    notifications: readonly(notifications),
    addNotification,
    addNotifications,
    getNotificationsByUser,
    getAllNotifications
  };
};
