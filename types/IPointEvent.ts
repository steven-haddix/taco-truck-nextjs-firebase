export default interface IPointEvent {
  eventId: string;
  points: number;
  sender: string;
  receiver: string;
  receiverSlackId: string;
  timestamp?: {
    _seconds: number;
    _nanoseconds: number;
  };
}
