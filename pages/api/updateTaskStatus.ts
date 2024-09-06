// /pages/api/updateTaskStatus.ts
import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { parse } from "cookie";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { taskId, status } = req.body;

  // Parse cookies
  const cookies = parse(req.headers.cookie || "");
  const clickupToken = cookies.clickup_token;

  if (!clickupToken) {
    return res.status(401).json({ error: "Unauthorized: No ClickUp token" });
  }

  if (!taskId || !status) {
    return res
      .status(400)
      .json({ error: "Bad Request: Missing taskId or status" });
  }

  try {
    // Make the API call to update task status
    const response = await axios.put(
      `https://api.clickup.com/api/v2/task/${taskId}`,
      { status },
      { headers: { Authorization: clickupToken } }
    );

    // Respond to the client
    res.status(200).json({ success: true, data: response.data });
  } catch (error: any) {
    // Log the full error for debugging
    console.error(
      "Error updating task status:",
      error.response?.data || error.message
    );

    // Respond with error details
    res.status(500).json({
      error: "Failed to update task status",
      details: error.response?.data || error.message,
    });
  }
}
