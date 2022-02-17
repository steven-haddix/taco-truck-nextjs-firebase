import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.body.challenge) {
    console.log("Handling");
    return res.status(200).json({ challenge: req.body.challenge });
  }
  console.log(req.body);
}
