import { z } from "zod";

// =======================
// CREATE PURCHASE
// =======================

export const createPurchaseSchema = z.object({

  supplierId:
    z
      .number({
        error: "Supplier ID wajib berupa angka",
      })
      .int("Supplier ID harus berupa angka bulat")
      .positive("Supplier ID tidak valid")
      .optional(),



  items:
    z
      .array(

        z.object({


          productId:
            z
              .number({
                error: "Product ID wajib diisi",
              })
              .int("Product ID harus berupa angka bulat")
              .positive("Product ID tidak valid"),



          warehouseId:
            z
              .number({
                error: "Warehouse ID wajib diisi",
              })
              .int("Warehouse ID harus berupa angka bulat")
              .positive("Warehouse ID tidak valid"),



          quantity:
            z
              .number({
                error: "Quantity wajib diisi",
              })
              .int("Quantity harus berupa angka bulat")
              .positive("Quantity minimal 1"),



          price:
            z
              .number({
                error: "Harga wajib diisi",
              })
              .int("Harga harus berupa angka bulat")
              .positive("Harga minimal 1"),



          // =======================
          // OPTIONAL IMEI / SERIAL
          // =======================

          serialNumbers:
            z
              .array(
                z
                  .string()
                  .min(
                    3,
                    "Serial number minimal 3 karakter"
                  )
                  .max(
                    100,
                    "Serial number maksimal 100 karakter"
                  )
              )
              .optional(),


        })

      )
      .min(
        1,
        "Purchase minimal memiliki 1 item"
      ),

});



export type CreatePurchaseInput =
  z.infer<
    typeof createPurchaseSchema
  >;