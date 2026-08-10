"use client";

import { Check, SquarePen, Trash2, X } from "lucide-react";
import { useState } from "react";
import { deleteCategory } from "@/app/dashboard/categories/actions";
import type { Category } from "@/app/dashboard/categories/page";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { showSuccessToast } from "@/lib/toast";
import CategoryForm from "./category-form";
import ConfirmationDialog from "../confirmation-dialog";

interface CategoryTableProps {
  categories: Category[];
}

export default function CategoryTable({ categories }: CategoryTableProps) {
  const [editOpen, setEditOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<
    Category | undefined
  >();

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<
    Category | undefined
  >();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleEditClicked = (category: Category) => {
    setSelectedCategory(category);
    setEditOpen(true);
  };

  const handleDeleteClicked = (category: Category) => {
    setCategoryToDelete(category);
    setDeleteOpen(true);
  };

  const handleDelete = async () => {
    if (!categoryToDelete) {
      return;
    }

    setIsDeleting(true);

    try {
      await deleteCategory(categoryToDelete.id);

      setDeleteOpen(false);
      setCategoryToDelete(undefined);
      showSuccessToast("Kategori berhasil dihapus");
    } catch (error) {
      console.error(error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex items-center justify-center overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="border-b-black/40 hover:bg-transparent">
            <TableHead className="w-10">No</TableHead>
            <TableHead className="text-center">Nama Kategori</TableHead>
            <TableHead className="text-center">Deskripsi Kategori</TableHead>
            <TableHead className="text-center">Kacamata</TableHead>
            <TableHead className="text-center">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.length === 0 ? (
            <TableRow className="h-16 hover:bg-transparent">
              <TableCell colSpan={5}>
                <span className="text-muted-foreground flex w-full items-center justify-center">
                  Data kategori belum ada
                </span>
              </TableCell>
            </TableRow>
          ) : (
            categories.map((category, i) => (
              <TableRow key={category.id}>
                <TableCell className="w-10">{i + 1}</TableCell>
                <TableCell className="text-center">{category.name}</TableCell>
                <TableCell className="text-center">
                  {(category.description ?? "-") ||
                    (category.description === "" && "-")}
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex w-full items-center justify-center">
                    {category.isGlasses ? (
                      <Check className="text-green-500" />
                    ) : (
                      <X />
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-center gap-4">
                    <div
                      onClick={() => handleEditClicked(category)}
                      className="flex cursor-pointer items-center justify-center rounded-full p-1.5 transition hover:bg-gray-400/20"
                    >
                      <SquarePen className="size-5" />
                    </div>
                    <div
                      onClick={() => handleDeleteClicked(category)}
                      className="flex cursor-pointer items-center justify-center rounded-full p-1.5 transition hover:bg-red-400/20"
                    >
                      <Trash2 className="size-5 text-red-500" />
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {/* dialogs */}
      {editOpen && (
        <CategoryForm
          open={editOpen}
          onClose={() => setEditOpen(false)}
          category={selectedCategory}
        />
      )}

      {deleteOpen && (
        <ConfirmationDialog
          open={deleteOpen}
          onClose={() => setDeleteOpen(false)}
          title="Hapus Kategori"
          text="Yakin mau hapus kategori?"
          handleSubmit={handleDelete}
          isSubmitting={isDeleting}
        />
      )}
    </div>
  );
}
