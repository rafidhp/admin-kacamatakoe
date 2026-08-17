"use client";

import { SquarePen, Trash2 } from "lucide-react";
import { useState } from "react";
import { deleteLens } from "@/app/dashboard/lenses/actions";
import type { Lenses } from "@/app/dashboard/lenses/page";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatRupiah } from "@/lib/currency";
import { showSuccessToast } from "@/lib/toast";
import LensForm from "./lens-form";
import ConfirmationDialog from "../confirmation-dialog";

interface LensTableProps {
  lenses: Lenses[];
}

export default function LensTable({
  lenses,
}: LensTableProps) {
  const [editOpen, setEditOpen] = useState(false);
  const [selectedLens, setSelectedLens] = useState<Lenses | undefined>();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [lensToDelete, setLensToDelete] = useState<Lenses | undefined>();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleEditClicked = (lens: Lenses) => {
    setSelectedLens(lens);
    setEditOpen(true);
  }

  const handleDeleteClicked = (lens: Lenses) => {
    setLensToDelete(lens);
    setDeleteOpen(true);
  };

  const handleDelete = async () => {
    if (!lensToDelete) {
      return;
    }

    setIsDeleting(true);

    try {
      await deleteLens(lensToDelete.id);

      setDeleteOpen(false);
      setLensToDelete(undefined);
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
            <TableHead className="text-center">Jenis Lensa</TableHead>
            <TableHead className="text-center">Harga Lensa</TableHead>
            <TableHead className="text-center">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {lenses.length === 0 ? (
            <TableRow className="h-16 hover:bg-transparent">
              <TableCell colSpan={4}>
                <span className="text-muted-foreground flex w-full items-center justify-center">
                  Data jenis lensa belum ada
                </span>
              </TableCell>
            </TableRow>
          ) : (
            lenses.map((lens, i) => (
              <TableRow key={lens.id}>
                <TableCell className="w-10">{i + 1}</TableCell>
                <TableCell className="text-center">
                  {lens.name}
                </TableCell>
                <TableCell className="text-center">
                  Rp {formatRupiah(lens.price)}
                </TableCell>
                <TableCell className="w-40">
                  <div className="flex items-center justify-center gap-4">
                    <div
                      onClick={() => handleEditClicked(lens)}
                      className="flex cursor-pointer items-center justify-center rounded-full p-1.5 transition hover:bg-gray-400/20"
                    >
                      <SquarePen className="size-5" />
                    </div>
                    <div
                      onClick={() => handleDeleteClicked(lens)}
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
        <LensForm
          open={editOpen}
          onClose={() => setEditOpen(false)}
          lenses={selectedLens}
        />
      )}

      {deleteOpen && (
        <ConfirmationDialog
          open={deleteOpen}
          onClose={() => setDeleteOpen(false)}
          title="Hapus Lensa"
          text="Yakin ingin menghapus lensa ini?"
          handleSubmit={handleDelete}
          isSubmitting={isDeleting}
        />
      )}
    </div>
  )
}