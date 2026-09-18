import fs from "fs/promises";

import path from "path";

import crypto from "crypto";

import {
    ApiError
} from "@/lib/api-error";





export async function uploadProductImage(
    file:File
){

    const allowedTypes = [

        "image/jpeg",

        "image/png",

        "image/webp"

    ];




    if(
        !allowedTypes.includes(
            file.type
        )
    ){

        throw new ApiError(

            "Format file tidak didukung",

            400

        );

    }






    const maxSize =
        2 * 1024 * 1024;





    if(file.size > maxSize){


        throw new ApiError(

            "Ukuran file maksimal 2MB",

            400

        );

    }







    const bytes =
        await file.arrayBuffer();



    const buffer =
        Buffer.from(bytes);







    const extension =
        file.name.split(".").pop();







    const filename =

        crypto.randomUUID()

        + "."

        + extension;








    const uploadPath =

        path.join(

            process.cwd(),

            "public",

            "uploads",

            "products"

        );








    await fs.mkdir(

        uploadPath,

        {
            recursive:true
        }

    );








    await fs.writeFile(

        path.join(

            uploadPath,

            filename

        ),

        buffer

    );








    return `/uploads/products/${filename}`;

}