import { NextRequest } from "next/server";

import {
  createCustomer,
  getCustomers,
} from "@/services/customer.service";

import {
  createCustomerSchema,
} from "@/validators/customer.schema";

import {
  successResponse,
  errorResponse,
} from "@/lib/api-response";


// =======================
// GET ALL CUSTOMER
// =======================

export async function GET() {

  try {

    const customers =
      await getCustomers();


    return successResponse(
      "Data customer berhasil diambil",
      customers
    );


  } catch (error) {

    return errorResponse(
      "Gagal mengambil data customer"
    );

  }

}



// =======================
// CREATE CUSTOMER
// =======================

export async function POST(
  request: NextRequest
) {

  try {

    const body =
      await request.json();


    const validated =
      createCustomerSchema.parse(body);



    const customer =
      await createCustomer(
        validated
      );


    return successResponse(
      "Customer berhasil dibuat",
      customer,
      201
    );


  } catch (error) {

    return errorResponse(
      "Gagal membuat customer"
    );

  }

}