import { doc, setDoc } from "firebase/firestore";
import { NextApiRequest, NextApiResponse } from "next";
import { auth } from "firebase-admin";

import admin from "../../firebase/nodeApp";
import { saveUpdateSlackConfiguration } from "../../firebase/nodeClient";
import nodeXHRForm from "../../fetchData/nodeXHRForm";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { authorization } = req.headers;
  let user: admin.auth.DecodedIdToken | undefined = undefined;
  //console.log(req.headers);

  // No authorization header so they're not logged in
  if (!authorization) {
    return res.status(401).end();
  }

  const idToken = authorization.replace("Bearer ", "");

  // Get firebase user from auth token
  try {
    user = await admin.auth().verifyIdToken(idToken);
  } catch (err) {
    if (err.errorInfo.code === "auth/id-token-expired") {
      console.error("Firebase auth/id-token-expired");
      return res.status(500).end();
    }

    return res.status(500).end();
  }

  // Check slack state matches firebase uid otherwise its a forgery
  if (user.uid !== req.query.state) {
    return res.status(401).end();
  }
  // Request Access Token from Slack
  const xhrResponse = await nodeXHRForm(
    "slack.com",
    "/api/oauth.v2.access",
    {
      code: Array.isArray(req.query.code) ? "" : req.query.code,
      redirect_uri: process.env.NEXT_PUBLIC_SLACK_REDIRECT_URI || "",
      grant_type: "authorization_code",
    },
    process.env.NEXT_PRIVATE_SLACK_CLIENT_ID,
    process.env.NEXT_PRIVATE_SLACK_CLIENT_SECRET
  );

  const authResponseJson = JSON.parse(xhrResponse);

  // Slack call failed for some reason
  if (!authResponseJson.ok) {
    console.error(authResponseJson);
    return res.status(500).end();
  }

  // Save Access Token to Firestore Database
  saveUpdateSlackConfiguration(user.uid, {
    app_id: authResponseJson.app_id,
    access_token: authResponseJson.access_token,
    team: authResponseJson.team,
    incoming_webhook: authResponseJson.incoming_webhook,
  });

  return res.status(200).json({});
}
