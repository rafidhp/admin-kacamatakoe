"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Plus } from "lucide-react";
import { useNavigationLoader } from "@/components/app-layout/navigation-loader";

export default function CategoryHeader() {
  const pathname = usePathname();
  const { startLoading } = useNavigationLoader();
  const createUrl = '/dashboard/categories/create'

  return (
    <div className="flex items center justify-between w-full">
      <div className="flex flex-col gap-1">
        <h2 className="text-4xl font-semibold">Kategori</h2>
        <p className="text-sm text-muted-foreground">Daftar kategori untuk kacamata dan produk lainnya</p>
      </div>
      <div className="flex items-center">
        <Link
          onClick={() => {
            if (pathname !== createUrl) {
              startLoading();
            }
          }}
          href={createUrl}
          className="
            group
            px-4 py-1 gap-2
            flex items-center justify-center
            border border-black
            bg-black hover:bg-white
            text-white hover:text-black
            transition rounded-md
          "
        >
          <Plus className="size-4 text-white group-hover:text-black transition" />
          Tambah Kategori
        </Link>
      </div>
    </div>
  )
}