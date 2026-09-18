import { z } from "zod";

export const productSchema = z.object({
  name: z
    .string({
      error: "Nama product wajib diisi",
    })
    .min(3, "Nama product minimal 3 karakter"),

  price: z
    .number({
      error: "Harga wajib diisi",
    })
    .positive("Harga harus lebih dari 0"),

  categoryId: z
    .number({
      error: "Category tidak valid",
    })
    .int("Category ID harus berupa angka")
    .positive("Category tidak valid")
    .optional(),

  image: z.string().optional(),
});
