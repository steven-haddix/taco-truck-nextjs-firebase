import { FirebaseError } from "firebase-admin";
import type { NextApiRequest, NextApiResponse } from "next";
import admin from "../../firebase/nodeApp";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const createUser = async () => {
    try {
      const userRecord = await admin.auth().createUser({
        email: req.body.email,
        emailVerified: true,
        password: req.body.password,
        displayName: req.body.displayName,
        disabled: false,
      });

      res.status(200).json({ uid: userRecord.uid });
    } catch (err) {
      res.status(500).json(err);
    }
  };

  switch (req.method) {
    case "POST":
      return createUser();
    default:
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
