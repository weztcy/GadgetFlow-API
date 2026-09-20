import { prisma } from "@/lib/prisma";

import {
  CreateSupplierInput,
  UpdateSupplierInput,
} from "@/validators/supplier.schema";

import { ApiError } from "@/lib/api-error";


// =======================
// CREATE SUPPLIER
// =======================

export async function createSupplier(
  data: CreateSupplierInput
) {


  if (data.email) {

    const existing =
      await prisma.supplier.findUnique({

        where:{
          email:data.email
        }

      });


    if(existing){

      throw new ApiError(
        "Email supplier sudah digunakan",
        400,
        "SUPPLIER_EMAIL_EXISTS"
      );

    }

  }



  return prisma.supplier.create({

    data,

  });

}



// =======================
// GET ALL SUPPLIER
// =======================

export async function getSuppliers(){

  return prisma.supplier.findMany({

    orderBy:{
      createdAt:"desc"
    }

  });

}



// =======================
// GET DETAIL
// =======================

export async function getSupplierById(
  id:number
){

  const supplier =
    await prisma.supplier.findUnique({

      where:{
        id
      },


      include:{
        purchases:true
      }

    });



  if(!supplier){

    throw new ApiError(
      "Supplier tidak ditemukan",
      404,
      "SUPPLIER_NOT_FOUND"
    );

  }


  return supplier;

}



// =======================
// UPDATE
// =======================

export async function updateSupplier(
  id:number,
  data:UpdateSupplierInput
){

  const supplier =
    await prisma.supplier.findUnique({

      where:{
        id
      }

    });



  if(!supplier){

    throw new ApiError(
      "Supplier tidak ditemukan",
      404,
      "SUPPLIER_NOT_FOUND"
    );

  }



  return prisma.supplier.update({

    where:{
      id
    },


    data,

  });

}



// =======================
// DELETE
// =======================

export async function deleteSupplier(
  id:number
){

  const supplier =
    await prisma.supplier.findUnique({

      where:{
        id
      }

    });



  if(!supplier){

    throw new ApiError(
      "Supplier tidak ditemukan",
      404,
      "SUPPLIER_NOT_FOUND"
    );

  }



  return prisma.supplier.delete({

    where:{
      id
    }

  });

}