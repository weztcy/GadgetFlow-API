import { NextRequest } from "next/server";


import {
  successResponse,
  errorResponse,
} from "@/lib/api-response";


import {
  getSupplierById,
  updateSupplier,
  deleteSupplier,
} from "@/services/supplier.service";


import {
  updateSupplierSchema,
} from "@/validators/supplier.schema";



// =======================
// GET DETAIL
// =======================

export async function GET(
  request: NextRequest,
  context:{
    params:Promise<{
      id:string
    }>
  }
){

  try {


    const {id} =
      await context.params;



    const supplier =
      await getSupplierById(
        Number(id)
      );



    return successResponse(
      "Supplier ditemukan",
      supplier
    );


  } catch(error){


    return errorResponse(
      "Gagal mengambil supplier"
    );


  }

}



// =======================
// UPDATE
// =======================

export async function PATCH(
  request:NextRequest,
  context:{
    params:Promise<{
      id:string
    }>
  }
){

  try {


    const {id} =
      await context.params;



    const body =
      await request.json();



    const validated =
      updateSupplierSchema.parse(
        body
      );



    const supplier =
      await updateSupplier(
        Number(id),
        validated
      );



    return successResponse(
      "Supplier berhasil diperbarui",
      supplier
    );



  }catch(error){


    return errorResponse(
      "Gagal memperbarui supplier"
    );


  }

}



// =======================
// DELETE
// =======================

export async function DELETE(
  request:NextRequest,
  context:{
    params:Promise<{
      id:string
    }>
  }
){

  try {


    const {id} =
      await context.params;



    const supplier =
      await deleteSupplier(
        Number(id)
      );



    return successResponse(
      "Supplier berhasil dihapus",
      supplier
    );


  }catch(error){


    return errorResponse(
      "Gagal menghapus supplier"
    );


  }

}