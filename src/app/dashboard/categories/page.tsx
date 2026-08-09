import { db } from "@/server/db";
import CategoryHeader from "@/components/categories/category-header";
import CategoryTable from "@/components/categories/category-table";
import type { InferSelectModel } from "drizzle-orm";
import { categories } from "@/server/db/schema";

export type Category = InferSelectModel<typeof categories>;

export default async function Categories() {
  const categoriesData = await db.select().from(categories);

  return (
    <div className="flex flex-col gap-4">
      <CategoryHeader />
      <CategoryTable categories={categoriesData} />
    </div>
  )
}