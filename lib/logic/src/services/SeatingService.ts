import { EventRoundSet } from '../domain';

export class SeatingService {
  generateRoundSeating(
    eventId: number,
    roundId: number,
    userIds: number[],
    tableIds: number[],
    previousRounds: EventRoundSet[]
  ): EventRoundSet[] {
    const usersPerTable = 4;

    if (userIds.length !== tableIds.length * usersPerTable) {
      throw new Error(`Invalid configuration: ${userIds.length} users cannot be evenly distributed across ${tableIds.length} tables`);
    }

    const pairingHistory = this.buildPairingHistory(userIds, previousRounds);
    const assignment = this.optimizeSeating(userIds, tableIds, pairingHistory, usersPerTable);

    return assignment.map((tableAssignment, index) => ({
      id: this.generateRoundSetId(eventId, roundId, tableIds[index]),
      eventId,
      roundId,
      tableId: tableIds[index],
      userIds: tableAssignment,
    }));
  }

  private buildPairingHistory(userIds: number[], previousRounds: EventRoundSet[]): Map<string, number> {
    const pairingHistory = new Map<string, number>();

    for (const round of previousRounds) {
      const users = round.userIds;
      for (let i = 0; i < users.length; i++) {
        for (let j = i + 1; j < users.length; j++) {
          const key = this.getPairingKey(users[i], users[j]);
          pairingHistory.set(key, (pairingHistory.get(key) || 0) + 1);
        }
      }
    }

    return pairingHistory;
  }

  private optimizeSeating(
    userIds: number[],
    tableIds: number[],
    pairingHistory: Map<string, number>,
    usersPerTable: number
  ): number[][] {
    const numTables = tableIds.length;
    const assignment: number[][] = Array(numTables).fill(null).map(() => []);
    const availableUsers = new Set(userIds);

    for (let tableIndex = 0; tableIndex < numTables; tableIndex++) {
      for (let seat = 0; seat < usersPerTable; seat++) {
        let bestUser = -1;
        let bestScore = Infinity;

        for (const userId of availableUsers) {
          const score = this.calculatePairingScore(userId, assignment[tableIndex], pairingHistory);

          if (score < bestScore || (score === bestScore && Math.random() < 0.5)) {
            bestScore = score;
            bestUser = userId;
          }
        }

        if (bestUser === -1) {
          return this.fallbackRandomAssignment(userIds, numTables, usersPerTable);
        }

        assignment[tableIndex].push(bestUser);
        availableUsers.delete(bestUser);
      }
    }

    return assignment;
  }

  private calculatePairingScore(userId: number, tableUsers: number[], pairingHistory: Map<string, number>): number {
    let score = 0;
    for (const otherUserId of tableUsers) {
      const key = this.getPairingKey(userId, otherUserId);
      score += pairingHistory.get(key) || 0;
    }
    return score;
  }

  private fallbackRandomAssignment(userIds: number[], numTables: number, usersPerTable: number): number[][] {
    const shuffled = [...userIds].sort(() => Math.random() - 0.5);
    const assignment: number[][] = [];

    for (let i = 0; i < numTables; i++) {
      assignment.push(shuffled.slice(i * usersPerTable, (i + 1) * usersPerTable));
    }

    return assignment;
  }

  hasUsersPreviouslyMet(userId1: number, userId2: number, previousRounds: EventRoundSet[]): boolean {
    for (const round of previousRounds) {
      if (round.userIds.includes(userId1) && round.userIds.includes(userId2)) {
        return true;
      }
    }
    return false;
  }

  private getPairingKey(userId1: number, userId2: number): string {
    return userId1 < userId2 ? `${userId1}-${userId2}` : `${userId2}-${userId1}`;
  }

  private generateRoundSetId(eventId: number, roundId: number, tableId: number): number {
    return eventId * 1000000 + roundId * 1000 + tableId;
  }
}
