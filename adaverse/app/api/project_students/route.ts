import db  from "@/lib/db/index";
import { studentProjects, promotions, adaProjects } from "@/lib/db/schema";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

// Fonction pour générer un slug
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// GET - Récupérer tous les projets
export async function GET(request: Request) {
  try {
    const data = await db
      .select({
        id: studentProjects.id,
        title: studentProjects.title,
        slug: studentProjects.slug,
        githubUrl: studentProjects.githubUrl,
        demoUrl: studentProjects.demoUrl,
        createdAt: studentProjects.createdAt,
        publishedAt: studentProjects.publishedAt,
        promotionId: studentProjects.promotionId,
        adaProjectsId: studentProjects.adaProjectsId,
        promotionName: promotions.name,
        adaProjectsName: adaProjects.name,
      })
      .from(studentProjects)
      .leftJoin(promotions, eq(studentProjects.promotionId, promotions.id))
      .leftJoin(adaProjects, eq(studentProjects.adaProjectsId, adaProjects.id));

    return NextResponse.json(data);
  } catch (error) {
    console.error("GET /api/project_students error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: String(error) },
      { status: 500 }
    );
  }
}

// POST - Créer un nouveau projet
export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.title || !body.github_url || !body.demo_url || !body.promotion_id || !body.ada_projects_id || !body.user_id) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const baseSlug = generateSlug(body.title);
    const slug = `${baseSlug}-${Date.now()}`;

    const insertData = {
      title: body.title,
      slug: slug,
      githubUrl: body.github_url,
      demoUrl: body.demo_url,
      promotionId: Number(body.promotion_id),
      adaProjectsId: Number(body.ada_projects_id),
      userId: body.user_id,
    };

    const result = await db
      .insert(studentProjects)
      .values(insertData)
      .returning();

    return NextResponse.json(result[0], { status: 201 });
  } catch (error) {
    console.error("POST /api/project_students error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: String(error) },
      { status: 500 }
    );
  }
}


export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Missing project ID" },
        { status: 400 }
      );
    }

    const result = await db
      .delete(studentProjects)
      .where(eq(studentProjects.id, Number(id)))
      .returning();

    if (result.length === 0) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Project deleted successfully", project: result[0] },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE /api/project_students error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: String(error) },
      { status: 500 }
    );
  }
}