import { prisma } from "@/lib/prisma";

import {
  CreateSerialNumberInput,
  UpdateSerialNumberInput,
} from "@/validators/serial-number.schema";

import { ApiError } from "@/lib/api-error";



// =======================
// CREATE SERIAL NUMBER
// =======================

export async function createSerialNumber(
  data: CreateSerialNumberInput
) {


  const existing =
    await prisma.serialNumber.findUnique({

      where:{
        serialNumber:
          data.serialNumber
      }

    });



  if(existing){

    throw new ApiError(
      "Serial number sudah terdaftar",
      400,
      "SERIAL_EXISTS"
    );

  }



  return prisma.serialNumber.create({

    data:{

      productId:
        data.productId,


      warehouseId:
        data.warehouseId,


      serialNumber:
        data.serialNumber,


    },


    include:{

      product:true,

      warehouse:true,

    }

  });

}



// =======================
// GET ALL SERIAL NUMBER
// =======================

export async function getSerialNumbers(){

  return prisma.serialNumber.findMany({

    include:{

      product:true,

      warehouse:true,

      order:true,

    },


    orderBy:{

      createdAt:"desc",

    }

  });

}



// =======================
// GET SERIAL NUMBER BY ID
// =======================

export async function getSerialNumberById(
  id:number
){

  const serial =
    await prisma.serialNumber.findUnique({

      where:{
        id
      },


      include:{

        product:true,

        warehouse:true,

        order:true,

      }

    });



  if(!serial){

    throw new ApiError(
      "Serial number tidak ditemukan",
      404,
      "SERIAL_NOT_FOUND"
    );

  }



  return serial;

}



// =======================
// UPDATE SERIAL STATUS
// =======================

export async function updateSerialStatus(
  id:number,
  data:UpdateSerialNumberInput
){

  const serial =
    await prisma.serialNumber.findUnique({

      where:{
        id
      }

    });



  if(!serial){

    throw new ApiError(
      "Serial number tidak ditemukan",
      404,
      "SERIAL_NOT_FOUND"
    );

  }



  if(
    serial.status === "SOLD" &&
    data.status !== "SOLD"
  ){

    throw new ApiError(
      "Serial number yang sudah terjual tidak bisa diubah",
      400,
      "SERIAL_ALREADY_SOLD"
    );

  }



  return prisma.serialNumber.update({

    where:{
      id
    },


    data:{

      status:
        data.status,


      soldAt:
        data.status === "SOLD"
          ? new Date()
          : serial.soldAt,

    },


    include:{

      product:true,

      warehouse:true,

      order:true,

    }

  });

}



// =======================
// DELETE SERIAL NUMBER
// =======================

export async function deleteSerialNumber(
  id:number
){

  const serial =
    await prisma.serialNumber.findUnique({

      where:{
        id
      }

    });



  if(!serial){

    throw new ApiError(
      "Serial number tidak ditemukan",
      404,
      "SERIAL_NOT_FOUND"
    );

  }



  if(serial.status === "SOLD"){

    throw new ApiError(
      "Serial number yang sudah terjual tidak bisa dihapus",
      400,
      "SERIAL_ALREADY_SOLD"
    );

  }



  return prisma.serialNumber.delete({

    where:{
      id
    }

  });

}