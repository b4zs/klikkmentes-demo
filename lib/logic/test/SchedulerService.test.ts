import { SchedulerService, SchedulerContext } from '../src/services/SchedulerService';
import { Event, EventRoundSet, User } from '../src/domain';

describe('SchedulerService', () => {
  let service: SchedulerService;

  beforeEach(() => {
    service = new SchedulerService();
  });

  const createMockEvent = (id: number, startedAt: number): Event => ({
    id,
    name: `Event ${id}`,
    startedAt,
    participantIds: [1, 2, 3, 4],
    tableIds: [1],
  });

  const createMockUsers = (): User[] => [
    { id: 1, name: 'Alice' },
    { id: 2, name: 'Bob' },
    { id: 3, name: 'Charlie' },
    { id: 4, name: 'David' },
  ];

  describe('processMinutelyTick', () => {
    it('should not generate round sets for event not started', () => {
      const context: SchedulerContext = {
        events: [createMockEvent(1, 0)],
        eventRoundSets: [],
        notifications: [],
        users: createMockUsers(),
      };

      const result = service.processMinutelyTick(context, Date.now());

      expect(result.newRoundSets).toHaveLength(0);
      expect(result.newNotifications).toHaveLength(0);
    });

    it('should generate round sets when round starts', () => {
      const startTime = Date.now();
      const context: SchedulerContext = {
        events: [createMockEvent(1, startTime)],
        eventRoundSets: [],
        notifications: [],
        users: createMockUsers(),
      };

      const result = service.processMinutelyTick(context, startTime);

      expect(result.newRoundSets.length).toBeGreaterThan(0);
      expect(result.newNotifications.length).toBeGreaterThan(0);
    });

    it('should not regenerate existing round sets', () => {
      const startTime = Date.now();
      const existingRoundSets: EventRoundSet[] = [
        { id: 1, eventId: 1, roundId: 1, tableId: 1, userIds: [1, 2, 3, 4] },
      ];

      const context: SchedulerContext = {
        events: [createMockEvent(1, startTime)],
        eventRoundSets: existingRoundSets,
        notifications: [],
        users: createMockUsers(),
      };

      const result = service.processMinutelyTick(context, startTime);

      expect(result.newRoundSets).toHaveLength(0);
    });

    it('should process multiple events', () => {
      const startTime = Date.now();
      const context: SchedulerContext = {
        events: [
          createMockEvent(1, startTime),
          createMockEvent(2, startTime),
        ],
        eventRoundSets: [],
        notifications: [],
        users: createMockUsers(),
      };

      const result = service.processMinutelyTick(context, startTime);

      expect(result.newRoundSets.length).toBeGreaterThan(0);
    });
  });

  describe('checkAndAdvanceRounds', () => {
    it('should generate table assignment notifications for new round', () => {
      const startTime = Date.now();
      const event = createMockEvent(1, startTime);
      const context: SchedulerContext = {
        events: [event],
        eventRoundSets: [],
        notifications: [],
        users: createMockUsers(),
      };

      const result = service.checkAndAdvanceRounds(event, context, startTime);

      expect(result.newRoundSets).toHaveLength(1);
      expect(result.newNotifications.length).toBeGreaterThan(0);

      const tableAssignmentNotifs = result.newNotifications.filter(n =>
        n.text.includes('Round 1 is starting')
      );
      expect(tableAssignmentNotifs).toHaveLength(4);
    });

    it('should not generate notifications for inactive event', () => {
      const event = createMockEvent(1, 0);
      const context: SchedulerContext = {
        events: [event],
        eventRoundSets: [],
        notifications: [],
        users: createMockUsers(),
      };

      const result = service.checkAndAdvanceRounds(event, context, Date.now());

      expect(result.newRoundSets).toHaveLength(0);
      expect(result.newNotifications).toHaveLength(0);
    });

    it('should generate round 2 seating after 10 minutes', () => {
      const startTime = Date.now();
      const afterTenMinutes = startTime + 10 * 60 * 1000;
      const event = createMockEvent(1, startTime);

      const existingRoundSets: EventRoundSet[] = [
        { id: 1, eventId: 1, roundId: 1, tableId: 1, userIds: [1, 2, 3, 4] },
      ];

      const context: SchedulerContext = {
        events: [event],
        eventRoundSets: existingRoundSets,
        notifications: [],
        users: createMockUsers(),
      };

      const result = service.checkAndAdvanceRounds(event, context, afterTenMinutes);

      expect(result.newRoundSets.some(rs => rs.roundId === 2)).toBe(true);
    });

    it('should include tablemate names in notifications', () => {
      const startTime = Date.now();
      const event = createMockEvent(1, startTime);
      const context: SchedulerContext = {
        events: [event],
        eventRoundSets: [],
        notifications: [],
        users: createMockUsers(),
      };

      const result = service.checkAndAdvanceRounds(event, context, startTime);

      const hasTablemateInfo = result.newNotifications.some(n =>
        n.text.includes('Alice') || n.text.includes('Bob') ||
        n.text.includes('Charlie') || n.text.includes('David')
      );

      expect(hasTablemateInfo).toBe(true);
    });

    it('should generate completion notifications after event ends', () => {
      const startTime = Date.now();
      const afterEvent = startTime + 60 * 60 * 1000;
      const event = createMockEvent(1, startTime);

      const context: SchedulerContext = {
        events: [event],
        eventRoundSets: [],
        notifications: [],
        users: createMockUsers(),
      };

      const result = service.checkAndAdvanceRounds(event, context, afterEvent);

      const completionNotifs = result.newNotifications.filter(n =>
        n.text.includes('Thank you for participating')
      );

      expect(completionNotifs.length).toBeGreaterThan(0);
    });

    it('should not duplicate completion notifications', () => {
      const startTime = Date.now();
      const afterEvent = startTime + 60 * 60 * 1000;
      const event = createMockEvent(1, startTime);

      const existingNotifications = [
        {
          id: '1',
          userId: 1,
          text: 'Thank you for participating! The event has concluded.',
          createdAt: afterEvent,
        },
      ];

      const context: SchedulerContext = {
        events: [event],
        eventRoundSets: [],
        notifications: existingNotifications,
        users: createMockUsers(),
      };

      const result = service.checkAndAdvanceRounds(event, context, afterEvent);

      const completionNotifs = result.newNotifications.filter(n =>
        n.text.includes('Thank you for participating')
      );

      expect(completionNotifs).toHaveLength(0);
    });
  });

  describe('sendDueNotifications', () => {
    it('should return all notifications', () => {
      const notifications = [
        { id: '1', userId: 1, text: 'Test', createdAt: Date.now() },
        { id: '2', userId: 2, text: 'Test 2', createdAt: Date.now() },
      ];

      const result = service.sendDueNotifications(notifications);

      expect(result).toEqual(notifications);
    });
  });

  describe('full event lifecycle integration', () => {
    it('should handle complete 5-round event', () => {
      const userIds = Array.from({ length: 40 }, (_, i) => i + 1);
      const tableIds = Array.from({ length: 10 }, (_, i) => i + 1);
      const users: User[] = userIds.map(id => ({ id, name: `User ${id}` }));

      const startTime = Date.now();
      const event: Event = {
        id: 1,
        name: 'Full Event',
        startedAt: startTime,
        participantIds: userIds,
        tableIds,
      };

      let allRoundSets: EventRoundSet[] = [];
      let allNotifications: any[] = [];

      for (let i = 0; i < 5; i++) {
        const currentTime = startTime + i * 10 * 60 * 1000;
        const context: SchedulerContext = {
          events: [event],
          eventRoundSets: allRoundSets,
          notifications: allNotifications,
          users,
        };

        const result = service.checkAndAdvanceRounds(event, context, currentTime);
        allRoundSets.push(...result.newRoundSets);
        allNotifications.push(...result.newNotifications);
      }

      expect(allRoundSets.length).toBe(50);

      const rounds = new Set(allRoundSets.map(rs => rs.roundId));
      expect(rounds.size).toBe(5);

      for (let roundId = 1; roundId <= 5; roundId++) {
        const roundSets = allRoundSets.filter(rs => rs.roundId === roundId);
        expect(roundSets.length).toBe(10);

        const assignedUsers = roundSets.flatMap(rs => rs.userIds);
        expect(assignedUsers.length).toBe(40);
        expect(new Set(assignedUsers).size).toBe(40);
      }
    });
  });
});
