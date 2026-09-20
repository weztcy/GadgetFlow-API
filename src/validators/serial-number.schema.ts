import { z } from "zod";

// =======================
// CREATE SERIAL NUMBER
// =======================

export const createSerialNumberSchema = z.object({
  productId: z
    .number({
      error: "Product ID wajib diisi",
    })
    .int("Product ID harus angka bulat")
    .positive("Product ID tidak valid"),

  warehouseId: z
    .number({
      error: "Warehouse ID wajib diisi",
    })
    .int("Warehouse ID harus angka bulat")
    .positive("Warehouse ID tidak valid"),

  serialNumber: z
    .string({
      error: "Serial number wajib diisi",
    })
    .min(3, "Serial number minimal 3 karakter")
    .max(100, "Serial number maksimal 100 karakter"),
});

// =======================
// UPDATE SERIAL STATUS
// =======================

export const updateSerialNumberSchema = z.object({
  status: z.enum(["AVAILABLE", "RESERVED", "SOLD", "REPAIR", "DAMAGED"], {
    error: "Status serial number tidak valid",
  }),
});

// =======================
// TYPES
// =======================

export type CreateSerialNumberInput = z.infer<typeof createSerialNumberSchema>;

export type UpdateSerialNumberInput = z.infer<typeof updateSerialNumberSchema>;
