// /pages/api/auth/callback.ts
import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { code } = req.query;

  if (!code) {
    return res.status(400).json({ error: "No code provided" });
  }

  const clientId = process.env.CLICKUP_CLIENT_ID;
  const clientSecret = process.env.CLICKUP_CLIENT_SECRET;
  const redirectUri = process.env.CLICKUP_REDIRECT_URI;

  try {
    const response = await axios.post(
      "https://api.clickup.com/api/v2/oauth/token",
      {
        client_id: clientId,
        client_secret: clientSecret,
        code,
        redirect_uri: redirectUri,
      }
    );

    const { access_token } = response.data;

    // Save the access token securely, e.g., in a session or database
    res.setHeader(
      "Set-Cookie",
      `clickup_token=${access_token}; Path=/; HttpOnly`
    );

    res.redirect("/"); // Redirect to the homepage or another page
  } catch (error) {
    res.status(500).json({ error: "Failed to get access token" });
  }
}
