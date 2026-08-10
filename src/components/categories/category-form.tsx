"use client";

import { useEffect, useState } from "react";
import { Loader2, X } from "lucide-react";
import {
  createCategory,
  updateCategory,
} from "@/app/dashboard/categories/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import type { Category } from "@/app/dashboard/categories/page";
import type { CategoryData } from "@/lib/validations/category";
import { showSuccessToast, showErrorToast } from "@/lib/toast";

interface CategoryFormProps {
  open: boolean;
  onClose: () => void;
  category?: Category;
}

export default function CategoryForm({
  open,
  onClose,
  category,
}: CategoryFormProps) {
  const [data, setData] = useState<CategoryData>({
    name: "",
    description: "",
    isGlasses: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const isEdit = Boolean(category);

  useEffect(() => {
    if (!open) {
      return;
    }

    if (category) {
      setData({
        name: category.name,
        description: category.description ?? "",
        isGlasses: category.isGlasses ?? false,
      });
    } else {
      setData({
        name: "",
        description: "",
        isGlasses: false,
      });
    }

    setError("");
  }, [category, open]);

  if (!open) {
    return null;
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");
    setIsSubmitting(true);

    try {
      if (isEdit && category) {
        await updateCategory(category.id, data);

        showSuccessToast(
          "Kategori berhasil diperbarui",
          `"${data.name}" berhasil diperbarui.`,
        );
      } else {
        await createCategory(data);

        showSuccessToast(
          "Kategori berhasil ditambahkan",
          `"${data.name}" berhasil ditambahkan.`,
        );
      }

      setData({
        name: "",
        description: "",
        isGlasses: false,
      });

      onClose();
    } catch (error) {
      const message = error instanceof Error
        ? error.message
        : "Terjadi kesalahan.";

      setError(message);

      showErrorToast(
        isEdit
          ? "Gagal memperbarui kategori"
          : "Gagal menambahkan kategori",
        message,
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-lg bg-white p-6 shadow-xl">
        {/* header */}
        <div className="mb-6 flex items-start justify-between">
          <div className="flex flex-col">
            <h2 className="text-xl font-semibold">
              {isEdit ? "Edit Kategori" : "Tambah Kategori"}
            </h2>
            <p className="text-muted-foreground text-sm">
              {isEdit ? "Ubah informasi kategori." : "Tambahkan kategori baru."}
            </p>
          </div>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onClose}
            disabled={isSubmitting}
            className="group hover:bg-red-500/5 transition cursor-pointer"
          >
            <X className="size-5 group-hover:text-red-500 transition" />
          </Button>
        </div>

        {/* form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <Label htmlFor="name">
              Nama Kategori
              <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              value={data.name}
              onChange={(e) =>
                setData((previous) => ({
                  ...previous,
                  name: e.target.value,
                }))
              }
              placeholder="Contoh: Kacamata Pria"
              disabled={isSubmitting}
              className="border-black/20 focus-visible:ring-black/5"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="description">Deskripsi</Label>
            <Textarea
              id="description"
              value={data.description ?? ""}
              onChange={(e) =>
                setData((previous) => ({
                  ...previous,
                  description: e.target.value,
                }))
              }
              placeholder="Deskripsi kategori..."
              disabled={isSubmitting}
              className="border-black/20 focus-visible:ring-black/5"
            />
          </div>
          <div className="flex items-center gap-3">
            <Checkbox
              id="isGlasses"
              checked={data.isGlasses}
              onCheckedChange={(checked) =>
                setData((previous) => ({
                  ...previous,
                  isGlasses: checked === true,
                }))
              }
              disabled={isSubmitting}
              className="cursor-pointer"
            />
            <Label
              htmlFor="isGlasses"
              className="cursor-pointer"
            >
              Kategori kacamata
            </Label>
          </div>

          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}

          {/* footer */}
          <div className="flex justify-end gap-2 border-t pt-5">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Batal
            </Button>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="cursor-pointer border border-black bg-black text-white hover:bg-white hover:text-black transition"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Menyimpan...
                </>
              ) : isEdit ? (
                "Simpan Perubahan"
              ) : (
                "Simpan"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
