import GlassesForm from "@/components/glasses/glasses-form";
import PageBreadcrumb from "@/components/page-breadcrumb";

export default function GlassesCreate() {
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
      <GlassesForm />
    </>
  )
}