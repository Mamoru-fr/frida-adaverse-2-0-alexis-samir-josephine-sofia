
import db from "@/lib/db";
import {comments, user} from "@/lib/db/schema";
import {eq} from "drizzle-orm";


export const GET = async (request: Request, {params}: {params: Promise<{id: string}>}) => {
    console.log({params})
    const {id} = await params;
    try {
        const commentsByProject = await db
            .select({
                id: comments.id,
                content: comments.content,
                createdAt: comments.createdAt,
                projectId: comments.projectId,
                user: {
                    id: user.id,
                    name: user.name,
                    image: user.image,
                }
            })
            .from(comments)
            .leftJoin(user, eq(comments.userId, user.id))
            .where(eq(comments.projectId, Number(id)));
        return new Response(JSON.stringify(commentsByProject), {status: 200});
    } catch (error) {
        return new Response("Failed to fetch comments", {status: 500});
    }
}