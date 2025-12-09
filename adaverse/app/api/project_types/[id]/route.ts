import db from "@/lib/db/index";
import { projectsTypes } from "@/lib/db/schema";
import { eq } from "drizzle-orm";



export const GET = async (_req: Request, { params }: { params: { id: string } }) => {
    try {
        console.log({ params })
        const { id } = await params;
        const data = await db.select().from(projectsTypes).where(eq(projectsTypes.id, Number(id)));
        return new Response(JSON.stringify(data), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error("GET /api/project_types/[id] error:", error);
        return new Response(
            JSON.stringify({ error: "Internal Server Error", details: String(error) }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
}