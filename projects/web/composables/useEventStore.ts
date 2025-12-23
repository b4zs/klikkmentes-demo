import type { Event } from '@lib/logic';

const events = ref<Event[]>([]);
let nextId = 1;

export const useEventStore = () => {
  const addEvent = (event: Omit<Event, 'id'>): Event => {
    const newEvent: Event = {
      ...event,
      id: nextId++
    };
    events.value.push(newEvent);
    return newEvent;
  };

  const getEvent = (id: number): Event | undefined => {
    return events.value.find(e => e.id === id);
  };

  const updateEvent = (id: number, updates: Partial<Event>): Event | undefined => {
    const index = events.value.findIndex(e => e.id === id);
    if (index === -1) return undefined;

    events.value[index] = { ...events.value[index], ...updates };
    return events.value[index];
  };

  const getAllEvents = (): Event[] => {
    return events.value;
  };

  const getActiveEvent = (): Event | undefined => {
    return events.value.find(e => e.startedAt > 0);
  };

  return {
    events: readonly(events),
    addEvent,
    getEvent,
    updateEvent,
    getAllEvents,
    getActiveEvent
  };
};
