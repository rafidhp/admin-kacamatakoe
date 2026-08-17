import { db } from "@/server/db";
import type { InferSelectModel } from "drizzle-orm";
import { lenses } from "@/server/db/schema";
import PageBreadcrumb from "@/components/page-breadcrumb";
import LensHeader from "@/components/lenses/lens-header";
import LensTable from "@/components/lenses/lens-table";

export type Lenses = InferSelectModel<typeof lenses>;

export default async function Lenses() {
  const lensesData = await db.select().from(lenses);

  return (
    <div>
      <PageBreadcrumb
        items={[
          {
            title: 'Lensa',
            href: '/dashboard/lenses'
          },
        ]}
      />
      <LensHeader />
      <LensTable lenses={lensesData} />
    </div>
  )
}