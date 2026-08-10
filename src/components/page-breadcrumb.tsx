"use client";

import { useSetBreadcrumbs } from "@/components/providers/breadcrumb-provider";
import type { BreadcrumbItem } from "@/components/providers/breadcrumb-provider";

interface PageBreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function PageBreadcrumb({
  items,
}: PageBreadcrumbProps) {
  useSetBreadcrumbs(items);

  return null;
}