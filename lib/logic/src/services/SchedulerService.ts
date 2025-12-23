import { Event, EventRoundSet, Notification, User } from '../domain';
import { EventService } from './EventService';
import { SeatingService } from './SeatingService';
import { NotificationService } from './NotificationService';

export interface SchedulerContext {
  events: Event[];
  eventRoundSets: EventRoundSet[];
  notifications: Notification[];
  users: User[];
}

export interface SchedulerResult {
  newRoundSets: EventRoundSet[];
  newNotifications: Notification[];
}

export class SchedulerService {
  private eventService: EventService;
  private seatingService: SeatingService;
  private notificationService: NotificationService;

  constructor() {
    this.eventService = new EventService();
    this.seatingService = new SeatingService();
    this.notificationService = new NotificationService();
  }

  processMinutelyTick(context: SchedulerContext, currentTime: number = Date.now()): SchedulerResult {
    const newRoundSets: EventRoundSet[] = [];
    const newNotifications: Notification[] = [];

    for (const event of context.events) {
      const result = this.checkAndAdvanceRounds(event, context, currentTime);
      newRoundSets.push(...result.newRoundSets);
      newNotifications.push(...result.newNotifications);
    }

    return { newRoundSets, newNotifications };
  }

  checkAndAdvanceRounds(
    event: Event,
    context: SchedulerContext,
    currentTime: number
  ): SchedulerResult {
    const newRoundSets: EventRoundSet[] = [];
    const newNotifications: Notification[] = [];

    const status = this.eventService.getEventStatus(event, currentTime);

    if (!status.isActive && !status.isCompleted) {
      return { newRoundSets, newNotifications };
    }

    const currentRound = status.currentRound;
    const roundStartTime = this.eventService.getRoundStartTime(event, currentRound);
    const roundEndTime = this.eventService.getRoundEndTime(event, currentRound);

    const existingRoundSets = context.eventRoundSets.filter(
      rs => rs.eventId === event.id && rs.roundId === currentRound
    );

    if (existingRoundSets.length === 0 && status.isActive && currentTime >= roundStartTime) {
      const previousRounds = context.eventRoundSets.filter(
        rs => rs.eventId === event.id && rs.roundId < currentRound
      );

      const roundSets = this.seatingService.generateRoundSeating(
        event.id,
        currentRound,
        event.participantIds,
        event.tableIds,
        previousRounds
      );

      newRoundSets.push(...roundSets);

      const userMap = new Map(context.users.map(u => [u.id, u]));

      for (const roundSet of roundSets) {
        for (const userId of roundSet.userIds) {
          const tablemates = roundSet.userIds
            .filter(id => id !== userId)
            .map(id => userMap.get(id)?.name || `User ${id}`);

          const notification = this.notificationService.generateTableAssignmentNotification(
            userId,
            currentRound,
            roundSet.tableId,
            tablemates
          );

          newNotifications.push(notification);
        }
      }
    }

    if (status.isActive && currentTime >= roundEndTime - 60000 && currentTime < roundEndTime) {
      const roundEndNotificationsSent = context.notifications.some(
        n => n.text.includes(`Round ${currentRound} has ended`)
      );

      if (!roundEndNotificationsSent) {
        for (const userId of event.participantIds) {
          const notification = this.notificationService.generateRoundEndNotification(
            userId,
            currentRound
          );
          newNotifications.push(notification);
        }
      }
    }

    if (status.isCompleted) {
      const completionNotificationsSent = context.notifications.some(
        n => n.text.includes('Thank you for participating')
      );

      if (!completionNotificationsSent) {
        for (const userId of event.participantIds) {
          const notification = this.notificationService.generateEventCompletionNotification(userId);
          newNotifications.push(notification);
        }
      }
    }

    return { newRoundSets, newNotifications };
  }

  sendDueNotifications(notifications: Notification[]): Notification[] {
    return notifications;
  }
}
