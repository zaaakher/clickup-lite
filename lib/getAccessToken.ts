// /lib/getAccessToken.ts
import { NextApiRequest } from "next";

export function getAccessToken(req: NextApiRequest): string | null {
  const cookies = req.headers.cookie;
  if (!cookies) return null;

  const token = cookies
    .split("; ")
    .find((row) => row.startsWith("clickup_token="));
  return token ? token.split("=")[1] : null;
}
