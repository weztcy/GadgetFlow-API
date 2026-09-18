import {
    prisma
} from "@/lib/prisma";



export async function createAuditLog(
    data:{
        userId?:number;
        action:string;
        entity:string;
        entityId:number;
        oldData?:any;
        newData?:any;
    }
){


    return await prisma.auditLog.create({

        data:{

            userId:data.userId,

            action:data.action,

            entity:data.entity,

            entityId:data.entityId,

            oldData:data.oldData,

            newData:data.newData

        }

    });

}