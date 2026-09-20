import { z } from "zod";


// =======================
// CREATE STOCK MOVEMENT
// =======================

export const createStockMovementSchema =
  z.object({

    productId: z
      .number()
      .int()
      .positive(),


    warehouseId: z
      .number()
      .int()
      .positive(),


    type: z.enum([
      "PURCHASE",
      "SALE",
      "RETURN",
      "ADJUSTMENT",
      "DAMAGE",
      "TRANSFER",
    ]),


    quantity: z
      .number()
      .int()
      .positive(),


    reference: z
      .string()
      .optional(),


    note: z
      .string()
      .optional(),

  });



export type CreateStockMovementInput =
  z.infer<
    typeof createStockMovementSchema
  >;