-- AlterTable
ALTER TABLE `Widget` ADD COLUMN `workspaceId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Widget` ADD CONSTRAINT `Widget_workspaceId_fkey` FOREIGN KEY (`workspaceId`) REFERENCES `Workspace`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
