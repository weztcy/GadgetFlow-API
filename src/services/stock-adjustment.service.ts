import { prisma } from "@/lib/prisma";

import { ApiError } from "@/lib/api-error";

import {
  CreateStockAdjustmentInput,
} from "@/validators/stock-adjustment.schema";



// =======================
// CREATE STOCK ADJUSTMENT
// =======================

export async function createStockAdjustment(
  data: CreateStockAdjustmentInput
) {

  return prisma.$transaction(async (tx) => {


    // =======================
    // CHECK PRODUCT
    // =======================

    const product =
      await tx.product.findFirst({

        where: {

          id:
            data.productId,

          deletedAt:
            null,

        },

      });



    if(!product){

      throw new ApiError(
        "Product tidak ditemukan",
        404,
        "PRODUCT_NOT_FOUND"
      );

    }





    // =======================
    // CHECK INVENTORY
    // =======================

    const inventory =
      await tx.inventory.findUnique({

        where: {

          productId_warehouseId: {

            productId:
              data.productId,


            warehouseId:
              data.warehouseId,

          },

        },

      });





    if(!inventory){

      throw new ApiError(
        "Inventory tidak ditemukan",
        404,
        "INVENTORY_NOT_FOUND"
      );

    }





    const beforeQuantity =
      inventory.quantity;



    const afterQuantity =
      beforeQuantity +
      data.quantity;





    // =======================
    // PREVENT NEGATIVE STOCK
    // =======================

    if(afterQuantity < 0){

      throw new ApiError(
        "Stok tidak boleh kurang dari 0",
        400,
        "INVALID_STOCK"
      );

    }





    // =======================
    // UPDATE INVENTORY
    // =======================

    const updatedInventory =
      await tx.inventory.update({

        where: {

          id:
            inventory.id,

        },


        data: {

          quantity:
            afterQuantity,

        },


      });







    // =======================
    // CREATE STOCK MOVEMENT
    // =======================

    await tx.stockMovement.create({

      data: {

        productId:
          data.productId,


        warehouseId:
          data.warehouseId,


        type:
          "ADJUSTMENT",


        quantity:
          data.quantity,


        beforeQuantity,


        afterQuantity,


        reference:
          `ADJUSTMENT-${inventory.id}`,


        note:
          data.note ??
          "Stock adjustment",

      },

    });






    return {

      inventory:
        updatedInventory,


      product,

    };


  });

}