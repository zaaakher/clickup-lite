// /pages/api/auth/redirect.ts
import { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const clientId = process.env.CLICKUP_CLIENT_ID;
  const redirectUri = process.env.CLICKUP_REDIRECT_URI; // This should be a route in your app

  const clickupAuthUrl = `https://app.clickup.com/api?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code`;

  res.redirect(clickupAuthUrl);
}
