import { Timestamp } from "firebase/firestore";
import admin from "./nodeApp";

interface ISlackConfiguration {
  app_id: string;
  access_token: string;
  team: {
    id: string;
    name: string;
  };
  incoming_webhook: {};
}

export const saveUpdateSlackConfiguration = async (
  userUid: string,
  configuration: ISlackConfiguration
) => {
  const db = admin.firestore();
  const accounts = db.collection(`accounts/${userUid}/configuration`);
  const accountDoc = await accounts.doc("slack").get();

  if (!accountDoc.exists) {
    accountDoc.ref.set(configuration);
  } else {
    accountDoc.ref.update(configuration);
  }
};

export const getSlackConfiguration = async (
  userUid: string
): Promise<ISlackConfiguration | undefined> => {
  const db = admin.firestore();
  const configurationCollection = db
    .collection(`accounts/${userUid}/configuration`)
    .withConverter({
      toFirestore: (data: ISlackConfiguration) => data,
      fromFirestore: (snap: FirebaseFirestore.QueryDocumentSnapshot) => {
        return snap.data() as ISlackConfiguration;
      },
    });
  const configurationQuery = await configurationCollection.doc("slack").get();
  return configurationQuery.data();
};

interface IPointEvent {
  eventId: string;
  points: number;
  sender: string;
  receiver: string;
  receiverSlackId: string;
  timestamp?: Timestamp;
}

interface IPointUpdate {
  teamId: string;
  userId: string;
  event: IPointEvent;
}

export const updatePoints = async ({ teamId, userId, event }: IPointUpdate) => {
  const db = admin.firestore();
  const totalsCollection = db.collection(`points/${teamId}/totals`);
  const slackPointsDoc = await totalsCollection.doc(userId).get();

  if (!slackPointsDoc.exists) {
    slackPointsDoc.ref.set({ points: event.points });
  } else {
    const pointData = slackPointsDoc.data();

    slackPointsDoc.ref.update({
      points: pointData?.points + event.points,
    });
  }

  const accounts = db.collection(`points/${teamId}/events`);
  const slackEventDoc = await accounts.doc(event.eventId).get();

  slackEventDoc.ref.set({
    ...{
      timestamp: admin.firestore.Timestamp.fromDate(new Date()),
    },
    ...event,
  });
};

const getStartOfToday = () => {
  const now = new Date();
  now.setHours(5, 0, 0, 0); // +5 hours for Eastern Time
  const timestamp = admin.firestore.Timestamp.fromDate(now);
  return timestamp; // ex. 1631246400
};

function getMonday(d: Date) {
  d = new Date(d);
  var day = d.getDay(),
    diff = d.getDate() - day + (day == 0 ? -6 : 1); // adjust when day is sunday
  return new Date(d.setDate(diff));
}

export const getScoreEvents = async (
  teamId: string
): Promise<IPointEvent[]> => {
  const db = admin.firestore();
  const eventsCollectionQuery = await db
    .collection(`points/${teamId}/events`)
    .where("timestamp", ">=", getMonday(new Date()))
    .withConverter({
      toFirestore: (data: IPointEvent) => data,
      fromFirestore: (snap: FirebaseFirestore.QueryDocumentSnapshot) => {
        return snap.data() as IPointEvent;
      },
    })
    .get();

  return eventsCollectionQuery.docs.map((doc) => doc.data());
};
