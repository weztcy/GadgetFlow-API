import { prisma } from "@/lib/prisma";

import { ApiError } from "@/lib/api-error";

export async function createOrder(data: {
  customerName: string;

  items: {
    productId: number;

    quantity: number;
  }[];
}) {
  return prisma.$transaction(async (tx) => {
    let total = 0;

    const orderItems = [];

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

      const subtotal = product.price * item.quantity;

      total += subtotal;

      orderItems.push({
        productId: product.id,

        quantity: item.quantity,

        price: product.price,
      });
    }

    return tx.order.create({
      data: {
        customerName: data.customerName,

        total,

        items: {
          create: orderItems,
        },
      },

      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });
  });
}

export async function getOrders() {
  return prisma.order.findMany({
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },

    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getOrderById(id: number) {
  return prisma.order.findUnique({
    where: {
      id,
    },

    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  });
}

export async function deleteOrder(id: number) {
  return prisma.$transaction(async (tx) => {
    const order = await tx.order.findUnique({
      where: {
        id,
      },

      include: {
        items: true,
      },
    });

    if (!order) {
      throw new ApiError(
        "Order tidak ditemukan",

        404,

        "ORDER_NOT_FOUND",
      );
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

      include: {
        items: true,
      },
    });
  });
}
