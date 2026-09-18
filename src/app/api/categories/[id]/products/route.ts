import {
    NextResponse
} from "next/server";


import {
    prisma
} from "@/lib/prisma";


/**
 * @swagger
 * /api/categories/{id}/products:
 *   get:
 *     summary: Get products by category
 *
 *     tags:
 *       - Categories
 *
 *     parameters:
 *
 *       - in: path
 *         name: id
 *         required: true
 *
 *         schema:
 *           type: integer
 *           example: 1
 *
 *       - in: query
 *         name: page
 *         required: false
 *
 *         schema:
 *           type: integer
 *           example: 1
 *
 *       - in: query
 *         name: limit
 *         required: false
 *
 *         schema:
 *           type: integer
 *           example: 10
 *
 *
 *     responses:
 *
 *       200:
 *         description: Berhasil mengambil product berdasarkan category
 *
 *       400:
 *         description: ID category tidak valid
 *
 *       404:
 *         description: Category tidak ditemukan
 *
 *       500:
 *         description: Internal server error
 */
export async function GET(
    request:Request,
    context:{
        params:Promise<{id:string}>
    }
){

    const {id} =
        await context.params;



    const categoryId =
        Number(id);



    const {
        searchParams
    } =
        new URL(request.url);



    const page =
        Number(
            searchParams.get("page")
        ) || 1;



    const limit =
        Number(
            searchParams.get("limit")
        ) || 10;



    const products =
        await prisma.product.findMany({

            where:{
                categoryId
            },


            skip:
            (page-1)*limit,


            take:limit

        });



    return NextResponse.json({

        data:products,

        pagination:{
            page,
            limit
        }

    });

}