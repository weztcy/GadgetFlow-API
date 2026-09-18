import {
    z
} from "zod";


export const categorySchema =
z.object({

    name:
        z.string()
        .min(
            3,
            "Nama category minimal 3 karakter"
        )

});