import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { user } from '@/lib/db/schema';

export async function GET() {
  try {
    const users = await db.select().from(user);
    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json({ error: 'Erreur lors de la récupération des utilisateurs.' }, { status: 500 });
  }
}
