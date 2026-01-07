import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { user } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { banned } = await request.json();
    const { id } = await params;
    
    if (typeof banned !== 'boolean') {
      return NextResponse.json(
        { error: 'Le champ banned doit être un boolean' },
        { status: 400 }
      );
    }

    const updatedUser = await db
      .update(user)
      .set({ banned })
      .where(eq(user.id, id))
      .returning();

    if (updatedUser.length === 0) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedUser[0]);
  } catch (error) {
    console.error('Erreur lors de la mise à jour:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour de l\'utilisateur' },
      { status: 500 }
    );
  }
}
