import { prisma } from "@/lib/prisma";


export async function createUser(
    data:{
        name:string;
        email:string;
        password:string;
    }
){

    return await prisma.user.create({

        data

    });

}



export async function getUserByEmail(
    email:string
){

    return await prisma.user.findUnique({

        where:{
            email
        }

    });

}

export async function getUserById(
    id:number
){

    return await prisma.user.findUnique({

        where:{
            id
        },

        select:{

            id:true,

            name:true,

            email:true,

            createdAt:true

        }

    });

}