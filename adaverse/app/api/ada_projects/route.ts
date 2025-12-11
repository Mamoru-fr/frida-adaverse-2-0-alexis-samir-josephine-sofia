"use server"

import db from "@/lib/db/index";
import { adaProjects } from "@/lib/db/schema";

export async function GET() {
  try {
    const data = await db.select().from(adaProjects);
    return Response.json(data);
  } catch (error) {
    console.error("GET /api/ada_projects error:", error);
    return new Response(
      JSON.stringify({ error: "Internal Server Error", details: String(error) }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}