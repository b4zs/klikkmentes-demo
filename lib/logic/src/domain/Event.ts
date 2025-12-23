export interface Event {
  id: number;
  name: string;
  startedAt: number;
  participantIds: number[];
  tableIds: number[];
}
