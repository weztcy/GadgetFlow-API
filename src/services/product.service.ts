import {
    prisma
} from "@/lib/prisma";


import {
    Prisma
} from "@prisma/client";




// GET ALL PRODUCT
export async function getProducts(
    page:number,
    limit:number,
    search?:string,
    sort?:string,
    minPrice?:number,
    maxPrice?:number,
){

    const skip =
        (page - 1) * limit;



    const where = {


        ...(search
            ?
            {
                name:{
                    contains:search
                }
            }
            :
            {}
        ),




        ...(minPrice !== undefined ||
            maxPrice !== undefined
            ?
            {

                price:{

                    ...(minPrice !== undefined
                        ?
                        {
                            gte:minPrice
                        }
                        :
                        {}
                    ),


                    ...(maxPrice !== undefined
                        ?
                        {
                            lte:maxPrice
                        }
                        :
                        {}
                    )

                }

            }
            :
            {}
        )

    };





    let orderBy:
    Prisma.ProductOrderByWithRelationInput
    |
    undefined;



    if(sort === "price_asc"){

        orderBy = {
            price:"asc"
        };

    }



    if(sort === "price_desc"){

        orderBy = {
            price:"desc"
        };

    }






    const products =
        await prisma.product.findMany({

            where:{

                ...where,

                deletedAt:null

            },


            skip,


            take:limit,


            orderBy,



            include:{

                category:true

            }

        });







    const total =
        await prisma.product.count({

            where:{

                ...where,

                deletedAt:null

            }

        });







    return {

        data:products,


        pagination:{

            page,

            limit,

            total,

            totalPages:
            Math.ceil(
                total / limit
            )

        }

    };

}








// GET DETAIL PRODUCT
export async function getProductById(
    id:number
){

    return await prisma.product.findFirst({

        where:{

            id,

            deletedAt:null

        },


        include:{

            category:true

        }

    });

}









// CREATE PRODUCT
export async function createProduct(
    data:{
        name:string;

        price:number;

        categoryId?:number;

        image?:string;

    }
){

    return await prisma.product.create({

        data:{


            name:
            data.name,


            price:
            data.price,


            image:
            data.image,



            ...(data.categoryId
                ?
                {

                    category:{

                        connect:{

                            id:data.categoryId

                        }

                    }

                }
                :
                {}
            )


        },


        include:{

            category:true

        }


    });

}









// UPDATE PRODUCT
export async function updateProduct(

    id:number,

    data:{

        name:string;

        price:number;

        categoryId?:number;

        image?:string;

    }

){


    return await prisma.product.update({


        where:{

            id

        },



        data:{


            name:
            data.name,



            price:
            data.price,



            ...(data.image !== undefined
                ?
                {
                    image:data.image
                }
                :
                {}
            ),




            ...(data.categoryId
                ?
                {

                    category:{

                        connect:{

                            id:data.categoryId

                        }

                    }

                }
                :
                {}
            )


        },



        include:{


            category:true


        }


    });


}









// DELETE PRODUCT
export async function deleteProduct(
    id:number
){

    return await prisma.product.update({

        where:{

            id

        },


        data:{

            deletedAt:
            new Date()

        }

    });

}