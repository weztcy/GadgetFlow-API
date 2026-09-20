import { prisma } from "@/lib/prisma";
import {
  CreateWarehouseInput,
  UpdateWarehouseInput,
} from "@/validators/warehouse.schema";


// =======================
// CREATE WAREHOUSE
// =======================

export async function createWarehouse(
  data: CreateWarehouseInput
) {

  const existingWarehouse =
    await prisma.warehouse.findUnique({
      where: {
        code: data.code,
      },
    });


  if (existingWarehouse) {
    throw new Error(
      "Warehouse code already exists"
    );
  }


  return prisma.warehouse.create({
    data: {
      code: data.code,
      name: data.name,
      location: data.location,
    },
  });

}



// =======================
// GET ALL WAREHOUSE
// =======================

export async function getWarehouses() {

  return prisma.warehouse.findMany({

    orderBy: {
      createdAt: "desc",
    },

  });

}



// =======================
// GET DETAIL WAREHOUSE
// =======================

export async function getWarehouseById(
  id: number
) {

  const warehouse =
    await prisma.warehouse.findUnique({

      where: {
        id,
      },


      include: {

        inventories: {
          include: {
            product: true,
          },
        },

      },

    });



  if (!warehouse) {

    throw new Error(
      "Warehouse not found"
    );

  }


  return warehouse;

}



// =======================
// UPDATE WAREHOUSE
// =======================

export async function updateWarehouse(
  id: number,
  data: UpdateWarehouseInput
) {


  const warehouse =
    await prisma.warehouse.findUnique({

      where: {
        id,
      },

    });



  if (!warehouse) {

    throw new Error(
      "Warehouse not found"
    );

  }



  return prisma.warehouse.update({

    where: {
      id,
    },


    data,

  });


}



// =======================
// DEACTIVATE WAREHOUSE
// =======================

export async function deactivateWarehouse(
  id: number
) {


  const warehouse =
    await prisma.warehouse.findUnique({

      where: {
        id,
      },

    });



  if (!warehouse) {

    throw new Error(
      "Warehouse not found"
    );

  }



  return prisma.warehouse.update({

    where: {
      id,
    },


    data: {
      status: "INACTIVE",
    },

  });


}