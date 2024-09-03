// /pages/api/lists.ts
import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { parse } from "cookie";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const cookies = parse(req.headers.cookie || "");
  const clickupToken = cookies.clickup_token;
  if (!clickupToken) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  try {
    const teamsResponse = await axios.get(
      "https://api.clickup.com/api/v2/team",
      { headers: { Authorization: clickupToken } }
    );
    console.log("Teams data:", teamsResponse.data);
    const teams = teamsResponse.data.teams;
    const lists = await Promise.all(
      teams.map(async (team: any) => {
        const spacesResponse = await axios.get(
          `https://api.clickup.com/api/v2/team/${team.id}/space`,
          { headers: { Authorization: clickupToken } }
        );
        const spaces = spacesResponse.data.spaces;
        const listsForTeam = await Promise.all(
          spaces.map(async (space: any) => {
            const listsResponse = await axios.get(
              `https://api.clickup.com/api/v2/space/${space.id}/list`,
              { headers: { Authorization: clickupToken } }
            );
            return listsResponse.data.lists;
          })
        );
        return listsForTeam.flat();
      })
    );
    res.status(200).json(lists.flat());
  } catch (error) {
    console.error("Error fetching lists:", error);
    res.status(500).json({ error: "Failed to fetch lists" });
  }
}
