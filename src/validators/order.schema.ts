import {
    z
} from "zod";





export const orderSchema =

z.object({


    customerName:

        z
            .string({
                error:
                "Nama customer wajib diisi"
            })
            .min(
                3,
                "Nama customer minimal 3 karakter"
            ),





    items:

        z
            .array(

                z.object({

                    productId:

                        z
                            .number({
                                error:
                                "Product ID wajib diisi"
                            })
                            .int(
                                "Product ID harus berupa angka bulat"
                            )
                            .positive(
                                "Product ID tidak valid"
                            ),




                    quantity:

                        z
                            .number({
                                error:
                                "Quantity wajib diisi"
                            })
                            .int(
                                "Quantity harus berupa angka bulat"
                            )
                            .positive(
                                "Quantity minimal 1"
                            )

                })

            )
            .min(
                1,
                "Order minimal memiliki 1 product"
            )

});