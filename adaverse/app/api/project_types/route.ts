"use server"

import db from "@/lib/db/index";
import { projectsTypes } from "@/lib/db/schema";

export async function GET() {
  try {
    const data = await db.select().from(projectsTypes);
    return Response.json(data);
  } catch (error) {
    console.error("GET /api/project_types error:", error);
    return new Response(
      JSON.stringify({ error: "Internal Server Error", details: String(error) }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}