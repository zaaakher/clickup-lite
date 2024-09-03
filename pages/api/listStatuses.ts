// /pages/api/listStatuses.ts
import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { parse } from "cookie";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { listId } = req.query;

  // Parse cookies
  const cookies = parse(req.headers.cookie || "");
  const clickupToken = cookies.clickup_token;

  if (!clickupToken) {
    return res.status(401).json({ error: "Unauthorized: No ClickUp token" });
  }

  if (!listId) {
    return res.status(400).json({ error: "Bad Request: Missing listId" });
  }

  try {
    // Fetch the list details to get the allowed statuses
    const response = await axios.get(
      `https://api.clickup.com/api/v2/list/${listId}`,
      {
        headers: {
          Authorization: clickupToken,
        },
      }
    );

    // Extract statuses from the response
    const statuses = response.data.statuses;

    // Respond with the list of allowed statuses
    res.status(200).json({ statuses });
  } catch (error: any) {
    console.error(
      "Error fetching list statuses:",
      error.response?.data || error.message
    );
    res.status(500).json({
      error: "Failed to fetch list statuses",
      details: error.response?.data || error.message,
    });
  }
}
