import { db } from "@/server/db";
import { users } from '@/server/db/schema';
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const emailOnly = searchParams.get('email') === 'true';

    if (emailOnly) {
        const result = await db
            .select({
                email: users.email,
            })
            .from(users);

        return NextResponse.json(result);
    }

    const allUsers = await db.select().from(users);

    return NextResponse.json(allUsers);
}