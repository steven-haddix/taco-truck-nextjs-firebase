import { NextApiRequest, NextApiResponse } from "next";
import {
  authenticateRequest,
  getSlackConfiguration,
} from "../../../firebase/nodeClient";
import { apiHandler } from "../../../helpers/api";

export default apiHandler({
  get: getDefaultTeamScores,
});

async function getDefaultTeamScores(req: NextApiRequest, res: NextApiResponse) {
  // Get firebase user from auth token
  const user = await authenticateRequest(req);

  const configuration = await getSlackConfiguration(user.uid);

  if (!configuration) {
    throw "Unable to find an associated team. This account has likely not been configured in Slack.";
  }

  return res.status(200).json({
    team: configuration.team,
  });
}
