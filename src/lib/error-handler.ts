import {
    Prisma
} from "@prisma/client";


import {
    errorResponse
} from "@/lib/api-response";


import {
    ApiError
} from "@/lib/api-error";



export function handleApiError(
    error: unknown
){


    console.error(error);



    /**
     * Custom API Error
     */
    if(error instanceof ApiError){

        return errorResponse(
            error.message,
            error.statusCode,
            error.code
        );

    }





    /**
     * Prisma Database Error
     */
    if(
        error instanceof Prisma.PrismaClientKnownRequestError
    ){


        switch(error.code){



            /**
             * Unique constraint violation
             * Example:
             * duplicate email
             * duplicate product code
             */
            case "P2002":

                return errorResponse(
                    "Data sudah tersedia",
                    409,
                    "DUPLICATE_DATA"
                );





            /**
             * Foreign key constraint violation
             * Example:
             * delete category that still has products
             */
            case "P2003":

                return errorResponse(
                    "Data masih digunakan oleh data lain",
                    409,
                    "FOREIGN_KEY_ERROR"
                );





            /**
             * Record not found
             */
            case "P2025":

                return errorResponse(
                    "Data tidak ditemukan",
                    404,
                    "NOT_FOUND"
                );





            default:

                return errorResponse(
                    "Database error",
                    500,
                    "DATABASE_ERROR"
                );

        }

    }





    /**
     * Unknown Error
     */
    return errorResponse(
        "Internal Server Error",
        500,
        "INTERNAL_SERVER_ERROR"
    );

}