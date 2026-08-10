import { z } from "zod";

export const categorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Nama kategori wajib diisi.")
    .max(255, "Nama kategori maksimal 255 karakter."),

  description: z
    .string()
    .trim()
    .max(255, "Deskripsi maksimal 255 karakter.")
    .optional(),

  isGlasses: z.boolean(),
});

export type CategoryData = z.infer<typeof categorySchema>;