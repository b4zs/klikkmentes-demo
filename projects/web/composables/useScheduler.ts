import { SchedulerService, EventService, SeatingService, NotificationService } from '@lib/logic';
import type { Event, EventRoundSet, Notification } from '@lib/logic';

let schedulerInterval: ReturnType<typeof setInterval> | null = null;
const isRunning = ref(false);

export const useScheduler = () => {
  const { getAllEvents, updateEvent } = useEventStore();
  const { getRoundSetsByEvent, addRoundSets } = useRoundSetStore();
  const { addNotifications } = useNotificationStore();

  const createRepositories = () => {
    return {
      eventRepository: {
        getAll: () => getAllEvents(),
        update: (event: Event) => updateEvent(event.id, event)
      },
      roundSetRepository: {
        getByEventId: (eventId: number) => getRoundSetsByEvent(eventId),
        saveAll: (roundSets: EventRoundSet[]) => addRoundSets(roundSets)
      },
      notificationRepository: {
        saveAll: (notifications: Notification[]) => addNotifications(notifications)
      }
    };
  };

  const tick = () => {
    const repos = createRepositories();
    const eventService = new EventService(repos.eventRepository);
    const seatingService = new SeatingService();
    const notificationService = new NotificationService();
    const schedulerService = new SchedulerService(
      repos.eventRepository,
      repos.roundSetRepository,
      repos.notificationRepository,
      eventService,
      seatingService,
      notificationService
    );

    schedulerService.processMinutelyTick();
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
