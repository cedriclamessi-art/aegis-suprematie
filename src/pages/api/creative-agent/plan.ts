import type { NextApiRequest, NextApiResponse } from "next";
import { planCreative } from "../../../lib/creative-agent";
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {res.setHeader("Allow","POST");return res.status(405).json({error:"Method not allowed"});}
  // Planning only: never calls a paid model and never fetches untrusted URLs.
  try { return res.status(200).json({plan:planCreative(req.body)}); }
  catch (error) {return res.status(400).json({error:error instanceof Error?error.message:"Invalid input"});}
}
