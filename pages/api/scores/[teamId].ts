import { NextApiRequest, NextApiResponse } from "next";
import {
  authenticateRequest,
  getScoreTotals,
  getSlackConfiguration,
} from "../../../firebase/nodeClient";

import { apiHandler } from "../../../helpers/api";

export default apiHandler({
  get: getTeamScore,
});

async function getTeamScore(req: NextApiRequest, res: NextApiResponse) {
  // Get firebase user from auth token
  const user = await authenticateRequest(req);

  const configuration = await getSlackConfiguration(user.uid);

  const { teamId } = req.query;

  if (!configuration || configuration.team.id !== teamId) {
    throw "You are not authorized to query this team";
  }

  if (Array.isArray(teamId)) {
    throw "Request contained multiple team ids. Unable to process request.";
  }

  const scores = getScoreTotals(teamId);

  return res.status(200).json(scores);
}
