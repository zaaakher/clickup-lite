// pages/api/spaces.ts
import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { parse } from "cookie";
interface Space {
  id: string;
  name: string;
}
interface SpacesResponse {
  spaces: Space[];
}
interface Team {
  id: string;
}
interface TeamsResponse {
  teams: Team[];
}
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  const cookies = parse(req.headers.cookie || "");
  const clickupToken = cookies.clickup_token;
  if (!clickupToken) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  try {
    const { data: teamsData } = await axios.get<TeamsResponse>(
      "https://api.clickup.com/api/v2/team",
      { headers: { Authorization: clickupToken } }
    );
    console.log("Teams data:", teamsData);
    const spaces = await Promise.all(
      teamsData.teams.map(async (team) => {
        const { data: spacesData } = await axios.get<SpacesResponse>(
          `https://api.clickup.com/api/v2/team/${team.id}/space`,
          { headers: { Authorization: clickupToken } }
        );
        return spacesData.spaces;
      })
    );
    res.status(200).json(spaces.flat());
  } catch (error) {
    console.error("Error fetching spaces:", error);
    res.status(500).json({ error: "Failed to fetch spaces" });
  }
}
