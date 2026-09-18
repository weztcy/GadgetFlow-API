-- CreateIndex
CREATE INDEX `Product_deletedAt_idx` ON `Product`(`deletedAt`);

-- RenameIndex
ALTER TABLE `product` RENAME INDEX `Product_categoryId_fkey` TO `Product_categoryId_idx`;
