import { NextRequest } from "next/server";

import {
  createStockMovement,
  getStockMovements,
} from "@/services/stock-movement.service";

import {
  createStockMovementSchema,
} from "@/validators/stock-movement.schema";

import {
  successResponse,
  errorResponse,
} from "@/lib/api-response";


// =======================
// GET ALL STOCK MOVEMENT
// =======================

export async function GET() {

  try {

    const movements =
      await getStockMovements();


    return successResponse(
      "Data pergerakan stok berhasil diambil",
      movements
    );


  } catch (error) {

    return errorResponse(
      "Gagal mengambil data pergerakan stok"
    );

  }

}



// =======================
// CREATE STOCK MOVEMENT
// =======================

export async function POST(
  request: NextRequest
) {

  try {

    const body =
      await request.json();


    const validated =
      createStockMovementSchema.parse(body);



    const movement =
      await createStockMovement(
        validated
      );


    return successResponse(
      "Pergerakan stok berhasil dibuat",
      movement,
      201
    );


  } catch (error) {

    return errorResponse(
      "Gagal membuat pergerakan stok"
    );

  }

}