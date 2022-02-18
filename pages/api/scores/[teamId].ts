import { NextApiRequest, NextApiResponse } from "next";
import admin from "../../../firebase/nodeApp";
import {
  getScoreEvents,
  getSlackConfiguration,
} from "../../../firebase/nodeClient";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { authorization } = req.headers;
  let user: admin.auth.DecodedIdToken | undefined = undefined;
  //console.log(req.headers);

  // No authorization header so they're not logged in
  if (!authorization) {
    return res.status(401).send({
      status: "Authorization header required",
    });
  }

  const idToken = authorization.replace("Bearer ", "");
  // Get firebase user from auth token
  try {
    user = await admin.auth().verifyIdToken(idToken);
  } catch (err) {
    if (err.errorInfo.code === "auth/id-token-expired") {
      console.error("Firebase auth/id-token-expired");
      return res.status(500).send({
        status: "Token expired",
      });
    }

    return res.status(500).end({
      status: "There was an error while authenticating the session",
    });
  }

  const configuration = await getSlackConfiguration(user.uid);

  const { teamId } = req.query;

  console.log(teamId);
  console.log(configuration?.team.id);
  console.log(!configuration || configuration.team.id !== teamId);
  if (!configuration || configuration.team.id !== teamId) {
    return res.status(401).send({
      status: "You are not authorized to query this team",
    });
  }

  if (Array.isArray(teamId)) {
    return res.status(422).send({
      stats: "Request contained multiple team ids. Unable to process request.",
    });
  }
  const events = await getScoreEvents(teamId);

  interface Totals {
    [key: string]: number;
  }

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

  return res.status(200).json({
    scores: userScores,
    events,
  });
}
