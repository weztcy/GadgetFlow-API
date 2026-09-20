/*
  Warnings:

  - You are about to drop the column `customerName` on the `order` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `Order_customerName_idx` ON `order`;

-- AlterTable
ALTER TABLE `order` DROP COLUMN `customerName`,
    ADD COLUMN `customerId` INTEGER NULL;

-- CreateTable
CREATE TABLE `Customer` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `address` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL,

    UNIQUE INDEX `Customer_email_key`(`email`),
    INDEX `Customer_name_idx`(`name`),
    INDEX `Customer_phone_idx`(`phone`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `Order_customerId_idx` ON `Order`(`customerId`);

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `Customer`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
