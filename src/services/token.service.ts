import jwt from "jsonwebtoken";

import crypto from "crypto";

import {
    prisma
} from "@/lib/prisma";





export function generateAccessToken(
    user:{
        id:number;

        email:string;

        role:string;
    }
){

    return jwt.sign(

        {
            id:user.id,

            email:user.email,

            role:user.role

        },


        process.env.JWT_SECRET as string,


        {
            expiresIn:"15m"
        }

    );

}







export async function generateRefreshToken(
    userId:number
){

    const token =
        crypto.randomBytes(64)
        .toString("hex");




    const expiredAt =
        new Date();



    expiredAt.setDate(

        expiredAt.getDate() + 7

    );







    await prisma.refreshToken.create({

        data:{


            token,


            userId,


            expiredAt


        }

    });






    return token;

}









export async function verifyRefreshToken(
    token:string
){

    const refreshToken =
        await prisma.refreshToken.findUnique({

            where:{
                token
            },


            include:{
                user:true
            }

        });







    if(!refreshToken){

        return null;

    }







    if(
        refreshToken.expiredAt
        <
        new Date()
    ){

        await prisma.refreshToken.delete({

            where:{
                id:refreshToken.id
            }

        });



        return null;

    }








    return refreshToken.user;

}