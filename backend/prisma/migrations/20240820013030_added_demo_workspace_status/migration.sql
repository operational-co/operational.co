-- AlterTable
ALTER TABLE `Workspace` MODIFY `status` ENUM('NORMAL', 'DEMO', 'HOLD', 'DEACTIVATED', 'DELETED') NOT NULL DEFAULT 'NORMAL';
