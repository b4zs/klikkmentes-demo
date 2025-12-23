import { NotificationService } from '../src/services/NotificationService';
import { Notification } from '../src/domain';

describe('NotificationService', () => {
  let service: NotificationService;

  beforeEach(() => {
    service = new NotificationService();
  });

  describe('generateTableAssignmentNotification', () => {
    it('should generate notification with correct format', () => {
      const notification = service.generateTableAssignmentNotification(
        1,
        2,
        5,
        ['Alice', 'Bob', 'Charlie']
      );

      expect(notification.userId).toBe(1);
      expect(notification.text).toContain('Round 2 is starting!');
      expect(notification.text).toContain('Table 5');
      expect(notification.text).toContain('Alice');
      expect(notification.text).toContain('Bob');
      expect(notification.text).toContain('Charlie');
      expect(notification.id).toBeTruthy();
      expect(notification.createdAt).toBeGreaterThan(0);
    });

    it('should generate notification without tablemates if empty', () => {
      const notification = service.generateTableAssignmentNotification(1, 1, 3, []);

      expect(notification.text).toContain('Round 1 is starting!');
      expect(notification.text).toContain('Table 3');
      expect(notification.text).not.toContain('tablemates');
    });

    it('should generate unique IDs for each notification', () => {
      const notification1 = service.generateTableAssignmentNotification(1, 1, 1, []);
      const notification2 = service.generateTableAssignmentNotification(1, 1, 1, []);

      expect(notification1.id).not.toBe(notification2.id);
    });
  });

  describe('generateRoundEndNotification', () => {
    it('should generate notification with correct format', () => {
      const notification = service.generateRoundEndNotification(5, 3);

      expect(notification.userId).toBe(5);
      expect(notification.text).toContain('Round 3 has ended');
      expect(notification.text).toContain('prepare for the next round');
      expect(notification.id).toBeTruthy();
      expect(notification.createdAt).toBeGreaterThan(0);
    });

    it('should generate unique IDs', () => {
      const notification1 = service.generateRoundEndNotification(1, 1);
      const notification2 = service.generateRoundEndNotification(1, 1);

      expect(notification1.id).not.toBe(notification2.id);
    });
  });

  describe('generateEventCompletionNotification', () => {
    it('should generate notification with thank you message', () => {
      const notification = service.generateEventCompletionNotification(10);

      expect(notification.userId).toBe(10);
      expect(notification.text).toContain('Thank you for participating');
      expect(notification.text).toContain('event has concluded');
      expect(notification.text).toContain('new connections');
      expect(notification.id).toBeTruthy();
      expect(notification.createdAt).toBeGreaterThan(0);
    });

    it('should generate unique IDs', () => {
      const notification1 = service.generateEventCompletionNotification(1);
      const notification2 = service.generateEventCompletionNotification(1);

      expect(notification1.id).not.toBe(notification2.id);
    });
  });

  describe('getUnreadNotifications', () => {
    it('should filter notifications by userId', () => {
      const now = Date.now();
      const allNotifications: Notification[] = [
        { id: '1', userId: 1, text: 'Test 1', createdAt: now },
        { id: '2', userId: 2, text: 'Test 2', createdAt: now + 1000 },
        { id: '3', userId: 1, text: 'Test 3', createdAt: now + 2000 },
        { id: '4', userId: 3, text: 'Test 4', createdAt: now + 3000 },
      ];

      const userNotifications = service.getUnreadNotifications(allNotifications, 1);

      expect(userNotifications).toHaveLength(2);
      expect(userNotifications.every(n => n.userId === 1)).toBe(true);
    });

    it('should sort notifications by createdAt in descending order', () => {
      const now = Date.now();
      const allNotifications: Notification[] = [
        { id: '1', userId: 1, text: 'Oldest', createdAt: now },
        { id: '2', userId: 1, text: 'Middle', createdAt: now + 1000 },
        { id: '3', userId: 1, text: 'Newest', createdAt: now + 2000 },
      ];

      const userNotifications = service.getUnreadNotifications(allNotifications, 1);

      expect(userNotifications[0].text).toBe('Newest');
      expect(userNotifications[1].text).toBe('Middle');
      expect(userNotifications[2].text).toBe('Oldest');
    });

    it('should return empty array if no notifications for user', () => {
      const allNotifications: Notification[] = [
        { id: '1', userId: 2, text: 'Test', createdAt: Date.now() },
      ];

      const userNotifications = service.getUnreadNotifications(allNotifications, 1);

      expect(userNotifications).toHaveLength(0);
    });
  });
});
