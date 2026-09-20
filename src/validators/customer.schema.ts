import { z } from "zod";


// =======================
// CREATE CUSTOMER
// =======================

export const createCustomerSchema = z.object({

  name: z
    .string()
    .min(3),


  phone: z
    .string()
    .optional(),


  email: z
    .string()
    .email()
    .optional(),


  address: z
    .string()
    .optional(),

});


// =======================
// UPDATE CUSTOMER
// =======================

export const updateCustomerSchema = z.object({

  name: z
    .string()
    .min(3)
    .optional(),


  phone: z
    .string()
    .optional(),


  email: z
    .string()
    .email()
    .optional(),


  address: z
    .string()
    .optional(),

});


export type CreateCustomerInput =
  z.infer<typeof createCustomerSchema>;


export type UpdateCustomerInput =
  z.infer<typeof updateCustomerSchema>;