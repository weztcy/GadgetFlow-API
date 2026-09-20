import { z } from "zod";


export const createWarehouseSchema = z.object({

  code: z
    .string()
    .min(3, "Warehouse code minimal 3 karakter")
    .max(50, "Warehouse code maksimal 50 karakter")
    .trim(),


  name: z
    .string()
    .min(3, "Warehouse name minimal 3 karakter")
    .max(100, "Warehouse name maksimal 100 karakter")
    .trim(),


  location: z
    .string()
    .max(255, "Location maksimal 255 karakter")
    .trim()
    .optional(),

});


export const updateWarehouseSchema = z.object({

  name: z
    .string()
    .min(3, "Warehouse name minimal 3 karakter")
    .max(100, "Warehouse name maksimal 100 karakter")
    .trim()
    .optional(),


  location: z
    .string()
    .max(255, "Location maksimal 255 karakter")
    .trim()
    .optional(),


  status: z
    .enum([
      "ACTIVE",
      "INACTIVE"
    ])
    .optional(),

});


export type CreateWarehouseInput =
  z.infer<typeof createWarehouseSchema>;


export type UpdateWarehouseInput =
  z.infer<typeof updateWarehouseSchema>;