import { z } from "zod";


// =======================
// CREATE INVENTORY
// =======================

export const createInventorySchema = z.object({

  productId: z
    .number()
    .int()
    .positive(),


  warehouseId: z
    .number()
    .int()
    .positive(),


  quantity: z
    .number()
    .int()
    .min(0),

});



// =======================
// UPDATE INVENTORY
// =======================

export const updateInventorySchema = z.object({

  quantity: z
    .number()
    .int()
    .min(0),

});



export type CreateInventoryInput =
  z.infer<typeof createInventorySchema>;


export type UpdateInventoryInput =
  z.infer<typeof updateInventorySchema>;