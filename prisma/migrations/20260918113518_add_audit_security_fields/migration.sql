-- AlterTable
ALTER TABLE `auditlog` ADD COLUMN `ipAddress` VARCHAR(191) NULL,
    ADD COLUMN `userAgent` VARCHAR(191) NULL;

-- CreateIndex
CREATE INDEX `AuditLog_ipAddress_idx` ON `AuditLog`(`ipAddress`);
