import { Timestamp } from "firebase/firestore";

// firebase.firestore.Timestamp.fromDate(new Date());
export default interface IScore {
  slackUserId: string;
  score: number;
  date: Timestamp;
}
