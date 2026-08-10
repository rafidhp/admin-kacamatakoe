import PageBreadcrumb from "@/components/page-breadcrumb";

export default function Dashboard() {
  return (
    <div className="min-h-[88vh]">
      <PageBreadcrumb
        items={[
          {
            title: 'Dashboard',
            href: '/dashboard'
          },
        ]}
      />
      <div>ini dashboard</div>
    </div>
  )
}