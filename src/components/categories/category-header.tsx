"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import CategoryForm from "./category-form";

export default function CategoryHeader() {
  const [createOpen, setCreateOpen] = useState(false);

  const handleCreateClicked = () => {
    setCreateOpen(true);
  }

  return (
    <div className="flex items center justify-between w-full mb-8">
      <div className="flex flex-col gap-1">
        <h2 className="text-4xl font-semibold">Kategori</h2>
        <p className="text-sm text-muted-foreground">Daftar kategori untuk kacamata dan produk lainnya</p>
      </div>
      <div className="flex items-center">
        <div
          onClick={handleCreateClicked}
          className="
            group cursor-pointer
            px-4 py-1 gap-2
            flex items-center justify-center
            border border-black
            bg-black hover:bg-white
            text-white hover:text-black
            transition rounded-sm
          "
        >
          <Plus className="size-4 text-white group-hover:text-black transition" />
          Tambah Kategori
        </div>
      </div>

      {createOpen && (
        <CategoryForm
          open={createOpen}
          onClose={() => setCreateOpen(false)}
        />
      )}
    </div>
  )
}