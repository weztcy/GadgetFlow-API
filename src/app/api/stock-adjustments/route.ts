import { NextRequest } from "next/server";

import {
  successResponse,
  errorResponse,
} from "@/lib/api-response";

import {
  createStockAdjustment,
} from "@/services/stock-adjustment.service";

import {
  createStockAdjustmentSchema,
} from "@/validators/stock-adjustment.schema";

import {
  authenticate,
} from "@/middleware/auth.middleware";

import {
  requireRole,
} from "@/middleware/role.middleware";

import {
  ApiError,
} from "@/lib/api-error";

import {
  createAuditLog,
} from "@/services/audit.service";



// =======================
// CREATE STOCK ADJUSTMENT
// =======================

export async function POST(
  request: NextRequest
) {

  try {


    const payload =
      authenticate(request);



    if(!payload){

      throw new ApiError(
        "Unauthorized",
        401,
        "UNAUTHORIZED"
      );

    }



    requireRole(
      payload,
      ["ADMIN"]
    );





    const body =
      await request.json();





    const validation =
      createStockAdjustmentSchema.safeParse(
        body
      );





    if(!validation.success){


      return errorResponse(
        "Data stock adjustment tidak valid",
        400,
        "VALIDATION_ERROR",
        validation.error.format()
      );

    }






    const adjustment =
      await createStockAdjustment(
        validation.data
      );






    await createAuditLog({

      userId:
        payload.id,


      action:
        "CREATE",


      entity:
        "StockAdjustment",


      entityId:
        adjustment.inventory.id,



      newData:{

        productId:
          adjustment.inventory.productId,


        warehouseId:
          adjustment.inventory.warehouseId,


        quantity:
          adjustment.inventory.quantity,


        note:
          validation.data.note ?? null,

      },



      ipAddress:
        request.headers.get(
          "x-forwarded-for"
        ) ?? undefined,



      userAgent:
        request.headers.get(
          "user-agent"
        ) ?? undefined,

    });






    return successResponse(

      "Stock adjustment berhasil dibuat",

      adjustment,

      201

    );



  } catch(error){


    return errorResponse(
      "Gagal membuat stock adjustment"
    );


  }

}