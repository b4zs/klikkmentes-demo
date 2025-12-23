import { EventService } from '../src/services/EventService';
import { Event } from '../src/domain';

describe('EventService', () => {
  let service: EventService;

  beforeEach(() => {
    service = new EventService();
  });

  describe('createEvent', () => {
    it('should create event with correct properties', () => {
      const participantIds = Array.from({ length: 40 }, (_, i) => i + 1);
      const tableIds = Array.from({ length: 10 }, (_, i) => i + 1);

      const event = service.createEvent(1, 'Test Event', participantIds, tableIds);

      expect(event.id).toBe(1);
      expect(event.name).toBe('Test Event');
      expect(event.participantIds).toEqual(participantIds);
      expect(event.tableIds).toEqual(tableIds);
      expect(event.startedAt).toBe(0);
    });

    it('should throw error if participants dont match tables', () => {
      const participantIds = Array.from({ length: 39 }, (_, i) => i + 1);
      const tableIds = Array.from({ length: 10 }, (_, i) => i + 1);

      expect(() => {
        service.createEvent(1, 'Test Event', participantIds, tableIds);
      }).toThrow('Number of participants must be exactly 4 times the number of tables');
    });
  });

  describe('startEvent', () => {
    it('should set startedAt timestamp', () => {
      const event: Event = {
        id: 1,
        name: 'Test Event',
        participantIds: [],
        tableIds: [],
        startedAt: 0,
      };

      const startTime = Date.now();
      const startedEvent = service.startEvent(event, startTime);

      expect(startedEvent.startedAt).toBe(startTime);
    });

    it('should use current time if not provided', () => {
      const event: Event = {
        id: 1,
        name: 'Test Event',
        participantIds: [],
        tableIds: [],
        startedAt: 0,
      };

      const beforeStart = Date.now();
      const startedEvent = service.startEvent(event);
      const afterStart = Date.now();

      expect(startedEvent.startedAt).toBeGreaterThanOrEqual(beforeStart);
      expect(startedEvent.startedAt).toBeLessThanOrEqual(afterStart);
    });
  });

  describe('getCurrentRound', () => {
    it('should return 0 for event that has not started', () => {
      const event: Event = {
        id: 1,
        name: 'Test Event',
        participantIds: [],
        tableIds: [],
        startedAt: 0,
      };

      expect(service.getCurrentRound(event)).toBe(0);
    });

    it('should return 1 for event just started', () => {
      const event: Event = {
        id: 1,
        name: 'Test Event',
        participantIds: [],
        tableIds: [],
        startedAt: Date.now(),
      };

      expect(service.getCurrentRound(event, event.startedAt)).toBe(1);
    });

    it('should return 1 during first 10 minutes', () => {
      const startTime = Date.now();
      const event: Event = {
        id: 1,
        name: 'Test Event',
        participantIds: [],
        tableIds: [],
        startedAt: startTime,
      };

      const afterFiveMinutes = startTime + 5 * 60 * 1000;
      expect(service.getCurrentRound(event, afterFiveMinutes)).toBe(1);

      const afterNineMinutes = startTime + 9 * 60 * 1000;
      expect(service.getCurrentRound(event, afterNineMinutes)).toBe(1);
    });

    it('should return 2 after 10 minutes', () => {
      const startTime = Date.now();
      const event: Event = {
        id: 1,
        name: 'Test Event',
        participantIds: [],
        tableIds: [],
        startedAt: startTime,
      };

      const afterTenMinutes = startTime + 10 * 60 * 1000;
      expect(service.getCurrentRound(event, afterTenMinutes)).toBe(2);
    });

    it('should return 6 after 50 minutes', () => {
      const startTime = Date.now();
      const event: Event = {
        id: 1,
        name: 'Test Event',
        participantIds: [],
        tableIds: [],
        startedAt: startTime,
      };

      const afterFiftyMinutes = startTime + 50 * 60 * 1000;
      expect(service.getCurrentRound(event, afterFiftyMinutes)).toBe(6);
    });
  });

  describe('getEventStatus', () => {
    it('should return inactive for not started event', () => {
      const event: Event = {
        id: 1,
        name: 'Test Event',
        participantIds: [],
        tableIds: [],
        startedAt: 0,
      };

      const status = service.getEventStatus(event);

      expect(status.currentRound).toBe(0);
      expect(status.isActive).toBe(false);
      expect(status.isCompleted).toBe(false);
    });

    it('should return active for event in progress', () => {
      const event: Event = {
        id: 1,
        name: 'Test Event',
        participantIds: [],
        tableIds: [],
        startedAt: Date.now(),
      };

      const currentTime = event.startedAt + 15 * 60 * 1000;
      const status = service.getEventStatus(event, currentTime);

      expect(status.currentRound).toBe(2);
      expect(status.isActive).toBe(true);
      expect(status.isCompleted).toBe(false);
    });

    it('should return completed for finished event', () => {
      const event: Event = {
        id: 1,
        name: 'Test Event',
        participantIds: [],
        tableIds: [],
        startedAt: Date.now(),
      };

      const currentTime = event.startedAt + 60 * 60 * 1000;
      const status = service.getEventStatus(event, currentTime);

      expect(status.currentRound).toBe(7);
      expect(status.isActive).toBe(false);
      expect(status.isCompleted).toBe(true);
    });
  });

  describe('getRoundStartTime', () => {
    it('should return 0 for not started event', () => {
      const event: Event = {
        id: 1,
        name: 'Test Event',
        participantIds: [],
        tableIds: [],
        startedAt: 0,
      };

      expect(service.getRoundStartTime(event, 1)).toBe(0);
    });

    it('should return event start time for round 1', () => {
      const startTime = Date.now();
      const event: Event = {
        id: 1,
        name: 'Test Event',
        participantIds: [],
        tableIds: [],
        startedAt: startTime,
      };

      expect(service.getRoundStartTime(event, 1)).toBe(startTime);
    });

    it('should return correct start time for round 3', () => {
      const startTime = Date.now();
      const event: Event = {
        id: 1,
        name: 'Test Event',
        participantIds: [],
        tableIds: [],
        startedAt: startTime,
      };

      const expectedStartTime = startTime + 2 * 10 * 60 * 1000;
      expect(service.getRoundStartTime(event, 3)).toBe(expectedStartTime);
    });
  });

  describe('getRoundEndTime', () => {
    it('should return 0 for not started event', () => {
      const event: Event = {
        id: 1,
        name: 'Test Event',
        participantIds: [],
        tableIds: [],
        startedAt: 0,
      };

      expect(service.getRoundEndTime(event, 1)).toBe(0);
    });

    it('should return correct end time for round 1', () => {
      const startTime = Date.now();
      const event: Event = {
        id: 1,
        name: 'Test Event',
        participantIds: [],
        tableIds: [],
        startedAt: startTime,
      };

      const expectedEndTime = startTime + 10 * 60 * 1000;
      expect(service.getRoundEndTime(event, 1)).toBe(expectedEndTime);
    });

    it('should return correct end time for round 5', () => {
      const startTime = Date.now();
      const event: Event = {
        id: 1,
        name: 'Test Event',
        participantIds: [],
        tableIds: [],
        startedAt: startTime,
      };

      const expectedEndTime = startTime + 5 * 10 * 60 * 1000;
      expect(service.getRoundEndTime(event, 5)).toBe(expectedEndTime);
    });
  });
});
