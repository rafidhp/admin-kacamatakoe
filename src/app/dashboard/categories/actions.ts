"use server";

import { db } from "@/server/db";
import { categories } from "@/server/db/schema";
import { categorySchema } from "@/lib/validations/category";
import type { CategoryData } from "@/lib/validations/category";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function createCategory(data: CategoryData) {
  const result = categorySchema.safeParse(data);

  if (!result.success) {
    throw new Error(
      result.error.issues[0]?.message ?? "Data kategori tidak valid.",
    );
  }

  await db.insert(categories).values({
    name: result.data.name,
    description: result.data.description ?? null,
    isGlasses: result.data.isGlasses,
  });

  revalidatePath("/dashboard/categories");
}

export async function updateCategory(
  id: string,
  data: CategoryData,
) {
  const result = categorySchema.safeParse(data);

  if (!result.success) {
    throw new Error(
      result.error.issues[0]?.message ?? "Data kategori tidak valid.",
    );
  }

  await db
    .update(categories)
    .set({
      name: result.data.name,
      description: result.data.description ?? null,
      isGlasses: result.data.isGlasses,
    })
    .where(eq(categories.id, id));

  revalidatePath("/dashboard/categories");
}

export async function deleteCategory(id: string) {
  if (!id) {
    throw new Error("ID kategori tidak valid.");
  }

  await db
    .delete(categories)
    .where(eq(categories.id, id));

  revalidatePath("/dashboard/categories");
}