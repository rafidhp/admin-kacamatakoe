import { z } from "zod";

export const LensSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Nama lensa wajib diisi.")
    .max(255, "Nama lensa maksimal 255 karakter."),

  price: z
    .number({
      message: "Harga lensa wajib diisi.",
    })
    .int("Harga lensa harus berupa bilangan bulat.")
    .min(0, "Harga lensa tidak boleh kurang dari Rp 0.")
    .max(
      10_000_000_000,
      "Harga lensa maksimal Rp 10.000.000.000.",
    ),
});

export type LensData = z.infer<typeof LensSchema>;