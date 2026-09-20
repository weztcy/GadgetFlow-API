import { prisma } from "@/lib/prisma";

import { CreateStockMovementInput } from "@/validators/stock-movement.schema";

// =======================
// CREATE STOCK MOVEMENT
// =======================

export async function createStockMovement(data: CreateStockMovementInput) {
  return prisma.$transaction(async (tx) => {
    const inventory = await tx.inventory.findUnique({
      where: {
        productId_warehouseId: {
          productId: data.productId,

          warehouseId: data.warehouseId,
        },
      },
    });

    const beforeQuantity = inventory?.quantity ?? 0;

    let afterQuantity = beforeQuantity;

    switch (data.type) {
      case "PURCHASE":

      case "RETURN":
        afterQuantity = beforeQuantity + data.quantity;

        break;

      case "SALE":

      case "DAMAGE":
        afterQuantity = beforeQuantity - data.quantity;

        break;

      case "ADJUSTMENT":
        afterQuantity = data.quantity;

        break;

      case "TRANSFER":
        afterQuantity = beforeQuantity;

        break;
    }

    let updatedInventory;

    if (inventory) {
      updatedInventory = await tx.inventory.update({
        where: {
          id: inventory.id,
        },

        data: {
          quantity: afterQuantity,
        },
      });
    } else {
      updatedInventory = await tx.inventory.create({
        data: {
          productId: data.productId,

          warehouseId: data.warehouseId,

          quantity: afterQuantity,
        },
      });
    }

    const movement = await tx.stockMovement.create({
      data: {
        productId: data.productId,

        warehouseId: data.warehouseId,

        type: data.type,

        quantity: data.quantity,

        beforeQuantity,

        afterQuantity,

        reference: data.reference,

        note: data.note,
      },

      include: {
        product: true,

        warehouse: true,
      },
    });

    return {
      movement,

      inventory: updatedInventory,
    };
  });
}

// =======================
// GET ALL STOCK MOVEMENT
// =======================

export async function getStockMovements() {
  return prisma.stockMovement.findMany({
    include: {
      product: true,

      warehouse: true,
    },

    orderBy: {
      createdAt: "desc",
    },
  });
}

// =======================
// GET MOVEMENT BY PRODUCT
// =======================

export async function getMovementByProduct(productId: number) {
  return prisma.stockMovement.findMany({
    where: {
      productId,
    },

    include: {
      product: true,

      warehouse: true,
    },

    orderBy: {
      createdAt: "desc",
    },
  });
}
