import Link from "next/link";
import { Plus } from "lucide-react";

export default function GlassesHeader() {
  return (
    <div className="flex items center justify-between w-full">
      <div className="flex flex-col">
        <h2 className="text-4xl font-semibold">Kacamata</h2>
        <p className="text-sm text-muted-foreground">Daftar produk kacamata</p>
      </div>
      <div className="flex items-center">
        <Link
          href='/dashboard/glasses/create'
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
          Tambah Kacamata
        </Link>
      </div>
    </div>
  )
}