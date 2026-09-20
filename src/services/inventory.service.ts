import { prisma } from "@/lib/prisma";

import {
  CreateInventoryInput,
  UpdateInventoryInput,
} from "@/validators/inventory.schema";

import { ApiError } from "@/lib/api-error";


// =======================
// CREATE INVENTORY
// =======================

export async function createInventory(
  data: CreateInventoryInput
) {

  const existing =
    await prisma.inventory.findUnique({

      where:{
        productId_warehouseId:{
          productId:data.productId,
          warehouseId:data.warehouseId,
        }
      }

    });



  if(existing){

    throw new ApiError(
      "Inventory sudah tersedia",
      400,
      "INVENTORY_EXISTS"
    );

  }



  return prisma.inventory.create({

    data:{
      productId:data.productId,
      warehouseId:data.warehouseId,
      quantity:data.quantity,
    },


    include:{
      product:true,
      warehouse:true,
    }

  });

}



// =======================
// GET ALL INVENTORY
// =======================

export async function getInventories(){

  return prisma.inventory.findMany({

    include:{
      product:true,
      warehouse:true,
    },


    orderBy:{
      updatedAt:"desc"
    }

  });

}



// =======================
// GET INVENTORY BY ID
// =======================

export async function getInventoryById(
  id:number
){

  const inventory =
    await prisma.inventory.findUnique({

      where:{
        id
      },


      include:{
        product:true,
        warehouse:true,
      }

    });



  if(!inventory){

    throw new ApiError(
      "Inventory tidak ditemukan",
      404,
      "INVENTORY_NOT_FOUND"
    );

  }



  return inventory;

}



// =======================
// GET BY PRODUCT
// =======================

export async function getInventoryByProduct(
  productId:number
){

  return prisma.inventory.findMany({

    where:{
      productId
    },


    include:{
      product:true,
      warehouse:true,
    },


    orderBy:{
      quantity:"desc"
    }

  });

}



// =======================
// GET BY WAREHOUSE
// =======================

export async function getInventoryByWarehouse(
  warehouseId:number
){

  return prisma.inventory.findMany({

    where:{
      warehouseId
    },


    include:{
      product:true,
      warehouse:true,
    },


    orderBy:{
      product:{
        name:"asc"
      }
    }

  });

}



// =======================
// LOW STOCK
// =======================

export async function getLowStock(
  limit:number = 5
){

  return prisma.inventory.findMany({

    where:{
      quantity:{
        lte:limit
      }
    },


    include:{
      product:true,
      warehouse:true,
    },


    orderBy:{
      quantity:"asc"
    }

  });

}



// =======================
// UPDATE INVENTORY
// =======================

export async function updateInventory(
  id:number,
  data:UpdateInventoryInput
){

  return prisma.$transaction(

    async(tx)=>{


      const inventory =
        await tx.inventory.findUnique({

          where:{
            id
          }

        });



      if(!inventory){

        throw new ApiError(
          "Inventory tidak ditemukan",
          404,
          "INVENTORY_NOT_FOUND"
        );

      }



      const updated =
        await tx.inventory.update({

          where:{
            id
          },


          data:{
            quantity:data.quantity
          },


          include:{
            product:true,
            warehouse:true,
          }

        });



      await tx.stockMovement.create({

        data:{

          productId:
            inventory.productId,


          warehouseId:
            inventory.warehouseId,


          type:"ADJUSTMENT",


          quantity:
            data.quantity - inventory.quantity,


          beforeQuantity:
            inventory.quantity,


          afterQuantity:
            data.quantity,


          note:
            "Manual adjustment inventory"

        }

      });



      return updated;


    }

  );

}