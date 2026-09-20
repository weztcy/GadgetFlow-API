import { NextRequest } from "next/server";

import {
  successResponse,
  errorResponse,
} from "@/lib/api-response";

import {
  createSupplier,
  getSuppliers,
} from "@/services/supplier.service";

import {
  createSupplierSchema,
} from "@/validators/supplier.schema";


// =======================
// GET ALL SUPPLIER
// =======================

export async function GET() {

  try {


    const suppliers =
      await getSuppliers();



    return successResponse(
      "Berhasil mengambil data supplier",
      suppliers
    );


  } catch (error) {


    return errorResponse(
      "Gagal mengambil data supplier"
    );


  }

}



// =======================
// CREATE SUPPLIER
// =======================

export async function POST(
  request: NextRequest
) {


  try {


    const body =
      await request.json();



    const validated =
      createSupplierSchema.parse(
        body
      );



    const supplier =
      await createSupplier(
        validated
      );



    return successResponse(
      "Supplier berhasil dibuat",
      supplier,
      201
    );



  } catch(error){


    return errorResponse(
      "Gagal membuat supplier"
    );


  }

}