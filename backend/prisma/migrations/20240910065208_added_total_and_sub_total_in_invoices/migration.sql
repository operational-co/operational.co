-- AlterTable
ALTER TABLE `Invoice` ADD COLUMN `lineItems` JSON NULL,
    ADD COLUMN `subTotal` DECIMAL(10, 2) NULL,
    ADD COLUMN `total` DECIMAL(10, 2) NULL;
