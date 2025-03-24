-- DropForeignKey
ALTER TABLE `Workspace` DROP FOREIGN KEY `Workspace_adminId_fkey`;

-- AddForeignKey
ALTER TABLE `Workspace` ADD CONSTRAINT `Workspace_adminId_fkey` FOREIGN KEY (`adminId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
