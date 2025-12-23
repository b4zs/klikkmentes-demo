import type { EventRoundSet } from '@lib/logic';

const roundSets = ref<EventRoundSet[]>([]);

export const useRoundSetStore = () => {
  const addRoundSet = (roundSet: EventRoundSet): EventRoundSet => {
    roundSets.value.push(roundSet);
    return roundSet;
  };

  const addRoundSets = (sets: EventRoundSet[]): void => {
    roundSets.value.push(...sets);
  };

  const getRoundSet = (id: number): EventRoundSet | undefined => {
    return roundSets.value.find(rs => rs.id === id);
  };

  const getRoundSetsByEvent = (eventId: number): EventRoundSet[] => {
    return roundSets.value.filter(rs => rs.eventId === eventId);
  };

  const getRoundSetsByEventAndRound = (eventId: number, roundId: number): EventRoundSet[] => {
    return roundSets.value.filter(rs => rs.eventId === eventId && rs.roundId === roundId);
  };

  const getUserRoundSet = (eventId: number, roundId: number, userId: number): EventRoundSet | undefined => {
    return roundSets.value.find(
      rs => rs.eventId === eventId && rs.roundId === roundId && rs.userIds.includes(userId)
    );
  };

  return {
    roundSets: readonly(roundSets),
    addRoundSet,
    addRoundSets,
    getRoundSet,
    getRoundSetsByEvent,
    getRoundSetsByEventAndRound,
    getUserRoundSet
  };
};
