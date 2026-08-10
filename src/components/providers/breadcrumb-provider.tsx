"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";
import type { ReactNode } from "react";

export interface BreadcrumbItem {
  title: string;
  href?: string;
}

interface BreadcrumbContextType {
  breadcrumbs: BreadcrumbItem[];
  setBreadcrumbs: (breadcrumbs: BreadcrumbItem[]) => void;
}

const BreadcrumbContext =
  createContext<BreadcrumbContextType | null>(null);

export function BreadcrumbProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [breadcrumbs, setBreadcrumbs] = useState<
    BreadcrumbItem[]
  >([]);

  return (
    <BreadcrumbContext.Provider
      value={{
        breadcrumbs,
        setBreadcrumbs,
      }}
    >
      {children}
    </BreadcrumbContext.Provider>
  );
}

export function useBreadcrumb() {
  const context = useContext(BreadcrumbContext);

  if (!context) {
    throw new Error(
      "useBreadcrumb must be used inside BreadcrumbProvider",
    );
  }

  return context;
}

export function useSetBreadcrumbs(
  breadcrumbs: BreadcrumbItem[],
) {
  const { setBreadcrumbs } = useBreadcrumb();

  useEffect(() => {
    setBreadcrumbs(breadcrumbs);

    return () => {
      setBreadcrumbs([]);
    };
  }, [breadcrumbs, setBreadcrumbs]);
}