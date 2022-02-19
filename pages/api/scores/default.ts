import { NextApiRequest, NextApiResponse } from "next";
import {
  authenticateRequest,
  getScoreTotals,
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

  const scores = await getScoreTotals(configuration.team.id);

  return res.status(200).json(scores);
}
