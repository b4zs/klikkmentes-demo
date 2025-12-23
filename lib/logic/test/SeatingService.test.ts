import { SeatingService } from '../src/services/SeatingService';
import { EventRoundSet } from '../src/domain';

describe('SeatingService', () => {
  let service: SeatingService;
  const eventId = 1;
  const userIds = Array.from({ length: 40 }, (_, i) => i + 1);
  const tableIds = Array.from({ length: 10 }, (_, i) => i + 1);

  beforeEach(() => {
    service = new SeatingService();
  });

  describe('generateRoundSeating', () => {
    it('should generate seating for first round with correct distribution', () => {
      const roundSets = service.generateRoundSeating(eventId, 1, userIds, tableIds, []);

      expect(roundSets).toHaveLength(10);

      const allAssignedUsers = roundSets.flatMap(rs => rs.userIds);
      expect(allAssignedUsers).toHaveLength(40);
      expect(new Set(allAssignedUsers).size).toBe(40);

      roundSets.forEach(rs => {
        expect(rs.userIds).toHaveLength(4);
        expect(rs.eventId).toBe(eventId);
        expect(rs.roundId).toBe(1);
      });
    });

    it('should assign all users exactly once per round', () => {
      const roundSets = service.generateRoundSeating(eventId, 1, userIds, tableIds, []);
      const assignedUsers = roundSets.flatMap(rs => rs.userIds).sort((a, b) => a - b);

      expect(assignedUsers).toEqual(userIds);
    });

    it('should throw error for invalid user/table configuration', () => {
      const invalidUserIds = Array.from({ length: 39 }, (_, i) => i + 1);

      expect(() => {
        service.generateRoundSeating(eventId, 1, invalidUserIds, tableIds, []);
      }).toThrow('Invalid configuration');
    });

    it('should minimize repeat pairings across 5 rounds', () => {
      const rounds: EventRoundSet[] = [];

      for (let roundId = 1; roundId <= 5; roundId++) {
        const previousRounds = rounds.filter(rs => rs.roundId < roundId);
        const roundSets = service.generateRoundSeating(eventId, roundId, userIds, tableIds, previousRounds);
        rounds.push(...roundSets);
      }

      const pairingCounts = new Map<string, number>();

      for (const round of rounds) {
        const users = round.userIds;
        for (let i = 0; i < users.length; i++) {
          for (let j = i + 1; j < users.length; j++) {
            const key = users[i] < users[j] ? `${users[i]}-${users[j]}` : `${users[j]}-${users[i]}`;
            pairingCounts.set(key, (pairingCounts.get(key) || 0) + 1);
          }
        }
      }

      const maxPairings = Math.max(...Array.from(pairingCounts.values()));
      expect(maxPairings).toBeLessThanOrEqual(3);

      const repeatedPairings = Array.from(pairingCounts.values()).filter(count => count > 1).length;
      const totalPairings = pairingCounts.size;
      const repeatPercentage = (repeatedPairings / totalPairings) * 100;

      expect(repeatPercentage).toBeLessThan(40);
    });

    it('should complete seating generation in less than 1 second', () => {
      const startTime = Date.now();

      for (let roundId = 1; roundId <= 5; roundId++) {
        const previousRounds: EventRoundSet[] = [];
        service.generateRoundSeating(eventId, roundId, userIds, tableIds, previousRounds);
      }

      const duration = Date.now() - startTime;
      expect(duration).toBeLessThan(1000);
    });
  });

  describe('hasUsersPreviouslyMet', () => {
    it('should return false when users have not met', () => {
      const previousRounds: EventRoundSet[] = [
        { id: 1, eventId: 1, roundId: 1, tableId: 1, userIds: [1, 2, 3, 4] },
        { id: 2, eventId: 1, roundId: 1, tableId: 2, userIds: [5, 6, 7, 8] },
      ];

      const hasMet = service.hasUsersPreviouslyMet(1, 5, previousRounds);
      expect(hasMet).toBe(false);
    });

    it('should return true when users have met at same table', () => {
      const previousRounds: EventRoundSet[] = [
        { id: 1, eventId: 1, roundId: 1, tableId: 1, userIds: [1, 2, 3, 4] },
      ];

      const hasMet = service.hasUsersPreviouslyMet(1, 2, previousRounds);
      expect(hasMet).toBe(true);
    });

    it('should check across multiple rounds', () => {
      const previousRounds: EventRoundSet[] = [
        { id: 1, eventId: 1, roundId: 1, tableId: 1, userIds: [1, 2, 3, 4] },
        { id: 2, eventId: 1, roundId: 2, tableId: 1, userIds: [5, 6, 7, 8] },
        { id: 3, eventId: 1, roundId: 3, tableId: 1, userIds: [1, 5, 9, 10] },
      ];

      expect(service.hasUsersPreviouslyMet(1, 5, previousRounds)).toBe(true);
      expect(service.hasUsersPreviouslyMet(2, 6, previousRounds)).toBe(false);
    });
  });
});
