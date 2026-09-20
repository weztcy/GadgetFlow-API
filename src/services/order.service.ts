import { prisma } from "@/lib/prisma";

import { ApiError } from "@/lib/api-error";

// =======================
// CREATE ORDER
// =======================

export async function createOrder(data: {
  customerId?: number;

  items: {
    productId: number;

    warehouseId: number;

    quantity: number;

    serialNumberIds?: number[];
  }[];
}) {
  return prisma.$transaction(async (tx) => {
    let total = 0;

    const orderItems = [];

    // =======================
    // VALIDATE CUSTOMER
    // =======================

    if (data.customerId) {
      const customer = await tx.customer.findUnique({
        where: {
          id: data.customerId,
        },
      });

      if (!customer) {
        throw new ApiError(
          "Customer tidak ditemukan",
          404,
          "CUSTOMER_NOT_FOUND",
        );
      }
    }

    // =======================
    // CHECK PRODUCT
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
          `Product dengan id ${item.productId} tidak ditemukan`,
          404,
          "PRODUCT_NOT_FOUND",
        );
      }

      total += product.price * item.quantity;

      orderItems.push({
        productId: product.id,

        quantity: item.quantity,

        price: product.price,
      });
    }

    // =======================
    // CREATE ORDER
    // =======================

    const order = await tx.order.create({
      data: {
        customerId: data.customerId,

        total,

        items: {
          create: orderItems,
        },
      },
    });

    // =======================
    // UPDATE STOCK
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

      if (!inventory || inventory.quantity < item.quantity) {
        throw new ApiError("Stok tidak mencukupi", 400, "INSUFFICIENT_STOCK");
      }

      const afterQuantity = inventory.quantity - item.quantity;

      await tx.inventory.update({
        where: {
          id: inventory.id,
        },

        data: {
          quantity: afterQuantity,
        },
      });

      // =======================
      // STOCK MOVEMENT SALE
      // =======================

      await tx.stockMovement.create({
        data: {
          productId: item.productId,

          warehouseId: item.warehouseId,

          type: "SALE",

          quantity: item.quantity,

          beforeQuantity: inventory.quantity,

          afterQuantity,

          reference: `ORDER-${order.id}`,

          note: "Penjualan order",
        },
      });

      // =======================
      // UPDATE SERIAL NUMBER
      // =======================

      if (item.serialNumberIds) {
        if (item.serialNumberIds.length !== item.quantity) {
          throw new ApiError(
            "Jumlah serial number harus sama dengan quantity",
            400,
            "SERIAL_QUANTITY_MISMATCH",
          );
        }

        for (const serialId of item.serialNumberIds) {
          const serial = await tx.serialNumber.findUnique({
            where: {
              id: serialId,
            },
          });

          if (!serial) {
            throw new ApiError(
              "Serial number tidak ditemukan",
              404,
              "SERIAL_NOT_FOUND",
            );
          }

          if (
            serial.productId !== item.productId ||
            serial.warehouseId !== item.warehouseId
          ) {
            throw new ApiError(
              "Serial number tidak sesuai product atau warehouse",
              400,
              "SERIAL_INVALID",
            );
          }

          if (serial.status !== "AVAILABLE") {
            throw new ApiError(
              "Serial number tidak tersedia",
              400,
              "SERIAL_NOT_AVAILABLE",
            );
          }

          await tx.serialNumber.update({
            where: {
              id: serialId,
            },

            data: {
              status: "SOLD",

              orderId: order.id,

              soldAt: new Date(),
            },
          });
        }
      }
    }

    return tx.order.findUnique({
      where: {
        id: order.id,
      },

      include: {
        customer: true,

        items: {
          include: {
            product: true,
          },
        },

        serialNumbers: true,
      },
    });
  });
}

// =======================
// GET ALL ORDER
// =======================

export async function getOrders() {
  return prisma.order.findMany({
    include: {
      customer: true,

      items: {
        include: {
          product: true,
        },
      },

      serialNumbers: true,
    },

    orderBy: {
      createdAt: "desc",
    },
  });
}

// =======================
// GET ORDER BY ID
// =======================

export async function getOrderById(id: number) {
  return prisma.order.findUnique({
    where: {
      id,
    },

    include: {
      customer: true,

      items: {
        include: {
          product: true,
        },
      },

      serialNumbers: true,
    },
  });
}

// =======================
// DELETE ORDER
// =======================

export async function deleteOrder(id: number) {
  return prisma.$transaction(async (tx) => {
    const order = await tx.order.findUnique({
      where: {
        id,
      },
    });

    if (!order) {
      throw new ApiError("Order tidak ditemukan", 404, "ORDER_NOT_FOUND");
    }

    await tx.orderItem.deleteMany({
      where: {
        orderId: id,
      },
    });

    return tx.order.delete({
      where: {
        id,
      },
    });
  });
}
