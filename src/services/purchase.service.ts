import { prisma } from "@/lib/prisma";

import { ApiError } from "@/lib/api-error";

import { CreatePurchaseInput } from "@/validators/purchase.schema";

// =======================
// CREATE PURCHASE
// =======================

export async function createPurchase(data: CreatePurchaseInput) {
  return prisma.$transaction(async (tx) => {
    let total = 0;

    const purchaseItems = [];

    // =======================
    // VALIDATE PRODUCT
    // =======================

    for (const item of data.items) {
      const product = await tx.product.findFirst({
        where: {
          id: item.productId,

          deletedAt: null,
        },
      });

      if (!product) {
        throw new ApiError(
          `Product ${item.productId} tidak ditemukan`,
          404,
          "PRODUCT_NOT_FOUND",
        );
      }

      total += item.price * item.quantity;

      purchaseItems.push({
        productId: item.productId,

        warehouseId: item.warehouseId,

        quantity: item.quantity,

        price: item.price,
      });
    }

    // =======================
    // CREATE PURCHASE
    // =======================

    const purchase = await tx.purchase.create({
      data: {
        supplierId: data.supplierId,

        total,

        items: {
          create: purchaseItems,
        },
      },
    });

    // =======================
    // UPDATE INVENTORY
    // =======================

    for (const item of data.items) {
      const inventory = await tx.inventory.findUnique({
        where: {
          productId_warehouseId: {
            productId: item.productId,

            warehouseId: item.warehouseId,
          },
        },
      });

      const beforeQuantity = inventory?.quantity ?? 0;

      const afterQuantity = beforeQuantity + item.quantity;

      if (inventory) {
        await tx.inventory.update({
          where: {
            id: inventory.id,
          },

          data: {
            quantity: afterQuantity,
          },
        });
      } else {
        await tx.inventory.create({
          data: {
            productId: item.productId,

            warehouseId: item.warehouseId,

            quantity: item.quantity,
          },
        });
      }

      // =======================
      // STOCK MOVEMENT
      // =======================

      await tx.stockMovement.create({
        data: {
          productId: item.productId,

          warehouseId: item.warehouseId,

          type: "PURCHASE",

          quantity: item.quantity,

          beforeQuantity,

          afterQuantity,

          reference: `PURCHASE-${purchase.id}`,

          note: "Barang masuk",
        },
      });

      // =======================
      // CREATE SERIAL NUMBER
      // =======================

      if (item.serialNumbers) {
        if (item.serialNumbers.length !== item.quantity) {
          throw new ApiError(
            "Jumlah IMEI harus sama dengan quantity",
            400,
            "SERIAL_QUANTITY_MISMATCH",
          );
        }

        for (const serialNumber of item.serialNumbers) {
          const existing = await tx.serialNumber.findUnique({
            where: {
              serialNumber,
            },
          });

          if (existing) {
            throw new ApiError(
              `IMEI ${serialNumber} sudah terdaftar`,
              400,
              "SERIAL_EXISTS",
            );
          }

          await tx.serialNumber.create({
            data: {
              productId: item.productId,

              warehouseId: item.warehouseId,

              serialNumber,

              status: "AVAILABLE",
            },
          });
        }
      }
    }

    return tx.purchase.findUnique({
      where: {
        id: purchase.id,
      },

      include: {
        supplier: true,

        items: {
          include: {
            product: true,

            warehouse: true,
          },
        },
      },
    });
  });
}

// =======================
// GET ALL PURCHASE
// =======================

export async function getPurchases() {
  return prisma.purchase.findMany({
    include: {
      supplier: true,

      items: {
        include: {
          product: true,

          warehouse: true,
        },
      },
    },

    orderBy: {
      createdAt: "desc",
    },
  });
}

// =======================
// GET PURCHASE BY ID
// =======================

export async function getPurchaseById(id: number) {
  const purchase = await prisma.purchase.findUnique({
    where: {
      id,
    },

    include: {
      supplier: true,

      items: {
        include: {
          product: true,

          warehouse: true,
        },
      },
    },
  });

  if (!purchase) {
    throw new ApiError("Purchase tidak ditemukan", 404, "PURCHASE_NOT_FOUND");
  }

  return purchase;
}

// =======================
// CANCEL PURCHASE
// =======================

export async function cancelPurchase(id: number) {
  return prisma.$transaction(async (tx) => {
    const purchase = await tx.purchase.findUnique({
      where: {
        id,
      },

      include: {
        items: true,
      },
    });

    if (!purchase) {
      throw new ApiError("Purchase tidak ditemukan", 404, "PURCHASE_NOT_FOUND");
    }

    for (const item of purchase.items) {
      const inventory = await tx.inventory.findUnique({
        where: {
          productId_warehouseId: {
            productId: item.productId,

            warehouseId: item.warehouseId,
          },
        },
      });

      if (inventory) {
        const afterQuantity = inventory.quantity - item.quantity;

        await tx.inventory.update({
          where: {
            id: inventory.id,
          },

          data: {
            quantity: afterQuantity,
          },
        });

        await tx.stockMovement.create({
          data: {
            productId: item.productId,

            warehouseId: item.warehouseId,

            type: "ADJUSTMENT",

            quantity: item.quantity,

            beforeQuantity: inventory.quantity,

            afterQuantity,

            reference: `CANCEL-PURCHASE-${id}`,

            note: "Pembatalan purchase",
          },
        });
      }
    }

    // hapus IMEI yang belum terjual

    await tx.serialNumber.deleteMany({
      where: {
        status: "AVAILABLE",

        productId: {
          in: purchase.items.map((item) => item.productId),
        },

        warehouseId: {
          in: purchase.items.map((item) => item.warehouseId),
        },
      },
    });

    await tx.purchaseItem.deleteMany({
      where: {
        purchaseId: id,
      },
    });

    return tx.purchase.delete({
      where: {
        id,
      },
    });
  });
}
