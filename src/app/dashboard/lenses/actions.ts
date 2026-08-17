"use server";

import { db } from "@/server/db";
import { lenses } from "@/server/db/schema";
import { LensSchema } from "@/lib/validations/lens";
import type { LensData } from "@/lib/validations/lens";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function createLens(data: LensData) {
  const validatedData = LensSchema.parse(data);

  const [lens] = await db
    .insert(lenses)
    .values({
      name: validatedData.name,
      price: validatedData.price,
    })
    .returning();

  revalidatePath("/dashboard/lenses");

  return lens;
}

export async function updateLens(
  id: string,
  data: LensData,
) {
  const validatedData = LensSchema.parse(data);

  const [lens] = await db
    .update(lenses)
    .set({
      name: validatedData.name,
      price: validatedData.price,
    })
    .where(eq(lenses.id, id))
    .returning();

  if (!lens) {
    throw new Error("Lensa tidak ditemukan.");
  }

  revalidatePath("/dashboard/lenses");

  return lens;
}

export async function deleteLens(id: string) {
  if (!id) {
    throw new Error("ID lensa tidak valid.");
  }

  await db
    .delete(lenses)
    .where(eq(lenses.id, id));

  revalidatePath("/dashboard/lenses");
}