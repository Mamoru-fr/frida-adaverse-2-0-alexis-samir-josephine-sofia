"use server"

import db from "@/lib/db/index";
import { promotions } from "@/lib/db/schema";

export async function GET() {
  const data = await db.select().from(promotions);
  return Response.json(data);
}
