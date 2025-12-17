import db from "@/lib/db";
import {eq} from "drizzle-orm";
import {comments} from "@/lib/db/schema";
import {auth} from "@/lib/auth/auth";
import {headers} from "next/headers";


export const GET = async (request: Request, {params}: {params: {id: string}}) => {
    const {id} = await params
    try {
        const getCommentsById = await db.select().from(comments).where(eq(comments.id, Number(id))).limit(1);
        if (getCommentsById.length === 0) {
            return new Response(JSON.stringify({message: "Comment not found"}), {status: 404});
        }
        return new Response(JSON.stringify(getCommentsById[0]), {status: 200});
    } catch (error) {
        return new Response(JSON.stringify({message: "Internal Server Error"}), {status: 500});
    }
}

export const PUT = async (request: Request, {params}: {params: {id: string}}) => {
    const {id} = await params;
    const session = await auth.api.getSession({headers: await headers()});
    
    if (!session) {
        return new Response(JSON.stringify({error: "Unauthorized"}), {status: 401});
    }

    try {
        const body = await request.json();
        
        // Check if comment exists and belongs to user
        const existingComment = await db.select().from(comments).where(eq(comments.id, Number(id))).limit(1);
        
        if (existingComment.length === 0) {
            return new Response(JSON.stringify({error: "Comment not found"}), {status: 404});
        }

        if (existingComment[0].userId !== session.user.id) {
            return new Response(JSON.stringify({error: "Forbidden"}), {status: 403});
        }

        const updatedComment = await db
            .update(comments)
            .set({content: body.content})
            .where(eq(comments.id, Number(id)))
            .returning();

        return new Response(JSON.stringify(updatedComment[0]), {status: 200});
    } catch (error) {
        console.error("Error updating comment:", error);
        return new Response(JSON.stringify({error: "Internal Server Error"}), {status: 500});
    }
}

export const DELETE = async (request: Request, {params}: {params: {id: string}}) => {
    const {id} = await params;
    const session = await auth.api.getSession({headers: await headers()});
    
    if (!session) {
        return new Response(JSON.stringify({error: "Unauthorized"}), {status: 401});
    }

    try {
        // Check if comment exists
        const existingComment = await db.select().from(comments).where(eq(comments.id, Number(id))).limit(1);
        
        if (existingComment.length === 0) {
            return new Response(JSON.stringify({error: "Comment not found"}), {status: 404});
        }

        // Allow deletion if user is the author or an admin
        const isAuthor = existingComment[0].userId === session.user.id;
        const isAdmin = session.user.role === "admin";

        if (!isAuthor && !isAdmin) {
            return new Response(JSON.stringify({error: "Forbidden"}), {status: 403});
        }

        await db.delete(comments).where(eq(comments.id, Number(id)));

        return new Response(null, {status: 204});
    } catch (error) {
        console.error("Error deleting comment:", error);
        return new Response(JSON.stringify({error: "Internal Server Error"}), {status: 500});
    }
}
