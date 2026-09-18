-- CreateIndex
CREATE INDEX `AuditLog_userId_idx` ON `AuditLog`(`userId`);

-- CreateIndex
CREATE INDEX `AuditLog_entity_idx` ON `AuditLog`(`entity`);

-- CreateIndex
CREATE INDEX `AuditLog_entityId_idx` ON `AuditLog`(`entityId`);

-- CreateIndex
CREATE INDEX `AuditLog_action_idx` ON `AuditLog`(`action`);

-- CreateIndex
CREATE INDEX `AuditLog_createdAt_idx` ON `AuditLog`(`createdAt`);

-- CreateIndex
CREATE INDEX `Category_name_idx` ON `Category`(`name`);

-- CreateIndex
CREATE INDEX `Order_createdAt_idx` ON `Order`(`createdAt`);

-- CreateIndex
CREATE INDEX `Order_customerName_idx` ON `Order`(`customerName`);

-- CreateIndex
CREATE INDEX `Product_name_idx` ON `Product`(`name`);

-- CreateIndex
CREATE INDEX `User_role_idx` ON `User`(`role`);

-- RenameIndex
ALTER TABLE `orderitem` RENAME INDEX `OrderItem_orderId_fkey` TO `OrderItem_orderId_idx`;

-- RenameIndex
ALTER TABLE `orderitem` RENAME INDEX `OrderItem_productId_fkey` TO `OrderItem_productId_idx`;
