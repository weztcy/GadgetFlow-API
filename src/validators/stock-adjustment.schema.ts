import { z } from "zod";


// =======================
// CREATE STOCK ADJUSTMENT
// =======================

export const createStockAdjustmentSchema =
  z.object({

    productId:
      z
        .number({
          error: "Product ID wajib berupa angka",
        })
        .int("Product ID harus berupa angka bulat")
        .positive("Product ID tidak valid"),



    warehouseId:
      z
        .number({
          error: "Warehouse ID wajib berupa angka",
        })
        .int("Warehouse ID harus berupa angka bulat")
        .positive("Warehouse ID tidak valid"),



    quantity:
      z
        .number({
          error: "Quantity wajib berupa angka",
        })
        .int("Quantity harus berupa angka bulat")
        .refine(
          (value) => value !== 0,
          {
            message:
              "Quantity adjustment tidak boleh 0",
          }
        ),



    note:
      z
        .string()
        .min(
          3,
          "Catatan minimal 3 karakter"
        )
        .max(
          255,
          "Catatan maksimal 255 karakter"
        )
        .optional(),

  });




// =======================
// TYPE
// =======================

export type CreateStockAdjustmentInput =
  z.infer<
    typeof createStockAdjustmentSchema
  >;