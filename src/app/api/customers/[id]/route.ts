import { NextRequest } from "next/server";

import {
  getCustomerById,
  updateCustomer,
} from "@/services/customer.service";

import {
  updateCustomerSchema,
} from "@/validators/customer.schema";

import {
  successResponse,
  errorResponse,
} from "@/lib/api-response";


// =======================
// GET CUSTOMER DETAIL
// =======================

export async function GET(
  request: NextRequest,
  context: {
    params: Promise<{
      id: string;
    }>;
  }
) {

  try {

    const { id } =
      await context.params;


    const customer =
      await getCustomerById(
        Number(id)
      );


    return successResponse(
      "Data customer berhasil diambil",
      customer
    );


  } catch (error) {

    return errorResponse(
      "Gagal mengambil data customer"
    );

  }

}



// =======================
// UPDATE CUSTOMER
// =======================

export async function PATCH(
  request: NextRequest,
  context: {
    params: Promise<{
      id: string;
    }>;
  }
) {

  try {

    const { id } =
      await context.params;


    const body =
      await request.json();


    const validated =
      updateCustomerSchema.parse(body);



    const customer =
      await updateCustomer(
        Number(id),
        validated
      );


    return successResponse(
      "Customer berhasil diperbarui",
      customer
    );


  } catch (error) {

    return errorResponse(
      "Gagal memperbarui customer"
    );

  }

}