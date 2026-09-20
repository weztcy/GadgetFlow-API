import { z } from "zod";


// =======================
// CREATE SUPPLIER
// =======================

export const createSupplierSchema = z.object({

  name: z
    .string()
    .min(
      3,
      "Nama supplier minimal 3 karakter"
    ),


  phone: z
    .string()
    .optional(),


  email: z
    .string()
    .email(
      "Email supplier tidak valid"
    )
    .optional(),


  address: z
    .string()
    .optional(),

});



// =======================
// UPDATE SUPPLIER
// =======================

export const updateSupplierSchema = z.object({

  name: z
    .string()
    .min(
      3,
      "Nama supplier minimal 3 karakter"
    )
    .optional(),


  phone: z
    .string()
    .optional(),


  email: z
    .string()
    .email(
      "Email supplier tidak valid"
    )
    .optional(),


  address: z
    .string()
    .optional(),

});



export type CreateSupplierInput =
  z.infer<
    typeof createSupplierSchema
  >;



export type UpdateSupplierInput =
  z.infer<
    typeof updateSupplierSchema
  >;