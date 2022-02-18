import { NextApiRequest, NextApiResponse } from "next";
import { updatePoints } from "../../firebase/nodeClient";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const body = req.body;

  if (body.challenge) {
    console.log("Handling");
    return res.status(200).json({ challenge: body.challenge });
  }

  if (body.event.subtype === "bot_message") {
    console.log("ignoring bot chit-chat");
    return res.status(200).json({});
  }

  const tacoMentions = body.event.text.match(/\:taco\:/g);
  const userMention = body.event.text.match(/<@(.*?)>/);

  console.log({
    sender: body.event.user,
  });

  // Taco handler needs a person and a taco emoji to be triggered
  if (tacoMentions.length < 1 || userMention < 1) {
    console.log("No taco mentions or user mentions.");
    return res.status(200).json({});
  }

  const senderId = body.event.user;
  const receiverId = userMention[1];
  const receiverSlack = userMention[0];

  updatePoints({
    teamId: body.team_id,
    userId: receiverId,
    event: {
      eventId: body.event_id,
      points: tacoMentions.length,
      sender: senderId,
      receiver: receiverId,
      receiverSlackId: receiverSlack,
    },
  });

  console.log({
    senderId,
    receiverSlack,
    receiverId,
    pointsAwarded: tacoMentions.length,
  });

  return res.status(200).json({});
}
