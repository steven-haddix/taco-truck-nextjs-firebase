import admin from "./nodeApp";

interface ISlackConfiguration {
  app_id: string;
  access_token: string;
  team: string;
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

export const getSlackConfiguration = async (userUid: string) => {
  const db = admin.firestore();
  const accounts = db.collection(`accounts/${userUid}/configuration`);
  return await (await accounts.doc("slack").get()).data();
};

interface IPointUpdate {
  teamId: string;
  userId: string;
  event: {
    eventId: string;
    points: number;
    sender: string;
    receiver: string;
    receiverSlackId: string;
  };
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
