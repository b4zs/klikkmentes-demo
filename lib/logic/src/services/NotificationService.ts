import { Notification, EventRoundSet } from '../domain';

export class NotificationService {
  generateTableAssignmentNotification(
    userId: number,
    roundId: number,
    tableId: number,
    tablemates: string[]
  ): Notification {
    const teammatesText = tablemates.length > 0
      ? `Your tablemates: ${tablemates.join(', ')}.`
      : '';

    return {
      id: this.generateGuid(),
      userId,
      text: `Round ${roundId} is starting! You are assigned to Table ${tableId}. ${teammatesText}`,
      createdAt: Date.now(),
    };
  }

  generateRoundEndNotification(userId: number, roundId: number): Notification {
    return {
      id: this.generateGuid(),
      userId,
      text: `Round ${roundId} has ended. Please prepare for the next round.`,
      createdAt: Date.now(),
    };
  }

  generateEventCompletionNotification(userId: number): Notification {
    return {
      id: this.generateGuid(),
      userId,
      text: `Thank you for participating! The event has concluded. We hope you made many new connections!`,
      createdAt: Date.now(),
    };
  }

  getUnreadNotifications(allNotifications: Notification[], userId: number): Notification[] {
    return allNotifications
      .filter(notification => notification.userId === userId)
      .sort((a, b) => b.createdAt - a.createdAt);
  }

  private generateGuid(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
}
