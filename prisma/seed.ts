import { prisma } from "../src/lib/prisma";

import bcrypt from "bcrypt";

async function main() {
  console.log("Seeding database...");

  // ============================
  // CLEAN TEST DATA
  // ============================

  await prisma.serialNumber.deleteMany({
    where: {
      serialNumber: {
        startsWith: "TEST-",
      },
    },
  });

  await prisma.inventory.deleteMany();

  await prisma.stockMovement.deleteMany();

  await prisma.purchaseItem.deleteMany();

  await prisma.purchase.deleteMany();

  await prisma.orderItem.deleteMany();

  await prisma.order.deleteMany();

  await prisma.product.deleteMany({
    where: {
      name: {
        startsWith: "TEST",
      },
    },
  });

  await prisma.category.deleteMany({
    where: {
      name: {
        startsWith: "TEST",
      },
    },
  });

  await prisma.warehouse.deleteMany({
    where: {
      code: {
        startsWith: "TEST",
      },
    },
  });

  await prisma.customer.deleteMany({
    where: {
      email: {
        endsWith: "@gadgetflow.test",
      },
    },
  });

  await prisma.supplier.deleteMany({
    where: {
      email: {
        endsWith: "@gadgetflow.test",
      },
    },
  });

  await prisma.user.deleteMany({
    where: {
      email: {
        endsWith: "@gadgetflow.test",
      },
    },
  });

  // ============================
  // USER
  // ============================

  const password = await bcrypt.hash("password123", 10);

  const admin = await prisma.user.create({
    data: {
      name: "TEST Admin",

      email: "admin@gadgetflow.test",

      password,

      role: "ADMIN",
    },
  });

  const user = await prisma.user.create({
    data: {
      name: "TEST User",

      email: "user@gadgetflow.test",

      password,

      role: "USER",
    },
  });

  // ============================
  // CATEGORY
  // ============================

  const smartphone = await prisma.category.create({
    data: {
      name: "TEST Smartphone",
    },
  });

  const accessories = await prisma.category.create({
    data: {
      name: "TEST Accessories",
    },
  });

  // ============================
  // WAREHOUSE
  // ============================

  const jakarta = await prisma.warehouse.create({
    data: {
      code: "TEST-WH-JKT",

      name: "TEST Warehouse Jakarta",

      location: "Jakarta",

      status: "ACTIVE",
    },
  });

  const semarang = await prisma.warehouse.create({
    data: {
      code: "TEST-WH-SMG",

      name: "TEST Warehouse Semarang",

      location: "Semarang",

      status: "ACTIVE",
    },
  });

  // ============================
  // PRODUCT
  // ============================

  const iphone = await prisma.product.create({
    data: {
      sku: "TEST-IP15-001",

      name: "TEST iPhone 15",

      costPrice: 12000000,

      price: 15000000,

      categoryId: smartphone.id,
    },
  });

  const samsung = await prisma.product.create({
    data: {
      sku: "TEST-S23-001",

      name: "TEST Samsung S23",

      costPrice: 8000000,

      price: 10000000,

      categoryId: smartphone.id,
    },
  });

  const charger = await prisma.product.create({
    data: {
      sku: "TEST-CHR-001",

      name: "TEST Fast Charger",

      costPrice: 150000,

      price: 300000,

      categoryId: accessories.id,
    },
  });

  // ============================
  // INVENTORY
  // ============================

  await prisma.inventory.createMany({
    data: [
      {
        productId: iphone.id,

        warehouseId: jakarta.id,

        quantity: 10,
      },

      {
        productId: samsung.id,

        warehouseId: jakarta.id,

        quantity: 15,
      },

      {
        productId: charger.id,

        warehouseId: semarang.id,

        quantity: 50,
      },
    ],
  });

  // ============================
  // SERIAL NUMBER
  // ============================

  await prisma.serialNumber.createMany({
    data: [
      {
        productId: iphone.id,

        warehouseId: jakarta.id,

        serialNumber: "TEST-IMEI-IP15-001",

        status: "AVAILABLE",
      },

      {
        productId: iphone.id,

        warehouseId: jakarta.id,

        serialNumber: "TEST-IMEI-IP15-002",

        status: "AVAILABLE",
      },
    ],
  });

  // ============================
  // SUPPLIER
  // ============================

  await prisma.supplier.create({
    data: {
      name: "TEST Supplier Smartphone",

      email: "supplier@gadgetflow.test",

      phone: "081234567890",
    },
  });

  // ============================
  // CUSTOMER
  // ============================

  await prisma.customer.create({
    data: {
      name: "TEST Customer",

      email: "customer@gadgetflow.test",

      phone: "089876543210",
    },
  });

  console.log(
    `
    Seed berhasil

    ADMIN:
    email: admin@gadgetflow.test
    password: password123


    USER:
    email: user@gadgetflow.test
    password: password123


    TEST PRODUCT:
    iPhone ID:
    ${iphone.id}

    Samsung ID:
    ${samsung.id}


    TEST WAREHOUSE:
    Jakarta ID:
    ${jakarta.id}

    Semarang ID:
    ${semarang.id}


    TEST SERIAL:
    TEST-IMEI-IP15-001
    TEST-IMEI-IP15-002
    `,
  );
}

main()
  .catch((error) => {
    console.error(error);

    process.exit(1);
  })

  .finally(async () => {
    await prisma.$disconnect();
  });
