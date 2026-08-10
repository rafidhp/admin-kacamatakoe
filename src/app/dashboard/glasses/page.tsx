import GlassesHeader from "@/components/glasses/glasses-header";
import PageBreadcrumb from "@/components/page-breadcrumb";

export default function Glasses() {
  return (
    <div className="flex flex-col gap-2">
      <PageBreadcrumb
        items={[
          {
            title: "Kacamata",
            href: "/dashboard/glasses",
          },
        ]}
      />
      <GlassesHeader />
    </div>
  )
}