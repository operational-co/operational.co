-- AlterTable
ALTER TABLE `Invoice` MODIFY `status` ENUM('OPEN', 'PAID', 'VOID') NOT NULL DEFAULT 'OPEN';
