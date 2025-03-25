-- DropForeignKey
ALTER TABLE `Category` DROP FOREIGN KEY `Category_workspaceId_fkey`;

-- DropIndex
DROP INDEX `Category_workspaceId_fkey` ON `Category`;

-- AddForeignKey
ALTER TABLE `Category` ADD CONSTRAINT `Category_workspaceId_fkey` FOREIGN KEY (`workspaceId`) REFERENCES `Workspace`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
