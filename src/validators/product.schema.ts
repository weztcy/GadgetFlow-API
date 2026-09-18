import {
    z
} from "zod";



export const productSchema =

z.object({

    name:

        z.string()
        .min(
            3,
            "Nama product minimal 3 karakter"
        ),



    price:

        z.number()
        .positive(
            "Harga harus lebih dari 0"
        ),



    categoryId:

        z.number()
        .int()
        .positive(
            "Category tidak valid"
        )
        .optional(),



    image:

        z.string()
        .optional()

});