"use client";

import type { FormEvent } from "react";
import { useEffect, useState } from "react";
import { Loader2, X } from "lucide-react";
import {createLens, updateLens } from "@/app/dashboard/lenses/actions";
import type { Lenses } from "@/app/dashboard/lenses/page";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatRupiah, parseRupiah } from "@/lib/currency";
import { showSuccessToast } from "@/lib/toast";

interface LensFormProps {
  open: boolean;
  onClose: () => void;
  lenses?: Lenses;
}

interface LensFormData {
  name: string;
  price: string;
}

const INITIAL_DATA: LensFormData = {
  name: "",
  price: "",
};

export default function LensForm({
  open,
  onClose,
  lenses,
}: LensFormProps) {
  const [data, setData] = useState<LensFormData>(INITIAL_DATA);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const isEdit = Boolean(lenses);

  useEffect(() => {
    if (!open) {
      return;
    }

    if (lenses) {
      setData({
        name: lenses.name,
        price:
          lenses.price !== null &&
          lenses.price !== undefined
            ? String(lenses.price)
            : "",
      });
    } else {
      setData(INITIAL_DATA);
    }

    setError("");
  }, [lenses, open]);

  if (!open) {
    return null;
  }

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    setError("");

    if (!data.name.trim()) {
      setError("Nama lensa wajib diisi.");
      return;
    }

    if (!data.price.trim()) {
      setError("Harga lensa wajib diisi.");
      return;
    }

    const price = Number(data.price);

    if (!Number.isFinite(price) || price < 0 || price > 10_000_000_000) {
      setError("Harga lensa tidak valid.");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        name: data.name.trim(),
        price,
      };

      if (isEdit && lenses) {
        await updateLens(
          lenses.id,
          payload,
        );

        showSuccessToast(
          "Lensa berhasil diperbarui",
          `"${data.name}" berhasil diperbarui.`,
        );
      } else {
        await createLens(payload);

        showSuccessToast(
          "Lensa berhasil ditambahkan",
          `"${data.name}" berhasil ditambahkan.`,
        );
      }

      setData(INITIAL_DATA);
      onClose();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan.";

      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-lg bg-white p-6 shadow-xl">
        {/* header */}
        <div className="mb-6 flex items-start justify-between">
          <div className="flex flex-col">
            <h2 className="text-xl font-semibold">
              {isEdit ? "Edit Lensa" : "Tambah Lensa"}
            </h2>
            <p className="text-muted-foreground text-sm">
              {isEdit ? "Ubah informasi lensa." : "Tambahkan lensa baru."}
            </p>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onClose}
            disabled={isSubmitting}
            className="group cursor-pointer transition hover:bg-red-500/5"
          >
            <X className="size-5 transition group-hover:text-red-500" />
          </Button>
        </div>

        {/* form */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-5"
        >
          <div className="flex flex-col gap-2">
            <Label htmlFor="lens-name">
              Nama Lensa
              <span className="text-red-500">*</span>
            </Label>
            <Input
              id="lens-name"
              value={data.name}
              onChange={(event) =>
                setData((previous) => ({
                  ...previous,
                  name: event.target.value,
                }))
              }
              placeholder="Contoh: Blue Ray"
              disabled={isSubmitting}
              className="border-black/20 focus-visible:ring-black/5"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="lens-price">
              Harga
              <span className="text-red-500">*</span>
            </Label>

            <div className="relative">
              <span className="text-muted-foreground pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm">
                Rp
              </span>
              <Input
                id="lens-price"
                type="text"
                inputMode="numeric"
                value={formatRupiah(data.price)}
                onChange={(event) => {
                  const value = parseRupiah(
                    event.target.value,
                  );

                  if (
                    value > 10_000_000_000
                  ) {
                    return;
                  }

                  setData((previous) => ({
                    ...previous,
                    price: String(value),
                  }));
                }}
                placeholder="Contoh: 150000"
                disabled={isSubmitting}
                className="
                  border-black/20 pl-10
                  focus-visible:ring-black/5
                "
              />
            </div>
          </div>

          {error && (
            <p className="text-sm text-red-500">
              {error}
            </p>
          )}

          {/* footer */}
          <div className="flex justify-end gap-2 border-t pt-5">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              className="cursor-pointer"
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="cursor-pointer border border-black bg-black text-white transition hover:bg-white hover:text-black"
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
  );
}
