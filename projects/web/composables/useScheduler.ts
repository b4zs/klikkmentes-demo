import { SchedulerService, EventService, SeatingService, NotificationService } from '@lib/logic';
import type { Event, EventRoundSet, Notification, User } from '@lib/logic';

let schedulerInterval: ReturnType<typeof setInterval> | null = null;
const isRunning = ref(false);

export const useScheduler = () => {
  const { getAllEvents, updateEvent } = useEventStore();
  const { getRoundSetsByEvent, addRoundSets } = useRoundSetStore();
  const { addNotifications } = useNotificationStore();
  const { getAllUsers } = useUserStore();
  const { getAllNotifications } = useNotificationStore();

  const tick = () => {
    const schedulerService = new SchedulerService();

    // Build the scheduler context
    const context = {
      events: getAllEvents(),
      eventRoundSets: getRoundSetsByEvent(1), // Get all round sets for event 1
      notifications: getAllNotifications(),
      users: getAllUsers()
    };

    const result = schedulerService.processMinutelyTick(context);

    // Save results
    if (result.newRoundSets.length > 0) {
      addRoundSets(result.newRoundSets);
    }
    if (result.newNotifications.length > 0) {
      addNotifications(result.newNotifications);
    }
  };

  const start = () => {
    if (isRunning.value) return;

    tick();

    schedulerInterval = setInterval(() => {
      tick();
    }, 60000);

    isRunning.value = true;
  };

  const stop = () => {
    if (schedulerInterval) {
      clearInterval(schedulerInterval);
      schedulerInterval = null;
    }
    isRunning.value = false;
  };

  const manualTick = () => {
    tick();
  };

  return {
    isRunning: readonly(isRunning),
    start,
    stop,
    manualTick
  };
};
