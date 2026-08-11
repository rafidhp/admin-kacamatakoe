import { db } from "@/server/db";
import { categories } from "@/server/db/schema";
import GlassesForm from "@/components/glasses/glasses-form";
import PageBreadcrumb from "@/components/page-breadcrumb";

export default async function GlassesCreate() {
  const categoriesData = await db.select().from(categories);

  return (
    <>
      <PageBreadcrumb
        items={[
          {
            title: 'Kacamata',
            href: '/dashboard/glasses'
          },
          {
            title: 'Tambah Kacamata',
            href: '/dashboard/glasses/create'
          },
        ]}
      />
      <GlassesForm categories={categoriesData} />
    </>
  )
}