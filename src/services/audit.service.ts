import {
    prisma
} from "@/lib/prisma";


import {
    Prisma
} from "@prisma/client";



export async function createAuditLog(
    data:{
        userId?:number;

        action:string;

        entity:string;

        entityId:number;

        oldData?:Prisma.InputJsonValue;

        newData?:Prisma.InputJsonValue;

        ipAddress?:string;

        userAgent?:string;
    }
){


    return await prisma.auditLog.create({

        data:{


            userId:data.userId,


            action:data.action,


            entity:data.entity,


            entityId:data.entityId,


            oldData:data.oldData,


            newData:data.newData,


            ipAddress:data.ipAddress,


            userAgent:data.userAgent

        }

    });

}