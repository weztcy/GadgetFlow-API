import { prisma } from "@/lib/prisma";

import {
  CreateCustomerInput,
  UpdateCustomerInput,
} from "@/validators/customer.schema";

// =======================
// CREATE CUSTOMER
// =======================

export async function createCustomer(data: CreateCustomerInput) {
  return prisma.customer.create({
    data: {
      name: data.name,

      phone: data.phone,

      email: data.email,

      address: data.address,
    },
  });
}

// =======================
// GET ALL CUSTOMER
// =======================

export async function getCustomers() {
  return prisma.customer.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
}

// =======================
// GET CUSTOMER BY ID
// =======================

export async function getCustomerById(id: number) {
  return prisma.customer.findUnique({
    where: {
      id,
    },

    include: {
      orders: {
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      },
    },
  });
}

// =======================
// UPDATE CUSTOMER
// =======================

export async function updateCustomer(id: number, data: UpdateCustomerInput) {
  return prisma.customer.update({
    where: {
      id,
    },

    data,
  });
}

// =======================
// GET CUSTOMER ORDERS
// =======================

export async function getCustomerOrders(customerId: number) {
  return prisma.order.findMany({
    where: {
      customerId,
    },

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
