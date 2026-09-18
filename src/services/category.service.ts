import {
    prisma
} from "@/lib/prisma";


import {
    ApiError
} from "@/lib/api-error";



// GET ALL CATEGORY

export async function getCategories(){

    return await prisma.category.findMany();

}




// GET CATEGORY BY ID

export async function getCategoryById(
    id:number
){

    return await prisma.category.findUnique({

        where:{
            id
        },


        include:{
            products:true
        }

    });

}





// CREATE CATEGORY

export async function createCategory(
    data:{
        name:string;
    }
){

    return await prisma.category.create({

        data

    });

}




// UPDATE CATEGORY

export async function updateCategory(
    id:number,
    data:{
        name:string;
    }
){

    return await prisma.category.update({

        where:{
            id
        },

        data

    });

}




// DELETE CATEGORY

export async function deleteCategory(
    id:number
){

    const products =
        await prisma.product.count({

            where:{
                categoryId:id
            }

        });



    if(products > 0){

        throw new ApiError(
            "Category masih memiliki product",
            409
        );

    }



    return await prisma.category.delete({

        where:{
            id
        }

    });

}