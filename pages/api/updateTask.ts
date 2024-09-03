// /pages/api/updateTask.ts
import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";
import { getAccessToken } from "../../lib/getAccessToken";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const accessToken = getAccessToken(req);

  if (!accessToken) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { taskId, status } = req.body;

  try {
    const response = await axios.put(
      `https://api.clickup.com/api/v2/task/${taskId}`,
      {
        status,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Failed to update task" });
  }
}
