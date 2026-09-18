import {
    z
} from "zod";





export const registerSchema = z.object({

    name:
    z
        .string({
            error:
            "Nama wajib diisi"
        })
        .min(
            3,
            "Nama minimal 3 karakter"
        ),




    email:
    z
        .string({
            error:
            "Email wajib diisi"
        })
        .email(
            "Email tidak valid"
        ),




    password:
    z
        .string({
            error:
            "Password wajib diisi"
        })
        .min(
            6,
            "Password minimal 6 karakter"
        )

});