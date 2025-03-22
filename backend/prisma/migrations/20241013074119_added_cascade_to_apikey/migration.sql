-- DropForeignKey
ALTER TABLE `Apikey` DROP FOREIGN KEY `Apikey_workspaceId_fkey`;

-- AddForeignKey
ALTER TABLE `Apikey` ADD CONSTRAINT `Apikey_workspaceId_fkey` FOREIGN KEY (`workspaceId`) REFERENCES `Workspace`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
