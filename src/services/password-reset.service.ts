import crypto from "crypto";


import {
    prisma
} from "@/lib/prisma";







export async function generateResetToken(
    userId:number
){

    const token =
        crypto.randomBytes(64)
        .toString("hex");





    const expiredAt =
        new Date();



    expiredAt.setMinutes(

        expiredAt.getMinutes() + 15

    );








    await prisma.passwordResetToken.create({

        data:{


            token,


            userId,


            expiredAt


        }

    });






    return token;

}









export async function verifyResetToken(
    token:string
){

    const resetToken =
        await prisma.passwordResetToken.findUnique({

            where:{

                token

            },


            include:{

                user:true

            }

        });








    if(!resetToken){

        return null;

    }








    if(
        resetToken.expiredAt
        <
        new Date()
    ){


        await prisma.passwordResetToken.delete({

            where:{

                id:resetToken.id

            }

        });



        return null;

    }








    return resetToken;

}









export async function deleteResetToken(
    token:string
){

    return await prisma.passwordResetToken.delete({

        where:{

            token

        }

    });

}