import { NextRequest } from "next/server";

import {
  getMovementByProduct,
} from "@/services/stock-movement.service";

import {
  successResponse,
  errorResponse,
} from "@/lib/api-response";


// =======================
// GET MOVEMENT BY PRODUCT
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


    const movements =
      await getMovementByProduct(
        Number(id)
      );


    return successResponse(
      "Riwayat pergerakan stok produk berhasil diambil",
      movements
    );


  } catch (error) {

    return errorResponse(
      "Gagal mengambil riwayat pergerakan stok produk"
    );

  }

}