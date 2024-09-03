// /pages/api/tasks.ts
import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { parse } from "cookie";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const cookies = parse(req.headers.cookie || "");
  const clickupToken = cookies.clickup_token;

  const { listId } = req.query;
  if (!clickupToken) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  if (!listId) {
    return res.status(400).json({ error: "No list ID provided" });
  }
  try {
    const response = await axios.get(
      `https://api.clickup.com/api/v2/list/${listId}/task`,
      { headers: { Authorization: clickupToken } }
    );
    const tasks = response.data.tasks;
    res.status(200).json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
}
