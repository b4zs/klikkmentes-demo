import { Event, EventRoundSet } from '../domain';

export interface EventStatus {
  currentRound: number;
  isActive: boolean;
  isCompleted: boolean;
}

export class EventService {
  private readonly ROUND_DURATION_MS = 10 * 60 * 1000; // 10 minutes
  private readonly TOTAL_ROUNDS = 5;

  createEvent(id: number, name: string, participantIds: number[], tableIds: number[]): Event {
    if (participantIds.length !== tableIds.length * 4) {
      throw new Error('Number of participants must be exactly 4 times the number of tables');
    }

    return {
      id,
      name,
      startedAt: 0,
      participantIds,
      tableIds,
    };
  }

  startEvent(event: Event, startTime: number = Date.now()): Event {
    return {
      ...event,
      startedAt: startTime,
    };
  }

  getEventStatus(event: Event, currentTime: number = Date.now()): EventStatus {
    if (event.startedAt === 0) {
      return {
        currentRound: 0,
        isActive: false,
        isCompleted: false,
      };
    }

    const currentRound = this.getCurrentRound(event, currentTime);

    return {
      currentRound,
      isActive: currentRound > 0 && currentRound <= this.TOTAL_ROUNDS,
      isCompleted: currentRound > this.TOTAL_ROUNDS,
    };
  }

  getCurrentRound(event: Event, currentTime: number = Date.now()): number {
    if (event.startedAt === 0) {
      return 0;
    }

    const elapsedTime = currentTime - event.startedAt;
    const round = Math.floor(elapsedTime / this.ROUND_DURATION_MS) + 1;

    return round;
  }

  getRoundStartTime(event: Event, roundId: number): number {
    if (event.startedAt === 0) {
      return 0;
    }

    return event.startedAt + (roundId - 1) * this.ROUND_DURATION_MS;
  }

  getRoundEndTime(event: Event, roundId: number): number {
    if (event.startedAt === 0) {
      return 0;
    }

    return event.startedAt + roundId * this.ROUND_DURATION_MS;
  }
}
