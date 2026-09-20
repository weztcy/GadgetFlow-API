import { NextRequest } from "next/server";

import {
  getCustomerOrders,
} from "@/services/customer.service";

import {
  successResponse,
  errorResponse,
} from "@/lib/api-response";


// =======================
// GET CUSTOMER ORDERS
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


    const orders =
      await getCustomerOrders(
        Number(id)
      );


    return successResponse(
      "Riwayat transaksi customer berhasil diambil",
      orders
    );


  } catch (error) {

    return errorResponse(
      "Gagal mengambil riwayat transaksi customer"
    );

  }

}