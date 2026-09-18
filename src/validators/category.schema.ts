import {
    z
} from "zod";





export const categorySchema =

z.object({


    name:

        z
            .string({
                error:
                "Nama category wajib diisi"
            })
            .min(
                3,
                "Nama category minimal 3 karakter"
            )

});