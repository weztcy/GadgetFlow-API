import { z } from "zod";

// =======================
// CREATE ORDER
// =======================

export const orderSchema = z.object({
  customerId: z
    .number({
      error: "Customer ID wajib berupa angka",
    })
    .int("Customer ID harus berupa angka bulat")
    .positive("Customer ID tidak valid")
    .optional(),

  items: z
    .array(
      z.object({
        productId: z
          .number({
            error: "Product ID wajib diisi",
          })
          .int("Product ID harus berupa angka bulat")
          .positive("Product ID tidak valid"),

        warehouseId: z
          .number({
            error: "Warehouse ID wajib diisi",
          })
          .int("Warehouse ID harus berupa angka bulat")
          .positive("Warehouse ID tidak valid"),

        quantity: z
          .number({
            error: "Quantity wajib diisi",
          })
          .int("Quantity harus berupa angka bulat")
          .positive("Quantity minimal 1"),

        // =======================
        // SERIAL NUMBER / IMEI
        // =======================

        serialNumberIds: z
          .array(
            z
              .number({
                error: "Serial Number ID harus berupa angka",
              })
              .int("Serial Number ID harus berupa angka bulat")
              .positive("Serial Number ID tidak valid"),
          )
          .optional(),
      }),
    )

    .min(1, "Order minimal memiliki 1 product"),
});

export type CreateOrderInput = z.infer<typeof orderSchema>;
