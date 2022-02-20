import { NextApiRequest } from "next";
import IPointEvent from "../types/IPointEvent";
import Totals from "../types/IPointTotals";
import admin from "./nodeApp";

export const authenticateRequest = async (
  req: NextApiRequest
): Promise<admin.auth.DecodedIdToken> => {
  const { authorization } = req.headers;

  // No authorization header so they're not logged in
  if (!authorization) {
    throw "Authorization header required";
  }

  const idToken = authorization.replace("Bearer ", "");

  return authenticateUserToken(idToken);
};

export const authenticateUserToken = async (
  idToken: string
): Promise<admin.auth.DecodedIdToken> => {
  try {
    return await admin.auth().verifyIdToken(idToken);
  } catch (err) {
    if (err.errorInfo.code === "auth/id-token-expired") {
      console.error("Firebase auth/id-token-expired");
      throw "Auth token expired";
    }
    console.log(err);
    throw "There was an error while authenticating the session";
  }
};

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

export const getScoreTotals = async (teamId: string): Promise<any> => {
  const events = await getScoreEvents(teamId);
  // Aggregate events into totals by user
  const userScores = events.reduce((acc, event) => {
    const currTotal = acc[event.receiver] ? acc[event.receiver] : 0;
    return {
      ...acc,
      ...{
        [event.receiver]: currTotal + event.points,
      },
    };
  }, {} as Totals);

  return {
    scores: userScores,
    events,
  };
};
