import db from "@/lib/db";
import {comments} from "@/lib/db/schema";
import {eq} from "drizzle-orm";
import {auth} from "@/lib/auth/auth";
import {headers} from "next/headers";



export async function GET(request: Request) {
    const allComments = await db.select().from(comments);
    console.log(allComments)
    return new Response(JSON.stringify(allComments), {
        status: 200,
        headers: {
            "Content-Type": "application/json",
        },
    });
}

export async function POST(request: Request) {
    const session = await auth.api.getSession({headers: await headers()});
    
    if (!session) {
        return new Response(JSON.stringify({error: "Unauthorized"}), {
            status: 401,
            headers: {
                "Content-Type": "application/json",
            },
        });
    }

    try {
        const body = await request.json();

        const newComment = await db.insert(comments)
            .values({
                projectId: Number(body.projectId),
                content: body.content,
                userId: session.user.id,
                createdAt: new Date(),
            }).returning();

        return new Response(JSON.stringify(newComment[0]), {
            status: 201,
            headers: {
                "Content-Type": "application/json",
            },
        });
    } catch (error) {
        console.error("Error creating comment:", error);
        return new Response(JSON.stringify({error: "Internal Server Error"}), {
            status: 500,
            headers: {
                "Content-Type": "application/json",
            },
        });
    }
}